"use client"

import { useState, useEffect } from "react"
import ManageFlashcards from "./manage-flashcards"
import { toast } from "sonner"
import { useFlashcards } from "./flashcards-context"

interface Flashcard {
  id: number
  question: string
  answer: string
  easeFactor: number
  interval: number
  repetitions: number
  lastReviewed: string | null
  nextReview: string | null
}

interface ManageFlashcardsWrapperProps {
  courseId: number
  moduleId: number
  lessonId?: number
  flashcards: Flashcard[]
}

export default function ManageFlashcardsWrapper({
  courseId,
  moduleId,
  lessonId,
  flashcards: initialFlashcards,
}: ManageFlashcardsWrapperProps) {
  const { triggerStatsRefresh } = useFlashcards()
  const [flashcards, setFlashcards] = useState<Flashcard[]>(initialFlashcards)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch flashcards when component mounts or when moduleId changes
  useEffect(() => {
    fetchFlashcards()
  }, [moduleId])

  const fetchFlashcards = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `/api/flashcards/get-flashcards?moduleId=${moduleId}`
      )
      if (response.ok) {
        const data = await response.json()
        setFlashcards(data.flashcards || [])
        // Trigger stats refresh when flashcards are fetched
        triggerStatsRefresh()
      } else {
        toast.error("Failed to load flashcards")
      }
    } catch (error) {
      console.error("Error fetching flashcards:", error)
      toast.error("Error loading flashcards")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFlashcardsChanged = () => {
    fetchFlashcards()
    // Trigger stats refresh when flashcards are changed
    triggerStatsRefresh()
  }

  return (
    <div className="mt-4">
      {isLoading ? (
        <div className="text-center py-8">Loading flashcards...</div>
      ) : (
        <ManageFlashcards
          flashcards={flashcards}
          courseId={courseId}
          moduleId={moduleId}
          lessonId={lessonId}
          onFlashcardsChanged={handleFlashcardsChanged}
        />
      )}
    </div>
  )
}
