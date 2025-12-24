"use client"

import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Image, Video, FileText, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { BriefAttachment } from "../types"

// Mock library assets
const MOCK_LIBRARY_ASSETS = [
  { id: "lib-1", name: "Brand Logo.png", type: "image", url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200", size: 245760 },
  { id: "lib-2", name: "Product Hero.jpg", type: "image", url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200", size: 1048576 },
  { id: "lib-3", name: "App Preview.mp4", type: "video", url: "#", size: 5242880 },
  { id: "lib-4", name: "Style Guide.pdf", type: "pdf", url: "#", size: 2097152 },
  { id: "lib-5", name: "Summer Campaign.jpg", type: "image", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200", size: 819200 },
  { id: "lib-6", name: "Winter Collection.jpg", type: "image", url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200", size: 655360 },
]

interface AssetLibraryPickerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (assets: BriefAttachment[]) => void
  selectedIds: string[]
}

export function AssetLibraryPicker({ open, onOpenChange, onSelect, selectedIds }: AssetLibraryPickerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [localSelectedIds, setLocalSelectedIds] = useState<Set<string>>(new Set(selectedIds))

  const filteredAssets = useMemo(() => {
    return MOCK_LIBRARY_ASSETS.filter(asset =>
      asset.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  const toggleAsset = (assetId: string) => {
    setLocalSelectedIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(assetId)) {
        newSet.delete(assetId)
      } else {
        newSet.add(assetId)
      }
      return newSet
    })
  }

  const handleConfirm = () => {
    const selectedAssets: BriefAttachment[] = MOCK_LIBRARY_ASSETS
      .filter(asset => localSelectedIds.has(asset.id))
      .map(asset => ({
        id: `lib-attach-${asset.id}-${Date.now()}`,
        name: asset.name,
        url: asset.url,
        type: asset.type as "image" | "video" | "pdf" | "zip",
        size: asset.size,
        source: 'library' as const,
        libraryAssetId: asset.id,
      }))
    
    onSelect(selectedAssets)
    onOpenChange(false)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "image": return <Image className="h-4 w-4 text-blue-500" />
      case "video": return <Video className="h-4 w-4 text-purple-500" />
      case "pdf": return <FileText className="h-4 w-4 text-red-500" />
      default: return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chọn từ Asset Library</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Asset Grid */}
          <ScrollArea className="h-[400px]">
            <div className="grid grid-cols-3 gap-3 p-1">
              {filteredAssets.map((asset) => {
                const isSelected = localSelectedIds.has(asset.id)
                return (
                  <div
                    key={asset.id}
                    className={cn(
                      "relative border rounded-lg p-3 cursor-pointer transition-all hover:border-blue-400",
                      isSelected && "border-blue-500 bg-blue-50 dark:bg-blue-950"
                    )}
                    onClick={() => toggleAsset(asset.id)}
                  >
                    {/* Checkbox */}
                    <div className="absolute top-2 right-2">
                      <Checkbox checked={isSelected} className="pointer-events-none" />
                    </div>

                    {/* Preview */}
                    <div className="aspect-square bg-muted rounded-md mb-2 flex items-center justify-center overflow-hidden">
                      {asset.type === "image" && asset.url !== "#" ? (
                        <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                      ) : (
                        getTypeIcon(asset.type)
                      )}
                    </div>

                    {/* Info */}
                    <div className="space-y-1">
                      <p className="text-xs font-medium truncate">{asset.name}</p>
                      <div className="flex items-center gap-1">
                        {getTypeIcon(asset.type)}
                        <span className="text-[10px] text-muted-foreground">
                          {(asset.size / 1024 / 1024).toFixed(1)} MB
                        </span>
                      </div>
                    </div>

                    {/* Selected Indicator */}
                    {isSelected && (
                      <div className="absolute inset-0 bg-blue-500/10 rounded-lg flex items-center justify-center">
                        <div className="bg-blue-500 rounded-full p-1">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </ScrollArea>

          {/* Selected Count */}
          {localSelectedIds.size > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="secondary">{localSelectedIds.size} đã chọn</Badge>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleConfirm} disabled={localSelectedIds.size === 0}>
            Thêm {localSelectedIds.size > 0 ? `(${localSelectedIds.size})` : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AssetLibraryPicker
