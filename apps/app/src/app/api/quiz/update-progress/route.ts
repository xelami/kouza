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

    const { courseId, moduleId, quizScore } = await request.json()

    if (!courseId || !moduleId || quizScore === undefined) {
      return NextResponse.json(
        { error: "Course ID, Module ID, and quiz score are required" },
        { status: 400 }
      )
    }

    const userId = Number(session.user.id)
    console.log(
      `[${new Date().toISOString()}] Updating progress record for quiz: user=${userId}, course=${courseId}, module=${moduleId}, score=${quizScore}`
    )

    // Check if a progress record already exists for today
    const existingRecord = await db.progressRecord.findFirst({
      where: {
        userId: userId,
        courseId: courseId,
        moduleId: moduleId,
        recordedAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)), // Today
        },
      },
    })

    // For quiz scores, we'll set the masteryScore equal to the quizScore
    // This is a simple approach that can be refined later if needed
    const masteryScore = quizScore

    if (existingRecord) {
      // Update existing record
      const updatedRecord = await db.progressRecord.update({
        where: {
          id: existingRecord.id,
        },
        data: {
          quizScore: quizScore,
          masteryScore: masteryScore,
          recordedAt: new Date(), // Update timestamp
        },
      })

      console.log(
        `[${new Date().toISOString()}] Updated existing progress record: ${existingRecord.id} with quiz score: ${quizScore} and mastery score: ${masteryScore}`
      )
    } else {
      // Create new record
      const newRecord = await db.progressRecord.create({
        data: {
          userId: userId,
          courseId: courseId,
          moduleId: moduleId,
          quizScore: quizScore,
          masteryScore: masteryScore,
          recordedAt: new Date(),
        },
      })

      console.log(
        `[${new Date().toISOString()}] Created new progress record: ${newRecord.id} with quiz score: ${quizScore} and mastery score: ${masteryScore}`
      )
    }

    // Update learning goals
    await updateLearningGoals(userId)

    return NextResponse.json({
      success: true,
      message: "Quiz progress updated successfully",
    })
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Error updating quiz progress:`,
      error
    )
    return NextResponse.json(
      { error: "Failed to update quiz progress" },
      { status: 500 }
    )
  }
}
