//@ts-nocheck
import React from "react"

import { auth } from "@/auth"
import Link from "next/link"
import CourseDialog from "@/components/dialogs/course"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@kouza/ui/components/card"
import { db } from "@kouza/db"
import { Course, CourseModule } from "@/types/types"

export default async function CoursesPage() {
  const session = await auth()

  if (!session?.user) {
    return <div>You are not logged in</div>
  }

  const userId = session.user.id

  const courses = await getCourses(Number(userId))

  return (
    <div className="flex flex-col font-[family-name:var(--font-geist-sans)] h-full p-6 px-4">
      {courses.length ? (
        <div className="flex flex-col lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-4 h-full">
          {courses.map((course: Course) => (
            <Link href={`/course/${course.slug}`} key={course.id}>
              <Card>
                <CardHeader>
                  <div className="flex flex-row items-center gap-2 justify-between">
                    <CardTitle>{course.title}</CardTitle>
                    <span className="text-sm uppercase px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded-xl">
                      {course.type}
                    </span>
                  </div>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardFooter className="flex items-center gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-sm uppercase">Modules</p>
                    <p className="font-bold">{course.modules.length}</p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-sm uppercase">Lessons</p>
                    <p className="font-bold">
                      {course.modules.reduce(
                        (acc: number, module: CourseModule) =>
                          acc + (module.lessons?.length || 0),
                        0
                      )}
                    </p>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center text-center mt-24 h-full">
          <h3 className="text-4xl font-medium tracking-tight">
            You have no courses!
          </h3>
          <span className="text-muted-foreground mt-2 mb-4">
            Create a course to get started
          </span>
          <CourseDialog />
        </div>
      )}
    </div>
  )
}

async function getCourses(userId: number) {
  const courses = await db.course.findMany({
    where: {
      generatedBy: userId,
    },
    include: {
      modules: {
        include: {
          lessons: true,
        },
      },
    },
  })

  return courses
}
