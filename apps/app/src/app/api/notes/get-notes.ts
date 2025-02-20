"use server"

import { auth } from "@/auth"
import { db } from "@kouza/db"

export async function getNotes() {
  const session = await auth()
  const user = session?.user

  if (!user) {
    return []
  }

  const notes = await db.note.findMany({
    where: {
      userId: Number(user.id),
    },
    include: {
      lesson: true,
      module: true,
      course: true,
    },
  })

  return notes
}
