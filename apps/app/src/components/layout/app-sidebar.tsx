"use client"

import {
  BarChart,
  BicepsFlexed,
  BookOpen,
  ChevronUp,
  FileStackIcon,
  FileText,
  Home,
  Inbox,
  Search,
  User2,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "@kouza/ui/components/sidebar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@kouza/ui/components/dropdown-menu"
import { signOut } from "next-auth/react"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Progress } from "@kouza/ui/components/progress"
import SubscribeButton from "../subscribe-button"
import CourseDialog from "../dialogs/course"

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Search",
    url: "/search",
    icon: Search,
  },
  {
    title: "My Courses",
    url: "/courses",
    icon: Inbox,
  },
  {
    title: "Notes",
    url: "/notes",
    icon: FileText,
  },
  {
    title: "Flashcards",
    url: "/flashcards",
    icon: FileStackIcon,
  },
  {
    title: "Progress",
    url: "/progress",
    icon: BarChart,
  },
  {
    title: "Objectives",
    url: "/objectives",
    icon: BookOpen,
  },
]

export default function AppSidebar({
  user,
  isSubscribed,
  courseCount,
}: {
  user: any
  isSubscribed: boolean
  courseCount: number
}) {
  const router = useRouter()

  return (
    <>
      <Sidebar className="hidden lg:flex" side="left">
        <SidebarHeader className="p-4 text-center">
          <h3 className="text-4xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
            Kouza
          </h3>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                <CourseDialog>
                  <SidebarMenuItem className="cursor-pointer">
                    <SidebarMenuButton asChild>
                      <div className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black rounded-lg px-3 py-2 font-medium shadow-md hover:shadow-lg hover:bg-gray-900 hover:text-white dark:hover:bg-gray-100 transition-all border border-transparent dark:border-gray-200">
                        <BicepsFlexed className="h-5 w-5" />
                        <span>Generate Course</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </CourseDialog>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem className="p-2">
              {!isSubscribed && (
                <div className="flex flex-col gap-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 p-4 rounded-lg">
                  <h4 className="text-md tracking-tight text-center text-gray-900 dark:text-gray-100">
                    You have{" "}
                    {3 <= courseCount
                      ? 0
                      : courseCount === 0
                        ? 3
                        : courseCount === 1
                          ? 2
                          : courseCount === 2
                            ? 1
                            : 0}{" "}
                    free course generations remaining
                  </h4>
                  <Progress
                    className="h-2"
                    value={Math.round((courseCount / 3) * 100)}
                  />
                  <SubscribeButton />
                </div>
              )}
            </SidebarMenuItem>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    {user.image ? (
                      <Image
                        width={6}
                        height={6}
                        src={user.image || null}
                        className="rounded-full w-6 h-6"
                        alt="User image"
                      />
                    ) : (
                      <User2 size={24} />
                    )}
                    <div className="flex items-center gap-2">
                      {user.name}
                      {isSubscribed ? (
                        <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full font-medium">
                          PRO
                        </span>
                      ) : (
                        <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-1.5 py-0.5 rounded-full font-medium">
                          FREE
                        </span>
                      )}
                    </div>
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem onClick={() => router.push("/account")}>
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/billing")}>
                    Billing
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => signOut()}>
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </>
  )
}
