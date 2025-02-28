"use server"

import { db } from "@kouza/db"
import { stripe } from "@/auth/stripe"

export async function getUserData(userId: string | undefined) {
  if (!userId) {
    return {
      isSubscribed: false,
      courseCount: 0,
    }
  }

  const subscription = await db.subscription.findFirst({
    where: { userId: Number(userId) },
    orderBy: { createdAt: "desc" },
  })

  let isSubscribed = false
  if (subscription?.stripeSubscriptionId) {
    const stripeSubscription = await stripe.subscriptions.retrieve(
      subscription.stripeSubscriptionId
    )
    isSubscribed = stripeSubscription.status === "active"
  }

  const courseCount = await db.course.count({
    where: {
      generatedBy: Number(userId),
    },
  })

  return {
    isSubscribed,
    courseCount,
  }
}
