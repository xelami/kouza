"use client"

import { useState } from "react"
import { Card } from "@kouza/ui/components/card"
import { Button } from "@kouza/ui/components/button"
import { toast } from "sonner"
import { Subscription } from "@/types/types"

interface SubscriptionDetailsProps {
  subscription: Subscription
  customerId: string
}

export function SubscriptionDetails({
  subscription,
  customerId,
}: SubscriptionDetailsProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleCancelSubscription = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/stripe/cancel-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriptionId: subscription.stripeSubscriptionId,
        }),
      })

      if (!response.ok) throw new Error("Failed to cancel subscription")

      toast.success(
        "Subscription will be canceled at the end of the billing period"
      )
    } catch (error) {
      toast.error("Failed to cancel subscription")
    } finally {
      setIsLoading(false)
    }
  }

  if (!subscription) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">No Active Subscription</h2>
        <Button variant="default" className="w-full">
          Subscribe Now
        </Button>
      </Card>
    )
  }

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Current Plan</h2>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-500">Plan</span>
          <span className="font-medium">
            {subscription.items[0]?.price?.product?.name}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Status</span>
          <span className="font-medium capitalize">{subscription.status}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Billing Period</span>
          <span className="font-medium">
            {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Amount</span>
          <span className="font-medium">
            ${subscription.items[0]?.price?.unit_amount! / 100}/
            {subscription.items[0]?.price?.recurring?.interval}
          </span>
        </div>
      </div>

      <div className="pt-4 border-t">
        <Button
          variant="destructive"
          className="w-full"
          disabled={isLoading}
          onClick={handleCancelSubscription}
        >
          {isLoading ? "Canceling..." : "Cancel Subscription"}
        </Button>
      </div>
    </Card>
  )
}
