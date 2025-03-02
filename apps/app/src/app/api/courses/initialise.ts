"use server"

import { auth } from "@/auth"
import { isUserSubscribed } from "@/hooks/is-subscribed"
import { createOpenAI } from "@ai-sdk/openai"
import { db } from "@kouza/db"
import { generateObject } from "ai"
import { NextResponse } from "next/server"
import { z } from "zod"

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

async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let lastError
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error
      console.log(`Attempt ${attempt} failed, retrying...`)
      // Exponential backoff
      await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt - 1)))
    }
  }
  throw lastError
}

const freePrompt = (prompt: string) =>
  `Create a concise course outline based on: ${prompt}. Include up to 5 modules. Slug should be shortened version of title in lowercase. Module slugs should be shortened version of module title in lowercase.`
const subscribedPrompt = (prompt: string) =>
  `Create a concise course outline based on: ${prompt}. Include as many modules as possible. Slug should be shortened version of title in lowercase. Module slugs should be shortened version of module title in lowercase.`

const freeModulePrompt = (moduleTitle: string) =>
  `Create strictly up to 3 lessons for the module "${moduleTitle}". Keep descriptions brief. Slug should be shortened version of lesson title in lowercase.`
const subscribedModulePrompt = (moduleTitle: string) =>
  `Create as many lessons as possible for the module "${moduleTitle}". Keep descriptions brief. Slug should be shortened version of lesson title in lowercase.`

// New API endpoint: /api/courses/initialize
export async function initializeCourse(prompt: string) {
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

    // Generate course structure with modules
    const courseResult = await retryOperation(() =>
      generateObject({
        model: openai("gpt-4o-mini", { structuredOutputs: true }),
        schemaName: "course",
        schema: courseSchema,
        prompt: userSubscribed ? subscribedPrompt(prompt) : freePrompt(prompt),
      })
    )

    if (!courseResult?.object) {
      throw new Error("Failed to generate course structure")
    }

    const course = courseResult.object

    // Create course in database
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

    // Create modules
    await db.module.createMany({
      data: course.modules.map((module, index) => ({
        courseId: newCourse.id,
        title: module.title,
        slug: `${module.slug}-${userId}-${index}`,
        description: module.description,
        order: index,
      })),
    })

    // Return course ID for subsequent requests
    return NextResponse.json({
      courseId: newCourse.id,
      modules: course.modules,
    })
  } catch (error) {
    throw new Error(`Failed to generate course: ${(error as Error).message}`)
  }
}
