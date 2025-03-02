import React from "react"

interface RetentionProgressProps {
  retentionRate: number | null | undefined
  showPercentage?: boolean
  size?: "sm" | "md" | "lg"
}

export function RetentionProgress({
  retentionRate,
  showPercentage = true,
  size = "md",
}: RetentionProgressProps) {
  const rate = retentionRate || 0

  // Determine color based on retention rate
  const getBarColor = () => {
    if (rate >= 70) return "bg-green-500"
    if (rate >= 50) return "bg-yellow-500"
    return "bg-red-500"
  }

  // Determine height based on size
  const getHeight = () => {
    if (size === "sm") return "h-1.5"
    if (size === "lg") return "h-3.5"
    return "h-2.5"
  }

  return (
    <div className="w-full">
      <div className="flex items-center">
        <div className={`w-full bg-gray-200 rounded-full ${getHeight()} mr-2`}>
          <div
            className={`${getHeight()} rounded-full ${getBarColor()}`}
            style={{ width: `${rate}%` }}
          ></div>
        </div>

        {showPercentage && (
          <span
            className={`font-medium ${
              size === "sm"
                ? "text-xs"
                : size === "lg"
                  ? "text-base"
                  : "text-sm"
            }`}
          >
            {rate}%
          </span>
        )}
      </div>
    </div>
  )
}
