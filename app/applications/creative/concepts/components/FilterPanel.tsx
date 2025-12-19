"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Search, X, GripVertical } from "lucide-react"
import type { ConceptFilters, ConceptStatus } from "../types"
import { STATUS_CONFIG } from "../types"
import { conceptStats, uniqueConceptTags } from "../mockData"

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
        sent_to_design: number
    }
}

export function FilterPanel({
    filters,
    onUpdateFilters,
    onResetFilters,
    stats,
}: FilterPanelProps) {
    // Resizable panel state
    const [panelWidth, setPanelWidth] = useState(260)
    const isResizing = useRef(false)
    const panelRef = useRef<HTMLDivElement>(null)

    const MIN_WIDTH = 200
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
        (filters.tags.length > 0 ? 1 : 0)

    const statusOptions: { value: ConceptStatus | 'all'; label: string; count: number }[] = [
        { value: 'all', label: 'Tất cả', count: stats.total },
        { value: 'draft', label: 'Nháp', count: stats.draft },
        { value: 'pending_review', label: 'Chờ duyệt', count: stats.pending_review },
        { value: 'approved', label: 'Đã duyệt', count: stats.approved },
        { value: 'rejected', label: 'Từ chối', count: stats.rejected },
        { value: 'sent_to_design', label: 'Đã gửi Design', count: stats.sent_to_design },
    ]

    const toggleTag = (tag: string) => {
        const newTags = filters.tags.includes(tag)
            ? filters.tags.filter(t => t !== tag)
            : [...filters.tags, tag]
        onUpdateFilters({ tags: newTags })
    }

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

                {/* Status Filter */}
                <div>
                    <Label className="text-sm font-semibold mb-3 block">Trạng thái</Label>
                    <div className="space-y-1">
                        {statusOptions.map((opt) => {
                            const isActive = filters.status === opt.value
                            const config = opt.value !== 'all' ? STATUS_CONFIG[opt.value] : null
                            return (
                                <button
                                    key={opt.value}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${isActive
                                        ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }`}
                                    onClick={() => onUpdateFilters({ status: opt.value })}
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
