import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PRODUCTS } from "@/lib/products"
import { Check, CreditCard, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { SubscribeButton } from "@/components/app/subscribe-button"
import { ManageSubscriptionButton } from "@/components/app/manage-subscription-button"

export default async function BillingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("tier, stripe_customer_id, stripe_subscription_id")
    .eq("id", user.id)
    .single()

  const currentTier = profile?.tier || "passive"
  const hasActiveSubscription = !!profile?.stripe_subscription_id

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/settings"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Settings
        </Link>
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-xl font-medium">Subscription</h1>
        </div>
      </div>

      {/* Current plan */}
      <Card className="mb-6 border-border/50">
        <CardHeader className="pb-2">
          <CardDescription>Current plan</CardDescription>
          <CardTitle className="text-lg capitalize">{currentTier}</CardTitle>
        </CardHeader>
        {hasActiveSubscription && (
          <CardContent>
            <ManageSubscriptionButton />
          </CardContent>
        )}
      </Card>

      {/* Plans */}
      <div className="space-y-4">
        {/* Free tier */}
        <Card className={cn("border-border/50", currentTier === "passive" && "border-foreground/20")}>
          <CardHeader className="pb-3">
            <div className="flex items-baseline justify-between">
              <CardTitle className="text-base">Passive</CardTitle>
              <span className="text-lg font-medium">Free</span>
            </div>
            <CardDescription>Observe your patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {["Daily state snapshot", "Mandala visualization", "Basic timing windows"].map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-muted-foreground" />
                  {feature}
                </li>
              ))}
            </ul>
            {currentTier === "passive" && (
              <div className="mt-4 rounded-md bg-muted/50 px-3 py-2 text-center text-sm text-muted-foreground">
                Current plan
              </div>
            )}
          </CardContent>
        </Card>

        {/* Paid tiers */}
        {PRODUCTS.map((product) => (
          <Card
            key={product.id}
            className={cn(
              "border-border/50",
              product.recommended && "border-foreground/20 shadow-lg",
              currentTier === product.tier && "border-foreground/20",
            )}
          >
            {product.recommended && currentTier === "passive" && (
              <div className="flex justify-center -mt-3">
                <span className="rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background">
                  Recommended
                </span>
              </div>
            )}
            <CardHeader className="pb-3">
              <div className="flex items-baseline justify-between">
                <CardTitle className="text-base">{product.name}</CardTitle>
                <div>
                  <span className="text-lg font-medium">${(product.priceInCents / 100).toFixed(0)}</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
              </div>
              <CardDescription>{product.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {product.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-muted-foreground" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-4">
                {currentTier === product.tier ? (
                  <div className="rounded-md bg-muted/50 px-3 py-2 text-center text-sm text-muted-foreground">
                    Current plan
                  </div>
                ) : (
                  <SubscribeButton productId={product.id} label={`Upgrade to ${product.name}`} />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trust reminder */}
      <div className="mt-8 rounded-lg border border-border bg-muted/30 p-4">
        <p className="text-xs text-muted-foreground text-center">
          Cancel anytime. Your data remains yours.
          <br />
          Not predictive. Not diagnostic.
        </p>
      </div>
    </div>
  )
}
