"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { WorkloadSummary } from "../types"

interface WorkloadViewProps { workload: WorkloadSummary[] }

export function WorkloadView({ workload }: WorkloadViewProps) {
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-lg font-semibold">Workload Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workload.map(w => (
          <div key={w.userId} className="bg-white dark:bg-gray-900 border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-10 w-10"><AvatarFallback className="bg-blue-100 text-blue-700 font-medium">{w.avatar}</AvatarFallback></Avatar>
              <div className="flex-1 min-w-0"><p className="font-medium truncate">{w.userName}</p><p className="text-xs text-muted-foreground">{w.totalTasks} tasks</p></div>
              {w.overdueCount > 0 && <Badge variant="destructive" className="h-5 px-1.5">{w.overdueCount} quá hạn</Badge>}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">Utilization</span><span className={cn("font-medium", w.utilizationRate > 80 ? "text-red-600" : w.utilizationRate > 60 ? "text-yellow-600" : "text-green-600")}>{w.utilizationRate}%</span></div>
              <Progress value={w.utilizationRate} className={cn("h-2", w.utilizationRate > 80 ? "[&>div]:bg-red-500" : w.utilizationRate > 60 ? "[&>div]:bg-yellow-500" : "[&>div]:bg-green-500")} />
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
              <div className="text-center"><p className="text-muted-foreground">Pending</p><p className="font-medium">{w.byStatus.pending}</p></div>
              <div className="text-center"><p className="text-muted-foreground">In Progress</p><p className="font-medium text-blue-600">{w.byStatus.in_progress}</p></div>
              <div className="text-center"><p className="text-muted-foreground">Review</p><p className="font-medium text-purple-600">{w.byStatus.review}</p></div>
              <div className="text-center"><p className="text-muted-foreground">Done</p><p className="font-medium text-green-600">{w.byStatus.completed}</p></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
