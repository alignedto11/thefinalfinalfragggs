import { MarketingHeader } from "@/components/marketing/header"
import { MarketingFooter } from "@/components/marketing/footer"
import { FadeUp } from "@/components/ui/motion"
import { oldWiseTales } from "@/lib/copy"

export default function TermsPage() {
  const { terms } = oldWiseTales

  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-5xl px-4 py-16 md:py-20">
            <FadeUp>
              <h1 className="text-center text-3xl font-medium tracking-tight md:text-4xl">{terms.title}</h1>
            </FadeUp>
            <FadeUp delay={100}>
              <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">Effective {terms.effectiveDate}</p>
            </FadeUp>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-3xl px-4">
            <div className="space-y-12">
              {terms.sections.map((section, idx) => (
                <FadeUp key={section.title} delay={idx * 50}>
                  <div className="space-y-4">
                    <h2 className="text-xl font-medium">{section.title}</h2>
                    <div className="space-y-3">
                      {section.content.map((paragraph, pIdx) => (
                        <p key={pIdx} className="text-muted-foreground leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>

            {/* Acceptance */}
            <FadeUp delay={terms.sections.length * 50 + 100}>
              <div className="mt-16 rounded-lg border border-border bg-muted/30 p-6">
                <p className="text-center text-sm text-muted-foreground">{terms.acceptance}</p>
              </div>
            </FadeUp>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  )
}
