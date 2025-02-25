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
  BarChart3,
  TrendingUp,
  Calendar,
  Target,
  Award,
  Clock,
  LineChart,
} from "lucide-react"

import trackingImage from "@/public/sc.png"

export default function ProgressTracking() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-12">
        <h1 className="text-4xl font-medium tracking-tight mb-4">
          Progress Tracking
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
          Monitor your learning journey with detailed analytics and insights to
          optimize your study habits and achieve your goals faster.
        </p>

        <div className="relative h-[300px] w-full rounded-lg overflow-hidden mb-8">
          <Image
            src={trackingImage}
            alt="Progress Tracking Dashboard"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-2xl font-medium tracking-tight mb-4">
            What is Progress Tracking?
          </h2>
          <p className="mb-4">
            Our Progress Tracking feature provides comprehensive analytics and
            visualizations of your learning journey. It transforms your study
            data into actionable insights, helping you understand your
            strengths, identify areas for improvement, and optimize your
            learning strategy.
          </p>
          <p>
            Unlike simple completion metrics, our tracking system analyzes
            multiple dimensions of your learning—including time spent, knowledge
            retention, quiz performance, and consistency—to give you a complete
            picture of your progress and help you achieve your goals more
            efficiently.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-medium tracking-tight mb-4">
            Key Benefits
          </h2>
          <ul className="space-y-3">
            {[
              "Visualize your learning progress across all courses",
              "Identify knowledge gaps and areas needing review",
              "Track time spent and optimize study efficiency",
              "Monitor long-term retention with spaced repetition data",
              "Set and track personalized learning goals",
              "Receive data-driven recommendations to improve",
            ].map((benefit, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-medium tracking-tight mb-4">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center tracking-tight">
                <BarChart3 className="mr-2 h-5 w-5" />
                <span>Performance Analytics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Detailed charts and graphs showing your quiz scores, exercise
                completion rates, and knowledge retention across different
                subjects and topics.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center tracking-tight">
                <TrendingUp className="mr-2 h-5 w-5" />
                <span>Progress Timeline</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Visualize your learning journey over time with interactive
                timelines that show your improvement, study consistency, and
                milestone achievements.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center tracking-tight">
                <Calendar className="mr-2 h-5 w-5" />
                <span>Study Habit Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Track your study patterns, including optimal times of day,
                session duration, and frequency to help you develop more
                effective learning habits.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center tracking-tight">
                <Target className="mr-2 h-5 w-5" />
                <span>Goal Setting & Tracking</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Set personalized learning goals—daily study time, topic mastery,
                or course completion targets—and track your progress toward
                achieving them.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="tracking-tight">
            How Progress Tracking Works
          </CardTitle>
          <CardDescription>
            Turning your learning data into actionable insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex">
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <LineChart className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-medium tracking-tight">
                  Automatic Data Collection
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  As you learn, our system automatically collects data on your
                  interactions, quiz results, time spent, and more—all without
                  any manual input required.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-medium tracking-tight">
                  Performance Analysis
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our algorithms analyze your performance across different
                  dimensions to identify patterns, strengths, and areas where
                  you might benefit from additional focus.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-medium tracking-tight">
                  Personalized Recommendations
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Based on your data, you'll receive tailored recommendations
                  for what to study next, when to review material, and how to
                  optimize your learning approach.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-12">
        <h2 className="text-2xl font-medium tracking-tight mb-4">
          Detailed Metrics
        </h2>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium tracking-tight mb-2">
              Knowledge Retention
            </h3>
            <p>
              Track how well you're retaining information over time with spaced
              repetition analytics that show your recall rates and memory
              strength for different topics.
            </p>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium tracking-tight mb-2">
              Learning Efficiency
            </h3>
            <p>
              Measure how quickly you're mastering new concepts compared to your
              historical data and optimize your study methods based on what
              works best for you.
            </p>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium tracking-tight mb-2">
              Topic Mastery
            </h3>
            <p>
              Visualize your proficiency across different subjects and topics
              with heat maps and mastery scores that highlight your strengths
              and knowledge gaps.
            </p>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium tracking-tight mb-2">
              Study Consistency
            </h3>
            <p>
              Monitor your learning consistency with streak tracking, session
              frequency analysis, and habit formation metrics to help you
              develop sustainable study routines.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900/30 p-6 rounded-lg mb-12">
        <h2 className="text-2xl font-semibold mb-4">Real-World Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">For Students</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>
                  Prepare more effectively for exams by focusing on weak areas
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>
                  Develop better study habits through data-driven insights
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Track progress across multiple courses and subjects</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">For Professionals</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Balance skill development with busy work schedules</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>
                  Demonstrate learning progress to employers or clients
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Optimize limited study time for maximum results</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          Integration with Other Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-2">Course Generation</h3>
            <p>
              Your progress data helps our AI create more personalized courses
              that address your specific knowledge gaps and learning needs.
            </p>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-medium mb-2">The Professor</h3>
            <p>
              The Professor uses your progress data to provide more targeted
              explanations and examples tailored to your current understanding.
            </p>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-medium mb-2">Smart Flashcards</h3>
            <p>
              Your retention metrics inform the spaced repetition algorithm,
              optimizing review schedules for maximum memory retention.
            </p>
          </Card>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Transform your learning with data-driven insights
        </h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          Start tracking your progress today and discover how analytics can help
          you learn more effectively and achieve your goals faster.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="https://app.kouza-ai.com/login">Get Started</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/#pricing">View Plans</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
