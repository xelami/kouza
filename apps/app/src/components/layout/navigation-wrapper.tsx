"use client"

import { usePathname } from "next/navigation"
import Navbar from "./navbar"
import Breadcrumbs from "./breadcrumbs"

export default function NavigationWrapper({
  children,
  isSubscribed,
  courseCount,
}: {
  children: React.ReactNode
  isSubscribed: boolean
  courseCount: number
}) {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  const isReviewPage = pathname.includes("/review/")

  const flashcardsIndex = segments.indexOf("flashcards") + 1
  const courseIndex = segments.indexOf("course") + 1
  const moduleIndex = segments.indexOf("modules") + 1

  const formatTitle = (slug: string) => {
    return slug
      .split("-")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ")
      .replace(/\s*\d+$/, "")
  }

  const flashcards =
    flashcardsIndex > 0 && segments[flashcardsIndex]
      ? {
          slug: segments[flashcardsIndex],
          title: formatTitle(segments[flashcardsIndex]),
        }
      : undefined

  const course =
    courseIndex > 0 && segments[courseIndex]
      ? {
          slug: segments[courseIndex],
          title: formatTitle(segments[courseIndex]),
        }
      : undefined

  const module =
    moduleIndex > 0 && segments[moduleIndex]
      ? {
          slug: segments[moduleIndex],
          title: formatTitle(segments[moduleIndex]),
        }
      : undefined

  if (isReviewPage) {
    return <>{children}</>
  }

  return (
    <div className="flex flex-col font-[family-name:var(--font-geist-sans)] h-full p-6 px-4">
      <Navbar
        flashcards={flashcards}
        course={course}
        module={module}
        isSubscribed={isSubscribed}
        courseCount={courseCount}
      />
      <Breadcrumbs flashcards={flashcards} course={course} module={module} />
      {children}
    </div>
  )
}
