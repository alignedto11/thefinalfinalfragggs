"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { createSubscriptionCheckout } from "@/app/actions/stripe"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface SubscribeButtonProps {
  productId: string
  label: string
}

export function SubscribeButton({ productId, label }: SubscribeButtonProps) {
  const [open, setOpen] = useState(false)

  const fetchClientSecret = useCallback(() => {
    return createSubscriptionCheckout(productId)
  }, [productId])

  return (
    <>
      <Button className="w-full" onClick={() => setOpen(true)}>
        {label}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Complete your subscription</DialogTitle>
          </DialogHeader>
          <div className="min-h-[400px]">
            <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
