"use server"

import { db } from "@kouza/db"

export async function toggleCompleted(lessonId: number) {
  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
  })

  if (!lesson) {
    throw new Error("Lesson not found")
  }

  const updatedLesson = await db.lesson.update({
    where: { id: lessonId },
    data: { completed: !lesson.completed },
  })

  return updatedLesson.completed
}
