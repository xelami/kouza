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
    <div className="flex flex-col lg:flex-row min-h-screen mb-12 xl:mb-0">
      <div className="grid grid-cols-1 xl:grid-cols-[3fr_1fr] w-full">
        {mainContent}
        <div className="hidden xl:block">{sidebarContent}</div>
      </div>
      <AssistantDrawer context={context} />
    </div>
  )
}
