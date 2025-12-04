"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, ChevronRight, Copy, Info, MoreVertical, Pause, Play, TrendingUp } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

type MetricType = "first-time-installers" | "retained-installers" | "ctr"

interface VariantMetricData {
  id: string
  name: string
  audience: number
  isWinner: boolean
  assets: any
  // First-time installers
  installers?: number
  installersScaled?: number
  // Retained installers
  retainedInstallers?: number
  retainedInstallersScaled?: number
  // CTR
  impressions?: number
  clicks?: number
  ctr?: number
  // Performance
  performance: string
  confidenceInterval: string
}

interface Asset {
  id: string
  url: string
  locale?: string
  platform?: string
}

interface VariantAssets {
  icon?: Asset
  featureGraphic?: Asset
  screenshots?: Asset[]
  title?: string
  shortDescription?: string
  fullDescription?: string
}

// Mock data cho experiment
const experimentData: Record<string, any> = {
  "1": {
    id: "1",
    name: "Icon Test - Summer Theme",
    appId: "com.example.puzzlegame",
    appName: "Puzzle Game Pro",
    storeListing: "Default store listing",
    experimentType: "Default graphics",
    status: "applied",
    startDate: "2024-01-15",
    endDate: "2024-02-28",
    appliedDate: "2024-02-28",
    appliedBy: "Nguyễn Văn A",
    minimumDetectableEffect: 2.0,
    metrics: {
      "first-time-installers": {
        variants: [
          {
            id: "current",
            name: "Current listing",
            audience: 33.3,
            installers: 12500,
            installersScaled: 37500,
            performance: "+0.0%",
            confidenceInterval: "[-2.1%, +2.1%]",
            isWinner: false,
          },
          {
            id: "005",
            name: "Variant 005",
            audience: 33.3,
            installers: 13200,
            installersScaled: 39600,
            performance: "+5.6%",
            confidenceInterval: "[+2.8%, +8.4%]",
            isWinner: true,
          },
          {
            id: "006",
            name: "Variant 006",
            audience: 33.4,
            installers: 12800,
            installersScaled: 38400,
            performance: "+2.4%",
            confidenceInterval: "[-0.5%, +5.3%]",
            isWinner: false,
          },
        ],
        chartData: [
          { date: "01/15", current: 1200, v005: 1250, v006: 1220 },
          { date: "01/22", current: 1350, v005: 1480, v006: 1390 },
          { date: "01/29", current: 1500, v005: 1680, v006: 1550 },
          { date: "02/05", current: 1650, v005: 1850, v006: 1700 },
          { date: "02/12", current: 1800, v005: 2020, v006: 1850 },
          { date: "02/19", current: 1950, v005: 2180, v006: 2000 },
          { date: "02/26", current: 2100, v005: 2350, v006: 2150 },
        ],
        yAxisLabel: "Installs",
      },
      "retained-installers": {
        variants: [
          {
            id: "current",
            name: "Current listing",
            audience: 33.3,
            retainedInstallers: 8750,
            retainedInstallersScaled: 26250,
            performance: "+0.0%",
            confidenceInterval: "[-2.5%, +2.5%]",
            isWinner: false,
          },
          {
            id: "005",
            name: "Variant 005",
            audience: 33.3,
            retainedInstallers: 9680,
            retainedInstallersScaled: 29040,
            performance: "+10.6%",
            confidenceInterval: "[+6.2%, +15.0%]",
            isWinner: true,
          },
          {
            id: "006",
            name: "Variant 006",
            audience: 33.4,
            retainedInstallers: 9216,
            retainedInstallersScaled: 27648,
            performance: "+5.3%",
            confidenceInterval: "[+1.1%, +9.5%]",
            isWinner: false,
          },
        ],
        chartData: [
          { date: "01/15", current: 840, v005: 920, v006: 880 },
          { date: "01/22", current: 945, v005: 1088, v006: 1002 },
          { date: "01/29", current: 1050, v005: 1235, v006: 1127 },
          { date: "02/05", current: 1155, v005: 1360, v006: 1232 },
          { date: "02/12", current: 1260, v005: 1485, v006: 1337 },
          { date: "02/19", current: 1365, v005: 1603, v006: 1442 },
          { date: "02/26", current: 1470, v005: 1728, v006: 1547 },
        ],
        yAxisLabel: "Retained Installs",
      },
      ctr: {
        variants: [
          {
            id: "current",
            name: "Current listing",
            audience: 33.3,
            impressions: 125000,
            clicks: 3750,
            ctr: 3.0,
            performance: "+0.0%",
            confidenceInterval: "[-0.3%, +0.3%]",
            isWinner: false,
          },
          {
            id: "005",
            name: "Variant 005",
            audience: 33.3,
            impressions: 126000,
            clicks: 4410,
            ctr: 3.5,
            performance: "+16.7%",
            confidenceInterval: "[+12.1%, +21.3%]",
            isWinner: true,
          },
          {
            id: "006",
            name: "Variant 006",
            audience: 33.4,
            impressions: 127000,
            clicks: 4064,
            ctr: 3.2,
            performance: "+6.7%",
            confidenceInterval: "[+2.5%, +10.9%]",
            isWinner: false,
          },
        ],
        chartData: [
          { date: "01/15", current: 2.8, v005: 3.2, v006: 2.9 },
          { date: "01/22", current: 2.9, v005: 3.4, v006: 3.0 },
          { date: "01/29", current: 3.0, v005: 3.5, v006: 3.1 },
          { date: "02/05", current: 3.0, v005: 3.5, v006: 3.2 },
          { date: "02/12", current: 3.1, v005: 3.6, v006: 3.2 },
          { date: "02/19", current: 3.0, v005: 3.5, v006: 3.3 },
          { date: "02/26", current: 3.0, v005: 3.5, v006: 3.2 },
        ],
        yAxisLabel: "CTR (%)",
      },
    },
    variantAssets: {
      current: {
        icon: { id: "icon-current-001", url: "/app-icon-blue.jpg", locale: "en-US", platform: "android" },
        featureGraphic: {
          id: "fg-current-001",
          url: "/feature-graphic.jpg",
          locale: "en-US",
          platform: "android",
        },
        screenshots: [
          { id: "ss-current-001", url: "/screenshot-1.png", locale: "en-US", platform: "android" },
          { id: "ss-current-002", url: "/screenshot-2.png", locale: "en-US", platform: "android" },
        ],
      },
      "005": {
        icon: { id: "icon-005-001", url: "/app-icon-orange.jpg", locale: "en-US", platform: "android" },
        featureGraphic: {
          id: "fg-005-001",
          url: "/feature-graphic-variant-a.jpg",
          locale: "en-US",
          platform: "android",
        },
        screenshots: [
          { id: "ss-005-001", url: "/screenshot-a1.jpg", locale: "en-US", platform: "android" },
          { id: "ss-005-002", url: "/screenshot-a2.jpg", locale: "en-US", platform: "android" },
        ],
      },
      "006": {
        icon: { id: "icon-006-001", url: "/app-icon-green.jpg", locale: "en-US", platform: "android" },
        featureGraphic: {
          id: "fg-006-001",
          url: "/feature-graphic-variant-b.jpg",
          locale: "en-US",
          platform: "android",
        },
        screenshots: [
          { id: "ss-006-001", url: "/screenshot-b1.jpg", locale: "en-US", platform: "android" },
          { id: "ss-006-002", url: "/screenshot-b2.jpg", locale: "en-US", platform: "android" },
        ],
      },
    },
  },
  "2": {
    id: "2",
    name: "Localized Text Test - Vietnam",
    appId: "com.example.puzzlegame",
    appName: "Puzzle Game Pro",
    storeListing: "Localized listing (vi-VN)",
    experimentType: "Localized experiment",
    status: "in-progress",
    startDate: "2024-03-01",
    endDate: null,
    appliedDate: null,
    appliedBy: null,
    minimumDetectableEffect: 3.0,
    metrics: {
      "first-time-installers": {
        variants: [
          {
            id: "current",
            name: "Current listing",
            audience: 50,
            installers: 8500,
            installersScaled: 17000,
            performance: "+0.0%",
            confidenceInterval: "[-3.2%, +3.2%]",
            isWinner: false,
          },
          {
            id: "007",
            name: "Variant 007",
            audience: 50,
            installers: 9200,
            installersScaled: 18400,
            performance: "+8.2%",
            confidenceInterval: "[+4.1%, +12.3%]",
            isWinner: true,
          },
        ],
        chartData: [
          { date: "03/01", current: 1200, v007: 1300 },
          { date: "03/08", current: 1350, v007: 1460 },
          { date: "03/15", current: 1500, v007: 1620 },
        ],
        yAxisLabel: "Installs",
      },
      "retained-installers": {
        variants: [
          {
            id: "current",
            name: "Current listing",
            audience: 50,
            retainedInstallers: 5950,
            retainedInstallersScaled: 11900,
            performance: "+0.0%",
            confidenceInterval: "[-3.8%, +3.8%]",
            isWinner: false,
          },
          {
            id: "007",
            name: "Variant 007",
            audience: 50,
            retainedInstallers: 6716,
            retainedInstallersScaled: 13432,
            performance: "+12.9%",
            confidenceInterval: "[+7.5%, +18.3%]",
            isWinner: true,
          },
        ],
        chartData: [
          { date: "03/01", current: 840, v007: 949 },
          { date: "03/08", current: 945, v007: 1066 },
          { date: "03/15", current: 1050, v007: 1183 },
        ],
        yAxisLabel: "Retained Installs",
      },
      ctr: {
        variants: [
          {
            id: "current",
            name: "Current listing",
            audience: 50,
            impressions: 85000,
            clicks: 2550,
            ctr: 3.0,
            performance: "+0.0%",
            confidenceInterval: "[-0.4%, +0.4%]",
            isWinner: false,
          },
          {
            id: "007",
            name: "Variant 007",
            audience: 50,
            impressions: 86000,
            clicks: 3010,
            ctr: 3.5,
            performance: "+16.7%",
            confidenceInterval: "[+11.2%, +22.2%]",
            isWinner: true,
          },
        ],
        chartData: [
          { date: "03/01", current: 2.9, v007: 3.3 },
          { date: "03/08", current: 3.0, v007: 3.5 },
          { date: "03/15", current: 3.0, v007: 3.5 },
        ],
        yAxisLabel: "CTR (%)",
      },
    },
    variantAssets: {
      current: {
        title: "Game Puzzle Hay Nhất",
        shortDescription: "Chơi game puzzle miễn phí",
        fullDescription: "Trải nghiệm game puzzle tuyệt vời với hàng trăm màn chơi...",
      },
      "007": {
        title: "Trò Chơi Xếp Hình Thông Minh",
        shortDescription: "Thử thách trí tuệ với puzzle",
        fullDescription: "Khám phá thế giới puzzle đầy màu sắc với hơn 500 màn chơi...",
      },
    },
  },
}

const getExperimentData = (id: string) => {
  // Kiểm tra localStorage trước
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("ab-testing-experiments")
    if (stored) {
      try {
        const experiments = JSON.parse(stored)
        const found = experiments.find((exp: any) => exp.id === id)
        if (found) {
          console.log("[v0] Found experiment from localStorage:", found)

          const variantAssets: Record<string, VariantAssets> = {}
          let variantIds: string[] = []

          if (found.variants) {
            if (Array.isArray(found.variants)) {
              variantIds = found.variants.map((v: any) => v.id)
              found.variants.forEach((variant: any) => {
                const assets: VariantAssets = {}

                if (variant.icon) {
                  assets.icon = {
                    id: `icon-${variant.id}-${Date.now()}`,
                    url: typeof variant.icon === "string" ? variant.icon : "",
                    locale: variant.locale || "en-US",
                    platform: variant.platform || "android",
                  }
                }

                if (variant.featureGraphic) {
                  assets.featureGraphic = {
                    id: `fg-${variant.id}-${Date.now()}`,
                    url: typeof variant.featureGraphic === "string" ? variant.featureGraphic : "",
                    locale: variant.locale || "en-US",
                    platform: variant.platform || "android",
                  }
                }

                if (variant.screenshots && Array.isArray(variant.screenshots)) {
                  assets.screenshots = variant.screenshots
                    .filter((s: any) => typeof s === "string")
                    .map((screenshot: string, idx: number) => ({
                      id: `ss-${variant.id}-${idx}-${Date.now()}`,
                      url: screenshot,
                      locale: variant.locale || "en-US",
                      platform: variant.platform || "android",
                    }))
                }

                if (variant.title) assets.title = variant.title
                if (variant.shortDesc) assets.shortDescription = variant.shortDesc
                if (variant.fullDesc) assets.fullDescription = variant.fullDesc

                console.log("[v0] Mapped assets for variant", variant.id, ":", assets)
                variantAssets[variant.id] = assets
              })
            } else if (typeof found.variants === "object") {
              variantIds = Object.keys(found.variants)
              Object.entries(found.variants).forEach(([variantId, variant]: [string, any]) => {
                const assets: VariantAssets = {}

                if (variant.icon) {
                  assets.icon = {
                    id: `icon-${variantId}-${Date.now()}`,
                    url: typeof variant.icon === "string" ? variant.icon : "",
                    locale: variant.locale || "en-US",
                    platform: variant.platform || "android",
                  }
                }

                if (variant.featureGraphic) {
                  assets.featureGraphic = {
                    id: `fg-${variantId}-${Date.now()}`,
                    url: typeof variant.featureGraphic === "string" ? variant.featureGraphic : "",
                    locale: variant.locale || "en-US",
                    platform: variant.platform || "android",
                  }
                }

                if (variant.screenshots && Array.isArray(variant.screenshots)) {
                  assets.screenshots = variant.screenshots
                    .filter((s: any) => typeof s === "string")
                    .map((screenshot: string, idx: number) => ({
                      id: `ss-${variantId}-${idx}-${Date.now()}`,
                      url: screenshot,
                      locale: variant.locale || "en-US",
                      platform: variant.platform || "android",
                    }))
                }

                if (variant.title) assets.title = variant.title
                if (variant.shortDesc) assets.shortDescription = variant.shortDesc
                if (variant.fullDesc) assets.fullDescription = variant.fullDesc

                console.log("[v0] Mapped assets for variant", variantId, ":", assets)
                variantAssets[variantId] = assets
              })
            }
          }

          // Nếu không có variants hoặc variantIds rỗng, sử dụng mặc định
          if (variantIds.length === 0) {
            variantIds = ["current", "variantA", "variantB"]
          }

          // Generate mock metrics cho tất cả variants
          const generateMetricsForVariants = (metricType: string) => {
            const audiencePerVariant = 100 / variantIds.length
            const variants = variantIds.map((variantId, index) => {
              const isWinner = index === 1 // Variant đầu tiên (sau current) là winner
              const variantName =
                variantId === "current"
                  ? "Current listing"
                  : `Variant ${variantId.replace("variant", "").toUpperCase()}`

              if (metricType === "first-time-installers") {
                const baseInstallers = 10000 + Math.floor(Math.random() * 5000)
                const multiplier = isWinner ? 1.1 : index === 0 ? 1.0 : 1.05
                return {
                  id: variantId,
                  name: variantName,
                  audience: Number(audiencePerVariant.toFixed(1)),
                  installers: Math.floor(baseInstallers * multiplier),
                  installersScaled: Math.floor(baseInstallers * multiplier * 3),
                  performance: index === 0 ? "+0.0%" : `+${((multiplier - 1) * 100).toFixed(1)}%`,
                  confidenceInterval:
                    index === 0
                      ? "[-2.1%, +2.1%]"
                      : `[+${((multiplier - 1) * 100 - 3).toFixed(1)}%, +${((multiplier - 1) * 100 + 3).toFixed(1)}%]`,
                  isWinner,
                }
              } else if (metricType === "retained-installers") {
                const baseRetained = 7000 + Math.floor(Math.random() * 3000)
                const multiplier = isWinner ? 1.15 : index === 0 ? 1.0 : 1.07
                return {
                  id: variantId,
                  name: variantName,
                  audience: Number(audiencePerVariant.toFixed(1)),
                  retainedInstallers: Math.floor(baseRetained * multiplier),
                  retainedInstallersScaled: Math.floor(baseRetained * multiplier * 3),
                  performance: index === 0 ? "+0.0%" : `+${((multiplier - 1) * 100).toFixed(1)}%`,
                  confidenceInterval:
                    index === 0
                      ? "[-2.5%, +2.5%]"
                      : `[+${((multiplier - 1) * 100 - 3).toFixed(1)}%, +${((multiplier - 1) * 100 + 3).toFixed(1)}%]`,
                  isWinner,
                }
              } else {
                // CTR
                const baseImpressions = 100000 + Math.floor(Math.random() * 50000)
                const baseCTR = 3.0
                const multiplier = isWinner ? 1.2 : index === 0 ? 1.0 : 1.1
                const ctr = baseCTR * multiplier
                return {
                  id: variantId,
                  name: variantName,
                  audience: Number(audiencePerVariant.toFixed(1)),
                  impressions: baseImpressions,
                  clicks: Math.floor((baseImpressions * ctr) / 100),
                  ctr,
                  performance: index === 0 ? "+0.0%" : `+${((multiplier - 1) * 100).toFixed(1)}%`,
                  confidenceInterval:
                    index === 0
                      ? "[-0.3%, +0.3%]"
                      : `[+${((multiplier - 1) * 100 - 2).toFixed(1)}%, +${((multiplier - 1) * 100 + 2).toFixed(1)}%]`,
                  isWinner,
                }
              }
            })

            // Generate chart data
            const chartData = Array.from({ length: 7 }, (_, i) => {
              const dataPoint: any = { date: `Week ${i + 1}` }
              variantIds.forEach((variantId, index) => {
                const baseValue = metricType === "ctr" ? 2.8 : 1200
                const increment = metricType === "ctr" ? 0.05 : 150
                const multiplier = index === 1 ? 1.15 : index === 0 ? 1.0 : 1.08
                dataPoint[variantId === "current" ? "current" : `v${variantId}`] =
                  (baseValue + i * increment) * multiplier
              })
              return dataPoint
            })

            return {
              variants,
              chartData,
              yAxisLabel:
                metricType === "first-time-installers"
                  ? "Installs"
                  : metricType === "retained-installers"
                    ? "Retained Installs"
                    : "CTR (%)",
            }
          }
          // </CHANGE>

          // Transform data từ list format sang detail format
          return {
            id: found.id,
            name: found.name,
            appId: found.appId || "com.example.app",
            appName: found.appName || "Sample App",
            storeListing: found.storeListing,
            experimentType: found.experimentType || "Default graphics",
            status: found.status,
            startDate: found.startDate,
            endDate: found.endDate,
            appliedDate: found.appliedDate,
            appliedBy: found.appliedBy,
            minimumDetectableEffect: 2.5,
            metrics: {
              "first-time-installers": generateMetricsForVariants("first-time-installers"),
              "retained-installers": generateMetricsForVariants("retained-installers"),
              ctr: generateMetricsForVariants("ctr"),
            },
            variantAssets,
          }
        }
      } catch (e) {
        console.error("[v0] Error parsing experiments from localStorage:", e)
      }
    }
  }

  // Fallback về experimentData cũ
  return experimentData[id]
}

const displayMetrics = [
  {
    value: "first-time-installers",
    label: "First-time installers",
    tooltip: "Số lượng người dùng cài đặt ứng dụng lần đầu tiên",
  },
  {
    value: "retained-installers",
    label: "Retained first-time installers",
    tooltip: "Số lượng người dùng cài đặt và giữ lại ứng dụng sau 7 ngày",
  },
  {
    value: "ctr",
    label: "Click-through rate",
    tooltip: "Tỷ lệ người dùng nhấp vào listing sau khi xem",
  },
]

export default function ExperimentDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [experiment, setExperiment] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const data = getExperimentData(params.id)
    setExperiment(data)
    setIsLoading(false)
  }, [params.id])

  const [displayMetric, setDisplayMetric] = useState<MetricType>(() => {
    const urlMetric = searchParams.get("metric") as MetricType
    if (urlMetric && ["first-time-installers", "retained-installers", "ctr"].includes(urlMetric)) {
      return urlMetric
    }
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ab-testing-display-metric") as MetricType
      if (saved && ["first-time-installers", "retained-installers", "ctr"].includes(saved)) {
        return saved
      }
    }
    return "first-time-installers"
  })

  const [isLoadingMetric, setIsLoadingMetric] = useState(false)

  const [expandedVariant, setExpandedVariant] = useState<string | null>(null)
  const [applyDialogOpen, setApplyDialogOpen] = useState(false)
  const [stopDialogOpen, setStopDialogOpen] = useState(false)
  const [stopReason, setStopReason] = useState("")
  const [selectedWinner, setSelectedWinner] = useState<string | null>(null)

  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false)
  const [duplicateName, setDuplicateName] = useState("")
  const [isDuplicating, setIsDuplicating] = useState(false)

  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [previewImageTitle, setPreviewImageTitle] = useState<string>("")

  const [localeFilter, setLocaleFilter] = useState<string>("all")
  const [platformFilter, setPlatformFilter] = useState<string>("all")
  const [debugMode, setDebugMode] = useState(false)
  const [loadingAssets, setLoadingAssets] = useState<Record<string, boolean>>({})

  const handleMetricChange = (newMetric: MetricType) => {
    setIsLoadingMetric(true)
    setDisplayMetric(newMetric)

    // Lưu vào localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("ab-testing-display-metric", newMetric)
    }

    // Cập nhật URL params
    const url = new URL(window.location.href)
    url.searchParams.set("metric", newMetric)
    window.history.replaceState({}, "", url.toString())

    // Simulate loading
    setTimeout(() => {
      setIsLoadingMetric(false)
    }, 500)
  }

  const handleImagePreview = (imageUrl: string, title: string) => {
    setPreviewImage(imageUrl)
    setPreviewImageTitle(title)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="h-12 w-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4" />
            <p className="text-gray-500">Đang tải thử nghiệm...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!experiment) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Info className="h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Không tìm thấy thử nghiệm</h2>
            <p className="text-gray-500 mb-4">Thử nghiệm bạn đang tìm không tồn tại.</p>
            <Button onClick={() => router.push("/applications/ab-testing")}>Quay lại danh sách</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentMetricData = experiment.metrics[displayMetric]
  const hasMetricData = currentMetricData && currentMetricData.variants && currentMetricData.variants.length > 0

  const variantsWithAssets = hasMetricData
    ? currentMetricData.variants.map((variant: any) => ({
        ...variant,
        assets: experiment.variantAssets[variant.id] || {},
      }))
    : []

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { label: string; className: string }> = {
      Default: { label: "Default", className: "bg-gray-100 text-gray-600 border-gray-200" },
      "Pending approval": { label: "Pending approval", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
      Approved: { label: "Approved", className: "bg-green-100 text-green-700 border-green-200" },
      Running: { label: "Running", className: "bg-blue-100 text-blue-700 border-blue-200" },
      Completed: { label: "Completed", className: "bg-cyan-100 text-cyan-700 border-cyan-200" },
      Stopped: { label: "Stopped", className: "bg-red-100 text-red-700 border-red-200" },
      Cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700 border-red-200" },
    }
    const config = configs[status] || configs["Default"]
    return (
      <TooltipProvider>
        <UITooltip>
          <TooltipTrigger asChild>
            <Badge className={`${config.className} border cursor-help`}>{config.label}</Badge>
          </TooltipTrigger>
          <TooltipContent>
            {experiment.appliedDate && experiment.appliedBy && (
              <div className="text-xs">
                <p>Áp dụng: {experiment.appliedDate}</p>
                <p>Bởi: {experiment.appliedBy}</p>
              </div>
            )}
            {!experiment.appliedDate && <p className="text-xs">Chưa áp dụng</p>}
          </TooltipContent>
        </UITooltip>
      </TooltipProvider>
    )
  }

  const filterAssetsByLocaleAndPlatform = (assets: VariantAssets | undefined): VariantAssets | undefined => {
    if (!assets) return undefined

    const matchesFilter = (asset: Asset | undefined) => {
      if (!asset) return false
      const localeMatch = localeFilter === "all" || asset.locale === localeFilter
      const platformMatch = platformFilter === "all" || asset.platform === platformFilter
      return localeMatch && platformMatch
    }

    return {
      icon: matchesFilter(assets.icon) ? assets.icon : undefined,
      featureGraphic: matchesFilter(assets.featureGraphic) ? assets.featureGraphic : undefined,
      screenshots: assets.screenshots?.filter(matchesFilter) || [],
      title: assets.title,
      shortDescription: assets.shortDescription,
      fullDescription: assets.fullDescription,
    }
  }

  const hasAnyAssets = (assets: VariantAssets | undefined): boolean => {
    if (!assets) return false
    return !!(
      assets.icon ||
      assets.featureGraphic ||
      (assets.screenshots && assets.screenshots.length > 0) ||
      assets.title ||
      assets.shortDescription ||
      assets.fullDescription
    )
  }

  const hasImageAssets = (assets: VariantAssets | undefined): boolean => {
    if (!assets) return false
    return !!(assets.icon || assets.featureGraphic || (assets.screenshots && assets.screenshots.length > 0))
  }

  const hasTextAssets = (assets: VariantAssets | undefined): boolean => {
    if (!assets) return false
    return !!(assets.title || assets.shortDescription || assets.fullDescription)
  }

  const AssetImage = ({
    asset,
    alt,
    className,
    onPreview,
  }: {
    asset: Asset | undefined
    alt: string
    className: string
    onPreview: () => void
  }) => {
    const [imageError, setImageError] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    if (!asset) {
      return (
        <div
          className={`${className} border border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50`}
        >
          <span className="text-xs text-gray-400">Không có hình ảnh</span>
        </div>
      )
    }

    return (
      <div className="relative">
        <div className="relative group cursor-pointer" onClick={onPreview}>
          {isLoading && <div className={`${className} border border-gray-200 bg-gray-100 animate-pulse`} />}
          <img
            src={asset.url || "/placeholder.svg"}
            alt={alt}
            className={`${className} border border-gray-200 object-cover transition-transform group-hover:scale-105 ${isLoading ? "hidden" : ""}`}
            onLoad={() => setIsLoading(false)}
            onError={(e) => {
              setImageError(true)
              setIsLoading(false)
              e.currentTarget.src = "/placeholder.svg?height=96&width=96"
            }}
          />
          {!isLoading && !imageError && (
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-opacity flex items-center justify-center">
              <span className="text-white text-xs opacity-0 group-hover:opacity-100">Click để xem</span>
            </div>
          )}
        </div>
        {debugMode && (
          <div className="absolute -bottom-5 left-0 right-0 text-center">
            <Badge variant="outline" className="text-[10px] bg-yellow-50 border-yellow-300 text-yellow-800">
              ID: {asset.id}
            </Badge>
          </div>
        )}
        {imageError && (
          <div className="absolute top-1 right-1">
            <Badge variant="destructive" className="text-[10px]">
              Lỗi
            </Badge>
          </div>
        )}
      </div>
    )
  }

  const handleApplyWinner = () => {
    const winner = variantsWithAssets.find((v: any) => v.isWinner)
    if (winner) {
      setSelectedWinner(winner.name)
      setApplyDialogOpen(true)
    }
  }

  const handleStop = () => {
    setStopDialogOpen(true)
  }

  const confirmApply = () => {
    console.log("[v0] Applying winner:", selectedWinner)
    setApplyDialogOpen(false)
    toast({
      title: "Áp dụng thành công",
      description: `Biến thể "${selectedWinner}" đã được áp dụng.`,
    })
    // Cập nhật trạng thái trong local storage nếu cần
    if (typeof window !== "undefined") {
      const experiments = JSON.parse(localStorage.getItem("ab-testing-experiments") || "[]")
      const updatedExperiments = experiments.map((exp: any) =>
        exp.id === experiment.id
          ? {
              ...exp,
              status: "Completed",
              appliedDate: new Date().toISOString().split("T")[0],
              appliedBy: "You",
            }
          : exp,
      )
      localStorage.setItem("ab-testing-experiments", JSON.stringify(updatedExperiments))
      // Cập nhật state experiment hiện tại
      setExperiment({
        ...experiment,
        status: "Completed",
        appliedDate: new Date().toISOString().split("T")[0],
        appliedBy: "You",
      })
    }
  }

  const confirmStop = () => {
    console.log("[v0] Stopping experiment with reason:", stopReason)
    setStopDialogOpen(false)
    toast({
      title: "Thử nghiệm đã dừng",
      description: `Thử nghiệm "${experiment.name}" đã được dừng vì: ${stopReason}.`,
    })
    // Cập nhật trạng thái trong local storage nếu cần
    if (typeof window !== "undefined") {
      const experiments = JSON.parse(localStorage.getItem("ab-testing-experiments") || "[]")
      const updatedExperiments = experiments.map((exp: any) =>
        exp.id === experiment.id
          ? {
              ...exp,
              status: "Stopped",
              endDate: new Date().toISOString().split("T")[0],
            }
          : exp,
      )
      localStorage.setItem("ab-testing-experiments", JSON.stringify(updatedExperiments))
      // Cập nhật state experiment hiện tại
      setExperiment({
        ...experiment,
        status: "Stopped",
        endDate: new Date().toISOString().split("T")[0],
      })
    }
  }

  const handleDuplicate = () => {
    // Tạo tên mặc định cho bản sao
    setDuplicateName(`${experiment.name} (Copy)`)
    setDuplicateDialogOpen(true)
  }

  const confirmDuplicate = async () => {
    setIsDuplicating(true)

    // Simulate API call để tạo bản sao
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newExperimentId = `copy-${Date.now()}`
    const newExperimentData = {
      id: newExperimentId,
      name: duplicateName,
      appId: experiment.appId,
      appName: experiment.appName,
      storeListing: experiment.storeListing,
      experimentType: experiment.experimentType,
      status: "Default", // Trạng thái mặc định cho bản sao
      startDate: new Date().toISOString().split("T")[0],
      endDate: null, // Chưa có ngày kết thúc
      appliedDate: null,
      appliedBy: null,
      minimumDetectableEffect: experiment.minimumDetectableEffect,
      metrics: JSON.parse(JSON.stringify(experiment.metrics)), // Sao chép sâu metrics
      variantAssets: JSON.parse(JSON.stringify(experiment.variantAssets)), // Sao chép sâu variantAssets
    }

    // Cập nhật các variant name để tránh trùng lặp ID nếu cần thiết, hoặc chỉ đơn giản là sao chép
    // Trong ví dụ này, ta giữ nguyên ID và chỉ đổi tên hiển thị nếu cần
    if (newExperimentData.metrics) {
      for (const metricKey in newExperimentData.metrics) {
        newExperimentData.metrics[metricKey].variants = newExperimentData.metrics[metricKey].variants.map((v: any) => ({
          ...v,
          name: `${v.name} (Copy)`,
          isWinner: false, // Đặt lại là false cho bản sao
        }))
      }
    }

    if (typeof window !== "undefined") {
      const existingExperiments = JSON.parse(localStorage.getItem("ab-testing-experiments") || "[]")
      localStorage.setItem("ab-testing-experiments", JSON.stringify([...existingExperiments, newExperimentData]))
    }

    console.log("[v0] Duplicating experiment:", {
      originalId: experiment.id,
      originalName: experiment.name,
      newName: duplicateName,
      newExperimentId,
    })

    setIsDuplicating(false)
    setDuplicateDialogOpen(false)

    toast({
      title: "Tạo bản sao thành công",
      description: `Đã tạo bản sao "${duplicateName}" thành công.`,
      duration: 3000,
    })

    const params = new URLSearchParams()
    if (newExperimentData.appId) {
      params.set("app", newExperimentData.appId)
    }
    params.set("highlight", newExperimentId) // Highlight bản sao mới được tạo

    const queryString = params.toString()
    // Điều hướng đến trang danh sách và highlight bản sao mới
    router.push(`/applications/ab-testing${queryString ? `?${queryString}` : ""}`)
  }

  const currentMetric = displayMetrics.find((m) => m.value === displayMetric)

  const renderTableHeaders = () => {
    if (displayMetric === "first-time-installers") {
      return (
        <>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Installers (current)
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Installers (scaled)
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Performance (98% CI)
          </th>
        </>
      )
    } else if (displayMetric === "retained-installers") {
      return (
        <>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Retained installers (current)
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Retained installers (scaled)
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Performance (98% CI)
          </th>
        </>
      )
    } else {
      // CTR
      return (
        <>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Impressions
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            CTR (98% CI)
          </th>
        </>
      )
    }
  }

  const renderTableData = (variant: any) => {
    if (displayMetric === "first-time-installers") {
      return (
        <>
          <td className="px-6 py-4 whitespace-nowrap text-gray-700">{variant.installers?.toLocaleString() || "—"}</td>
          <td className="px-6 py-4 whitespace-nowrap text-gray-700">
            {variant.installersScaled?.toLocaleString() || "—"}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex flex-col">
              <span className={`font-medium ${variant.isWinner ? "text-green-600" : "text-gray-700"}`}>
                {variant.performance}
              </span>
              <span className="text-xs text-gray-500">{variant.confidenceInterval}</span>
            </div>
          </td>
        </>
      )
    } else if (displayMetric === "retained-installers") {
      return (
        <>
          <td className="px-6 py-4 whitespace-nowrap text-gray-700">
            {variant.retainedInstallers?.toLocaleString() || "—"}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-gray-700">
            {variant.retainedInstallersScaled?.toLocaleString() || "—"}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex flex-col">
              <span className={`font-medium ${variant.isWinner ? "text-green-600" : "text-gray-700"}`}>
                {variant.performance}
              </span>
              <span className="text-xs text-gray-500">{variant.confidenceInterval}</span>
            </div>
          </td>
        </>
      )
    } else {
      // CTR
      return (
        <>
          <td className="px-6 py-4 whitespace-nowrap text-gray-700">{variant.impressions?.toLocaleString() || "—"}</td>
          <td className="px-6 py-4 whitespace-nowrap text-gray-700">{variant.clicks?.toLocaleString() || "—"}</td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex flex-col">
              <span className={`font-medium ${variant.isWinner ? "text-green-600" : "text-gray-700"}`}>
                {variant.ctr ? `${variant.ctr.toFixed(1)}%` : "—"}
              </span>
              <span className="text-xs text-gray-500">{variant.confidenceInterval}</span>
            </div>
          </td>
        </>
      )
    }
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-gray-600">{entry.name}:</span>
              <span className="font-medium text-gray-900">
                {displayMetric === "ctr" ? `${entry.value.toFixed(1)}%` : entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 space-y-6 max-w-7xl">
        <div className="space-y-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/applications">Applications</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href="/applications/ab-testing">Store listing experiments</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>{experiment.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={() => router.back()}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">A/B test preview</h1>
                  <p className="text-sm text-gray-600 mt-1">{experiment.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-12">
                {getStatusBadge(experiment.status)}
                <Badge variant="outline" className="bg-white">
                  {experiment.storeListing}
                </Badge>
                <Badge variant="outline" className="bg-white">
                  {experiment.experimentType}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {experiment.status === "Running" && (
                <>
                  <Button variant="default" onClick={handleApplyWinner}>
                    <Play className="h-4 w-4 mr-2" />
                    Apply winner
                  </Button>
                  <Button variant="outline" onClick={handleStop}>
                    <Pause className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                </>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleDuplicate}>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <Card className="shadow-sm border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-gray-900 mb-1">
                  {experiment.status === "Running"
                    ? "More data needed"
                    : experiment.status === "Stopped" || experiment.status === "Cancelled"
                      ? "Experiment stopped"
                      : experiment.status === "Completed"
                        ? "Experiment completed"
                        : "Result inconclusive"}
                </p>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    Started on <span className="font-medium">{experiment.startDate}</span>
                  </p>
                  {experiment.endDate && (
                    <p>
                      Stopped on <span className="font-medium">{experiment.endDate}</span>
                    </p>
                  )}
                  <p>
                    Minimum detectable effect:{" "}
                    <span className="font-medium">{experiment.minimumDetectableEffect}%</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-sm text-gray-600 whitespace-nowrap">Display:</Label>
                <Select value={displayMetric} onValueChange={handleMetricChange}>
                  <SelectTrigger className="w-[280px] bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {displayMetrics.map((metric) => (
                      <SelectItem key={metric.value} value={metric.value}>
                        {metric.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-0">
            {isLoadingMetric ? (
              <div className="p-6 space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : !hasMetricData ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Info className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa đủ dữ liệu</h3>
                <p className="text-gray-500 text-center max-w-md">
                  Chưa có đủ dữ liệu để hiển thị chỉ số này. Vui lòng chọn chỉ số khác hoặc đợi thử nghiệm thu thập thêm
                  dữ liệu.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8"></th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Variant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Audience
                      </th>
                      {renderTableHeaders()}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {variantsWithAssets.map((variant: any) => {
                      const filteredAssets = filterAssetsByLocaleAndPlatform(variant.assets)
                      const hasAssets = hasAnyAssets(filteredAssets)
                      const isExpanded = expandedVariant === variant.id

                      return (
                        <>
                          <tr key={variant.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setExpandedVariant(isExpanded ? null : variant.id)
                                }}
                              >
                                <ChevronRight
                                  className={`h-4 w-4 text-gray-400 transition-transform ${
                                    isExpanded ? "rotate-90" : ""
                                  }`}
                                />
                              </Button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                {variant.isWinner && (
                                  <TooltipProvider>
                                    <UITooltip>
                                      <TooltipTrigger>
                                        <div className="h-2 w-2 rounded-full bg-green-500" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="text-xs">Winner variant</p>
                                      </TooltipContent>
                                    </UITooltip>
                                  </TooltipProvider>
                                )}
                                <span className="font-medium text-gray-900">{variant.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-700">{variant.audience}%</td>
                            {renderTableData(variant)}
                          </tr>
                          {isExpanded && (
                            <tr>
                              <td colSpan={7} className="px-6 py-6 bg-gray-50">
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-gray-900">Content</h4>
                                    <div className="flex items-center gap-2">
                                      <Select value={localeFilter} onValueChange={setLocaleFilter}>
                                        <SelectTrigger className="w-[140px] h-8 text-xs">
                                          <SelectValue placeholder="Locale" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="all">All locales</SelectItem>
                                          <SelectItem value="en-US">English (US)</SelectItem>
                                          <SelectItem value="vi-VN">Tiếng Việt</SelectItem>
                                          <SelectItem value="ja-JP">日本語</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <Select value={platformFilter} onValueChange={setPlatformFilter}>
                                        <SelectTrigger className="w-[140px] h-8 text-xs">
                                          <SelectValue placeholder="Platform" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="all">All platforms</SelectItem>
                                          <SelectItem value="android">Android</SelectItem>
                                          <SelectItem value="ios">iOS</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>

                                  {!hasAssets ? (
                                    <div className="flex items-center justify-center py-8 text-gray-500 border border-dashed border-gray-300 rounded-lg bg-white">
                                      <Info className="h-5 w-5 mr-2" />
                                      <span className="text-sm">No data available for this variant</span>
                                    </div>
                                  ) : (
                                    <div className="space-y-6">
                                      {hasImageAssets(filteredAssets) && (
                                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                                          <p className="text-xs font-medium text-gray-500 mb-4 uppercase tracking-wide">
                                            Graphics
                                          </p>
                                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {filteredAssets?.icon && (
                                              <div>
                                                <p className="text-xs text-gray-500 mb-2 font-medium">App icon</p>
                                                <AssetImage
                                                  asset={filteredAssets.icon}
                                                  alt={`${variant.name} - App Icon`}
                                                  className="w-24 h-24 rounded-lg"
                                                  onPreview={() => {
                                                    if (filteredAssets.icon) {
                                                      handleImagePreview(
                                                        filteredAssets.icon.url,
                                                        `${variant.name} - App Icon`,
                                                      )
                                                    }
                                                  }}
                                                />
                                              </div>
                                            )}

                                            {filteredAssets?.featureGraphic && (
                                              <div>
                                                <p className="text-xs text-gray-500 mb-2 font-medium">
                                                  Feature graphic
                                                </p>
                                                <AssetImage
                                                  asset={filteredAssets.featureGraphic}
                                                  alt={`${variant.name} - Feature Graphic`}
                                                  className="w-full h-24 rounded-lg"
                                                  onPreview={() => {
                                                    if (filteredAssets.featureGraphic) {
                                                      handleImagePreview(
                                                        filteredAssets.featureGraphic.url,
                                                        `${variant.name} - Feature Graphic`,
                                                      )
                                                    }
                                                  }}
                                                />
                                              </div>
                                            )}

                                            {filteredAssets?.screenshots && filteredAssets.screenshots.length > 0 && (
                                              <div className="md:col-span-1">
                                                <p className="text-xs text-gray-500 mb-2 font-medium">Screenshots</p>
                                                <div className="flex gap-2 flex-wrap">
                                                  {filteredAssets.screenshots.slice(0, 3).map((screenshot) => (
                                                    <AssetImage
                                                      key={screenshot.id}
                                                      asset={screenshot}
                                                      alt={`${variant.name} - Screenshot`}
                                                      className="h-32 w-auto rounded-lg"
                                                      onPreview={() => {
                                                        handleImagePreview(
                                                          screenshot.url,
                                                          `${variant.name} - Screenshot`,
                                                        )
                                                      }}
                                                    />
                                                  ))}
                                                  {filteredAssets.screenshots.length > 3 && (
                                                    <div className="h-32 w-16 rounded-lg border border-gray-200 bg-gray-100 flex items-center justify-center">
                                                      <span className="text-sm font-medium text-gray-600">
                                                        +{filteredAssets.screenshots.length - 3}
                                                      </span>
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      )}

                                      {hasTextAssets(filteredAssets) && (
                                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                                          <p className="text-xs font-medium text-gray-500 mb-4 uppercase tracking-wide">
                                            Text content
                                          </p>
                                          <div className="space-y-4">
                                            {filteredAssets?.title && (
                                              <div>
                                                <p className="text-xs text-gray-500 mb-1 font-medium">Title</p>
                                                <p className="text-sm text-gray-900 font-medium">
                                                  {filteredAssets.title}
                                                </p>
                                              </div>
                                            )}
                                            {filteredAssets?.shortDescription && (
                                              <div>
                                                <p className="text-xs text-gray-500 mb-1 font-medium">
                                                  Short description
                                                </p>
                                                <p className="text-sm text-gray-900">
                                                  {filteredAssets.shortDescription}
                                                </p>
                                              </div>
                                            )}
                                            {filteredAssets?.fullDescription && (
                                              <div>
                                                <p className="text-xs text-gray-500 mb-1 font-medium">
                                                  Full description
                                                </p>
                                                <p className="text-sm text-gray-900 whitespace-pre-wrap">
                                                  {filteredAssets.fullDescription}
                                                </p>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Retained first-time installers</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingMetric ? (
              <div className="space-y-4">
                <Skeleton className="h-[350px] w-full" />
              </div>
            ) : !hasMetricData ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Info className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">Không có dữ liệu biểu đồ cho chỉ số này</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={currentMetricData.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: "12px" }} />
                  <YAxis
                    stroke="#6b7280"
                    style={{ fontSize: "12px" }}
                    label={{
                      value: currentMetricData.yAxisLabel,
                      angle: -90,
                      position: "insideLeft",
                      style: { fontSize: "12px", fill: "#6b7280" },
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: "20px" }} />
                  <Line
                    type="monotone"
                    dataKey="current"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Current listing"
                    dot={{ r: 4 }}
                  />
                  {variantsWithAssets.slice(1).map((variant: any, idx: number) => {
                    const colors = ["#f97316", "#ec4899", "#8b5cf6", "#10b981"]
                    const dataKey = `v${variant.id}`
                    return (
                      <Line
                        key={variant.id}
                        type="monotone"
                        dataKey={dataKey}
                        stroke={colors[idx % colors.length]}
                        strokeWidth={2}
                        name={variant.name}
                        dot={{ r: 4 }}
                      />
                    )
                  })}
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* N - Timeline & meta */}
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            <p>
              Started at <span className="font-medium">{experiment.startDate}</span>
              {experiment.endDate && (
                <>
                  {" — "}
                  Stopped at <span className="font-medium">{experiment.endDate}</span>
                </>
              )}
              {" — "}
              Minimum detectable effect: <span className="font-medium">{experiment.minimumDetectableEffect}%</span>
            </p>
          </div>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Created</p>
                    <p className="text-sm text-gray-500">{experiment.startDate}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Launched</p>
                    <p className="text-sm text-gray-500">{experiment.startDate}</p>
                  </div>
                </div>
                {experiment.status === "Completed" && (
                  <>
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Significant</p>
                        <p className="text-sm text-gray-500">{experiment.endDate}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Play className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Applied</p>
                        <p className="text-sm text-gray-500">
                          {experiment.appliedDate} by {experiment.appliedBy}
                        </p>
                      </div>
                    </div>
                  </>
                )}
                {(experiment.status === "Stopped" || experiment.status === "Cancelled") && (
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <Pause className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{experiment.status}</p>
                      <p className="text-sm text-gray-500">{experiment.endDate}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* P - Apply Winner Dialog */}
      <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Áp dụng biến thể thắng cuộc?</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn áp dụng <span className="font-medium">{selectedWinner}</span> làm listing chính
              thức? Hành động này sẽ cập nhật store listing của bạn.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApplyDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={confirmApply}>Xác nhận áp dụng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* P - Stop Experiment Dialog */}
      <Dialog open={stopDialogOpen} onOpenChange={setStopDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dừng thử nghiệm</DialogTitle>
            <DialogDescription>Vui lòng cho biết lý do dừng thử nghiệm này.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Ví dụ: Đã đạt đủ mẫu, thiếu traffic, phát hiện lỗi..."
              value={stopReason}
              onChange={(e) => setStopReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStopDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={confirmStop} disabled={!stopReason.trim()}>
              Dừng thử nghiệm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Duplicate Dialog */}
      <Dialog open={duplicateDialogOpen} onOpenChange={setDuplicateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tạo bản sao thử nghiệm</DialogTitle>
            <DialogDescription>
              Tạo một bản sao của thử nghiệm này với tất cả cài đặt và biến thể. Bản sao sẽ ở trạng thái nháp và bạn có
              thể chỉnh sửa trước khi chạy.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="duplicate-name">Tên thử nghiệm mới</Label>
              <Input
                id="duplicate-name"
                placeholder="Nhập tên cho bản sao..."
                value={duplicateName}
                onChange={(e) => setDuplicateName(e.target.value)}
              />
            </div>
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
              <div className="flex gap-2">
                <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-1">Bản sao sẽ bao gồm:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Tất cả biến thể và assets</li>
                    <li>Cài đặt phân bổ audience</li>
                    <li>Cấu hình store listing</li>
                    <li>Minimum detectable effect</li>
                  </ul>
                  <p className="mt-2 text-xs">Dữ liệu kết quả sẽ không được sao chép.</p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDuplicateDialogOpen(false)} disabled={isDuplicating}>
              Hủy
            </Button>
            <Button onClick={confirmDuplicate} disabled={!duplicateName.trim() || isDuplicating}>
              {isDuplicating ? (
                <>
                  <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Tạo bản sao
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{previewImageTitle}</DialogTitle>
          </DialogHeader>
          <div className="relative w-full flex items-center justify-center bg-gray-100 rounded-lg p-4">
            {previewImage && (
              <img
                src={previewImage || "/placeholder.svg"}
                alt={previewImageTitle}
                className="max-h-[70vh] w-auto object-contain rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg?height=400&width=400"
                }}
              />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewImage(null)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
