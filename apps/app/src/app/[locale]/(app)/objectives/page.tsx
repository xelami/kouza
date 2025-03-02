import { auth } from "@/auth"
import { db } from "@kouza/db"
import { redirect } from "next/navigation"
import { isUserSubscribed } from "@/hooks/is-subscribed"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@kouza/ui/components/card"
import { Button } from "@kouza/ui/components/button"
import {
  Target,
  Clock,
  Award,
  Calendar,
  Plus,
  CheckCircle,
  XCircle,
  RefreshCcw,
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow, isPast, format } from "date-fns"
import { UpdateGoalsButton } from "@/components/objectives/update-goals-button"
import SubscribeButton from "@/components/subscribe-button"
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

export default async function ObjectivesPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const userId = Number(session.user.id)

  // Check if user is subscribed
  const userSubscribed = await isUserSubscribed(userId)

  if (!userSubscribed) {
    return (
      <div className="flex justify-center items-center h-1/2">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-medium tracking-tight mb-2">
            Subscribe to Kouza Pro to create and track your learning goals!
          </h1>
          <p className="text-lg text-center text-muted-foreground mb-4">
            Stay on top of your learning goals with Kouza Pro.
          </p>
          <SubscribeButton />
        </div>
      </div>
    )
  }

  // Fetch user's learning goals
  const learningGoals = await db.learningGoal.findMany({
    where: {
      userId: userId,
    },
    orderBy: [{ achieved: "asc" }, { deadline: "asc" }, { createdAt: "desc" }],
  })

  // Group goals by type
  const timeGoals = learningGoals.filter((goal) => goal.targetType === "TIME")
  const masteryGoals = learningGoals.filter(
    (goal) => goal.targetType === "MASTERY"
  )
  const completionGoals = learningGoals.filter(
    (goal) => goal.targetType === "COMPLETION"
  )

  // Calculate stats
  const totalGoals = learningGoals.length
  const achievedGoals = learningGoals.filter((goal) => goal.achieved).length
  const upcomingDeadlines = learningGoals.filter(
    (goal) => !goal.achieved && goal.deadline && !isPast(goal.deadline)
  ).length

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-medium tracking-tight">
          Your Learning Objectives
        </h1>
        <div className="flex gap-2">
          <UpdateGoalsButton userId={userId} />
          <Link href="/objectives/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Objective
            </Button>
          </Link>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-primary" />
              <p className="text-sm font-medium">Total Objectives</p>
            </div>
            <p className="text-2xl font-bold mt-2">{totalGoals}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              <p className="text-sm font-medium">Achieved</p>
            </div>
            <p className="text-2xl font-bold mt-2">{achievedGoals}</p>
            {totalGoals > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                {Math.round((achievedGoals / totalGoals) * 100)}% completion
                rate
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary" />
              <p className="text-sm font-medium">Upcoming Deadlines</p>
            </div>
            <p className="text-2xl font-bold mt-2">{upcomingDeadlines}</p>
          </CardContent>
        </Card>
      </div>

      {learningGoals.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Target className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium mb-2">No objectives yet</h3>
          <p className="text-gray-500 mb-6">
            Set learning objectives to track your progress
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/objectives/new">
              <Button>Create Manually</Button>
            </Link>
            <Link href="/objectives/suggest">
              <Button variant="outline">Get Suggestions</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Time-based Goals */}
          {timeGoals.length > 0 && (
            <div>
              <h2 className="text-2xl font-medium tracking-tight mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Study Time Goals
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {timeGoals.map((goal) => (
                  <Card
                    key={goal.id}
                    className={`${goal.achieved ? "border-green-500" : ""}`}
                  >
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span>{goal.title}</span>
                        {goal.achieved ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <div className="text-sm font-normal text-gray-500 flex items-center">
                            <Target className="h-4 w-4 mr-1" />
                            {formatTime(goal.targetValue * 60)}{" "}
                            {/* Convert minutes to seconds */}
                          </div>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {goal.description && (
                        <p className="text-gray-500 mb-4">{goal.description}</p>
                      )}
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="h-2.5 rounded-full bg-primary"
                          style={{
                            width: `${Math.min(goal.progress * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        {Math.round(goal.progress * 100)}% complete
                      </p>
                    </CardContent>
                    <CardFooter className="text-sm text-gray-500">
                      {goal.deadline ? (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {isPast(goal.deadline)
                            ? `Deadline passed: ${format(goal.deadline, "MMM d, yyyy")}`
                            : `Due ${formatDistanceToNow(goal.deadline, { addSuffix: true })}`}
                        </div>
                      ) : (
                        <div>No deadline set</div>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Mastery Goals */}
          {masteryGoals.length > 0 && (
            <div>
              <h2 className="text-2xl font-medium tracking-tight mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Mastery Goals
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {masteryGoals.map((goal) => (
                  <Card
                    key={goal.id}
                    className={`${goal.achieved ? "border-green-500" : ""}`}
                  >
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span>{goal.title}</span>
                        {goal.achieved ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <div className="text-sm font-normal text-gray-500 flex items-center">
                            <Target className="h-4 w-4 mr-1" />
                            {goal.targetValue}% mastery
                          </div>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {goal.description && (
                        <p className="text-gray-500 mb-4">{goal.description}</p>
                      )}
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="h-2.5 rounded-full bg-primary"
                          style={{
                            width: `${Math.min(goal.progress * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        {Math.round(goal.progress * 100)}% complete
                      </p>
                    </CardContent>
                    <CardFooter className="text-sm text-gray-500">
                      {goal.deadline ? (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {isPast(goal.deadline)
                            ? `Deadline passed: ${format(goal.deadline, "MMM d, yyyy")}`
                            : `Due ${formatDistanceToNow(goal.deadline, { addSuffix: true })}`}
                        </div>
                      ) : (
                        <div>No deadline set</div>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Completion Goals */}
          {completionGoals.length > 0 && (
            <div>
              <h2 className="text-2xl font-medium tracking-tight mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Completion Goals
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completionGoals.map((goal) => (
                  <Card
                    key={goal.id}
                    className={`${goal.achieved ? "border-green-500" : ""}`}
                  >
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span>{goal.title}</span>
                        {goal.achieved ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <div className="text-sm font-normal text-gray-500 flex items-center">
                            <Target className="h-4 w-4 mr-1" />
                            Complete {goal.targetValue} items
                          </div>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {goal.description && (
                        <p className="text-gray-500 mb-4">{goal.description}</p>
                      )}
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="h-2.5 rounded-full bg-primary"
                          style={{
                            width: `${Math.min(goal.progress * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        {Math.round(goal.progress * 100)}% complete
                      </p>
                    </CardContent>
                    <CardFooter className="text-sm text-gray-500">
                      {goal.deadline ? (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {isPast(goal.deadline)
                            ? `Deadline passed: ${format(goal.deadline, "MMM d, yyyy")}`
                            : `Due ${formatDistanceToNow(goal.deadline, { addSuffix: true })}`}
                        </div>
                      ) : (
                        <div>No deadline set</div>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
