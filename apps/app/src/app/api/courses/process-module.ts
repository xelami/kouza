"use server"

import { auth } from "@/auth"
import { isUserSubscribed } from "@/hooks/is-subscribed"
import { PrismaError } from "@/types/types"
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

const freeModulePrompt = (moduleTitle: string) =>
  `Create strictly up to 3 lessons for the module "${moduleTitle}". Keep descriptions brief. Slug should be shortened version of lesson title in lowercase.`
const subscribedModulePrompt = (moduleTitle: string) =>
  `Create as many lessons as possible for the module "${moduleTitle}". Keep descriptions brief. Slug should be shortened version of lesson title in lowercase.`

export async function processModule(courseId: number, moduleId: number) {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    throw new Error("User not found")
  }

  const userSubscribed = await isUserSubscribed(Number(userId))

  const module = await db.module.findUnique({
    where: { id: moduleId },
    include: { course: true },
  })

  if (!module) {
    throw new Error("Module not found")
  }

  try {
    // Generate lessons for this module (keep your existing logic)
    const lessonsResult = await retryOperation(() =>
      generateObject({
        model: openai("gpt-4o-mini", { structuredOutputs: true }),
        schemaName: "moduleLessons",
        schema: moduleLessonsSchema,
        prompt: userSubscribed
          ? subscribedModulePrompt(module.title)
          : freeModulePrompt(module.title),
      })
    )

    // Process each lesson (keep your existing logic for content generation)
    const dbLessons: any[] = []
    for (
      let lessonIndex = 0;
      lessonIndex < lessonsResult.object.lessons.length;
      lessonIndex++
    ) {
      const lesson = lessonsResult.object.lessons[lessonIndex]

      let baseSlug = lesson?.slug + "-" + userId
      let uniqueSlug = baseSlug
      let counter = 1
      while (await db.lesson.findUnique({ where: { slug: uniqueSlug } })) {
        uniqueSlug = `${lesson?.slug}-${userId}-${counter}`
        counter++
      }

      const contentResult = await retryOperation(() =>
        generateObject({
          model: openai("gpt-4o-mini", { structuredOutputs: true }),
          schemaName: "lessonContent",
          schema: lessonContentSchema,
          prompt: `Create detailed educational content for lesson "${lesson?.title}". 
            The content should be at least 2000 words and focus purely on teaching the material.
            DO NOT include any quiz questions, exercises, or test material in the content section.
            The quiz section will be handled separately in the quiz object.
            After generating the main content, create a separate comprehensive quiz with multiple questions to test understanding.
            Each quiz question must have exactly 4 options.`,
        })
      )

      try {
        const courseLesson = await db.lesson.create({
          data: {
            moduleId: module.id,
            title: lesson?.title || "",
            slug: uniqueSlug,
            content:
              contentResult?.object?.content || "Content generation failed",
            media: contentResult?.object?.media || [],
            order: lessonIndex,
            quiz: contentResult?.object?.quiz || { questions: [] },
          },
        })
        dbLessons.push(courseLesson)
      } catch (error) {
        if ((error as PrismaError).code === "P2002") {
          console.error(
            `Unique constraint failed for slug: ${uniqueSlug}. Retrying...`
          )
        }
        console.error(
          `Error creating lesson "${lesson?.title}":`,
          (error as Error).message
        )
      }
    }

    // Mark module as completed
    await db.module.update({
      where: { id: moduleId },
      data: {
        lessons: {
          connect: dbLessons.map((lesson) => ({ id: lesson.id })),
        },
      },
    })

    return { status: "SUCCESS", lessonCount: dbLessons.length }
  } catch (error: any) {
    return { status: "ERROR", message: error.message }
  }
}
