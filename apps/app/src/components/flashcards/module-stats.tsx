"use client"

import { Progress } from "@kouza/ui/components/progress"
import { GlassWater } from "lucide-react"
import { useEffect, useState } from "react"
import { useFlashcards } from "./flashcards-context"

interface ModuleStatsProps {
  moduleId: number
  initialTotalCards: number
  initialReviewed: number
  initialToReview: number
}

export default function ModuleStats({
  moduleId,
  initialTotalCards,
  initialReviewed,
  initialToReview,
}: ModuleStatsProps) {
  const { shouldRefreshStats } = useFlashcards()
  const [totalCards, setTotalCards] = useState(initialTotalCards)
  const [reviewed, setReviewed] = useState(initialReviewed)
  const [toReview, setToReview] = useState(initialToReview)
  const [isLoading, setIsLoading] = useState(false)

  const progressPercent = totalCards > 0 ? (reviewed / totalCards) * 100 : 0

  // Fetch updated stats when shouldRefreshStats changes
  useEffect(() => {
    if (shouldRefreshStats) {
      fetchModuleStats()
    }
  }, [shouldRefreshStats, moduleId])

  const fetchModuleStats = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `/api/flashcards/module-stats?moduleId=${moduleId}`
      )
      if (response.ok) {
        const data = await response.json()
        setTotalCards(data.totalCards)
        setReviewed(data.reviewed)
        setToReview(data.toReview)
      } else {
        console.error("Failed to fetch module stats")
      }
    } catch (error) {
      console.error("Error fetching module stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 rounded-lg bg-muted/40">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
        <span className="text-sm font-medium">
          {progressPercent.toFixed(0)}%
        </span>
        <span className="text-sm font-medium">
          {reviewed} / {totalCards} cards reviewed
        </span>
      </div>
      <Progress value={progressPercent} className="h-2" />
      <div className="mt-2 text-sm font-medium flex items-center gap-2">
        <GlassWater className="w-4 sm:w-5 h-4 sm:h-5" />
        <span>{toReview} cards to revise</span>
        {isLoading && (
          <span className="text-xs text-muted-foreground">(refreshing...)</span>
        )}
      </div>
    </div>
  )
}
