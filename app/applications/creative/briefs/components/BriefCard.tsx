"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Calendar as CalendarIcon, ChevronRight, Flag, AlertTriangle, CheckCircle2 } from "lucide-react"
import { format, differenceInDays } from "date-fns"
import { cn } from "@/lib/utils"
import type { Brief, BriefStatus, Priority } from "../types"

// ============================================
// STATUS CONFIG
// ============================================
const getStatusConfig = (status: BriefStatus) => {
  const config: Record<BriefStatus, { label: string; color: string; dotColor: string }> = {
    draft: { label: "Nháp", color: "bg-gray-100 text-gray-700 border-gray-300", dotColor: "bg-gray-400" },
    pending: { label: "Chờ nhận", color: "bg-yellow-100 text-yellow-700 border-yellow-300", dotColor: "bg-yellow-500" },
    confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-700 border-blue-300", dotColor: "bg-blue-500" },
    in_progress: { label: "Đang thực hiện", color: "bg-blue-100 text-blue-700 border-blue-300", dotColor: "bg-blue-500" },
    waiting_design: { label: "Chờ Design", color: "bg-purple-100 text-purple-700 border-purple-300", dotColor: "bg-purple-500" },
    design_returned: { label: "Design trả về", color: "bg-orange-100 text-orange-700 border-orange-300", dotColor: "bg-orange-500" },
    design_done: { label: "Design Done", color: "bg-cyan-100 text-cyan-700 border-cyan-300", dotColor: "bg-cyan-500" },
    waiting_lead_review: { label: "Chờ Lead duyệt", color: "bg-indigo-100 text-indigo-700 border-indigo-300", dotColor: "bg-indigo-500" },
    waiting_ua_review: { label: "Chờ UA nghiệm thu", color: "bg-teal-100 text-teal-700 border-teal-300", dotColor: "bg-teal-500" },
    need_revision: { label: "Cần chỉnh sửa", color: "bg-orange-100 text-orange-700 border-orange-300", dotColor: "bg-orange-500" },
    completed: { label: "Hoàn thành", color: "bg-green-100 text-green-700 border-green-300", dotColor: "bg-green-500" },
    returned_to_ua: { label: "Trả về UA", color: "bg-red-100 text-red-700 border-red-300", dotColor: "bg-red-500" },
  }
  return config[status]
}

const getPriorityConfig = (priority: Priority) => {
  const config = {
    low: { label: "Thấp", color: "bg-gray-50 text-gray-600" },
    medium: { label: "Trung bình", color: "bg-blue-50 text-blue-600" },
    high: { label: "Cao", color: "bg-red-50 text-red-600" },
  }
  return config[priority]
}

// ============================================
// STATUS BADGE COMPONENT
// ============================================
export const StatusBadge = ({ status }: { status: BriefStatus }) => {
  const config = getStatusConfig(status)
  return <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", config.color)}>{config.label}</Badge>
}

// ============================================
// PRIORITY BADGE COMPONENT
// ============================================
export const PriorityBadge = ({ priority }: { priority: Priority }) => {
  const config = getPriorityConfig(priority)
  return (
    <Badge variant="secondary" className={cn("text-[10px] px-1.5 py-0 gap-0.5", config.color)}>
      <Flag className="h-2.5 w-2.5" />
      {config.label}
    </Badge>
  )
}

// ============================================
// DEADLINE DISPLAY COMPONENT
// ============================================
const DeadlineDisplay = ({ deadline, status }: { deadline: string; status: BriefStatus }) => {
  const [mounted, setMounted] = useState(false)
  const deadlineDate = new Date(deadline)

  // Only render dynamic date content on client to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Server render: just show formatted date
  if (!mounted) {
    return (
      <div className="text-xs flex items-center gap-1 text-muted-foreground">
        <CalendarIcon className="h-3 w-3" />
        <span>{format(deadlineDate, "dd/MM")}</span>
      </div>
    )
  }

  // Client render: show dynamic deadline info
  const now = new Date()
  const daysUntil = differenceInDays(deadlineDate, now)

  // Completed or returned_to_ua briefs don't need deadline warnings
  const isTerminal = status === "completed" || status === "returned_to_ua"

  const isOverdue = daysUntil < 0 && !isTerminal
  const isUrgent = daysUntil >= 0 && daysUntil <= 3 && !isTerminal
  const isNearDeadline = daysUntil > 3 && daysUntil <= 7 && !isTerminal

  const getDeadlineText = () => {
    if (isOverdue) {
      return `Quá hạn ${Math.abs(daysUntil)} ngày`
    }
    if (daysUntil === 0) {
      return "Hôm nay"
    }
    if (daysUntil === 1) {
      return "Ngày mai"
    }
    if (isUrgent || isNearDeadline) {
      return `Còn ${daysUntil} ngày`
    }
    return format(deadlineDate, "dd/MM")
  }

  return (
    <div className={cn(
      "text-xs flex items-center gap-1",
      isOverdue && "text-red-600 font-semibold",
      isUrgent && !isOverdue && "text-orange-600 font-medium",
      isNearDeadline && "text-yellow-600",
      !isOverdue && !isUrgent && !isNearDeadline && "text-muted-foreground"
    )}>
      {isOverdue && <AlertTriangle className="h-3 w-3" />}
      {!isOverdue && <CalendarIcon className="h-3 w-3" />}
      <span>{getDeadlineText()}</span>
    </div>
  )
}

// ============================================
// BRIEF CARD PROPS
// ============================================
interface BriefCardProps {
  brief: Brief
  isSelected: boolean
  onClick: () => void
  onAcceptClick?: (brief: Brief) => void
}

// ============================================
// BRIEF CARD COMPONENT
// ============================================
export function BriefCard({ brief, isSelected, onClick, onAcceptClick }: BriefCardProps) {
  const [mounted, setMounted] = useState(false)
  const statusConfig = getStatusConfig(brief.status)
  const isPending = brief.status === "pending"

  // Only calculate date-based styling on client to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const daysUntilDeadline = mounted ? differenceInDays(new Date(brief.deadline), new Date()) : 999
  const isOverdue = mounted && daysUntilDeadline < 0 && brief.status !== "completed" && brief.status !== "returned_to_ua"
  const isUrgent = mounted && daysUntilDeadline >= 0 && daysUntilDeadline <= 3 && brief.status !== "completed" && brief.status !== "returned_to_ua"

  return (
    <div
      className={cn(
        "p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md border-l-4",
        isSelected ? "ring-2 ring-blue-500 bg-blue-50/50" : "hover:bg-gray-50",
        statusConfig.dotColor.replace("bg-", "border-l-"),
        isOverdue && "bg-red-50/30 dark:bg-red-950/20",
        isUrgent && !isOverdue && "bg-orange-50/30 dark:bg-orange-950/20"
      )}
      onClick={onClick}
    >
      {/* Title & Priority */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm line-clamp-2">{brief.title}</h4>
          {brief.priority === "high" && (
            <Badge variant="destructive" className="text-[9px] px-1 py-0 mt-1">
              <Flag className="h-2 w-2 mr-0.5" />
              Ưu tiên cao
            </Badge>
          )}
        </div>
        <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
      </div>

      {/* App/Campaign */}
      <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
        {brief.appCampaign}
      </p>

      {/* Status & Deadline */}
      <div className="flex items-center justify-between">
        <StatusBadge status={brief.status} />
        <DeadlineDisplay deadline={brief.deadline} status={brief.status} />
      </div>

      {/* Accept Brief Button - Only for pending status */}
      {isPending && onAcceptClick && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onAcceptClick(brief)
          }}
          className="mt-2 w-full py-1.5 px-3 text-xs font-medium bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors flex items-center justify-center gap-1.5"
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          Nhận Brief
        </button>
      )}

      {/* Overdue/Urgent Warning Bar */}
      {(isOverdue || isUrgent) && (
        <div className={cn(
          "mt-2 -mx-3 -mb-3 px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 rounded-b-lg",
          isOverdue ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" : "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
        )}>
          <AlertTriangle className="h-3 w-3" />
          {isOverdue ? "Brief đã quá hạn!" : "Deadline sắp tới!"}
        </div>
      )}
    </div>
  )
}

export default BriefCard
