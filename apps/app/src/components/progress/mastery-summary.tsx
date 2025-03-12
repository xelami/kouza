import React from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@kouza/ui/components/card"
import { Progress } from "@kouza/ui/components/progress"

interface MasteryLevel {
  level: string
  count: number
  color: string
}

interface MasterySummaryProps {
  totalModules: number
  averageMastery: number
  masteryLevels: MasteryLevel[]
  strongestTopics: Array<{
    id: number
    title: string
    score: number
  }>
  weakestTopics: Array<{
    id: number
    title: string
    score: number
  }>
}

export function MasterySummary({
  totalModules,
  averageMastery,
  masteryLevels,
  strongestTopics,
  weakestTopics,
}: MasterySummaryProps) {
  // Helper function to get color based on mastery score
  const getMasteryColor = (score: number) => {
    if (score >= 90) return "text-green-500"
    if (score >= 80) return "text-green-400"
    if (score >= 70) return "text-green-300"
    if (score >= 60) return "text-yellow-500"
    if (score >= 50) return "text-yellow-400"
    if (score >= 40) return "text-orange-500"
    if (score >= 30) return "text-orange-400"
    return "text-red-500"
  }

  // Helper function to get progress color based on mastery score
  const getProgressColor = (score: number) => {
    if (score >= 90) return "bg-green-500"
    if (score >= 80) return "bg-green-400"
    if (score >= 70) return "bg-green-300"
    if (score >= 60) return "bg-yellow-500"
    if (score >= 50) return "bg-yellow-400"
    if (score >= 40) return "bg-orange-500"
    if (score >= 30) return "bg-orange-400"
    return "bg-red-500"
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Overall Mastery</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-gray-200 dark:text-gray-700"
                  strokeWidth="10"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                <circle
                  className={getMasteryColor(averageMastery)}
                  strokeWidth="10"
                  strokeDasharray={`${averageMastery * 2.51} 251`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-3xl font-bold">
                    {Math.round(averageMastery)}%
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Average
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Topics: {totalModules}</span>
                <span className={getMasteryColor(averageMastery)}>
                  {averageMastery >= 70
                    ? "Proficient"
                    : averageMastery >= 50
                      ? "Developing"
                      : "Needs Work"}
                </span>
              </div>
              <Progress
                value={averageMastery}
                className={`h-2 ${getProgressColor(averageMastery)}`}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mastery Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {masteryLevels.map((level) => (
              <div key={level.level} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{level.level}</span>
                  <span>
                    {level.count} topics (
                    {Math.round((level.count / totalModules) * 100)}%)
                  </span>
                </div>
                <Progress
                  value={(level.count / totalModules) * 100}
                  className={`h-2 ${level.color}`}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Strongest Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {strongestTopics.length > 0 ? (
              strongestTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="flex justify-between items-center"
                >
                  <span className="font-medium">{topic.title}</span>
                  <span className={`font-bold ${getMasteryColor(topic.score)}`}>
                    {Math.round(topic.score)}%
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No data available yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Areas for Improvement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {weakestTopics.length > 0 ? (
              weakestTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="flex justify-between items-center"
                >
                  <span className="font-medium">{topic.title}</span>
                  <span className={`font-bold ${getMasteryColor(topic.score)}`}>
                    {Math.round(topic.score)}%
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No data available yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
