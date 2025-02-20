"use server"

import { auth } from "@/auth"
import { db } from "@kouza/db"

export async function getCourseCount() {
  const session = await auth()

  if (!session?.user) {
    return 0
  }

  const user = await db.user.findUnique({
    where: {
      id: Number(session.user.id),
    },
  })

  if (!user) {
    return 0
  }

  const courseCount = await db.course.count({
    where: {
      user: {
        id: user.id,
      },
    },
  })

  return courseCount
}
