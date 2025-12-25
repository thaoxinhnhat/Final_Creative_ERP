"use client"

import { useState, useMemo, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Calendar,
  List,
  Bell,
  Loader2,
  BarChart3,
  CalendarDays,
  ChevronDown,
  Filter,
  RefreshCw
} from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  FilterPanel,
  CalendarView,
  ListView,
  RightSidebar,
  StatsSection,
  WeekView,
} from "./components"
import type { Task, TaskStatus, TaskPriority, TaskSource, OrderTeamType } from "./types"
import { mockTasks, teamMembers, mockNotifications, calculateWorkloadSummary } from "./mockData"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"

export default function DeadlinePage() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'calendar' | 'week' | 'list' | 'stats'>('week')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(true)
  const [sidebarTab, setSidebarTab] = useState<'task' | 'notifications'>('task')
  const [selectedDateRange, setSelectedDateRange] = useState<string>('all')

  // Filter states
  const [selectedStatuses, setSelectedStatuses] = useState<TaskStatus[]>([])
  const [selectedPriorities, setSelectedPriorities] = useState<TaskPriority[]>([])
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([])
  // NEW: Source and Team filters
  const [selectedSource, setSelectedSource] = useState<TaskSource | 'all'>('all')
  const [selectedTeam, setSelectedTeam] = useState<OrderTeamType | 'all'>('all')

  // Calculate workload
  const workload = useMemo(() => calculateWorkloadSummary(), [])

  // Calculate unread notifications
  const unreadNotifications = useMemo(() =>
    mockNotifications.filter(n => !n.isRead).length,
    [])

  // Filtering logic
  const filteredTasks = useMemo(() => {
    let tasks = mockTasks
    if (selectedStatuses.length)
      tasks = tasks.filter(t => selectedStatuses.includes(t.status))
    if (selectedPriorities.length)
      tasks = tasks.filter(t => selectedPriorities.includes(t.priority))
    if (selectedAssignees.length)
      tasks = tasks.filter(t => t.assignedTo.some(a => selectedAssignees.includes(a)))

    // Date range filter
    if (selectedDateRange && selectedDateRange !== 'all') {
      const now = new Date()
      now.setHours(0, 0, 0, 0)

      tasks = tasks.filter(t => {
        const deadline = new Date(t.deadline)
        deadline.setHours(0, 0, 0, 0)

        if (selectedDateRange === 'today') {
          return deadline.getTime() === now.getTime()
        } else if (selectedDateRange === 'week') {
          const weekEnd = new Date(now)
          weekEnd.setDate(weekEnd.getDate() + 7)
          return deadline >= now && deadline <= weekEnd
        } else if (selectedDateRange === 'month') {
          const monthEnd = new Date(now)
          monthEnd.setMonth(monthEnd.getMonth() + 1)
          return deadline >= now && deadline <= monthEnd
        }
        return true
      })
    }

    // NEW: Source filter (Brief/Order)
    if (selectedSource !== 'all') {
      tasks = tasks.filter(t => t.source === selectedSource)
    }

    // NEW: Team filter (only applies to Order tasks)
    if (selectedTeam !== 'all') {
      tasks = tasks.filter(t => t.source !== 'order' || t.teamType === selectedTeam)
    }

    return tasks
  }, [selectedStatuses, selectedPriorities, selectedAssignees, selectedDateRange, selectedSource, selectedTeam])

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
    setSelectedDateRange('all')
    setSelectedSource('all')
    setSelectedTeam('all')
  }

  // Handle bell click - open notifications sidebar
  const handleBellClick = () => {
    setSidebarTab('notifications')
  }

  // Handle task selection - switch to task tab
  const handleSelectTask = (task: Task) => {
    setSelectedTask(task)
    setSidebarTab('task')
  }

  // Simulate loading state for demo
  const handleViewModeChange = (mode: 'calendar' | 'week' | 'list' | 'stats') => {
    setLoading(true)
    setTimeout(() => {
      setViewMode(mode)
      setLoading(false)
    }, 300)
  }

  // Refresh data
  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }

  // Calculate stats for header
  const overdueCount = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return filteredTasks.filter(t => {
      const deadline = new Date(t.deadline)
      return deadline < today && t.status !== 'completed'
    }).length
  }, [filteredTasks])

  const dueTodayCount = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return filteredTasks.filter(t => {
      const deadline = new Date(t.deadline)
      deadline.setHours(0, 0, 0, 0)
      return deadline.getTime() === today.getTime() && t.status !== 'completed'
    }).length
  }, [filteredTasks])

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/applications")}
              className="rounded-lg transition-all duration-200 hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Quay lại
            </Button>
            <div className="h-6 w-px bg-gray-200" />
            <div>
              <h1 className="text-xl font-bold">
                Deadline & Notification Center
              </h1>
              <p className="text-xs text-muted-foreground">
                Quản lý deadline và workload - Creative Team
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Stats */}
            <div className="hidden md:flex items-center gap-2 mr-4">
              {overdueCount > 0 && (
                <Badge variant="destructive" className="gap-1 px-3 py-1">
                  <span className="font-bold">{overdueCount}</span> Quá hạn
                </Badge>
              )}
              {dueTodayCount > 0 && (
                <Badge variant="outline" className="gap-1 px-3 py-1 border-orange-300 text-orange-600">
                  <span className="font-bold">{dueTodayCount}</span> Hôm nay
                </Badge>
              )}
            </div>

            {/* View Mode Tabs */}
            <Tabs value={viewMode} onValueChange={(v) => handleViewModeChange(v as any)}>
              <TabsList className="bg-gray-100">
                <TabsTrigger value="week" className="gap-1 data-[state=active]:bg-white">
                  <CalendarDays className="h-4 w-4" />
                  <span className="hidden sm:inline">Tuần</span>
                </TabsTrigger>
                <TabsTrigger value="calendar" className="gap-1 data-[state=active]:bg-white">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Tháng</span>
                </TabsTrigger>
                <TabsTrigger value="list" className="gap-1 data-[state=active]:bg-white">
                  <List className="h-4 w-4" />
                  <span className="hidden sm:inline">Danh sách</span>
                </TabsTrigger>
                <TabsTrigger value="stats" className="gap-1 data-[state=active]:bg-white">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Thống kê</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Filter toggle */}
            <Button
              variant={showFilters ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="relative"
            >
              <Filter className="h-4 w-4" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </Button>

            {/* Refresh button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className={cn(loading && "animate-spin")}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Active filters indicator */}
        {activeFilterCount > 0 && (
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className="text-gray-500">Lọc:</span>
            <span className="text-blue-600 font-medium">
              {filteredTasks.length} tasks
            </span>
            <span className="text-gray-400">|</span>
            <button
              onClick={handleClearAll}
              className="text-red-500 hover:text-red-700 text-xs"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* Main Content with Resizable Panels */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'stats' ? (
          /* Stats view doesn't need resizable panels */
          <div className="h-full overflow-auto p-4">
            <StatsSection
              tasks={filteredTasks}
              workload={workload}
            />
          </div>
        ) : (
          <ResizablePanelGroup
            direction="horizontal"
            className="h-full"
            key={showFilters ? 'with-filter' : 'without-filter'}
          >
            {/* Filter Panel */}
            {showFilters && (
              <>
                <ResizablePanel
                  id="filter-panel"
                  defaultSize={15}
                  minSize={12}
                  maxSize={25}
                  className="bg-white border-r"
                >
                  <FilterPanel
                    selectedStatuses={selectedStatuses}
                    selectedPriorities={selectedPriorities}
                    selectedAssignees={selectedAssignees}
                    onToggleStatus={handleToggleStatus}
                    onTogglePriority={handleTogglePriority}
                    onToggleAssignee={handleToggleAssignee}
                    onClearAll={handleClearAll}
                    teamMembers={teamMembers.map(m => ({ id: m.id, name: m.name }))}
                    selectedDateRange={selectedDateRange}
                    onSelectDateRange={setSelectedDateRange}
                    selectedSource={selectedSource}
                    onSelectSource={setSelectedSource}
                    selectedTeam={selectedTeam}
                    onSelectTeam={setSelectedTeam}
                  />
                </ResizablePanel>
                <ResizableHandle withHandle />
              </>
            )}

            {/* Main Calendar/List View */}
            <ResizablePanel
              id="main-view-panel"
              defaultSize={showFilters ? 55 : 70}
              minSize={40}
              className="bg-gray-50"
            >
              <div className="h-full overflow-auto">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Loader2 className="animate-spin h-10 w-10 text-blue-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Đang tải...</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {viewMode === 'week' && (
                      <WeekView
                        tasks={filteredTasks}
                        onSelectTask={handleSelectTask}
                        selectedTask={selectedTask}
                      />
                    )}
                    {viewMode === 'calendar' && (
                      <CalendarView
                        onSelectTask={handleSelectTask}
                        tasks={filteredTasks}
                        selectedTask={selectedTask}
                        loading={loading}
                      />
                    )}
                    {viewMode === 'list' && (
                      <ListView
                        onSelectTask={handleSelectTask}
                        tasks={filteredTasks}
                      />
                    )}
                  </>
                )}
              </div>
            </ResizablePanel>

            {/* Resize Handle between Calendar and Detail */}
            <ResizableHandle withHandle />

            {/* Right Sidebar - Task Detail & Notifications */}
            <ResizablePanel
              id="detail-panel"
              defaultSize={30}
              minSize={20}
              maxSize={45}
              className="bg-white border-l"
            >
              <RightSidebar
                selectedTask={selectedTask}
                activeTab={sidebarTab}
                onTabChange={setSidebarTab}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
    </div>
  )
}
