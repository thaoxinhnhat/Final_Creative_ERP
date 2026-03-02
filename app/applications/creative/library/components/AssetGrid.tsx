"use client"

import { Loader2, FolderOpen } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import type { Asset, AssetFilters, Brief } from "../types"
import { AssetCard } from "./AssetCard"
import { BriefCarousel } from "./BriefCarousel"

interface AssetGridProps {
  assets: Asset[]
  briefs: Brief[]
  viewMode: 'grid' | 'list'
  isLoading: boolean
  selectedId: string | null
  onSelectAsset: (asset: Asset) => void
  onDownload: (asset: Asset) => void
  onClickBrief: (brief: Brief) => void
  showBriefsOnly: boolean
  onToggleBriefsOnly: () => void
  sortBy: AssetFilters['sortBy']
  onSortChange: (sortBy: AssetFilters['sortBy']) => void
}

export function AssetGrid({
  assets,
  briefs,
  viewMode,
  isLoading,
  selectedId,
  onSelectAsset,
  onDownload,
  onClickBrief,
  showBriefsOnly,
  onToggleBriefsOnly,
  sortBy,
  onSortChange
}: AssetGridProps) {
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="flex-1 h-full overflow-y-auto bg-gray-50 dark:bg-gray-950">

      {/* ===== Section 1: Recent Briefs Carousel / Full Grid ===== */}
      {(briefs.length > 0 || showBriefsOnly) && (
        <BriefCarousel
          briefs={briefs}
          showAll={showBriefsOnly}
          onClickBrief={onClickBrief}
          onViewAll={onToggleBriefsOnly}
        />
      )}

      {/* ===== Section 2: Assets Grid (hidden when showBriefsOnly) ===== */}
      {!showBriefsOnly && (
        <div className="px-6 pb-6">
          {/* Divider between sections */}
          {briefs.length > 0 && <Separator className="mb-4" />}

          {/* Header with count and sort */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Hiển thị <span className="font-medium text-foreground">{assets.length}</span> assets
            </p>
            <Select value={sortBy} onValueChange={(v) => onSortChange(v as AssetFilters['sortBy'])}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="oldest">Cũ nhất</SelectItem>
                <SelectItem value="name_asc">Tên A-Z</SelectItem>
                <SelectItem value="name_desc">Tên Z-A</SelectItem>
                <SelectItem value="size">Kích thước</SelectItem>
                <SelectItem value="downloads">Downloads</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Pure Asset Grid */}
          {assets.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {assets.map(asset => (
                  <AssetCard
                    key={asset.id}
                    asset={asset}
                    isSelected={asset.id === selectedId}
                    onClick={() => onSelectAsset(asset)}
                    onDownload={() => onDownload(asset)}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {assets.map(asset => (
                  <AssetCard
                    key={asset.id}
                    asset={asset}
                    viewMode="list"
                    isSelected={asset.id === selectedId}
                    onClick={() => onSelectAsset(asset)}
                    onDownload={() => onDownload(asset)}
                  />
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground font-medium">No assets found</p>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
