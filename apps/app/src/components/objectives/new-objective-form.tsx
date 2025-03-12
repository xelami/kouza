"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { addDays } from "date-fns"

import { Button } from "@kouza/ui/components/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@kouza/ui/components/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@kouza/ui/components/select"
import { Input } from "@kouza/ui/components/input"
import { Textarea } from "@kouza/ui/components/textarea"
import { Calendar } from "@kouza/ui/components/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@kouza/ui/components/popover"
import { cn } from "@kouza/ui/lib/utils"
import { CalendarIcon, Target, Clock, Award, CheckCircle } from "lucide-react"
import { toast } from "sonner"

// Define the form schema
const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().optional(),
  targetType: z.enum(["TIME", "MASTERY", "COMPLETION"]),
  targetValue: z.coerce.number().positive({
    message: "Target value must be positive.",
  }),
  courseId: z.coerce.number().optional(),
  moduleId: z.coerce.number().optional(),
  deadline: z.date().optional(),
})

type FormValues = z.infer<typeof formSchema>

type Course = {
  id: number
  title: string
  modules: {
    id: number
    title: string
  }[]
}

interface NewObjectiveFormProps {
  courses: Course[]
  userId: number
}

export function NewObjectiveForm({ courses, userId }: NewObjectiveFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null)

  // Default form values
  const defaultValues: Partial<FormValues> = {
    targetType: "TIME",
    targetValue: 60, // Default 60 minutes for TIME
    deadline: addDays(new Date(), 30), // Default deadline 30 days from now
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  // Get the current target type
  const targetType = form.watch("targetType")

  // Handle target type change
  const handleTargetTypeChange = (value: string) => {
    form.setValue("targetType", value as "TIME" | "MASTERY" | "COMPLETION")

    // Set default target values based on type
    if (value === "TIME") {
      form.setValue("targetValue", 60) // 60 minutes
    } else if (value === "MASTERY") {
      form.setValue("targetValue", 80) // 80% mastery
    } else if (value === "COMPLETION") {
      form.setValue("targetValue", 1) // 1 item
    }
  }

  // Handle course selection
  const handleCourseChange = (value: string) => {
    const courseId = parseInt(value)
    setSelectedCourseId(courseId)
    form.setValue("courseId", courseId)
    form.setValue("moduleId", undefined) // Reset module when course changes
  }

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/learning-goal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          userId,
          progress: 0, // Initial progress is 0
          achieved: false, // Initial achieved status is false
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create learning objective")
      }

      toast.success("Learning objective created successfully")
      router.push("/objectives")
      router.refresh()
    } catch (error) {
      console.error("Error creating learning objective:", error)
      toast.error("Failed to create learning objective")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-2xl"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Objective Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Master JavaScript Basics"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Give your learning objective a clear, specific title.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your objective in more detail..."
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="targetType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Objective Type</FormLabel>
              <Select
                onValueChange={handleTargetTypeChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select objective type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="TIME">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Study Time
                    </div>
                  </SelectItem>
                  <SelectItem value="MASTERY">
                    <div className="flex items-center">
                      <Award className="h-4 w-4 mr-2" />
                      Mastery Level
                    </div>
                  </SelectItem>
                  <SelectItem value="COMPLETION">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Completion
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                {targetType === "TIME" &&
                  "Set a target for study time in minutes"}
                {targetType === "MASTERY" && "Set a target mastery percentage"}
                {targetType === "COMPLETION" &&
                  "Set a target number of items to complete"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="targetValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Value</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  min={1}
                  step={targetType === "MASTERY" ? 5 : 1}
                />
              </FormControl>
              <FormDescription>
                {targetType === "TIME" && "Time in minutes (e.g., 60 = 1 hour)"}
                {targetType === "MASTERY" &&
                  "Mastery percentage (e.g., 80 = 80%)"}
                {targetType === "COMPLETION" && "Number of items to complete"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="courseId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course (Optional)</FormLabel>
              <Select
                onValueChange={handleCourseChange}
                value={field.value?.toString() || ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Link this objective to a specific course
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedCourseId && (
          <FormField
            control={form.control}
            name="moduleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Module (Optional)</FormLabel>
                <Select
                  onValueChange={(value) =>
                    form.setValue("moduleId", parseInt(value))
                  }
                  value={field.value?.toString() || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a module" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {courses
                      .find((course) => course.id === selectedCourseId)
                      ?.modules.map((module) => (
                        <SelectItem
                          key={module.id}
                          value={module.id.toString()}
                        >
                          {module.title}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Link this objective to a specific module
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Deadline (Optional)</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? field.value.toLocaleDateString()
                        : "Pick a date"}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Set a deadline for achieving this objective
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Objective"}
        </Button>
      </form>
    </Form>
  )
}
