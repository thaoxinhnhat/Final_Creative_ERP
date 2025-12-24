"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Asset } from "../types"
import { CATEGORY_CONFIG, TYPE_CONFIG } from "../types"

interface AssetCardProps {
  asset: Asset
  viewMode?: 'grid' | 'list'
  isSelected?: boolean
  onClick: () => void
  onDownload: () => void
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}

export function AssetCard({ asset, viewMode = 'grid', isSelected = false, onClick, onDownload }: AssetCardProps) {
  const catConfig = CATEGORY_CONFIG[asset.category]
  const typeConfig = TYPE_CONFIG[asset.type]

  if (viewMode === 'list') {
    return (
      <div
        className={cn(
          "bg-white dark:bg-gray-900 border rounded-lg p-3 flex items-center gap-4 hover:shadow-md transition cursor-pointer",
          isSelected && "ring-2 ring-blue-500"
        )}
        onClick={onClick}
      >
        {/* Thumbnail */}
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
          {asset.thumbnailUrl ? (
            <img src={asset.thumbnailUrl} alt={asset.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl">{typeConfig.icon}</span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">{asset.name}</h3>
          <p className="text-xs text-muted-foreground">
            {formatFileSize(asset.fileSize)} • {asset.fileExtension.toUpperCase()}
          </p>
          <Badge variant="secondary" className={cn("text-xs mt-1", catConfig.color)}>
            {catConfig.icon} {catConfig.label}
          </Badge>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" /> {asset.views}
          </span>
          <span className="flex items-center gap-1">
            <Download className="h-3 w-3" /> {asset.downloads}
          </span>
        </div>

        {/* Download */}
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation()
            onDownload()
          }}
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  // Grid view
  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-900 border rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer group",
        isSelected && "ring-2 ring-blue-500"
      )}
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="aspect-square bg-gray-100 dark:bg-gray-800 flex items-center justify-center relative overflow-hidden">
        {asset.thumbnailUrl ? (
          <img src={asset.thumbnailUrl} alt={asset.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-4xl">{typeConfig.icon}</span>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
          <Button size="sm" variant="secondary">
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation()
              onDownload()
            }}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-medium text-sm truncate mb-1">{asset.name}</h3>
        <p className="text-xs text-muted-foreground mb-2">
          {formatFileSize(asset.fileSize)} • {asset.fileExtension.toUpperCase()}
        </p>
        <Badge variant="secondary" className={cn("text-xs", catConfig.color)}>
          {catConfig.icon} {catConfig.label}
        </Badge>
      </div>
    </div>
  )
}
