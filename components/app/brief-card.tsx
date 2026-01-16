import { Card, CardContent } from "@/components/ui/card"

interface BriefCardProps {
  title: string
  brief: string
}

export function BriefCard({ title, brief }: BriefCardProps) {
  return (
    <Card className="border-border/50">
      <CardContent className="p-4">
        <h3 className="text-sm font-medium">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{brief}</p>
      </CardContent>
    </Card>
  )
}
