"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

interface FlashcardsContextType {
  shouldRefreshStats: boolean
  triggerStatsRefresh: () => void
}

const FlashcardsContext = createContext<FlashcardsContextType | undefined>(
  undefined
)

export function useFlashcards() {
  const context = useContext(FlashcardsContext)
  if (context === undefined) {
    throw new Error("useFlashcards must be used within a FlashcardsProvider")
  }
  return context
}

interface FlashcardsProviderProps {
  children: ReactNode
}

export function FlashcardsProvider({ children }: FlashcardsProviderProps) {
  const [shouldRefreshStats, setShouldRefreshStats] = useState(false)

  const triggerStatsRefresh = () => {
    setShouldRefreshStats(true)
    // Reset after a short delay to allow components to react
    setTimeout(() => {
      setShouldRefreshStats(false)
    }, 500)
  }

  const value = {
    shouldRefreshStats,
    triggerStatsRefresh,
  }

  return (
    <FlashcardsContext.Provider value={value}>
      {children}
    </FlashcardsContext.Provider>
  )
}
