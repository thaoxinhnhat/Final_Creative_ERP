"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Star,
  DollarSign,
  Users,
  Clock,
  Activity,
  Globe,
  Download,
  AlertCircle,
  Info,
  TrendingUp,
  Package,
  ImageIcon,
  ShoppingCart,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageHeader } from "./components/page-header"
import { EmptyState } from "./components/empty-state"
import { LoadingSkeleton } from "./components/loading-skeleton"
import { mockApps } from "./data/mock-apps"
import {
  getAppMarketMetrics,
  formatNumber,
  formatRevenue,
  formatNumberCompact,
  formatRevenueCompact,
  getRegionLabel,
  type AppMarketMetrics,
} from "./data/mock-app-market"
import { KeywordFiltersBar, type KeywordFilters } from "./components/keyword-filters"
import { KeywordSubTabs } from "./components/keyword-sub-tabs"

const dateRangeOptions = [
  { label: "Today", value: "day" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "This Quarter", value: "quarter" },
  { label: "Last 30 Days", value: "last30" },
  { label: "Last 90 Days", value: "last90" },
  { label: "Last Year", value: "lastYear" },
  { label: "All Time", value: "allTime" },
  { label: "Custom Range", value: "custom" },
]

// Mock IAP data
const mockIAPs = [
  { title: "100 Gems", duration: "One-time", price: 0.99 },
  { title: "500 Gems", duration: "One-time", price: 4.99 },
  { title: "1000 Gems", duration: "One-time", price: 9.99 },
  { title: "Premium Monthly", duration: "Monthly", price: 4.99 },
  { title: "Premium Yearly", duration: "Yearly", price: 39.99 },
  { title: "Remove Ads", duration: "One-time", price: 2.99 },
]

// Mock screenshots
const mockScreenshots = [
  { type: "image", url: "/placeholder.svg?height=600&width=338&text=Screenshot+1" },
  { type: "image", url: "/placeholder.svg?height=600&width=338&text=Screenshot+2" },
  {
    type: "video",
    url: "/placeholder.svg?height=600&width=338&text=Video+Preview",
    thumbnail: "/placeholder.svg?height=600&width=338&text=Video",
  },
  { type: "image", url: "/placeholder.svg?height=600&width=338&text=Screenshot+3" },
  { type: "image", url: "/placeholder.svg?height=600&width=338&text=Screenshot+4" },
  { type: "image", url: "/placeholder.svg?height=600&width=338&text=Screenshot+5" },
  { type: "image", url: "/placeholder.svg?height=600&width=338&text=Screenshot+6" },
]

// Mock keyword data
const mockKeywordRankingData = [
  { date: "07/10", main: 24, comp1: 8, comp2: 15 },
  { date: "07/20", main: 21, comp1: 7, comp2: 14 },
  { date: "08/01", main: 22, comp1: 7, comp2: 13 },
  { date: "08/10", main: 14, comp1: 6, comp2: 12 },
  { date: "08/11", main: 10, comp1: 6, comp2: 11 },
  { date: "08/12", main: 10, comp1: 6, comp2: 11 },
]

const mockKeywordOverviewData = [
  { date: "2025-07-10", "1-2": 2, "3-5": 6, "6-10": 8, "11-20": 15, "21+": 5 },
  { date: "2025-07-20", "1-2": 2, "3-5": 5, "6-10": 9, "11-20": 16, "21+": 6 },
  { date: "2025-08-01", "1-2": 3, "3-5": 6, "6-10": 10, "11-20": 14, "21+": 7 },
  { date: "2025-08-15", "1-2": 3, "3-5": 7, "6-10": 11, "11-20": 13, "21+": 7 },
  { date: "2025-09-01", "1-2": 4, "3-5": 8, "6-10": 11, "11-20": 12, "21+": 8 },
]

const mockKeywordDownloadsData = [
  { date: "2025-07-05", "fashion show": 120, fashion: 5, barby: 3, dress: 8, Other: 10 },
  { date: "2025-07-12", "fashion show": 460, fashion: 12, barby: 8, dress: 12, Other: 15 },
  { date: "2025-08-09", "fashion show": 450, fashion: 22, barby: 15, dress: 14, Other: 12 },
  { date: "2025-09-06", "fashion show": 280, fashion: 28, barby: 20, dress: 13, Other: 10 },
  { date: "2025-09-20", "fashion show": 180, fashion: 32, barby: 24, dress: 15, Other: 9 },
]

export default function ASOOverviewPage() {
  // Single source of truth for selected app
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null)
  const selectedApp = useMemo(() => {
    return selectedAppId ? mockApps.find((app) => app.id === selectedAppId) || null : null
  }, [selectedAppId])

  const [isLoading, setIsLoading] = useState(false)
  const [dateRangeType, setDateRangeType] = useState("last30")
  const [customStartDate, setCustomStartDate] = useState("10/02/2025")
  const [customEndDate, setCustomEndDate] = useState("20/02/2025")
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [region, setRegion] = useState("global")
  const [os, setOs] = useState<"android" | "ios">("android")
  const [descriptionExpanded, setDescriptionExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState<"information" | "keyword">("information")
  const [descriptionViewMore, setDescriptionViewMore] = useState(false)
  const [mediaTab, setMediaTab] = useState<"screenshots" | "feature">("screenshots")
  const [currentScreenshot, setCurrentScreenshot] = useState(0)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [iapSortColumn, setIapSortColumn] = useState<"title" | "price">("price")
  const [iapSortDirection, setIapSortDirection] = useState<"asc" | "desc">("asc")

  // Keyword tab unified filters
  const [keywordFilters, setKeywordFilters] = useState<KeywordFilters>(() => {
    const now = new Date()
    const start = new Date(now)
    start.setDate(now.getDate() - 30)
    return {
      dateFrom: start.toISOString().slice(0, 10),
      dateTo: now.toISOString().slice(0, 10),
      country: "us",
      device: "iPhone",
      minTraffic: 0,
      keywords: [],
      granularity: "auto",
    }
  })

  // Get market-specific metrics
  const marketMetrics = useMemo<AppMarketMetrics | null>(() => {
    if (!selectedAppId) return null
    return getAppMarketMetrics(selectedAppId, os, region)
  }, [selectedAppId, os, region])

  const hasNoData = selectedAppId && !marketMetrics

  // Sort IAPs
  const sortedIAPs = useMemo(() => {
    const sorted = [...mockIAPs]
    sorted.sort((a, b) => {
      if (iapSortColumn === "price") {
        return iapSortDirection === "asc" ? a.price - b.price : b.price - a.price
      }
      return iapSortDirection === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
    })
    return sorted
  }, [iapSortColumn, iapSortDirection])

  // Sync with URL on mount and URL changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const appId = params.get("appId")

    if (appId) {
      setIsLoading(true)
      setSelectedAppId(appId)

      setTimeout(() => {
        setIsLoading(false)
      }, 400)
    } else {
      setSelectedAppId(null)
      setIsLoading(false)
    }
  }, [])

  // Handle app selection from header - reset to Information tab
  const handleSelectApp = (appId: string) => {
    setIsLoading(true)
    setSelectedAppId(appId)
    setActiveTab("information")

    setTimeout(() => {
      setIsLoading(false)
    }, 400)
  }

  // Handle filter changes
  useEffect(() => {
    if (selectedAppId) {
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
      }, 400)
    }
  }, [dateRangeType, region, os, selectedAppId])

  const getOSIcon = (osValue: string) => {
    return osValue === "android" ? "🤖" : "🍎"
  }

  const getDateRangeLabel = () => {
    const option = dateRangeOptions.find((opt) => opt.value === dateRangeType)
    if (dateRangeType === "custom") {
      return `${customStartDate} → ${customEndDate}`
    }
    return option?.label || "Select Range"
  }

  const handleApplyDateRange = () => {
    setDatePickerOpen(false)
    if (selectedAppId) {
      setIsLoading(true)
      setTimeout(() => setIsLoading(false), 400)
    }
  }

  const handleCancelDateRange = () => {
    setDatePickerOpen(false)
  }

  const getDataScopeTooltip = () => {
    return `Data scope: ${getOSIcon(os)} ${os === "android" ? "Android" : "iOS"} — ${getRegionLabel(region)} — ${getDateRangeLabel()}`
  }

  const onKeywordFiltersChange = (patch: Partial<KeywordFilters>) => {
    setKeywordFilters((prev) => ({ ...prev, ...patch }))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header with search */}
      <PageHeader onSelectApp={handleSelectApp} />

      {/* Loading State */}
      {isLoading && <LoadingSkeleton />}

      {/* Empty State - Show when no app selected and not loading */}
      {!selectedApp && !isLoading && (
        <EmptyState
          onBrowseRecent={() => {
            document.querySelector<HTMLInputElement>('input[placeholder*="Search"]')?.focus()
          }}
        />
      )}

      {/* Main Content - Only show when app is selected and not loading */}
      {selectedApp && !isLoading && (
        <div className="pb-6 space-y-6">
          {/* No Data Alert */}
          {hasNoData && (
            <div className="px-6 pt-6">
              <Alert
                variant="default"
                className="bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800"
              >
                <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                  No data available for {getOSIcon(os)} {os === "android" ? "Android" : "iOS"} in{" "}
                  {getRegionLabel(region)}. Showing placeholders. Try selecting a different region or platform.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* App Info & Filters Card */}
          <div className="px-6 pt-6">
            <Card>
              <CardContent className="p-6 space-y-6">
                {/* App Info Section */}
                <div className="flex items-start gap-6">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                      {selectedApp.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-bold text-xl text-gray-900 dark:text-gray-100">{selectedApp.name}</h2>
                      <p className="text-sm text-muted-foreground mb-2">{selectedApp.bundleId}</p>
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        {marketMetrics?.category && (
                          <>
                            {marketMetrics.category.split("•").map((cat, idx) => (
                              <Badge key={idx} variant="secondary">
                                {cat.trim()}
                              </Badge>
                            ))}
                          </>
                        )}
                        {marketMetrics?.rating && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-1 cursor-help">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm font-semibold">{marketMetrics.rating.toFixed(1)}</span>
                                  {marketMetrics.ratingCount && (
                                    <span className="text-xs text-muted-foreground">
                                      ({formatNumber(marketMetrics.ratingCount)})
                                    </span>
                                  )}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">{getDataScopeTooltip()}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        {region === "global" && <Badge variant="outline">Global</Badge>}
                      </div>

                      <div className="mb-3">
                        <p className="text-sm text-muted-foreground">
                          Comprehensive analytics and insights for {selectedApp.name}. Track performance, keywords, and
                          market position across {getRegionLabel(region)}.
                        </p>
                      </div>

                      <div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDescriptionExpanded(!descriptionExpanded)}
                          className="h-8 px-2 -ml-2"
                        >
                          {descriptionExpanded ? (
                            <>
                              <ChevronUp className="h-4 w-4 mr-1" />
                              Hide details
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-4 w-4 mr-1" />
                              Show more details
                            </>
                          )}
                        </Button>
                        {descriptionExpanded && (
                          <div className="mt-2 p-4 bg-muted/50 rounded-lg space-y-4">
                            {/* Intro */}
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              Welcome to {selectedApp.name} — {getOSIcon(os)} {os === "android" ? "Android" : "iOS"} •{" "}
                              {getRegionLabel(region)}.
                              {marketMetrics && (
                                <>
                                  {" "}
                                  This app achieved a {marketMetrics.rating?.toFixed(1) || "N/A"} rating
                                  {marketMetrics.downloads30d &&
                                    ` with ${formatNumber(marketMetrics.downloads30d)} downloads`}
                                  {marketMetrics.revenue30d &&
                                    ` and generated ${formatRevenue(marketMetrics.revenue30d)}`}{" "}
                                  in the last 30 days.
                                </>
                              )}
                            </p>

                            {/* Key Metrics */}
                            <div>
                              <h4 className="font-semibold text-sm mb-2">Key Metrics:</h4>
                              <ul className="space-y-1 text-sm text-muted-foreground">
                                <li>
                                  • Platform: {getOSIcon(os)} {os === "android" ? "Android" : "iOS"}
                                </li>
                                {marketMetrics?.category && <li>• Category: {marketMetrics.category}</li>}
                                {marketMetrics?.downloads30d && (
                                  <li>• Monthly Downloads: {formatNumber(marketMetrics.downloads30d)}</li>
                                )}
                                {marketMetrics?.revenue30d && (
                                  <li>• Monthly Revenue: {formatRevenue(marketMetrics.revenue30d)}</li>
                                )}
                                {marketMetrics?.dau30d && <li>• Avg DAU: {formatNumber(marketMetrics.dau30d)}</li>}
                                {marketMetrics?.timeSpentMonthly && (
                                  <li>• Time Spent (last month): {marketMetrics.timeSpentMonthly} mins/day</li>
                                )}
                                {marketMetrics?.sessionsMonthly && (
                                  <li>• Sessions (last month): {formatNumber(marketMetrics.sessionsMonthly)}</li>
                                )}
                              </ul>
                            </div>

                            {/* Monetization */}
                            {marketMetrics?.monetization && marketMetrics.monetization.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-sm mb-2">Monetization:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {marketMetrics.monetization.map((mon, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">
                                      {mon}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Market Notes */}
                            {marketMetrics?.notes && marketMetrics.notes.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-sm mb-2">Market Notes:</h4>
                                <div className="space-y-1">
                                  {marketMetrics.notes.map((note, idx) => (
                                    <div
                                      key={idx}
                                      className="text-xs bg-blue-50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100 px-2 py-1 rounded"
                                    >
                                      • {note}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Top Countries for Global */}
                            {region === "global" &&
                              marketMetrics?.topCountries &&
                              marketMetrics.topCountries.length > 0 && (
                                <div>
                                  <h4 className="font-semibold text-sm mb-2">Top Countries:</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {marketMetrics.topCountries.map((country, idx) => (
                                      <Badge key={idx} variant="outline" className="text-xs">
                                        {country}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Market Metrics Box */}
                  <TooltipProvider>
                    <div className="bg-muted/50 p-4 rounded-lg space-y-2 min-w-[200px]">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Platform</span>
                        <span className="font-semibold">
                          {getOSIcon(os)} {os === "android" ? "Android" : "iOS"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Developer</span>
                        <span className="font-semibold text-right text-xs">{selectedApp.developer}</span>
                      </div>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex justify-between text-sm cursor-help">
                            <span className="text-muted-foreground flex items-center gap-1">
                              Downloads <Info className="h-3 w-3" />
                            </span>
                            <span className="font-semibold">{formatNumber(marketMetrics?.downloads30d)}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">{getDataScopeTooltip()}</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex justify-between text-sm cursor-help">
                            <span className="text-muted-foreground flex items-center gap-1">
                              Revenue <Info className="h-3 w-3" />
                            </span>
                            <span className="font-semibold">{formatRevenue(marketMetrics?.revenue30d)}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">{getDataScopeTooltip()}</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex justify-between text-sm cursor-help">
                            <span className="text-muted-foreground flex items-center gap-1">
                              Rating <Info className="h-3 w-3" />
                            </span>
                            <span className="font-semibold">
                              {marketMetrics?.rating ? `${marketMetrics.rating.toFixed(1)} ⭐` : "N/A"}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">{getDataScopeTooltip()}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                </div>

                <div className="border-t" />

                {/* Filter Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4 flex-wrap">
                    <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-64 justify-start bg-transparent">
                          <Calendar className="h-4 w-4 mr-2" />
                          {getDateRangeLabel()}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-4" align="start">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-sm mb-3">Select Date Range</h4>
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
                                        <label className="text-xs text-muted-foreground mb-1 block">
                                          Start Date (DD/MM/YYYY)
                                        </label>
                                        <Input
                                          type="text"
                                          placeholder="DD/MM/YYYY"
                                          value={customStartDate}
                                          onChange={(e) => setCustomStartDate(e.target.value)}
                                          className="h-8"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-xs text-muted-foreground mb-1 block">
                                          End Date (DD/MM/YYYY)
                                        </label>
                                        <Input
                                          type="text"
                                          placeholder="DD/MM/YYYY"
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
                              Apply
                            </Button>
                            <Button
                              onClick={handleCancelDateRange}
                              variant="outline"
                              className="flex-1 bg-transparent"
                              size="sm"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Region:</span>
                      <Select value={region} onValueChange={setRegion}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="global">🌍 Global</SelectItem>
                          <SelectItem value="us">🇺🇸 United States</SelectItem>
                          <SelectItem value="vn">🇻🇳 Vietnam</SelectItem>
                          <SelectItem value="jp">🇯🇵 Japan</SelectItem>
                          <SelectItem value="kr">🇰🇷 South Korea</SelectItem>
                          <SelectItem value="uk">🇬🇧 United Kingdom</SelectItem>
                          <SelectItem value="de">🇩🇪 Germany</SelectItem>
                          <SelectItem value="fr">🇫🇷 France</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">OS:</span>
                      <Select value={os} onValueChange={(v) => setOs(v as "android" | "ios")}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="android">🤖 Android</SelectItem>
                          <SelectItem value="ios">🍎 iOS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      className="ml-auto"
                      onClick={() => {
                        setIsLoading(true)
                        setTimeout(() => setIsLoading(false), 400)
                      }}
                    >
                      Apply Filters
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
                    <span className="font-medium">Active Filters:</span>
                    <Badge variant="secondary">
                      {getOSIcon(os)} {os === "android" ? "Android" : "iOS"}
                    </Badge>
                    <span className="text-muted-foreground">•</span>
                    <Badge variant="secondary">{getDateRangeLabel()}</Badge>
                    <span className="text-muted-foreground">•</span>
                    <Badge variant="secondary">{getRegionLabel(region)}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as "information" | "keyword")}
            className="w-full"
          >
            <div className="px-6">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="information">Information</TabsTrigger>
                <TabsTrigger value="keyword">Keyword</TabsTrigger>
              </TabsList>
            </div>

            {/* Information Tab */}
            <TabsContent value="information" className="space-y-6 mt-6">
              {/* Summary Metrics */}
              <div className="px-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Summary Metrics (Last 30 Days)</CardTitle>
                    <CardDescription>
                      Key performance indicators for {getOSIcon(os)} {os === "android" ? "Android" : "iOS"} in{" "}
                      {getRegionLabel(region)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-xl border border-blue-200 dark:border-blue-800 cursor-help">
                              <div className="flex items-center gap-2 mb-2">
                                <Download className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Downloads</span>
                              </div>
                              <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                                {formatNumberCompact(marketMetrics?.downloads30d)}
                              </p>
                              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">Last 30 days</p>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">{getDataScopeTooltip()}</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-xl border border-green-200 dark:border-green-800 cursor-help">
                              <div className="flex items-center gap-2 mb-2">
                                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                                <span className="text-sm font-medium text-green-900 dark:text-green-100">Revenue</span>
                              </div>
                              <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                                {formatRevenueCompact(marketMetrics?.revenue30d)}
                              </p>
                              <p className="text-xs text-green-700 dark:text-green-300 mt-1">Last 30 days</p>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">{getDataScopeTooltip()}</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-xl border border-purple-200 dark:border-purple-800 cursor-help">
                              <div className="flex items-center gap-2 mb-2">
                                <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
                                  Avg DAU
                                </span>
                              </div>
                              <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                                {formatNumberCompact(marketMetrics?.dau30d)}
                              </p>
                              <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">Daily active users</p>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">{getDataScopeTooltip()}</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 rounded-xl border border-orange-200 dark:border-orange-800 cursor-help">
                              <div className="flex items-center gap-2 mb-2">
                                <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                <span className="text-sm font-medium text-orange-900 dark:text-orange-100">
                                  Time Spent
                                </span>
                              </div>
                              <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">
                                {marketMetrics?.timeSpentMonthly ? `${marketMetrics.timeSpentMonthly}m` : "N/A"}
                              </p>
                              <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">Avg minutes per day</p>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">{getDataScopeTooltip()}</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900 rounded-xl border border-pink-200 dark:border-pink-800 cursor-help">
                              <div className="flex items-center gap-2 mb-2">
                                <Activity className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                                <span className="text-sm font-medium text-pink-900 dark:text-pink-100">Sessions</span>
                              </div>
                              <p className="text-3xl font-bold text-pink-900 dark:text-pink-100">
                                {formatNumberCompact(marketMetrics?.sessionsMonthly)}
                              </p>
                              <p className="text-xs text-pink-700 dark:text-pink-300 mt-1">Last month</p>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">{getDataScopeTooltip()}</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 cursor-help">
                              <div className="flex items-center gap-2 mb-2">
                                <Globe className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  Website Visits
                                </span>
                              </div>
                              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                {marketMetrics?.websiteVisitsMonthly !== null &&
                                marketMetrics?.websiteVisitsMonthly !== undefined
                                  ? formatNumberCompact(marketMetrics.websiteVisitsMonthly)
                                  : "N/A"}
                              </p>
                              <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">
                                {marketMetrics?.websiteVisitsMonthly === null ? "Not tracked" : "Last 30 days"}
                              </p>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">{getDataScopeTooltip()}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* App Details */}
              <div className="px-6 space-y-6">
                <h3 className="text-xl font-bold">App Details</h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* LEFT COLUMN */}
                  <div className="space-y-6">
                    {/* Game IQ Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Package className="h-5 w-5" />
                          Game IQ
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Class</span>
                          <span className="font-semibold">Casual Game</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Genre</span>
                          <span className="font-semibold">Puzzle</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Sub-Genre</span>
                          <span className="font-semibold">Match-3</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Product Model</span>
                          <span className="font-semibold">Free to Play</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Setting</span>
                          <span className="font-semibold">Modern/Fashion</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Theme</span>
                          <span className="font-semibold">Fashion & Style</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Art Style</span>
                          <span className="font-semibold">2D Cartoon</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Camera POV</span>
                          <span className="font-semibold">Top-Down</span>
                        </div>
                        <div className="space-y-2">
                          <span className="text-sm text-muted-foreground">Monetization</span>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary">Free to Play</Badge>
                            <Badge variant="secondary">Ads</Badge>
                            <Badge variant="secondary">IAP</Badge>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <span className="text-sm text-muted-foreground">Game Tags</span>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="text-xs">
                              Single Player
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Offline
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Casual
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Fashion
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Release Details Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5" />
                          Release Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Release Status</span>
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Live</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Current Version</span>
                          <span className="font-semibold">2.5.3</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Last Updated</span>
                          <span className="font-semibold">Dec 15, 2024</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Publisher Country</span>
                          <span className="font-semibold">🇺🇸 United States</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Country Release Date</span>
                          <span className="font-semibold">Jan 10, 2023</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Worldwide Release Date</span>
                          <span className="font-semibold">Mar 15, 2023</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Minimum OS Version</span>
                          <span className="font-semibold">{os === "android" ? "Android 5.0+" : "iOS 12.0+"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">File Size</span>
                          <span className="font-semibold">124 MB</span>
                        </div>
                        <div className="pt-3 border-t">
                          <Button variant="outline" className="w-full bg-transparent" size="sm">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Update Timeline
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* In-App Purchases Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <ShoppingCart className="h-5 w-5" />
                          In-App Purchases
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead
                                  className="cursor-pointer"
                                  onClick={() => {
                                    if (iapSortColumn === "title") {
                                      setIapSortDirection(iapSortDirection === "asc" ? "desc" : "asc")
                                    } else {
                                      setIapSortColumn("title")
                                      setIapSortDirection("asc")
                                    }
                                  }}
                                >
                                  Title
                                </TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead
                                  className="text-right cursor-pointer"
                                  onClick={() => {
                                    if (iapSortColumn === "price") {
                                      setIapSortDirection(iapSortDirection === "asc" ? "desc" : "asc")
                                    } else {
                                      setIapSortColumn("price")
                                      setIapSortDirection("asc")
                                    }
                                  }}
                                >
                                  Price
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {sortedIAPs.map((iap, idx) => (
                                <TableRow key={idx}>
                                  <TableCell className="font-medium">{iap.title}</TableCell>
                                  <TableCell>
                                    <Badge variant="secondary" className="text-xs">
                                      {iap.duration}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-right font-semibold">${iap.price.toFixed(2)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* RIGHT COLUMN */}
                  <div className="space-y-6">
                    {/* Description Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Description</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-sm font-semibold text-muted-foreground mb-1">Short Description</p>
                          <p className="text-sm">Style your way to the top in this addictive fashion puzzle game!</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-muted-foreground mb-1">Full Description</p>
                          <p className="text-sm leading-relaxed">
                            Welcome to {selectedApp.name}! Create stunning outfits, match colors and patterns, and
                            become the ultimate fashion icon. With hundreds of levels, unique challenges, and endless
                            styling possibilities, you'll never run out of ways to express your creativity.
                            {descriptionViewMore && (
                              <>
                                {" "}
                                Mix and match from thousands of clothing items, accessories, and hairstyles. Compete
                                with players worldwide in special fashion events. Unlock exclusive designer collections
                                and build your dream wardrobe. Whether you're into casual chic or haute couture, there's
                                something for everyone!
                              </>
                            )}
                          </p>
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 mt-2"
                            onClick={() => setDescriptionViewMore(!descriptionViewMore)}
                          >
                            {descriptionViewMore ? "View Less" : "View More"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Screenshots & Media Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <ImageIcon className="h-5 w-5" />
                          Screenshots & Media
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Tabs value={mediaTab} onValueChange={(v) => setMediaTab(v as any)}>
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
                            <TabsTrigger value="feature">Feature Graphic</TabsTrigger>
                          </TabsList>

                          <TabsContent value="screenshots" className="mt-4">
                            <div className="space-y-4">
                              <div className="relative">
                                <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                  <div className="flex gap-3 min-w-max">
                                    {mockScreenshots.map((screenshot, idx) => (
                                      <div
                                        key={idx}
                                        className="relative flex-shrink-0 w-[200px] h-[355px] rounded-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer hover:border-blue-500 transition-colors group"
                                        onClick={() => {
                                          setCurrentScreenshot(idx)
                                          setPreviewOpen(true)
                                        }}
                                      >
                                        <img
                                          src={screenshot.type === "video" ? screenshot.thumbnail : screenshot.url}
                                          alt={`${screenshot.type === "video" ? "Video" : "Screenshot"} ${idx + 1}`}
                                          className="w-full h-full object-cover"
                                        />
                                        {screenshot.type === "video" && (
                                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                                            <PlayCircle className="h-12 w-12 text-white drop-shadow-lg" />
                                          </div>
                                        )}
                                        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                          {idx + 1}/{mockScreenshots.length}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <p className="text-xs text-muted-foreground text-center">
                                Scroll horizontally to view all {mockScreenshots.length} media items • Click to preview
                              </p>
                            </div>
                          </TabsContent>

                          <TabsContent value="feature" className="mt-4">
                            <div className="relative rounded-lg border overflow-hidden">
                              <img
                                src="/placeholder.svg?height=300&width=600&text=Feature+Graphic"
                                alt="Feature Graphic"
                                className="w-full"
                              />
                            </div>
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Keyword Tab - NEW STRUCTURE WITH SUB-TABS */}
            <TabsContent value="keyword" className="mt-0">
              {/* Global Filter Bar - Single source of truth */}
              <KeywordFiltersBar filters={keywordFilters} onFiltersChange={onKeywordFiltersChange} />

              {/* Sub-tabs for the three keyword sections */}
              <KeywordSubTabs
                filters={keywordFilters}
                data={{
                  ranking: mockKeywordRankingData,
                  overview: mockKeywordOverviewData,
                  downloads: mockKeywordDownloadsData,
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Screenshot Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {mockScreenshots[currentScreenshot]?.type === "video" ? "Video Preview" : "Screenshot Preview"}
            </DialogTitle>
          </DialogHeader>
          <div className="relative">
            {mockScreenshots[currentScreenshot]?.type === "video" ? (
              <div className="relative w-full aspect-[9/16] bg-black rounded-lg flex items-center justify-center">
                <PlayCircle className="h-16 w-16 text-white" />
                <p className="absolute bottom-4 text-white text-sm">Video playback not implemented</p>
              </div>
            ) : (
              <img
                src={mockScreenshots[currentScreenshot]?.url || "/placeholder.svg"}
                alt={`Screenshot ${currentScreenshot + 1}`}
                className="w-full rounded-lg"
              />
            )}
            {currentScreenshot > 0 && (
              <Button
                variant="outline"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                onClick={() => setCurrentScreenshot(currentScreenshot - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            {currentScreenshot < mockScreenshots.length - 1 && (
              <Button
                variant="outline"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                onClick={() => setCurrentScreenshot(currentScreenshot + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="text-sm text-muted-foreground">
              {currentScreenshot + 1} of {mockScreenshots.length}
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
