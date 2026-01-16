import { oldWiseTales } from "@/lib/copy"
import { FadeUp } from "@/components/ui/motion"

export function ValueProps() {
  const { value } = oldWiseTales

  return (
    <section className="border-t border-border bg-muted/20">
      <div className="mx-auto max-w-5xl px-4 py-20 md:py-24">
        <FadeUp>
          <h2 className="text-center text-2xl font-medium tracking-tight md:text-3xl">{value.title}</h2>
        </FadeUp>

        <div className="mt-12 grid gap-8 md:mt-16 md:grid-cols-3 md:gap-12">
          {value.items.map((item, index) => (
            <FadeUp key={item.label} delay={100 + index * 100}>
              <div className="flex flex-col items-center text-center md:items-start md:text-left">
                <div className="mb-4 h-10 w-10 rounded-full border border-border bg-background" />
                <h3 className="text-lg font-medium">{item.label}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
