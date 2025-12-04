"use client"

import { useState, useMemo } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  AlertCircle,
  Star,
  TrendingUp,
  TrendingDown,
  Minus,
  Trash2,
  Filter,
  Search,
  Plus,
  Download,
  ArrowUpDown,
  Eye,
  EyeOff,
  Target,
  Settings,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  Tooltip as RechartsTooltip,
} from "recharts"
import type { KeywordFilters } from "./keyword-filters"

interface KeywordSubTabsProps {
  filters: KeywordFilters
  data: {
    ranking: Array<{ date: string; main: number; comp1: number; comp2: number }>
    overview: Array<{ date: string; "1-2": number; "3-5": number; "6-10": number; "11-20": number; "21+": number }>
    downloads: Array<{ date: string; [key: string]: number | string }>
  }
}

type KeywordRow = {
  term: string
  traffic?: number
  phoneDifficulty?: number
  phoneApps?: string
  phoneRank?: number
  density?: string
  downloads: number
  percent: number
  change?: number
  tracked?: boolean
}

type TopApp = {
  rank: number
  name: string
  rating: number
  price: string
  iconUrl: string
}

const mockTopApps: TopApp[] = [
  { rank: 1, name: "Covet Fashion: Dress Up", rating: 4.7, price: "Free", iconUrl: "" },
  { rank: 2, name: "Super Stylist Fashion", rating: 4.6, price: "Free", iconUrl: "" },
  { rank: 3, name: "Fashion Fantasy", rating: 4.5, price: "Free", iconUrl: "" },
  { rank: 4, name: "Dress Up Games for Girls", rating: 4.4, price: "Free", iconUrl: "" },
  { rank: 5, name: "Fashion Makeover", rating: 4.3, price: "$2.99", iconUrl: "" },
  { rank: 6, name: "Style Boutique", rating: 4.5, price: "Free", iconUrl: "" },
  { rank: 7, name: "Fashion Designer World", rating: 4.2, price: "Free", iconUrl: "" },
  { rank: 8, name: "Glamour Dress Up", rating: 4.6, price: "Free", iconUrl: "" },
  { rank: 9, name: "Runway Fashion Show", rating: 4.1, price: "Free", iconUrl: "" },
  { rank: 10, name: "Fashion Star Boutique", rating: 4.4, price: "$1.99", iconUrl: "" },
]

const mockKeywordsRanking: KeywordRow[] = [
  {
    term: "dress",
    traffic: 3.7,
    phoneDifficulty: 8.0,
    phoneApps: "240+",
    phoneRank: 11,
    density: "5.6%",
    downloads: 1200,
    percent: 12.0,
    change: 2,
    tracked: true,
  },
  {
    term: "fashion show",
    traffic: 4.2,
    phoneDifficulty: 7.5,
    phoneApps: "156+",
    phoneRank: 8,
    density: "6.3%",
    downloads: 2500,
    percent: 15.0,
    change: 4,
    tracked: true,
  },
  {
    term: "covet",
    traffic: 3.4,
    phoneDifficulty: 7.8,
    phoneApps: "89+",
    phoneRank: 12,
    density: "0.0%",
    downloads: 890,
    percent: 8.0,
    change: -1,
    tracked: true,
  },
  {
    term: "fashion",
    traffic: 4.2,
    phoneDifficulty: 9.1,
    phoneApps: "450+",
    phoneRank: 15,
    density: "3.2%",
    downloads: 1800,
    percent: 10.0,
    change: 3,
    tracked: true,
  },
  {
    term: "dress up games",
    traffic: 2.9,
    phoneDifficulty: 7.5,
    phoneApps: "198+",
    phoneRank: 8,
    density: "4.1%",
    downloads: 1500,
    percent: 9.0,
    change: 1,
    tracked: true,
  },
  {
    term: "makeup",
    traffic: 3.1,
    phoneDifficulty: 8.3,
    phoneApps: "320+",
    phoneRank: 22,
    density: "2.8%",
    downloads: 750,
    percent: 5.0,
    change: -2,
    tracked: true,
  },
  {
    term: "stylist",
    traffic: 2.5,
    phoneDifficulty: 7.2,
    phoneApps: "145+",
    phoneRank: 18,
    density: "1.9%",
    downloads: 980,
    percent: 7.0,
    change: 0,
    tracked: true,
  },
  {
    term: "girl games",
    traffic: 3.8,
    phoneDifficulty: 8.7,
    phoneApps: "380+",
    phoneRank: 28,
    density: "1.5%",
    downloads: 560,
    percent: 3.0,
    change: -3,
    tracked: true,
  },
]

// Mock data for Keyword Downloads
const mockKeywordsDownloads: KeywordRow[] = [
  { term: "fashion show", traffic: 3.4, phoneRank: 1, density: "8.8%", downloads: 3013, percent: 60.6, tracked: true },
  {
    term: "fashion show games",
    traffic: 2.1,
    phoneRank: 1,
    density: "0.0%",
    downloads: 947,
    percent: 19.0,
    tracked: true,
  },
  { term: "بدون بنطال", traffic: 2.1, phoneRank: 3, density: "0.0%", downloads: 242, percent: 4.9, tracked: true },
  {
    term: "fashion",
    traffic: 5.8,
    phoneRank: 14,
    density: "12.5%",
    downloads: 98,
    percent: 2.0,
    change: 1,
    tracked: true,
  },
  {
    term: "fashion games",
    traffic: 5.8,
    phoneRank: 17,
    density: "0.9%",
    downloads: 81,
    percent: 1.6,
    tracked: true,
  },
  { term: "barby", traffic: 1.9, phoneRank: 6, density: "0.0%", downloads: 24, percent: 0.5, tracked: true },
  {
    term: "dress",
    traffic: 4.2,
    phoneRank: 22,
    density: "3.2%",
    downloads: 156,
    percent: 3.1,
    change: -2,
    tracked: true,
  },
  { term: "suitu", traffic: 1.2, phoneRank: 45, density: "0.0%", downloads: 12, percent: 0.2, tracked: true },
  { term: "Other", downloads: 403, percent: 8.1, tracked: false },
]

// Mock data for keyword-based chart series
const mockKeywordSeries = [
  {
    id: "fashion",
    name: "fashion",
    color: "#3b82f6", // Using chartColors[0]
    points: [
      { date: "07/10", rank: 15 },
      { date: "07/20", rank: 14 },
      { date: "08/01", rank: 15 },
      { date: "08/10", rank: 14 },
      { date: "08/11", rank: 15 },
      { date: "08/12", rank: 15 },
    ],
  },
  {
    id: "dress",
    name: "dress",
    color: "#10b981", // Using chartColors[1]
    points: [
      { date: "07/10", rank: 12 },
      { date: "07/20", rank: 11 },
      { date: "08/01", rank: 11 },
      { date: "08/10", rank: 11 },
      { date: "08/11", rank: 11 },
      { date: "08/12", rank: 11 },
    ],
  },
  {
    id: "fashion show",
    name: "fashion show",
    color: "#8b5cf6", // Using chartColors[2]
    points: [
      { date: "07/10", rank: 9 },
      { date: "07/20", rank: 8 },
      { date: "08/01", rank: 8 },
      { date: "08/10", rank: 8 },
      { date: "08/11", rank: 8 },
      { date: "08/12", rank: 8 },
    ],
  },
]

const chartColors = ["#3b82f6", "#10b981", "#8b5cf6"]
const bucketColors = {
  "1-2": "#10b981",
  "3-5": "#3b82f6",
  "6-10": "#8b5cf6",
  "11-20": "#f59e0b",
  "21+": "#ef4444",
}

const downloadsSeriesColors = [
  "#3b82f6",
  "#10b981",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#ec4899",
  "#14b8a6",
  "#6b7280",
]

function formatNumberCompact(num: number): string {
  if (num < 1000) return num.toString()
  if (num < 1000000) return `${(num / 1000).toFixed(1)}K`
  return `${(num / 1000000).toFixed(1)}M`
}

function formatNumberFull(num: number): string {
  return new Intl.NumberFormat("en-US").format(num)
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertCircle className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
      <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
      <p className="text-sm text-muted-foreground max-w-md">
        The selected filters returned no data. Try adjusting your filters above to see results.
      </p>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[400px] w-full" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  )
}

export function KeywordSubTabs({ filters, data }: KeywordSubTabsProps) {
  const [activeSubTab, setActiveSubTab] = useState<"ranking" | "overview" | "downloads">("ranking")
  const [chartByApp, setChartByApp] = useState(true)
  const [overviewPlotType, setOverviewPlotType] = useState<"stacked" | "line">("stacked")
  const [downloadsPlotType, setDownloadsPlotType] = useState<"stacked" | "line">("stacked")
  const [keywordFilter, setKeywordFilter] = useState("")
  const [visibleLines, setVisibleLines] = useState({
    main: true,
    comp1: true,
    comp2: true,
  })
  const [addKeywordOpen, setAddKeywordOpen] = useState(false)
  const [manageKeywordOpen, setManageKeywordOpen] = useState(false)
  const [keywordViewFilter, setKeywordViewFilter] = useState("all")
  const [sortColumn, setSortColumn] = useState<keyof KeywordRow>("downloads")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [isLoading, setIsLoading] = useState(false)
  const [showUntracked, setShowUntracked] = useState(true)
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set())

  const hasRankingData = data.ranking && data.ranking.length > 0
  const hasOverviewData = data.overview && data.overview.length > 0
  const hasDownloadsData = data.downloads && data.downloads.length > 0

  // Calculate total downloads
  const totalDownloads = useMemo(() => {
    return mockKeywordsDownloads.reduce((sum, kw) => sum + kw.downloads, 0)
  }, [])

  // Prepare chart data based on mode
  const activeChartData = useMemo(() => {
    const allDates = new Set<string>()
    if (chartByApp) {
      data.ranking.forEach((point: any) => allDates.add(point.date))
    } else {
      mockKeywordSeries.forEach((s) => s.points.forEach((p) => allDates.add(p.date)))
    }

    const dates = Array.from(allDates).sort()

    return dates.map((date) => {
      const dataPoint: any = { date }
      if (chartByApp) {
        const point = data.ranking.find((p: any) => p.date === date)
        if (point) {
          dataPoint.main = point.main
          dataPoint.comp1 = point.comp1
          dataPoint.comp2 = point.comp2
        }
      } else {
        mockKeywordSeries.forEach((s) => {
          const point = s.points.find((p) => p.date === date)
          dataPoint[s.id] = point?.rank ?? null // Use null if rank is undefined
        })
      }
      return dataPoint
    })
  }, [chartByApp, data.ranking])

  // Filter and sort keywords for downloads table
  const filteredDownloadKeywords = useMemo(() => {
    const filtered = mockKeywordsDownloads.filter((kw) => {
      if (!showUntracked && !kw.tracked) return false
      if (keywordFilter && !kw.term.toLowerCase().includes(keywordFilter.toLowerCase())) return false
      return true
    })

    // Separate Total row
    const totalRow: KeywordRow = { term: "Total", downloads: totalDownloads, percent: 100 }
    const dataRows = filtered.filter((kw) => kw.term !== "Total")

    // Sort data rows
    dataRows.sort((a, b) => {
      const aVal = a[sortColumn] ?? 0
      const bVal = b[sortColumn] ?? 0

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal
      }

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }

      return 0
    })

    return [totalRow, ...dataRows]
  }, [showUntracked, keywordFilter, sortColumn, sortDirection, totalDownloads])

  // Filter and sort keywords for ranking/overview table
  const filteredRankingKeywords = useMemo(() => {
    let filtered = mockKeywordsRanking.filter((kw) => kw.term.toLowerCase().includes(keywordFilter.toLowerCase()))

    if (sortColumn) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortColumn]
        const bVal = b[sortColumn]

        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortDirection === "asc" ? aVal - bVal : bVal - aVal
        }

        if (typeof aVal === "string" && typeof bVal === "string") {
          return sortDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
        }

        return 0
      })
    }

    return filtered
  }, [keywordFilter, sortColumn, sortDirection])

  // Prepare visible series for downloads chart
  const visibleDownloadSeries = useMemo(() => {
    return mockKeywordsDownloads
      .filter((kw) => {
        if (!showUntracked && !kw.tracked) return false
        if (hiddenSeries.has(kw.term)) return false
        return true
      })
      .map((kw, idx) => ({
        term: kw.term,
        color: downloadsSeriesColors[idx % downloadsSeriesColors.length],
      }))
  }, [showUntracked, hiddenSeries])

  const toggleLine = (key: keyof typeof visibleLines | string) => {
    // Update visibleLines state for app/competitor mode
    if (key === "main" || key === "comp1" || key === "comp2") {
      setVisibleLines((prev) => ({ ...prev, [key]: !prev[key] }))
    } else {
      // Update for keyword mode
      const newHidden = new Set(hiddenSeries)
      if (newHidden.has(key)) {
        newHidden.delete(key)
      } else {
        newHidden.add(key)
      }
      setHiddenSeries(newHidden)
    }
  }

  const toggleDownloadSeries = (term: string) => {
    const newHidden = new Set(hiddenSeries)
    if (newHidden.has(term)) {
      newHidden.delete(term)
    } else {
      newHidden.add(term)
    }
    setHiddenSeries(newHidden)
  }

  const handleSort = (column: keyof KeywordRow) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("desc")
    }
  }

  const exportCSV = () => {
    const headers = ["Search Term", "Traffic", "Phone Rank", "Density", "Downloads", "Percent"]
    const rows = filteredDownloadKeywords.map((kw) => [
      kw.term,
      kw.traffic || "",
      kw.phoneRank || "",
      kw.density || "",
      kw.downloads,
      kw.percent.toFixed(1) + "%",
    ])

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "keyword_downloads.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const getOSIcon = (device: string) => {
    return device.toLowerCase().includes("android") ? "🤖" : "🍎"
  }

  const getCountryFlag = (country: string) => {
    const flags: Record<string, string> = {
      global: "🌍",
      us: "🇺🇸",
      jp: "🇯🇵",
      vn: "🇻🇳",
      kr: "🇰🇷",
      uk: "🇬🇧",
      de: "🇩🇪",
      fr: "🇫🇷",
    }
    return flags[country.toLowerCase()] || "🌍"
  }

  return (
    <div className="space-y-6">
      {/* Sub-tabs navigation */}
      <div className="px-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <Tabs value={activeSubTab} onValueChange={(v) => setActiveSubTab(v as any)} className="w-full">
                <div className="flex items-center justify-between mb-6">
                  <TabsList className="grid w-full max-w-md grid-cols-3">
                    <TabsTrigger value="ranking">Keyword Ranking</TabsTrigger>
                    <TabsTrigger value="overview">Keyword Overview</TabsTrigger>
                    <TabsTrigger value="downloads">Keyword Downloads</TabsTrigger>
                  </TabsList>

                  {/* Controls for each tab */}
                  <div className="flex items-center gap-2">
                    {activeSubTab === "ranking" && (
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-[#2B2F36] dark:text-gray-300">Chart By:</span>
                        <div
                          className="inline-flex items-center gap-0 p-1 rounded-full bg-[#EFF1F4] dark:bg-gray-800"
                          role="tablist"
                          aria-label="Chart By"
                        >
                          <button
                            role="tab"
                            aria-selected={chartByApp}
                            onClick={() => setChartByApp(true)}
                            className={`
                              px-3 py-1.5 text-sm font-semibold rounded-full transition-all
                              focus:outline-none focus:ring-2 focus:ring-[#8AB4F8]
                              ${
                                chartByApp
                                  ? "bg-[#4A5A70] text-white border border-[#4A5A70]"
                                  : "bg-transparent text-[#2B2F36] dark:text-gray-300 border border-transparent hover:bg-gray-100/50 dark:hover:bg-gray-700/50"
                              }
                            `}
                          >
                            App
                          </button>
                          <button
                            role="tab"
                            aria-selected={!chartByApp}
                            onClick={() => setChartByApp(false)}
                            className={`
                              px-3 py-1.5 text-sm font-semibold rounded-full transition-all
                              focus:outline-none focus:ring-2 focus:ring-[#8AB4F8]
                              ${
                                !chartByApp
                                  ? "bg-[#4A5A70] text-white border border-[#4A5A70]"
                                  : "bg-transparent text-[#2B2F36] dark:text-gray-300 border border-transparent hover:bg-gray-100/50 dark:hover:bg-gray-700/50"
                              }
                            `}
                          >
                            Keyword
                          </button>
                        </div>
                      </div>
                    )}
                    {activeSubTab === "overview" && (
                      <Select value={overviewPlotType} onValueChange={(v) => setOverviewPlotType(v as any)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="stacked">Stacked</SelectItem>
                          <SelectItem value="line">Line</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    {activeSubTab === "downloads" && (
                      <Select value={downloadsPlotType} onValueChange={(v) => setDownloadsPlotType(v as any)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="stacked">Stacked</SelectItem>
                          <SelectItem value="line">Line</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>

                {/* Keyword Ranking Tab */}
                <TabsContent value="ranking" className="mt-0 space-y-6">
                  {!hasRankingData && !mockKeywordSeries.some((s) => s.points.length > 0) ? (
                    <EmptyState />
                  ) : (
                    <>
                      {/* Chart Section with Top Apps/Keywords Sidebar */}
                      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
                        {/* Line Chart */}
                        <div>
                          <CardHeader className="px-0 pt-0">
                            {/* Update chart title to reflect mode */}
                            <CardTitle>{chartByApp ? "App Ranking Over Time" : "Keyword Ranking Over Time"}</CardTitle>
                            <CardDescription>Lower rank is better (Rank 1 is best)</CardDescription>
                          </CardHeader>
                          <div className="space-y-4">
                            <ResponsiveContainer width="100%" height={400}>
                              <LineChart data={activeChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis reversed domain={[0, 50]} /> {/* Assuming max rank is 50 for Y-axis */}
                                <RechartsTooltip
                                  content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                      return (
                                        <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
                                          <p className="font-semibold mb-2">{payload[0].payload.date}</p>
                                          {payload.map((entry, index) => (
                                            <p key={index} className="text-sm" style={{ color: entry.color }}>
                                              {entry.name}: #{entry.value}
                                            </p>
                                          ))}
                                        </div>
                                      )
                                    }
                                    return null
                                  }}
                                />
                                <Legend />
                                {chartByApp ? (
                                  <>
                                    {visibleLines.main && (
                                      <Line
                                        type="monotone"
                                        dataKey="main"
                                        stroke={chartColors[0]}
                                        strokeWidth={2}
                                        name="Fashion Show"
                                        dot={{ r: 4 }}
                                        activeDot={{ r: 6 }}
                                      />
                                    )}
                                    {visibleLines.comp1 && (
                                      <Line
                                        type="monotone"
                                        dataKey="comp1"
                                        stroke={chartColors[1]}
                                        strokeWidth={2}
                                        name="Covet Fashion"
                                        dot={{ r: 4 }}
                                        activeDot={{ r: 6 }}
                                      />
                                    )}
                                    {visibleLines.comp2 && (
                                      <Line
                                        type="monotone"
                                        dataKey="comp2"
                                        stroke={chartColors[2]}
                                        strokeWidth={2}
                                        name="Super Stylist"
                                        dot={{ r: 4 }}
                                        activeDot={{ r: 6 }}
                                      />
                                    )}
                                  </>
                                ) : (
                                  mockKeywordSeries.map(
                                    (series) =>
                                      (visibleLines[series.id as keyof typeof visibleLines] || true) && ( // Default to true if not defined in visibleLines
                                        <Line
                                          key={series.id}
                                          type="monotone"
                                          dataKey={series.id} // Use the id as dataKey for keyword series
                                          stroke={series.color}
                                          strokeWidth={2}
                                          name={series.name}
                                          dot={{ r: 4 }}
                                          activeDot={{ r: 6 }}
                                        />
                                      ),
                                  )
                                )}
                              </LineChart>
                            </ResponsiveContainer>

                            {/* Update Legend Controls */}
                            <div className="flex items-center gap-4 flex-wrap">
                              {chartByApp ? (
                                <>
                                  <button
                                    onClick={() => toggleLine("main")}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                                      visibleLines.main
                                        ? "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                                    }`}
                                  >
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chartColors[0] }} />
                                    Fashion Show
                                  </button>
                                  <button
                                    onClick={() => toggleLine("comp1")}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                                      visibleLines.comp1
                                        ? "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300"
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                                    }`}
                                  >
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chartColors[1] }} />
                                    Covet Fashion
                                  </button>
                                  <button
                                    onClick={() => toggleLine("comp2")}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                                      visibleLines.comp2
                                        ? "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300"
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                                    }`}
                                  >
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chartColors[2] }} />
                                    Super Stylist
                                  </button>
                                </>
                              ) : (
                                mockKeywordSeries.map((series) => (
                                  <button
                                    key={series.id}
                                    onClick={() => toggleLine(series.id)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                                      hiddenSeries.has(series.id)
                                        ? "bg-gray-100 dark:bg-gray-800 text-gray-400"
                                        : `bg-${series.color.substring(1, -1)}-100 dark:bg-${series.color.substring(1, -1)}-950 text-${series.color.substring(1, -1)}-700 dark:text-${series.color.substring(1, -1)}-300`
                                    }`}
                                  >
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: series.color }} />
                                    {series.name}
                                  </button>
                                ))
                              )}
                            </div>

                            {/* Update chart description text */}
                            <div className="text-xs text-muted-foreground text-center bg-muted/50 p-3 rounded-md">
                              Lower rank is better (Rank 1 is best) • Tracking {activeChartData.length} data points •
                              Viewing by {chartByApp ? "App" : "Keyword"}
                            </div>
                          </div>
                        </div>

                        {/* Update Top Apps Sidebar */}
                        <div className="hidden lg:block">
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">
                                {chartByApp ? "Top Apps for Fashion" : "Top Similar Keywords"}
                              </CardTitle>
                              <CardDescription>
                                {chartByApp
                                  ? "Top performing apps in this category"
                                  : "Keywords similar to your search terms"}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                                {chartByApp
                                  ? // Top Apps list
                                    mockTopApps.map((topApp) => (
                                      <div
                                        key={topApp.rank}
                                        className="flex items-center gap-3 p-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                      >
                                        <span className="text-sm font-bold text-gray-400 w-6">#{topApp.rank}</span>
                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                                          {topApp.name.slice(0, 2)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <h4 className="font-medium text-sm truncate">{topApp.name}</h4>
                                          <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1">
                                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                              <span className="text-xs">{topApp.rating}</span>
                                            </div>
                                            <Badge variant="secondary" className="text-xs">
                                              {topApp.price}
                                            </Badge>
                                          </div>
                                        </div>
                                      </div>
                                    ))
                                  : // Top Similar Keywords list
                                    mockKeywordSeries
                                      .slice(0, 15)
                                      .map((keyword, idx) => (
                                        <div
                                          key={idx}
                                          className="flex items-center gap-3 p-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                        >
                                          <span className="text-sm font-bold text-gray-400 w-6">#{idx + 1}</span>
                                          <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-sm">{keyword.name}</h4>
                                            <p className="text-xs text-muted-foreground">
                                              Traffic:{" "}
                                              {mockKeywordsRanking
                                                .find((kw) => kw.term === keyword.name)
                                                ?.traffic?.toFixed(1) || "N/A"}
                                            </p>
                                          </div>
                                          <Badge variant="outline" className="text-xs font-bold">
                                            #
                                            {mockKeywordsRanking.find((kw) => kw.term === keyword.name)?.phoneRank ||
                                              "N/A"}
                                          </Badge>
                                        </div>
                                      ))}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      {/* Keyword Data Table */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">Keyword Performance</h3>
                            <p className="text-sm text-muted-foreground">
                              Track and analyze keyword rankings and metrics
                            </p>
                          </div>
                          <div className="relative w-64">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Filter keywords..."
                              value={keywordFilter}
                              onChange={(e) => setKeywordFilter(e.target.value)}
                              className="pl-9"
                            />
                          </div>
                        </div>

                        <div className="rounded-md border overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Search Term</TableHead>
                                <TableHead className="text-right cursor-pointer" onClick={() => handleSort("traffic")}>
                                  <div className="flex items-center justify-end gap-1">
                                    Traffic
                                    <ArrowUpDown className="h-3 w-3" />
                                  </div>
                                </TableHead>
                                <TableHead
                                  className="text-right cursor-pointer"
                                  onClick={() => handleSort("phoneDifficulty")}
                                >
                                  <div className="flex items-center justify-end gap-1">
                                    Phone Difficulty
                                    <ArrowUpDown className="h-3 w-3" />
                                  </div>
                                </TableHead>
                                <TableHead className="text-right">Phone Apps</TableHead>
                                <TableHead
                                  className="text-right cursor-pointer"
                                  onClick={() => handleSort("phoneRank")}
                                >
                                  <div className="flex items-center justify-end gap-1">
                                    Phone Rank
                                    <ArrowUpDown className="h-3 w-3" />
                                  </div>
                                </TableHead>
                                <TableHead className="text-right">Density</TableHead>
                                <TableHead className="text-center">Change</TableHead>
                                {/* Remove Actions column */}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredRankingKeywords.length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={7} className="text-center py-12">
                                    {" "}
                                    {/* Adjusted colspan */}
                                    <div className="flex flex-col items-center">
                                      <Search className="h-12 w-12 text-gray-400 mb-3" />
                                      <p className="text-gray-600 font-medium">No keywords found</p>
                                      <p className="text-sm text-gray-500">
                                        Try adjusting your filter or add new keywords
                                      </p>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ) : (
                                filteredRankingKeywords.map((keyword, index) => (
                                  <TableRow
                                    key={index}
                                    className={`${
                                      keyword.change && keyword.change > 0
                                        ? "bg-emerald-50 dark:bg-emerald-950/20 hover:bg-emerald-100 dark:hover:bg-emerald-950/30"
                                        : keyword.change && keyword.change < 0
                                          ? "bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-950/30"
                                          : "hover:bg-gray-50 dark:hover:bg-gray-800"
                                    }`}
                                  >
                                    <TableCell className="font-medium">{keyword.term}</TableCell>
                                    <TableCell className="text-right">
                                      {keyword.traffic ? keyword.traffic.toFixed(1) : "—"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      {keyword.phoneDifficulty ? keyword.phoneDifficulty.toFixed(1) : "—"}
                                    </TableCell>
                                    <TableCell className="text-right">{keyword.phoneApps || "—"}</TableCell>
                                    <TableCell className="text-right">
                                      <Badge
                                        variant="outline"
                                        className={`font-bold ${
                                          keyword.change && keyword.change > 0
                                            ? "border-emerald-500 text-emerald-700 dark:text-emerald-400"
                                            : keyword.change && keyword.change < 0
                                              ? "border-rose-500 text-rose-700 dark:text-rose-400"
                                              : "border-gray-400"
                                        }`}
                                      >
                                        #{keyword.phoneRank || "—"}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">{keyword.density || "—"}</TableCell>
                                    <TableCell className="text-center">
                                      <div className="flex items-center justify-center gap-1">
                                        {keyword.change && keyword.change > 0 ? (
                                          <>
                                            <TrendingUp className="h-4 w-4 text-emerald-600" />
                                            <span className="text-sm font-medium text-emerald-600">
                                              +{keyword.change}
                                            </span>
                                          </>
                                        ) : keyword.change && keyword.change < 0 ? (
                                          <>
                                            <TrendingDown className="h-4 w-4 text-rose-600" />
                                            <span className="text-sm font-medium text-rose-600">{keyword.change}</span>
                                          </>
                                        ) : (
                                          <span className="text-sm text-gray-500">
                                            <Minus className="h-4 w-4 inline" />
                                          </span>
                                        )}
                                      </div>
                                    </TableCell>
                                    {/* Remove Actions cell */}
                                  </TableRow>
                                ))
                              )}
                            </TableBody>
                          </Table>
                        </div>

                        {filteredRankingKeywords.length > 0 && (
                          <div className="mt-3 text-xs text-muted-foreground text-center">
                            Showing {filteredRankingKeywords.length} of {mockKeywordsRanking.length} keywords • Rankings
                            update daily
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </TabsContent>

                {/* Keyword Overview Tab */}
                <TabsContent value="overview" className="mt-0 space-y-6">
                  {isLoading ? (
                    <LoadingSkeleton />
                  ) : !hasOverviewData ? (
                    <EmptyState />
                  ) : (
                    <>
                      {/* Chart Section */}
                      <div>
                        <CardHeader className="px-0 pt-0">
                          <CardTitle>Keyword Overview – All Keywords</CardTitle>
                          <CardDescription>
                            {getOSIcon(filters.device)} {filters.device} • {filters.dateFrom} to {filters.dateTo} •{" "}
                            {getCountryFlag(filters.country)}{" "}
                            {filters.country === "global" ? "Global" : filters.country.toUpperCase()}
                          </CardDescription>
                        </CardHeader>

                        <div className="space-y-4">
                          {data.overview.length === 0 ? (
                            <div className="h-[400px] flex items-center justify-center border rounded-lg bg-muted/10">
                              <p className="text-muted-foreground">No data for the current filters.</p>
                            </div>
                          ) : (
                            <ResponsiveContainer width="100%" height={400}>
                              {overviewPlotType === "stacked" ? (
                                <AreaChart data={data.overview}>
                                  <defs>
                                    {Object.entries(bucketColors).map(([bucket, color]) => (
                                      <linearGradient key={bucket} id={`color${bucket}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                                        <stop offset="95%" stopColor={color} stopOpacity={0.3} />
                                      </linearGradient>
                                    ))}
                                  </defs>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="date" />
                                  <YAxis label={{ value: "Number of Keywords", angle: -90, position: "insideLeft" }} />
                                  <RechartsTooltip
                                    content={({ active, payload }) => {
                                      if (active && payload && payload.length) {
                                        return (
                                          <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
                                            <p className="font-semibold mb-2">{payload[0].payload.date}</p>
                                            {payload.map((entry, index) => (
                                              <p key={index} className="text-sm" style={{ color: entry.color }}>
                                                Rank {entry.dataKey}: {entry.value} keywords
                                              </p>
                                            ))}
                                          </div>
                                        )
                                      }
                                      return null
                                    }}
                                  />
                                  <Legend />
                                  <Area
                                    type="monotone"
                                    dataKey="1-2"
                                    stackId="1"
                                    stroke={bucketColors["1-2"]}
                                    fill={`url(#color1-2)`}
                                    name="Rank 1-2"
                                  />
                                  <Area
                                    type="monotone"
                                    dataKey="3-5"
                                    stackId="1"
                                    stroke={bucketColors["3-5"]}
                                    fill={`url(#color3-5)`}
                                    name="Rank 3-5"
                                  />
                                  <Area
                                    type="monotone"
                                    dataKey="6-10"
                                    stackId="1"
                                    stroke={bucketColors["6-10"]}
                                    fill={`url(#color6-10)`}
                                    name="Rank 6-10"
                                  />
                                  <Area
                                    type="monotone"
                                    dataKey="11-20"
                                    stackId="1"
                                    stroke={bucketColors["11-20"]}
                                    fill={`url(#color11-20)`}
                                    name="Rank 11-20"
                                  />
                                  <Area
                                    type="monotone"
                                    dataKey="21+"
                                    stackId="1"
                                    stroke={bucketColors["21+"]}
                                    fill={`url(#color21+)`}
                                    name="Rank 21+"
                                  />
                                </AreaChart>
                              ) : (
                                <LineChart data={data.overview}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="date" />
                                  <YAxis label={{ value: "Number of Keywords", angle: -90, position: "insideLeft" }} />
                                  <RechartsTooltip
                                    content={({ active, payload }) => {
                                      if (active && payload && payload.length) {
                                        return (
                                          <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
                                            <p className="font-semibold mb-2">{payload[0].payload.date}</p>
                                            {payload.map((entry, index) => (
                                              <p key={index} className="text-sm" style={{ color: entry.color }}>
                                                Rank {entry.dataKey}: {entry.value} keywords
                                              </p>
                                            ))}
                                          </div>
                                        )
                                      }
                                      return null
                                    }}
                                  />
                                  <Legend />
                                  <Line
                                    type="monotone"
                                    dataKey="1-2"
                                    stroke={bucketColors["1-2"]}
                                    strokeWidth={2}
                                    name="Rank 1-2"
                                    dot={{ r: 4 }}
                                  />
                                  <Line
                                    type="monotone"
                                    dataKey="3-5"
                                    stroke={bucketColors["3-5"]}
                                    strokeWidth={2}
                                    name="Rank 3-5"
                                    dot={{ r: 4 }}
                                  />
                                  <Line
                                    type="monotone"
                                    dataKey="6-10"
                                    stroke={bucketColors["6-10"]}
                                    strokeWidth={2}
                                    name="Rank 6-10"
                                    dot={{ r: 4 }}
                                  />
                                  <Line
                                    type="monotone"
                                    dataKey="11-20"
                                    stroke={bucketColors["11-20"]}
                                    strokeWidth={2}
                                    name="Rank 11-20"
                                    dot={{ r: 4 }}
                                  />
                                  <Line
                                    type="monotone"
                                    dataKey="21+"
                                    stroke={bucketColors["21+"]}
                                    strokeWidth={2}
                                    name="Rank 21+"
                                    dot={{ r: 4 }}
                                  />
                                </LineChart>
                              )}
                            </ResponsiveContainer>
                          )}

                          <div className="text-xs text-muted-foreground text-center bg-muted/50 p-3 rounded-md">
                            Keywords distribution by rank buckets • {filters.minTraffic}+ traffic threshold • Plot type:{" "}
                            {overviewPlotType} • Granularity: {filters.granularity}
                          </div>
                        </div>
                      </div>

                      {/* Keyword Table */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <Select value={keywordViewFilter} onValueChange={setKeywordViewFilter}>
                              <SelectTrigger className="w-40">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Keywords</SelectItem>
                                <SelectItem value="tracked">Tracked Only</SelectItem>
                                <SelectItem value="untracked">Untracked Only</SelectItem>
                              </SelectContent>
                            </Select>

                            <div className="relative w-64">
                              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                placeholder="Filter keywords..."
                                value={keywordFilter}
                                onChange={(e) => setKeywordFilter(e.target.value)}
                                className="pl-9"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Dialog open={addKeywordOpen} onOpenChange={setAddKeywordOpen}>
                              <DialogTrigger asChild>
                                <Button variant="outline">
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Keywords
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Add New Keywords</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <Input placeholder="Enter keyword..." />
                                  <Input placeholder="Enter keyword..." />
                                  <Input placeholder="Enter keyword..." />
                                  <Button className="w-full">Add Keywords</Button>
                                </div>
                              </DialogContent>
                            </Dialog>

                            <Button variant="outline" onClick={exportCSV}>
                              <Download className="h-4 w-4 mr-2" />
                              Download CSV
                            </Button>
                          </div>
                        </div>

                        <div className="rounded-md border overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Search Term</TableHead>
                                <TableHead className="text-right cursor-pointer" onClick={() => handleSort("traffic")}>
                                  <div className="flex items-center justify-end gap-1">
                                    Traffic
                                    <ArrowUpDown className="h-3 w-3" />
                                  </div>
                                </TableHead>
                                <TableHead
                                  className="text-right cursor-pointer"
                                  onClick={() => handleSort("phoneDifficulty")}
                                >
                                  <div className="flex items-center justify-end gap-1">
                                    Phone Difficulty
                                    <ArrowUpDown className="h-3 w-3" />
                                  </div>
                                </TableHead>
                                <TableHead className="text-right">Phone Apps</TableHead>
                                <TableHead
                                  className="text-right cursor-pointer"
                                  onClick={() => handleSort("phoneRank")}
                                >
                                  <div className="flex items-center justify-end gap-1">
                                    Phone Rank
                                    <ArrowUpDown className="h-3 w-3" />
                                  </div>
                                </TableHead>
                                <TableHead className="text-right">Density</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredRankingKeywords.length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={6} className="text-center py-12">
                                    <p className="text-muted-foreground">No rows for the current filters.</p>
                                  </TableCell>
                                </TableRow>
                              ) : (
                                filteredRankingKeywords.map((keyword, index) => (
                                  <TableRow
                                    key={index}
                                    className={`${
                                      keyword.change && keyword.change > 0
                                        ? "bg-emerald-50 dark:bg-emerald-950/20"
                                        : keyword.change && keyword.change < 0
                                          ? "bg-rose-50 dark:bg-rose-950/20"
                                          : ""
                                    }`}
                                  >
                                    <TableCell className="font-medium">{keyword.term}</TableCell>
                                    <TableCell className="text-right">
                                      {keyword.traffic ? keyword.traffic.toFixed(1) : "—"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      {keyword.phoneDifficulty ? keyword.phoneDifficulty.toFixed(1) : "—"}
                                    </TableCell>
                                    <TableCell className="text-right">{keyword.phoneApps || "—"}</TableCell>
                                    <TableCell className="text-right">
                                      <div className="flex items-center justify-end gap-2">
                                        <Badge
                                          variant="outline"
                                          className={`font-bold ${
                                            keyword.change && keyword.change > 0
                                              ? "border-emerald-500 text-emerald-700 dark:text-emerald-400"
                                              : keyword.change && keyword.change < 0
                                                ? "border-rose-500 text-rose-700 dark:text-rose-400"
                                                : "border-gray-400"
                                          }`}
                                        >
                                          #{keyword.phoneRank || "—"}
                                        </Badge>
                                        {keyword.change !== undefined && keyword.change !== 0 && (
                                          <span
                                            className={`text-xs ${keyword.change > 0 ? "text-emerald-600" : "text-rose-600"}`}
                                          >
                                            {keyword.change > 0 ? (
                                              <TrendingUp className="h-3 w-3 inline" />
                                            ) : (
                                              <TrendingDown className="h-3 w-3 inline" />
                                            )}
                                          </span>
                                        )}
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-right">{keyword.density || "—"}</TableCell>
                                  </TableRow>
                                ))
                              )}
                            </TableBody>
                          </Table>
                        </div>

                        {filteredRankingKeywords.length > 0 && (
                          <div className="mt-3 text-xs text-muted-foreground text-center">
                            Showing {filteredRankingKeywords.length} of {mockKeywordsRanking.length} keywords
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </TabsContent>

                {/* Keyword Downloads Tab - COMPLETE NEW LAYOUT */}
                <TabsContent value="downloads" className="mt-0 space-y-6">
                  {isLoading ? (
                    <LoadingSkeleton />
                  ) : !hasDownloadsData ? (
                    <EmptyState />
                  ) : (
                    <>
                      {/* (A) CHART SECTION */}
                      <div>
                        <CardHeader className="px-0 pt-0">
                          <CardTitle>Keyword Downloads – Fashion Show</CardTitle>
                          <CardDescription>
                            {getOSIcon(filters.device)} {filters.device} • {filters.dateFrom} to {filters.dateTo} •{" "}
                            {getCountryFlag(filters.country)}{" "}
                            {filters.country === "global" ? "Global" : filters.country.toUpperCase()}
                          </CardDescription>
                        </CardHeader>

                        <div className="space-y-4">
                          {data.downloads.length === 0 ? (
                            <div className="h-[400px] flex items-center justify-center border rounded-lg bg-muted/10">
                              <p className="text-muted-foreground">No data for the current filters.</p>
                            </div>
                          ) : (
                            <>
                              <ResponsiveContainer width="100%" height={400}>
                                {downloadsPlotType === "stacked" ? (
                                  <AreaChart data={data.downloads}>
                                    <defs>
                                      {visibleDownloadSeries.map((series) => (
                                        <linearGradient
                                          key={series.term}
                                          id={`colorDownload${series.term}`}
                                          x1="0"
                                          y1="0"
                                          x2="0"
                                          y2="1"
                                        >
                                          <stop offset="5%" stopColor={series.color} stopOpacity={0.8} />
                                          <stop offset="95%" stopColor={series.color} stopOpacity={0.3} />
                                        </linearGradient>
                                      ))}
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis label={{ value: "Downloads", angle: -90, position: "insideLeft" }} />
                                    <RechartsTooltip
                                      content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                          const total = payload.reduce((sum, entry) => sum + (entry.value as number), 0)
                                          return (
                                            <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
                                              <p className="font-semibold mb-2">{payload[0].payload.date}</p>
                                              {payload.map((entry, index) => (
                                                <p key={index} className="text-sm" style={{ color: entry.color }}>
                                                  {entry.dataKey}: {formatNumberFull(entry.value as number)}
                                                </p>
                                              ))}
                                              <p className="text-sm font-bold mt-2 pt-2 border-t">
                                                Total: {formatNumberFull(total)}
                                              </p>
                                            </div>
                                          )
                                        }
                                        return null
                                      }}
                                    />
                                    <Legend
                                      content={({ payload }) => (
                                        <div className="flex items-center justify-center gap-2 flex-wrap mt-4">
                                          {payload?.map((entry, index) => {
                                            const isHidden = hiddenSeries.has(entry.value as string)
                                            return (
                                              <button
                                                key={`item-${index}`}
                                                onClick={() => toggleDownloadSeries(entry.value as string)}
                                                className={`px-3 py-1 rounded-full text-sm font-medium transition-opacity ${
                                                  isHidden ? "opacity-40" : ""
                                                }`}
                                                style={{ backgroundColor: entry.color, color: "white" }}
                                              >
                                                {entry.value}
                                              </button>
                                            )
                                          })}
                                        </div>
                                      )}
                                    />
                                    {visibleDownloadSeries.map((series) => (
                                      <Area
                                        key={series.term}
                                        type="monotone"
                                        dataKey={series.term}
                                        stackId="1"
                                        stroke={series.color}
                                        fill={`url(#colorDownload${series.term})`}
                                        name={series.term}
                                      />
                                    ))}
                                  </AreaChart>
                                ) : (
                                  <LineChart data={data.downloads}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis label={{ value: "Downloads", angle: -90, position: "insideLeft" }} />
                                    <RechartsTooltip
                                      content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                          const total = payload.reduce((sum, entry) => sum + (entry.value as number), 0)
                                          return (
                                            <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
                                              <p className="font-semibold mb-2">{payload[0].payload.date}</p>
                                              {payload.map((entry, index) => (
                                                <p key={index} className="text-sm" style={{ color: entry.color }}>
                                                  {entry.dataKey}: {formatNumberFull(entry.value as number)}
                                                </p>
                                              ))}
                                              <p className="text-sm font-bold mt-2 pt-2 border-t">
                                                Total: {formatNumberFull(total)}
                                              </p>
                                            </div>
                                          )
                                        }
                                        return null
                                      }}
                                    />
                                    <Legend
                                      content={({ payload }) => (
                                        <div className="flex items-center justify-center gap-2 flex-wrap mt-4">
                                          {payload?.map((entry, index) => {
                                            const isHidden = hiddenSeries.has(entry.value as string)
                                            return (
                                              <button
                                                key={`item-${index}`}
                                                onClick={() => toggleDownloadSeries(entry.value as string)}
                                                className={`px-3 py-1 rounded-full text-sm font-medium transition-opacity ${
                                                  isHidden ? "opacity-40" : ""
                                                }`}
                                                style={{ backgroundColor: entry.color, color: "white" }}
                                              >
                                                {entry.value}
                                              </button>
                                            )
                                          })}
                                        </div>
                                      )}
                                    />
                                    {visibleDownloadSeries.map((series) => (
                                      <Line
                                        key={series.term}
                                        type="monotone"
                                        dataKey={series.term}
                                        stroke={series.color}
                                        strokeWidth={2}
                                        name={series.term}
                                        dot={{ r: 4 }}
                                      />
                                    ))}
                                  </LineChart>
                                )}
                              </ResponsiveContainer>

                              <div className="text-xs text-muted-foreground text-center bg-muted/50 p-3 rounded-md">
                                Downloads attributed to each keyword • Plot type: {downloadsPlotType} • Granularity:{" "}
                                {filters.granularity}
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* (B) ACTION BAR */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border">
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Untracked Keywords:
                          </span>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant={showUntracked ? "default" : "outline"}
                              onClick={() => setShowUntracked(true)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Display
                            </Button>
                            <Button
                              size="sm"
                              variant={!showUntracked ? "default" : "outline"}
                              onClick={() => setShowUntracked(false)}
                            >
                              <EyeOff className="h-3 w-3 mr-1" />
                              Hide
                            </Button>
                            <Button size="sm" variant="outline">
                              <Target className="h-3 w-3 mr-1" />
                              Track Keywords
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Dialog open={manageKeywordOpen} onOpenChange={setManageKeywordOpen}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Settings className="h-4 w-4 mr-2" />
                                Manage Keywords
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Manage Keywords</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <p className="text-sm text-muted-foreground">
                                  Add, remove, or track keywords for your app
                                </p>
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                  {mockKeywordsDownloads.map((kw, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-2 border rounded">
                                      <span className="font-medium">{kw.term}</span>
                                      <div className="flex items-center gap-2">
                                        <Badge variant={kw.tracked ? "default" : "secondary"}>
                                          {kw.tracked ? "Tracked" : "Untracked"}
                                        </Badge>
                                        <Button variant="ghost" size="sm">
                                          <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button variant="outline" size="sm" onClick={exportCSV}>
                            <Download className="h-4 w-4 mr-2" />
                            Download CSV
                          </Button>
                        </div>
                      </div>

                      {/* (C) TABLE SECTION */}
                      <div>
                        <div className="rounded-md border overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Search Term</TableHead>
                                <TableHead className="text-right cursor-pointer" onClick={() => handleSort("traffic")}>
                                  <div className="flex items-center justify-end gap-1">
                                    Traffic
                                    <ArrowUpDown className="h-3 w-3" />
                                  </div>
                                </TableHead>
                                <TableHead
                                  className="text-right cursor-pointer"
                                  onClick={() => handleSort("phoneRank")}
                                >
                                  <div className="flex items-center justify-end gap-1">
                                    Phone Rank
                                    <ArrowUpDown className="h-3 w-3" />
                                  </div>
                                </TableHead>
                                <TableHead className="text-right">Density</TableHead>
                                <TableHead
                                  className="text-right cursor-pointer"
                                  onClick={() => handleSort("downloads")}
                                >
                                  <div className="flex items-center justify-end gap-1">
                                    Downloads
                                    <ArrowUpDown className="h-3 w-3" />
                                  </div>
                                </TableHead>
                                <TableHead className="text-right">Percent</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredDownloadKeywords.length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={6} className="text-center py-12">
                                    <p className="text-muted-foreground">No rows for the current filters.</p>
                                  </TableCell>
                                </TableRow>
                              ) : (
                                filteredDownloadKeywords.map((keyword, index) => (
                                  <TableRow
                                    key={index}
                                    className={keyword.term === "Total" ? "bg-gray-50 dark:bg-gray-900 font-bold" : ""}
                                  >
                                    <TableCell className="font-medium">{keyword.term}</TableCell>
                                    <TableCell className="text-right">
                                      {keyword.traffic ? keyword.traffic.toFixed(1) : "—"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      {keyword.phoneRank ? (
                                        <div className="flex items-center justify-end gap-2">
                                          <Badge variant="outline" className="font-bold">
                                            #{keyword.phoneRank}
                                          </Badge>
                                          {keyword.change !== undefined && keyword.change !== 0 && (
                                            <span
                                              className={`text-xs ${keyword.change > 0 ? "text-emerald-600" : "text-rose-600"}`}
                                            >
                                              {keyword.change > 0 ? (
                                                <TrendingUp className="h-3 w-3 inline" />
                                              ) : (
                                                <TrendingDown className="h-3 w-3 inline" />
                                              )}
                                            </span>
                                          )}
                                        </div>
                                      ) : (
                                        "—"
                                      )}
                                    </TableCell>
                                    <TableCell className="text-right">{keyword.density || "—"}</TableCell>
                                    <TableCell className="text-right">
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <span className="cursor-help font-semibold">
                                              {formatNumberCompact(keyword.downloads)}
                                            </span>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>{formatNumberFull(keyword.downloads)} downloads</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <div className="flex items-center gap-2">
                                        <Progress value={keyword.percent} className="flex-1 h-2 min-w-[60px]" />
                                        <span className="text-sm font-medium w-12">{keyword.percent.toFixed(1)}%</span>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))
                              )}
                            </TableBody>
                          </Table>
                        </div>

                        {filteredDownloadKeywords.length > 1 && (
                          <div className="mt-3 text-xs text-muted-foreground text-center">
                            Showing {filteredDownloadKeywords.length - 1} keywords + Total row • Sorted by {sortColumn}{" "}
                            ({sortDirection})
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
