"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface BowenNode {
  id: string
  name: string
  x: number
  y: number
}

interface BowenEdge {
  from: string
  to: string
  distance: number // 0-1, where 1 is most distant (high reactivity)
}

interface BowenChartProps {
  nodes: BowenNode[]
  edges: BowenEdge[]
  userNodeId: string
}

export function BowenChart({ nodes, edges, userNodeId }: BowenChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

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

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw edges (connections)
    edges.forEach((edge) => {
      const fromNode = nodes.find((n) => n.id === edge.from)
      const toNode = nodes.find((n) => n.id === edge.to)

      if (!fromNode || !toNode) return

      // Line opacity based on distance (closer = more visible)
      const opacity = 1 - edge.distance * 0.7
      ctx.strokeStyle = `rgba(120, 120, 120, ${opacity})`
      ctx.lineWidth = 2 - edge.distance

      ctx.beginPath()
      ctx.moveTo(fromNode.x * width, fromNode.y * height)
      ctx.lineTo(toNode.x * width, toNode.y * height)
      ctx.stroke()
    })

    // Draw nodes
    nodes.forEach((node) => {
      const isUser = node.id === userNodeId
      const x = node.x * width
      const y = node.y * height

      // Node circle
      ctx.fillStyle = isUser ? "rgba(40, 40, 40, 1)" : "rgba(180, 180, 180, 1)"
      ctx.beginPath()
      ctx.arc(x, y, isUser ? 8 : 6, 0, Math.PI * 2)
      ctx.fill()

      // Label
      ctx.fillStyle = "rgba(100, 100, 100, 1)"
      ctx.font = isUser ? "600 12px sans-serif" : "400 11px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "bottom"
      ctx.fillText(node.name, x, y - 12)
    })
  }, [nodes, edges, userNodeId])

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-base">Relational map</CardTitle>
        <p className="text-xs text-muted-foreground">Distance represents reactivity, not affection.</p>
      </CardHeader>
      <CardContent>
        <canvas ref={canvasRef} className="h-64 w-full" style={{ width: "100%", height: "16rem" }} />
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-foreground" />
            <span>You</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-muted-foreground" />
            <span>Others</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
