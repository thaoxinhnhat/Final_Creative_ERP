"use client"

import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { ClipboardList, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Brief } from "../types"
import { BriefCard } from "./BriefCard"

interface BriefCarouselProps {
    briefs: Brief[]
    onClickBrief: (brief: Brief) => void
}

export function BriefCarousel({ briefs, onClickBrief }: BriefCarouselProps) {
    const [searchKeyword, setSearchKeyword] = useState("")

    // Filter briefs by keyword (search across title, campaignName, client, briefId, createdBy, tags)
    const filteredBriefs = useMemo(() => {
        if (!searchKeyword.trim()) return briefs
        const keyword = searchKeyword.toLowerCase().trim()
        return briefs.filter(brief => {
            const searchableFields = [
                brief.title,
                brief.campaignName,
                brief.client,
                brief.briefId,
                brief.createdBy,
                ...(brief.tags || []),
            ]
            return searchableFields.some(field =>
                field?.toLowerCase().includes(keyword)
            )
        })
    }, [briefs, searchKeyword])

    if (briefs.length === 0) {
        return (
            <div className="text-center py-16">
                <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground font-medium">Chưa có briefs nào</p>
                <p className="text-sm text-muted-foreground mt-1">Briefs sẽ xuất hiện tại đây khi được tạo</p>
            </div>
        )
    }

    return (
        <div className="px-6 pt-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5 text-purple-600" />
                    <h2 className="text-base font-semibold">All Briefs</h2>
                    <Badge className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-0">
                        {filteredBriefs.length}
                    </Badge>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6 mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="Tìm kiếm brief theo tên, campaign, client, tags..."
                    className={cn(
                        "w-full pl-9 pr-9 py-2 rounded-lg text-sm",
                        "bg-white dark:bg-gray-900",
                        "border border-gray-200 dark:border-gray-700",
                        "placeholder:text-muted-foreground",
                        "focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500",
                        "transition-all duration-200"
                    )}
                />
                {searchKeyword && (
                    <button
                        onClick={() => setSearchKeyword("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Grid */}
            {filteredBriefs.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-6">
                    {filteredBriefs.map(brief => (
                        <BriefCard
                            key={brief.id}
                            brief={brief}
                            variant="grid"
                            onClick={() => onClickBrief(brief)}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <Search className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground font-medium">Không tìm thấy brief nào</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Thử tìm kiếm với từ khóa khác
                    </p>
                </div>
            )}
        </div>
    )
}
