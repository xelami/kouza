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

    await db.$transaction([
      db.flashcard.deleteMany({
        where: { userId },
      }),
      db.note.deleteMany({
        where: { userId },
      }),
      db.subscription.deleteMany({
        where: { userId },
      }),
      db.user.delete({
        where: { id: userId },
      }),
    ])

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true },
    })

    if (user?.stripeCustomerId) {
      await stripe.customers.del(user.stripeCustomerId)
    }

    return { success: true }
  } catch (error) {
    console.error("Error deleting account:", error)
    throw error
  }
}
