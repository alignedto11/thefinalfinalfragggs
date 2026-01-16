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

import { getDailyMandalaState } from "@/app/actions/mandala"

export function Mandala({ state: initialState = demoState, seed = 0.5, size = "md", className = "" }: MandalaProps) {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [state, setState] = useState<MandalaState>(initialState)

  useEffect(() => {
    // Fetch real astronomical state on mount
    getDailyMandalaState().then(realState => {
      setState(realState)
    }).catch(err => console.error("Mandala fetch error:", err))
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener("change", handler)

    return () => mediaQuery.removeEventListener("change", handler)
  }, [])

  return (
    <div className={`relative overflow-hidden rounded-full ${sizeClasses[size]} ${className}`}>
      <MandalaCanvas state={state} seed={seed} reducedMotion={reducedMotion} />
    </div>
  )
}
