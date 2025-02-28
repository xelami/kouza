import { db } from "@kouza/db"
import { NextResponse } from "next/server"
import { Resend } from "resend"
import { welcomeEmail } from "@/components/emails/welcome-email"

export const runtime = "edge"

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get("email")
    const password = searchParams.get("password")

    if (!email || !password) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_URL}/login?error=Invalid verification link`
      )
    }

    const user = await db.user.findFirst({
      where: {
        email,
        password,
        emailVerified: null,
      },
    })

    if (!user) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_URL}/login?error=Invalid verification link`
      )
    }

    await db.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    })

    const { data, error } = await resend.emails.send({
      from: "noreply@kouza-ai.com",
      to: email,
      subject: "Welcome to Kouza!",
      html: welcomeEmail(user.name),
    })

    if (error) {
      console.error("Resend API error details:", {
        error,
        email,
        errorMessage: error.message,
        errorName: error.name,
      })
    }

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_URL}/login?verified=true`
    )
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_URL}/login?error=Verification failed`
    )
  }
}
