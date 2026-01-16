import { MarketingHeader } from "@/components/marketing/header"
import { MarketingFooter } from "@/components/marketing/footer"
import { FadeUp } from "@/components/ui/motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Shield, Eye, Heart, Volume2 } from "lucide-react"

export default function ContactEthicsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-5xl px-4 py-16 md:py-20">
            <FadeUp>
              <h1 className="text-center text-3xl font-medium tracking-tight md:text-4xl">Contact & ethics</h1>
            </FadeUp>
            <FadeUp delay={100}>
              <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
                How we built this. Why it matters. How to reach us.
              </p>
            </FadeUp>
          </div>
        </section>

        {/* Contact */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-3xl px-4 py-16 md:py-20">
            <FadeUp>
              <div className="text-center">
                <Mail className="mx-auto h-8 w-8 text-muted-foreground" />
                <h2 className="mt-4 text-2xl font-medium">Get in touch</h2>
                <p className="mt-3 text-muted-foreground">Questions, concerns, or feedback—we want to hear from you.</p>
                <div className="mt-8">
                  <a href="mailto:info@defrag.app">
                    <Button size="lg" variant="outline">
                      info@defrag.app
                    </Button>
                  </a>
                </div>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* Ethics values */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-3xl px-4 py-16 md:py-20">
            <FadeUp>
              <h2 className="text-center text-2xl font-medium">Our ethical principles</h2>
            </FadeUp>

            <div className="mt-12 grid gap-8 md:grid-cols-2">
              <FadeUp delay={100}>
                <Card className="border-border">
                  <CardContent className="p-6">
                    <Shield className="h-6 w-6 text-muted-foreground" />
                    <h3 className="mt-4 font-medium">Agency</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      You retain full agency over all decisions. DEFRAG provides observations, not instructions. What
                      you do with them is entirely your choice.
                    </p>
                  </CardContent>
                </Card>
              </FadeUp>

              <FadeUp delay={150}>
                <Card className="border-border">
                  <CardContent className="p-6">
                    <Eye className="h-6 w-6 text-muted-foreground" />
                    <h3 className="mt-4 font-medium">Privacy-first</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      We store the minimum data required for the system to work. Your personal data is used only to
                      compute your patterns. We never share, sell, or monetize it.
                    </p>
                  </CardContent>
                </Card>
              </FadeUp>

              <FadeUp delay={200}>
                <Card className="border-border">
                  <CardContent className="p-6">
                    <Heart className="h-6 w-6 text-muted-foreground" />
                    <h3 className="mt-4 font-medium">Restraint</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      We deliberately limit what the system suggests. Silence is valid data. Not every moment requires
                      action or analysis.
                    </p>
                  </CardContent>
                </Card>
              </FadeUp>

              <FadeUp delay={250}>
                <Card className="border-border">
                  <CardContent className="p-6">
                    <Volume2 className="h-6 w-6 text-muted-foreground" />
                    <h3 className="mt-4 font-medium">Non-manipulative design</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      No dark patterns. No artificial urgency. No gamification. The interface is designed to calm, not
                      to capture.
                    </p>
                  </CardContent>
                </Card>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* How it was built */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-3xl px-4 py-16 md:py-20">
            <FadeUp>
              <h2 className="text-2xl font-medium">How it was built</h2>
            </FadeUp>

            <div className="mt-8 space-y-6">
              <FadeUp delay={100}>
                <p className="text-muted-foreground leading-relaxed">
                  DEFRAG combines pattern recognition, timing context analysis, and relational mapping to provide
                  structured self-reflection.
                </p>
              </FadeUp>

              <FadeUp delay={150}>
                <p className="text-muted-foreground leading-relaxed">
                  The system uses your personal data (birth information, event history, relational connections) to
                  compute a baseline pattern and track how conditions shift over time.
                </p>
              </FadeUp>

              <FadeUp delay={200}>
                <p className="text-muted-foreground leading-relaxed">
                  We do not expose the internal mathematics or detailed synthesis methods. This is intentional—the goal
                  is to provide useful observations, not to create dependency on the mechanism.
                </p>
              </FadeUp>

              <FadeUp delay={250}>
                <p className="text-muted-foreground leading-relaxed">
                  If you have specific questions about the approach, feel free to reach out. We're happy to explain at a
                  high level while preserving the integrity of the system.
                </p>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* Safety notice */}
        <section>
          <div className="mx-auto max-w-3xl px-4 py-16 md:py-20">
            <FadeUp>
              <Card className="border-border bg-muted/30">
                <CardContent className="p-8 text-center">
                  <h3 className="font-medium">Safety & professional care</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    DEFRAG is not a substitute for licensed clinical therapy, counseling, or medical care. If you're
                    experiencing distress, crisis, or health concerns, please consult a qualified professional.
                  </p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <a href="tel:988">
                      <Button variant="outline" size="sm">
                        US: 988 Crisis Line
                      </Button>
                    </a>
                    <a href="https://findahelpline.com" target="_blank" rel="noreferrer">
                      <Button variant="outline" size="sm">
                        Global: findahelpline.com
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </FadeUp>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  )
}
