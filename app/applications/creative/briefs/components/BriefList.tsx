"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Search,
  FileText,
  Filter,
  X,
  ChevronDown,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react"
import { differenceInDays } from "date-fns"
import { BriefCard } from "./BriefCard"
import type { Brief, BriefStatus, Priority } from "../types"
import { STATUS_OPTIONS } from "../types"

// ============================================
// SKELETON LOADER COMPONENT
// ============================================
const BriefCardSkeleton = () => (
  <div className="p-3 border rounded-lg border-l-4 border-l-gray-300">
    <div className="flex items-start justify-between gap-2 mb-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-4" />
    </div>
    <Skeleton className="h-3 w-1/2 mb-2" />
    <div className="flex items-center justify-between">
      <Skeleton className="h-5 w-20" />
      <Skeleton className="h-3 w-16" />
    </div>
  </div>
)

const BriefListSkeleton = () => (
  <div className="p-3 space-y-4">
    {/* Stats skeleton */}
    <div className="flex items-center justify-between">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-3 w-20" />
    </div>
    {/* Cards skeleton */}
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <BriefCardSkeleton key={i} />
      ))}
    </div>
  </div>
)

// ============================================
// STATS BAR COMPONENT (now clickable)
// ============================================
const StatsBar = ({
  stats,
  selectedStat,
  onStatClick,
}: {
  stats: { completed: number; inProgress: number; pending: number; overdue: number }
  selectedStat: 'completed' | 'inProgress' | 'pending' | 'overdue' | null
  onStatClick: (stat: 'completed' | 'inProgress' | 'pending' | 'overdue') => void
}) => (
  <div className="grid grid-cols-4 gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 border-b">
    <button
      type="button"
      onClick={() => onStatClick("completed")}
      className={`flex flex-col items-center p-2 rounded-lg bg-green-50 dark:bg-green-950 transition
        ${selectedStat === "completed" ? "ring-2 ring-green-500 border-green-500 border-2" : "hover:ring-2 hover:ring-green-400"}
        focus:outline-none`}
    >
      <CheckCircle2 className="h-4 w-4 text-green-600 mb-1" />
      <span className="text-lg font-bold text-green-700 dark:text-green-400">{stats.completed}</span>
      <span className="text-[10px] text-green-600 dark:text-green-500">Hoàn thành</span>
    </button>
    <button
      type="button"
      onClick={() => onStatClick("inProgress")}
      className={`flex flex-col items-center p-2 rounded-lg bg-blue-50 dark:bg-blue-950 transition
        ${selectedStat === "inProgress" ? "ring-2 ring-blue-500 border-blue-500 border-2" : "hover:ring-2 hover:ring-blue-400"}
        focus:outline-none`}
    >
      <Clock className="h-4 w-4 text-blue-600 mb-1" />
      <span className="text-lg font-bold text-blue-700 dark:text-blue-400">{stats.inProgress}</span>
      <span className="text-[10px] text-blue-600 dark:text-blue-500">Đang xử lý</span>
    </button>
    <button
      type="button"
      onClick={() => onStatClick("pending")}
      className={`flex flex-col items-center p-2 rounded-lg bg-yellow-50 dark:bg-yellow-950 transition
        ${selectedStat === "pending" ? "ring-2 ring-yellow-500 border-yellow-500 border-2" : "hover:ring-2 hover:ring-yellow-400"}
        focus:outline-none`}
    >
      <AlertCircle className="h-4 w-4 text-yellow-600 mb-1" />
      <span className="text-lg font-bold text-yellow-700 dark:text-yellow-400">{stats.pending}</span>
      <span className="text-[10px] text-yellow-600 dark:text-yellow-500">Chờ xác nhận</span>
    </button>
    <button
      type="button"
      onClick={() => onStatClick("overdue")}
      className={`flex flex-col items-center p-2 rounded-lg bg-red-50 dark:bg-red-950 transition
        ${selectedStat === "overdue" ? "ring-2 ring-red-500 border-red-500 border-2" : "hover:ring-2 hover:ring-red-400"}
        focus:outline-none`}
    >
      <CalendarIcon className="h-4 w-4 text-red-600 mb-1" />
      <span className="text-lg font-bold text-red-700 dark:text-red-400">{stats.overdue}</span>
      <span className="text-[10px] text-red-600 dark:text-red-500">Quá hạn</span>
    </button>
  </div>
)

// ============================================
// ADVANCED FILTER COMPONENT
// ============================================
interface FilterState {
  status: BriefStatus | "all"
  priority: Priority | "all"
  assignee: string | "all"
  createdBy: string | "all"
  deadlineRange: "all" | "overdue" | "urgent" | "thisWeek" | "thisMonth"
}

const AdvancedFilters = ({
  filters,
  onFiltersChange,
  assignees,
  creators,
  onReset,
  activeFilterCount,
}: {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  assignees: { id: string; name: string }[]
  creators: string[]
  onReset: () => void
  activeFilterCount: number
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-2">
          <Filter className="h-4 w-4" />
          Bộ lọc
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="h-5 w-5 p-0 flex items-center justify-center text-[10px]">
              {activeFilterCount}
            </Badge>
          )}
          <ChevronDown className="h-3 w-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">Bộ lọc nâng cao</h4>
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" className="h-7 text-xs text-red-600 hover:text-red-700" onClick={onReset}>
                <X className="h-3 w-3 mr-1" />
                Xóa bộ lọc
              </Button>
            )}
          </div>
        </div>

        <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
          {/* Status Filter */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Trạng thái</label>
            <Select
              value={filters.status}
              onValueChange={(v) => onFiltersChange({ ...filters, status: v as BriefStatus | "all" })}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority Filter */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Độ ưu tiên</label>
            <Select
              value={filters.priority}
              onValueChange={(v) => onFiltersChange({ ...filters, priority: v as Priority | "all" })}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="high">🔴 Cao</SelectItem>
                <SelectItem value="medium">🟡 Trung bình</SelectItem>
                <SelectItem value="low">🟢 Thấp</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Assignee Filter */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Người thực hiện</label>
            <Select
              value={filters.assignee}
              onValueChange={(v) => onFiltersChange({ ...filters, assignee: v })}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {assignees.map((assignee) => (
                  <SelectItem key={assignee.id} value={assignee.id}>
                    {assignee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Created By Filter */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Người tạo</label>
            <Select
              value={filters.createdBy}
              onValueChange={(v) => onFiltersChange({ ...filters, createdBy: v })}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {creators.map((creator) => (
                  <SelectItem key={creator} value={creator}>
                    {creator}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Deadline Range Filter */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Deadline</label>
            <Select
              value={filters.deadlineRange}
              onValueChange={(v) => onFiltersChange({ ...filters, deadlineRange: v as FilterState["deadlineRange"] })}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="overdue">🔴 Quá hạn</SelectItem>
                <SelectItem value="urgent">🟠 Gấp (≤3 ngày)</SelectItem>
                <SelectItem value="thisWeek">📅 Tuần này</SelectItem>
                <SelectItem value="thisMonth">📅 Tháng này</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="p-3 border-t bg-gray-50 dark:bg-gray-800">
          <Button className="w-full h-8 text-sm" onClick={() => setIsOpen(false)}>
            Áp dụng
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// ============================================
// SIMPLIFIED PROPS - No role complexity
// ============================================
interface BriefListProps {
  briefs: Brief[]
  selectedId: string | null
  onSelect: (brief: Brief) => void
  onAcceptClick?: (brief: Brief) => void
  isLoading?: boolean
  teamMembers?: { id: string; name: string; role: string }[]
}

// ============================================
// BRIEF LIST COMPONENT
// ============================================
export function BriefList({
  briefs,
  selectedId,
  onSelect,
  onAcceptClick,
  isLoading = false,
  teamMembers = [],
}: BriefListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    priority: "all",
    assignee: "all",
    createdBy: "all",
    deadlineRange: "all",
  })

  // Show ALL briefs - no role filtering
  const roleFilteredBriefs = useMemo(() => briefs, [briefs])

  // Get unique creators
  const creators = useMemo(() => {
    const uniqueCreators = [...new Set(roleFilteredBriefs.map(b => b.createdBy))]
    return uniqueCreators.filter(Boolean)
  }, [roleFilteredBriefs])

  // Get assignees from team members
  const assignees = useMemo(() => {
    return teamMembers.filter(m => m.role === "creative").map(m => ({ id: m.id, name: m.name }))
  }, [teamMembers])

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.status !== "all") count++
    if (filters.priority !== "all") count++
    if (filters.assignee !== "all") count++
    if (filters.createdBy !== "all") count++
    if (filters.deadlineRange !== "all") count++
    return count
  }, [filters])

  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: "all",
      priority: "all",
      assignee: "all",
      createdBy: "all",
      deadlineRange: "all",
    })
  }

  // Stats - Smarter view for Creative team
  const stats = useMemo(() => {
    const now = new Date()
    return {
      completed: briefs.filter(b => b.status === "completed").length,
      inProgress: briefs.filter(b =>
        b.status === "in_progress" ||
        b.status === "confirmed" ||
        b.status === "waiting_design" ||
        b.status === "design_done" ||
        b.status === "need_revision"
      ).length,
      pending: briefs.filter(b => b.status === "pending" || b.status === "waiting_lead_review" || b.status === "waiting_ua_review").length,
      overdue: briefs.filter(b => {
        const daysUntil = differenceInDays(new Date(b.deadline), now)
        return daysUntil < 0 && b.status !== "completed" && b.status !== "returned_to_ua"
      }).length,
    }
  }, [briefs])

  // Return ALL briefs sorted by date
  const filteredBriefs = useMemo(() => {
    return [...roleFilteredBriefs].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }, [roleFilteredBriefs])

  // Group by status for display - all 12 statuses
  const groupedBriefs = useMemo(() => {
    const groups: Record<string, Brief[]> = {
      draft: [],
      pending: [],
      confirmed: [],
      in_progress: [],
      waiting_design: [],
      design_returned: [],
      design_done: [],
      waiting_lead_review: [],
      waiting_ua_review: [],
      need_revision: [],
      completed: [],
      returned_to_ua: [],
    }

    filteredBriefs.forEach(brief => {
      if (groups[brief.status]) {
        groups[brief.status].push(brief)
      }
    })

    return groups
  }, [filteredBriefs])

  // Status labels for all 12 statuses - display order (Creative team perspective)
  const statusDisplayOrder = [
    "pending",           // Chờ nhận (Lead cần xử lý)
    "need_revision",     // Cần chỉnh sửa (urgent)
    "waiting_design",    // Chờ Design
    "design_returned",   // Design trả về
    "design_done",       // Design Done
    "in_progress",       // Đang thực hiện
    "confirmed",         // Đã xác nhận
    "waiting_lead_review", // Chờ Lead duyệt
    "waiting_ua_review", // Chờ UA nghiệm thu
    "completed",         // Hoàn thành
    "draft",             // Nháp
    "returned_to_ua",    // Trả về UA
  ]

  const statusLabels: Record<string, { label: string; color: string }> = {
    draft: { label: "Nháp", color: "text-gray-500" },
    pending: { label: "Chờ nhận", color: "text-yellow-600" },
    confirmed: { label: "Đã xác nhận", color: "text-blue-600" },
    in_progress: { label: "Đang thực hiện", color: "text-indigo-600" },
    waiting_design: { label: "Chờ Design", color: "text-purple-600" },
    design_returned: { label: "Design trả về", color: "text-orange-600" },
    design_done: { label: "Design Done", color: "text-cyan-600" },
    waiting_lead_review: { label: "Chờ Lead duyệt", color: "text-indigo-600" },
    waiting_ua_review: { label: "Chờ UA nghiệm thu", color: "text-teal-600" },
    need_revision: { label: "Cần chỉnh sửa", color: "text-orange-600" },
    completed: { label: "Hoàn thành", color: "text-green-600" },
    returned_to_ua: { label: "Trả về UA", color: "text-red-600" },
  }

  const getEmptyStateMessage = () => ({
    title: "Không có brief nào",
    description: "",
  })

  // --- STATS BAR FILTER STATE ---
  const [selectedStat, setSelectedStat] = useState<'completed' | 'inProgress' | 'pending' | 'overdue' | null>(null)
  const handleStatClick = (stat: 'completed' | 'inProgress' | 'pending' | 'overdue') => {
    setSelectedStat(prev => prev === stat ? null : stat)
  }

  // --- FILTERED BRIEFS WITH ADVANCED FILTERS AND STATS ---
  const filteredBriefsWithStats = useMemo(() => {
    let filtered = briefs
    const now = new Date()

    // 1. StatsBar filter (quick filter)
    if (selectedStat) {
      if (selectedStat === "completed") {
        filtered = filtered.filter(b => b.status === "completed")
      } else if (selectedStat === "inProgress") {
        filtered = filtered.filter(b =>
          b.status === "in_progress" || b.status === "confirmed" || b.status === "waiting_design" || b.status === "design_done" || b.status === "need_revision"
        )
      } else if (selectedStat === "pending") {
        filtered = filtered.filter(b => b.status === "pending" || b.status === "waiting_lead_review" || b.status === "waiting_ua_review")
      } else if (selectedStat === "overdue") {
        filtered = filtered.filter(b => {
          const daysUntil = differenceInDays(new Date(b.deadline), now)
          return daysUntil < 0 && b.status !== "completed" && b.status !== "returned_to_ua"
        })
      }
    }

    // 2. Advanced Filters - Status
    if (filters.status !== "all") {
      filtered = filtered.filter(b => b.status === filters.status)
    }

    // 3. Advanced Filters - Priority
    if (filters.priority !== "all") {
      filtered = filtered.filter(b => b.priority === filters.priority)
    }

    // 4. Advanced Filters - Assignee
    if (filters.assignee !== "all") {
      filtered = filtered.filter(b =>
        Array.isArray(b.assignedTo) &&
        b.assignedTo.some((assignee: any) =>
          typeof assignee === "object" && assignee !== null && "id" in assignee
            ? assignee.id === filters.assignee
            // Fix: allow string assignee, but avoid TS error
            : typeof assignee === "string" && assignee === filters.assignee
        )
      )
    }

    // 5. Advanced Filters - Created By
    if (filters.createdBy !== "all") {
      filtered = filtered.filter(b => b.createdBy === filters.createdBy)
    }

    // 6. Advanced Filters - Deadline Range
    if (filters.deadlineRange !== "all") {
      const today = new Date()
      const startOfWeek = new Date(today)
      startOfWeek.setDate(today.getDate() - today.getDay())
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

      filtered = filtered.filter(b => {
        const deadline = new Date(b.deadline)
        const daysUntil = differenceInDays(deadline, now)
        switch (filters.deadlineRange) {
          case "overdue":
            return daysUntil < 0 && b.status !== "completed" && b.status !== "returned_to_ua"
          case "urgent":
            return daysUntil >= 0 && daysUntil <= 3
          case "thisWeek":
            return deadline >= startOfWeek && deadline <= endOfWeek
          case "thisMonth":
            return deadline >= startOfMonth && deadline <= endOfMonth
          default:
            return true
        }
      })
    }

    // 7. Search term filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(b =>
        b.title.toLowerCase().includes(searchLower) ||
        // Fix: campaign and description may not exist, so check with optional chaining
        (b as any).campaign?.toLowerCase().includes(searchLower) ||
        (b as any).description?.toLowerCase().includes(searchLower)
      )
    }

    return filtered.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }, [briefs, selectedStat, filters, searchTerm])

  return (
    <div className="flex flex-col h-full">
      {/* Search & Filters - giảm padding từ p-3 → p-2 */}
      <div className="p-2 border-b space-y-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4" />
          <Input
            placeholder="Tìm kiếm brief..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-8 text-sm"
            disabled={isLoading}
          />
        </div>
        <div className="flex items-center gap-1.5">
          <AdvancedFilters
            filters={filters}
            onFiltersChange={setFilters}
            assignees={assignees}
            creators={creators}
            onReset={resetFilters}
            activeFilterCount={activeFilterCount}
          />
          {activeFilterCount > 0 && (
            <div className="flex-1 flex items-center gap-1 overflow-x-auto">
              {filters.status !== "all" && (
                <Badge variant="secondary" className="text-xs whitespace-nowrap">
                  {STATUS_OPTIONS.find(o => o.value === filters.status)?.label}
                  <button
                    className="ml-1 hover:text-red-600"
                    onClick={() => setFilters({ ...filters, status: "all" })}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.priority !== "all" && (
                <Badge variant="secondary" className="text-xs whitespace-nowrap">
                  {filters.priority === "high" ? "🔴 Cao" : filters.priority === "medium" ? "🟡 TB" : "🟢 Thấp"}
                  <button
                    className="ml-1 hover:text-red-600"
                    onClick={() => setFilters({ ...filters, priority: "all" })}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.deadlineRange !== "all" && (
                <Badge variant="secondary" className="text-xs whitespace-nowrap">
                  {filters.deadlineRange === "overdue" ? "Quá hạn" :
                    filters.deadlineRange === "urgent" ? "Gấp" :
                      filters.deadlineRange === "thisWeek" ? "Tuần này" : "Tháng này"}
                  <button
                    className="ml-1 hover:text-red-600"
                    onClick={() => setFilters({ ...filters, deadlineRange: "all" })}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats Bar - giảm gap */}
      {!isLoading && (
        <StatsBar
          stats={stats}
          selectedStat={selectedStat}
          onStatClick={handleStatClick}
        />
      )}

      {/* Brief List - giảm padding */}
      <ScrollArea className="flex-1">
        {isLoading ? (
          <BriefListSkeleton />
        ) : (
          <div className="p-2 space-y-3">
            {filteredBriefsWithStats.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p className="font-medium text-sm">Không có brief nào</p>
                {selectedStat && (
                  <p className="text-xs mt-1">Không tìm thấy brief phù hợp với bộ lọc</p>
                )}
                {(activeFilterCount > 0 || selectedStat) && (
                  <Button
                    variant="link"
                    size="sm"
                    className="mt-2 text-xs"
                    onClick={() => {
                      resetFilters()
                      setSelectedStat(null)
                    }}
                  >
                    Xóa tất cả bộ lọc
                  </Button>
                )}
              </div>
            ) : (
              <>
                {/* Render in display order */}
                {statusDisplayOrder.map((status) => {
                  const statusBriefs = filteredBriefsWithStats.filter(b => b.status === status)
                  if (!statusBriefs || statusBriefs.length === 0) return null
                  const config = statusLabels[status]
                  return (
                    <div key={status}>
                      <h3 className={`text-xs font-semibold mb-2 flex items-center gap-2 ${config.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${config.color.replace('text-', 'bg-')}`}></span>
                        {config.label} ({statusBriefs.length})
                      </h3>
                      <div className="space-y-2">
                        {statusBriefs.map((brief) => (
                          <BriefCard
                            key={brief.id}
                            brief={brief}
                            isSelected={selectedId === brief.id}
                            onClick={() => onSelect(brief)}
                            onAcceptClick={onAcceptClick}
                          />
                        ))}
                      </div>
                    </div>
                  )
                })}
              </>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

export default BriefList
