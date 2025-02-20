"use server"

import { db } from "@kouza/db"

export async function getModule(courseSlug: string, moduleSlug: string) {
  const module = await db.module.findFirst({
    where: {
      slug: moduleSlug,
      course: { slug: courseSlug },
    },
    include: {
      lessons: true,
    },
  })

  if (!module) {
    return null
  }

  return module
}
