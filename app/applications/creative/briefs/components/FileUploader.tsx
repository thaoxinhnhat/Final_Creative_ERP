"use client"

import { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, X, File, FileText, Video, Image as ImageIcon, Loader2, FolderOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { useFileUpload } from "../hooks/useFileUpload"
import { AssetPickerModal } from "./AssetPickerModal"
import type { Asset } from "../../library/types"

interface FileUploaderProps {
  onFilesChange: (files: { name: string; url: string; type: string }[]) => void
  initialFiles?: { name: string; url: string; type: string }[]
  disabled?: boolean
  maxFiles?: number
  className?: string
}

const getFileIcon = (type: string) => {
  switch (type) {
    case "pdf": return FileText
    case "video": return Video
    case "image": return ImageIcon
    default: return File
  }
}

export function FileUploader({
  onFilesChange,
  initialFiles = [],
  disabled = false,
  maxFiles = 10,
  className,
}: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAssetPicker, setShowAssetPicker] = useState(false)

  const {
    uploadFiles,
    removeFile,
    isUploading,
    uploadProgress,
    uploadedFiles,
    setUploadedFiles,
  } = useFileUpload({
    onUploadComplete: (newFiles) => {
      const allFiles = [...uploadedFiles, ...newFiles]
      onFilesChange(allFiles.map((f) => ({ name: f.name, url: f.url, type: f.type })))
    },
    onError: (err) => setError(err),
  })

  // Initialize with existing files
  useState(() => {
    if (initialFiles.length > 0) {
      setUploadedFiles(initialFiles.map((f) => ({ ...f, size: 0 })))
    }
  })

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)
      setError(null)

      if (disabled) return

      const files = e.dataTransfer.files
      if (files && files.length > 0) {
        if (uploadedFiles.length + files.length > maxFiles) {
          setError(`Tối đa ${maxFiles} files`)
          return
        }
        await uploadFiles(files)
      }
    },
    [disabled, uploadedFiles.length, maxFiles, uploadFiles]
  )

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setError(null)
      const files = e.target.files
      if (files && files.length > 0) {
        if (uploadedFiles.length + files.length > maxFiles) {
          setError(`Tối đa ${maxFiles} files`)
          return
        }
        await uploadFiles(files)
      }
      e.target.value = "" // Reset input
    },
    [uploadedFiles.length, maxFiles, uploadFiles]
  )

  const handleRemove = useCallback(
    (fileName: string) => {
      removeFile(fileName)
      const remaining = uploadedFiles.filter((f) => f.name !== fileName)
      onFilesChange(remaining.map((f) => ({ name: f.name, url: f.url, type: f.type })))
    },
    [uploadedFiles, removeFile, onFilesChange]
  )

  // Handle asset selection from library
  const handleAssetSelect = useCallback((selectedAssets: Asset[]) => {
    if (uploadedFiles.length + selectedAssets.length > maxFiles) {
      setError(`Tối đa ${maxFiles} files`)
      return
    }
    const newFiles = selectedAssets.map(a => ({
      name: a.name,
      url: a.fileUrl,
      type: a.type,
      size: a.fileSize,
    }))
    const allFiles = [...uploadedFiles, ...newFiles]
    setUploadedFiles(allFiles)
    onFilesChange(allFiles.map(f => ({ name: f.name, url: f.url, type: f.type })))
    setShowAssetPicker(false)
  }, [uploadedFiles, maxFiles, setUploadedFiles, onFilesChange])

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop Zone */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          dragActive && "border-blue-500 bg-blue-50 dark:bg-blue-950",
          disabled && "opacity-50 cursor-not-allowed",
          !disabled && "cursor-pointer hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && document.getElementById("file-input")?.click()}
      >
        <input
          id="file-input"
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
          disabled={disabled}
          accept="image/*,video/*,.pdf,.zip"
        />

        {isUploading ? (
          <div className="space-y-3">
            <Loader2 className="h-10 w-10 mx-auto text-blue-500 animate-spin" />
            <p className="text-sm text-muted-foreground">Đang upload...</p>
            <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
          </div>
        ) : (
          <>
            <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm font-medium">Kéo thả file hoặc click để upload</p>
            <p className="text-xs text-muted-foreground mt-1">
              Hỗ trợ: Images, Videos, PDF, ZIP (tối đa 10MB/file)
            </p>
          </>
        )}
      </div>

      {/* Select from Library Button */}
      <div className="flex justify-center">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => setShowAssetPicker(true)}
          className="gap-2"
        >
          <FolderOpen className="h-4 w-4" />
          Chọn từ Asset Management
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Files đã upload ({uploadedFiles.length}/{maxFiles})
          </p>
          <div className="space-y-2">
            {uploadedFiles.map((file) => {
              const Icon = getFileIcon(file.type)
              return (
                <div
                  key={file.name}
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="p-2 bg-white dark:bg-gray-700 rounded">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    {file.size > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemove(file.name)
                    }}
                    disabled={disabled}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Asset Picker Modal */}
      <AssetPickerModal
        open={showAssetPicker}
        onOpenChange={setShowAssetPicker}
        onSelect={handleAssetSelect}
      />
    </div>
  )
}

export default FileUploader
