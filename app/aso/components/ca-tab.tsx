import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TableSkeleton } from "./table-skeleton"

export function CATab() {
  return (
    <div className="space-y-4">
      {/* Distribution & Impact */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="rounded-2xl shadow-[0_4px_16px_rgba(16,24,40,.06)]">
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <Skeleton className="h-[200px] w-[200px] rounded-full" />
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-[0_4px_16px_rgba(16,24,40,.06)]">
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-24 mb-2" />
            <Skeleton className="h-4 w-16 mb-4" />
            <Skeleton className="h-[120px] w-full" />
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-[0_4px_16px_rgba(16,24,40,.06)]">
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-24 mb-2" />
            <Skeleton className="h-4 w-16 mb-4" />
            <Skeleton className="h-[120px] w-full" />
          </CardContent>
        </Card>
      </div>

      {/* Breakdown Tables */}
      <div className="grid grid-cols-2 gap-4">
        <TableSkeleton title="Breakdown by Market" rows={5} columns={4} />
        <TableSkeleton title="Breakdown by Device" rows={5} columns={4} />
      </div>
    </div>
  )
}
