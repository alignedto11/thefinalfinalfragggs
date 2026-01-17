import { oldWiseTales } from "@/lib/copy"
import { FadeUp } from "@/components/ui/motion"

export function HowSteps() {
  const { how } = oldWiseTales

  return (
    <section className="border-t border-border bg-background relative z-10">
      <div className="mx-auto max-w-5xl px-4 py-24 md:py-32">
        <FadeUp>
          <h2 className="text-center text-2xl font-bold tracking-tight md:text-4xl">{how.title}</h2>
        </FadeUp>

        <div className="mt-20 md:mt-28">
          <div className="grid gap-16 md:grid-cols-3 md:gap-8">
            {how.steps.map((step, index) => (
              <FadeUp key={step.number} delay={100 + index * 100}>
                <div className="relative group">
                  {/* Connecting line (desktop) - subtly animated */}
                  {index < how.steps.length - 1 && (
                    <div className="absolute left-[calc(50%+2rem)] top-10 hidden h-px w-[calc(100%-4rem)] bg-border md:block opacity-50" />
                  )}

                  <div className="flex flex-col items-center text-center">
                    {/* Step number - high fidelity circle */}
                    <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full border border-border/60 bg-background shadow-sm transition-all group-hover:border-foreground/20 group-hover:shadow-md">
                      <span className="font-mono text-xs tracking-widest text-muted-foreground/60 group-hover:text-foreground transition-colors">{step.number}</span>
                    </div>

                    <h3 className="mt-8 text-xl font-semibold tracking-tight">{step.title}</h3>
                    <p className="mt-3 max-w-[240px] text-base text-muted-foreground leading-relaxed italic opacity-80">{step.description}</p>
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
