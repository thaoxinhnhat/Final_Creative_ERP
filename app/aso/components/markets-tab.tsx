import { ChartCardSkeleton } from "./chart-card-skeleton"
import { TableSkeleton } from "./table-skeleton"

export function MarketsTab() {
  return (
    <div className="space-y-4">
      <ChartCardSkeleton title="Performance by Market" height={320} />
      <TableSkeleton title="Store Listing Conversion Analysis" rows={10} columns={7} />
    </div>
  )
}
