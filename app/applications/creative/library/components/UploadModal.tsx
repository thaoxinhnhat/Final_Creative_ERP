"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Upload, X, Loader2, Link2, FileUp, Gamepad2, Smartphone, Youtube, Settings, Plus, ChevronDown, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AssetCategory, UploadAssetFormData, WorkflowStage } from "../types"
import { CATEGORY_CONFIG, WORKFLOW_STAGE_CONFIG } from "../types"
import { DriveImportTab } from "./DriveImportTab"

interface UploadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpload: (data: UploadAssetFormData) => Promise<void>
  onImportFromDrive?: (driveUrl: string) => Promise<void>
  // Optional dropdown lists from LibrarySettings
  appList?: string[]
  gameList?: string[]
  productionTeamList?: string[]
}

const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB

// Platform options
type AssetPlatform = 'game' | 'app'

// Default options - will be customizable via settings
const DEFAULT_PRODUCTION_TEAMS = [
  'Team A - Video Production',
  'Team B - Graphic Design',
  'Team C - Animation',
  'Team D - Creative AI',
  'External/Outsource',
]

const DEFAULT_GAME_LIST = [
  'Puzzle Master',
  'Super Racing',
  'Farm World',
  'Candy Match 3',
  'Idle Hero',
  'Zombie Shooter',
  'Word Game',
]

const DEFAULT_APP_LIST = [
  'Fitness App',
  'Shopping App',
  'Finance App',
  'Travel App',
  'Food Delivery',
  'Social App',
  'Education App',
  'Lifestyle App',
  'Utility App',
]

// LocalStorage keys
const STORAGE_KEYS = {
  apps: 'upload_form_apps',
  games: 'upload_form_games',
  teams: 'upload_form_teams',
  categories: 'upload_form_categories',
  workflows: 'upload_form_workflows',
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}

// Editable list component for settings
function EditableList({
  items,
  onItemsChange,
  placeholder
}: {
  items: string[]
  onItemsChange: (items: string[]) => void
  placeholder: string
}) {
  const [newItem, setNewItem] = useState("")

  const addItem = () => {
    const trimmed = newItem.trim()
    if (trimmed && !items.includes(trimmed)) {
      onItemsChange([...items, trimmed])
      setNewItem("")
    }
  }

  const removeItem = (index: number) => {
    onItemsChange(items.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addItem()
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button type="button" size="sm" onClick={addItem} disabled={!newItem.trim()}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="max-h-32 overflow-y-auto space-y-1">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm group">
            <span className="flex-1 truncate">{item}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeItem(i)}
            >
              <Trash2 className="h-3 w-3 text-red-500" />
            </Button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-2">Chưa có mục nào</p>
        )}
      </div>
    </div>
  )
}

export function UploadModal({
  open,
  onOpenChange,
  onUpload,
  onImportFromDrive,
  appList = DEFAULT_APP_LIST,
  gameList = DEFAULT_GAME_LIST,
  productionTeamList = DEFAULT_PRODUCTION_TEAMS
}: UploadModalProps) {
  const teamList = productionTeamList // Alias for compatibility
  const [activeTab, setActiveTab] = useState<"upload" | "drive">("upload")
  const [files, setFiles] = useState<File[]>([])
  const [category, setCategory] = useState<AssetCategory | "">("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [campaignName, setCampaignName] = useState("")
  const [workflowStage, setWorkflowStage] = useState<WorkflowStage>("final")
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // New fields
  const [assetPlatform, setAssetPlatform] = useState<AssetPlatform>('app')
  const [gameName, setGameName] = useState("")
  const [customGameName, setCustomGameName] = useState("")
  const [appName, setAppName] = useState("")
  const [customAppName, setCustomAppName] = useState("")
  const [productionTeam, setProductionTeam] = useState("")

  // Multiple YouTube URLs
  const [youtubeUrls, setYoutubeUrls] = useState<string[]>([])
  const [youtubeInput, setYoutubeInput] = useState("")

  // Theme as tags
  const [themes, setThemes] = useState<string[]>([])
  const [themeInput, setThemeInput] = useState("")

  // Multiple Drive imports (persists between tabs)
  const [driveUrls, setDriveUrls] = useState<string[]>([])
  const [currentDriveInput, setCurrentDriveInput] = useState("")
  const [driveImportedFiles, setDriveImportedFiles] = useState<Array<{ name: string; url: string; size: number; thumbnailUrl: string }>>([])

  // Brief information
  const [briefName, setBriefName] = useState("")
  const [briefLink, setBriefLink] = useState("")

  // Project information
  const [projectCode, setProjectCode] = useState("")

  // Settings state - removed, now using props from LibrarySettings

  const handleFiles = useCallback((newFiles: File[]) => {
    const validFiles = newFiles.filter(file => file.size <= MAX_FILE_SIZE)
    setFiles(prev => [...prev, ...validFiles])
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(Array.from(e.dataTransfer.files))
  }, [handleFiles])

  const removeFile = (index: number) => {
    // Check if this is a drive-imported file
    const file = files[index]
    if (file && file.name.startsWith('drive-import-')) {
      // Find and remove from driveImportedFiles
      const driveFile = driveImportedFiles.find(df => file.name.includes(df.name.split('-').pop() || ''))
      if (driveFile) {
        setDriveImportedFiles(prev => prev.filter(df => df !== driveFile))
        setDriveUrls(prev => prev.filter(url => url !== driveFile.url))
      }
    }
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  // Theme handling
  const addTheme = () => {
    const trimmed = themeInput.trim()
    if (trimmed && !themes.includes(trimmed)) {
      setThemes(prev => [...prev, trimmed])
      setThemeInput("")
    }
  }

  const removeTheme = (theme: string) => {
    setThemes(prev => prev.filter(t => t !== theme))
  }

  const handleThemeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      e.stopPropagation()
      addTheme()
    }
  }

  // Tag handling (similar to theme)
  const addTag = () => {
    const trimmed = tagInput.trim()
    if (trimmed && !tags.includes(trimmed)) {
      setTags(prev => [...prev, trimmed])
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setTags(prev => prev.filter(t => t !== tag))
  }

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      e.stopPropagation()
      addTag()
    }
  }

  const resetForm = () => {
    setFiles([])
    setCategory("")
    setDescription("")
    setTags([])
    setTagInput("")
    setCampaignName("")
    setWorkflowStage("final")
    setActiveTab("upload")
    setAssetPlatform('app')
    setGameName("")
    setCustomGameName("")
    setAppName("")
    setCustomAppName("")
    setProductionTeam("")
    setYoutubeUrls([])
    setYoutubeInput("")
    setThemes([])
    setThemeInput("")
    setDriveUrls([])
    setCurrentDriveInput("")
    setDriveImportedFiles([])
    setBriefName("")
    setBriefLink("")
    setProjectCode("")
  }

  const getFinalAppGameName = () => {
    if (assetPlatform === 'game') {
      return gameName === '_other_' ? customGameName : gameName
    }
    return appName === '_other_' ? customAppName : appName
  }

  const isFormValid = () => {
    const hasAppGameName = getFinalAppGameName().length > 0
    return files.length > 0 && hasAppGameName
  }

  const handleSubmit = async () => {
    if (!isFormValid()) return

    const finalName = getFinalAppGameName()

    setIsUploading(true)
    try {
      await onUpload({
        files,
        category: category || 'final_creative',
        description: description || undefined,
        tags: tags,
        campaignName: campaignName || undefined,
        workflowStage,
        appName: finalName,
        assetPlatform: assetPlatform,
        productionTeam: productionTeam || undefined,
        themes: themes.length > 0 ? themes : undefined,
        youtubeUrl: youtubeUrls.length > 0 ? youtubeUrls[0] : undefined, // Use first for backward compatibility
        driveUrl: driveUrls.length > 0 ? driveUrls[0] : undefined,
        briefId: briefLink || undefined,
        briefName: briefName || undefined,
        projectCode: projectCode || undefined,
      } as UploadAssetFormData & { briefName?: string; projectCode?: string })
      resetForm()
      onOpenChange(false)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDriveImport = async (url: string) => {
    if (!url.trim()) return

    // Check for duplicate
    if (driveUrls.includes(url.trim())) {
      alert('Link Drive này đã được import trong danh sách!')
      return
    }

    setCurrentDriveInput(url)
    setIsUploading(true)

    try {
      // Extract file ID from Google Drive URL
      const urlTrimmed = url.trim()
      let driveFileId = ''

      // Try different URL patterns
      const fileMatch = urlTrimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
      const docMatch = urlTrimmed.match(/\/d\/([a-zA-Z0-9_-]+)/)
      const idParam = urlTrimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/)

      if (fileMatch) driveFileId = fileMatch[1]
      else if (docMatch) driveFileId = docMatch[1]
      else if (idParam) driveFileId = idParam[1]

      // Generate thumbnail URL from Drive file ID
      const uniqueId = Date.now().toString()
      const fileName = `drive-import-${uniqueId}.jpg`

      // Use Google Drive thumbnail URL if we have fileId, otherwise use a placeholder
      const thumbnailUrl = driveFileId
        ? `https://drive.google.com/thumbnail?id=${driveFileId}&sz=w400`
        : 'https://via.placeholder.com/400x300?text=Drive+File'

      // Add to driveUrls and driveImportedFiles
      setDriveUrls(prev => [...prev, urlTrimmed])
      setDriveImportedFiles(prev => [...prev, {
        name: fileName,
        url: urlTrimmed,
        size: 1024 * 1024,
        thumbnailUrl: thumbnailUrl
      }])

      // Create a placeholder File object for the form
      // Use a simple blob since we can't fetch cross-origin
      const blob = new Blob(['drive-file'], { type: 'image/jpeg' })
      const file = new File([blob], fileName, { type: 'image/jpeg' })

      // Add to files list
      setFiles(prev => [...prev, file])

      // Clear input and switch to Upload tab
      setCurrentDriveInput('')
      setActiveTab('upload')
    } catch (error) {
      console.error('Drive import error:', error)
      alert('Không thể import từ Drive. Vui lòng thử lại.')
    } finally {
      setIsUploading(false)
    }
  }

  // Add YouTube URL with duplicate detection
  const addYoutubeUrl = () => {
    const trimmed = youtubeInput.trim()
    if (!trimmed) return

    if (youtubeUrls.includes(trimmed)) {
      setYoutubeInput('') // Clear input to prevent re-trigger from onBlur
      alert('Link YouTube này đã tồn tại trong danh sách!')
      return
    }

    setYoutubeUrls(prev => [...prev, trimmed])
    setYoutubeInput('')
  }

  const removeYoutubeUrl = (url: string) => {
    setYoutubeUrls(prev => prev.filter(u => u !== url))
  }

  const handleYoutubeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()
      addYoutubeUrl()
    }
  }

  // Render platform selection (shared between tabs)
  const renderPlatformSelection = (idPrefix: string = "") => (
    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg border">
      <Label className="text-sm font-medium mb-3 block">
        Asset thuộc loại nào? <span className="text-red-500">*</span>
      </Label>
      <RadioGroup
        value={assetPlatform}
        onValueChange={(v) => setAssetPlatform(v as AssetPlatform)}
        className="flex gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="app" id={`${idPrefix}platform-app`} />
          <Label htmlFor={`${idPrefix}platform-app`} className="flex items-center gap-2 cursor-pointer">
            <Smartphone className="h-4 w-4 text-blue-600" />
            App
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="game" id={`${idPrefix}platform-game`} />
          <Label htmlFor={`${idPrefix}platform-game`} className="flex items-center gap-2 cursor-pointer">
            <Gamepad2 className="h-4 w-4 text-purple-600" />
            Game
          </Label>
        </div>
      </RadioGroup>

      {assetPlatform === 'app' && (
        <div className="mt-3 space-y-2">
          <Label className="text-sm">
            Chọn App <span className="text-red-500">*</span>
          </Label>
          <Select value={appName} onValueChange={setAppName}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn app..." />
            </SelectTrigger>
            <SelectContent>
              {appList.map(app => (
                <SelectItem key={app} value={app}>
                  📱 {app}
                </SelectItem>
              ))}
              <SelectItem value="_other_">➕ Khác...</SelectItem>
            </SelectContent>
          </Select>
          {appName === '_other_' && (
            <Input
              placeholder="Nhập tên app..."
              value={customAppName}
              onChange={(e) => setCustomAppName(e.target.value)}
            />
          )}
        </div>
      )}

      {assetPlatform === 'game' && (
        <div className="mt-3 space-y-2">
          <Label className="text-sm">
            Chọn Game <span className="text-red-500">*</span>
          </Label>
          <Select value={gameName} onValueChange={setGameName}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn game..." />
            </SelectTrigger>
            <SelectContent>
              {gameList.map(game => (
                <SelectItem key={game} value={game}>
                  🎮 {game}
                </SelectItem>
              ))}
              <SelectItem value="_other_">➕ Khác...</SelectItem>
            </SelectContent>
          </Select>
          {gameName === '_other_' && (
            <Input
              placeholder="Nhập tên game..."
              value={customGameName}
              onChange={(e) => setCustomGameName(e.target.value)}
            />
          )}
        </div>
      )}
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={(o) => {
      if (!isUploading) {
        onOpenChange(o)
        if (!o) {
          resetForm()
        }
      }
    }}>
      <DialogContent className={cn(
        "max-h-[90vh] overflow-y-auto transition-all",
        driveImportedFiles.length > 0 ? "max-w-5xl w-[95vw]" : "max-w-2xl"
      )}>
        <DialogHeader>
          <DialogTitle>Upload Assets</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "upload" | "drive")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <FileUp className="h-4 w-4" />
              Upload Files
            </TabsTrigger>
            <TabsTrigger value="drive" className="flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              Google Drive
            </TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-4 mt-4">
            {/* Drop zone / Image preview */}
            {driveImportedFiles.length > 0 ? (
              <div className="space-y-3">
                <Label className="text-sm font-medium">Hình ảnh từ Drive ({driveImportedFiles.length})</Label>
                <div className="flex gap-3 overflow-x-auto p-2 bg-gray-50 dark:bg-gray-900 rounded-lg border">
                  {driveImportedFiles.map((df, i) => (
                    <div key={i} className="relative shrink-0 w-32 h-24 rounded-lg overflow-hidden border-2 border-blue-300">
                      <img
                        src={df.thumbnailUrl}
                        alt={df.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate">
                        {df.url.substring(0, 25)}...
                      </div>
                    </div>
                  ))}
                  {/* Add more button */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="shrink-0 w-32 h-24 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition"
                  >
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground mt-1">Thêm file</span>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) handleFiles(Array.from(e.target.files))
                    e.target.value = ""
                  }}
                />
              </div>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition",
                  isDragging ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : "border-gray-300 hover:border-gray-400"
                )}
              >
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm">{isDragging ? "Drop files here..." : "Drag & drop files here, or click to browse"}</p>
                <p className="text-xs text-muted-foreground mt-1">Max 100MB per file</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) handleFiles(Array.from(e.target.files))
                    e.target.value = ""
                  }}
                />
              </div>
            )}

            {/* File list with Name, Type, Size */}
            {files.length > 0 && (
              <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border">
                <Label className="font-medium">Thông tin File ({files.length})</Label>
                <div className="max-h-32 overflow-y-auto space-y-2">
                  {files.map((file, i) => {
                    const ext = file.name.split('.').pop()?.toUpperCase() || 'N/A'
                    const isDriveFile = file.name.startsWith('drive-import-')
                    const driveFileInfo = isDriveFile ? driveImportedFiles.find(df => df.name === file.name) : null
                    return (
                      <div key={i} className={cn(
                        "flex items-center gap-3 p-2 rounded border text-sm",
                        isDriveFile
                          ? "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800"
                          : "bg-white dark:bg-gray-800"
                      )}>
                        {isDriveFile && (
                          <div className="shrink-0 text-blue-600">
                            <Link2 className="h-5 w-5" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground uppercase font-semibold">
                            {isDriveFile ? "Imported từ Drive" : "File Name"}
                          </p>
                          <p className="truncate font-medium">{isDriveFile && driveFileInfo ? driveFileInfo.url : file.name}</p>
                        </div>
                        <div className="text-center px-3 border-l">
                          <p className="text-xs text-muted-foreground uppercase font-semibold">Type</p>
                          <p className="font-medium">{ext}</p>
                        </div>
                        <div className="text-center px-3 border-l">
                          <p className="text-xs text-muted-foreground uppercase font-semibold">Size</p>
                          <p className="font-medium">{formatFileSize(file.size)}</p>
                        </div>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 shrink-0" onClick={() => removeFile(i)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Platform Selection */}
            {renderPlatformSelection()}

            {/* Row 1: Category + Team Dựng */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-1 block">Category</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as AssetCategory)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục..." />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(CATEGORY_CONFIG) as AssetCategory[]).map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {CATEGORY_CONFIG[cat].icon} {CATEGORY_CONFIG[cat].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-1 block">Team Dựng</Label>
                <Select value={productionTeam} onValueChange={setProductionTeam}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn team dựng..." />
                  </SelectTrigger>
                  <SelectContent>
                    {teamList.map(t => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 2: Workflow Stage + Campaign */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-1 block">Workflow Stage</Label>
                <Select value={workflowStage} onValueChange={(v) => setWorkflowStage(v as WorkflowStage)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(WORKFLOW_STAGE_CONFIG) as WorkflowStage[]).map((stage) => (
                      <SelectItem key={stage} value={stage}>
                        {WORKFLOW_STAGE_CONFIG[stage].icon} {WORKFLOW_STAGE_CONFIG[stage].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-1 block">Campaign/App Name</Label>
                <Input
                  placeholder="VD: Summer Campaign 2025"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                />
              </div>
            </div>

            {/* Row 3: Project + Brief Information */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="mb-1 block flex items-center gap-1.5">
                  📁 Mã Project
                </Label>
                <Input
                  placeholder="VD: SP01, SP02..."
                  value={projectCode}
                  onChange={(e) => setProjectCode(e.target.value)}
                />
              </div>

              <div>
                <Label className="mb-1 block flex items-center gap-1.5">
                  📋 Tên Brief
                </Label>
                <Input
                  placeholder="VD: Gaming App - Q4 UA"
                  value={briefName}
                  onChange={(e) => setBriefName(e.target.value)}
                />
              </div>

              <div>
                <Label className="mb-1 block flex items-center gap-1.5">
                  🔗 Link Brief
                </Label>
                <Input
                  placeholder="VD: brief_001 hoặc link"
                  value={briefLink}
                  onChange={(e) => setBriefLink(e.target.value)}
                />
              </div>
            </div>

            {/* Theme - Tag input style */}
            <div>
              <Label className="mb-1 block">Theme</Label>
              <div className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg border min-h-[42px] flex-wrap">
                {themes.map((theme, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 cursor-pointer flex items-center gap-1"
                    onClick={() => removeTheme(theme)}
                  >
                    {theme}
                    <X className="h-3 w-3" />
                  </Badge>
                ))}
                <Input
                  placeholder={themes.length === 0 ? "Nhập theme và nhấn Enter..." : ""}
                  value={themeInput}
                  onChange={(e) => setThemeInput(e.target.value)}
                  onKeyDown={handleThemeKeyDown}
                  onBlur={addTheme}
                  className="flex-1 min-w-[120px] border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-900 dark:text-white placeholder:text-gray-400 h-7 p-0"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Nhấn Enter hoặc dấu phẩy để thêm theme</p>
            </div>

            {/* YouTube Links - Multiple with duplicate detection */}
            <div>
              <Label className="flex items-center gap-2 mb-1">
                <Youtube className="h-4 w-4 text-red-600" />
                Link YouTube (có thể thêm nhiều link)
              </Label>
              <div className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg border min-h-[42px] flex-wrap">
                {youtubeUrls.map((url, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800 cursor-pointer flex items-center gap-1 max-w-[200px]"
                    onClick={() => removeYoutubeUrl(url)}
                  >
                    <span className="truncate">{url.length > 30 ? url.substring(0, 30) + '...' : url}</span>
                    <X className="h-3 w-3 shrink-0" />
                  </Badge>
                ))}
                <Input
                  placeholder={youtubeUrls.length === 0 ? "Paste link YouTube và nhấn Enter..." : "Thêm link..."}
                  value={youtubeInput}
                  onChange={(e) => setYoutubeInput(e.target.value)}
                  onKeyDown={handleYoutubeKeyDown}
                  onBlur={addYoutubeUrl}
                  className="flex-1 min-w-[150px] border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-900 dark:text-white placeholder:text-gray-400 h-7 p-0"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Nhấn Enter để thêm link. Trùng sẽ bị cảnh báo.</p>
            </div>

            {/* Tags */}
            <div>
              <Label className="mb-1 block">Tags</Label>
              <div className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg border min-h-[42px] flex-wrap">
                {tags.map((tag, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800 cursor-pointer flex items-center gap-1"
                    onClick={() => removeTag(tag)}
                  >
                    {tag}
                    <X className="h-3 w-3" />
                  </Badge>
                ))}
                <Input
                  placeholder={tags.length === 0 ? "Nhập tag và nhấn Enter..." : ""}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  onBlur={addTag}
                  className="flex-1 min-w-[120px] border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-900 dark:text-white placeholder:text-gray-400 h-7 p-0"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Nhấn Enter hoặc dấu phẩy để thêm tag</p>
            </div>

            {/* Description */}
            <div>
              <Label className="mb-1 block">Description</Label>
              <Textarea
                placeholder="Mô tả ngắn về asset này..."
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </TabsContent>

          {/* Drive Import Tab */}
          <TabsContent value="drive" className="mt-4 space-y-4">
            <DriveImportTab
              onImport={handleDriveImport}
              isLoading={isUploading}
              driveUrl={currentDriveInput}
              onDriveUrlChange={setCurrentDriveInput}
            />
          </TabsContent>
        </Tabs>

        {activeTab === "upload" && (
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isUploading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!isFormValid() || isUploading}>
              {isUploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
              Upload {files.length} file(s)
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
