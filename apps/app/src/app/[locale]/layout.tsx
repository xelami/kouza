import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "@kouza/ui/globals.css"
import { Providers } from "./providers"
import { SessionProvider } from "next-auth/react"
import { Toaster } from "sonner"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "KouzaAI - AI-Powered Learning",
  description: "Level up your learning",
}

export default async function RootLayout(props: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const params = await props.params
  const { locale } = params

  const { children } = props

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}
      >
        <SessionProvider>
          <Providers locale={locale}>
            <main>{children}</main>
            <Toaster />
          </Providers>
        </SessionProvider>
      </body>
    </html>
  )
}
