import React from "react"
import "@kouza/ui/globals.css"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="flex-1">{children}</div>
}
