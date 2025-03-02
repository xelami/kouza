"use server"

import { auth } from "@/auth"
import { isUserSubscribed } from "@/hooks/is-subscribed"
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
  slug: z.string(),
  description: z.string(),
  content: z.string(),
})

// Function to generate a unique slug
async function generateUniqueSlug(
  baseSlug: string,
  userId: string
): Promise<string> {
  let slug = `${baseSlug}-${userId}`
  let isUnique = false
  let attempt = 1

  while (!isUnique) {
    // Check if the slug already exists
    const existingNote = await db.note.findUnique({
      where: { slug },
    })

    if (!existingNote) {
      isUnique = true
    } else {
      // If slug exists, append a number and try again
      slug = `${baseSlug}-${userId}-${attempt}`
      attempt++
    }
  }

  return slug
}

export async function generateNote(
  note: string,
  lessonId: number,
  moduleId: number,
  courseId: number
) {
  const session = await auth()

  const userId = session?.user.id

  if (!userId) {
    throw new Error("User not found")
  }

  const userSubscribed = await isUserSubscribed(Number(userId))

  if (!userSubscribed) {
    const notes = await db.note.findMany({
      where: {
        userId: Number(userId),
      },
    })

    if (notes.length >= 10) {
      throw new Error(
        "You have reached the maximum number of free notes. Subscribe to generate unlimited notes!"
      )
    }
  }

  const noteResult = await generateObject({
    model: openai("gpt-4o-mini", { structuredOutputs: true }),
    schemaName: "note",
    schema: noteSchema,
    prompt: `Generate a detailed revision note for the following text: ${note}. Slug should be shortened version of lesson title in lowercase.`,
  })

  if (!noteResult?.object) {
    throw new Error("Failed to generate note")
  }

  const noteObj = noteResult.object

  const uniqueSlug = await generateUniqueSlug(noteObj.slug, userId)

  const newNote = await db.note.create({
    data: {
      title: noteObj.title,
      slug: uniqueSlug,
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
