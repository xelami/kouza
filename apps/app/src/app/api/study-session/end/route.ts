import { auth } from "@/auth"
import { db } from "@kouza/db"
import { NextResponse } from "next/server"
import { updateLearningGoals } from "@/app/actions/update-learning-goals"

export const runtime = "edge"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { sessionId, stats, reviewData } = await request.json()

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      )
    }

    const userId = Number(session.user.id)
    console.log(
      `[${new Date().toISOString()}] Attempting to end study session ${sessionId} for user ${userId}`
    )

    // First, check if the session has already been ended
    const existingSession = await db.studySession.findUnique({
      where: {
        id: parseInt(sessionId),
      },
    })

    if (!existingSession) {
      console.error(
        `[${new Date().toISOString()}] Session ${sessionId} not found`
      )
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    // If the session already has an end time, don't update it again
    if (existingSession.endTime) {
      console.log(
        `[${new Date().toISOString()}] Session ${sessionId} was already ended at ${existingSession.endTime}`
      )
      return NextResponse.json({
        success: true,
        message: "Session was already ended",
        sessionId,
      })
    }

    // Update the study session in the database
    const studySession = await db.studySession.update({
      where: {
        id: parseInt(sessionId),
      },
      data: {
        endTime: new Date(),
        // Calculate duration in seconds instead of minutes
        duration: Math.round(
          (Date.now() - existingSession.startTime.getTime()) / 1000
        ),
      },
    })

    console.log(
      `[${new Date().toISOString()}] Session ${sessionId} ended successfully with duration: ${studySession.duration} seconds`
    )

    // Calculate retention rate based on flashcard performance
    if (stats && reviewData && reviewData.length > 0) {
      // Calculate retention rate based on the percentage of cards marked as "good" or "easy"
      const uniqueCards = new Set(
        reviewData.map((item: { cardId: number }) => item.cardId)
      ).size

      // Get first review for each unique card to calculate initial performance
      const firstReviewByCard = new Map<number, string>()
      reviewData.forEach((item: { cardId: number; performance: string }) => {
        if (!firstReviewByCard.has(item.cardId)) {
          firstReviewByCard.set(item.cardId, item.performance)
        }
      })

      // Count initial correct performances (good or easy)
      const initialPerformances = Array.from(firstReviewByCard.values())
      const initialCorrect = initialPerformances.filter(
        (p) => p === "good" || p === "easy"
      ).length

      // Calculate current session retention rate
      const currentSessionRetentionRate = Math.round(
        (initialCorrect / uniqueCards) * 100
      )

      console.log(
        `[${new Date().toISOString()}] Current session retention rate: ${currentSessionRetentionRate}%`
      )

      try {
        // RETENTION RATE CALCULATION APPROACH:
        // 1. We calculate the retention rate for the current session based on flashcard performance
        // 2. We retrieve all previous study sessions and their associated progress records
        // 3. We also retrieve quiz scores for this module
        // 4. We calculate a weighted average based on time spent:
        //    - Flashcard sessions are weighted by their actual duration
        //    - Quiz scores are weighted by a fixed time (5 minutes per quiz)
        // 5. This gives us an aggregate retention rate that represents overall mastery
        //    across all learning activities for this module

        // Check if a progress record already exists for this course and module
        const existingRecord = await db.progressRecord.findFirst({
          where: {
            userId: userId,
            courseId: existingSession.courseId,
            moduleId: existingSession.moduleId,
            recordedAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)), // Today
            },
          },
        })

        // Get all previous study sessions for this module to calculate aggregate retention
        const previousSessions = await db.studySession.findMany({
          where: {
            userId: userId,
            courseId: existingSession.courseId,
            moduleId: existingSession.moduleId,
            endTime: { not: null }, // Only completed sessions
            id: { not: parseInt(sessionId) }, // Exclude current session
          },
          select: {
            progressRecordId: true,
          },
        })

        // Get all related progress records to calculate aggregate retention
        const progressRecordIds = previousSessions
          .map((session) => session.progressRecordId)
          .filter((id) => id !== null) as number[]

        const previousProgressRecords =
          progressRecordIds.length > 0
            ? await db.progressRecord.findMany({
                where: {
                  id: { in: progressRecordIds },
                },
                select: {
                  retentionRate: true,
                  timeSpent: true,
                },
              })
            : []

        // Also get quiz scores for this module to include in retention calculation
        const quizRecords = await db.progressRecord.findMany({
          where: {
            userId: userId,
            courseId: existingSession.courseId,
            moduleId: existingSession.moduleId,
            quizScore: { not: null },
          },
          select: {
            quizScore: true,
          },
        })

        // Calculate weighted average retention rate
        let totalTimeSpent = studySession.duration || 0
        let weightedRetentionSum = currentSessionRetentionRate * totalTimeSpent

        previousProgressRecords.forEach((record) => {
          if (record.retentionRate !== null && record.timeSpent !== null) {
            weightedRetentionSum += record.retentionRate * record.timeSpent
            totalTimeSpent += record.timeSpent
          }
        })

        // Include quiz scores in the retention rate calculation
        // Each quiz score is treated as equivalent to 5 minutes of study time
        const QUIZ_TIME_WEIGHT = 300 // 5 minutes in seconds
        quizRecords.forEach((record) => {
          if (record.quizScore !== null) {
            // Convert quiz score (0-100) to retention rate equivalent
            weightedRetentionSum += record.quizScore * QUIZ_TIME_WEIGHT
            totalTimeSpent += QUIZ_TIME_WEIGHT
          }
        })

        // Calculate the aggregate retention rate
        const aggregateRetentionRate =
          totalTimeSpent > 0
            ? Math.round(weightedRetentionSum / totalTimeSpent)
            : currentSessionRetentionRate

        // Calculate mastery score - this is a normalized version of retention rate
        // that takes into account quiz scores and study time
        // The formula ensures masteryScore is between 0-100
        const masteryScore = aggregateRetentionRate

        console.log(
          `[${new Date().toISOString()}] Calculated aggregate retention rate: ${aggregateRetentionRate}% and mastery score: ${masteryScore}`
        )

        // Log breakdown of retention rate calculation
        console.log(`[${new Date().toISOString()}] Retention rate calculation breakdown:
          - Current session: ${currentSessionRetentionRate}% (weight: ${studySession.duration || 0}s)
          - Previous sessions: ${previousProgressRecords.length} records
          - Quiz records: ${quizRecords.length} records
          - Total time weight: ${totalTimeSpent}s
          - Final aggregate rate: ${aggregateRetentionRate}%
          - Mastery score: ${masteryScore}`)

        if (existingRecord) {
          // Update existing record
          const updatedRecord = await db.progressRecord.update({
            where: {
              id: existingRecord.id,
            },
            data: {
              retentionRate: aggregateRetentionRate,
              masteryScore: masteryScore,
              timeSpent:
                (existingRecord.timeSpent || 0) + (studySession.duration || 0), // Add session duration in seconds with null check
              recordedAt: new Date(), // Update timestamp
            },
          })

          // Update study session to reference the progress record
          await db.studySession.update({
            where: {
              id: parseInt(sessionId),
            },
            data: {
              progressRecordId: Number(updatedRecord.id),
            },
          })

          console.log(
            `[${new Date().toISOString()}] Updated existing progress record: ${existingRecord.id}`
          )
        } else {
          // Create new record
          const newRecord = await db.progressRecord.create({
            data: {
              userId: userId,
              courseId: existingSession.courseId,
              moduleId: existingSession.moduleId,
              retentionRate: aggregateRetentionRate,
              masteryScore: masteryScore,
              timeSpent: studySession.duration || 0, // Store duration in seconds with null check
              recordedAt: new Date(),
            },
          })

          // Update study session to reference the progress record
          await db.studySession.update({
            where: {
              id: parseInt(sessionId),
            },
            data: {
              progressRecordId: Number(newRecord.id),
            },
          })

          console.log(
            `[${new Date().toISOString()}] Created new progress record: ${newRecord.id}`
          )
        }
      } catch (error) {
        console.error(
          `[${new Date().toISOString()}] Error updating progress record:`,
          error
        )
        // Continue execution even if progress record update fails
      }
    }

    // Update learning goals
    await updateLearningGoals(userId)

    // In a production app, you would also:
    // 1. Store the stats in the database
    // 2. Store the review data for each flashcard
    // 3. Update user's study stats

    // For example (commented out since these models might not exist yet):
    /*
    if (stats) {
      // Update user's study stats
      const userStats = await db.studyStats.findUnique({
        where: {
          userId: session.user.id,
        },
      })

      if (userStats) {
        // Update existing stats
        await db.studyStats.update({
          where: {
            userId: session.user.id,
          },
          data: {
            totalStudyTime: userStats.totalStudyTime + (stats.totalTimeSpent / 60),
            lastStudyDate: new Date(),
            // Update other stats as needed
          },
        })
      } else {
        // Create new stats record
        await db.studyStats.create({
          data: {
            userId: session.user.id,
            totalStudyTime: stats.totalTimeSpent / 60,
            lastStudyDate: new Date(),
            // Set other initial stats
          },
        })
      }

      // Record user activity
      await db.userActivity.create({
        data: {
          userId: session.user.id,
          activityType: "STUDY_SESSION",
          entityId: parseInt(sessionId),
          entityType: "FLASHCARD",
          metadata: {
            stats: stats,
            // Include summary data but not full review data to keep it manageable
            totalCards: reviewData?.length || 0,
            correctPercentage: stats ? 
              Math.round(((stats.good + stats.easy) / 
                (stats.again + stats.hard + stats.good + stats.easy)) * 100) : 0
          },
        },
      })
    }
    */

    return NextResponse.json({
      success: true,
      message: "Study session ended successfully",
      sessionId,
    })
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Error ending study session:`,
      error
    )
    return NextResponse.json(
      { error: "Failed to end study session" },
      { status: 500 }
    )
  }
}
