import { auth } from "@/auth"
import { db } from "@kouza/db"
import { NextResponse } from "next/server"

export const runtime = "edge"

export async function POST(req: Request) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { title, targetType, targetValue } = await req.json()

  const goal = await db.learningGoal.create({
    data: { userId: Number(session.user.id), title, targetType, targetValue },
  })
  return NextResponse.json(goal)
}
