"use client"

import { getNotes } from "@/app/api/notes/get-notes"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@kouza/ui/components/select"
import {
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@kouza/ui/components/card"
import { Card } from "@kouza/ui/components/card"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { Button } from "@kouza/ui/components/button"
import { newFlashcards } from "@/app/api/flashcards/new-flashcards"
import { Loader2 } from "lucide-react"

export const runtime = "edge"

export default function NotesPage() {
  const [notes, setNotes] = useState<any[]>([])
  const [filteredNotes, setFilteredNotes] = useState<any[]>([])
  const [selectedCourse, setSelectedCourse] = useState<number | "all">("all")
  const [selectedModule, setSelectedModule] = useState<number | "all">("all")
  const [generatingFlashcards, setGeneratingFlashcards] = useState<{
    [key: number]: boolean
  }>({})

  useEffect(() => {
    const fetchNotes = async () => {
      const notes = await getNotes()
      setNotes(notes)
      setFilteredNotes(notes)
    }
    fetchNotes()
  }, [])

  const courses = Array.from(
    new Map(notes.map((note) => [note.course.id, note.course])).values()
  )

  const modules = Array.from(
    new Map(
      notes
        .filter(
          (note) =>
            selectedCourse === "all" || note.course.id === selectedCourse
        )
        .map((note) => [note.module.id, note.module])
    ).values()
  )

  useEffect(() => {
    let filtered = [...notes]
    if (selectedCourse !== "all") {
      filtered = filtered.filter((note) => note.course.id === selectedCourse)
    }
    if (selectedModule !== "all") {
      filtered = filtered.filter((note) => note.module.id === selectedModule)
    }
    setFilteredNotes(filtered)
  }, [selectedCourse, selectedModule, notes])

  const handleGenerateFlashcards = async (noteId: number) => {
    setGeneratingFlashcards((prev) => ({ ...prev, [noteId]: true }))
    try {
      await newFlashcards({ noteId: Number(noteId) })
    } catch (error) {
      console.error("Error generating flashcards:", error)
    } finally {
      setGeneratingFlashcards((prev) => ({ ...prev, [noteId]: false }))
    }
  }

  return (
    <div className="flex flex-col font-[family-name:var(--font-geist-sans)] h-full p-6 px-4">
      <div className="flex gap-4 my-6">
        <Select
          value={selectedCourse.toString()}
          onValueChange={(value) => {
            setSelectedCourse(value === "all" ? "all" : Number(value))
            setSelectedModule("all")
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {courses.map((course, i) => (
              <SelectItem key={i} value={course.id.toString()}>
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedModule.toString()}
          onValueChange={(value) => {
            setSelectedModule(value === "all" ? "all" : Number(value))
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Module" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modules</SelectItem>
            {modules.map((module, i) => (
              <SelectItem key={i} value={module.id.toString()}>
                {module.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-4 py-12 h-full overflow-y-auto">
        {filteredNotes &&
          filteredNotes.map((note, index) => (
            <Link href={`/notes/${note.id}`} key={index}>
              <Card className="col-span-1 row-span-1">
                <CardHeader className="gap-2">
                  <CardTitle>{note.title}</CardTitle>
                  <CardDescription>{note.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleGenerateFlashcards(note.id)
                    }}
                    variant="outline"
                    disabled={generatingFlashcards[note.id]}
                  >
                    {generatingFlashcards[note.id] ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Flashcards"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
      </div>
    </div>
  )
}
