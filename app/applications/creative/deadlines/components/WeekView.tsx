"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Clock, AlertTriangle, CheckCircle2, Image as ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Task } from "../types"
import { PRIORITY_CONFIG, TYPE_CONFIG } from "../types"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { teamMembers } from "../mockData"

interface WeekViewProps {
    tasks: Task[]
    onSelectTask: (task: Task) => void
    selectedTask?: Task | null
}

export function WeekView({ tasks, onSelectTask, selectedTask }: WeekViewProps) {
    const [weekStart, setWeekStart] = useState(() => {
        const today = new Date()
        const dayOfWeek = today.getDay()
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek // Monday start
        const monday = new Date(today)
        monday.setDate(today.getDate() + diff)
        monday.setHours(0, 0, 0, 0)
        return monday
    })

    const getWeekDays = () => {
        const days = []
        for (let i = 0; i < 7; i++) {
            const day = new Date(weekStart)
            day.setDate(weekStart.getDate() + i)
            days.push(day)
        }
        return days
    }

    const weekDays = getWeekDays()

    const previousWeek = () => {
        setWeekStart(prev => {
            const newDate = new Date(prev)
            newDate.setDate(prev.getDate() - 7)
            return newDate
        })
    }

    const nextWeek = () => {
        setWeekStart(prev => {
            const newDate = new Date(prev)
            newDate.setDate(prev.getDate() + 7)
            return newDate
        })
    }

    const goToCurrentWeek = () => {
        const today = new Date()
        const dayOfWeek = today.getDay()
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
        const monday = new Date(today)
        monday.setDate(today.getDate() + diff)
        monday.setHours(0, 0, 0, 0)
        setWeekStart(monday)
    }

    const getTasksForDate = (date: Date) => {
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
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
        } else {
            return 'bg-gradient-to-r from-blue-100 to-blue-50 border-blue-400 text-blue-800'
        }
    }

    const getDeadlineIcon = (task: Task) => {
        if (task.status === 'completed') {
            return <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
        }

        const now = new Date()
        now.setHours(0, 0, 0, 0)
        const deadline = new Date(task.deadline)
        deadline.setHours(0, 0, 0, 0)
        const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

        if (diffDays < 0) {
            return <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
        } else if (diffDays <= 1) {
            return <Clock className="h-4 w-4 text-orange-600 flex-shrink-0" />
        }
        return null
    }

    const isToday = (date: Date) => {
        const today = new Date()
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
    }

    const formatWeekRange = () => {
        const endDate = new Date(weekStart)
        endDate.setDate(weekStart.getDate() + 6)
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }
        return `${weekStart.toLocaleDateString('vi-VN', options)} - ${endDate.toLocaleDateString('vi-VN', options)}, ${weekStart.getFullYear()}`
    }

    const getPriorityBadge = (priority: Task['priority']) => {
        const config = PRIORITY_CONFIG[priority]
        return (
            <Badge className={cn("text-[10px] px-1.5 py-0 h-4", config.badgeClass)}>
                {config.icon} {config.label}
            </Badge>
        )
    }

    return (
        <TooltipProvider>
            <div className="p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl md:text-2xl font-bold">
                        {formatWeekRange()}
                    </h2>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={previousWeek}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={goToCurrentWeek}>
                            Tuần này
                        </Button>
                        <Button variant="outline" size="sm" onClick={nextWeek}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Week Grid */}
                <div className="grid grid-cols-7 gap-2 md:gap-4">
                    {weekDays.map((day, idx) => {
                        const dayTasks = getTasksForDate(day)
                        const todayClass = isToday(day) ? "ring-2 ring-blue-500 bg-blue-50" : ""
                        const isWeekend = idx >= 5

                        return (
                            <div
                                key={idx}
                                className={cn(
                                    "bg-white border rounded-xl p-2 md:p-4 min-h-[200px] md:min-h-[320px]",
                                    "shadow-sm hover:shadow-md transition-shadow duration-300",
                                    todayClass,
                                    isWeekend && "bg-gray-50"
                                )}
                            >
                                {/* Day Header */}
                                <div className="text-center mb-3 pb-2 border-b">
                                    <div className={cn(
                                        "text-xs font-medium uppercase tracking-wide",
                                        isWeekend ? "text-purple-500" : "text-gray-500"
                                    )}>
                                        {day.toLocaleDateString('vi-VN', { weekday: 'short' })}
                                    </div>
                                    <div className={cn(
                                        "text-lg md:text-2xl font-bold",
                                        isToday(day) && "bg-blue-500 text-white rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center mx-auto"
                                    )}>
                                        {day.getDate()}
                                    </div>
                                </div>

                                {/* Tasks */}
                                <div className="space-y-2.5 overflow-y-auto max-h-[150px] md:max-h-[240px]">
                                    {dayTasks.length === 0 ? (
                                        <div className="text-center py-4 text-gray-400 text-xs">
                                            Không có task
                                        </div>
                                    ) : (
                                        dayTasks.map(task => (
                                            <Tooltip key={task.id}>
                                                <TooltipTrigger asChild>
                                                    <div
                                                        className={cn(
                                                            "p-2.5 rounded-lg border-2 cursor-pointer",
                                                            "transition-all duration-200 hover:scale-[1.02] hover:-translate-y-0.5",
                                                            "text-sm font-medium", // Increased from text-xs
                                                            selectedTask?.id === task.id && "ring-2 ring-purple-500",
                                                            getDeadlineColor(task)
                                                        )}
                                                        onClick={() => onSelectTask(task)}
                                                    >
                                                        {/* Task header with icon */}
                                                        <div className="flex items-start gap-1.5 mb-1.5">
                                                            {getDeadlineIcon(task)}
                                                            <span className="line-clamp-2 leading-tight font-semibold">{task.title}</span>
                                                        </div>

                                                        {/* Priority badge */}
                                                        <div className="flex items-center gap-1 mt-1.5">
                                                            {getPriorityBadge(task.priority)}
                                                            {task.thumbnail && (
                                                                <span className="text-xs opacity-60">
                                                                    <ImageIcon className="h-3 w-3 inline" />
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Assignee */}
                                                        <div className="mt-2 text-[11px] opacity-70 flex items-center gap-1">
                                                            <span className="bg-white/50 rounded-full px-1.5 py-0.5">
                                                                {teamMembers.find(m => task.assignedTo.includes(m.id))?.avatar || 'N/A'}
                                                            </span>
                                                            {task.format && (
                                                                <span className="text-[10px] bg-white/50 rounded px-1">
                                                                    {task.format}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent side="bottom" className="max-w-xs p-0 overflow-hidden">
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
                                                        {task.description && (
                                                            <div className="text-xs mt-1 text-gray-600">{task.description}</div>
                                                        )}
                                                        <div className="flex gap-1 mt-2">
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
                                                            {new Date(task.deadline).toLocaleDateString('vi-VN', {
                                                                weekday: 'long',
                                                                day: 'numeric',
                                                                month: 'long'
                                                            })}
                                                        </div>
                                                    </div>
                                                </TooltipContent>
                                            </Tooltip>
                                        ))
                                    )}
                                </div>

                                {/* Task count badge */}
                                {dayTasks.length > 0 && (
                                    <div className="mt-2 pt-2 border-t text-center">
                                        <Badge variant="secondary" className="text-xs">
                                            {dayTasks.length} task{dayTasks.length > 1 ? 's' : ''}
                                        </Badge>
                                    </div>
                                )}
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
                        <div className="w-4 h-4 rounded bg-gradient-to-r from-blue-400 to-blue-200 border border-blue-400" />
                        <span>Đang xử lý</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-gradient-to-r from-green-400 to-green-200 border border-green-400" />
                        <span>Hoàn thành</span>
                    </div>
                </div>
            </div>
        </TooltipProvider>
    )
}
