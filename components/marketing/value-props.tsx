import { oldWiseTales } from "@/lib/copy"
import { FadeUp, HoverLift } from "@/components/ui/motion"
import { ScanSearch, Clock, Compass } from "lucide-react"

const icons = {
  waves: ScanSearch,
  clock: Clock,
  users: Compass,
}

export function ValueProps() {
  const { value } = oldWiseTales

  return (
    <section className="border-t border-border bg-muted/10 relative overflow-hidden">
      <div className="mx-auto max-w-5xl px-4 py-24 md:py-32">
        <FadeUp>
          <h2 className="text-center text-2xl font-bold tracking-tight md:text-4xl text-balance">
            {value.title}
          </h2>
        </FadeUp>

        <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-3 md:gap-16">
          {value.items.map((item, index) => {
            const Icon = icons[item.icon as keyof typeof icons] || ScanSearch
            return (
              <FadeUp key={item.label} delay={100 + index * 100}>
                <HoverLift>
                  <div className="flex flex-col items-center text-center md:items-start md:text-left transition-all group">
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-border/50 bg-background shadow-sm group-hover:border-foreground/20 group-hover:shadow-md transition-all">
                      <Icon className="h-6 w-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                    <h3 className="text-xl font-semibold tracking-tight">{item.label}</h3>
                    <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </HoverLift>
              </FadeUp>
            )
          })}
        </div>
      </div>
    </section>
  )
}
