import { auth } from "@/auth"
import { db } from "@kouza/db"
import { NextResponse } from "next/server"

export const runtime = "edge"

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const moduleId = searchParams.get("moduleId")

    if (!moduleId) {
      return NextResponse.json(
        { error: "Module ID is required" },
        { status: 400 }
      )
    }

    const userId = Number(session.user.id)

    // Get all flashcards for this module and user
    const flashcards = await db.flashcard.findMany({
      where: {
        userId: userId,
        moduleId: Number(moduleId),
      },
    })

    const totalCards = flashcards.length
    const reviewed = flashcards.filter((fc) => fc.lastReviewed !== null).length
    const toReview = totalCards - reviewed

    // Get cards due for review
    const now = new Date()
    const dueForReview = flashcards.filter(
      (fc) => !fc.nextReview || new Date(fc.nextReview) <= now
    ).length

    return NextResponse.json({
      totalCards,
      reviewed,
      toReview,
      dueForReview,
    })
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Error getting module stats:`,
      error
    )
    return NextResponse.json(
      { error: "Failed to get module stats" },
      { status: 500 }
    )
  }
}
