"use client"

import { useState, useCallback, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, X, Loader2, Link2, FileUp } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AssetCategory, UploadAssetFormData, CreativeTeam, WorkflowStage } from "../types"
import { CATEGORY_CONFIG, TEAM_CONFIG, WORKFLOW_STAGE_CONFIG } from "../types"
import { DriveImportTab } from "./DriveImportTab"

interface UploadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpload: (data: UploadAssetFormData) => Promise<void>
  onImportFromDrive?: (driveUrl: string) => Promise<void>
}

const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}

export function UploadModal({ open, onOpenChange, onUpload, onImportFromDrive }: UploadModalProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "drive">("upload")
  const [files, setFiles] = useState<File[]>([])
  const [category, setCategory] = useState<AssetCategory | "">("")
  const [description, setDescription] = useState("")
  const [tagsInput, setTagsInput] = useState("")
  const [campaignName, setCampaignName] = useState("")
  const [team, setTeam] = useState<CreativeTeam | "">("")
  const [workflowStage, setWorkflowStage] = useState<WorkflowStage>("brief")
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const resetForm = () => {
    setFiles([])
    setCategory("")
    setDescription("")
    setTagsInput("")
    setCampaignName("")
    setTeam("")
    setWorkflowStage("brief")
    setActiveTab("upload")
  }

  const handleSubmit = async () => {
    if (files.length === 0 || !category) return

    setIsUploading(true)
    try {
      await onUpload({
        files,
        category,
        description: description || undefined,
        tags: tagsInput.split(",").map(t => t.trim()).filter(Boolean),
        campaignName: campaignName || undefined,
        team: team || undefined,
        workflowStage,
      })
      resetForm()
      onOpenChange(false)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDriveImport = async (driveUrl: string) => {
    if (!onImportFromDrive) return
    setIsUploading(true)
    try {
      await onImportFromDrive(driveUrl)
      resetForm()
      onOpenChange(false)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => {
      if (!isUploading) {
        onOpenChange(o)
        if (!o) resetForm()
      }
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
            {/* Drop zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition",
                isDragging ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : "border-gray-300 hover:border-gray-400"
              )}
            >
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
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

            {/* File list */}
            {files.length > 0 && (
              <div className="space-y-2">
                <Label>Selected files ({files.length})</Label>
                <div className="max-h-28 overflow-y-auto space-y-1">
                  {files.map((file, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <span className="flex-1 text-sm truncate">{file.name}</span>
                      <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
                      <Button variant="ghost" size="sm" onClick={() => removeFile(i)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <Label>Category *</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as AssetCategory)}>
                  <SelectTrigger className="mt-1">
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

              {/* Team */}
              <div>
                <Label>Team</Label>
                <Select value={team} onValueChange={(v) => setTeam(v as CreativeTeam)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Chọn team..." />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(TEAM_CONFIG) as CreativeTeam[]).map((t) => (
                      <SelectItem key={t} value={t}>
                        {TEAM_CONFIG[t].icon} {TEAM_CONFIG[t].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Workflow Stage */}
              <div>
                <Label>Workflow Stage</Label>
                <Select value={workflowStage} onValueChange={(v) => setWorkflowStage(v as WorkflowStage)}>
                  <SelectTrigger className="mt-1">
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

              {/* Campaign */}
              <div>
                <Label>Campaign/App</Label>
                <Input
                  placeholder="VD: Summer Campaign 2025"
                  className="mt-1"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <Label>Tags</Label>
              <Input
                placeholder="summer, video-ads, ios (phân cách bằng dấu phẩy)"
                className="mt-1"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
            </div>

            {/* Description */}
            <div>
              <Label>Description</Label>
              <Textarea
                placeholder="Mô tả ngắn về asset này..."
                rows={2}
                className="mt-1"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </TabsContent>

          {/* Drive Import Tab */}
          <TabsContent value="drive" className="mt-4">
            <DriveImportTab
              onImport={handleDriveImport}
              isLoading={isUploading}
            />
          </TabsContent>
        </Tabs>

        {activeTab === "upload" && (
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isUploading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={files.length === 0 || !category || isUploading}>
              {isUploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
              Upload {files.length} file(s)
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
