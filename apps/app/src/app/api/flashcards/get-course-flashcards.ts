"use server"

import { auth } from "@/auth"
import { db } from "@kouza/db"

export const runtime = "edge"

export async function getCourseFlashcards(courseSlug: string) {
  const session = await auth()
  const user = session?.user

  if (!user) {
    return { course: null, modules: [] }
  }

  const course = await db.course.findUnique({
    where: { slug: courseSlug },
    include: {
      user: true,
    },
  })

  if (!course) {
    return { course: null, modules: [] }
  }

  const flashcards = await db.flashcard.findMany({
    where: {
      userId: Number(user.id),
      courseId: Number(course.id),
    },
    include: {
      note: true,
      lesson: true,
      module: true,
      course: {
        include: {
          user: true,
        },
      },
    },
  })

  const modules = await db.module.findMany({
    where: {
      course: { slug: courseSlug },
      flashcards: {
        some: {
          userId: parseInt(session.user.id),
        },
      },
    },
    select: {
      id: true,
      title: true,
      description: true,
      slug: true,
      flashcards: {
        where: {
          userId: parseInt(session.user.id),
        },
        select: {
          id: true,
          lastReviewed: true,
          nextReview: true,
        },
      },
    },
  })

  return {
    course: {
      id: course.id,
      title: course.title,
      description: course.description || "",
      user: course.user,
    },
    modules,
  }
}
