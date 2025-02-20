"use client"

import React, { useEffect, useState, useRef } from "react"
import { Button } from "@kouza/ui/components/button"
import confetti from "canvas-confetti"
import {
  updateFlashcardReview,
  updateUserPoints,
} from "@/app/api/flashcards/update-flashcard"
import { useRouter } from "next/navigation"

interface Flashcard {
  user: any
  id: number
  question: string
  answer: string
  easeFactor: number
  interval: number
  repetitions: number
  lastReviewed: string | null
  nextReview: string | null
}

type ReviewOption = "again" | "hard" | "good" | "easy"

interface ReviewFlashcardsProps {
  flashcards: Flashcard[]
  onComplete?: () => void
}

const successSound =
  typeof Audio !== "undefined"
    ? new Audio("./../../../sounds/success.mp3")
    : null

export default function ReviewFlashcards({
  flashcards,
  onComplete,
}: ReviewFlashcardsProps) {
  const [cards, setCards] = useState<Flashcard[]>(flashcards)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const router = useRouter()

  useEffect(() => {
    if (cards.length === 0) {
      router.back()
    }
  }, [cards, router])

  const currentCard = cards[currentIndex]

  if (!currentCard) {
    return <div>No flashcards to review.</div>
  }

  const handleReveal = () => {
    setShowAnswer(true)
  }

  const updateFlashcard = async (cardId: number, data: Partial<Flashcard>) => {
    await updateFlashcardReview(cardId, data)
  }

  const playSuccessSound = () => {
    if (successSound) {
      successSound.currentTime = 0
      successSound.play().catch((e) => console.log("Audio play failed:", e))
    }
  }

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 140,
    })
  }

  const handleOption = async (option: ReviewOption) => {
    if (option === "good" || option === "easy") {
      playSuccessSound()
      triggerConfetti()
    }

    let newEase = currentCard?.easeFactor
    let newReps = currentCard?.repetitions
    let newInterval = currentCard?.interval
    const now = new Date()

    if (option === "again" || option === "hard") {
      if (option === "again") {
        newEase = Math.max(currentCard.easeFactor - 0.2, 1.3)
        newReps = 0
      } else {
        newEase = Math.max(currentCard.easeFactor - 0.1, 1.3)
        newReps = currentCard.repetitions
      }

      const updateData = {
        easeFactor: newEase,
        repetitions: newReps,
        interval: newInterval,
        lastReviewed: now.toISOString(),
      }

      await updateFlashcard(currentCard.id, updateData)

      const remainingCards = cards.filter((card) => card.id !== currentCard.id)

      const minPosition = option === "again" ? 1 : 5
      const maxPosition = option === "again" ? 3 : 7
      const insertPosition = Math.min(
        remainingCards.length,
        Math.floor(Math.random() * (maxPosition - minPosition + 1)) +
          minPosition
      )

      const newCards = [
        ...remainingCards.slice(0, insertPosition),
        currentCard,
        ...remainingCards.slice(insertPosition),
      ]

      setCards(newCards)
      setCurrentIndex(0)
    } else {
      let newReps = currentCard.repetitions + 1
      if (newReps === 1) {
        newInterval = 1
      } else if (newReps === 2) {
        newInterval = 6
      } else {
        newInterval = currentCard.interval * currentCard.easeFactor
      }
      if (option === "easy") {
        newEase = currentCard.easeFactor + 0.15
        newInterval = Math.max(newInterval, 1)
        await updateUserPoints(currentCard.user.id, 20)
      }

      const nextReviewDate = new Date(
        now.getTime() + newInterval * 24 * 60 * 60 * 1000
      )
      const updateData = {
        easeFactor: newEase,
        repetitions: newReps,
        interval: newInterval,
        nextReview: nextReviewDate.toISOString(),
        lastReviewed: now.toISOString(),
      }

      await updateFlashcard(currentCard.id, updateData)
      await updateUserPoints(currentCard.user.id, 10)

      const newCards = cards.filter((card) => card.id !== currentCard.id)
      setCards(newCards)
      if (newCards.length === 0 && onComplete) {
        onComplete()
      } else {
        setCurrentIndex((prev) => (prev >= newCards.length ? 0 : prev))
      }
    }

    setShowAnswer(false)
  }

  return (
    <div className="border p-6 rounded-lg shadow-md mb-8 w-full">
      <h2 className="text-3xl tracking-tighter text-center font-medium mb-4">
        {currentCard.question}
      </h2>

      {!showAnswer ? (
        <div className="mt-4 flex justify-center">
          <Button onClick={handleReveal}>Show Answer</Button>
        </div>
      ) : (
        <>
          <h2 className="text-2xl tracking-tight text-center font-light my-12">
            {currentCard.answer}
          </h2>

          <div className="mt-4 flex justify-center gap-8">
            <Button onClick={() => handleOption("again")}>Again</Button>
            <Button onClick={() => handleOption("hard")}>Hard</Button>
            <Button onClick={() => handleOption("good")}>Good</Button>
            <Button onClick={() => handleOption("easy")}>Easy</Button>
          </div>
        </>
      )}

      <div className="mt-6 text-sm text-gray-600">
        Flashcard {currentIndex + 1} of {cards.length}
      </div>
    </div>
  )
}
