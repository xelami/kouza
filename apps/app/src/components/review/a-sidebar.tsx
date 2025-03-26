"use client"

import AssistantContent from "./assistant-content"
import { isUserSubscribed } from "@/hooks/is-subscribed"
import { useEffect } from "react"
import { useState } from "react"
import { useSession } from "next-auth/react"

export const runtime = "edge"

export default function ASidebar({
  context,
  onContextCleared,
  lessonTitle,
}: {
  context?: string
  onContextCleared?: () => void
  lessonTitle: string
}) {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    async function checkSubscription() {
      if (!session?.user?.id) return

      try {
        const subscribed = await isUserSubscribed(Number(session.user.id))
        setIsSubscribed(!!subscribed)
      } catch (error) {
        console.error("Failed to check subscription:", error)
        setIsSubscribed(false)
      }
    }

    checkSubscription()
  }, [])

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-none p-4">
        <h3 className="text-3xl tracking-tighter font-medium text-center">
          Ask Professor
        </h3>
      </div>
      <AssistantContent
        context={context}
        isSubscribed={isSubscribed}
        onContextCleared={onContextCleared}
        lessonTitle={lessonTitle}
      />
    </div>
  )
}
