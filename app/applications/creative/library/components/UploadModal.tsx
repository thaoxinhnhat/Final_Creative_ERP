"use client"

import { useState, useCallback, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AssetCategory, UploadAssetFormData } from "../types"
import { CATEGORY_CONFIG } from "../types"

interface UploadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpload: (data: UploadAssetFormData) => Promise<void>
}

const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}

export function UploadModal({ open, onOpenChange, onUpload }: UploadModalProps) {
  const [files, setFiles] = useState<File[]>([])
  const [category, setCategory] = useState<AssetCategory | "">("")
  const [description, setDescription] = useState("")
  const [tagsInput, setTagsInput] = useState("")
  const [campaignName, setCampaignName] = useState("")
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
      })
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

        <div className="space-y-4">
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
          )}

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
              rows={3}
              className="mt-1"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isUploading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={files.length === 0 || !category || isUploading}>
            {isUploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
            Upload {files.length} file(s)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
