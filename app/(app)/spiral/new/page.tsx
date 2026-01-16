"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Waves, Loader2 } from "lucide-react"
import Link from "next/link"

const eventTypes = [
  { value: "log_event", label: "Note", description: "A general observation or reflection" },
  { value: "insight", label: "Insight", description: "A moment of clarity or realization" },
  { value: "decision", label: "Decision", description: "A choice you made or are considering" },
  { value: "pattern", label: "Pattern", description: "Something recurring you noticed" },
]

export default function NewSpiralEntryPage() {
  const [content, setContent] = useState("")
  const [eventType, setEventType] = useState("log_event")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return

    setIsSubmitting(true)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/auth/login")
      return
    }

    const { error } = await supabase.from("spiral_events").insert({
      user_id: user.id,
      event_type: eventType,
      content: content.trim(),
      occurred_at: new Date().toISOString(),
    })

    if (!error) {
      router.push("/spiral")
      router.refresh()
    } else {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/spiral"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Spiral
        </Link>
        <div className="flex items-center gap-2">
          <Waves className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-xl font-medium">Log a moment</h1>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Record observations, insights, or decisions. Patterns surface over time.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Event Type Selection */}
          <div className="space-y-3">
            <Label>Type</Label>
            <div className="grid grid-cols-2 gap-2">
              {eventTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setEventType(type.value)}
                  className={`rounded-lg border p-3 text-left transition-colors ${
                    eventType === type.value
                      ? "border-foreground/30 bg-muted/50"
                      : "border-border/50 hover:border-border hover:bg-muted/30"
                  }`}
                >
                  <p className="font-medium text-sm">{type.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{type.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">What happened?</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Describe what you observed, felt, or decided..."
                className="min-h-[150px] resize-none"
                autoFocus
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Write for yourself. Be honest. No one else sees this.
              </p>
            </CardContent>
          </Card>

          {/* Submit */}
          <Button type="submit" className="w-full h-11" disabled={!content.trim() || isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save to Spiral"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
