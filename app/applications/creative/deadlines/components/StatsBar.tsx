"use client"

import { AlertTriangle, Clock, CheckCircle2, Eye, Loader2 } from "lucide-react"
import type { Task } from "../types"
import { getTaskStats } from "../mockData"

interface StatsBarProps { tasks: Task[] }

export function StatsBar({ tasks }: StatsBarProps) {
  const stats = getTaskStats(tasks)
  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b text-sm">
      <div className="flex items-center gap-1.5 text-red-600"><AlertTriangle className="h-4 w-4" /><span className="font-medium">{stats.overdue}</span><span className="text-muted-foreground">Quá hạn</span></div>
      <div className="w-px h-4 bg-gray-300" />
      <div className="flex items-center gap-1.5 text-orange-600"><Clock className="h-4 w-4" /><span className="font-medium">{stats.dueToday}</span><span className="text-muted-foreground">Hôm nay</span></div>
      <div className="w-px h-4 bg-gray-300" />
      <div className="flex items-center gap-1.5 text-yellow-600"><Clock className="h-4 w-4" /><span className="font-medium">{stats.dueTomorrow}</span><span className="text-muted-foreground">Ngày mai</span></div>
      <div className="w-px h-4 bg-gray-300" />
      <div className="flex items-center gap-1.5 text-blue-600"><Loader2 className="h-4 w-4" /><span className="font-medium">{stats.inProgress}</span><span className="text-muted-foreground">Đang làm</span></div>
      <div className="w-px h-4 bg-gray-300" />
      <div className="flex items-center gap-1.5 text-purple-600"><Eye className="h-4 w-4" /><span className="font-medium">{stats.inReview}</span><span className="text-muted-foreground">Review</span></div>
      <div className="w-px h-4 bg-gray-300" />
      <div className="flex items-center gap-1.5 text-green-600"><CheckCircle2 className="h-4 w-4" /><span className="font-medium">{stats.completed}</span><span className="text-muted-foreground">Hoàn thành</span></div>
    </div>
  )
}
