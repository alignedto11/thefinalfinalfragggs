import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/onboarding"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Create profile if it doesn't exist
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("id, onboarding_completed")
          .eq("id", user.id)
          .single()

        if (!existingProfile) {
          let hash = 0
          for (let i = 0; i < user.id.length; i++) {
            const char = user.id.charCodeAt(i)
            hash = (hash << 5) - hash + char
            hash = hash & hash
          }
          const seed = Math.abs(hash) / 2147483647

          await supabase.from("profiles").insert({
            id: user.id,
            seed,
            tier: "passive",
            onboarding_completed: false,
          })
          // New user - go to onboarding
          return NextResponse.redirect(`${origin}/onboarding`)
        } else if (!existingProfile.onboarding_completed) {
          // Existing user who hasn't completed onboarding
          return NextResponse.redirect(`${origin}/onboarding`)
        }
        return NextResponse.redirect(`${origin}/dashboard`)
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return to error page on failure
  return NextResponse.redirect(`${origin}/auth/error`)
}
