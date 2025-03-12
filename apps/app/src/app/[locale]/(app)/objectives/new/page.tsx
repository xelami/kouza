import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@kouza/db"
import { NewObjectiveForm } from "@/components/objectives/new-objective-form"

export const runtime = "edge"

export default async function NewObjectivePage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const userId = Number(session.user.id)

  // Fetch courses and modules for the form
  const courses = await db.course.findMany({
    include: {
      modules: {
        orderBy: {
          order: "asc",
        },
      },
    },
    orderBy: {
      title: "asc",
    },
  })

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-medium tracking-tight mb-6">
        Create New Learning Objective
      </h1>

      <NewObjectiveForm courses={courses} userId={userId} />
    </div>
  )
}
