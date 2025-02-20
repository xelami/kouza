import { Button } from "@kouza/ui/components/button"
import { signOut } from "next-auth/react"

export default function LogoutButton() {
  return (
    <Button
      variant="outline"
      onClick={() => signOut({ callbackUrl: "/login" })}
      size="sm"
    >
      <p>Logout</p>
    </Button>
  )
}
