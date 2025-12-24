"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, X } from "lucide-react"
import type { DeadlineFilters, TaskStatus, TaskPriority, TaskType } from "../types"
import { STATUS_CONFIG, PRIORITY_CONFIG, TYPE_CONFIG } from "../types"

interface TaskFiltersProps { filters: DeadlineFilters; onUpdateFilters: (updates: Partial<DeadlineFilters>) => void; onResetFilters: () => void; onToggleFilter: <K extends keyof DeadlineFilters>(key: K, value: any) => void; activeFilterCount: number; teamMembers: { id: string; name: string; avatar: string }[]; apps: string[] }

export function TaskFilters({ filters, onUpdateFilters, onResetFilters, onToggleFilter, activeFilterCount, teamMembers, apps }: TaskFiltersProps) {
  return (
    <div className="w-[260px] border-r bg-white dark:bg-gray-900 flex-shrink-0 flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-5">
          <div><Label className="text-xs font-semibold mb-2 block">Tìm kiếm</Label><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Tên task..." className="pl-9 h-9" value={filters.search} onChange={(e) => onUpdateFilters({ search: e.target.value })} /></div></div>
          <div><Label className="text-xs font-semibold mb-2 block">Trạng thái</Label><div className="space-y-1.5">{(Object.keys(STATUS_CONFIG) as TaskStatus[]).map(status => <div key={status} className="flex items-center"><Checkbox id={`status-${status}`} checked={filters.status.includes(status)} onCheckedChange={() => onToggleFilter('status', status)} /><Label htmlFor={`status-${status}`} className="ml-2 text-sm cursor-pointer">{STATUS_CONFIG[status].icon} {STATUS_CONFIG[status].label}</Label></div>)}</div></div>
          <div><Label className="text-xs font-semibold mb-2 block">Độ ưu tiên</Label><div className="space-y-1.5">{(Object.keys(PRIORITY_CONFIG) as TaskPriority[]).map(priority => <div key={priority} className="flex items-center"><Checkbox id={`priority-${priority}`} checked={filters.priority.includes(priority)} onCheckedChange={() => onToggleFilter('priority', priority)} /><Label htmlFor={`priority-${priority}`} className="ml-2 text-sm cursor-pointer">{PRIORITY_CONFIG[priority].icon} {PRIORITY_CONFIG[priority].label}</Label></div>)}</div></div>
          <div><Label className="text-xs font-semibold mb-2 block">Loại task</Label><div className="space-y-1.5">{(Object.keys(TYPE_CONFIG) as TaskType[]).map(type => <div key={type} className="flex items-center"><Checkbox id={`type-${type}`} checked={filters.taskType.includes(type)} onCheckedChange={() => onToggleFilter('taskType', type)} /><Label htmlFor={`type-${type}`} className="ml-2 text-sm cursor-pointer">{TYPE_CONFIG[type].icon} {TYPE_CONFIG[type].label}</Label></div>)}</div></div>
          <div><Label className="text-xs font-semibold mb-2 block">Người thực hiện</Label><div className="space-y-1.5 max-h-32 overflow-y-auto">{teamMembers.map(m => <div key={m.id} className="flex items-center"><Checkbox id={`member-${m.id}`} checked={filters.assignees.includes(m.id)} onCheckedChange={() => onToggleFilter('assignees', m.id)} /><Label htmlFor={`member-${m.id}`} className="ml-2 text-sm cursor-pointer truncate">{m.name}</Label></div>)}</div></div>
          <div><Label className="text-xs font-semibold mb-2 block">App</Label><div className="space-y-1.5">{apps.map(app => <div key={app} className="flex items-center"><Checkbox id={`app-${app}`} checked={filters.apps.includes(app)} onCheckedChange={() => onToggleFilter('apps', app)} /><Label htmlFor={`app-${app}`} className="ml-2 text-sm cursor-pointer truncate">{app}</Label></div>)}</div></div>
          <div><Label className="text-xs font-semibold mb-2 block">Deadline</Label><div className="space-y-2"><Input type="date" className="h-9" value={filters.dateRange?.from || ""} onChange={(e) => onUpdateFilters({ dateRange: { from: e.target.value, to: filters.dateRange?.to || "" } })} /><Input type="date" className="h-9" value={filters.dateRange?.to || ""} onChange={(e) => onUpdateFilters({ dateRange: { from: filters.dateRange?.from || "", to: e.target.value } })} /></div></div>
          {activeFilterCount > 0 && <Button variant="outline" size="sm" className="w-full" onClick={onResetFilters}><X className="h-4 w-4 mr-2" />Xóa bộ lọc<Badge variant="secondary" className="ml-2">{activeFilterCount}</Badge></Button>}
        </div>
      </ScrollArea>
    </div>
  )
}
