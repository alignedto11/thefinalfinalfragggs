import { createClient } from "@/lib/supabase/server"
import { Mandala } from "@/components/mandala/mandala"
import { NatalMandala } from "@/components/mandala/natal-mandala"
import { StateCard } from "@/components/app/state-card"
import { WindowCard } from "@/components/app/window-card"
import { BriefCard } from "@/components/app/brief-card"
import { VoiceBriefing } from "@/components/app/voice-briefing"
import { ContextNavigator } from "@/components/app/context-navigator"
import { CollectiveFloor } from "@/components/app/collective-floor"
import { SpiralTime } from "@/components/app/spiral-time"
import { demoState } from "@/lib/state"
import { getWisdomForState } from "@/lib/wisdom"
import { calculatePlanetaryPositions } from "@/lib/engine/astronomy"

export default async function DashboardPage() {
  const supabase = await createClient()
  if (!supabase) return <div>Auth required</div>

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("profiles")
    .select("seed, tier, birth_date, birth_lat, birth_lng")
    .eq("id", user?.id)
    .single()

  // Get current planetary positions
  const now = new Date()
  const positions = calculatePlanetaryPositions(now)

  // For the brief, let's focus on the Sun's current gate
  const sunPosition = positions.find(p => p.name === "Sun")

  const { data: sunGate } = await supabase
    .from("gates")
    .select("*")
    .eq("id", sunPosition?.gate || 1)
    .single()

  // Get latest state snapshot
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

  const today = new Date()
  const dateString = today.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })

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

  const hasVoice = profile?.tier === "guided" || profile?.tier === "active"

  let brief = generateBrief(currentState, sunGate)
  let voiceScript = brief

  if (hasVoice) {
    try {
      const { generateInsightBrief, generateVoiceScript } = await import("@/lib/ai")
      brief = await generateInsightBrief({
        state: currentState,
        positions,
        sunGate
      })
      voiceScript = await generateVoiceScript(brief)
    } catch (e) {
      console.warn("AI Brief failed, falling back to static", e)
    }
  }

  const wisdom = getWisdomForState(currentState)

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* Header */}
      <div className="mb-8 text-center text-balance px-4">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground/50 mb-4">{dateString}</p>
        <h1 className="mt-1 text-2xl font-light tracking-tight">Today's Read</h1>
        <p className="mt-4 text-sm italic text-muted-foreground/80 leading-relaxed font-serif">"{wisdom.text}"</p>
      </div>

      {/* Mandala Comparison */}
      <div className="mb-16 flex flex-col items-center justify-center">
        {/* Daily Reactive Mandala */}
        <div className="relative group mb-12">
          <p className="absolute -top-10 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40 whitespace-nowrap">Observing Now</p>
          <div className="absolute -inset-20 rounded-full bg-cyan-500/5 blur-[80px] transition-opacity group-hover:opacity-100 opacity-60 z-0" />
          <Mandala state={currentState} size="lg" seed={seed} className="relative z-10 scale-110" />
        </div>

        {/* Natal Baseline Mandala */}
        <div className="relative group opacity-40 hover:opacity-100 transition-all duration-1000 mt-4">
          <p className="absolute -top-10 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/20 whitespace-nowrap">Home Frequency</p>
          <NatalMandala birthData={birthData} size="sm" className="relative z-10 grayscale hover:grayscale-0 transition-all duration-1000 border border-white/5 opacity-80" />
        </div>
      </div>

      {/* State display */}
      <div className="mb-6">
        <StateCard state={currentState} />
      </div>

      {/* Brief with optional voice */}
      <div className="mb-6">
        <BriefCard title="Insight brief" brief={brief} />
        {hasVoice && (
          <div className="mt-3">
            <VoiceBriefing brief={brief} script={voiceScript} />
          </div>
        )}
      </div>

      {/* Archetype Card */}
      {sunGate && (
        <div className="mb-6 rounded-xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Active Archetype</h3>
            <span className="text-xs font-mono text-cyan-400">Gate {sunGate.id}</span>
          </div>
          <h4 className="text-lg font-medium mb-1">{sunGate.name}</h4>
          <div className="flex gap-2 text-[10px] uppercase tracking-tighter mb-4">
            <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">{sunGate.shadow}</span>
            <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">{sunGate.gift}</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{sunGate.description || "The Sun is currently activating this field of resonance, coloring the collective frequency."}</p>
        </div>
      )}

      {/* Windows */}
      {windows.length > 0 && (
        <div className="mb-12">
          <WindowCard windows={windows} />
        </div>
      )}

      {/* Spiral Timeline */}
      <div className="mb-12">
        <div className="mb-4 px-2">
          <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground/60">Spiral Timeline</h2>
        </div>
        <SpiralTime />
      </div>

      {/* Collective Live State */}
      <div className="mb-12">
        <div className="mb-4 px-2">
          <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground/60">Live Collective</h2>
        </div>
        <CollectiveFloor userState={currentState} />
      </div>

      {/* Tier indicator */}
      {profile?.tier === "passive" && (
        <div className="mt-8 mb-12 rounded-lg border border-white/5 bg-white/[0.02] p-6 text-center">
          <p className="text-sm text-muted-foreground leading-relaxed">
            You're on the Passive tier.{" "}
            <a href="/settings/billing" className="text-cyan-400 font-medium hover:underline underline-offset-4">
              Upgrade
            </a>{" "}
            for voice guidance and actionable archetypes.
          </p>
        </div>
      )}

      <div className="h-20" />
      <ContextNavigator state={currentState} currentPage="dashboard" />
    </div>
  )
}

function generateBrief(state: { pressure: number; clarity: number; velocity: number; coherence: number }, sunGate?: any): string {
  const pressureLevel = state.pressure > 0.65 ? "elevated" : state.pressure > 0.35 ? "moderate" : "low"
  const clarityLevel = state.clarity > 0.65 ? "good" : state.clarity > 0.35 ? "mixed" : "diffuse"

  let baseBrief = ""

  if (pressureLevel === "elevated" && clarityLevel === "diffuse") {
    baseBrief = "Today's pattern shows heightened pressure with diffuse clarity. This combination often benefits from pause rather than push."
  } else if (clarityLevel === "good") {
    baseBrief = "Conditions today favor focused work. Clarity is present and the pace is sustainable."
  } else {
    baseBrief = `The current field shows ${pressureLevel} pressure and ${clarityLevel} clarity.`
  }

  if (sunGate) {
    baseBrief += ` With the Sun in ${sunGate.name} (Gate ${sunGate.id}), there is an invitation to move from ${sunGate.shadow.toLowerCase()} toward ${sunGate.gift.toLowerCase()}.`
  }

  return baseBrief
}
