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
    // First set to false to ensure the change is detected even if already true
    setShouldRefreshStats(false)

    // Use requestAnimationFrame for better timing with browser rendering cycle
    requestAnimationFrame(() => {
      setShouldRefreshStats(true)

      // Reset after a longer delay to ensure components have time to react
      setTimeout(() => {
        setShouldRefreshStats(false)
      }, 1000)
    })
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
