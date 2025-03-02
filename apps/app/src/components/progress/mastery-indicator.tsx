import React from "react"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface MasteryIndicatorProps {
  masteryScore?: number | null | undefined
  retentionRate?: number | null | undefined
  showLabel?: boolean
  size?: "sm" | "md" | "lg"
}

export function MasteryIndicator({
  masteryScore,
  retentionRate,
  showLabel = true,
  size = "md",
}: MasteryIndicatorProps) {
  // Use masteryScore if available, otherwise fall back to retentionRate
  const score =
    masteryScore !== null && masteryScore !== undefined
      ? masteryScore
      : retentionRate

  if (score === null || score === undefined) {
    return (
      <div className="flex items-center text-gray-400">
        <Minus
          className={
            size === "sm"
              ? "h-3 w-3 mr-1"
              : size === "lg"
                ? "h-5 w-5 mr-2"
                : "h-4 w-4 mr-1"
          }
        />
        {showLabel && (
          <span
            className={`${size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm"}`}
          >
            No data
          </span>
        )}
      </div>
    )
  }

  // Determine mastery level
  const isStrength = score >= 70
  const isWeakness = score < 50
  const isMedium = score >= 50 && score < 70

  return (
    <div
      className={`flex items-center ${
        isStrength
          ? "text-green-500"
          : isWeakness
            ? "text-red-500"
            : "text-yellow-500"
      }`}
    >
      {isStrength ? (
        <TrendingUp
          className={
            size === "sm"
              ? "h-3 w-3 mr-1"
              : size === "lg"
                ? "h-5 w-5 mr-2"
                : "h-4 w-4 mr-1"
          }
        />
      ) : isWeakness ? (
        <TrendingDown
          className={
            size === "sm"
              ? "h-3 w-3 mr-1"
              : size === "lg"
                ? "h-5 w-5 mr-2"
                : "h-4 w-4 mr-1"
          }
        />
      ) : (
        <Minus
          className={
            size === "sm"
              ? "h-3 w-3 mr-1"
              : size === "lg"
                ? "h-5 w-5 mr-2"
                : "h-4 w-4 mr-1"
          }
        />
      )}

      {showLabel && (
        <span
          className={`font-medium ${size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm"}`}
        >
          {isStrength ? "Strong" : isWeakness ? "Needs Work" : "Moderate"}
        </span>
      )}
    </div>
  )
}
