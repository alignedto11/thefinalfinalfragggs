"use client"

import { useMemo, useState } from "react"
import { MandalaCanvas } from "./mandala-canvas"
import { computeNatalBaseline, NatalInput } from "@/lib/natal-compute"
import { MandalaState } from "@/lib/state"
import { RelationalGeometryLayer } from "./relational-geometry"
import { VectorCube } from "./vector-cube"

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
    const [isExpanded, setIsExpanded] = useState(false)

    // Compute the "Standard Shape" from birth data
    // If no birth data, use a demo set
    const baseline = useMemo(() => {
        if (!birthData) {
            return {
                pressure0: 0.5,
                clarity0: 0.7,
                velocity0: 0.2, // Natal is slow/fixed
                coherence0: 0.8,
                longitudes: [] as number[],
                giftRatio: 0.5
            }
        }
        return computeNatalBaseline(birthData)
    }, [birthData])

    const state: MandalaState = {
        pressure: baseline.pressure0,
        clarity: baseline.clarity0,
        velocity: 0.1, // Fixed slow motion for the natal "fingerprint"
        coherence: baseline.coherence0,
        longitudes: baseline.longitudes,
        giftRatio: baseline.giftRatio
    }

    // Generate a deterministic seed from the birth date
    const seed = useMemo(() => {
        if (!birthData) return 0.42
        const s = new Date(birthData.birthDate).getTime()
        return (s % 1000) / 1000
    }, [birthData])

    const containerSizePx = size === "sm" ? 128 : size === "md" ? 192 : size === "lg" ? 256 : 512

    return (
        <div
            className={`group relative overflow-visible cursor-pointer transition-all duration-500 rounded-full ${sizeClasses[size]} ${className}`}
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <div className="relative w-full h-full rounded-full overflow-hidden">
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

            {/* Relational Geometry Overlay */}
            {isExpanded && state.longitudes && state.longitudes.length > 0 && (
                <RelationalGeometryLayer longitudes={state.longitudes} size={containerSizePx} className="z-20 scale-110" />
            )}

            {/* Vector Cube Overlay */}
            {isExpanded && (
                <div className="absolute -right-8 bottom-0 z-30 transform translate-x-full">
                    <VectorCube ratio={state.giftRatio ?? 0.5} size={80} />
                </div>
            )}
        </div>
    )
}
