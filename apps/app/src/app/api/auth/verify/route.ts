import { db } from "@kouza/db"
import { NextResponse } from "next/server"

export const runtime = "edge"

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
