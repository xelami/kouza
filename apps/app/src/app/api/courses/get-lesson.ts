"use server"

import { db } from "@kouza/db"

export async function getLesson(reviewSlug: string) {
  const lesson = await db.lesson.findUnique({
    where: {
      slug: reviewSlug,
    },
    include: {
      module: {
        include: {
          course: true,
        },
      },
    },
  })

  if (!lesson) {
    throw new Error("Lesson not found")
  }

  const [prevLesson, nextLesson] = await Promise.all([
    db.lesson.findFirst({
      where: {
        moduleId: lesson.moduleId,
        order: {
          lt: lesson.order,
        },
      },
      orderBy: {
        order: "desc",
      },
      select: {
        id: true,
        title: true,
        slug: true,
      },
    }),
    db.lesson.findFirst({
      where: {
        moduleId: lesson.moduleId,
        order: {
          gt: lesson.order,
        },
      },
      orderBy: {
        order: "asc",
      },
      select: {
        id: true,
        title: true,
        slug: true,
      },
    }),
  ])

  return { lesson, prevLesson, nextLesson }
}
