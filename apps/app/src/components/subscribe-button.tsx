"use client"

import { useState } from "react"
import { Button } from "@kouza/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@kouza/ui/components/dialog"
import { Switch } from "@kouza/ui/components/switch"
import { Check } from "lucide-react"
import confetti from "canvas-confetti"

export default function SubscribeButton() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isAnnual, setIsAnnual] = useState(false)

  const handleSubscribe = async () => {
    setLoading(true)
    try {
      const planType = isAnnual ? "annual" : "monthly"
      const res = await fetch(
        `/api/stripe/create-checkout-session?plan=${planType}`,
        {
          method: "POST",
        }
      )
      const data = await res.json()

      if (data.error) {
        console.error("Error creating checkout session:", data.error)
        return
      }

      window.location.href = data.url
    } catch (error) {
      console.error("Failed to create checkout session:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            })
          }}
        >
          Upgrade to Pro
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Choose your plan</DialogTitle>
          <DialogDescription>
            Get unlimited access to all courses and features
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">Annual billing</span>
              <span className="text-sm text-gray-500">Save 20%</span>
            </div>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-green-500"
            />
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="text-lg font-medium">
                  {isAnnual ? "$112/year" : "$12.99/month"}
                </div>
                <div className="text-sm text-gray-500">Pro</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Unlimited courses</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>AI-powered learning assistant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Unlimited notes and flashcards</span>
                </div>
              </div>
              <Button
                size="lg"
                className="w-full"
                onClick={handleSubscribe}
                disabled={loading}
              >
                {loading ? "Redirecting..." : "Subscribe"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
