import { db } from "@kouza/db"
import React from "react"
import ReviewFlashcards from "@/components/flashcards/review-flashcards"

export const runtime = "edge"

interface Params {
  courseSlug: string
  moduleSlug: string
}

export default async function ReviewPage({ params }: { params: Params }) {
  const { moduleSlug } = await params
  const now = new Date()

  const module = await db.module.findUnique({
    where: { slug: moduleSlug },
    include: {
      flashcards: {
        where: {
          OR: [{ nextReview: null }, { nextReview: { lte: now } }],
        },
        include: {
          user: true,
        },
      },
      course: true,
    },
  })

  if (!module || !module.flashcards.length) {
    return <div>No flashcards due for review.</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-6 flex flex-col items-center justify-center h-full w-full">
      {/* @ts-ignore */}
      <ReviewFlashcards flashcards={module.flashcards} />
    </div>
  )
}
