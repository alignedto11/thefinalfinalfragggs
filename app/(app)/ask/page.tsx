import { createClient } from "@/lib/supabase/server"
import { AskInterface } from "@/components/app/ask-interface"
import { MessageCircle } from "lucide-react"

export default async function AskPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get user's current state for context
  const { data: latestState } = await supabase
    .from("state_snapshots")
    .select("*")
    .eq("user_id", user?.id)
    .order("date", { ascending: false })
    .limit(1)
    .single()

  // Get user tier
  const { data: profile } = await supabase.from("profiles").select("tier").eq("id", user?.id).single()

  const hasAccess = profile?.tier === "guided" || profile?.tier === "active"

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-xl font-medium">Ask</h1>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">Structured questions, grounded answers.</p>
      </div>

      {hasAccess ? (
        <AskInterface
          state={
            latestState
              ? {
                  pressure: latestState.pressure,
                  clarity: latestState.clarity,
                  velocity: latestState.velocity,
                  coherence: latestState.coherence,
                }
              : undefined
          }
        />
      ) : (
        <div className="rounded-lg border border-border bg-muted/30 p-6 text-center">
          <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground/30" />
          <h3 className="mt-4 font-medium">Upgrade to ask</h3>
          <p className="mt-2 text-sm text-muted-foreground">The Ask surface is available on Guided and Active tiers.</p>
          <a href="/settings/billing" className="mt-4 inline-block text-sm underline underline-offset-4">
            View plans
          </a>
        </div>
      )}
    </div>
  )
}
