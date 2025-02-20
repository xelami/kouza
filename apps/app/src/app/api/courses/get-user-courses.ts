"use server"

import { db } from "@kouza/db"

export async function getUserCourses(userId: number) {
  const userCourses = await db.course.findMany({
    where: {
      generatedBy: Number(userId),
    },
    include: {
      modules: {
        include: {
          lessons: true,
        },
      },
    },
  })

  return userCourses
}
