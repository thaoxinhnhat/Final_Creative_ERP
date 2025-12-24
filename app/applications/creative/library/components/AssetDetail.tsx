"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Download, ExternalLink, Edit, Trash2, Eye } from "lucide-react"
import { format } from "date-fns"
import type { Asset } from "../types"
import { CATEGORY_CONFIG, TYPE_CONFIG } from "../types"

interface AssetDetailProps {
  asset: Asset
  onClose: () => void
  onDownload: () => void
  onDelete: () => void
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}

export function AssetDetail({ asset, onClose, onDownload, onDelete }: AssetDetailProps) {
  const catConfig = CATEGORY_CONFIG[asset.category]
  const typeConfig = TYPE_CONFIG[asset.type]

  return (
    <div className="w-[320px] border-l bg-white dark:bg-gray-900 flex-shrink-0 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex items-start justify-between">
        <h2 className="font-semibold text-lg">Asset Details</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Preview */}
          <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
            {asset.thumbnailUrl ? (
              <img src={asset.thumbnailUrl} alt={asset.name} className="w-full h-full object-contain" />
            ) : (
              <span className="text-6xl">{typeConfig.icon}</span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button size="sm" className="flex-1" onClick={onDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button size="sm" variant="outline">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>

          {/* Info */}
          <div className="space-y-4 text-sm">
            <div>
              <Label className="text-xs font-semibold text-muted-foreground uppercase">File Name</Label>
              <p className="mt-1 break-words font-medium">{asset.name}</p>
            </div>

            <div>
              <Label className="text-xs font-semibold text-muted-foreground uppercase">Type & Size</Label>
              <p className="mt-1">{asset.fileExtension.toUpperCase()} • {formatFileSize(asset.fileSize)}</p>
            </div>

            <div>
              <Label className="text-xs font-semibold text-muted-foreground uppercase">Category</Label>
              <div className="mt-1">
                <Badge variant="secondary" className={catConfig.color}>
                  {catConfig.icon} {catConfig.label}
                </Badge>
              </div>
            </div>

            {asset.tags.length > 0 && (
              <div>
                <Label className="text-xs font-semibold text-muted-foreground uppercase">Tags</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {asset.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}

            {asset.description && (
              <div>
                <Label className="text-xs font-semibold text-muted-foreground uppercase">Description</Label>
                <p className="mt-1 text-sm text-muted-foreground">{asset.description}</p>
              </div>
            )}

            {asset.campaignName && (
              <div>
                <Label className="text-xs font-semibold text-muted-foreground uppercase">Campaign</Label>
                <p className="mt-1">{asset.campaignName}</p>
              </div>
            )}

            {asset.appName && (
              <div>
                <Label className="text-xs font-semibold text-muted-foreground uppercase">App</Label>
                <p className="mt-1">{asset.appName}</p>
              </div>
            )}

            {asset.briefId && (
              <div>
                <Label className="text-xs font-semibold text-muted-foreground uppercase">Linked Brief</Label>
                <Button variant="link" size="sm" className="p-0 h-auto mt-1">
                  View brief #{asset.briefId}
                </Button>
              </div>
            )}

            <div>
              <Label className="text-xs font-semibold text-muted-foreground uppercase">Uploaded</Label>
              <p className="mt-1 text-xs text-muted-foreground">
                By {asset.uploadedBy}<br />
                {format(new Date(asset.uploadedAt), "dd/MM/yyyy HH:mm")}
              </p>
            </div>

            <div>
              <Label className="text-xs font-semibold text-muted-foreground uppercase">Stats</Label>
              <div className="mt-1 flex gap-4 text-xs">
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" /> {asset.views} views
                </span>
                <span className="flex items-center gap-1">
                  <Download className="h-3 w-3" /> {asset.downloads} downloads
                </span>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t flex gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
