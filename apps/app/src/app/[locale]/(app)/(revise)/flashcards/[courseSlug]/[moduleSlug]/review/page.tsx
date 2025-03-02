import { db } from "@kouza/db"
import React from "react"
import ReviewFlashcards from "@/components/flashcards/review-flashcards"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { FlashcardsProvider } from "@/components/flashcards/flashcards-context"
export const runtime = "edge"

interface Params {
  courseSlug: string
  moduleSlug: string
}

export default async function ReviewPage({ params }: { params: Params }) {
  const session = await auth()
  if (!session?.user) {
    redirect("/login")
  }

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
      course: {
        include: {
          user: true,
        },
      },
    },
  })

  if (!module || !module.flashcards.length) {
    return <div>No flashcards due for review.</div>
  }

  if (!module.course.user) {
    redirect(`/`)
  }

  if (module.course.user.id !== Number(session?.user.id)) {
    redirect(`/`)
  }

  return (
    <FlashcardsProvider>
      <div className="max-w-4xl mx-auto p-6 flex flex-col items-center justify-center w-full">
        <ReviewFlashcards
          // @ts-expect-error
          flashcards={module.flashcards}
          courseId={module.course.id}
          moduleId={module.id}
        />
      </div>
    </FlashcardsProvider>
  )
}
