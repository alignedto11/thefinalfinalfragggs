"use client"

import { useMemo } from "react"
import { MandalaCanvas } from "./mandala-canvas"
import { computeNatalBaseline, NatalInput } from "@/lib/natal-compute"
import { MandalaState } from "@/lib/state"

interface NatalMandalaProps {
    birthData?: NatalInput
    size?: "sm" | "md" | "lg" | "full"
    className?: string
}

const sizeClasses = {
    sm: "w-32 h-32",
    md: "w-48 h-48",
    lg: "w-64 h-64",
    full: "w-full h-full",
}

export function NatalMandala({ birthData, size = "md", className = "" }: NatalMandalaProps) {
    // Compute the "Standard Shape" from birth data
    // If no birth data, use a demo set
    const baseline = useMemo(() => {
        if (!birthData) {
            return {
                pressure0: 0.5,
                clarity0: 0.7,
                velocity0: 0.2, // Natal is slow/fixed
                coherence0: 0.8,
            }
        }
        return computeNatalBaseline(birthData)
    }, [birthData])

    const state: MandalaState = {
        pressure: baseline.pressure0,
        clarity: baseline.clarity0,
        velocity: 0.1, // Fixed slow motion for the natal "fingerprint"
        coherence: baseline.coherence0,
    }

    // Generate a deterministic seed from the birth date
    const seed = useMemo(() => {
        if (!birthData) return 0.42
        const s = new Date(birthData.birthDate).getTime()
        return (s % 1000) / 1000
    }, [birthData])

    return (
        <div className={`group relative overflow-hidden rounded-full ${sizeClasses[size]} ${className}`}>
            {/* Background glow specific to natal data */}
            <div className="absolute inset-0 bg-cyan-500/5 blur-2xl group-hover:bg-cyan-500/10 transition-colors duration-1000" />

            <MandalaCanvas
                state={state}
                seed={seed}
                reducedMotion={false}
            />

            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
        </div>
    )
}
