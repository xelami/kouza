"use client"

import React, { useEffect, useState } from "react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@kouza/ui/components/drawer"
import { GraduationCap } from "lucide-react"
import AssistantContent from "../review/assistant-content"
import { useSession } from "next-auth/react"
import { isUserSubscribed } from "@/hooks/is-subscribed"

export const runtime = "edge"

interface AssistantDrawerProps {
  context?: string
}

export default function AssistantDrawer({ context }: AssistantDrawerProps) {
  const { data: session } = useSession()
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    async function checkSubscription() {
      if (session?.user?.id) {
        const subscribed = await isUserSubscribed(Number(session.user.id))
        setIsSubscribed(subscribed)
      }
    }
    checkSubscription()
  }, [session?.user?.id])

  return (
    <div className="xl:hidden h-full">
      <Drawer direction="right">
        <DrawerTrigger className="fixed bottom-4 right-4 p-2 bg-primary text-primary-foreground rounded-full shadow-lg">
          <GraduationCap className="w-6 h-6" />
        </DrawerTrigger>
        <DrawerContent className="h-full max-w-[300px] w-full">
          <DrawerHeader>
            <DrawerTitle className="text-xl font-semibold tracking-tight">
              Ask Professor
            </DrawerTitle>
          </DrawerHeader>
          <AssistantContent context={context} isSubscribed={isSubscribed} />
        </DrawerContent>
      </Drawer>
    </div>
  )
}
