import AssistantDrawer from "@/components/layout/assistant-drawer"
import React from "react"

export default function ReviewLayout({
  children,
  context,
}: {
  children: React.ReactNode
  context?: string
}) {
  const [mainContent, sidebarContent] = React.Children.toArray(children)

  return (
    <div className="min-h-screen relative">
      {/* Main container with space for the fixed sidebar on XL */}
      <div className="w-full xl:pr-80 2xl:pr-96 3xl:pr-[30rem]">
        {mainContent}
      </div>
      <AssistantDrawer context={context} />
    </div>
  )
}
