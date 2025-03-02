import { NextRequest, NextResponse } from "next/server"
import { db } from "@kouza/db"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export const runtime = "edge"

// POST: Create a suggested learning goal
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

    // Get form data
    const formData = await req.formData()
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const targetType = formData.get("targetType") as string
    const targetValue = Number(formData.get("targetValue"))
    const moduleId = formData.get("moduleId")
      ? Number(formData.get("moduleId"))
      : null
    const courseId = formData.get("courseId")
      ? Number(formData.get("courseId"))
      : null

    if (!title || !targetType || !targetValue) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Create the learning goal
    const learningGoal = await db.learningGoal.create({
      data: {
        title,
        description: description || null,
        targetType: targetType as "TIME" | "MASTERY" | "COMPLETION",
        targetValue,
        progress: 0,
        achieved: false,
        moduleId,
        courseId,
        userId,
      },
    })

    console.log(
      `[${new Date().toISOString()}] Created suggested learning goal: ${learningGoal.id}`
    )

    // Redirect back to objectives page
    return new Response(null, {
      status: 303, // See Other
      headers: {
        Location: "/objectives",
      },
    })
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Error creating suggested learning goal:`,
      error
    )

    // Redirect back to suggestions page with error
    return new Response(null, {
      status: 303, // See Other
      headers: {
        Location: "/objectives/suggest?error=failed-to-create",
      },
    })
  }
}
