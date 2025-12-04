"use client"

import { useState } from "react"
import { Grid3X3, List, Filter, Search, Info, Download, Link2, Trash2, ZoomIn, ZoomOut, Play, Copy } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Asset types
type AssetType = "app_icon" | "feature_graphic" | "screenshot" | "video"
type OS = "android" | "ios"

interface Asset {
  id: string
  appId: string
  appName: string
  os: OS
  storeKitRequestId: string
  storeKitName: string
  type: AssetType
  fileName: string
  fileUrl: string
  fileSize: string
  dimensions: string
  uploadDate: string
  uploaderId: string
  uploaderName: string
  thumbnailUrl: string
  youtubeId?: string
}

// Mock data
const mockAssets: Asset[] = [
  {
    id: "1",
    appId: "app1",
    appName: "Game Adventure",
    os: "android",
    storeKitRequestId: "req1",
    storeKitName: "Q1 2024 Update",
    type: "app_icon",
    fileName: "icon_512x512.png",
    fileUrl: "/generic-game-icon.png",
    fileSize: "245 KB",
    dimensions: "512 x 512",
    uploadDate: "2024-01-15",
    uploaderId: "user1",
    uploaderName: "Nguyen Van A",
    thumbnailUrl: "/generic-game-icon.png",
  },
  {
    id: "2",
    appId: "app1",
    appName: "Game Adventure",
    os: "android",
    storeKitRequestId: "req1",
    storeKitName: "Q1 2024 Update",
    type: "feature_graphic",
    fileName: "feature_1024x500.jpg",
    fileUrl: "/game-feature-graphic.jpg",
    fileSize: "456 KB",
    dimensions: "1024 x 500",
    uploadDate: "2024-01-14",
    uploaderId: "user1",
    uploaderName: "Nguyen Van A",
    thumbnailUrl: "/game-feature-graphic.jpg",
  },
  {
    id: "3",
    appId: "app1",
    appName: "Game Adventure",
    os: "android",
    storeKitRequestId: "req1",
    storeKitName: "Q1 2024 Update",
    type: "screenshot",
    fileName: "screenshot_1.png",
    fileUrl: "/game-screenshot-1.jpg",
    fileSize: "1.2 MB",
    dimensions: "1080 x 1920",
    uploadDate: "2024-01-13",
    uploaderId: "user2",
    uploaderName: "Tran Thi B",
    thumbnailUrl: "/game-screenshot-1.jpg",
  },
  {
    id: "4",
    appId: "app1",
    appName: "Game Adventure",
    os: "android",
    storeKitRequestId: "req1",
    storeKitName: "Q1 2024 Update",
    type: "screenshot",
    fileName: "screenshot_2.png",
    fileUrl: "/game-screenshot-2.jpg",
    fileSize: "1.1 MB",
    dimensions: "1080 x 1920",
    uploadDate: "2024-01-13",
    uploaderId: "user2",
    uploaderName: "Tran Thi B",
    thumbnailUrl: "/game-screenshot-2.jpg",
  },
  {
    id: "5",
    appId: "app1",
    appName: "Game Adventure",
    os: "android",
    storeKitRequestId: "req1",
    storeKitName: "Q1 2024 Update",
    type: "video",
    fileName: "promo_video.mp4",
    fileUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    youtubeId: "dQw4w9WgXcQ",
    fileSize: "15.3 MB",
    dimensions: "1920 x 1080",
    uploadDate: "2024-01-12",
    uploaderId: "user3",
    uploaderName: "Le Van C",
    thumbnailUrl: "/youtube-thumbnail.png",
  },
  {
    id: "6",
    appId: "app2",
    appName: "Puzzle Master",
    os: "ios",
    storeKitRequestId: "req2",
    storeKitName: "iOS 17 Launch",
    type: "app_icon",
    fileName: "ios_icon_1024.png",
    fileUrl: "/puzzle-app-icon.jpg",
    fileSize: "389 KB",
    dimensions: "1024 x 1024",
    uploadDate: "2024-01-10",
    uploaderId: "user1",
    uploaderName: "Nguyen Van A",
    thumbnailUrl: "/puzzle-app-icon.jpg",
  },
  {
    id: "7",
    appId: "app2",
    appName: "Puzzle Master",
    os: "ios",
    storeKitRequestId: "req2",
    storeKitName: "iOS 17 Launch",
    type: "screenshot",
    fileName: "ios_screenshot_1.png",
    fileUrl: "/puzzle-ios-screenshot.jpg",
    fileSize: "892 KB",
    dimensions: "1125 x 2436",
    uploadDate: "2024-01-09",
    uploaderId: "user2",
    uploaderName: "Tran Thi B",
    thumbnailUrl: "/puzzle-ios-screenshot.jpg",
  },
]

export default function AssetManagementPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedOS, setSelectedOS] = useState<OS>("android")
  const [selectedApp, setSelectedApp] = useState<string>("all")
  const [storeKitSearch, setStoreKitSearch] = useState("")
  const [dateRange, setDateRange] = useState({ from: "", to: "" })

  // Modals
  const [infoModalAsset, setInfoModalAsset] = useState<Asset | null>(null)
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null)
  const [videoModalAsset, setVideoModalAsset] = useState<Asset | null>(null)
  const [deleteAsset, setDeleteAsset] = useState<Asset | null>(null)
  const [zoomLevel, setZoomLevel] = useState(100)

  // Get unique apps
  const apps = Array.from(new Set(mockAssets.map((a) => ({ id: a.appId, name: a.appName }))))

  // Filter assets
  const filteredAssets = mockAssets.filter((asset) => {
    if (asset.os !== selectedOS) return false
    if (selectedApp !== "all" && asset.appId !== selectedApp) return false
    if (storeKitSearch && !asset.storeKitName.toLowerCase().includes(storeKitSearch.toLowerCase())) return false
    return true
  })

  // Get tabs based on OS
  const tabs =
    selectedOS === "android"
      ? [
          { value: "app_icon", label: "App Icon" },
          { value: "feature_graphic", label: "Feature Graphic" },
          { value: "screenshot", label: "Screenshots" },
          { value: "video", label: "Video" },
        ]
      : [
          { value: "app_icon", label: "App Icon" },
          { value: "screenshot", label: "Screenshots" },
          { value: "video", label: "Video" },
        ]

  const [activeTab, setActiveTab] = useState<AssetType>("app_icon")

  // Filter by active tab
  const tabFilteredAssets = filteredAssets.filter((asset) => asset.type === activeTab)

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url)
    alert("Đã sao chép link!")
  }

  const handleDelete = (asset: Asset) => {
    console.log("Deleting asset:", asset.id)
    setDeleteAsset(null)
    alert("Đã xóa asset khỏi thư viện!")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Asset Management</h1>
            <p className="text-gray-500 mt-1">Quản lý, lưu trữ hình ảnh & video dùng trong StoreKit</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={showFilters ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">App/Game</label>
                  <Select value={selectedApp} onValueChange={setSelectedApp}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn app" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      {apps.map((app) => (
                        <SelectItem key={app.id} value={app.id}>
                          {app.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">OS</label>
                  <div className="flex gap-2">
                    <Button
                      variant={selectedOS === "android" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setSelectedOS("android")}
                    >
                      Android
                    </Button>
                    <Button
                      variant={selectedOS === "ios" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setSelectedOS("ios")}
                    >
                      iOS
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">StoreKit Name</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Tìm kiếm..."
                      value={storeKitSearch}
                      onChange={(e) => setStoreKitSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex items-end gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => {
                      setSelectedApp("all")
                      setStoreKitSearch("")
                      setDateRange({ from: "", to: "" })
                    }}
                  >
                    Clear
                  </Button>
                  <Button className="flex-1">Apply</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dynamic Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as AssetType)}>
          <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-6">
              {/* Grid View */}
              {viewMode === "grid" ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                  {tabFilteredAssets.map((asset) => (
                    <Card
                      key={asset.id}
                      className="group relative overflow-hidden cursor-pointer hover:shadow-lg transition-all"
                      onClick={() => {
                        if (asset.type === "video") {
                          setVideoModalAsset(asset)
                        } else {
                          setPreviewAsset(asset)
                        }
                      }}
                    >
                      <CardContent className="p-0">
                        <div className="relative aspect-square">
                          <img
                            src={asset.thumbnailUrl || "/placeholder.svg"}
                            alt={asset.fileName}
                            className="w-full h-full object-cover"
                          />
                          {asset.type === "video" && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <Play className="h-12 w-12 text-white" />
                            </div>
                          )}

                          {/* Hover overlay with actions */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={(e) => {
                                e.stopPropagation()
                                if (asset.type === "video") {
                                  setVideoModalAsset(asset)
                                } else {
                                  setPreviewAsset(asset)
                                }
                              }}
                            >
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={(e) => {
                                e.stopPropagation()
                                window.open(asset.fileUrl, "_blank")
                              }}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleCopyLink(asset.fileUrl)
                              }}
                            >
                              <Link2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={(e) => {
                                e.stopPropagation()
                                setDeleteAsset(asset)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="p-2 flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-600 truncate">{asset.fileName}</p>
                            <p className="text-xs text-gray-400">{asset.dimensions}</p>
                          </div>
                          <button
                            className="flex-shrink-0 p-1 hover:bg-gray-100 rounded transition-colors"
                            onClick={(e) => {
                              e.stopPropagation()
                              setInfoModalAsset(asset)
                            }}
                          >
                            <Info className="h-4 w-4 text-gray-500" />
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                /* List View */
                <div className="space-y-2">
                  {tabFilteredAssets.map((asset) => (
                    <Card
                      key={asset.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => {
                        if (asset.type === "video") {
                          setVideoModalAsset(asset)
                        } else {
                          setPreviewAsset(asset)
                        }
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={asset.thumbnailUrl || "/placeholder.svg"}
                            alt={asset.fileName}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{asset.fileName}</p>
                            <p className="text-sm text-gray-500">{asset.storeKitName}</p>
                          </div>
                          <div className="text-sm text-gray-500">{asset.dimensions}</div>
                          <div className="text-sm text-gray-500">{asset.fileSize}</div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                setInfoModalAsset(asset)
                              }}
                            >
                              <Info className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                window.open(asset.fileUrl, "_blank")
                              }}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleCopyLink(asset.fileUrl)
                              }}
                            >
                              <Link2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                setDeleteAsset(asset)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {tabFilteredAssets.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">Không có asset nào</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Info Modal */}
      <Dialog open={!!infoModalAsset} onOpenChange={() => setInfoModalAsset(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thông tin Asset</DialogTitle>
          </DialogHeader>
          {infoModalAsset && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-500">Tên file:</div>
                <div className="font-medium">{infoModalAsset.fileName}</div>

                <div className="text-gray-500">Ngày upload:</div>
                <div className="font-medium">{infoModalAsset.uploadDate}</div>

                <div className="text-gray-500">Người upload:</div>
                <div className="font-medium">{infoModalAsset.uploaderName}</div>

                <div className="text-gray-500">StoreKit Request:</div>
                <div className="font-medium">{infoModalAsset.storeKitName}</div>

                <div className="text-gray-500">Kích thước file:</div>
                <div className="font-medium">{infoModalAsset.fileSize}</div>

                <div className="text-gray-500">Kích thước:</div>
                <div className="font-medium">{infoModalAsset.dimensions}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      <Dialog
        open={!!previewAsset}
        onOpenChange={() => {
          setPreviewAsset(null)
          setZoomLevel(100)
        }}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{previewAsset?.fileName}</DialogTitle>
          </DialogHeader>
          {previewAsset && (
            <div className="space-y-4">
              <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ minHeight: "400px" }}>
                <img
                  src={previewAsset.fileUrl || "/placeholder.svg"}
                  alt={previewAsset.fileName}
                  className="w-full h-full object-contain"
                  style={{ transform: `scale(${zoomLevel / 100})` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => setZoomLevel(Math.max(50, zoomLevel - 25))}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-600">{zoomLevel}%</span>
                  <Button size="sm" variant="outline" onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => window.open(previewAsset.fileUrl, "_blank")}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleCopyLink(previewAsset.fileUrl)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setDeleteAsset(previewAsset)
                      setPreviewAsset(null)
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Video Modal */}
      <Dialog open={!!videoModalAsset} onOpenChange={() => setVideoModalAsset(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Video Options</DialogTitle>
            <DialogDescription>Chọn hành động cho video</DialogDescription>
          </DialogHeader>
          {videoModalAsset && (
            <div className="space-y-4">
              <img
                src={videoModalAsset.thumbnailUrl || "/placeholder.svg"}
                alt={videoModalAsset.fileName}
                className="w-full rounded-lg"
              />
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => {
                    window.open(videoModalAsset.fileUrl, "_blank")
                  }}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Preview Video
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    handleCopyLink(videoModalAsset.fileUrl)
                  }}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteAsset} onOpenChange={() => setDeleteAsset(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>Xóa asset khỏi thư viện? (Không ảnh hưởng đến StoreKit Management)</DialogDescription>
          </DialogHeader>
          {deleteAsset && (
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Asset <strong>{deleteAsset.fileName}</strong> sẽ bị xóa vĩnh viễn khỏi thư viện.
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteAsset(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => handleDelete(deleteAsset!)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
