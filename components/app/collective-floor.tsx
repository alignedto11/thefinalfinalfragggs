"use client"

import React, { useMemo } from "react"
import { motion } from "framer-motion"
import { Mandala } from "@/components/mandala/mandala"
import { MandalaState } from "@/lib/state"

interface CollectiveFloorProps {
    userState: MandalaState
    className?: string
}

export function CollectiveFloor({ userState, className = "" }: CollectiveFloorProps) {
    // Generate a grid of anonymous tiles
    const tiles = useMemo(() => {
        const grid: Array<{ id: string; state: MandalaState; seed: number; x: number; y: number }> = []
        const size = 6 // 6x6 grid for the "floor"

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                // Pseudo-random but stable state for "other users"
                const seed = (i * 0.13 + j * 0.27) % 1
                grid.push({
                    id: `anon-${i}-${j}`,
                    seed,
                    state: {
                        pressure: 0.2 + (seed * 0.6),
                        clarity: 0.3 + ((1 - seed) * 0.5),
                        velocity: 0.1 + (seed * 0.3),
                        coherence: 0.4 + (seed * 0.4),
                    },
                    x: (i - size / 2) * 220,
                    y: (j - size / 2) * 220,
                })
            }
        }
        return grid
    }, [])

    return (
        <div className={`relative w-full h-[600px] overflow-hidden bg-black rounded-xl border border-white/5 ${className}`}>
            {/* Perspective Container */}
            <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ perspective: "1000px" }}
            >
                <motion.div
                    className="relative preserve-3d"
                    style={{ rotateX: 45, y: -50 }}
                    animate={{ rotateY: [-5, 5, -5] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                >
                    {/* Relational Mesh / Grid Layout */}
                    {tiles.map((tile) => (
                        <motion.div
                            key={tile.id}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2"
                            style={{ left: tile.x, top: tile.y }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 0.4, scale: 0.9 }}
                            whileHover={{ opacity: 1, scale: 1.1, z: 50 }}
                            transition={{ duration: 0.8 }}
                        >
                            <Mandala
                                state={tile.state}
                                seed={tile.seed}
                                size="sm"
                                className="shadow-[0_0_30px_rgba(0,0,0,0.5)]"
                            />
                        </motion.div>
                    ))}

                    {/* User's Tile - Highlighted in Center */}
                    <motion.div
                        className="absolute left-0 top-0 transform -translate-x-1/2 -translate-y-1/2 z-50"
                        animate={{ scale: [1, 1.05, 1], z: [20, 30, 20] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <div className="absolute -inset-12 rounded-full bg-cyan-500/20 blur-2xl animate-pulse" />
                        <Mandala
                            state={userState}
                            seed={0.42}
                            size="sm"
                            className="border-2 border-cyan-500/50 shadow-[0_0_50px_rgba(0,255,255,0.2)]"
                        />
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest text-cyan-400 font-bold">
                            You
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Grid Overlay for depth */}
            <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Floor Label */}
            <div className="absolute bottom-6 left-6 text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40">
                Relational Mesh // Collective Live State
            </div>
        </div>
    )
}
