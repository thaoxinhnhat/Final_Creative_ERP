import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface ChartCardSkeletonProps {
  title: string
  subtitle?: string
  height: number
}

export function ChartCardSkeleton({ title, subtitle, height }: ChartCardSkeletonProps) {
  return (
    <Card className="rounded-2xl shadow-[0_4px_16px_rgba(16,24,40,.06)]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-5 w-48 mb-1" />
            {subtitle && <Skeleton className="h-4 w-32" />}
          </div>
          <Skeleton className="h-9 w-32" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className={`w-full rounded-lg`} style={{ height: `${height}px` }} />
      </CardContent>
    </Card>
  )
}
