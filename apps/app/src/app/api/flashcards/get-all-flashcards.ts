"use server"

import { auth } from "@/auth"
import { db } from "@kouza/db"

export async function getFlashcards() {
  const session = await auth()
  const user = session?.user

  if (!user) {
    return []
  }

  const flashcards = await db.flashcard.findMany({
    where: {
      userId: Number(user.id),
    },
    include: {
      note: true,
      lesson: true,
      module: true,
      course: true,
    },
  })

  const grouped = flashcards.reduce(
    (acc: Record<number, any[]>, fc: any) => {
      const courseId = fc.course.id
      if (!acc[courseId]) {
        acc[courseId] = []
      }
      acc[courseId].push(fc)
      return acc
    },
    {} as Record<number, typeof flashcards>
  )

  const result = Object.entries(grouped).map(
    ([courseId, groupFlashcards]: [string, any[]]) => {
      const totalCards = groupFlashcards.length
      const reviewed = groupFlashcards.filter(
        (fc: any) => fc.lastReviewed !== null
      ).length
      const toReview = totalCards - reviewed
      const course = groupFlashcards[0]?.course
      return {
        flashcards: groupFlashcards,
        course: {
          id: Number(courseId),
          title: course?.title || "",
          slug: course?.slug || "",
          description: course?.description || "",
        },
        totalCards,
        reviewed,
        toReview,
      }
    }
  )

  return result
}
