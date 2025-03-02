"use client"

import { getFlashcards } from "@/app/api/flashcards/get-all-flashcards"
import {
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from "@kouza/ui/components/card"
import { Progress } from "@kouza/ui/components/progress"
import { Card } from "@kouza/ui/components/card"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { GlassWater } from "lucide-react"

export const runtime = "edge"

export default function FlashcardsPage() {
  const [flashcards, setFlashcards] = useState<any[]>([])

  useEffect(() => {
    const fetchFlashcards = async () => {
      const flashcards = await getFlashcards()
      setFlashcards(flashcards)
    }
    fetchFlashcards()
  }, [])

  return (
    <div className="flex flex-col font-[family-name:var(--font-geist-sans)] h-full p-6 px-4 overflow-y-auto">
      <div className="flex flex-col items-center mx-auto max-w-4xl w-full gap-4 py-12 h-full">
        {flashcards &&
          flashcards.map((flashcard) => (
            <Link
              className="w-full"
              href={`/flashcards/${flashcard.course.slug}`}
              key={flashcard.course.id}
            >
              <Card className="col-span-1 row-span-1" key={flashcard.id}>
                <CardHeader className="gap-2">
                  <CardTitle>{flashcard.course.title}</CardTitle>
                  <CardDescription>
                    {flashcard.course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-sm font-medium">
                      {(flashcard.reviewed / flashcard.totalCards) * 100}%
                    </span>
                    <span className="text-sm font-medium">
                      {flashcard.reviewed} / {flashcard.totalCards} cards
                      reviewed
                    </span>
                  </div>
                  <Progress
                    value={(flashcard.reviewed / flashcard.totalCards) * 100}
                  />
                </CardContent>
                <CardFooter>
                  <div className="flex items-center gap-2">
                    <GlassWater className="w-6 h-6" />
                    {flashcard.toReview} to review
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
      </div>
    </div>
  )
}
