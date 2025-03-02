"use client"

import { useState } from "react"
import { Button } from "@kouza/ui/components/button"
import { RefreshCcw } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface UpdateGoalsButtonProps {
  userId: number
}

export function UpdateGoalsButton({ userId }: UpdateGoalsButtonProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  const handleUpdate = async () => {
    setIsUpdating(true)

    try {
      const response = await fetch("/api/learning-goal/update-progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}), // No specific goal ID, update all
      })

      if (!response.ok) {
        throw new Error("Failed to update learning goals")
      }

      const data = await response.json()

      if (data.success) {
        toast.success(`Updated ${data.updated} learning goals`)
        router.refresh() // Refresh the page to show updated progress
      } else {
        toast.error("Failed to update learning goals")
      }
    } catch (error) {
      console.error("Error updating learning goals:", error)
      toast.error("Failed to update learning goals")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Button
      variant="outline"
      onClick={handleUpdate}
      disabled={isUpdating}
      title="Refresh progress for all objectives"
    >
      <RefreshCcw
        className={`h-4 w-4 mr-2 ${isUpdating ? "animate-spin" : ""}`}
      />
      {isUpdating ? "Updating..." : "Update Progress"}
    </Button>
  )
}
