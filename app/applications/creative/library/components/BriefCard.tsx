"use client"

import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ClipboardList, User, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Brief } from "../types"
import { BRIEF_STATUS_CONFIG } from "../types"

interface BriefCardProps {
    brief: Brief
    variant?: 'carousel' | 'grid'
    onClick: () => void
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    })
}

export function BriefCard({ brief, variant = 'carousel', onClick }: BriefCardProps) {
    const statusConfig = BRIEF_STATUS_CONFIG[brief.status]

    // Full Grid card (used when filter "Chỉ hiển thị Briefs" is ON)
    if (variant === 'grid') {
        return (
            <div
                className={cn(
                    "bg-white dark:bg-gray-900 border rounded-xl overflow-hidden",
                    "hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-200 cursor-pointer group",
                    "border-l-4",
                    brief.color
                )}
                onClick={onClick}
                title="Xem trong ERP Report"
            >
                {/* Dark Placeholder Area */}
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-800 via-gray-850 to-gray-900 flex flex-col items-center justify-center relative overflow-hidden">
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-[0.03]">
                        <div className="absolute inset-0" style={{
                            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(168,85,247,0.5) 1px, transparent 0)',
                            backgroundSize: '20px 20px'
                        }} />
                    </div>

                    {/* External link icon */}
                    <div className="absolute top-2 right-2 opacity-50 group-hover:opacity-100 transition-opacity">
                        <div className="bg-purple-500/20 rounded-full p-1">
                            <ArrowUpRight className="h-3 w-3 text-purple-400" />
                        </div>
                    </div>

                    {/* BRIEF badge */}
                    <div className="absolute top-2 left-2">
                        <Badge className="text-[10px] bg-purple-600/80 text-purple-100 border-0 shadow-sm">
                            📋 BRIEF
                        </Badge>
                    </div>

                    {/* Center */}
                    <ClipboardList className="h-10 w-10 text-purple-400/50 mb-1.5" />
                    <span className="text-xs font-mono text-gray-500">{brief.briefId}</span>

                    {/* Status badge */}
                    <div className="absolute bottom-2 left-2">
                        <Badge className={cn("text-[10px] border-0 shadow-sm", statusConfig.bgColor, "text-white")}>
                            {statusConfig.icon} {statusConfig.label}
                        </Badge>
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-purple-900/50 opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col items-center justify-center gap-1.5">
                        <ArrowUpRight className="h-7 w-7 text-white" />
                        <span className="text-xs text-purple-100 font-medium">Xem trong ERP Report</span>
                    </div>
                </div>

                {/* Info */}
                <div className="p-3">
                    <h3 className="font-medium text-sm truncate" title={brief.title}>{brief.title}</h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{brief.client}</p>
                    <div className="flex items-center gap-1 mt-2 flex-wrap">
                        {brief.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="outline" className="text-[9px] px-1 py-0 text-muted-foreground">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1"><User className="h-2.5 w-2.5" />{brief.createdBy}</span>
                        <span className="flex items-center gap-1"><Clock className="h-2.5 w-2.5" />{formatDate(brief.createdAt)}</span>
                    </div>
                </div>
            </div>
        )
    }

    // Carousel card (compact, 280-320px wide, ~150px tall)
    return (
        <div
            className={cn(
                "bg-white dark:bg-gray-900 border rounded-xl overflow-hidden flex-shrink-0",
                "hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-600",
                "transition-all duration-200 cursor-pointer group",
                "w-[300px] h-[156px]",
                "border-l-4",
                brief.color
            )}
            onClick={onClick}
            title="Xem trong ERP Report"
        >
            {/* Header row */}
            <div className="flex items-center justify-between px-3 pt-2.5 pb-1">
                <div className="flex items-center gap-1.5">
                    <ClipboardList className="h-4 w-4 text-purple-500" />
                    <Badge className="text-[9px] bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-0 px-1.5 py-0">
                        BRIEF
                    </Badge>
                </div>
                <ArrowUpRight className="h-3.5 w-3.5 text-gray-400 group-hover:text-purple-500 transition-colors" />
            </div>

            {/* Brief ID + Status */}
            <div className="px-3 pb-1">
                <span className="text-[11px] font-mono text-muted-foreground">{brief.briefId}</span>
                <div className="mt-1">
                    <Badge className={cn("text-[10px] border-0 px-1.5 py-0", statusConfig.bgColor, "text-white")}>
                        {statusConfig.icon} {statusConfig.label}
                    </Badge>
                </div>
            </div>

            {/* Title (max 2 lines) */}
            <div className="px-3 pb-1.5">
                <h3 className="font-medium text-sm leading-tight line-clamp-2" title={brief.title}>
                    {brief.title}
                </h3>
            </div>

            {/* Footer */}
            <div className="px-3 pb-2.5 mt-auto">
                <div className="flex items-center justify-between text-[10px] text-muted-foreground border-t pt-1.5">
                    <span className="flex items-center gap-1">
                        <User className="h-2.5 w-2.5" />
                        {brief.createdBy}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" />
                        {formatDate(brief.createdAt)}
                    </span>
                </div>
            </div>
        </div>
    )
}
