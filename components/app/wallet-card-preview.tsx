"use client"

import { Mandala } from "@/components/mandala/mandala"
import type { MandalaState } from "@/lib/state"

interface WalletCardPreviewProps {
  state: MandalaState
  date: string
  seed: number
}

// Get human-readable labels for state values
function getStateLabel(dimension: "pressure" | "clarity" | "velocity", value: number): string {
  const labels = {
    pressure: ["Settled", "Active", "Elevated", "Intensive"],
    clarity: ["Diffuse", "Mixed", "Clear", "Crystalline"],
    velocity: ["Slow", "Steady", "Rapid", "Accelerated"],
  }

  const index = value <= 0.25 ? 0 : value <= 0.5 ? 1 : value <= 0.75 ? 2 : 3
  return labels[dimension][index]
}

export function WalletCardPreview({ state, date, seed }: WalletCardPreviewProps) {
  return (
    <div className="mx-auto max-w-xs">
      {/* Wallet card simulation */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#fafafa] to-[#f0f0f0] shadow-xl">
        {/* Film grain overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.02]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative p-5">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-[#1a1a1a]" />
              <span className="text-sm font-medium tracking-tight text-[#1a1a1a]">DEFRAG</span>
            </div>
            <span className="text-xs text-[#666]">{date}</span>
          </div>

          {/* Mandala */}
          <div className="mb-4 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-2 rounded-full bg-gradient-to-b from-[#e0e0e0]/50 to-transparent blur-lg" />
              <Mandala state={state} size="md" seed={seed} className="relative" />
            </div>
          </div>

          {/* Title */}
          <div className="mb-4 text-center">
            <h2 className="text-lg font-medium text-[#1a1a1a]">Today's read</h2>
          </div>

          {/* State indicators */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-wider text-[#888]">Pressure</p>
              <p className="mt-0.5 text-xs font-medium text-[#1a1a1a]">{getStateLabel("pressure", state.pressure)}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-wider text-[#888]">Clarity</p>
              <p className="mt-0.5 text-xs font-medium text-[#1a1a1a]">{getStateLabel("clarity", state.clarity)}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-wider text-[#888]">Pace</p>
              <p className="mt-0.5 text-xs font-medium text-[#1a1a1a]">{getStateLabel("velocity", state.velocity)}</p>
            </div>
          </div>

          {/* Barcode area */}
          <div className="mt-5 flex justify-center">
            <div className="h-10 w-10 rounded-lg bg-[#1a1a1a] p-1.5">
              {/* QR code placeholder */}
              <div className="grid h-full w-full grid-cols-4 gap-px">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className={`rounded-[1px] ${Math.random() > 0.5 ? "bg-white" : "bg-transparent"}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Label */}
      <p className="mt-4 text-center text-xs text-muted-foreground">Preview of your Wallet card</p>
    </div>
  )
}
