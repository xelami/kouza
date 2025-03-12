import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { newCourse } from "../courses/new-course"
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

  newCourse(prompt, userId)
    .then(() => console.log("Course creation completed successfully"))
    .catch((error) => console.error("Course creation failed:", error))

  return NextResponse.json(
    { message: "Course creation started" },
    { status: 202 }
  )
}
