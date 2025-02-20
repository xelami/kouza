"use server"

import { db } from "@kouza/db"

export async function searchContent(query: string) {
  if (!query) {
    return {
      courses: [],
      notes: [],
      flashcards: [],
    }
  }

  const [courses, notes, flashcards] = await Promise.all([
    db.course.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 5,
    }),
    db.note.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 5,
    }),
    db.flashcard.findMany({
      where: {
        OR: [
          { question: { contains: query, mode: "insensitive" } },
          { answer: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        module: true,
        course: true,
      },
      take: 1,
    }),
  ])

  return {
    courses,
    notes,
    flashcards,
  }
}
