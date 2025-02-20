import { stripe } from "@/auth/stripe"
import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@kouza/db"

export const runtime = "edge"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const { subscriptionId } = await request.json()

    const subscription = await db.subscription.findFirst({
      where: {
        stripeSubscriptionId: subscriptionId,
        userId: Number(session.user.id),
      },
    })

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      )
    }

    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error canceling subscription:", error)
    return NextResponse.json(
      { error: "Failed to cancel subscription" },
      { status: 500 }
    )
  }
}
