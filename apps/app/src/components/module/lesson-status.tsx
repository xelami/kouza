"use client"

import { Button } from "@kouza/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@kouza/ui/components/card"
import { Loader2, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

interface LessonStatusProps {
  moduleId: number
  refreshInterval?: number
}

export default function LessonStatus({
  moduleId,
  refreshInterval = 5000,
}: LessonStatusProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [lessonsCreated, setLessonsCreated] = useState(false)
  const [lessonCount, setLessonCount] = useState(0)
  const router = useRouter()

  // Function to check if lessons have been created for this module
  const checkLessonStatus = async () => {
    try {
      const response = await fetch(
        `/api/courses/check-lessons?moduleId=${moduleId}`
      )
      if (!response.ok) {
        throw new Error("Failed to fetch lesson status")
      }

      const data = await response.json()

      setLessonCount(data.lessonCount || 0)
      setLessonsCreated(data.lessonsCreated)
      setIsLoading(false)
    } catch (error) {
      console.error("Error checking lesson status:", error)
      setIsLoading(false)
    }
  }

  // Check status when component mounts
  useEffect(() => {
    checkLessonStatus()

    // If lessons aren't created yet, set up an interval to check
    if (!lessonsCreated) {
      const interval = setInterval(() => {
        checkLessonStatus()
      }, refreshInterval)

      // Clean up interval on component unmount
      return () => clearInterval(interval)
    }
  }, [moduleId, lessonsCreated, refreshInterval])

  // Function to refresh the page
  const handleRefresh = () => {
    router.refresh()
  }

  // If lessons are created, don't show anything
  if (lessonsCreated && lessonCount > 0) {
    return null
  }

  return (
    <Card className="my-4">
      <CardHeader>
        <CardTitle>Lesson Generation</CardTitle>
        <CardDescription>
          {isLoading
            ? "Checking lesson generation status..."
            : lessonsCreated
              ? `${lessonCount} lessons have been generated.`
              : "Lessons are being generated in the background."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!lessonsCreated && (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <p>
                  This may take a few minutes. You can continue browsing or
                  check back later.
                </p>
              </>
            )}
          </div>

          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
