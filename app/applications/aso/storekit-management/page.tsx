"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Calendar,
  Search,
  Plus,
  Package,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  MoreVertical,
  Eye,
  Edit,
  Copy,
  Trash2,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
  Download,
  Info,
  LinkIcon,
  FileText,
  BarChart3,
  RefreshCw,
} from "lucide-react"
import { PROJECTS_DATA } from "@/app/applications/aso-dashboard/projects-data" // Assuming this path is correct

// Mock data cho apps
const mockApps = [
  { id: "1", name: "Fashion Show", bundleId: "com.example.fashionshow" },
  { id: "2", name: "Puzzle Master", bundleId: "com.example.puzzlemaster" },
  { id: "3", name: "Racing Game", bundleId: "com.example.racinggame" },
]

interface StoreKitItem {
  id: string
  name: string
  version: string
  app: string
  platform: string
  markets: string[]
  keywords: {
    count: number
    top5: string[]
  }
  images: {
    icon: number
    screenshot: number
    banner: number
    thumbnails: string[]
  }
  owner: string
  status: string
  createdDate: string
  updatedDate: string
  projectId?: string // Liên kết với Project
  metadataVersionId?: string // Liên kết với Metadata
  hasMetadataSync?: boolean // Có đồng bộ với Metadata không
  assetsPending?: number // Số asset đang chờ xử lý
}

const mockStoreKitItems: StoreKitItem[] = [
  {
    id: "1",
    name: "Summer Collection Update",
    version: "v2.1",
    app: "Fashion Show",
    platform: "iOS",
    markets: ["US", "UK", "CA"],
    keywords: {
      count: 25,
      top5: ["fashion", "style", "clothing", "shopping", "trendy"],
    },
    images: {
      icon: 3,
      screenshot: 8,
      banner: 2,
      thumbnails: ["/fashion-app-icon.jpg"],
    },
    owner: "Cao Thanh Tú",
    status: "pending_approval",
    createdDate: "2025-01-10",
    updatedDate: "2025-01-12 14:30",
    projectId: "1", // Liên kết với project P-1
    metadataVersionId: "meta_v1",
    hasMetadataSync: true, // Có đồng bộ với Metadata
    assetsPending: 2, // 2 asset đang chờ xử lý
  },
  {
    id: "2",
    name: "New Year Event",
    version: "v1.5",
    app: "Fashion Show",
    platform: "Android",
    markets: ["VN", "TH", "ID"],
    keywords: {
      count: 18,
      top5: ["new year", "sale", "discount", "event", "celebration"],
    },
    images: {
      icon: 2,
      screenshot: 6,
      banner: 1,
      thumbnails: ["/new-year-banner.jpg"],
    },
    owner: "Đàm Thị Huế",
    status: "in_design",
    createdDate: "2025-01-08",
    updatedDate: "2025-01-11 09:15",
    projectId: "2", // Thêm liên kết với project P-2
    metadataVersionId: "meta_v2", // Thêm liên kết với metadata
    hasMetadataSync: true, // Có đồng bộ với Metadata
    assetsPending: 5, // 5 asset đang chờ xử lý
  },
  {
    id: "3",
    name: "Holiday Special",
    version: "v3.0",
    app: "Puzzle Master",
    platform: "iOS",
    markets: ["Global"],
    keywords: {
      count: 32,
      top5: ["puzzle", "brain game", "logic", "challenge", "mind"],
    },
    images: {
      icon: 4,
      screenshot: 10,
      banner: 3,
      thumbnails: ["/puzzle-game-icon.png"],
    },
    owner: "Nguyễn Thị Phương Thúy",
    status: "published",
    createdDate: "2024-12-20",
    updatedDate: "2025-01-05 16:45",
    projectId: "3", // Thêm liên kết với project P-3
    hasMetadataSync: false, // Không đồng bộ với Metadata (chỉ StoreKit)
    assetsPending: 0, // Không có asset pending (đã published)
  },
  {
    id: "4",
    name: "Spring Update 2025",
    version: "v1.0",
    app: "Fashion Show",
    platform: "iOS",
    markets: ["JP", "KR"],
    keywords: {
      count: 20,
      top5: ["spring", "fashion", "collection", "new", "style"],
    },
    images: {
      icon: 2,
      screenshot: 5,
      banner: 2,
      thumbnails: ["/spring-fashion.jpg"],
    },
    owner: "Cao Thanh Tú",
    status: "draft",
    createdDate: "2025-01-13",
    updatedDate: "2025-01-13 10:20",
    hasMetadataSync: false,
    assetsPending: 0,
  },
  {
    id: "5",
    name: "Racing Championship",
    version: "v2.3",
    app: "Racing Game",
    platform: "Android",
    markets: ["US", "BR", "MX"],
    keywords: {
      count: 28,
      top5: ["racing", "car", "speed", "championship", "multiplayer"],
    },
    images: {
      icon: 3,
      screenshot: 12,
      banner: 4,
      thumbnails: ["/high-speed-street-race.png"],
    },
    owner: "Đàm Thị Huế",
    status: "approved",
    createdDate: "2025-01-09",
    updatedDate: "2025-01-12 11:00",
    projectId: "5", // Thêm liên kết với project P-5
    metadataVersionId: "meta_v5", // Thêm liên kết với metadata
    hasMetadataSync: true, // Có đồng bộ với Metadata
    assetsPending: 1, // 1 asset đang chờ xử lý
  },
]

const statusOptions = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "draft", label: "Draft" },
  { value: "in_design", label: "In Design" },
  { value: "pending_approval", label: "Pending Approval" },
  { value: "approved", label: "Approved" },
  { value: "published", label: "Published" },
  { value: "rejected", label: "Rejected" },
]

const dateRangeOptions = [
  { label: "Hôm nay", value: "today" },
  { label: "7 ngày qua", value: "7days" },
  { label: "30 ngày qua", value: "30days" },
  { label: "90 ngày qua", value: "90days" },
  { label: "Tùy chỉnh", value: "custom" },
]

const getStatusBadge = (status: string) => {
  const statusConfig: Record<string, { label: string; className: string; icon: any }> = {
    draft: { label: "Draft", className: "bg-gray-100 text-gray-700", icon: Clock },
    in_design: { label: "In Design", className: "bg-blue-100 text-blue-700", icon: Loader2 },
    pending_approval: { label: "Pending Approval", className: "bg-yellow-100 text-yellow-700", icon: AlertCircle },
    approved: { label: "Approved", className: "bg-green-100 text-green-700", icon: CheckCircle2 },
    published: { label: "Published", className: "bg-purple-100 text-purple-700", icon: CheckCircle2 },
    rejected: { label: "Rejected", className: "bg-red-100 text-red-700", icon: XCircle },
  }

  const config = statusConfig[status] || statusConfig.draft
  const Icon = config.icon

  return (
    <Badge variant="secondary" className={config.className}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  )
}

export default function StoreKitManagementPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const projectIdFromUrl = searchParams.get("project_id")

  const [selectedAppId, setSelectedAppId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [platformFilter, setPlatformFilter] = useState("all")
  const [marketFilter, setMarketFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateRangeType, setDateRangeType] = useState("30days")
  const [customStartDate, setCustomStartDate] = useState("")
  const [customEndDate, setCustomEndDate] = useState("")
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("list")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [selectedStoreKit, setSelectedStoreKit] = useState<StoreKitItem | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [detailTab, setDetailTab] = useState("assets")

  // State for the "Create StoreKit" tab
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>([])
  const [sendToDesign, setSendToDesign] = useState(false)

  useEffect(() => {
    if (projectIdFromUrl) {
      const project = PROJECTS_DATA.find((p) => p.id === projectIdFromUrl)
      if (project) {
        const app = mockApps.find((a) => a.name === project.appName)
        if (app) {
          setSelectedAppId(app.id)
        }
      }
    }
  }, [projectIdFromUrl])

  const selectedApp = mockApps.find((app) => app.id === selectedAppId)

  const filteredItems = mockStoreKitItems.filter((item) => {
    if (!selectedAppId) return false
    const matchesApp = item.app === selectedApp?.name
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.version.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPlatform = platformFilter === "all" || item.platform.toLowerCase() === platformFilter
    const matchesMarket = marketFilter === "all" || item.markets.includes(marketFilter.toUpperCase())
    const matchesStatus = statusFilter === "all" || item.status === statusFilter

    const matchesProject = !projectIdFromUrl || item.projectId === projectIdFromUrl

    return matchesApp && matchesSearch && matchesPlatform && matchesMarket && matchesStatus && matchesProject
  })

  const getDateRangeLabel = () => {
    const option = dateRangeOptions.find((opt) => opt.value === dateRangeType)
    if (dateRangeType === "custom" && customStartDate && customEndDate) {
      return `${customStartDate} → ${customEndDate}`
    }
    return option?.label || "Chọn khoảng thời gian"
  }

  const handleApplyDateRange = () => {
    setDatePickerOpen(false)
  }

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedItems = filteredItems.slice(startIndex, endIndex)

  const handleRequestAsset = (item: StoreKitItem) => {
    console.log("[v0] Request asset for StoreKit:", item.id)
    // TODO: Navigate to Asset Production & Approval
  }

  const handleViewAssetProgress = (item: StoreKitItem) => {
    console.log("[v0] View asset progress for StoreKit:", item.id)
    // TODO: Navigate to Asset Production & Approval detail
  }

  const handleViewProject = (item: StoreKitItem) => {
    if (item.projectId) {
      router.push(`/applications/aso-dashboard/${item.projectId}`)
    }
  }

  const handleViewPerformance = (item: StoreKitItem) => {
    console.log("[v0] View performance for StoreKit:", item.id)
    // TODO: Navigate to Optimization & Tracking
  }

  const handleOpenDetail = (item: StoreKitItem) => {
    setSelectedStoreKit(item)
    setIsDetailModalOpen(true)
    setDetailTab("assets")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">StoreKit Management</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Quản lý StoreKit theo quy trình 4 lane: ASO Team → Art/Design → Lead Marketing → Publish
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Tạo StoreKit mới
          </Button>
        </div>

        <div className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Row 1: App Selector (bắt buộc) */}
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Chọn App <span className="text-red-500">*</span>
                    </label>
                    <Select value={selectedAppId || ""} onValueChange={setSelectedAppId}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Tìm kiếm và chọn app..." />
                      </SelectTrigger>
                      <SelectContent>
                        {mockApps.map((app) => (
                          <SelectItem key={app.id} value={app.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{app.name}</span>
                              <span className="text-xs text-muted-foreground">{app.bundleId}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Row 2: Filters */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Market/Region
                    </label>
                    <Select value={marketFilter} onValueChange={setMarketFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả thị trường</SelectItem>
                        <SelectItem value="global">🌍 Global</SelectItem>
                        <SelectItem value="us">🇺🇸 United States</SelectItem>
                        <SelectItem value="vn">🇻🇳 Vietnam</SelectItem>
                        <SelectItem value="jp">🇯🇵 Japan</SelectItem>
                        <SelectItem value="kr">🇰🇷 South Korea</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex-1 min-w-[200px]">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Platform</label>
                    <Select value={platformFilter} onValueChange={setPlatformFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả platform</SelectItem>
                        <SelectItem value="ios">🍎 iOS</SelectItem>
                        <SelectItem value="android">🤖 Android</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex-1 min-w-[200px]">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Period</label>
                    <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start bg-transparent">
                          <Calendar className="h-4 w-4 mr-2" />
                          {getDateRangeLabel()}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-4" align="start">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-sm mb-3">Chọn khoảng thời gian</h4>
                            <div className="space-y-2">
                              {dateRangeOptions.map((option) => (
                                <div key={option.value}>
                                  <button
                                    onClick={() => setDateRangeType(option.value)}
                                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                                      dateRangeType === option.value
                                        ? "bg-blue-100 text-blue-700 font-medium dark:bg-blue-950 dark:text-blue-300"
                                        : "hover:bg-muted"
                                    }`}
                                  >
                                    {option.label}
                                  </button>
                                  {option.value === "custom" && dateRangeType === "custom" && (
                                    <div className="mt-2 ml-3 space-y-2">
                                      <div>
                                        <label className="text-xs text-muted-foreground mb-1 block">Ngày bắt đầu</label>
                                        <Input
                                          type="date"
                                          value={customStartDate}
                                          onChange={(e) => setCustomStartDate(e.target.value)}
                                          className="h-8"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-xs text-muted-foreground mb-1 block">
                                          Ngày kết thúc
                                        </label>
                                        <Input
                                          type="date"
                                          value={customEndDate}
                                          onChange={(e) => setCustomEndDate(e.target.value)}
                                          className="h-8"
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 pt-3 border-t">
                            <Button onClick={handleApplyDateRange} className="flex-1" size="sm">
                              Áp dụng
                            </Button>
                            <Button
                              onClick={() => setDatePickerOpen(false)}
                              variant="outline"
                              className="flex-1"
                              size="sm"
                            >
                              Hủy
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="flex-1 min-w-[200px]">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Active Filters Display */}
                {selectedAppId && (
                  <div className="flex items-center gap-2 text-sm bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
                    <span className="font-medium text-blue-900 dark:text-blue-100">Bộ lọc đang áp dụng:</span>
                    <Badge variant="secondary">{selectedApp?.name}</Badge>
                    {platformFilter !== "all" && <Badge variant="secondary">{platformFilter}</Badge>}
                    {marketFilter !== "all" && <Badge variant="secondary">{marketFilter}</Badge>}
                    {statusFilter !== "all" && <Badge variant="secondary">{statusFilter}</Badge>}
                    <Badge variant="secondary">{getDateRangeLabel()}</Badge>
                    {projectIdFromUrl && <Badge variant="secondary">Project: P-{projectIdFromUrl}</Badge>}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        {/* Empty State - Khi chưa chọn App */}
        {!selectedAppId && (
          <Card className="border-2 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Package className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Hãy chọn App để xem và quản lý StoreKit
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                Vui lòng chọn một app từ dropdown bên trên để bắt đầu xem và quản lý các StoreKit items theo quy trình 4
                lane.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Content khi đã chọn App */}
        {selectedAppId && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-2xl grid-cols-4">
              <TabsTrigger value="list">List</TabsTrigger>
              <TabsTrigger value="create">Create</TabsTrigger>
              <TabsTrigger value="workflows">Workflows</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* List Tab */}
            <TabsContent value="list" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between gap-4">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Tìm kiếm theo tên hoặc phiên bản..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                      />
                    </div>

                    {/* Quick Filters */}
                    <div className="flex items-center gap-2">
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={marketFilter} onValueChange={setMarketFilter}>
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Thị trường" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tất cả</SelectItem>
                          <SelectItem value="global">Global</SelectItem>
                          <SelectItem value="us">US</SelectItem>
                          <SelectItem value="vn">VN</SelectItem>
                          <SelectItem value="jp">JP</SelectItem>
                          <SelectItem value="kr">KR</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={platformFilter} onValueChange={setPlatformFilter}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Platform" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tất cả</SelectItem>
                          <SelectItem value="ios">iOS</SelectItem>
                          <SelectItem value="android">Android</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Tạo StoreKit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Danh sách StoreKit</CardTitle>
                      <CardDescription>
                        Hiển thị {paginatedItems.length} trong tổng số {filteredItems.length} StoreKit items
                        {projectIdFromUrl && " (Filtered by Project)"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredItems.length === 0 ? (
                    <div className="text-center py-12">
                      <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Không tìm thấy StoreKit items nào phù hợp với bộ lọc.</p>
                    </div>
                  ) : (
                    <TooltipProvider>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[250px]">Name</TableHead>
                              <TableHead className="w-[100px]">Version</TableHead>
                              <TableHead className="w-[120px]">Project</TableHead>
                              <TableHead className="w-[150px]">Markets</TableHead>
                              <TableHead className="w-[120px]">Keywords</TableHead>
                              <TableHead className="w-[150px]">Images</TableHead>
                              <TableHead className="w-[150px]">Owner</TableHead>
                              <TableHead className="w-[150px]">Status</TableHead>
                              <TableHead className="w-[150px]">Updated</TableHead>
                              <TableHead className="w-[100px] text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {paginatedItems.map((item) => (
                              <TableRow key={item.id} className="hover:bg-muted/50">
                                {/* Name - Click để mở chi tiết */}
                                <TableCell>
                                  <button
                                    className="font-medium text-blue-600 hover:text-blue-800 hover:underline text-left"
                                    onClick={() => handleOpenDetail(item)}
                                  >
                                    {item.name}
                                  </button>
                                  {item.hasMetadataSync && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Badge
                                          variant="outline"
                                          className="ml-2 text-xs bg-green-50 border-green-300 text-green-700"
                                        >
                                          <RefreshCw className="h-3 w-3 mr-1" />M
                                        </Badge>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Đồng bộ với Metadata Management</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                </TableCell>

                                {/* Version */}
                                <TableCell>
                                  <Badge variant="outline" className="font-mono text-xs">
                                    {item.version}
                                  </Badge>
                                </TableCell>

                                <TableCell>
                                  {item.projectId ? (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <button
                                          onClick={() => handleViewProject(item)}
                                          className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-800 rounded border border-blue-200 transition-colors"
                                        >
                                          <LinkIcon className="h-3 w-3" />
                                          P-{item.projectId}
                                        </button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Click để xem dự án liên kết</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  ) : (
                                    <span className="text-xs text-muted-foreground">-</span>
                                  )}
                                </TableCell>

                                {/* Markets - Badge theo mã thị trường */}
                                <TableCell>
                                  <div className="flex flex-wrap gap-1">
                                    {item.markets.map((market) => (
                                      <Badge key={market} variant="secondary" className="text-xs">
                                        {market}
                                      </Badge>
                                    ))}
                                  </div>
                                </TableCell>

                                {/* Keywords - Số lượng với hover xem top 5 */}
                                <TableCell>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="flex items-center gap-1 cursor-help">
                                        <Badge variant="outline" className="text-xs">
                                          {item.keywords.count} keywords
                                        </Badge>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="max-w-xs">
                                      <div className="space-y-1">
                                        <p className="font-semibold text-xs mb-2">Top 5 Keywords:</p>
                                        {item.keywords.top5.map((keyword, idx) => (
                                          <div key={idx} className="text-xs">
                                            {idx + 1}. {keyword}
                                          </div>
                                        ))}
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                </TableCell>

                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <img
                                      src={item.images.thumbnails[0] || "/placeholder.svg"}
                                      alt="Thumbnail"
                                      className="h-10 w-10 rounded border object-cover"
                                    />
                                    <div className="text-xs text-muted-foreground">
                                      <div className="flex items-center gap-1">
                                        <ImageIcon className="h-3 w-3" />
                                        <span>
                                          {item.images.icon + item.images.screenshot + item.images.banner} total
                                        </span>
                                      </div>
                                      <div className="text-[10px] flex items-center gap-1">
                                        {item.images.icon}i • {item.images.screenshot}s • {item.images.banner}b
                                        {item.assetsPending && item.assetsPending > 0 && (
                                          <Badge
                                            variant="secondary"
                                            className="ml-1 text-[9px] h-4 px-1 bg-orange-100 text-orange-700 border-orange-300"
                                          >
                                            +{item.assetsPending} pending
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </TableCell>

                                {/* Owner (ASO PIC) */}
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-semibold text-blue-700 dark:text-blue-300">
                                      {item.owner
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .toUpperCase()}
                                    </div>
                                    <span className="text-sm">{item.owner}</span>
                                  </div>
                                </TableCell>

                                {/* Status */}
                                <TableCell>{getStatusBadge(item.status)}</TableCell>

                                {/* Updated Time */}
                                <TableCell>
                                  <div className="text-sm text-muted-foreground">{item.updatedDate}</div>
                                </TableCell>

                                <TableCell className="text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => handleOpenDetail(item)}>
                                        <Eye className="h-4 w-4 mr-2" />
                                        View Details
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => console.log("[v0] Edit:", item.id)}>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem onClick={() => handleRequestAsset(item)}>
                                        <Upload className="h-4 w-4 mr-2" />
                                        Request Asset
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleViewAssetProgress(item)}>
                                        <Clock className="h-4 w-4 mr-2" />
                                        View Asset Progress
                                      </DropdownMenuItem>
                                      {item.projectId && (
                                        <DropdownMenuItem onClick={() => handleViewProject(item)}>
                                          <FileText className="h-4 w-4 mr-2" />
                                          View Project
                                        </DropdownMenuItem>
                                      )}
                                      {item.status === "published" && (
                                        <DropdownMenuItem onClick={() => handleViewPerformance(item)}>
                                          <BarChart3 className="h-4 w-4 mr-2" />
                                          View Performance
                                        </DropdownMenuItem>
                                      )}
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem onClick={() => console.log("[v0] Duplicate:", item.id)}>
                                        <Copy className="h-4 w-4 mr-2" />
                                        Duplicate
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => console.log("[v0] Delete:", item.id)}
                                        className="text-red-600 focus:text-red-600"
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-muted-foreground">
                          Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredItems.length)} trong tổng số{" "}
                          {filteredItems.length} StoreKit items
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                          >
                            <ChevronLeft className="h-4 w-4" />
                            Trước
                          </Button>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                              <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                className="w-8 h-8 p-0"
                              >
                                {page}
                              </Button>
                            ))}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                          >
                            Sau
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </TooltipProvider>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Create Tab */}
            <TabsContent value="create">
              <Card>
                <CardHeader>
                  <CardTitle>Tạo StoreKit mới</CardTitle>
                  <CardDescription>Điền thông tin để tạo StoreKit item mới cho {selectedApp?.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-8">
                    {/* Bố cục 2 cột */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Cột trái */}
                      <div className="space-y-8">
                        {/* (A) Thông tin chung */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 pb-2 border-b">
                            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-sm font-bold text-blue-700 dark:text-blue-300">
                              A
                            </div>
                            <h3 className="text-lg font-semibold">Thông tin chung</h3>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="storekit-name">
                              StoreKit Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="storekit-name"
                              placeholder="Ví dụ: Summer Collection Update"
                              className="w-full"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="version">
                              Version <span className="text-red-500">*</span>
                            </Label>
                            <div className="flex items-center gap-2">
                              <Input id="version" placeholder="v1.0" defaultValue="v1.0" className="flex-1" />
                              <Button type="button" variant="outline" size="sm">
                                Tự động tăng
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">Phiên bản mới nhất: v2.1. Gợi ý: v2.2</p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="app-locked">App</Label>
                            <Input
                              id="app-locked"
                              value={selectedApp?.name || ""}
                              disabled
                              className="bg-muted cursor-not-allowed"
                            />
                            <p className="text-xs text-muted-foreground">
                              App đã được chọn từ filter và không thể thay đổi
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="platform">
                              Platform <span className="text-red-500">*</span>
                            </Label>
                            <Select>
                              <SelectTrigger id="platform">
                                <SelectValue placeholder="Chọn platform" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ios">🍎 iOS</SelectItem>
                                <SelectItem value="android">🤖 Android</SelectItem>
                                <SelectItem value="both">🍎🤖 Both (iOS & Android)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>
                              Markets <span className="text-red-500">*</span>
                            </Label>
                            <div className="border rounded-lg p-4 space-y-3">
                              <div className="flex flex-wrap gap-2">
                                {selectedMarkets.map((market) => (
                                  <Badge key={market} variant="secondary" className="gap-1">
                                    {market}
                                    <button
                                      type="button"
                                      onClick={() => setSelectedMarkets(selectedMarkets.filter((m) => m !== market))}
                                      className="ml-1 hover:bg-muted rounded-full"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </Badge>
                                ))}
                                {selectedMarkets.length === 0 && (
                                  <span className="text-sm text-muted-foreground">Chưa chọn thị trường nào</span>
                                )}
                              </div>
                              <Select
                                onValueChange={(value) => {
                                  if (!selectedMarkets.includes(value)) {
                                    setSelectedMarkets([...selectedMarkets, value])
                                  }
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Thêm thị trường..." />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="US">🇺🇸 United States</SelectItem>
                                  <SelectItem value="VN">🇻🇳 Vietnam</SelectItem>
                                  <SelectItem value="JP">🇯🇵 Japan</SelectItem>
                                  <SelectItem value="KR">🇰🇷 South Korea</SelectItem>
                                  <SelectItem value="UK">🇬🇧 United Kingdom</SelectItem>
                                  <SelectItem value="CA">🇨🇦 Canada</SelectItem>
                                  <SelectItem value="TH">🇹🇭 Thailand</SelectItem>
                                  <SelectItem value="ID">🇮🇩 Indonesia</SelectItem>
                                  <SelectItem value="BR">🇧🇷 Brazil</SelectItem>
                                  <SelectItem value="MX">🇲🇽 Mexico</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="locale">Locale/Language per market</Label>
                            <Select>
                              <SelectTrigger id="locale">
                                <SelectValue placeholder="Chọn ngôn ngữ mặc định" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="vi">Tiếng Việt</SelectItem>
                                <SelectItem value="ja">日本語 (Japanese)</SelectItem>
                                <SelectItem value="ko">한국어 (Korean)</SelectItem>
                                <SelectItem value="th">ไทย (Thai)</SelectItem>
                              </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                              Có thể cấu hình ngôn ngữ riêng cho từng thị trường sau
                            </p>
                          </div>
                        </div>

                        {/* (B) Metadata (per market) */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 pb-2 border-b">
                            <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-sm font-bold text-green-700 dark:text-green-300">
                              B
                            </div>
                            <h3 className="text-lg font-semibold">Metadata</h3>
                          </div>

                          <Alert>
                            <Info className="h-4 w-4" />
                            <AlertDescription>
                              Metadata sẽ được áp dụng cho tất cả thị trường đã chọn. Bạn có thể tùy chỉnh riêng cho
                              từng thị trường sau.
                            </AlertDescription>
                          </Alert>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="title">
                                Title <span className="text-red-500">*</span>
                              </Label>
                              <span className="text-xs text-muted-foreground">0/30</span>
                            </div>
                            <Input id="title" placeholder="Tiêu đề app trên store" maxLength={30} />
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="subtitle">Subtitle</Label>
                              <span className="text-xs text-muted-foreground">0/30</span>
                            </div>
                            <Input id="subtitle" placeholder="Phụ đề ngắn gọn" maxLength={30} />
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="short-desc">Short Description</Label>
                              <span className="text-xs text-muted-foreground">0/80</span>
                            </div>
                            <Textarea
                              id="short-desc"
                              placeholder="Mô tả ngắn (dùng cho Android)"
                              rows={2}
                              maxLength={80}
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="full-desc">
                                Full Description <span className="text-red-500">*</span>
                              </Label>
                              <span className="text-xs text-muted-foreground">0/4000</span>
                            </div>
                            <Textarea id="full-desc" placeholder="Mô tả đầy đủ về app..." rows={6} maxLength={4000} />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="keywords">Keywords</Label>
                            <Textarea
                              id="keywords"
                              placeholder="Nhập keywords, mỗi keyword một dòng hoặc phân cách bằng dấu phẩy"
                              rows={4}
                            />
                            <p className="text-xs text-muted-foreground">
                              Ví dụ: fashion, style, clothing, shopping, trendy
                            </p>
                          </div>

                          <Button type="button" variant="outline" className="w-full bg-transparent">
                            <Download className="h-4 w-4 mr-2" />
                            Import from Metadata Tracking
                          </Button>
                        </div>
                      </div>

                      {/* Cột phải */}
                      <div className="space-y-8">
                        {/* (C) Images/Assets */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 pb-2 border-b">
                            <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-sm font-bold text-purple-700 dark:text-purple-300">
                              C
                            </div>
                            <h3 className="text-lg font-semibold">Images/Assets</h3>
                          </div>

                          {/* Icon */}
                          <div className="space-y-2">
                            <Label>
                              App Icon <span className="text-red-500">*</span>
                            </Label>
                            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm font-medium mb-1">Kéo thả hoặc click để upload</p>
                              <p className="text-xs text-muted-foreground">iOS: 1024x1024px • Android: 512x512px</p>
                              <p className="text-xs text-muted-foreground">PNG, JPG (max 2MB)</p>
                            </div>
                          </div>

                          {/* Feature Graphic/Banner */}
                          <div className="space-y-2">
                            <Label>Feature Graphic/Banner</Label>
                            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm font-medium mb-1">Kéo thả hoặc click để upload</p>
                              <p className="text-xs text-muted-foreground">1024x500px (Android Feature Graphic)</p>
                              <p className="text-xs text-muted-foreground">PNG, JPG (max 2MB)</p>
                            </div>
                          </div>

                          {/* Screenshots */}
                          <div className="space-y-2">
                            <Label>
                              Screenshots <span className="text-red-500">*</span>
                            </Label>
                            <Alert>
                              <Info className="h-4 w-4" />
                              <AlertDescription className="text-xs">
                                <strong>iOS:</strong> 1290x2796px (6.7"), 1179x2556px (6.5")
                                <br />
                                <strong>Android:</strong> 1080x1920px, 1440x2560px
                                <br />
                                Tối thiểu 2 ảnh, tối đa 10 ảnh
                              </AlertDescription>
                            </Alert>
                            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm font-medium mb-1">Kéo thả hoặc click để upload nhiều ảnh</p>
                              <p className="text-xs text-muted-foreground">PNG, JPG (max 5MB mỗi ảnh)</p>
                            </div>

                            {/* Preview uploaded screenshots */}
                            <div className="grid grid-cols-3 gap-2 mt-3">
                              {[1, 2, 3].map((i) => (
                                <div
                                  key={i}
                                  className="aspect-[9/16] border rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground"
                                >
                                  Slot {i}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* (D) Gửi yêu cầu Design (Order StoreKit) */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 pb-2 border-b">
                            <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-sm font-bold text-orange-700 dark:text-orange-300">
                              D
                            </div>
                            <h3 className="text-lg font-semibold">Gửi yêu cầu Design</h3>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="send-to-design"
                              checked={sendToDesign}
                              onCheckedChange={(checked) => setSendToDesign(checked as boolean)}
                            />
                            <Label
                              htmlFor="send-to-design"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              Send order to Design Team now
                            </Label>
                          </div>

                          {sendToDesign && (
                            <div className="space-y-4 pl-6 border-l-2 border-orange-200 dark:border-orange-800">
                              <div className="space-y-2">
                                <Label htmlFor="design-brief">
                                  Brief cho Design Team <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                  id="design-brief"
                                  placeholder="Mô tả mục tiêu, phong cách mong muốn, benchmark đối thủ, guideline..."
                                  rows={5}
                                />
                                <p className="text-xs text-muted-foreground">
                                  Hãy mô tả rõ ràng về mục tiêu, phong cách thiết kế, màu sắc, và các yêu cầu đặc biệt
                                </p>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="benchmark">Benchmark đối thủ</Label>
                                <Input id="benchmark" placeholder="Link hoặc tên app đối thủ để tham khảo" />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="guideline">Design Guideline</Label>
                                <Input id="guideline" placeholder="Link tới brand guideline hoặc design system" />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="deadline">
                                  Deadline mong muốn <span className="text-red-500">*</span>
                                </Label>
                                <Input id="deadline" type="date" />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="design-pic">
                                  Người nhận (Design PIC) <span className="text-red-500">*</span>
                                </Label>
                                <Select>
                                  <SelectTrigger id="design-pic">
                                    <SelectValue placeholder="Chọn Design PIC" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="designer1">Nguyễn Văn A (Designer)</SelectItem>
                                    <SelectItem value="designer2">Trần Thị B (Senior Designer)</SelectItem>
                                    <SelectItem value="designer3">Lê Văn C (Art Director)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Footer Form */}
                    <div className="flex items-center justify-end gap-3 pt-6 border-t">
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                      <Button type="button" variant="outline">
                        Save Draft
                      </Button>
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                        {sendToDesign ? "Create & Send Order" : "Create StoreKit"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Workflows Tab */}
            <TabsContent value="workflows">
              <Card>
                <CardHeader>
                  <CardTitle>Workflows Timeline</CardTitle>
                  <CardDescription>Xem timeline và lịch sử workflow của các StoreKit items</CardDescription>
                </CardHeader>
                <CardContent>
                  <Alert>
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <AlertDescription>Chức năng workflows timeline đang được phát triển.</AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>Cấu hình các thiết lập cho StoreKit Management</CardDescription>
                </CardHeader>
                <CardContent>
                  <Alert>
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <AlertDescription>Chức năng settings đang được phát triển.</AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>

      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedStoreKit?.name}
              <Badge variant="outline" className="font-mono text-xs">
                {selectedStoreKit?.version}
              </Badge>
              {selectedStoreKit?.hasMetadataSync && (
                <Badge variant="outline" className="text-xs">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Metadata Sync
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              {selectedStoreKit?.platform} • {selectedStoreKit?.markets.join(", ")}
              {selectedStoreKit?.projectId && (
                <button
                  onClick={() => selectedStoreKit && handleViewProject(selectedStoreKit)}
                  className="ml-2 text-blue-600 hover:underline"
                >
                  Project: P-{selectedStoreKit.projectId}
                </button>
              )}
            </DialogDescription>
          </DialogHeader>

          <Tabs value={detailTab} onValueChange={setDetailTab} className="mt-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="assets">Assets</TabsTrigger>
              <TabsTrigger value="production">Production Status</TabsTrigger>
              <TabsTrigger value="project">Project Info</TabsTrigger>
              <TabsTrigger value="performance" disabled={selectedStoreKit?.status !== "published"}>
                Performance
              </TabsTrigger>
            </TabsList>

            <TabsContent value="assets" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Icon</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{selectedStoreKit?.images.icon}</p>
                    <p className="text-xs text-muted-foreground">Total icons</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Screenshots</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{selectedStoreKit?.images.screenshot}</p>
                    <p className="text-xs text-muted-foreground">Total screenshots</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Banners</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{selectedStoreKit?.images.banner}</p>
                    <p className="text-xs text-muted-foreground">Total banners</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Pending Assets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{selectedStoreKit?.assetsPending || 0}</p>
                    <p className="text-xs text-muted-foreground">In production</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="production" className="space-y-4">
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  Hiển thị tiến độ từng asset đang được xử lý trong Asset Production & Approval
                </AlertDescription>
              </Alert>
              <p className="text-sm text-muted-foreground">Chức năng đang được phát triển...</p>
            </TabsContent>

            <TabsContent value="project" className="space-y-4">
              {selectedStoreKit?.projectId ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Project ID:</span>
                    <Badge variant="outline">P-{selectedStoreKit.projectId}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">App:</span>
                    <span className="text-sm">{selectedStoreKit.app}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Owner:</span>
                    <span className="text-sm">{selectedStoreKit.owner}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    {getStatusBadge(selectedStoreKit.status)}
                  </div>
                  <Button
                    onClick={() => selectedStoreKit && handleViewProject(selectedStoreKit)}
                    className="w-full mt-4"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Xem chi tiết dự án
                  </Button>
                </div>
              ) : (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>StoreKit này không liên kết với dự án nào</AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <Alert>
                <BarChart3 className="h-4 w-4" />
                <AlertDescription>Số liệu hiệu suất từ Optimization & Tracking</AlertDescription>
              </Alert>
              <Button onClick={() => selectedStoreKit && handleViewPerformance(selectedStoreKit)} className="w-full">
                <BarChart3 className="h-4 w-4 mr-2" />
                Xem chi tiết hiệu suất
              </Button>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
