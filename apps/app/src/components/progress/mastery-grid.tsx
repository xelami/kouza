"use client"

import React, { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@kouza/ui/components/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@kouza/ui/components/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@kouza/ui/components/tooltip"
import { ChevronDown, ChevronRight } from "lucide-react"
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

interface MasteryGridProps {
  courses: CourseWithModules[]
}

export function MasteryGrid({ courses }: MasteryGridProps) {
  const [expandedCourses, setExpandedCourses] = useState<
    Record<number, boolean>
  >({})

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
    if (score === null) return "bg-gray-100 dark:bg-gray-800"
    if (score >= 90) return "bg-green-500 dark:bg-green-600"
    if (score >= 80) return "bg-green-400 dark:bg-green-500"
    if (score >= 70) return "bg-green-300 dark:bg-green-400"
    if (score >= 60) return "bg-yellow-300 dark:bg-yellow-400"
    if (score >= 50) return "bg-yellow-200 dark:bg-yellow-300"
    if (score >= 40) return "bg-orange-300 dark:bg-orange-400"
    if (score >= 30) return "bg-orange-200 dark:bg-orange-300"
    if (score >= 20) return "bg-red-300 dark:bg-red-400"
    if (score >= 10) return "bg-red-200 dark:bg-red-300"
    return "bg-red-100 dark:bg-red-200"
  }

  // Helper function to get text color based on background color
  const getTextColor = (score: number | null) => {
    if (score === null) return "text-gray-400 dark:text-gray-500"
    if (score >= 70) return "text-white"
    if (score >= 50 && score < 70) return "text-gray-800 dark:text-gray-900"
    return "text-gray-800 dark:text-gray-200"
  }

  // Helper function to get a score label
  const getScoreLabel = (score: number | null) => {
    if (score === null) return "-"
    return `${Math.round(score)}%`
  }

  // Helper function to get mastery level text
  const getMasteryLevelText = (score: number | null) => {
    if (score === null) return "No data"
    if (score >= 90) return "Expert"
    if (score >= 80) return "Advanced"
    if (score >= 70) return "Proficient"
    if (score >= 60) return "Competent"
    if (score >= 50) return "Developing"
    if (score >= 40) return "Basic"
    if (score >= 30) return "Novice"
    if (score >= 20) return "Beginning"
    if (score >= 10) return "Introductory"
    return "Unfamiliar"
  }

  // Calculate average mastery score for a course
  const getCourseMasteryScore = (modules: TopicMasteryData[]) => {
    const modulesWithScores = modules.filter(
      (m) => m.masteryScore !== null || m.retentionRate !== null
    )

    if (modulesWithScores.length === 0) return null

    const sum = modulesWithScores.reduce((total, module) => {
      const score =
        module.masteryScore !== null
          ? module.masteryScore
          : module.retentionRate || 0
      return total + score
    }, 0)

    return sum / modulesWithScores.length
  }

  // Toggle course expansion
  const toggleCourse = (courseId: number) => {
    setExpandedCourses((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }))
  }

  return (
    <Tabs defaultValue="grid" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="grid">Grid View</TabsTrigger>
        <TabsTrigger value="list">List View</TabsTrigger>
      </TabsList>

      <TabsContent value="grid" className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {courses.map((course) => {
            const isExpanded = expandedCourses[course.id] || false
            const courseMasteryScore = getCourseMasteryScore(course.modules)

            return (
              <Card key={course.id} className="overflow-hidden">
                <CardHeader
                  className="pb-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => toggleCourse(course.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 mr-2 text-gray-500 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="h-5 w-5 mr-2 text-gray-500 flex-shrink-0" />
                      )}
                      <CardTitle className="text-lg my-auto">
                        {course.title}
                      </CardTitle>
                    </div>
                    {courseMasteryScore !== null && (
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getCellColor(courseMasteryScore)} ${getTextColor(courseMasteryScore)}`}
                      >
                        {Math.round(courseMasteryScore)}%
                      </div>
                    )}
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="pt-6">
                    <div className="overflow-x-auto">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                        {course.modules.map((module) => {
                          // Use masteryScore if available, otherwise fall back to retentionRate
                          const score =
                            module.masteryScore !== null &&
                            module.masteryScore !== undefined
                              ? module.masteryScore
                              : module.retentionRate

                          return (
                            <TooltipProvider key={module.id}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Link
                                    href={`/progress/${course.slug}/${module.slug}`}
                                    className="block"
                                  >
                                    <div
                                      className={`aspect-square rounded-md flex flex-col items-center justify-center p-2 text-center border hover:shadow-md transition-shadow ${getCellColor(score)} ${getTextColor(score)}`}
                                    >
                                      <span className="font-bold text-lg">
                                        {getScoreLabel(score)}
                                      </span>
                                      <span className="text-xs mt-1 line-clamp-2">
                                        {module.title}
                                      </span>
                                    </div>
                                  </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="space-y-1">
                                    <p className="font-medium">
                                      {module.title}
                                    </p>
                                    <p>Mastery: {getMasteryLevelText(score)}</p>
                                    <p>
                                      Score:{" "}
                                      {score !== null
                                        ? `${Math.round(score)}%`
                                        : "No data"}
                                    </p>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )
                        })}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>
      </TabsContent>

      <TabsContent value="list">
        <div className="space-y-6">
          {courses.map((course) => {
            const isExpanded = expandedCourses[course.id] || false
            const courseMasteryScore = getCourseMasteryScore(course.modules)

            return (
              <Card key={course.id}>
                <CardHeader
                  className="pb-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => toggleCourse(course.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 mr-2 text-gray-500 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="h-5 w-5 mr-2 text-gray-500 flex-shrink-0" />
                      )}
                      <CardTitle className="text-lg my-auto">
                        {course.title}
                      </CardTitle>
                    </div>
                    {courseMasteryScore !== null && (
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getCellColor(courseMasteryScore)} ${getTextColor(courseMasteryScore)}`}
                      >
                        {Math.round(courseMasteryScore)}%
                      </div>
                    )}
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="pt-6">
                    <div className="space-y-3">
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
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {getMasteryLevelText(score)}
                                </p>
                              </div>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>
      </TabsContent>
    </Tabs>
  )
}
