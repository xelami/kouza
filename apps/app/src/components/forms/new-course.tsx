"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@kouza/ui/components/form"
import { useForm } from "react-hook-form"
import { Textarea } from "@kouza/ui/components/textarea"
import { Button } from "@kouza/ui/components/button"
import { z } from "zod"
import { newCourse } from "@/app/api/courses/new-course"
import { toast } from "sonner"

export const runtime = "edge"

const formSchema = z.object({
  prompt: z.string().min(2).max(100),
  duration: z
    .number({ invalid_type_error: "Please enter a number for duration" })
    .min(1, "Duration must be at least 1 hour")
    .max(100, "Duration seems too long")
    .default(10),
  format: z.enum(["text", "video", "interactive"]).default("text"),
})

export default function NewCourseForm({
  pregeneratedPrompt,
  setIsSubmitted,
}: {
  pregeneratedPrompt?: string
  setIsSubmitted: (isSubmitted: boolean) => void
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: pregeneratedPrompt || "",
      duration: 10,
      format: "text",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitted(true)
    toast.success("Course is generating")

    try {
      await newCourse(values.prompt)
    } catch (error) {
      console.error("Failed to submit prompt", error)
      toast.error("Failed to generate course")
      setIsSubmitted(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prompt</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your prompt here"
                  {...field}
                  style={{ resize: "none" }}
                />
              </FormControl>
              <FormDescription>What would you like to learn?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-center">
          <Button className="mx-auto" type="submit">
            Generate
          </Button>
        </div>
      </form>
    </Form>
  )
}
