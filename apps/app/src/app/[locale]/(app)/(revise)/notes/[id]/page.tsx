import React from "react"
import { db } from "@kouza/db"
import MarkdownRenderer from "@/components/review/markdown-renderer"
import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/auth"

export const runtime = "edge"

export default async function NotePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  const { id } = await params

  const note = await db.note.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      module: true,
      lesson: true,
      course: true,
    },
  })

  if (!note) {
    return <div>Note not found</div>
  }

  if (note.userId !== Number(session?.user.id)) {
    redirect(`/`)
  }

  return (
    <div className="flex flex-col font-[family-name:var(--font-geist-sans)] h-full p-6 px-4">
      <div>
        <div className="flex gap-8 mt-4 tracking-tight">
          <div className="flex flex-col items-center gap-2">
            <Link
              className="flex flex-col items-center"
              href={`/course/${note.course.id}`}
            >
              <span className="text-gray-500 font-semibold uppercase">
                Course
              </span>
              <h3 className="text-md font-semibold">{note.course.title}</h3>
            </Link>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Link
              className="flex flex-col items-center"
              href={`/course/${note.course.id}/modules/${note.module.id}`}
            >
              <span className="text-gray-500 font-semibold uppercase">
                Module
              </span>
              <h3 className="text-md font-semibold">{note.module.title}</h3>
            </Link>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Link
              className="flex flex-col items-center"
              href={`/course/${note.course.id}/modules/${note.module.id}/review/${note.lessonId}`}
            >
              <span className="text-gray-500 font-semibold uppercase">
                Lesson
              </span>
              <h3 className="text-md font-semibold">{note.lesson.title}</h3>
            </Link>
          </div>
        </div>
        <div className="max-w-5xl">
          <MarkdownRenderer content={note?.content} />
        </div>
      </div>
    </div>
  )
}
