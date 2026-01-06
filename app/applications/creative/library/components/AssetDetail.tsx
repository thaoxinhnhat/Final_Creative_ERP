"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { X, Download, ExternalLink, Edit, Trash2, Eye, Link2, Clock, User, Youtube, Gamepad2, Loader2, Check, RefreshCw, Copy, Unlink } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { Asset, UATestStatus, AdNetwork, DeploymentStatus, PerformanceRating } from "../types"
import {
  CATEGORY_CONFIG,
  TYPE_CONFIG,
  WORKFLOW_STAGE_CONFIG,
  TEAM_CONFIG,
  AD_NETWORK_CONFIG,
  DEPLOYMENT_STATUS_CONFIG
} from "../types"
import { UATestingPanel } from "./UATestingPanel"
import { isValidDriveUrl } from "../utils/driveParser"

interface AssetDetailProps {
  asset: Asset
  onClose: () => void
  onDownload: () => void
  onDelete: () => void
  onUpdateUAStatus?: (updates: Partial<UATestStatus>) => void
  onSetNetworkStatus?: (network: AdNetwork, rating: PerformanceRating) => void
  onUpdateDeployment?: (status: DeploymentStatus, stopReason?: string) => void
  onUpdateLiveNetworks?: (networks: AdNetwork[]) => void
  onUpdateDriveInfo?: (driveUrl: string) => Promise<boolean>
  onRemoveDriveLink?: () => void
  isUpdatingDrive?: boolean
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}

export function AssetDetail({
  asset,
  onClose,
  onDownload,
  onDelete,
  onUpdateUAStatus,
  onSetNetworkStatus,
  onUpdateDeployment,
  onUpdateLiveNetworks,
  onUpdateDriveInfo,
  onRemoveDriveLink,
  isUpdatingDrive = false,
}: AssetDetailProps) {
  const [isEditingDrive, setIsEditingDrive] = useState(false)
  const [driveUrlInput, setDriveUrlInput] = useState(asset.driveUrl || "")
  const [driveError, setDriveError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleDriveLinkSave = async () => {
    if (!driveUrlInput.trim()) {
      setDriveError("Vui lòng nhập link Google Drive")
      return
    }

    if (!isValidDriveUrl(driveUrlInput.trim())) {
      setDriveError("Link Google Drive không hợp lệ")
      return
    }

    setDriveError(null)
    if (onUpdateDriveInfo) {
      const success = await onUpdateDriveInfo(driveUrlInput.trim())
      if (success) {
        setIsEditingDrive(false)
      } else {
        setDriveError("Không thể lấy thông tin từ Drive")
      }
    }
  }

  const handleCopyLink = () => {
    if (asset.driveUrl) {
      navigator.clipboard.writeText(asset.driveUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleRemoveDriveLink = () => {
    if (onRemoveDriveLink) {
      onRemoveDriveLink()
      setDriveUrlInput("")
      setIsEditingDrive(false)
    }
  }
  const catConfig = CATEGORY_CONFIG[asset.category]
  const typeConfig = TYPE_CONFIG[asset.type]
  const workflowConfig = WORKFLOW_STAGE_CONFIG[asset.workflowStage]

  return (
    <div className="w-full h-full border-l bg-white dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex items-start justify-between">
        <div>
          <h2 className="font-semibold text-lg">Asset Details</h2>
          {asset.parsedAssetId && (
            <p className="text-xs text-muted-foreground">{asset.parsedAssetId}</p>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Preview */}
          <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden relative">
            {asset.thumbnailUrl ? (
              <img src={asset.thumbnailUrl} alt={asset.name} className="w-full h-full object-contain" />
            ) : (
              <span className="text-6xl">{typeConfig.icon}</span>
            )}

            {/* Workflow Badge */}
            <Badge className={cn("absolute top-2 right-2 text-xs", workflowConfig.bgColor)}>
              {workflowConfig.icon} {workflowConfig.label}
            </Badge>

            {/* Drive Link */}
            {asset.driveUrl && (
              <a
                href={asset.driveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-2 left-2 bg-white/80 rounded-full p-1.5 hover:bg-white transition"
              >
                <Link2 className="h-4 w-4 text-blue-500" />
              </a>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button size="sm" className="flex-1" onClick={onDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            {asset.driveUrl && (
              <Button size="sm" variant="outline" asChild>
                <a href={asset.driveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>

          {/* Quick Info Badges */}
          <div className="flex flex-wrap gap-2">
            {asset.team && (
              <Badge variant="outline" className={cn("text-xs", TEAM_CONFIG[asset.team].color)}>
                {TEAM_CONFIG[asset.team].icon} {TEAM_CONFIG[asset.team].label}
              </Badge>
            )}
            <Badge variant="secondary" className={cn("text-xs", catConfig.color)}>
              {catConfig.icon} {catConfig.label}
            </Badge>
            {asset.isCreativeAI && (
              <Badge className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                🤖 AI Generated
              </Badge>
            )}
            {asset.deploymentStatus && (
              <Badge variant="outline" className={cn("text-xs", DEPLOYMENT_STATUS_CONFIG[asset.deploymentStatus].color)}>
                {DEPLOYMENT_STATUS_CONFIG[asset.deploymentStatus].icon} {DEPLOYMENT_STATUS_CONFIG[asset.deploymentStatus].label}
              </Badge>
            )}
          </div>

          <Separator />

          {/* Info */}
          <div className="space-y-3 text-sm">
            <div>
              <Label className="text-xs font-semibold text-muted-foreground uppercase">File Name</Label>
              <p className="mt-1 break-words font-medium text-sm">{asset.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs font-semibold text-muted-foreground uppercase">Type</Label>
                <p className="mt-1 text-sm">{asset.fileExtension.toUpperCase()}</p>
              </div>
              <div>
                <Label className="text-xs font-semibold text-muted-foreground uppercase">Size</Label>
                <p className="mt-1 text-sm">{formatFileSize(asset.fileSize)}</p>
              </div>
            </div>

            {/* Parsed Asset ID Info */}
            {asset.projectCode && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">Project</Label>
                  <p className="mt-1 text-sm">{asset.projectCode}</p>
                </div>
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">Creator</Label>
                  <p className="mt-1 text-sm">{asset.creatorCode || asset.currentOwner || '-'}</p>
                </div>
              </div>
            )}

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
                <p className="mt-1 text-xs text-muted-foreground">{asset.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              {asset.campaignName && (
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">Campaign</Label>
                  <p className="mt-1 text-xs">{asset.campaignName}</p>
                </div>
              )}
              {asset.appName && (
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">App</Label>
                  <p className="mt-1 text-xs">{asset.appName}</p>
                </div>
              )}
            </div>

            {asset.briefId && (
              <div>
                <Label className="text-xs font-semibold text-muted-foreground uppercase">Linked Brief</Label>
                <Button variant="link" size="sm" className="p-0 h-auto mt-1 text-xs">
                  View brief #{asset.briefId}
                </Button>
              </div>
            )}
          </div>

          <Separator />

          {/* Google Drive Link Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
                <Link2 className="h-3.5 w-3.5" />
                Google Drive Link
              </Label>
              {asset.driveUrl && !isEditingDrive && (
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2"
                    onClick={() => setIsEditingDrive(true)}
                    disabled={isUpdatingDrive}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>

            {/* Display Mode */}
            {asset.driveUrl && !isEditingDrive && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex-1 min-w-0">
                    <a
                      href={asset.driveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline truncate block"
                    >
                      {asset.driveUrl}
                    </a>
                    {asset.driveFileId && (
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        ID: {asset.driveFileId.substring(0, 20)}...
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={handleCopyLink}
                      title="Sao chép link"
                    >
                      {copied ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      asChild
                    >
                      <a href={asset.driveUrl} target="_blank" rel="noopener noreferrer" title="Mở trong Drive">
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </div>

                {/* Refresh Thumbnail Button */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs flex-1"
                    onClick={() => {
                      if (onUpdateDriveInfo && asset.driveUrl) {
                        onUpdateDriveInfo(asset.driveUrl)
                      }
                    }}
                    disabled={isUpdatingDrive}
                  >
                    {isUpdatingDrive ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
                        Đang cập nhật...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-3 w-3 mr-1.5" />
                        Cập nhật Thumbnail
                      </>
                    )}
                  </Button>
                  {onRemoveDriveLink && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={handleRemoveDriveLink}
                      disabled={isUpdatingDrive}
                    >
                      <Unlink className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Edit/Add Mode */}
            {(isEditingDrive || !asset.driveUrl) && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="https://drive.google.com/file/d/..."
                    value={driveUrlInput}
                    onChange={(e) => {
                      setDriveUrlInput(e.target.value)
                      setDriveError(null)
                    }}
                    className={cn(
                      "text-xs flex-1",
                      driveError && "border-red-500 focus-visible:ring-red-500"
                    )}
                    disabled={isUpdatingDrive}
                  />
                </div>
                {driveError && (
                  <p className="text-xs text-red-500">{driveError}</p>
                )}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="text-xs flex-1"
                    onClick={handleDriveLinkSave}
                    disabled={isUpdatingDrive || !driveUrlInput.trim()}
                  >
                    {isUpdatingDrive ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Check className="h-3 w-3 mr-1.5" />
                        {asset.driveUrl ? "Cập nhật" : "Lưu Link"}
                      </>
                    )}
                  </Button>
                  {isEditingDrive && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        setIsEditingDrive(false)
                        setDriveUrlInput(asset.driveUrl || "")
                        setDriveError(null)
                      }}
                      disabled={isUpdatingDrive}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* External Links */}
          {(asset.youtubeUrl || asset.playableUrl || asset.endcardUrl) && (
            <>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase">External Links</Label>
                <div className="flex flex-wrap gap-2">
                  {asset.youtubeUrl && (
                    <Button variant="outline" size="sm" className="text-xs" asChild>
                      <a href={asset.youtubeUrl} target="_blank" rel="noopener noreferrer">
                        <Youtube className="h-3 w-3 mr-1" />
                        YouTube
                      </a>
                    </Button>
                  )}
                  {asset.playableUrl && (
                    <Button variant="outline" size="sm" className="text-xs" asChild>
                      <a href={asset.playableUrl} target="_blank" rel="noopener noreferrer">
                        <Gamepad2 className="h-3 w-3 mr-1" />
                        Playable
                      </a>
                    </Button>
                  )}
                  {asset.endcardUrl && (
                    <Button variant="outline" size="sm" className="text-xs" asChild>
                      <a href={asset.endcardUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Endcard
                      </a>
                    </Button>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* UA Testing Panel */}
          {onUpdateUAStatus && onSetNetworkStatus && onUpdateDeployment && onUpdateLiveNetworks && (
            <UATestingPanel
              asset={asset}
              onUpdateUAStatus={onUpdateUAStatus}
              onSetNetworkStatus={onSetNetworkStatus}
              onUpdateDeployment={onUpdateDeployment}
              onUpdateLiveNetworks={onUpdateLiveNetworks}
            />
          )}

          <Separator />

          {/* Metadata */}
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-3 w-3" />
              <span>Uploaded by {asset.uploadedBy}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              <span>{format(new Date(asset.uploadedAt), "dd/MM/yyyy HH:mm")}</span>
            </div>
            <div className="flex gap-4">
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" /> {asset.views} views
              </span>
              <span className="flex items-center gap-1">
                <Download className="h-3 w-3" /> {asset.downloads} downloads
              </span>
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
