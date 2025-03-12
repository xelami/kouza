"use client"

import { useState, useRef, useEffect } from "react"
import AssistantForm from "../forms/assistant"
import MarkdownRenderer from "./markdown-renderer"
import { Loader2, Lock } from "lucide-react"
import SubscribeButton from "../subscribe-button"

interface Message {
  role: "user" | "assistant"
  content: string
  loading?: boolean
}

interface AssistantContentProps {
  lessonTitle: string
  context?: string
  isSubscribed: boolean
  onContextCleared?: () => void
}

export default function AssistantContent({
  lessonTitle,
  context,
  isSubscribed,
  onContextCleared,
}: AssistantContentProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesContainerRef.current) {
      const { scrollHeight, clientHeight } = messagesContainerRef.current
      messagesContainerRef.current.scrollTop = scrollHeight - clientHeight
    }
  }, [messages])

  if (!isSubscribed) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-4">
        <Lock className="h-12 w-12 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Pro Feature</h3>
        <p className="text-sm text-muted-foreground">
          Unlock The Professor to get AI-powered learning assistance and
          personalized help with your studies.
        </p>
        <SubscribeButton />
      </div>
    )
  }

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message])
  }

  const updateLastMessage = (content: string) => {
    setMessages((prev) => [
      ...prev.slice(0, -1),
      { role: "assistant", content },
    ])
  }

  return (
    <div className="flex flex-col h-full max-h-screen">
      <div className="flex-1 overflow-y-auto">
        <div
          ref={messagesContainerRef}
          className="px-4 py-4 pb-20 space-y-6
            scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent
            hover:scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600
            dark:hover:scrollbar-thumb-gray-500"
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`w-11/12 p-4 rounded-lg ${
                  message.role === "user"
                    ? "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100"
                    : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                }`}
              >
                {message.loading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                ) : message.role === "user" ? (
                  <p>{message.content}</p>
                ) : (
                  <MarkdownRenderer content={message.content} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="sticky bottom-0 border-t bg-background p-4">
        <AssistantForm
          lessonTitle={lessonTitle}
          context={context}
          onContextCleared={onContextCleared}
          onMessageSent={(content) => {
            addMessage({ role: "user", content })
            addMessage({ role: "assistant", content: "", loading: true })
          }}
          onResponseReceived={(response) => {
            updateLastMessage(response)
          }}
        />
      </div>
    </div>
  )
}
