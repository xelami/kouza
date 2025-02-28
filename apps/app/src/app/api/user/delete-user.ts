"use server"

import { auth } from "@/auth"
import { db } from "@kouza/db"
import { stripe } from "@/auth/stripe"

export async function deleteUser() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }

    const userId = Number(session.user.id)

    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        subscriptions: {
          where: {
            OR: [
              { status: "ACTIVE" },
              { status: "TRIALING" },
              {
                status: "CANCELED",
                currentPeriodEnd: { gt: new Date() },
              },
            ],
          },
        },
      },
    })

    if (!user) throw new Error("User not found")

    for (const subscription of user.subscriptions) {
      if (subscription.stripeSubscriptionId) {
        try {
          await stripe.subscriptions.cancel(subscription.stripeSubscriptionId)
        } catch (error) {
          console.error("Error canceling subscription:", error)
        }
      }
    }

    if (user.stripeCustomerId) {
      await stripe.customers.del(user.stripeCustomerId)
    }

    await db.$transaction([
      db.flashcard.deleteMany({
        where: { userId },
      }),

      db.note.deleteMany({
        where: { userId },
      }),

      db.quizQuestion.deleteMany({
        where: {
          quiz: {
            lesson: {
              module: {
                course: {
                  generatedBy: userId,
                },
              },
            },
          },
        },
      }),

      db.quiz.deleteMany({
        where: {
          lesson: {
            module: {
              course: {
                generatedBy: userId,
              },
            },
          },
        },
      }),

      db.media.deleteMany({
        where: {
          lesson: {
            module: {
              course: {
                generatedBy: userId,
              },
            },
          },
        },
      }),

      db.lesson.deleteMany({
        where: {
          module: {
            course: {
              generatedBy: userId,
            },
          },
        },
      }),

      db.module.deleteMany({
        where: {
          course: {
            generatedBy: userId,
          },
        },
      }),

      db.course.deleteMany({
        where: { generatedBy: userId },
      }),

      db.subscription.deleteMany({
        where: { userId },
      }),

      db.user.delete({
        where: { id: userId },
      }),
    ])

    return { success: true }
  } catch (error) {
    console.error("Error deleting account:", error)
    throw error
  }
}
