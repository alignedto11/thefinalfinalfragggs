export interface Product {
  id: string
  priceId: string
  name: string
  description: string
  priceInCents: number
  tier: "guided" | "active"
  features: string[]
  recommended?: boolean
}

export const PRODUCTS: Product[] = [
  {
    id: "defrag-guided",
    priceId: "price_1SogXyCyj0ivvGCkY5auR5Yn",
    name: "Guided",
    description: "Structured reflection with voice guidance",
    priceInCents: 900,
    tier: "guided",
    features: ["Everything in Passive", "Voice-guided briefings", "Spiral event tracking", "Constellation mapping"],
    recommended: true,
  },
  {
    id: "defrag-active",
    priceId: "price_1SogXyCyj0ivvGCkk82zMezs",
    name: "Active",
    description: "Full integration with AI action proposals",
    priceInCents: 1900,
    tier: "active",
    features: [
      "Everything in Guided",
      "AI action proposals",
      "Priority timing windows",
      "Apple Wallet card",
      "Ask synthesis interface",
    ],
  },
]

export function getProductByTier(tier: string): Product | undefined {
  return PRODUCTS.find((p) => p.tier === tier)
}

export function getProductByPriceId(priceId: string): Product | undefined {
  return PRODUCTS.find((p) => p.priceId === priceId)
}
