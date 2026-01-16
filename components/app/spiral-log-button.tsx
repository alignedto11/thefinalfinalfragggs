"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface SpiralLogButtonProps {
  userId: string
}

export function SpiralLogButton({ userId }: SpiralLogButtonProps) {
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
    if (!note.trim() || !userId) return

    setIsLoading(true)
    const supabase = createClient()

    try {
      await supabase.from("spiral_events").insert({
        user_id: userId,
        event_type: "log_event",
        title: note.slice(0, 50) + (note.length > 50 ? "..." : ""),
        body: note,
        occurred_at: new Date().toISOString(),
      })

      setNote("")
      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Failed to log event:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full h-11 gap-2">
          <Plus className="h-4 w-4" />
          Log a moment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Log a moment</DialogTitle>
          <DialogDescription>Capture a thought, feeling, or observation. Patterns emerge over time.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="What's present right now?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!note.trim() || isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
