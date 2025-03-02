import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@kouza/db"
import Link from "next/link"
import { Button } from "@kouza/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@kouza/ui/components/card"
import {
  Target,
  Clock,
  Award,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  ArrowLeft,
  Plus,
} from "lucide-react"

export const runtime = "edge"

// Helper function to format time in seconds to a readable format
function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds} sec`

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  if (minutes < 60) {
    return `${minutes}m ${remainingSeconds}s`
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return `${hours}h ${remainingMinutes}m ${remainingSeconds}s`
}

export default async function SuggestObjectivesPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const userId = Number(session.user.id)

  // Fetch user's progress data
  const progressRecords = await db.progressRecord.findMany({
    where: {
      userId: userId,
    },
    include: {
      module: {
        include: {
          course: true,
        },
      },
    },
    orderBy: {
      recordedAt: "desc",
    },
  })

  // Fetch existing learning goals to avoid duplicates
  const existingGoals = await db.learningGoal.findMany({
    where: {
      userId: userId,
    },
  })

  // Group progress by module
  const moduleProgress = progressRecords.reduce(
    (acc, record) => {
      if (!record.module) return acc

      if (!acc[record.moduleId]) {
        acc[record.moduleId] = {
          module: record.module,
          records: [],
        }
      }

      acc[record.moduleId].records.push(record)
      return acc
    },
    {} as Record<number, { module: any; records: typeof progressRecords }>
  )

  // Generate suggestions
  const suggestions = []

  // 1. Suggest improving retention for modules with low retention
  for (const [moduleId, data] of Object.entries(moduleProgress)) {
    const latestRecord = data.records[0]

    if (
      latestRecord.retentionRate !== null &&
      latestRecord.retentionRate < 70 &&
      !existingGoals.some(
        (goal) =>
          goal.moduleId === Number(moduleId) &&
          goal.targetType === "MASTERY" &&
          !goal.achieved
      )
    ) {
      suggestions.push({
        type: "MASTERY",
        title: `Improve mastery of ${data.module.title}`,
        description: `Your current retention rate is ${latestRecord.retentionRate}%. Aim to reach at least 80%.`,
        targetValue: 80,
        moduleId: Number(moduleId),
        courseId: data.module.courseId,
        icon: <TrendingUp className="h-5 w-5 text-primary" />,
        priority: latestRecord.retentionRate < 50 ? "high" : "medium",
      })
    }
  }

  // 2. Suggest spending more time on modules with little time spent
  for (const [moduleId, data] of Object.entries(moduleProgress)) {
    const totalTimeSpent = data.records.reduce(
      (sum, record) => sum + (record.timeSpent || 0),
      0
    )

    if (
      totalTimeSpent < 1800 && // Less than 30 minutes
      !existingGoals.some(
        (goal) =>
          goal.moduleId === Number(moduleId) &&
          goal.targetType === "TIME" &&
          !goal.achieved
      )
    ) {
      suggestions.push({
        type: "TIME",
        title: `Spend more time on ${data.module.title}`,
        description: `You've spent ${formatTime(totalTimeSpent)} on this module. Aim for at least 60 minutes.`,
        targetValue: 60, // 60 minutes
        moduleId: Number(moduleId),
        courseId: data.module.courseId,
        icon: <Clock className="h-5 w-5 text-primary" />,
        priority: totalTimeSpent < 600 ? "high" : "medium", // High priority if less than 10 minutes
      })
    }
  }

  // 3. Suggest completing modules with no progress
  const modulesWithNoProgress = await db.module.findMany({
    where: {
      progressRecords: {
        none: {
          userId: userId,
        },
      },
    },
    include: {
      course: true,
    },
    take: 5,
  })

  for (const module of modulesWithNoProgress) {
    if (
      !existingGoals.some(
        (goal) =>
          goal.moduleId === module.id &&
          goal.targetType === "COMPLETION" &&
          !goal.achieved
      )
    ) {
      suggestions.push({
        type: "COMPLETION",
        title: `Complete ${module.title}`,
        description: `You haven't started this module yet. Complete at least one study session.`,
        targetValue: 1,
        moduleId: module.id,
        courseId: module.courseId,
        icon: <CheckCircle className="h-5 w-5 text-primary" />,
        priority: "medium",
      })
    }
  }

  // Sort suggestions by priority
  suggestions.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Link href="/objectives" className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-medium tracking-tight">
          Suggested Learning Objectives
        </h1>
      </div>

      {suggestions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Target className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium mb-2">No suggestions available</h3>
          <p className="text-gray-500 mb-6">
            We don't have enough data to suggest objectives yet. Continue
            studying to get personalized suggestions.
          </p>
          <Link href="/objectives/new">
            <Button>Create Custom Objective</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-gray-500">
            Based on your learning progress, we've identified these potential
            objectives to help you improve.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestions.map((suggestion, index) => (
              <Card
                key={index}
                className={`border-l-4 ${suggestion.priority === "high" ? "border-l-red-500" : suggestion.priority === "medium" ? "border-l-yellow-500" : "border-l-green-500"}`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      {suggestion.icon}
                      <span className="ml-2">{suggestion.title}</span>
                    </CardTitle>
                    <div className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700">
                      {suggestion.priority === "high"
                        ? "High Priority"
                        : suggestion.priority === "medium"
                          ? "Medium Priority"
                          : "Low Priority"}
                    </div>
                  </div>
                  <CardDescription>{suggestion.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    <span className="font-medium">Target: </span>
                    {suggestion.type === "TIME" &&
                      `${suggestion.targetValue} minutes of study time`}
                    {suggestion.type === "MASTERY" &&
                      `${suggestion.targetValue}% retention rate`}
                    {suggestion.type === "COMPLETION" &&
                      `Complete ${suggestion.targetValue} study session(s)`}
                  </p>
                </CardContent>
                <CardFooter>
                  <form
                    action={`/api/learning-goal/create-suggested`}
                    method="POST"
                  >
                    <input
                      type="hidden"
                      name="title"
                      value={suggestion.title}
                    />
                    <input
                      type="hidden"
                      name="description"
                      value={suggestion.description}
                    />
                    <input
                      type="hidden"
                      name="targetType"
                      value={suggestion.type}
                    />
                    <input
                      type="hidden"
                      name="targetValue"
                      value={suggestion.targetValue}
                    />
                    <input
                      type="hidden"
                      name="moduleId"
                      value={suggestion.moduleId}
                    />
                    <input
                      type="hidden"
                      name="courseId"
                      value={suggestion.courseId}
                    />
                    <Button type="submit" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add This Objective
                    </Button>
                  </form>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/objectives/new">
              <Button variant="outline">Create Custom Objective</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
