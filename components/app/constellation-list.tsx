"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Mandala } from "@/components/mandala/mandala"
import { generateSeed } from "@/lib/state"

interface Constellation {
  id: string
  name: string
  relationship_type?: string
  constellation_states?: Array<{
    harmony: number
    tension: number
    distance: number
    label?: string
    date: string
  }>
}

interface ConstellationListProps {
  constellations: Constellation[]
}

export function ConstellationList({ constellations }: ConstellationListProps) {
  return (
    <div className="space-y-4">
      {constellations.map((constellation) => {
        // Get latest state or use defaults
        const latestState = constellation.constellation_states?.[0]

        // Convert constellation state to mandala state
        const mandalaState = latestState
          ? {
              pressure: latestState.tension,
              clarity: 1 - latestState.distance,
              velocity: 0.5,
              coherence: latestState.harmony,
            }
          : {
              pressure: 0.5,
              clarity: 0.5,
              velocity: 0.5,
              coherence: 0.5,
            }

        const seed = generateSeed(constellation.id)
        const label = latestState?.label || getDefaultLabel(mandalaState)

        return (
          <Card key={constellation.id} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {/* Mini mandala */}
                <div className="shrink-0">
                  <Mandala state={mandalaState} size="sm" seed={seed} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{constellation.name}</h3>
                  {constellation.relationship_type && (
                    <p className="text-xs text-muted-foreground capitalize">{constellation.relationship_type}</p>
                  )}
                  <p className="mt-1 text-sm text-muted-foreground">{label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

function getDefaultLabel(state: { pressure: number; clarity: number; coherence: number }): string {
  if (state.coherence > 0.7 && state.pressure < 0.4) {
    return "Harmonious conditions"
  }
  if (state.pressure > 0.6) {
    return "Some tension present"
  }
  if (state.clarity < 0.4) {
    return "Distance in the field"
  }
  return "Neutral conditions"
}
