"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createCustomerPortalSession } from "@/app/actions/stripe"
import { ExternalLink } from "lucide-react"

export function ManageSubscriptionButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleManage = async () => {
    setIsLoading(true)
    try {
      const url = await createCustomerPortalSession()
      window.location.href = url
    } catch (error) {
      console.error("Failed to create portal session:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant="outline" className="w-full gap-2 bg-transparent" onClick={handleManage} disabled={isLoading}>
      {isLoading ? "Loading..." : "Manage subscription"}
      <ExternalLink className="h-4 w-4" />
    </Button>
  )
}
