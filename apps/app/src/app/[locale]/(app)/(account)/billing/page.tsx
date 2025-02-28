import { auth } from "@/auth"
import { db } from "@kouza/db"
import { stripe } from "@/auth/stripe"
import { redirect } from "next/navigation"
import { PaymentHistory } from "./payment-history"
import { SubscriptionDetails } from "./subscription-details"

async function getSubscriptionData(userId: number) {
  const subscription = await db.subscription.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })

  if (!subscription?.stripeSubscriptionId) {
    return null
  }

  const stripeSubscription = await stripe.subscriptions.retrieve(
    subscription.stripeSubscriptionId,
    {
      expand: ["items.data.price.product", "latest_invoice.payment_intent"],
    }
  )

  return {
    ...subscription,
    items: stripeSubscription.items.data,
    latestInvoice: stripeSubscription.latest_invoice,
  }
}

async function getPaymentHistory(stripeCustomerId: string) {
  return await stripe.paymentIntents.list({
    customer: stripeCustomerId,
    limit: 10,
    expand: ["data.payment_method"],
  })
}

export default async function BillingPage() {
  const session = await auth()
  if (!session?.user) redirect("/")

  const user = await db.user.findUnique({
    where: { id: Number(session.user.id) },
  })
  if (!user?.stripeCustomerId) redirect("/")

  const [subscriptionData, paymentHistory] = await Promise.all([
    getSubscriptionData(user.id),
    getPaymentHistory(user.stripeCustomerId),
  ])

  return (
    <div className="max-w-5xl w-full mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-medium tracking-tight">
          Billing & Subscription
        </h1>
        <p className="text-lg text-gray-500">
          Manage your subscription and payment methods
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <SubscriptionDetails
            subscription={subscriptionData}
            customerId={user.stripeCustomerId}
          />
        </div>

        <div>
          <PaymentHistory payments={paymentHistory.data} />
        </div>
      </div>
    </div>
  )
}
