import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-lg px-4 py-12 space-y-8">
      {/* Mandala skeleton - dual for comparison */}
      <div className="flex flex-col items-center gap-12 py-4">
        <Skeleton className="h-64 w-64 rounded-full" />
        <Skeleton className="h-32 w-32 rounded-full opacity-60" />
      </div>

      {/* State card skeleton */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-24" />
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-5 w-20" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Brief card skeleton */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>

      {/* Window card skeleton */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-28" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </CardContent>
      </Card>
    </div>
  )
}

export function SpiralSkeleton() {
  return (
    <div className="mx-auto max-w-lg px-4 py-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-4 w-48" />
      </div>

      <Skeleton className="h-11 w-full rounded-lg" />

      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-border/50">
            <CardContent className="pt-4 space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function ConstellationsSkeleton() {
  return (
    <div className="mx-auto max-w-lg px-4 py-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-4 w-56" />
      </div>

      <Skeleton className="h-11 w-full rounded-lg" />

      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-border/50">
            <CardContent className="pt-4 flex flex-col items-center space-y-3">
              <Skeleton className="h-16 w-16 rounded-full" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
