"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@kouza/ui/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@kouza/ui/components/navigation-menu"

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Course Generation",
    href: "/features/course-generation",
    description:
      "Generate a course from a text prompt. You can use this to generate a course on a specific topic, or use it to generate a course on a specific subject.",
  },
  {
    title: "The Professor",
    href: "/features/the-professor",
    description: "Your personalized AI tutor available 24/7.",
  },
  {
    title: "Progress Tracking",
    href: "/features/progress-tracking",
    description: "Track your progress and see your growth.",
  },
  {
    title: "SRS Flashcards",
    href: "/features/srs-flashcards",
    description:
      "Generate spaced repetition flashcards optimized for long-term knowledge retention.",
  },
  {
    title: "Interactive Notes",
    href: "/features/interactive-notes",
    description:
      "Summarize and expand on your course content with interactive notes.",
  },
]

export function NavigationMenuComponent() {
  return (
    <NavigationMenu className="hidden lg:block">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/help" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Help
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Features</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/feature-request" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Request a Feature
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
