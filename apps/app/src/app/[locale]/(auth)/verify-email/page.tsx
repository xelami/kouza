"use client"

export const runtime = "edge"

export default function VerifyEmailPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <h1 className="text-4xl font-bold">Check Your Email</h1>
        <p className="text-muted-foreground">
          We've sent you a magic link to verify your email address and complete
          your registration.
        </p>
        <p className="text-sm text-muted-foreground">
          Click the link in the email to continue. The link will expire in 24
          hours.
        </p>
      </div>
    </div>
  )
}
