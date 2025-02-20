import { getCourseFlashcards } from "@/app/api/flashcards/get-course-flashcards"
import { CardContent, CardFooter } from "@kouza/ui/components/card"
import { Card } from "@kouza/ui/components/card"
import { CardTitle } from "@kouza/ui/components/card"
import { CardHeader } from "@kouza/ui/components/card"
import { Progress } from "@kouza/ui/components/progress"
import { GlassWater } from "lucide-react"
import Link from "next/link"
import React from "react"
import { FlashcardStats, Module } from "@/types/types"

export const runtime = "edge"

export default async function CourseFlashcardsPage({
  params,
}: {
  params: Promise<{ courseSlug: string }>
}) {
  const { courseSlug } = await params
  const courseFlashcards = await getCourseFlashcards(courseSlug)

  const overall = courseFlashcards.modules.reduce<FlashcardStats>(
    (acc: FlashcardStats, module) => {
      const reviewed = module.flashcards.filter(
        (f: { lastReviewed: Date | null }) => f.lastReviewed
      ).length
      const totalCards = module.flashcards.length
      return {
        totalCards: acc.totalCards + totalCards,
        reviewed: acc.reviewed + reviewed,
        toReview: acc.toReview + (totalCards - reviewed),
      }
    },
    { totalCards: 0, reviewed: 0, toReview: 0 }
  )

  const overallProgress =
    overall.totalCards > 0 ? (overall.reviewed / overall.totalCards) * 100 : 0

  return (
    <div className="flex flex-col font-[family-name:var(--font-geist-sans)] h-full">
      <div className="flex flex-col w-full gap-4 p-4 sm:p-6 md:p-8 h-full overflow-y-auto">
        {courseFlashcards && (
          <div className="flex flex-col max-w-4xl gap-2 mb-6 sm:mb-8">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tighter">
              {courseFlashcards.course?.title}
            </h3>
            <span className="text-base sm:text-lg md:text-xl font-light tracking-tighter">
              {courseFlashcards.course?.description}
            </span>

            <div className="mt-4 rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                <span className="text-sm font-medium">
                  {overallProgress.toFixed(0)}%
                </span>
                <span className="text-sm font-medium">
                  {overall.reviewed} / {overall.totalCards} cards reviewed
                </span>
              </div>
              <Progress value={overallProgress} className="h-2" />
              <div className="mt-2 text-sm font-medium">
                {overall.toReview} cards left to review
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-6 sm:my-8">
          {courseFlashcards?.modules.map((module: Module) => {
            const reviewed = module.flashcards.filter(
              (f: { lastReviewed: Date | null }) => f.lastReviewed
            ).length
            const totalCards = module.flashcards.length
            const toReview = totalCards - reviewed

            return (
              <Link
                key={module.id}
                href={`/flashcards/${courseSlug}/${module.slug}`}
                className="transition-transform hover:scale-[1.02]"
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl line-clamp-2">
                      {module.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-2">
                      <span className="text-sm font-medium">
                        {((reviewed / totalCards) * 100).toFixed(0)}%
                      </span>
                      <span className="text-sm font-medium">
                        {reviewed} / {totalCards} cards reviewed
                      </span>
                    </div>
                    <Progress
                      value={(reviewed / totalCards) * 100}
                      className="h-2"
                    />
                  </CardContent>
                  <CardFooter>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <GlassWater className="w-5 h-5" />
                      {toReview} to review
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
