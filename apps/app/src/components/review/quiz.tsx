"use client"

import { Button } from "@kouza/ui/components/button"
import { useState } from "react"
import { Quiz } from "@/types/types"

export default function QuizComponent({ quiz }: { quiz: Quiz }) {
  const [quizStarted, setQuizStarted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [quizEnded, setQuizEnded] = useState(false)

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

  const currentQuestion = quiz.questions[currentQuestionIndex]

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
        </div>
      )}
    </div>
  )
}
