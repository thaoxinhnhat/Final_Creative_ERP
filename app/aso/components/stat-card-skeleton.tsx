import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function StatCardSkeleton() {
  return (
    <Card className="rounded-2xl shadow-[0_4px_16px_rgba(16,24,40,.06)]">
      <CardContent className="p-4">
        <Skeleton className="h-4 w-32 mb-3" />
        <Skeleton className="h-8 w-24 mb-2" />
        <Skeleton className="h-3 w-16" />
      </CardContent>
    </Card>
  )
}
