"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  ArrowLeft,
  Upload,
  X,
  Info,
  User,
  FileText,
  ImageIcon,
  Tag,
  RefreshCw,
  Check,
  AlertCircle,
  Copy,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Mock data cho apps (giống với trang list)
const mockApps = [
  { id: "1", name: "Fashion Show", bundleId: "com.example.fashionshow" },
  { id: "2", name: "Puzzle Master", bundleId: "com.example.puzzlemaster" },
  { id: "3", name: "Racing Game", bundleId: "com.example.racinggame" },
]

const marketOptions = [
  { value: "us", label: "🇺🇸 United States", locale: "en_US" },
  { value: "vn", label: "🇻🇳 Vietnam", locale: "vi_VN" },
  { value: "jp", label: "🇯🇵 Japan", locale: "ja_JP" },
  { value: "kr", label: "🇰🇷 South Korea", locale: "ko_KR" },
  { value: "uk", label: "🇬🇧 United Kingdom", locale: "en_GB" },
  { value: "ca", label: "🇨🇦 Canada", locale: "en_CA" },
  { value: "th", label: "🇹🇭 Thailand", locale: "th_TH" },
  { value: "id", label: "🇮🇩 Indonesia", locale: "id_ID" },
]

// Mock data cho ASO team members
const asoTeamMembers = [
  { id: "aso1", name: "Nguyễn Văn A", role: "ASO Lead" },
  { id: "aso2", name: "Trần Thị B", role: "ASO Specialist" },
  { id: "aso3", name: "Lê Văn C", role: "ASO Analyst" },
  { id: "aso4", name: "Phạm Thị D", role: "ASO Manager" },
]

const mockKeywordSuggestions = [
  "fashion",
  "shopping",
  "style",
  "clothing",
  "outfit",
  "trendy",
  "designer",
  "boutique",
  "wardrobe",
  "accessories",
  "sale",
  "discount",
  "new arrival",
  "collection",
  "brand",
  "online shopping",
  "fast fashion",
  "luxury",
  "casual",
  "formal",
]

type ScreenshotFile = {
  file: File
  caption: string
  preview: string
}

export default function CreateStoreKitPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const appId = searchParams.get("appId")
  const selectedApp = mockApps.find((app) => app.id === appId)

  const [formData, setFormData] = useState({
    name: "",
    version: "v1.0",
    platform: "ios",
    markets: [] as string[],
    owner: "", // Thêm owner field
    metadata: {} as Record<string, any>,
    sendToDesign: false,
    designBrief: "",
    designDeadline: "",
    designContact: "",
    designPriority: "normal" as "normal" | "high",
  })

  const [uploadedFiles, setUploadedFiles] = useState<{ type: string; files: File[] }[]>([])

  const [screenshots, setScreenshots] = useState<Record<string, ScreenshotFile[]>>({
    iphone: [],
    ipad: [],
    android_phone: [],
    android_7inch: [],
    android_10inch: [],
  })

  const [designAttachments, setDesignAttachments] = useState<File[]>([])

  const [selectedMarketForMetadata, setSelectedMarketForMetadata] = useState<string>("")
  const [isFormDirty, setIsFormDirty] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  const [metadataByMarket, setMetadataByMarket] = useState<
    Record<
      string,
      {
        title: string
        subtitle: string
        shortDesc: string
        fullDesc: string
        keywords: string
      }
    >
  >({})

  const [showImportDialog, setShowImportDialog] = useState(false)
  const [selectedImportVersion, setSelectedImportVersion] = useState("")

  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const [showCopyDialog, setShowCopyDialog] = useState(false)
  const [copyFromMarket, setCopyFromMarket] = useState("")
  const [copyToMarket, setCopyToMarket] = useState("")

  useEffect(() => {
    if (!appId) {
      toast({
        title: "⚠️ Thiếu thông tin",
        description: "Vui lòng chọn App trước khi tạo StoreKit.",
        variant: "destructive",
      })
      router.push("/applications/storekit")
    }
  }, [appId, router, toast])

  useEffect(() => {
    if (formData.markets.length > 0 && !selectedMarketForMetadata) {
      setSelectedMarketForMetadata(formData.markets[0])
    }
  }, [formData.markets, selectedMarketForMetadata])

  useEffect(() => {
    const hasChanges =
      formData.name !== "" ||
      formData.version !== "v1.0" ||
      formData.platform !== "ios" ||
      formData.markets.length > 0 ||
      formData.owner !== "" || // Thêm owner vào hasChanges
      formData.sendToDesign !== false ||
      formData.designBrief !== "" ||
      formData.designDeadline !== "" ||
      formData.designContact !== "" ||
      uploadedFiles.length > 0 ||
      designAttachments.length > 0 || // Check for design attachments changes
      Object.keys(metadataByMarket).some((key) => Object.values(metadataByMarket[key]).some((val) => val !== "")) // Check if metadata has any changes

    setIsFormDirty(hasChanges)
  }, [formData, uploadedFiles, metadataByMarket, designAttachments]) // Added metadataByMarket and designAttachments to dependencies

  useEffect(() => {
    if (!isFormDirty) return

    const timer = setTimeout(() => {
      // Mock autosave
      setIsSaving(true)
      setTimeout(() => {
        setLastSaved(new Date())
        setIsSaving(false)
      }, 500)
    }, 3000) // Autosave sau 3 giây không có thay đổi

    return () => clearTimeout(timer)
  }, [formData, metadataByMarket, screenshots, uploadedFiles, designAttachments, isFormDirty])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isFormDirty) {
        e.preventDefault()
        e.returnValue = ""
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [isFormDirty])

  useEffect(() => {
    // Mock logic: Giả sử version mới nhất là v1.2, gợi ý v1.3
    // Trong thực tế, sẽ fetch từ API để lấy version mới nhất của app
    const suggestedVersion = "v1.3"
    setFormData((prev) => ({ ...prev, version: suggestedVersion }))
  }, [])

  const handleSaveDraft = () => {
    const newId = Math.floor(Math.random() * 10000).toString()

    toast({
      title: "💾 Đã lưu bản nháp",
      description: `StoreKit "${formData.name}" đã được lưu dưới dạng Draft.`,
    })

    router.push(`/applications/storekit/${newId}`)
  }

  const handleCreateAndSendOrder = () => {
    const newId = Math.floor(Math.random() * 10000).toString()

    toast({
      title: "✅ Đã tạo và gửi Order",
      description: `StoreKit "${formData.name}" đã được tạo và gửi order đến Design Team.`,
    })

    router.push(`/applications/storekit/${newId}`)
  }

  const handleFileUpload = (type: string, files: FileList | null) => {
    if (!files) return
    const fileArray = Array.from(files)
    setUploadedFiles((prev) => {
      const existing = prev.find((item) => item.type === type)
      if (existing) {
        return prev.map((item) => (item.type === type ? { ...item, files: [...item.files, ...fileArray] } : item))
      }
      return [...prev, { type, files: fileArray }]
    })
    setIsFormDirty(true) // Mark form as dirty on file upload
  }

  const removeFile = (type: string, index: number) => {
    setUploadedFiles((prev) =>
      prev.map((item) => (item.type === type ? { ...item, files: item.files.filter((_, i) => i !== index) } : item)),
    )
    setIsFormDirty(true) // Mark form as dirty on file removal
  }

  const handleScreenshotUpload = (deviceType: string, files: FileList | null) => {
    if (!files) return

    const newScreenshots: ScreenshotFile[] = Array.from(files).map((file) => ({
      file,
      caption: "",
      preview: URL.createObjectURL(file),
    }))

    setScreenshots((prev) => ({
      ...prev,
      [deviceType]: [...(prev[deviceType] || []), ...newScreenshots],
    }))
    setIsFormDirty(true)
  }

  const updateScreenshotCaption = (deviceType: string, index: number, caption: string) => {
    setScreenshots((prev) => ({
      ...prev,
      [deviceType]: prev[deviceType].map((item, i) => (i === index ? { ...item, caption } : item)),
    }))
    setIsFormDirty(true)
  }

  const removeScreenshot = (deviceType: string, index: number) => {
    setScreenshots((prev) => ({
      ...prev,
      [deviceType]: prev[deviceType].filter((_, i) => i !== index),
    }))
    setIsFormDirty(true)
  }

  const replaceScreenshot = (deviceType: string, index: number, file: File) => {
    setScreenshots((prev) => ({
      ...prev,
      [deviceType]: prev[deviceType].map((item, i) =>
        i === index
          ? {
              ...item,
              file,
              preview: URL.createObjectURL(file),
            }
          : item,
      ),
    }))
    setIsFormDirty(true)
  }

  const moveScreenshot = (deviceType: string, fromIndex: number, toIndex: number) => {
    setScreenshots((prev) => {
      const items = [...prev[deviceType]]
      const [removed] = items.splice(fromIndex, 1)
      items.splice(toIndex, 0, removed)
      return {
        ...prev,
        [deviceType]: items,
      }
    })
    setIsFormDirty(true)
  }

  const handleCancel = () => {
    if (isFormDirty) {
      setShowCancelDialog(true)
    } else {
      router.push(`/applications/storekit?appId=${appId}`)
    }
  }

  const handleConfirmCancel = () => {
    setShowCancelDialog(false)
    router.push(`/applications/storekit?appId=${appId}`)
  }

  const getCharLimits = (platform: string) => {
    if (platform === "ios" || platform === "both") {
      return {
        title: 30,
        subtitle: 30,
        shortDesc: 170, // iOS promotional text
        fullDesc: 4000,
        keywords: 100, // iOS keywords field
      }
    } else {
      // Android
      return {
        title: 30,
        subtitle: 0, // Android không có subtitle
        shortDesc: 80,
        fullDesc: 4000,
        keywords: 80, // Android short description
      }
    }
  }

  const charLimits = getCharLimits(formData.platform)

  const updateMetadataForMarket = (market: string, field: string, value: string) => {
    setMetadataByMarket((prev) => ({
      ...prev,
      [market]: {
        ...(prev[market] || { title: "", subtitle: "", shortDesc: "", fullDesc: "", keywords: "" }),
        [field]: value,
      },
    }))
    setIsFormDirty(true)
  }

  const handleImportMetadata = () => {
    if (!selectedImportVersion) return

    // Mock: Import metadata cho tất cả markets đã chọn
    const importedData: Record<string, any> = {}
    formData.markets.forEach((market) => {
      importedData[market] = {
        title: `Imported Title for ${market}`,
        subtitle: "Imported Subtitle",
        shortDesc: "Imported short description from Metadata Tracking",
        fullDesc: "Imported full description with detailed information from Metadata Tracking system.",
        keywords: "imported, keywords, from, tracking",
      }
    })

    setMetadataByMarket(importedData)
    setShowImportDialog(false)
    setIsFormDirty(true)

    toast({
      title: "✅ Đã import metadata",
      description: `Metadata từ phiên bản ${selectedImportVersion} đã được nạp vào form.`,
    })
  }

  const handleCopyMetadata = () => {
    if (!copyFromMarket || !copyToMarket) return

    const sourceMetadata = metadataByMarket[copyFromMarket]
    if (!sourceMetadata) {
      toast({
        title: "⚠️ Lỗi",
        description: "Không tìm thấy metadata nguồn",
        variant: "destructive",
      })
      return
    }

    setMetadataByMarket((prev) => ({
      ...prev,
      [copyToMarket]: { ...sourceMetadata },
    }))

    setShowCopyDialog(false)
    setIsFormDirty(true)

    toast({
      title: "✅ Đã copy metadata",
      description: `Metadata từ ${marketOptions.find((m) => m.value === copyFromMarket)?.label} đã được copy sang ${marketOptions.find((m) => m.value === copyToMarket)?.label}`,
    })
  }

  const addKeywordFromSuggestion = (keyword: string) => {
    if (!selectedMarketForMetadata) return

    const currentMetadata = metadataByMarket[selectedMarketForMetadata] || {
      title: "",
      subtitle: "",
      shortDesc: "",
      fullDesc: "",
      keywords: "",
    }

    const currentKeywords = currentMetadata.keywords
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k)
    if (currentKeywords.includes(keyword)) {
      toast({
        title: "ℹ️ Thông báo",
        description: "Keyword này đã có trong danh sách",
      })
      return
    }

    const newKeywords = [...currentKeywords, keyword].join(", ")
    updateMetadataForMarket(selectedMarketForMetadata, "keywords", newKeywords)

    toast({
      title: "✅ Đã thêm keyword",
      description: `"${keyword}" đã được thêm vào danh sách keywords`,
    })
  }

  const getValidationStatus = () => {
    const checks = {
      basicInfo: {
        passed: formData.name && formData.owner && formData.markets.length > 0,
        label: "Thông tin cơ bản (Name, Owner, Markets)",
      },
      metadata: {
        passed: formData.markets.every((market) => {
          const meta = metadataByMarket[market]
          return meta && meta.title && meta.fullDesc && meta.keywords
        }),
        label: "Metadata cho tất cả markets (Title, Full Description, Keywords)",
      },
      assets: {
        passed:
          uploadedFiles.some((f) => f.type === "icon") && Object.values(screenshots).some((arr) => arr.length >= 4),
        label: "Assets (Icon + tối thiểu 4 screenshots/thiết bị)",
      },
      order: {
        passed: !formData.sendToDesign || (formData.designContact && formData.designBrief && formData.designDeadline),
        label: "Order info (nếu gửi order: Design PIC, Brief, Deadline)",
      },
    }

    return checks
  }

  const getAssetCounts = () => {
    const hasIcon = uploadedFiles.some((f) => f.type === "icon")
    const hasBanner = uploadedFiles.some((f) => f.type === "banner")
    const totalScreenshots = Object.values(screenshots).reduce((sum, arr) => sum + arr.length, 0)

    return { hasIcon, hasBanner, totalScreenshots }
  }

  const assetCounts = getAssetCounts()

  const useBriefTemplate = () => {
    const template = `**Mục tiêu KPI:**
- Tăng conversion rate từ store listing lên X%
- Cải thiện CTR của icon/screenshots

**Đối thủ tham chiếu:**
- [Tên app đối thủ 1]
- [Tên app đối thủ 2]

**Mood/Style:**
- Modern, clean, professional
- Màu sắc: [Gợi ý màu chủ đạo]
- Typography: [Sans-serif, bold headlines]

**Text bắt buộc:**
- [Các text/slogan phải xuất hiện trong design]

**Text cấm:**
- [Các từ ngữ/nội dung không được sử dụng]

**Lưu ý theo market:**
${formData.markets.map((m) => `- ${marketOptions.find((opt) => opt.value === m)?.label}: [Ghi chú riêng]`).join("\n")}

**Yêu cầu khác:**
- [Các yêu cầu bổ sung]`

    setFormData({ ...formData, designBrief: template })
    setIsFormDirty(true)
    toast({
      title: "✅ Đã áp dụng template",
      description: "Brief template đã được điền vào form. Vui lòng chỉnh sửa theo nhu cầu.",
    })
  }

  const handleDesignAttachmentUpload = (files: FileList | null) => {
    if (!files) return
    const fileArray = Array.from(files)
    setDesignAttachments((prev) => [...prev, ...fileArray])
    setIsFormDirty(true)
  }

  const removeDesignAttachment = (index: number) => {
    setDesignAttachments((prev) => prev.filter((_, i) => i !== index))
    setIsFormDirty(true)
  }

  const getAssetList = () => {
    const assets: string[] = []

    // Icon
    assets.push("App Icon (1024×1024)")

    // Feature Graphic/Banner cho Android
    if (formData.platform === "android" || formData.platform === "both") {
      assets.push("Feature Graphic (1024×500)")
    }

    // Screenshots theo platform
    if (formData.platform === "ios" || formData.platform === "both") {
      const iphoneCount = screenshots.iphone.length || 0
      const ipadCount = screenshots.ipad.length || 0
      if (iphoneCount > 0) assets.push(`iPhone Screenshots (${iphoneCount} ảnh)`)
      if (ipadCount > 0) assets.push(`iPad Screenshots (${ipadCount} ảnh)`)
    }

    if (formData.platform === "android" || formData.platform === "both") {
      const phoneCount = screenshots.android_phone.length || 0
      const tablet7Count = screenshots.android_7inch.length || 0
      const tablet10Count = screenshots.android_10inch.length || 0
      if (phoneCount > 0) assets.push(`Android Phone Screenshots (${phoneCount} ảnh)`)
      if (tablet7Count > 0) assets.push(`Android 7" Tablet Screenshots (${tablet7Count} ảnh)`)
      if (tablet10Count > 0) assets.push(`Android 10" Tablet Screenshots (${tablet10Count} ảnh)`)
    }

    return assets
  }

  if (!selectedApp) {
    return null // hoặc loading state
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="px-6 py-6">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/applications">Applications</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/applications">ASO</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/applications/storekit">StoreKit</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Create</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Back button & Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => router.push("/applications/storekit")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to List
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Create StoreKit</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Tạo StoreKit mới cho ứng dụng <span className="font-semibold">{selectedApp.name}</span>
                </p>
              </div>
            </div>

            {(isSaving || lastSaved) && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {isSaving ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Đã lưu lúc {lastSaved?.toLocaleTimeString("vi-VN")}</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        <form className="space-y-6">
          {/* App đã chọn (Read-only) */}
          <Card className="border-2 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                  {selectedApp.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{selectedApp.name}</h3>
                    <Badge variant="secondary">Đã chọn</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedApp.bundleId}</p>
                </div>
                <Alert className="max-w-md">
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    App đã được chọn từ trang danh sách. Nếu muốn đổi app, vui lòng quay lại và chọn app khác.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>

          {/* Form 2 cột */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cột trái */}
            <div className="space-y-6">
              {/* (A) Thông tin chung */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    <span className="font-bold">(A)</span> Thông tin chung
                  </CardTitle>
                  <CardDescription>Thông tin cơ bản về StoreKit</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">
                      StoreKit Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder={`${selectedApp.name} - Summer Collection`}
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value })
                        setIsFormDirty(true)
                      }}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Gợi ý: {"<AppName>"} {"<Theme/Season>"} (ví dụ: {selectedApp.name} - Holiday Update)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="version">
                      Version <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="version"
                      placeholder="v1.0"
                      value={formData.version}
                      onChange={(e) => {
                        setFormData({ ...formData, version: e.target.value })
                        setIsFormDirty(true)
                      }}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Tự động gợi ý dựa trên phiên bản mới nhất. <strong>Quy tắc:</strong> v1.0, v1.1, v2.0…
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="platform">
                      Platform <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.platform}
                      onValueChange={(value) => {
                        setFormData({ ...formData, platform: value })
                        setIsFormDirty(true)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ios">🍎 iOS</SelectItem>
                        <SelectItem value="android">🤖 Android</SelectItem>
                        <SelectItem value="both">🍎🤖 Both</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      Metadata và Assets sẽ điều chỉnh theo platform đã chọn
                    </p>
                  </div>

                  <div>
                    <Label>
                      Markets <span className="text-red-500">*</span>
                    </Label>
                    <div className="border rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto">
                      {marketOptions.map((market) => (
                        <div key={market.value} className="flex items-center gap-2">
                          <Checkbox
                            id={`market-${market.value}`}
                            checked={formData.markets.includes(market.value)}
                            onCheckedChange={(checked) => {
                              const newMarkets = checked
                                ? [...formData.markets, market.value]
                                : formData.markets.filter((m) => m !== market.value)
                              setFormData({ ...formData, markets: newMarkets })
                              setIsFormDirty(true)
                            }}
                          />
                          <Label htmlFor={`market-${market.value}`} className="text-sm cursor-pointer flex-1">
                            {market.label}
                          </Label>
                          <span className="text-xs text-muted-foreground font-mono">{market.locale}</span>
                        </div>
                      ))}
                    </div>
                    {formData.markets.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {formData.markets.map((market) => {
                          const marketData = marketOptions.find((m) => m.value === market)
                          return (
                            <Badge key={market} variant="secondary">
                              {marketData?.label}
                            </Badge>
                          )
                        })}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">Metadata tabs sẽ hiển thị theo markets đã chọn</p>
                  </div>

                  <div>
                    <Label htmlFor="owner">
                      Owner (ASO PIC) <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.owner}
                      onValueChange={(value) => {
                        setFormData({ ...formData, owner: value })
                        setIsFormDirty(true)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn người phụ trách ASO" />
                      </SelectTrigger>
                      <SelectContent>
                        {asoTeamMembers.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            <div className="flex items-center gap-2">
                              <span>{member.name}</span>
                              <span className="text-xs text-muted-foreground">({member.role})</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">Người chịu trách nhiệm chính cho StoreKit này</p>
                  </div>
                </CardContent>
              </Card>

              {/* (B) Metadata */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag className="h-5 w-5" />
                      <CardTitle>
                        <span className="font-bold">(B)</span> Metadata theo từng market
                      </CardTitle>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs max-w-xs">
                              Thay đổi filter App/Market có thể ảnh hưởng metadata khả dụng
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog open={showCopyDialog} onOpenChange={setShowCopyDialog}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" disabled={formData.markets.length < 2}>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy from...
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Copy Metadata từ market khác</DialogTitle>
                            <DialogDescription>
                              Sao chép metadata từ một market sang market khác để tiết kiệm thời gian.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div>
                              <Label>Copy từ</Label>
                              <Select value={copyFromMarket} onValueChange={setCopyFromMarket}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn market nguồn" />
                                </SelectTrigger>
                                <SelectContent>
                                  {formData.markets.map((market) => {
                                    const marketData = marketOptions.find((m) => m.value === market)
                                    return (
                                      <SelectItem key={market} value={market}>
                                        {marketData?.label}
                                      </SelectItem>
                                    )
                                  })}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Copy sang</Label>
                              <Select value={copyToMarket} onValueChange={setCopyToMarket}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn market đích" />
                                </SelectTrigger>
                                <SelectContent>
                                  {formData.markets
                                    .filter((m) => m !== copyFromMarket)
                                    .map((market) => {
                                      const marketData = marketOptions.find((m) => m.value === market)
                                      return (
                                        <SelectItem key={market} value={market}>
                                          {marketData?.label}
                                        </SelectItem>
                                      )
                                    })}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setShowCopyDialog(false)}>
                              Hủy
                            </Button>
                            <Button onClick={handleCopyMetadata} disabled={!copyFromMarket || !copyToMarket}>
                              Copy
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" disabled={formData.markets.length === 0}>
                            <FileText className="h-4 w-4 mr-2" />
                            Import từ Metadata Tracking
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Import Metadata từ Metadata Tracking</DialogTitle>
                            <DialogDescription>
                              Chọn phiên bản metadata để nạp vào form. Dữ liệu hiện tại sẽ bị ghi đè.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div>
                              <Label>Chọn phiên bản</Label>
                              <Select value={selectedImportVersion} onValueChange={setSelectedImportVersion}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn phiên bản metadata" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="v1.0">v1.0 - Holiday Campaign (Dec 2024)</SelectItem>
                                  <SelectItem value="v1.1">v1.1 - New Year Update (Jan 2025)</SelectItem>
                                  <SelectItem value="v1.2">v1.2 - Spring Collection (Mar 2025)</SelectItem>
                                  <SelectItem value="latest">Latest - Current Active</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Alert>
                              <Info className="h-4 w-4" />
                              <AlertDescription className="text-xs">
                                Metadata sẽ được import cho tất cả markets đã chọn: {formData.markets.join(", ")}
                              </AlertDescription>
                            </Alert>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setShowImportDialog(false)}>
                              Hủy
                            </Button>
                            <Button onClick={handleImportMetadata} disabled={!selectedImportVersion}>
                              Import
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  <CardDescription>
                    Metadata cho từng thị trường đã chọn. Giới hạn ký tự tự động điều chỉnh theo platform.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.markets.length === 0 && (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        Vui lòng chọn ít nhất một thị trường ở phần (A) Thông tin chung.
                      </AlertDescription>
                    </Alert>
                  )}

                  {formData.markets.length > 0 && (
                    <Tabs value={selectedMarketForMetadata} onValueChange={setSelectedMarketForMetadata}>
                      <TabsList className="w-full justify-start overflow-x-auto">
                        {formData.markets.map((market) => {
                          const marketData = marketOptions.find((m) => m.value === market)
                          return (
                            <TabsTrigger key={market} value={market} className="text-xs">
                              {marketData?.label.split(" ")[0]} {marketData?.label.split(" ")[1]}
                            </TabsTrigger>
                          )
                        })}
                      </TabsList>

                      {formData.markets.map((market) => {
                        const marketData = marketOptions.find((m) => m.value === market)
                        const metadata = metadataByMarket[market] || {
                          title: "",
                          subtitle: "",
                          shortDesc: "",
                          fullDesc: "",
                          keywords: "",
                        }

                        return (
                          <TabsContent key={market} value={market} className="space-y-4 mt-4">
                            <div className="flex items-center gap-2 mb-4">
                              <Badge variant="outline">{marketData?.label}</Badge>
                              <span className="text-xs text-muted-foreground font-mono">{marketData?.locale}</span>
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <Label htmlFor={`title-${market}`}>
                                  Title <span className="text-red-500">*</span>
                                </Label>
                                <span
                                  className={`text-xs ${
                                    metadata.title.length > charLimits.title
                                      ? "text-red-500 font-semibold"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {metadata.title.length}/{charLimits.title}
                                </span>
                              </div>
                              <Input
                                id={`title-${market}`}
                                placeholder="Tiêu đề ứng dụng trên cửa hàng"
                                value={metadata.title}
                                onChange={(e) => updateMetadataForMarket(market, "title", e.target.value)}
                                maxLength={charLimits.title}
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                {formData.platform === "ios" || formData.platform === "both"
                                  ? "iOS App Store: Tối đa 30 ký tự"
                                  : "Google Play: Tối đa 30 ký tự"}
                              </p>
                            </div>

                            {(formData.platform === "ios" || formData.platform === "both") && (
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <Label htmlFor={`subtitle-${market}`}>Subtitle</Label>
                                  <span
                                    className={`text-xs ${
                                      metadata.subtitle.length > charLimits.subtitle
                                        ? "text-red-500 font-semibold"
                                        : "text-muted-foreground"
                                    }`}
                                  >
                                    {metadata.subtitle.length}/{charLimits.subtitle}
                                  </span>
                                </div>
                                <Input
                                  id={`subtitle-${market}`}
                                  placeholder="Tiêu đề phụ ngắn (chỉ iOS)"
                                  value={metadata.subtitle}
                                  onChange={(e) => updateMetadataForMarket(market, "subtitle", e.target.value)}
                                  maxLength={charLimits.subtitle}
                                />
                                <p className="text-xs text-muted-foreground mt-1">iOS App Store: Tối đa 30 ký tự</p>
                              </div>
                            )}

                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <Label htmlFor={`short-desc-${market}`}>
                                  {formData.platform === "android" ? "Short Description" : "Promotional Text"}
                                </Label>
                                <span
                                  className={`text-xs ${
                                    metadata.shortDesc.length > charLimits.shortDesc
                                      ? "text-red-500 font-semibold"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {metadata.shortDesc.length}/{charLimits.shortDesc}
                                </span>
                              </div>
                              <Textarea
                                id={`short-desc-${market}`}
                                placeholder={
                                  formData.platform === "android"
                                    ? "Mô tả ngắn gọn (Google Play)"
                                    : "Promotional text (iOS)"
                                }
                                rows={2}
                                value={metadata.shortDesc}
                                onChange={(e) => updateMetadataForMarket(market, "shortDesc", e.target.value)}
                                maxLength={charLimits.shortDesc}
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                {formData.platform === "android"
                                  ? "Google Play: Tối đa 80 ký tự"
                                  : "iOS App Store: Tối đa 170 ký tự"}
                              </p>
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <Label htmlFor={`full-desc-${market}`}>
                                  Full Description <span className="text-red-500">*</span>
                                </Label>
                                <span
                                  className={`text-xs ${
                                    metadata.fullDesc.length > charLimits.fullDesc
                                      ? "text-red-500 font-semibold"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {metadata.fullDesc.length}/{charLimits.fullDesc}
                                </span>
                              </div>
                              <Textarea
                                id={`full-desc-${market}`}
                                placeholder="Mô tả chi tiết về ứng dụng"
                                rows={4}
                                value={metadata.fullDesc}
                                onChange={(e) => updateMetadataForMarket(market, "fullDesc", e.target.value)}
                                maxLength={charLimits.fullDesc}
                              />
                              <p className="text-xs text-muted-foreground mt-1">iOS & Google Play: Tối đa 4000 ký tự</p>
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <Label htmlFor={`keywords-${market}`}>
                                  Keywords <span className="text-red-500">*</span>
                                </Label>
                                <span
                                  className={`text-xs ${
                                    metadata.keywords.length > charLimits.keywords
                                      ? "text-red-500 font-semibold"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {metadata.keywords.length}/{charLimits.keywords}
                                </span>
                              </div>
                              <Textarea
                                id={`keywords-${market}`}
                                placeholder="từ khóa 1, từ khóa 2, từ khóa 3..."
                                rows={3}
                                value={metadata.keywords}
                                onChange={(e) => updateMetadataForMarket(market, "keywords", e.target.value)}
                                maxLength={charLimits.keywords}
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                {formData.platform === "ios" || formData.platform === "both"
                                  ? "iOS: Tối đa 100 ký tự, phân cách bằng dấu phẩy"
                                  : "Android: Tối đa 80 ký tự, phân cách bằng dấu phẩy"}
                              </p>
                            </div>
                          </TabsContent>
                        )
                      })}
                    </Tabs>
                  )}
                </CardContent>
              </Card>

              {formData.markets.length > 0 && selectedMarketForMetadata && (
                <Card className="border-blue-200 dark:border-blue-800">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Keyword Suggestions
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Top 20 keywords gợi ý gần đây. Click để thêm vào market đang chọn.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {mockKeywordSuggestions.map((keyword, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          className="text-xs h-7 bg-transparent"
                          onClick={() => addKeywordFromSuggestion(keyword)}
                        >
                          {keyword}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Cột phải */}
            <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
              {/* (C) Images/Assets */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      <CardTitle>
                        <span className="font-bold">(C)</span> Images/Assets
                      </CardTitle>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Info className="h-4 w-4 mr-2" />
                            Guidelines
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="max-w-xs">
                          <div className="space-y-2 text-xs">
                            <p className="font-semibold">Khuyến nghị:</p>
                            <ul className="list-disc list-inside space-y-1">
                              <li>6-8 ảnh cho mỗi thiết bị</li>
                              <li>Không có text bị cắt ở góc</li>
                              <li>Hiển thị tính năng chính</li>
                              <li>Sử dụng ảnh chất lượng cao</li>
                            </ul>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="flex items-center gap-4 mt-4 p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">Icon:</span>
                      {assetCounts.hasIcon ? (
                        <Badge variant="default" className="bg-green-600">
                          <Check className="h-3 w-3 mr-1" />✓
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <X className="h-3 w-3 mr-1" />✗
                        </Badge>
                      )}
                    </div>

                    {(formData.platform === "android" || formData.platform === "both") && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">Banner:</span>
                        {assetCounts.hasBanner ? (
                          <Badge variant="default" className="bg-green-600">
                            <Check className="h-3 w-3 mr-1" />✓
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <X className="h-3 w-3 mr-1" />✗
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">Screenshots:</span>
                      <Badge variant={assetCounts.totalScreenshots >= 4 ? "default" : "secondary"}>
                        {assetCounts.totalScreenshots}/8
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Icon */}
                  <div>
                    <Label>App Icon</Label>
                    <p className="text-xs text-muted-foreground mb-2">1024×1024px (iOS & Android)</p>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-blue-500 transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="icon-upload"
                        onChange={(e) => {
                          handleFileUpload("icon", e.target.files)
                          setIsFormDirty(true)
                        }}
                      />
                      <label htmlFor="icon-upload" className="cursor-pointer">
                        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-muted-foreground">Click hoặc kéo thả file vào đây</p>
                      </label>
                    </div>
                    {uploadedFiles
                      .find((item) => item.type === "icon")
                      ?.files.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-2 mt-2 p-2 bg-muted rounded">
                          <ImageIcon className="h-4 w-4" />
                          <span className="text-sm flex-1 truncate">{file.name}</span>
                          <Button variant="ghost" size="sm" onClick={() => removeFile("icon", idx)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                  </div>

                  {/* Feature Graphic/Banner - chỉ hiển thị cho Android */}
                  {(formData.platform === "android" || formData.platform === "both") && (
                    <div>
                      <Label>Feature Graphic / Banner</Label>
                      <p className="text-xs text-muted-foreground mb-2">1024×500px (Google Play)</p>
                      <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-blue-500 transition-colors cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="banner-upload"
                          onChange={(e) => {
                            handleFileUpload("banner", e.target.files)
                            setIsFormDirty(true)
                          }}
                        />
                        <label htmlFor="banner-upload" className="cursor-pointer">
                          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-muted-foreground">Click hoặc kéo thả file vào đây</p>
                        </label>
                      </div>
                      {uploadedFiles
                        .find((item) => item.type === "banner")
                        ?.files.map((file, idx) => (
                          <div key={idx} className="flex items-center gap-2 mt-2 p-2 bg-muted rounded">
                            <ImageIcon className="h-4 w-4" />
                            <span className="text-sm flex-1 truncate">{file.name}</span>
                            <Button variant="ghost" size="sm" onClick={() => removeFile("banner", idx)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                    </div>
                  )}

                  <div>
                    <Label>Screenshots</Label>
                    <p className="text-xs text-muted-foreground mb-2">
                      Upload screenshots cho từng loại thiết bị. Kéo thả để sắp xếp thứ tự.
                    </p>

                    <Tabs defaultValue={formData.platform === "ios" ? "iphone" : "android_phone"} className="mt-4">
                      <TabsList className="w-full justify-start overflow-x-auto">
                        {(formData.platform === "ios" || formData.platform === "both") && (
                          <>
                            <TabsTrigger value="iphone">🍎 iPhone</TabsTrigger>
                            <TabsTrigger value="ipad">🍎 iPad</TabsTrigger>
                          </>
                        )}
                        {(formData.platform === "android" || formData.platform === "both") && (
                          <>
                            <TabsTrigger value="android_phone">🤖 Phone</TabsTrigger>
                            <TabsTrigger value="android_7inch">🤖 7-inch</TabsTrigger>
                            <TabsTrigger value="android_10inch">🤖 10-inch</TabsTrigger>
                          </>
                        )}
                      </TabsList>

                      {/* iPhone Screenshots */}
                      {(formData.platform === "ios" || formData.platform === "both") && (
                        <TabsContent value="iphone" className="space-y-4">
                          <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-blue-500 transition-colors cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              id="iphone-upload"
                              onChange={(e) => handleScreenshotUpload("iphone", e.target.files)}
                            />
                            <label htmlFor="iphone-upload" className="cursor-pointer">
                              <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                              <p className="text-sm text-muted-foreground">Click hoặc kéo thả file vào đây</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                1290×2796px (iPhone 15 Pro Max) | Khuyến nghị: 6-8 ảnh
                              </p>
                            </label>
                          </div>

                          {screenshots.iphone.length > 0 && (
                            <div className="grid grid-cols-2 gap-4">
                              {screenshots.iphone.map((screenshot, idx) => (
                                <div key={idx} className="border rounded-lg p-2 space-y-2">
                                  <div className="relative aspect-[9/19.5] bg-muted rounded overflow-hidden">
                                    <img
                                      src={screenshot.preview || "/placeholder.svg"}
                                      alt={`Screenshot ${idx + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                      #{idx + 1}
                                    </div>
                                  </div>
                                  <Input
                                    placeholder="Ghi chú cho ảnh này..."
                                    value={screenshot.caption}
                                    onChange={(e) => updateScreenshotCaption("iphone", idx, e.target.value)}
                                    className="text-xs"
                                  />
                                  <div className="flex items-center gap-1">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="flex-1 bg-transparent"
                                      onClick={() => {
                                        const input = document.createElement("input")
                                        input.type = "file"
                                        input.accept = "image/*"
                                        input.onchange = (e) => {
                                          const file = (e.target as HTMLInputElement).files?.[0]
                                          if (file) replaceScreenshot("iphone", idx, file)
                                        }
                                        input.click()
                                      }}
                                    >
                                      <RefreshCw className="h-3 w-3 mr-1" />
                                      Replace
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="flex-1 bg-transparent"
                                      onClick={() => removeScreenshot("iphone", idx)}
                                    >
                                      <X className="h-3 w-3 mr-1" />
                                      Remove
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </TabsContent>
                      )}

                      {/* iPad Screenshots */}
                      {(formData.platform === "ios" || formData.platform === "both") && (
                        <TabsContent value="ipad" className="space-y-4">
                          <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-blue-500 transition-colors cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              id="ipad-upload"
                              onChange={(e) => handleScreenshotUpload("ipad", e.target.files)}
                            />
                            <label htmlFor="ipad-upload" className="cursor-pointer">
                              <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                              <p className="text-sm text-muted-foreground">Click hoặc kéo thả file vào đây</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                2048×2732px (iPad Pro 12.9") | Khuyến nghị: 6-8 ảnh
                              </p>
                            </label>
                          </div>

                          {screenshots.ipad.length > 0 && (
                            <div className="grid grid-cols-2 gap-4">
                              {screenshots.ipad.map((screenshot, idx) => (
                                <div key={idx} className="border rounded-lg p-2 space-y-2">
                                  <div className="relative aspect-[3/4] bg-muted rounded overflow-hidden">
                                    <img
                                      src={screenshot.preview || "/placeholder.svg"}
                                      alt={`Screenshot ${idx + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                      #{idx + 1}
                                    </div>
                                  </div>
                                  <Input
                                    placeholder="Ghi chú cho ảnh này..."
                                    value={screenshot.caption}
                                    onChange={(e) => updateScreenshotCaption("ipad", idx, e.target.value)}
                                    className="text-xs"
                                  />
                                  <div className="flex items-center gap-1">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="flex-1 bg-transparent"
                                      onClick={() => {
                                        const input = document.createElement("input")
                                        input.type = "file"
                                        input.accept = "image/*"
                                        input.onchange = (e) => {
                                          const file = (e.target as HTMLInputElement).files?.[0]
                                          if (file) replaceScreenshot("ipad", idx, file)
                                        }
                                        input.click()
                                      }}
                                    >
                                      <RefreshCw className="h-3 w-3 mr-1" />
                                      Replace
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="flex-1 bg-transparent"
                                      onClick={() => removeScreenshot("ipad", idx)}
                                    >
                                      <X className="h-3 w-3 mr-1" />
                                      Remove
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </TabsContent>
                      )}

                      {/* Android Phone Screenshots */}
                      {(formData.platform === "android" || formData.platform === "both") && (
                        <TabsContent value="android_phone" className="space-y-4">
                          <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-blue-500 transition-colors cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              id="android-phone-upload"
                              onChange={(e) => handleScreenshotUpload("android_phone", e.target.files)}
                            />
                            <label htmlFor="android-phone-upload" className="cursor-pointer">
                              <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                              <p className="text-sm text-muted-foreground">Click hoặc kéo thả file vào đây</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                1080×1920px (Phone) | Khuyến nghị: 6-8 ảnh
                              </p>
                            </label>
                          </div>

                          {screenshots.android_phone.length > 0 && (
                            <div className="grid grid-cols-2 gap-4">
                              {screenshots.android_phone.map((screenshot, idx) => (
                                <div key={idx} className="border rounded-lg p-2 space-y-2">
                                  <div className="relative aspect-[9/16] bg-muted rounded overflow-hidden">
                                    <img
                                      src={screenshot.preview || "/placeholder.svg"}
                                      alt={`Screenshot ${idx + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                      #{idx + 1}
                                    </div>
                                  </div>
                                  <Input
                                    placeholder="Ghi chú cho ảnh này..."
                                    value={screenshot.caption}
                                    onChange={(e) => updateScreenshotCaption("android_phone", idx, e.target.value)}
                                    className="text-xs"
                                  />
                                  <div className="flex items-center gap-1">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="flex-1 bg-transparent"
                                      onClick={() => {
                                        const input = document.createElement("input")
                                        input.type = "file"
                                        input.accept = "image/*"
                                        input.onchange = (e) => {
                                          const file = (e.target as HTMLInputElement).files?.[0]
                                          if (file) replaceScreenshot("android_phone", idx, file)
                                        }
                                        input.click()
                                      }}
                                    >
                                      <RefreshCw className="h-3 w-3 mr-1" />
                                      Replace
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="flex-1 bg-transparent"
                                      onClick={() => removeScreenshot("android_phone", idx)}
                                    >
                                      <X className="h-3 w-3 mr-1" />
                                      Remove
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </TabsContent>
                      )}

                      {/* Android 7-inch Screenshots */}
                      {(formData.platform === "android" || formData.platform === "both") && (
                        <TabsContent value="android_7inch" className="space-y-4">
                          <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-blue-500 transition-colors cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              id="android-7inch-upload"
                              onChange={(e) => handleScreenshotUpload("android_7inch", e.target.files)}
                            />
                            <label htmlFor="android-7inch-upload" className="cursor-pointer">
                              <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                              <p className="text-sm text-muted-foreground">Click hoặc kéo thả file vào đây</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                1024×600px (7-inch Tablet) | Khuyến nghị: 6-8 ảnh
                              </p>
                            </label>
                          </div>

                          {screenshots.android_7inch.length > 0 && (
                            <div className="grid grid-cols-2 gap-4">
                              {screenshots.android_7inch.map((screenshot, idx) => (
                                <div key={idx} className="border rounded-lg p-2 space-y-2">
                                  <div className="relative aspect-[16/10] bg-muted rounded overflow-hidden">
                                    <img
                                      src={screenshot.preview || "/placeholder.svg"}
                                      alt={`Screenshot ${idx + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                      #{idx + 1}
                                    </div>
                                  </div>
                                  <Input
                                    placeholder="Ghi chú cho ảnh này..."
                                    value={screenshot.caption}
                                    onChange={(e) => updateScreenshotCaption("android_7inch", idx, e.target.value)}
                                    className="text-xs"
                                  />
                                  <div className="flex items-center gap-1">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="flex-1 bg-transparent"
                                      onClick={() => {
                                        const input = document.createElement("input")
                                        input.type = "file"
                                        input.accept = "image/*"
                                        input.onchange = (e) => {
                                          const file = (e.target as HTMLInputElement).files?.[0]
                                          if (file) replaceScreenshot("android_7inch", idx, file)
                                        }
                                        input.click()
                                      }}
                                    >
                                      <RefreshCw className="h-3 w-3 mr-1" />
                                      Replace
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="flex-1 bg-transparent"
                                      onClick={() => removeScreenshot("android_7inch", idx)}
                                    >
                                      <X className="h-3 w-3 mr-1" />
                                      Remove
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </TabsContent>
                      )}

                      {/* Android 10-inch Screenshots */}
                      {(formData.platform === "android" || formData.platform === "both") && (
                        <TabsContent value="android_10inch" className="space-y-4">
                          <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-blue-500 transition-colors cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              id="android-10inch-upload"
                              onChange={(e) => handleScreenshotUpload("android_10inch", e.target.files)}
                            />
                            <label htmlFor="android-10inch-upload" className="cursor-pointer">
                              <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                              <p className="text-sm text-muted-foreground">Click hoặc kéo thả file vào đây</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                1920×1200px (10-inch Tablet) | Khuyến nghị: 6-8 ảnh
                              </p>
                            </label>
                          </div>

                          {screenshots.android_10inch.length > 0 && (
                            <div className="grid grid-cols-2 gap-4">
                              {screenshots.android_10inch.map((screenshot, idx) => (
                                <div key={idx} className="border rounded-lg p-2 space-y-2">
                                  <div className="relative aspect-[16/10] bg-muted rounded overflow-hidden">
                                    <img
                                      src={screenshot.preview || "/placeholder.svg"}
                                      alt={`Screenshot ${idx + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                      #{idx + 1}
                                    </div>
                                  </div>
                                  <Input
                                    placeholder="Ghi chú cho ảnh này..."
                                    value={screenshot.caption}
                                    onChange={(e) => updateScreenshotCaption("android_10inch", idx, e.target.value)}
                                    className="text-xs"
                                  />
                                  <div className="flex items-center gap-1">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="flex-1 bg-transparent"
                                      onClick={() => {
                                        const input = document.createElement("input")
                                        input.type = "file"
                                        input.accept = "image/*"
                                        input.onchange = (e) => {
                                          const file = (e.target as HTMLInputElement).files?.[0]
                                          if (file) replaceScreenshot("android_10inch", idx, file)
                                        }
                                        input.click()
                                      }}
                                    >
                                      <RefreshCw className="h-3 w-3 mr-1" />
                                      Replace
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="flex-1 bg-transparent"
                                      onClick={() => removeScreenshot("android_10inch", idx)}
                                    >
                                      <X className="h-3 w-3 mr-1" />
                                      Remove
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </TabsContent>
                      )}
                    </Tabs>
                  </div>
                </CardContent>
              </Card>

              {/* (D) Gửi yêu cầu Design */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <span className="font-bold">(D)</span> Gửi yêu cầu Design (Order StoreKit)
                  </CardTitle>
                  <CardDescription>Tùy chọn gửi order đến Design Team ngay lập tức</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="send-to-design"
                      checked={formData.sendToDesign}
                      onCheckedChange={(checked) => {
                        setFormData({ ...formData, sendToDesign: checked as boolean })
                        setIsFormDirty(true)
                      }}
                    />
                    <Label htmlFor="send-to-design" className="cursor-pointer">
                      Gửi order đến Design Team ngay lập tức
                    </Label>
                  </div>

                  {formData.sendToDesign && (
                    <div className="space-y-4 border-l-2 border-blue-500 pl-4">
                      <div>
                        <Label htmlFor="design-priority">
                          Priority <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={formData.designPriority}
                          onValueChange={(value: "normal" | "high") => {
                            setFormData({ ...formData, designPriority: value })
                            setIsFormDirty(true)
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">🟢 Normal</SelectItem>
                            <SelectItem value="high">🔴 High</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground mt-1">High priority sẽ được ưu tiên xử lý trước</p>
                      </div>

                      <div>
                        <Label htmlFor="design-contact">
                          Design PIC <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={formData.designContact}
                          onValueChange={(value) => {
                            setFormData({ ...formData, designContact: value })
                            setIsFormDirty(true)
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn Design PIC" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="designer1">Nguyễn Văn A (Senior Designer)</SelectItem>
                            <SelectItem value="designer2">Trần Thị B (UI/UX Designer)</SelectItem>
                            <SelectItem value="designer3">Lê Văn C (Graphic Designer)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="design-deadline">
                          Desired Deadline <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="design-deadline"
                          type="date"
                          value={formData.designDeadline}
                          onChange={(e) => {
                            setFormData({ ...formData, designDeadline: e.target.value })
                            setIsFormDirty(true)
                          }}
                          min={new Date().toISOString().split("T")[0]}
                        />
                        <p className="text-xs text-muted-foreground mt-1">Thời hạn mong muốn hoàn thành design</p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <Label htmlFor="design-brief">
                            Brief <span className="text-red-500">*</span>
                          </Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={useBriefTemplate}
                            disabled={formData.markets.length === 0}
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            Use Template
                          </Button>
                        </div>
                        <Textarea
                          id="design-brief"
                          placeholder="Mô tả chi tiết yêu cầu design: mục tiêu KPI, đối thủ tham chiếu, mood/style, text bắt buộc/cấm, lưu ý market..."
                          rows={8}
                          value={formData.designBrief}
                          onChange={(e) => {
                            setFormData({ ...formData, designBrief: e.target.value })
                            setIsFormDirty(true)
                          }}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Click "Use Template" để sử dụng mẫu brief có sẵn
                        </p>
                      </div>

                      <div>
                        <Label>Attachments (Optional)</Label>
                        <p className="text-xs text-muted-foreground mb-2">
                          File tham chiếu: mockup, competitor screenshots, brand guidelines...
                        </p>
                        <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-blue-500 transition-colors cursor-pointer">
                          <input
                            type="file"
                            multiple
                            className="hidden"
                            id="design-attachments-upload"
                            onChange={(e) => handleDesignAttachmentUpload(e.target.files)}
                          />
                          <label htmlFor="design-attachments-upload" className="cursor-pointer">
                            <Upload className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-muted-foreground">Click hoặc kéo thả file vào đây</p>
                            <p className="text-xs text-muted-foreground mt-1">PDF, PNG, JPG, ZIP (tối đa 10MB/file)</p>
                          </label>
                        </div>

                        {designAttachments.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {designAttachments.map((file, idx) => (
                              <div key={idx} className="flex items-center gap-2 p-2 bg-muted rounded">
                                <FileText className="h-4 w-4" />
                                <span className="text-sm flex-1 truncate">{file.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </span>
                                <Button variant="ghost" size="sm" onClick={() => removeDesignAttachment(idx)}>
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                        <CardHeader>
                          <CardTitle className="text-sm">Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">App</p>
                            <p className="font-semibold">{selectedApp.name}</p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Markets</p>
                            <div className="flex flex-wrap gap-1">
                              {formData.markets.length > 0 ? (
                                formData.markets.map((market) => {
                                  const marketData = marketOptions.find((m) => m.value === market)
                                  return (
                                    <Badge key={market} variant="secondary" className="text-xs">
                                      {marketData?.label.split(" ")[0]}
                                    </Badge>
                                  )
                                })
                              ) : (
                                <span className="text-xs text-muted-foreground">Chưa chọn market</span>
                              )}
                            </div>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Asset List cần làm</p>
                            {getAssetList().length > 0 ? (
                              <ul className="text-xs space-y-1">
                                {getAssetList().map((asset, idx) => (
                                  <li key={idx} className="flex items-start gap-1">
                                    <span className="text-blue-600">•</span>
                                    <span>{asset}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <span className="text-xs text-muted-foreground">Chưa có assets nào</span>
                            )}
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Priority</p>
                            <Badge variant={formData.designPriority === "high" ? "destructive" : "secondary"}>
                              {formData.designPriority === "high" ? "🔴 High" : "🟢 Normal"}
                            </Badge>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Deadline</p>
                            <p className="font-semibold">
                              {formData.designDeadline
                                ? new Date(formData.designDeadline).toLocaleDateString("vi-VN")
                                : "Chưa chọn"}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-950/20">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Review Checklist
              </CardTitle>
              <CardDescription className="text-xs">Kiểm tra các yêu cầu trước khi lưu hoặc gửi order</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(getValidationStatus()).map(([key, check]) => (
                  <div key={key} className="flex items-start gap-2">
                    {check.passed ? (
                      <Check className="h-4 w-4 text-green-600 mt-0.5" />
                    ) : (
                      <X className="h-4 w-4 text-red-600 mt-0.5" />
                    )}
                    <span
                      className={`text-sm ${check.passed ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}
                    >
                      {check.label}
                    </span>
                  </div>
                ))}
              </div>

              {assetCounts.totalScreenshots < 6 && (
                <Alert className="mt-4">
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    <strong>Khuyến nghị:</strong> Nên có 6-8 screenshots cho mỗi thiết bị để tối ưu conversion rate.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Footer Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <Button variant="outline" onClick={handleCancel}>
                  Hủy
                </Button>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={handleSaveDraft} disabled={!formData.name || !formData.owner}>
                    💾 Lưu bản nháp
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleCreateAndSendOrder}
                    disabled={
                      !formData.name ||
                      !formData.owner ||
                      formData.markets.length === 0 ||
                      (formData.sendToDesign &&
                        (!formData.designBrief || !formData.designContact || !formData.designDeadline))
                    }
                  >
                    {formData.sendToDesign ? "✅ Tạo & Gửi Order" : "✅ Tạo StoreKit"}
                  </Button>
                </div>
              </div>
              {(!formData.name || !formData.owner || formData.markets.length === 0) && (
                <Alert className="mt-4">
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Vui lòng điền đầy đủ các trường bắt buộc: Tên StoreKit, Owner (ASO PIC), và chọn ít nhất một Thị
                    trường để tạo StoreKit.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </form>
      </div>

      {/* Dialog xác nhận khi Cancel với form có thay đổi */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn hủy?</AlertDialogTitle>
            <AlertDialogDescription>
              Có thay đổi chưa được lưu trong form. Nếu bạn rời khỏi trang, tất cả các thay đổi sẽ bị mất.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Tiếp tục chỉnh sửa</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCancel} className="bg-red-600 hover:bg-red-700">
              Hủy và rời đi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
