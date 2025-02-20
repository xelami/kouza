"use server"

import { db } from "@kouza/db"

export type DashboardData = {
  userStats: { points: number; level: number } | null
  reviseStats: Array<{
    id: number
    createdAt: Date
    updatedAt: Date
    userId: number
    nextReview: Date | null
    module: {
      title: string
      course: { title: string }
    }
  }>
  totalDueCards: number
  totalCourses: number
  flashcardsReviewed: number
  totalNotes: number
}

export async function getDashboardData(userId: number): Promise<DashboardData> {
  if (!userId) throw new Error("User ID is required")

  try {
    const userStats = await db.user.findUnique({
      where: { id: userId },
      select: {
        points: true,
        level: true,
      },
    })

    const reviseStats = await db.flashcard.findMany({
      where: {
        userId,
        nextReview: {
          lte: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      },
      include: {
        module: {
          select: {
            title: true,
            course: {
              select: {
                title: true,
              },
            },
          },
        },
      },
      take: 3,
    })

    const totalDueCards = await db.flashcard.count({
      where: {
        userId,
        nextReview: {
          lte: new Date(),
        },
      },
    })

    const totalCourses = await db.course.count({
      where: { generatedBy: userId },
    })

    const flashcardsReviewed = await db.flashcard.count({
      where: {
        userId,
        lastReviewed: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    })

    const totalNotes = await db.note.count({
      where: { userId },
    })

    return {
      userStats,
      reviseStats,
      totalDueCards,
      totalCourses,
      flashcardsReviewed,
      totalNotes,
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    throw error
  }
}
