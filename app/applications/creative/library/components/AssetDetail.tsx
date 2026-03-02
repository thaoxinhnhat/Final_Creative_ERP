"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { X, Download, ExternalLink, Edit, Trash2, Eye, Link2, Clock, User, Youtube, Gamepad2, Loader2, Check, RefreshCw, Copy, Unlink, Save, Plus } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { Asset, UATestStatus, AdNetwork, DeploymentStatus, PerformanceRating, AssetCategory, CreativeTeam, WorkflowStage } from "../types"
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
  onUpdateAsset?: (assetId: string, updates: Partial<Asset>) => Promise<boolean>
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
  onUpdateAsset,
  isUpdatingDrive = false,
  userRole = 'creative_team',
}: AssetDetailProps) {
  const [isEditingDrive, setIsEditingDrive] = useState(false)
  const [driveUrlInput, setDriveUrlInput] = useState("")
  const [driveError, setDriveError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [lastAssetId, setLastAssetId] = useState<string | null>(null)

  // Edit Mode State
  const [isEditMode, setIsEditMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Form Data State
  const [formData, setFormData] = useState<Partial<Asset>>({})

  // Tag/Theme inputs
  const [tagInput, setTagInput] = useState("")
  const [themeInput, setThemeInput] = useState("")

  // Reset input when different asset is opened
  if (asset && asset.id !== lastAssetId) {
    setLastAssetId(asset.id)
    setDriveUrlInput(asset.driveUrl || "")
    setIsEditingDrive(false)
    setDriveError(null)
    setIsEditMode(false)
    setFormData(asset)
  }

  // Handlers for Edit Mode
  const handleEdit = () => {
    if (asset) {
      setFormData({ ...asset })
      setIsEditMode(true)
    }
  }

  const handleCancel = () => {
    setIsEditMode(false)
    if (asset) setFormData({ ...asset })
  }

  const handleSave = async () => {
    if (!asset || !onUpdateAsset) return

    // Validation
    if (!formData.name?.trim()) {
      alert("Tên file không được để trống")
      return
    }
    if (!formData.category) {
      alert("Vui lòng chọn loại asset")
      return
    }

    // Drive URL validation
    if (formData.driveUrl && !isValidDriveUrl(formData.driveUrl)) {
      alert("Link Google Drive không hợp lệ")
      return
    }

    setIsSaving(true)
    try {
      const success = await onUpdateAsset(asset.id, formData)
      if (success) {
        setIsEditMode(false)
      }
    } catch (error) {
      console.error("Failed to update asset:", error)
      alert("Có lỗi xảy ra khi cập nhật asset")
    } finally {
      setIsSaving(false)
    }
  }

  // Tag Handlers
  const addTag = () => {
    const trimmed = tagInput.trim()
    if (trimmed && formData.tags && !formData.tags.includes(trimmed)) {
      setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), trimmed] }))
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(tag => tag !== tagToRemove)
    }))
  }

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  // Theme Handlers
  const addTheme = () => {
    const trimmed = themeInput.trim()
    if (trimmed && formData.themes && !formData.themes.includes(trimmed)) {
      setFormData(prev => ({ ...prev, themes: [...(prev.themes || []), trimmed] }))
      setThemeInput("")
    } else if (trimmed && !formData.themes) {
      setFormData(prev => ({ ...prev, themes: [trimmed] }))
      setThemeInput("")
    }
  }

  const removeTheme = (themeToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      themes: (prev.themes || []).filter(theme => theme !== themeToRemove)
    }))
  }

  const handleThemeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTheme()
    }
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
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">File Name {isEditMode && <span className="text-red-500">*</span>}</Label>
                  {isEditMode ? (
                    <Input
                      value={formData.name || ""}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1 h-8 text-sm font-medium"
                    />
                  ) : (
                    <p className="mt-0.5 break-words font-medium text-sm">{asset.name}</p>
                  )}
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
                    <Label className="text-xs font-semibold text-muted-foreground uppercase">Loại Asset {isEditMode && <span className="text-red-500">*</span>}</Label>
                    {isEditMode ? (
                      <div className="mt-1">
                        <Select
                          value={formData.assetPlatform || "app"}
                          onValueChange={(v) => setFormData({ ...formData, assetPlatform: v as 'app' | 'game' })}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="app">📱 App</SelectItem>
                            <SelectItem value="game">🎮 Game</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <p className="mt-0.5 text-sm">
                        {asset.assetPlatform === 'game' ? (
                          <span className="flex items-center gap-1">🎮 Game</span>
                        ) : asset.assetPlatform === 'app' ? (
                          <span className="flex items-center gap-1">📱 App</span>
                        ) : (
                          <span className="text-muted-foreground italic">(trống)</span>
                        )}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-muted-foreground uppercase">Team Dựng</Label>
                    {isEditMode ? (
                      <div className="mt-1">
                        <Select
                          value={formData.team || "creative"}
                          onValueChange={(v) => setFormData({ ...formData, team: v as CreativeTeam || undefined })}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Chọn team..." />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(TEAM_CONFIG).map(([key, config]) => (
                              <SelectItem key={key} value={key}>
                                {config.icon} {config.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <p className="mt-0.5 text-sm">{asset.productionTeam || asset.creatorCode || asset.currentOwner || <span className="text-muted-foreground italic">(trống)</span>}</p>
                    )}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">Category {isEditMode && <span className="text-red-500">*</span>}</Label>
                  {isEditMode ? (
                    <div className="mt-1">
                      <Select
                        value={formData.category || "final_creative"}
                        onValueChange={(v) => setFormData({ ...formData, category: v as AssetCategory })}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Chọn danh mục..." />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                            <SelectItem key={key} value={key}>
                              {config.icon} {config.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <p className="mt-0.5 text-sm">
                      {catConfig.icon} {catConfig.label}
                    </p>
                  )}
                </div>

                {/* Brief Information */}
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
                    📋 Brief
                  </Label>
                  {isEditMode ? (
                    <Input
                      value={formData.briefName || ""}
                      onChange={(e) => setFormData({ ...formData, briefName: e.target.value })}
                      placeholder="Nhập tên brief..."
                      className="mt-1 h-8 text-xs"
                    />
                  ) : (
                    asset.briefName || asset.briefId ? (
                      <div className="mt-0.5 flex items-center gap-2">
                        <a
                          href={`/reports?briefId=${asset.briefId}`}
                          className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                        >
                          {asset.briefName || asset.briefId}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    ) : (
                      <p className="mt-0.5 text-sm text-muted-foreground italic">(trống)</p>
                    )
                  )}
                </div>

                {/* Project Information */}
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
                    📁 Project
                  </Label>
                  {isEditMode ? (
                    <Input
                      value={formData.projectCode || ""}
                      onChange={(e) => setFormData({ ...formData, projectCode: e.target.value })}
                      placeholder="Nhập mã project (VD: SP01)..."
                      className="mt-1 h-8 text-xs"
                    />
                  ) : (
                    asset.projectCode ? (
                      <div className="mt-0.5 flex items-center gap-2">
                        <a
                          href={`/applications/creative/projects?project=${asset.projectCode}`}
                          className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                        >
                          {asset.projectCode}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    ) : (
                      <p className="mt-0.5 text-sm text-muted-foreground italic">(trống)</p>
                    )
                  )}
                </div>

                {/* Campaign & App Name */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs font-semibold text-muted-foreground uppercase">Campaign</Label>
                    {isEditMode ? (
                      <Input
                        value={formData.campaignName || ""}
                        onChange={(e) => setFormData({ ...formData, campaignName: e.target.value })}
                        className="mt-1 h-8 text-xs"
                      />
                    ) : (
                      <p className="mt-0.5 text-xs">{asset.campaignName || <span className="text-muted-foreground italic">(trống)</span>}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-muted-foreground uppercase">Tên App/Game</Label>
                    {isEditMode ? (
                      <Input
                        value={formData.appName || ""}
                        onChange={(e) => setFormData({ ...formData, appName: e.target.value })}
                        className="mt-1 h-8 text-xs"
                      />
                    ) : (
                      <p className="mt-0.5 text-xs">{asset.appName || <span className="text-muted-foreground italic">(trống)</span>}</p>
                    )}
                  </div>
                </div>

                {/* Themes - NEW */}
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">Themes</Label>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {(isEditMode ? formData.themes : asset.themes) && (isEditMode ? formData.themes : asset.themes)!.length > 0 ? (
                      (isEditMode ? formData.themes : asset.themes)!.map(theme => (
                        <Badge key={theme} variant="secondary" className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {theme}
                          {isEditMode && <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => removeTheme(theme)} />}
                        </Badge>
                      ))
                    ) : (
                      !isEditMode && <span className="text-xs text-muted-foreground italic">(trống)</span>
                    )}
                    {isEditMode && (
                      <Input
                        placeholder="Thêm theme..."
                        value={themeInput}
                        onChange={(e) => setThemeInput(e.target.value)}
                        onKeyDown={handleThemeKeyDown}
                        className="h-6 w-24 text-xs px-1"
                      />
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">Tags</Label>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {(isEditMode ? formData.tags : asset.tags) && (isEditMode ? formData.tags : asset.tags)!.length > 0 ? (
                      (isEditMode ? formData.tags : asset.tags)!.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                          {isEditMode && <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => removeTag(tag)} />}
                        </Badge>
                      ))
                    ) : (
                      !isEditMode && <span className="text-xs text-muted-foreground italic">(trống)</span>
                    )}
                    {isEditMode && (
                      <Input
                        placeholder="Thêm tag..."
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                        className="h-6 w-24 text-xs px-1"
                      />
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">Description</Label>
                  {isEditMode ? (
                    <Textarea
                      value={formData.description || ""}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="mt-1 text-xs min-h-[80px]"
                      maxLength={500}
                    />
                  ) : (
                    <p className="mt-0.5 text-xs text-muted-foreground whitespace-pre-wrap">{asset.description || <span className="italic">(trống)</span>}</p>
                  )}
                </div>

                <Separator className="my-2" />

                {/* Google Drive Link Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
                      <Link2 className="h-3.5 w-3.5" />
                      Google Drive Link
                    </Label>
                    {!isEditMode && asset.driveUrl && !isEditingDrive && (
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

                  {/* Display Mode - Only show if NOT editing (neither main Edit Mode nor Drive specific Edit) */}
                  {asset.driveUrl && !isEditingDrive && !isEditMode && (
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

                  {/* Input Mode (Main Edit Mode OR Drive Specific Edit) */}
                  {(isEditingDrive || (!asset.driveUrl && !isEditMode) || isEditMode) && (
                    <div className="space-y-1.5">
                      <Input
                        placeholder="https://drive.google.com/file/d/..."
                        value={isEditMode ? (formData.driveUrl || "") : driveUrlInput}
                        onChange={(e) => {
                          if (isEditMode) {
                            setFormData({ ...formData, driveUrl: e.target.value })
                          } else {
                            setDriveUrlInput(e.target.value);
                            setDriveError(null)
                          }
                        }}
                        className={cn("text-xs h-8", driveError && "border-red-500")}
                        disabled={isUpdatingDrive}
                      />
                      {driveError && <p className="text-xs text-red-500">{driveError}</p>}

                      {/* Only show specific Save button if NOT in main Edit Mode */}
                      {!isEditMode && (
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
                      )}
                    </div>
                  )}
                </div>

                {/* External Links - YouTube Link */}
                <div className="space-y-1.5 pt-2 border-t">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">Link YouTube</Label>
                  {isEditMode ? (
                    <Input
                      value={formData.youtubeUrl || ""}
                      onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                      placeholder="https://youtube.com/..."
                      className="h-8 text-xs"
                    />
                  ) : (
                    asset.youtubeUrl ? (
                      <Button variant="outline" size="sm" className="text-xs h-7" asChild>
                        <a href={asset.youtubeUrl} target="_blank" rel="noopener noreferrer">
                          <Youtube className="h-3 w-3 mr-1 text-red-600" /> {asset.youtubeUrl.length > 40 ? asset.youtubeUrl.substring(0, 40) + '...' : asset.youtubeUrl}
                        </a>
                      </Button>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">(trống)</p>
                    )
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
          {isEditMode ? (
            <>
              <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Save Changes
              </Button>
              <Button variant="outline" size="sm" onClick={handleCancel} disabled={isSaving}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" className="flex-1" onClick={handleEdit}>
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
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

