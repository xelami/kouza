import React from "react"
import Link from "next/link"
import { SettingsIcon } from "lucide-react"
import { Button } from "@kouza/ui/components/button"
import AvatarDropdown from "../avatar-dropdown"

export default function Sidebar() {
  return (
    <aside className="flex flex-col justify-between items-center w-full h-screen pb-12 border-r border-gray-200">
      <div className="flex flex-col items-center">
        <div className="mt-6 mb-12">
          <Link className="text-2xl font-bold" href="/">
            Logo
          </Link>
        </div>
        <div className="flex flex-col items-center">
          <Link className="flex items-center gap-2" href="/courses">
            <Button variant="ghost" className="w-full">
              <h3>Courses</h3>
              <SettingsIcon className="w-6 h-6" />
            </Button>
          </Link>
        </div>
      </div>
      <AvatarDropdown />
    </aside>
  )
}
