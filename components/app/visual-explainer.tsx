"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Info } from "lucide-react"
import type { MandalaState } from "@/lib/state"

interface VisualExplainerProps {
  state: MandalaState
  target: "pressure" | "clarity" | "velocity" | "coherence"
}

const explanations = {
  pressure: {
    title: "Pressure",
    low: "Conditions feel spacious. Room for exploration without urgency.",
    moderate: "Moderate activation present. Neither pushing nor pulling strongly.",
    high: "Elevated intensity in the pattern. May benefit from spacing decisions.",
  },
  clarity: {
    title: "Clarity",
    low: "Signal is diffuse. Information-gathering may help more than commitment.",
    moderate: "Mixed visibility. Some things are clear, others less so.",
    high: "Pattern is readable. Good conditions for discernment.",
  },
  velocity: {
    title: "Pace",
    low: "Slow movement in the pattern. Things are settling or preparing.",
    moderate: "Steady pace. Neither rushing nor stalling.",
    high: "Rapid shifts underway. Change is active.",
  },
  coherence: {
    title: "Coherence",
    low: "Parts are scattered. Integration may take time.",
    moderate: "Partial alignment. Some threads connecting.",
    high: "Internal alignment is strong. Parts are working together.",
  },
}

export function VisualExplainer({ state, target }: VisualExplainerProps) {
  const [isVisible, setIsVisible] = useState(false)

  const value = state[target]
  const level = value > 0.65 ? "high" : value > 0.35 ? "moderate" : "low"
  const explanation = explanations[target][level]

  return (
    <div className="relative inline-flex items-center">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label={`Explain ${target}`}
      >
        <Info className="h-3.5 w-3.5" />
      </button>

      <AnimatePresence>
        {isVisible && (
          <>
            {/* Backdrop to close on click outside */}
            <div className="fixed inset-0 z-40" onClick={() => setIsVisible(false)} />

            {/* Tooltip */}
            <motion.div
              initial={{ opacity: 0, y: 5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              className="absolute bottom-full left-1/2 z-50 mb-2 w-56 -translate-x-1/2 rounded-lg border border-border bg-card p-3 shadow-lg"
            >
              <p className="text-xs font-medium">{explanations[target].title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{explanation}</p>

              {/* Arrow */}
              <div className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-border bg-card" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
