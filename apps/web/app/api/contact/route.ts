import { Resend } from "resend"
import { NextResponse } from "next/server"

export const runtime = "edge"

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(request: Request) {
  try {
    const { email, query } = await request.json()

    const { error } = await resend.emails.send({
      from: "no-reply@kouza-ai.com",
      replyTo: email,
      to: "contact@xelami.com",
      subject: "KouzaAI - Contact Form Submission",
      text: `From: ${email}\n\n${query}`,
    })

    if (error) {
      console.error(error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
