"use client"

import React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@kouza/ui/components/dropdown-menu"
import { useChangeLocale, useCurrentLocale } from "@/locales/client"
import { languages } from "@/locales/client"
import { Globe } from "lucide-react"

export default function LocaleDropdown() {
  const changeLocale = useChangeLocale()
  const currentLocale = useCurrentLocale()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Globe className="h-8 w-8" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mb-2">
        <DropdownMenuGroup>
          {Object.entries(languages).map(([locale, label]) => (
            <DropdownMenuItem
              key={locale}
              className={`px-3 py-1 rounded ${
                currentLocale === locale
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
              onClick={() => changeLocale(locale)}
              disabled={currentLocale === locale}
            >
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
