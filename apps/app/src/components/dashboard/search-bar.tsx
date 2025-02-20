"use client"

import { Input } from "@kouza/ui/components/input"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="hidden sm:block sm:w-72 md:w-96">
      <Input
        className="h-12 m:text-xl px-4 rounded-2xl"
        placeholder="Search courses, notes, flashcards..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        size={64}
      />
    </form>
  )
}
