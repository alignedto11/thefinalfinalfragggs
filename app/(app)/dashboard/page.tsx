import { createClient } from "@/lib/supabase/server"
import { Mandala } from "@/components/mandala/mandala"
import { NatalMandala } from "@/components/mandala/natal-mandala"
import { StateCard } from "@/components/app/state-card"
import { WindowCard } from "@/components/app/window-card"
import { BriefCard } from "@/components/app/brief-card"
import { VoiceBriefing } from "@/components/app/voice-briefing"
import { ContextNavigator } from "@/components/app/context-navigator"
import { demoState } from "@/lib/state"
import { getWisdomForState } from "@/lib/wisdom"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("profiles")
    .select("seed, tier, birth_date, birth_lat, birth_lng")
    .eq("id", user?.id)
    .single()

  // Get latest state snapshot (or use demo state if none exists)
  const { data: latestState } = await supabase
    .from("state_snapshots")
    .select("*")
    .eq("user_id", user?.id)
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

  const seed = profile?.seed ?? 0.5

  const birthData = profile?.birth_date ? {
    birthDate: profile.birth_date.split('T')[0],
    birthLocation: {
      lat: profile.birth_lat || 0,
      lon: profile.birth_lng || 0,
      tz: 'UTC'
    }
  } : undefined

  // Format today's date
  const today = new Date()
  const dateString = today.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })

  // Get timing windows for today
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayEnd = new Date()
  todayEnd.setHours(23, 59, 59, 999)

  const { data: timingWindows } = await supabase
    .from("timing_windows")
    .select("*")
    .eq("user_id", user?.id)
    .gte("starts_at", todayStart.toISOString())
    .lte("ends_at", todayEnd.toISOString())
    .order("starts_at", { ascending: true })
    .limit(3)

  const windows =
    timingWindows?.map((w) => ({
      label: w.label || (w.window_type === "favorable" ? "Best window" : "Secondary"),
      time: `${new Date(w.starts_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} - ${new Date(w.ends_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`,
      description: w.window_type === "favorable" ? "Clarity peaks, pressure eases" : "Good for reflection",
    })) || []

  // Generate brief based on state
  const brief = generateBrief(currentState)

  const wisdom = getWisdomForState(currentState)

  // Check if user has Guided or Active tier for voice briefing
  const hasVoice = profile?.tier === "guided" || profile?.tier === "active"

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <p className="text-sm text-muted-foreground">{dateString}</p>
        <h1 className="mt-1 text-xl font-medium">Today's read</h1>
        <p className="mt-2 text-sm italic text-muted-foreground/80">{wisdom.text}</p>
      </div>

      {/* Mandala Comparison */}
      <div className="mb-16 flex flex-col items-center justify-center">
        {/* Daily Reactive Mandala */}
        <div className="relative group mb-12">
          <p className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 whitespace-nowrap">Current Resonance</p>
          <div className="absolute -inset-12 rounded-full bg-cyan-500/10 blur-3xl transition-opacity group-hover:opacity-100 opacity-60 z-0" />
          <Mandala state={currentState} size="lg" seed={seed} className="relative z-10 border border-white/5 shadow-2xl scale-110" />
        </div>

        {/* Natal Baseline Mandala - Smaller, labeled "Home" */}
        <div className="relative group opacity-60 hover:opacity-100 transition-all duration-700 mt-4">
          <p className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40 whitespace-nowrap">Home Frequency</p>
          <div className="absolute -inset-6 rounded-full bg-blue-500/5 blur-2xl group-hover:opacity-50 opacity-0 z-0" />
          <NatalMandala birthData={birthData} size="sm" className="relative z-10 grayscale-[0.8] hover:grayscale-0 transition-all duration-1000 border border-white/5 opacity-80" />
        </div>
      </div>

      {/* State display */}
      <div className="mb-6">
        <StateCard state={currentState} />
      </div>

      {/* Brief with optional voice */}
      <div className="mb-6">
        <BriefCard title="Today's brief" brief={brief} />
        {hasVoice && (
          <div className="mt-3">
            <VoiceBriefing brief={brief} />
          </div>
        )}
      </div>

      {/* Windows */}
      {windows.length > 0 && (
        <div className="mb-6">
          <WindowCard windows={windows} />
        </div>
      )}

      {/* Tier indicator */}
      {profile?.tier === "passive" && (
        <div className="mt-8 rounded-lg border border-border bg-muted/30 p-4 text-center">
          <p className="text-sm text-muted-foreground">
            You're on the Passive tier.{" "}
            <a href="/settings/billing" className="text-foreground underline underline-offset-2">
              Upgrade
            </a>{" "}
            for voice guidance and action proposals.
          </p>
        </div>
      )}

      <ContextNavigator state={currentState} currentPage="dashboard" />
    </div>
  )
}

// Helper function to generate brief from state
function generateBrief(state: { pressure: number; clarity: number; velocity: number; coherence: number }): string {
  const pressureLevel = state.pressure > 0.65 ? "elevated" : state.pressure > 0.35 ? "moderate" : "low"
  const clarityLevel = state.clarity > 0.65 ? "good" : state.clarity > 0.35 ? "mixed" : "diffuse"
  const velocityLevel = state.velocity > 0.65 ? "rapid" : state.velocity > 0.35 ? "steady" : "slow"

  if (pressureLevel === "elevated" && clarityLevel === "diffuse") {
    return "Today's pattern shows heightened pressure with diffuse clarity. This combination often benefits from pause rather than push. Consider spacing decisions and protecting time for consolidation."
  }

  if (clarityLevel === "good" && velocityLevel === "steady") {
    return "Conditions today favor focused work. Clarity is present and pace is sustainable. Good alignment for decisions and forward movement, particularly in early afternoon hours."
  }

  if (pressureLevel === "low" && velocityLevel === "slow") {
    return "A quieter day pattern-wise. Low pressure and slow pace suggest space for open-ended reflection rather than decisive action. Let things settle naturally."
  }

  return `Today's pattern shows ${pressureLevel} pressure with ${clarityLevel} clarity. Pace is ${velocityLevel}. ${state.coherence > 0.5 ? "Internal alignment supports action when conditions feel right." : "Some diffusion present—consider which threads deserve attention."}`
}
