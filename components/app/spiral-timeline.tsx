"use client"

import { formatDistanceToNow } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Check, X, Clock, PenLine, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface SpiralEvent {
  id: string
  event_type: string
  action_type?: string
  title?: string
  body?: string
  occurred_at: string
}

interface SpiralTimelineProps {
  events: SpiralEvent[]
}

const eventIcons: Record<string, typeof Check> = {
  accepted: Check,
  declined: X,
  scheduled: Clock,
  log_event: PenLine,
  insight: Sparkles,
  offered: Sparkles,
}

const eventLabels: Record<string, string> = {
  accepted: "Accepted",
  declined: "Declined",
  scheduled: "Scheduled",
  log_event: "Logged",
  insight: "Insight",
  offered: "Offered",
}

export function SpiralTimeline({ events }: SpiralTimelineProps) {
  // Group events by date
  const groupedEvents = events.reduce<Record<string, SpiralEvent[]>>((acc, event) => {
    const date = new Date(event.occurred_at).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
    if (!acc[date]) acc[date] = []
    acc[date].push(event)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {Object.entries(groupedEvents).map(([date, dateEvents]) => (
        <div key={date}>
          <div className="mb-3 flex items-center gap-2">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">{date}</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="space-y-3">
            {dateEvents.map((event) => {
              const Icon = eventIcons[event.event_type] || PenLine

              return (
                <Card key={event.id} className="border-border/50">
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                          event.event_type === "accepted" && "bg-foreground/10",
                          event.event_type === "declined" && "bg-muted",
                          event.event_type === "log_event" && "bg-muted",
                        )}
                      >
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="text-sm font-medium truncate">
                            {event.title || eventLabels[event.event_type]}
                          </span>
                          <span className="text-xs text-muted-foreground shrink-0">
                            {formatDistanceToNow(new Date(event.occurred_at), { addSuffix: true })}
                          </span>
                        </div>
                        {event.body && <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{event.body}</p>}
                        {event.action_type && (
                          <span className="mt-1 inline-block text-xs text-muted-foreground capitalize">
                            {event.action_type.replace(/_/g, " ")}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
