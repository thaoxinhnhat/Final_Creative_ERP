"use client"

import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  ArrowLeft,
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Copy,
  Download,
  Eye,
  FolderOpen,
  GripVertical,
  Image as ImageIcon,
  Info,
  Palette,
  Pencil,
  Play,
  Plus,
  Send,
  Trash2,
  Upload,
  Video,
  X,
} from "lucide-react"
// CHANGE: Add new state for design order modal sections
interface ScreenshotSpec {
  id: string
  description: string // Thay thế: textOverlay, layoutDescription, stylingNotes, propsBackground, modelRequirements, priorityNotes
  // </CHANGE>
  referenceImages: Array<{ id: string; url: string; name: string }>
}

interface BannerSpec {
  id: string
  dimensions: string // Cho phép user chọn hoặc nhập size
  description: string
  referenceImages: Array<{ id: string; url: string; name: string }> // Thay đổi từ File[] sang array với id, url, name
}

// CHANGE: Add new interface for uploaded files in design order
interface UploadedFile {
  id: string
  name: string
  url?: string // For asset library files
  size: number
}
// </CHANGE>

// CHANGE: Add mockApps data at the top of the file for app selection
const mockApps = [
  { id: "1", name: "Fashion Show", bundleId: "com.example.fashionshow", icon: "/fashion-app-icon.jpg" },
  { id: "2", name: "Puzzle Master", bundleId: "com.example.puzzlemaster", icon: "/puzzle-game-icon.png" },
  { id: "3", name: "Racing Game", bundleId: "com.example.racinggame", icon: "/racing-game-icon.png" },
]

// Mock data cho ASO team members
const asoTeamMembers = [
  { id: "1", name: "Cao Thanh Tú", email: "tu.cao@example.com" },
  { id: "2", name: "Nguyễn Văn B", email: "b.nguyen@example.com" },
  { id: "3", name: "Trần Thị C", email: "c.tran@example.com" },
]

// Mock data cho Design team members
const designTeamMembers = [
  { id: "1", name: "Nguyễn Văn A", email: "a.nguyen@example.com" },
  { id: "2", name: "Lê Thị D", email: "d.le@example.com" },
  { id: "3", name: "Phạm Văn E", email: "e.pham@example.com" },
]

// Mock data cho metadata versions
const metadataVersions = [
  { id: "1", version: "v2.0", market: "US", date: "2025-01-10", status: "active" },
  { id: "2", version: "v1.9", market: "US", date: "2025-01-05", status: "archived" },
  { id: "3", version: "v1.8", market: "US", date: "2024-12-20", status: "archived" },
]

// Mock assets data (sẽ fetch từ API thực tế)
const mockAssetsForLibrary = [
  {
    id: "1",
    type: "app_icon" as const,
    fileName: "icon_1024.png",
    thumbnailUrl: "/generic-app-icon.png",
    fileUrl: "/placeholder.svg",
    dimensions: "1024x1024",
    fileSize: "2.5 MB",
    uploadDate: "2024-01-15",
    storeKitName: "StoreKit v1.0",
  },
  {
    id: "2",
    type: "feature_graphic" as const,
    fileName: "feature_banner.png",
    thumbnailUrl: "/feature-graphic.jpg",
    fileUrl: "/placeholder.svg",
    dimensions: "1024x500",
    fileSize: "1.8 MB",
    uploadDate: "2024-01-16",
    storeKitName: "StoreKit v1.0",
  },
  {
    id: "3",
    type: "screenshot" as const,
    fileName: "screenshot_1.png",
    thumbnailUrl: "/mobile-app-interface.png",
    fileUrl: "/placeholder.svg",
    dimensions: "1242x2688",
    fileSize: "3.2 MB",
    uploadDate: "2024-01-17",
    storeKitName: "StoreKit v1.0",
    deviceType: "iPhone 13 Pro Max",
  },
  {
    id: "4",
    type: "video" as const,
    fileName: "promo_video.mp4",
    thumbnailUrl: "/video-thumbnail.png",
    fileUrl: "https://youtube.com/watch?v=example",
    dimensions: "1920x1080",
    fileSize: "25 MB",
    uploadDate: "2024-01-18",
    storeKitName: "StoreKit v1.0",
  },
]

export default function StorekitCreatePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // State để track context khi mở Asset Library từ Design Order
  const [designOrderAssetContext, setDesignOrderAssetContext] = useState<{
    type: "campaign" | "appicon" | "banner" | "screenshot" | "tablet" | "video" | "other"
    specId?: string
    specIndex?: number
  } | null>(null)

  const [assetLibraryActiveTab, setAssetLibraryActiveTab] = useState<
    "app_icon" | "feature_graphic" | "screenshot" | "video"
  >("app_icon")
  const [assetLibrarySelectedApp, setAssetLibrarySelectedApp] = useState<string>("app1")
  // </CHANGE>
  const [assetLibraryDateRange, setAssetLibraryDateRange] = useState({ from: "", to: "" })
  const [assetLibraryStoreKitSearch, setAssetLibraryStoreKitSearch] = useState("")

  // ============================================
  // ALL STATE DECLARATIONS FIRST
  // ============================================

  // Form states
  const [selectedAppId, setSelectedAppId] = useState("")
  const [storekitName, setStorekitName] = useState("")
  const [version, setVersion] = useState("")
  const [platform, setPlatform] = useState("")
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>([])
  const [owner, setOwner] = useState("")

  const [activeMarketTab, setActiveMarketTab] = useState<string>("default")
  const [isGeneralInfoExpanded, setIsGeneralInfoExpanded] = useState(true) // State for General Info expansion
  const [tabsBarTop, setTabsBarTop] = useState(0) // State for sticky tabs bar position
  const [marketsOpen, setMarketsOpen] = useState(false) // State for market multi-select dropdown

  // Default Metadata states
  const [defaultTitle, setDefaultTitle] = useState("") // Added default title state
  const [defaultShortDesc, setDefaultShortDesc] = useState("")
  const [defaultFullDesc, setDefaultFullDesc] = useState("")
  const [applyToMarkets, setApplyToMarkets] = useState(true)

  // Metadata states
  const [metadataByMarket, setMetadataByMarket] = useState<Record<string, any>>({})
  const [dataByMarket, setDataByMarket] = useState<Record<string, any>>({}) // State for market-specific overrides
  const [activeMetadataTab, setActiveMetadataTab] = useState("US")

  // Assets states
  const [appIcon, setAppIcon] = useState<File | null>(null)
  const [featureBanner, setFeatureBanner] = useState<File | null>(null)
  const [screenshots, setScreenshots] = useState<Record<string, Array<{ file: File | null; caption: string }>>>({})

  const [appPreviewVideos, setAppPreviewVideos] = useState<
    Record<string, Array<{ file: File | null; caption: string; duration: string; size: string }>>
  >({
    iphone: [],
    ipad: [],
  })

  // Promo Video states
  const [promoVideoUrl, setPromoVideoUrl] = useState("")
  const [promoVideoValid, setPromoVideoValid] = useState<boolean | null>(null)
  const [promoVideoApplyToAll, setPromoVideoApplyToAll] = useState(true)
  const [promoVideoPerMarket, setPromoVideoPerMarket] = useState<Record<string, string>>({})
  const [promoVideoReferenceFiles, setPromoVideoReferenceFiles] = useState<File[]>([])

  // Order states
  const [sendOrderNow, setSendOrderNow] = useState(false)
  const [isAssetLibraryOpen, setIsAssetLibraryOpen] = useState(false)
  const [assetLibraryContext, setAssetLibraryContext] = useState<{
    type:
      | "campaign"
      | "screenshot"
      | "banner"
      | "screenshot-tablet"
      | "appicon"
      | "video"
      | "app_icon"
      | "feature_graphic"
    targetId?: string
  } | null>(null)
  const [selectedAssets, setSelectedAssets] = useState<string[]>([])
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false)
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false)
  const [isSaveDraftConfirmOpen, setIsSaveDraftConfirmOpen] = useState(false)
  const [orderSentSuccessfully, setOrderSentSuccessfully] = useState(false)
  const [sentOrderData, setSentOrderData] = useState<any>(null)
  const [isSendOrderConfirmOpen, setIsSendOrderConfirmOpen] = useState(false)
  // </CHANGE>

  // Design Order states
  const [isDesignOrderDialogOpen, setIsDesignOrderDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastAutoSaved, setLastAutoSaved] = useState<Date | null>(null)
  const [isViewMode, setIsViewMode] = useState(true) // true = xem, false = edit
  const [editCountByMarket, setEditCountByMarket] = useState<Record<string, number>>({}) // Đếm số lần edit
  const [editHistoryByMarket, setEditHistoryByMarket] = useState<Record<string, any[]>>({}) // Lịch sử edit
  const [originalOrderData, setOriginalOrderData] = useState<any>(null) // Data gốc để so sánh
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false) // Popup xác nhận hủy
  const [showSaveConfirm, setShowSaveConfirm] = useState(false) // Popup xác nhận lưu
  // </CHANGE>

  const [appIconByMarket, setAppIconByMarket] = useState<Record<string, File | null>>({})
  const [featureBannerByMarket, setFeatureBannerByMarket] = useState<Record<string, File | null>>({})
  const [screenshotsByMarket, setScreenshotsByMarket] = useState<
    Record<string, Record<string, Array<{ file: File | null; caption: string }>>>
  >({})
  const [appPreviewVideosByMarket, setAppPreviewVideosByMarket] = useState<
    Record<string, Record<string, Array<{ file: File | null; caption: string; duration: string; size: string }>>>
  >({})
  // </CHANGE>

  // Per-market states for design order
  const [designPICByMarket, setDesignPICByMarket] = useState<Record<string, string>>({})
  const [deadlineByMarket, setDeadlineByMarket] = useState<Record<string, string>>({})
  const [priorityByMarket, setPriorityByMarket] = useState<Record<string, "normal" | "high" | "urgent">>({})
  const [briefByMarket, setBriefByMarket] = useState<Record<string, string>>({})
  const [attachmentsByMarket, setAttachmentsByMarket] = useState<Record<string, File[]>>({})
  const [designOrderSentByMarket, setDesignOrderSentByMarket] = useState<Record<string, boolean>>({}) // Track sent status per market

  // CHANGE: Add per-market states for tablet screenshots and banner specs
  const [tabletScreenshotSpecs, setTabletScreenshotSpecs] = useState<Record<string, ScreenshotSpec[]>>({})
  const [bannerSpecs, setBannerSpecs] = useState<Record<string, BannerSpec[]>>({})
  // </CHANGE>

  // UI states
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [showCopyDialog, setShowCopyDialog] = useState(false)
  const [copyFromMarket, setCopyFromMarket] = useState("")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isSaving, setIsSaving] = useState(false) // Renamed from isSaving to avoid conflict
  const [isTabsBarSticky, setIsTabsBarSticky] = useState(false)
  // Load draft when opening dialog
useEffect(() => {
  if (isDesignOrderDialogOpen) {
    const market = activeMarketTab === "default" ? "default" : activeMarketTab
    
    // Try to load draft from localStorage
    try {
      const savedDrafts = JSON.parse(localStorage.getItem('designOrderDrafts') || '{}')
      if (savedDrafts[market]) {
        const draft = savedDrafts[market]
        
        // Only load if current data is empty
        const currentData = getDesignOrderDataForMarket(market)
        const isEmpty = !hasFormData()
        
        if (isEmpty) {
          updateDesignOrderData(market, draft)
          
          toast({
            title: "Draft Loaded",
            description: `Previous draft from ${new Date(draft.savedAt).toLocaleString()} has been loaded.`,
            duration: 3000,
          })
        }
      }
    } catch (error) {
      console.error('Failed to load draft from localStorage:', error)
    }
  }
}, [isDesignOrderDialogOpen, activeMarketTab])
  const generalInfoRef = useRef<HTMLDivElement>(null)

  const [isOverviewOpen, setIsOverviewOpen] = useState(false)

  const [uploadMethod, setUploadMethod] = useState<Record<string, "design" | "device" | "library">>({})
  const [pendingAssets, setPendingAssets] = useState<
    Array<{
      id: string
      type: "app_icon" | "feature_graphic" | "screenshot" | "video"
      deviceType?: string
      fileName: string
      fileUrl: string
      status: "pending" | "approved" | "rejected"
      rejectionReason?: string
      uploadDate: string
      uploaderId: string
      uploaderName: string
    }>
  >([])
  // Removed redundant isAssetLibraryOpen state as it's now managed by Dialog
  const [assetLibraryFilter, setAssetLibraryFilter] = useState<{
    type: "app_icon" | "feature_graphic" | "screenshot" | "video" | "all" | null
    deviceType: string | null
  }>({ type: "all", deviceType: "all" })

  // Thêm state để lưu assets đã chọn từ library cho từng loại
  const [selectedAssetsFromLibrary, setSelectedAssetsFromLibrary] = useState<
    Record<string, Array<{ id: string; url: string; name: string; type: string }>>
  >({
    app_icon: [],
    feature_graphic: [],
    screenshot_iphone: [],
    screenshot_ipad: [],
    screenshot_phone: [],
    screenshot_tablet: [],
    promo_video_ref: [],
  })
  // END CHANGE

  const [designOrderData, setDesignOrderData] = useState<
    Record<
      string,
      {
        // Section 1: Order Details
        designPIC: string
        deadline: string
        priority: "normal" | "high" | "urgent"
        assetsNeeded: {
          appIcon: boolean
          appIconQty: number
          featureBanner: boolean
          featureBannerQty: number
          screenshotsPhone: boolean
          screenshotsPhoneQty: number
          screenshotsTablet: boolean
          screenshotsTabletQty: number
          promoVideo: boolean
          promoVideoQty: number
          other: boolean
          otherQty: number
          otherText: string
          otherDescription?: string
        }
        campaignName: string
        themeOrConcept: string
        backgroundRequirements: string
        colorPalette: string[]
        visualStyleTags: string[]
        keyElements: string
        outfitThemes: string[]
        customOutfitThemes: string[]
        campaignReferenceImages: UploadedFile[]
        screenshotSpecs: ScreenshotSpec[]
        tabletScreenshotSpecs?: ScreenshotSpec[]
        bannerQuantity: number
        bannerTheme: string
        bannerSpecs: BannerSpec[]
        designBriefSummary: string
        additionalInstructions: string
        additionalReferenceFiles: UploadedFile[]

        appIconSpecs?: Array<{
          id: string
          concept: string // Hợp nhất thành 1 field
          styleTags: string[]
          referenceImages: Array<{ id: string; url: string; name: string }>
          notes: string // Loại bỏ field này
        }>

        appIconConcept?: string // Loại bỏ các field này
        appIconStyleTags?: string[]
        appIconReferenceImages?: UploadedFile[]
        appIconNotes?: string

        promoVideoSpecs?: Array<{
          id: string
          duration: string
          description: string // Thêm field mô tả cho Promo Video
          concept: string
          features: string
          music: string
          references: string
          referenceVideos: Array<{ id: string; url: string; name: string; type: 'mockup' | 'device' | 'library' }> // Thêm reference videos
        }>

        promoVideoDuration?: string // Loại bỏ field này
        promoVideoConcept?: string
        promoVideoFeatures?: string
        promoVideoMusic?: string
        promoVideoReferences?: string

        otherAssetSpecs?: Array<{
          id: string
          description: string
          specs: string
          referenceFiles: UploadedFile[]
        }>

        otherAssetsDescription?: string
        otherAssetsSpecs?: string
        otherAssetsReferenceFiles?: UploadedFile[]
      }
    >
  >({})

  const [orderSectionsExpanded, setOrderSectionsExpanded] = useState({
    orderDetails: true,
    campaignConcept: true,
    screenshotSpecs: true,
    bannerRequirements: false,
    additionalNotes: false,
  })

  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null)
  // Removed lastAutoSaved state as it's now managed by the DialogFooter in the design order modal

  // ============================================
  // COMPUTED VALUES (useMemo, useCallback)
  // ============================================

  // Get selected app
  const selectedApp = mockApps.find((app) => app.id === selectedAppId)

  // Character limits based on platform
  const getCharLimits = useCallback(() => {
    if (platform === "android" || platform === "both") {
      return {
        title: 50, // Changed from 30 to 50 for Android
        shortDesc: 80,
        fullDesc: 4000,
        keywords: 80,
        subtitle: 0, // Not applicable for Android
      }
    } else if (platform === "ios") {
      return {
        title: 30,
        subtitle: 30,
        shortDesc: 80, // Only for internal use
        fullDesc: 4000, // Only for internal use
        keywords: 100,
      }
    }
    return {
      title: 30,
      shortDesc: 80,
      fullDesc: 4000,
      keywords: 80,
      subtitle: 0,
    }
  }, [platform])

  const limits = getCharLimits()

  // Validation for General Info
  const isGeneralInfoComplete = useMemo(() => {
    const isComplete = selectedAppId && storekitName && platform && selectedMarkets.length > 0
    console.log("[v0] isGeneralInfoComplete:", {
      selectedAppId,
      storekitName,
      platform,
      marketsCount: selectedMarkets.length,
      isComplete,
    })
    return isComplete
  }, [selectedAppId, storekitName, platform, selectedMarkets])
  // </CHANGE>

  // Validation for Default Metadata
  const isDefaultMetadataComplete = useMemo(() => {
    return defaultTitle && defaultShortDesc && defaultFullDesc
  }, [defaultTitle, defaultShortDesc, defaultFullDesc])

  const getDesignOrderDataForMarket = useCallback(
    (market: string) => {
      const defaultData = {
        designPIC: "",
        deadline: "",
        priority: "normal" as const,
        assetsNeeded: {
          appIcon: false,
          appIconQty: 1,
          featureBanner: false,
          featureBannerQty: 1,
          screenshotsPhone: false,
          screenshotsPhoneQty: 6,
          screenshotsTablet: false,
          screenshotsTabletQty: 6,
          promoVideo: false,
          promoVideoQty: 1,
          other: false,
          otherQty: 1,
          otherText: "",
          otherDescription: "",
        },
        campaignName: "",
        themeOrConcept: "",
        backgroundRequirements: "",
        colorPalette: [],
        visualStyleTags: [],
        keyElements: "",
        outfitThemes: [],
        customOutfitThemes: [],
        campaignReferenceImages: [],
        screenshotSpecs: [],
        tabletScreenshotSpecs: [],
        bannerQuantity: 1,
        bannerTheme: "",
        bannerSpecs: [],
        designBriefSummary: "",
        additionalInstructions: "",
        additionalReferenceFiles: [],
        appIconSpecs: [],
        appIconConcept: "",
        appIconStyleTags: [],
        appIconReferenceImages: [],
        appIconNotes: "",
        promoVideoSpecs: [],
        promoVideoDuration: "30s",
        promoVideoConcept: "",
        promoVideoFeatures: "",
        promoVideoMusic: "",
        promoVideoReferences: "",
        otherAssetSpecs: [],
        otherAssetsDescription: "",
        otherAssetsSpecs: "",
        otherAssetsReferenceFiles: [],
      }
      return designOrderData[market] || defaultData
    },
    [designOrderData],
  )

  // Update design order data for a market
  const updateDesignOrderData = useCallback(
    (market: string, updates: Partial<(typeof designOrderData)[string]>) => {
      setDesignOrderData((prev) => {
        const newData = {
          ...prev,
          [market]: {
            ...getDesignOrderDataForMarket(market),
            ...updates,
          },
        }

        if (
          updates.assetsNeeded?.screenshotsPhone &&
          (!newData[market].screenshotSpecs || newData[market].screenshotSpecs.length === 0)
        ) {
          const qty = updates.assetsNeeded.screenshotsPhoneQty || 6
          newData[market].screenshotSpecs = Array.from({ length: qty }, (_, i) => ({
            id: `screenshot-phone-${Date.now()}-${i}`,
            description: "",
            referenceImages: [],
          }))
        }
        // </CHANGE>
        // Auto-adjust screenshotSpecs quantity
        if (updates.assetsNeeded?.screenshotsPhoneQty && newData[market].assetsNeeded.screenshotsPhone) {
          const currentSpecs = newData[market].screenshotSpecs || []
          const targetQty = updates.assetsNeeded.screenshotsPhoneQty

          if (currentSpecs.length < targetQty) {
            const additional = Array.from({ length: targetQty - currentSpecs.length }, (_, i) => ({
              id: `screenshot-phone-${Date.now()}-${currentSpecs.length + i}`,
              description: "",
              referenceImages: [],
            }))
            newData[market].screenshotSpecs = [...currentSpecs, ...additional]
          } else if (currentSpecs.length > targetQty) {
            newData[market].screenshotSpecs = currentSpecs.slice(0, targetQty)
          }
        }

        // Auto-initialize bannerSpecs when featureBanner is checked
        if (
          updates.assetsNeeded?.featureBanner &&
          (!newData[market].bannerSpecs || newData[market].bannerSpecs.length === 0)
        ) {
          const qty = updates.assetsNeeded.featureBannerQty || 1
          newData[market].bannerSpecs = Array.from({ length: qty }, (_, i) => ({
            id: `banner-${Date.now()}-${i}`,
            dimensions: "1024x500",
            description: "",
            referenceImages: [],
          }))
        }
        // Auto-adjust bannerSpecs quantity
        if (updates.assetsNeeded?.featureBannerQty && newData[market].assetsNeeded.featureBanner) {
          const currentSpecs = newData[market].bannerSpecs || []
          const targetQty = updates.assetsNeeded.featureBannerQty

          if (currentSpecs.length < targetQty) {
            const additional = Array.from({ length: targetQty - currentSpecs.length }, (_, i) => ({
              id: `banner-${Date.now()}-${currentSpecs.length + i}`,
              dimensions: "1024x500",
              description: "",
              referenceImages: [],
            }))
            newData[market].bannerSpecs = [...currentSpecs, ...additional]
          } else if (currentSpecs.length > targetQty) {
            newData[market].bannerSpecs = currentSpecs.slice(0, targetQty)
          }
        }

        if (
          updates.assetsNeeded?.screenshotsTablet &&
          (!newData[market].tabletScreenshotSpecs || newData[market].tabletScreenshotSpecs.length === 0)
        ) {
          const qty = updates.assetsNeeded.screenshotsTabletQty || 6
          newData[market].tabletScreenshotSpecs = Array.from({ length: qty }, (_, i) => ({
            id: `tablet-screenshot-${Date.now()}-${i}`,
            description: "",
            referenceImages: [],
          }))
          // </CHANGE>
        }
        // Auto-adjust tabletScreenshotSpecs quantity
        if (updates.assetsNeeded?.screenshotsTabletQty && newData[market].assetsNeeded.screenshotsTablet) {
          const currentSpecs = newData[market].tabletScreenshotSpecs || []
          const targetQty = updates.assetsNeeded.screenshotsTabletQty

          if (currentSpecs.length < targetQty) {
            const additional = Array.from({ length: targetQty - currentSpecs.length }, (_, i) => ({
              id: `tablet-screenshot-${Date.now()}-${currentSpecs.length + i}`,
              description: "",
              referenceImages: [],
            }))
            // </CHANGE>
            newData[market].tabletScreenshotSpecs = [...currentSpecs, ...additional]
          } else if (currentSpecs.length > targetQty) {
            newData[market].tabletScreenshotSpecs = currentSpecs.slice(0, targetQty)
          }
        }

        if (
          updates.assetsNeeded?.promoVideo &&
          (!newData[market].promoVideoSpecs || newData[market].promoVideoSpecs.length === 0)
        ) {
          const qty = updates.assetsNeeded.promoVideoQty || 1
          newData[market].promoVideoSpecs = Array.from({ length: qty }, (_, i) => ({
            id: `promo-video-${Date.now()}-${i}`,
            duration: "30s",
            description: "",
            concept: "",
            features: "",
            music: "",
            references: "",
            referenceVideos: [],
          }))
          // </CHANGE>
        }
        // Auto-adjust promoVideoSpecs quantity
        if (updates.assetsNeeded?.promoVideoQty && newData[market].assetsNeeded.promoVideo) {
          const currentSpecs = newData[market].promoVideoSpecs || []
          const targetQty = updates.assetsNeeded.promoVideoQty

          if (currentSpecs.length < targetQty) {
            const additional = Array.from({ length: targetQty - currentSpecs.length }, (_, i) => ({
              id: `promo-video-${Date.now()}-${currentSpecs.length + i}`,
              duration: "30s",
              description: "",
              concept: "",
              features: "",
              music: "",
              references: "",
              referenceVideos: [],
            }))
            // </CHANGE>
            newData[market].promoVideoSpecs = [...currentSpecs, ...additional]
          } else if (currentSpecs.length > targetQty) {
            newData[market].promoVideoSpecs = currentSpecs.slice(0, targetQty)
          }
        }

        return newData
      })
    },
    [designOrderData, getDesignOrderDataForMarket],
  )

  // Auto-generate screenshot specs based on quantity
  useEffect(() => {
    const market = activeMarketTab === "default" ? "default" : activeMarketTab
    const currentData = getDesignOrderDataForMarket(market)
    const phoneQty = currentData.assetsNeeded.screenshotsPhoneQty
    const currentPhoneSpecs = currentData.screenshotSpecs.length

    if (currentData.assetsNeeded.screenshotsPhone && phoneQty > currentPhoneSpecs) {
      const newSpecs: ScreenshotSpec[] = []
      for (let i = currentPhoneSpecs; i < phoneQty; i++) {
        newSpecs.push({
          id: `screenshot-phone-${Date.now()}-${i}`,
          description: "", // Updated to use the new 'description' field
          referenceImages: [],
        })
      }
      updateDesignOrderData(market, {
        screenshotSpecs: [...currentData.screenshotSpecs, ...newSpecs],
      })
    }
  }, [activeMarketTab, getDesignOrderDataForMarket, updateDesignOrderData])

  // useEffect for tablet screenshots generation
  useEffect(() => {
    const market = activeMarketTab === "default" ? "default" : activeMarketTab
    const currentData = getDesignOrderDataForMarket(market)
    const tabletQty = currentData.assetsNeeded.screenshotsTabletQty
    const currentTabletSpecs = currentData.tabletScreenshotSpecs?.length || 0

    if (currentData.assetsNeeded.screenshotsTablet && tabletQty > currentTabletSpecs) {
      const newSpecs: ScreenshotSpec[] = []
      for (let i = currentTabletSpecs; i < tabletQty; i++) {
        // FIX: i < tabletQty
        newSpecs.push({
          id: `screenshot-tablet-${Date.now()}-${i}`,
          description: "", // Updated to use the new 'description' field
          referenceImages: [],
        })
      }
      updateDesignOrderData(market, {
        tabletScreenshotSpecs: [...(currentData.tabletScreenshotSpecs || []), ...newSpecs],
      })
    }
  }, [activeMarketTab, getDesignOrderDataForMarket, updateDesignOrderData])

// Validation for complete order
const isDesignOrderComplete = useMemo(() => {
  const market = activeMarketTab === "default" ? "default" : activeMarketTab
  const data = getDesignOrderDataForMarket(market)

  // Required fields only - Design PIC, Deadline, and at least one asset
  const hasDesignPIC = !!data.designPIC
  const hasDeadline = !!data.deadline
  const hasAtLeastOneAsset = 
    data.assetsNeeded.appIcon ||
    data.assetsNeeded.featureBanner ||
    data.assetsNeeded.screenshotsPhone ||
    data.assetsNeeded.screenshotsTablet ||
    data.assetsNeeded.promoVideo ||
    data.assetsNeeded.other

  return hasDesignPIC && hasDeadline && hasAtLeastOneAsset
}, [activeMarketTab, getDesignOrderDataForMarket])

  const getMissingFieldsCount = useMemo(() => {
    const market = activeMarketTab === "default" ? "default" : activeMarketTab
    const data = getDesignOrderDataForMarket(market)
    let missing = 0

    if (!data.designPIC) missing++
    if (!data.deadline) missing++
    if (!data.campaignName) missing++
    if (!Object.values(data.assetsNeeded).some((v) => v === true)) missing++

    return missing
  }, [activeMarketTab, getDesignOrderDataForMarket])
  // </CHANGE>

  const getDesignOrderForMarket = useCallback(
    (market: string) => {
      return {
        designPIC: designPICByMarket[market] || "",
        deadline: deadlineByMarket[market] || "",
        priority: priorityByMarket[market] || "normal",
        brief: briefByMarket[market] || "",
        attachments: attachmentsByMarket[market] || [],
      }
    },
    [designPICByMarket, deadlineByMarket, priorityByMarket, briefByMarket, attachmentsByMarket],
  )

  const updateDesignOrderForMarket = useCallback((market: string, field: string, value: any) => {
    switch (field) {
      case "designPIC":
        setDesignPICByMarket((prev) => ({ ...prev, [market]: value }))
        break
      case "deadline":
        setDeadlineByMarket((prev) => ({ ...prev, [market]: value }))
        break
      case "priority":
        setPriorityByMarket((prev) => ({ ...prev, [market]: value }))
        break
      case "brief":
        setBriefByMarket((prev) => ({ ...prev, [market]: value }))
        break
      case "attachments":
        setAttachmentsByMarket((prev) => ({ ...prev, [market]: value }))
        break
    }
    setHasUnsavedChanges(true)
  }, [])

  const copyDesignOrderFromDefault = useCallback(
    (market: string) => {
      const defaultOrder = getDesignOrderForMarket("default")
      setDesignPICByMarket((prev) => ({ ...prev, [market]: defaultOrder.designPIC }))
      setDeadlineByMarket((prev) => ({ ...prev, [market]: defaultOrder.deadline }))
      setPriorityByMarket((prev) => ({ ...prev, [market]: defaultOrder.priority }))
      setBriefByMarket((prev) => ({ ...prev, [market]: defaultOrder.brief }))
      setAttachmentsByMarket((prev) => ({ ...prev, [market]: defaultOrder.attachments }))
      toast({
        title: "Đã copy từ Default",
        description: `Design order đã được copy sang ${market}`,
      })
    },
    [getDesignOrderForMarket, toast],
  )
  // </CHANGE>

  const getAssetsForMarket = useCallback(
    (market: string) => {
      if (market === "default") {
        return {
          appIcon,
          featureBanner,
          screenshots: screenshots.iphone || {}, // Defaulting to iphone for simplicity
          appPreviewVideos,
        }
      }
      return {
        appIcon: appIconByMarket[market] || null,
        featureBanner: featureBannerByMarket[market] || null,
        screenshots: screenshotsByMarket[market]?.iphone || {}, // Defaulting to iphone for simplicity
        appPreviewVideos: appPreviewVideosByMarket[market] || { iphone: [], ipad: [] },
      }
    },
    [
      appIcon,
      featureBanner,
      screenshots,
      appPreviewVideos,
      appIconByMarket,
      featureBannerByMarket,
      screenshotsByMarket,
      appPreviewVideosByMarket,
    ],
  )

  const copyAssetsFromDefault = useCallback(
    (market: string) => {
      setAppIconByMarket((prev) => ({ ...prev, [market]: appIcon }))
      setFeatureBannerByMarket((prev) => ({ ...prev, [market]: featureBanner }))
      setScreenshotsByMarket((prev) => ({ ...prev, [market]: screenshots }))
      setAppPreviewVideosByMarket((prev) => ({ ...prev, [market]: appPreviewVideos }))
      toast({
        title: "Đã copy assets từ Default",
        description: `Graphics & Assets đã được copy sang ${market}`,
      })
    },
    [appIcon, featureBanner, screenshots, appPreviewVideos, toast],
  )
  // </CHANGE>

  // Validation for Order Info
  const isOrderComplete = useMemo(() => {
    const currentOrder = getDesignOrderForMarket(activeMarketTab === "default" ? "default" : activeMarketTab)
    return !!(currentOrder.deadline && currentOrder.brief)
  }, [activeMarketTab, getDesignOrderForMarket])
  // </CHANGE>

  // Validation for Metadata per Market
  const isMetadataComplete = useMemo(() => {
    if (activeMarketTab === "default") return true // Default tab doesn't have specific metadata to complete

    const currentMarketData = metadataByMarket[activeMarketTab] || {}
    const currentMarketOverrideData = dataByMarket[activeMarketTab] || {}

    const hasTitle = currentMarketData.title || false
    const hasShortDesc = currentMarketOverrideData.shortDesc || defaultShortDesc
    const hasFullDesc = currentMarketOverrideData.fullDesc || defaultFullDesc
    const hasKeywords = currentMarketData.keywords || false
    const hasSubtitle = platform === "ios" ? currentMarketData.subtitle || false : true // Subtitle is optional for non-iOS

    return hasTitle && hasShortDesc && hasFullDesc && hasKeywords && hasSubtitle
  }, [activeMarketTab, metadataByMarket, dataByMarket, defaultShortDesc, defaultFullDesc, platform])

  const isFormValid = useMemo(() => {
    const basicInfoValid = isGeneralInfoComplete && isDefaultMetadataComplete
    // Không còn require order info trong main form
    return basicInfoValid
  }, [isGeneralInfoComplete, isDefaultMetadataComplete])

  const collectAllData = useCallback(() => {
    return {
      appId: selectedAppId,
      storekitName,
      version,
      platform,
      markets: selectedMarkets,
      owner,
      defaultMetadata: {
        title: defaultTitle,
        shortDesc: defaultShortDesc,
        fullDesc: defaultFullDesc,
      },
      metadataByMarket,
      dataByMarket,
      screenshots,
      appPreviewVideos,
      promoVideoUrl,
      promoVideoPerMarket,
      promoVideoReferenceFiles,
      // CHANGE: Thêm per-market data cho order và assets
      designPICByMarket,
      deadlineByMarket,
      priorityByMarket,
      briefByMarket,
      attachmentsByMarket,
      appIconByMarket,
      featureBannerByMarket,
      screenshotsByMarket,
      appPreviewVideosByMarket,
      tabletScreenshotSpecs, // Add tabletScreenshotSpecs
      bannerSpecs, // Add bannerSpecs
      // END CHANGE
    }
  }, [
    selectedAppId,
    storekitName,
    version,
    platform,
    selectedMarkets,
    owner,
    defaultTitle,
    defaultShortDesc,
    defaultFullDesc,
    metadataByMarket,
    dataByMarket,
    screenshots,
    appPreviewVideos,
    promoVideoUrl,
    promoVideoPerMarket,
    promoVideoReferenceFiles,
    // CHANGE: Thêm per-market data
    designPICByMarket,
    deadlineByMarket,
    priorityByMarket,
    briefByMarket,
    attachmentsByMarket,
    appIconByMarket,
    featureBannerByMarket,
    screenshotsByMarket,
    appPreviewVideosByMarket,
    tabletScreenshotSpecs, // Add tabletScreenshotSpecs
    bannerSpecs, // Add bannerSpecs
    // END CHANGE
  ])

  const handleSendDesignOrder = useCallback(async () => {
    const targetMarket = activeMarketTab === "default" ? "default" : activeMarketTab
    const currentOrder = getDesignOrderForMarket(targetMarket)

    if (!currentOrder.designPIC || !currentOrder.deadline || !currentOrder.brief) {
      toast({
        title: "Thông tin chưa đầy đủ",
        description: "Vui lòng điền đầy đủ Design PIC, Deadline và Brief.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const allData = collectAllData()
      const orderData = {
        ...allData,
        market: targetMarket,
        designOrder: currentOrder,
        marketSpecificData: {
          metadata: metadataByMarket[targetMarket] || {},
          overrides: dataByMarket[targetMarket] || {},
          assets: getAssetsForMarket(targetMarket),
        },
      }

      console.log("[v0] Sending design order for market:", targetMarket, orderData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setDesignOrderSentByMarket((prev) => ({ ...prev, [targetMarket]: true }))
      setIsDesignOrderDialogOpen(false)

      toast({
        title: "Đã gửi Design Order",
        description: `Order cho ${targetMarket} đã được gửi đến design team.`,
      })
    } catch (error) {
      console.error("[v0] Error sending design order:", error)
      toast({
        title: "Lỗi",
        description: "Không thể gửi design order. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [
    activeMarketTab,
    getDesignOrderForMarket,
    getAssetsForMarket,
    collectAllData,
    metadataByMarket,
    dataByMarket,
    toast,
  ])
  // </CHANGE>

  const handleSaveDraft = useCallback(async () => {
    setIsSubmitting(true)
    try {
      const allData = collectAllData()
      console.log("[v0] Saving draft:", allData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (designOrderSentByMarket[activeMarketTab]) {
        // CHANGE: Check design order status per market
        const now = new Date()
        const currentDate = now.toISOString().split("T")[0]
        const currentDateTime = `${currentDate} ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`

        const selectedApp = mockApps.find((app) => app.id === selectedAppId)

        const newItem = {
          id: `${Date.now()}`,
          name: storekitName,
          version: version,
          app: selectedApp?.name || "Unknown App",
          platform: platform,
          markets: selectedMarkets,
          keywords: {
            count: 0,
            top5: [],
          },
          assets: {
            total: 0,
            icon: 0,
            screenshot: 0,
            video: 0,
            featureGraphic: 0,
            promoBanner: 0,
            others: 0,
            thumbnails: [],
          },
          owner: owner,
          status: "sent_to_design" as const,
          createdDate: currentDate,
          updatedDate: currentDateTime,
        }

        try {
          const existingItems = JSON.parse(localStorage.getItem("storekit_items") || "[]")
          existingItems.push(newItem)
          localStorage.setItem("storekit_items", JSON.stringify(existingItems))
          console.log("[v0] Saved item to localStorage with status 'sent_to_design':", newItem)
        } catch (error) {
          console.error("[v0] Failed to save to localStorage:", error)
        }
      }

      setLastSaved(new Date())
      setHasUnsavedChanges(false)

      toast({
        title: "Draft Saved",
        description: designOrderSentByMarket[activeMarketTab] // CHANGE: Check design order status per market
          ? "Your StoreKit draft has been saved with status 'Sent to Design'."
          : "Your StoreKit draft has been saved successfully.",
      })
    } catch (error) {
      console.error("[v0] Error saving draft:", error)
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [
    collectAllData,
    designOrderSentByMarket,
    activeMarketTab,
    selectedAppId,
    storekitName,
    version,
    platform,
    selectedMarkets,
    owner,
    toast,
  ]) // CHANGE: Added designOrderSentByMarket and activeMarketTab

  const handleSubmit = useCallback(async () => {
    if (!isFormValid) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all required fields before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const allData = collectAllData()
      console.log("[v0] Creating StoreKit:", allData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "StoreKit Created",
        description: "Your StoreKit has been created successfully.",
      })

      router.push("/applications")
    } catch (error) {
      console.error("[v0] Error creating StoreKit:", error)
      toast({
        title: "Error",
        description: "Failed to create StoreKit. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [isFormValid, collectAllData, toast, router])

  // Handle market selection
  const toggleMarket = useCallback((market: string) => {
    setSelectedMarkets((prev) => (prev.includes(market) ? prev.filter((m) => m !== market) : [...prev, market]))
  }, [])

  // CHANGE: Thêm hàm toggle select all markets
  const allMarkets = ["US", "VN", "JP", "KR", "TH", "ID", "PH", "MY", "SG", "UK", "CA", "AU", "FR", "DE", "IT"]

  const toggleSelectAllMarkets = useCallback(() => {
    if (selectedMarkets.length === allMarkets.length) {
      // Nếu đã chọn hết, bỏ chọn tất cả
      setSelectedMarkets([])
    } else {
      // Chọn tất cả
      setSelectedMarkets(allMarkets)
    }
  }, [selectedMarkets.length])

  // Handle import from Metadata Tracking
  const handleImportMetadata = useCallback(
    (versionId: string) => {
      const version = metadataVersions.find((v) => v.id === versionId)
      if (version) {
        // Simulate importing data
        const importedData = {
          title: `Imported from ${version.version}`,
          subtitle: "Imported subtitle",
          shortDesc: "Imported short description",
          fullDesc: "Imported full description",
        }

        setMetadataByMarket((prev) => ({
          ...prev,
          [activeMarketTab]: importedData,
        }))

        toast({
          title: "Đã import metadata",
          description: `Đã nạp metadata từ ${version.version} (${version.market})`,
        })
        setShowImportDialog(false)
      }
    },
    [activeMarketTab, toast], // Removed metadataVersions from dependency as it's assumed stable mock data
  )

  // Handle copy from another market
  const handleCopyFromMarket = useCallback(() => {
    if (!copyFromMarket) return

    if (copyFromMarket === "default") {
      // Copy từ Default
      setDataByMarket((prev) => ({
        ...prev,
        [activeMarketTab]: {
          shortDesc: defaultShortDesc,
          fullDesc: defaultFullDesc,
        },
      }))

      // Copy metadata nếu có
      if (metadataByMarket["default"]) {
        setMetadataByMarket((prev) => ({
          ...prev,
          [activeMarketTab]: { ...metadataByMarket["default"] },
        }))
      }
    } else {
      // Copy từ market khác
      if (dataByMarket[copyFromMarket]) {
        setDataByMarket((prev) => ({
          ...prev,
          [activeMarketTab]: { ...dataByMarket[copyFromMarket] },
        }))
      }

      if (metadataByMarket[copyFromMarket]) {
        setMetadataByMarket((prev) => ({
          ...prev,
          [activeMarketTab]: { ...metadataByMarket[copyFromMarket] },
        }))
      }
    }

    toast({
      title: "Đã sao chép metadata",
      description: `Đã sao chép metadata từ ${copyFromMarket === "default" ? "Default" : copyFromMarket} sang ${activeMarketTab}`,
    })
    setShowCopyDialog(false)
    setCopyFromMarket("")
  }, [copyFromMarket, activeMarketTab, defaultShortDesc, defaultFullDesc, dataByMarket, metadataByMarket, toast])

  // Handle brief template
  const useBriefTemplate = useCallback(() => {
    const template = `**Mục tiêu KPI:**
- Tăng CTR: +10%
- Tăng CVR: +5%
- Tăng organic downloads: +15%

**Đối thủ tham chiếu:**
- Zara - Summer Collection Campaign
- H&M - Seasonal Trends

**Mood/Style:**
- Tone màu: Tươi sáng, năng động
- Style: Modern, minimalist
- Focus: Sản phẩm mùa hè (váy, áo thun, sandals)

**Text bắt buộc:**
- "Summer Collection 2025"
- "New Arrivals"

**Text cấm:**
- Không dùng "Sale", "Discount" (chưa có chương trình)

**Lưu ý theo market:**
- US: Focus vào lifestyle, casual wear
- UK: Emphasize quality và sustainability
- CA: Highlight local shipping và customer service`

    setBriefByMarket((prev) => ({ ...prev, [activeMarketTab]: template })) // CHANGE: Update brief using per-market state
    setHasUnsavedChanges(true) // CHANGE: Mark as unsaved
    toast({
      title: "Đã áp dụng template",
      description: "Brief template đã được điền vào form",
    })
  }, [activeMarketTab, toast]) // CHANGE: Added activeMarketTab

  // CHANGE: Thêm hàm validate YouTube URL
  const validateYouTubeUrl = useCallback((url: string): boolean => {
    const patterns = [
      /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
      /^https?:\/\/youtu\.be\/[\w-]+/,
      /^https?:\/\/(www\.)?youtube\.com\/shorts\/[\w-]+/,
    ]
    return patterns.some((pattern) => pattern.test(url))
  }, [])

  const handleTestPromoVideo = useCallback(() => {
    if (promoVideoUrl) {
      const isValid = validateYouTubeUrl(promoVideoUrl)
      setPromoVideoValid(isValid)
      if (isValid) {
        toast({
          title: "Link hợp lệ",
          description: "YouTube URL đã được xác thực thành công",
        })
      } else {
        toast({
          title: "Link không hợp lệ",
          description: "Link không đúng định dạng YouTube hợp lệ",
          variant: "destructive",
        })
      }
    }
  }, [promoVideoUrl, validateYouTubeUrl, toast])

  const getYouTubeVideoId = useCallback((url: string): string | null => {
    const patterns = [/youtube\.com\/watch\?v=([\w-]+)/, /youtu\.be\/([\w-]+)/, /youtube\.com\/shorts\/([\w-]+)/]
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
    return null
  }, [])

  const hasValidPromoVideo = useCallback(() => {
    if (promoVideoApplyToAll) {
      return promoVideoUrl && promoVideoValid !== null && promoVideoValid
    } else {
      return Object.values(promoVideoPerMarket).some((url) => url && validateYouTubeUrl(url))
    }
  }, [promoVideoApplyToAll, promoVideoUrl, promoVideoValid, promoVideoPerMarket, validateYouTubeUrl])
  // END CHANGE

  const getFieldValue = useCallback(
    (market: string, field: string) => {
      if (market === "default") {
        if (field === "title") return defaultTitle
        if (field === "shortDesc") return defaultShortDesc
        if (field === "fullDesc") return defaultFullDesc
        return ""
      }
      // Chỉ trả về giá trị nếu market có override, không kế thừa từ default
      if (dataByMarket[market]?.[field] !== undefined) {
        return dataByMarket[market][field]
      }
      // Trả về rỗng thay vì kế thừa từ default
      return ""
    },
    [dataByMarket, defaultTitle, defaultShortDesc, defaultFullDesc],
  )
  // </CHANGE>

  const isFieldOverridden = useCallback(
    (market: string, field: string) => {
      if (market === "default") return false
      return dataByMarket[market]?.[field] !== undefined
    },
    [dataByMarket],
  )

  const resetToDefault = useCallback(
    (market: string, field: string) => {
      if (market === "default") return
      setDataByMarket((prev) => {
        const updated = { ...prev }
        if (updated[market]) {
          delete updated[market][field]
          // Nếu market không còn field nào, xóa luôn market
          if (Object.keys(updated[market]).length === 0) {
            delete updated[market]
          }
        }
        return updated
      })
      toast({
        title: "Đã reset về Default",
        description: `Field đã được reset về giá trị mặc định`,
      })
    },
    [toast],
  )

  const updateFieldValue = useCallback(
    (field: string, value: any) => {
      if (activeMarketTab === "default") {
        // Update default values
        if (field === "title")
          setDefaultTitle(value) // changed from defaultShortDesc
        else if (field === "shortDesc") setDefaultShortDesc(value)
        else if (field === "fullDesc") setDefaultFullDesc(value)
      } else {
        // Update market override
        setDataByMarket((prev) => ({
          ...prev,
          [activeMarketTab]: {
            ...prev[activeMarketTab],
            [field]: value,
          },
        }))
      }
      setHasUnsavedChanges(true) // Mark as unsaved
    },
    [activeMarketTab],
  )

  const getTabStatus = useCallback(
    (tab: string): "complete" | "incomplete" | "partial" => {
      if (tab === "default") {
        const hasTitle = defaultTitle.length > 0 // changed from defaultShortDesc
        const hasShortDesc = defaultShortDesc.length > 0
        const hasFullDesc = defaultFullDesc.length > 0
        if (hasTitle && hasShortDesc && hasFullDesc) return "complete" // changed from defaultShortDesc
        if (hasTitle || hasShortDesc || hasFullDesc) return "partial" // changed from defaultShortDesc
        return "incomplete"
      }

      const meta = metadataByMarket[tab] || {}
      const data = dataByMarket[tab] || {}

      const hasTitle = meta.title || defaultTitle // changed from defaultShortDesc
      const hasShortDesc = data.shortDesc || defaultShortDesc
      const hasFullDesc = data.fullDesc || defaultFullDesc
      const hasKeywords = meta.keywords || false
      const hasSubtitle = platform === "ios" ? meta.subtitle || false : true // Subtitle is optional for non-iOS

      const completedFields = [hasTitle, hasShortDesc, hasFullDesc, hasKeywords, hasSubtitle].filter(Boolean).length

      const totalRequiredFields = platform === "ios" ? 4 : 3 // Title, ShortDesc, FullDesc, Keywords. Subtitle is extra for iOS.

      if (completedFields === totalRequiredFields) return "complete"
      if (completedFields > 0) return "partial"
      return "incomplete"
    },
    [defaultTitle, defaultShortDesc, defaultFullDesc, metadataByMarket, dataByMarket, platform], // changed from defaultShortDesc
  )

  const getCurrentTabStatus = useCallback(() => {
    return getTabStatus(activeMarketTab)
  }, [getTabStatus, activeMarketTab])

  const getAllTabsStatus = useCallback(() => {
    const tabs = ["default", ...selectedMarkets]
    return tabs.map((tab) => ({
      tab,
      status: getTabStatus(tab),
    }))
  }, [selectedMarkets, getTabStatus])

  // Helper to count videos for a given device type
  const getVideoCount = useCallback(
    (deviceType: "iphone" | "ipad") => {
      // CHANGE: Truy cập appPreviewVideosPerMarket nếu là per-market, nếu không thì dùng default
      if (activeMarketTab === "default") {
        return appPreviewVideos[deviceType]?.filter((v) => v.file).length || 0
      } else {
        return appPreviewVideosByMarket[activeMarketTab]?.[deviceType]?.filter((v) => v.file).length || 0
      }
      // END CHANGE
    },
    [appPreviewVideos, appPreviewVideosByMarket, activeMarketTab], // CHANGE: Added activeMarketTab and appPreviewVideosByMarket
  )

  const hasFormData = useCallback(() => {
  const market = activeMarketTab === "default" ? "default" : activeMarketTab
  const data = getDesignOrderDataForMarket(market)
  
  return (
    data.designPIC !== "" ||
    data.deadline !== "" ||
    data.priority !== "normal" ||
    Object.values(data.assetsNeeded).some((v) => v === true) ||
    data.campaignName !== "" ||
    data.themeOrConcept !== "" ||
    data.colorPalette.length > 0 ||
    data.visualStyleTags.length > 0 ||
    data.campaignReferenceImages.length > 0 ||
    data.screenshotSpecs.length > 0 ||
    (data.tabletScreenshotSpecs?.length || 0) > 0 ||
    data.bannerSpecs.length > 0 ||
    data.designBriefSummary !== "" ||
    data.additionalInstructions !== "" ||
    data.additionalReferenceFiles.length > 0 ||
    (data.appIconSpecs?.length ?? 0) > 0 ||
    (data.promoVideoSpecs?.length ?? 0) > 0 ||
    (data.otherAssetSpecs?.length ?? 0) > 0
  )
}, [activeMarketTab, getDesignOrderDataForMarket])

  const handleCancelClick = () => {
  if (hasFormData()) {
    // Có data → Hiển thị confirm dialog
    setIsCancelConfirmOpen(true)
  } else {
    // Không có data → Đóng luôn
    setIsDesignOrderDialogOpen(false)
    const market = activeMarketTab === "default" ? "default" : activeMarketTab
    
    // Clear form data
    setDesignOrderData((prev) => ({
      ...prev,
      [market]: {
        ...getDesignOrderDataForMarket(market),
        // Reset về default
        designPIC: "",
        deadline: "",
        priority: "normal",
        assetsNeeded: {
          appIcon: false,
          appIconQty: 1,
          featureBanner: false,
          featureBannerQty: 1,
          screenshotsPhone: false,
          screenshotsPhoneQty: 6,
          screenshotsTablet: false,
          screenshotsTabletQty: 6,
          promoVideo: false,
          promoVideoQty: 1,
          other: false,
          otherQty: 1,
          otherText: "",
          otherDescription: "",
        },
        campaignName: "",
        themeOrConcept: "",
        backgroundRequirements: "",
        colorPalette: [],
        visualStyleTags: [],
        keyElements: "",
        outfitThemes: [],
        customOutfitThemes: [],
        campaignReferenceImages: [],
        screenshotSpecs: [],
        tabletScreenshotSpecs: [],
        bannerQuantity: 1,
        bannerTheme: "",
        bannerSpecs: [],
        designBriefSummary: "",
        additionalInstructions: "",
        additionalReferenceFiles: [],
        appIconSpecs: [],
        promoVideoSpecs: [],
        otherAssetSpecs: [],
      },
    }))
  }
}

const handleSaveDraftOrder = useCallback(() => {
  const market = activeMarketTab === "default" ? "default" : activeMarketTab
  const data = getDesignOrderDataForMarket(market)
  
  // Lưu data vào state (đã có sẵn trong designOrderData)
  // Data sẽ được giữ lại khi user quay lại
  
  toast({
    title: "✓ Draft Saved",
    description: `Design order draft for ${market === "default" ? "Default" : market} has been saved.`,
    duration: 3000,
  })
  
  // Đóng dialog nhưng giữ data
  setIsDesignOrderDialogOpen(false)
  
  // Optional: Save to localStorage để persist khi reload page
  try {
    const savedDrafts = JSON.parse(localStorage.getItem('designOrderDrafts') || '{}')
    savedDrafts[market] = {
      ...data,
      savedAt: new Date().toISOString(),
    }
    localStorage.setItem('designOrderDrafts', JSON.stringify(savedDrafts))
  } catch (error) {
    console.error('Failed to save draft to localStorage:', error)
  }
}, [activeMarketTab, getDesignOrderDataForMarket, toast])

// Đảm bảo confirmCancelWithData KHÔNG trừ lượt edit
const confirmCancelWithData = () => {
  setIsCancelConfirmOpen(false)
  setIsDesignOrderDialogOpen(false)
  
  // Reset form data for this market - KHÔNG ảnh hưởng đến editCountByMarket
  const market = activeMarketTab === "default" ? "default" : activeMarketTab
  setDesignOrderData((prev) => {
    const newData = { ...prev }
    delete newData[market]
    return newData
  })
  
  // Clear localStorage draft - KHÔNG xóa editCountByMarket
  try {
    const savedDrafts = JSON.parse(localStorage.getItem('designOrderDrafts') || '{}')
    delete savedDrafts[market]
    localStorage.setItem('designOrderDrafts', JSON.stringify(savedDrafts))
  } catch (error) {
    console.error('Failed to clear draft from localStorage:', error)
  }
  
  // KHÔNG thay đổi editCountByMarket ở đây - giữ nguyên số lượt edit đã dùng
}
  // </CHANGE>

// Cập nhật hàm handleSendOrderClick để không cần validate nữa (vì button đã disabled)
const handleSendOrderClick = () => {
  console.log("=== handleSendOrderClick called ===")
  console.log("activeMarketTab:", activeMarketTab)
  console.log("designOrderSentByMarket:", designOrderSentByMarket)
  
  // All required fields are filled (button is only enabled when isDesignOrderComplete is true)
  // Show confirmation dialog directly
  console.log("✅ Opening Send Order Confirmation Dialog")
  setIsSendOrderConfirmOpen(true)
}

const confirmSendOrder = async () => {
  const market = activeMarketTab === "default" ? "default" : activeMarketTab
  const orderData = getDesignOrderDataForMarket(market)
  const isEditing = designOrderSentByMarket[market] // Check if this is an edit

  setIsSubmitting(true)
  
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // CHỈ tăng số lần edit SAU KHI API call thành công
    // Nếu đang edit order đã gửi, tăng số lần edit
    if (isEditing) {
      const currentEditCount = editCountByMarket[market] || 0
      const newEditCount = currentEditCount + 1
      
      setEditCountByMarket((prev) => ({
        ...prev,
        [market]: newEditCount,
      }))
      
      // Lưu lịch sử edit
      setEditHistoryByMarket((prev) => ({
        ...prev,
        [market]: [
          ...(prev[market] || []),
          {
            editedAt: new Date().toISOString(),
            editNumber: newEditCount,
            changes: orderData,
          },
        ],
      }))
      
      // Show success toast với thông tin về số lượt edit còn lại
      const remainingEdits = 5 - newEditCount
      toast({
        title: "✓ Order updated successfully",
        description: `Design order for ${market === "default" ? "Default" : market} has been updated. You have ${remainingEdits} edit(s) remaining.`,
        duration: 4000,
      })
      
      // Save to localStorage với edit count mới
      localStorage.setItem(`designOrder_${market}_sent`, JSON.stringify({
        ...orderData,
        sentAt: new Date().toISOString(),
        editCount: newEditCount,
      }))
    } else {
      // Lần gửi đầu tiên - không tính là edit
      toast({
        title: "✓ Order sent successfully",
        description: `Design order for ${market === "default" ? "Default" : market} has been sent to the design team.`,
        duration: 4000,
      })
      
      // Save to localStorage
      localStorage.setItem(`designOrder_${market}_sent`, JSON.stringify({
        ...orderData,
        sentAt: new Date().toISOString(),
        editCount: 0,
      }))
    }

    // Mark as sent for this market
    setDesignOrderSentByMarket((prev) => ({ ...prev, [market]: true }))

    // Close confirmation dialog
    setIsSendOrderConfirmOpen(false)

    // Close main dialog
    setIsDesignOrderDialogOpen(false)
    
    // Clear draft
    try {
      const savedDrafts = JSON.parse(localStorage.getItem('designOrderDrafts') || '{}')
      delete savedDrafts[market]
      localStorage.setItem('designOrderDrafts', JSON.stringify(savedDrafts))
    } catch (error) {
      console.error('Failed to clear draft from localStorage:', error)
    }
  } catch (error) {
    // Nếu có lỗi, KHÔNG trừ lượt edit
    console.error("[v0] Error sending design order:", error)
    toast({
      title: "Lỗi",
      description: "Không thể gửi design order. Vui lòng thử lại.",
      variant: "destructive",
    })
  } finally {
    setIsSubmitting(false)
  }
}
  // </CHANGE>

  // ============================================
  // EFFECTS
  // ============================================

  // Handle scroll for sticky tabs bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const headerHeight = 120
      const generalInfoHeaderHeight = 60
      const threshold = headerHeight + generalInfoHeaderHeight

      setIsTabsBarSticky(scrollY >= threshold)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const calculateTabsBarTop = () => {
      const headerHeight = 56 // Header đã được thu nhỏ

      if (generalInfoRef.current) {
        // Đo chiều cao thực tế của General Info Card
        const generalInfoHeight = generalInfoRef.current.offsetHeight
        const calculatedTop = headerHeight + generalInfoHeight
        setTabsBarTop(calculatedTop)
      } else {
        // Fallback nếu ref chưa sẵn sàng
        const generalInfoHeaderHeight = 60
        setTabsBarTop(headerHeight + generalInfoHeaderHeight)
      }
    }

    calculateTabsBarTop()

    const resizeObserver = new ResizeObserver(() => {
      calculateTabsBarTop()
    })

    if (generalInfoRef.current) {
      resizeObserver.observe(generalInfoRef.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [isGeneralInfoExpanded])

  // Initialise from URL params
  useEffect(() => {
    const appId = searchParams.get("appId")
    if (appId) {
      setSelectedAppId(appId)
    }
  }, [searchParams])

  useEffect(() => {
    // Set activeMetadataTab based on activeMarketTab, but only if it's not 'default'
    if (activeMarketTab === "default") {
      // Keep activeMetadataTab as is or set to a default if needed, but don't force it to 'US'
    } else {
      setActiveMetadataTab(activeMarketTab)
    }
  }, [activeMarketTab])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [activeMarketTab])

  useEffect(() => {
    // Xóa data của markets không còn được chọn
    setDataByMarket((prev) => {
      const updated = { ...prev }
      Object.keys(updated).forEach((market) => {
        if (!selectedMarkets.includes(market)) {
          delete updated[market]
        }
      })
      return updated
    })

    setMetadataByMarket((prev) => {
      const updated = { ...prev }
      Object.keys(updated).forEach((market) => {
        if (!selectedMarkets.includes(market)) {
          delete updated[market]
        }
      })
      return updated
    })

    // CHANGE: Xóa dữ liệu per-market cho order và assets khi không còn market đó
    setDesignPICByMarket((prev) => {
      const updated = { ...prev }
      Object.keys(updated).forEach((market) => {
        if (!selectedMarkets.includes(market)) delete updated[market]
      })
      return updated
    })
    setDeadlineByMarket((prev) => {
      const updated = { ...prev }
      Object.keys(updated).forEach((market) => {
        if (!selectedMarkets.includes(market)) delete updated[market]
      })
      return updated
    })
    setPriorityByMarket((prev) => {
      const updated = { ...prev }
      Object.keys(updated).forEach((market) => {
        if (!selectedMarkets.includes(market)) delete updated[market]
      })
      return updated
    })
    setBriefByMarket((prev) => {
      const updated = { ...prev }
      Object.keys(updated).forEach((market) => {
        if (!selectedMarkets.includes(market)) delete updated[market]
      })
      return updated
    })
    setAttachmentsByMarket((prev) => {
      const updated = { ...prev }
      Object.keys(updated).forEach((market) => {
        if (!selectedMarkets.includes(market)) delete updated[market]
      })
      return updated
    })
    setAppIconByMarket((prev) => {
      const updated = { ...prev }
      Object.keys(updated).forEach((market) => {
        if (!selectedMarkets.includes(market)) delete updated[market]
      })
      return updated
    })
    setFeatureBannerByMarket((prev) => {
      const updated = { ...prev }
      Object.keys(updated).forEach((market) => {
        if (!selectedMarkets.includes(market)) delete updated[market]
      })
      return updated
    })
    setScreenshotsByMarket((prev) => {
      const updated = { ...prev }
      Object.keys(updated).forEach((market) => {
        if (!selectedMarkets.includes(market)) delete updated[market]
      })
      return updated
    })
    setAppPreviewVideosByMarket((prev) => {
      const updated = { ...prev }
      Object.keys(updated).forEach((market) => {
        if (!selectedMarkets.includes(market)) delete updated[market]
      })
      return updated
    })
    setDesignOrderSentByMarket((prev) => {
      // CHANGE: Clean up designOrderSentByMarket
      const updated = { ...prev }
      Object.keys(updated).forEach((market) => {
        if (!selectedMarkets.includes(market)) delete updated[market]
      })
      return updated
    })
    // CHANGE: Clean up tabletScreenshotSpecs and bannerSpecs
    setTabletScreenshotSpecs((prev) => {
      const updated = { ...prev }
      Object.keys(updated).forEach((market) => {
        if (!selectedMarkets.includes(market)) delete updated[market]
      })
      return updated
    })
    setBannerSpecs((prev) => {
      const updated = { ...prev }
      Object.keys(updated).forEach((market) => {
        if (!selectedMarkets.includes(market)) delete updated[market]
      })
      return updated
    })
    // END CHANGE
    // END CHANGE
  }, [selectedMarkets])

  // Track form changes
  useEffect(() => {
    // This effect will be triggered by any change in the listed states.
    // If any of these states change, it means there are unsaved changes.
    setHasUnsavedChanges(true)
  }, [
    selectedAppId,
    storekitName,
    version,
    platform,
    selectedMarkets,
    owner,
    defaultTitle, // changed from defaultShortDesc
    defaultShortDesc,
    defaultFullDesc,
    dataByMarket,
    metadataByMarket,
    appIcon,
    featureBanner,
    screenshots,
    appPreviewVideos,
    promoVideoUrl,
    promoVideoApplyToAll,
    promoVideoPerMarket,
    promoVideoReferenceFiles,
    sendOrderNow,
    // CHANGE: Thêm các state per-market vào dependency
    designPICByMarket,
    deadlineByMarket,
    priorityByMarket,
    briefByMarket,
    attachmentsByMarket,
    appIconByMarket,
    featureBannerByMarket,
    screenshotsByMarket,
    appPreviewVideosByMarket,
    designOrderSentByMarket, // Thêm state này
    tabletScreenshotSpecs, // Add tabletScreenshotSpecs
    bannerSpecs, // Add bannerSpecs
    // CHANGE: Thêm các state mới của design order vào dependency
    designOrderData,
    // END CHANGE
    // END CHANGE
    // REMOVED: designPIC, deadline, priority, brief, attachments as they were undeclared and likely duplicates of per-market states
  ])

  // Autosave simulation
  useEffect(() => {
    if (hasUnsavedChanges) {
      const timer = setTimeout(() => {
        setIsSaving(true)
        setTimeout(() => {
          setIsSaving(false)
          setLastSaved(new Date())
          setHasUnsavedChanges(false) // Reset hasUnsavedChanges after saving
        }, 1000)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [hasUnsavedChanges, storekitName, version, metadataByMarket, dataByMarket]) // Depend on dataByMarket as well

  // Warn before leaving
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ""
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [hasUnsavedChanges])

  // CHANGE: Removed

  // CHANGE: Removed useEffect that auto-copies defaultTitle, defaultShortDesc, defaultFullDesc to markets
  // User must explicitly click "Copy từ Default" button for each field
  /*
    useEffect(() => {
      if (applyToMarkets && (defaultTitle || defaultShortDesc || defaultFullDesc)) {
        setMetadataByMarket((prev) => {
          const updated = { ...prev }
          selectedMarkets.forEach((market) => {
            if (!updated[market]?.title && defaultTitle) {
              // changed from defaultShortDesc
              updated[market] = { ...updated[market], title: defaultTitle } // changed from defaultShortDesc
            }
            if (!updated[market]?.shortDesc && defaultShortDesc) {
              updated[market] = { ...updated[market], shortDesc: defaultShortDesc }
            }
            if (!updated[market]?.fullDesc && defaultFullDesc) {
              updated[market] = { ...updated[market], fullDesc: defaultFullDesc }
            }
          })
          return updated
        })
      }
    }, [applyToMarkets, defaultTitle, defaultShortDesc, defaultFullDesc, selectedMarkets]) // changed from defaultShortDesc
    */
  // </CHANGE>

  // CHANGE: Cập nhật các effect để sử dụng dữ liệu per-market
  useEffect(() => {
    // Cập nhật dữ liệu cho tab hiện tại khi activeMarketTab thay đổi
    // Logic này có thể cần tinh chỉnh tùy thuộc vào cách bạn muốn quản lý trạng thái khi chuyển tab
    // Ví dụ: Nếu bạn muốn load data của market đó vào các state dùng chung, hoặc chỉ render dựa trên dataByMarket
    // Hiện tại, các hàm getFieldValue và isFieldOverridden đã xử lý điều này.
  }, [activeMarketTab])

  useEffect(() => {
    // Khi chọn một app, có thể cần load dữ liệu mặc định hoặc xóa các thay đổi hiện có
    // Tạm thời, chỉ set selectedAppId.
  }, [selectedAppId])
  // END CHANGE

  // ============================================
  // RENDER
  // ============================================

  // Cancel handler for navigating away
  const handleCancel = useCallback(() => {
    if (hasUnsavedChanges) {
      setShowUnsavedDialog(true)
    } else {
      router.push("/applications/storekit")
    }
  }, [hasUnsavedChanges, router])

  // Mock handlers for asset library actions
  // Cập nhật hàm openAssetLibrary để lưu context và reset selectedAssets
  const openAssetLibrary = (
    type: "campaign" | "screenshot" | "banner" | "screenshot-tablet" | "appicon" | "video" | "feature_graphic" | "app_icon",
    targetId?: string,
  ) => {
    setIsAssetLibraryOpen(true)
    setAssetLibraryContext({ type, targetId })
    setSelectedAssets([]) // Reset selected assets khi mở
  }

  // Hàm mở Asset Library từ Design Order dialog
  const openAssetLibraryForDesignOrder = useCallback((
    type: "campaign" | "appicon" | "banner" | "screenshot" | "tablet" | "video" | "other",
    specId?: string,
    specIndex?: number
  ) => {
    setDesignOrderAssetContext({ type, specId, specIndex })
    setSelectedAssets([]) // Reset selected assets
    setIsAssetLibraryOpen(true)
  }, [])

  // Thêm hàm xử lý confirm chọn assets từ library
  const handleConfirmAssetLibrarySelection = useCallback(() => {
    if (!assetLibraryContext || selectedAssets.length === 0) {
      setIsAssetLibraryOpen(false)
      return
    }

    // Lấy thông tin các assets đã chọn
    const selectedAssetDetails = mockAssetsForLibrary
      .filter(a => selectedAssets.includes(a.id))
      .map(asset => ({
        id: `lib-${asset.id}-${Date.now()}`,
        url: asset.thumbnailUrl || asset.fileUrl,
        name: asset.fileName,
        type: asset.type,
      }))

    // Map context type sang key trong state
    let stateKey = ''
    switch (assetLibraryContext.type) {
      case 'app_icon':
      case 'appicon':
        stateKey = 'app_icon'
        break
      case 'feature_graphic':
      case 'banner':
        stateKey = 'feature_graphic'
        break
      case 'screenshot':
        stateKey = assetLibraryContext.targetId ? `screenshot_${assetLibraryContext.targetId}` : 'screenshot_phone'
        break
      case 'screenshot-tablet':
        stateKey = 'screenshot_tablet'
        break
      case 'video':
        stateKey = 'promo_video_ref'
        break
      default:
        stateKey = assetLibraryContext.type
    }

    // Cập nhật state với assets đã chọn
    setSelectedAssetsFromLibrary(prev => ({
      ...prev,
      [stateKey]: [...(prev[stateKey] || []), ...selectedAssetDetails]
    }))

    toast({
      title: "Assets Added",
      description: `${selectedAssets.length} asset(s) đã được thêm từ Library.`,
    })

    setSelectedAssets([])
    setIsAssetLibraryOpen(false)
    setAssetLibraryContext(null)
  }, [assetLibraryContext, selectedAssets, toast])

  // Hàm xóa asset đã chọn từ library
  const removeAssetFromLibrary = useCallback((stateKey: string, assetId: string) => {
    setSelectedAssetsFromLibrary(prev => ({
      ...prev,
      [stateKey]: (prev[stateKey] || []).filter(a => a.id !== assetId)
    }))
  }, [])

  // Hàm xử lý khi chọn assets từ library và apply vào Design Order
  const handleApplyAssetsToDesignOrder = useCallback(() => {
    if (!designOrderAssetContext || selectedAssets.length === 0) {
      setIsAssetLibraryOpen(false)
      setDesignOrderAssetContext(null)
      return
    }

    const market = activeMarketTab === "default" ? "default" : activeMarketTab
    const currentData = getDesignOrderDataForMarket(market)
    
    // Lấy thông tin các assets đã chọn
    const selectedAssetDetails = mockAssetsForLibrary.filter(a => selectedAssets.includes(a.id))
    const newImages = selectedAssetDetails.map(asset => ({
      id: `lib-${asset.id}-${Date.now()}`,
      url: asset.thumbnailUrl || asset.fileUrl,
      name: asset.fileName,
    }))

    switch (designOrderAssetContext.type) {
      case "campaign":
        // Thêm vào campaign reference images
        updateDesignOrderData(market, {
          campaignReferenceImages: [
            ...currentData.campaignReferenceImages,
            ...newImages.map(img => ({ ...img, size: 0 }))
          ]
        })
        break

      case "appicon":
        // Thêm vào app icon specs reference images
        if (designOrderAssetContext.specIndex !== undefined && currentData.appIconSpecs) {
          const updatedSpecs = [...currentData.appIconSpecs]
          if (updatedSpecs[designOrderAssetContext.specIndex]) {
            updatedSpecs[designOrderAssetContext.specIndex] = {
              ...updatedSpecs[designOrderAssetContext.specIndex],
              referenceImages: [
                ...updatedSpecs[designOrderAssetContext.specIndex].referenceImages,
                ...newImages
              ]
            }
            updateDesignOrderData(market, { appIconSpecs: updatedSpecs })
          }
        }
        break

      case "banner":
        // Thêm vào banner specs reference images
        if (designOrderAssetContext.specId && currentData.bannerSpecs) {
          const updatedSpecs = currentData.bannerSpecs.map(spec => 
            spec.id === designOrderAssetContext.specId 
              ? { ...spec, referenceImages: [...spec.referenceImages, ...newImages] }
              : spec
          )
          updateDesignOrderData(market, { bannerSpecs: updatedSpecs })
        }
        break

      case "screenshot":
        // Thêm vào screenshot specs reference images
        if (designOrderAssetContext.specId && currentData.screenshotSpecs) {
          const updatedSpecs = currentData.screenshotSpecs.map(spec => 
            spec.id === designOrderAssetContext.specId 
              ? { ...spec, referenceImages: [...spec.referenceImages, ...newImages] }
              : spec
          )
          updateDesignOrderData(market, { screenshotSpecs: updatedSpecs })
        }
        break

      case "tablet":
        // Thêm vào tablet screenshot specs reference images
        if (designOrderAssetContext.specId && currentData.tabletScreenshotSpecs) {
          const updatedSpecs = currentData.tabletScreenshotSpecs.map(spec => 
            spec.id === designOrderAssetContext.specId 
              ? { ...spec, referenceImages: [...spec.referenceImages, ...newImages] }
              : spec
          )
          updateDesignOrderData(market, { tabletScreenshotSpecs: updatedSpecs })
        }
        break

      case "video":
        // Thêm vào promo video specs reference videos
        if (designOrderAssetContext.specIndex !== undefined && currentData.promoVideoSpecs) {
          const updatedSpecs = [...currentData.promoVideoSpecs]
          if (updatedSpecs[designOrderAssetContext.specIndex]) {
            updatedSpecs[designOrderAssetContext.specIndex] = {
              ...updatedSpecs[designOrderAssetContext.specIndex],
              referenceVideos: [
                ...updatedSpecs[designOrderAssetContext.specIndex].referenceVideos,
                ...newImages.map(img => ({ ...img, type: 'library' as const }))
              ]
            }
            updateDesignOrderData(market, { promoVideoSpecs: updatedSpecs })
          }
        }
        break
    }

    toast({
      title: "Assets Added",
      description: `${selectedAssets.length} asset(s) đã được thêm vào form.`,
    })

    setSelectedAssets([])
    setIsAssetLibraryOpen(false)
    setDesignOrderAssetContext(null)
  }, [designOrderAssetContext, selectedAssets, activeMarketTab, getDesignOrderDataForMarket, updateDesignOrderData, toast])

  const handleApproveAsset = (assetId: string) => {
    console.log("Approve asset:", assetId)
    // Logic to approve asset
    toast({ title: "Asset Approved", description: `Asset ${assetId} has been approved.` })
  }

  const handleRejectAsset = (assetId: string, reason: string) => {
    console.log("Reject asset:", assetId, "Reason:", reason)
    // Logic to reject asset
    toast({ title: "Asset Rejected", description: `Asset ${assetId} has been rejected. Reason: ${reason}` })
  }

  const [isDesignOrderMenuOpen, setIsDesignOrderMenuOpen] = useState(false)

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-20">
        <div className="px-4 py-0.5">
          {/* Header Actions */}
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/applications/storekit")}
                className="h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-0.5">Create StoreKit</h1>
                <p className="text-sm text-muted-foreground">
                  Điền thông tin để tạo StoreKit mới
                  {selectedApp && ` cho app ${selectedApp.name}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setIsOverviewOpen(true)}>
                <Info className="h-4 w-4 mr-2" />
                Overview
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="outline" onClick={handleSaveDraft} disabled={isSaving || isSubmitting}>
                {isSaving ? "Đang lưu..." : "Save Draft"}
              </Button>
              <Button onClick={handleSubmit} disabled={isSaving || isSubmitting || !isFormValid}>
                {isSubmitting ? "Đang tạo..." : "Create StoreKit"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* General Info Card - Sticky */}
      {/* CHANGE: Changed top position from top-[120px] to top-[56px] to stick right below header */}
      <div ref={generalInfoRef} className="sticky top-[56px] z-20">
        <Card className="rounded-none border-x-0 border-t-0 border-b-0 shadow-sm">
          <CardHeader
            className="px-6 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            onClick={() => setIsGeneralInfoExpanded(!isGeneralInfoExpanded)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isGeneralInfoExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
                <h3 className="text-sm font-semibold">General Info</h3>
              </div>
              <span className="text-sm text-muted-foreground">{isGeneralInfoExpanded ? "Expanded" : "Collapsed"}</span>
            </div>
          </CardHeader>

          {isGeneralInfoExpanded && (
            <CardContent className="px-4 py-0.5">
              <div className="space-y-2">
                {/* Row 1: Select App, StoreKit Name, Version */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Select App */}
                  <div className="space-y-2">
                    <Label htmlFor="filter-app" className="text-xs font-medium">
                      Select App <span className="text-red-500">*</span>
                    </Label>
                    <Select value={selectedAppId} onValueChange={setSelectedAppId}>
                      <SelectTrigger id="filter-app" className="h-9">
                        <SelectValue placeholder="Chọn app" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockApps.map((app) => (
                          <SelectItem key={app.id} value={app.id}>
                            <div className="flex items-center gap-2">
                              <img src={app.icon || "/placeholder.svg"} alt={app.name} className="h-5 w-5 rounded" />
                              <span className="text-sm">{app.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* StoreKit Name */}
                  <div className="space-y-2">
                    <Label htmlFor="filter-name" className="text-xs font-medium">
                      StoreKit Name <span className="text-red-500">*</span>
                    </Label>
                    {/* </CHANGE> */}
                    <Input
                      id="filter-name"
                      placeholder={selectedApp ? `${selectedApp.name} - Summer` : "Tên StoreKit"}
                      value={storekitName}
                      onChange={(e) => setStorekitName(e.target.value)}
                      className="h-9"
                    />
                  </div>

                  {/* Version */}
                  <div className="space-y-2">
                    <Label htmlFor="filter-version" className="text-xs font-medium">
                      Version
                    </Label>
                    <Input
                      id="filter-version"
                      placeholder="v2.1"
                      value={version}
                      onChange={(e) => setVersion(e.target.value)}
                      className="h-9"
                    />
                  </div>
                </div>

                {/* Row 2: OS, Markets, Owner */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* OS */}
                  <div className="space-y-2">
                    <Label htmlFor="filter-os" className="text-xs font-medium">
                      OS <span className="text-red-500">*</span>
                    </Label>
                    <Select value={platform} onValueChange={setPlatform}>
                      <SelectTrigger id="filter-os" className="h-9">
                        <SelectValue placeholder="Chọn OS" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ios">iOS</SelectItem>
                        <SelectItem value="android">Android</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Markets - Multi-select Dropdown */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">
                      Markets <span className="text-red-500">*</span>
                    </Label>
                    <Popover open={marketsOpen} onOpenChange={setMarketsOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={marketsOpen}
                          className="w-full h-9 justify-between font-normal bg-transparent"
                        >
                          {selectedMarkets.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {selectedMarkets.slice(0, 3).map((market) => (
                                <Badge key={market} variant="secondary" className="text-xs px-1.5 py-0">
                                  {market}
                                </Badge>
                              ))}
                              {selectedMarkets.length > 3 && (
                                <Badge variant="secondary" className="text-xs px-1.5 py-0">
                                  +{selectedMarkets.length - 3}
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Chọn markets</span>
                          )}
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Tìm market..." />
                          <CommandEmpty>Không tìm thấy market.</CommandEmpty>
                          <CommandList>
                            <CommandGroup>
                              <CommandItem onSelect={toggleSelectAllMarkets} className="font-medium border-b">
                                <div className="flex items-center gap-2 w-full">
                                  <Checkbox
                                    checked={selectedMarkets.length === allMarkets.length}
                                    className={
                                      selectedMarkets.length > 0 && selectedMarkets.length < allMarkets.length
                                        ? "data-[state=checked]:bg-primary/50"
                                        : ""
                                    }
                                  />
                                  <span>Chọn tất cả ({allMarkets.length})</span>
                                </div>
                              </CommandItem>

                              {allMarkets.map((market) => (
                                <CommandItem
                                  key={market}
                                  onSelect={() => {
                                    toggleMarket(market)
                                  }}
                                >
                                  <div className="flex items-center gap-2 w-full">
                                    <Checkbox checked={selectedMarkets.includes(market)} />
                                    <span>{market}</span>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <p className="text-xs text-muted-foreground">Multi-select; có thể gõ để tìm nhanh</p>
                  </div>

                  {/* Owner */}
                  <div className="space-y-2">
                    <Label htmlFor="filter-owner" className="text-xs font-medium">
                      Owner (ASO PIC)
                    </Label>
                    <Select value={owner} onValueChange={setOwner}>
                      <SelectTrigger id="filter-owner" className="h-9">
                        <SelectValue placeholder="Chọn owner" />
                      </SelectTrigger>
                      <SelectContent>
                        {asoTeamMembers.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Market Tabs Bar - Full Width Sticky */}
      <div
        className={`sticky z-10 bg-background/95 backdrop-blur-sm border-b -mt-px transition-all duration-200 ${
          isTabsBarSticky ? "shadow-sm" : ""
        }`}
        style={{ top: `${tabsBarTop}px` }}
      >
        <div className="px-4 py-2">
          <Tabs value={activeMarketTab} onValueChange={setActiveMarketTab}>
            <TabsList className="h-9">
              {/* Default Tab */}
              <TabsTrigger value="default" className="text-xs">
                Default
              </TabsTrigger>

              {/* Market Tabs */}
              {selectedMarkets.map((market) => (
                <TabsTrigger key={market} value={market} className="text-xs">
                  {market}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Empty State Banner */}
          {selectedMarkets.length === 0 && (
            <Alert className="mt-2">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Chọn Markets trên thanh trên cùng để tạo tab theo thị trường. Tab Default sẽ được áp dụng cho tất cả
                markets.
              </AlertDescription>
            </Alert>
          )}

          {/* Active Tab Indicator */}
          <div className="text-xs text-muted-foreground mt-2">
            Đang chỉnh sửa:{" "}
            <span className="font-medium">
              {activeMarketTab === "default" ? "Default (Áp dụng cho tất cả markets)" : activeMarketTab}
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6" style={{ scrollMarginTop: `${tabsBarTop + 80}px` }}>
          {/* Left Column - Text/Metadata (4/10 width = 40%) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Default Metadata */}
            <Card style={{ scrollMarginTop: `${tabsBarTop + 80}px` }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>
                      {activeMarketTab === "default" ? "Default Metadata" : `Metadata - ${activeMarketTab}`}
                    </CardTitle>
                    <CardDescription>
                      {activeMarketTab === "default"
                        ? "Metadata mặc định sẽ được áp dụng cho tất cả markets"
                        : "Nhập metadata cho market này. Các trường để trống sẽ không sử dụng giá trị từ Default."}
                    </CardDescription>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-xs">
                          Giới hạn hiển thị theo platform và có thể khác ở từng thị trường.
                          {platform === "android" && " Google Play: Title 50 • Short 80 • Full 4000"}{" "}
                          {/* Updated description */}
                          {platform === "ios" && " iOS: Title 30 • Subtitle 30 • Keywords 100"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* iOS Specific Alert */}
                {platform === "ios" && (
                  <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-sm text-blue-900 dark:text-blue-100">
                      <strong>Lưu ý iOS:</strong> iOS không yêu cầu Short/Full description trên App Store, nhưng bạn có
                      thể nhập để dùng nội bộ hoặc cho các mục đích khác.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="defaultTitle">App Title</Label>
                    {activeMarketTab !== "default" && defaultTitle && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const currentData = metadataByMarket[activeMarketTab] || {}
                          setMetadataByMarket({
                            ...metadataByMarket,
                            [activeMarketTab]: {
                              ...currentData,
                              title: defaultTitle,
                            },
                          })
                          toast({
                            title: "Đã copy Title",
                            description: "Title từ Default đã được copy sang market này",
                          })
                        }}
                        className="h-7 text-xs"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy từ Default
                      </Button>
                    )}
                  </div>
                  <Input
                    id="defaultTitle"
                    placeholder="Enter app title"
                    value={
                      activeMarketTab === "default" ? defaultTitle : metadataByMarket[activeMarketTab]?.title || ""
                    }
                    onChange={(e) => {
                      if (activeMarketTab === "default") {
                        setDefaultTitle(e.target.value)
                      } else {
                        const currentData = metadataByMarket[activeMarketTab] || {}
                        setMetadataByMarket({
                          ...metadataByMarket,
                          [activeMarketTab]: {
                            ...currentData,
                            title: e.target.value,
                          },
                        })
                      }
                      setHasUnsavedChanges(true)
                    }}
                    maxLength={limits.title}
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {platform === "ios" ? "App Store: 30 ký tự" : "Google Play: 50 ký tự"} {/* Updated description */}
                    </span>
                    <span
                      className={
                        (activeMarketTab === "default"
                          ? defaultTitle.length
                          : (metadataByMarket[activeMarketTab]?.title || "").length) > limits.title
                          ? "text-red-600 font-medium"
                          : "text-muted-foreground"
                      }
                    >
                      {activeMarketTab === "default"
                        ? defaultTitle.length
                        : (metadataByMarket[activeMarketTab]?.title || "").length}
                      /{limits.title}
                    </span>
                  </div>
                </div>
                {/* </CHANGE> */}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="shortDesc">
                      Short Description
                      {platform === "ios" && <span className="text-xs text-muted-foreground ml-2">(nội bộ)</span>}
                    </Label>
                    {activeMarketTab !== "default" && defaultShortDesc && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          updateFieldValue("shortDesc", defaultShortDesc)
                          toast({
                            title: "Đã copy Short Description",
                            description: "Short Description từ Default đã được copy sang market này",
                          })
                        }}
                        className="h-7 text-xs"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy từ Default
                      </Button>
                    )}
                  </div>
                  <Textarea
                    id="shortDesc"
                    placeholder="Add a short description for your app"
                    value={getFieldValue(activeMarketTab, "shortDesc")}
                    onChange={(e) => updateFieldValue("shortDesc", e.target.value)}
                    rows={2}
                    maxLength={limits.shortDesc}
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {platform === "android" ? "Google Play: 80 ký tự" : "iOS: Chỉ dùng nội bộ"}
                    </span>
                    <span
                      className={
                        getFieldValue(activeMarketTab, "shortDesc").length > limits.shortDesc
                          ? "text-red-600 font-medium"
                          : "text-muted-foreground"
                      }
                    >
                      {getFieldValue(activeMarketTab, "shortDesc").length}/{limits.shortDesc}
                    </span>
                  </div>
                </div>
                {/* </CHANGE> */}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="fullDesc">
                      Full Description
                      {platform === "ios" && <span className="text-xs text-muted-foreground ml-2">(nội bộ)</span>}
                    </Label>
                    {activeMarketTab !== "default" && defaultFullDesc && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          updateFieldValue("fullDesc", defaultFullDesc)
                          toast({
                            title: "Đã copy Full Description",
                            description: "Full Description từ Default đã được copy sang market này",
                          })
                        }}
                        className="h-7 text-xs"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy từ Default
                      </Button>
                    )}
                  </div>
                  <Textarea
                    id="fullDesc"
                    placeholder="Add a full description for your app"
                    value={getFieldValue(activeMarketTab, "fullDesc")}
                    onChange={(e) => updateFieldValue("fullDesc", e.target.value)}
                    rows={6}
                    maxLength={limits.fullDesc}
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {platform === "android" ? "Google Play: 4000 ký tự" : "iOS: Chỉ dùng nội bộ"}
                    </span>
                    <span
                      className={
                        getFieldValue(activeMarketTab, "fullDesc").length > limits.fullDesc
                          ? "text-red-600 font-medium"
                          : "text-muted-foreground"
                      }
                    >
                      {getFieldValue(activeMarketTab, "fullDesc").length}/{limits.fullDesc}
                    </span>
                  </div>
                </div>
                {/* </CHANGE> */}

                {/* Apply to Markets Checkbox - chỉ hiện ở tab Default */}
                {activeMarketTab === "default" && (
                  <>
                    <div className="flex items-center space-x-2 pt-2">
                      <Checkbox
                        id="applyToMarkets"
                        checked={applyToMarkets}
                        onCheckedChange={(checked) => setApplyToMarkets(checked as boolean)}
                      />
                      <Label htmlFor="applyToMarkets" className="text-sm cursor-pointer">
                        Apply to selected markets by default
                      </Label>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Khi bật, metadata mặc định sẽ được điền tự động vào các markets chưa có nội dung. Bạn có thể chỉnh
                      sửa riêng cho từng market sau.
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Graphics/Assets (6/10 width = 60%) */}
          <div className="lg:col-span-6">
            <div className="lg:sticky space-y-6 transition-all duration-200" style={{ top: `${tabsBarTop + 80}px` }}>
              {/* (C) Graphics & Assets */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <span className="font-bold text-blue-600">(C)</span>
                        Graphics & Assets
                        {activeMarketTab !== "default" && <Badge variant="secondary">{activeMarketTab}</Badge>}
                        {/* </CHANGE> */}
                      </CardTitle>
                      <CardDescription>
                        {activeMarketTab === "default"
                          ? "Assets mặc định sẽ được áp dụng cho tất cả markets nếu không có override"
                          : `Assets riêng cho ${activeMarketTab}. Để trống để sử dụng Default hoặc tự upload.`}
                        {/* </CHANGE> */}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {activeMarketTab !== "default" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            copyAssetsFromDefault(activeMarketTab)
                          }}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy từ Default
                        </Button>
                      )}
                      {/* </CHANGE> */}
                      {designOrderSentByMarket[activeMarketTab] ? (
  <DropdownMenu
    open={isDesignOrderMenuOpen}
    onOpenChange={setIsDesignOrderMenuOpen}
  >
    <DropdownMenuTrigger asChild>
      <Button variant="secondary">
        <Clock className="mr-2 h-4 w-4" />
        Đang chờ thiết kế
        <ChevronDown className="ml-2 h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end">
      {/* Xem order */}
      <DropdownMenuItem
        onClick={() => {
          setIsViewMode(true);
          setHasUnsavedChanges(false);
          setIsDesignOrderDialogOpen(true);   // mở dialog
          setIsDesignOrderMenuOpen(false);    // đóng menu
        }}
      >
        <Eye className="mr-4 h-6 w-6" />
        Xem order
      </DropdownMenuItem>

      {/* Chỉnh sửa order */}
      <DropdownMenuItem
        onClick={() => {
          if ((editCountByMarket[activeMarketTab] || 0) >= 5) {
            toast({
              title: "Hết lượt chỉnh sửa",
              description:
                "Bạn đã sử dụng hết 5 lần chỉnh sửa cho market này.",
              variant: "destructive",
            });
            return;
          }

          setIsViewMode(false);
          setHasUnsavedChanges(false);
          setIsDesignOrderDialogOpen(true);   // mở dialog
          setIsDesignOrderMenuOpen(false);    // đóng menu
        }}
      >
        <Pencil className="mr-2 h-4 w-4" />
        Chỉnh sửa order
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
) : (
  <Button
    onClick={() => {
      setIsViewMode(false)
      setHasUnsavedChanges(false)
      setIsDesignOrderDialogOpen(true)
      setIsDesignOrderMenuOpen(false)   // nếu nút này nằm trong dropdown
    }}
    disabled={!isGeneralInfoComplete}
    variant="outline"
  >
    <Send className="mr-2 h-4 w-4" />
    Order Design
  </Button>
)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {activeMarketTab === "default" ? (
                    <>
                      {/* Default assets rendering */}
                      <div className="space-y-2">
                        <Label>App Icon</Label>
                        <p className="text-xs text-muted-foreground">1024×1024 PNG/JPG</p>

                        {/* Upload method buttons */}
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          <Button
                            variant={uploadMethod["app_icon"] === "design" ? "default" : "outline"}
                            size="sm"
                            className="w-full"
                            onClick={() => setUploadMethod({ ...uploadMethod, app_icon: "design" })}
                          >
                            <Palette className="h-4 w-4 mr-1" />
                            From Design
                          </Button>
                          <Button
                            variant={uploadMethod["app_icon"] === "device" ? "default" : "outline"}
                            size="sm"
                            className="w-full"
                            onClick={() => setUploadMethod({ ...uploadMethod, app_icon: "device" })}
                          >
                            <Upload className="h-4 w-4 mr-1" />
                            Upload
                          </Button>
                          <Button
                            variant={uploadMethod["app_icon"] === "library" ? "default" : "outline"}
                            size="sm"
                            className="w-full"
                            onClick={() => openAssetLibrary("appicon")}
                          >
                            <FolderOpen className="h-4 w-4 mr-1" />
                            Library
                          </Button>
                        </div>

                        {/* Upload area based on selected method */}
                        {uploadMethod["app_icon"] === "design" && (
                          <div className="space-y-2">
                            {pendingAssets.filter((a) => a.type === "app_icon" && a.status === "pending").length > 0 ? (
                              <div className="space-y-2">
                                {pendingAssets
                                  .filter((a) => a.type === "app_icon" && a.status === "pending")
                                  .map((asset) => (
                                    <div
                                      key={asset.id}
                                      className="border rounded-lg p-3 bg-yellow-50 dark:bg-yellow-900/20"
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                                          <ImageIcon className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <div className="flex-1">
                                          <p className="text-sm font-medium">{asset.fileName}</p>
                                          <p className="text-xs text-muted-foreground">
                                            Từ {asset.uploaderName} • {asset.uploadDate}
                                          </p>
                                          <Badge variant="secondary" className="mt-1">
                                            Pending Approval
                                          </Badge>
                                        </div>
                                        <div className="flex gap-1">
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleApproveAsset(asset.id)}
                                          >
                                            <Check className="h-4 w-4 mr-1" />
                                            Approve
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                              const reason = prompt("Lý do từ chối:")
                                              if (reason) handleRejectAsset(asset.id, reason)
                                            }}
                                          >
                                            <X className="h-4 w-4 mr-1" />
                                            Reject
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            ) : (
                              <Alert>
                                <Info className="h-4 w-4" />
                                <AlertDescription className="text-xs">
                                  Chờ Design team gửi assets. Khi có assets mới, bạn sẽ cần phê duyệt trước khi hiển
                                  thị.
                                </AlertDescription>
                              </Alert>
                            )}
                          </div>
                        )}

                        {uploadMethod["app_icon"] === "device" && (
                          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center hover:border-blue-400 dark:hover:border-blue-600 transition-colors cursor-pointer">
                            <div className="flex flex-col items-center gap-2">
                              <ImageIcon className="h-8 w-8 text-muted-foreground" />
                              <p className="text-xs text-muted-foreground">Click hoặc kéo thả file vào đây</p>
                              <Button size="sm" variant="outline">
                                <Upload className="h-4 w-4 mr-1" />
                                Chọn file
                              </Button>
                            </div>
                          </div>
                        )}

                        {uploadMethod["app_icon"] === "library" && (
                          <Alert>
                            <FolderOpen className="h-4 w-4" />
                            <AlertDescription className="text-xs">
                              Click vào nút "Library" để chọn từ Asset Management
                            </AlertDescription>
                          </Alert>
                        )}

                        {/* Show approved assets */}
                        {pendingAssets.filter((a) => a.type === "app_icon" && a.status === "approved").length > 0 && (
                          <div className="mt-2">
                            {pendingAssets
                              .filter((a) => a.type === "app_icon" && a.status === "approved")
                              .map((asset) => (
                                <div key={asset.id} className="border rounded-lg p-3 bg-green-50 dark:bg-green-900/20">
                                  <div className="flex items-center gap-3">
                                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                                      <ImageIcon className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-sm font-medium">{asset.fileName}</p>
                                      <Badge variant="default" className="mt-1 bg-green-600">
                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                        Approved
                                      </Badge>
                                    </div>
                                    <Button size="sm" variant="ghost">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>

                      {(platform === "android" || platform === "both") && (
                        <div className="space-y-2">
                          <Label>Feature Graphic/Banner</Label>
                          <p className="text-xs text-muted-foreground">1024×500 PNG/JPG</p>

                          <div className="grid grid-cols-3 gap-2 mb-3">
                            <Button
                              variant={uploadMethod["feature_graphic"] === "design" ? "default" : "outline"}
                              size="sm"
                              className="w-full"
                              onClick={() => setUploadMethod({ ...uploadMethod, feature_graphic: "design" })}
                            >
                              <Palette className="h-4 w-4 mr-1" />
                              From Design
                            </Button>
                            <Button
                              variant={uploadMethod["feature_graphic"] === "device" ? "default" : "outline"}
                              size="sm"
                              className="w-full"
                              onClick={() => setUploadMethod({ ...uploadMethod, feature_graphic: "device" })}
                            >
                              <Upload className="h-4 w-4 mr-1" />
                              Upload
                            </Button>
                            <Button
                              variant={uploadMethod["feature_graphic"] === "library" ? "default" : "outline"}
                              size="sm"
                              className="w-full"
                              onClick={() => openAssetLibrary("banner")}
                            >
                              <FolderOpen className="h-4 w-4 mr-1" />
                              Library
                            </Button>
                          </div>

                          {uploadMethod["feature_graphic"] === "device" && (
                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center hover:border-blue-400 dark:hover:border-blue-600 transition-colors cursor-pointer">
                              <div className="flex flex-col items-center gap-2">
                                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                <p className="text-xs text-muted-foreground">Click hoặc kéo thả file vào đây</p>
                                <Button size="sm" variant="outline">
                                  <Upload className="h-4 w-4 mr-1" />
                                  Chọn file
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label>Screenshots</Label>
                        <p className="text-xs text-muted-foreground mb-2">
                          Khuyến nghị: 6-8 ảnh/thiết bị. Lưu ý không có text bị cắt.
                        </p>
                        {platform ? (
                          <Tabs defaultValue={platform === "ios" ? "iphone" : "phone"}>
                            <TabsList
                              className="grid w-full"
                              style={{
                                gridTemplateColumns: `repeat(${platform === "ios" || platform === "both" ? 2 : 2}, 1fr)`,
                              }}
                            >
                              {(platform === "ios" || platform === "both") && (
                                <>
                                  <TabsTrigger value="iphone">iPhone</TabsTrigger>
                                  <TabsTrigger value="ipad">iPad</TabsTrigger>
                                </>
                              )}
                              {(platform === "android" || platform === "both") && (
                                <>
                                  <TabsTrigger value="phone">Phone</TabsTrigger>
                                  <TabsTrigger value="tablet">Tablet</TabsTrigger>
                                </>
                              )}
                            </TabsList>

                            {/* iPhone Tab */}
                            {(platform === "ios" || platform === "both") && (
                              <TabsContent value="iphone" className="space-y-2 mt-3">
                                <div className="grid grid-cols-3 gap-2">
                                  <Button
                                    variant={uploadMethod["screenshot_iphone"] === "design" ? "default" : "outline"}
                                    size="sm"
                                    className="w-full"
                                    onClick={() => setUploadMethod({ ...uploadMethod, screenshot_iphone: "design" })}
                                  >
                                    <Palette className="h-4 w-4 mr-1" />
                                    From Design
                                  </Button>
                                  <Button
                                    variant={uploadMethod["screenshot_iphone"] === "device" ? "default" : "outline"}
                                    size="sm"
                                    className="w-full"
                                    onClick={() => setUploadMethod({ ...uploadMethod, screenshot_iphone: "device" })}
                                  >
                                    <Upload className="h-4 w-4 mr-1" />
                                    Upload
                                  </Button>
                                  <Button
                                    variant={uploadMethod["screenshot_iphone"] === "library" ? "default" : "outline"}
                                    size="sm"
                                    className="w-full"
                                    onClick={() => openAssetLibrary("screenshot", "iphone")}
                                  >
                                    <FolderOpen className="h-4 w-4 mr-1" />
                                    Library
                                  </Button>
                                </div>

                                {uploadMethod["screenshot_iphone"] === "device" && (
                                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center hover:border-blue-400 dark:hover:border-blue-600 transition-colors cursor-pointer">
                                    <div className="flex flex-col items-center gap-2">
                                      <Upload className="h-6 w-6 text-muted-foreground" />
                                      <p className="text-xs text-muted-foreground">Upload iPhone screenshots</p>
                                      <Button size="sm" variant="outline">
                                        <Upload className="h-4 w-4 mr-1" />
                                        Chọn file
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </TabsContent>
                            )}

                            {/* iPad Tab */}
                            {(platform === "ios" || platform === "both") && (
                              <TabsContent value="ipad" className="space-y-2 mt-3">
                                <div className="grid grid-cols-3 gap-2">
                                  <Button
                                    variant={uploadMethod["screenshot_ipad"] === "design" ? "default" : "outline"}
                                    size="sm"
                                    className="w-full"
                                    onClick={() => setUploadMethod({ ...uploadMethod, screenshot_ipad: "design" })}
                                  >
                                    <Palette className="h-4 w-4 mr-1" />
                                    From Design
                                  </Button>
                                  <Button
                                    variant={uploadMethod["screenshot_ipad"] === "device" ? "default" : "outline"}
                                    size="sm"
                                    className="w-full"
                                    onClick={() => setUploadMethod({ ...uploadMethod, screenshot_ipad: "device" })}
                                  >
                                    <Upload className="h-4 w-4 mr-1" />
                                    Upload
                                  </Button>
                                  <Button
                                    variant={uploadMethod["screenshot_ipad"] === "library" ? "default" : "outline"}
                                    size="sm"
                                    className="w-full"
                                    onClick={() => openAssetLibrary("screenshot", "ipad")}
                                  >
                                    <FolderOpen className="h-4 w-4 mr-1" />
                                    Library
                                  </Button>
                                </div>

                                {uploadMethod["screenshot_ipad"] === "device" && (
                                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center hover:border-blue-400 dark:hover:border-blue-600 transition-colors cursor-pointer">
                                    <div className="flex flex-col items-center gap-2">
                                      <Upload className="h-6 w-6 text-muted-foreground" />
                                      <p className="text-xs text-muted-foreground">Upload iPad screenshots</p>
                                      <Button size="sm" variant="outline">
                                        <Upload className="h-4 w-4 mr-1" />
                                        Chọn file
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </TabsContent>
                            )}

                            {/* Phone Tab (Android) */}
                            {(platform === "android" || platform === "both") && (
                              <TabsContent value="phone" className="space-y-2 mt-3">
                                <div className="grid grid-cols-3 gap-2">
                                  <Button
                                    variant={uploadMethod["screenshot_phone"] === "design" ? "default" : "outline"}
                                    size="sm"
                                    className="w-full"
                                    onClick={() => setUploadMethod({ ...uploadMethod, screenshot_phone: "design" })}
                                  >
                                    <Palette className="h-4 w-4 mr-1" />
                                    From Design
                                  </Button>
                                  <Button
                                    variant={uploadMethod["screenshot_phone"] === "device" ? "default" : "outline"}
                                    size="sm"
                                    className="w-full"
                                    onClick={() => setUploadMethod({ ...uploadMethod, screenshot_phone: "device" })}
                                  >
                                    <Upload className="h-4 w-4 mr-1" />
                                    Upload
                                  </Button>
                                  <Button
                                    variant={uploadMethod["screenshot_phone"] === "library" ? "default" : "outline"}
                                    size="sm"
                                    className="w-full"
                                    onClick={() => openAssetLibrary("screenshot", "phone")}
                                  >
                                    <FolderOpen className="h-4 w-4 mr-1" />
                                    Library
                                  </Button>
                                </div>

                                {uploadMethod["screenshot_phone"] === "device" && (
                                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center hover:border-blue-400 dark:hover:border-blue-600 transition-colors cursor-pointer">
                                    <div className="flex flex-col items-center gap-2">
                                      <Upload className="h-6 w-6 text-muted-foreground" />
                                      <p className="text-xs text-muted-foreground">Upload Phone screenshots</p>
                                      <Button size="sm" variant="outline">
                                        <Upload className="h-4 w-4 mr-1" />
                                        Chọn file
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </TabsContent>
                            )}

                            {/* Tablet Tab (Android) */}
                            {(platform === "android" || platform === "both") && (
                              <TabsContent value="tablet" className="space-y-2 mt-3">
                                <div className="grid grid-cols-3 gap-2">
                                  <Button
                                    variant={uploadMethod["screenshot_tablet"] === "design" ? "default" : "outline"}
                                    size="sm"
                                    className="w-full"
                                    onClick={() => setUploadMethod({ ...uploadMethod, screenshot_tablet: "design" })}
                                  >
                                    <Palette className="h-4 w-4 mr-1" />
                                    From Design
                                  </Button>
                                  <Button
                                    variant={uploadMethod["screenshot_tablet"] === "device" ? "default" : "outline"}
                                    size="sm"
                                    className="w-full"
                                    onClick={() => setUploadMethod({ ...uploadMethod, screenshot_tablet: "device" })}
                                  >
                                    <Upload className="h-4 w-4 mr-1" />
                                    Upload
                                  </Button>
                                  <Button
                                    variant={uploadMethod["screenshot_tablet"] === "library" ? "default" : "outline"}
                                    size="sm"
                                    className="w-full"
                                    onClick={() => openAssetLibrary("screenshot-tablet", "tablet")} // Changed to screenshot-tablet
                                  >
                                    <FolderOpen className="h-4 w-4 mr-1" />
                                    Library
                                  </Button>
                                </div>

                                {uploadMethod["screenshot_tablet"] === "device" && (
                                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center hover:border-blue-400 dark:hover:border-blue-600 transition-colors cursor-pointer">
                                    <div className="flex flex-col items-center gap-2">
                                      <Upload className="h-6 w-6 text-muted-foreground" />
                                      <p className="text-xs text-muted-foreground">Upload Tablet screenshots</p>
                                      <Button size="sm" variant="outline">
                                        <Upload className="h-4 w-4 mr-1" />
                                        Chọn file
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </TabsContent>
                            )}
                          </Tabs>
                        ) : (
                          <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>Vui lòng chọn Platform trước</AlertDescription>
                          </Alert>
                        )}
                      </div>

                      {/* Order Summary - Conditionally rendered when sendOrderNow is true */}
                      {sendOrderNow && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                            <CardDescription>Tóm tắt order gửi Design</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3 text-sm">
                            <div>
                              <span className="text-muted-foreground">App:</span>
                              <span className="ml-2 font-medium">{selectedApp?.name || "—"}</span>
                            </div>
                            <Separator />
                            <div>
                              <span className="text-muted-foreground">Markets:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {selectedMarkets.map((market) => (
                                  <Badge key={market} variant="secondary" className="text-xs">
                                    {market}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <Separator />
                            <div>
                              <span className="text-muted-foreground">Assets cần làm:</span>
                              <ul className="list-disc list-inside mt-1 space-y-1">
                                <li>App Icon (1024×1024)</li>
                                {(platform === "android" || platform === "both") && <li>Feature Graphic (1024×500)</li>}
                                <li>Screenshots ({platform === "ios" ? "iPhone/iPad" : "Phone/Tablet"})</li>
                                {(platform === "ios" || platform === "both") && <li>App Previews (iPhone/iPad)</li>}
                              </ul>
                            </div>
                            <Separator />
                            <div>
                              <span className="text-muted-foreground">Priority:</span>
                              <Badge
                                variant={priorityByMarket[activeMarketTab] === "high" ? "destructive" : "secondary"}
                                className="ml-2 text-xs"
                              >
                                {" "}
                                {/* CHANGE: Use per-market priority */}
                                {priorityByMarket[activeMarketTab] === "high" ? "High" : "Normal"}{" "}
                                {/* CHANGE: Use per-market priority */}
                              </Badge>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Deadline:</span>
                              <span className="ml-2 font-medium">{deadlineByMarket[activeMarketTab] || "—"}</span>{" "}
                              {/* CHANGE: Use per-market deadline */}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Promo Video (YouTube) for Android */}
                      {(platform === "android" || platform === "both") && (
                        <div className="space-y-4 pt-4 border-t">
                          <div className="flex items-center justify-between">
                            <Label className="flex items-center gap-2">
                              <Video className="h-4 w-4" />
                              Promo Video (YouTube)
                            </Label>
                            {hasValidPromoVideo() && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Tải video lên YouTube (Public hoặc Unlisted) rồi dán link vào đây.
                          </p>

                          {/* YouTube URL Input */}
                          <div className="space-y-2">
                            <Label htmlFor="promoVideoUrl">YouTube URL</Label>
                            <div className="flex gap-2">
                              <Input
                                id="promoVideoUrl"
                                placeholder="https://www.youtube.com/watch?v=k-kucvvfKnw"
                                value={promoVideoUrl}
                                onChange={(e) => {
                                  setPromoVideoUrl(e.target.value)
                                  setPromoVideoValid(null)
                                }}
                                className={promoVideoValid === false ? "border-red-500 focus-visible:ring-red-500" : ""}
                              />
                              <Button variant="outline" size="sm" onClick={handleTestPromoVideo}>
                                Test
                              </Button>
                              {promoVideoUrl && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setPromoVideoUrl("")
                                    setPromoVideoValid(null)
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                            {promoVideoValid === false && (
                              <p className="text-xs text-red-600">Link không đúng định dạng YouTube hợp lệ</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              Chấp nhận: youtube.com/watch?v=..., youtu.be/..., youtube.com/shorts/...
                            </p>
                          </div>

                          {/* Preview Embed */}
                          {promoVideoValid && promoVideoUrl && (
                            <div className="space-y-2">
                              <Label>Preview</Label>
                              <div className="relative w-full aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                                <iframe
                                  src={`https://www.youtube.com/embed/${getYouTubeVideoId(promoVideoUrl)}`}
                                  className="w-full h-full"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                />
                              </div>
                            </div>
                          )}

                          {/* Apply to all markets toggle */}
                          <div className="flex items-center space-x-2 pt-2">
                            <Checkbox
                              id="promoVideoApplyToAll"
                              checked={promoVideoApplyToAll}
                              onCheckedChange={(checked) => setPromoVideoApplyToAll(checked as boolean)}
                            />
                            <Label htmlFor="promoVideoApplyToAll" className="text-sm cursor-pointer">
                              Apply to all markets
                            </Label>
                          </div>

                          {/* Per-market URLs */}
                          {!promoVideoApplyToAll && selectedMarkets.length > 0 && (
                            <div className="space-y-2 pt-2 border-t">
                              <Label className="text-sm">YouTube URL per Market</Label>
                              <div className="space-y-2">
                                {selectedMarkets.map((market) => (
                                  <div key={market} className="flex items-center gap-2">
                                    <Badge variant="secondary" className="w-12 justify-center">
                                      {market}
                                    </Badge>
                                    <Input
                                      placeholder="YouTube URL"
                                      value={promoVideoPerMarket[market] || ""}
                                      onChange={(e) =>
                                        setPromoVideoPerMarket((prev) => ({
                                          ...prev,
                                          [market]: e.target.value,
                                        }))
                                      }
                                      className="flex-1"
                                    />
                                    {promoVideoUrl && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        title="Copy from default"
                                        onClick={() =>
                                          setPromoVideoPerMarket((prev) => ({
                                            ...prev,
                                            [market]: promoVideoUrl,
                                          }))
                                        }
                                      >
                                        <Copy className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="space-y-2 pt-2 border-t">
                            <Label>Reference File (optional)</Label>
                            <p className="text-xs text-muted-foreground">
                              File này không dùng để publish, chỉ lưu nội bộ. Vui lòng upload lên YouTube rồi dán link ở
                              trên.
                            </p>

                            <div className="grid grid-cols-3 gap-2 mb-2">
                              <Button
                                variant={uploadMethod["promo_video_ref"] === "design" ? "default" : "outline"}
                                size="sm"
                                className="w-full"
                                onClick={() => setUploadMethod({ ...uploadMethod, promo_video_ref: "design" })}
                              >
                                <Palette className="h-4 w-4 mr-1" />
                                From Design
                              </Button>
                              <Button
                                variant={uploadMethod["promo_video_ref"] === "device" ? "default" : "outline"}
                                size="sm"
                                className="w-full"
                                onClick={() => setUploadMethod({ ...uploadMethod, promo_video_ref: "device" })}
                              >
                                <Upload className="h-4 w-4 mr-1" />
                                Upload
                              </Button>
                              <Button
                                variant={uploadMethod["promo_video_ref"] === "library" ? "default" : "outline"}
                                size="sm"
                                className="w-full"
                                onClick={() => openAssetLibrary("video", "promo")}
                              >
                                <FolderOpen className="h-4 w-4 mr-1" />
                                Library
                              </Button>
                            </div>

                            {uploadMethod["promo_video_ref"] === "device" && (
                              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-3 text-center hover:border-blue-400 dark:hover:border-blue-600 transition-colors cursor-pointer">
                                <div className="flex flex-col items-center gap-2">
                                  <Upload className="h-6 w-6 text-muted-foreground" />
                                  <p className="text-xs text-muted-foreground">Kéo thả MP4/MOV để lưu nội bộ</p>
                                  <Button size="sm" variant="outline">
                                    <Upload className="h-4 w-4 mr-1" />
                                    Chọn file
                                  </Button>
                                </div>
                              </div>
                            )}

                            {/* Reference Files List */}
                            {promoVideoReferenceFiles.length > 0 && (
                              <div className="space-y-2 mt-2">
                                {promoVideoReferenceFiles.map((file, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-2 p-2 border rounded-lg bg-gray-50 dark:bg-gray-800"
                                  >
                                    <Video className="h-4 w-4 text-muted-foreground" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-medium truncate">{file.name}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Button variant="ghost" size="sm" title="Preview">
                                        <Play className="h-3 w-3" />
                                      </Button>
                                      <Button variant="ghost" size="sm" title="Download">
                                        <Download className="h-3 w-3" />
                                      </Button>
                                      <Button variant="ghost" size="sm" title="Remove">
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Info about video specs */}
                          <Alert>
                            <Info className="h-4 w-4" />
                            <AlertDescription className="text-xs space-y-1">
                              <p>
                                <strong>Độ phân giải:</strong> 1920×1080 (landscape) hoặc 1080×1920 (portrait)
                              </p>
                              <p>
                                <strong>Độ dài:</strong> 30 giây – 2 phút
                              </p>
                              <p>
                                <strong>Định dạng:</strong> H.264/MPEG-4
                              </p>
                            </AlertDescription>
                          </Alert>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Market-specific assets rendering */}
                      <div className="space-y-2">
                        <Label>App Icon</Label>
                        <p className="text-xs text-muted-foreground">1024×1024 PNG/JPG</p>

                        {/* Upload method buttons */}
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          <Button
                            variant={uploadMethod["app_icon"] === "design" ? "default" : "outline"}
                            size="sm"
                            className="w-full"
                            onClick={() => setUploadMethod({ ...uploadMethod, app_icon: "design" })}
                          >
                            <Palette className="h-4 w-4 mr-1" />
                            From Design
                          </Button>
                          <Button
                            variant={uploadMethod["app_icon"] === "device" ? "default" : "outline"}
                            size="sm"
                            className="w-full"
                            onClick={() => setUploadMethod({ ...uploadMethod, app_icon: "device" })}
                          >
                            <Upload className="h-4 w-4 mr-1" />
                            Upload
                          </Button>
                          <Button
                            variant={uploadMethod["app_icon"] === "library" ? "default" : "outline"}
                            size="sm"
                            className="w-full"
                            onClick={() => openAssetLibrary("app_icon")}
                          >
                            <FolderOpen className="h-4 w-4 mr-1" />
                            Library
                          </Button>
                        </div>

                        {/* Upload area based on selected method */}
                        {uploadMethod["app_icon"] === "design" && (
                          <div className="space-y-2">
                            {pendingAssets.filter((a) => a.type === "app_icon" && a.status === "pending").length > 0 ? (
                              <div className="space-y-2">
                                {pendingAssets
                                  .filter((a) => a.type === "app_icon" && a.status === "pending")
                                  .map((asset) => (
                                    <div
                                      key={asset.id}
                                      className="border rounded-lg p-3 bg-yellow-50 dark:bg-yellow-900/20"
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                                          <ImageIcon className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <div className="flex-1">
                                          <p className="text-sm font-medium">{asset.fileName}</p>
                                          <p className="text-xs text-muted-foreground">
                                            Từ {asset.uploaderName} • {asset.uploadDate}
                                          </p>
                                          <Badge variant="secondary" className="mt-1">
                                            Pending Approval
                                          </Badge>
                                        </div>
                                        <div className="flex gap-1">
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleApproveAsset(asset.id)}
                                          >
                                            <Check className="h-4 w-4 mr-1" />
                                            Approve
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                              const reason = prompt("Lý do từ chối:")
                                              if (reason) handleRejectAsset(asset.id, reason)
                                            }}
                                          >
                                            <X className="h-4 w-4 mr-1" />
                                            Reject
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            ) : (
                              <Alert>
                                <Info className="h-4 w-4" />
                                <AlertDescription className="text-xs">
                                  Chờ Design team gửi assets. Khi có assets mới, bạn sẽ cần phê duyệt trước khi hiển
                                  thị.
                                </AlertDescription>
                              </Alert>
                            )}
                          </div>
                        )}

                        {uploadMethod["app_icon"] === "device" && (
                          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center hover:border-blue-400 dark:hover:border-blue-600 transition-colors cursor-pointer">
                            <div className="flex flex-col items-center gap-2">
                              <ImageIcon className="h-8 w-8 text-muted-foreground" />
                              <p className="text-xs text-muted-foreground">Click hoặc kéo thả file vào đây</p>
                              <Button size="sm" variant="outline">
                                <Upload className="h-4 w-4 mr-1" />
                                Chọn file
                              </Button>
                            </div>
                          </div>
                        )}

                        {uploadMethod["app_icon"] === "library" && (
                          <Alert>
                            <FolderOpen className="h-4 w-4" />
                            <AlertDescription className="text-xs">
                              Click vào nút "Library" để chọn từ Asset Management
                            </AlertDescription>
                          </Alert>
                        )}

                        {/* Show approved assets */}
                        {pendingAssets.filter((a) => a.type === "app_icon" && a.status === "approved").length > 0 && (
                          <div className="mt-2">
                            {pendingAssets
                              .filter((a) => a.type === "app_icon" && a.status === "approved")
                              .map((asset) => (
                                <div key={asset.id} className="border rounded-lg p-3 bg-green-50 dark:bg-green-900/20">
                                  <div className="flex items-center gap-3">
                                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                                      <ImageIcon className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-sm font-medium">{asset.fileName}</p>
                                      <Badge variant="default" className="mt-1 bg-green-600">
                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                        Approved
                                      </Badge>
                                    </div>
                                    <Button size="sm" variant="ghost">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>

                      {(platform === "android" || platform === "both") && (
                        <div className="space-y-2">
                          <Label>Feature Graphic/Banner</Label>
                          <p className="text-xs text-muted-foreground">1024×500 PNG/JPG</p>

                          <div className="grid grid-cols-3 gap-2 mb-3">
                            <Button
                              variant={uploadMethod["feature_graphic"] === "design" ? "default" : "outline"}
                              size="sm"
                              className="w-full"
                              onClick={() => setUploadMethod({ ...uploadMethod, feature_graphic: "design" })}
                            >
                              <Palette className="h-4 w-4 mr-1" />
                              From Design
                            </Button>
                            <Button
                              variant={uploadMethod["feature_graphic"] === "device" ? "default" : "outline"}
                              size="sm"
                              className="w-full"
                              onClick={() => setUploadMethod({ ...uploadMethod, feature_graphic: "device" })}
                            >
                              <Upload className="h-4 w-4 mr-1" />
                              Upload
                            </Button>
                            <Button
                              variant={uploadMethod["feature_graphic"] === "library" ? "default" : "outline"}
                              size="sm"
                              className="w-full"
                              onClick={() => openAssetLibrary("feature_graphic")}
                            >
                              <FolderOpen className="h-4 w-4 mr-1" />
                              Library
                            </Button>
                          </div>

                          {uploadMethod["feature_graphic"] === "device" && (
                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center hover:border-blue-400 dark:hover:border-blue-600 transition-colors cursor-pointer">
                              <div className="flex flex-col items-center gap-2">
                                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                <p className="text-xs text-muted-foreground">Click hoặc kéo thả file vào đây</p>
                                <Button size="sm" variant="outline">
                                  <Upload className="h-4 w-4 mr-1" />
                                  Chọn file
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label>Screenshots</Label>
                        <p className="text-xs text-muted-foreground mb-2">
                          Khuyến nghị: 6-8 ảnh/thiết bị. Lưu ý không có text bị cắt.
                        </p>
                        {platform ? (
                          <Tabs defaultValue={platform === "ios" ? "iphone" : "phone"}>
                            <TabsList
                              className="grid w-full"
                              style={{
                                gridTemplateColumns: `repeat(${platform === "ios" || platform === "both" ? 2 : 2}, 1fr)`,
                              }}
                            >
                              {(platform === "ios" || platform === "both") && (
                                <>
                                  <TabsTrigger value="iphone">iPhone</TabsTrigger>
                                  <TabsTrigger value="ipad">iPad</TabsTrigger>
                                </>
                              )}
                              {(platform === "android" || platform === "both") && (
                                <>
                                  <TabsTrigger value="phone">Phone</TabsTrigger>
                                  <TabsTrigger value="tablet">Tablet</TabsTrigger>
                                </>
                              )}
                            </TabsList>

                            {/* iPhone Tab */}
                            {(platform === "ios" || platform === "both") && (
                              <TabsContent value="iphone" className="space-y-2 mt-3">
                                <div className="grid grid-cols-3 gap-2">
                                  <Button
                                    variant={uploadMethod["screenshot_iphone"] === "design" ? "default" : "outline"}
                                    size="sm"
                                    className="w-full"
                                    onClick={() => setUploadMethod({ ...uploadMethod, screenshot_iphone: "design" })}
                                  >
                                    <Palette className="h-4 w-4 mr-1" />
                                    From Design
                                  </Button>
                                  <Button
                                    variant={uploadMethod["screenshot_iphone"] === "device" ? "default" : "outline"}
                                    size="sm"
                                    className="w-full"
                                    onClick={() => setUploadMethod({ ...uploadMethod, screenshot_iphone: "device" })}
                                  >
                                    <Upload className="h-4 w-4 mr-1" />
                                    Upload
                                  </Button>
                                  <Button
                                    variant={uploadMethod["screenshot_iphone"] === "library" ? "default" : "outline"}
                                    size="sm"
                                    className="w-full"
                                    onClick={() => openAssetLibrary("screenshot", "iphone")}
                                  >
                                    <FolderOpen className="h-4 w-4 mr-1" />
                                    Library
                                  </Button>
                                </div>

                                {uploadMethod["screenshot_iphone"] === "device" && (
                                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center hover:border-blue-400 dark:hover:border-blue-600 transition-colors cursor-pointer">
                                    <div className="flex flex-col items-center gap-2">
                                      <Upload className="h-6 w-6 text-muted-foreground" />
                                      <p className="text-xs text-muted-foreground">Upload iPhone screenshots</p>
                                      <Button size="sm" variant="outline">
                                        <Upload className="h-4 w-4 mr-1" />
                                        Chọn file
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </TabsContent>
                            )}

                            {/* iPad Tab */}
                            {(platform === "ios" || platform === "both") && (
                              <TabsContent value="ipad" className="space-y-2 mt-3">
                                <div className="grid grid-cols-3 gap-2">
                                  <Button
                                    variant={uploadMethod["screenshot_ipad"] === "design" ? "default" : "outline"}
                                    size="sm"
                                    className="w-full"
                                    onClick={() => setUploadMethod({ ...uploadMethod, screenshot_ipad: "design" })}
                                  >
                                    <Palette className="h-4 w-4 mr-1" />
                                    From Design
                                  </Button>
                                  <Button
                                    variant={uploadMethod["screenshot_ipad"] === "device" ? "default" : "outline"}
                                    size="sm"
                                    className="w-full"
                                    onClick={() => setUploadMethod({ ...uploadMethod, screenshot_ipad: "device" })}
                                  >
                                    <Upload className="h-4 w-4 mr-1" />
                                    Upload
                                  </Button>
                                  <Button
                                    variant={uploadMethod["screenshot_ipad"] === "library" ? "default" : "outline"}
                                    size="sm"
                                    className="w-full"
                                    onClick={() => openAssetLibrary("screenshot", "ipad")}
                                  >
                                    <FolderOpen className="h-4 w-4 mr-1" />
                                    Library
                                  </Button>
                                </div>

                                {uploadMethod["screenshot_ipad"] === "device" && (
                                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center hover:border-blue-400 dark:hover:border-blue-600 transition-colors cursor-pointer">
                                    <div className="flex flex-col items-center gap-2">
                                      <Upload className="h-6 w-6 text-muted-foreground" />
                                      <p className="text-xs text-muted-foreground">Upload iPad screenshots</p>
                                      <Button size="sm" variant="outline">
                                        <Upload className="h-4 w-4 mr-1" />
                                        Chọn file
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </TabsContent>
                            )}

                            {/* Phone Tab (Android) */}
                            {(platform === "android" || platform === "both") && (
                              <TabsContent value="phone" className="space-y-2 mt-3">
                                <div className="grid grid-cols-3 gap-2">
                                  <Button
                                    variant={uploadMethod["screenshot_phone"] === "design" ? "default" : "outline"}
                                    size="sm"
                                    className="w-full"
                                    onClick={() => setUploadMethod({ ...uploadMethod, screenshot_phone: "design" })}
                                  >
                                    <Palette className="h-4 w-4 mr-1" />
                                    From Design
                                  </Button>
                                  <Button
                                    variant={uploadMethod["screenshot_phone"] === "device" ? "default" : "outline"}
                                    size="sm"
                                    className="w-full"
                                    onClick={() => setUploadMethod({ ...uploadMethod, screenshot_phone: "device" })}
                                  >
                                    <Upload className="h-4 w-4 mr-1" />
                                    Upload
                                  </Button>
                                  <Button
                                    variant={uploadMethod["screenshot_phone"] === "library" ? "default" : "outline"}
                                    size="sm"
                                    className="w-full"
                                    onClick={() => openAssetLibrary("screenshot", "phone")}
                                  >
                                    <FolderOpen className="h-4 w-4 mr-1" />
                                    Library
                                  </Button>
                                </div>

                                {uploadMethod["screenshot_phone"] === "device" && (
                                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center hover:border-blue-400 dark:hover:border-blue-600 transition-colors cursor-pointer">
                                    <div className="flex flex-col items-center gap-2">
                                      <Upload className="h-6 w-6 text-muted-foreground" />
                                      <p className="text-xs text-muted-foreground">Upload Phone screenshots</p>
                                      <Button size="sm" variant="outline">
                                        <Upload className="h-4 w-4 mr-1" />
                                        Chọn file
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </TabsContent>
                            )}

                            {/* Tablet Tab (Android) */}
                            {(platform === "android" || platform === "both") && (
                              <TabsContent value="tablet" className="space-y-2 mt-3">
                                <div className="grid grid-cols-3 gap-2">
                                  <Button
                                    variant={uploadMethod["screenshot_tablet"] === "design" ? "default" : "outline"}
                                    size="sm"
                                    className="w-full"
                                    onClick={() => setUploadMethod({ ...uploadMethod, screenshot_tablet: "design" })}
                                  >
                                    <Palette className="h-4 w-4 mr-1" />
                                    From Design
                                  </Button>
                                  <Button
                                    variant={uploadMethod["screenshot_tablet"] === "device" ? "default" : "outline"}
                                    size="sm"
                                    className="w-full"
                                    onClick={() => setUploadMethod({ ...uploadMethod, screenshot_tablet: "device" })}
                                  >
                                    <Upload className="h-4 w-4 mr-1" />
                                    Upload
                                  </Button>
                                  <Button
                                    variant={uploadMethod["screenshot_tablet"] === "library" ? "default" : "outline"}
                                    size="sm"
                                    className="w-full"
                                    onClick={() => openAssetLibrary("screenshot-tablet", "tablet")} // Changed to screenshot-tablet
                                  >
                                    <FolderOpen className="h-4 w-4 mr-1" />
                                    Library
                                  </Button>
                                </div>

                                {uploadMethod["screenshot_tablet"] === "device" && (
                                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center hover:border-blue-400 dark:hover:border-blue-600 transition-colors cursor-pointer">
                                    <div className="flex flex-col items-center gap-2">
                                      <Upload className="h-6 w-6 text-muted-foreground" />
                                      <p className="text-xs text-muted-foreground">Upload Tablet screenshots</p>
                                      <Button size="sm" variant="outline">
                                        <Upload className="h-4 w-4 mr-1" />
                                        Chọn file
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </TabsContent>
                            )}
                          </Tabs>
                        ) : (
                          <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>Vui lòng chọn Platform trước</AlertDescription>
                          </Alert>
                        )}
                      </div>

                      {/* Order Summary - Conditionally rendered when sendOrderNow is true */}
                      {sendOrderNow && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                            <CardDescription>Tóm tắt order gửi Design</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3 text-sm">
                            <div>
                              <span className="text-muted-foreground">App:</span>
                              <span className="ml-2 font-medium">{selectedApp?.name || "—"}</span>
                            </div>
                            <Separator />
                            <div>
                              <span className="text-muted-foreground">Markets:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {selectedMarkets.map((market) => (
                                  <Badge key={market} variant="secondary" className="text-xs">
                                    {market}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <Separator />
                            <div>
                              <span className="text-muted-foreground">Assets cần làm:</span>
                              <ul className="list-disc list-inside mt-1 space-y-1">
                                <li>App Icon (1024×1024)</li>
                                {(platform === "android" || platform === "both") && <li>Feature Graphic (1024×500)</li>}
                                <li>Screenshots ({platform === "ios" ? "iPhone/iPad" : "Phone/Tablet"})</li>
                                {(platform === "ios" || platform === "both") && <li>App Previews (iPhone/iPad)</li>}
                              </ul>
                            </div>
                            <Separator />
                            <div>
                              <span className="text-muted-foreground">Priority:</span>
                              <Badge
                                variant={priorityByMarket[activeMarketTab] === "high" ? "destructive" : "secondary"}
                                className="ml-2 text-xs"
                              >
                                {" "}
                                {/* CHANGE: Use per-market priority */}
                                {priorityByMarket[activeMarketTab] === "high" ? "High" : "Normal"}{" "}
                                {/* CHANGE: Use per-market priority */}
                              </Badge>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Deadline:</span>
                              <span className="ml-2 font-medium">{deadlineByMarket[activeMarketTab] || "—"}</span>{" "}
                              {/* CHANGE: Use per-market deadline */}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Promo Video (YouTube) for Android */}
                      {(platform === "android" || platform === "both") && (
                        <div className="space-y-4 pt-4 border-t">
                          <div className="flex items-center justify-between">
                            <Label className="flex items-center gap-2">
                              <Video className="h-4 w-4" />
                              Promo Video (YouTube)
                            </Label>
                            {hasValidPromoVideo() && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Tải video lên YouTube (Public hoặc Unlisted) rồi dán link vào đây.
                          </p>

                          {/* YouTube URL Input */}
                          <div className="space-y-2">
                            <Label htmlFor="promoVideoUrl">YouTube URL</Label>
                            <div className="flex gap-2">
                              <Input
                                id="promoVideoUrl"
                                placeholder="https://www.youtube.com/watch?v=k-kucvvfKnw"
                                value={promoVideoUrl}
                                onChange={(e) => {
                                  setPromoVideoUrl(e.target.value)
                                  setPromoVideoValid(null)
                                }}
                                className={promoVideoValid === false ? "border-red-500 focus-visible:ring-red-500" : ""}
                              />
                              <Button variant="outline" size="sm" onClick={handleTestPromoVideo}>
                                Test
                              </Button>
                              {promoVideoUrl && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setPromoVideoUrl("")
                                    setPromoVideoValid(null)
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                            {promoVideoValid === false && (
                              <p className="text-xs text-red-600">Link không đúng định dạng YouTube hợp lệ</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              Chấp nhận: youtube.com/watch?v=..., youtu.be/..., youtube.com/shorts/...
                            </p>
                          </div>

                          {/* Preview Embed */}
                          {promoVideoValid && promoVideoUrl && (
                            <div className="space-y-2">
                              <Label>Preview</Label>
                              <div className="relative w-full aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                                <iframe
                                  src={`https://www.youtube.com/embed/${getYouTubeVideoId(promoVideoUrl)}`}
                                  className="w-full h-full"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                />
                              </div>
                            </div>
                          )}

                          {/* Apply to all markets toggle */}
                          <div className="flex items-center space-x-2 pt-2">
                            <Checkbox
                              id="promoVideoApplyToAll"
                              checked={promoVideoApplyToAll}
                              onCheckedChange={(checked) => setPromoVideoApplyToAll(checked as boolean)}
                            />
                            <Label htmlFor="promoVideoApplyToAll" className="text-sm cursor-pointer">
                              Apply to all markets
                            </Label>
                          </div>

                          {/* Per-market URLs */}
                          {!promoVideoApplyToAll && selectedMarkets.length > 0 && (
                            <div className="space-y-2 pt-2 border-t">
                              <Label className="text-sm">YouTube URL per Market</Label>
                              <div className="space-y-2">
                                {selectedMarkets.map((market) => (
                                  <div key={market} className="flex items-center gap-2">
                                    <Badge variant="secondary" className="w-12 justify-center">
                                      {market}
                                    </Badge>
                                    <Input
                                      placeholder="YouTube URL"
                                      value={promoVideoPerMarket[market] || ""}
                                      onChange={(e) =>
                                        setPromoVideoPerMarket((prev) => ({
                                          ...prev,
                                          [market]: e.target.value,
                                        }))
                                      }
                                      className="flex-1"
                                    />
                                    {promoVideoUrl && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        title="Copy from default"
                                        onClick={() =>
                                          setPromoVideoPerMarket((prev) => ({
                                            ...prev,
                                            [market]: promoVideoUrl,
                                          }))
                                        }
                                      >
                                        <Copy className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="space-y-2 pt-2 border-t">
                            <Label>Reference File (optional)</Label>
                            <p className="text-xs text-muted-foreground">
                              File này không dùng để publish, chỉ lưu nội bộ. Vui lòng upload lên YouTube rồi dán link ở
                              trên.
                            </p>

                            <div className="grid grid-cols-3 gap-2 mb-2">
                              <Button
                                variant={uploadMethod["promo_video_ref"] === "design" ? "default" : "outline"}
                                size="sm"
                                className="w-full"
                                onClick={() => setUploadMethod({ ...uploadMethod, promo_video_ref: "design" })}
                              >
                                <Palette className="h-4 w-4 mr-1" />
                                From Design
                              </Button>
                              <Button
                                variant={uploadMethod["promo_video_ref"] === "device" ? "default" : "outline"}
                                size="sm"
                                className="w-full"
                                onClick={() => setUploadMethod({ ...uploadMethod, promo_video_ref: "device" })}
                              >
                                <Upload className="h-4 w-4 mr-1" />
                                Upload
                              </Button>
                              <Button
                                variant={uploadMethod["promo_video_ref"] === "library" ? "default" : "outline"}
                                size="sm"
                                className="w-full"
                                onClick={() => openAssetLibrary("video", "promo")}
                              >
                                <FolderOpen className="h-4 w-4 mr-1" />
                                Library
                              </Button>
                            </div>

                            {uploadMethod["promo_video_ref"] === "device" && (
                              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-3 text-center hover:border-blue-400 dark:hover:border-blue-600 transition-colors cursor-pointer">
                                <div className="flex flex-col items-center gap-2">
                                  <Upload className="h-6 w-6 text-muted-foreground" />
                                  <p className="text-xs text-muted-foreground">Kéo thả MP4/MOV để lưu nội bộ</p>
                                  <Button size="sm" variant="outline">
                                    <Upload className="h-4 w-4 mr-1" />
                                    Chọn file
                                  </Button>
                                </div>
                              </div>
                            )}

                            {/* Reference Files List */}
                            {promoVideoReferenceFiles.length > 0 && (
                              <div className="space-y-2 mt-2">
                                {promoVideoReferenceFiles.map((file, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-2 p-2 border rounded-lg bg-gray-50 dark:bg-gray-800"
                                  >
                                    <Video className="h-4 w-4 text-muted-foreground" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-medium truncate">{file.name}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Button variant="ghost" size="sm" title="Preview">
                                        <Play className="h-3 w-3" />
                                      </Button>
                                      <Button variant="ghost" size="sm" title="Download">
                                        <Download className="h-3 w-3" />
                                      </Button>
                                      <Button variant="ghost" size="sm" title="Remove">
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Info about video specs */}
                          <Alert>
                            <Info className="h-4 w-4" />
                            <AlertDescription className="text-xs space-y-1">
                              <p>
                                <strong>Độ phân giải:</strong> 1920×1080 (landscape) hoặc 1080×1920 (portrait)
                              </p>
                              <p>
                                <strong>Độ dài:</strong> 30 giây – 2 phút
                              </p>
                              <p>
                                <strong>Định dạng:</strong> H.264/MPEG-4
                              </p>
                            </AlertDescription>
                          </Alert>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* Unsaved Changes Dialog */}
      <Dialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bạn có thay đổi chưa lưu</DialogTitle>
            <DialogDescription>Bạn có chắc chắn muốn rời khỏi trang này? Tất cả thay đổi sẽ bị mất.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUnsavedDialog(false)}>
              Ở lại
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowUnsavedDialog(false)
                router.push("/applications/storekit")
              }}
            >
              Rời khỏi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Design Order Dialog */}
      <Dialog
        open={isDesignOrderDialogOpen}
        onOpenChange={(open) => {
          if (!open && hasFormData()) {
            setIsCancelConfirmOpen(true)
          } else {
            setIsDesignOrderDialogOpen(open)
            if (!hasFormData()) {
              const market = activeMarketTab === "default" ? "default" : activeMarketTab
              setDesignOrderData((prev) => ({
                ...prev,
                [market]: undefined as any,
              }))
            }
          }
        }}
      >
        <DialogContent className="max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col">
<DialogHeader className="flex-shrink-0">
  <DialogTitle>
    {isViewMode ? "Xem Order" : (designOrderSentByMarket[activeMarketTab] ? "Chỉnh sửa Order" : "Send Order to Design Team")}
    {activeMarketTab !== "default" && (
      <Badge variant="secondary" className="ml-2">
        {activeMarketTab}
      </Badge>
    )}
  </DialogTitle>
</DialogHeader>

{/* Edit mode warning */}
{!isViewMode && designOrderSentByMarket[activeMarketTab] && (
  <Alert variant="destructive" className="mx-4 mt-2">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription>
      <strong>Chế độ chỉnh sửa:</strong> Bạn đã sử dụng {editCountByMarket[activeMarketTab] || 0}/5 lượt chỉnh sửa. 
      {(editCountByMarket[activeMarketTab] || 0) >= 4 ? (
        <span className="text-red-600 font-bold"> Đây là lần chỉnh sửa cuối cùng!</span>
      ) : (
        <span> Còn {5 - (editCountByMarket[activeMarketTab] || 0)} lần chỉnh sửa.</span>
      )}
    </AlertDescription>
  </Alert>
)}


{/* View mode - Preview only */}
{isViewMode && designOrderSentByMarket[activeMarketTab] && (
  <div className="mx-4 mt-2 flex justify-end">
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <Button 
              variant="outline" 
              disabled={(editCountByMarket[activeMarketTab] || 0) >= 5}
              onClick={() => {
                if ((editCountByMarket[activeMarketTab] || 0) >= 5) {
                  return
                }
                setIsViewMode(false)
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              {(editCountByMarket[activeMarketTab] || 0) >= 5 
                ? "Hết lượt chỉnh sửa (0/5)" 
                : `Chỉnh sửa (${5 - (editCountByMarket[activeMarketTab] || 0)} lần còn lại)`
              }
            </Button>
          </span>
        </TooltipTrigger>
        {(editCountByMarket[activeMarketTab] || 0) >= 5 && (
          <TooltipContent>
            <p>Bạn đã sử dụng hết 5 lần chỉnh sửa cho market này.</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  </div>
)}
{/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto space-y-4 py-4">
            {activeMarketTab !== "default" && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>Bạn có thể copy thông tin từ Default và chỉnh sửa lại</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const defaultData = getDesignOrderDataForMarket("default")
                      updateDesignOrderData(activeMarketTab, defaultData)
                    }}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy từ Default
                  </Button>
                </AlertDescription>
              </Alert>
            )}

{/* Section 1: Order Details */}
<Collapsible
  open={orderSectionsExpanded.orderDetails}
  onOpenChange={(open) => setOrderSectionsExpanded((prev) => ({ ...prev, orderDetails: open }))}
>
  <Card>
    <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold">1. Order Details</span>
                        <Badge variant="destructive">Required</Badge>
                      </div>
                      {orderSectionsExpanded.orderDetails ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                
                  <CardContent className="space-y-4 pt-4">
                    {/* Design Assignment */}
                    <div className="space-y-3">
                      <h4 className="font-medium">Design Assignment</h4>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="designPIC">
                            Design PIC <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={getDesignOrderDataForMarket(activeMarketTab).designPIC}
                            onValueChange={(value) => updateDesignOrderData(activeMarketTab, { designPIC: value })}
                          >
                            <SelectTrigger
                              id="designPIC"
                              className={
                                !getDesignOrderDataForMarket(activeMarketTab).designPIC ? "border-red-500" : ""
                              }
                            >
                              <SelectValue placeholder="Chọn designer" />
                            </SelectTrigger>
                            <SelectContent>
                              {designTeamMembers.map((member) => (
                                <SelectItem key={member.id} value={member.id}>
                                  {member.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="deadline">
                            Deadline <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="deadline"
                            type="date"
                            value={getDesignOrderDataForMarket(activeMarketTab).deadline}
                            onChange={(e) => updateDesignOrderData(activeMarketTab, { deadline: e.target.value })}
                            className={!getDesignOrderDataForMarket(activeMarketTab).deadline ? "border-red-500" : ""}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="priority">Priority</Label>
                          <Select
                            value={getDesignOrderDataForMarket(activeMarketTab).priority}
                            onValueChange={(value: any) => updateDesignOrderData(activeMarketTab, { priority: value })}
                          >
                            <SelectTrigger id="priority">
                              <SelectValue placeholder="Chọn priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="normal">Normal</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Assets Needed */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">
                          Assets Needed <span className="text-red-500">*</span>
                        </h4>
                        <span className="text-sm text-muted-foreground">Chọn ít nhất 1</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center space-x-2 gap-2">
                          <Checkbox
                            id="asset-appicon"
                            checked={getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.appIcon}
                            onCheckedChange={(checked) => {
                              const current = getDesignOrderDataForMarket(activeMarketTab)
                              updateDesignOrderData(activeMarketTab, {
                                assetsNeeded: { ...current.assetsNeeded, appIcon: checked as boolean },
                              })
                            }}
                          />
                          <Label htmlFor="asset-appicon" className="cursor-pointer whitespace-nowrap">
                            App Icon:
                          </Label>
                          <Input
                            type="number"
                            min="1"
                            max="10"
                            value={getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.appIconQty}
                            onChange={(e) => {
                              const current = getDesignOrderDataForMarket(activeMarketTab)
                              updateDesignOrderData(activeMarketTab, {
                                assetsNeeded: {
                                  ...current.assetsNeeded,
                                  appIconQty: Number.parseInt(e.target.value) || 1,
                                },
                              })
                            }}
                            className="w-16 h-8"
                            disabled={!getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.appIcon}
                          />
                        </div>

                        <div className="flex items-center space-x-2 gap-2">
                          <Checkbox
                            id="asset-banner"
                            checked={getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.featureBanner}
                            onCheckedChange={(checked) => {
                              const current = getDesignOrderDataForMarket(activeMarketTab)
                              updateDesignOrderData(activeMarketTab, {
                                assetsNeeded: { ...current.assetsNeeded, featureBanner: checked as boolean },
                              })
                            }}
                          />
                          <Label htmlFor="asset-banner" className="cursor-pointer whitespace-nowrap">
                            Feature Banner:
                          </Label>
                          <Input
                            type="number"
                            min="1"
                            max="10"
                            value={getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.featureBannerQty}
                            onChange={(e) => {
                              const current = getDesignOrderDataForMarket(activeMarketTab)
                              updateDesignOrderData(activeMarketTab, {
                                assetsNeeded: {
                                  ...current.assetsNeeded,
                                  featureBannerQty: Number.parseInt(e.target.value) || 1,
                                },
                              })
                            }}
                            className="w-16 h-8"
                            disabled={!getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.featureBanner}
                          />
                        </div>

                        <div className="flex items-center space-x-2 gap-2">
                          <Checkbox
                            id="asset-phone"
                            checked={getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.screenshotsPhone}
                            onCheckedChange={(checked) => {
                              const current = getDesignOrderDataForMarket(activeMarketTab)
                              updateDesignOrderData(activeMarketTab, {
                                assetsNeeded: { ...current.assetsNeeded, screenshotsPhone: checked as boolean },
                              })
                            }}
                          />
                          <Label htmlFor="asset-phone" className="cursor-pointer">
                            Screenshots Phone:
                          </Label>
                          <Input
                            type="number"
                            min="1"
                            max="10"
                            value={getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.screenshotsPhoneQty}
                            onChange={(e) => {
                              const current = getDesignOrderDataForMarket(activeMarketTab)
                              updateDesignOrderData(activeMarketTab, {
                                assetsNeeded: {
                                  ...current.assetsNeeded,
                                  screenshotsPhoneQty: Number.parseInt(e.target.value) || 6,
                                },
                              })
                            }}
                            className="w-16 h-8"
                            disabled={!getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.screenshotsPhone}
                          />
                        </div>

                        <div className="flex items-center space-x-2 gap-2">
                          <Checkbox
                            id="asset-tablet"
                            checked={getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.screenshotsTablet}
                            onCheckedChange={(checked) => {
                              const current = getDesignOrderDataForMarket(activeMarketTab)
                              updateDesignOrderData(activeMarketTab, {
                                assetsNeeded: { ...current.assetsNeeded, screenshotsTablet: checked as boolean },
                              })
                            }}
                          />
                          <Label htmlFor="asset-tablet" className="cursor-pointer">
                            Screenshots Tablet:
                          </Label>
                          <Input
                            type="number"
                            min="1"
                            max="10"
                            value={getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.screenshotsTabletQty}
                            onChange={(e) => {
                              const current = getDesignOrderDataForMarket(activeMarketTab)
                              updateDesignOrderData(activeMarketTab, {
                                assetsNeeded: {
                                  ...current.assetsNeeded,
                                  screenshotsTabletQty: Number.parseInt(e.target.value) || 6,
                                },
                              })
                            }}
                            className="w-16 h-8"
                            disabled={!getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.screenshotsTablet}
                          />
                        </div>

                        <div className="flex items-center space-x-2 gap-2">
                          <Checkbox
                            id="asset-video"
                            checked={getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.promoVideo}
                            onCheckedChange={(checked) => {
                              const current = getDesignOrderDataForMarket(activeMarketTab)
                              updateDesignOrderData(activeMarketTab, {
                                assetsNeeded: { ...current.assetsNeeded, promoVideo: checked as boolean },
                              })
                            }}
                          />
                          <Label htmlFor="asset-video" className="cursor-pointer whitespace-nowrap">
                            Promo Video:
                          </Label>
                          <Input
                            type="number"
                            min="1"
                            max="10"
                            value={getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.promoVideoQty}
                            onChange={(e) => {
                              const current = getDesignOrderDataForMarket(activeMarketTab)
                              updateDesignOrderData(activeMarketTab, {
                                assetsNeeded: {
                                  ...current.assetsNeeded,
                                  promoVideoQty: Number.parseInt(e.target.value) || 1,
                                },
                              })
                            }}
                            className="w-16 h-8"
                            disabled={!getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.promoVideo}
                          />
                        </div>

                        <div className="flex items-center space-x-2 gap-2 col-span-2">
                          <Checkbox
                            id="asset-other"
                            checked={getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.other}
                            onCheckedChange={(checked) => {
                              const current = getDesignOrderDataForMarket(activeMarketTab)
                              updateDesignOrderData(activeMarketTab, {
                                assetsNeeded: { ...current.assetsNeeded, other: checked as boolean },
                              })
                            }}
                          />
                          <Label htmlFor="asset-other" className="cursor-pointer whitespace-nowrap">
                            Other:
                          </Label>
                          <Input
                            type="number"
                            min="1"
                            max="10"
                            value={getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.otherQty}
                            onChange={(e) => {
                              const current = getDesignOrderDataForMarket(activeMarketTab)
                              updateDesignOrderData(activeMarketTab, {
                                assetsNeeded: {
                                  ...current.assetsNeeded,
                                  otherQty: Number.parseInt(e.target.value) || 1,
                                },
                              })
                            }}
                            className="w-16 h-8"
                            disabled={!getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.other}
                          />
                          <Input
                            placeholder="Specify other assets..."
                            value={getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.otherText}
                            onChange={(e) => {
                              const current = getDesignOrderDataForMarket(activeMarketTab)
                              updateDesignOrderData(activeMarketTab, {
                                assetsNeeded: { ...current.assetsNeeded, otherText: e.target.value },
                              })
                            }}
                            className="flex-1"
                            disabled={!getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.other}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            <Separator />

            {/* Section 2: Campaign Concept */}
            <Collapsible
              open={orderSectionsExpanded.campaignConcept}
              onOpenChange={(open) => setOrderSectionsExpanded((prev) => ({ ...prev, campaignConcept: open }))}
            >
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold">2. Campaign Concept</span>
                      </div>
                      {orderSectionsExpanded.campaignConcept ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>Campaign Name</Label>
                      <Input
                        placeholder="e.g., Summer Collection 2025"
                        value={getDesignOrderDataForMarket(activeMarketTab).campaignName}
                        onChange={(e) => updateDesignOrderData(activeMarketTab, { campaignName: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Theme/Concept</Label>
                      <Textarea
                        placeholder="Describe the overall theme and concept for this campaign..."
                        rows={3}
                        value={getDesignOrderDataForMarket(activeMarketTab).themeOrConcept}
                        onChange={(e) =>
                          updateDesignOrderData(activeMarketTab, { themeOrConcept: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Key Elements</Label>
                      <Textarea
                        placeholder="Key elements to highlight (features, products, etc.)..."
                        rows={2}
                        value={getDesignOrderDataForMarket(activeMarketTab).keyElements}
                        onChange={(e) => updateDesignOrderData(activeMarketTab, { keyElements: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Campaign Reference Images</Label>
                      <div className="space-y-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => openAssetLibrary("campaign")}>
                          <ImageIcon className="h-4 w-4 mr-2" />
                          From Asset Library
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const input = document.createElement("input")
                            input.type = "file"
                            input.accept = "image/*"
                            input.multiple = true
                            input.onchange = (e) => {
                              const files = (e.target as HTMLInputElement).files
                              if (files) {
                                const current = getDesignOrderDataForMarket(activeMarketTab)
                                const newImages = Array.from(files).map((file) => ({
                                  id: `img-${Date.now()}-${Math.random()}`,
                                  url: URL.createObjectURL(file),
                                  name: file.name,
                                  size: file.size,
                                }))
                                updateDesignOrderData(activeMarketTab, {
                                  campaignReferenceImages: [...current.campaignReferenceImages, ...newImages],
                                })
                              }
                            }
                            input.click()
                          }}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Images
                        </Button>
                      </div>

                      {getDesignOrderDataForMarket(activeMarketTab).campaignReferenceImages.length > 0 && (
                        <div className="grid grid-cols-4 gap-2 mt-2">
                          {getDesignOrderDataForMarket(activeMarketTab).campaignReferenceImages.map(
                            (file, idx) => (
                              <div key={idx} className="relative group">
                                <img
                                  src={file.url || "/placeholder.svg"}
                                  alt={file.name}
                                  className="w-full h-20 object-cover rounded border"
                                />
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => {
                                    const current = getDesignOrderDataForMarket(activeMarketTab)
                                    updateDesignOrderData(activeMarketTab, {
                                      campaignReferenceImages: current.campaignReferenceImages.filter(
                                        (_, i) => i !== idx,
                                      ),
                                    })
                                  }}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Section 3: Asset Specifications */}
            <Collapsible
              open={orderSectionsExpanded.screenshotSpecs}
              onOpenChange={(open) => setOrderSectionsExpanded((prev) => ({ ...prev, screenshotSpecs: open }))}
            >
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold">3. Asset Specifications</span>
                        <Badge variant="outline">
                          {(() => {
                            const data = getDesignOrderDataForMarket(activeMarketTab)
                            let count = 0
                            if (data.assetsNeeded.appIcon) count += data.assetsNeeded.appIconQty
                            if (data.assetsNeeded.featureBanner) count += data.assetsNeeded.featureBannerQty
                            if (data.assetsNeeded.screenshotsPhone) count += data.screenshotSpecs.length
                            if (data.assetsNeeded.screenshotsTablet)
                              count += data.tabletScreenshotSpecs?.length || 0
                            if (data.assetsNeeded.promoVideo) count += data.assetsNeeded.promoVideoQty
                            if (data.assetsNeeded.other) count += data.assetsNeeded.otherQty
                            return count
                          })()}
                          specs
                        </Badge>
                      </div>
                      {orderSectionsExpanded.screenshotSpecs ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-6 pt-4">
                    {!getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.appIcon &&
                              !getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.featureBanner &&
                              !getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.screenshotsPhone &&
                              !getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.screenshotsTablet &&
                              !getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.promoVideo &&
                              !getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.other && (
                                <Alert>
                                  <Info className="h-4 w-4" />
                                  <AlertDescription>
                                    Chọn assets cần thiết trong Section 1 để hiển thị specifications ở đây.
                                  </AlertDescription>
                                </Alert>
                              )}

                            {getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.appIcon && (
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-semibold text-base">App Icon (1024×1024)</h4>
                                </div>

                                <div className="space-y-3">
                                  {Array.from({
                                    length: getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.appIconQty,
                                  }).map((_, idx) => {
                                    // Initialize appIconSpecs if needed
                                    const current = getDesignOrderDataForMarket(activeMarketTab)
                                    if (!current.appIconSpecs || current.appIconSpecs.length <= idx) {
                                      const newSpecs = [...(current.appIconSpecs || [])]
                                      while (newSpecs.length <= idx) {
                                        newSpecs.push({
                                          id: `appicon-${Date.now()}-${newSpecs.length}`,
                                          concept: "",
                                          styleTags: [],
                                          referenceImages: [],
                                          notes: "",
                                        })
                                      }
                                      updateDesignOrderData(activeMarketTab, { appIconSpecs: newSpecs })
                                    }

                                    const spec = current.appIconSpecs?.[idx] || {
                                      id: `appicon-${idx}`,
                                      concept: "",
                                      styleTags: [],
                                      referenceImages: [],
                                      notes: "",
                                    }

                                    return (
                                      <Card key={spec.id} className="border-2">
                                        <CardHeader className="pb-3">
                                          <div className="flex items-center justify-between">
                                            <span className="font-semibold">App Icon {idx + 1}</span>
                                          </div>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                          <div className="space-y-2">
                                            <Label>Mô tả <span className="text-red-500">*</span></Label>
                                            <Textarea
                                              placeholder="Mô tả concept, style, màu sắc, preferences cho icon..."
                                              rows={4}
                                              value={spec.concept}
                                              onChange={(e) => {
                                                const updated = [...(current.appIconSpecs || [])]
                                                updated[idx] = { ...spec, concept: e.target.value }
                                                updateDesignOrderData(activeMarketTab, { appIconSpecs: updated })
                                              }}
                                            />
                                          </div>

                                          <div className="space-y-2">
                                            <Label>Style Tags</Label>
                                            <div className="flex flex-wrap gap-2">
                                              {[
                                                "Minimalist",
                                                "Gradient",
                                                "Flat",
                                                "3D",
                                                "Modern",
                                                "Playful",
                                                "Elegant",
                                                "Bold",
                                              ].map((tag) => (
                                                <Badge
                                                  key={tag}
                                                  variant={spec.styleTags.includes(tag) ? "default" : "outline"}
                                                  className="cursor-pointer"
                                                  onClick={() => {
                                                    const updated = [...(current.appIconSpecs || [])]
                                                    const tags = spec.styleTags.includes(tag)
                                                      ? spec.styleTags.filter((t) => t !== tag)
                                                      : [...spec.styleTags, tag]
                                                    updated[idx] = { ...spec, styleTags: tags }
                                                    updateDesignOrderData(activeMarketTab, { appIconSpecs: updated })
                                                  }}
                                                >
                                                  {tag}
                                                </Badge>
                                              ))}
                                            </div>
                                          </div>

                                          <div className="space-y-2">
                                            <Label>Reference Images</Label>
                                            <div className="space-y-2">
                                              {/* Drag and drop area */}
                                              <div
                                                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                                                onDragOver={(e) => {
                                                  e.preventDefault()
                                                  e.stopPropagation()
                                                }}
                                                onDrop={(e) => {
                                                  e.preventDefault()
                                                  e.stopPropagation()
                                                  const files = e.dataTransfer.files
                                                  if (files) {
                                                    const updated = [...(current.appIconSpecs || [])]
                                                    const newImages = Array.from(files)
                                                      .filter(f => f.type.startsWith('image/'))
                                                      .map((file) => ({
                                                        id: `img-${Date.now()}-${Math.random()}`,
                                                        url: URL.createObjectURL(file),
                                                        name: file.name,
                                                      }))
                                                    updated[idx] = {
                                                      ...spec,
                                                      referenceImages: [...spec.referenceImages, ...newImages],
                                                    }
                                                    updateDesignOrderData(activeMarketTab, { appIconSpecs: updated })
                                                  }
                                                }}
                                                onClick={() => {
                                                  const input = document.createElement("input")
                                                  input.type = "file"
                                                  input.accept = "image/*"
                                                  input.multiple = true
                                                  input.onchange = (e) => {
                                                    const files = (e.target as HTMLInputElement).files
                                                    if (files) {
                                                      const updated = [...(current.appIconSpecs || [])]
                                                      const newImages = Array.from(files).map((file) => ({
                                                        id: `img-${Date.now()}-${Math.random()}`,
                                                        url: URL.createObjectURL(file),
                                                        name: file.name,
                                                      }))
                                                      updated[idx] = {
                                                        ...spec,
                                                        referenceImages: [...spec.referenceImages, ...newImages],
                                                      }
                                                      updateDesignOrderData(activeMarketTab, { appIconSpecs: updated })
                                                    }
                                                  }
                                                  input.click()
                                                }}
                                              >
                                                <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                                <p className="text-sm text-muted-foreground mb-1">
                                                  Kéo thả ảnh vào đây hoặc click để chọn
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                  PNG, JPG, GIF up to 10MB
                                                </p>
                                              </div>

                                              <div className="flex gap-2">
                                                <Button
                                                  type="button"
                                                  variant="outline"
                                                  size="sm"
                                                  className="flex-1 bg-transparent"
                                                  onClick={() => openAssetLibrary("appicon", spec.id)}
                                                >
                                                  <FolderOpen className="h-4 w-4 mr-2" />
                                                  From Asset Library
                                                </Button>
                                              </div>

                                              {spec.referenceImages.length > 0 && (
                                                <div className="grid grid-cols-4 gap-2 mt-2">
                                                  {spec.referenceImages.map((img) => (
                                                    <div key={img.id} className="relative group">
                                                      <img
                                                        src={img.url || "/placeholder.svg"}
                                                        alt={img.name}
                                                        className="w-full h-20 object-cover rounded border"
                                                      />
                                                      <Button
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => {
                                                          const updated = [...(current.appIconSpecs || [])]
                                                          updated[idx] = {
                                                            ...spec,
                                                            referenceImages: spec.referenceImages.filter(
                                                              (i) => i.id !== img.id,
                                                            ),
                                                          }
                                                          updateDesignOrderData(activeMarketTab, {
                                                            appIconSpecs: updated,
                                                          })
                                                        }}
                                                      >
                                                        <X className="h-3 w-3" />
                                                      </Button>
                                                    </div>
                                                  ))}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                          {/* </CHANGE> Remove Additional Notes */}
                                        </CardContent>
                                      </Card>
                                    )
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Feature Banner Specifications */}
                            {getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.featureBanner &&
                              getDesignOrderDataForMarket(activeMarketTab).bannerSpecs.length > 0 && (
                                <>
                                  {(getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.appIcon) && (
                                    <Separator />
                                  )}
                                  <div className="space-y-3">
                                    <h4 className="font-semibold text-base">Feature Banner</h4>
                                    {/* </CHANGE> */}
                                    <div className="space-y-3">
                                      {getDesignOrderDataForMarket(activeMarketTab).bannerSpecs.map((spec, idx) => (
                                        <Card key={spec.id} className="border-2">
                                          <CardHeader className="pb-3">
                                            <div className="flex items-center justify-between">
                                              <span className="font-semibold">Feature Banner {idx + 1}</span>
                                            </div>
                                          </CardHeader>
                                          <CardContent className="space-y-3">
                                            <div className="space-y-2">
                                              <Label>
                                                Dimensions <span className="text-red-500">*</span>
                                              </Label>
                                              <div className="flex gap-2">
                                                <Select
                                                  value={spec.dimensions}
                                                  onValueChange={(value) => {
                                                    const current = getDesignOrderDataForMarket(activeMarketTab)
                                                    const updated = current.bannerSpecs.map((s) =>
                                                      s.id === spec.id ? { ...s, dimensions: value } : s,
                                                    )
                                                    updateDesignOrderData(activeMarketTab, { bannerSpecs: updated })
                                                  }}
                                                >
                                                  <SelectTrigger className="w-[200px]">
                                                    <SelectValue placeholder="Chọn size" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    <SelectItem value="1024×500">1024×500 (Standard)</SelectItem>
                                                    <SelectItem value="1920×1080">1920×1080 (Full HD)</SelectItem>
                                                    <SelectItem value="1200×628">1200×628 (Social)</SelectItem>
                                                    <SelectItem value="custom">Custom Size</SelectItem>
                                                  </SelectContent>
                                                </Select>
                                                {spec.dimensions === "custom" && (
                                                  <Input
                                                    placeholder="e.g., 800×600"
                                                    className="flex-1"
                                                    onChange={(e) => {
                                                      const current = getDesignOrderDataForMarket(activeMarketTab)
                                                      const updated = current.bannerSpecs.map((s) =>
                                                        s.id === spec.id ? { ...s, dimensions: e.target.value } : s,
                                                      )
                                                      updateDesignOrderData(activeMarketTab, { bannerSpecs: updated })
                                                    }}
                                                  />
                                                )}
                                              </div>
                                            </div>
                                            {/* </CHANGE> */}

                                            <div className="space-y-2">
                                              <Label>Description</Label>
                                              <Textarea
                                                placeholder="Describe the banner content, layout, key elements..."
                                                rows={3}
                                                value={spec.description}
                                                onChange={(e) => {
                                                  const current = getDesignOrderDataForMarket(activeMarketTab)
                                                  const updated = current.bannerSpecs.map((s) =>
                                                    s.id === spec.id ? { ...s, description: e.target.value } : s,
                                                  )
                                                  updateDesignOrderData(activeMarketTab, { bannerSpecs: updated })
                                                }}
                                              />
                                            </div>
                                            {/* </CHANGE> */}

                                            <div className="space-y-2">
                                              <Label>Reference Images</Label>
                                              <div className="space-y-2">
                                                {/* Drag and drop area */}
                                                <div
                                                  className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                                                  onDragOver={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                  }}
                                                  onDrop={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                    const files = e.dataTransfer.files
                                                    if (files) {
                                                      const current = getDesignOrderDataForMarket(activeMarketTab)
                                                      const newImages = Array.from(files)
                                                        .filter(f => f.type.startsWith('image/'))
                                                        .map((file) => ({
                                                          id: `img-${Date.now()}-${Math.random()}`,
                                                          url: URL.createObjectURL(file),
                                                          name: file.name,
                                                        }))
                                                      const updated = current.bannerSpecs.map((s) =>
                                                        s.id === spec.id
                                                          ? { ...s, referenceImages: [...s.referenceImages, ...newImages] }
                                                          : s,
                                                      )
                                                      updateDesignOrderData(activeMarketTab, { bannerSpecs: updated })
                                                    }
                                                  }}
                                                  onClick={() => {
                                                    const input = document.createElement("input")
                                                    input.type = "file"
                                                    input.accept = "image/*"
                                                    input.multiple = true
                                                    input.onchange = (e) => {
                                                      const files = (e.target as HTMLInputElement).files
                                                      if (files) {
                                                        const current = getDesignOrderDataForMarket(activeMarketTab)
                                                        const newImages = Array.from(files).map((file) => ({
                                                          id: `img-${Date.now()}-${Math.random()}`,
                                                          url: URL.createObjectURL(file),
                                                          name: file.name,
                                                        }))
                                                        const updated = current.bannerSpecs.map((s) =>
                                                          s.id === spec.id
                                                            ? { ...s, referenceImages: [...s.referenceImages, ...newImages] }
                                                            : s,
                                                        )
                                                        updateDesignOrderData(activeMarketTab, { bannerSpecs: updated })
                                                      }
                                                    }
                                                    input.click()
                                                  }}
                                                >
                                                  <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                                  <p className="text-sm text-muted-foreground mb-1">
                                                    Kéo thả ảnh vào đây hoặc click để chọn
                                                  </p>
                                                  <p className="text-xs text-muted-foreground">
                                                    PNG, JPG, GIF up to 10MB
                                                  </p>
                                                </div>

                                                <div className="flex gap-2">
                                                  <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1 bg-transparent"
                                                    onClick={() => openAssetLibrary("banner", spec.id)}
                                                  >
                                                    <FolderOpen className="h-4 w-4 mr-2" />
                                                    From Asset Library
                                                  </Button>
                                                </div>

                                                {spec.referenceImages.length > 0 && (
                                                  <div className="grid grid-cols-4 gap-2 mt-2">
                                                    {spec.referenceImages.map((img) => (
                                                      <div key={img.id} className="relative group">
                                                        <img
                                                          src={img.url || "/placeholder.svg"}
                                                          alt={img.name}
                                                          className="w-full h-20 object-cover rounded border"
                                                        />
                                                        <Button
                                                          variant="destructive"
                                                          size="icon"
                                                          className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                          onClick={() => {
                                                            const current = getDesignOrderDataForMarket(activeMarketTab)
                                                            const updated = current.bannerSpecs.map((s) =>
                                                              s.id === spec.id
                                                                ? {
                                                                    ...s,
                                                                    referenceImages: s.referenceImages.filter(
                                                                      (i) => i.id !== img.id,
                                                                    ),
                                                                  }
                                                                : s,
                                                            )
                                                            updateDesignOrderData(activeMarketTab, {
                                                              bannerSpecs: updated,
                                                            })
                                                          }}
                                                        >
                                                          <X className="h-3 w-3" />
                                                        </Button>
                                                      </div>
                                                    ))}
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                            {/* </CHANGE> */}
                                          </CardContent>
                                        </Card>
                                      ))}
                                    </div>
                                  </div>
                                </>
                              )}
                            {/* Phone Screenshots */}
                            {getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.screenshotsPhone && (
                              <>
                                {(getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.appIcon ||
                                  getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.featureBanner) && (
                                  <Separator />
                                )}
                                <div className="space-y-3">
                                  <h4 className="font-semibold text-base">Screenshots Phone</h4>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const current = getDesignOrderDataForMarket(activeMarketTab)
                                      const newSpec: ScreenshotSpec = {
                                        id: `screenshot-phone-${Date.now()}`,
                                        description: "",
                                        referenceImages: [],
                                      }
                                      // </CHANGE>
                                      updateDesignOrderData(activeMarketTab, {
                                        screenshotSpecs: [...current.screenshotSpecs, newSpec],
                                      })
                                    }}
                                  >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Phone Screenshot
                                  </Button>
                                  {getDesignOrderDataForMarket(activeMarketTab).screenshotSpecs.length === 0 ? (
                                    <Alert>
                                      <Info className="h-4 w-4" />
                                      <AlertDescription>
                                        Click "Add Phone Screenshot" để thêm specifications cho screenshots phone.
                                      </AlertDescription>
                                    </Alert>
                                  ) : (
                                    <div className="space-y-3">
                                      {getDesignOrderDataForMarket(activeMarketTab).screenshotSpecs.map((spec, idx) => (
                                        <Card key={spec.id} className="border-2">
                                          <CardHeader className="pb-3">
                                            <div className="flex items-center justify-between">
                                              <div className="flex items-center gap-2">
                                                <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                                                <span className="font-semibold">Phone Screenshot {idx + 1}</span>
                                              </div>
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => {
                                                  const current = getDesignOrderDataForMarket(activeMarketTab)
                                                  updateDesignOrderData(activeMarketTab, {
                                                    screenshotSpecs: current.screenshotSpecs.filter(
                                                      (s) => s.id !== spec.id,
                                                    ),
                                                  })
                                                }}
                                              >
                                                <Trash2 className="h-4 w-4" />
                                              </Button>
                                            </div>
                                          </CardHeader>
                                          <CardContent className="space-y-3">
                                            <div className="space-y-2">
                                              <Label>
                                                Mô tả <span className="text-red-500">*</span>
                                              </Label>
                                              <Textarea
                                                placeholder="Mô tả chi tiết về screenshot: text overlay, layout, styling, props/background, model requirements, priority notes..."
                                                rows={5}
                                                value={spec.description}
                                                onChange={(e) => {
                                                  const current = getDesignOrderDataForMarket(activeMarketTab)
                                                  const updated = current.screenshotSpecs.map((s) =>
                                                    s.id === spec.id ? { ...s, description: e.target.value } : s,
                                                  )
                                                  updateDesignOrderData(activeMarketTab, { screenshotSpecs: updated })
                                                }}
                                              />
                                            </div>
                                            {/* </CHANGE> */}

                                            <div className="space-y-2">
                                              <Label>Reference Images</Label>
                                              <div className="space-y-2">
                                                {/* Drag and drop area */}
                                                <div
                                                  className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                                                  onDragOver={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                  }}
                                                  onDrop={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                    const files = e.dataTransfer.files
                                                    if (files) {
                                                      const current = getDesignOrderDataForMarket(activeMarketTab)
                                                      const newImages = Array.from(files)
                                                        .filter(f => f.type.startsWith('image/'))
                                                        .map((file) => ({
                                                          id: `img-${Date.now()}-${Math.random()}`,
                                                          url: URL.createObjectURL(file),
                                                          name: file.name,
                                                        }))
                                                      const updated = current.screenshotSpecs.map((s) =>
                                                        s.id === spec.id
                                                          ? { ...s, referenceImages: [...s.referenceImages, ...newImages] }
                                                          : s,
                                                      )
                                                      updateDesignOrderData(activeMarketTab, { screenshotSpecs: updated })
                                                    }
                                                  }}
                                                  onClick={() => {
                                                    const input = document.createElement("input")
                                                    input.type = "file"
                                                    input.accept = "image/*"
                                                    input.multiple = true
                                                    input.onchange = (e) => {
                                                      const files = (e.target as HTMLInputElement).files
                                                      if (files) {
                                                        const current = getDesignOrderDataForMarket(activeMarketTab)
                                                        const newImages = Array.from(files).map((file) => ({
                                                          id: `img-${Date.now()}-${Math.random()}`,
                                                          url: URL.createObjectURL(file),
                                                          name: file.name,
                                                        }))
                                                        const updated = current.screenshotSpecs.map((s) =>
                                                          s.id === spec.id
                                                            ? { ...s, referenceImages: [...s.referenceImages, ...newImages] }
                                                            : s,
                                                        )
                                                        updateDesignOrderData(activeMarketTab, { screenshotSpecs: updated })
                                                      }
                                                    }
                                                    input.click()
                                                  }}
                                                >
                                                  <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                                  <p className="text-sm text-muted-foreground mb-1">
                                                    Kéo thả ảnh vào đây hoặc click để chọn
                                                  </p>
                                                  <p className="text-xs text-muted-foreground">
                                                    PNG, JPG, GIF up to 10MB
                                                  </p>
                                                </div>

                                                <div className="flex gap-2">
                                                  <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1 bg-transparent"
                                                    onClick={() => openAssetLibrary("screenshot", spec.id)}
                                                  >
                                                    <FolderOpen className="h-4 w-4 mr-2" />
                                                    From Asset Library
                                                  </Button>
                                                </div>

                                                {spec.referenceImages.length > 0 && (
                                                  <div className="grid grid-cols-4 gap-2 mt-2">
                                                    {spec.referenceImages.map((img) => (
                                                      <div key={img.id} className="relative group">
                                                        <img
                                                          src={img.url || "/placeholder.svg"}
                                                          alt={img.name}
                                                          className="w-full h-20 object-cover rounded border"
                                                        />
                                                        <Button
                                                          variant="destructive"
                                                          size="icon"
                                                          className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                          onClick={() => {
                                                            const current = getDesignOrderDataForMarket(activeMarketTab)
                                                            const updated = current.screenshotSpecs.map((s) =>
                                                              s.id === spec.id
                                                                ? {
                                                                    ...s,
                                                                    referenceImages: s.referenceImages.filter(
                                                                      (i) => i.id !== img.id,
                                                                    ),
                                                                  }
                                                                : s,
                                                            )
                                                            updateDesignOrderData(activeMarketTab, { screenshotSpecs: updated })
                                                          }}
                                                        >
                                                          <X className="h-3 w-3" />
                                                        </Button>
                                                      </div>
                                                    ))}
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                            {/* </CHANGE> */}
                                          </CardContent>
                                        </Card>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </>
                            )}

                            {/* Tablet Screenshots */}
                            {getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.screenshotsTablet && (
                              <>
                                {(getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.appIcon ||
                                  getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.featureBanner ||
                                  getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.screenshotsPhone) && (
                                  <Separator />
                                )}
                                <div className="space-y-3">
                                  <h4 className="font-semibold text-base">Screenshots Tablet</h4>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const current = getDesignOrderDataForMarket(activeMarketTab)
                                      const newSpec: ScreenshotSpec = {
                                        id: `tablet-screenshot-${Date.now()}`,
                                        description: "",
                                        referenceImages: [],
                                      }
                                      // </CHANGE>
                                      updateDesignOrderData(activeMarketTab, {
                                        tabletScreenshotSpecs: [...(current.tabletScreenshotSpecs || []), newSpec],
                                      })
                                    }}
                                  >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Tablet Screenshot
                                  </Button>
                                  {!getDesignOrderDataForMarket(activeMarketTab).tabletScreenshotSpecs ||
                                  (getDesignOrderDataForMarket(activeMarketTab).tabletScreenshotSpecs?.length ?? 0) === 0 ? (
                                    <Alert>
                                      <Info className="h-4 w-4" />
                                      <AlertDescription>
                                        Click "Add Tablet Screenshot" để thêm specifications cho screenshots tablet.
                                      </AlertDescription>
                                    </Alert>
                                  ) : (
                                    <div className="space-y-3">
                                      {getDesignOrderDataForMarket(activeMarketTab).tabletScreenshotSpecs?.map(
                                        (spec, idx) => (
                                          <Card key={spec.id} className="border-2">
                                            <CardHeader className="pb-3">
                                              <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                                                  <span className="font-semibold">Tablet Screenshot {idx + 1}</span>
                                                </div>
                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  className="h-8 w-8"
                                                  onClick={() => {
                                                    const current = getDesignOrderDataForMarket(activeMarketTab)
                                                    updateDesignOrderData(activeMarketTab, {
                                                      tabletScreenshotSpecs: (current.tabletScreenshotSpecs || []).filter(
                                                        (s) => s.id !== spec.id,
                                                      ),
                                                    })
                                                  }}
                                                >
                                                  <Trash2 className="h-4 w-4" />
                                                </Button>
                                              </div>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                              <div className="space-y-2">
                                                <Label>
                                                  Mô tả <span className="text-red-500">*</span>
                                                </Label>
                                                <Textarea
                                                  placeholder="Mô tả chi tiết về screenshot: text overlay, layout, styling, props/background, model requirements, priority notes..."
                                                  rows={5}
                                                  value={spec.description}
                                                  onChange={(e) => {
                                                    const current = getDesignOrderDataForMarket(activeMarketTab)
                                                    const updated = (current.tabletScreenshotSpecs || []).map((s) =>
                                                      s.id === spec.id ? { ...s, description: e.target.value } : s,
                                                    )
                                                    updateDesignOrderData(activeMarketTab, {
                                                      tabletScreenshotSpecs: updated,
                                                    })
                                                  }}
                                                />
                                              </div>
                                              {/* </CHANGE> */}

                                              <div className="space-y-2">
                                                <Label>Reference Images</Label>
                                                <div className="space-y-2">
                                                  {/* Drag and drop area */}
                                                  <div
                                                    className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                                                    onDragOver={(e) => {
                                                      e.preventDefault()
                                                      e.stopPropagation()
                                                    }}
                                                    onDrop={(e) => {
                                                      e.preventDefault()
                                                      e.stopPropagation()
                                                      const files = e.dataTransfer.files
                                                      if (files) {
                                                        const current = getDesignOrderDataForMarket(activeMarketTab)
                                                        const newImages = Array.from(files)
                                                          .filter(f => f.type.startsWith('image/'))
                                                          .map((file) => ({
                                                            id: `img-${Date.now()}-${Math.random()}`,
                                                            url: URL.createObjectURL(file),
                                                            name: file.name,
                                                          }))
                                                        const updated = (current.tabletScreenshotSpecs || []).map((s) =>
                                                          s.id === spec.id
                                                            ? { ...s, referenceImages: [...s.referenceImages, ...newImages] }
                                                            : s,
                                                        )
                                                        updateDesignOrderData(activeMarketTab, { tabletScreenshotSpecs: updated })
                                                      }
                                                    }}
                                                    onClick={() => {
                                                      const input = document.createElement("input")
                                                      input.type = "file"
                                                      input.accept = "image/*"
                                                      input.multiple = true
                                                      input.onchange = (e) => {
                                                        const files = (e.target as HTMLInputElement).files
                                                        if (files) {
                                                          const current = getDesignOrderDataForMarket(activeMarketTab)
                                                          const newImages = Array.from(files).map((file) => ({
                                                            id: `img-${Date.now()}-${Math.random()}`,
                                                            url: URL.createObjectURL(file),
                                                            name: file.name,
                                                          }))
                                                          const updated = (current.tabletScreenshotSpecs || []).map((s) =>
                                                            s.id === spec.id
                                                              ? { ...s, referenceImages: [...s.referenceImages, ...newImages] }
                                                              : s,
                                                          )
                                                          updateDesignOrderData(activeMarketTab, { tabletScreenshotSpecs: updated })
                                                        }
                                                      }
                                                      input.click()
                                                    }}
                                                  >
                                                    <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                                    <p className="text-sm text-muted-foreground mb-1">
                                                      Kéo thả ảnh vào đây hoặc click để chọn
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                      PNG, JPG, GIF up to 10MB
                                                    </p>
                                                  </div>

                                                  <div className="flex gap-2">
                                                    <Button
                                                      type="button"
                                                      variant="outline"
                                                      size="sm"
                                                      className="flex-1 bg-transparent"
                                                      onClick={() => openAssetLibrary("screenshot-tablet", spec.id)}
                                                    >
                                                      <FolderOpen className="h-4 w-4 mr-2" />
                                                      From Asset Library
                                                    </Button>
                                                  </div>

                                                  {spec.referenceImages.length > 0 && (
                                                    <div className="grid grid-cols-4 gap-2 mt-2">
                                                      {spec.referenceImages.map((img) => (
                                                        <div key={img.id} className="relative group">
                                                          <img
                                                            src={img.url || "/placeholder.svg"}
                                                            alt={img.name}
                                                            className="w-full h-20 object-cover rounded border"
                                                          />
                                                          <Button
                                                            variant="destructive"
                                                            size="icon"
                                                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            onClick={() => {
                                                              const current = getDesignOrderDataForMarket(activeMarketTab)
                                                              const updated = (current.tabletScreenshotSpecs || []).map((s) =>
                                                                s.id === spec.id
                                                                  ? {
                                                                      ...s,
                                                                      referenceImages: s.referenceImages.filter(
                                                                        (i) => i.id !== img.id,
                                                                      ),
                                                                    }
                                                                  : s,
                                                              )
                                                              updateDesignOrderData(activeMarketTab, {
                                                                tabletScreenshotSpecs: updated,
                                                              })
                                                            }}
                                                          >
                                                            <X className="h-3 w-3" />
                                                          </Button>
                                                        </div>
                                                      ))}
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                              {/* </CHANGE> */}
                                            </CardContent>
                                          </Card>
                                        ),
                                      )}
                                    </div>
                                  )}
                                </div>
                              </>
                            )}

                            {/* Promo Video */}
                            {getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.promoVideo && (
                              <>
                                {(getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.appIcon ||
                                  getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.featureBanner ||
                                  getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.screenshotsPhone ||
                                  getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.screenshotsTablet) && (
                                  <Separator />
                                )}
                                <div className="space-y-3">
                                  <h4 className="font-semibold text-base">Promo Video</h4>

                                  <div className="space-y-3">
                                    {Array.from({
                                      length: getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.promoVideoQty,
                                    }).map((_, idx) => {
                                      const current = getDesignOrderDataForMarket(activeMarketTab)
                                      if (!current.promoVideoSpecs || current.promoVideoSpecs.length <= idx) {
                                        const newSpecs = [...(current.promoVideoSpecs || [])]
                                        while (newSpecs.length <= idx) {
                                          newSpecs.push({
                                            id: `promo-video-${Date.now()}-${newSpecs.length}`,
                                            duration: "30s",
                                            description: "",
                                            concept: "",
                                            features: "",
                                            music: "",
                                            references: "",
                                            referenceVideos: [],
                                          })
                                          // </CHANGE>
                                        }
                                        updateDesignOrderData(activeMarketTab, { promoVideoSpecs: newSpecs })
                                      }

                                      const spec = current.promoVideoSpecs?.[idx] || {
                                        id: `promo-video-${idx}`,
                                        duration: "30s",
                                        description: "",
                                        concept: "",
                                        features: "",
                                        music: "",
                                        references: "",
                                        referenceVideos: [],
                                      }

                                      return (
                                        <Card key={spec.id} className="border-2">
                                          <CardHeader className="pb-3">
                                            <span className="font-semibold">Promo Video {idx + 1}</span>
                                          </CardHeader>
                                          <CardContent className="space-y-3">
                                            <div className="space-y-2">
                                              <Label>Mô tả</Label>
                                              <Textarea
                                                placeholder="Mô tả tổng quan về video promo..."
                                                rows={3}
                                                value={spec.description}
                                                onChange={(e) => {
                                                  const updated = [...(current.promoVideoSpecs || [])]
                                                  updated[idx] = { ...spec, description: e.target.value }
                                                  updateDesignOrderData(activeMarketTab, { promoVideoSpecs: updated })
                                                }}
                                              />
                                            </div>
                                            {/* </CHANGE> */}

                                            <div className="grid grid-cols-2 gap-3">
                                              <div className="space-y-2">
                                                <Label>Duration</Label>
                                                <Select
                                                  value={spec.duration}
                                                  onValueChange={(value) => {
                                                    const updated = [...(current.promoVideoSpecs || [])]
                                                    updated[idx] = { ...spec, duration: value }
                                                    updateDesignOrderData(activeMarketTab, { promoVideoSpecs: updated })
                                                  }}
                                                >
                                                  <SelectTrigger>
                                                    <SelectValue placeholder="Select duration" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    <SelectItem value="30s">30 seconds</SelectItem>
                                                    <SelectItem value="1min">1 minute</SelectItem>
                                                    <SelectItem value="2min">2 minutes</SelectItem>
                                                    <SelectItem value="custom">Custom</SelectItem>
                                                  </SelectContent>
                                                </Select>
                                              </div>

                                              <div className="space-y-2">
                                                <Label>Music Preferences</Label>
                                                <Input
                                                  placeholder="Upbeat, calm, energetic..."
                                                  value={spec.music}
                                                  onChange={(e) => {
                                                    const updated = [...(current.promoVideoSpecs || [])]
                                                    updated[idx] = { ...spec, music: e.target.value }
                                                    updateDesignOrderData(activeMarketTab, { promoVideoSpecs: updated })
                                                  }}
                                                />
                                              </div>
                                            </div>

                                            <div className="space-y-2">
                                              <Label>Reference Videos</Label>
                                              <div className="space-y-2">
                                                {/* Drag and drop area */}
                                                <div
                                                  className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                                                  onDragOver={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                  }}
                                                  onDrop={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                    const files = e.dataTransfer.files
                                                    if (files) {
                                                      const updated = [...(current.promoVideoSpecs || [])]
                                                      const newVideos = Array.from(files)
                                                        .filter(f => f.type.startsWith('video/'))
                                                        .map((file) => ({
                                                          id: `video-${Date.now()}-${Math.random()}`,
                                                          url: URL.createObjectURL(file),
                                                          name: file.name,
                                                          type: 'mockup' as const,
                                                        }))
                                                      updated[idx] = {
                                                        ...spec,
                                                        referenceVideos: [...spec.referenceVideos, ...newVideos],
                                                      }
                                                      updateDesignOrderData(activeMarketTab, { promoVideoSpecs: updated })
                                                    }
                                                  }}
                                                  onClick={() => {
                                                    const input = document.createElement("input")
                                                    input.type = "file"
                                                    input.accept = "video/*"
                                                    input.multiple = true
                                                    input.onchange = (e) => {
                                                      const files = (e.target as HTMLInputElement).files
                                                      if (files) {
                                                        const updated = [...(current.promoVideoSpecs || [])]
                                                        const newVideos = Array.from(files).map((file) => ({
                                                          id: `video-${Date.now()}-${Math.random()}`,
                                                          url: URL.createObjectURL(file),
                                                          name: file.name,
                                                          type: 'device' as const,
                                                        }))
                                                        updated[idx] = {
                                                          ...spec,
                                                          referenceVideos: [...spec.referenceVideos, ...newVideos],
                                                        }
                                                        updateDesignOrderData(activeMarketTab, { promoVideoSpecs: updated })
                                                      }
                                                    }
                                                    input.click()
                                                  }}
                                                >
                                                  <Video className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                                  <p className="text-sm text-muted-foreground mb-1">
                                                    Kéo thả video vào đây hoặc click để chọn
                                                  </p>
                                                  <p className="text-xs text-muted-foreground">
                                                    MP4, MOV, AVI up to 100MB
                                                  </p>
                                                </div>

                                                <div className="flex gap-2">
                                                  <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1 bg-transparent"
                                                    onClick={() => {
                                                      const input = document.createElement("input")
                                                      input.type = "file"
                                                      input.accept = "video/*"
                                                      input.multiple = true
                                                      input.onchange = (e) => {
                                                        const files = (e.target as HTMLInputElement).files
                                                        if (files) {
                                                          const updated = [...(current.promoVideoSpecs || [])]
                                                          const newVideos = Array.from(files).map((file) => ({
                                                            id: `video-${Date.now()}-${Math.random()}`,
                                                            url: URL.createObjectURL(file),
                                                            name: file.name,
                                                            type: 'device' as const,
                                                          }))
                                                          updated[idx] = {
                                                            ...spec,
                                                            referenceVideos: [...spec.referenceVideos, ...newVideos],
                                                          }
                                                          updateDesignOrderData(activeMarketTab, { promoVideoSpecs: updated })
                                                        }
                                                      }
                                                      input.click()
                                                    }}
                                                  >
                                                    <Upload className="h-4 w-4 mr-2" />
                                                    Upload từ thiết bị
                                                  </Button>
                                                  <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1 bg-transparent"
                                                    onClick={() => {
                                                      // TODO: Open Asset Library for videos
                                                      toast({
                                                        title: "Coming Soon",
                                                        description: "Asset Library cho videos đang được phát triển",
                                                      })
                                                    }}
                                                  >
                                                    <FolderOpen className="h-4 w-4 mr-2" />
                                                    Lấy từ Asset Library
                                                  </Button>
                                                </div>

                                                {spec.referenceVideos.length > 0 && (
                                                  <div className="space-y-2 mt-2">
                                                    {spec.referenceVideos.map((video) => (
                                                      <div key={video.id} className="flex items-center gap-2 p-2 border rounded">
                                                        <Video className="h-5 w-5 text-muted-foreground" />
                                                        <span className="text-sm flex-1 truncate">{video.name}</span>
                                                        <Badge variant="secondary" className="text-xs">
                                                          {video.type === 'mockup' ? 'Mockup' : video.type === 'device' ? 'Device' : 'Library'}
                                                        </Badge>
                                                        <Button
                                                          variant="ghost"
                                                          size="icon"
                                                          className="h-6 w-6"
                                                          onClick={() => {
                                                            const updated = [...(current.promoVideoSpecs || [])]
                                                            updated[idx] = {
                                                              ...spec,
                                                              referenceVideos: spec.referenceVideos.filter(
                                                                (v) => v.id !== video.id,
                                                              ),
                                                            }
                                                            updateDesignOrderData(activeMarketTab, {
                                                              promoVideoSpecs: updated,
                                                            })
                                                          }}
                                                        >
                                                          <X className="h-3 w-3" />
                                                        </Button>
                                                      </div>
                                                    ))}
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                            {/* </CHANGE> */}
                                          </CardContent>
                                        </Card>
                                      )
                                    })}
                                  </div>
                                </div>
                              </>
                            )}

                            {/* Other Assets */}
                            {getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.other && (
                              <>
                                {(getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.appIcon ||
                                  getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.featureBanner ||
                                  getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.screenshotsPhone ||
                                  getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.screenshotsTablet ||
                                  getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.promoVideo) && (
                                  <Separator />
                                )}
                                <div className="space-y-3">
                                  <h4 className="font-semibold text-base">Other Assets</h4>
                                  <div className="space-y-3">
                                    {/* Render specifications for other assets based on count and type */}
                                    {/* Example: */}
                                    {Array.from({
                                      length: getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.otherQty,
                                    }).map((_, idx) => (
                                      <Card key={idx} className="border-2 p-4">
                                        <div className="flex items-center justify-between mb-3">
                                          <span className="font-semibold">Other Asset {idx + 1}</span>
                                          <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>
                                        <div className="space-y-2">
                                          <Label>Description</Label>
                                          <Textarea
                                            placeholder="Describe the asset needed..."
                                            rows={3}
                                            // value={...} onChange={...}
                                          />
                                        </div>
                                        <div className="space-y-2 mt-3">
                                          <Label>Reference Files</Label>
                                          <div className="flex gap-2">
                                            <Button type="button" variant="outline" size="sm" className="flex-1 bg-transparent">
                                              <ImageIcon className="h-4 w-4 mr-2" />
                                              Upload Files
                                            </Button>
                                            <Button type="button" variant="outline" size="sm" className="flex-1 bg-transparent">
                                              <FolderOpen className="h-4 w-4 mr-2" />
                                              From Asset Library
                                            </Button>
                                          </div>
                                          {/* Display uploaded files */}
                                        </div>
                                      </Card>
                                    ))}
                                  </div>
                                </div>
                              </>
                            )}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </div>

          {/* Fixed Footer with 3 Buttons */}
          <DialogFooter className="flex-shrink-0 border-t pt-4 mt-4 sticky bottom-0 bg-background z-10">
            <div className="flex items-center justify-between w-full">
              <Button 
                variant="outline" 
                onClick={handleCancelClick}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleSaveDraftOrder}
                  disabled={isSubmitting || !hasFormData()}
                >
                  Save Draft
                </Button>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <Button 
                          onClick={handleSendOrderClick}
                          disabled={isSubmitting || !isDesignOrderComplete || isViewMode}
                        >
                          {isSubmitting ? "Sending..." : "Send Order"}
                        </Button>
                      </span>
                    </TooltipTrigger>
                    {!isDesignOrderComplete && !isViewMode && (
                      <TooltipContent side="top" className="max-w-xs">
                        <p className="text-sm">
                          Vui lòng điền đầy đủ các trường bắt buộc:
                          <ul className="list-disc list-inside mt-1">
                            {!getDesignOrderDataForMarket(activeMarketTab).designPIC && (
                              <li>Design PIC</li>
                            )}
                            {!getDesignOrderDataForMarket(activeMarketTab).deadline && (
                              <li>Deadline</li>
                            )}
                            {!(
                              getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.appIcon ||
                              getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.featureBanner ||
                              getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.screenshotsPhone ||
                              getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.screenshotsTablet ||
                              getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.promoVideo ||
                              getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.other
                            ) && (
                              <li>Chọn ít nhất 1 loại asset</li>
                            )}
                          </ul>
                        </p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </DialogFooter>

        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={isCancelConfirmOpen} onOpenChange={setIsCancelConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Order?</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn hủy order này không? Thay đổi chưa lưu sẽ bị mất.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelConfirmOpen(false)}>
              Keep Order
            </Button>
            <Button variant="destructive" onClick={confirmCancelWithData}>
              Cancel Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save Draft Confirmation Dialog */}
      <Dialog open={isSaveDraftConfirmOpen} onOpenChange={setIsSaveDraftConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Draft?</DialogTitle>
            <DialogDescription>
              Bạn có muốn lưu bản nháp này trước khi rời đi không?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSaveDraftConfirmOpen(false)}>
              Don't Save
            </Button>
            <Button onClick={handleSaveDraft}>Save Draft</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Order Confirmation Dialog with Preview */}
<Dialog open={isSendOrderConfirmOpen} onOpenChange={setIsSendOrderConfirmOpen}>
  <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
    <DialogHeader>
      <DialogTitle>Confirm Send Design Order</DialogTitle>
      <DialogDescription>
        Please review your order details before sending to the design team.
      </DialogDescription>
    </DialogHeader>
    
    {/* Warning về số lượt edit còn lại nếu đang chỉnh sửa order đã gửi */}
    {designOrderSentByMarket[activeMarketTab] && (
      <Alert variant="destructive" className="mx-0 mt-2">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Lưu ý:</strong> Đây là lần chỉnh sửa thứ {(editCountByMarket[activeMarketTab] || 0) + 1}/5. 
          Sau khi gửi, bạn còn <strong>{4 - (editCountByMarket[activeMarketTab] || 0)}</strong> lần chỉnh sửa cho market này.
        </AlertDescription>
      </Alert>
    )}
    
    <div className="flex-1 overflow-y-auto space-y-4 py-4">
      {/* Preview Order Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {/* ...existing code for order details preview... */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-muted-foreground">Design PIC:</span>
              <span className="ml-2 font-medium">
                {designTeamMembers.find(m => m.id === getDesignOrderDataForMarket(activeMarketTab).designPIC)?.name || "—"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Deadline:</span>
              <span className="ml-2 font-medium">
                {getDesignOrderDataForMarket(activeMarketTab).deadline || "—"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Priority:</span>
              <Badge variant={getDesignOrderDataForMarket(activeMarketTab).priority === "urgent" ? "destructive" : "secondary"} className="ml-2">
                {getDesignOrderDataForMarket(activeMarketTab).priority}
              </Badge>
            </div>
          </div>
          
          <Separator className="my-3" />
          
          <div>
            <span className="text-muted-foreground font-medium">Assets Needed:</span>
            <ul className="list-disc list-inside mt-1 space-y-1">
              {getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.appIcon && (
                <li>App Icon × {getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.appIconQty}</li>
              )}
              {getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.featureBanner && (
                <li>Feature Banner × {getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.featureBannerQty}</li>
              )}
              {getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.screenshotsPhone && (
                <li>Screenshots Phone × {getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.screenshotsPhoneQty}</li>
              )}
              {getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.screenshotsTablet && (
                <li>Screenshots Tablet × {getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.screenshotsTabletQty}</li>
              )}
              {getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.promoVideo && (
                <li>Promo Video × {getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.promoVideoQty}</li>
              )}
              {getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.other && (
                <li>{getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.otherText} × {getDesignOrderDataForMarket(activeMarketTab).assetsNeeded.otherQty}</li>
              )}
            </ul>
          </div>
          
          {getDesignOrderDataForMarket(activeMarketTab).campaignName && (
            <>
              <Separator className="my-3" />
              <div>
                <span className="text-muted-foreground">Campaign:</span>
                <span className="ml-2 font-medium">
                  {getDesignOrderDataForMarket(activeMarketTab).campaignName}
                </span>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
    
    <DialogFooter>
      <Button variant="outline" onClick={() => setIsSendOrderConfirmOpen(false)}>
        Back to Edit
      </Button>
      <Button onClick={confirmSendOrder} disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : (
          designOrderSentByMarket[activeMarketTab] 
            ? `Confirm & Update Order (${4 - (editCountByMarket[activeMarketTab] || 0)} edits left after)`
            : "Confirm & Send Order"
        )}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

      {/* Overview Dialog */}
      <Dialog open={isOverviewOpen} onOpenChange={setIsOverviewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>StoreKit Creation Overview</DialogTitle>
            <DialogDescription>
              Thông tin tổng quan về quá trình tạo StoreKit và các mục cần hoàn thành.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between font-medium text-sm">
              <span>General Info</span>
              <Badge variant={isGeneralInfoComplete ? "default" : "destructive"}>
                {isGeneralInfoComplete ? "Complete" : "Incomplete"}
              </Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between font-medium text-sm">
              <span>Default Metadata</span>
              <Badge variant={isDefaultMetadataComplete ? "default" : "destructive"}>
                {isDefaultMetadataComplete ? "Complete" : "Incomplete"}
              </Badge>
            </div>
            <Separator />
            <div className="flex flex-col gap-2">
              <span className="font-medium text-sm">Metadata per Market</span>
              <div className="flex flex-wrap gap-2">
                {getAllTabsStatus().map((tabStatus) => (
                  <Badge
                    key={tabStatus.tab}
                    variant={
                      tabStatus.status === "complete"
                        ? "default"
                        : tabStatus.status === "partial"
                        ? "outline"
                        : "destructive"
                    }
                  >
                    {tabStatus.tab} ({tabStatus.status})
                  </Badge>
                ))}
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between font-medium text-sm">
              <span>Design Order</span>
              <Badge variant={isDesignOrderComplete ? "default" : "destructive"}>
                {isDesignOrderComplete ? "Complete" : "Incomplete"}
              </Badge>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsOverviewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Asset Library Dialog */}
      <Dialog open={isAssetLibraryOpen} onOpenChange={setIsAssetLibraryOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Asset Library</DialogTitle>
            <DialogDescription>Browse and select assets from the library.</DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4 py-4">
            <div className="grid grid-cols-4 gap-4">
              {/* Asset Library Filters */}
              <div className="col-span-1 space-y-4">
                <Card className="p-4">
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-lg">Filters</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 space-y-4">
                    <div>
                      <Label>Asset Type</Label>
                      <Select
                        value={assetLibraryFilter.type || ""}
                        onValueChange={(value) =>
                          setAssetLibraryFilter((prev) => ({ ...prev, type: value as any }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Types</SelectItem>
                          <SelectItem value="app_icon">App Icon</SelectItem>
                          <SelectItem value="feature_graphic">Feature Graphic</SelectItem>
                          <SelectItem value="screenshot">Screenshot</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                        </SelectContent>
                      </Select>
                      </div>

                      {assetLibraryFilter.type === "screenshot" && (
                        <div>
                          <Label>Device Type</Label>
                          <Select
                            value={assetLibraryFilter.deviceType || ""}
                            onValueChange={(value) =>
                              setAssetLibraryFilter((prev) => ({ ...prev, deviceType: value === "" ? null : value }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="All Devices" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">All Devices</SelectItem>
                              <SelectItem value="iphone">iPhone</SelectItem>
                              <SelectItem value="ipad">iPad</SelectItem>
                              <SelectItem value="phone">Phone</SelectItem>
                              <SelectItem value="tablet">Tablet</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {/* Add Date Range and StoreKit Search if needed */}
                    </CardContent>
                  </Card>
              </div>

              {/* Asset Library Grid */}
              <div className="col-span-3">
                <div className="grid grid-cols-3 gap-4">
                  {mockAssetsForLibrary
                    .filter(
                      (asset) =>
                        (!assetLibraryFilter.type || asset.type === assetLibraryFilter.type) &&
                        (!assetLibraryFilter.deviceType ||
                          asset.deviceType === assetLibraryFilter.deviceType ||
                          (assetLibraryFilter.type === "screenshot" && // Handle cases where deviceType might be missing or generic
                            asset.type === "screenshot" &&
                            ["phone", "tablet"].includes(assetLibraryFilter.deviceType!))) &&
                        // Add more filtering logic here based on other filter states
                        true, // Placeholder for additional filters
                    )
                    .map((asset) => (
                      <Card
                        key={asset.id}
                        className={`relative group cursor-pointer ${
                          selectedAssets.includes(asset.id) ? "border-2 border-primary" : "border"
                        }`}
                        onClick={() => {
                          if (selectedAssets.includes(asset.id)) {
                            setSelectedAssets(selectedAssets.filter((id) => id !== asset.id))
                          } else {
                            setSelectedAssets([...selectedAssets, asset.id])
                          }
                        }}
                      >
                        <CardContent className="p-2">
                          <div className="aspect-square relative rounded overflow-hidden bg-gray-100">
                            <img
                              src={asset.thumbnailUrl || asset.fileUrl || "/placeholder.svg"}
                              alt={asset.fileName}
                              className="w-full h-full object-cover"
                            />
                            {asset.type === "video" && (
                              <Play className="absolute inset-0 m-auto h-10 w-10 text-white/70 backdrop-blur-sm" />
                            )}
                          </div>
                        </CardContent>
                        <CardFooter className="p-2 flex flex-col items-start">
                          <p className="text-xs font-medium truncate w-full">{asset.fileName}</p>
                          <p className="text-[0.6rem] text-muted-foreground truncate w-full">
                            {asset.type} • {asset.dimensions}
                          </p>
                        </CardFooter>
                        {selectedAssets.includes(asset.id) && (
                          <CheckCircle2 className="absolute top-1 right-1 h-5 w-5 text-primary bg-white rounded-full" />
                        )}
                      </Card>
                    ))}
                </div>
              </div>
            </div>
          </div>

           <DialogFooter className="flex-shrink-0 border-t pt-4 mt-4 sticky bottom-0 bg-background z-10">
            <div className="flex items-center justify-between w-full">
              <Button 
                variant="outline" 
                onClick={handleCancelClick}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleSaveDraftOrder}
                  disabled={isSubmitting || !hasFormData()}
                >
                  Save Draft
                </Button>
                
                <Button 
                  onClick={handleSendOrderClick}
                  disabled={isSubmitting || !isDesignOrderComplete}
                  className={!isDesignOrderComplete ? "opacity-50 cursor-not-allowed" : ""}
                >
                  {isSubmitting ? "Sending..." : "Send Order"}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      

{/* Discard Changes Confirmation Dialog */}
<Dialog open={showDiscardConfirm} onOpenChange={setShowDiscardConfirm}>
  <DialogContent className="max-w-md">
    <DialogHeader>
      <DialogTitle>Hủy thay đổi?</DialogTitle>
      <DialogDescription>
        Bạn có thay đổi chưa lưu. Bạn có chắc muốn đóng mà không lưu?
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline" onClick={() => setShowDiscardConfirm(false)}>
        Tiếp tục chỉnh sửa
      </Button>
      <Button 
        variant="destructive" 
        onClick={() => {
          setShowDiscardConfirm(false)
          setHasUnsavedChanges(false)
          setIsDesignOrderDialogOpen(false)
        }}
      >
        Hủy thay đổi
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
    </>
  )
}
