import { Geist, Geist_Mono } from "next/font/google"
import "@kouza/ui/globals.css"
import { Providers } from "@/components/providers"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import MobileSidebar from "@/components/layout/mobile-sidebar"
import { Metadata } from "next"
export const runtime = "edge"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "KouzaAI - Level Up Your Learning",
  description: "Kouza is the ultimate AI-powered learning platform.",
}

export default async function RootLayout(props: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const params = await props.params

  const { locale } = params

  const { children } = props

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`container mx-auto ${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <Providers locale={locale}>
          <header className="flex items-center justify-between w-full p-4 sm:p-6 lg:p-8">
            <Navbar />
            <MobileSidebar />
          </header>
          <main>{children}</main>

          <Footer />
        </Providers>
      </body>
    </html>
  )
}
