import { oldWiseTales } from "@/lib/copy"
import { FadeUp } from "@/components/ui/motion"

export function HowSteps() {
  const { how } = oldWiseTales

  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-5xl px-4 py-20 md:py-24">
        <FadeUp>
          <h2 className="text-center text-2xl font-medium tracking-tight md:text-3xl">{how.title}</h2>
        </FadeUp>

        <div className="mt-12 md:mt-16">
          <div className="grid gap-8 md:grid-cols-3">
            {how.steps.map((step, index) => (
              <FadeUp key={step.number} delay={100 + index * 100}>
                <div className="relative">
                  {/* Connecting line (desktop) */}
                  {index < how.steps.length - 1 && (
                    <div className="absolute left-1/2 top-8 hidden h-px w-full bg-border md:block" />
                  )}

                  <div className="flex flex-col items-center text-center">
                    {/* Step number */}
                    <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border border-border bg-background">
                      <span className="font-mono text-sm text-muted-foreground">{step.number}</span>
                    </div>

                    <h3 className="mt-6 text-lg font-medium">{step.title}</h3>
                    <p className="mt-2 max-w-xs text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
