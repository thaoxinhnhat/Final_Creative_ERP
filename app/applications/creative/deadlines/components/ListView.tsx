"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Clock, AlertCircle, AlertTriangle, CheckCircle2, Users, CalendarClock, MoreHorizontal, Image as ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Task } from "../types"
import { PRIORITY_CONFIG, TYPE_CONFIG } from "../types"
import { teamMembers } from "../mockData"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ListViewProps {
  onSelectTask: (task: Task) => void
  tasks: Task[]
}

export function ListView({ onSelectTask, tasks }: ListViewProps) {
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set())
  const [hoveredTask, setHoveredTask] = useState<string | null>(null)

  const getDeadlineInfo = (task: Task) => {
    if (task.status === 'completed') {
      return {
        label: 'Hoàn thành',
        color: 'text-green-600 bg-green-50 border-green-200',
        icon: CheckCircle2,
        iconColor: 'text-green-600'
      }
    }

    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const deadline = new Date(task.deadline)
    deadline.setHours(0, 0, 0, 0)
    const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return {
        label: `Quá hạn ${Math.abs(diffDays)} ngày`,
        color: 'text-red-700 bg-red-50 border-red-200',
        icon: AlertTriangle,
        iconColor: 'text-red-600'
      }
    }
    if (diffDays === 0) {
      return {
        label: 'Hết hạn hôm nay',
        color: 'text-orange-700 bg-orange-50 border-orange-200',
        icon: Clock,
        iconColor: 'text-orange-600'
      }
    }
    if (diffDays === 1) {
      return {
        label: 'Hết hạn ngày mai',
        color: 'text-orange-600 bg-orange-50 border-orange-200',
        icon: Clock,
        iconColor: 'text-orange-500'
      }
    }
    if (diffDays <= 3) {
      return {
        label: `Còn ${diffDays} ngày`,
        color: 'text-amber-700 bg-amber-50 border-amber-200',
        icon: Clock,
        iconColor: 'text-amber-600'
      }
    }
    return {
      label: `Còn ${diffDays} ngày`,
      color: 'text-blue-700 bg-blue-50 border-blue-200',
      icon: Clock,
      iconColor: 'text-blue-500'
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      overdue: { className: 'bg-red-100 text-red-700 border-red-200', label: 'Quá hạn' },
      pending: { className: 'bg-gray-100 text-gray-700 border-gray-200', label: 'Chờ xử lý' },
      in_progress: { className: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Đang làm' },
      review: { className: 'bg-purple-100 text-purple-700 border-purple-200', label: 'Review' },
      completed: { className: 'bg-green-100 text-green-700 border-green-200', label: 'Hoàn thành' }
    }
    return variants[status as keyof typeof variants] || variants.pending
  }

  // Group tasks by deadline status
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const groupedTasks = {
    overdue: tasks.filter(t => {
      const deadline = new Date(t.deadline)
      deadline.setHours(0, 0, 0, 0)
      return deadline < today && t.status !== 'completed'
    }),
    today: tasks.filter(t => {
      const deadline = new Date(t.deadline)
      deadline.setHours(0, 0, 0, 0)
      return deadline.getTime() === today.getTime() && t.status !== 'completed'
    }),
    upcoming: tasks.filter(t => {
      const deadline = new Date(t.deadline)
      deadline.setHours(0, 0, 0, 0)
      return deadline > today && t.status !== 'completed'
    }),
    completed: tasks.filter(t => t.status === 'completed')
  }

  // Get assignees for task
  const getAssignees = (task: Task) => {
    return teamMembers.filter(m => task.assignedTo.includes(m.id))
  }

  // Toggle task selection
  const toggleTaskSelection = (taskId: string) => {
    setSelectedTasks(prev => {
      const next = new Set(prev)
      if (next.has(taskId)) {
        next.delete(taskId)
      } else {
        next.add(taskId)
      }
      return next
    })
  }

  // Toggle all in group
  const toggleAllInGroup = (taskList: Task[]) => {
    const allSelected = taskList.every(t => selectedTasks.has(t.id))
    setSelectedTasks(prev => {
      const next = new Set(prev)
      if (allSelected) {
        taskList.forEach(t => next.delete(t.id))
      } else {
        taskList.forEach(t => next.add(t.id))
      }
      return next
    })
  }

  // Clear selection
  const clearSelection = () => {
    setSelectedTasks(new Set())
  }

  // Quick actions
  const handleReassign = (taskId: string) => {
    console.log('Reassign task:', taskId)
    // TODO: Open reassign modal
  }

  const handleExtendDeadline = (taskId: string) => {
    console.log('Extend deadline:', taskId)
    // TODO: Open date picker modal
  }

  // Bulk actions
  const handleBulkReassign = () => {
    console.log('Bulk reassign:', Array.from(selectedTasks))
    // TODO: Open bulk reassign modal
  }

  const handleBulkExtend = () => {
    console.log('Bulk extend:', Array.from(selectedTasks))
    // TODO: Open bulk extend modal
  }

  const handleBulkComplete = () => {
    console.log('Bulk complete:', Array.from(selectedTasks))
    clearSelection()
    // TODO: Mark tasks as complete
  }

  const renderTaskList = (title: string, taskList: Task[], color: string, icon: string, showBulkSelect = false) => {
    if (taskList.length === 0) return null
    const allSelected = taskList.every(t => selectedTasks.has(t.id))

    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">{icon}</span>
          <h3 className={cn("font-semibold text-lg", color)}>{title}</h3>
          <Badge variant="secondary" className="rounded-full px-3">
            {taskList.length}
          </Badge>
          {showBulkSelect && taskList.length > 1 && (
            <button
              onClick={() => toggleAllInGroup(taskList)}
              className="ml-auto text-xs text-blue-600 hover:text-blue-800"
            >
              {allSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
            </button>
          )}
        </div>
        <div className="space-y-3">
          {taskList.map(task => {
            const deadlineInfo = getDeadlineInfo(task)
            const statusBadge = getStatusBadge(task.status)
            const assignees = getAssignees(task)
            const isSelected = selectedTasks.has(task.id)
            const isHovered = hoveredTask === task.id

            return (
              <div
                key={task.id}
                className={cn(
                  "bg-white border-2 rounded-xl p-4 cursor-pointer",
                  "transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5",
                  isSelected ? "border-purple-400 bg-purple-50/50" : "hover:border-purple-200",
                  "relative"
                )}
                onClick={() => onSelectTask(task)}
                onMouseEnter={() => setHoveredTask(task.id)}
                onMouseLeave={() => setHoveredTask(null)}
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <div
                    className="pt-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleTaskSelection(task.id)
                    }}
                  >
                    <Checkbox checked={isSelected} />
                  </div>

                  {/* Thumbnail */}
                  <div className="flex-shrink-0">
                    {task.thumbnail ? (
                      <img
                        src={task.thumbnail}
                        alt={task.title}
                        className="w-16 h-16 rounded-lg object-cover shadow-sm"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Title row */}
                    <div className="flex items-start gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900 text-base">{task.title}</h4>
                    </div>

                    {/* Badges row */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge className={cn("border", statusBadge.className)}>
                        {statusBadge.label}
                      </Badge>
                      <Badge className={cn(PRIORITY_CONFIG[task.priority].badgeClass)}>
                        {PRIORITY_CONFIG[task.priority].icon} {PRIORITY_CONFIG[task.priority].label}
                      </Badge>
                      <Badge className={cn(TYPE_CONFIG[task.type].badgeClass)}>
                        {TYPE_CONFIG[task.type].icon} {TYPE_CONFIG[task.type].label}
                      </Badge>
                    </div>

                    {/* Info row */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="font-medium">{task.appName}</span>
                      {task.campaignName && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span>{task.campaignName}</span>
                        </>
                      )}
                      {task.format && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span className="text-blue-600">{task.format}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right side - deadline & assignees */}
                  <div className="flex flex-col items-end gap-2">
                    {/* Deadline badge */}
                    <div className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium",
                      deadlineInfo.color
                    )}>
                      <deadlineInfo.icon className={cn("h-4 w-4", deadlineInfo.iconColor)} />
                      {deadlineInfo.label}
                    </div>

                    {/* Assignees */}
                    <div className="flex -space-x-2">
                      {assignees.slice(0, 3).map((member) => (
                        <Avatar key={member.id} className="h-8 w-8 border-2 border-white ring-1 ring-gray-100">
                          <AvatarFallback className="bg-gradient-to-br from-purple-400 to-blue-500 text-white text-xs font-bold">
                            {member.avatar}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {assignees.length > 3 && (
                        <div className="h-8 w-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium">
                          +{assignees.length - 3}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Actions - shown on hover */}
                  {(isHovered || isSelected) && (
                    <div className="absolute right-4 top-4 flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-xs gap-1 bg-white shadow-sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleReassign(task.id)
                        }}
                      >
                        <Users className="h-3 w-3" />
                        Giao lại
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-xs gap-1 bg-white shadow-sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleExtendDeadline(task.id)
                        }}
                      >
                        <CalendarClock className="h-3 w-3" />
                        Gia hạn
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0 bg-white shadow-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>Đánh dấu hoàn thành</DropdownMenuItem>
                          <DropdownMenuItem>Sao chép task</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Xóa task</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>

                {/* Progress bar */}
                {task.progress > 0 && (
                  <div className="mt-3 pt-3 border-t ml-8">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                      <span>Tiến độ</span>
                      <span className="font-bold">{task.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className={cn(
                          "h-2 rounded-full transition-all duration-500",
                          task.progress === 100 && "bg-green-500",
                          task.progress >= 50 && task.progress < 100 && "bg-blue-500",
                          task.progress < 50 && "bg-orange-500",
                        )}
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-white min-h-full relative pb-24">
      {renderTaskList("Quá hạn", groupedTasks.overdue, "text-red-600", "🔴", true)}
      {renderTaskList("Hôm nay", groupedTasks.today, "text-orange-600", "🟠", true)}
      {renderTaskList("Sắp tới", groupedTasks.upcoming, "text-blue-600", "🔵", false)}
      {renderTaskList("Hoàn thành", groupedTasks.completed, "text-green-600", "🟢", false)}

      {tasks.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-gray-500 font-medium">Không có task nào</p>
          <p className="text-gray-400 text-sm mt-1">Thử thay đổi bộ lọc để xem các task khác</p>
        </div>
      )}

      {/* Legend */}
      <div className="mt-8 pt-6 border-t">
        <h4 className="text-sm font-semibold text-gray-500 mb-3">Chú thích màu deadline:</h4>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span>Quá hạn</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span>Hôm nay / Ngày mai</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span>Cận hạn (2-3 ngày)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Bình thường</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span>Hoàn thành</span>
          </div>
        </div>
      </div>

      {/* Bulk Action Bar - Fixed at bottom when tasks are selected */}
      {selectedTasks.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-white rounded-xl shadow-2xl border-2 border-purple-200 px-6 py-3 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-purple-600">
                ✓ {selectedTasks.size}
              </Badge>
              <span className="text-sm font-medium">tasks đã chọn</span>
            </div>
            <div className="w-px h-6 bg-gray-200" />
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={handleBulkReassign}
              >
                <Users className="h-4 w-4" />
                Giao lại tất cả
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={handleBulkExtend}
              >
                <CalendarClock className="h-4 w-4" />
                Gia hạn tất cả
              </Button>
              <Button
                variant="default"
                size="sm"
                className="gap-1 bg-green-600 hover:bg-green-700"
                onClick={handleBulkComplete}
              >
                <CheckCircle2 className="h-4 w-4" />
                Hoàn thành
              </Button>
            </div>
            <div className="w-px h-6 bg-gray-200" />
            <button
              className="text-gray-400 hover:text-gray-600 text-sm"
              onClick={clearSelection}
            >
              ✕ Bỏ chọn
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
