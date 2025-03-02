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

const flashcardSchema = z.object({
  flashcards: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    })
  ),
})

interface FlashcardInput {
  noteId?: number
  lessonId?: number
}

export async function newFlashcards({ noteId, lessonId }: FlashcardInput) {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userSubscribed = await isUserSubscribed(Number(userId))

  if (!userSubscribed) {
    const flashcards = await db.flashcard.findMany({
      where: {
        userId: Number(userId),
      },
    })

    if (flashcards.length >= 50) {
      throw new Error(
        "You have reached the maximum number of free flashcards. Subscribe to generate unlimited flashcards!"
      )
    }
  }

  if (!noteId && !lessonId) {
    throw new Error("Either noteId or lessonId must be provided")
  }

  let content: string
  let moduleId: number
  let courseId: number

  if (noteId) {
    const existingFlashcards = await db.flashcard.findMany({
      where: {
        noteId: noteId,
      },
    })

    if (existingFlashcards && existingFlashcards.length > 0) {
      throw new Error("Flashcards already exist for this note")
    }

    const note = await db.note.findUnique({
      where: { id: noteId },
      include: {
        lesson: true,
        module: true,
        course: true,
      },
    })

    if (!note) throw new Error("Note not found")

    content = note.content
    moduleId = note.moduleId
    courseId = note.courseId
    lessonId = note.lessonId
  } else {
    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: true,
      },
    })

    if (!lesson) throw new Error("Lesson not found")
    content = lesson.content || ""
    moduleId = lesson.moduleId
    courseId = lesson.module.courseId

    const existingFlashcards = await db.flashcard.findMany({
      where: {
        lessonId: lessonId,
        userId: parseInt(userId),
        moduleId,
        courseId,
      },
    })

    if (existingFlashcards && existingFlashcards.length > 0) {
      throw new Error("Flashcards already exist for this lesson")
    }
  }

  const flashcardsResult = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: flashcardSchema,
    prompt: `Generate 10 flashcards for the following content: ${content}`,
  })

  let flashcards = flashcardsResult.object.flashcards

  if (!flashcards) {
    throw new Error("No flashcards generated")
  }
  if (!Array.isArray(flashcards)) {
    flashcards = [flashcards]
  }

  const createdFlashcards = await Promise.all(
    flashcards.map(async (flashcardObj) => {
      return db.flashcard.create({
        data: {
          question: flashcardObj.question,
          answer: flashcardObj.answer,
          easeFactor: 2.5,
          interval: 0,
          repetitions: 0,
          noteId: noteId || undefined,
          userId: parseInt(userId),
          moduleId,
          courseId,
          lessonId: lessonId!,
        },
      })
    })
  )

  return createdFlashcards
}
