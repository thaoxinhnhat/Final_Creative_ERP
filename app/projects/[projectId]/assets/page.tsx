"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Grid3x3,
  List,
  Upload,
  Download,
  Trash2,
  Eye,
  Filter,
  ArrowUpDown,
  X,
  ImageIcon,
  Video,
  FileText,
  Music,
  File,
  MoreVertical,
  Share2,
  Edit,
  Star,
  Copy,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Asset = {
  id: string
  name: string
  type: "image" | "video" | "document" | "audio" | "other"
  url: string
  size: number
  uploadedAt: string
  dimensions?: { width: number; height: number }
  duration?: number
  thumbnail?: string
  tags?: string[]
  isFavorite?: boolean
}

export default function AssetsPage({ params }: { params: { projectId: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  // State management
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("date-desc")
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set())
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [renamingAsset, setRenamingAsset] = useState<Asset | null>(null)
  const [newAssetName, setNewAssetName] = useState("")
  const [isConfirmRenameDialogOpen, setIsConfirmRenameDialogOpen] = useState(false)
  const [isCancelRenameDialogOpen, setIsCancelRenameDialogOpen] = useState(false)
  const [originalAssetName, setOriginalAssetName] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingAsset, setDeletingAsset] = useState<Asset | null>(null)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [sharingAsset, setSharingAsset] = useState<Asset | null>(null)
  const [sharedUsers, setSharedUsers] = useState<
    Array<{ id: string; name: string; email: string; permission: "view" | "edit" }>
  >([])
  const [availableUsers] = useState([
    { id: "1", name: "Nguyễn Văn A", email: "nguyenvana@example.com" },
    { id: "2", name: "Trần Thị B", email: "tranthib@example.com" },
    { id: "3", name: "Lê Văn C", email: "levanc@example.com" },
    { id: "4", name: "Phạm Thị D", email: "phamthid@example.com" },
  ])
  const itemsPerPage = 20

  // Mock data - thay thế bằng API call thực tế
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: "1",
      name: "app-icon.png",
      type: "image",
      url: "/generic-app-icon.png",
      size: 245678,
      uploadedAt: "2024-03-15T10:30:00",
      dimensions: { width: 1024, height: 1024 },
      tags: ["icon", "branding"],
      isFavorite: true,
    },
    {
      id: "2",
      name: "screenshot-1.jpg",
      type: "image",
      url: "/mobile-app-interface.png",
      size: 1245678,
      uploadedAt: "2024-03-14T15:20:00",
      dimensions: { width: 1242, height: 2688 },
      tags: ["screenshot", "iPhone"],
    },
    {
      id: "3",
      name: "promo-video.mp4",
      type: "video",
      url: "/video-thumbnail.png",
      size: 15245678,
      uploadedAt: "2024-03-13T09:15:00",
      duration: 45,
      tags: ["video", "promo"],
    },
    {
      id: "4",
      name: "press-kit.pdf",
      type: "document",
      url: "/document-stack.png",
      size: 2245678,
      uploadedAt: "2024-03-12T14:00:00",
      tags: ["document", "press"],
    },
  ])

  // Helper functions
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getAssetIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      case "audio":
        return <Music className="h-4 w-4" />
      case "document":
        return <FileText className="h-4 w-4" />
      default:
        return <File className="h-4 w-4" />
    }
  }

  const handleToggleFavorite = (asset: Asset, e: React.MouseEvent) => {
    e.stopPropagation()

    const newFavoriteStatus = !asset.isFavorite

    // Cập nhật state assets
    setAssets(assets.map((a) => (a.id === asset.id ? { ...a, isFavorite: newFavoriteStatus } : a)))

    // Hiển thị toast notification
    toast({
      title: newFavoriteStatus ? "Đã thêm vào danh sách yêu thích" : "Đã bỏ khỏi danh sách yêu thích",
      description: asset.name,
    })

    // Cập nhật preview asset nếu đang xem
    if (previewAsset?.id === asset.id) {
      setPreviewAsset({ ...previewAsset, isFavorite: newFavoriteStatus })
    }
  }

  // Filter và sort assets
  const filteredAssets = assets
    .filter((asset) => {
      const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = filterType === "all" || asset.type === filterType
      return matchesSearch && matchesType
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name)
        case "name-desc":
          return b.name.localeCompare(a.name)
        case "size-asc":
          return a.size - b.size
        case "size-desc":
          return b.size - a.size
        case "date-asc":
          return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime()
        case "date-desc":
        default:
          return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      }
    })

  // Pagination
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage)
  const paginatedAssets = filteredAssets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // File upload handler
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 200)

    // Simulate API upload
    setTimeout(() => {
      clearInterval(interval)
      setUploadProgress(100)

      // Add new assets
      const newAssets: Asset[] = Array.from(files).map((file, index) => ({
        id: `new-${Date.now()}-${index}`,
        name: file.name,
        type: file.type.startsWith("image/")
          ? "image"
          : file.type.startsWith("video/")
            ? "video"
            : file.type.startsWith("audio/")
              ? "audio"
              : file.type.includes("pdf") || file.type.includes("document")
                ? "document"
                : "other",
        url: URL.createObjectURL(file),
        size: file.size,
        uploadedAt: new Date().toISOString(),
      }))

      setAssets([...newAssets, ...assets])
      setIsUploading(false)
      setUploadProgress(0)

      toast({
        title: "Upload thành công",
        description: `Đã tải lên ${files.length} file`,
      })
    }, 2000)
  }

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    handleFileUpload(files)
  }

  // Selection handlers
  const toggleSelectAsset = (assetId: string) => {
    const newSelected = new Set(selectedAssets)
    if (newSelected.has(assetId)) {
      newSelected.delete(assetId)
    } else {
      newSelected.add(assetId)
    }
    setSelectedAssets(newSelected)
  }

  const selectAllAssets = () => {
    if (selectedAssets.size === paginatedAssets.length) {
      setSelectedAssets(new Set())
    } else {
      setSelectedAssets(new Set(paginatedAssets.map((a) => a.id)))
    }
  }

  // Bulk actions
  const handleBulkDelete = () => {
    setAssets(assets.filter((a) => !selectedAssets.has(a.id)))
    setSelectedAssets(new Set())
    toast({
      title: "Đã xóa",
      description: `Đã xóa ${selectedAssets.size} asset`,
    })
  }

  const handleBulkDownload = () => {
    toast({
      title: "Đang tải xuống",
      description: `Đang tải xuống ${selectedAssets.size} asset`,
    })
  }

  const handleDownloadAsset = (asset: Asset, e: React.MouseEvent) => {
    e.stopPropagation()
    // Tạo link download
    const link = document.createElement("a")
    link.href = asset.url
    link.download = asset.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Đang tải xuống",
      description: `Đang tải xuống ${asset.name}`,
    })
  }

  const handleCopyAssetURL = (asset: Asset, e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(asset.url)
    toast({
      title: "Đã sao chép",
      description: "URL đã được sao chép vào clipboard",
    })
  }

  const handleShareAsset = (asset: Asset, e: React.MouseEvent) => {
    e.stopPropagation()
    setSharingAsset(asset)
    setSharedUsers([]) // Reset danh sách user đã share
    setIsShareDialogOpen(true)
  }

  const handleCopyShareLink = () => {
    if (!sharingAsset) return
    const shareUrl = `${window.location.origin}/projects/${params.projectId}/assets/${sharingAsset.id}`
    navigator.clipboard.writeText(shareUrl)
    toast({
      title: "Đã sao chép link",
      description: "Link chia sẻ đã được sao chép vào clipboard",
    })
  }

  const handleAddUserToShare = (userId: string) => {
    const user = availableUsers.find((u) => u.id === userId)
    if (user && !sharedUsers.find((u) => u.id === userId)) {
      setSharedUsers([...sharedUsers, { ...user, permission: "view" }])
    }
  }

  const handleRemoveUserFromShare = (userId: string) => {
    setSharedUsers(sharedUsers.filter((u) => u.id !== userId))
  }

  const handleChangeUserPermission = (userId: string, permission: "view" | "edit") => {
    setSharedUsers(sharedUsers.map((u) => (u.id === userId ? { ...u, permission } : u)))
  }

  const handleSaveShareSettings = () => {
    toast({
      title: "Đã lưu cài đặt chia sẻ",
      description: `Đã cấp quyền truy cập cho ${sharedUsers.length} người dùng`,
    })
    setIsShareDialogOpen(false)
    setSharingAsset(null)
    setSharedUsers([])
  }

  const handleRenameAsset = (asset: Asset, e: React.MouseEvent) => {
    e.stopPropagation()
    setRenamingAsset(asset)
    setNewAssetName(asset.name)
    setOriginalAssetName(asset.name)
    setIsRenameDialogOpen(true)
  }

  const hasNameChanged = () => {
    return newAssetName.trim() !== originalAssetName && newAssetName.trim() !== ""
  }

  const handleClickChange = () => {
    if (!hasNameChanged()) return
    setIsConfirmRenameDialogOpen(true)
  }

  const handleConfirmRename = () => {
    if (!renamingAsset || !newAssetName.trim()) return

    setAssets(assets.map((a) => (a.id === renamingAsset.id ? { ...a, name: newAssetName.trim() } : a)))

    toast({
      title: "Đã đổi tên",
      description: `Đã đổi tên thành "${newAssetName.trim()}"`,
    })

    setIsConfirmRenameDialogOpen(false)
    setIsRenameDialogOpen(false)
    setRenamingAsset(null)
    setNewAssetName("")
    setOriginalAssetName("")
  }

  const handleClickCancel = () => {
    if (hasNameChanged()) {
      setIsCancelRenameDialogOpen(true)
    } else {
      setIsRenameDialogOpen(false)
      setRenamingAsset(null)
      setNewAssetName("")
      setOriginalAssetName("")
    }
  }

  const handleConfirmCancelRename = () => {
    setIsCancelRenameDialogOpen(false)
    setIsRenameDialogOpen(false)
    setRenamingAsset(null)
    setNewAssetName("")
    setOriginalAssetName("")
  }

  const handleDeleteAsset = (asset: Asset, e: React.MouseEvent) => {
    e.stopPropagation()
    setDeletingAsset(asset)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!deletingAsset) return

    setAssets(assets.filter((a) => a.id !== deletingAsset.id))
    toast({
      title: "Đã xóa",
      description: `Đã xóa ${deletingAsset.name}`,
    })

    setIsDeleteDialogOpen(false)
    setDeletingAsset(null)
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + A: Select all
      if ((e.ctrlKey || e.metaKey) && e.key === "a") {
        e.preventDefault()
        selectAllAssets()
      }
      // Delete: Delete selected
      if (e.key === "Delete" && selectedAssets.size > 0) {
        e.preventDefault()
        handleBulkDelete()
      }
      // Escape: Clear selection
      if (e.key === "Escape") {
        setSelectedAssets(new Set())
        setPreviewAsset(null)
      }
      // G: Toggle grid view
      if (e.key === "g" && !e.ctrlKey && !e.metaKey) {
        setViewMode("grid")
      }
      // L: Toggle list view
      if (e.key === "l" && !e.ctrlKey && !e.metaKey) {
        setViewMode("list")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedAssets, paginatedAssets])

  // Helper functions
  const assetTypeCounts = {
    all: assets.length,
    image: assets.filter((a) => a.type === "image").length,
    video: assets.filter((a) => a.type === "video").length,
    document: assets.filter((a) => a.type === "document").length,
    audio: assets.filter((a) => a.type === "audio").length,
    other: assets.filter((a) => a.type === "other").length,
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Asset Management</h1>
                <p className="text-sm text-muted-foreground">Quản lý tất cả assets của dự án</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
              />
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Tải lên
              </Button>
            </div>
          </div>

          {/* Filters and Actions */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter and Sort */}
            <div className="flex items-center gap-2 flex-wrap">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Loại file" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả ({assetTypeCounts.all})</SelectItem>
                  <SelectItem value="image">Hình ảnh ({assetTypeCounts.image})</SelectItem>
                  <SelectItem value="video">Video ({assetTypeCounts.video})</SelectItem>
                  <SelectItem value="document">Tài liệu ({assetTypeCounts.document})</SelectItem>
                  <SelectItem value="audio">Âm thanh ({assetTypeCounts.audio})</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px]">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Mới nhất</SelectItem>
                  <SelectItem value="date-asc">Cũ nhất</SelectItem>
                  <SelectItem value="name-asc">Tên A-Z</SelectItem>
                  <SelectItem value="name-desc">Tên Z-A</SelectItem>
                  <SelectItem value="size-asc">Nhỏ nhất</SelectItem>
                  <SelectItem value="size-desc">Lớn nhất</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-1 border rounded-md p-1">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Bulk Actions Bar */}
          {selectedAssets.size > 0 && (
            <div className="mt-4 flex items-center justify-between bg-primary/10 border border-primary/20 rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <Checkbox checked={selectedAssets.size === paginatedAssets.length} onCheckedChange={selectAllAssets} />
                <span className="text-sm font-medium">Đã chọn {selectedAssets.size} asset</span>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={handleBulkDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Tải xuống
                </Button>
                <Button size="sm" variant="outline" onClick={handleBulkDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Xóa
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setSelectedAssets(new Set())}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="container mx-auto px-4 py-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Upload className="h-5 w-5 text-primary animate-pulse" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Đang tải lên...</span>
                    <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Drag & Drop Zone */}
      <div
        ref={dropZoneRef}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="container mx-auto px-4 py-6"
      >
        {isDragging && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <Card className="w-full max-w-md border-2 border-dashed border-primary">
              <CardContent className="pt-6 text-center">
                <Upload className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">Thả file vào đây</h3>
                <p className="text-sm text-muted-foreground">Hỗ trợ nhiều file cùng lúc</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Grid View */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {paginatedAssets.map((asset) => (
              <Card
                key={asset.id}
                className={`group cursor-pointer transition-all hover:shadow-lg ${
                  selectedAssets.has(asset.id) ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setPreviewAsset(asset)}
              >
                <CardContent className="p-3">
                  {/* Thumbnail */}
                  <div className="relative aspect-square bg-muted rounded-lg overflow-hidden mb-3">
                    {asset.type === "image" || asset.type === "video" ? (
                      <img
                        src={asset.url || "/placeholder.svg"}
                        alt={asset.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">{getAssetIcon(asset.type)}</div>
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation()
                          setPreviewAsset(asset)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button size="icon" variant="secondary" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={(e) => handleDownloadAsset(asset, e)}>
                            <Download className="h-4 w-4 mr-2" />
                            Tải xuống
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => handleShareAsset(asset, e)}>
                            <Share2 className="h-4 w-4 mr-2" />
                            Chia sẻ
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => handleRenameAsset(asset, e)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Đổi tên
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => handleToggleFavorite(asset, e)}>
                            <Star className={asset.isFavorite ? "fill-yellow-400 text-yellow-400" : ""} />
                            {asset.isFavorite ? "Bỏ yêu thích" : "Yêu thích"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={(e) => handleDeleteAsset(asset, e)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Checkbox */}
                    <div className="absolute top-2 left-2 z-10" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedAssets.has(asset.id)}
                        onCheckedChange={() => toggleSelectAsset(asset.id)}
                        className="bg-background"
                      />
                    </div>

                    {/* Favorite */}
                    {asset.isFavorite && (
                      <div className="absolute top-2 right-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      </div>
                    )}

                    {/* Type Badge */}
                    <div className="absolute bottom-2 right-2">
                      <Badge variant="secondary" className="text-xs">
                        {asset.type}
                      </Badge>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-1">
                    <p className="text-sm font-medium truncate" title={asset.name}>
                      {asset.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(asset.size)}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === "list" && (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedAssets.size === paginatedAssets.length && paginatedAssets.length > 0}
                      onCheckedChange={selectAllAssets}
                    />
                  </TableHead>
                  <TableHead>Tên</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Kích thước</TableHead>
                  <TableHead>Ngày tải lên</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAssets.map((asset) => (
                  <TableRow
                    key={asset.id}
                    className={`cursor-pointer ${selectedAssets.has(asset.id) ? "bg-primary/5" : ""}`}
                    onClick={() => setPreviewAsset(asset)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedAssets.has(asset.id)}
                        onCheckedChange={() => toggleSelectAsset(asset.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                          {asset.type === "image" || asset.type === "video" ? (
                            <img
                              src={asset.url || "/placeholder.svg"}
                              alt={asset.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            getAssetIcon(asset.type)
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{asset.name}</p>
                          {asset.dimensions && (
                            <p className="text-xs text-muted-foreground">
                              {asset.dimensions.width} × {asset.dimensions.height}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{asset.type}</Badge>
                    </TableCell>
                    <TableCell>{formatFileSize(asset.size)}</TableCell>
                    <TableCell>{formatDate(asset.uploadedAt)}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              setPreviewAsset(asset)
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Xem
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => handleDownloadAsset(asset, e)}>
                            <Download className="h-4 w-4 mr-2" />
                            Tải xuống
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => handleCopyAssetURL(asset, e)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Sao chép URL
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => handleShareAsset(asset, e)}>
                            <Share2 className="h-4 w-4 mr-2" />
                            Chia sẻ
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => handleToggleFavorite(asset, e)}>
                            <Star className={asset.isFavorite ? "fill-yellow-400 text-yellow-400" : ""} />
                            {asset.isFavorite ? "Bỏ yêu thích" : "Yêu thích"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={(e) => handleDeleteAsset(asset, e)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}

        {/* Empty State */}
        {filteredAssets.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Không tìm thấy asset</h3>
              <p className="text-sm text-muted-foreground mb-4">Thử thay đổi bộ lọc hoặc tìm kiếm của bạn</p>
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Tải lên asset đầu tiên
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {filteredAssets.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-muted-foreground">
              Hiển thị {(currentPage - 1) * itemsPerPage + 1} -{" "}
              {Math.min(currentPage * itemsPerPage, filteredAssets.length)} trong tổng số {filteredAssets.length} asset
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Trang {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <Dialog open={!!previewAsset} onOpenChange={() => setPreviewAsset(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{previewAsset?.name}</span>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => previewAsset && handleToggleFavorite(previewAsset, e)}
                >
                  <Star className={previewAsset?.isFavorite ? "fill-yellow-400 text-yellow-400" : ""} />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => previewAsset && handleDownloadAsset(previewAsset, e)}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={(e) => previewAsset && handleShareAsset(previewAsset, e)}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </DialogTitle>
            <DialogDescription>
              {previewAsset && formatFileSize(previewAsset.size)} •{" "}
              {previewAsset && formatDate(previewAsset.uploadedAt)}
            </DialogDescription>
          </DialogHeader>

          {previewAsset && (
            <div className="space-y-6">
              {/* Preview */}
              <div className="bg-muted rounded-lg overflow-hidden">
                {previewAsset.type === "image" ? (
                  <img
                    src={previewAsset.url || "/placeholder.svg"}
                    alt={previewAsset.name}
                    className="w-full h-auto max-h-[500px] object-contain"
                  />
                ) : previewAsset.type === "video" ? (
                  <video src={previewAsset.url} controls className="w-full h-auto max-h-[500px]" />
                ) : (
                  <div className="flex items-center justify-center py-20">
                    {getAssetIcon(previewAsset.type)}
                    <span className="ml-2 text-sm text-muted-foreground">Không thể xem trước loại file này</span>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-1">Loại file</p>
                  <Badge>{previewAsset.type}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Kích thước</p>
                  <p className="text-sm text-muted-foreground">{formatFileSize(previewAsset.size)}</p>
                </div>
                {previewAsset.dimensions && (
                  <div>
                    <p className="text-sm font-medium mb-1">Kích thước ảnh</p>
                    <p className="text-sm text-muted-foreground">
                      {previewAsset.dimensions.width} × {previewAsset.dimensions.height}
                    </p>
                  </div>
                )}
                {previewAsset.duration && (
                  <div>
                    <p className="text-sm font-medium mb-1">Thời lượng</p>
                    <p className="text-sm text-muted-foreground">{previewAsset.duration}s</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium mb-1">Ngày tải lên</p>
                  <p className="text-sm text-muted-foreground">{formatDate(previewAsset.uploadedAt)}</p>
                </div>
                {previewAsset.tags && previewAsset.tags.length > 0 && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {previewAsset.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewAsset(null)}>
              Đóng
            </Button>
            <Button onClick={(e) => previewAsset && handleDownloadAsset(previewAsset, e)}>
              <Download className="h-4 w-4 mr-2" />
              Tải xuống
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đổi tên asset</DialogTitle>
            <DialogDescription>Nhập tên mới cho asset</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newAssetName}
              onChange={(e) => setNewAssetName(e.target.value)}
              placeholder="Tên mới..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && hasNameChanged()) {
                  handleClickChange()
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleClickCancel}>
              Cancel
            </Button>
            <Button onClick={handleClickChange} disabled={!hasNameChanged()}>
              Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Rename Dialog */}
      <AlertDialog open={isConfirmRenameDialogOpen} onOpenChange={setIsConfirmRenameDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận đổi tên</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn đổi tên từ <span className="font-semibold">"{originalAssetName}"</span> thành{" "}
              <span className="font-semibold">"{newAssetName.trim()}"</span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRename}>Confirm & Update</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Rename Dialog */}
      <AlertDialog open={isCancelRenameDialogOpen} onOpenChange={setIsCancelRenameDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hủy thay đổi?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn hủy? Tên mới <span className="font-semibold">"{newAssetName.trim()}"</span> sẽ không
              được lưu và quay về tên cũ <span className="font-semibold">"{originalAssetName}"</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Quay lại</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCancelRename}>Xác nhận hủy</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa asset</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa <span className="font-semibold">{deletingAsset?.name}</span>? Hành động này
              không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Share Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chia sẻ asset</DialogTitle>
            <DialogDescription>Sao chép link hoặc cấp quyền truy cập cho người dùng nội bộ</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Copy Link Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Share Link</label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={
                    sharingAsset
                      ? `${window.location.origin}/projects/${params.projectId}/assets/${sharingAsset.id}`
                      : ""
                  }
                  className="flex-1"
                />
                <Button variant="outline" onClick={handleCopyShareLink}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
            </div>

            {/* Add User Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Thêm người dùng</label>
              <Select onValueChange={handleAddUserToShare}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn người dùng để cấp quyền..." />
                </SelectTrigger>
                <SelectContent>
                  {availableUsers
                    .filter((user) => !sharedUsers.find((u) => u.id === user.id))
                    .map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex flex-col">
                          <span>{user.name}</span>
                          <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* User Access List */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Người dùng có quyền truy cập ({sharedUsers.length})</label>
              {sharedUsers.length === 0 ? (
                <div className="text-center py-8 border rounded-lg bg-muted/20">
                  <UserPlus className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Chưa có người dùng nào được cấp quyền</p>
                </div>
              ) : (
                <div className="border rounded-lg divide-y max-h-[200px] overflow-y-auto">
                  {sharedUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 hover:bg-muted/50">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Select
                          value={user.permission}
                          onValueChange={(value: "view" | "edit") => handleChangeUserPermission(user.id, value)}
                        >
                          <SelectTrigger className="w-[100px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="view">
                              <div className="flex items-center gap-2">
                                <Eye className="h-3 w-3" />
                                View
                              </div>
                            </SelectItem>
                            <SelectItem value="edit">
                              <div className="flex items-center gap-2">
                                <Edit className="h-3 w-3" />
                                Edit
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveUserFromShare(user.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsShareDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveShareSettings}>
              <Check className="h-4 w-4 mr-2" />
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Keyboard Shortcuts Helper */}
      <div className="fixed bottom-4 right-4 text-xs text-muted-foreground bg-card border rounded-lg px-3 py-2 shadow-lg">
        <p className="font-medium mb-1">Phím tắt:</p>
        <p>Ctrl/Cmd + A: Chọn tất cả</p>
        <p>Delete: Xóa đã chọn</p>
        <p>Esc: Hủy chọn</p>
        <p>G: Grid view</p>
        <p>L: List view</p>
      </div>
    </div>
  )
}
