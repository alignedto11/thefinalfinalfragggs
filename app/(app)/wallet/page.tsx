import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { WalletCardPreview } from "@/components/app/wallet-card-preview"
import { Wallet, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { demoState } from "@/lib/state"

export default async function WalletPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user has Active tier
  const { data: profile } = await supabase.from("profiles").select("tier, seed").eq("id", user.id).single()

  const hasAccess = profile?.tier === "active"

  // Get latest state
  const { data: latestState } = await supabase
    .from("state_snapshots")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .limit(1)
    .single()

  const currentState = latestState
    ? {
        pressure: latestState.pressure,
        clarity: latestState.clarity,
        velocity: latestState.velocity,
        coherence: latestState.coherence,
      }
    : demoState

  // Format today's date
  const today = new Date()
  const dateString = today.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-xl font-medium">Wallet Card</h1>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">Your daily read, accessible from Apple Wallet.</p>
      </div>

      {hasAccess ? (
        <div className="space-y-6">
          {/* Card preview */}
          <WalletCardPreview state={currentState} date={dateString} seed={profile?.seed ?? 0.5} />

          {/* Add to wallet button */}
          <div className="rounded-lg border border-border bg-muted/30 p-4 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Apple Wallet integration requires server-side pass generation.
            </p>
            <p className="text-xs text-muted-foreground">Coming soon: Add your personalized Mandala card to Wallet.</p>
          </div>

          {/* Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">How it works</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                Card updates automatically with your daily state
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                Works offline with last known state
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                Quick glance at timing windows from lock screen
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-muted/30 p-6 text-center">
          <Wallet className="mx-auto h-12 w-12 text-muted-foreground/30" />
          <h3 className="mt-4 font-medium">Upgrade for Wallet Card</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Apple Wallet integration is available on the Active tier.
          </p>
          <Link href="/settings/billing" className="mt-4 inline-block text-sm underline underline-offset-4">
            View plans
          </Link>
        </div>
      )}
    </div>
  )
}
