"use client"

import React from "react"
import NotificationDropdown from "../dashboard/notification-dropdown"
import LocaleDropdown from "../locale-dropdown"
import SearchBar from "../dashboard/search-bar"
import { usePathname } from "next/navigation"
import MobileSidebar from "./mobile-sidebar"
import ThemeSwitcher from "../theme-switcher"

const routeTitles: Record<string, string> = {
  "/courses": "Courses",
  "/settings": "Settings",
  "/notes": "Notes",
  "/flashcards": "Flashcards",
  "/search": "Search",
}

interface NavbarProps {
  title?: string
  flashcards?: { title: string; slug: string }
  course?: { title: string; slug: string }
  module?: { title: string; slug: string }
  isSubscribed: boolean
  courseCount: number
}

export default function Navbar({
  title,
  course,
  module,
  flashcards,
  isSubscribed,
  courseCount,
}: NavbarProps) {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  let displayTitle = title
  let shortTitle = ""

  if (!displayTitle) {
    if (pathname === "/") {
      displayTitle = "Home"
    } else if (course && segments.includes(course.slug)) {
      displayTitle = course.title
      shortTitle = "Course"
    } else if (module && segments.includes(module.slug)) {
      displayTitle = module.title
      shortTitle = "Module"
    } else if (flashcards && segments.includes(flashcards.slug)) {
      displayTitle = flashcards.title
      shortTitle = "Flashcards"
    } else {
      const lastSegment = segments[segments.length - 1]
      displayTitle =
        routeTitles[pathname] ||
        (lastSegment
          ? lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)
          : "")
    }
  }

  return (
    <div className="flex items-center justify-between w-full">
      <h3 className="text-3xl sm:text-4xl font-semibold tracking-tighter">
        <span className="lg:hidden">{shortTitle || displayTitle}</span>
        <span className="hidden lg:inline">{displayTitle}</span>
      </h3>

      <div className="flex items-center gap-6">
        <SearchBar />
        <div className="flex items-center gap-6 px-4">
          <NotificationDropdown />
          <LocaleDropdown />
          <ThemeSwitcher />
          <MobileSidebar
            isSubscribed={isSubscribed}
            courseCount={courseCount}
          />
        </div>
      </div>
    </div>
  )
}
