"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  return (
    <span onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      {theme === "dark" ? (
        <Sun className="h-8 w-8" />
      ) : (
        <Moon className="h-8 w-8" />
      )}
    </span>
  )
}
