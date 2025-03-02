import { auth } from "@/auth"
import { db } from "@kouza/db"
import { redirect, notFound } from "next/navigation"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@kouza/ui/components/card"
import { Clock, BookOpen, Brain, ArrowLeft, Calendar } from "lucide-react"
import Link from "next/link"
import { MasteryIndicator } from "@/components/progress/mastery-indicator"
import { RetentionProgress } from "@/components/progress/retention-progress"
import { Button } from "@kouza/ui/components/button"

// Helper function to format time in seconds to a readable format
function formatTime(seconds: number | null): string {
  if (!seconds) return "0 sec"

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

// Format date to a readable format
function formatDate(date: Date | null): string {
  if (!date) return "N/A"
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

interface ModuleProgressPageProps {
  params: {
    courseSlug: string
    moduleSlug: string
  }
}

export default async function ModuleProgressPage({
  params,
}: ModuleProgressPageProps) {
  const { courseSlug, moduleSlug } = params
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const userId = Number(session.user.id)

  // Fetch course and module data
  const course = await db.course.findUnique({
    where: {
      slug: courseSlug,
    },
    include: {
      modules: {
        where: {
          slug: moduleSlug,
        },
        include: {
          progressRecords: {
            where: {
              userId: userId,
            },
            orderBy: {
              recordedAt: "desc",
            },
          },
          lessons: true,
        },
      },
    },
  })

  if (!course || course.modules.length === 0) {
    notFound()
  }

  const module = course.modules[0]!

  // Fetch study sessions for this module
  const studySessions = await db.studySession.findMany({
    where: {
      userId: userId,
      courseId: course.id,
      moduleId: module.id,
      endTime: { not: null },
    },
    orderBy: {
      startTime: "desc",
    },
    take: 10,
  })

  // Calculate total time spent
  const totalTimeSpent = studySessions.reduce((total, session) => {
    return total + (session.duration || 0)
  }, 0)

  // Get latest progress record
  const latestProgressRecord = module.progressRecords[0]

  // Calculate progress over time
  const progressOverTime = module.progressRecords.slice(0, 5).reverse()

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Link
          href="/progress"
          className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Progress Overview
        </Link>

        <h1 className="text-3xl font-medium tracking-tight mb-2">
          {module.title}
        </h1>
        <p className="text-gray-500 mb-4">
          From course:{" "}
          <Link
            href={`/course/${courseSlug}`}
            className="text-primary hover:underline"
          >
            {course.title}
          </Link>
        </p>
      </div>

      {/* Module Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              Retention Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-2">
              <p className="text-3xl font-bold mr-3">
                {latestProgressRecord?.retentionRate || 0}%
              </p>
              <MasteryIndicator
                masteryScore={latestProgressRecord?.masteryScore}
                retentionRate={latestProgressRecord?.retentionRate}
              />
            </div>
            <RetentionProgress
              retentionRate={latestProgressRecord?.retentionRate}
              size="lg"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Total Study Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatTime(totalTimeSpent)}</p>
            <p className="text-sm text-gray-500 mt-1">
              Across {studySessions.length} sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Lessons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{module.lessons.length}</p>
            <p className="text-sm text-gray-500 mt-1">In this module</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Study Sessions */}
      <h2 className="text-2xl font-medium tracking-tight mb-4">
        Recent Study Sessions
      </h2>

      {studySessions.length === 0 ? (
        <Card>
          <CardContent className="py-6 text-center">
            <p className="text-gray-500 mb-4">No study sessions recorded yet</p>
            <Link href={`/course/${courseSlug}/modules/${moduleSlug}`}>
              <Button>Start Studying</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4 mb-8">
          {studySessions.map((session) => (
            <Card key={session.id}>
              <CardContent className="py-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                    <div>
                      <p className="font-medium">
                        {formatDate(session.startTime)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Duration: {formatTime(session.duration)}
                      </p>
                    </div>
                  </div>

                  {session.progressRecordId && (
                    <div className="flex items-center">
                      <Brain className="h-5 w-5 mr-2 text-gray-500" />
                      <p className="font-medium">Session ID: {session.id}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Progress Over Time */}
      {progressOverTime.length > 1 && (
        <>
          <h2 className="text-2xl font-medium tracking-tight mb-4">
            Progress Over Time
          </h2>

          <Card className="mb-8">
            <CardContent className="py-6">
              <div className="space-y-4">
                {progressOverTime.map((record, index) => (
                  <div key={record.id} className="flex items-center">
                    <div className="w-32 text-sm text-gray-500">
                      {formatDate(record.recordedAt)}
                    </div>
                    <div className="flex-1">
                      <RetentionProgress retentionRate={record.retentionRate} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Link href={`/course/${courseSlug}/modules/${moduleSlug}`}>
          <Button>Continue Learning</Button>
        </Link>

        <Link href={`/course/${courseSlug}/modules/${moduleSlug}/flashcards`}>
          <Button variant="outline">Review Flashcards</Button>
        </Link>
      </div>
    </div>
  )
}
