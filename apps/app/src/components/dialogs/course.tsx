"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@kouza/ui/components/dialog"
import React, { useState } from "react"
import NewCourseForm from "../forms/new-course"

export default function CourseDialog({
  children,
  pregeneratedPrompt,
}: {
  children?: React.ReactNode
  pregeneratedPrompt?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <span className="flex items-center text-sm bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-md">
            Generate Course
          </span>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader className="flex flex-col items-center space-y-0">
          <DialogTitle className="text-3xl tracking-tight">
            Generate Course
          </DialogTitle>
          <DialogDescription className="text-lg tracking-tighter">
            Generate a new course
          </DialogDescription>
        </DialogHeader>
        <NewCourseForm
          pregeneratedPrompt={pregeneratedPrompt}
          setIsSubmitted={(submitted) => {
            setOpen(!submitted)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
