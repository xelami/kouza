"use client"

import { Button } from "@kouza/ui/components/button"
import { useState, useEffect, useRef } from "react"
import { Quiz } from "@/types/types"
import { toast } from "sonner"

export default function QuizComponent({
  quiz,
  courseId,
  moduleId,
}: {
  quiz: Quiz
  courseId?: number
  moduleId?: number
}) {
  const [quizStarted, setQuizStarted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [quizEnded, setQuizEnded] = useState(false)
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false)
  const progressUpdatedRef = useRef(false)

  function handleAnswer(answer: string) {
    const question = quiz.questions[currentQuestionIndex]
    if (!question) return

    const correctAnswer = question.options[question.correctAnswer]
    if (!correctAnswer) return

    if (correctAnswer === answer) {
      setCorrectAnswers(correctAnswers + 1)
    }

    setCurrentQuestionIndex(currentQuestionIndex + 1)

    if (currentQuestionIndex + 1 === quiz.questions.length) {
      setQuizStarted(false)
      setQuizEnded(true)
    }
  }

  // Update progress when quiz ends
  useEffect(() => {
    async function updateProgress() {
      if (
        quizEnded &&
        courseId &&
        moduleId &&
        !isUpdatingProgress &&
        !progressUpdatedRef.current
      ) {
        setIsUpdatingProgress(true)
        try {
          const quizScore =
            quiz.questions.length > 0
              ? (correctAnswers / quiz.questions.length) * 100
              : 0

          const response = await fetch("/api/quiz/update-progress", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              courseId,
              moduleId,
              quizScore: Math.round(quizScore),
            }),
          })

          if (!response.ok) {
            throw new Error("Failed to update progress")
          }

          console.log(`Quiz completed with score: ${quizScore.toFixed(1)}%`)
          progressUpdatedRef.current = true
        } catch (error) {
          console.error("Error updating quiz progress:", error)
          toast.error("Failed to update progress")
        } finally {
          setIsUpdatingProgress(false)
        }
      }
    }

    updateProgress()
  }, [quizEnded, courseId, moduleId, correctAnswers, quiz.questions.length])

  // Reset state when quiz props change
  useEffect(() => {
    setQuizStarted(false)
    setCurrentQuestionIndex(0)
    setCorrectAnswers(0)
    setQuizEnded(false)
    setIsUpdatingProgress(false)
    progressUpdatedRef.current = false
  }, [quiz])

  const currentQuestion = quiz.questions[currentQuestionIndex]

  // If no quiz data is available
  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col items-center justify-center mx-auto text-center w-full lg:block container my-24 relative border overflow-hidden border-neutral-700 rounded-3xl bg-gradient-to-br from-neutral-900 to-neutral-700 py-4 lg:px-24 lg:py-12">
      {!quizStarted && !quizEnded && (
        <>
          <h3 className="bg-gradient-to-r from-neutral-50 to-neutral-200 bg-clip-text text-transparent text-3xl font-medium tracking-tight">
            Let&apos;s see how much you&apos;ve learned!
          </h3>
          <Button
            className="my-8"
            variant="outline"
            size="lg"
            onClick={() => setQuizStarted(true)}
          >
            <span className="text-xl tracking-tighter font-medium">
              Start Quiz
            </span>
          </Button>
        </>
      )}
      {quizStarted && currentQuestion && (
        <div className="flex flex-col items-center justify-center mx-auto text-center w-full lg:block container relative py-4">
          <h3 className="bg-gradient-to-r from-neutral-50 to-neutral-200 bg-clip-text text-transparent text-4xl font-semibold tracking-tight mb-2">
            Question {currentQuestionIndex + 1}
          </h3>
          <p className="text-2xl font-light tracking-tigher text-white my-6">
            {currentQuestion.question}
          </p>

          <div className="flex flex-col gap-4 items-center">
            {currentQuestion.options.map((option, index) => (
              <Button key={index} onClick={() => handleAnswer(option)}>
                {option}
              </Button>
            ))}
          </div>
        </div>
      )}
      {!quizStarted && quizEnded && (
        <div className="flex flex-col items-center justify-center mx-auto text-center w-full lg:block container my-24 relative py-4 lg:px-24 lg:py-12">
          <h3 className="bg-gradient-to-r from-neutral-50 to-neutral-200 bg-clip-text text-transparent text-3xl font-medium tracking-tight">
            Quiz Complete
          </h3>
          <p className="text-2xl font-light tracking-tigher text-white my-6">
            You got {correctAnswers} out of {quiz.questions.length} questions
            correct
          </p>
          <p className="text-lg text-neutral-300">
            {isUpdatingProgress
              ? "Updating your progress..."
              : progressUpdatedRef.current
                ? "Your progress has been updated!"
                : ""}
          </p>
        </div>
      )}
    </div>
  )
}
