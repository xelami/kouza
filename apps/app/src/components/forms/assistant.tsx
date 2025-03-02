"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@kouza/ui/components/form"
import { useForm } from "react-hook-form"
import { Button } from "@kouza/ui/components/button"
import { z } from "zod"
import { Textarea } from "@kouza/ui/components/textarea"
import { addContext } from "@/app/api/assistant/add-context"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@kouza/ui/components/dropdown-menu"
import { Label } from "@kouza/ui/components/label"

const formSchema = z.object({
  prompt: z.string().max(180, "Message cannot exceed 180 characters"),
  personality: z.string().default("default"),
})

const personalities = [
  { id: "default", name: "Default" },
  { id: "genz", name: "Gen Z" },
  { id: "scholar", name: "Scholar" },
  { id: "mentor", name: "Mentor" },
  { id: "enthusiastic", name: "Enthusiastic" },
  { id: "brainrot", name: "Brainrot" },
]

interface AssistantFormProps {
  lessonTitle?: string
  context?: string
  onMessageSent: (prompt: string) => void
  onResponseReceived: (response: string) => void
  onContextCleared?: () => void
}

export default function AssistantForm({
  lessonTitle,
  context,
  onMessageSent,
  onResponseReceived,
  onContextCleared,
}: AssistantFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      personality: "default",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    const currentContext = context
    onContextCleared?.()
    try {
      onMessageSent(values.prompt)
      const res = await addContext(
        values.prompt,
        currentContext,
        values.personality,
        lessonTitle
      )
      const { object } = res
      onResponseReceived(object.content)
      form.setValue("prompt", "")
    } catch (error) {
      console.error("Failed to submit prompt", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {context && (
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Selected context:
            </p>
            <p className="text-sm">{context}</p>
          </div>
        )}

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Ask me anything..."
                    className="h-20 resize-none"
                    maxLength={180}
                    {...field}
                  />
                </FormControl>
                <div className="flex justify-end">
                  <span className="text-xs text-muted-foreground mt-1">
                    {field.value.length}/180
                  </span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-end justify-between gap-4">
            <FormField
              control={form.control}
              name="personality"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <Label>Personality</Label>
                  <FormControl>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full">
                          {personalities.find((p) => p.id === field.value)
                            ?.name || "Select Personality"}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="min-w-[200px]"
                      >
                        {personalities.map((personality) => (
                          <DropdownMenuItem
                            key={personality.id}
                            onClick={() => field.onChange(personality.id)}
                          >
                            {personality.name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
