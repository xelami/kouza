"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@kouza/ui/components/sidebar"
import AssistantForm from "../forms/assistant"
import { useState } from "react"

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function AssistantSidebar({ context }: { context?: string }) {
  const [messages, setMessages] = useState<Message[]>([])

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message])
  }

  return (
    <Sidebar className="flex flex-col w-[400px]" side="right">
      <SidebarHeader>
        <h3 className="text-3xl tracking-tighter font-medium">Ask Professor</h3>
      </SidebarHeader>
      <SidebarContent className="flex flex-col items-center p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              message.role === "user" ? "bg-blue-100 ml-4" : "bg-gray-100 mr-4"
            }`}
          >
            <p>{message.content}</p>
          </div>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <AssistantForm
          context={context}
          onMessageSent={(content) => {
            addMessage({ role: "user", content })
          }}
          onResponseReceived={(response) => {
            addMessage({ role: "assistant", content: response })
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
