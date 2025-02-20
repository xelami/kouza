"use client"

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@kouza/ui/components/drawer"
import { Menu } from "lucide-react"
import { Button } from "@kouza/ui/components/button"
import Link from "next/link"
import { links } from "config/nav"

interface SidebarStore {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export default function MobileSidebar() {
  return (
    <div className="lg:hidden">
      <Drawer direction="right">
        <DrawerTrigger asChild>
          <Menu className="h-8 w-8 cursor-pointer" />
        </DrawerTrigger>
        <DrawerContent className="w-[300px]">
          <DrawerHeader className="border-b">
            <DrawerTitle className="text-2xl font-bold">Kouza</DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto">
            <div className="p-4 space-y-4">
              <div className="pt-4">
                <Link href="https://app.kouza-ai.com/login">
                  <Button className="w-full">Get started for free</Button>
                </Link>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
