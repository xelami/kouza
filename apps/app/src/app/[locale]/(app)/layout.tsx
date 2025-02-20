import { SidebarProvider } from "@kouza/ui/components/sidebar"
import AppSidebar from "@/components/layout/app-sidebar"
import NavigationWrapper from "@/components/layout/navigation-wrapper"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getUserData } from "@/app/api/user/get-user-data"
import { Metadata } from "next"

export const runtime = "edge"

export const metadata: Metadata = {
  title: "KouzaAI - AI-Powered Learning",
  description: "Level up your learning",
}

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const { isSubscribed, courseCount } = await getUserData(session.user.id)

  return (
    <SidebarProvider>
      <AppSidebar
        user={session.user}
        isSubscribed={isSubscribed}
        courseCount={courseCount}
      />
      <main className="flex-1 overflow-auto h-screen">
        <NavigationWrapper
          isSubscribed={isSubscribed}
          courseCount={courseCount}
        >
          {children}
        </NavigationWrapper>
      </main>
    </SidebarProvider>
  )
}
