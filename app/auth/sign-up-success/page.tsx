import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mandala } from "@/components/mandala/mandala"
import { demoState } from "@/lib/state"
import { Mail } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center p-4">
      {/* Background mandala */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.04]">
        <div className="h-[600px] w-[600px]">
          <Mandala state={demoState} size="full" seed={0.42} />
        </div>
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-foreground" />
            <span className="text-lg font-medium tracking-tight">DEFRAG</span>
          </Link>
        </div>

        <Card className="border-border/50">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Mail className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl">Check your email</CardTitle>
            <CardDescription>We've sent you a confirmation link to verify your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-center">
              <p className="text-sm text-muted-foreground">
                Click the link in the email to complete your registration and begin your reflection practice.
              </p>

              <div className="pt-2">
                <Button variant="outline" asChild className="w-full bg-transparent">
                  <Link href="/auth/login">Return to sign in</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
