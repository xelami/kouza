"use client"

import { Button } from "@kouza/ui/components/button"
import Link from "next/link"
import React from "react"

export default function Navbar() {
  return (
    <div className="flex items-center justify-between w-full">
      <Link href="/" className="text-4xl font-semibold tracking-tight">
        Kouza
      </Link>

      <Link href="https://app.kouza-ai.com/login" className="hidden lg:block">
        <Button>Get started for free</Button>
      </Link>
    </div>
  )
}
