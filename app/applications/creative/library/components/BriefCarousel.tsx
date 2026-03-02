"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, ClipboardList } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Brief } from "../types"
import { BriefCard } from "./BriefCard"

interface BriefCarouselProps {
    briefs: Brief[]
    showAll: boolean       // When true: grid layout (filter "Chỉ hiển thị Briefs")
    onClickBrief: (brief: Brief) => void
    onViewAll: () => void  // Toggles the filter
}

export function BriefCarousel({ briefs, showAll, onClickBrief, onViewAll }: BriefCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(false)
    const [isHovered, setIsHovered] = useState(false)

    const checkScroll = useCallback(() => {
        const el = scrollRef.current
        if (!el) return
        setCanScrollLeft(el.scrollLeft > 4)
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
    }, [])

    useEffect(() => {
        checkScroll()
        const el = scrollRef.current
        if (!el) return
        el.addEventListener('scroll', checkScroll, { passive: true })
        window.addEventListener('resize', checkScroll)
        return () => {
            el.removeEventListener('scroll', checkScroll)
            window.removeEventListener('resize', checkScroll)
        }
    }, [checkScroll, briefs])

    const scroll = (direction: 'left' | 'right') => {
        const el = scrollRef.current
        if (!el) return
        const cardWidth = 316 // card width (300) + gap (16)
        el.scrollBy({
            left: direction === 'left' ? -cardWidth * 2 : cardWidth * 2,
            behavior: 'smooth'
        })
    }

    if (briefs.length === 0) {
        if (showAll) {
            return (
                <div className="text-center py-16">
                    <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground font-medium">Chưa có briefs nào</p>
                    <p className="text-sm text-muted-foreground mt-1">Briefs sẽ xuất hiện tại đây khi được tạo</p>
                </div>
            )
        }
        return null // Hide section entirely when no briefs
    }

    // Full grid mode (filter ON)
    if (showAll) {
        return (
            <div className="px-6 pt-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <ClipboardList className="h-5 w-5 text-purple-600" />
                        <h2 className="text-base font-semibold">All Briefs</h2>
                        <Badge className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-0">
                            {briefs.length}
                        </Badge>
                    </div>
                    <button
                        onClick={onViewAll}
                        className="text-xs text-purple-600 hover:text-purple-700 font-medium hover:underline transition-colors"
                    >
                        Hiển thị tất cả ←
                    </button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-6">
                    {briefs.map(brief => (
                        <BriefCard
                            key={brief.id}
                            brief={brief}
                            variant="grid"
                            onClick={() => onClickBrief(brief)}
                        />
                    ))}
                </div>
            </div>
        )
    }

    // Carousel mode (default)
    return (
        <div
            className="relative group/carousel"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Section Header */}
            <div className="flex items-center justify-between px-6 pt-4 pb-2">
                <div className="flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 text-purple-600" />
                    <h2 className="text-sm font-semibold">Recent Briefs</h2>
                    <Badge className="text-[10px] bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-0 px-1.5">
                        {briefs.length}
                    </Badge>
                </div>
                <button
                    onClick={onViewAll}
                    className="text-xs text-purple-600 hover:text-purple-700 font-medium hover:underline transition-colors"
                >
                    View all →
                </button>
            </div>

            {/* Carousel Track */}
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide px-6 pb-4 pt-1 snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {briefs.map(brief => (
                    <div key={brief.id} className="snap-start">
                        <BriefCard
                            brief={brief}
                            variant="carousel"
                            onClick={() => onClickBrief(brief)}
                        />
                    </div>
                ))}
            </div>

            {/* Left Arrow */}
            {canScrollLeft && (
                <button
                    onClick={() => scroll('left')}
                    className={cn(
                        "absolute left-1 top-1/2 -translate-y-1/2 mt-2",
                        "w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-lg border",
                        "flex items-center justify-center",
                        "hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200",
                        "opacity-0 group-hover/carousel:opacity-100"
                    )}
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>
            )}

            {/* Right Arrow */}
            {canScrollRight && (
                <button
                    onClick={() => scroll('right')}
                    className={cn(
                        "absolute right-1 top-1/2 -translate-y-1/2 mt-2",
                        "w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-lg border",
                        "flex items-center justify-center",
                        "hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200",
                        "opacity-0 group-hover/carousel:opacity-100"
                    )}
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            )}
        </div>
    )
}
