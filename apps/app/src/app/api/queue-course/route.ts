import { NextResponse } from "next/server"
import { auth } from "@/auth"
export const runtime = "edge"

export async function POST(request: Request, { params }: { params: any }) {
  const { prompt } = await request.json()

  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "Invalid prompt" }, { status: 400 })
  }

  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    )
  }

  fetch("/api/run-course", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, userId }),
    keepalive: true,
  }).catch((error) => {
    console.error("Failed to trigger background task:", error)
  })

  return NextResponse.json(
    { message: "Course creation started" },
    { status: 202 }
  )
}
