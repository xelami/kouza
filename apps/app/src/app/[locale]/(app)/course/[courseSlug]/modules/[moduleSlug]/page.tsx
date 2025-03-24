import { getModule } from "@/app/api/courses/get-module"
import { auth } from "@/auth"
import { Lesson, CourseModule } from "@/types/types"
import { XCircle } from "lucide-react"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import React from "react"
import LessonStatus from "@/components/module/lesson-status"

export const runtime = "edge"

export default async function ModulePage({
  params,
}: {
  params: { courseSlug: string; moduleSlug: string }
}) {
  const session = await auth()

  const { courseSlug, moduleSlug } = await params

  if (!courseSlug || !moduleSlug) {
    return null
  }

  const module = await getModule(courseSlug, moduleSlug)

  if (!module || !module.course.user) {
    redirect(`/`)
  }

  if (module.course.user.id !== Number(session?.user.id)) {
    redirect(`/`)
  }

  // Check if the module has any lessons
  const hasLessons = module.lessons?.length > 0

  return (
    <div className="flex flex-col font-[family-name:var(--font-geist-sans)] h-full overflow-y-auto">
      <div className="flex flex-col p-4 md:p-6">
        <h3 className="max-w-5xl text-base md:text-lg font-light tracking-tight leading-snug">
          {module.description}
        </h3>

        {/* Show the lesson status component when there are no lessons */}
        {!hasLessons && <LessonStatus moduleId={module.id} />}

        <div className="flex flex-row items-center justify-between md:justify-start gap-4 py-8 md:gap-24 md:py-12">
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm md:text-base font-bold uppercase tracking-wide">
              Completed
            </p>
            <p className="text-lg md:text-xl font-bold">
              {
                module.lessons.filter((lesson: Lesson) => lesson.completed)
                  .length
              }
              <span className="text-muted-foreground">
                {" "}
                / {module.lessons.length}
              </span>
            </p>
          </div>
        </div>

        {hasLessons ? (
          <div className="flex flex-col divide-y">
            {module.lessons
              .sort((a: Lesson, b: Lesson) => a.order - b.order)
              .map((lesson: Lesson) => (
                <Link
                  key={lesson.id}
                  href={`/course/${courseSlug}/modules/${moduleSlug}/review/${lesson.slug}`}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 md:p-6 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <p className="text-lg font-light w-8">{lesson.order + 1}</p>

                  <div className="flex-1 min-w-0 max-w-[300px] sm:max-w-full">
                    <h3 className="text-lg md:text-2xl font-semibold tracking-tight truncate">
                      {lesson.title}
                    </h3>
                    <p className="text-sm md:text-base font-light tracking-tight text-muted-foreground line-clamp-2">
                      {lesson.description}
                    </p>
                  </div>

                  <div className="flex flex-row sm:flex-col items-center gap-2 sm:w-32">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase">
                      {lesson.completed ? "Completed" : "Incomplete"}
                    </p>
                    {lesson.completed ? (
                      <CheckCircle className="text-green-500 w-4 h-4" />
                    ) : (
                      <XCircle className="text-red-500 w-4 h-4" />
                    )}
                  </div>
                </Link>
              ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <p>Lessons are being generated in the background.</p>
          </div>
        )}
      </div>
    </div>
  )
}
