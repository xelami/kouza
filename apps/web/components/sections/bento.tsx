import React from "react"
import { BentoGrid, BentoCard } from "@kouza/ui/components/bento-grid"
import {
  BookOpen,
  BrainCircuit,
  GraduationCap,
  SlashIcon,
  BarChart3,
} from "lucide-react"
import sc from "@/public/sc.png"
import flashcard from "@/public/flashcard.png"
import main from "@/public/main.png"
import note from "@/public/note.png"
import screenshot from "@/public/screenshot.png"
import Image from "next/image"
import xp from "@/public/xp.png"

export default function BentoSection() {
  const features = [
    {
      Icon: BrainCircuit,
      name: "AI Course Generation",
      description:
        "Generate personalized courses on any topic in seconds with our advanced AI.",
      href: "/features/course-generation",
      cta: "Learn more",
      // background: (
      //   <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      //     <Image
      //       src={main}
      //       alt="AI Learning"
      //       width={400}
      //       height={300}
      //       quality={85}
      //       className="w-auto h-auto opacity-60"
      //       placeholder="blur"
      //     />
      //   </div>
      // ),
      className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
    },
    {
      Icon: SlashIcon,
      name: "Smart Flashcards",
      description:
        "Master concepts faster with AI-powered spaced repetition learning.",
      href: "/features/srs-flashcards",
      cta: "Learn more",
      // background: (
      //   <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      //     <Image
      //       src={screenshot}
      //       alt="Smart Flashcards"
      //       width={400}
      //       height={300}
      //       quality={85}
      //       className="w-auto h-auto opacity-60"
      //       placeholder="blur"
      //     />
      //   </div>
      // ),
      className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
    },
    {
      Icon: BookOpen,
      name: "Interactive Notes",
      description: "Create and organize study notes with AI assistance.",
      href: "/features/interactive-notes",
      cta: "Learn more",
      // background: (
      //   <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      //     <Image
      //       src={note}
      //       alt="Interactive Notes"
      //       width={400}
      //       height={300}
      //       quality={85}
      //       className="w-auto h-auto opacity-60"
      //       placeholder="blur"
      //     />
      //   </div>
      // ),
      className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
    },
    {
      Icon: GraduationCap,
      name: "The Professor",
      description: "Your personal AI tutor available 24/7 to answer questions.",
      href: "/features/the-professor",
      cta: "Learn more",
      // background: (
      //   <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      //     <Image
      //       src={sc}
      //       alt="The Professor"
      //       width={400}
      //       height={300}
      //       quality={85}
      //       className="w-auto h-auto opacity-60"
      //       placeholder="blur"
      //     />
      //   </div>
      // ),
      className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    },
    {
      Icon: BarChart3,
      name: "Progress Tracking",
      description:
        "Track your learning progress with detailed analytics and insights.",
      href: "/features/progress-tracking",
      cta: "Learn more",
      // background: (
      //   <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      //     <Image
      //       src={xp}
      //       alt="Progress Tracking"
      //       width={400}
      //       height={300}
      //       quality={85}
      //       className="w-auto h-auto opacity-60"
      //       placeholder="blur"
      //     />
      //   </div>
      // ),
      className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
    },
  ]

  return (
    <section
      id="features"
      className="max-w-[1400px] flex flex-col items-center w-full mx-auto p-4 my-24"
    >
      <div className="flex flex-col items-center gap-2 mb-12">
        <span className="border border-gray-200 px-4 py-1 rounded-full text-sm font-medium tracking-tight bg-gradient-to-r from-black/10 to-black/20">
          Features
        </span>
        <h3 className="text-5xl text-center font-medium tracking-tight">
          Packed Full of Powerful Features
        </h3>
      </div>
      <BentoGrid className="lg:grid-rows-3">
        {features.map((feature) => (
          <BentoCard key={feature.name} {...feature} background={null} />
        ))}
      </BentoGrid>
    </section>
  )
}
