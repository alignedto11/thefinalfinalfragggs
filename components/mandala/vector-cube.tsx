"use client"

import React from "react"
import { motion } from "framer-motion"

interface VectorCubeProps {
    ratio: number // 0 = Shadow (chaos), 1 = Gift (structure)
    size?: number
    className?: string
}

export const VectorCube: React.FC<VectorCubeProps> = ({
    ratio,
    size = 120,
    className = "",
}) => {
    // Vertices of a cube
    // Projected points: [x, y]
    // We'll morph from a perfect isometric cube (Gift) 
    // to a chaotic, twisted set of vertices (Shadow)

    const shadowDistortion = 1 - ratio

    // Base cube coordinates (isometric-ish)
    const vertices = [
        { x: 0, y: -0.5 },    // Top
        { x: 0.43, y: -0.25 }, // Top Right
        { x: 0.43, y: 0.25 },  // Bottom Right
        { x: 0, y: 0.5 },     // Bottom
        { x: -0.43, y: 0.25 }, // Bottom Left
        { x: -0.43, y: -0.25 },// Top Left
        { x: 0, y: 0 },       // Center
    ]

    // Add noise/distortion based on shadowDistortion
    const getWarped = (v: { x: number; y: number }, i: number) => {
        if (ratio >= 1) return v
        const jitter = shadowDistortion * 0.3
        // Deterministic jitter for each vertex
        const noiseX = Math.sin(i * 1.5) * jitter
        const noiseY = Math.cos(i * 2.1) * jitter
        return { x: v.x + noiseX, y: v.y + noiseY }
    }

    const center = size / 2
    const scale = size * 0.4

    const p = (v: { x: number; y: number }, i: number) => {
        const w = getWarped(v, i)
        return `${center + w.x * scale},${center + w.y * scale}`
    }

    return (
        <div className={`relative ${className}`} style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {/* Draw the "skeleton" of the cube */}
                <motion.path
                    d={`M ${p(vertices[0], 0)} L ${p(vertices[1], 1)} L ${p(vertices[2], 2)} L ${p(vertices[3], 3)} L ${p(vertices[4], 4)} L ${p(vertices[5], 5)} Z`}
                    fill="none"
                    stroke="rgba(0, 255, 255, 0.4)"
                    strokeWidth="1"
                    animate={{ d: `M ${p(vertices[0], 0)} L ${p(vertices[1], 1)} L ${p(vertices[2], 2)} L ${p(vertices[3], 3)} L ${p(vertices[4], 4)} L ${p(vertices[5], 5)} Z` }}
                />

                {/* Internal edges */}
                <motion.line x1={center} y1={center} x2={center + getWarped(vertices[0], 6).x * scale} y2={center + getWarped(vertices[0], 6).y * scale} stroke="rgba(0, 255, 255, 0.2)" strokeWidth="0.5" />
                <motion.path
                    d={`M ${p(vertices[6], 6)} L ${p(vertices[0], 0)} M ${p(vertices[6], 6)} L ${p(vertices[2], 2)} M ${p(vertices[6], 6)} L ${p(vertices[4], 4)}`}
                    fill="none"
                    stroke="rgba(0, 255, 255, 0.3)"
                    strokeWidth="1"
                />

                {/* Vertex nodes */}
                {vertices.map((v, i) => (
                    <motion.circle
                        key={i}
                        cx={center + getWarped(v, i).x * scale}
                        cy={center + getWarped(v, i).y * scale}
                        r={1.5}
                        fill={ratio > 0.8 ? "rgba(0, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.4)"}
                    />
                ))}
            </svg>

            {/* Labeling for the scale */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-40">
                <span className="text-[8px] uppercase tracking-tighter font-mono">
                    {ratio > 0.6 ? "Gift" : ratio < 0.4 ? "Shadow" : "Transition"}
                </span>
            </div>
        </div>
    )
}
