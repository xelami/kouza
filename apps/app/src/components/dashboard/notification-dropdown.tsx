"use client"

import React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@kouza/ui/components/dropdown-menu"
import { BellIcon } from "lucide-react"

export default function NotificationDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <BellIcon className="w-8 h-8" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96 mb-2 mr-16 mt-3">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <p>Test!!</p>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
