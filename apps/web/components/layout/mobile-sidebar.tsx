"use client"

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@kouza/ui/components/drawer"
import { Menu, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@kouza/ui/components/button"
import Link from "next/link"
import { useState } from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@kouza/ui/components/collapsible"

interface SidebarStore {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export default function MobileSidebar() {
  const [featuresOpen, setFeaturesOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const closeDrawer = () => {
    setDrawerOpen(false)
  }

  const NavLink = ({
    href,
    className,
    children,
  }: {
    href: string
    className?: string
    children: React.ReactNode
  }) => (
    <Link href={href} className={className} onClick={closeDrawer}>
      {children}
    </Link>
  )

  return (
    <div className="lg:hidden">
      <Drawer direction="right" open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerTrigger asChild>
          <Menu className="h-8 w-8 cursor-pointer" />
        </DrawerTrigger>
        <DrawerContent className="w-[300px] flex flex-col h-full">
          <DrawerHeader className="border-b">
            <DrawerTitle className="text-2xl font-bold">Kouza</DrawerTitle>
          </DrawerHeader>

          <div className="flex flex-col flex-grow overflow-y-auto">
            <div className="flex flex-col p-4 space-y-2">
              <NavLink
                href="/"
                className="py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
              >
                Home
              </NavLink>

              <NavLink
                href="/help"
                className="py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
              >
                Help
              </NavLink>

              {/* Help Dropdown */}
              <Collapsible
                open={helpOpen}
                onOpenChange={setHelpOpen}
                className="w-full"
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors text-left">
                  <span>Help</span>
                  {helpOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-4 space-y-1 mt-1">
                  <NavLink
                    href="/help#getting-started"
                    className="block py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                  >
                    Getting Started
                  </NavLink>
                  <NavLink
                    href="/help#features"
                    className="block py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                  >
                    Features Guide
                  </NavLink>
                  <NavLink
                    href="/help#account"
                    className="block py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                  >
                    Account Management
                  </NavLink>
                  <NavLink
                    href="/help#troubleshooting"
                    className="block py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                  >
                    Troubleshooting
                  </NavLink>
                </CollapsibleContent>
              </Collapsible>

              <NavLink
                href="/feature-request"
                className="py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
              >
                Feature Request
              </NavLink>
            </div>
          </div>

          {/* Button fixed to bottom */}
          <div className="p-4 border-t mt-auto">
            <NavLink href="https://app.kouza-ai.com/login">
              <Button className="w-full">Get started for free</Button>
            </NavLink>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
