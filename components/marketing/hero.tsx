"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mandala } from "@/components/mandala/mandala"
import { FadeUp } from "@/components/ui/motion"
import { oldWiseTales } from "@/lib/copy"
import { demoState } from "@/lib/state"
import { useEffect, useState } from "react"
import { getCosmicState, CosmicState } from "@/app/actions/engine"

export function Hero() {
  const { hero } = oldWiseTales
  const [mounted, setMounted] = useState(false)
  const [cosmic, setCosmic] = useState<CosmicState | null>(null)

  useEffect(() => {
    setMounted(true)
    getCosmicState().then(setCosmic).catch(console.error)
  }, [])

  const sunInfo = cosmic?.planetaryPositions.find(p => p.name === "Sun")

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Background radial gradient for depth */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,180,216,0.03)_0%,transparent_70%)]" />

      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto max-w-5xl px-4 py-24 md:py-32 lg:py-40">
        <div className="flex flex-col items-center text-center">
          {/* Hook line - appears first */}
          <FadeUp>
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-6">{hero.hook}</p>
          </FadeUp>

          {/* Main headline - Centered & Premium */}
          <FadeUp delay={150}>
            <h1 className="max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-7xl lg:text-8xl">
              <span className="text-foreground">The Resonance</span>{" "}
              <span className="text-muted-foreground/40 font-light italic serif">of Being.</span>
            </h1>
          </FadeUp>

          {/* Subhead - Clean & Sophisticated */}
          <FadeUp delay={300}>
            <div className="mt-8 max-w-2xl text-base md:text-xl text-muted-foreground leading-relaxed px-4">
              <p>
                Surface the recurring patterns in your timing, energy, and relationships.
                Not to predict the future, but to <span className="text-foreground font-medium">master the present.</span>
                Move from reactive chaos to rhythmic alignment.
              </p>
            </div>
          </FadeUp>

          {/* CTA buttons - Stacked on mobile */}
          <FadeUp delay={450}>
            <div className="mt-10 md:mt-12 flex flex-col gap-3 sm:flex-row sm:gap-6 w-full max-w-xs sm:max-w-none mx-auto">
              <Button size="lg" asChild className="w-full sm:w-auto min-w-[160px] h-12 text-base">
                <Link href="/auth/sign-up">{hero.cta}</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="w-full sm:w-auto min-w-[160px] h-12 text-base bg-transparent border-border hover:bg-muted/50"
              >
                <Link href="/how-it-works">How it works</Link>
              </Button>
            </div>
          </FadeUp>

          {/* Mandala preview - Responsive Container */}
          <FadeUp delay={600}>
            <div className="mt-16 md:mt-24 w-full">
              <div className="flex flex-col items-center justify-center">
                {/* Mandala Container - Scaled for Mobile */}
                <div className="relative transform scale-90 md:scale-110">
                  {/* Outer glow ring - Gasoline colors */}
                  <div className="absolute -inset-32 rounded-full bg-gradient-to-tr from-cyan-500/20 via-purple-500/10 to-orange-500/20 blur-[120px] opacity-60 animate-pulse-slow mix-blend-screen" />

                  {/* Secondary chromatic glow */}
                  <div className="absolute -inset-24 rounded-full bg-gradient-to-br from-blue-600/10 via-teal-500/5 to-pink-500/10 blur-[80px] opacity-40 z-0" />

                  {/* Internal concrete texture ring - centered better */}
                  <div className="absolute -inset-4 rounded-full border border-white/5 bg-black/40 backdrop-blur-xl shadow-[0_0_80px_rgba(0,0,0,0.5)]" />

                  {/* Breathing animation wrapper */}
                  <div
                    className="relative transition-all duration-[8000ms] ease-in-out"
                    style={{
                      animation: mounted ? "breathe 16s ease-in-out infinite" : "none",
                      filter: "drop-shadow(0 0 40px rgba(0, 255, 255, 0.15))"
                    }}
                  >
                    <Mandala
                      state={cosmic ? cosmic.mandala : demoState}
                      size="lg"
                      seed={cosmic ? cosmic.numerology.universalDayNumber * 0.1 : 0.42}
                      className="relative z-10"
                    />
                  </div>
                </div>

                {/* Caption - Below Mandala */}
                <div className="mt-8 md:mt-12 flex flex-col items-center gap-2 max-w-[280px] md:max-w-md mx-auto text-center px-4">
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    <span className="text-foreground font-medium">Your personal resonance,</span> calibrated daily.
                  </p>
                  <p className="text-xs text-muted-foreground/70">
                    Align your energy with cosmic timing — see your patterns, not your predictions.
                  </p>
                  {sunInfo && sunInfo.info && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-1000">
                      <p className="text-sm font-medium text-foreground/80">
                        Sun in Gate {sunInfo.gate}: {sunInfo.info.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {sunInfo.info.shadow} → {sunInfo.info.gift}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Trust line */}
          <FadeUp delay={750}>
            <p className="mt-20 text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 max-w-md">
              Not predictive. Not diagnostic. Not a substitute for professional care.
            </p>
          </FadeUp>
        </div>
      </div>

      {/* Add breathing keyframes */}
      <style jsx>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
      `}</style>
    </section>
  )
}
