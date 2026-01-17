"use client"

import React, { useMemo } from "react"
import { motion } from "framer-motion"

interface SpiralNode {
    id: string
    label: string
    date: string
    intensity: number
    type: "past" | "present" | "future"
}

interface SpiralTimeProps {
    nodes?: SpiralNode[]
    className?: string
}

export function SpiralTime({ nodes: initialNodes, className = "" }: SpiralTimeProps) {
    const nodes = useMemo(() => {
        if (initialNodes) return initialNodes

        // Generate mock nodes if none provided
        const mockNodes: SpiralNode[] = []
        const count = 12
        for (let i = 0; i < count; i++) {
            const offset = i - 4 // Some past, some future
            const date = new Date()
            date.setDate(date.getDate() + offset)

            mockNodes.push({
                id: `node-${i}`,
                label: offset === 0 ? "Now" : offset < 0 ? `${Math.abs(offset)}d ago` : `in ${offset}d`,
                date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                intensity: 0.3 + Math.random() * 0.7,
                type: offset === 0 ? "present" : offset < 0 ? "past" : "future"
            })
        }
        return mockNodes
    }, [initialNodes])

    return (
        <div className={`relative w-full h-[500px] overflow-hidden bg-black/40 rounded-xl border border-white/5 ${className}`}>
            {/* Background helix line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                    <linearGradient id="helixGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(0, 255, 255, 0)" />
                        <stop offset="50%" stopColor="rgba(0, 255, 255, 0.2)" />
                        <stop offset="100%" stopColor="rgba(0, 255, 255, 0)" />
                    </linearGradient>
                </defs>
                <path
                    d={`M ${150} 0 ${nodes.map((_, i) => {
                        const y = (i / (nodes.length - 1)) * 500
                        const x = 150 + Math.sin(i * 1.5) * 40
                        return `L ${x} ${y}`
                    }).join(" ")}`}
                    fill="none"
                    stroke="url(#helixGradient)"
                    strokeWidth="1"
                    className="opacity-50"
                />
            </svg>

            {/* Nodes */}
            <div className="relative h-full overflow-y-auto no-scrollbar py-10">
                <div className="flex flex-col items-center">
                    {nodes.map((node, i) => {
                        const angle = i * 1.5
                        const xOffset = Math.sin(angle) * 60

                        return (
                            <motion.div
                                key={node.id}
                                className="relative mb-12 flex items-center group cursor-pointer"
                                style={{ x: xOffset }}
                                whileHover={{ scale: 1.1 }}
                            >
                                {/* Connection Line to center */}
                                <div
                                    className="absolute h-px bg-white/10"
                                    style={{
                                        width: Math.abs(xOffset),
                                        left: xOffset > 0 ? -xOffset : 0,
                                        transformOrigin: xOffset > 0 ? "right" : "left",
                                        opacity: 0.3
                                    }}
                                />

                                {/* Node Circle */}
                                <div
                                    className={`w-4 h-4 rounded-full border-2 z-10 
                                ${node.type === "present" ? "bg-cyan-500 border-cyan-300 shadow-[0_0_15px_rgba(0,255,255,0.5)]" :
                                            node.type === "past" ? "bg-white/20 border-white/10" : "bg-transparent border-cyan-500/30"}`}
                                />

                                {/* Tooltip/Label */}
                                <div className={`absolute whitespace-nowrap px-3 py-1 rounded bg-white/5 border border-white/10 backdrop-blur-md transition-all
                            ${xOffset > 0 ? "left-8" : "right-8 text-right"}`}>
                                    <p className="text-[10px] font-bold tracking-tight text-white/90">{node.date}</p>
                                    <p className="text-[8px] uppercase tracking-widest text-muted-foreground">{node.label}</p>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>

            {/* Title */}
            <div className="absolute top-6 left-6 text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40">
                Spiral Time // The Column
            </div>
        </div>
    )
}
