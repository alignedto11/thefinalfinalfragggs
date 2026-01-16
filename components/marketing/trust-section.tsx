import { oldWiseTales } from "@/lib/copy"
import { FadeUp } from "@/components/ui/motion"

export function TrustSection() {
  const { trust } = oldWiseTales

  return (
    <section className="border-t border-border bg-muted/20">
      <div className="mx-auto max-w-3xl px-4 py-20 md:py-24">
        <FadeUp>
          <h2 className="text-center text-2xl font-medium tracking-tight md:text-3xl">{trust.title}</h2>
        </FadeUp>

        <FadeUp delay={100}>
          <div className="mt-10 flex flex-col items-center gap-2 text-center">
            {trust.statements.map((statement) => (
              <p key={statement} className="text-lg text-muted-foreground">
                {statement}
              </p>
            ))}
          </div>
        </FadeUp>

        <FadeUp delay={200}>
          <div className="mt-12 space-y-4 rounded-lg border border-border bg-background p-6 md:p-8">
            {trust.expanded.map((paragraph, index) => (
              <p key={index} className="text-sm text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
