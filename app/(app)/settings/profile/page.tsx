import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, User } from "lucide-react"
import Link from "next/link"
import { revalidatePath } from "next/cache"

async function updateProfile(formData: FormData) {
  "use server"

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const displayName = formData.get("displayName") as string
  const birthDate = formData.get("birthDate") as string
  const birthTime = formData.get("birthTime") as string
  const birthLocation = formData.get("birthLocation") as string

  await supabase
    .from("profiles")
    .update({
      display_name: displayName || null,
      birth_date: birthDate || null,
      birth_time: birthTime || null,
      birth_location: birthLocation || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)

  revalidatePath("/settings/profile")
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/settings"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Settings
        </Link>
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-xl font-medium">Profile</h1>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Your calibration data. This information helps compute your baseline pattern.
        </p>
      </div>

      <form action={updateProfile}>
        <div className="space-y-6">
          {/* Account Info */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Account</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Email</Label>
                <p className="text-sm">{user.email}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayName">Display name</Label>
                <Input
                  id="displayName"
                  name="displayName"
                  defaultValue={profile?.display_name || ""}
                  placeholder="Your name"
                  className="h-11"
                />
              </div>
            </CardContent>
          </Card>

          {/* Calibration Data */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Calibration Data</CardTitle>
              <CardDescription>Used to compute your baseline pattern. All fields are optional.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="birthDate">Birth date</Label>
                <Input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  defaultValue={profile?.birth_date || ""}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthTime">
                  Birth time <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id="birthTime"
                  name="birthTime"
                  type="time"
                  defaultValue={profile?.birth_time || ""}
                  className="h-11"
                />
                <p className="text-xs text-muted-foreground">If unknown, the system uses a reasonable default.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthLocation">
                  Birth location <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id="birthLocation"
                  name="birthLocation"
                  type="text"
                  placeholder="City, Country"
                  defaultValue={profile?.birth_location || ""}
                  className="h-11"
                />
              </div>
            </CardContent>
          </Card>

          {/* Save button */}
          <Button type="submit" className="w-full h-11">
            Save changes
          </Button>

          {/* Privacy note */}
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-xs text-muted-foreground text-center">
              Your data is stored securely and never shared.
              <br />
              You can export or delete it anytime from Settings.
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}
