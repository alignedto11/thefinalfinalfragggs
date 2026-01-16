import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mandala } from "@/components/mandala/mandala"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      {/* Background mandala */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.04]">
        <div className="h-[600px] w-[600px]">
          <Mandala state={{ pressure: 0.2, clarity: 0.3, velocity: 0.1, coherence: 0.4 }} size="full" seed={0.404} />
        </div>
      </div>

      <div className="relative text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4">Signal lost</p>

        <h1 className="text-4xl font-medium tracking-tight mb-4">Page not found</h1>

        <p className="text-muted-foreground mb-8 max-w-sm">
          The path you're looking for doesn't exist. Perhaps you were meant to find something else.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/">Return home</Link>
          </Button>
          <Button variant="outline" asChild className="bg-transparent">
            <Link href="/dashboard">Go to dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
