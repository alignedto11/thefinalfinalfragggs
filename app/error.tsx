"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mandala } from "@/components/mandala/mandala"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      {/* Background mandala - turbulent state */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.04]">
        <div className="h-[600px] w-[600px]">
          <Mandala state={{ pressure: 0.8, clarity: 0.2, velocity: 0.7, coherence: 0.3 }} size="full" seed={0.5} />
        </div>
      </div>

      <div className="relative text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4">Interference detected</p>

        <h1 className="text-4xl font-medium tracking-tight mb-4">Something went wrong</h1>

        <p className="text-muted-foreground mb-8 max-w-sm">
          An unexpected error occurred. The system is recalibrating.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset}>Try again</Button>
          <Button variant="outline" asChild className="bg-transparent">
            <a href="/">Return home</a>
          </Button>
        </div>

        {error.digest && <p className="mt-8 text-xs text-muted-foreground/50">Error ID: {error.digest}</p>}
      </div>
    </div>
  )
}
