"use server"

import { auth } from "@/auth"
import { isUserSubscribed } from "@/hooks/is-subscribed"
import { CourseModule } from "@/types/types"
import { createOpenAI } from "@ai-sdk/openai"
import { db } from "@kouza/db"
import { generateObject } from "ai"
import { z } from "zod"

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  compatibility: "strict",
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

const freeModulePrompt = (moduleTitle: string) =>
  `Create strictly up to 3 lessons for the module "${moduleTitle}". Keep descriptions brief. Slug should be shortened version of lesson title in lowercase.`
const subscribedModulePrompt = (moduleTitle: string) =>
  `Create as many lessons as possible for the module "${moduleTitle}". Keep descriptions brief. Slug should be shortened version of lesson title in lowercase.`

export async function newLessons(module: CourseModule) {
  const session = await auth()
  const userId = session?.user?.id

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

    const lessonsResult = await generateObject({
      model: openai("gpt-4o-mini", { structuredOutputs: true }),
      schemaName: "moduleLessons",
      schema: moduleLessonsSchema,
      prompt: userSubscribed
        ? subscribedModulePrompt(module.title)
        : freeModulePrompt(module.title),
    })

    if (!lessonsResult?.object?.lessons) {
      throw new Error(`Failed to generate lessons for module ${module.title}`)
    }

    const lessons = lessonsResult.object.lessons
    if (!lessons.length)
      throw new Error(`No lessons generated for ${module.title}`)

    const contentPromises = lessons.map((lesson) =>
      generateObject({
        model: openai("gpt-4o-mini", { structuredOutputs: true }),
        schema: lessonContentSchema,
        prompt: userSubscribed
          ? subscribedModulePrompt(lesson.title)
          : freeModulePrompt(lesson.title),
      }).then((result) => ({
        moduleId: module.id,
        title: lesson.title,
        slug: `${lesson.slug}-${userId}-${Math.random().toString(36).slice(2, 5)}`,
        content: result.object.content,
        quiz: result.object.quiz,
        order: lesson.order,
      }))
    )

    const lessonData = await Promise.all(contentPromises)
    await db.lesson.createMany({
      data: lessonData,
      skipDuplicates: true,
    })

    await db.module.update({
      where: { id: module.id },
      data: { lessons: { connect: lessonData.map((l) => ({ slug: l.slug })) } },
    })

    // const dbLessons = []
    // for (
    //   let lessonIndex = 0;
    //   lessonIndex < lessonsResult.object.lessons.length;
    //   lessonIndex++
    // ) {
    //   const lesson = lessonsResult.object.lessons[lessonIndex]

    //   let randomString = Math.random().toString(36).substring(2, 5)
    //   let uniqueSlug = `${lesson?.slug}-${userId}-${randomString}`

    //   const contentResult = await generateObject({
    //     model: openai("gpt-4o-mini", { structuredOutputs: true }),
    //     schemaName: "lessonContent",
    //     schema: lessonContentSchema,
    //     prompt: `Create detailed educational content for lesson "${lesson?.title}".
    //       The content should be at least 2000 words and focus purely on teaching the material.
    //       DO NOT include any quiz questions, exercises, or test material in the content section.
    //       The quiz section will be handled separately in the quiz object.
    //       After generating the main content, create a separate comprehensive quiz with multiple questions to test understanding.
    //       Each quiz question must have exactly 4 options.`,
    //   })

    //   try {
    //     const courseLesson = await db.lesson.create({
    //       data: {
    //         moduleId: module.id,
    //         title: lesson?.title || "",
    //         slug: uniqueSlug,
    //         content:
    //           contentResult?.object?.content || "Content generation failed",
    //         media: contentResult?.object?.media || [],
    //         order: lessonIndex,
    //         quiz: contentResult?.object?.quiz || { questions: [] },
    //       },
    //     })
    //     dbLessons.push(courseLesson)
    //   } catch (error: any) {
    //     console.error(
    //       `Error creating lesson "${lesson?.title}":`,
    //       error.message
    //     )
    //   }
    // }

    // await db.module.update({
    //   where: { id: module.id },
    //   data: {
    //     lessons: {
    //       connect: dbLessons.map((lesson: Lesson) => ({
    //         id: lesson.id,
    //       })),
    //     },
    //   },
    // })

    return {
      message: "Lessons created",
    }
  } catch (error) {
    throw new Error(`Failed to generate course: ${(error as Error).message}`)
  }
}
