import { NextRequest, NextResponse } from "next/server"
import { db } from "@kouza/db"
import { auth } from "@/auth"
import { updateLearningGoals } from "@/app/actions/update-learning-goals"

export const runtime = "edge"

// POST: Manually update learning goal progress
export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const userId = Number(session.user.id)
    const data = await req.json()

    if (data.goalId) {
      // Update a specific goal
      const goal = await db.learningGoal.findUnique({
        where: { id: data.goalId },
      })

      if (!goal) {
        return NextResponse.json(
          { error: "Learning goal not found" },
          { status: 404 }
        )
      }

      if (goal.userId !== userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
      }

      // Update the goal with the provided progress
      if (data.progress !== undefined) {
        await db.learningGoal.update({
          where: { id: goal.id },
          data: {
            progress: data.progress,
            achieved: data.progress >= 1,
          },
        })

        console.log(
          `[${new Date().toISOString()}] Manually updated goal ${goal.id} progress to ${data.progress}`
        )
      } else {
        // If no progress provided, recalculate based on current data
        await updateLearningGoals(userId)
      }

      return NextResponse.json({ success: true })
    } else {
      // Update all goals for the user
      const result = await updateLearningGoals(userId)
      return NextResponse.json(result)
    }
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Error updating learning goal progress:`,
      error
    )
    return NextResponse.json(
      { error: "Failed to update learning goal progress" },
      { status: 500 }
    )
  }
}
