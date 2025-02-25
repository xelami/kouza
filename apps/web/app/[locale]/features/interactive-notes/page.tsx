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
  BookOpen,
  FileText,
  Search,
  PenTool,
  Sparkles,
  Link2,
  Share2,
} from "lucide-react"

import notesImage from "@/public/note.png"

export default function InteractiveNotes() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-12">
        <h1 className="text-4xl font-medium tracking-tight mb-4">
          Interactive Notes
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
          Create, organize, and enhance your study notes with powerful AI
          assistance that transforms passive note-taking into active learning.
        </p>

        <div className="relative h-[300px] w-full rounded-lg overflow-hidden mb-8">
          <Image
            src={notesImage}
            alt="Interactive Notes"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-2xl font-medium tracking-tight mb-4">
            What are Interactive Notes?
          </h2>
          <p className="mb-4">
            Our Interactive Notes feature goes beyond traditional note-taking by
            adding AI-powered capabilities that help you organize information,
            identify connections between concepts, and transform your notes into
            active learning tools.
          </p>
          <p>
            With smart formatting, automatic summarization, concept linking, and
            integration with other learning features, Interactive Notes helps
            you create study materials that enhance understanding and retention
            rather than just storing information.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-medium tracking-tight mb-4">
            Key Benefits
          </h2>
          <ul className="space-y-3">
            {[
              "Transform disorganized notes into structured knowledge",
              "Save time with AI-assisted formatting and organization",
              "Discover connections between concepts across different notes",
              "Convert notes to other study formats like flashcards",
              "Access your notes anywhere, anytime, on any device",
              "Collaborate and share notes with study partners",
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
                <Sparkles className="mr-2 h-5 w-5" />
                <span>AI Enhancement</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Our AI can help clarify concepts, expand on ideas, suggest
                additional information, and even identify and correct
                misconceptions in your notes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center tracking-tight">
                <PenTool className="mr-2 h-5 w-5" />
                <span>Rich Formatting</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Create visually engaging notes with support for headings, lists,
                tables, code blocks, math equations, diagrams, images, and
                more—all with simple markdown-like syntax.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center tracking-tight">
                <Link2 className="mr-2 h-5 w-5" />
                <span>Concept Linking</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Our system automatically identifies related concepts across your
                notes and creates links between them, helping you build a
                personal knowledge network.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center tracking-tight">
                <Search className="mr-2 h-5 w-5" />
                <span>Smart Search</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Find exactly what you need with semantic search that understands
                concepts, not just keywords, allowing you to locate information
                even if you don't remember the exact wording.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="tracking-tight">
            How Interactive Notes Work
          </CardTitle>
          <CardDescription>
            Transforming passive notes into active learning tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex">
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-medium tracking-tight">
                  Create and Capture
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Take notes during lectures, while reading, or studying. Our
                  editor supports text, images, diagrams, and even voice-to-text
                  for quick capture of ideas.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-medium tracking-tight">
                  Organize and Structure
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Use AI assistance to organize your notes into logical
                  sections, create summaries, highlight key points, and format
                  content for better readability.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Share2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-medium tracking-tight">
                  Transform and Share
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Convert your notes into other study formats like flashcards,
                  mind maps, or practice questions. Share with classmates or
                  study groups for collaborative learning.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-12">
        <h2 className="text-2xl font-medium tracking-tight mb-4">
          Advanced Capabilities
        </h2>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium tracking-tight mb-2">
              AI-Powered Summaries
            </h3>
            <p>
              Ask the AI to generate concise summaries of your lengthy notes,
              extracting key points and creating executive summaries perfect for
              quick review before exams.
            </p>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium tracking-tight mb-2">
              Question Generation
            </h3>
            <p>
              Transform your notes into practice questions and quizzes to test
              your understanding. The AI identifies key concepts and creates
              relevant questions to help reinforce your learning.
            </p>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium tracking-tight mb-2">
              Knowledge Gaps
            </h3>
            <p>
              The AI analyzes your notes to identify potential knowledge gaps or
              areas where your understanding might be incomplete, suggesting
              additional topics to explore.
            </p>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium tracking-tight mb-2">
              Visual Learning
            </h3>
            <p>
              Request the AI to generate diagrams, charts, or mind maps based on
              your text notes, helping you visualize complex relationships
              between concepts.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900/30 p-6 rounded-lg mb-12">
        <h2 className="text-2xl font-medium tracking-tight mb-4">
          Perfect For
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Note-Taking Scenarios</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Lecture and classroom notes</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Reading and research summaries</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Project planning and brainstorming</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Meeting and discussion notes</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Personal knowledge management</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Learning Styles</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Visual learners (diagrams, mind maps)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Verbal learners (summaries, explanations)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Active learners (questions, quizzes)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Sequential learners (structured outlines)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Global learners (concept connections)</span>
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
            <h3 className="text-lg font-medium mb-2">Course Connection</h3>
            <p>
              Notes are automatically linked to relevant course materials,
              making it easy to reference lecture content while studying.
            </p>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-medium mb-2">Flashcard Creation</h3>
            <p>
              Convert important concepts from your notes into flashcards with
              one click, seamlessly integrating with our SRS system.
            </p>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-medium mb-2">Professor Assistance</h3>
            <p>
              Ask The Professor to explain concepts in your notes, provide
              additional context, or suggest improvements to your understanding.
            </p>
          </Card>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Transform your note-taking experience
        </h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          Start creating interactive notes today and turn passive information
          into active knowledge that enhances your learning and retention.
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
