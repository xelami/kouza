import { auth } from "@/auth"
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
import { ArrowLeft, Clock, GlassWater, Plus, Settings } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import React from "react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@kouza/ui/components/tabs"
import ManageFlashcardsWrapper from "@/components/flashcards/manage-flashcards-wrapper"
import ModuleStats from "@/components/flashcards/module-stats"
import { FlashcardsProvider } from "@/components/flashcards/flashcards-context"
import PracticeFlashcards from "@/components/flashcards/practice-flashcards"

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
export const dynamic = "force-dynamic"

export default async function ModuleFlashcardsPage({
  params,
}: {
  params: Params
}) {
  const session = await auth()
  const { moduleSlug } = await params

  const currentModule = await db.module.findUnique({
    where: { slug: moduleSlug },
    include: {
      flashcards: true,
      course: {
        include: {
          user: true,
        },
      },
    },
  })

  if (!currentModule) {
    return <div>Module not found</div>
  }

  if (!currentModule.course.user) {
    redirect(`/`)
  }

  if (currentModule.course.user.id !== Number(session?.user.id)) {
    redirect(`/`)
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

  const now = new Date()
  const dueFlashcards = currentModule.flashcards.filter(
    (fc: Flashcard) => !fc.nextReview || new Date(fc.nextReview) <= now
  )

  return (
    <FlashcardsProvider>
      <div className="container mx-auto py-6 flex flex-col min-h-[calc(100vh-4rem)]">
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

        <ModuleStats
          moduleId={currentModule.id}
          initialTotalCards={totalCards}
          initialReviewed={reviewed}
          initialToReview={toReview}
        />

        <Tabs defaultValue="review" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="review">Review</TabsTrigger>
            <TabsTrigger value="practice">Practice</TabsTrigger>
            <TabsTrigger value="manage">Manage</TabsTrigger>
          </TabsList>

          <TabsContent value="review">
            <div className="space-y-6">
              {dueFlashcards.length === 0 ? (
                <div className="text-center py-12">
                  <GlassWater className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">All caught up!</h3>
                  <p className="text-muted-foreground mb-6">
                    You've reviewed all your due flashcards for this module.
                  </p>
                  <Link href={`/flashcards/${currentModule.course.slug}`}>
                    <Button variant="outline">Back to Course</Button>
                  </Link>
                </div>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                      <h2 className="text-xl font-medium">Due for Review</h2>
                      <p className="text-muted-foreground">
                        {dueFlashcards.length} flashcards due for review
                      </p>
                    </div>
                    <Link
                      href={`/flashcards/${currentModule.course.slug}/${moduleSlug}/review`}
                    >
                      <Button>Start Review</Button>
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dueFlashcards.map((flashcard) => (
                      <Card key={flashcard.id}>
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
          </TabsContent>

          <TabsContent value="practice">
            {currentModule.flashcards.length === 0 ? (
              <div className="text-center py-12">
                <GlassWater className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No flashcards yet</h3>
                <p className="text-muted-foreground mb-6">
                  This module doesn't have any flashcards to practice with.
                </p>
                <TabsTrigger value="manage" asChild>
                  <Button variant="outline">Create Flashcards</Button>
                </TabsTrigger>
              </div>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-medium">Practice Mode</h2>
                    <p className="text-muted-foreground">
                      Freely browse through all{" "}
                      {currentModule.flashcards.length} flashcards without
                      affecting your progress
                    </p>
                  </div>
                </div>

                <PracticeFlashcards
                  flashcards={currentModule.flashcards.map((fc: any) => ({
                    ...fc,
                    lastReviewed: fc.lastReviewed
                      ? new Date(fc.lastReviewed)
                      : null,
                    nextReview: fc.nextReview ? new Date(fc.nextReview) : null,
                  }))}
                />
              </>
            )}
          </TabsContent>

          <TabsContent value="manage">
            <ManageFlashcardsWrapper
              courseId={currentModule.course.id}
              moduleId={currentModule.id}
              flashcards={currentModule.flashcards.map((fc: any) => ({
                ...fc,
                lastReviewed: fc.lastReviewed
                  ? new Date(fc.lastReviewed)
                  : null,
                nextReview: fc.nextReview ? new Date(fc.nextReview) : null,
              }))}
            />
          </TabsContent>
        </Tabs>

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
    </FlashcardsProvider>
  )
}
