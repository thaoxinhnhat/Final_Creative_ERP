"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  Plus,
  X,
  Upload,
  ImageIcon,
  FileText,
  AlertCircle,
  Info,
  Check,
  Clock,
  Save,
  Send,
  Copy,
  Sparkles,
} from "lucide-react"

// Mock apps data
const mockApps = [
  { id: "1", name: "Fashion Shopping App", packageId: "com.fashion.shop", icon: "/fashion-app-icon.jpg" },
  { id: "2", name: "Puzzle Game Pro", packageId: "com.puzzle.game", icon: "/puzzle-game-icon.png" },
  { id: "3", name: "Racing Legends", packageId: "com.racing.legends", icon: "/racing-game-icon.png" },
]

// Mock ASO team members
const asoTeamMembers = [
  { id: "1", name: "Nguyễn Văn A", role: "ASO Lead" },
  { id: "2", name: "Trần Thị B", role: "ASO Specialist" },
  { id: "3", name: "Lê Văn C", role: "ASO Analyst" },
]

// Mock design team members
const designTeamMembers = [
  { id: "1", name: "Phạm Thị D", role: "Design Lead" },
  { id: "2", name: "Hoàng Văn E", role: "UI Designer" },
  { id: "3", name: "Đỗ Thị F", role: "Graphic Designer" },
]

// Mock markets
const markets = [
  { code: "US", name: "United States", locale: "en-US" },
  { code: "VN", name: "Vietnam", locale: "vi-VN" },
  { code: "JP", name: "Japan", locale: "ja-JP" },
  { code: "KR", name: "South Korea", locale: "ko-KR" },
  { code: "TH", name: "Thailand", locale: "th-TH" },
  { code: "ID", name: "Indonesia", locale: "id-ID" },
  { code: "PH", name: "Philippines", locale: "en-PH" },
  { code: "MY", name: "Malaysia", locale: "ms-MY" },
  { code: "SG", name: "Singapore", locale: "en-SG" },
]

// Mock keyword suggestions
const keywordSuggestions = [
  "fashion",
  "shopping",
  "clothes",
  "style",
  "outfit",
  "trendy",
  "boutique",
  "wardrobe",
  "accessories",
  "sale",
  "discount",
  "brand",
  "designer",
  "casual",
  "formal",
  "summer",
  "winter",
  "collection",
  "new arrival",
  "best seller",
]

export default function CreateStoreKitPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const appId = searchParams.get("appId")
  const selectedApp = mockApps.find((app) => app.id === appId)

  // Form states
  const [formData, setFormData] = useState({
    appId: appId || "",
    name: "",
    version: "",
    platform: "both" as "ios" | "android" | "both",
    markets: [] as string[],
    owner: "",
  })

  const [metadata, setMetadata] = useState<Record<string, any>>({})
  const [selectedMetadataMarket, setSelectedMetadataMarket] = useState("")

  const [assets, setAssets] = useState({
    icon: null as File | null,
    banner: null as File | null,
    screenshots: {} as Record<string, Array<{ file: File; caption: string }>>,
  })

  const [sendOrderNow, setSendOrderNow] = useState(false)
  const [orderData, setOrderData] = useState({
    designPic: "",
    deadline: "",
    priority: "normal" as "normal" | "high",
    brief: "",
    attachments: [] as File[],
  })

  // UI states
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [showCopyDialog, setShowCopyDialog] = useState(false)
  const [copyFromMarket, setCopyFromMarket] = useState("")
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [isFormDirty, setIsFormDirty] = useState(false)
  const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saving" | "saved">("idle")
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null)

  // Initialize metadata for selected markets
  useEffect(() => {
    if (formData.markets.length > 0 && !selectedMetadataMarket) {
      setSelectedMetadataMarket(formData.markets[0])
    }

    // Initialize metadata for new markets
    formData.markets.forEach((market) => {
      if (!metadata[market]) {
        setMetadata((prev) => ({
          ...prev,
          [market]: {
            title: "",
            subtitle: "",
            shortDescription: "",
            fullDescription: "",
            keywords: "",
          },
        }))
      }
    })
  }, [formData.markets])

  // Auto-save simulation
  useEffect(() => {
    if (isFormDirty) {
      setAutoSaveStatus("saving")
      const timer = setTimeout(() => {
        setAutoSaveStatus("saved")
        setLastSavedTime(new Date())
        setTimeout(() => setAutoSaveStatus("idle"), 2000)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [formData, metadata, assets, orderData, isFormDirty])

  // Track form changes
  useEffect(() => {
    setIsFormDirty(true)
  }, [formData, metadata, assets, orderData])

  // Warn before leaving
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

  // Suggest version based on latest
  useEffect(() => {
    if (selectedApp && !formData.version) {
      // Mock: suggest next version
      setFormData((prev) => ({ ...prev, version: "v1.0" }))
    }
  }, [selectedApp])

  const handleSaveDraft = () => {
    const newId = Date.now().toString()
    toast({
      title: "Draft đã được tạo",
      description: "StoreKit đã được lưu dưới dạng bản nháp.",
    })
    setIsFormDirty(false)
    router.push(`/applications/storekit/${newId}`)
  }

  const handleCreateAndSendOrder = () => {
    if (!sendOrderNow || (sendOrderNow && orderData.designPic && orderData.deadline && orderData.brief)) {
      const newId = Date.now().toString()
      toast({
        title: sendOrderNow ? "Order đã được gửi" : "StoreKit đã được tạo",
        description: sendOrderNow
          ? "Order đã được gửi đến Design Team thành công."
          : "StoreKit đã được tạo thành công.",
      })
      setIsFormDirty(false)
      router.push(`/applications/storekit/${newId}`)
    } else {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng điền đầy đủ thông tin Order (Design PIC, Deadline, Brief).",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    if (isFormDirty) {
      setShowCancelDialog(true)
    } else {
      router.push(`/applications/storekit${appId ? `?appId=${appId}` : ""}`)
    }
  }

  const confirmCancel = () => {
    setIsFormDirty(false)
    router.push(`/applications/storekit${appId ? `?appId=${appId}` : ""}`)
  }

  const handleImportMetadata = () => {
    // Mock: Import metadata from Metadata Tracking
    if (selectedMetadataMarket) {
      setMetadata((prev) => ({
        ...prev,
        [selectedMetadataMarket]: {
          title: `${selectedApp?.name} - Premium Collection`,
          subtitle: "Shop the latest trends",
          shortDescription: "Discover amazing fashion deals and exclusive collections.",
          fullDescription:
            "Experience the best shopping app with thousands of products, exclusive deals, and fast delivery. Shop now and save big!",
          keywords: "fashion, shopping, clothes, style, outfit, trendy, boutique, wardrobe, accessories, sale",
        },
      }))
      toast({
        title: "Đã import metadata",
        description: `Metadata cho market ${selectedMetadataMarket} đã được nạp từ Metadata Tracking.`,
      })
      setShowImportDialog(false)
    }
  }

  const handleCopyMetadata = () => {
    if (copyFromMarket && selectedMetadataMarket && metadata[copyFromMarket]) {
      setMetadata((prev) => ({
        ...prev,
        [selectedMetadataMarket]: { ...metadata[copyFromMarket] },
      }))
      toast({
        title: "Đã copy metadata",
        description: `Metadata từ ${copyFromMarket} đã được copy sang ${selectedMetadataMarket}.`,
      })
      setShowCopyDialog(false)
    }
  }

  const handleUseBriefTemplate = () => {
    setOrderData((prev) => ({
      ...prev,
      brief: `**Mục tiêu KPI:**
- Tăng conversion rate 15%
- Tăng install rate 20%

**Đối thủ tham chiếu:**
- [Competitor App Name]
- [Another Competitor]

**Mood/Style:**
- Modern, clean, professional
- Bright colors, energetic vibe

**Text bắt buộc:**
- "Free Shipping"
- "Best Deals"

**Text cấm:**
- Không dùng "Cheap", "Low quality"

**Lưu ý theo market:**
- US: Focus on premium quality
- VN: Emphasize local payment methods`,
    }))
  }

  const addKeywordToMetadata = (keyword: string) => {
    if (selectedMetadataMarket && metadata[selectedMetadataMarket]) {
      const currentKeywords = metadata[selectedMetadataMarket].keywords || ""
      const newKeywords = currentKeywords ? `${currentKeywords}, ${keyword}` : keyword
      setMetadata((prev) => ({
        ...prev,
        [selectedMetadataMarket]: {
          ...prev[selectedMetadataMarket],
          keywords: newKeywords,
        },
      }))
    }
  }

  // Character limits based on platform
  const getCharLimit = (field: string) => {
    if (formData.platform === "ios" || formData.platform === "both") {
      if (field === "title") return 30
      if (field === "subtitle") return 30
      if (field === "keywords") return 100
    }
    if (formData.platform === "android") {
      if (field === "title") return 30
      if (field === "short") return 80
      if (field === "full") return 4000
      if (field === "keywords") return 80
    }
    return 1000
  }

  // Validation checklist
  const validation = {
    generalInfo:
      formData.name && formData.version && formData.platform && formData.markets.length > 0 && formData.owner,
    metadata: formData.markets.every(
      (market) =>
        metadata[market]?.title &&
        metadata[market]?.shortDescription &&
        metadata[market]?.fullDescription &&
        metadata[market]?.keywords,
    ),
    assets: assets.icon !== null && Object.keys(assets.screenshots).length > 0,
    order: !sendOrderNow || (orderData.designPic && orderData.deadline && orderData.brief),
  }

  const isFormValid = validation.generalInfo && validation.metadata && validation.assets && validation.order

  // Asset counters
  const assetCounters = {
    icon: assets.icon !== null,
    banner: assets.banner !== null,
    screenshots: Object.values(assets.screenshots).flat().length,
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <span>Applications</span>
            <span>/</span>
            <span>ASO</span>
            <span>/</span>
            <span>StoreKit</span>
            <span>/</span>
            <span className="text-foreground font-medium">Tạo mới</span>
          </div>

          {/* Title & Actions */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Tạo StoreKit mới</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Điền thông tin để tạo StoreKit mới cho app {selectedApp?.name || "đã chọn"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Autosave indicator */}
              {autoSaveStatus !== "idle" && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {autoSaveStatus === "saving" && (
                    <>
                      <Clock className="h-4 w-4 animate-spin" />
                      <span>Đang lưu...</span>
                    </>
                  )}
                  {autoSaveStatus === "saved" && lastSavedTime && (
                    <>
                      <Check className="h-4 w-4 text-green-600" />
                      <span>Đã lưu lúc {lastSavedTime.toLocaleTimeString()}</span>
                    </>
                  )}
                </div>
              )}
              <Button variant="outline" onClick={handleCancel}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Hủy
              </Button>
              <Button variant="outline" onClick={handleSaveDraft}>
                <Save className="h-4 w-4 mr-2" />
                Lưu nháp
              </Button>
              <Button
                onClick={handleCreateAndSendOrder}
                disabled={!isFormValid}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4 mr-2" />
                {sendOrderNow ? "Tạo & Gửi Order" : "Tạo StoreKit"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - 2 Columns */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Text/Metadata (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Selected App Display */}
            {selectedApp && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedApp.icon || "/placeholder.svg"}
                      alt={selectedApp.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <div className="font-semibold">{selectedApp.name}</div>
                      <div className="text-sm text-muted-foreground">{selectedApp.packageId}</div>
                    </div>
                    <Badge variant="secondary" className="ml-auto">
                      Đã chọn
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* (A) General Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="font-bold">(A)</span> Thông tin chung
                </CardTitle>
                <CardDescription>Thông tin cơ bản về StoreKit</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* App Selection (if not pre-selected) */}
                {!selectedApp && (
                  <div className="space-y-2">
                    <Label htmlFor="app">
                      App <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.appId}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, appId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn app" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockApps.map((app) => (
                          <SelectItem key={app.id} value={app.id}>
                            {app.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* StoreKit Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">
                    StoreKit Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder={`${selectedApp?.name || "AppName"} - Summer Collection`}
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                {/* Version */}
                <div className="space-y-2">
                  <Label htmlFor="version">
                    Version <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="version"
                    placeholder="v1.0"
                    value={formData.version}
                    onChange={(e) => setFormData((prev) => ({ ...prev, version: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground">Versioning rule: v1.0, v1.1, v2.0…</p>
                </div>

                {/* Platform */}
                <div className="space-y-2">
                  <Label>
                    Platform <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.platform}
                    onValueChange={(value: any) => setFormData((prev) => ({ ...prev, platform: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ios">iOS</SelectItem>
                      <SelectItem value="android">Android</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Markets */}
                <div className="space-y-2">
                  <Label>
                    Markets <span className="text-red-500">*</span>
                  </Label>
                  <div className="border rounded-md p-3 space-y-2 max-h-48 overflow-y-auto">
                    {markets.map((market) => (
                      <div key={market.code} className="flex items-center gap-2">
                        <Checkbox
                          id={`market-${market.code}`}
                          checked={formData.markets.includes(market.code)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData((prev) => ({ ...prev, markets: [...prev.markets, market.code] }))
                            } else {
                              setFormData((prev) => ({
                                ...prev,
                                markets: prev.markets.filter((m) => m !== market.code),
                              }))
                            }
                          }}
                        />
                        <Label htmlFor={`market-${market.code}`} className="text-sm cursor-pointer">
                          {market.name} ({market.locale})
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Owner (ASO PIC) */}
                <div className="space-y-2">
                  <Label htmlFor="owner">
                    Owner (ASO PIC) <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.owner}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, owner: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn ASO PIC" />
                    </SelectTrigger>
                    <SelectContent>
                      {asoTeamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name} - {member.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Metadata tabs và Assets sẽ điều chỉnh theo Platform/Markets đã chọn
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* (B) Metadata per market */}
            {formData.markets.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <span className="font-bold">(B)</span> Metadata theo thị trường
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Thay đổi filter App/Market có thể ảnh hưởng metadata khả dụng</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </CardTitle>
                      <CardDescription>Nhập metadata cho từng thị trường</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setShowImportDialog(true)}>
                        <Upload className="h-4 w-4 mr-2" />
                        Import from Metadata Tracking
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCopyDialog(true)}
                        disabled={formData.markets.length < 2}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy from...
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs value={selectedMetadataMarket} onValueChange={setSelectedMetadataMarket}>
                    <TabsList className="w-full justify-start overflow-x-auto">
                      {formData.markets.map((market) => (
                        <TabsTrigger key={market} value={market}>
                          {market}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {formData.markets.map((market) => (
                      <TabsContent key={market} value={market} className="space-y-4 mt-4">
                        {/* Title */}
                        <div className="space-y-2">
                          <Label htmlFor={`title-${market}`}>
                            Title <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id={`title-${market}`}
                            placeholder="App title"
                            value={metadata[market]?.title || ""}
                            onChange={(e) =>
                              setMetadata((prev) => ({
                                ...prev,
                                [market]: { ...prev[market], title: e.target.value },
                              }))
                            }
                            maxLength={getCharLimit("title")}
                          />
                          <p className="text-xs text-muted-foreground">
                            {metadata[market]?.title?.length || 0}/{getCharLimit("title")} ký tự
                          </p>
                        </div>

                        {/* Subtitle (iOS only) */}
                        {(formData.platform === "ios" || formData.platform === "both") && (
                          <div className="space-y-2">
                            <Label htmlFor={`subtitle-${market}`}>Subtitle</Label>
                            <Input
                              id={`subtitle-${market}`}
                              placeholder="App subtitle"
                              value={metadata[market]?.subtitle || ""}
                              onChange={(e) =>
                                setMetadata((prev) => ({
                                  ...prev,
                                  [market]: { ...prev[market], subtitle: e.target.value },
                                }))
                              }
                              maxLength={getCharLimit("subtitle")}
                            />
                            <p className="text-xs text-muted-foreground">
                              {metadata[market]?.subtitle?.length || 0}/{getCharLimit("subtitle")} ký tự
                            </p>
                          </div>
                        )}

                        {/* Short Description */}
                        <div className="space-y-2">
                          <Label htmlFor={`short-${market}`}>
                            Short Description <span className="text-red-500">*</span>
                          </Label>
                          <Textarea
                            id={`short-${market}`}
                            placeholder="Brief description"
                            value={metadata[market]?.shortDescription || ""}
                            onChange={(e) =>
                              setMetadata((prev) => ({
                                ...prev,
                                [market]: { ...prev[market], shortDescription: e.target.value },
                              }))
                            }
                            maxLength={getCharLimit("short")}
                            rows={3}
                          />
                          <p className="text-xs text-muted-foreground">
                            {metadata[market]?.shortDescription?.length || 0}/{getCharLimit("short")} ký tự
                          </p>
                        </div>

                        {/* Full Description */}
                        <div className="space-y-2">
                          <Label htmlFor={`full-${market}`}>
                            Full Description <span className="text-red-500">*</span>
                          </Label>
                          <Textarea
                            id={`full-${market}`}
                            placeholder="Detailed description"
                            value={metadata[market]?.fullDescription || ""}
                            onChange={(e) =>
                              setMetadata((prev) => ({
                                ...prev,
                                [market]: { ...prev[market], fullDescription: e.target.value },
                              }))
                            }
                            maxLength={getCharLimit("full")}
                            rows={6}
                          />
                          <p className="text-xs text-muted-foreground">
                            {metadata[market]?.fullDescription?.length || 0}/{getCharLimit("full")} ký tự
                          </p>
                        </div>

                        {/* Keywords */}
                        <div className="space-y-2">
                          <Label htmlFor={`keywords-${market}`}>
                            Keywords <span className="text-red-500">*</span>
                          </Label>
                          <Textarea
                            id={`keywords-${market}`}
                            placeholder="keyword1, keyword2, keyword3"
                            value={metadata[market]?.keywords || ""}
                            onChange={(e) =>
                              setMetadata((prev) => ({
                                ...prev,
                                [market]: { ...prev[market], keywords: e.target.value },
                              }))
                            }
                            maxLength={getCharLimit("keywords")}
                            rows={3}
                          />
                          <p
                            className={`text-xs ${(metadata[market]?.keywords?.length || 0) > getCharLimit("keywords") ? "text-red-500" : "text-muted-foreground"}`}
                          >
                            {metadata[market]?.keywords?.length || 0}/{getCharLimit("keywords")} ký tự
                          </p>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            )}

            {/* Keywords Helper */}
            {formData.markets.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Keyword Suggestions
                  </CardTitle>
                  <CardDescription>Click vào keyword để thêm vào metadata của market đang chọn</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {keywordSuggestions.map((keyword, index) => (
                      <Button key={index} variant="outline" size="sm" onClick={() => addKeywordToMetadata(keyword)}>
                        <Plus className="h-3 w-3 mr-1" />
                        {keyword}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* (D) Order to Design */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="font-bold">(D)</span> Order StoreKit
                </CardTitle>
                <CardDescription>Gửi yêu cầu thiết kế đến Design Team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Toggle */}
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="send-order"
                    checked={sendOrderNow}
                    onCheckedChange={(checked) => setSendOrderNow(checked as boolean)}
                  />
                  <Label htmlFor="send-order" className="cursor-pointer">
                    Gửi order đến Design Team ngay lập tức
                  </Label>
                </div>

                {sendOrderNow && (
                  <div className="space-y-4 pt-4 border-t">
                    {/* Design PIC */}
                    <div className="space-y-2">
                      <Label htmlFor="design-pic">
                        Design PIC <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={orderData.designPic}
                        onValueChange={(value) => setOrderData((prev) => ({ ...prev, designPic: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn người nhận" />
                        </SelectTrigger>
                        <SelectContent>
                          {designTeamMembers.map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              {member.name} - {member.role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Deadline */}
                    <div className="space-y-2">
                      <Label htmlFor="deadline">
                        Thời hạn mong muốn <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={orderData.deadline}
                        onChange={(e) => setOrderData((prev) => ({ ...prev, deadline: e.target.value }))}
                      />
                    </div>

                    {/* Priority */}
                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <Select
                        value={orderData.priority}
                        onValueChange={(value: any) => setOrderData((prev) => ({ ...prev, priority: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Brief */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="brief">
                          Design Brief <span className="text-red-500">*</span>
                        </Label>
                        <Button variant="outline" size="sm" onClick={handleUseBriefTemplate}>
                          <FileText className="h-4 w-4 mr-2" />
                          Use Template
                        </Button>
                      </div>
                      <Textarea
                        id="brief"
                        placeholder="Mô tả yêu cầu thiết kế..."
                        value={orderData.brief}
                        onChange={(e) => setOrderData((prev) => ({ ...prev, brief: e.target.value }))}
                        rows={8}
                      />
                    </div>

                    {/* Attachments */}
                    <div className="space-y-2">
                      <Label htmlFor="attachments">Attachments (optional)</Label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Kéo thả file tham chiếu vào đây hoặc click để chọn
                        </p>
                        <Input
                          id="attachments"
                          type="file"
                          multiple
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files) {
                              setOrderData((prev) => ({
                                ...prev,
                                attachments: [...prev.attachments, ...Array.from(e.target.files!)],
                              }))
                            }
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById("attachments")?.click()}
                        >
                          Chọn file
                        </Button>
                      </div>
                      {orderData.attachments.length > 0 && (
                        <div className="space-y-2">
                          {orderData.attachments.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 border rounded">
                              <span className="text-sm">{file.name}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  setOrderData((prev) => ({
                                    ...prev,
                                    attachments: prev.attachments.filter((_, i) => i !== index),
                                  }))
                                }
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Graphics/Assets (1/3 width, sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* (C) Graphics / Assets */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="font-bold">(C)</span> Graphics / Assets
                  </CardTitle>
                  <CardDescription>Upload icon, banner và screenshots</CardDescription>

                  {/* Asset Counters */}
                  <div className="flex items-center gap-4 pt-2 text-sm">
                    <div className="flex items-center gap-1">
                      {assetCounters.icon ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                      <span>Icon</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {assetCounters.banner ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span>Banner</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {assetCounters.screenshots >= 4 ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                      )}
                      <span>Screenshots ({assetCounters.screenshots}/8)</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* App Icon */}
                  <div className="space-y-2">
                    <Label>
                      App Icon (1024×1024) <span className="text-red-500">*</span>
                    </Label>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center">
                      {assets.icon ? (
                        <div className="space-y-2">
                          <div className="w-24 h-24 mx-auto bg-muted rounded-lg flex items-center justify-center">
                            <ImageIcon className="h-12 w-12 text-muted-foreground" />
                          </div>
                          <p className="text-sm">{assets.icon.name}</p>
                          <div className="flex gap-2 justify-center">
                            <Button variant="outline" size="sm">
                              Replace
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setAssets((prev) => ({ ...prev, icon: null }))}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <ImageIcon className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mb-2">PNG/JPG, 1024×1024</p>
                          <Input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="icon-upload"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                setAssets((prev) => ({ ...prev, icon: e.target.files![0] }))
                              }
                            }}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById("icon-upload")?.click()}
                          >
                            Upload Icon
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Feature Graphic (Android only) */}
                  {(formData.platform === "android" || formData.platform === "both") && (
                    <div className="space-y-2">
                      <Label>Feature Graphic (1024×500)</Label>
                      <div className="border-2 border-dashed rounded-lg p-4 text-center">
                        {assets.banner ? (
                          <div className="space-y-2">
                            <div className="w-full h-24 bg-muted rounded-lg flex items-center justify-center">
                              <ImageIcon className="h-12 w-12 text-muted-foreground" />
                            </div>
                            <p className="text-sm">{assets.banner.name}</p>
                            <div className="flex gap-2 justify-center">
                              <Button variant="outline" size="sm">
                                Replace
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setAssets((prev) => ({ ...prev, banner: null }))}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground mb-2">PNG/JPG, 1024×500</p>
                            <Input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              id="banner-upload"
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  setAssets((prev) => ({ ...prev, banner: e.target.files![0] }))
                                }
                              }}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => document.getElementById("banner-upload")?.click()}
                            >
                              Upload Banner
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Screenshots */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>
                        Screenshots <span className="text-red-500">*</span>
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Khuyến nghị 6-8 ảnh/thiết bị</p>
                            <p>Không có text bị cắt</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="border rounded-lg p-3">
                      <p className="text-sm text-muted-foreground mb-2">Upload screenshots cho từng loại thiết bị</p>
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Screenshots
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Summary (if order enabled) */}
              {sendOrderNow && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div>
                      <div className="font-medium">App</div>
                      <div className="text-muted-foreground">{selectedApp?.name || "Chưa chọn"}</div>
                    </div>
                    <div>
                      <div className="font-medium">Markets</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {formData.markets.map((market) => (
                          <Badge key={market} variant="secondary">
                            {market}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">Assets cần làm</div>
                      <ul className="text-muted-foreground mt-1 space-y-1">
                        <li>• App Icon (1024×1024)</li>
                        {(formData.platform === "android" || formData.platform === "both") && (
                          <li>• Feature Graphic (1024×500)</li>
                        )}
                        <li>• Screenshots (6-8 ảnh/thiết bị)</li>
                      </ul>
                    </div>
                    {orderData.priority === "high" && <Badge variant="destructive">High Priority</Badge>}
                    {orderData.deadline && (
                      <div>
                        <div className="font-medium">Deadline</div>
                        <div className="text-muted-foreground">{orderData.deadline}</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Review & Validation Checklist */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Review Checklist</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    {validation.generalInfo ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                    <span>General Info đầy đủ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {validation.metadata ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                    <span>Metadata cho tất cả markets</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {validation.assets ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                    <span>Icon và Screenshots</span>
                  </div>
                  {sendOrderNow && (
                    <div className="flex items-center gap-2">
                      {validation.order ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                      <span>Order info đầy đủ</span>
                    </div>
                  )}
                  {!isFormValid && (
                    <Alert className="mt-3">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        Vui lòng hoàn thành tất cả thông tin bắt buộc
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Import Metadata Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import from Metadata Tracking</DialogTitle>
            <DialogDescription>Chọn phiên bản metadata để nạp vào market {selectedMetadataMarket}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Phiên bản metadata</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn phiên bản" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="v1">Version 1.0 - Latest</SelectItem>
                  <SelectItem value="v2">Version 0.9 - Previous</SelectItem>
                  <SelectItem value="v3">Version 0.8 - Archive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleImportMetadata}>Import</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Copy Metadata Dialog */}
      <Dialog open={showCopyDialog} onOpenChange={setShowCopyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Copy Metadata</DialogTitle>
            <DialogDescription>Copy metadata từ market khác sang {selectedMetadataMarket}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Copy from market</Label>
              <Select value={copyFromMarket} onValueChange={setCopyFromMarket}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn market" />
                </SelectTrigger>
                <SelectContent>
                  {formData.markets
                    .filter((m) => m !== selectedMetadataMarket)
                    .map((market) => (
                      <SelectItem key={market} value={market}>
                        {market}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCopyDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleCopyMetadata}>Copy</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận hủy</DialogTitle>
            <DialogDescription>
              Bạn có thay đổi chưa được lưu. Bạn có chắc muốn hủy và quay lại danh sách?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Tiếp tục chỉnh sửa
            </Button>
            <Button variant="destructive" onClick={confirmCancel}>
              Hủy và quay lại
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
