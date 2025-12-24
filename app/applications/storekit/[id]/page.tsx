"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ChevronLeft,
  Edit,
  Save,
  Eye,
  Clock,
  Calendar,
  User,
  Loader2,
  AlertCircle,
  History,
  ImageIcon,
  Video,
  Play,
  Download,
  ExternalLink,
  Info,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getStatusBadge } from "@/lib/storekit-utils"

const mockStoreKitData: Record<string, any> = {
  "1": {
    id: "1",
    // General Info
    app: "Fashion Show",
    appId: "1",
    storekitName: "Summer Collection Update",
    version: "v2.1",
    platform: "iOS",
    markets: ["US", "UK", "CA"],
    owner: "Cao Thanh Tú",

    // Default Metadata
    defaultShortDesc: "Discover the latest fashion trends and shop your favorite styles",
    defaultFullDesc:
      "Fashion Show is your ultimate fashion companion. Browse thousands of styles, get personalized recommendations, and shop the latest trends from top brands. Whether you're looking for casual wear, formal attire, or accessories, we've got you covered.",

    // Metadata by Market
    metadataByMarket: {
      US: {
        title: "Fashion Show - Style & Shopping",
        subtitle: "Your Personal Fashion Assistant",
        shortDesc: "Discover the latest fashion trends and shop your favorite styles",
        fullDesc:
          "Fashion Show is your ultimate fashion companion. Browse thousands of styles, get personalized recommendations, and shop the latest trends from top brands.",
        keywords: ["fashion", "style", "clothing", "shopping", "trendy"],
      },
      UK: {
        title: "Fashion Show - Style & Shopping UK",
        subtitle: "Your Personal Fashion Assistant",
        shortDesc: "Discover the latest fashion trends and shop your favourite styles",
        fullDesc:
          "Fashion Show is your ultimate fashion companion. Browse thousands of styles, get personalised recommendations.",
        keywords: ["fashion", "style", "clothing", "shopping", "trendy"],
      },
      CA: {
        title: "Fashion Show - Style & Shopping CA",
        subtitle: "Your Personal Fashion Assistant",
        shortDesc: "Discover the latest fashion trends and shop your favorite styles",
        fullDesc: "Fashion Show is your ultimate fashion companion for Canadian fashion lovers.",
        keywords: ["fashion", "style", "clothing", "shopping", "trendy"],
      },
    },

    assets: {
      appIcon: {
        url: "/fashion-app-icon.jpg",
        size: "1024×1024",
        format: "JPG",
      },
      featureBanner: null,
      screenshots: {
        iphone: [
          {
            id: "1",
            url: "/fashion-app-home-screen.jpg",
            caption: "Home Screen - Browse Collections",
          },
          {
            id: "2",
            url: "/fashion-app-product-listing.jpg",
            caption: "Product Listing",
          },
          {
            id: "3",
            url: "/fashion-app-product-detail.jpg",
            caption: "Product Detail View",
          },
          {
            id: "4",
            url: "/fashion-app-shopping-cart.jpg",
            caption: "Shopping Cart",
          },
          {
            id: "5",
            url: "/fashion-app-checkout.jpg",
            caption: "Checkout Process",
          },
        ],
        ipad: [
          {
            id: "6",
            url: "/fashion-app-home-screen.jpg",
            caption: "iPad Home Screen",
          },
        ],
      },
      appPreviewVideos: {
        iphone: [
          {
            id: "v1",
            url: "/videos/fashion-app-preview-iphone.mp4",
            caption: "App Preview - iPhone",
            duration: "25s",
            size: "12.5 MB",
          },
        ],
        ipad: [],
      },
      promoVideo: {
        applyToAll: true,
        defaultUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        perMarket: {},
        referenceFiles: [
          {
            id: "ref1",
            name: "fashion-promo-raw.mp4",
            size: "45.2 MB",
            uploadDate: "2025-01-10",
          },
        ],
      },
    },

    // Order Info
    sendOrderNow: true,
    designPIC: "Nguyễn Văn A",
    deadline: "2025-01-15",
    priority: "high",
    brief:
      "Cần thiết kế bộ ảnh cho Summer Collection với tone màu tươi sáng, năng động. Focus vào các sản phẩm mùa hè như váy, áo thun, sandals.",

    // Status & Timestamps
    status: "pending_lead_review",
    createdDate: "2025-01-10 09:00",
    updatedDate: "2025-01-12 14:30",

    editHistory: [
      {
        id: "v3",
        version: "v2.1",
        editedBy: "Cao Thanh Tú",
        editedDate: "2025-01-12 14:30",
        changes: "Cập nhật metadata cho UK market, thêm keywords mới",
        snapshot: {
          metadataByMarket: {
            UK: {
              title: "Fashion Show - Style & Shopping UK",
              subtitle: "Your Personal Fashion Assistant",
              shortDesc: "Discover the latest fashion trends and shop your favourite styles",
              fullDesc:
                "Fashion Show is your ultimate fashion companion. Browse thousands of styles, get personalised recommendations.",
              keywords: ["fashion", "style", "clothing", "shopping", "trendy"],
            },
          },
        },
      },
      {
        id: "v2",
        version: "v2.0",
        editedBy: "Cao Thanh Tú",
        editedDate: "2025-01-11 10:15",
        changes: "Thêm CA market, cập nhật brief cho Design",
        snapshot: {
          markets: ["US", "UK", "CA"],
          brief: "Cần thiết kế bộ ảnh cho Summer Collection với tone màu tươi sáng, năng động.",
        },
      },
      {
        id: "v1",
        version: "v1.0",
        editedBy: "Cao Thanh Tú",
        editedDate: "2025-01-10 09:00",
        changes: "Tạo StoreKit ban đầu",
        snapshot: {
          storekitName: "Summer Collection Update",
          version: "v2.1",
          markets: ["US", "UK"],
        },
      },
    ],
  },
}

const mockApps = [
  { id: "1", name: "Fashion Show", bundleId: "com.example.fashionshow", icon: "/fashion-app-icon.jpg" },
  { id: "2", name: "Puzzle Master", bundleId: "com.example.puzzlemaster", icon: "/puzzle-game-icon.png" },
  { id: "3", name: "Racing Game", bundleId: "com.example.racinggame", icon: "/racing-game-icon.png" },
]

export default function StoreKitDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode")

  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(mode === "edit")
  const [storekit, setStorekit] = useState<any>(null)
  const [selectedMarketTab, setSelectedMarketTab] = useState("US")
  const [selectedHistoryVersion, setSelectedHistoryVersion] = useState<any>(null)
  const [showHistoryDialog, setShowHistoryDialog] = useState(false)
  const [selectedImage, setSelectedImage] = useState<any>(null)
  const [showImageDialog, setShowImageDialog] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<any>(null)
  const [showVideoDialog, setShowVideoDialog] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<string>("iphone")

  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")

  const [isGeneralInfoExpanded, setIsGeneralInfoExpanded] = useState(true)
  const [isOverviewOpen, setIsOverviewOpen] = useState(false)
  const generalInfoRef = useRef<HTMLDivElement>(null)
  const [tabsBarTop, setTabsBarTop] = useState(180)

  useEffect(() => {
    const updateTabsBarTop = () => {
      if (generalInfoRef.current) {
        const rect = generalInfoRef.current.getBoundingClientRect()
        const headerHeight = 120 // Approximate header height
        const generalInfoHeight = rect.height
        setTabsBarTop(headerHeight + generalInfoHeight)
      }
    }

    updateTabsBarTop()

    const resizeObserver = new ResizeObserver(updateTabsBarTop)
    if (generalInfoRef.current) {
      resizeObserver.observe(generalInfoRef.current)
    }

    return () => resizeObserver.disconnect()
  }, [isGeneralInfoExpanded])

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      let foundStorekit = null

      // Try to find in mock data first
      if (mockStoreKitData[id]) {
        foundStorekit = mockStoreKitData[id]
        console.log("[v0] Found in mock data:", id)
      }

      // Try to find in localStorage
      if (!foundStorekit) {
        try {
          const storedItems = localStorage.getItem("storekit_items")
          console.log("[v0] localStorage raw data:", storedItems)

          if (storedItems) {
            const parsedItems = JSON.parse(storedItems)
            console.log("[v0] Parsed items count:", parsedItems.length)

            const item = parsedItems.find((item: any) => item.id === id)
            if (item) {
              console.log("[v0] Found in localStorage:", item.id)

              // Transform item to full structure
              const metadataByMarket: any = {}
              if (item.markets && item.markets.length > 0) {
                item.markets.forEach((market: string) => {
                  metadataByMarket[market] = {
                    title: item.defaultTitle || `${item.app} - ${market}`,
                    subtitle: item.platform === "iOS" ? "Your Personal Assistant" : "",
                    shortDesc: item.defaultShortDesc || "Mô tả ngắn cho app",
                    fullDesc: item.defaultFullDesc || "Mô tả đầy đủ về app, tính năng và lợi ích",
                    keywords: ["app", "mobile", "game", "entertainment", "utility"],
                  }
                })
              }

              const screenshotsStructure: any = { iphone: [], ipad: [] }
              if (item.screenshots && Array.isArray(item.screenshots)) {
                screenshotsStructure.iphone = item.screenshots.map((ss: any, idx: number) => ({
                  id: ss.id || `ss-${idx}`,
                  url: ss.url || ss,
                  caption: ss.caption || `Screenshot ${idx + 1}`,
                }))
              }

              const videosStructure: any = { iphone: [], ipad: [] }
              if (item.videos && Array.isArray(item.videos)) {
                videosStructure.iphone = item.videos.map((v: any, idx: number) => ({
                  id: v.id || `v-${idx}`,
                  url: v.url || v,
                  caption: v.caption || `Video ${idx + 1}`,
                  duration: v.duration || "30s",
                  size: v.size || "10 MB",
                }))
              }

              foundStorekit = {
                id: item.id,
                app: item.app,
                appId: item.appId || "1",
                storekitName: item.name,
                version: item.version,
                platform: item.platform,
                markets: item.markets || [],
                owner: item.owner,
                defaultTitle: item.defaultTitle || `${item.app} App`,
                defaultShortDesc: item.defaultShortDesc || "Mô tả ngắn mặc định cho app",
                defaultFullDesc: item.defaultFullDesc || "Mô tả đầy đủ mặc định về app",
                metadataByMarket: metadataByMarket,
                assets: {
                  appIcon: {
                    url: item.appIcon || "/placeholder.svg?height=80&width=80",
                    size: "1024×1024",
                    format: "JPG",
                  },
                  featureBanner:
                    item.platform === "Android"
                      ? {
                          url: item.featureBanner || "/placeholder.svg?height=500&width=1024",
                          size: "1024×500",
                          format: "PNG",
                        }
                      : null,
                  screenshots: screenshotsStructure,
                  appPreviewVideos: videosStructure,
                  promoVideo:
                    item.platform === "Android" || item.platform === "Both"
                      ? {
                          applyToAll: true,
                          defaultUrl: item.promoVideoUrl || "",
                          perMarket: {},
                          referenceFiles: [],
                        }
                      : null,
                },
                sendOrderNow: item.sendOrderNow || false,
                designPIC: item.designPIC || "",
                deadline: item.deadline || "",
                priority: item.priority || "normal",
                brief: item.brief || "",
                status: item.status,
                createdDate: item.createdDate,
                updatedDate: item.updatedDate,
                editHistory: item.editHistory || [
                  {
                    id: "v1",
                    version: item.version,
                    editedBy: item.owner,
                    editedDate: item.createdDate,
                    changes: "Tạo StoreKit ban đầu",
                    snapshot: { storekitName: item.name, version: item.version, markets: item.markets },
                  },
                ],
              }
            }
          }
        } catch (error) {
          console.error("[v0] Failed to load from localStorage:", error)
        }
      }

      // If still not found, create a generic mock data for this ID
      if (!foundStorekit) {
        console.log("[v0] Creating generic mock data for ID:", id)
        const app = mockApps[0] // Default to first app
        foundStorekit = {
          id: id,
          app: app.name,
          appId: app.id,
          storekitName: `StoreKit #${id}`,
          version: "v1.0",
          platform: "iOS",
          markets: ["US"],
          owner: "Admin User",
          defaultTitle: `${app.name} App`,
          defaultShortDesc: "Mô tả ngắn mặc định cho app này",
          defaultFullDesc:
            "Mô tả đầy đủ về app, các tính năng chính và lợi ích cho người dùng. App này cung cấp trải nghiệm tuyệt vời với giao diện thân thiện và nhiều tính năng hữu ích.",
          metadataByMarket: {
            US: {
              title: `${app.name} - US`,
              subtitle: "Your Personal Assistant",
              shortDesc: "Mô tả ngắn cho US market",
              fullDesc: "Mô tả đầy đủ cho US market với các tính năng và lợi ích",
              keywords: ["app", "mobile", "utility"],
            },
          },
          assets: {
            appIcon: {
              url: app.icon,
              size: "1024×1024",
              format: "JPG",
            },
            featureBanner: null,
            screenshots: {
              iphone: [
                { id: "1", url: "/mobile-app-interface.png", caption: "Home Screen" },
                { id: "2", url: "/app-features.png", caption: "Features" },
                { id: "3", url: "/fashion-app-product-listing.jpg", caption: "Product Listing" },
              ],
              ipad: [],
            },
            appPreviewVideos: {
              iphone: [
                {
                  id: "v1",
                  url: "/videos/fashion-app-preview-iphone.mp4",
                  caption: "App Preview - iPhone",
                  duration: "25s",
                  size: "12.5 MB",
                },
              ],
              ipad: [],
            },
            promoVideo: null,
          },
          sendOrderNow: true,
          designPIC: "Nguyễn Văn A",
          deadline: "2025-01-20",
          priority: "high",
          brief: "Cần thiết kế bộ ảnh cho app với tone màu tươi sáng, năng động.",
          status: "design_completed",
          designDeliverables: {
            appIcon: { url: app.icon, uploadedBy: "Nguyễn Văn A", uploadedDate: "2025-01-18 14:30" },
            screenshots: [
              { id: "1", url: "/mobile-app-interface.png", caption: "Home Screen" },
              { id: "2", url: "/app-features.png", caption: "Features" },
              { id: "3", url: "/fashion-app-product-listing.jpg", caption: "Product Listing" },
            ],
            videos: [
              {
                id: "v1",
                url: "/videos/fashion-app-preview-iphone.mp4",
                caption: "App Preview Video",
                duration: "25s",
              },
            ],
          },
          createdDate: new Date().toISOString().slice(0, 16).replace("T", " "),
          updatedDate: new Date().toISOString().slice(0, 16).replace("T", " "),
          editHistory: [
            {
              id: "v1",
              version: "v1.0",
              editedBy: "Admin User",
              editedDate: new Date().toISOString().slice(0, 16).replace("T", " "),
              changes: "Tạo StoreKit ban đầu",
              snapshot: { storekitName: `StoreKit #${id}`, version: "v1.0", markets: ["US"] },
            },
          ],
        }
      }

      console.log("[v0] Final storekit data:", foundStorekit)
      setStorekit(foundStorekit)
      if (foundStorekit?.markets?.length > 0) {
        setSelectedMarketTab(foundStorekit.markets[0])
      }
      setIsLoading(false)

      if (mode === "edit") {
        toast({
          title: "✏️ Chế độ chỉnh sửa",
          description: "Bạn có thể chỉnh sửa thông tin StoreKit ngay",
        })
      }
    }, 800)

    return () => clearTimeout(timer)
  }, [id, mode, toast])

  const handleEdit = () => {
    setIsEditing(true)
    toast({
      title: "✏️ Chế độ chỉnh sửa",
      description: "Bạn có thể chỉnh sửa thông tin StoreKit",
    })
  }

  const handleSave = () => {
    setIsEditing(false)
    toast({
      title: "💾 Đã lưu thay đổi",
      description: "Thông tin StoreKit đã được cập nhật",
    })
  }

  const handleViewHistory = (historyItem: any) => {
    setSelectedHistoryVersion(historyItem)
    setShowHistoryDialog(true)
  }

  const handleViewImage = (image: any) => {
    setSelectedImage(image)
    setShowImageDialog(true)
  }

  const handleViewVideo = (video: any) => {
    setSelectedVideo(video)
    setShowVideoDialog(true)
  }

  const handleApproveDesign = () => {
    setApproveDialogOpen(true)
  }

  const handleConfirmApprove = () => {
    const now = new Date()
    const currentDateTime = `${now.toISOString().split("T")[0]} ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`

    // Update storekit status to aso_testing
    const updatedStorekit = {
      ...storekit,
      status: "aso_testing",
      updatedDate: currentDateTime,
    }
    setStorekit(updatedStorekit)

    // Update localStorage
    try {
      const savedItems = localStorage.getItem("storekit_items")
      if (savedItems) {
        const parsedItems = JSON.parse(savedItems)
        const updatedItems = parsedItems.map((i: any) =>
          i.id === id
            ? {
                ...i,
                status: "aso_testing",
                updatedDate: currentDateTime,
              }
            : i,
        )
        localStorage.setItem("storekit_items", JSON.stringify(updatedItems))
      }
    } catch (error) {
      console.error("Failed to update localStorage:", error)
    }

    toast({
      title: (
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <span>Đã duyệt Design</span>
        </div>
      ),
      description: `StoreKit "${storekit.storekitName}" đã được duyệt và chuyển sang trạng thái "ASO Testing".`,
    })

    setApproveDialogOpen(false)
  }

  const handleRejectDesign = () => {
    setRejectionReason("")
    setRejectDialogOpen(true)
  }

  const handleConfirmReject = () => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Vui lòng nhập lý do",
        description: "Bạn cần nhập lý do từ chối để Design team biết cần chỉnh sửa gì.",
        variant: "destructive",
      })
      return
    }

    const now = new Date()
    const currentDateTime = `${now.toISOString().split("T")[0]} ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`

    // Update storekit status to need_redesign and save rejection reason
    const updatedStorekit = {
      ...storekit,
      status: "need_redesign",
      updatedDate: currentDateTime,
      rejectionReason: rejectionReason.trim(),
    }
    setStorekit(updatedStorekit)

    // Update localStorage
    try {
      const savedItems = localStorage.getItem("storekit_items")
      if (savedItems) {
        const parsedItems = JSON.parse(savedItems)
        const updatedItems = parsedItems.map((i: any) =>
          i.id === id
            ? {
                ...i,
                status: "need_redesign",
                updatedDate: currentDateTime,
                rejectionReason: rejectionReason.trim(),
              }
            : i,
        )
        localStorage.setItem("storekit_items", JSON.stringify(updatedItems))
      }
    } catch (error) {
      console.error("Failed to update localStorage:", error)
    }

    toast({
      title: (
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-orange-600" />
          <span>Đã yêu cầu chỉnh sửa</span>
        </div>
      ),
      description: `StoreKit "${storekit.storekitName}" đã được chuyển về trạng thái "Need Redesign" với lý do: "${rejectionReason.trim()}".`,
    })

    setRejectDialogOpen(false)
    setRejectionReason("")
  }

  const getYouTubeVideoId = (url: string): string | null => {
    const patterns = [/youtube\.com\/watch\?v=([\w-]+)/, /youtu\.be\/([\w-]+)/, /youtube\.com\/shorts\/([\w-]+)/]
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="flex justify-center">
              <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Đang tải...</h2>
              <p className="text-gray-500 dark:text-gray-400">Vui lòng đợi trong giây lát</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!storekit) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">StoreKit không tồn tại</h2>
              <p className="text-gray-500 dark:text-gray-400">StoreKit với ID "{id}" không tồn tại hoặc đã bị xóa.</p>
            </div>
            <Button asChild className="w-full">
              <Link href="/applications/storekit">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Quay lại danh sách
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const app = mockApps.find((a) => a.id === storekit.appId)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header - Sticky */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-20">
        <div className="px-6 py-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/applications" className="hover:text-foreground transition-colors">
              Applications
            </Link>
            <span>/</span>
            <span>ASO</span>
            <span>/</span>
            <Link href="/applications/storekit" className="hover:text-foreground transition-colors">
              StoreKit
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">{storekit.storekitName}</span>
          </div>

          {/* Header Actions */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{storekit.storekitName}</h1>
                <Badge variant="outline" className="font-mono text-xs">
                  {storekit.version}
                </Badge>
                {getStatusBadge(storekit.status)}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Tạo: {storekit.createdDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Cập nhật: {storekit.updatedDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{storekit.owner}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setIsOverviewOpen(true)}>
                <Info className="h-4 w-4 mr-2" />
                Overview
              </Button>
              <Button variant="outline" asChild>
                <Link href="/applications/storekit">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Quay lại
                </Link>
              </Button>
              {!isEditing ? (
                <Button onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Chỉnh sửa
                </Button>
              ) : (
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Lưu thay đổi
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* General Info Section (Updated) */}
      <div ref={generalInfoRef} className="sticky top-[120px] z-20">
        <Card className="rounded-none border-x-0 border-t-0 border-b-0 shadow-sm">
          <CardHeader className="px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <img
                    src={app?.icon || "/placeholder.svg?height=40&width=40"}
                    alt={storekit.app}
                    className="h-10 w-10 rounded-lg border object-cover"
                  />
                  <div>
                    <h3 className="text-sm font-semibold">{storekit.app}</h3>
                    <p className="text-xs text-muted-foreground">{storekit.storekitName}</p>
                  </div>
                </div>
                <Separator orientation="vertical" className="h-8" />
                <div className="flex items-center gap-3 text-xs">
                  <Badge variant="outline" className="font-mono">
                    {storekit.version}
                  </Badge>
                  <Badge variant="secondary">{storekit.platform}</Badge>
                  <div className="flex items-center gap-1">
                    {storekit.markets.map((market: string) => (
                      <Badge key={market} variant="outline" className="text-xs">
                        {market}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                <span>{storekit.owner}</span>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      <div
        className="sticky z-10 bg-background/95 backdrop-blur-sm border-b -mt-px transition-all duration-200 shadow-sm"
        style={{ top: `${tabsBarTop}px` }}
      >
        <div className="px-6 py-4">
          <div className="space-y-4">
            {/* Market Tabs Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Default Tab */}
              <button
                onClick={() => setSelectedMarketTab("default")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedMarketTab === "default"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                Default
              </button>

              {/* Market Tabs */}
              {storekit.markets.map((market: string) => (
                <button
                  key={market}
                  onClick={() => setSelectedMarketTab(market)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedMarketTab === market
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {market}
                </button>
              ))}
            </div>

            {/* Active Tab Indicator */}
            <div className="text-sm text-muted-foreground">
              Đang xem:{" "}
              <span className="font-medium text-foreground">
                {selectedMarketTab === "default"
                  ? "Default (áp dụng cho tất cả markets)"
                  : `Market: ${selectedMarketTab}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6" style={{ scrollMarginTop: `${tabsBarTop + 80}px` }}>
          {/* Left Column - Main Content (4/10 width = 40%) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Default Metadata or Market-specific Metadata */}
            <Card style={{ scrollMarginTop: `${tabsBarTop + 80}px` }}>
              <CardHeader>
                <CardTitle>
                  {selectedMarketTab === "default" ? "Default Metadata" : `Metadata - ${selectedMarketTab}`}
                </CardTitle>
                <CardDescription>
                  {selectedMarketTab === "default"
                    ? "Metadata mặc định áp dụng cho tất cả markets"
                    : "Metadata cho market này"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedMarketTab === "default" ? (
                  <>
                    <div className="space-y-2">
                      <Label>App Title</Label>
                      <Input value={storekit.defaultTitle} disabled={!isEditing} />
                    </div>
                    <div className="space-y-2">
                      <Label>Short Description</Label>
                      <Textarea value={storekit.defaultShortDesc} disabled={!isEditing} rows={3} />
                    </div>
                    <div className="space-y-2">
                      <Label>Full Description</Label>
                      <Textarea value={storekit.defaultFullDesc} disabled={!isEditing} rows={6} />
                    </div>
                  </>
                ) : (
                  storekit.metadataByMarket[selectedMarketTab] && (
                    <>
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input value={storekit.metadataByMarket[selectedMarketTab].title} disabled={!isEditing} />
                      </div>
                      {storekit.platform === "iOS" && (
                        <div className="space-y-2">
                          <Label>Subtitle</Label>
                          <Input value={storekit.metadataByMarket[selectedMarketTab].subtitle} disabled={!isEditing} />
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label>Short Description</Label>
                        <Textarea
                          value={storekit.metadataByMarket[selectedMarketTab].shortDesc}
                          disabled={!isEditing}
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Full Description</Label>
                        <Textarea
                          value={storekit.metadataByMarket[selectedMarketTab].fullDesc}
                          disabled={!isEditing}
                          rows={6}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Keywords</Label>
                        <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-muted">
                          {storekit.metadataByMarket[selectedMarketTab].keywords.map((keyword: string, idx: number) => (
                            <Badge key={idx} variant="outline">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )
                )}
              </CardContent>
            </Card>

            {storekit.status === "design_completed" && (
              <Card style={{ scrollMarginTop: `${tabsBarTop + 80}px` }}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Design Deliverables</CardTitle>
                      <CardDescription>Hình ảnh và assets Design team đã gửi</CardDescription>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                    >
                      Chờ ASO duyệt
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Design Uploaded Assets */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">Assets đã hoàn thành</Label>

                    {/* App Icon */}
                    {storekit.designDeliverables?.appIcon && (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground font-medium">App Icon</p>
                        <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
                          <img
                            src={storekit.designDeliverables.appIcon.url || "/placeholder.svg?height=80&width=80"}
                            alt="App Icon"
                            className="h-20 w-20 rounded-xl border-2 object-cover cursor-pointer hover:scale-105 transition-transform"
                            onClick={() =>
                              handleViewImage({ url: storekit.designDeliverables.appIcon.url, caption: "App Icon" })
                            }
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium">App Icon</p>
                            <p className="text-xs text-muted-foreground">
                              Uploaded by: {storekit.designDeliverables.appIcon.uploadedBy} on{" "}
                              {storekit.designDeliverables.appIcon.uploadedDate}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Screenshots */}
                    {storekit.designDeliverables?.screenshots && (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground font-medium">Screenshots</p>
                        <div className="grid grid-cols-3 gap-2">
                          {storekit.designDeliverables.screenshots.slice(0, 6).map((screenshot: any) => (
                            <div
                              key={screenshot.id}
                              className="group relative aspect-[9/16] rounded-lg border overflow-hidden cursor-pointer hover:shadow-lg transition-all"
                              onClick={() => handleViewImage(screenshot)}
                            >
                              <img
                                src={screenshot.url || "/placeholder.svg"}
                                alt={screenshot.caption}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                <Eye className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Videos */}
                    {storekit.designDeliverables?.videos && storekit.designDeliverables.videos.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground font-medium">Preview Videos</p>
                        <div className="space-y-2">
                          {storekit.designDeliverables.videos.slice(0, 3).map((video: any) => (
                            <div
                              key={video.id}
                              className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                              onClick={() => handleViewVideo(video)}
                            >
                              <div className="relative w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center group">
                                <Play className="h-6 w-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{video.caption || `Video ${video.id}`}</p>
                                <p className="text-xs text-muted-foreground">{video.duration}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Approval Actions */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">Duyệt Design</Label>
                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-start gap-2 mb-3">
                        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800 dark:text-blue-200">
                          <p className="font-semibold mb-1">Hướng dẫn:</p>
                          <ul className="list-disc list-inside space-y-1 text-xs">
                            <li>Xem kỹ tất cả assets Design đã gửi</li>
                            <li>Nếu đạt yêu cầu, click "Duyệt" để chuyển sang ASO Testing</li>
                            <li>Nếu cần chỉnh sửa, click "Không Duyệt" và nhập lý do cụ thể</li>
                          </ul>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button onClick={handleApproveDesign} className="flex-1 bg-green-600 hover:bg-green-700">
                          <ThumbsUp className="h-4 w-4 mr-2" />
                          Duyệt
                        </Button>
                        <Button
                          onClick={handleRejectDesign}
                          variant="outline"
                          className="flex-1 border-orange-600 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950 bg-transparent"
                        >
                          <ThumbsDown className="h-4 w-4 mr-2" />
                          Không Duyệt
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Graphics & Assets */}
            <Card style={{ scrollMarginTop: `${tabsBarTop + 80}px` }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Graphics & Assets</CardTitle>
                    <CardDescription>Tất cả assets và media của StoreKit</CardDescription>
                  </div>
                  <ImageIcon className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* App Icon */}
                {storekit.assets?.appIcon && (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">App Icon</Label>
                    <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
                      <img
                        src={storekit.assets.appIcon.url || "/placeholder.svg?height=80&width=80"}
                        alt="App Icon"
                        className="h-20 w-20 rounded-xl border-2 object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">App Icon</p>
                        <p className="text-xs text-muted-foreground">
                          {storekit.assets.appIcon.size} • {storekit.assets.appIcon.format}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Tải xuống
                      </Button>
                    </div>
                  </div>
                )}

                {/* Screenshots */}
                {storekit.assets?.screenshots && (
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">Screenshots</Label>
                    <div className="flex items-center gap-2 flex-wrap">
                      {Object.keys(storekit.assets.screenshots).map((device) => (
                        <Button
                          key={device}
                          variant={selectedDevice === device ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedDevice(device)}
                        >
                          {device.charAt(0).toUpperCase() + device.slice(1)} (
                          {storekit.assets.screenshots[device]?.length || 0})
                        </Button>
                      ))}
                    </div>

                    {storekit.assets.screenshots[selectedDevice] &&
                    storekit.assets.screenshots[selectedDevice].length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {storekit.assets.screenshots[selectedDevice].map((screenshot: any) => (
                          <div
                            key={screenshot.id}
                            className="group relative aspect-[9/16] rounded-lg border overflow-hidden cursor-pointer hover:shadow-lg transition-all"
                            onClick={() => handleViewImage(screenshot)}
                          >
                            <img
                              src={screenshot.url || "/placeholder.svg"}
                              alt={screenshot.caption}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                              <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            {screenshot.caption && (
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                                <p className="text-white text-xs font-medium truncate">{screenshot.caption}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground border rounded-lg">
                        <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Chưa có screenshots cho {selectedDevice}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Videos */}
                {(storekit.platform === "iOS" || storekit.platform === "Both") && storekit.assets?.appPreviewVideos && (
                  <div className="space-y-3 pt-4 border-t">
                    <Label className="text-sm font-semibold flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      App Preview Videos
                    </Label>
                    {/* Device Tabs for Videos */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {Object.keys(storekit.assets.appPreviewVideos).map((device) => (
                        <Button
                          key={device}
                          variant={selectedDevice === device ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedDevice(device)}
                        >
                          {device.charAt(0).toUpperCase() + device.slice(1)} (
                          {storekit.assets.appPreviewVideos[device]?.length || 0})
                        </Button>
                      ))}
                    </div>

                    {storekit.assets.appPreviewVideos[selectedDevice] &&
                    storekit.assets.appPreviewVideos[selectedDevice].length > 0 ? (
                      <div className="space-y-2">
                        {storekit.assets.appPreviewVideos[selectedDevice].map((video: any) => (
                          <div
                            key={video.id}
                            className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                          >
                            <div className="relative w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center cursor-pointer group">
                              <Play className="h-8 w-8 text-gray-600 group-hover:text-blue-600 transition-colors" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">{video.caption || "App Preview Video"}</p>
                              <p className="text-xs text-muted-foreground">
                                {video.duration} • {video.size}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm" onClick={() => handleViewVideo(video)}>
                                <Play className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground border rounded-lg">
                        <Video className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Chưa có preview videos cho {selectedDevice}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Promo Video (Android) */}
                {(storekit.platform === "Android" || storekit.platform === "Both") && storekit.assets?.promoVideo && (
                  <div className="space-y-3 pt-4 border-t">
                    <Label className="text-sm font-semibold flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      Promo Video (YouTube)
                    </Label>
                    {storekit.assets.promoVideo.defaultUrl && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium mb-1">YouTube URL</p>
                            <a
                              href={storekit.assets.promoVideo.defaultUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline flex items-center gap-1 truncate"
                            >
                              {storekit.assets.promoVideo.defaultUrl}
                              <ExternalLink className="h-3 w-3 flex-shrink-0" />
                            </a>
                          </div>
                        </div>
                        <div className="relative w-full aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                          <iframe
                            src={`https://www.youtube.com/embed/${getYouTubeVideoId(storekit.assets.promoVideo.defaultUrl)}`}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {storekit.assets.promoVideo.applyToAll ? (
                            <Badge variant="secondary" className="text-xs">
                              Áp dụng cho tất cả markets
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              Khác nhau theo market
                            </Badge>
                          )}
                        </div>
                        {!storekit.assets.promoVideo.applyToAll &&
                          Object.keys(storekit.assets.promoVideo.perMarket).length > 0 && (
                            <div className="space-y-2 pt-2 border-t">
                              <Label className="text-xs font-semibold">YouTube URL theo Market</Label>
                              {Object.entries(storekit.assets.promoVideo.perMarket).map(([market, url]) => (
                                <div key={market} className="flex items-center gap-2 text-xs">
                                  <Badge variant="secondary" className="w-12 justify-center">
                                    {market}
                                  </Badge>
                                  <a
                                    href={url as string}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline flex items-center gap-1 truncate flex-1"
                                  >
                                    {url as string}
                                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                                  </a>
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    )}
                    {storekit.assets.promoVideo.referenceFiles &&
                      storekit.assets.promoVideo.referenceFiles.length > 0 && (
                        <div className="space-y-2 pt-2 border-t">
                          <Label className="text-xs font-semibold">Reference Files (Nội bộ)</Label>
                          <div className="space-y-2">
                            {storekit.assets.promoVideo.referenceFiles.map((file: any) => (
                              <div key={file.id} className="flex items-center gap-2 p-2 border rounded-lg bg-muted/50">
                                <Video className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium truncate">{file.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {file.size} • {file.uploadDate}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button variant="ghost" size="sm" title="Preview">
                                    <Play className="h-3 w-3" />
                                  </Button>
                                  <Button variant="ghost" size="sm" title="Download">
                                    <Download className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Information */}
            {storekit.sendOrderNow && (
              <Card style={{ scrollMarginTop: `${tabsBarTop + 80}px` }}>
                <CardHeader>
                  <CardTitle>Thông tin Order</CardTitle>
                  <CardDescription>Thông tin gửi Design Team</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Design PIC</Label>
                      <Input value={storekit.designPIC} disabled={!isEditing} />
                    </div>
                    <div className="space-y-2">
                      <Label>Deadline</Label>
                      <Input type="date" value={storekit.deadline} disabled={!isEditing} />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label>Priority</Label>
                      <Select value={storekit.priority} disabled={!isEditing}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label>Brief</Label>
                      <Textarea value={storekit.brief} disabled={!isEditing} rows={6} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Status & History (6/10 width = 60%) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle>Trạng thái</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Trạng thái hiện tại</Label>
                  {getStatusBadge(storekit.status)}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Ngày tạo:</span>
                  </div>
                  <p className="text-sm font-medium">{storekit.createdDate}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Cập nhật lần cuối:</span>
                  </div>
                  <p className="text-sm font-medium">{storekit.updatedDate}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Owner:</span>
                  </div>
                  <p className="text-sm font-medium">{storekit.owner}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Lịch sử chỉnh sửa</CardTitle>
                    <CardDescription>{storekit.editHistory.length} phiên bản</CardDescription>
                  </div>
                  <History className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-3">
                    {storekit.editHistory.map((history: any, idx: number) => (
                      <div key={history.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs font-mono">
                                {history.version}
                              </Badge>
                              {idx === 0 && (
                                <Badge variant="default" className="text-xs">
                                  Hiện tại
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm font-medium">{history.changes}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleViewHistory(history)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{history.editedBy}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{history.editedDate}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={isOverviewOpen} onOpenChange={setIsOverviewOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>StoreKit Overview</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Thông tin tổng quan</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">App:</span>
                  <p className="font-medium">{storekit.app}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Version:</span>
                  <p className="font-medium">{storekit.version}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Platform:</span>
                  <p className="font-medium">{storekit.platform}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Markets:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {storekit.markets.map((market: string) => (
                      <Badge key={market} variant="secondary" className="text-xs">
                        {market}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Owner:</span>
                  <p className="font-medium">{storekit.owner}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <div className="mt-1">{getStatusBadge(storekit.status)}</div>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-3">Assets Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="flex flex-col items-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <ImageIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-1" />
                  <div className="text-lg font-bold text-blue-700 dark:text-blue-300">
                    {storekit.assets?.appIcon ? 1 : 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Icon</div>
                </div>
                <div className="flex flex-col items-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <ImageIcon className="h-6 w-6 text-green-600 dark:text-green-400 mb-1" />
                  <div className="text-lg font-bold text-green-700 dark:text-green-300">
                    {Object.values(storekit.assets?.screenshots || {}).reduce(
                      (acc: number, arr: any) => acc + (arr?.length || 0),
                      0,
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">Screenshots</div>
                </div>
                <div className="flex flex-col items-center p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <Video className="h-6 w-6 text-purple-600 dark:text-purple-400 mb-1" />
                  <div className="text-lg font-bold text-purple-700 dark:text-purple-300">
                    {Object.values(storekit.assets?.appPreviewVideos || {}).reduce(
                      (acc: number, arr: any) => acc + (arr?.length || 0),
                      0,
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">Videos</div>
                </div>
                <div className="flex flex-col items-center p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                  <ImageIcon className="h-6 w-6 text-orange-600 dark:text-orange-400 mb-1" />
                  <div className="text-lg font-bold text-orange-700 dark:text-orange-300">
                    {storekit.assets?.featureBanner ? 1 : 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Banner</div>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-3">Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Created</div>
                    <div className="text-sm text-muted-foreground">{storekit.createdDate}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Last Updated</div>
                    <div className="text-sm text-muted-foreground">{storekit.updatedDate}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog để xem hình ảnh full size */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedImage?.caption}</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="space-y-4">
              <div className="relative aspect-[9/16] max-h-[70vh] mx-auto rounded-lg border overflow-hidden">
                <img
                  src={selectedImage.url || "/placeholder.svg"}
                  alt={selectedImage.caption}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">{selectedImage.caption}</p>
                  <p className="text-sm text-muted-foreground">Device: {selectedDevice}</p>
                </div>
                <Badge variant="outline">{selectedDevice}</Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showVideoDialog} onOpenChange={setShowVideoDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedVideo?.caption || "App Preview Video"}</DialogTitle>
          </DialogHeader>
          {selectedVideo && (
            <div className="space-y-4">
              <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                <video src={selectedVideo.url} controls className="w-full h-full">
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">{selectedVideo.caption || "App Preview Video"}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedVideo.duration} • {selectedVideo.size}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Tải xuống
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Xem phiên bản: {selectedHistoryVersion?.version}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            {selectedHistoryVersion && (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Phiên bản:</span>
                      <p className="font-medium">{selectedHistoryVersion.version}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Ngày chỉnh sửa:</span>
                      <p className="font-medium">{selectedHistoryVersion.editedDate}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Người chỉnh sửa:</span>
                      <p className="font-medium">{selectedHistoryVersion.editedBy}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Thay đổi:</span>
                      <p className="font-medium">{selectedHistoryVersion.changes}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3">Snapshot dữ liệu</h4>
                  <pre className="p-4 bg-muted rounded-lg text-xs overflow-auto">
                    {JSON.stringify(selectedHistoryVersion.snapshot, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ThumbsUp className="h-5 w-5 text-green-600" />
              Xác nhận Duyệt Design
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Bạn có chắc chắn muốn duyệt Design cho StoreKit <strong>"{storekit?.storekitName}"</strong>?
            </p>
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-semibold mb-1">Sau khi duyệt:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>StoreKit sẽ chuyển sang trạng thái "ASO Testing"</li>
                    <li>ASO team có thể bắt đầu test và điền thông tin</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setApproveDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleConfirmApprove} className="bg-green-600 hover:bg-green-700">
              <ThumbsUp className="h-4 w-4 mr-2" />
              Xác nhận Duyệt
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ThumbsDown className="h-5 w-5 text-orange-600" />
              Không Duyệt Design
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Vui lòng nhập lý do tại sao Design của StoreKit <strong>"{storekit?.storekitName}"</strong> cần được chỉnh
              sửa lại:
            </p>
            <div>
              <label className="text-sm font-medium mb-2 block">Lý do từ chối *</label>
              <Textarea
                placeholder="Ví dụ: Icon không rõ nét, màu sắc không phù hợp với brand, screenshot thiếu text..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
            <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-orange-800 dark:text-orange-200">
                  <p className="font-semibold mb-1">Sau khi từ chối:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>StoreKit sẽ chuyển về trạng thái "Need Redesign"</li>
                    <li>Design team sẽ nhận được lý do và chỉnh sửa lại</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleConfirmReject} className="bg-orange-600 hover:bg-orange-700">
              <ThumbsDown className="h-4 w-4 mr-2" />
              Xác nhận Không Duyệt
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
