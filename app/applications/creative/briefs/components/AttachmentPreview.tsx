"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Download, 
  ZoomIn, 
  Play, 
  FileText, 
  File, 
  Loader2,
  AlertCircle,
  ExternalLink,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Attachment } from "../types"
import { AttachmentLightbox } from "./AttachmentLightbox"

// ============================================
// PROPS
// ============================================
interface AttachmentPreviewProps {
  attachments: Attachment[]
  maxVisible?: number
  className?: string
}

// ============================================
// ATTACHMENT CARD COMPONENT
// ============================================
const AttachmentCard = ({
  attachment,
  index,
  onClick,
}: {
  attachment: Attachment
  index: number
  onClick: () => void
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleMouseEnter = () => {
    setIsHovering(true)
    if (attachment.type === "video" && videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    if (attachment.type === "video" && videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation()
    const link = document.createElement("a")
    link.href = attachment.url
    link.download = attachment.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Image attachment
  if (attachment.type === "image") {
    return (
      <div
        className={cn(
          "relative group cursor-pointer rounded-lg overflow-hidden border",
          "transition-all duration-200 hover:scale-[1.02] hover:shadow-lg",
          "bg-gray-100 dark:bg-gray-800"
        )}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Loading state */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
          </div>
        )}

        {/* Error state */}
        {hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800">
            <AlertCircle className="h-6 w-6 text-gray-400 mb-1" />
            <span className="text-xs text-gray-400">Failed</span>
          </div>
        )}

        {/* Image */}
        <img
          src={attachment.url}
          alt={attachment.name}
          className={cn(
            "w-full h-32 object-cover transition-opacity",
            isLoading && "opacity-0",
            !isLoading && !hasError && "opacity-100"
          )}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false)
            setHasError(true)
          }}
          loading="lazy"
        />

        {/* Hover overlay */}
        <div className={cn(
          "absolute inset-0 bg-black/50 flex items-center justify-center gap-2",
          "transition-opacity duration-200",
          isHovering ? "opacity-100" : "opacity-0"
        )}>
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
            <ZoomIn className="h-5 w-5 text-white" />
          </div>
        </div>

        {/* Download button */}
        <button
          className={cn(
            "absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white",
            "transition-opacity duration-200 hover:bg-black/70",
            isHovering ? "opacity-100" : "opacity-0"
          )}
          onClick={handleDownload}
        >
          <Download className="h-3.5 w-3.5" />
        </button>

        {/* Type badge */}
        <Badge 
          variant="secondary" 
          className="absolute bottom-2 left-2 text-[10px] px-1.5 py-0 bg-black/50 text-white border-0"
        >
          IMG
        </Badge>
      </div>
    )
  }

  // Video attachment
  if (attachment.type === "video") {
    return (
      <div
        className={cn(
          "relative group cursor-pointer rounded-lg overflow-hidden border",
          "transition-all duration-200 hover:scale-[1.02] hover:shadow-lg",
          "bg-gray-100 dark:bg-gray-800"
        )}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Video preview */}
        <video
          ref={videoRef}
          src={attachment.url}
          className="w-full h-32 object-cover"
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false)
            setHasError(true)
          }}
        />

        {/* Play icon overlay (when not hovering) */}
        <div className={cn(
          "absolute inset-0 flex items-center justify-center",
          "transition-opacity duration-200",
          isHovering ? "opacity-0" : "opacity-100"
        )}>
          <div className="bg-black/50 rounded-full p-3">
            <Play className="h-6 w-6 text-white fill-white" />
          </div>
        </div>

        {/* Download button */}
        <button
          className={cn(
            "absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white",
            "transition-opacity duration-200 hover:bg-black/70",
            isHovering ? "opacity-100" : "opacity-0"
          )}
          onClick={handleDownload}
        >
          <Download className="h-3.5 w-3.5" />
        </button>

        {/* Type badge */}
        <Badge 
          variant="secondary" 
          className="absolute bottom-2 left-2 text-[10px] px-1.5 py-0 bg-black/50 text-white border-0"
        >
          VIDEO
        </Badge>
      </div>
    )
  }

  // PDF attachment
  if (attachment.type === "pdf") {
    return (
      <div
        className={cn(
          "relative group cursor-pointer rounded-lg overflow-hidden border",
          "transition-all duration-200 hover:scale-[1.02] hover:shadow-lg",
          "bg-red-50 dark:bg-red-950 h-32 flex flex-col items-center justify-center p-3"
        )}
        onClick={() => window.open(attachment.url, "_blank")}
      >
        <FileText className="h-10 w-10 text-red-500 mb-2" />
        <p className="text-xs font-medium text-red-700 dark:text-red-300 text-center truncate w-full">
          {attachment.name}
        </p>
        
        {/* Actions on hover */}
        <div className={cn(
          "absolute inset-0 bg-red-900/20 flex items-center justify-center gap-2",
          "transition-opacity duration-200",
          "opacity-0 group-hover:opacity-100"
        )}>
          <Button size="sm" variant="secondary" className="h-8" onClick={handleDownload}>
            <Download className="h-3.5 w-3.5 mr-1" />
            Download
          </Button>
        </div>

        {/* Type badge */}
        <Badge 
          variant="secondary" 
          className="absolute bottom-2 left-2 text-[10px] px-1.5 py-0 bg-red-200 text-red-700 border-0"
        >
          PDF
        </Badge>
      </div>
    )
  }

  // Other file types
  return (
    <div
      className={cn(
        "relative group cursor-pointer rounded-lg overflow-hidden border",
        "transition-all duration-200 hover:scale-[1.02] hover:shadow-lg",
        "bg-gray-50 dark:bg-gray-900 h-32 flex flex-col items-center justify-center p-3"
      )}
      onClick={() => window.open(attachment.url, "_blank")}
    >
      <File className="h-10 w-10 text-gray-400 mb-2" />
      <p className="text-xs font-medium text-gray-600 dark:text-gray-300 text-center truncate w-full">
        {attachment.name}
      </p>
      
      {/* Actions on hover */}
      <div className={cn(
        "absolute inset-0 bg-gray-900/20 flex items-center justify-center gap-2",
        "transition-opacity duration-200",
        "opacity-0 group-hover:opacity-100"
      )}>
        <Button size="sm" variant="secondary" className="h-8" onClick={handleDownload}>
          <Download className="h-3.5 w-3.5 mr-1" />
          Download
        </Button>
      </div>

      {/* Type badge */}
      <Badge 
        variant="secondary" 
        className="absolute bottom-2 left-2 text-[10px] px-1.5 py-0"
      >
        {attachment.type.toUpperCase()}
      </Badge>
    </div>
  )
}

// ============================================
// ATTACHMENT PREVIEW COMPONENT
// ============================================
export function AttachmentPreview({ 
  attachments, 
  maxVisible = 6,
  className,
}: AttachmentPreviewProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [showAll, setShowAll] = useState(false)

  if (!attachments || attachments.length === 0) {
    return (
      <div className={cn("text-center py-6 text-muted-foreground", className)}>
        <File className="h-8 w-8 mx-auto mb-2 opacity-30" />
        <p className="text-sm">Không có tài liệu đính kèm</p>
      </div>
    )
  }

  // Get media attachments for lightbox
  const mediaAttachments = attachments.filter(
    (a) => a.type === "image" || a.type === "video"
  )

  // Determine which attachments to display
  const displayedAttachments = showAll ? attachments : attachments.slice(0, maxVisible)
  const hiddenCount = attachments.length - maxVisible

  const handleOpenLightbox = (index: number, attachment: Attachment) => {
    if (attachment.type === "image" || attachment.type === "video") {
      // Find the index in mediaAttachments
      const mediaIndex = mediaAttachments.findIndex(
        (a) => a.url === attachment.url
      )
      if (mediaIndex !== -1) {
        setLightboxIndex(mediaIndex)
        setLightboxOpen(true)
      }
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{attachments.length} files đính kèm</span>
        {mediaAttachments.length > 0 && (
          <span className="text-xs">
            {mediaAttachments.length} preview
          </span>
        )}
      </div>

      {/* Grid layout */}
      <div className={cn(
        "grid gap-2",
        displayedAttachments.length === 1 && "grid-cols-1",
        displayedAttachments.length === 2 && "grid-cols-2",
        displayedAttachments.length >= 3 && "grid-cols-2 md:grid-cols-3"
      )}>
        {displayedAttachments.map((attachment, index) => (
          <AttachmentCard
            key={attachment.url + index}
            attachment={attachment}
            index={index}
            onClick={() => handleOpenLightbox(index, attachment)}
          />
        ))}
      </div>

      {/* Show more / Show less */}
      {hiddenCount > 0 && !showAll && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-xs"
          onClick={() => setShowAll(true)}
        >
          Xem thêm {hiddenCount} files
        </Button>
      )}
      {showAll && attachments.length > maxVisible && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-xs"
          onClick={() => setShowAll(false)}
        >
          Thu gọn
        </Button>
      )}

      {/* Lightbox */}
      <AttachmentLightbox
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        attachments={mediaAttachments}
        initialIndex={lightboxIndex}
      />
    </div>
  )
}

export default AttachmentPreview
