import React from "react"
import { getLesson } from "@/app/api/courses/get-lesson"
import MarkdownRenderer from "@/components/review/markdown-renderer"
import QuizComponent from "@/components/review/quiz"

export default async function ReviewPage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = await params

  if (!id) {
    return null
  }

  const lesson = await getLesson(Number(id))

  return (
    <div className="flex flex-col font-[family-name:var(--font-geist-sans)] h-full">
      <div className="flex flex-col px-8 max-w-[1050px]">
        <MarkdownRenderer content={lesson?.content || ""} />
        <div className="flex flex-col items-center">
          <QuizComponent quiz={lesson?.quiz} />
        </div>
      </div>
    </div>
  )
}
