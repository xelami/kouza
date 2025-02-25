import { Button } from "@kouza/ui/components/button"
import Link from "next/link"
import { Github, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="flex flex-col max-w-[1400px] mx-auto p-4 sm:p-6 md:p-8 mt-24">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-8 sm:mb-12">
        <div className="flex flex-col gap-4">
          <h3 className="text-2xl font-bold">Kouza</h3>
          <p className="text-sm text-muted-foreground">
            The ultimate AI-powered learning platform. Transform your learning
            journey today.
          </p>
          <div className="flex gap-4 mt-2">
            <Link
              href="https://twitter.com/kouza"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </Link>
            <Link
              href="https://github.com/kouza"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="h-5 w-5" />
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="font-semibold">Product</h4>
          <div className="flex flex-col gap-2">
            <Link
              href="#features"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/#faq"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              FAQ
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="font-semibold">Resources</h4>
          <div className="flex flex-col gap-2">
            <Link
              href="/help"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Help Center
            </Link>
            <Link
              href="/feature-request"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Feature Request
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="font-semibold">Start Learning</h4>
          <p className="text-sm text-muted-foreground">
            Ready to transform your learning experience?
          </p>
          <Link href="https://app.kouza-ai.com/login">
            <Button className="w-full sm:w-auto">Get Started</Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t pt-8 text-sm text-muted-foreground">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          <p>© 2025 Xelami LTD.</p>
          <p className="hidden sm:block">·</p>
          <p>All rights reserved.</p>
        </div>
        <div className="flex gap-4 sm:gap-6">
          <Link
            href="/privacy-policy"
            className="hover:text-primary transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="/terms-conditions"
            className="hover:text-primary transition-colors"
          >
            Terms
          </Link>
        </div>
      </div>
      <div
        className="absolute inset-0 -z-10 h-full w-full 

        bg-[radial-gradient(#e5e5e5_1px,transparent_1px)] 

        dark:bg-[radial-gradient(#9494a8_0.8px,transparent_1px)] 

        [background-size:24px_24px] 

        [mask-image:radial-gradient(ellipse_100%_50%_at_50%_100%,#000_5%,transparent_100%)]

        opacity-50"
      ></div>
    </footer>
  )
}
