"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, MessageCircle, Globe, X } from "lucide-react"
import { supportResources } from "@/lib/agent-policy"

interface SupportResourcesProps {
  onDismiss?: () => void
}

export function SupportResources({ onDismiss }: SupportResourcesProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  const handleDismiss = () => {
    setDismissed(true)
    onDismiss?.()
  }

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <p className="text-sm font-medium">Support resources</p>
          <button
            onClick={handleDismiss}
            className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {/* US Resource */}
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <p className="text-sm font-medium">{supportResources.US.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">{supportResources.US.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a href={`tel:${supportResources.US.phone}`}>
                <Button variant="outline" size="sm" className="h-8 gap-2 bg-transparent">
                  <Phone className="h-3.5 w-3.5" />
                  Call {supportResources.US.phone}
                </Button>
              </a>
              <a href={`sms:${supportResources.US.phone}`}>
                <Button variant="outline" size="sm" className="h-8 gap-2 bg-transparent">
                  <MessageCircle className="h-3.5 w-3.5" />
                  Text
                </Button>
              </a>
              <a href={supportResources.US.chat} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="h-8 gap-2 bg-transparent">
                  <Globe className="h-3.5 w-3.5" />
                  Chat
                </Button>
              </a>
            </div>
          </div>

          {/* Global Resource */}
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <p className="text-sm font-medium">{supportResources.global.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">{supportResources.global.description}</p>
            <div className="mt-3">
              <a href={supportResources.global.url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="h-8 gap-2 bg-transparent">
                  <Globe className="h-3.5 w-3.5" />
                  Find local support
                </Button>
              </a>
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">{supportResources.emergency.instruction}</p>
      </CardContent>
    </Card>
  )
}
