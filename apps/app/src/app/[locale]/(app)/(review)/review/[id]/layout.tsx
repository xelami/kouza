import { SidebarProvider, SidebarTrigger } from "@kouza/ui/components/sidebar"
import AssistantSidebar from "@/components/review/assistant-sidebar"

export default function ReviewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <main>{children}</main>
      <AssistantSidebar />
    </SidebarProvider>
  )
}
