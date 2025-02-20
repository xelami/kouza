import React from "react"
import "@kouza/ui/globals.css"
import LocaleDropdown from "@/components/locale-dropdown"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex-1 relative">
      <div className="absolute top-8 right-16">
        <LocaleDropdown />
      </div>
      {children}
    </div>
  )
}
