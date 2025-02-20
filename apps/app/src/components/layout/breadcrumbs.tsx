"use client"

import React from "react"
import { SlashIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface BreadcrumbsProps {
  course?: { title: string; slug: string }
  module?: { title: string; slug: string }
  flashcards?: { title: string; slug: string }
}

const defaultLabels: Record<string, string> = {
  course: "Course",
  courses: "Courses",
  modules: "Modules",
  notes: "Notes",
  flashcards: "Flashcards",
  search: "Search",
  review: "Review",
}

export default function Breadcrumbs({
  course,
  module,
  flashcards,
}: BreadcrumbsProps) {
  const pathname = usePathname()

  if (pathname === "/") return null

  const segments = pathname.split("/").filter(Boolean)

  const breadcrumbs = segments.reduce<Array<{ href: string; label: string }>>(
    (acc, segment, index) => {
      if (index === 0) return acc

      if (defaultLabels[segment]) {
        acc.push({
          href: `/${segments.join("/")}`,
          label: defaultLabels[segment],
        })
        return acc
      }

      if (flashcards && segment === flashcards.slug) {
        acc.push({
          href: `/flashcards/${flashcards?.slug}/modules/${flashcards.slug}`,
          label: flashcards.title,
        })
        return acc
      }

      if (course && segment === course.slug) {
        acc.push({
          href: `/course/${course.slug}`,
          label: course.title,
        })
        return acc
      }

      if (module && segment === module.slug) {
        acc.push({
          href: `/course/${course?.slug}/modules/${module.slug}`,
          label: module.title,
        })
        return acc
      }

      return acc
    },
    [{ href: "/", label: "Home" }]
  )

  return (
    <div className="flex items-center my-4 space-x-1 text-muted-foreground">
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={`${crumb.href}-${index}`}>
          {index !== 0 && <SlashIcon className="h-4 w-4" />}
          <Link
            href={crumb.href}
            className="hover:text-foreground transition-colors"
          >
            {crumb.label}
          </Link>
        </React.Fragment>
      ))}
    </div>
  )
}
