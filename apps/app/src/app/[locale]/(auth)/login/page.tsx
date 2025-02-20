"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

export const runtime = "edge"

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  const verified = searchParams.get("verified")
  const errorParam = searchParams.get("error")

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (isSignUp) {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = (await res.json()) as { error: string }
        setError(data.error)
        return
      }

      router.push("/verify-email")
      return
    }

    const result = await signIn("credentials", {
      email,
      password,
      callbackUrl: "/",
    })

    if (result?.error) {
      switch (result.error) {
        case "CredentialsSignin":
          setError("Invalid email or password")
          break
        default:
          setError("An error occurred during sign in")
      }
      return
    }

    router.push("/")
    router.refresh()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] min-h-screen font-[family-name:var(--font-geist-sans)]">
      <div className="hidden lg:flex flex-col items-center justify-center bg-muted/50 dark:bg-muted/10 p-8">
        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tighter text-center text-foreground">
          Level Up Your Learning
        </h3>
        <p className="text-base sm:text-lg text-muted-foreground mt-2">
          Learn anything, anywhere, anytime.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md space-y-6 sm:space-y-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              {isSignUp ? "Create an account" : "Log In"}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary hover:underline"
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </button>
            </p>
          </div>

          {verified && (
            <div className="rounded-md bg-green-50 p-3 text-sm text-green-600">
              Email verified successfully! You can now log in.
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full rounded-md border p-2 sm:p-3"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full rounded-md border p-2 sm:p-3"
              />
            </div>

            {error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {errorParam && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {decodeURIComponent(errorParam)}
              </div>
            )}

            <div className="flex items-center">
              <span className="text-center text-muted-foreground text-sm">
                By creating an account, you agree to the{" "}
                <Link
                  className="text-primary hover:text-primary/90 font-medium"
                  target="_blank"
                  href="https://kouza-ai.com/terms-conditions"
                >
                  Terms and Conditions
                </Link>{" "}
                and{" "}
                <Link
                  className="text-primary hover:text-primary/90 font-medium"
                  target="_blank"
                  href="https://kouza-ai.com/privacy-policy"
                >
                  Privacy Policy
                </Link>
              </span>
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-primary px-4 py-2 sm:py-3 text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {isSignUp ? "Sign Up" : "Log In"}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-full rounded-md border border-input bg-background px-4 py-2 sm:py-3 hover:bg-accent transition-colors"
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
