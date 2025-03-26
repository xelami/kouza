import { auth } from "@/auth"
import CourseDialog from "@/components/dialogs/course"
import LevelProgress from "@/components/level-progress"
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
  CardFooter,
} from "@kouza/ui/components/card"
import { BicepsFlexed, BookIcon, Newspaper, NotebookIcon } from "lucide-react"
import { redirect } from "next/navigation"
import { formatNextReview } from "@/lib/utils"
import { getDashboardData } from "@/app/api/user/get-user"
import { ReviseStats } from "@/types/types"

export const runtime = "edge"

export default async function Home() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const {
    userStats,
    reviseStats,
    totalDueCards,
    totalCourses,
    flashcardsReviewed,
    totalNotes,
  } = await getDashboardData(Number(session?.user.id))

  console.log(reviseStats)

  return (
    <>
      <div className="flex flex-col md:grid grid-cols-12 grid-rows-4 gap-4 py-12 h-full">
        <Card className="md:col-span-8 md:row-span-2 border shadow-md rounded-2xl h-full flex flex-col">
          <CardHeader>
            <CardTitle className="tracking-tigher">Recent Activity</CardTitle>
            <CardDescription>
              Here's what's happening with your courses and revisions.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center justify-between gap-8 flex-1">
            <div className="flex flex-col h-full w-full gap-2 min-h-0">
              <div className="text-center">
                <h3 className="text-3xl tracking-tigher">Courses</h3>
                <span>
                  {" "}
                  {totalCourses} {totalCourses === 1 ? "course" : "courses"}{" "}
                  generated
                </span>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <BookIcon className="w-16 h-16 md:w-24 md:h-24" />
              </div>
            </div>

            <div className="flex flex-col h-full w-full min-h-0">
              <div className="text-center">
                <h3 className="text-3xl tracking-tigher">Revisions</h3>
                <span>{flashcardsReviewed} cards reviewed this month</span>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <BicepsFlexed className="w-16 h-16 md:w-24 md:h-24" />
              </div>
            </div>

            <div className="flex flex-col h-full w-full min-h-0">
              <div className="text-center">
                <h3 className="text-3xl tracking-tigher">Notes</h3>
                <span>
                  {totalNotes} {totalNotes === 1 ? "note" : "notes"} created
                </span>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <NotebookIcon className="w-16 h-16 md:w-24 md:h-24" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 md:mt-0 md:col-span-4 md:row-span-2">
          <Card className="border shadow-md rounded-2xl flex flex-col h-full w-full min-h-0">
            <CardHeader className="text-center">
              <CardTitle className="tracking-tigher">
                Generate a Course
              </CardTitle>
              <CardDescription>
                Generate a course based on your interests and goals.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center">
              <Newspaper className="w-24 h-24" />
            </CardContent>
            <CardFooter className="flex justify-center">
              <CourseDialog />
            </CardFooter>
          </Card>
        </div>

        <div className="mt-8 md:mt-0 md:col-span-4 md:row-span-2 border shadow-md rounded-2xl relative flex flex-col items-center justify-center h-[400px] md:h-full p-4">
          <p className="absolute top-4 left-4 text-2xl font-semibold tracking-tighter mb-4">
            Recommended Courses
          </p>
          <div className="flex-1 flex flex-col items-center justify-center gap-2 w-full h-full mt-24 md:mt-0">
            <CourseDialog pregeneratedPrompt="I want to learn all about machine learning.">
              <div className="cursor-pointer flex flex-col justify-center items-center gap-2 p-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition w-full">
                <div className="flex flex-col text-center">
                  <p className="font-medium">
                    Introduction to Machine Learning
                  </p>
                  <p className="text-sm text-gray-600">
                    Get started with ML basics.
                  </p>
                </div>
              </div>
            </CourseDialog>
            <CourseDialog pregeneratedPrompt="I want to become a JavaScript expert.">
              <div className="cursor-pointer flex flex-col justify-center items-center gap-2 p-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition w-full">
                <div className="flex flex-col text-center">
                  <p className="font-medium">Advanced JavaScript Techniques</p>
                  <p className="text-sm text-gray-600">
                    Deep dive into JS modern features.
                  </p>
                </div>
              </div>
            </CourseDialog>
            <CourseDialog pregeneratedPrompt="I want to learn all about creative writing.">
              <div className="cursor-pointer flex flex-col justify-center items-center gap-2 p-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition w-full">
                <div className="flex flex-col text-center">
                  <p className="font-medium">Creative Writing Workshop</p>
                  <p className="text-sm text-gray-600">
                    Enhance your storytelling skills.
                  </p>
                </div>
              </div>
            </CourseDialog>
          </div>
        </div>

        <div className="mt-8 md:mt-0 md:col-span-4 md:row-span-2 border shadow-md rounded-2xl relative flex flex-col items-center justify-center h-[400px] md:h-full p-4">
          <div className="absolute top-4 left-4 flex gap-2 items-center text-2xl font-semibold tracking-tighter mb-4">
            <p className="text-2xl font-semibold tracking-tighter">Revise</p>
            {totalDueCards > 0 && (
              <div className="bg-primary/10 text-primary text-center rounded-full px-3 py-1 text-sm">
                {totalDueCards + totalDueCards === 1
                  ? "1 card"
                  : `${totalDueCards} cards`}
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-2 w-full h-full mt-24 md:mt-0">
            {reviseStats.length > 0 ? (
              <>
                {reviseStats.map((card: ReviseStats) => (
                  <div
                    key={card.id}
                    className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 w-full"
                  >
                    <div className="flex items-center text-center justify-between">
                      <div>
                        <p className="font-medium">
                          {card.module.course.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {card.module.title}
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatNextReview(card.nextReview)}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground">
                <BicepsFlexed className="w-12 h-12 mb-2 opacity-50" />
                <p>All caught up!</p>
                <p className="text-sm">No cards due for review</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 md:mt-0 md:col-span-4 md:row-span-2 border shadow-md rounded-2xl relative flex flex-col items-center justify-center h-[400px] md:h-full p-4">
          <p className="absolute top-4 left-4 text-2xl font-semibold tracking-tighter mb-4">
            Your Stats
          </p>

          <LevelProgress
            level={userStats?.level ?? 1}
            points={userStats?.points ?? 0}
          />
        </div>
      </div>
    </>
  )
}
