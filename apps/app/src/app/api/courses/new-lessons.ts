"use server"

import { auth } from "@/auth"
import { isUserSubscribed } from "@/hooks/is-subscribed"
import { CourseModule } from "@/types/types"
import { db } from "@kouza/db"
import { tasks, idempotencyKeys } from "@trigger.dev/sdk/v3"
import type { createLessonsTask } from "@/trigger/lesson-creation"
// Import other dependencies as needed

// The module lesson schemas and other constants are now moved to the trigger job

export async function newLessons(module: CourseModule) {
  const session = await auth()

  if (!session) {
    throw new Error("Not authenticated")
  }

  const userId = session.user.id
  if (!userId) {
    throw new Error("User ID not found")
  }

  try {
    // Check if user is subscribed
    const userSubscribed = await isUserSubscribed(Number(userId))

    // Create an idempotency key to ensure the task is only triggered once for this specific module and user
    const idempotencyKey = await idempotencyKeys.create([
      `module-${module.id}`,
      `user-${userId}`,
    ])

    // Trigger the background job using the tasks.trigger() approach
    await tasks.trigger<typeof createLessonsTask>(
      "create-lessons",
      {
        module,
        isSubscribed: userSubscribed,
        userId,
      },
      {
        idempotencyKey,
      }
    )

    return {
      message: "Lesson creation has started in the background",
    }
  } catch (error) {
    console.error("Failed to start lesson creation job:", error)
    throw new Error(
      `Failed to start lesson creation: ${(error as Error).message}`
    )
  }
}
