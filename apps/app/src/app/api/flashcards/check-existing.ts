"use server"

import { db } from "@kouza/db"
import { auth } from "@/auth"

export async function checkExistingFlashcards(
  lessonId?: number,
  noteId?: number
) {
  const session = await auth()
  if (!session?.user?.id) return false

  if (!lessonId && !noteId) return false

  if (lessonId) {
    const exists = await db.flashcard.findFirst({
      where: {
        lessonId,
        userId: parseInt(session.user.id),
      },
    })
    return !!exists
  }

  if (noteId) {
    const exists = await db.flashcard.findFirst({
      where: {
        noteId,
        userId: parseInt(session.user.id),
      },
    })
    return !!exists
  }

  return false
}
