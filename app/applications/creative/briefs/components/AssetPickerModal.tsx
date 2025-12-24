"use client"

import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Check, Image as ImageIcon, Video, FileText, Package } from "lucide-react"
import { cn } from "@/lib/utils"

// Import from library
import { mockAssets } from "../../library/mockData"
import type { Asset } from "../../library/types"
import { CATEGORY_CONFIG, TYPE_CONFIG } from "../../library/types"

interface AssetPickerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (assets: Asset[]) => void
  selectedIds?: string[]
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}

export function AssetPickerModal({ 
  open, 
  onOpenChange, 
  onSelect, 
  selectedIds: initialSelectedIds = [] 
}: AssetPickerModalProps) {
  const [search, setSearch] = useState("")
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds)
  const [typeFilter, setTypeFilter] = useState<string | null>(null)

  // Filter assets
  const filteredAssets = useMemo(() => {
    let result = [...mockAssets]
    
    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(a => 
        a.name.toLowerCase().includes(searchLower) ||
        a.description?.toLowerCase().includes(searchLower) ||
        a.tags.some(t => t.toLowerCase().includes(searchLower))
      )
    }
    
    if (typeFilter) {
      result = result.filter(a => a.type === typeFilter)
    }
    
    return result
  }, [search, typeFilter])

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleConfirm = () => {
    const selected = mockAssets.filter(a => selectedIds.includes(a.id))
    onSelect(selected)
    setSelectedIds([])
    setSearch("")
    onOpenChange(false)
  }

  const handleCancel = () => {
    setSelectedIds(initialSelectedIds)
    setSearch("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Chọn từ Creative Library</DialogTitle>
        </DialogHeader>

        {/* Search & Filters */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên, tags..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          {/* Type filters */}
          <div className="flex gap-1">
            <Button 
              variant={typeFilter === null ? "default" : "outline"} 
              size="sm"
              onClick={() => setTypeFilter(null)}
            >
              Tất cả
            </Button>
            <Button 
              variant={typeFilter === "image" ? "default" : "outline"} 
              size="sm"
              onClick={() => setTypeFilter("image")}
            >
              <ImageIcon className="h-4 w-4 mr-1" />
              Ảnh
            </Button>
            <Button 
              variant={typeFilter === "video" ? "default" : "outline"} 
              size="sm"
              onClick={() => setTypeFilter("video")}
            >
              <Video className="h-4 w-4 mr-1" />
              Video
            </Button>
            <Button 
              variant={typeFilter === "document" ? "default" : "outline"} 
              size="sm"
              onClick={() => setTypeFilter("document")}
            >
              <FileText className="h-4 w-4 mr-1" />
              Tài liệu
            </Button>
          </div>
        </div>

        {/* Asset Grid */}
        <ScrollArea className="flex-1 border rounded-lg bg-gray-50 dark:bg-gray-900">
          <div className="p-4">
            {filteredAssets.length > 0 ? (
              <div className="grid grid-cols-4 gap-3">
                {filteredAssets.map(asset => {
                  const isSelected = selectedIds.includes(asset.id)
                  const catConfig = CATEGORY_CONFIG[asset.category]
                  const typeConfig = TYPE_CONFIG[asset.type]
                  
                  return (
                    <div
                      key={asset.id}
                      className={cn(
                        "bg-white dark:bg-gray-800 border rounded-lg overflow-hidden cursor-pointer transition-all relative group",
                        isSelected 
                          ? "ring-2 ring-blue-500 border-blue-300" 
                          : "hover:border-gray-400 hover:shadow-md"
                      )}
                      onClick={() => toggleSelect(asset.id)}
                    >
                      {/* Selection indicator */}
                      <div className={cn(
                        "absolute top-2 right-2 z-10 p-1 rounded-full transition-all",
                        isSelected 
                          ? "bg-blue-500" 
                          : "bg-white/80 dark:bg-gray-900/80 opacity-0 group-hover:opacity-100"
                      )}>
                        {isSelected ? (
                          <Check className="h-3 w-3 text-white" />
                        ) : (
                          <div className="h-3 w-3 border-2 rounded-sm" />
                        )}
                      </div>

                      {/* Thumbnail */}
                      <div className="aspect-square bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                        {asset.thumbnailUrl ? (
                          <img 
                            src={asset.thumbnailUrl} 
                            alt={asset.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-4xl">{typeConfig.icon}</span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-2">
                        <p className="text-sm font-medium truncate" title={asset.name}>
                          {asset.name}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(asset.fileSize)}
                          </p>
                          <Badge 
                            variant="secondary" 
                            className={cn("text-[10px] px-1.5 py-0", catConfig.color)}
                          >
                            {catConfig.icon}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p className="font-medium">Không tìm thấy asset</p>
                <p className="text-sm mt-1">Thử tìm kiếm với từ khóa khác</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <DialogFooter className="flex items-center justify-between border-t pt-4">
          <p className="text-sm text-muted-foreground">
            {selectedIds.length > 0 
              ? `Đã chọn ${selectedIds.length} file` 
              : 'Chưa chọn file nào'
            }
          </p>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Hủy
            </Button>
            <Button onClick={handleConfirm} disabled={selectedIds.length === 0}>
              Thêm {selectedIds.length > 0 && `(${selectedIds.length})`}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AssetPickerModal
