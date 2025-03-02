import { auth } from "@/auth"
import { db } from "@kouza/db"
import { NextResponse } from "next/server"

export const runtime = "edge"

export async function GET(req: Request) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const progress = await db.progressRecord.findMany({
    where: { userId: Number(session.user.id) },
    select: {
      quizScore: true,
      retentionRate: true,
      recordedAt: true,
      course: { select: { title: true } },
    },
  })
  return NextResponse.json(progress)
}
