"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Search, X, GripVertical, ChevronDown, ChevronRight } from "lucide-react"
import type { ConceptFilters, ConceptStatus, TeamType } from "../types"
import { STATUS_CONFIG, TEAM_CONFIG } from "../types"
import { uniqueConceptTags } from "../mockData"

interface FilterPanelProps {
    filters: ConceptFilters
    onUpdateFilters: (updates: Partial<ConceptFilters>) => void
    onResetFilters: () => void
    stats: {
        total: number
        draft: number
        pending_review: number
        approved: number
        rejected: number
        // UA Approval
        waiting_ua_approval: number
        ua_approved: number
        ua_rejected: number
        // Design
        sent_to_design: number
        design_in_progress: number
        design_returned: number
        design_completed: number
        // Art
        sent_to_art: number
        art_in_progress: number
        art_returned: number
        art_completed: number
        // AI
        sent_to_ai: number
        ai_in_progress: number
        ai_returned: number
        ai_completed: number
        // Final
        waiting_creative_review: number
        completed: number
    }
    statsByHandler?: {
        design: number
        art_stylist: number
        ai_producer: number
        creative: number
    }
}

interface StatusGroup {
    id: string
    label: string
    icon: string
    color: string
    bgColor: string
    statuses: { value: ConceptStatus; label: string; count: number }[]
}

export function FilterPanel({
    filters,
    onUpdateFilters,
    onResetFilters,
    stats,
    statsByHandler,
}: FilterPanelProps) {
    // Resizable panel state
    const [panelWidth, setPanelWidth] = useState(280)
    const isResizing = useRef(false)
    const panelRef = useRef<HTMLDivElement>(null)

    // Collapsed state for status groups
    const [expandedGroups, setExpandedGroups] = useState<string[]>(['creative', 'design', 'art', 'ai', 'final'])

    const MIN_WIDTH = 220
    const MAX_WIDTH = 400

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault()
        isResizing.current = true
        document.body.style.cursor = 'col-resize'
        document.body.style.userSelect = 'none'
    }, [])

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing.current || !panelRef.current) return

            const panelRect = panelRef.current.getBoundingClientRect()
            const newWidth = e.clientX - panelRect.left
            if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
                setPanelWidth(newWidth)
            }
        }

        const handleMouseUp = () => {
            isResizing.current = false
            document.body.style.cursor = ''
            document.body.style.userSelect = ''
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [])

    const activeCount =
        (filters.search ? 1 : 0) +
        (filters.status !== 'all' ? 1 : 0) +
        (filters.team !== 'all' ? 1 : 0) +
        (filters.tags.length > 0 ? 1 : 0)

    // Status groups organized by team/workflow
    const statusGroups: StatusGroup[] = [
        {
            id: 'creative',
            label: 'Creative',
            icon: '💡',
            color: 'text-green-700',
            bgColor: 'bg-green-50',
            statuses: [
                { value: 'draft', label: 'Nháp', count: stats.draft },
                { value: 'pending_review', label: 'Chờ Lead duyệt', count: stats.pending_review },
                { value: 'approved', label: 'Lead đã duyệt', count: stats.approved },
                { value: 'rejected', label: 'Lead từ chối', count: stats.rejected },
            ]
        },
        {
            id: 'ua_approval',
            label: 'UA Approval',
            icon: '👀',
            color: 'text-amber-700',
            bgColor: 'bg-amber-50',
            statuses: [
                { value: 'waiting_ua_approval', label: 'Chờ UA duyệt', count: stats.waiting_ua_approval || 0 },
                { value: 'ua_approved', label: 'UA đã duyệt', count: stats.ua_approved || 0 },
                { value: 'ua_rejected', label: 'UA từ chối', count: stats.ua_rejected || 0 },
            ]
        },
        {
            id: 'design',
            label: 'Design Team',
            icon: '🎨',
            color: 'text-purple-700',
            bgColor: 'bg-purple-50',
            statuses: [
                { value: 'sent_to_design', label: 'Đã gửi', count: stats.sent_to_design },
                { value: 'design_in_progress', label: 'Đang xử lý', count: stats.design_in_progress },
                { value: 'design_returned', label: 'Trả lại', count: stats.design_returned },
                { value: 'design_completed', label: 'Hoàn thành', count: stats.design_completed },
            ]
        },
        {
            id: 'art',
            label: 'Art & Stylist',
            icon: '🖌️',
            color: 'text-pink-700',
            bgColor: 'bg-pink-50',
            statuses: [
                { value: 'sent_to_art', label: 'Đã gửi', count: stats.sent_to_art },
                { value: 'art_in_progress', label: 'Đang xử lý', count: stats.art_in_progress },
                { value: 'art_returned', label: 'Trả lại', count: stats.art_returned },
                { value: 'art_completed', label: 'Hoàn thành', count: stats.art_completed },
            ]
        },
        {
            id: 'ai',
            label: 'AI Producer',
            icon: '🤖',
            color: 'text-blue-700',
            bgColor: 'bg-blue-50',
            statuses: [
                { value: 'sent_to_ai', label: 'Đã gửi', count: stats.sent_to_ai },
                { value: 'ai_in_progress', label: 'Đang xử lý', count: stats.ai_in_progress },
                { value: 'ai_returned', label: 'Trả lại', count: stats.ai_returned },
                { value: 'ai_completed', label: 'Hoàn thành', count: stats.ai_completed },
            ]
        },
        {
            id: 'final',
            label: 'Kết quả',
            icon: '🎯',
            color: 'text-teal-700',
            bgColor: 'bg-teal-50',
            statuses: [
                { value: 'waiting_creative_review', label: 'Chờ Creative duyệt', count: stats.waiting_creative_review },
                { value: 'completed', label: 'Hoàn thành', count: stats.completed },
            ]
        },
    ]

    const toggleGroup = (groupId: string) => {
        setExpandedGroups(prev =>
            prev.includes(groupId)
                ? prev.filter(g => g !== groupId)
                : [...prev, groupId]
        )
    }

    const toggleTag = (tag: string) => {
        const newTags = filters.tags.includes(tag)
            ? filters.tags.filter(t => t !== tag)
            : [...filters.tags, tag]
        onUpdateFilters({ tags: newTags })
    }

    const teamOptions: { value: TeamType | 'all'; label: string; count: number }[] = [
        { value: 'all', label: 'Tất cả', count: stats.total },
        { value: 'creative', label: 'Creative', count: statsByHandler?.creative || 0 },
        { value: 'design', label: 'Design', count: statsByHandler?.design || 0 },
        { value: 'art_stylist', label: 'Art & Stylist', count: statsByHandler?.art_stylist || 0 },
        { value: 'ai_producer', label: 'AI Producer', count: statsByHandler?.ai_producer || 0 },
    ]

    return (
        <div
            ref={panelRef}
            className="border-r bg-white dark:bg-gray-900 flex-shrink-0 overflow-y-auto relative"
            style={{ width: panelWidth }}
        >
            {/* Resize Handle */}
            <div
                className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-blue-500/30 active:bg-blue-500/50 transition-colors group flex items-center justify-center z-10"
                onMouseDown={handleMouseDown}
            >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="h-6 w-6 text-gray-400" />
                </div>
            </div>

            <div className="p-4 space-y-5 pr-3">
                {/* Search */}
                <div>
                    <Label className="text-sm font-semibold mb-2 block">Tìm kiếm</Label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Tên, mô tả, tags..."
                            className="pl-9"
                            value={filters.search}
                            onChange={(e) => onUpdateFilters({ search: e.target.value })}
                        />
                    </div>
                </div>

                {/* Team Handler Filter */}
                {statsByHandler && (
                    <div>
                        <Label className="text-sm font-semibold mb-3 block">Team đang xử lý</Label>
                        <div className="space-y-1">
                            {teamOptions.map((opt) => {
                                const isActive = filters.team === opt.value
                                const config = opt.value !== 'all' ? TEAM_CONFIG[opt.value] : null
                                return (
                                    <button
                                        key={opt.value}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${isActive
                                            ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                                            }`}
                                        onClick={() => onUpdateFilters({ team: opt.value })}
                                    >
                                        <span className="flex items-center gap-2">
                                            {config && <span>{config.icon}</span>}
                                            {opt.label}
                                        </span>
                                        <Badge variant="secondary" className="text-xs">
                                            {opt.count}
                                        </Badge>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}

                <Separator />

                {/* Status Groups */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <Label className="text-sm font-semibold">Trạng thái theo workflow</Label>
                        <button
                            className="text-xs text-blue-600 hover:underline"
                            onClick={() => onUpdateFilters({ status: 'all' })}
                        >
                            Tất cả ({stats.total})
                        </button>
                    </div>

                    <div className="space-y-2">
                        {statusGroups.map((group) => {
                            const isExpanded = expandedGroups.includes(group.id)
                            const groupTotal = group.statuses.reduce((sum, s) => sum + s.count, 0)
                            const hasActiveStatus = group.statuses.some(s => filters.status === s.value)

                            return (
                                <div key={group.id} className={`rounded-lg border ${hasActiveStatus ? 'border-blue-300 bg-blue-50/50' : 'border-gray-200'}`}>
                                    {/* Group Header */}
                                    <button
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-t-lg text-sm font-medium ${group.bgColor} ${group.color}`}
                                        onClick={() => toggleGroup(group.id)}
                                    >
                                        <span className="flex items-center gap-2">
                                            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                            <span>{group.icon}</span>
                                            {group.label}
                                        </span>
                                        <Badge variant="secondary" className="text-xs">
                                            {groupTotal}
                                        </Badge>
                                    </button>

                                    {/* Group Items */}
                                    {isExpanded && (
                                        <div className="px-2 pb-2 pt-1 space-y-0.5">
                                            {group.statuses.map((status) => {
                                                const isActive = filters.status === status.value
                                                const config = STATUS_CONFIG[status.value]
                                                return (
                                                    <button
                                                        key={status.value}
                                                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded text-xs transition-colors ${isActive
                                                            ? 'bg-blue-100 text-blue-700'
                                                            : 'hover:bg-gray-100 text-gray-700'
                                                            }`}
                                                        onClick={() => onUpdateFilters({ status: status.value })}
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <span className="w-4 text-center">{config.icon}</span>
                                                            {status.label}
                                                        </span>
                                                        <span className={`${status.count > 0 ? 'font-medium' : 'text-gray-400'}`}>
                                                            {status.count}
                                                        </span>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                <Separator />

                {/* Tags */}
                <div>
                    <Label className="text-sm font-semibold mb-3 block">Tags phổ biến</Label>
                    <div className="flex flex-wrap gap-1.5">
                        {uniqueConceptTags.slice(0, 12).map(tag => {
                            const isActive = filters.tags.includes(tag)
                            return (
                                <Badge
                                    key={tag}
                                    variant={isActive ? "default" : "outline"}
                                    className="cursor-pointer text-xs"
                                    onClick={() => toggleTag(tag)}
                                >
                                    {tag}
                                </Badge>
                            )
                        })}
                    </div>
                </div>

                {/* Clear Filters */}
                {activeCount > 0 && (
                    <Button variant="outline" size="sm" className="w-full" onClick={onResetFilters}>
                        <X className="h-4 w-4 mr-2" />
                        Xóa bộ lọc
                        <Badge variant="secondary" className="ml-2">{activeCount}</Badge>
                    </Button>
                )}
            </div>
        </div>
    )
}
