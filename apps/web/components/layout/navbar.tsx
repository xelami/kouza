"use client"

import { Button } from "@kouza/ui/components/button"
import { NavigationMenu } from "@kouza/ui/components/navigation-menu"
import Link from "next/link"
import React from "react"
import { NavigationMenuComponent } from "./nav-menu"
export default function Navbar() {
  return (
    <div className="flex items-center justify-between max-w-[1200px] mx-auto w-full">
      <Link href="/" className="text-4xl font-semibold tracking-tight">
        Kouza
      </Link>

      <NavigationMenuComponent />

      <Link href="https://app.kouza-ai.com/login" className="hidden lg:block">
        <Button>Get started for free</Button>
      </Link>
    </div>
  )
}
