import { Card, CardContent } from "@/components/ui/card"
import { Clock } from "lucide-react"

interface Window {
  label: string
  time: string
  description: string
}

interface WindowCardProps {
  windows: Window[]
}

export function WindowCard({ windows }: WindowCardProps) {
  if (windows.length === 0) {
    return (
      <Card className="border-border/50">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">No optimal windows identified for now.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50">
      <CardContent className="p-4">
        <div className="mb-3 flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Timing windows</span>
        </div>
        <div className="space-y-3">
          {windows.map((window, index) => (
            <div key={index} className="flex items-start gap-3 border-l-2 border-border pl-3">
              <div className="flex-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-medium">{window.label}</span>
                  <span className="text-xs text-muted-foreground">{window.time}</span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{window.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
