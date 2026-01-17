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
      {/* Background mandala - larger, more prominent */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.06]">
        <div className="h-[1000px] w-[1000px] md:h-[1200px] md:w-[1200px]">
          <Mandala state={demoState} size="full" seed={0.42} />
        </div>
      </div>

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

          {/* Main headline - BOLD & PROVOCATIVE */}
          <FadeUp delay={150}>
            <h1 className="max-w-4xl text-balance text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl">
              <span className="italic font-serif text-6xl md:text-8xl lg:text-9xl">The Choreography</span>{" "}
              <span className="font-black tracking-tighter">of the Soul.</span>
            </h1>
          </FadeUp>

          {/* Subhead - Enhanced formatting for tone of voice */}
          <FadeUp delay={300}>
            <div className="mt-8 max-w-2xl space-y-6 text-lg md:text-xl font-medium">
              <p className="leading-relaxed text-xl md:text-2xl">
                <span className="text-foreground font-bold italic">
                  Your problems are not evil villains.
                </span>
              </p>

              <p className="pl-6 md:pl-8 leading-relaxed text-muted-foreground">
                They are your <em>dance partners</em>.
              </p>

              <p className="pl-6 md:pl-8 leading-relaxed text-muted-foreground">
                They are <strong>waiting</strong> for you to take their hand and{" "}
                <span className="text-foreground font-bold">spin the chaos into kinetic energy.</span>
              </p>

              <p className="pl-6 md:pl-8 pt-4 text-base uppercase tracking-widest opacity-70 font-normal">
                Don't overthink it.
              </p>

              <p className="pl-6 md:pl-8 text-base uppercase tracking-widest opacity-70 font-normal">
                Get on the floor.
              </p>

              <p className="pl-6 md:pl-8 text-lg uppercase tracking-wider">
                <strong className="text-foreground font-black">Lean into the spin.</strong>
              </p>
            </div>
          </FadeUp>

          {/* CTA buttons */}
          <FadeUp delay={450}>
            <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:gap-6">
              <Button size="lg" asChild className="min-w-[180px] h-12 text-base">
                <Link href="/auth/sign-up">{hero.cta}</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="min-w-[180px] h-12 text-base bg-transparent border-border hover:bg-muted/50"
              >
                <Link href="/how-it-works">How it works</Link>
              </Button>
            </div>
          </FadeUp>

          {/* Mandala preview - FULLY CENTERED IN WINDOW */}
          <FadeUp delay={600}>
            <div className="mt-20 md:mt-24 w-full">
              <div className="flex flex-col items-center justify-center">
                {/* Mandala Container */}
                <div className="relative">
                  {/* Outer glow ring */}
                  <div className="absolute -inset-8 rounded-full bg-gradient-to-b from-muted/40 via-transparent to-transparent blur-3xl" />

                  {/* Breathing animation wrapper */}
                  <div
                    className={`relative transition-transform duration-[4000ms] ease-in-out ${mounted ? "animate-pulse-slow" : ""
                      }`}
                    style={{
                      animation: mounted ? "breathe 8s ease-in-out infinite" : "none",
                    }}
                  >
                    <Mandala
                      state={cosmic ? cosmic.mandala : demoState}
                      size="lg"
                      seed={cosmic ? cosmic.numerology.universalDayNumber * 0.1 : 0.42}
                      className="relative"
                    />
                  </div>
                </div>

                {/* Caption - Below Mandala */}
                <div className="mt-12 flex flex-col items-center gap-2 max-w-md mx-auto text-center">
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
            <p className="mt-16 text-xs text-muted-foreground/50 max-w-md">
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
