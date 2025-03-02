import { auth } from "@/auth"
import { db } from "@kouza/db"
import { NextResponse } from "next/server"

export const runtime = "edge"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { courseId, moduleId, startTime } = await request.json()

    if (!courseId || !moduleId) {
      return NextResponse.json(
        { error: "Course ID and Module ID are required" },
        { status: 400 }
      )
    }

    const userId = Number(session.user.id)
    console.log(
      `[${new Date().toISOString()}] Creating study session for user ${userId}, course ${courseId}, module ${moduleId}`
    )

    // Check for existing active sessions for this user, course, and module
    const existingActiveSessions = await db.studySession.findMany({
      where: {
        userId: userId,
        courseId: Number(courseId),
        moduleId: Number(moduleId),
        endTime: null, // Sessions that haven't ended yet
      },
    })

    console.log(
      `[${new Date().toISOString()}] Found ${existingActiveSessions.length} existing active sessions`
    )

    // If there's an active session, return that instead of creating a new one
    if (existingActiveSessions.length > 0 && existingActiveSessions[0]) {
      const activeSession = existingActiveSessions[0]
      console.log(
        `[${new Date().toISOString()}] Returning existing active session: ${activeSession.id}`
      )
      return NextResponse.json({
        success: true,
        message: "Using existing study session",
        id: activeSession.id,
      })
    }

    // Create a new study session
    const studySession = await db.studySession.create({
      data: {
        userId: userId,
        courseId: Number(courseId),
        moduleId: Number(moduleId),
        startTime: startTime ? new Date(startTime) : new Date(),
      },
    })

    console.log(
      `[${new Date().toISOString()}] Created new study session: ${studySession.id}`
    )

    return NextResponse.json({
      success: true,
      message: "Study session created successfully",
      id: studySession.id,
    })
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Error creating study session:`,
      error
    )
    return NextResponse.json(
      { error: "Failed to create study session" },
      { status: 500 }
    )
  }
}

// End a study session
export async function PATCH(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      )
    }

    // Find the existing session
    const existingSession = await db.studySession.findUnique({
      where: {
        id: parseInt(sessionId),
      },
    })

    if (!existingSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    // Update the study session
    const studySession = await db.studySession.update({
      where: {
        id: parseInt(sessionId),
      },
      data: {
        endTime: new Date(),
        duration: Math.round(
          (Date.now() - existingSession.startTime.getTime()) / 1000
        ),
      },
    })

    return NextResponse.json({
      success: true,
      message: "Study session updated successfully",
      id: studySession.id,
    })
  } catch (error) {
    console.error("Error updating study session:", error)
    return NextResponse.json(
      { error: "Failed to update study session" },
      { status: 500 }
    )
  }
}
