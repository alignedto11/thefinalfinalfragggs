"use client"

import { useEffect, useState } from "react"
import { MandalaCanvas } from "./mandala-canvas"
import type { MandalaState } from "@/lib/state"
import { demoState } from "@/lib/state"

interface MandalaProps {
  state?: MandalaState
  seed?: number
  size?: "sm" | "md" | "lg" | "full"
  className?: string
}

const sizeClasses = {
  sm: "w-32 h-32",
  md: "w-48 h-48",
  lg: "w-64 h-64",
  full: "w-full h-full",
}

import { RelationalGeometryLayer } from "./relational-geometry"
import { VectorCube } from "./vector-cube"
import { getDailyMandalaState } from "@/app/actions/mandala"

export function Mandala({ state: initialState = demoState, seed = 0.5, size = "md", className = "" }: MandalaProps) {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [state, setState] = useState<MandalaState>(initialState)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    // Fetch real astronomical state on mount
    getDailyMandalaState().then(realState => {
      setState(current => ({ ...current, ...realState }))
    }).catch(err => console.error("Mandala fetch error:", err))
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener("change", handler)

    return () => mediaQuery.removeEventListener("change", handler)
  }, [])

  const containerSizePx = size === "sm" ? 128 : size === "md" ? 192 : size === "lg" ? 256 : 512

  return (
    <div
      className={`relative overflow-visible cursor-pointer transition-all duration-500 rounded-full ${sizeClasses[size]} ${className}`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="relative w-full h-full rounded-full overflow-hidden">
        {/* Texture Layer - Concrete Grain */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Depth Shadow */}
        <div className="absolute inset-0 rounded-full shadow-[inset_0_0_40px_rgba(0,0,0,0.6)] pointer-events-none z-10" />

        <MandalaCanvas state={state} seed={seed} reducedMotion={reducedMotion} />
      </div>

      {/* Relational Geometry Overlay - visible on click/active */}
      {isExpanded && state.longitudes && (
        <RelationalGeometryLayer longitudes={state.longitudes} size={containerSizePx} className="z-20 scale-110" />
      )}

      {/* Vector Cube Overlay - positioned to the side/bottom when expanded */}
      {isExpanded && (
        <div className="absolute -right-8 bottom-0 z-30 transform translate-x-full">
          <VectorCube ratio={state.giftRatio ?? 0.5} size={80} />
        </div>
      )}

      {/* Expansion Indicator */}
      {!isExpanded && (
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-40 transition-opacity text-[8px] uppercase tracking-widest text-muted-foreground">
          View Geometry
        </div>
      )}
    </div>
  )
}
