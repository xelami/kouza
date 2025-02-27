"use client"

import React, { useEffect, useState } from "react"
import { getLesson } from "@/app/api/courses/get-lesson"
import QuizComponent from "@/components/review/quiz"
import SelectableMarkdown from "@/components/review/selectable-markdown"
import ASidebar from "@/components/review/a-sidebar"
import Link from "next/link"
import { Button } from "@kouza/ui/components/button"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MessageCircleQuestion,
} from "lucide-react"
import { generateNote } from "@/app/api/notes/generate-note"
import { newFlashcards } from "@/app/api/flashcards/new-flashcards"
import { checkExistingFlashcards } from "@/app/api/flashcards/check-existing"
import { toggleCompleted } from "@/app/api/courses/toggle-completed"
import { cn } from "@kouza/ui/lib/utils"
import { toast } from "sonner"
import { redirect } from "next/navigation"
import { useSession } from "next-auth/react"

export const runtime = "edge"

export default function ReviewPage({
  params,
}: {
  params: Promise<{ reviewSlug: string }>
}) {
  const { data: session } = useSession()
  const { reviewSlug } = React.use(params)
  const [lesson, setLesson] = useState<any>(null)
  const [prevLesson, setPrevLesson] = useState<any>(null)
  const [nextLesson, setNextLesson] = useState<any>(null)
  const [assistantContext, setAssistantContext] = useState<string>("")
  const [hasFlashcards, setHasFlashcards] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    async function fetchLesson() {
      try {
        const lessonData = await getLesson(reviewSlug)
        setLesson(lessonData.lesson)
        setPrevLesson(lessonData.prevLesson)
        setNextLesson(lessonData.nextLesson)
        setIsCompleted(lessonData.lesson.completed)

        if (
          !session?.user?.id ||
          (lessonData.lesson.module.course.user &&
            lessonData.lesson.module.course.user.id !== Number(session.user.id))
        ) {
          redirect(`/`)
        }
      } catch (error) {
        console.error("Error fetching lesson:", error)
      }
    }
    fetchLesson()
  }, [reviewSlug, session])

  useEffect(() => {
    async function checkFlashcards() {
      if (lesson?.id) {
        const flashcardsExist = await checkExistingFlashcards(Number(lesson.id))
        setHasFlashcards(!!flashcardsExist)
      }
    }
    checkFlashcards()
  }, [lesson?.id])

  const handleCreateContext = (context: string) => {
    setAssistantContext(context)
  }

  const handleGenerateNote = (note: string) => {
    generateNote(note, lesson?.id, lesson?.moduleId, lesson?.module?.courseId)
  }

  const handleLessonState = async (lessonId: number) => {
    try {
      const res = await toggleCompleted(Number(lessonId))
      setIsCompleted(res)
      toast.success(
        res ? "Lesson marked as completed" : "Lesson marked as incomplete"
      )
    } catch (error) {
      toast.error("Failed to update lesson status")
    }
  }

  const handleGenerateFlashcards = async () => {
    setIsGenerating(true)
    try {
      await newFlashcards({ lessonId: lesson?.id })
      setHasFlashcards(true)
      toast.success("Flashcards generated successfully")
    } catch (error) {
      toast.error("Failed to generate flashcards")
      console.error("Error generating flashcards:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  if (!lesson)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )

  console.log(assistantContext)

  return (
    <>
      <div className="flex flex-col px-4 md:px-8">
        <div className="flex flex-row items-center justify-between mt-4 gap-2">
          <Link
            className="flex flex-row items-center mt-4 gap-2"
            href={`/course/${lesson?.module?.course?.slug}/modules/${lesson?.module?.slug}`}
          >
            <ChevronLeft className="w-8 h-8" />
            <p className="text-xl">Back to module</p>
          </Link>
          <Link className="flex flex-col items-center" href="#">
            <MessageCircleQuestion className="w-8 h-8" />
            <p className="text-xl">Help</p>
          </Link>
        </div>
        <SelectableMarkdown
          content={lesson?.content || ""}
          onCreateContext={handleCreateContext}
          onGenerateNote={handleGenerateNote}
        />

        <div className="flex flex-col sm:flex-row justify-center gap-4 p-4 md:p-8">
          {!hasFlashcards && (
            <Button
              className="text-base md:text-xl py-2 md:py-4 px-4 md:px-8"
              size="lg"
              onClick={handleGenerateFlashcards}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Flashcards"
              )}
            </Button>
          )}
          <Button
            className={cn(
              "text-base md:text-xl py-2 md:py-4 px-4 md:px-8",
              isCompleted
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            )}
            size="lg"
            onClick={() => handleLessonState(lesson.id)}
          >
            {isCompleted ? "Mark as Incomplete" : "Mark as Completed"}
          </Button>
        </div>

        <div className="flex flex-col items-center">
          <QuizComponent quiz={lesson?.quiz} />
        </div>
        <div className="flex flex-row justify-between p-8">
          <Link
            className="flex flex-row items-center gap-2"
            href={`/course/${lesson?.module?.course?.slug}/modules/${lesson?.module?.slug}/review/${prevLesson?.slug}`}
          >
            <ChevronLeft className="w-4 h-4" />
            <p>{prevLesson?.title}</p>
          </Link>
          <Link
            className="flex flex-row items-center gap-2"
            href={`/course/${lesson?.module?.course?.slug}/modules/${lesson?.module?.slug}/review/${nextLesson?.slug}`}
          >
            <p>{nextLesson?.title}</p>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
      <div className="hidden xl:block h-screen sticky top-0 border-l border-gray-200">
        <ASidebar
          context={assistantContext}
          onContextCleared={() => setAssistantContext("")}
        />
      </div>
    </>
  )
}
