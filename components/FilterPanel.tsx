"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { X } from "lucide-react"

export function FilterPanel() {
  return (
    <div className="w-[280px] border-r bg-white overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Filters</h3>
          <Button variant="ghost" size="sm">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <Separator />
        
        {/* Date Range Quick Select */}
        <div>
          <Label className="text-sm font-semibold mb-3">Thời gian</Label>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              Hôm nay
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              Tuần này
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              Tháng này
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              Tùy chỉnh...
            </Button>
          </div>
        </div>
        
        {/* Status Filter */}
        <div>
          <Label className="text-sm font-semibold mb-3">Trạng thái</Label>
          <div className="space-y-2">
            <div className="flex items-center">
              <Checkbox id="status-pending" />
              <Label htmlFor="status-pending" className="ml-2 text-sm cursor-pointer">
                ⏳ Chờ xử lý
              </Label>
            </div>
            <div className="flex items-center">
              <Checkbox id="status-progress" />
              <Label htmlFor="status-progress" className="ml-2 text-sm cursor-pointer">
                🔄 Đang làm
              </Label>
            </div>
            <div className="flex items-center">
              <Checkbox id="status-review" />
              <Label htmlFor="status-review" className="ml-2 text-sm cursor-pointer">
                👀 Review
              </Label>
            </div>
            <div className="flex items-center">
              <Checkbox id="status-overdue" />
              <Label htmlFor="status-overdue" className="ml-2 text-sm cursor-pointer">
                ⚠️ Quá hạn
              </Label>
            </div>
          </div>
        </div>
        
        {/* Priority Filter */}
        <div>
          <Label className="text-sm font-semibold mb-3">Độ ưu tiên</Label>
          <div className="space-y-2">
            <div className="flex items-center">
              <Checkbox id="priority-urgent" />
              <Label htmlFor="priority-urgent" className="ml-2 text-sm cursor-pointer">
                🔴 Urgent
              </Label>
            </div>
            <div className="flex items-center">
              <Checkbox id="priority-high" />
              <Label htmlFor="priority-high" className="ml-2 text-sm cursor-pointer">
                🟠 High
              </Label>
            </div>
            <div className="flex items-center">
              <Checkbox id="priority-medium" />
              <Label htmlFor="priority-medium" className="ml-2 text-sm cursor-pointer">
                🟡 Medium
              </Label>
            </div>
            <div className="flex items-center">
              <Checkbox id="priority-low" />
              <Label htmlFor="priority-low" className="ml-2 text-sm cursor-pointer">
                🟢 Low
              </Label>
            </div>
          </div>
        </div>
        
        {/* Assignee Filter */}
        <div>
          <Label className="text-sm font-semibold mb-3">Người phụ trách</Label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            <div className="flex items-center">
              <Checkbox id="assignee-me" />
              <Label htmlFor="assignee-me" className="ml-2 text-sm cursor-pointer">
                Chỉ task của tôi
              </Label>
            </div>
            {/* Dynamic list of team members */}
          </div>
        </div>
        
        {/* App/Campaign Filter */}
        <div>
          <Label className="text-sm font-semibold mb-3">App/Campaign</Label>
          <div className="space-y-2">
            {/* Dynamic list */}
          </div>
        </div>
        
        {/* Clear Button */}
        <Button variant="outline" size="sm" className="w-full">
          <X className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </div>
    </div>
  )
}
