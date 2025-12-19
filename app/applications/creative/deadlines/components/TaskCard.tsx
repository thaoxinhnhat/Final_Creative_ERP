"use client"

import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Clock, ChevronRight } from "lucide-react"
import { format, formatDistanceToNow, isPast, isToday, isTomorrow } from "date-fns"
import { vi } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { Task } from "../types"
import { STATUS_CONFIG, PRIORITY_CONFIG, TYPE_CONFIG } from "../types"
import { teamMembers } from "../mockData"

interface TaskCardProps { task: Task; onClick: () => void }

export function TaskCard({ task, onClick }: TaskCardProps) {
  const statusConfig = STATUS_CONFIG[task.status], priorityConfig = PRIORITY_CONFIG[task.priority], typeConfig = TYPE_CONFIG[task.type]
  const deadline = new Date(task.deadline), isOverdue = isPast(deadline) && task.status !== 'completed', isDueToday = isToday(deadline), isDueTomorrow = isTomorrow(deadline)
  const getDeadlineText = () => { if (isOverdue) return `Quá hạn ${formatDistanceToNow(deadline, { locale: vi })}`; if (isDueToday) return "Hôm nay"; if (isDueTomorrow) return "Ngày mai"; return format(deadline, "dd/MM/yyyy") }
  const getDeadlineColor = () => { if (isOverdue) return "text-red-600"; if (isDueToday) return "text-orange-600"; if (isDueTomorrow) return "text-yellow-600"; return "text-muted-foreground" }

  return (
    <div className={cn("bg-white dark:bg-gray-900 border rounded-lg p-4 hover:shadow-md transition cursor-pointer group", isOverdue && "border-red-200 bg-red-50/50", isDueToday && !isOverdue && "border-orange-200 bg-orange-50/50")} onClick={onClick}>
      <div className="flex items-start gap-3">
        <div className={cn("p-2 rounded-lg text-lg", typeConfig.color)}>{typeConfig.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-medium text-sm truncate">{task.title}</h3>
            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition flex-shrink-0" />
          </div>
          <p className="text-xs text-muted-foreground mb-2">{task.appName} {task.campaignName && `• ${task.campaignName}`}</p>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant="secondary" className={cn("text-xs", statusConfig.color)}>{statusConfig.icon} {statusConfig.label}</Badge>
            <Badge variant="outline" className={cn("text-xs", priorityConfig.color)}>{priorityConfig.icon} {priorityConfig.label}</Badge>
          </div>
          {task.status !== 'pending' && task.status !== 'completed' && (
            <div className="flex items-center gap-2 mb-2"><Progress value={task.progress} className="h-1.5 flex-1" /><span className="text-xs text-muted-foreground w-8">{task.progress}%</span></div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              {task.assignedTo.slice(0, 3).map(id => { const member = teamMembers.find(m => m.id === id); return member ? <Avatar key={id} className="h-6 w-6 border-2 border-white"><AvatarFallback className="text-[10px] bg-blue-100 text-blue-700">{member.avatar}</AvatarFallback></Avatar> : null })}
              {task.assignedTo.length > 3 && <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] border-2 border-white">+{task.assignedTo.length - 3}</div>}
            </div>
            <div className={cn("flex items-center gap-1 text-xs", getDeadlineColor())}><Clock className="h-3 w-3" />{getDeadlineText()}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
