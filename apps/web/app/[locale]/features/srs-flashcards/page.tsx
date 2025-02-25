import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@kouza/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@kouza/ui/components/card"
import {
  CheckCircle,
  Brain,
  Clock,
  Repeat,
  Zap,
  Lightbulb,
  BarChart3,
  Sparkles,
} from "lucide-react"

import flashcardImage from "@/public/flashcard.png"

export default function SRSFlashcards() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-12">
        <h1 className="text-4xl font-medium tracking-tight mb-4">
          Smart Flashcards
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
          Master any subject with AI-powered spaced repetition flashcards that
          adapt to your learning patterns for maximum retention.
        </p>

        <div className="relative h-[300px] w-full rounded-lg overflow-hidden mb-8">
          <Image
            src={flashcardImage}
            alt="SRS Flashcards"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-2xl font-medium tracking-tight mb-4">
            What are SRS Flashcards?
          </h2>
          <p className="mb-4">
            Our Smart Flashcards use a Spaced Repetition System (SRS) — a
            scientifically-proven learning technique that optimizes memory
            retention by showing you information at strategic intervals based on
            how well you know it.
          </p>
          <p>
            Unlike traditional flashcards, our AI-powered system adapts to your
            performance, scheduling difficult cards more frequently and familiar
            ones less often. This ensures you spend time on what you need to
            learn, not what you already know, making your study sessions more
            efficient and effective.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-medium tracking-tight mb-4">
            Key Benefits
          </h2>
          <ul className="space-y-3">
            {[
              "Learn 2-3x faster with scientifically optimized review schedules",
              "Remember information for months or years, not just days",
              "Focus your study time on what you need to learn most",
              "Reduce forgetting with perfectly timed review sessions",
              "Track your memory strength for different topics",
              "AI-generated flashcards save hours of manual creation time",
            ].map((benefit, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="tracking-tight">
            The Science Behind Spaced Repetition
          </CardTitle>
          <CardDescription>
            Why SRS is the most efficient way to memorize information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex">
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Brain className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-medium tracking-tight">
                  The Forgetting Curve
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Research shows we forget approximately 70% of new information
                  within 24 hours. Spaced repetition counters this by reviewing
                  information just before you're likely to forget it.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Repeat className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-medium tracking-tight">
                  Optimal Intervals
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our algorithm calculates the perfect time to review each card
                  based on your recall performance, ensuring information moves
                  from short-term to long-term memory efficiently.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-medium tracking-tight">
                  Time Efficiency
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  By focusing on difficult cards and spacing out easy ones, you
                  can achieve the same or better results in significantly less
                  study time compared to traditional methods.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-12">
        <h2 className="text-2xl font-medium tracking-tight mb-4">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center tracking-tight">
                <Sparkles className="mr-2 h-5 w-5" />
                <span>AI Card Generation</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Our AI can automatically create high-quality flashcards from
                your notes, textbooks, or any learning material, saving you
                hours of manual card creation time.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center tracking-tight">
                <Zap className="mr-2 h-5 w-5" />
                <span>Adaptive Algorithm</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Our advanced spaced repetition algorithm adapts to your
                performance, scheduling reviews at the optimal time to maximize
                retention while minimizing study time.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center tracking-tight">
                <Lightbulb className="mr-2 h-5 w-5" />
                <span>Rich Content Cards</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Create multimedia flashcards with images, code snippets, math
                equations, and more to enhance learning for complex or visual
                topics.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center tracking-tight">
                <BarChart3 className="mr-2 h-5 w-5" />
                <span>Memory Analytics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Track your retention rates, learning progress, and memory
                strength for different topics with detailed analytics that help
                optimize your study strategy.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-medium tracking-tight mb-4">
          How It Works
        </h2>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium tracking-tight mb-2">
              1. Create or Import Cards
            </h3>
            <p>
              Either create flashcards manually, have our AI generate them from
              your learning materials, or import existing card sets from popular
              platforms.
            </p>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium tracking-tight mb-2">
              2. Study Your Cards
            </h3>
            <p>
              Review cards and rate your recall difficulty from "Difficult" to
              "Easy." This feedback helps the algorithm determine the optimal
              review schedule for each card.
            </p>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium tracking-tight mb-2">
              3. Trust the Algorithm
            </h3>
            <p>
              The system schedules reviews at scientifically optimized
              intervals. Cards you find difficult appear more frequently, while
              well-known cards appear at increasing intervals.
            </p>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium tracking-tight mb-2">
              4. Track Your Progress
            </h3>
            <p>
              Monitor your retention rates, learning efficiency, and memory
              strength through detailed analytics that show your improvement
              over time.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900/30 p-6 rounded-lg mb-12">
        <h2 className="text-2xl font-semibold mb-4">Perfect For Learning</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Subject Areas</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Languages (vocabulary, grammar, characters)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Medical & scientific terminology</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Programming concepts & syntax</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Historical dates & events</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Mathematical formulas & concepts</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Learning Scenarios</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Exam preparation & certification study</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Professional development & skill acquisition</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Academic coursework & research</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Hobby learning & personal interests</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Continuous learning & knowledge maintenance</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          Integration with Platform
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-2">Course Integration</h3>
            <p>
              Flashcards are automatically generated from your course materials,
              ensuring perfect alignment with what you're learning.
            </p>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-medium mb-2">The Professor Support</h3>
            <p>
              When you struggle with a flashcard, The Professor can provide
              additional context, examples, and explanations to help you
              understand.
            </p>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-medium mb-2">Progress Tracking</h3>
            <p>
              Your flashcard performance feeds into your overall progress
              tracking, giving you a complete picture of your knowledge
              retention.
            </p>
          </Card>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Remember more with less effort
        </h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          Start using our Smart Flashcards today and experience the power of
          scientifically-optimized learning that adapts to your unique needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="https://app.kouza-ai.com/login">Try It Now</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/#pricing">View Plans</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
