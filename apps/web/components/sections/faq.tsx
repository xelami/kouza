import React from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@kouza/ui/components/accordion"

export default function FAQSection() {
  const faqs = [
    {
      question: "What is Kouza?",
      answer:
        "Kouza is an AI-powered learning platform that creates personalized courses on any topic. Our platform combines AI course generation, personalized tutoring, smart flashcards, progress tracking, and interactive notes to provide a comprehensive learning experience tailored to your needs.",
    },
    {
      question: "How does AI Course Generation work?",
      answer:
        "Our AI Course Generation analyzes your learning goals, prior knowledge, and preferences to create a customized curriculum. It breaks down complex topics into digestible lessons, incorporates relevant examples, and includes quizzes to test your understanding. You can further customize the course depth, focus areas, and learning style to match your preferences.",
    },
    {
      question: "What is The Professor feature?",
      answer:
        "The Professor is your personal AI tutor available 24/7. Unlike generic AI assistants, The Professor understands your course content and learning history to provide contextual support. It can explain concepts, answer questions, provide examples, and guide you through difficult topics with personalized explanations.",
    },
    {
      question: "How do Smart Flashcards improve learning?",
      answer:
        "Our Smart Flashcards use spaced repetition algorithms based on cognitive science to optimize memory retention. The system tracks your performance and automatically schedules reviews at the optimal time to ensure you remember information long-term while minimizing study time. This approach is proven to be more effective than traditional study methods.",
    },
    {
      question: "Can I track my learning progress?",
      answer:
        "Yes! Our Progress Tracking feature provides detailed analytics on your learning journey. You can track completion rates, quiz performance, study time, knowledge retention, and more across all your courses. These insights help you identify strengths and areas for improvement to optimize your learning strategy.",
    },
    {
      question: "What are Interactive Notes?",
      answer:
        "Interactive Notes allow you to create, organize, and enhance your study materials with AI assistance. The system helps clarify concepts, suggest connections between ideas, and convert your notes into other study formats like flashcards. It transforms passive note-taking into an active learning tool that improves comprehension and retention.",
    },
    {
      question: "Is Kouza free to use?",
      answer:
        "Kouza offers a free tier with basic access to course generation and limited features. We also offer premium plans that unlock advanced features like The Professor, unlimited courses, enhanced analytics, and more. Visit our Pricing page for current plan details and features.",
    },
    {
      question: "How is Kouza different from other learning platforms?",
      answer:
        "Kouza stands out by combining AI-powered personalization with proven learning science. Unlike platforms with fixed courses, Kouza creates custom content for your specific needs. Our integrated approach combines course generation, tutoring, flashcards, notes, and analytics in one seamless experience, adapting to your learning style and progress.",
    },
    {
      question: "Can I learn any subject on Kouza?",
      answer:
        "Yes! Kouza can generate courses on virtually any topic, from academic subjects like mathematics and history to practical skills like programming and photography. Our AI can create appropriate learning materials regardless of the subject matter, though the depth and quality may vary based on available information.",
    },
    {
      question: "How do I get started?",
      answer:
        "Getting started is easy! Simply sign up for a free account, complete a brief onboarding process to tell us about your learning goals, and then create your first course by entering a topic you want to learn. Our AI will generate a personalized course, and you can start learning immediately.",
    },
  ]

  return (
    <section id="faq" className="py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-medium mb-4 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Find answers to common questions about Kouza and how our AI-powered
            learning platform can help you achieve your learning goals.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-b border-gray-200 dark:border-gray-700"
            >
              <AccordionTrigger className="text-left font-medium py-4 text-lg">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-1 text-gray-600 dark:text-gray-300">
                <p>{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 text-center">
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            Still have questions? We're here to help.
          </p>
          <a href="/help" className="text-primary hover:underline font-medium">
            Visit our Help Center →
          </a>
        </div>
      </div>
    </section>
  )
}
