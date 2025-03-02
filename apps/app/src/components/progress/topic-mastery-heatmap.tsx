import React from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@kouza/ui/components/card"
import { MasteryIndicator } from "./mastery-indicator"
import Link from "next/link"

interface TopicMasteryData {
  id: number
  title: string
  slug: string
  masteryScore: number | null
  retentionRate: number | null
}

interface CourseWithModules {
  id: number
  title: string
  slug: string
  modules: TopicMasteryData[]
}

interface TopicMasteryHeatmapProps {
  courses: CourseWithModules[]
}

export function TopicMasteryHeatmap({ courses }: TopicMasteryHeatmapProps) {
  if (!courses || courses.length === 0) {
    return (
      <Card>
        <CardContent className="py-6 text-center">
          <p className="text-gray-500">No mastery data available yet</p>
        </CardContent>
      </Card>
    )
  }

  // Helper function to get cell background color based on mastery score
  const getCellColor = (score: number | null) => {
    if (score === null) return "bg-gray-100"
    if (score >= 90) return "bg-green-500"
    if (score >= 80) return "bg-green-400"
    if (score >= 70) return "bg-green-300"
    if (score >= 60) return "bg-yellow-300"
    if (score >= 50) return "bg-yellow-200"
    if (score >= 40) return "bg-orange-300"
    if (score >= 30) return "bg-orange-200"
    if (score >= 20) return "bg-red-300"
    if (score >= 10) return "bg-red-200"
    return "bg-red-100"
  }

  // Helper function to get text color based on background color
  const getTextColor = (score: number | null) => {
    if (score === null) return "text-gray-400"
    if (score >= 70) return "text-white"
    return "text-gray-800"
  }

  // Helper function to get a score label
  const getScoreLabel = (score: number | null) => {
    if (score === null) return "No data"
    return `${Math.round(score)}%`
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{course.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="min-w-full">
                  <div className="grid grid-cols-1 gap-3">
                    {course.modules.map((module) => {
                      // Use masteryScore if available, otherwise fall back to retentionRate
                      const score =
                        module.masteryScore !== null &&
                        module.masteryScore !== undefined
                          ? module.masteryScore
                          : module.retentionRate

                      return (
                        <Link
                          key={module.id}
                          href={`/progress/${course.slug}/${module.slug}`}
                          className="block"
                        >
                          <div className="flex items-center p-3 rounded-md border hover:shadow-md transition-shadow">
                            <div
                              className={`w-12 h-12 rounded-md flex items-center justify-center mr-4 ${getCellColor(score)} ${getTextColor(score)}`}
                            >
                              <span className="font-bold">
                                {getScoreLabel(score)}
                              </span>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{module.title}</h4>
                              <div className="flex items-center mt-1">
                                <MasteryIndicator
                                  masteryScore={module.masteryScore}
                                  retentionRate={module.retentionRate}
                                  size="sm"
                                />
                              </div>
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
