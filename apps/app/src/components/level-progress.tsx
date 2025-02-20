"use client"

import React from "react"

interface LevelProgressProps {
  level: number
  points: number
}

function calculateProgress(points: number): number {
  let threshold = 100
  let currentLevelThreshold = 100

  while (points >= threshold) {
    currentLevelThreshold = threshold
    threshold *= 2
  }

  const progressPoints = points - currentLevelThreshold
  const pointsNeeded = threshold - currentLevelThreshold
  return Math.floor((progressPoints / pointsNeeded) * 100)
}

export default function LevelProgress({ level, points }: LevelProgressProps) {
  const progress = calculateProgress(points)
  const nextLevelPoints = Math.pow(2, level - 1) * 100

  return (
    <div className="relative flex items-center justify-center w-52 h-52">
      <div className="absolute inset-0">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            className="text-gray-200 stroke-current"
            strokeWidth="8"
            fill="transparent"
            r="42"
            cx="50"
            cy="50"
          />
          <circle
            className="text-primary stroke-current"
            strokeWidth="8"
            strokeLinecap="round"
            fill="transparent"
            r="42"
            cx="50"
            cy="50"
            style={{
              strokeDasharray: `${2 * Math.PI * 42}`,
              strokeDashoffset: `${2 * Math.PI * 42 * (1 - progress / 100)}`,
              transform: "rotate(-90deg)",
              transformOrigin: "50% 50%",
            }}
          />
        </svg>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-7xl font-bold mb-2">{level}</span>
        <div className="text-base text-muted-foreground">
          {points}/{nextLevelPoints} XP
        </div>
      </div>
    </div>
  )
}
