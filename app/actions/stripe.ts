"use server"

import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import { PRODUCTS, getProductByPriceId } from "@/lib/products"
import { headers } from "next/headers"

export async function createSubscriptionCheckout(productId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const product = PRODUCTS.find((p) => p.id === productId)
  if (!product) {
    throw new Error(`Product with id "${productId}" not found`)
  }

  // Get or create Stripe customer
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id, email")
    .eq("id", user.id)
    .single()

  let customerId = profile?.stripe_customer_id

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email || profile?.email,
      metadata: {
        supabase_user_id: user.id,
      },
    })
    customerId = customer.id

    // Save customer ID
    await supabase.from("profiles").update({ stripe_customer_id: customerId }).eq("id", user.id)
  }

  const headersList = await headers()
  const origin = headersList.get("origin") || "https://defrag.app"

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    customer: customerId,
    mode: "subscription",
    line_items: [
      {
        price: product.priceId,
        quantity: 1,
      },
    ],
    subscription_data: {
      metadata: {
        supabase_user_id: user.id,
        tier: product.tier,
      },
    },
    return_url: `${origin}/settings/billing?session_id={CHECKOUT_SESSION_ID}`,
    redirect_on_completion: "never",
  })

  return session.client_secret
}

export async function createCustomerPortalSession() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const { data: profile } = await supabase.from("profiles").select("stripe_customer_id").eq("id", user.id).single()

  if (!profile?.stripe_customer_id) {
    throw new Error("No subscription found")
  }

  const headersList = await headers()
  const origin = headersList.get("origin") || "https://defrag.app"

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${origin}/settings/billing`,
  })

  return session.url
}

export async function handleSubscriptionUpdate(subscriptionId: string, customerId: string, priceId: string) {
  const supabase = await createClient()

  // Get user from customer ID
  const { data: profile } = await supabase.from("profiles").select("id").eq("stripe_customer_id", customerId).single()

  if (!profile) {
    console.error("No profile found for customer:", customerId)
    return
  }

  // Get tier from price ID
  const product = getProductByPriceId(priceId)
  const tier = product?.tier || "passive"

  // Update profile
  await supabase
    .from("profiles")
    .update({
      stripe_subscription_id: subscriptionId,
      tier,
      updated_at: new Date().toISOString(),
    })
    .eq("id", profile.id)
}
