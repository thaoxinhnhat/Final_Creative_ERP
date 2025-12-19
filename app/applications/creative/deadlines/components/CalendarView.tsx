"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Task } from "../types"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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

  const getStatusColor = (status: string) => {
    const colors = {
      overdue: 'bg-gradient-to-r from-red-200 to-red-100 border-red-400',
      pending: 'bg-gradient-to-r from-orange-200 to-orange-100 border-orange-400',
      in_progress: 'bg-gradient-to-r from-blue-200 to-blue-100 border-blue-400',
      review: 'bg-gradient-to-r from-purple-200 to-purple-100 border-purple-400',
      completed: 'bg-gradient-to-r from-green-200 to-green-100 border-green-400'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100'
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
                <div className="space-y-1">
                  {dayTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-xs text-gray-400 py-4">
                      <Info className="h-5 w-5 mb-1 text-gray-300" />
                      <span>No tasks</span>
                    </div>
                  ) : (
                    <>
                      {dayTasks.slice(0, 5).map(task => (
                        <Tooltip key={task.id}>
                          <TooltipTrigger asChild>
                            <div
                              key={task.id}
                              className={cn(
                                "text-xs p-2 rounded-md border cursor-pointer",
                                "shadow-sm hover:shadow-md",
                                "transition-all duration-200",
                                "hover:scale-[1.02] hover:-translate-y-0.5",
                                "active:scale-[0.98]",
                                selectedTask?.id === task.id && "ring-2 ring-blue-500 font-semibold",
                                getStatusColor(task.status)
                              )}
                              tabIndex={0}
                              title={task.title}
                              onClick={() => onSelectTask(task)}
                              onKeyDown={e => {
                                if (e.key === "Enter" || e.key === " ") onSelectTask(task)
                              }}
                              aria-label={`Task: ${task.title}`}
                            >
                              {task.title.length > 22 ? task.title.slice(0, 20) + "…" : task.title}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="font-semibold">{task.title}</div>
                            <div className="text-xs text-muted-foreground">
                              Deadline: {new Date(task.deadline).toLocaleDateString("vi-VN")}
                            </div>
                            <div className="text-xs text-blue-600">
                              {(() => {
                                const days = Math.ceil((new Date(task.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                                if (days < 0) return `${Math.abs(days)} ngày quá hạn`
                                if (days === 0) return 'Hết hạn hôm nay'
                                if (days === 1) return 'Hết hạn ngày mai'
                                return `Còn ${days} ngày`
                              })()}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                      {dayTasks.length > 5 && (
                        <div key={`more-${day}`} className="text-xs text-muted-foreground">
                          +{dayTasks.length - 5} more
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
        <div className="mt-6 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-red-400 to-red-200 border border-red-400" />
            <span>Quá hạn</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-orange-400 to-orange-200 border-orange-400 border" />
            <span>Sắp đến hạn</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-green-400 to-green-200 border-green-300 border" />
            <span>Hoàn thành</span>
          </div>
        </div>
        {/* Animation keyframes (add to global CSS if not present) */}
        <style jsx global>{`
          @keyframes fadein {
            from { opacity: 0; transform: translateY(10px);}
            to { opacity: 1; transform: translateY(0);}
          }
          .animate-fadein { animation: fadein 0.3s forwards; }
          .animate-pulse { animation: pulse 1.2s infinite; }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
        `}</style>
      </div>
    </TooltipProvider>
  )
}
