"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { X, CalendarDays, Filter, User, Flag, Layers, Check } from "lucide-react"
import type { TaskStatus, TaskPriority } from "../types"
import { STATUS_CONFIG, PRIORITY_CONFIG } from "../types"
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
  selectedDateRange?: string
  onSelectDateRange?: (range: string) => void
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
  selectedDateRange,
  onSelectDateRange,
}: FilterPanelProps) {
  const [localDateRange, setLocalDateRange] = useState<string | undefined>(selectedDateRange)
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
            {[
              { id: "today", label: "📅 Hôm nay" },
              { id: "week", label: "📆 Tuần này" },
              { id: "month", label: "🗓️ Tháng này" },
              { id: "all", label: "📋 Tất cả" },
            ].map((item) => {
              const isSelected = localDateRange === item.id
              return (
                <Button
                  key={item.id}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "w-full justify-start border transition-colors duration-200 rounded-lg",
                    isSelected
                      ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                      : "hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
                  )}
                  onClick={() => {
                    setLocalDateRange(item.id)
                    onSelectDateRange?.(item.id)
                  }}
                >
                  {item.label}
                  {isSelected && <Check className="h-4 w-4 ml-auto" />}
                </Button>
              )
            })}
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
            {(["pending", "in_progress", "review", "overdue", "completed"] as TaskStatus[]).map((status) => {
              const config = STATUS_CONFIG[status]
              const isChecked = selectedStatuses.includes(status)
              return (
                <div
                  className={cn(
                    "flex items-center p-2 rounded-lg cursor-pointer transition-all duration-200",
                    isChecked ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"
                  )}
                  key={status}
                  onClick={() => onToggleStatus(status)}
                >
                  <div className={cn(
                    "w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200",
                    isChecked
                      ? "bg-purple-600 border-purple-600"
                      : "border-gray-300 bg-white"
                  )}>
                    {isChecked && <Check className="h-3.5 w-3.5 text-white stroke-[3]" />}
                  </div>
                  <Label
                    className="ml-2 text-sm cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{config.icon}</span>
                    <span className={isChecked ? "font-medium" : ""}>{config.label}</span>
                  </Label>
                </div>
              )
            })}
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
            {(["urgent", "high", "medium", "low"] as TaskPriority[]).map((priority) => {
              const config = PRIORITY_CONFIG[priority]
              const isChecked = selectedPriorities.includes(priority)
              return (
                <div
                  className={cn(
                    "flex items-center p-2 rounded-lg cursor-pointer transition-all duration-200",
                    isChecked ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"
                  )}
                  key={priority}
                  onClick={() => onTogglePriority(priority)}
                >
                  <div className={cn(
                    "w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200",
                    isChecked
                      ? "bg-purple-600 border-purple-600"
                      : "border-gray-300 bg-white"
                  )}>
                    {isChecked && <Check className="h-3.5 w-3.5 text-white stroke-[3]" />}
                  </div>
                  <Label
                    className="ml-2 text-sm cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{config.icon}</span>
                    <span className={isChecked ? "font-medium" : ""}>{config.label}</span>
                  </Label>
                </div>
              )
            })}
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
            {teamMembers.map((member) => {
              const isChecked = selectedAssignees.includes(member.id)
              return (
                <div
                  className={cn(
                    "flex items-center p-2 rounded-lg cursor-pointer transition-all duration-200",
                    isChecked ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"
                  )}
                  key={member.id}
                  onClick={() => onToggleAssignee(member.id)}
                >
                  <div className={cn(
                    "w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200",
                    isChecked
                      ? "bg-purple-600 border-purple-600"
                      : "border-gray-300 bg-white"
                  )}>
                    {isChecked && <Check className="h-3.5 w-3.5 text-white stroke-[3]" />}
                  </div>
                  <Label className="ml-2 text-sm cursor-pointer">
                    <span className={isChecked ? "font-medium" : ""}>{member.name}</span>
                  </Label>
                </div>
              )
            })}
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
