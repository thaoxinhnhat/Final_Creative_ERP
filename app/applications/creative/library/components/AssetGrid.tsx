"use client"

import { Loader2, FolderOpen } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Asset, AssetFilters } from "../types"
import { AssetCard } from "./AssetCard"

interface AssetGridProps {
  assets: Asset[]
  viewMode: 'grid' | 'list'
  isLoading: boolean
  selectedId: string | null
  onSelectAsset: (asset: Asset) => void
  onDownload: (asset: Asset) => void
  sortBy: AssetFilters['sortBy']
  onSortChange: (sortBy: AssetFilters['sortBy']) => void
}

export function AssetGrid({ 
  assets, 
  viewMode, 
  isLoading, 
  selectedId, 
  onSelectAsset, 
  onDownload, 
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
    <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 p-6">
      {/* Header with count and sort */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{assets.length}</span> assets
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

      {/* Assets */}
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
  )
}
