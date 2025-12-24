import { TableSkeleton } from "./table-skeleton"

export function KeywordsTab() {
  return (
    <div className="space-y-4">
      <TableSkeleton title="Top Keywords Performance" rows={10} columns={6} />
    </div>
  )
}
