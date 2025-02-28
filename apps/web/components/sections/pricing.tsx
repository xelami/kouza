"use client"

import React, { useState } from "react"
import { Button } from "@kouza/ui/components/button"
import { Check, X } from "lucide-react"
import Link from "next/link"
import { Switch } from "@kouza/ui/components/switch"
import confetti from "canvas-confetti"

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false)

  const prices = {
    monthly: 12.95,
    annual: 9.95,
  }

  const annualSavings = Math.round(
    ((prices.monthly - prices.annual) / prices.monthly) * 100
  )

  const handlePlanChange = (checked: boolean) => {
    setIsAnnual(checked)
    if (checked) {
      confetti({
        particleCount: 240,
        spread: 360,
        origin: { y: 0.5 },
      })
    }
  }

  return (
    <section
      id="pricing"
      className="max-w-[1400px] flex flex-col items-center w-full mx-auto p-4 my-24"
    >
      <div className="flex flex-col items-center gap-2 mb-12">
        <span className="border border-gray-200 px-4 py-1 rounded-full text-sm font-medium tracking-tight bg-gradient-to-r from-black/10 to-black/20">
          Pricing
        </span>
        <h3 className="text-5xl sm:text-6xl font-medium text-center tracking-tight text-foreground">
          Pricing That Makes Sense
        </h3>
      </div>

      <div className="flex flex-col items-center gap-4 mb-8">
        <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs px-2 py-0.5 rounded-full font-medium">
          Save {annualSavings}%
        </span>
        <div className="flex items-center gap-4 mb-8">
          <span
            className={`text-sm ${!isAnnual ? "text-primary" : "text-muted-foreground"} font-medium`}
          >
            Monthly
          </span>
          <Switch checked={isAnnual} onCheckedChange={handlePlanChange} />
          <span
            className={`text-sm ${isAnnual ? "text-primary" : "text-muted-foreground"} font-medium`}
          >
            Annual
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center sm:justify-none relative w-full max-w-5xl mx-auto">
        <div className="hidden sm:block w-[400px] border border-border rounded-2xl p-8 bg-card shadow-sm z-0">
          <div className="flex flex-col gap-4">
            <h4 className="text-2xl font-medium text-foreground">Free</h4>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-foreground">$0</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <p className="text-muted-foreground">Perfect for getting started</p>
            <Link href="https://app.kouza-ai.com/login">
              <Button variant="outline" className="w-full">
                Get Started
              </Button>
            </Link>
          </div>
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-primary" />
              <span className="text-foreground">
                3 limited courses per month
              </span>
            </div>
            <div className="flex items-center gap-2">
              <X className="w-5 h-5 text-primary" />
              <span className="text-foreground">
                Limited flashcards & notes
              </span>
            </div>
            <div className="flex items-center gap-2">
              <X className="w-5 h-5 text-primary" />
              <span className="text-foreground">
                No access to The Professor
              </span>
            </div>
          </div>
        </div>

        <div className="w-[450px] border-2 border-primary rounded-2xl p-10 bg-card shadow-lg relative sm:-left-12 sm:z-10">
          <div className="absolute -top-3 right-8 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
            Popular
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-2xl font-medium text-foreground">Pro</h4>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-bold text-foreground">
                ${isAnnual ? prices.annual : prices.monthly}
              </span>
              <span className="text-muted-foreground">/month</span>
              {isAnnual && (
                <span className="text-sm text-muted-foreground ml-2">
                  billed annually
                </span>
              )}
            </div>
            <p className="text-muted-foreground">For serious learners</p>
            <Link href="https://app.kouza-ai.com/login">
              <Button className="w-full">Upgrade to Pro</Button>
            </Link>
          </div>
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-primary" />
              <span className="text-foreground">10 full courses per month</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-primary" />
              <span className="text-foreground">
                Unlimited use of The Professor
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-primary" />
              <span className="text-foreground">
                Unlimited flashcards & notes
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-primary" />
              <span className="text-foreground">Stats</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-primary" />
              <span className="text-foreground">Progress analytics</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
