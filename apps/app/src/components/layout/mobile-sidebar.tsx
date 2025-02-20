import React from "react"
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@kouza/ui/components/drawer"
import {
  BicepsFlexed,
  ChevronUp,
  FileStackIcon,
  FileText,
  Home,
  Inbox,
  MenuIcon,
  Search,
  Settings,
} from "lucide-react"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Progress } from "@kouza/ui/components/progress"
import { DropdownMenuItem } from "@kouza/ui/components/dropdown-menu"
import SubscribeButton from "../subscribe-button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@kouza/ui/components/dropdown-menu"
import { SidebarMenuButton } from "@kouza/ui/components/sidebar"

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
    title: "Generate Course",
    url: "/revise",
    icon: BicepsFlexed,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export default function MobileSidebar({
  isSubscribed,
  courseCount,
}: {
  isSubscribed: boolean
  courseCount: number
}) {
  const router = useRouter()

  return (
    <div className="lg:hidden">
      <Drawer direction="right">
        <DrawerTrigger className="mt-1.5">
          <MenuIcon className="w-8 h-8" />
        </DrawerTrigger>
        <DrawerContent className="flex flex-col justify-between w-full h-full max-w-[240px]">
          <DrawerHeader className="flex flex-col gap-12">
            <DrawerTitle className="text-3xl font-medium tracking-tighter">
              Kouza
            </DrawerTitle>
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <DrawerClose asChild key={item.title}>
                  <Link href={item.url} className="flex items-center gap-4">
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </DrawerClose>
              ))}
            </div>
          </DrawerHeader>
          <div className="flex flex-col gap-4">
            <div className="p-4">
              {!isSubscribed && (
                <div className="flex flex-col gap-4 bg-gray-100 border p-4 rounded-lg">
                  <h4 className="text-md tracking-tight text-center">
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
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  Username
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
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
