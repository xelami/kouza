import { NextResponse } from "next/server"
import { stripe } from "@/auth/stripe"
import { auth } from "@/auth"
import { db } from "@kouza/db"
import { PrismaError } from "@/types/types"

export const runtime = "edge"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 })
    }

    const url = new URL(request.url)
    const plan = url.searchParams.get("plan")

    if (!plan || !["monthly", "annual"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan type" }, { status: 400 })
    }

    const priceId =
      plan === "monthly"
        ? process.env.STRIPE_MONTHLY_PRICE_ID
        : process.env.STRIPE_ANNUAL_PRICE_ID

    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID not configured" },
        { status: 500 }
      )
    }

    const origin = request.headers.get("origin")
    if (!origin) {
      throw new Error("Missing origin header")
    }

    const user = await db.user.findUnique({
      where: { id: Number(session.user.id) },
      select: { stripeCustomerId: true, email: true },
    })

    let customerId = user?.stripeCustomerId

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user?.email!,
        metadata: { userId: session.user.id },
      })

      await db.user.update({
        where: { id: Number(session.user.id) },
        data: { stripeCustomerId: customer.id },
      })

      customerId = customer.id
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      success_url: `${origin}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}`,
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error: unknown) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json(
      { error: (error as PrismaError).message },
      { status: 500 }
    )
  }
}
