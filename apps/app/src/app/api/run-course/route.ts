import { NextResponse } from "next/server"
import { newCourse } from "@/app/api/courses/new-course"
import { auth } from "@/auth"

export const runtime = "edge"

export async function POST(request: Request) {
  const { prompt, userId } = await request.json()

  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "Invalid prompt" }, { status: 400 })
  }

  const taskPromise = newCourse(prompt, userId).catch((error) => {
    console.error("Course creation failed:", error)
  })

  // Return immediately (within 100 seconds)
  return NextResponse.json({ message: "Task started" }, { status: 202 })
}
