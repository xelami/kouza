import { auth } from "@/auth"
import { db } from "@kouza/db"
import { NextResponse } from "next/server"

export const runtime = "edge"

export async function DELETE(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const flashcardId = searchParams.get("id")

    if (!flashcardId) {
      return NextResponse.json(
        { error: "Flashcard ID is required" },
        { status: 400 }
      )
    }

    const userId = Number(session.user.id)

    // Check if the flashcard belongs to the user
    const flashcard = await db.flashcard.findUnique({
      where: {
        id: Number(flashcardId),
      },
    })

    if (!flashcard) {
      return NextResponse.json(
        { error: "Flashcard not found" },
        { status: 404 }
      )
    }

    if (flashcard.userId !== userId) {
      return NextResponse.json(
        { error: "You don't have permission to delete this flashcard" },
        { status: 403 }
      )
    }

    // Delete the flashcard
    await db.flashcard.delete({
      where: {
        id: Number(flashcardId),
      },
    })

    console.log(
      `[${new Date().toISOString()}] Flashcard deleted: id=${flashcardId}, user=${userId}`
    )

    return NextResponse.json({
      success: true,
      message: "Flashcard deleted successfully",
    })
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Error deleting flashcard:`,
      error
    )
    return NextResponse.json(
      { error: "Failed to delete flashcard" },
      { status: 500 }
    )
  }
}
