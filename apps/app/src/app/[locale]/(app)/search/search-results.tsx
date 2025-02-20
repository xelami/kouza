"use client"

import { Card } from "@kouza/ui/components/card"
import Link from "next/link"

import { Course, Note, Flashcard } from "@/types/types"

interface SearchResultsProps {
  courses: Course[]
  notes: Note[]
  flashcards: Flashcard[]
  query: string
}

export function SearchResults({
  courses,
  notes,
  flashcards,
  query,
}: SearchResultsProps) {
  if (!courses.length && !notes.length && !flashcards.length) {
    return (
      <div className="text-gray-500">
        No results found for &quot;{query}&quot;
      </div>
    )
  }

  return (
    <div className="space-y-8 my-12">
      {courses.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Courses</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Link key={course.id} href={`/course/${course.id}`}>
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-medium">{course.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {course.description}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {notes.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Notes</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {notes.map((note) => (
              <Link key={note.id} href={`/notes/${note.id}`}>
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <h3 className="text-2xl font-medium">{note.title}</h3>
                  <p className="text-lg text-gray-500 line-clamp-3">
                    {note.description}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {flashcards.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Flashcards</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {flashcards.map((card) => (
              <Link
                key={card.id}
                href={`/flashcards/${card.course.id}/${card.module.id}`}
              >
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <h3 className="text-2xl font-medium">{card.course.title}</h3>
                  <p className="text-lg text-gray-500">{card.module.title}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
