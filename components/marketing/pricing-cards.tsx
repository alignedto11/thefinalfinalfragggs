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
    <section className="border-t border-border bg-muted/5">
      <div className="mx-auto max-w-5xl px-4 py-24 md:py-32">
        <FadeUp>
          <h2 className="text-center text-3xl font-bold tracking-tight md:text-5xl">{pricing.title}</h2>
        </FadeUp>

        <div className="mt-16 grid gap-8 md:mt-24 md:grid-cols-3">
          {pricing.tiers.map((tier, index) => (
            <FadeUp key={tier.name} delay={100 + index * 100}>
              <Card className={cn(
                "relative flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:border-foreground/10",
                tier.recommended ? "border-foreground/10 shadow-lg bg-background" : "bg-background/50 border-border/50"
              )}>
                {tier.recommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                    <span className="rounded-full bg-foreground px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-background shadow-lg">
                      Recommended
                    </span>
                  </div>
                )}

                <CardHeader className="pb-8 pt-10">
                  <CardTitle className="text-xl tracking-tight">{tier.name}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">{tier.description}</CardDescription>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col px-6 pb-10">
                  <div className="mb-10">
                    <span className="text-5xl font-bold tracking-tighter">{tier.price}</span>
                    {tier.period && <span className="text-sm text-muted-foreground ml-1 tracking-tight">{tier.period}</span>}
                  </div>

                  <ul className="mb-12 flex-1 space-y-4">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm leading-snug">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground/40" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button variant={tier.recommended ? "default" : "outline"} className="w-full h-12 text-base font-medium rounded-xl transition-all" asChild>
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
