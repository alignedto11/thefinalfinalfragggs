"use client"

import React, { useMemo } from "react"
import { motion } from "framer-motion"

interface RelationalGeometryProps {
    longitudes: number[]
    size: number
    className?: string
}

export const RelationalGeometryLayer: React.FC<RelationalGeometryProps> = ({
    longitudes,
    size,
    className = "",
}) => {
    const center = size / 2
    const radius = size * 0.42 // Stay slightly inside the mandala rim

    const aspects = useMemo(() => {
        const lines: Array<{ x1: number; y1: number; x2: number; y2: number; type: string; opacity: number }> = []
        const n = longitudes.length

        // Aspect definitions: [angle degrees, tolerance degrees, label, color]
        const types = [
            { angle: 0, orb: 8, color: "rgba(0, 255, 255, 0.4)", label: "conjunction" },
            { angle: 180, orb: 8, color: "rgba(255, 50, 50, 0.4)", label: "opposition" },
            { angle: 90, orb: 7, color: "rgba(255, 150, 0, 0.4)", label: "square" },
            { angle: 120, orb: 7, color: "rgba(0, 255, 100, 0.4)", label: "trine" },
            { angle: 60, orb: 5, color: "rgba(180, 0, 255, 0.4)", label: "sextile" },
        ]

        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                const diff = Math.abs((longitudes[i] * 180 / Math.PI) - (longitudes[j] * 180 / Math.PI)) % 360
                const angle = diff > 180 ? 360 - diff : diff

                for (const type of types) {
                    const dist = Math.abs(angle - type.angle)
                    if (dist < type.orb) {
                        const intensity = 1 - dist / type.orb

                        // Convert polar to cartesian
                        const x1 = center + radius * Math.cos(longitudes[i])
                        const y1 = center + radius * Math.sin(longitudes[i])
                        const x2 = center + radius * Math.cos(longitudes[j])
                        const y2 = center + radius * Math.sin(longitudes[j])

                        lines.push({ x1, y1, x2, y2, type: type.color, opacity: intensity * 0.7 })
                    }
                }
            }
        }
        return lines
    }, [longitudes, center, radius])

    return (
        <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className={`absolute inset-0 pointer-events-none mix-blend-screen overflow-visible ${className}`}
        >
            {/* Outer rim nodes */}
            {longitudes.map((angle, i) => (
                <motion.circle
                    key={`node-${i}`}
                    cx={center + radius * Math.cos(angle)}
                    cy={center + radius * Math.sin(angle)}
                    r={2}
                    fill="rgba(0, 255, 255, 0.8)"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    style={{ filter: "drop-shadow(0 0 4px rgba(0, 255, 255, 0.5))" }}
                />
            ))}

            {/* Aspect lines */}
            {aspects.map((line, i) => (
                <motion.line
                    key={`aspect-${i}`}
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    stroke={line.type}
                    strokeWidth={0.5}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: line.opacity }}
                    transition={{ duration: 1.5, delay: 0.5 + i * 0.05 }}
                />
            ))}
        </svg>
    )
}
