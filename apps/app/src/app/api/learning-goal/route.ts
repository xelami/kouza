import { NextRequest, NextResponse } from "next/server"
import { db } from "@kouza/db"
import { auth } from "@/auth"

export const runtime = "edge"

// POST: Create a new learning goal
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

    // Validate that the user ID in the request matches the authenticated user
    if (data.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Create the learning goal
    const learningGoal = await db.learningGoal.create({
      data: {
        title: data.title,
        description: data.description || null,
        targetType: data.targetType,
        targetValue: data.targetValue,
        progress: 0,
        achieved: false,
        courseId: data.courseId || null,
        moduleId: data.moduleId || null,
        deadline: data.deadline || null,
        userId,
      },
    })

    console.log(
      `[${new Date().toISOString()}] Created learning goal: ${learningGoal.id}`
    )

    return NextResponse.json(learningGoal, { status: 201 })
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Error creating learning goal:`,
      error
    )
    return NextResponse.json(
      { error: "Failed to create learning goal" },
      { status: 500 }
    )
  }
}

// GET: Retrieve learning goals for the authenticated user
export async function GET(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const userId = Number(session.user.id)

    // Get URL parameters
    const url = new URL(req.url)
    const courseId = url.searchParams.get("courseId")
    const moduleId = url.searchParams.get("moduleId")
    const targetType = url.searchParams.get("targetType")

    // Build the where clause
    const where: any = { userId }

    if (courseId) where.courseId = Number(courseId)
    if (moduleId) where.moduleId = Number(moduleId)
    if (targetType) where.targetType = targetType

    // Fetch learning goals
    const learningGoals = await db.learningGoal.findMany({
      where,
      orderBy: [
        { achieved: "asc" },
        { deadline: "asc" },
        { createdAt: "desc" },
      ],
    })

    return NextResponse.json(learningGoals)
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Error fetching learning goals:`,
      error
    )
    return NextResponse.json(
      { error: "Failed to fetch learning goals" },
      { status: 500 }
    )
  }
}

// PATCH: Update a learning goal
export async function PATCH(req: NextRequest) {
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

    if (!data.id) {
      return NextResponse.json(
        { error: "Learning goal ID is required" },
        { status: 400 }
      )
    }

    // Check if the learning goal exists and belongs to the user
    const existingGoal = await db.learningGoal.findUnique({
      where: { id: data.id },
    })

    if (!existingGoal) {
      return NextResponse.json(
        { error: "Learning goal not found" },
        { status: 404 }
      )
    }

    if (existingGoal.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Update the learning goal
    const updatedGoal = await db.learningGoal.update({
      where: { id: data.id },
      data: {
        title: data.title !== undefined ? data.title : undefined,
        description:
          data.description !== undefined ? data.description : undefined,
        targetType: data.targetType !== undefined ? data.targetType : undefined,
        targetValue:
          data.targetValue !== undefined ? data.targetValue : undefined,
        progress: data.progress !== undefined ? data.progress : undefined,
        achieved: data.achieved !== undefined ? data.achieved : undefined,
        courseId: data.courseId !== undefined ? data.courseId : undefined,
        moduleId: data.moduleId !== undefined ? data.moduleId : undefined,
        deadline: data.deadline !== undefined ? data.deadline : undefined,
      },
    })

    console.log(
      `[${new Date().toISOString()}] Updated learning goal: ${updatedGoal.id}`
    )

    return NextResponse.json(updatedGoal)
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Error updating learning goal:`,
      error
    )
    return NextResponse.json(
      { error: "Failed to update learning goal" },
      { status: 500 }
    )
  }
}
