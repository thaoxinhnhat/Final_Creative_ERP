"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Info, Clock, Image as ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Task } from "../types"
import { PRIORITY_CONFIG, TYPE_CONFIG } from "../types"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { teamMembers } from "../mockData"

interface CalendarViewProps {
  onSelectTask: (task: Task) => void
  tasks: Task[]
  selectedTask?: Task | null
  loading?: boolean
}

export function CalendarView({ onSelectTask, tasks, selectedTask, loading }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    return { daysInMonth, startingDayOfWeek }
  }

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate)

  const getTasksForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return tasks.filter(t => t.deadline.startsWith(dateStr))
  }

  const getDeadlineColor = (task: Task) => {
    if (task.status === 'completed') {
      return 'bg-gradient-to-r from-green-100 to-green-50 border-green-400 text-green-800'
    }

    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const deadline = new Date(task.deadline)
    deadline.setHours(0, 0, 0, 0)
    const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return 'bg-gradient-to-r from-red-100 to-red-50 border-red-400 text-red-800'
    } else if (diffDays <= 1) {
      return 'bg-gradient-to-r from-orange-100 to-orange-50 border-orange-400 text-orange-800'
    } else if (diffDays <= 3) {
      return 'bg-gradient-to-r from-amber-100 to-amber-50 border-amber-400 text-amber-800'
    } else {
      return 'bg-gradient-to-r from-blue-100 to-blue-50 border-blue-400 text-blue-800'
    }
  }

  const getPriorityBadge = (priority: Task['priority']) => {
    const config = PRIORITY_CONFIG[priority]
    return (
      <Badge className={cn("text-[10px] px-1.5 py-0 h-4", config.badgeClass)}>
        {config.icon} {config.label}
      </Badge>
    )
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  // Helper for weekend
  const isWeekend = (colIdx: number) => colIdx === 0 || colIdx === 6

  // Skeleton loader for calendar cells
  const SkeletonCell = () => (
    <div className="bg-white border rounded-lg p-3 min-h-[120px] shadow-sm animate-pulse flex flex-col items-center justify-center">
      <div className="w-8 h-8 bg-gray-200 rounded-full mb-2" />
      <div className="w-16 h-3 bg-gray-200 rounded mb-1" />
      <div className="w-12 h-2 bg-gray-100 rounded" />
    </div>
  )

  return (
    <TooltipProvider>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {currentDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
              Hôm nay
            </Button>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Day headers */}
          {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day, idx) => (
            <div key={day} className={cn(
              "text-center font-semibold text-sm text-muted-foreground p-2",
              isWeekend(idx) && "bg-gradient-to-r from-pink-200 via-white to-blue-200 bg-clip-text text-transparent"
            )}>
              {day}
            </div>
          ))}
          {/* Empty cells before first day */}
          {Array.from({ length: startingDayOfWeek }).map((_, i) => (
            loading ? <SkeletonCell key={`empty-${i}`} /> :
              <div key={`empty-${i}`} className="bg-white border rounded-lg p-3 min-h-[120px] shadow-sm" />
          ))}
          {/* Days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const dayTasks = getTasksForDate(day)
            const colIdx = (startingDayOfWeek + i) % 7
            const isToday = new Date().getDate() === day &&
              new Date().getMonth() === currentDate.getMonth() &&
              new Date().getFullYear() === currentDate.getFullYear()
            return loading ? (
              <SkeletonCell key={day} />
            ) : (
              <div
                key={day}
                className={cn(
                  "bg-white border rounded-lg p-3 min-h-[120px]",
                  "shadow-sm hover:shadow-lg",
                  "transition-shadow duration-300 hover:bg-gray-50",
                  isToday && "ring-2 ring-blue-500 bg-blue-50",
                  isWeekend(colIdx) && "bg-gray-50",
                  "animate-fadein opacity-0"
                )}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="flex items-center justify-center mb-2">
                  <span className={cn(
                    "font-bold text-base",
                    isToday && "bg-blue-100 animate-pulse text-blue-700 rounded-full px-2 py-1",
                    isWeekend(colIdx) && "bg-gradient-to-r from-pink-400 via-blue-400 to-blue-600 bg-clip-text text-transparent"
                  )}>
                    {day}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {dayTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-xs text-gray-400 py-4">
                      <Info className="h-5 w-5 mb-1 text-gray-300" />
                      <span>No tasks</span>
                    </div>
                  ) : (
                    <>
                      {dayTasks.slice(0, 4).map(task => (
                        <Tooltip key={task.id}>
                          <TooltipTrigger asChild>
                            <div
                              className={cn(
                                "text-sm p-2 rounded-lg border-2 cursor-pointer",
                                "shadow-sm hover:shadow-md",
                                "transition-all duration-200",
                                "hover:scale-[1.02] hover:-translate-y-0.5",
                                "active:scale-[0.98]",
                                selectedTask?.id === task.id && "ring-2 ring-purple-500",
                                getDeadlineColor(task)
                              )}
                              onClick={() => onSelectTask(task)}
                              onKeyDown={e => {
                                if (e.key === "Enter" || e.key === " ") onSelectTask(task)
                              }}
                              tabIndex={0}
                            >
                              <div className="flex items-start gap-1.5">
                                {task.thumbnail && (
                                  <ImageIcon className="h-3 w-3 flex-shrink-0 mt-0.5 opacity-60" />
                                )}
                                <span className="font-medium line-clamp-1 leading-tight">
                                  {task.title}
                                </span>
                              </div>
                              <div className="mt-1 flex items-center gap-1">
                                {getPriorityBadge(task.priority)}
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="max-w-xs p-0 overflow-hidden">
                            {/* Thumbnail preview */}
                            {task.thumbnail && (
                              <div className="w-full h-32 bg-gray-100 relative">
                                <img
                                  src={task.thumbnail}
                                  alt={task.title}
                                  className="w-full h-full object-cover"
                                />
                                {task.format && (
                                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                                    {task.format}
                                  </span>
                                )}
                              </div>
                            )}
                            <div className="p-3">
                              <div className="font-semibold text-sm">{task.title}</div>
                              <div className="text-xs text-gray-500 mt-1">{task.appName}</div>
                              {task.campaignName && (
                                <div className="text-xs text-purple-600">📁 {task.campaignName}</div>
                              )}
                              <div className="flex gap-1 mt-2 flex-wrap">
                                {getPriorityBadge(task.priority)}
                                <Badge className={cn("text-[10px] h-4", TYPE_CONFIG[task.type].badgeClass)}>
                                  {TYPE_CONFIG[task.type].icon} {TYPE_CONFIG[task.type].label}
                                </Badge>
                              </div>
                              {task.platform && (
                                <div className="text-xs mt-2 text-blue-600">
                                  📱 {task.platform}
                                </div>
                              )}
                              <div className="text-xs mt-2 flex items-center gap-1 text-gray-500">
                                <Clock className="h-3 w-3" />
                                {(() => {
                                  const days = Math.ceil((new Date(task.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                                  if (days < 0) return `${Math.abs(days)} ngày quá hạn`
                                  if (days === 0) return 'Hết hạn hôm nay'
                                  if (days === 1) return 'Hết hạn ngày mai'
                                  return `Còn ${days} ngày`
                                })()}
                              </div>
                              {/* Assignees */}
                              <div className="mt-2 flex items-center gap-1">
                                <span className="text-[10px] text-gray-400">Assignee:</span>
                                {teamMembers.filter(m => task.assignedTo.includes(m.id)).slice(0, 2).map(m => (
                                  <span key={m.id} className="text-[10px] bg-gray-100 rounded px-1.5 py-0.5">
                                    {m.avatar}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                      {dayTasks.length > 4 && (
                        <div className="text-xs text-center text-muted-foreground bg-gray-50 rounded py-1">
                          +{dayTasks.length - 4} more
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        {/* Legend */}
        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-red-400 to-red-200 border border-red-400" />
            <span>Quá hạn</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-orange-400 to-orange-200 border border-orange-400" />
            <span>Hôm nay / Ngày mai</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-amber-400 to-amber-200 border border-amber-400" />
            <span>Cận hạn (2-3 ngày)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-blue-400 to-blue-200 border border-blue-400" />
            <span>Bình thường</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-green-400 to-green-200 border border-green-400" />
            <span>Hoàn thành</span>
          </div>
        </div>
        {/* Animation keyframes */}
        <style jsx global>{`
          @keyframes fadein {
            from { opacity: 0; transform: translateY(10px);}
            to { opacity: 1; transform: translateY(0);}
          }
          .animate-fadein { animation: fadein 0.3s forwards; }
        `}</style>
      </div>
    </TooltipProvider>
  )
}
