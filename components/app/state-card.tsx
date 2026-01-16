import { Card, CardContent } from "@/components/ui/card"
import type { MandalaState } from "@/lib/state"
import { surface } from "@/lib/copy"

interface StateCardProps {
  state: MandalaState
}

function getLabel(dimension: keyof typeof surface, value: number): string {
  const levels = surface[dimension] as Record<string, string>
  const keys = Object.keys(levels)

  if (value <= 0.25) return levels[keys[0]]
  if (value <= 0.5) return levels[keys[1]]
  if (value <= 0.75) return levels[keys[2]]
  return levels[keys[3]]
}

export function StateCard({ state }: StateCardProps) {
  const dimensions = [
    { key: "pressure" as const, label: "Pressure", value: state.pressure },
    { key: "clarity" as const, label: "Clarity", value: state.clarity },
    { key: "velocity" as const, label: "Pace", value: state.velocity },
    { key: "coherence" as const, label: "Coherence", value: state.coherence },
  ]

  return (
    <Card className="border-border/50">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {dimensions.map((dim) => (
            <div key={dim.key} className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">{dim.label}</span>
              <span className="text-sm font-medium">{getLabel(dim.key, dim.value)}</span>
              {/* Visual bar */}
              <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-foreground/40 transition-all duration-500"
                  style={{ width: `${dim.value * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
