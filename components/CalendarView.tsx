"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Task } from "../app/applications/creative/deadlines/types"
import { mockTasks } from "../mockData"

interface CalendarViewProps {
  onSelectTask: (task: Task) => void
}

export function CalendarView({ onSelectTask }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  
  // Use mockTasks for demo
  const tasks: Task[] = mockTasks
  
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
      overdue: 'bg-red-100 border-red-300',
      pending: 'bg-orange-100 border-orange-300',
      in_progress: 'bg-blue-100 border-blue-300',
      review: 'bg-purple-100 border-purple-300',
      completed: 'bg-green-100 border-green-300'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100'
  }
  
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }
  
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }
  
  return (
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
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-semibold text-sm text-muted-foreground p-2">
            {day}
          </div>
        ))}
        
        {/* Empty cells before first day */}
        {Array.from({ length: startingDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="border rounded-lg p-2 bg-gray-50" />
        ))}
        
        {/* Days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const dayTasks = getTasksForDate(day)
          const isToday = new Date().getDate() === day && 
                         new Date().getMonth() === currentDate.getMonth() &&
                         new Date().getFullYear() === currentDate.getFullYear()
          
          return (
            <div
              key={day}
              className={cn(
                "border rounded-lg p-2 min-h-[120px] hover:shadow-md transition",
                isToday && "ring-2 ring-blue-500"
              )}
            >
              <div className="font-semibold text-sm mb-2">{day}</div>
              <div className="space-y-1">
                {dayTasks.slice(0, 3).map(task => (
                  <div
                    key={task.id}
                    className={cn(
                      "text-xs p-1 rounded border cursor-pointer truncate",
                      getStatusColor(task.status)
                    )}
                    onClick={() => onSelectTask(task)}
                  >
                    {task.title}
                  </div>
                ))}
                {dayTasks.length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    +{dayTasks.length - 3} more
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Legend */}
      <div className="mt-6 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-100 border border-red-300" />
          <span>Overdue</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-orange-100 border border-orange-300" />
          <span>Due Soon</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-100 border-green-300 border" />
          <span>Complete</span>
        </div>
      </div>
    </div>
  )
}
