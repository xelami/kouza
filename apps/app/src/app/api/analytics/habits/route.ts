import { auth } from "@/auth"
import { db } from "@kouza/db"
import { NextResponse } from "next/server"

export const runtime = "edge"

export async function GET(req: Request) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const sessions = await db.studySession.groupBy({
    by: ["startTime"],
    where: { userId: Number(session.user.id) },
    _sum: { duration: true },
    _count: { id: true },
  })
  return NextResponse.json(sessions)
}
