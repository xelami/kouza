import { NextResponse } from "next/server"
import { db } from "@kouza/db"
import { auth } from "@/auth"

export const runtime = "edge"

export async function GET(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { sessionId } = params

    // Fetch the study session from the database
    const studySession = await db.studySession.findUnique({
      where: {
        id: parseInt(sessionId),
      },
      include: {
        // Include any related data you need
      },
    })

    if (!studySession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    // For now, we'll return mock data since we're storing the stats in memory
    // In a real implementation, you would store this data in the database
    // and retrieve it here

    // This is temporary - in production, this data should come from the database
    const mockStats = {
      total: 10,
      again: 2,
      hard: 1,
      good: 5,
      easy: 2,
      averageTimePerCard: 15,
      totalTimeSpent: 150,
    }

    const mockReviewData = [
      {
        cardId: 1,
        question: "What is the capital of France?",
        answer: "Paris",
        performance: "easy",
        timeSpent: 8,
      },
      {
        cardId: 2,
        question: "What is 2+2?",
        answer: "4",
        performance: "easy",
        timeSpent: 5,
      },
      {
        cardId: 3,
        question: "What is the largest planet in our solar system?",
        answer: "Jupiter",
        performance: "good",
        timeSpent: 12,
      },
      {
        cardId: 4,
        question: "Who wrote Romeo and Juliet?",
        answer: "William Shakespeare",
        performance: "good",
        timeSpent: 15,
      },
      {
        cardId: 5,
        question: "What is the chemical symbol for gold?",
        answer: "Au",
        performance: "good",
        timeSpent: 20,
      },
      {
        cardId: 6,
        question: "What is the square root of 144?",
        answer: "12",
        performance: "good",
        timeSpent: 18,
      },
      {
        cardId: 7,
        question: "What is the main component of the Earth's atmosphere?",
        answer: "Nitrogen",
        performance: "good",
        timeSpent: 25,
      },
      {
        cardId: 8,
        question: "What is the boiling point of water in Celsius?",
        answer: "100°C",
        performance: "hard",
        timeSpent: 22,
      },
      {
        cardId: 9,
        question: "Who painted the Mona Lisa?",
        answer: "Leonardo da Vinci",
        performance: "again",
        timeSpent: 15,
      },
      {
        cardId: 10,
        question: "What is the capital of Japan?",
        answer: "Tokyo",
        performance: "again",
        timeSpent: 10,
      },
    ]

    return NextResponse.json({
      sessionId,
      stats: mockStats,
      reviewData: mockReviewData,
    })
  } catch (error) {
    console.error("Error fetching session data:", error)
    return NextResponse.json(
      { error: "Failed to fetch session data" },
      { status: 500 }
    )
  }
}
