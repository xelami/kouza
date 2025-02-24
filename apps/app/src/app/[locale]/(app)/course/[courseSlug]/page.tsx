import { getCourse } from "@/app/api/courses/get-course"
import { Progress } from "@kouza/ui/components/progress"
import Link from "next/link"
import React from "react"
import { Course, CourseModule, Lesson } from "@/types/types"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
export const runtime = "edge"

export default async function CoursesPage({
  params,
}: {
  params: { courseSlug: string }
}) {
  const session = await auth()
  const { courseSlug } = await params
  const course = await getCourse(courseSlug)

  if (!course || !course.user) {
    redirect(`/`)
  }

  if (course.user.id !== Number(session?.user.id)) {
    redirect(`/`)
  }

  const totalLessons = course.modules?.reduce(
    (acc: number, module: CourseModule) => acc + (module.lessons?.length || 0),
    0
  )
  const completedLessons = course.modules?.reduce(
    (acc: number, module: CourseModule) =>
      acc +
      (module.lessons?.filter((lesson: Lesson) => lesson.completed)?.length ||
        0),
    0
  )
  const progressPercentage = totalLessons
    ? (completedLessons / totalLessons) * 100
    : 0

  return (
    <div className="flex flex-col font-[family-name:var(--font-geist-sans)] h-full overflow-y-auto">
      <div className="flex flex-col p-4 md:p-6">
        <h3 className="max-w-5xl text-base md:text-lg font-light tracking-tight leading-snug">
          {course.description}
        </h3>

        <div className="flex flex-row items-center justify-between md:justify-start gap-4 py-8 md:gap-24 md:py-12">
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm md:text-base font-bold uppercase tracking-wide">
              Modules
            </p>
            <p className="font-bold text-lg md:text-xl">
              {course.modules && course.modules.length}
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm md:text-base font-bold uppercase tracking-wide">
              Lessons
            </p>
            <p className="font-bold text-lg md:text-xl">{totalLessons}</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-24 sm:w-32 md:w-48">
              <Progress value={progressPercentage} />
            </div>
            <p className="text-center text-xs sm:text-sm text-muted-foreground">
              {completedLessons} of {totalLessons} lessons completed
            </p>
          </div>
        </div>

        <div className="flex flex-col divide-y">
          {course &&
            course.modules &&
            course.modules
              .sort((a: CourseModule, b: CourseModule) => a.order - b.order)
              .map((module: CourseModule) => {
                const moduleLessons = module.lessons?.length || 0
                const moduleCompleted =
                  module.lessons?.filter((lesson: Lesson) => lesson.completed)
                    ?.length || 0
                const moduleProgress = moduleLessons
                  ? (moduleCompleted / moduleLessons) * 100
                  : 0

                return (
                  <Link
                    href={`/course/${course.slug}/modules/${module.slug}`}
                    key={module.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 md:p-6 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <p className="text-lg font-light w-8">{module.order + 1}</p>
                    <div className="flex-1 min-w-0 max-w-[300px] sm:max-w-full">
                      <h3 className="text-lg md:text-2xl font-semibold tracking-tight truncate">
                        {module.title}
                      </h3>
                      <p className="text-sm md:text-base font-light tracking-tight text-muted-foreground line-clamp-2">
                        {module.description}
                      </p>
                    </div>
                    <div className="w-full sm:w-32 md:w-48 flex flex-col items-center gap-1">
                      <Progress value={moduleProgress} />
                      <p className="text-center text-xs sm:text-sm text-muted-foreground">
                        {moduleCompleted} of {moduleLessons} lessons
                      </p>
                    </div>
                  </Link>
                )
              })}
        </div>
      </div>
    </div>
  )
}
