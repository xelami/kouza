"use client"

import React, { useState } from "react"
import { Button } from "@kouza/ui/components/button"
import { Card } from "@kouza/ui/components/card"
import { ArrowLeft, ArrowRight, Repeat } from "lucide-react"

interface Flashcard {
  id: number
  question: string
  answer: string
  lastReviewed: Date | null
  nextReview: Date | null
}

interface PracticeFlashcardsProps {
  flashcards: Flashcard[]
}

export default function PracticeFlashcards({
  flashcards,
}: PracticeFlashcardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [shuffled, setShuffled] = useState(false)
  const [cards, setCards] = useState(flashcards)

  const currentCard = cards[currentIndex]

  const goToNextCard = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setShowAnswer(false)
    }
  }

  const goToPrevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setShowAnswer(false)
    }
  }

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer)
  }

  const shuffleCards = () => {
    const shuffledCards = [...cards].sort(() => Math.random() - 0.5)
    setCards(shuffledCards)
    setCurrentIndex(0)
    setShowAnswer(false)
    setShuffled(true)
  }

  const resetOrder = () => {
    setCards(flashcards)
    setCurrentIndex(0)
    setShowAnswer(false)
    setShuffled(false)
  }

  if (flashcards.length === 0) {
    return (
      <div className="text-center py-12">
        <p>No flashcards available for practice.</p>
      </div>
    )
  }

  if (!currentCard) {
    return (
      <div className="text-center py-12">
        <p>Error loading flashcard data.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-2xl mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-muted-foreground">
            Card {currentIndex + 1} of {cards.length}
          </div>
          <div className="flex gap-2">
            {shuffled ? (
              <Button variant="outline" size="sm" onClick={resetOrder}>
                Reset Order
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={shuffleCards}>
                <Repeat className="h-4 w-4 mr-2" />
                Shuffle
              </Button>
            )}
          </div>
        </div>

        <Card
          className={`w-full p-6 min-h-[300px] flex flex-col justify-center items-center cursor-pointer transition-all duration-300 ${
            showAnswer ? "bg-muted/30" : ""
          }`}
          onClick={toggleAnswer}
        >
          <div className="text-center">
            <div className="mb-4 text-sm text-muted-foreground">
              {showAnswer ? "Answer" : "Question"}
            </div>
            <div className="text-xl font-medium">
              {showAnswer ? currentCard.answer : currentCard.question}
            </div>
            <div className="mt-6 text-sm text-muted-foreground">
              Click to {showAnswer ? "see question" : "reveal answer"}
            </div>
          </div>
        </Card>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={goToPrevCard}
            disabled={currentIndex === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={goToNextCard}
            disabled={currentIndex === cards.length - 1}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
