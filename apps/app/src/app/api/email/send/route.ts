import { NextResponse } from "next/server"
import { Resend } from "resend"
import { verifyEmail } from "@/components/emails/verify-email"

export const runtime = "edge"

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(req: Request) {
  try {
    const { email, url } = await req.json()

    if (!email || !url) {
      console.error("Missing required fields:", { email, url })
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const { data, error } = await resend.emails.send({
      from: "noreply@kouza-ai.com",
      to: email,
      subject: "Verify your email",
      html: verifyEmail(url),
    })

    if (error) {
      console.error("Resend API error details:", {
        error,
        email,
        errorMessage: error.message,
        errorName: error.name,
      })
      return NextResponse.json(
        { error: error.message || "Failed to send email" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Unexpected error in email sending:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to send email",
      },
      { status: 500 }
    )
  }
}
