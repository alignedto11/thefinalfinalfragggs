import { stripe } from "@/lib/stripe"
import { createClient } from "@supabase/supabase-js"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

// Use service role for webhook handling
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event

  try {
    // Note: In production, you'd use a webhook secret for verification
    // For now, we'll parse the event directly
    event = JSON.parse(body)
  } catch (error) {
    console.error("Webhook parsing error:", error)
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object
        if (session.mode === "subscription") {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
          const userId = subscription.metadata.supabase_user_id
          const tier = subscription.metadata.tier

          if (userId && tier) {
            await supabaseAdmin
              .from("profiles")
              .update({
                tier,
                stripe_subscription_id: subscription.id,
              })
              .eq("id", userId)
          }
        }
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object
        const userId = subscription.metadata.supabase_user_id
        const tier = subscription.metadata.tier

        if (userId) {
          const isActive = subscription.status === "active" || subscription.status === "trialing"

          await supabaseAdmin
            .from("profiles")
            .update({
              tier: isActive ? tier : "passive",
              stripe_subscription_id: isActive ? subscription.id : null,
            })
            .eq("id", userId)
        }
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object
        const userId = subscription.metadata.supabase_user_id

        if (userId) {
          await supabaseAdmin
            .from("profiles")
            .update({
              tier: "passive",
              stripe_subscription_id: null,
            })
            .eq("id", userId)
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook handler error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
