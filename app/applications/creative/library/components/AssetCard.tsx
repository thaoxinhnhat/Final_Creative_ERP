"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, ExternalLink, User, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Asset } from "../types"
import {
  CATEGORY_CONFIG,
  TYPE_CONFIG,
  WORKFLOW_STAGE_CONFIG,
  TEAM_CONFIG,
  AD_NETWORK_CONFIG,
  DEPLOYMENT_STATUS_CONFIG
} from "../types"

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

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
  })
}

export function AssetCard({ asset, viewMode = 'grid', isSelected = false, onClick, onDownload }: AssetCardProps) {
  const catConfig = CATEGORY_CONFIG[asset.category]
  const typeConfig = TYPE_CONFIG[asset.type]
  const workflowConfig = WORKFLOW_STAGE_CONFIG[asset.workflowStage]

  // Count good/bad/testing ratings
  const ratings = asset.uaTestStatus?.performanceRating || {}
  const goodCount = Object.values(ratings).filter(r => r === 'good').length
  const badCount = Object.values(ratings).filter(r => r === 'bad').length

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
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center flex-shrink-0 overflow-hidden relative">
          {asset.thumbnailUrl ? (
            <img src={asset.thumbnailUrl} alt={asset.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl">{typeConfig.icon}</span>
          )}
          {asset.driveUrl && (
            <div className="absolute top-0.5 right-0.5">
              <ExternalLink className="h-3 w-3 text-blue-500" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-sm truncate">
              {asset.parsedAssetId || asset.name}
            </h3>
            {asset.isCreativeAI && (
              <Badge className="text-[10px] bg-gradient-to-r from-purple-500 to-pink-500 text-white px-1 py-0">
                🤖 AI
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {formatFileSize(asset.fileSize)} • {asset.fileExtension.toUpperCase()}
          </p>
          <div className="flex flex-wrap gap-1 mt-1">
            <Badge variant="secondary" className={cn("text-[10px]", workflowConfig.bgColor)}>
              {workflowConfig.icon} {workflowConfig.label}
            </Badge>
            {asset.team && (
              <Badge variant="outline" className={cn("text-[10px]", TEAM_CONFIG[asset.team].color)}>
                {TEAM_CONFIG[asset.team].icon}
              </Badge>
            )}
          </div>
        </div>

        {/* Network Indicators */}
        {asset.uaTestStatus?.testedNetworks && asset.uaTestStatus.testedNetworks.length > 0 && (
          <div className="flex gap-0.5">
            {asset.uaTestStatus.testedNetworks.slice(0, 4).map(network => {
              const rating = ratings[network]
              return (
                <span
                  key={network}
                  className={cn(
                    "text-xs px-1 py-0.5 rounded",
                    rating === 'good' && "bg-green-100 text-green-700",
                    rating === 'bad' && "bg-red-100 text-red-700",
                    rating === 'testing' && "bg-yellow-100 text-yellow-700"
                  )}
                >
                  {AD_NETWORK_CONFIG[network].icon}
                </span>
              )
            })}
          </div>
        )}

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

  // Grid view - Enhanced
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

        {/* Drive Icon */}
        {asset.driveUrl && (
          <div className="absolute top-2 left-2 bg-white/80 rounded-full p-1">
            <ExternalLink className="h-3 w-3 text-blue-500" />
          </div>
        )}

        {/* Workflow Badge */}
        <div className="absolute top-2 right-2">
          <Badge className={cn("text-[10px] shadow-sm", workflowConfig.bgColor)}>
            {workflowConfig.icon}
          </Badge>
        </div>

        {/* Live Networks Badge */}
        {asset.liveNetworks && asset.liveNetworks.length > 0 && (
          <div className="absolute bottom-2 left-2">
            <Badge className="text-[10px] bg-green-500 text-white shadow-sm">
              🟢 Live on {asset.liveNetworks.length}
            </Badge>
          </div>
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
        {/* Asset ID / Name */}
        <div className="flex items-start justify-between gap-1">
          <div className="min-w-0">
            <h3 className="font-medium text-sm truncate" title={asset.name}>
              {asset.parsedAssetId || asset.name}
            </h3>
            {asset.parsedAssetId && (
              <p className="text-[10px] text-muted-foreground truncate">
                {asset.name}
              </p>
            )}
          </div>
          {asset.isCreativeAI && (
            <Badge className="text-[10px] bg-gradient-to-r from-purple-500 to-pink-500 text-white flex-shrink-0">
              🤖
            </Badge>
          )}
        </div>

        {/* Metadata Row */}
        <div className="flex items-center gap-1 mt-2 flex-wrap">
          {/* Team Badge */}
          {asset.team && (
            <Badge variant="outline" className={cn("text-[10px] px-1", TEAM_CONFIG[asset.team].color)}>
              {TEAM_CONFIG[asset.team].icon} {TEAM_CONFIG[asset.team].label}
            </Badge>
          )}

          {/* Category */}
          <Badge variant="secondary" className={cn("text-[10px] px-1", catConfig.color)}>
            {catConfig.icon}
          </Badge>

          {/* Deployment Status */}
          {asset.deploymentStatus && asset.deploymentStatus !== 'draft' && (
            <Badge
              variant="outline"
              className={cn("text-[10px] px-1", DEPLOYMENT_STATUS_CONFIG[asset.deploymentStatus].color)}
            >
              {DEPLOYMENT_STATUS_CONFIG[asset.deploymentStatus].icon}
            </Badge>
          )}
        </div>

        {/* Network Performance Indicators */}
        {asset.uaTestStatus?.testedNetworks && asset.uaTestStatus.testedNetworks.length > 0 && (
          <div className="flex items-center gap-1 mt-2">
            <div className="flex gap-0.5 flex-1">
              {asset.uaTestStatus.testedNetworks.slice(0, 5).map(network => {
                const rating = ratings[network]
                const isLive = asset.liveNetworks?.includes(network)
                return (
                  <span
                    key={network}
                    title={`${AD_NETWORK_CONFIG[network].label}: ${rating || 'not tested'}`}
                    className={cn(
                      "text-[10px] w-5 h-5 rounded flex items-center justify-center",
                      rating === 'good' && "bg-green-100 text-green-700",
                      rating === 'bad' && "bg-red-100 text-red-700",
                      rating === 'testing' && "bg-yellow-100 text-yellow-700",
                      !rating && "bg-gray-100 text-gray-500",
                      isLive && "ring-1 ring-green-500"
                    )}
                  >
                    {AD_NETWORK_CONFIG[network].icon}
                  </span>
                )
              })}
              {asset.uaTestStatus.testedNetworks.length > 5 && (
                <span className="text-[10px] text-muted-foreground">
                  +{asset.uaTestStatus.testedNetworks.length - 5}
                </span>
              )}
            </div>

            {/* Performance Summary */}
            {(goodCount > 0 || badCount > 0) && (
              <div className="text-[10px] flex gap-1">
                {goodCount > 0 && <span className="text-green-600">{goodCount}✓</span>}
                {badCount > 0 && <span className="text-red-600">{badCount}✗</span>}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-2.5 w-2.5" />
            {formatDate(asset.updatedAt)}
          </span>
          {asset.currentOwner && (
            <span className="flex items-center gap-1">
              <User className="h-2.5 w-2.5" />
              {asset.currentOwner}
            </span>
          )}
          <span className="flex items-center gap-2">
            <span><Eye className="h-2.5 w-2.5 inline" /> {asset.views}</span>
            <span><Download className="h-2.5 w-2.5 inline" /> {asset.downloads}</span>
          </span>
        </div>
      </div>
    </div>
  )
}
