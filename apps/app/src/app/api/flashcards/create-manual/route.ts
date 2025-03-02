import { auth } from "@/auth"
import { isUserSubscribed } from "@/hooks/is-subscribed"
import { db } from "@kouza/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { question, answer, courseId, moduleId, lessonId } =
      await request.json()

    if (!question || !answer || !courseId || !moduleId) {
      return NextResponse.json(
        { error: "Question, answer, courseId, and moduleId are required" },
        { status: 400 }
      )
    }

    const userId = Number(session.user.id)

    // Check subscription limits for free users
    const userSubscribed = await isUserSubscribed(userId)

    if (!userSubscribed) {
      const flashcards = await db.flashcard.findMany({
        where: {
          userId: userId,
        },
      })

      if (flashcards.length >= 50) {
        return NextResponse.json(
          {
            error:
              "You have reached the maximum number of free flashcards. Subscribe to create unlimited flashcards!",
          },
          { status: 403 }
        )
      }
    }

    // Verify that course, module, and lesson (if provided) exist
    const course = await db.course.findUnique({
      where: { id: Number(courseId) },
    })

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    const module = await db.module.findUnique({
      where: { id: Number(moduleId) },
      include: {
        lessons: {
          orderBy: {
            order: "asc",
          },
          take: 1,
        },
      },
    })

    if (!module) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 })
    }

    // Create the flashcard with proper relations
    let flashcardData: any = {
      question,
      answer,
      easeFactor: 2.5,
      interval: 0,
      repetitions: 0,
      user: {
        connect: { id: userId },
      },
      course: {
        connect: { id: Number(courseId) },
      },
      module: {
        connect: { id: Number(moduleId) },
      },
    }

    // If lessonId is provided, use that lesson
    if (lessonId) {
      // Verify lesson exists
      const lesson = await db.lesson.findUnique({
        where: { id: Number(lessonId) },
      })

      if (!lesson) {
        return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
      }

      flashcardData.lesson = {
        connect: { id: Number(lessonId) },
      }
    }
    // Otherwise, use the first lesson from the module
    else if (module.lessons && module.lessons.length > 0 && module.lessons[0]) {
      flashcardData.lesson = {
        connect: { id: module.lessons[0].id },
      }
    }
    // If no lessons exist in the module, return an error
    else {
      return NextResponse.json(
        {
          error:
            "No lessons found in this module. A lesson is required to create a flashcard.",
        },
        { status: 400 }
      )
    }

    const flashcard = await db.flashcard.create({
      data: flashcardData,
    })

    console.log(
      `[${new Date().toISOString()}] Manual flashcard created: id=${flashcard.id}, user=${userId}`
    )

    return NextResponse.json({
      success: true,
      message: "Flashcard created successfully",
      flashcard,
    })
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Error creating flashcard:`,
      error
    )
    return NextResponse.json(
      { error: "Failed to create flashcard" },
      { status: 500 }
    )
  }
}
