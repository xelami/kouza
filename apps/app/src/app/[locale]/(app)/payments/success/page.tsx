"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle2 } from "lucide-react"

interface SubscriptionDetails {
  status: string
  currentPeriodEnd: string
  planName: string
}

export default function SuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [details, setDetails] = useState<SubscriptionDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getSubscriptionDetails() {
      if (!sessionId) return

      try {
        const response = await fetch(
          `/api/stripe/subscription-details?session_id=${sessionId}`
        )
        const data = await response.json()
        setDetails(data)
      } catch (error) {
        console.error("Failed to fetch subscription details:", error)
      } finally {
        setLoading(false)
      }
    }

    getSubscriptionDetails()
  }, [sessionId])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col items-center text-center space-y-4">
          <CheckCircle2 className="w-16 h-16 text-green-500" />
          <h1 className="text-3xl font-bold tracking-tight">
            Payment Successful!
          </h1>

          {loading ? (
            <p className="text-gray-600">Loading subscription details...</p>
          ) : details ? (
            <div className="space-y-4 w-full">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h2 className="font-semibold text-lg mb-2">
                  Subscription Details
                </h2>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm text-gray-500">Plan</dt>
                    <dd className="font-medium">{details.planName}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Status</dt>
                    <dd className="font-medium capitalize">{details.status}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">
                      Current Period Ends
                    </dt>
                    <dd className="font-medium">
                      {new Date(details.currentPeriodEnd).toLocaleDateString()}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => router.push("/")}
                  className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => router.push("/account")}
                  className="w-full px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                >
                  View Account Settings
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">
              Thank you for subscribing! Your account has been activated.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
