"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, List, Bell, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  FilterPanel,
  CalendarView,
  ListView,
  RightSidebar
} from "./components"
import type { Task, TaskStatus, TaskPriority } from "./types"
import { mockTasks, teamMembers } from "./mockData"
import { BriefList } from "../briefs/components/BriefList"
import type { Brief } from "../briefs/types"

export default function DeadlinePage() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(false)

  // Filter states
  const [selectedStatuses, setSelectedStatuses] = useState<TaskStatus[]>([])
  const [selectedPriorities, setSelectedPriorities] = useState<TaskPriority[]>([])
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([])

  // Add state for selected brief (for BriefList)
  const [selectedBriefId, setSelectedBriefId] = useState<string | null>(null)
  // Demo briefs data (replace with real data if needed)
  const briefs: Brief[] = [] // TODO: Replace with your actual briefs data

  // Filtering logic
  const filteredTasks = useMemo(() => {
    let tasks = mockTasks
    if (selectedStatuses.length)
      tasks = tasks.filter(t => selectedStatuses.includes(t.status))
    if (selectedPriorities.length)
      tasks = tasks.filter(t => selectedPriorities.includes(t.priority))
    if (selectedAssignees.length)
      tasks = tasks.filter(t => t.assignedTo.some(a => selectedAssignees.includes(a)))
    return tasks
  }, [selectedStatuses, selectedPriorities, selectedAssignees])

  const activeFilterCount =
    selectedStatuses.length +
    selectedPriorities.length +
    selectedAssignees.length

  // Filter handlers
  const handleToggleStatus = (status: TaskStatus) => {
    setSelectedStatuses(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    )
  }
  const handleTogglePriority = (priority: TaskPriority) => {
    setSelectedPriorities(prev =>
      prev.includes(priority) ? prev.filter(p => p !== priority) : [...prev, priority]
    )
  }
  const handleToggleAssignee = (assignee: string) => {
    setSelectedAssignees(prev =>
      prev.includes(assignee) ? prev.filter(a => a !== assignee) : [...prev, assignee]
    )
  }
  const handleClearAll = () => {
    setSelectedStatuses([])
    setSelectedPriorities([])
    setSelectedAssignees([])
  }

  // Simulate loading state for demo
  const handleViewModeChange = (mode: 'calendar' | 'list') => {
    setLoading(true)
    setTimeout(() => {
      setViewMode(mode)
      setLoading(false)
    }, 350)
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-white to-gray-50 shadow-md border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/applications")}
              className="rounded-lg transition-all duration-200 hover:bg-gray-100 hover:scale-105"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Quay lại
            </Button>
            <div>
              <h1 className="text-xl font-bold">Deadline & Notification Center</h1>
              <p className="text-xs text-muted-foreground">
                Quản lý deadline và workload
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleViewModeChange('calendar')}
                className={cn(
                  "transition-all duration-200",
                  viewMode === 'calendar' && "shadow-sm",
                  "hover:bg-gray-100 hover:scale-105 active:scale-95"
                )}
              >
                <Calendar
                  className={cn(
                    "h-4 w-4 mr-1 transition-colors duration-200",
                    viewMode === 'calendar' ? "text-blue-500" : "text-gray-400"
                  )}
                />
                Calendar
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleViewModeChange('list')}
                className={cn(
                  "transition-all duration-200",
                  viewMode === 'list' && "shadow-sm",
                  "hover:bg-gray-100 hover:scale-105 active:scale-95"
                )}
              >
                <List
                  className={cn(
                    "h-4 w-4 mr-1 transition-colors duration-200",
                    viewMode === 'list' ? "text-blue-500" : "text-gray-400"
                  )}
                />
                List
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="transition-all duration-200 hover:scale-110 hover:shadow-md relative"
            >
              <Bell className="h-4 w-4" />
              <span className="ml-2 animate-pulse bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs shadow">
                5
              </span>
            </Button>
          </div>
        </div>
        {activeFilterCount > 0 && (
          <div className="mt-2 text-xs text-blue-600 font-semibold">
            {filteredTasks.length} tasks matched ({activeFilterCount} filters active)
          </div>
        )}
      </div>
      {/* 3-Column Layout */}
      <div className="flex-1 overflow-hidden flex">
        <FilterPanel
          selectedStatuses={selectedStatuses}
          selectedPriorities={selectedPriorities}
          selectedAssignees={selectedAssignees}
          onToggleStatus={handleToggleStatus}
          onTogglePriority={handleTogglePriority}
          onToggleAssignee={handleToggleAssignee}
          onClearAll={handleClearAll}
          teamMembers={teamMembers.map(m => ({ id: m.id, name: m.name }))}
        />
        <div className="flex-1 overflow-auto relative">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
            </div>
          ) : viewMode === 'calendar' ? (
            <CalendarView
              onSelectTask={setSelectedTask}
              tasks={filteredTasks}
              selectedTask={selectedTask}
              loading={loading}
            />
          ) : (
            <ListView
              onSelectTask={setSelectedTask}
              tasks={filteredTasks}
            />
          )}
        </div>
        <RightSidebar
          selectedTask={selectedTask}
        />
      </div>
      <BriefList
        briefs={briefs}
        selectedId={selectedBriefId}
        onSelect={brief => setSelectedBriefId(brief.id)}
      />
    </div>
  )
}
