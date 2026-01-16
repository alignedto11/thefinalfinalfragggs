import { MarketingHeader } from "@/components/marketing/header"
import { MarketingFooter } from "@/components/marketing/footer"
import { Hero } from "@/components/marketing/hero"
import { ValueProps } from "@/components/marketing/value-props"
import { HowSteps } from "@/components/marketing/how-steps"
import { PricingCards } from "@/components/marketing/pricing-cards"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="flex-1">
        <Hero />
        <ValueProps />
        <HowSteps />
        <PricingCards />
      </main>
      <MarketingFooter />
    </div>
  )
}
