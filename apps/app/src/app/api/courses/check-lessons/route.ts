import { db } from "@kouza/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const moduleId = url.searchParams.get("moduleId")

  if (!moduleId) {
    return NextResponse.json(
      { error: "Module ID is required" },
      { status: 400 }
    )
  }

  try {
    // Check if the module exists and has lessons
    const module = await db.module.findUnique({
      where: { id: Number(moduleId) },
      include: {
        _count: {
          select: { lessons: true },
        },
      },
    })

    if (!module) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 })
    }

    // Return the count of lessons and whether lessons have been created
    return NextResponse.json({
      lessonsCreated: module._count.lessons > 0,
      lessonCount: module._count.lessons,
      moduleId: module.id,
    })
  } catch (error) {
    console.error(`Error checking lessons for module ${moduleId}:`, error)
    return NextResponse.json(
      { error: "Failed to check lesson status" },
      { status: 500 }
    )
  }
}
