"use server"

import { db } from "@kouza/db"

export async function getCourse(courseSlug: string) {
  const course = await db.course.findUnique({
    where: {
      slug: courseSlug,
    },
    include: {
      modules: {
        include: {
          lessons: true,
        },
      },
      user: true,
    },
  })

  if (!course) {
    return null
  }

  return course
}
