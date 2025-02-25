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
  MessageSquare,
  BookOpen,
  Brain,
  Clock,
  Star,
  Zap,
  Shield,
} from "lucide-react"

import professorImage from "@/public/sc.png"

export default function TheProfessor() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-12">
        <h1 className="text-4xl font-medium tracking-tight mb-4">
          The Professor
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
          Your personal AI tutor available 24/7 to provide context,
          explanations, and guidance throughout your learning journey.
        </p>

        <div className="relative h-[300px] w-full rounded-lg overflow-hidden mb-8">
          <Image
            src={professorImage}
            alt="The Professor AI Tutor"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-2xl font-medium tracking-tight mb-4">
            What is The Professor?
          </h2>
          <p className="mb-4">
            The Professor is an advanced AI tutor that accompanies you
            throughout your learning experience. Unlike static content, The
            Professor actively engages with you, answering questions, providing
            additional context, and explaining difficult concepts in ways
            tailored to your understanding.
          </p>
          <p>
            As a premium feature, The Professor goes beyond basic AI assistance
            by remembering your learning history, identifying patterns in your
            questions, and proactively offering insights that help deepen your
            understanding of the subject matter.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-medium tracking-tight mb-4">
            Key Benefits
          </h2>
          <ul className="space-y-3">
            {[
              "24/7 access to personalized tutoring and support",
              "Contextual explanations that adapt to your knowledge level",
              "Instant answers to questions about any course material",
              "Proactive suggestions for deeper understanding",
              "Memory of your learning history and progress",
              "Supplementary resources tailored to your learning style",
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
            How The Professor Works
          </CardTitle>
          <CardDescription>
            Seamlessly integrated into your learning experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex">
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-medium tracking-tight">
                  Ask Questions Anytime
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Stuck on a concept? Simply ask The Professor for clarification
                  or additional examples to enhance your understanding.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-medium tracking-tight">
                  Receive Contextual Explanations
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  The Professor provides explanations that connect to your
                  current learning context and previous knowledge, making
                  complex topics more accessible.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Brain className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-medium tracking-tight">
                  Get Personalized Learning Paths
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Based on your interactions, The Professor suggests additional
                  topics to explore or review to strengthen your understanding.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-12">
        <h2 className="text-2xl font-medium tracking-tight mb-4">
          Premium Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center tracking-tight">
                <Clock className="mr-2 h-5 w-5" />
                <span>Always Available</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Unlike human tutors with limited hours, The Professor is
                available 24/7, ready to assist whenever you have questions or
                need guidance, regardless of time zone.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center tracking-tight">
                <Star className="mr-2 h-5 w-5" />
                <span>Adaptive Teaching</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                The Professor adapts its teaching style to match your learning
                preferences, using examples and explanations that resonate with
                your background and interests.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center tracking-tight">
                <Zap className="mr-2 h-5 w-5" />
                <span>Knowledge Integration</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Connects concepts across different parts of your courses,
                helping you build a comprehensive understanding of the subject
                matter rather than isolated facts.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center tracking-tight">
                <Shield className="mr-2 h-5 w-5" />
                <span>Learning Confidence</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                By providing immediate feedback and validation, The Professor
                helps build your confidence in applying new knowledge and
                tackling challenging problems.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-medium tracking-tight mb-4">Use Cases</h2>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium tracking-tight mb-2">
              Concept Clarification
            </h3>
            <p>
              When you encounter a difficult concept, The Professor can break it
              down into simpler components, provide analogies, or explain it
              from different perspectives until you grasp it fully.
            </p>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium tracking-tight mb-2">
              Homework Assistance
            </h3>
            <p>
              Stuck on a problem? The Professor guides you through the
              problem-solving process without giving away the answer, helping
              you develop critical thinking skills.
            </p>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium tracking-tight mb-2">
              Exam Preparation
            </h3>
            <p>
              The Professor can create practice questions, review key concepts,
              and identify areas where you need additional study before an
              important test or assessment.
            </p>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium tracking-tight mb-2">
              Knowledge Expansion
            </h3>
            <p>
              When a topic sparks your interest, The Professor can provide
              additional information, recommend resources, or explore advanced
              aspects of the subject beyond your current course material.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900/30 p-6 rounded-lg mb-12">
        <h2 className="text-2xl font-semibold mb-4">How It's Different</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Standard AI Assistants</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-gray-400 mr-2">•</span>
                <span>Generic responses to questions</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-400 mr-2">•</span>
                <span>Limited context awareness</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-400 mr-2">•</span>
                <span>No memory of previous interactions</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-400 mr-2">•</span>
                <span>One-size-fits-all explanations</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">The Professor</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Personalized to your learning style</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Aware of your course content and progress</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Remembers your questions and challenges</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Adapts explanations to your knowledge level</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Experience the power of a personal AI tutor
        </h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          The Professor is available as part of our premium subscription plans,
          giving you unlimited access to personalized tutoring whenever you need
          it.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="https://app.kouza-ai.com/login">Try Premium</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/#pricing">View Plans</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
