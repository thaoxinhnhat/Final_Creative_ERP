"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
  asset: Asset | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDownload: () => void
  onDelete: () => void
  onUpdateUAStatus?: (updates: Partial<UATestStatus>) => void
  onSetNetworkStatus?: (network: AdNetwork, rating: PerformanceRating) => void
  onUpdateDeployment?: (status: DeploymentStatus, stopReason?: string) => void
  onUpdateLiveNetworks?: (networks: AdNetwork[]) => void
  onUpdateDriveInfo?: (driveUrl: string) => Promise<boolean>
  onRemoveDriveLink?: () => void
  isUpdatingDrive?: boolean
  userRole?: 'ua_team' | 'creative_team' | 'admin'
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
  open,
  onOpenChange,
  onDownload,
  onDelete,
  onUpdateUAStatus,
  onSetNetworkStatus,
  onUpdateDeployment,
  onUpdateLiveNetworks,
  onUpdateDriveInfo,
  onRemoveDriveLink,
  isUpdatingDrive = false,
  userRole = 'creative_team',
}: AssetDetailProps) {
  const [isEditingDrive, setIsEditingDrive] = useState(false)
  const [driveUrlInput, setDriveUrlInput] = useState("")
  const [driveError, setDriveError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [lastAssetId, setLastAssetId] = useState<string | null>(null)

  // Reset input when different asset is opened
  if (asset && asset.id !== lastAssetId) {
    setLastAssetId(asset.id)
    setDriveUrlInput(asset.driveUrl || "")
    setIsEditingDrive(false)
    setDriveError(null)
  }

  if (!asset) return null

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[90vw] max-h-[95vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 py-3 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg">Asset Details</DialogTitle>
              {asset.parsedAssetId && (
                <p className="text-xs text-muted-foreground mt-0.5">{asset.parsedAssetId}</p>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Main 3-column layout */}
            <div className="grid grid-cols-3 gap-6">

              {/* Column 1: Preview + Actions */}
              <div className="space-y-3">
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden relative">
                  {asset.thumbnailUrl ? (
                    <img src={asset.thumbnailUrl} alt={asset.name} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-5xl">{typeConfig.icon}</span>
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
                <div className="flex flex-wrap gap-1.5">
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
                      🤖 AI
                    </Badge>
                  )}
                  {asset.deploymentStatus && (
                    <Badge variant="outline" className={cn("text-xs", DEPLOYMENT_STATUS_CONFIG[asset.deploymentStatus].color)}>
                      {DEPLOYMENT_STATUS_CONFIG[asset.deploymentStatus].icon} {DEPLOYMENT_STATUS_CONFIG[asset.deploymentStatus].label}
                    </Badge>
                  )}
                </div>

                {/* Metadata */}
                <div className="space-y-1 text-xs text-muted-foreground pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <User className="h-3 w-3" />
                    <span>{asset.uploadedBy}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <span>{format(new Date(asset.uploadedAt), "dd/MM/yyyy HH:mm")}</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" /> {asset.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="h-3 w-3" /> {asset.downloads}
                    </span>
                  </div>
                </div>
              </div>

              {/* Column 2: File Info + Drive Link */}
              <div className="space-y-3 text-sm">
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">File Name</Label>
                  <p className="mt-0.5 break-words font-medium text-sm">{asset.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs font-semibold text-muted-foreground uppercase">Type</Label>
                    <p className="mt-0.5 text-sm">{asset.fileExtension.toUpperCase()}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-muted-foreground uppercase">Size</Label>
                    <p className="mt-0.5 text-sm">{formatFileSize(asset.fileSize)}</p>
                  </div>
                </div>

                {/* App/Game & Team Dựng */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs font-semibold text-muted-foreground uppercase">Loại Asset</Label>
                    <p className="mt-0.5 text-sm">
                      {asset.assetPlatform === 'game' ? (
                        <span className="flex items-center gap-1">🎮 Game</span>
                      ) : asset.assetPlatform === 'app' ? (
                        <span className="flex items-center gap-1">📱 App</span>
                      ) : (
                        <span className="text-muted-foreground italic">(trống)</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-muted-foreground uppercase">Team Dựng</Label>
                    <p className="mt-0.5 text-sm">{asset.productionTeam || asset.creatorCode || asset.currentOwner || <span className="text-muted-foreground italic">(trống)</span>}</p>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">Category</Label>
                  <p className="mt-0.5 text-sm">
                    {catConfig.icon} {catConfig.label}
                  </p>
                </div>

                {/* Campaign & App Name */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs font-semibold text-muted-foreground uppercase">Campaign</Label>
                    <p className="mt-0.5 text-xs">{asset.campaignName || <span className="text-muted-foreground italic">(trống)</span>}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-muted-foreground uppercase">Tên App/Game</Label>
                    <p className="mt-0.5 text-xs">{asset.appName || <span className="text-muted-foreground italic">(trống)</span>}</p>
                  </div>
                </div>

                {/* Themes - NEW */}
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">Themes</Label>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {asset.themes && asset.themes.length > 0 ? (
                      asset.themes.map(theme => (
                        <Badge key={theme} variant="secondary" className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">{theme}</Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground italic">(trống)</span>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">Tags</Label>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {asset.tags.length > 0 ? (
                      asset.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground italic">(trống)</span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">Description</Label>
                  <p className="mt-0.5 text-xs text-muted-foreground">{asset.description || <span className="italic">(trống)</span>}</p>
                </div>

                <Separator className="my-2" />

                {/* Google Drive Link Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
                      <Link2 className="h-3.5 w-3.5" />
                      Google Drive Link
                    </Label>
                    {asset.driveUrl && !isEditingDrive && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 px-1.5"
                        onClick={() => setIsEditingDrive(true)}
                        disabled={isUpdatingDrive}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    )}
                  </div>

                  {/* Display Mode */}
                  {asset.driveUrl && !isEditingDrive && (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950/30 rounded border border-blue-200 dark:border-blue-800">
                        <div className="flex-1 min-w-0">
                          <a
                            href={asset.driveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline truncate block"
                          >
                            {asset.driveUrl}
                          </a>
                        </div>
                        <div className="flex gap-0.5">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleCopyLink}>
                            {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" asChild>
                            <a href={asset.driveUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        </div>
                      </div>
                      <div className="flex gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs flex-1 h-7"
                          onClick={() => onUpdateDriveInfo && asset.driveUrl && onUpdateDriveInfo(asset.driveUrl)}
                          disabled={isUpdatingDrive}
                        >
                          {isUpdatingDrive ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <RefreshCw className="h-3 w-3 mr-1" />}
                          Cập nhật
                        </Button>
                        {onRemoveDriveLink && (
                          <Button variant="outline" size="sm" className="text-xs text-red-600 h-7 px-2" onClick={handleRemoveDriveLink} disabled={isUpdatingDrive}>
                            <Unlink className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Edit/Add Mode */}
                  {(isEditingDrive || !asset.driveUrl) && (
                    <div className="space-y-1.5">
                      <Input
                        placeholder="https://drive.google.com/file/d/..."
                        value={driveUrlInput}
                        onChange={(e) => { setDriveUrlInput(e.target.value); setDriveError(null) }}
                        className={cn("text-xs h-8", driveError && "border-red-500")}
                        disabled={isUpdatingDrive}
                      />
                      {driveError && <p className="text-xs text-red-500">{driveError}</p>}
                      <div className="flex gap-1.5">
                        <Button size="sm" className="text-xs flex-1 h-7" onClick={handleDriveLinkSave} disabled={isUpdatingDrive || !driveUrlInput.trim()}>
                          {isUpdatingDrive ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Check className="h-3 w-3 mr-1" />}
                          {asset.driveUrl ? "Cập nhật" : "Lưu Link"}
                        </Button>
                        {isEditingDrive && (
                          <Button variant="outline" size="sm" className="text-xs h-7 px-2" onClick={() => { setIsEditingDrive(false); setDriveUrlInput(asset.driveUrl || ""); setDriveError(null) }} disabled={isUpdatingDrive}>
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* External Links - YouTube Link */}
                <div className="space-y-1.5 pt-2 border-t">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">Link YouTube</Label>
                  {asset.youtubeUrl ? (
                    <Button variant="outline" size="sm" className="text-xs h-7" asChild>
                      <a href={asset.youtubeUrl} target="_blank" rel="noopener noreferrer">
                        <Youtube className="h-3 w-3 mr-1 text-red-600" /> {asset.youtubeUrl.length > 40 ? asset.youtubeUrl.substring(0, 40) + '...' : asset.youtubeUrl}
                      </a>
                    </Button>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">(trống)</p>
                  )}
                </div>

                {/* Other External Links */}
                {(asset.playableUrl || asset.endcardUrl) && (
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase">Other Links</Label>
                    <div className="flex flex-wrap gap-1.5">
                      {asset.playableUrl && (
                        <Button variant="outline" size="sm" className="text-xs h-7" asChild>
                          <a href={asset.playableUrl} target="_blank" rel="noopener noreferrer">
                            <Gamepad2 className="h-3 w-3 mr-1" /> Playable
                          </a>
                        </Button>
                      )}
                      {asset.endcardUrl && (
                        <Button variant="outline" size="sm" className="text-xs h-7" asChild>
                          <a href={asset.endcardUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 mr-1" /> Endcard
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Column 3: UA Testing Panel - Only for UA Team */}
              <div className="space-y-3">
                {userRole === 'ua_team' && onUpdateUAStatus && onSetNetworkStatus && onUpdateDeployment && onUpdateLiveNetworks && (
                  <UATestingPanel
                    asset={asset}
                    onUpdateUAStatus={onUpdateUAStatus}
                    onSetNetworkStatus={onSetNetworkStatus}
                    onUpdateDeployment={onUpdateDeployment}
                    onUpdateLiveNetworks={onUpdateLiveNetworks}
                    userRole={userRole}
                  />
                )}
                {userRole !== 'ua_team' && (
                  <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
                    <div className="text-center text-muted-foreground">
                      <div className="text-2xl mb-2">🔒</div>
                      <p className="text-sm font-medium">UA Testing Panel</p>
                      <p className="text-xs mt-1">Chỉ UA Team mới có quyền truy cập</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3 border-t flex gap-2 flex-shrink-0 bg-gray-50 dark:bg-gray-900">
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
      </DialogContent>
    </Dialog>
  )
}

