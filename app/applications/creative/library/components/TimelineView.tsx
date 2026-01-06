"use client"

import { useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Asset } from "../types"
import { WORKFLOW_STAGE_CONFIG, TEAM_CONFIG, AD_NETWORK_CONFIG } from "../types"
import { Clock, User, ExternalLink, Download, Eye } from "lucide-react"

interface TimelineViewProps {
    assets: Asset[]
    onSelectAsset: (asset: Asset) => void
    selectedId?: string | null
}

interface GroupedAssets {
    date: string
    label: string
    assets: Asset[]
}

export function TimelineView({ assets, onSelectAsset, selectedId }: TimelineViewProps) {
    // Group assets by date
    const groupedAssets = useMemo(() => {
        const groups: Record<string, Asset[]> = {}

        assets.forEach(asset => {
            const date = new Date(asset.uploadedAt)
            const dateKey = date.toISOString().split('T')[0]

            if (!groups[dateKey]) {
                groups[dateKey] = []
            }
            groups[dateKey].push(asset)
        })

        // Sort groups by date descending
        return Object.entries(groups)
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([date, assets]) => {
                const dateObj = new Date(date)
                const today = new Date()
                const yesterday = new Date(today)
                yesterday.setDate(yesterday.getDate() - 1)

                let label: string
                if (dateObj.toDateString() === today.toDateString()) {
                    label = 'Hôm nay'
                } else if (dateObj.toDateString() === yesterday.toDateString()) {
                    label = 'Hôm qua'
                } else {
                    label = dateObj.toLocaleDateString('vi-VN', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                    })
                }

                return {
                    date,
                    label,
                    assets: assets.sort(
                        (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
                    ),
                }
            }) as GroupedAssets[]
    }, [assets])

    const formatTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    return (
        <div className="space-y-6 p-4">
            {groupedAssets.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-2 opacity-30" />
                    <p>No assets found</p>
                </div>
            ) : (
                groupedAssets.map(group => (
                    <div key={group.date}>
                        {/* Date Header */}
                        <div className="sticky top-0 bg-gray-50 dark:bg-gray-950 py-2 z-10">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500" />
                                <h3 className="font-semibold text-sm">{group.label}</h3>
                                <Badge variant="outline" className="text-xs">
                                    {group.assets.length} assets
                                </Badge>
                            </div>
                            <div className="ml-1.5 border-l-2 border-blue-200 dark:border-blue-800 h-2" />
                        </div>

                        {/* Assets for this date */}
                        <div className="ml-1.5 border-l-2 border-gray-200 dark:border-gray-700">
                            {group.assets.map((asset, index) => (
                                <div
                                    key={asset.id}
                                    className={cn(
                                        "ml-4 relative cursor-pointer",
                                        "before:absolute before:-left-[17px] before:top-4",
                                        "before:w-2 before:h-2 before:rounded-full before:bg-gray-300",
                                        selectedId === asset.id && "before:bg-blue-500"
                                    )}
                                    onClick={() => onSelectAsset(asset)}
                                >
                                    <div
                                        className={cn(
                                            "p-3 mb-2 rounded-lg border bg-white dark:bg-gray-900",
                                            "hover:shadow-md transition-all",
                                            selectedId === asset.id && "ring-2 ring-blue-500"
                                        )}
                                    >
                                        <div className="flex gap-3">
                                            {/* Thumbnail */}
                                            <div className="w-16 h-16 rounded bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0">
                                                {asset.thumbnailUrl ? (
                                                    <img
                                                        src={asset.thumbnailUrl}
                                                        alt={asset.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-2xl">
                                                        {asset.type === 'video' ? '🎬' : asset.type === 'image' ? '🖼️' : '📄'}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div>
                                                        <h4 className="font-medium text-sm truncate">
                                                            {asset.parsedAssetId || asset.name}
                                                        </h4>
                                                        {asset.parsedAssetId && (
                                                            <p className="text-xs text-muted-foreground truncate">
                                                                {asset.name}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1 flex-shrink-0">
                                                        <Clock className="h-3 w-3" />
                                                        {formatTime(asset.uploadedAt)}
                                                    </span>
                                                </div>

                                                {/* Badges */}
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {/* Workflow Stage */}
                                                    <Badge
                                                        variant="outline"
                                                        className={cn("text-[10px]", WORKFLOW_STAGE_CONFIG[asset.workflowStage].bgColor)}
                                                    >
                                                        {WORKFLOW_STAGE_CONFIG[asset.workflowStage].icon} {WORKFLOW_STAGE_CONFIG[asset.workflowStage].label}
                                                    </Badge>

                                                    {/* Team */}
                                                    {asset.team && (
                                                        <Badge variant="outline" className={cn("text-[10px]", TEAM_CONFIG[asset.team].color)}>
                                                            {TEAM_CONFIG[asset.team].icon}
                                                        </Badge>
                                                    )}

                                                    {/* AI Badge */}
                                                    {asset.isCreativeAI && (
                                                        <Badge className="text-[10px] bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                                            🤖
                                                        </Badge>
                                                    )}

                                                    {/* Networks */}
                                                    {asset.liveNetworks && asset.liveNetworks.length > 0 && (
                                                        <Badge className="text-[10px] bg-green-500 text-white">
                                                            Live: {asset.liveNetworks.map(n => AD_NETWORK_CONFIG[n].icon).join('')}
                                                        </Badge>
                                                    )}
                                                </div>

                                                {/* Footer */}
                                                <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                                                    {asset.currentOwner && (
                                                        <span className="flex items-center gap-1">
                                                            <User className="h-2.5 w-2.5" />
                                                            {asset.currentOwner}
                                                        </span>
                                                    )}
                                                    <span className="flex items-center gap-1">
                                                        <Eye className="h-2.5 w-2.5" />
                                                        {asset.views}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Download className="h-2.5 w-2.5" />
                                                        {asset.downloads}
                                                    </span>
                                                    {asset.driveUrl && (
                                                        <ExternalLink className="h-2.5 w-2.5 text-blue-500" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}
