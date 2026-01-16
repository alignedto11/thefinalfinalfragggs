import { MarketingHeader } from "@/components/marketing/header"
import { MarketingFooter } from "@/components/marketing/footer"
import { FadeUp } from "@/components/ui/motion"

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="flex-1">
        <section className="border-b border-border">
          <div className="mx-auto max-w-5xl px-4 py-16 md:py-20">
            <FadeUp>
              <h1 className="text-center text-3xl font-medium tracking-tight md:text-4xl">Privacy Policy</h1>
            </FadeUp>
            <FadeUp delay={100}>
              <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">Last updated: January 2026</p>
            </FadeUp>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-3xl px-4">
            <div className="prose prose-neutral max-w-none">
              <FadeUp>
                <h2 className="text-xl font-medium">What we collect</h2>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  We collect the information you provide when creating an account: email address and optional natal
                  configuration (birth date, time, location). This data is used solely to compute your personal patterns
                  within the application.
                </p>
              </FadeUp>

              <FadeUp delay={100}>
                <h2 className="mt-10 text-xl font-medium">How we use your data</h2>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Your natal configuration is processed to generate timing contexts and state computations. Event
                  history (Spiral) is stored to personalize suggestions and track patterns over time. We do not sell,
                  share, or monetize your personal data.
                </p>
              </FadeUp>

              <FadeUp delay={150}>
                <h2 className="mt-10 text-xl font-medium">Data retention</h2>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Your data is retained as long as your account is active. You may request deletion of your account and
                  all associated data at any time via the Settings page.
                </p>
              </FadeUp>

              <FadeUp delay={200}>
                <h2 className="mt-10 text-xl font-medium">Security</h2>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  We use industry-standard encryption for data in transit and at rest. Access to user data is restricted
                  to essential personnel and protected by row-level security policies.
                </p>
              </FadeUp>

              <FadeUp delay={250}>
                <h2 className="mt-10 text-xl font-medium">Contact</h2>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  For privacy-related inquiries, contact privacy@defrag.app.
                </p>
              </FadeUp>
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  )
}
