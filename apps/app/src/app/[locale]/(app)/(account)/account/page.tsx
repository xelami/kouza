"use client"

import { Button } from "@kouza/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@kouza/ui/components/dialog"
import { useState } from "react"
import { deleteUser } from "@/app/api/user/delete-user"
import { toast } from "sonner"
import { signOut } from "next-auth/react"

export default function AccountPage() {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDialog, setShowDialog] = useState(false)

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true)
      const result = await deleteUser()

      if (result.success) {
        signOut({ redirectTo: "/login" })
      }
    } catch (error) {
      console.error("Error deleting account:", error)
      toast.error("Failed to delete account")
    } finally {
      setIsDeleting(false)
      setShowDialog(false)
    }
  }

  return (
    <div className="flex flex-col font-[family-name:var(--font-geist-sans)] h-full p-6 px-4 max-w-7xl w-full mx-auto">
      <h3 className="text-4xl font-semibold tracking-tighter mb-8">
        Account Settings
      </h3>

      <div className="flex flex-col gap-8">
        <section className="space-y-4">
          <h4 className="text-2xl font-semibold tracking-tighter text-destructive">
            Danger Zone
          </h4>
          <div className="p-4 border border-destructive/50 rounded-lg">
            <h5 className="font-medium mb-2">Delete Account</h5>
            <p className="text-sm text-muted-foreground mb-4">
              This will permanently delete your account and all associated data.
              This action cannot be undone.
            </p>
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogTrigger asChild>
                <Button variant="destructive">Delete Account</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove all associated data from our
                    servers.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Yes, delete my account"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </section>
      </div>
    </div>
  )
}
