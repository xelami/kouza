"use client"

import { db } from "@kouza/db"

export async function isUserSubscribed(userId: string) {
  if (!userId) return false

  const subscription = await db.subscription.findFirst({
    where: {
      userId: Number(userId),
      status: "ACTIVE",
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return !!subscription
}
