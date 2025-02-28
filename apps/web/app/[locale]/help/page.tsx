import React from "react"
import Link from "next/link"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@kouza/ui/components/accordion"

export default function HelpPage() {
  const helpSections = [
    {
      id: "getting-started",
      title: "Getting Started",
      content: [
        {
          id: "account-setup",
          title: "Account Setup",
          text: "To get started with Kouza, create an account by clicking the 'Sign Up' button in the top right corner of the homepage. You can sign up using your email address or continue with Google or Apple. After signing up, you'll be guided through a brief onboarding process to personalize your learning experience.",
        },
        {
          id: "platform-overview",
          title: "Platform Overview",
          text: "Kouza offers several key features to enhance your learning: AI Course Generation, The Professor (AI tutor), Smart Flashcards, Progress Tracking, and Interactive Notes. Each feature is designed to work together to create a comprehensive learning experience tailored to your needs.",
        },
        {
          id: "first-course",
          title: "Creating Your First Course",
          text: "To create your first course, navigate to the dashboard and click 'New Course'. Enter a topic you want to learn about, and our AI will generate a structured course with lessons, quizzes, and resources. You can customize the course depth, focus areas, and learning style to match your preferences.",
        },
      ],
    },
    {
      id: "features",
      title: "Features",
      content: [
        {
          id: "course-generation",
          title: "AI Course Generation",
          text: "Our AI Course Generation creates personalized learning paths on any topic. Simply enter what you want to learn, and the AI will create a structured course with lessons, quizzes, and resources tailored to your knowledge level and learning goals.",
        },
        {
          id: "the-professor",
          title: "The Professor",
          text: "The Professor is your personal AI tutor available 24/7. It provides explanations, answers questions, and offers guidance throughout your learning journey. Unlike generic AI assistants, The Professor understands your course content and learning history to provide contextual support.",
        },
        {
          id: "flashcards",
          title: "Smart Flashcards",
          text: "Our Smart Flashcards use spaced repetition algorithms to optimize your memory retention. The system automatically schedules reviews at the optimal time to ensure you remember information long-term while minimizing study time.",
        },
        {
          id: "progress-tracking",
          title: "Progress Tracking",
          text: "The Progress Tracking feature provides detailed analytics on your learning journey. Track your completion rates, quiz performance, study time, and knowledge retention across all courses to optimize your learning strategy.",
        },
        {
          id: "interactive-notes",
          title: "Interactive Notes",
          text: "Interactive Notes allow you to create, organize, and enhance your study materials with AI assistance. The system can help clarify concepts, suggest connections between ideas, and convert your notes into other study formats like flashcards.",
        },
      ],
    },
    {
      id: "account",
      title: "Account Management",
      content: [
        {
          id: "subscription",
          title: "Subscription Plans",
          text: "Kouza offers several subscription tiers to meet different learning needs. The Free plan provides basic access to course generation and limited features. Premium plans unlock advanced features like The Professor, unlimited courses, and enhanced analytics. Visit the Pricing page for current plan details.",
        },
        {
          id: "profile-settings",
          title: "Profile Settings",
          text: "Manage your profile settings by clicking on your avatar in the top right corner and selecting 'Settings'. Here you can update your personal information, change your password, adjust notification preferences, and manage connected accounts.",
        },
        {
          id: "data-privacy",
          title: "Data Privacy",
          text: "We take your privacy seriously. You can review and manage your data in the Privacy section of your account settings. This includes options to download your data, control what information is used for personalization, and delete your account if needed.",
        },
      ],
    },
    {
      id: "troubleshooting",
      title: "Troubleshooting",
      content: [
        {
          id: "common-issues",
          title: "Common Issues",
          text: "If you're experiencing issues with the platform, try refreshing the page, clearing your browser cache, or using a different browser. Most technical issues can be resolved with these simple steps.",
        },
        {
          id: "contact-support",
          title: "Contact Support",
          text: "If you need additional help, our support team is available via email at contact@xelami.com. Please include detailed information about your issue, including any error messages, the device and browser you're using, and steps to reproduce the problem.",
        },
        {
          id: "feedback",
          title: "Providing Feedback",
          text: "We value your feedback! Click on the 'Feedback' button in the bottom right corner of any page to share your thoughts, report bugs, or suggest new features. Your input helps us improve the platform for everyone.",
        },
      ],
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div
        className="absolute inset-0 -z-10 h-full w-full 
        bg-[radial-gradient(#515151_1px,transparent_1px)] 
        dark:bg-[radial-gradient(#9494a8_0.8px,transparent_1px)] 
        [background-size:24px_24px] 
        [mask-image:radial-gradient(ellipse_100%_100%_at_50%_0%,#000_20%,transparent_100%)]
        opacity-50"
      ></div>
      <h1 className="text-4xl font-medium tracking-tight mb-8">Help Center</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left sidebar navigation */}
        <div className="md:w-1/4 shrink-0">
          <div className="sticky top-24 space-y-2">
            <h2 className="text-xl font-semibold mb-4">Topics</h2>
            <nav className="flex flex-col space-y-1">
              {helpSections.map((section) => (
                <Link
                  key={section.id}
                  href={`#${section.id}`}
                  className="px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {section.title}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="md:w-3/4">
          {helpSections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="mb-12 scroll-mt-24"
            >
              <h2 className="text-2xl font-medium tracking-tight mb-6 pb-2 border-b">
                {section.title}
              </h2>

              <Accordion type="single" collapsible className="space-y-4">
                {section.content.map((item) => (
                  <AccordionItem
                    key={item.id}
                    value={item.id}
                    id={item.id}
                    className="scroll-mt-24"
                  >
                    <AccordionTrigger className="text-lg font-medium">
                      {item.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {item.text}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
