import { stripe, stripeWebhookSecret } from "@/auth/stripe"
import { db } from "@kouza/db"
import type StripeType from "stripe"

export const runtime = "edge"

export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(request: Request) {
  const payload = await request.text()
  const sig = request.headers.get("stripe-signature")

  let event

  try {
    event = await stripe.webhooks.constructEventAsync(
      payload,
      sig!,
      stripeWebhookSecret
    )
  } catch (err: any) {
    console.error(
      "Webhook signature verification failed:",
      (err as Error).message
    )
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
    case "customer.subscription.trial_will_end": {
      const subscription = event.data.object as StripeType.Subscription
      const customerId =
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer.id

      const user = await db.user.findUnique({
        where: { stripeCustomerId: customerId },
      })

      if (!user) {
        console.error(`No user found with Stripe customer ID: ${customerId}`)
        break
      }

      let status = subscription.status.toUpperCase()
      if (subscription.cancel_at_period_end) {
        status = "CANCELED"
      } else if (subscription.trial_end) {
        const trialEnd = new Date(subscription.trial_end * 1000)
        if (trialEnd < new Date()) {
          status = "PAST_DUE"
        }
      }

      await db.subscription.upsert({
        where: { stripeSubscriptionId: subscription.id },
        update: {
          status: status as any,
          planId: subscription.items.data[0]?.price?.id || "",
          currentPeriodStart: new Date(
            subscription.current_period_start * 1000
          ),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          canceledAt: subscription.canceled_at
            ? new Date(subscription.canceled_at * 1000)
            : null,
        },
        create: {
          userId: user.id,
          stripeSubscriptionId: subscription.id,
          status: status as any,
          planId: subscription.items.data[0]?.price?.id || "",
          currentPeriodStart: new Date(
            subscription.current_period_start * 1000
          ),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          canceledAt: subscription.canceled_at
            ? new Date(subscription.canceled_at * 1000)
            : null,
        },
      })
      break
    }

    case "invoice.payment_succeeded":
    case "invoice.payment_failed": {
      const invoice = event.data.object as StripeType.Invoice

      if (invoice.subscription) {
        const subscription = await stripe.subscriptions.retrieve(
          typeof invoice.subscription === "string"
            ? invoice.subscription
            : invoice.subscription.id
        )

        const status =
          event.type === "invoice.payment_failed"
            ? "PAST_DUE"
            : subscription.status.toUpperCase()

        await db.subscription.upsert({
          where: { stripeSubscriptionId: subscription.id },
          update: {
            status: status as any,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
          create: {
            userId: Number(subscription.metadata.userId),
            stripeSubscriptionId: subscription.id,
            status: status as any,
            planId: subscription.items.data[0]?.price?.id || "",
            currentPeriodStart: new Date(
              subscription.current_period_start * 1000
            ),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
        })
      }
      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 })
}
