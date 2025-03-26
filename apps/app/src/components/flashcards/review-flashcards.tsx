"use client"

import React, { useEffect, useState, useRef } from "react"
import { Button } from "@kouza/ui/components/button"
import confetti from "canvas-confetti"
import {
  updateFlashcardReview,
  updateUserPoints,
} from "@/app/api/flashcards/update-flashcard"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@kouza/ui/components/card"
import { BarChart, Clock, CheckCircle, XCircle } from "lucide-react"
import { useFlashcards } from "./flashcards-context"

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
  courseId: number
  moduleId: number
}

const successSound =
  typeof Audio !== "undefined" ? new Audio("./success.mp3") : null

export default function ReviewFlashcards({
  flashcards,
  courseId,
  moduleId,
  onComplete,
}: ReviewFlashcardsProps) {
  const { triggerStatsRefresh } = useFlashcards()
  const [cards, setCards] = useState<Flashcard[]>(flashcards)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [sessionId, setSessionId] = useState<number | null>(null)
  const [sessionCreated, setSessionCreated] = useState(false)
  const [sessionEnded, setSessionEnded] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const creatingSessionRef = useRef(false)
  const [stats, setStats] = useState({
    total: flashcards.length,
    again: 0,
    hard: 0,
    good: 0,
    easy: 0,
    averageTimePerCard: 0,
    totalTimeSpent: 0,
  })
  const [cardStartTime, setCardStartTime] = useState<number>(Date.now())
  const [reviewData, setReviewData] = useState<
    Array<{
      cardId: number
      question: string
      answer: string
      performance: ReviewOption
      timeSpent: number
    }>
  >([])

  const router = useRouter()

  useEffect(() => {
    setCardStartTime(Date.now())
  }, [currentIndex, cards])

  useEffect(() => {
    if (sessionCreated || creatingSessionRef.current) return

    const createSession = async () => {
      creatingSessionRef.current = true

      try {
        console.log("Creating study session")
        const response = await fetch("/api/study-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseId,
            moduleId,
            startTime: Date.now(),
          }),
        })

        if (!response.ok) {
          throw new Error(`Failed to create session: ${response.status}`)
        }

        const data = await response.json()
        console.log("Session created with ID:", data.id)
        setSessionId(data.id)
        setSessionCreated(true)
      } catch (error) {
        console.error("Error creating session:", error)
        creatingSessionRef.current = false
      }
    }

    createSession()

    return () => {
      if (sessionId && !sessionEnded) {
        console.log("Ending session on unmount:", sessionId)
        fetch("/api/study-session/end", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          keepalive: true,
          body: JSON.stringify({
            sessionId: sessionId,
            stats: stats,
            reviewData: reviewData,
          }),
        }).catch((e) => {
          console.error("Failed to end session:", e)
        })
      }
    }
  }, [
    courseId,
    moduleId,
    sessionId,
    sessionCreated,
    sessionEnded,
    stats,
    reviewData,
  ])

  useEffect(() => {
    if (cards.length === 0 && sessionId && !sessionEnded) {
      const endSession = async () => {
        try {
          console.log("Ending session:", sessionId)
          const response = await fetch("/api/study-session/end", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId: sessionId,
              stats: stats,
              reviewData: reviewData,
            }),
          })

          if (response.ok) {
            console.log("Session ended successfully")
            setSessionEnded(true)
            // Trigger stats refresh when session ends and ensure it has time to work
            triggerStatsRefresh()
          } else {
            console.error("Failed to end session:", response.status)
          }
        } catch (error) {
          console.error("Error ending session:", error)
        }
      }

      endSession()
    }
  }, [cards, sessionId, sessionEnded, stats, reviewData, triggerStatsRefresh])

  const currentCard = cards[currentIndex]

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds} sec`

    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    if (minutes < 60) {
      return `${minutes}m ${remainingSeconds}s`
    }

    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}m ${remainingSeconds}s`
  }

  const handleReturnToCourse = () => {
    // Trigger stats refresh before navigating back
    triggerStatsRefresh()
    // Add small delay to ensure the stats refresh is triggered before navigation
    setTimeout(() => {
      router.back()
    }, 300)
  }

  if (!currentCard) {
    const totalAnswered = stats.again + stats.hard + stats.good + stats.easy
    const correctPercentage =
      Math.round(((stats.good + stats.easy) / totalAnswered) * 100) || 0
    const incorrectPercentage = 100 - correctPercentage

    // Calculate unique card statistics
    const uniqueCards = new Set(reviewData.map((item) => item.cardId)).size

    // Get first review for each unique card to calculate initial performance
    const firstReviewByCard = new Map()
    reviewData.forEach((item) => {
      if (!firstReviewByCard.has(item.cardId)) {
        firstReviewByCard.set(item.cardId, item.performance)
      }
    })

    // Count initial performances
    const initialPerformances = Array.from(firstReviewByCard.values())
    const initialEasy = initialPerformances.filter((p) => p === "easy").length
    const initialGood = initialPerformances.filter((p) => p === "good").length
    const initialHard = initialPerformances.filter((p) => p === "hard").length
    const initialAgain = initialPerformances.filter((p) => p === "again").length

    // Calculate percentages based on initial performance
    const initialEasyPercentage =
      Math.round((initialEasy / uniqueCards) * 100) || 0
    const initialGoodPercentage =
      Math.round((initialGood / uniqueCards) * 100) || 0
    const initialHardPercentage =
      Math.round((initialHard / uniqueCards) * 100) || 0
    const initialAgainPercentage =
      Math.round((initialAgain / uniqueCards) * 100) || 0

    // Calculate correct vs needs review based on initial performance
    const initialCorrectPercentage =
      Math.round(((initialGood + initialEasy) / uniqueCards) * 100) || 0
    const initialNeedsReviewPercentage =
      Math.round(((initialHard + initialAgain) / uniqueCards) * 100) || 0

    // For final status, use the most recent performance for each card
    const uniqueCardsMarkedEasy = new Set(
      reviewData
        .filter((item) => item.performance === "easy")
        .map((item) => item.cardId)
    ).size
    const uniqueCardsMarkedGood = new Set(
      reviewData
        .filter((item) => item.performance === "good")
        .map((item) => item.cardId)
    ).size
    const uniqueCardsMarkedHard = new Set(
      reviewData
        .filter((item) => item.performance === "hard")
        .map((item) => item.cardId)
    ).size
    const uniqueCardsMarkedAgain = new Set(
      reviewData
        .filter((item) => item.performance === "again")
        .map((item) => item.cardId)
    ).size

    // Calculate final performance percentages
    const finalCorrectPercentage =
      Math.round(
        ((uniqueCardsMarkedGood + uniqueCardsMarkedEasy) / uniqueCards) * 100
      ) || 0
    const finalNeedsReviewPercentage =
      Math.round(
        ((uniqueCardsMarkedHard + uniqueCardsMarkedAgain) / uniqueCards) * 100
      ) || 0

    // Calculate improvement
    const improvementPercentage =
      finalCorrectPercentage - initialCorrectPercentage

    // Calculate repeated cards
    const repeatedCards = totalAnswered - uniqueCards
    const repeatedCardsPercentage =
      Math.round((repeatedCards / uniqueCards) * 100) || 0

    return (
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 overflow-y-auto">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <BarChart className="h-5 w-5 mr-2" />
                Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-3xl font-bold text-green-500">
                    {initialCorrectPercentage}%
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Initially Correct
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-3xl font-bold text-red-500">
                    {initialNeedsReviewPercentage}%
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Initially Needed Review
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    Easy
                  </span>
                  <span className="font-medium">
                    {initialEasy} ({initialEasyPercentage}%)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    Good
                  </span>
                  <span className="font-medium">
                    {initialGood} ({initialGoodPercentage}%)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    Hard
                  </span>
                  <span className="font-medium">
                    {initialHard} ({initialHardPercentage}%)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    Again
                  </span>
                  <span className="font-medium">
                    {initialAgain} ({initialAgainPercentage}%)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Time Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-3xl font-bold">
                    {formatTime(stats.totalTimeSpent)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Total Time
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-3xl font-bold">
                    {formatTime(stats.averageTimePerCard)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Avg. per Card
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Session Insights</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      You reviewed <strong>{uniqueCards}</strong> unique cards
                      with <strong>{totalAnswered}</strong> total reviews
                    </span>
                  </li>
                  {repeatedCards > 0 && (
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>{repeatedCards}</strong> reviews were on
                        repeated cards ({repeatedCardsPercentage}% of unique
                        cards needed multiple reviews)
                      </span>
                    </li>
                  )}
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      Initially, <strong>{initialCorrectPercentage}%</strong> of
                      cards were marked as correct (Good or Easy)
                    </span>
                  </li>
                  {uniqueCardsMarkedGood + uniqueCardsMarkedEasy >
                    initialGood + initialEasy && (
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        After review, <strong>{finalCorrectPercentage}%</strong>{" "}
                        of cards ended with correct status
                        {improvementPercentage > 0 && (
                          <span className="ml-1 text-green-600">
                            (+{improvementPercentage}% improvement)
                          </span>
                        )}
                      </span>
                    </li>
                  )}
                  {initialAgain > 0 && (
                    <li className="flex items-start">
                      <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>{initialAgainPercentage}%</strong> of cards
                        initially needed more review
                      </span>
                    </li>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {reviewData.length > 0 && (
          <Card className="mb-8">
            <CardHeader className="pb-2">
              <CardTitle>Card Review Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                <table className="w-full border-collapse">
                  <thead className="sticky top-0 bg-white dark:bg-gray-950">
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Question</th>
                      <th className="text-left py-2 px-4">Answer</th>
                      <th className="text-left py-2 px-4">Performance</th>
                      <th className="text-left py-2 px-4">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviewData.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="py-3 px-4">{item.question}</td>
                        <td className="py-3 px-4">{item.answer}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item.performance === "easy"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : item.performance === "good"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                  : item.performance === "hard"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            }`}
                          >
                            {item.performance}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {formatTime(item.timeSpent)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-center sticky bottom-0 py-4">
          <Button onClick={handleReturnToCourse}>Return to Course</Button>
        </div>
      </div>
    )
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
    const timeSpent = Math.round((Date.now() - cardStartTime) / 1000)

    setStats((prevStats) => {
      const newStats = {
        ...prevStats,
        [option]: prevStats[option] + 1,
        totalTimeSpent: prevStats.totalTimeSpent + timeSpent,
        averageTimePerCard: Math.round(
          (prevStats.totalTimeSpent + timeSpent) /
            (prevStats.again +
              prevStats.hard +
              prevStats.good +
              prevStats.easy +
              1)
        ),
      }
      return newStats
    })

    setReviewData((prevData) => [
      ...prevData,
      {
        cardId: currentCard.id,
        question: currentCard.question,
        answer: currentCard.answer,
        performance: option,
        timeSpent: timeSpent,
      },
    ])

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
    }

    setShowAnswer(false)
    setCardStartTime(Date.now())
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
