import { auth } from "@/auth"
import { db } from "@kouza/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const moduleId = searchParams.get("moduleId")
    const lessonId = searchParams.get("lessonId")

    if (!moduleId) {
      return NextResponse.json(
        { error: "Module ID is required" },
        { status: 400 }
      )
    }

    const userId = Number(session.user.id)

    // Build the query
    const query: any = {
      where: {
        userId: userId,
        moduleId: Number(moduleId),
      },
      orderBy: {
        id: "desc",
      },
    }

    // Add lessonId filter if provided
    if (lessonId) {
      query.where.lessonId = Number(lessonId)
    }

    // Get flashcards
    const flashcards = await db.flashcard.findMany(query)

    console.log(
      `[${new Date().toISOString()}] Retrieved ${flashcards.length} flashcards for module ${moduleId}, user ${userId}`
    )

    return NextResponse.json({
      success: true,
      flashcards,
    })
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Error getting flashcards:`,
      error
    )
    return NextResponse.json(
      { error: "Failed to get flashcards" },
      { status: 500 }
    )
  }
}
