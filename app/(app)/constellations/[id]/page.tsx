import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mandala } from "@/components/mandala/mandala"
import { BowenChart } from "@/components/app/bowen-chart"
import { VectorEquilibrium } from "@/components/app/vector-equilibrium"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { DeleteConstellationButton } from "./delete-button"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ConstellationDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get constellation
  const { data: constellation } = await supabase
    .from("constellations")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (!constellation) {
    notFound()
  }

  // Get latest state for this person
  const { data: latestState } = await supabase
    .from("constellation_states")
    .select("*")
    .eq("constellation_id", id)
    .order("computed_at", { ascending: false })
    .limit(1)
    .single()

  const state = latestState
    ? {
        pressure: latestState.pressure,
        clarity: latestState.clarity,
        velocity: latestState.velocity,
        coherence: latestState.coherence,
      }
    : { pressure: 0.5, clarity: 0.5, velocity: 0.5, coherence: 0.5 }

  // Generate seed from constellation ID
  let seed = 0.5
  for (let i = 0; i < id.length; i++) {
    const char = id.charCodeAt(i)
    seed = (seed * 31 + char) % 1
  }

  // Create Bowen chart data (example structure)
  const bowenNodes = [
    { id: "user", name: "You", x: 0.5, y: 0.3 },
    { id: constellation.id, name: constellation.name, x: 0.5, y: 0.7 },
  ]

  const bowenEdges = [
    {
      from: "user",
      to: constellation.id,
      distance: state.pressure, // Higher pressure = more distance/reactivity
    },
  ]

  // Determine equilibrium state
  const equilibriumState: "balanced" | "distorted" | "returning" =
    state.pressure > 0.65 ? "distorted" : state.coherence < 0.4 ? "returning" : "balanced"

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4 gap-2 bg-transparent">
          <Link href="/constellations">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-medium">{constellation.name}</h1>
        {constellation.relationship && (
          <p className="mt-1 text-sm text-muted-foreground">{constellation.relationship}</p>
        )}
      </div>

      {/* Mandala */}
      <div className="mb-6 flex justify-center">
        <div className="relative">
          <div className="absolute -inset-4 rounded-full bg-gradient-to-b from-muted/30 to-transparent blur-xl" />
          <Mandala state={state} size="md" seed={seed} className="relative" />
        </div>
      </div>

      {/* State summary */}
      <Card className="mb-6 border-border">
        <CardHeader>
          <CardTitle className="text-base">Current pattern</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Pressure</p>
              <p className="mt-1 text-sm font-medium">{(state.pressure * 100).toFixed(0)}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Clarity</p>
              <p className="mt-1 text-sm font-medium">{(state.clarity * 100).toFixed(0)}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Velocity</p>
              <p className="mt-1 text-sm font-medium">{(state.velocity * 100).toFixed(0)}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Coherence</p>
              <p className="mt-1 text-sm font-medium">{(state.coherence * 100).toFixed(0)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bowen-style relational chart */}
      <div className="mb-6">
        <BowenChart nodes={bowenNodes} edges={bowenEdges} userNodeId="user" />
      </div>

      {/* Vector Equilibrium */}
      <div className="mb-6">
        <VectorEquilibrium state={equilibriumState} pressure={state.pressure} clarity={state.clarity} />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" asChild className="flex-1 bg-transparent">
          <Link href={`/constellations/${id}/edit`}>Edit details</Link>
        </Button>
        <DeleteConstellationButton constellationId={id} name={constellation.name} />
      </div>
    </div>
  )
}
