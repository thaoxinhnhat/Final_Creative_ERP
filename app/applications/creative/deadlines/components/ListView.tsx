"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Clock, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Task } from "../types"

interface ListViewProps {
  onSelectTask: (task: Task) => void
  tasks: Task[]
}

export function ListView({ onSelectTask, tasks }: ListViewProps) {
  const getStatusBadge = (status: string) => {
    const variants = {
      overdue: { variant: 'destructive' as const, label: 'Quá hạn' },
      pending: { variant: 'secondary' as const, label: 'Chờ xử lý' },
      in_progress: { variant: 'default' as const, label: 'Đang làm' },
      review: { variant: 'outline' as const, label: 'Review' },
      completed: { variant: 'secondary' as const, label: 'Hoàn thành' }
    }
    return variants[status as keyof typeof variants] || variants.pending
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      urgent: 'text-red-600',
      high: 'text-orange-600',
      medium: 'text-yellow-600',
      low: 'text-green-600'
    }
    return colors[priority as keyof typeof colors]
  }

  const getDaysUntilDeadline = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    if (days < 0) return `${Math.abs(days)} days overdue`
    if (days === 0) return 'Due today'
    if (days === 1) return 'Due tomorrow'
    return `${days} days left`
  }

  const groupedTasks = {
    overdue: tasks.filter(t => t.status === 'overdue'),
    today: tasks.filter(t => {
      const deadline = new Date(t.deadline)
      const today = new Date()
      return deadline.toDateString() === today.toDateString()
    }),
    upcoming: tasks.filter(t => {
      const deadline = new Date(t.deadline)
      const today = new Date()
      return deadline > today && t.status !== 'completed'
    }),
    completed: tasks.filter(t => t.status === 'completed')
  }

  const renderTaskList = (title: string, tasks: Task[], color: string) => {
    if (tasks.length === 0) return null

    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <h3 className={cn("font-semibold", color)}>{title}</h3>
          <Badge variant="secondary">{tasks.length}</Badge>
        </div>
        <div className="space-y-2">
          {tasks.map(task => (
            <div
              key={task.id}
              className="bg-white border rounded-lg p-4 hover:shadow-md transition cursor-pointer hover:bg-blue-50"
              onClick={() => onSelectTask(task)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">{task.title}</h4>
                    <Badge {...getStatusBadge(task.status)}>
                      {getStatusBadge(task.status).label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{task.appName}</span>
                    {task.campaignName && <span>• {task.campaignName}</span>}
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {getDaysUntilDeadline(task.deadline)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={cn("flex items-center gap-1 text-sm", getPriorityColor(task.priority))}>
                    <AlertCircle className="h-4 w-4" />
                    {task.priority}
                  </div>
                  <div className="flex -space-x-2">
                    {task.assignedTo.slice(0, 3).map((_, i) => (
                      <Avatar key={i} className="h-8 w-8 border-2 border-white">
                        <AvatarFallback className="text-xs">U{i+1}</AvatarFallback>
                      </Avatar>
                    ))}
                    {task.assignedTo.length > 3 && (
                      <div key={`more-${task.id}`} className="h-8 w-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
                        +{task.assignedTo.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {task.progress > 0 && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span>{task.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {renderTaskList("⚠️ Overdue", groupedTasks.overdue, "text-red-600")}
      {renderTaskList("📅 Due Today", groupedTasks.today, "text-orange-600")}
      {renderTaskList("🔜 Upcoming", groupedTasks.upcoming, "text-blue-600")}
      {renderTaskList("✅ Completed", groupedTasks.completed, "text-green-600")}
      {tasks.length === 0 && (
        <div className="text-center text-gray-400 py-12">No tasks found</div>
      )}
    </div>
  )
}
