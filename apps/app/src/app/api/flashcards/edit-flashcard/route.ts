import { auth } from "@/auth"
import { db } from "@kouza/db"
import { NextResponse } from "next/server"

export async function PUT(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, question, answer } = await request.json()

    if (!id || !question || !answer) {
      return NextResponse.json(
        { error: "Flashcard ID, question, and answer are required" },
        { status: 400 }
      )
    }

    const userId = Number(session.user.id)

    // Check if the flashcard belongs to the user
    const flashcard = await db.flashcard.findUnique({
      where: {
        id: Number(id),
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
        { error: "You don't have permission to edit this flashcard" },
        { status: 403 }
      )
    }

    // Update the flashcard
    const updatedFlashcard = await db.flashcard.update({
      where: {
        id: Number(id),
      },
      data: {
        question,
        answer,
      },
    })

    console.log(
      `[${new Date().toISOString()}] Flashcard updated: id=${id}, user=${userId}`
    )

    return NextResponse.json({
      success: true,
      message: "Flashcard updated successfully",
      flashcard: updatedFlashcard,
    })
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Error updating flashcard:`,
      error
    )
    return NextResponse.json(
      { error: "Failed to update flashcard" },
      { status: 500 }
    )
  }
}
