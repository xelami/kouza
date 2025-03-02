import { auth } from "@/auth"
import { db } from "@kouza/db"
import { redirect } from "next/navigation"
import { isUserSubscribed } from "@/hooks/is-subscribed"
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
  BarChart,
  Clock,
  BookOpen,
  TrendingUp,
  TrendingDown,
  Award,
  Brain,
} from "lucide-react"
import Link from "next/link"
import { MasteryIndicator } from "@/components/progress/mastery-indicator"
import { RetentionProgress } from "@/components/progress/retention-progress"
import { MasteryGrid } from "@/components/progress/mastery-grid"
import { MasterySummary } from "@/components/progress/mastery-summary"
import SubscribeButton from "@/components/subscribe-button"

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

export default async function ProgressPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const userId = Number(session.user.id)

  // Check if user is subscribed
  const userSubscribed = await isUserSubscribed(userId)

  // if (!userSubscribed) {
  //   return (
  //     <div className="flex justify-center items-center h-1/2">
  //       <div className="max-w-2xl mx-auto text-center">
  //         <h1 className="text-3xl font-medium tracking-tight mb-2">
  //           Subscribe to Kouza Pro to view your progress!
  //         </h1>
  //         <p className="text-lg text-center text-muted-foreground mb-4">
  //           We&apos;ll keep your progress safe and sound in the meantime!
  //         </p>
  //         <SubscribeButton />
  //       </div>
  //     </div>
  //   )
  // }

  // Fetch user's courses with progress data
  const userCourses = await db.course.findMany({
    where: {
      studySessions: {
        some: {
          userId: userId,
        },
      },
    },
    include: {
      modules: {
        include: {
          progressRecords: {
            where: {
              userId: userId,
            },
            orderBy: {
              recordedAt: "desc",
            },
            take: 1,
          },
        },
        orderBy: {
          order: "asc",
        },
      },
      progressRecords: {
        where: {
          userId: userId,
        },
        orderBy: {
          recordedAt: "desc",
        },
        take: 1,
      },
      studySessions: {
        where: {
          userId: userId,
          endTime: { not: null },
        },
      },
    },
  })

  // Calculate overall stats
  const totalTimeSpent = userCourses.reduce((total, course) => {
    return (
      total +
      course.studySessions.reduce((courseTotal, session) => {
        return courseTotal + (session.duration || 0)
      }, 0)
    )
  }, 0)

  const totalSessions = userCourses.reduce((total, course) => {
    return total + course.studySessions.length
  }, 0)

  const averageRetention =
    userCourses.length > 0
      ? userCourses.reduce((total, course) => {
          const courseRetention = course.modules.reduce(
            (moduleTotal, module) => {
              if (
                module.progressRecords.length > 0 &&
                module.progressRecords[0]?.retentionRate
              ) {
                return moduleTotal + module.progressRecords[0].retentionRate
              }
              return moduleTotal
            },
            0
          )

          const moduleCount = course.modules.filter(
            (m) =>
              m.progressRecords.length > 0 &&
              m.progressRecords[0]?.retentionRate
          ).length

          return total + (moduleCount > 0 ? courseRetention / moduleCount : 0)
        }, 0) / userCourses.length
      : 0

  // Prepare data for Topic Mastery visualization
  const coursesWithModules = userCourses.map((course) => ({
    id: course.id,
    title: course.title,
    slug: course.slug,
    modules: course.modules.map((module) => ({
      id: module.id,
      title: module.title,
      slug: module.slug,
      masteryScore: module.progressRecords[0]?.masteryScore || null,
      retentionRate: module.progressRecords[0]?.retentionRate || null,
    })),
  }))

  // Calculate mastery levels for summary
  const allModulesWithProgress = userCourses.flatMap((course) =>
    course.modules
      .filter(
        (module) =>
          module.progressRecords.length > 0 &&
          (module.progressRecords[0]?.masteryScore !== null ||
            module.progressRecords[0]?.retentionRate !== null)
      )
      .map((module) => ({
        id: module.id,
        title: module.title,
        score:
          module.progressRecords[0]?.masteryScore !== null
            ? module.progressRecords[0]?.masteryScore || 0
            : module.progressRecords[0]?.retentionRate || 0,
      }))
  )

  const totalModules = allModulesWithProgress.length
  const averageMastery =
    totalModules > 0
      ? allModulesWithProgress.reduce(
          (sum, module) => sum + (module.score || 0),
          0
        ) / totalModules
      : 0

  // Calculate mastery level distribution
  interface MasteryLevel {
    level: string
    count: number
    color: string
  }

  const masteryLevels: MasteryLevel[] = [
    { level: "Expert (90-100%)", count: 0, color: "bg-green-500" },
    { level: "Advanced (80-89%)", count: 0, color: "bg-green-400" },
    { level: "Proficient (70-79%)", count: 0, color: "bg-green-300" },
    { level: "Competent (60-69%)", count: 0, color: "bg-yellow-500" },
    { level: "Developing (50-59%)", count: 0, color: "bg-yellow-400" },
    { level: "Basic (40-49%)", count: 0, color: "bg-orange-500" },
    { level: "Novice (30-39%)", count: 0, color: "bg-orange-400" },
    { level: "Beginning (0-29%)", count: 0, color: "bg-red-500" },
  ]

  // Count modules in each mastery level
  allModulesWithProgress.forEach((module) => {
    const score = module.score || 0

    // Use a type-safe approach to update counts
    if (score >= 90) {
      masteryLevels[0] && (masteryLevels[0].count += 1)
    } else if (score >= 80) {
      masteryLevels[1] && (masteryLevels[1].count += 1)
    } else if (score >= 70) {
      masteryLevels[2] && (masteryLevels[2].count += 1)
    } else if (score >= 60) {
      masteryLevels[3] && (masteryLevels[3].count += 1)
    } else if (score >= 50) {
      masteryLevels[4] && (masteryLevels[4].count += 1)
    } else if (score >= 40) {
      masteryLevels[5] && (masteryLevels[5].count += 1)
    } else if (score >= 30) {
      masteryLevels[6] && (masteryLevels[6].count += 1)
    } else {
      masteryLevels[7] && (masteryLevels[7].count += 1)
    }
  })

  // Get strongest and weakest topics
  const sortedModules = [...allModulesWithProgress].sort(
    (a, b) => b.score - a.score
  )
  const strongestTopics = sortedModules.slice(0, 5)
  const weakestTopics = [...sortedModules].reverse().slice(0, 5)

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-medium tracking-tight mb-6">
        Your Learning Progress
      </h1>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
              Across {totalSessions} sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Courses Studied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{userCourses.length}</p>
            <p className="text-sm text-gray-500 mt-1">With active progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              Average Retention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {Math.round(averageRetention)}%
            </p>
            <div className="mt-2">
              <RetentionProgress retentionRate={Math.round(averageRetention)} />
            </div>
          </CardContent>
        </Card>
      </div>

      {userCourses.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium mb-2">No progress data yet</h3>
          <p className="text-gray-500 mb-6">
            Start studying to see your progress here
          </p>
          <Link
            href="/courses"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <>
          {/* Topic Mastery Summary */}
          <div className="mb-8">
            <h2 className="text-2xl font-medium tracking-tight mb-6">
              Topic Mastery Overview
            </h2>
            <MasterySummary
              totalModules={totalModules}
              averageMastery={averageMastery}
              masteryLevels={masteryLevels}
              strongestTopics={strongestTopics}
              weakestTopics={weakestTopics}
            />
          </div>

          {/* Topic Mastery Visualization */}
          <div className="mb-8">
            <h2 className="text-2xl font-medium tracking-tight mb-6">
              Topic Mastery Visualization
            </h2>
            <MasteryGrid courses={coursesWithModules} />
          </div>

          {/* Course Progress Tabs */}
          <div className="mb-8">
            <h2 className="text-2xl font-medium tracking-tight mb-6">
              Course Progress Details
            </h2>
            <Tabs defaultValue={userCourses[0]?.id.toString()}>
              <TabsList className="mb-6 flex flex-wrap">
                {userCourses.map((course) => (
                  <TabsTrigger key={course.id} value={course.id.toString()}>
                    {course.title}
                  </TabsTrigger>
                ))}
              </TabsList>

              {userCourses.map((course) => (
                <TabsContent key={course.id} value={course.id.toString()}>
                  <div className="mb-6">
                    <h2 className="text-2xl font-medium tracking-tight mb-2">
                      {course.title}
                    </h2>
                    <p className="text-gray-500 mb-4">{course.description}</p>

                    {/* Course Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center">
                            <Clock className="h-5 w-5 mr-2 text-primary" />
                            <p className="text-sm font-medium">Time Spent</p>
                          </div>
                          <p className="text-2xl font-bold mt-2">
                            {formatTime(
                              course.studySessions.reduce(
                                (total, session) =>
                                  total + (session.duration || 0),
                                0
                              )
                            )}
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center">
                            <BookOpen className="h-5 w-5 mr-2 text-primary" />
                            <p className="text-sm font-medium">
                              Study Sessions
                            </p>
                          </div>
                          <p className="text-2xl font-bold mt-2">
                            {course.studySessions.length}
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center">
                            <Award className="h-5 w-5 mr-2 text-primary" />
                            <p className="text-sm font-medium">Modules</p>
                          </div>
                          <p className="text-2xl font-bold mt-2">
                            {course.modules.length}
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Module Progress */}
                    <h3 className="text-xl font-medium tracking-tight mb-4">
                      Module Progress
                    </h3>

                    <div className="space-y-4">
                      {course.modules.map((module) => {
                        const moduleRecord = module.progressRecords[0]
                        const hasProgress =
                          moduleRecord &&
                          (moduleRecord.retentionRate !== null ||
                            moduleRecord.timeSpent !== null ||
                            moduleRecord.masteryScore !== null)

                        // Use masteryScore if available, otherwise fall back to retentionRate
                        const masteryValue =
                          moduleRecord?.masteryScore !== null &&
                          moduleRecord?.masteryScore !== undefined
                            ? moduleRecord.masteryScore
                            : moduleRecord?.retentionRate

                        return (
                          <Card
                            key={module.id}
                            className={`
                            ${masteryValue && masteryValue >= 70 ? "border-l-4 border-l-green-500" : ""}
                            ${masteryValue && masteryValue < 50 ? "border-l-4 border-l-red-500" : ""}
                            ${masteryValue && masteryValue >= 50 && masteryValue < 70 ? "border-l-4 border-l-yellow-500" : ""}
                          `}
                          >
                            <CardContent className="pt-6">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="text-lg font-medium mb-1">
                                    {module.title}
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    {module.description}
                                  </p>
                                </div>

                                <MasteryIndicator
                                  masteryScore={moduleRecord?.masteryScore}
                                  retentionRate={moduleRecord?.retentionRate}
                                />
                              </div>

                              {hasProgress ? (
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                  <div>
                                    <p className="text-sm text-gray-500 mb-2">
                                      Retention Rate
                                    </p>
                                    <RetentionProgress
                                      retentionRate={
                                        moduleRecord?.retentionRate
                                      }
                                    />
                                  </div>

                                  <div>
                                    <p className="text-sm text-gray-500 mb-2">
                                      Time Spent
                                    </p>
                                    <p className="text-sm font-medium">
                                      {formatTime(moduleRecord?.timeSpent)}
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500 italic mt-4">
                                  No progress data yet
                                </p>
                              )}

                              <div className="mt-4">
                                <Link
                                  href={`/course/${course.slug}/modules/${module.slug}`}
                                  className="text-sm text-primary hover:underline"
                                >
                                  Study this module
                                </Link>
                                {hasProgress && (
                                  <Link
                                    href={`/progress/${course.slug}/${module.slug}`}
                                    className="text-sm text-primary hover:underline ml-4"
                                  >
                                    View detailed progress
                                  </Link>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </>
      )}
    </div>
  )
}
