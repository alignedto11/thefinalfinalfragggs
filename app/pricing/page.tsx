import { MarketingHeader } from "@/components/marketing/header"
import { MarketingFooter } from "@/components/marketing/footer"
import { PricingCards } from "@/components/marketing/pricing-cards"
import { FadeUp } from "@/components/ui/motion"

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-5xl px-4 py-16 md:py-20">
            <FadeUp>
              <h1 className="text-center text-3xl font-medium tracking-tight md:text-4xl">
                Simple, transparent pricing
              </h1>
            </FadeUp>
            <FadeUp delay={100}>
              <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
                Start free. Upgrade when you want deeper guidance and integration.
              </p>
            </FadeUp>
          </div>
        </section>

        <PricingCards />

        {/* FAQ-style section */}
        <section className="border-t border-border bg-muted/20">
          <div className="mx-auto max-w-3xl px-4 py-16 md:py-20">
            <FadeUp>
              <h2 className="text-center text-xl font-medium">Common questions</h2>
            </FadeUp>

            <div className="mt-10 space-y-8">
              <FadeUp delay={100}>
                <div>
                  <h3 className="font-medium">Can I cancel anytime?</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Yes. Cancel anytime from your settings. You'll retain access until the end of your billing period.
                  </p>
                </div>
              </FadeUp>

              <FadeUp delay={150}>
                <div>
                  <h3 className="font-medium">What's the difference between tiers?</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Passive shows you patterns. Guided helps you reflect on them with structured prompts. Active
                    proposes actions and integrates with your calendar.
                  </p>
                </div>
              </FadeUp>

              <FadeUp delay={200}>
                <div>
                  <h3 className="font-medium">Is my data secure?</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Yes. We use industry-standard encryption and never share your personal data. See our Trust page for
                    more details.
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
