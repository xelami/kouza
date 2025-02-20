import { formatNextReview } from "@/lib/utils"
import { db } from "@kouza/db"
import { Button } from "@kouza/ui/components/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@kouza/ui/components/card"
import { Progress } from "@kouza/ui/components/progress"
import { ArrowLeft, Clock, GlassWater } from "lucide-react"
import Link from "next/link"
import React from "react"

interface Params {
  moduleSlug: string
}

interface Flashcard {
  id: number
  question: string
  answer: string
  lastReviewed: Date | null
  nextReview: Date | null
}

export const runtime = "edge"

export default async function ModuleFlashcardsPage({
  params,
}: {
  params: Params
}) {
  const { moduleSlug } = await params

  const currentModule = await db.module.findUnique({
    where: { slug: moduleSlug },
    include: {
      flashcards: true,
      course: true,
    },
  })

  if (!currentModule) {
    return <div>Module not found</div>
  }

  const modules = await db.module.findMany({
    where: { course: { slug: currentModule.course.slug } },
    orderBy: { order: "asc" },
  })

  const currentIndex = modules.findIndex((m) => m.id === currentModule.id)
  const prevModule = currentIndex > 0 ? modules[currentIndex - 1] : null
  const nextModule =
    currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null

  const totalCards = currentModule.flashcards.length
  const reviewed = currentModule.flashcards.filter(
    (fc: Flashcard) => fc.lastReviewed !== null
  ).length
  const toReview = totalCards - reviewed
  const progressPercent = totalCards > 0 ? (reviewed / totalCards) * 100 : 0

  const now = new Date()
  const cardsToReview = currentModule.flashcards.filter(
    (fc: Flashcard) => !fc.nextReview || new Date(fc.nextReview) <= now
  ).length

  return (
    <div className="flex flex-col h-full p-4 sm:p-6 md:p-8">
      <Link
        className="flex items-center gap-2 mb-4 sm:mb-6 text-sm sm:text-base hover:text-primary transition-colors"
        href={`/flashcards/${currentModule.course.slug}`}
      >
        <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5" />
        Back to Course
      </Link>

      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight">
          {currentModule.course?.title}
        </h1>
      </div>

      <div className="mt-4 p-4 rounded-lg bg-muted/40">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
          <span className="text-sm font-medium">
            {progressPercent.toFixed(0)}%
          </span>
          <span className="text-sm font-medium">
            {reviewed} / {totalCards} cards reviewed
          </span>
        </div>
        <Progress value={progressPercent} className="h-2" />
        <div className="mt-2 text-sm font-medium flex items-center gap-2">
          <GlassWater className="w-4 sm:w-5 h-4 sm:h-5" />
          <span>{toReview} cards to revise</span>
        </div>
      </div>

      <div className="my-6 sm:my-8">
        {currentModule.flashcards.length === 0 ? (
          <p className="text-muted-foreground">
            No flashcards for this module.
          </p>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg font-semibold">
                ({currentModule.flashcards.length}) Flashcards
              </h2>
              {cardsToReview === 0 ? (
                <Button disabled variant="outline" className="w-full sm:w-auto">
                  No Cards to Review
                </Button>
              ) : (
                <Button asChild className="w-full sm:w-auto">
                  <Link
                    href={`/flashcards/${currentModule.course.slug}/${currentModule.slug}/review`}
                  >
                    Review
                  </Link>
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4">
              {currentModule.flashcards.map((flashcard: Flashcard) => (
                <Card
                  key={flashcard.id}
                  className="border hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">
                      {flashcard.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      {flashcard.answer}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {flashcard.nextReview
                        ? formatNextReview(flashcard.nextReview)
                        : "Not scheduled"}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 mt-auto pt-4 border-t">
        {prevModule ? (
          <Link
            href={`/flashcards/${currentModule.course.slug}/${prevModule.slug}`}
            className="w-full sm:w-auto"
          >
            <Button variant="outline" className="w-full sm:w-auto">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="truncate">
                <span className="text-muted-foreground mr-2">Previous:</span>
                {prevModule.title}
              </span>
            </Button>
          </Link>
        ) : (
          <div />
        )}
        {nextModule && (
          <Link
            href={`/flashcards/${currentModule.course.slug}/${nextModule.slug}`}
            className="w-full sm:w-auto sm:ml-auto"
          >
            <Button variant="outline" className="w-full sm:w-auto">
              <span className="truncate">
                <span className="text-muted-foreground mr-2">Next:</span>
                {nextModule.title}
              </span>
              <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
