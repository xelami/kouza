import { db } from "@kouza/db"
import { NextResponse } from "next/server"

export const runtime = "edge"

async function hashPassword(password: string) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const digest = await crypto.subtle.digest("SHA-256", data)
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
}

export async function POST(req: Request) {
  try {
    const { email, password }: { email: string; password: string } =
      await req.json()

    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: "Database configuration error" },
        { status: 500 }
      )
    }

    const existingUser = await db.user.findFirst({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    const hashedPassword = await hashPassword(password)

    await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name: email.split("@")[0] || "",
        emailVerified: null,
      },
    })

    const magicLinkUrl = `${process.env.NEXT_PUBLIC_URL}/api/auth/verify?email=${encodeURIComponent(email)}&password=${encodeURIComponent(hashedPassword)}`

    await fetch(`${process.env.NEXT_PUBLIC_URL}/api/email/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, url: magicLinkUrl }),
    })

    return NextResponse.json({
      success: true,
      message: "Verification email sent",
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
