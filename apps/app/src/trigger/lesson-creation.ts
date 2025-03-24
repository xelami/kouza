import { logger, task } from "@trigger.dev/sdk/v3"
import { z } from "zod"
import { createOpenAI } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { db } from "@kouza/db"
import { CourseModule } from "@/types/types"

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

// Define the input payload type for the task
type CreateLessonsPayload = {
  module: CourseModule
  isSubscribed: boolean
  userId: string
}

export const createLessonsTask = task({
  id: "create-lessons",
  // Set a longer max duration since this task is computationally intensive
  maxDuration: 3600, // 1 hour in seconds
  run: async (payload: CreateLessonsPayload) => {
    const { module, isSubscribed, userId } = payload
    logger.log("Starting lesson creation for module", {
      moduleId: module.id,
      moduleTitle: module.title,
    })

    try {
      // Generate lesson outlines based on subscription status
      const lessonsResult = await generateObject({
        model: openai("gpt-4o-mini", { structuredOutputs: true }),
        schema: moduleLessonsSchema,
        prompt: isSubscribed
          ? subscribedModulePrompt(module.title)
          : freeModulePrompt(module.title),
      })

      if (!lessonsResult?.object?.lessons) {
        throw new Error(`Failed to generate lessons for module ${module.title}`)
      }

      const lessons = lessonsResult.object.lessons
      if (!lessons.length) {
        throw new Error(`No lessons generated for ${module.title}`)
      }

      logger.log("Generated lesson outlines", { count: lessons.length })

      // Generate content for each lesson in parallel
      const contentPromises = lessons.map((lesson) =>
        generateObject({
          model: openai("gpt-4o-mini", { structuredOutputs: true }),
          schema: lessonContentSchema,
          prompt: `Create detailed educational content for lesson "${lesson?.title}".
            The content should be at least 2000 words and focus purely on teaching the material.
            DO NOT include any quiz questions, exercises, or test material in the content section.
            The quiz section will be handled separately in the quiz object.
            After generating the main content, create a separate comprehensive quiz with multiple questions to test understanding.
            Each quiz question must have exactly 4 options.`,
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
      logger.log("Generated content for all lessons", { moduleId: module.id })

      // Save lessons to database
      await db.lesson.createMany({
        data: lessonData,
        skipDuplicates: true,
      })

      // Update module with connections to lessons
      await db.module.update({
        where: { id: module.id },
        data: {
          lessons: { connect: lessonData.map((l) => ({ slug: l.slug })) },
        },
      })

      logger.log("Successfully created lessons and updated module", {
        moduleId: module.id,
        lessonCount: lessonData.length,
      })

      return {
        moduleId: module.id,
        lessonCount: lessonData.length,
        status: "success",
      }
    } catch (error) {
      logger.error("Error creating lessons", {
        moduleId: module.id,
        error: (error as Error).message,
      })

      throw error
    }
  },
})
