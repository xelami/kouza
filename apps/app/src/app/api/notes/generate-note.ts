"use server"

import { auth } from "@/auth"
import { createOpenAI } from "@ai-sdk/openai"
import { db } from "@kouza/db"
import { generateObject } from "ai"
import { z } from "zod"

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  compatibility: "strict",
})

const noteSchema = z.object({
  title: z.string(),
  description: z.string(),
  content: z.string(),
})

export async function generateNote(
  note: string,
  lessonId: number,
  moduleId: number,
  courseId: number
) {
  const session = await auth()

  const userId = await session?.user.id

  if (!userId) {
    throw new Error("User not found")
  }

  const noteResult = await generateObject({
    model: openai("gpt-4o-mini", { structuredOutputs: true }),
    schemaName: "note",
    schema: noteSchema,
    prompt: `Generate a detailed revision note for the following text: ${note}`,
  })

  if (!noteResult?.object) {
    throw new Error("Failed to generate note")
  }

  const noteObj = noteResult.object

  const newNote = await db.note.create({
    data: {
      title: noteObj.title,
      description: noteObj.description,
      content: noteObj.content,
      userId: Number(userId),
      lessonId: lessonId,
      moduleId: moduleId,
      courseId: courseId,
    },
  })

  return newNote
}
