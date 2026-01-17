import { MarketingHeader } from "@/components/marketing/header"
import { MarketingFooter } from "@/components/marketing/footer"
import { HowSteps } from "@/components/marketing/how-steps"
import { FadeUp } from "@/components/ui/motion"
import { Mandala } from "@/components/mandala/mandala"
import { NatalMandala } from "@/components/mandala/natal-mandala"
import { demoState } from "@/lib/state"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="flex-1">
        {/* Hero section */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-5xl px-4 py-16 md:py-20">
            <FadeUp>
              <h1 className="text-center text-3xl font-medium tracking-tight md:text-4xl">How DEFRAG works</h1>
            </FadeUp>
            <FadeUp delay={100}>
              <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
                A structured approach to self-reflection that helps you understand patterns and navigate timing.
              </p>
            </FadeUp>
          </div>
        </section>

        <HowSteps />

        {/* Visual explanation */}
        <section className="border-t border-border bg-muted/20">
          <div className="mx-auto max-w-5xl px-4 py-20 md:py-24">
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              <FadeUp>
                <div>
                  <h2 className="text-2xl font-medium tracking-tight">The mandala reflects your state</h2>
                  <p className="mt-4 text-muted-foreground leading-relaxed">
                    The cymatic visualization responds to four dimensions of your current state: pressure, clarity,
                    velocity, and coherence. As these shift, the pattern breathes and ripples—like the surface of still
                    water.
                  </p>
                  <p className="mt-4 text-muted-foreground leading-relaxed">
                    This is not prediction. It's a mirror that shows you where you are, so you can decide where to go.
                  </p>
                </div>
              </FadeUp>

              <FadeUp delay={100}>
                <div className="flex justify-center">
                  <Mandala state={demoState} size="lg" seed={0.42} />
                </div>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* Natal Blueprint Section */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-5xl px-4 py-20 md:py-24">
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              <FadeUp className="md:order-2">
                <div>
                  <h2 className="text-2xl font-medium tracking-tight italic font-serif">The Natal Blueprint</h2>
                  <p className="mt-4 text-muted-foreground leading-relaxed">
                    Upon sign-up, DEFRAG computes your <strong>Harmonic Fingerprint</strong> from your birth data.
                    This "Standard Shape" represents your baseline resonance—the immutable geometry of your natal geometry.
                  </p>
                  <p className="mt-4 text-muted-foreground leading-relaxed">
                    While the daily mandala ripples with the transit of time, the Blueprint remains a constant point of return,
                    helping you identify which pressures are yours and which are merely passing through.
                  </p>
                </div>
              </FadeUp>

              <FadeUp delay={100} className="md:order-1">
                <div className="flex justify-center relative">
                  {/* Decorative background aura */}
                  <div className="absolute inset-0 bg-blue-500/5 blur-[100px] rounded-full" />
                  <NatalMandala size="lg" className="border border-white/5 shadow-2xl" />
                </div>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-5xl px-4 py-16 md:py-20">
            <div className="flex flex-col items-center text-center">
              <FadeUp>
                <h2 className="text-2xl font-medium tracking-tight">Ready to begin?</h2>
              </FadeUp>
              <FadeUp delay={100}>
                <p className="mt-4 max-w-md text-muted-foreground">
                  Start with the free tier. Upgrade when you're ready for deeper guidance.
                </p>
              </FadeUp>
              <FadeUp delay={200}>
                <Button size="lg" asChild className="mt-8">
                  <Link href="/auth/sign-up">Get started</Link>
                </Button>
              </FadeUp>
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  )
}
