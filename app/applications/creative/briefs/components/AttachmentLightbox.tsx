"use client"

import { useEffect, useCallback, useRef, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  ZoomIn, 
  ZoomOut,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Attachment } from "../types"

// ============================================
// PROPS
// ============================================
interface AttachmentLightboxProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  attachments: Attachment[]
  initialIndex?: number
}

// ============================================
// ATTACHMENT LIGHTBOX COMPONENT
// ============================================
export function AttachmentLightbox({
  open,
  onOpenChange,
  attachments,
  initialIndex = 0,
}: AttachmentLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [zoom, setZoom] = useState(1)
  const videoRef = useRef<HTMLVideoElement>(null)

  const mediaAttachments = attachments.filter(
    (a) => a.type === "image" || a.type === "video"
  )

  const currentAttachment = mediaAttachments[currentIndex]
  const totalCount = mediaAttachments.length

  // Reset state when attachment changes
  useEffect(() => {
    setIsLoading(true)
    setHasError(false)
    setZoom(1)
  }, [currentIndex])

  // Reset index when modal opens
  useEffect(() => {
    if (open) {
      setCurrentIndex(initialIndex)
    }
  }, [open, initialIndex])

  // Navigation handlers
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalCount - 1))
  }, [totalCount])

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < totalCount - 1 ? prev + 1 : 0))
  }, [totalCount])

  // Keyboard navigation
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault()
          goToPrevious()
          break
        case "ArrowRight":
          e.preventDefault()
          goToNext()
          break
        case "Escape":
          e.preventDefault()
          onOpenChange(false)
          break
        case "+":
        case "=":
          e.preventDefault()
          setZoom((z) => Math.min(z + 0.25, 3))
          break
        case "-":
          e.preventDefault()
          setZoom((z) => Math.max(z - 0.25, 0.5))
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, goToPrevious, goToNext, onOpenChange])

  // Download handler
  const handleDownload = () => {
    if (!currentAttachment) return
    
    const link = document.createElement("a")
    link.href = currentAttachment.url
    link.download = currentAttachment.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Image load handlers
  const handleImageLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleImageError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  if (!currentAttachment || mediaAttachments.length === 0) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 bg-black/95 border-none">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center gap-3">
            <span className="text-white text-sm font-medium">
              {currentIndex + 1} / {totalCount}
            </span>
            <span className="text-white/70 text-sm truncate max-w-[300px]">
              {currentAttachment.name}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Zoom controls (for images only) */}
            {currentAttachment.type === "image" && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 h-9 w-9 p-0"
                  onClick={() => setZoom((z) => Math.max(z - 0.25, 0.5))}
                  disabled={zoom <= 0.5}
                >
                  <ZoomOut className="h-5 w-5" />
                </Button>
                <span className="text-white text-sm min-w-[50px] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 h-9 w-9 p-0"
                  onClick={() => setZoom((z) => Math.min(z + 0.25, 3))}
                  disabled={zoom >= 3}
                >
                  <ZoomIn className="h-5 w-5" />
                </Button>
              </>
            )}
            
            {/* Download button */}
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 h-9 px-3"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            
            {/* Close button */}
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 h-9 w-9 p-0"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex items-center justify-center h-full w-full relative">
          {/* Previous button */}
          {totalCount > 1 && (
            <Button
              variant="ghost"
              size="lg"
              className="absolute left-4 z-40 text-white hover:bg-white/20 h-12 w-12 p-0 rounded-full"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
          )}

          {/* Media content */}
          <div className="flex items-center justify-center max-w-full max-h-full overflow-auto p-16">
            {/* Loading state */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-12 w-12 text-white animate-spin" />
              </div>
            )}

            {/* Error state */}
            {hasError && (
              <div className="flex flex-col items-center justify-center text-white">
                <AlertCircle className="h-16 w-16 mb-4 text-red-400" />
                <p className="text-lg font-medium">Failed to load media</p>
                <p className="text-sm text-white/60">{currentAttachment.name}</p>
              </div>
            )}

            {/* Image */}
            {currentAttachment.type === "image" && !hasError && (
              <img
                src={currentAttachment.url}
                alt={currentAttachment.name}
                className={cn(
                  "max-w-full max-h-[80vh] object-contain transition-transform duration-200",
                  isLoading && "opacity-0"
                )}
                style={{ transform: `scale(${zoom})` }}
                onLoad={handleImageLoad}
                onError={handleImageError}
                draggable={false}
              />
            )}

            {/* Video */}
            {currentAttachment.type === "video" && !hasError && (
              <video
                ref={videoRef}
                src={currentAttachment.url}
                className={cn(
                  "max-w-full max-h-[80vh] object-contain",
                  isLoading && "opacity-0"
                )}
                controls
                autoPlay
                onLoadedData={() => setIsLoading(false)}
                onError={handleImageError}
              />
            )}
          </div>

          {/* Next button */}
          {totalCount > 1 && (
            <Button
              variant="ghost"
              size="lg"
              className="absolute right-4 z-40 text-white hover:bg-white/20 h-12 w-12 p-0 rounded-full"
              onClick={goToNext}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          )}
        </div>

        {/* Thumbnail strip at bottom */}
        {totalCount > 1 && (
          <div className="absolute bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-center justify-center gap-2 overflow-x-auto max-w-full py-2">
              {mediaAttachments.map((attachment, index) => (
                <button
                  key={attachment.url + index}
                  className={cn(
                    "flex-shrink-0 h-16 w-16 rounded-lg overflow-hidden border-2 transition-all",
                    index === currentIndex
                      ? "border-white ring-2 ring-white/50"
                      : "border-transparent hover:border-white/50 opacity-60 hover:opacity-100"
                  )}
                  onClick={() => setCurrentIndex(index)}
                >
                  {attachment.type === "image" ? (
                    <img
                      src={attachment.url}
                      alt={attachment.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-800 flex items-center justify-center">
                      <span className="text-white text-xs">▶️</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Keyboard hints */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/40 text-xs">
          ← → navigate • +/- zoom • Esc close
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AttachmentLightbox
