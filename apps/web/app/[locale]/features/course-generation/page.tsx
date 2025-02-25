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
import { CheckCircle } from "lucide-react"

import courseGenImage from "@/public/main.png"

export default function CourseGeneration() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-12">
        <h1 className="text-4xl font-medium tracking-tight mb-4">
          AI Course Generation
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
          Create personalized learning experiences in seconds with our advanced
          AI technology.
        </p>

        <div className="relative h-[300px] w-full rounded-lg overflow-hidden mb-8">
          <Image
            src={courseGenImage}
            alt="AI Course Generation"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-2xl font-medium tracking-tight mb-4">
            What is AI Course Generation?
          </h2>
          <p className="mb-4">
            Our AI Course Generation technology uses advanced machine learning
            algorithms to create comprehensive, structured learning materials on
            any topic you choose. By analyzing vast amounts of educational
            content, our AI can build customized courses that adapt to your
            learning style, pace, and existing knowledge.
          </p>
          <p>
            Whether you're learning a new programming language, studying for an
            exam, or exploring a hobby, our AI can create the perfect learning
            path for you in seconds rather than the hours or days it would take
            to compile manually.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-medium tracking-tight mb-4">
            Key Benefits
          </h2>
          <ul className="space-y-3">
            {[
              "Personalized learning paths tailored to your specific needs",
              "Comprehensive content including lessons, quizzes, and exercises",
              "Save hours of research and organization time",
              "Learn at your own pace with adaptive difficulty levels",
              "Stay current with automatically updated information",
              "Fill knowledge gaps with targeted content",
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
          <CardTitle className="tracking-tight">How It Works</CardTitle>
          <CardDescription>
            Creating your personalized course is simple and takes just minutes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-6">
            <li className="flex">
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <span className="text-lg font-semibold">1</span>
              </div>
              <div>
                <h3 className="text-lg font-medium tracking-tight">
                  Enter your topic
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Simply type in what you want to learn about - from JavaScript
                  to Ancient History.
                </p>
              </div>
            </li>
            <li className="flex">
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <span className="text-lg font-semibold">2</span>
              </div>
              <div>
                <h3 className="text-lg font-medium tracking-tight">
                  Customize your preferences
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Select your skill level, learning goals, and time commitment
                  to tailor the course.
                </p>
              </div>
            </li>
            <li className="flex">
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <span className="text-lg font-semibold">3</span>
              </div>
              <div>
                <h3 className="text-lg font-medium tracking-tight">
                  Generate and start learning
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our AI creates your course in seconds, complete with lessons,
                  quizzes, and resources.
                </p>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>

      <div className="mb-12">
        <h2 className="text-2xl font-medium tracking-tight mb-4">
          Technical Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="tracking-tight">
                Natural Language Processing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Our AI uses advanced NLP to understand your learning goals and
                create coherent, well-structured educational content that reads
                naturally.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="tracking-tight">
                Knowledge Graph Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Courses are built on comprehensive knowledge graphs that ensure
                topics are presented in a logical sequence with proper
                prerequisites.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="tracking-tight">
                Adaptive Learning Algorithms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                The system adapts to your progress, focusing more on areas where
                you need additional practice and moving quickly through familiar
                content.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="tracking-tight">
                Multi-format Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Courses include various content types: text explanations, visual
                aids, interactive exercises, quizzes, and practical
                applications.
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
              Students
            </h3>
            <p>
              Create supplementary study materials for difficult subjects,
              prepare for exams, or explore topics beyond your curriculum at
              your own pace.
            </p>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium tracking-tight mb-2">
              Professionals
            </h3>
            <p>
              Quickly learn new skills relevant to your career, stay updated on
              industry developments, or prepare for certifications efficiently.
            </p>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium tracking-tight mb-2">
              Educators
            </h3>
            <p>
              Generate customized teaching materials for your students, create
              differentiated learning paths, or develop supplementary resources
              for various learning levels.
            </p>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium tracking-tight mb-2">
              Lifelong Learners
            </h3>
            <p>
              Explore new hobbies, interests, or subjects without the structure
              of formal education, learning exactly what interests you at your
              own pace.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-medium tracking-tight mb-4">
          Ready to transform your learning experience?
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="https://app.kouza-ai.com/login">Try It Now</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/#pricing">View Pricing</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
