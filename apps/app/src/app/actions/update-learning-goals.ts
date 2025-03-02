"use server"

import { db } from "@kouza/db"

/**
 * Updates learning goals based on user progress
 * This is called after study sessions and when progress records are updated
 */
export async function updateLearningGoals(userId: number) {
  try {
    console.log(
      `[${new Date().toISOString()}] Updating learning goals for user ${userId}`
    )

    // Get all active learning goals for the user
    const goals = await db.learningGoal.findMany({
      where: {
        userId,
        achieved: false,
      },
      include: {
        module: true,
        course: true,
      },
    })

    if (goals.length === 0) {
      console.log(
        `[${new Date().toISOString()}] No active learning goals found for user ${userId}`
      )
      return { success: true, updated: 0 }
    }

    let updatedCount = 0

    // Process each goal type differently
    for (const goal of goals) {
      switch (goal.targetType) {
        case "TIME":
          await updateTimeGoal(goal, userId)
          updatedCount++
          break
        case "MASTERY":
          await updateMasteryGoal(goal, userId)
          updatedCount++
          break
        case "COMPLETION":
          await updateCompletionGoal(goal, userId)
          updatedCount++
          break
      }
    }

    console.log(
      `[${new Date().toISOString()}] Updated ${updatedCount} learning goals for user ${userId}`
    )
    return { success: true, updated: updatedCount }
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Error updating learning goals:`,
      error
    )
    return { success: false, error: "Failed to update learning goals" }
  }
}

/**
 * Updates a time-based learning goal
 */
async function updateTimeGoal(goal: any, userId: number) {
  try {
    // Calculate total time spent
    let timeSpentQuery: any = {
      userId,
    }

    if (goal.moduleId) {
      timeSpentQuery.moduleId = goal.moduleId
    } else if (goal.courseId) {
      timeSpentQuery.courseId = goal.courseId
    } else {
      // If no module or course specified, we can't track progress
      return
    }

    // Get total time from study sessions
    const studySessions = await db.studySession.findMany({
      where: timeSpentQuery,
      select: {
        duration: true,
      },
    })

    const totalTimeSpent = studySessions.reduce(
      (total, session) => total + (session.duration || 0),
      0
    )

    // Calculate progress (target is in minutes, duration is in seconds)
    const targetSeconds = goal.targetValue * 60
    const progress = Math.min(totalTimeSpent / targetSeconds, 1)
    const achieved = progress >= 1

    // Update the goal
    await db.learningGoal.update({
      where: { id: goal.id },
      data: {
        progress,
        achieved,
      },
    })

    console.log(
      `[${new Date().toISOString()}] Updated TIME goal ${goal.id}: progress=${progress}, achieved=${achieved}`
    )
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Error updating TIME goal ${goal.id}:`,
      error
    )
  }
}

/**
 * Updates a mastery-based learning goal
 */
async function updateMasteryGoal(goal: any, userId: number) {
  try {
    if (!goal.moduleId) {
      // Mastery goals require a module
      return
    }

    // Get the latest progress record for this module
    const latestRecord = await db.progressRecord.findFirst({
      where: {
        userId,
        moduleId: goal.moduleId,
      },
      orderBy: {
        recordedAt: "desc",
      },
    })

    // Use masteryScore if available, otherwise fall back to retentionRate
    if (
      !latestRecord ||
      (latestRecord.masteryScore === null &&
        latestRecord.retentionRate === null)
    ) {
      return
    }

    // Determine which score to use for mastery calculation
    const masteryValue =
      latestRecord.masteryScore !== null
        ? latestRecord.masteryScore
        : latestRecord.retentionRate

    // If both values are null (which shouldn't happen due to the earlier check, but just to be safe)
    if (masteryValue === null) {
      return
    }

    // Calculate progress
    const progress = Math.min(masteryValue / goal.targetValue, 1)
    const achieved = progress >= 1

    // Update the goal
    await db.learningGoal.update({
      where: { id: goal.id },
      data: {
        progress,
        achieved,
      },
    })

    console.log(
      `[${new Date().toISOString()}] Updated MASTERY goal ${goal.id}: progress=${progress}, achieved=${achieved} using ${latestRecord.masteryScore !== null ? "masteryScore" : "retentionRate"}`
    )
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Error updating MASTERY goal ${goal.id}:`,
      error
    )
  }
}

/**
 * Updates a completion-based learning goal
 */
async function updateCompletionGoal(goal: any, userId: number) {
  try {
    let completionQuery: any = {
      userId,
      endTime: { not: null }, // Only count completed sessions
    }

    if (goal.moduleId) {
      completionQuery.moduleId = goal.moduleId
    } else if (goal.courseId) {
      completionQuery.courseId = goal.courseId
    } else {
      // If no module or course specified, we can't track progress
      return
    }

    // Count completed study sessions
    const completedCount = await db.studySession.count({
      where: completionQuery,
    })

    // Calculate progress
    const progress = Math.min(completedCount / goal.targetValue, 1)
    const achieved = progress >= 1

    // Update the goal
    await db.learningGoal.update({
      where: { id: goal.id },
      data: {
        progress,
        achieved,
      },
    })

    console.log(
      `[${new Date().toISOString()}] Updated COMPLETION goal ${goal.id}: progress=${progress}, achieved=${achieved}`
    )
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Error updating COMPLETION goal ${goal.id}:`,
      error
    )
  }
}
