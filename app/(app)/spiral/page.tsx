import { createClient } from "@/lib/supabase/server"
import { SpiralTimeline } from "@/components/app/spiral-timeline"
import { SpiralLogButton } from "@/components/app/spiral-log-button"
import { Waves } from "lucide-react"

export default async function SpiralPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get spiral events for the last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: events } = await supabase
    .from("spiral_events")
    .select("*")
    .eq("user_id", user?.id)
    .gte("occurred_at", thirtyDaysAgo.toISOString())
    .order("occurred_at", { ascending: false })
    .limit(50)

  // Get pattern insights (simplified - would come from AI in production)
  const insights = generateInsights(events || [])

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <Waves className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-xl font-medium">Spiral</h1>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">Your event memory. Patterns surface over time.</p>
      </div>

      {/* Quick log button */}
      <div className="mb-6">
        <SpiralLogButton userId={user?.id || ""} />
      </div>

      {/* Insights summary */}
      {insights.length > 0 && (
        <div className="mb-6 rounded-lg border border-border bg-muted/30 p-4">
          <h3 className="text-sm font-medium mb-2">Recent patterns</h3>
          <ul className="space-y-1">
            {insights.map((insight, i) => (
              <li key={i} className="text-sm text-muted-foreground">
                {insight}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Timeline */}
      <SpiralTimeline events={events || []} />

      {/* Empty state */}
      {(!events || events.length === 0) && (
        <div className="text-center py-12">
          <Waves className="mx-auto h-12 w-12 text-muted-foreground/30" />
          <h3 className="mt-4 text-sm font-medium">No events yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">Start logging moments and they'll appear here.</p>
        </div>
      )}
    </div>
  )
}

// Simplified pattern detection
function generateInsights(events: Array<{ event_type: string; action_type?: string; occurred_at: string }>): string[] {
  const insights: string[] = []

  if (events.length === 0) return insights

  // Count event types
  const typeCounts: Record<string, number> = {}
  events.forEach((e) => {
    typeCounts[e.event_type] = (typeCounts[e.event_type] || 0) + 1
  })

  if (typeCounts.accepted > 3) {
    insights.push(`You've accepted ${typeCounts.accepted} proposals recently`)
  }

  if (typeCounts.log_event > 5) {
    insights.push(`${typeCounts.log_event} moments logged this month`)
  }

  // Time pattern detection
  const morningEvents = events.filter((e) => {
    const hour = new Date(e.occurred_at).getHours()
    return hour >= 6 && hour < 12
  })

  if (morningEvents.length > events.length * 0.5) {
    insights.push("Most activity happens in morning hours")
  }

  return insights.slice(0, 3)
}
