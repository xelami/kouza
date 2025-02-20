import { Button } from "@kouza/ui/components/button"
import Image from "next/image"
import Link from "next/link"
import React from "react"
import main from "@/public/main.png"
export default function CallToAction() {
  return (
    <section className="max-w-[1400px] w-full mx-auto p-4 sm:p-6 md:p-8">
      <div
        className="relative overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 p-6 sm:p-8 md:p-12 w-full 
        border border-border rounded-2xl 
        bg-gradient-to-br from-foreground/90 to-foreground/70 dark:from-foreground/20 dark:to-foreground/10 
        backdrop-blur-sm"
      >
        <div className="flex flex-col text-center lg:text-left tracking-tight space-y-4 sm:space-y-6 z-10">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-background dark:text-foreground">
            Ready to level up your learning?
          </h3>
          <p className="text-base sm:text-lg text-background/80 dark:text-foreground/80 max-w-lg mx-auto lg:mx-0">
            Embrace AI, transform your learning and expand your knowledge with
            Kouza.
          </p>
          <Link href="https://app.kouza-ai.com/login">
            <Button
              size="lg"
              className="text-base sm:text-lg mx-auto lg:mx-0 px-6 py-2 sm:py-3
                bg-background hover:bg-background/90 text-foreground
                dark:bg-foreground dark:hover:bg-foreground/90 dark:text-background"
            >
              Get Started for free
            </Button>
          </Link>
        </div>

        <div className="hidden xl:block absolute -top-[400px] -right-[400px] w-[1400px] h-[1400px]">
          <Image
            src={main}
            alt="CTA"
            fill
            className="object-contain scale-75 lg:scale-100 transform translate-x-1/4 -translate-y-1/4 opacity-80"
            priority
          />
        </div>
      </div>
    </section>
  )
}
