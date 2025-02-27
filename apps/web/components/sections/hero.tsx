import { Button } from "@kouza/ui/components/button"
import Image from "next/image"
import Link from "next/link"
import React from "react"
import main from "@/public/main.png"

export default function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center my-12 sm:my-16 md:my-24">
      <div className="flex flex-col items-center justify-center gap-6 sm:gap-8">
        <h3 className="font-semibold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tighter text-center text-foreground">
          Level Up Your Learning
        </h3>
        <p
          className="max-w-[90%] sm:max-w-2xl md:max-w-3xl text-center text-base sm:text-lg md:text-xl 
          font-normal text-muted-foreground
          rounded-lg p-4 md:p-6"
        >
          Kouza is the ultimate AI-powered learning platform. Build curricula
          organized into modules and lessons, test your mastery with interactive
          quizzes. Generate actionable notes and reinforce your knowledge with
          SRS-based flashcards.
        </p>

        <Link href="https://app.kouza-ai.com/login">
          <Button
            size="lg"
            className="mt-2 sm:mt-4 px-6 py-2 sm:py-3 text-base sm:text-lg"
          >
            Get Started for free
          </Button>
        </Link>
      </div>

      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 mt-12 sm:mt-16 md:mt-24">
        <Image
          src={main}
          alt="Hero Image"
          width={1200}
          height={675}
          priority
          quality={100}
          className="rounded-xl border-2 sm:rounded-xl md:rounded-2xl object-cover w-full"
          placeholder="blur"
        />
      </div>
    </section>
  )
}
