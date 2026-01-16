"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Users, Loader2 } from "lucide-react"
import Link from "next/link"

const relationshipTypes = [
  { value: "family", label: "Family" },
  { value: "partner", label: "Partner" },
  { value: "friend", label: "Friend" },
  { value: "colleague", label: "Colleague" },
  { value: "other", label: "Other" },
]

export default function NewConstellationPage() {
  const [name, setName] = useState("")
  const [relationship, setRelationship] = useState("family")
  const [notes, setNotes] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    setIsSubmitting(true)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/auth/login")
      return
    }

    const { error } = await supabase.from("constellations").insert({
      user_id: user.id,
      name: name.trim(),
      relationship,
      notes: notes.trim() || null,
      birth_date: birthDate || null,
      is_active: true,
    })

    if (!error) {
      router.push("/constellations")
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
          href="/constellations"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Connections
        </Link>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-xl font-medium">Add a connection</h1>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Map someone in your constellation. See relational weather, not blame.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Name */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Who is this person?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name or identifier</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="How you'll remember them"
                  className="h-11"
                  autoFocus
                />
                <p className="text-xs text-muted-foreground">Use any name that's meaningful to you.</p>
              </div>
            </CardContent>
          </Card>

          {/* Relationship Type */}
          <div className="space-y-3">
            <Label>Relationship</Label>
            <div className="flex flex-wrap gap-2">
              {relationshipTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setRelationship(type.value)}
                  className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                    relationship === type.value
                      ? "border-foreground/30 bg-muted/50"
                      : "border-border/50 hover:border-border hover:bg-muted/30"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Details */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Optional details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="birthDate">
                  Birth date <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="h-11"
                />
                <p className="text-xs text-muted-foreground">Enables relational timing context if known.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Anything you want to remember about this connection..."
                  className="min-h-[100px] resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <Button type="submit" className="w-full h-11" disabled={!name.trim() || isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add to constellation"
            )}
          </Button>

          {/* Privacy note */}
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-xs text-muted-foreground text-center">
              This information is private and never shared with anyone.
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}
