import { MarketingHeader } from "@/components/marketing/header"
import { MarketingFooter } from "@/components/marketing/footer"
import { TrustSection } from "@/components/marketing/trust-section"
import { FadeUp } from "@/components/ui/motion"

export default function TrustPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-5xl px-4 py-16 md:py-20">
            <FadeUp>
              <h1 className="text-center text-3xl font-medium tracking-tight md:text-4xl">Trust & transparency</h1>
            </FadeUp>
            <FadeUp delay={100}>
              <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
                Understanding what DEFRAG is—and what it isn't—is essential to using it well.
              </p>
            </FadeUp>
          </div>
        </section>

        <TrustSection />

        {/* Additional trust info */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-3xl px-4 py-16 md:py-20">
            <div className="space-y-12">
              <FadeUp>
                <div>
                  <h2 className="text-xl font-medium">Your data stays yours</h2>
                  <p className="mt-3 text-muted-foreground leading-relaxed">
                    We store the minimum data required for the system to work. Your natal configuration is used only to
                    compute your personal patterns. We never share, sell, or monetize your data.
                  </p>
                </div>
              </FadeUp>

              <FadeUp delay={100}>
                <div>
                  <h2 className="text-xl font-medium">No predictions, no promises</h2>
                  <p className="mt-3 text-muted-foreground leading-relaxed">
                    DEFRAG identifies patterns and timing contexts. It does not predict outcomes, diagnose conditions,
                    or promise results. Think of it as a weather report for internal conditions—useful for planning, not
                    prophecy.
                  </p>
                </div>
              </FadeUp>

              <FadeUp delay={200}>
                <div>
                  <h2 className="text-xl font-medium">Seek professional help when needed</h2>
                  <p className="mt-3 text-muted-foreground leading-relaxed">
                    DEFRAG is not a substitute for therapy, counseling, or medical care. If you're experiencing
                    distress, crisis, or health concerns, please consult a qualified professional.
                  </p>
                </div>
              </FadeUp>
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  )
}
