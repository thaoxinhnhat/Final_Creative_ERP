"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { X, CalendarDays, Filter, User, Flag, Layers } from "lucide-react"
import type { TaskStatus, TaskPriority } from "../types"
import { cn } from "@/lib/utils"

interface FilterPanelProps {
  selectedStatuses: TaskStatus[]
  selectedPriorities: TaskPriority[]
  selectedAssignees: string[]
  onToggleStatus: (status: TaskStatus) => void
  onTogglePriority: (priority: TaskPriority) => void
  onToggleAssignee: (assignee: string) => void
  onClearAll: () => void
  teamMembers: { id: string; name: string }[]
}

export function FilterPanel({
  selectedStatuses,
  selectedPriorities,
  selectedAssignees,
  onToggleStatus,
  onTogglePriority,
  onToggleAssignee,
  onClearAll,
  teamMembers,
}: FilterPanelProps) {
  const activeCount =
    selectedStatuses.length +
    selectedPriorities.length +
    selectedAssignees.length

  return (
    <div className="w-[280px] border-r bg-gradient-to-b from-white to-gray-50 shadow-lg overflow-y-auto">
      <div className="p-4 space-y-7">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-400" />
            <h3 className="font-bold text-lg tracking-tight">Bộ lọc</h3>
            {activeCount > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold transition">
                {activeCount} active
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className={cn(
              "rounded-full",
              activeCount > 0 && "text-red-600 font-bold"
            )}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <Separator className="bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 mb-2" />

        {/* Date Range Quick Select */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CalendarDays className="h-4 w-4 text-blue-400" />
            <Label className="text-base font-semibold">Thời gian</Label>
          </div>
          <div className="space-y-2">
            {["Hôm nay", "Tuần này", "Tháng này", "Tùy chỉnh..."].map((label, idx) => (
              <Button
                key={label}
                variant="outline"
                size="sm"
                className="w-full justify-start border transition-colors duration-200 rounded-lg
                  hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600
                  active:bg-blue-100 active:border-blue-400"
                disabled
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
        <Separator className="bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 my-2" />

        {/* Status Filter */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Flag className="h-4 w-4 text-orange-400" />
            <Label className="text-base font-semibold">Trạng thái</Label>
          </div>
          <div className="space-y-2">
            {/*
              { id: "pending", label: "⏳ Chờ xử lý" },
              { id: "in_progress", label: "🔄 Đang làm" },
              { id: "review", label: "👀 Review" },
              { id: "overdue", label: "⚠️ Quá hạn" },
              { id: "completed", label: "✅ Hoàn thành" },
            */}
            {["pending", "in_progress", "review", "overdue", "completed"].map((status) => (
              <div className="flex items-center" key={status}>
                <Checkbox
                  id={`status-${status}`}
                  checked={selectedStatuses.includes(status as TaskStatus)}
                  onCheckedChange={() => onToggleStatus(status as TaskStatus)}
                  className="w-5 h-5 border-2 border-gray-300 rounded-md data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-100 transition-colors duration-200"
                />
                <Label
                  htmlFor={`status-${status}`}
                  className="ml-2 text-sm cursor-pointer transition-colors duration-200 hover:text-blue-600"
                >
                  {status}
                </Label>
              </div>
            ))}
          </div>
        </div>
        <Separator className="bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 my-2" />

        {/* Priority Filter */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Layers className="h-4 w-4 text-red-400" />
            <Label className="text-base font-semibold">Độ ưu tiên</Label>
          </div>
          <div className="space-y-2">
            {/*
              { id: "urgent", label: "🔴 Urgent" },
              { id: "high", label: "🟠 High" },
              { id: "medium", label: "🟡 Medium" },
              { id: "low", label: "🟢 Low" },
            */}
            {["urgent", "high", "medium", "low"].map((priority) => (
              <div className="flex items-center" key={priority}>
                <Checkbox
                  id={`priority-${priority}`}
                  checked={selectedPriorities.includes(priority as TaskPriority)}
                  onCheckedChange={() => onTogglePriority(priority as TaskPriority)}
                  className="w-5 h-5 border-2 border-gray-300 rounded-md data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-100 transition-colors duration-200"
                />
                <Label
                  htmlFor={`priority-${priority}`}
                  className="ml-2 text-sm cursor-pointer transition-colors duration-200 hover:text-blue-600"
                >
                  {priority}
                </Label>
              </div>
            ))}
          </div>
        </div>
        <Separator className="bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 my-2" />

        {/* Assignee Filter */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <User className="h-4 w-4 text-green-400" />
            <Label className="text-base font-semibold">Người phụ trách</Label>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {teamMembers.map((member) => (
              <div className="flex items-center" key={member.id}>
                <Checkbox
                  id={`assignee-${member.id}`}
                  checked={selectedAssignees.includes(member.id)}
                  onCheckedChange={() => onToggleAssignee(member.id)}
                  className="w-5 h-5 border-2 border-gray-300 rounded-md data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-100 transition-colors duration-200"
                />
                <Label
                  htmlFor={`assignee-${member.id}`}
                  className="ml-2 text-sm cursor-pointer transition-colors duration-200 hover:text-blue-600"
                >
                  {member.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
        <Separator className="bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 my-2" />

        {/* Clear Button */}
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "w-full border border-red-200 font-semibold rounded-lg mt-2 transition-colors duration-200",
            activeCount > 0
              ? "text-red-700 bg-red-50 hover:bg-red-100"
              : "text-red-600"
          )}
          onClick={onClearAll}
        >
          <X className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </div>
    </div>
  )
}
