"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { AlertTriangle, CheckCircle2, Clock, TrendingUp, Users, Calendar, Zap } from "lucide-react"
import type { Task, WorkloadSummary } from "../types"
import { teamMembers } from "../mockData"

interface StatsSectionProps {
    tasks: Task[]
    workload: WorkloadSummary[]
}

export function StatsSection({ tasks, workload }: StatsSectionProps) {
    // Calculate stats
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const twoDaysLater = new Date(today)
    twoDaysLater.setDate(twoDaysLater.getDate() + 2)

    const overdueTasks = tasks.filter(t => {
        const deadline = new Date(t.deadline)
        return deadline < today && t.status !== 'completed'
    })

    const dueTodayTasks = tasks.filter(t => {
        const deadline = new Date(t.deadline)
        deadline.setHours(0, 0, 0, 0)
        return deadline.getTime() === today.getTime() && t.status !== 'completed'
    })

    const nearDeadlineTasks = tasks.filter(t => {
        const deadline = new Date(t.deadline)
        deadline.setHours(0, 0, 0, 0)
        return deadline > today && deadline <= twoDaysLater && t.status !== 'completed'
    })

    const completedTasks = tasks.filter(t => t.status === 'completed')
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress')

    const stats = [
        {
            title: "Quá hạn",
            value: overdueTasks.length,
            icon: AlertTriangle,
            color: "text-red-600",
            bgColor: "bg-gradient-to-br from-red-50 to-red-100",
            borderColor: "border-red-200",
            iconBg: "bg-red-100"
        },
        {
            title: "Hôm nay",
            value: dueTodayTasks.length,
            icon: Zap,
            color: "text-orange-600",
            bgColor: "bg-gradient-to-br from-orange-50 to-orange-100",
            borderColor: "border-orange-200",
            iconBg: "bg-orange-100"
        },
        {
            title: "Cận hạn (2 ngày)",
            value: nearDeadlineTasks.length,
            icon: Clock,
            color: "text-amber-600",
            bgColor: "bg-gradient-to-br from-amber-50 to-amber-100",
            borderColor: "border-amber-200",
            iconBg: "bg-amber-100"
        },
        {
            title: "Đang thực hiện",
            value: inProgressTasks.length,
            icon: TrendingUp,
            color: "text-blue-600",
            bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
            borderColor: "border-blue-200",
            iconBg: "bg-blue-100"
        },
        {
            title: "Hoàn thành",
            value: completedTasks.length,
            icon: CheckCircle2,
            color: "text-green-600",
            bgColor: "bg-gradient-to-br from-green-50 to-green-100",
            borderColor: "border-green-200",
            iconBg: "bg-green-100"
        },
    ]

    return (
        <div className="p-6 space-y-6 bg-gradient-to-b from-gray-50 to-white">
            {/* Summary Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {stats.map((stat) => (
                    <Card
                        key={stat.title}
                        className={cn(
                            "border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer",
                            stat.bgColor,
                            stat.borderColor
                        )}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.title}</p>
                                    <p className={cn("text-3xl font-bold mt-1", stat.color)}>{stat.value}</p>
                                </div>
                                <div className={cn("p-3 rounded-xl", stat.iconBg)}>
                                    <stat.icon className={cn("h-6 w-6", stat.color)} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Workload by Designer */}
            <Card className="border-2 border-gray-200 shadow-sm">
                <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-purple-500" />
                        <CardTitle className="text-lg font-bold">Tải suất Designer</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        {workload.map((w) => {
                            const member = teamMembers.find(m => m.id === w.userId)
                            const utilizationColor = w.utilizationRate > 80 ? "red" : w.utilizationRate > 60 ? "orange" : "green"

                            return (
                                <div
                                    key={w.userId}
                                    className="bg-white border-2 border-gray-100 rounded-xl p-4 hover:shadow-md hover:border-purple-200 transition-all duration-300"
                                >
                                    {/* Header */}
                                    <div className="flex items-center gap-3 mb-3">
                                        <Avatar className="h-10 w-10 ring-2 ring-purple-100">
                                            <AvatarFallback className="bg-gradient-to-br from-purple-400 to-blue-500 text-white font-bold text-sm">
                                                {w.avatar}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm truncate">{w.userName}</p>
                                            <p className="text-xs text-gray-500">{w.totalTasks} tasks</p>
                                        </div>
                                    </div>

                                    {/* Utilization */}
                                    <div className="space-y-2 mb-3">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-gray-500">Tải suất</span>
                                            <span className={cn(
                                                "font-bold px-2 py-0.5 rounded-full",
                                                utilizationColor === "red" && "bg-red-100 text-red-700",
                                                utilizationColor === "orange" && "bg-orange-100 text-orange-700",
                                                utilizationColor === "green" && "bg-green-100 text-green-700",
                                            )}>
                                                {w.utilizationRate}%
                                            </span>
                                        </div>
                                        <Progress
                                            value={w.utilizationRate}
                                            className={cn(
                                                "h-2",
                                                utilizationColor === "red" && "[&>div]:bg-red-500",
                                                utilizationColor === "orange" && "[&>div]:bg-orange-500",
                                                utilizationColor === "green" && "[&>div]:bg-green-500",
                                            )}
                                        />
                                    </div>

                                    {/* Status breakdown */}
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="flex items-center gap-1">
                                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                                            <span className="text-gray-500">Đang làm:</span>
                                            <span className="font-semibold">{w.byStatus.in_progress}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className="w-2 h-2 rounded-full bg-purple-500" />
                                            <span className="text-gray-500">Review:</span>
                                            <span className="font-semibold">{w.byStatus.review}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className="w-2 h-2 rounded-full bg-gray-400" />
                                            <span className="text-gray-500">Chờ:</span>
                                            <span className="font-semibold">{w.byStatus.pending}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className="w-2 h-2 rounded-full bg-green-500" />
                                            <span className="text-gray-500">Xong:</span>
                                            <span className="font-semibold">{w.byStatus.completed}</span>
                                        </div>
                                    </div>

                                    {/* Overdue warning */}
                                    {w.overdueCount > 0 && (
                                        <div className="mt-3 pt-3 border-t border-red-100">
                                            <Badge variant="destructive" className="w-full justify-center gap-1 py-1">
                                                <AlertTriangle className="h-3 w-3" />
                                                {w.overdueCount} quá hạn
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
