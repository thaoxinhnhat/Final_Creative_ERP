import { StatCardSkeleton } from "./stat-card-skeleton"
import { ChartCardSkeleton } from "./chart-card-skeleton"

export function OverviewTab() {
  return (
    <div className="space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* Performance Overview */}
      <ChartCardSkeleton title="Performance Overview" subtitle="Impressions vs Installs" height={360} />

      {/* CVR & Rating */}
      <div className="grid grid-cols-2 gap-4">
        <ChartCardSkeleton title="Conversion Rate Trend" height={280} />
        <ChartCardSkeleton title="Rating Trend" height={280} />
      </div>

      {/* Visitors vs Acquisitions */}
      <ChartCardSkeleton title="Visitors vs Acquisitions" height={280} />
    </div>
  )
}
