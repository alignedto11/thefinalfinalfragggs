import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, CreditCard, User, Database, Trash2, ChevronRight } from "lucide-react"
import Link from "next/link"
import { SignOutButton } from "@/components/app/sign-out-button"

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const tierLabels: Record<string, string> = {
    passive: "Passive (Free)",
    guided: "Guided ($9/mo)",
    active: "Active ($19/mo)",
  }

  const settingsLinks = [
    {
      href: "/settings/profile",
      icon: User,
      title: "Profile",
      description: "Name and calibration data",
    },
    {
      href: "/settings/billing",
      icon: CreditCard,
      title: "Subscription",
      description: tierLabels[profile?.tier || "passive"],
    },
  ]

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-xl font-medium">Settings</h1>
        </div>
      </div>

      <div className="space-y-6">
        {/* Settings links */}
        <div className="space-y-2">
          {settingsLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Card className="border-border/50 hover:bg-muted/30 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center">
                    <link.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{link.title}</p>
                    <p className="text-xs text-muted-foreground">{link.description}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Data & Privacy */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">Data & Privacy</CardTitle>
            </div>
            <CardDescription>Your data belongs to you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
              <Link href="/settings/data">
                <Database className="mr-2 h-4 w-4" />
                Export my data
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent text-destructive hover:text-destructive"
              asChild
            >
              <Link href="/settings/delete">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete my account
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Account info */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm">{user.email}</p>
            </div>
            {profile?.display_name && (
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="text-sm">{profile.display_name}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sign out */}
        <SignOutButton />

        {/* Trust reminder */}
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-xs text-muted-foreground text-center">
            Structured self-reflection. Not predictive. Not diagnostic.
            <br />
            Not a substitute for professional care.
          </p>
        </div>

        {/* Version */}
        <p className="text-center text-xs text-muted-foreground/50">DEFRAG v1.0.0</p>
      </div>
    </div>
  )
}
