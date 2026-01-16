"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type EquilibriumState = "balanced" | "distorted" | "returning"

interface VectorEquilibriumProps {
  state: EquilibriumState
  pressure: number // 0-1
  clarity: number // 0-1
}

export function VectorEquilibrium({ state, pressure, clarity }: VectorEquilibriumProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const width = rect.width
    const height = rect.height
    const centerX = width / 2
    const centerY = height / 2

    let time = 0

    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      // Distortion based on pressure
      const distortion = state === "balanced" ? 0 : state === "distorted" ? pressure * 0.3 : pressure * 0.15

      // Rotation for "returning" state
      const rotation = state === "returning" ? Math.sin(time * 0.5) * 0.1 : 0

      // Draw cuboctahedron (simplified wireframe)
      const radius = 60
      const points: [number, number][] = []

      // Generate vertices (simplified)
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2
        const r = radius + distortion * Math.sin(angle * 3 + time) * 20
        const x = centerX + Math.cos(angle + rotation) * r
        const y = centerY + Math.sin(angle + rotation) * r
        points.push([x, y])
      }

      // Draw edges
      ctx.strokeStyle = `rgba(100, 100, 100, ${0.4 + clarity * 0.4})`
      ctx.lineWidth = 1.5

      // Connect vertices in a pattern
      for (let i = 0; i < points.length; i++) {
        const [x1, y1] = points[i]
        const [x2, y2] = points[(i + 1) % points.length]
        const [x3, y3] = points[(i + 4) % points.length]

        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x3, y3)
        ctx.stroke()
      }

      // Draw vertices
      points.forEach(([x, y]) => {
        ctx.fillStyle = "rgba(40, 40, 40, 0.8)"
        ctx.beginPath()
        ctx.arc(x, y, 2, 0, Math.PI * 2)
        ctx.fill()
      })

      time += 0.02
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [state, pressure, clarity])

  const getStateLabel = () => {
    switch (state) {
      case "balanced":
        return "Balanced"
      case "distorted":
        return "Loaded"
      case "returning":
        return "Settling"
    }
  }

  const getStateDescription = () => {
    switch (state) {
      case "balanced":
        return "Internal forces are in equilibrium. Decisions feel lighter."
      case "distorted":
        return "Pressure distorts the baseline. Space helps before action."
      case "returning":
        return "Pattern is stabilizing. Let it settle naturally."
    }
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-base">Internal geometry</CardTitle>
        <p className="text-xs text-muted-foreground">Visual model of balance vs distortion</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <canvas ref={canvasRef} className="h-48 w-full" style={{ width: "100%", height: "12rem" }} />
          <div className="space-y-2 text-center">
            <p className="text-sm font-medium">{getStateLabel()}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{getStateDescription()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
