import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { oldWiseTales } from "@/lib/copy"
import { FadeUp } from "@/components/ui/motion"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export function PricingCards() {
  const { pricing } = oldWiseTales

  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-5xl px-4 py-20 md:py-24">
        <FadeUp>
          <h2 className="text-center text-2xl font-medium tracking-tight md:text-3xl">{pricing.title}</h2>
        </FadeUp>

        <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-3">
          {pricing.tiers.map((tier, index) => (
            <FadeUp key={tier.name} delay={100 + index * 100}>
              <Card className={cn("relative flex flex-col", tier.recommended && "border-foreground/20 shadow-lg")}>
                {tier.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background">
                      Recommended
                    </span>
                  </div>
                )}

                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col">
                  <div className="mb-6">
                    <span className="text-3xl font-medium">{tier.price}</span>
                    {tier.period && <span className="text-muted-foreground">{tier.period}</span>}
                  </div>

                  <ul className="mb-8 flex-1 space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button variant={tier.recommended ? "default" : "outline"} className="w-full" asChild>
                    <Link href="/auth/sign-up">{tier.price === "Free" ? "Get started" : "Subscribe"}</Link>
                  </Button>
                </CardContent>
              </Card>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
