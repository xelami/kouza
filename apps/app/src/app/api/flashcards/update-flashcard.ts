"use server"

import { db } from "@kouza/db"

interface Flashcard {
  user: any
  id: number
  question: string
  answer: string
  easeFactor: number
  interval: number
  repetitions: number
  lastReviewed: string | null
  nextReview: string | null
}

export async function updateFlashcardReview(
  cardId: number,
  data: Partial<Flashcard>
) {
  await db.flashcard.update({ where: { id: cardId }, data })
}

function calculateLevel(points: number): number {
  let threshold = 100
  let level = 1

  while (points >= threshold) {
    level++
    threshold *= 2
  }

  return level
}

export async function updateUserPoints(userId: number, points: number) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { points: true, level: true },
  })

  if (!user) return

  const newPoints = user.points + points
  const newLevel = calculateLevel(newPoints)

  await db.user.update({
    where: { id: userId },
    data: {
      points: { increment: points },
      level: newLevel !== user.level ? newLevel : undefined,
    },
  })
}
