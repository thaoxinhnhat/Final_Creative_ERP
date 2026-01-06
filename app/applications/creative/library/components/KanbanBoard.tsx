"use client"

import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { Asset, WorkflowStage, CreativeTeam } from "../types"
import { WORKFLOW_STAGE_CONFIG, AD_NETWORK_CONFIG, TEAM_CONFIG } from "../types"
import { MOCK_BRIEFS } from "../mockData"
import {
    GripVertical, Clock, User, FolderOpen, FileText,
    ChevronDown, ChevronRight, Search, Filter, X
} from "lucide-react"

interface KanbanBoardProps {
    assetsByWorkflow: Record<WorkflowStage, Asset[]>
    onMoveAsset: (assetId: string, newStage: WorkflowStage) => void
    onSelectAsset: (asset: Asset) => void
    selectedId?: string | null
}

// Updated workflow order - removed 'review'
const WORKFLOW_ORDER: WorkflowStage[] = ['brief', 'final', 'test', 'stopped']

export function KanbanBoard({
    assetsByWorkflow,
    onMoveAsset,
    onSelectAsset,
    selectedId,
}: KanbanBoardProps) {
    const [draggedAsset, setDraggedAsset] = useState<Asset | null>(null)
    const [dragOverStage, setDragOverStage] = useState<WorkflowStage | null>(null)

    // All briefs collapsed by default - using a Set to track EXPANDED briefs
    const [expandedBriefs, setExpandedBriefs] = useState<Set<string>>(new Set())

    // Search and filter state
    const [searchQuery, setSearchQuery] = useState("")
    const [teamFilter, setTeamFilter] = useState<CreativeTeam | "all">("all")
    const [briefFilter, setBriefFilter] = useState<string>("all")
    const [showFilters, setShowFilters] = useState(false)

    // Get all briefs used in assets
    const allBriefs = useMemo(() => {
        const briefs = new Set<string>()
        WORKFLOW_ORDER.forEach(stage => {
            (assetsByWorkflow[stage] || []).forEach(asset => {
                if (asset.briefId) briefs.add(asset.briefId)
            })
        })
        return Array.from(briefs)
    }, [assetsByWorkflow])

    // Filter assets based on search and filters
    const filterAssets = (assets: Asset[]): Asset[] => {
        return assets.filter(asset => {
            // Search query
            if (searchQuery) {
                const query = searchQuery.toLowerCase()
                const matchesSearch =
                    asset.name.toLowerCase().includes(query) ||
                    asset.parsedAssetId?.toLowerCase().includes(query) ||
                    asset.creatorCode?.toLowerCase().includes(query) ||
                    asset.projectCode?.toLowerCase().includes(query) ||
                    asset.campaignName?.toLowerCase().includes(query)
                if (!matchesSearch) return false
            }

            // Team filter
            if (teamFilter !== "all" && asset.team !== teamFilter) return false

            // Brief filter
            if (briefFilter !== "all" && asset.briefId !== briefFilter) return false

            return true
        })
    }

    // Group assets by Brief for a given stage
    // Note: 'review' assets are merged into 'final' column
    const getAssetsByBrief = (stage: WorkflowStage) => {
        let stageAssets = filterAssets(assetsByWorkflow[stage] || [])

        // Merge 'review' assets into 'final' column
        if (stage === 'final') {
            const reviewAssets = filterAssets(assetsByWorkflow['review'] || [])
            stageAssets = [...stageAssets, ...reviewAssets]
        }

        const grouped: Record<string, Asset[]> = {}
        const ungrouped: Asset[] = []

        stageAssets.forEach(asset => {
            if (asset.briefId) {
                if (!grouped[asset.briefId]) grouped[asset.briefId] = []
                grouped[asset.briefId].push(asset)
            } else {
                ungrouped.push(asset)
            }
        })

        // Sort each group by date (newest first)
        Object.keys(grouped).forEach(briefId => {
            grouped[briefId].sort((a, b) =>
                new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
            )
        })
        ungrouped.sort((a, b) =>
            new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        )

        return { grouped, ungrouped, totalCount: stageAssets.length }
    }

    const toggleBriefExpand = (stage: WorkflowStage, briefId: string) => {
        const key = `${stage}-${briefId}`
        setExpandedBriefs(prev => {
            const next = new Set(prev)
            if (next.has(key)) next.delete(key)
            else next.add(key)
            return next
        })
    }

    const isBriefExpanded = (stage: WorkflowStage, briefId: string) => {
        return expandedBriefs.has(`${stage}-${briefId}`)
    }

    const handleDragStart = (e: React.DragEvent, asset: Asset) => {
        setDraggedAsset(asset)
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/plain', asset.id)
    }

    const handleDragEnd = () => {
        setDraggedAsset(null)
        setDragOverStage(null)
    }

    const handleDragOver = (e: React.DragEvent, stage: WorkflowStage) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        setDragOverStage(stage)
    }

    const handleDragLeave = () => {
        setDragOverStage(null)
    }

    const handleDrop = (e: React.DragEvent, stage: WorkflowStage) => {
        e.preventDefault()
        setDragOverStage(null)

        if (draggedAsset && draggedAsset.workflowStage !== stage) {
            onMoveAsset(draggedAsset.id, stage)
        }
        setDraggedAsset(null)
    }

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
        })
    }

    const clearFilters = () => {
        setSearchQuery("")
        setTeamFilter("all")
        setBriefFilter("all")
    }

    const hasActiveFilters = searchQuery || teamFilter !== "all" || briefFilter !== "all"

    // Render a single asset card (compact version)
    const renderAssetCard = (asset: Asset) => (
        <Card
            key={asset.id}
            draggable
            onDragStart={(e) => handleDragStart(e, asset)}
            onDragEnd={handleDragEnd}
            onClick={() => onSelectAsset(asset)}
            className={cn(
                "p-2 cursor-grab active:cursor-grabbing",
                "hover:shadow-md hover:border-gray-300 transition-all duration-150",
                "bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700",
                selectedId === asset.id && "ring-2 ring-blue-500 border-blue-300",
                draggedAsset?.id === asset.id && "opacity-40 scale-95"
            )}
        >
            <div className="flex gap-2 items-center">
                <GripVertical className="h-3 w-3 text-gray-300 flex-shrink-0" />

                <div className="w-8 h-8 rounded bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0">
                    {asset.thumbnailUrl ? (
                        <img src={asset.thumbnailUrl} alt={asset.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm">
                            {asset.type === 'video' ? '🎬' : asset.type === 'image' ? '🖼️' : '📄'}
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h4 className="text-[11px] font-medium text-gray-800 dark:text-gray-200 truncate" title={asset.name}>
                        {asset.parsedAssetId || asset.name.split('.')[0]}
                    </h4>
                    <div className="flex items-center gap-2 text-[9px] text-muted-foreground">
                        <span className="flex items-center gap-0.5">
                            <Clock className="h-2 w-2" />
                            {formatDate(asset.uploadedAt)}
                        </span>
                        {asset.currentOwner && (
                            <span className="flex items-center gap-0.5">
                                <User className="h-2 w-2" />
                                {asset.currentOwner}
                            </span>
                        )}
                    </div>
                </div>

                {/* Team & AI badges */}
                <div className="flex gap-1 flex-shrink-0">
                    {asset.team && (
                        <Badge variant="outline" className={cn("text-[8px] px-1 py-0 h-4", TEAM_CONFIG[asset.team].color)}>
                            {TEAM_CONFIG[asset.team].icon}
                        </Badge>
                    )}
                    {asset.isCreativeAI && (
                        <Badge className="text-[8px] px-1 py-0 h-4 bg-violet-100 text-violet-700">AI</Badge>
                    )}
                </div>
            </div>
        </Card>
    )

    // Render a column with Brief grouping
    const renderColumn = (stage: WorkflowStage) => {
        const config = WORKFLOW_STAGE_CONFIG[stage]
        const { grouped, ungrouped, totalCount } = getAssetsByBrief(stage)

        return (
            <div
                key={stage}
                className={cn(
                    "flex-1 min-w-[200px]",
                    "rounded-xl overflow-hidden",
                    "bg-white dark:bg-gray-900",
                    "shadow-sm border border-gray-200 dark:border-gray-700",
                    "transition-all duration-200 flex flex-col",
                    dragOverStage === stage && "ring-2 ring-blue-400 shadow-lg scale-[1.01]"
                )}
                onDragOver={(e) => handleDragOver(e, stage)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, stage)}
            >
                {/* Header */}
                <div className={cn("px-3 py-2", config.headerBg, config.headerBorder)}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-sm">{config.icon}</span>
                            <span className={cn("font-semibold text-xs", config.color)}>{config.label}</span>
                        </div>
                        <Badge variant="secondary" className={cn("text-[10px] font-medium px-1.5 py-0 h-5 rounded-full", config.bgColor, config.color)}>
                            {totalCount}
                        </Badge>
                    </div>
                </div>

                {/* Content - Brief Groups */}
                <div className="flex-1 p-2 space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto bg-gray-50/50 dark:bg-gray-800/50">
                    {Object.keys(grouped).length === 0 && ungrouped.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                            <FolderOpen className="h-6 w-6 mb-2 opacity-30" />
                            <span className="text-[10px]">Kéo thả asset vào đây</span>
                        </div>
                    ) : (
                        <>
                            {/* Grouped by Brief */}
                            {Object.entries(grouped).map(([briefId, assets]) => {
                                const briefInfo = MOCK_BRIEFS[briefId]
                                const isExpanded = isBriefExpanded(stage, briefId)

                                return (
                                    <div key={briefId} className="rounded-lg border border-gray-200 bg-white overflow-hidden">
                                        {/* Brief Header */}
                                        <button
                                            onClick={() => toggleBriefExpand(stage, briefId)}
                                            className={cn(
                                                "w-full flex items-center gap-1.5 px-2 py-1.5 text-left",
                                                "hover:bg-gray-50 transition-colors",
                                                briefInfo?.color ? `border-l-3 ${briefInfo.color}` : "border-l-3 border-l-gray-300"
                                            )}
                                            style={{ borderLeftWidth: '3px', borderLeftColor: briefInfo?.color?.replace('bg-', '') || '#ccc' }}
                                        >
                                            {isExpanded ? (
                                                <ChevronDown className="h-3 w-3 text-gray-400 flex-shrink-0" />
                                            ) : (
                                                <ChevronRight className="h-3 w-3 text-gray-400 flex-shrink-0" />
                                            )}
                                            <FileText className="h-3 w-3 text-gray-500 flex-shrink-0" />
                                            <span className="text-[10px] font-medium text-gray-700 truncate flex-1">
                                                {briefInfo?.name || briefId}
                                            </span>
                                            <Badge variant="secondary" className="text-[9px] px-1 py-0 h-4 flex-shrink-0">
                                                {assets.length}
                                            </Badge>
                                        </button>

                                        {/* Brief Assets - only show when expanded */}
                                        {isExpanded && (
                                            <div className="p-1.5 space-y-1.5 bg-gray-50/50">
                                                {assets.map(asset => renderAssetCard(asset))}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}

                            {/* Ungrouped Assets */}
                            {ungrouped.length > 0 && (
                                <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
                                    <button
                                        onClick={() => toggleBriefExpand(stage, '_ungrouped')}
                                        className="w-full flex items-center gap-1.5 px-2 py-1.5 text-left hover:bg-gray-50 transition-colors border-l-3 border-l-gray-300"
                                        style={{ borderLeftWidth: '3px' }}
                                    >
                                        {isBriefExpanded(stage, '_ungrouped') ? (
                                            <ChevronDown className="h-3 w-3 text-gray-400 flex-shrink-0" />
                                        ) : (
                                            <ChevronRight className="h-3 w-3 text-gray-400 flex-shrink-0" />
                                        )}
                                        <FolderOpen className="h-3 w-3 text-gray-400 flex-shrink-0" />
                                        <span className="text-[10px] font-medium text-gray-500 truncate flex-1">
                                            Chưa gán Brief
                                        </span>
                                        <Badge variant="secondary" className="text-[9px] px-1 py-0 h-4 flex-shrink-0">
                                            {ungrouped.length}
                                        </Badge>
                                    </button>

                                    {isBriefExpanded(stage, '_ungrouped') && (
                                        <div className="p-1.5 space-y-1.5 bg-gray-50/50">
                                            {ungrouped.map(asset => renderAssetCard(asset))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full">
            {/* Search & Filter Header */}
            <div className="px-2 py-3 border-b bg-white dark:bg-gray-900">
                <div className="flex items-center gap-2">
                    {/* Search */}
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                            placeholder="Tìm kiếm asset..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-8 pl-8 text-xs"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-2 top-1/2 -translate-y-1/2"
                            >
                                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                            </button>
                        )}
                    </div>

                    {/* Filter Toggle */}
                    <Button
                        variant={showFilters ? "secondary" : "outline"}
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter className="h-3 w-3 mr-1" />
                        Lọc
                        {hasActiveFilters && (
                            <Badge className="ml-1 h-4 w-4 p-0 flex items-center justify-center text-[9px]">
                                !
                            </Badge>
                        )}
                    </Button>

                    {/* Clear Filters */}
                    {hasActiveFilters && (
                        <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={clearFilters}>
                            <X className="h-3 w-3 mr-1" />
                            Xóa lọc
                        </Button>
                    )}
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <div className="flex items-center gap-3 mt-2 pt-2 border-t">
                        {/* Team Filter */}
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs text-muted-foreground">Team:</span>
                            <Select value={teamFilter} onValueChange={(v) => setTeamFilter(v as CreativeTeam | "all")}>
                                <SelectTrigger className="h-7 w-[120px] text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả</SelectItem>
                                    {Object.entries(TEAM_CONFIG).map(([key, config]) => (
                                        <SelectItem key={key} value={key}>
                                            {config.icon} {config.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Brief Filter */}
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs text-muted-foreground">Brief:</span>
                            <Select value={briefFilter} onValueChange={setBriefFilter}>
                                <SelectTrigger className="h-7 w-[180px] text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả Brief</SelectItem>
                                    {allBriefs.map(briefId => (
                                        <SelectItem key={briefId} value={briefId}>
                                            {MOCK_BRIEFS[briefId]?.name || briefId}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}
            </div>

            {/* Kanban Columns */}
            <div className="flex-1 flex gap-3 overflow-x-auto p-3">
                {WORKFLOW_ORDER.map(stage => renderColumn(stage))}
            </div>
        </div>
    )
}
