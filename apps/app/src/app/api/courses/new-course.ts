"use server"

import { auth } from "@/auth"
import { isUserSubscribed } from "@/hooks/is-subscribed"
import { CourseModule, Lesson } from "@/types/types"
import { createOpenAI } from "@ai-sdk/openai"
import { db } from "@kouza/db"
import { generateObject } from "ai"
import { z } from "zod"
import { tasks, idempotencyKeys } from "@trigger.dev/sdk/v3"
import type { createLessonsTask } from "@/trigger/lesson-creation"

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  compatibility: "strict",
})

const courseSchema = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  modules: z.array(
    z.object({
      title: z.string(),
      slug: z.string(),
      description: z.string(),
      order: z.number(),
    })
  ),
})

const moduleLessonsSchema = z.object({
  lessons: z.array(
    z.object({
      title: z.string(),
      slug: z.string(),
      description: z.string(),
      order: z.number(),
    })
  ),
})

const lessonContentSchema = z.object({
  content: z.string(),
  media: z.array(
    z.object({
      type: z.string(),
      url: z.string(),
      caption: z.string(),
    })
  ),
  quiz: z.object({
    questions: z.array(
      z.object({
        question: z.string(),
        options: z.array(z.string()),
        correctAnswer: z.number(),
      })
    ),
  }),
})

type PrismaError = {
  code: string
  message: string
}

const freePrompt = (prompt: string) =>
  `Create a concise course outline based on: ${prompt}. Include up to 5 modules. Slug should be shortened version of title in lowercase. Module slugs should be shortened version of module title in lowercase.`
const subscribedPrompt = (prompt: string) =>
  `Create a concise course outline based on: ${prompt}. Include as many modules as possible. Slug should be shortened version of title in lowercase. Module slugs should be shortened version of module title in lowercase.`

const freeModulePrompt = (moduleTitle: string) =>
  `Create strictly up to 3 lessons for the module "${moduleTitle}". Keep descriptions brief. Slug should be shortened version of lesson title in lowercase.`
const subscribedModulePrompt = (moduleTitle: string) =>
  `Create as many lessons as possible for the module "${moduleTitle}". Keep descriptions brief. Slug should be shortened version of lesson title in lowercase.`

export async function newCourse(prompt: string, userId: string) {
  if (!userId) {
    throw new Error("User not found")
  }

  try {
    const userSubscribed = await isUserSubscribed(Number(userId))

    const subscription = await db.subscription.findFirst({
      where: {
        userId: Number(userId),
        OR: [
          {
            status: "ACTIVE",
            currentPeriodEnd: {
              gt: new Date(),
            },
          },
          {
            status: "CANCELED",
            currentPeriodEnd: {
              gt: new Date(),
            },
          },
        ],
      },
      orderBy: {
        currentPeriodStart: "desc",
      },
    })

    if (!userSubscribed) {
      const courses = await db.course.findMany({
        where: {
          generatedBy: Number(userId),
        },
      })

      if (courses.length >= 3) {
        throw new Error(
          "You have reached the maximum number of free courses. Subscribe to generate up to 10 full length courses per month!"
        )
      }
    } else {
      const coursesThisMonth = await db.course.findMany({
        where: {
          generatedBy: Number(userId),
          type: "FULL",
          createdAt: {
            gte:
              subscription?.currentPeriodStart ??
              new Date(new Date().setMonth(new Date().getMonth() - 1)),
          },
        },
      })

      if (coursesThisMonth.length >= 10) {
        throw new Error(
          "You have reached the maximum number of courses available this month."
        )
      }
    }

    const courseResult = await generateObject({
      model: openai("gpt-4o-mini", { structuredOutputs: true }),
      schemaName: "course",
      schema: courseSchema,
      prompt: userSubscribed ? subscribedPrompt(prompt) : freePrompt(prompt),
    })

    if (!courseResult?.object) {
      throw new Error("Failed to generate course structure")
    }

    const course = courseResult.object

    const newCourse = await db.course.create({
      data: {
        prompt,
        type: userSubscribed ? "FULL" : "FREE",
        title: course.title,
        slug: course.slug + "-" + userId,
        description: course.description,
        generatedBy: Number(userId),
      },
    })

    await db.module.createMany({
      data: course.modules.map((module, index) => ({
        courseId: newCourse.id,
        title: module.title,
        slug: `${module.slug}-${userId}-${index}`,
        description: module.description,
        order: index,
      })),
    })

    const courseModules = await db.module.findMany({
      where: { courseId: newCourse.id },
      orderBy: { order: "asc" },
    })

    const modulesWithLessons = await Promise.all(
      courseModules.map(
        async (courseModule: CourseModule, moduleIndex: number) => {
          try {
            // Create an idempotency key for this specific module and user
            const idempotencyKey = await idempotencyKeys.create([
              `course-creation-module-${courseModule.id}`,
              `user-${userId}`,
            ])

            // Trigger the background job for lesson creation
            await tasks.trigger<typeof createLessonsTask>(
              "create-lessons",
              {
                module: courseModule,
                isSubscribed: userSubscribed,
                userId,
              },
              {
                idempotencyKey,
              }
            )

            // Return the module without waiting for lessons to be created
            // The background job will create and link the lessons
            return { ...courseModule, lessons: [] }
          } catch (error) {
            console.error(
              `Error triggering lesson creation for module "${courseModule.title}":`,
              error
            )
            return { ...courseModule, lessons: [] }
          }
        }
      )
    )

    return {
      prompt,
      title: course.title,
      description: course.description,
      modules: modulesWithLessons,
      message: "Course created",
    }
  } catch (error) {
    throw new Error(`Failed to generate course: ${(error as Error).message}`)
  }
}
