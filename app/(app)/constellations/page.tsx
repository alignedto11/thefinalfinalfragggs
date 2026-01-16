import { createClient } from "@/lib/supabase/server"
import { ConstellationList } from "@/components/app/constellation-list"
import { ConstellationAddButton } from "@/components/app/constellation-add-button"
import { Users } from "lucide-react"

export default async function ConstellationsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get user's constellations
  const { data: constellations } = await supabase
    .from("constellations")
    .select(`
      *,
      constellation_states(
        harmony,
        tension,
        distance,
        label,
        date
      )
    `)
    .eq("user_id", user?.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  // Get user tier
  const { data: profile } = await supabase.from("profiles").select("tier").eq("id", user?.id).single()

  const hasAccess = profile?.tier === "guided" || profile?.tier === "active"

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-xl font-medium">Connections</h1>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">Map your relational constellation. See weather, not blame.</p>
      </div>

      {hasAccess ? (
        <>
          {/* Add button */}
          <div className="mb-6">
            <ConstellationAddButton userId={user?.id || ""} />
          </div>

          {/* Constellation list */}
          {constellations && constellations.length > 0 ? (
            <ConstellationList constellations={constellations} />
          ) : (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-muted-foreground/30" />
              <h3 className="mt-4 text-sm font-medium">No connections yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">Add people to see relational context.</p>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-lg border border-border bg-muted/30 p-6 text-center">
          <Users className="mx-auto h-12 w-12 text-muted-foreground/30" />
          <h3 className="mt-4 font-medium">Upgrade for Connections</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Constellation mapping is available on Guided and Active tiers.
          </p>
          <a href="/settings/billing" className="mt-4 inline-block text-sm underline underline-offset-4">
            View plans
          </a>
        </div>
      )}
    </div>
  )
}
