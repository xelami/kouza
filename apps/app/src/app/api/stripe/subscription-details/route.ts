import { stripe } from "@/auth/stripe"
import { NextResponse } from "next/server"
import Stripe from "stripe"

export const runtime = "edge"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get("session_id")

  if (!sessionId) {
    return NextResponse.json(
      { error: "Missing session_id parameter" },
      { status: 400 }
    )
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription", "subscription.plan"],
    })

    if (!session.subscription) {
      return NextResponse.json(
        { error: "No subscription found" },
        { status: 404 }
      )
    }

    const subscription =
      typeof session.subscription === "string"
        ? await stripe.subscriptions.retrieve(session.subscription, {
            expand: ["items.data.price.product"],
          })
        : session.subscription

    return NextResponse.json({
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      planName:
        (subscription.items.data[0]?.price?.product as Stripe.Product)?.name ||
        "Premium Plan",
    })
  } catch (error) {
    console.error("Error fetching subscription details:", error)
    return NextResponse.json(
      { error: "Failed to fetch subscription details" },
      { status: 500 }
    )
  }
}
