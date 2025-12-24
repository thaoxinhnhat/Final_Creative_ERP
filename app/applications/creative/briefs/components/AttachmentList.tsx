"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Image, Video, FileText, Package, X, ExternalLink, FolderOpen, Upload } from "lucide-react"
import { cn } from "@/lib/utils"
import type { BriefAttachment } from "../types"

// ============================================
// PROPS
// ============================================
interface AttachmentListProps {
  attachments: BriefAttachment[]
  onRemove: (id: string) => void
  disabled?: boolean
  className?: string
}

// ============================================
// HELPER FUNCTIONS
// ============================================
const getTypeIcon = (type: BriefAttachment["type"]) => {
  switch (type) {
    case "image": return <Image className="h-4 w-4 text-blue-500" />
    case "video": return <Video className="h-4 w-4 text-purple-500" />
    case "pdf": return <FileText className="h-4 w-4 text-red-500" />
    case "zip": return <Package className="h-4 w-4 text-orange-500" />
    default: return <FileText className="h-4 w-4 text-gray-500" />
  }
}

const getTypeColor = (type: BriefAttachment["type"]) => {
  switch (type) {
    case "image": return "bg-blue-50 dark:bg-blue-950"
    case "video": return "bg-purple-50 dark:bg-purple-950"
    case "pdf": return "bg-red-50 dark:bg-red-950"
    case "zip": return "bg-orange-50 dark:bg-orange-950"
    default: return "bg-gray-50 dark:bg-gray-950"
  }
}

const formatSize = (bytes?: number): string => {
  if (!bytes || bytes === 0) return "0 B"
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

// ============================================
// ATTACHMENT ITEM COMPONENT
// ============================================
const AttachmentItem = ({
  attachment,
  onRemove,
  disabled,
}: {
  attachment: BriefAttachment
  onRemove: () => void
  disabled?: boolean
}) => {
  return (
    <div className={cn(
      "flex items-center gap-3 p-3 rounded-lg border bg-white dark:bg-gray-900 group",
      "hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
    )}>
      {/* Thumbnail / Icon */}
      <div className={cn(
        "h-12 w-12 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0",
        getTypeColor(attachment.type)
      )}>
        {attachment.type === "image" && attachment.url ? (
          <img 
            src={attachment.url} 
            alt={attachment.name} 
            className="h-full w-full object-cover"
          />
        ) : (
          getTypeIcon(attachment.type)
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-sm truncate">{attachment.name}</p>
          {/* Source badge */}
          {attachment.source && (
            <Badge 
              variant="outline" 
              className={cn(
                "text-[10px] px-1.5 py-0 h-5 flex-shrink-0",
                attachment.source === "library" 
                  ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300" 
                  : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300"
              )}
            >
              {attachment.source === "library" ? (
                <>
                  <FolderOpen className="h-2.5 w-2.5 mr-0.5" />
                  Library
                </>
              ) : (
                <>
                  <Upload className="h-2.5 w-2.5 mr-0.5" />
                  Upload
                </>
              )}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
            {attachment.type.toUpperCase()}
          </Badge>
          <span>{formatSize(attachment.size)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {attachment.url && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600"
            onClick={() => window.open(attachment.url, "_blank")}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-gray-500 hover:text-red-600"
          onClick={onRemove}
          disabled={disabled}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// ============================================
// ATTACHMENT LIST COMPONENT
// ============================================
export function AttachmentList({ 
  attachments, 
  onRemove, 
  disabled = false,
  className,
}: AttachmentListProps) {
  if (attachments.length === 0) {
    return null
  }

  const totalSize = attachments.reduce((sum, a) => sum + (a.size || 0), 0)
  const uploadCount = attachments.filter(a => a.source === "upload").length
  const libraryCount = attachments.filter(a => a.source === "library").length

  return (
    <div className={cn("space-y-3", className)}>
      {/* Summary */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-3 text-muted-foreground">
          <span>
            <strong className="text-foreground">{attachments.length}</strong> files đính kèm
          </span>
          <span>•</span>
          <span>{formatSize(totalSize)}</span>
        </div>
        <div className="flex items-center gap-2">
          {uploadCount > 0 && (
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              <Upload className="h-3 w-3 mr-1" />
              {uploadCount} upload
            </Badge>
          )}
          {libraryCount > 0 && (
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
              <FolderOpen className="h-3 w-3 mr-1" />
              {libraryCount} từ library
            </Badge>
          )}
        </div>
      </div>

      {/* List */}
      <div className="space-y-2">
        {attachments.map((attachment) => (
          <AttachmentItem
            key={attachment.id}
            attachment={attachment}
            onRemove={() => onRemove(attachment.id)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  )
}

export default AttachmentList
