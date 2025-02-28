"use client"
import React from "react"

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
import { toast } from "sonner"
import { Input } from "@kouza/ui/components/input"

const formSchema = z.object({
  email: z.string().email(),
  query: z.string().min(2).max(100),
})

export default function ContactPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      query: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      toast.success("Thanks for your message!", {
        description: "We'll get back to you as soon as possible!",
      })

      form.reset()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <div className="flex flex-col p-12 max-w-7xl mx-auto">
      <div className="flex flex-col text-lg text-center -space-y-2 gap-4 max-w-xl mx-auto">
        <h1 className="text-6xl font-medium tracking-tight">Contact Us</h1>
        <p className="text-lg tracking-tight text-muted-foreground">
          We&apos;d love to hear from you! Please use the form below to get in
          touch with us.
        </p>
      </div>
      <div className="max-w-2xl mx-auto w-full py-12">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="example@gmail.com"
                      {...field}
                      style={{ resize: "none" }}
                    />
                  </FormControl>
                  <FormDescription>What is your email address?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Query</FormLabel>
                  <FormControl>
                    <Textarea
                      className="h-40"
                      placeholder="Enter your query"
                      {...field}
                      style={{ resize: "none" }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              <Button className="mx-auto" type="submit">
                Send Message
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
