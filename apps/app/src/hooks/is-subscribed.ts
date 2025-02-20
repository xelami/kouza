"use server"

import { db } from "@kouza/db"
import { stripe } from "@/auth/stripe"

export async function isUserSubscribed(userId: number) {
  const subscription = await db.subscription.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })

  if (!subscription?.stripeSubscriptionId) {
    return false
  }

  const stripeSubscription = await stripe.subscriptions.retrieve(
    subscription.stripeSubscriptionId
  )

  return stripeSubscription.status === "active"
}
