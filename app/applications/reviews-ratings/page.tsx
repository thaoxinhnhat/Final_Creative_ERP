"use client"

import { useState, useMemo } from "react"
import {
  ArrowLeft,
  Star,
  Download,
  FileText,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Users,
  Search,
  Mail,
  Globe,
  Smartphone,
  Settings,
  ChevronDown,
  Info,
  Phone,
  Wifi,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { STAR_COLORS, CHART_COLORS, compact, pct, formatFull } from "@/lib/star-colors"
import { BreakdownTable } from "./components/breakdown-table"
import type { BreakdownRow } from "./components/breakdown-table"
import { AverageRatingChart } from "./components/charts/average-rating-chart"
import { RatingContributionChart } from "./components/charts/rating-contribution-chart"
import { SharedTimeFilter } from "./components/shared-time-filter"
import { useSharedTimeFilter } from "./hooks/use-shared-time-filter"
import { useAverageRatingData, useRatingContributionData } from "./hooks/use-rating-data"

// Mock apps data
const mockApps = [
  {
    id: "app_1",
    name: "Fashion Show",
    icon: "👗",
    bundle: "com.fashionshow.app",
    status: "Live",
  },
  {
    id: "app_2",
    name: "Style Master",
    icon: "👔",
    bundle: "com.stylemaster.app",
    status: "Live",
  },
  {
    id: "app_3",
    name: "Dress Up World",
    icon: "👠",
    bundle: "com.dressupworld.app",
    status: "Draft",
  },
]

// Mock data for Rating Contribution Over Time
const ratingContribution = [
  { date: "Week 1", rating1: 45, rating2: 32, rating3: 78, rating4: 156, rating5: 289 },
  { date: "Week 2", rating1: 38, rating2: 28, rating3: 65, rating4: 178, rating5: 312 },
  { date: "Week 3", rating1: 42, rating2: 35, rating3: 82, rating4: 195, rating5: 346 },
  { date: "Week 4", rating1: 35, rating2: 25, rating3: 70, rating4: 210, rating5: 380 },
]

// Mock data for Rating Distribution Over Time (monthly)
const ratingDistMonthly = [
  { month: "Jan", rating1: 45, rating2: 32, rating3: 78, rating4: 156, rating5: 289 },
  { month: "Feb", rating1: 38, rating2: 28, rating3: 65, rating4: 178, rating5: 312 },
  { month: "Mar", rating1: 42, rating2: 35, rating3: 82, rating4: 195, rating5: 346 },
  { month: "Apr", rating1: 35, rating2: 25, rating3: 70, rating4: 210, rating5: 380 },
]

// Mock data for Sentiment Trend
const sentimentData = [
  { date: "Week 1", positive: 75, negative: 15, neutral: 10 },
  { date: "Week 2", positive: 76, negative: 14, neutral: 10 },
  { date: "Week 3", positive: 77, negative: 13, neutral: 10 },
  { date: "Week 4", positive: 78, negative: 12, neutral: 10 },
]

// Mock breakdown data
const countryBreakdown: BreakdownRow[] = [
  { label: "🇺🇸 United States", count: 12500, avg: 4.5 },
  { label: "🇬🇧 United Kingdom", count: 8900, avg: 4.6 },
  { label: "🇨🇦 Canada", count: 5600, avg: 4.4 },
  { label: "🇦🇺 Australia", count: 4200, avg: 4.7 },
  { label: "🇩🇪 Germany", count: 6700, avg: 4.3 },
  { label: "🇫🇷 France", count: 3200, avg: 4.5 },
  { label: "🇪🇸 Spain", count: 2800, avg: 4.6 },
  { label: "🇮🇹 Italy", count: 2400, avg: 4.4 },
]

const languageBreakdown: BreakdownRow[] = [
  { label: "English", count: 25000, avg: 4.5 },
  { label: "Spanish", count: 5000, avg: 4.4 },
  { label: "French", count: 3500, avg: 4.6 },
  { label: "German", count: 3000, avg: 4.3 },
  { label: "Italian", count: 2500, avg: 4.4 },
  { label: "Portuguese", count: 2000, avg: 4.5 },
]

const versionBreakdown: BreakdownRow[] = [
  { label: "v3.2.1", count: 8900, avg: 4.7 },
  { label: "v3.2.0", count: 6500, avg: 4.5 },
  { label: "v3.1.9", count: 5200, avg: 4.4 },
  { label: "v3.1.8", count: 3800, avg: 4.3 },
  { label: "v3.1.7", count: 2100, avg: 4.2 },
]

const osBreakdown: BreakdownRow[] = [
  { label: "Android 14", count: 7800, avg: 4.3 },
  { label: "Android 13", count: 5600, avg: 4.6 },
  { label: "Android 12", count: 4200, avg: 4.5 },
  { label: "iOS 17", count: 8900, avg: 4.7 },
  { label: "iOS 16", count: 5200, avg: 4.4 },
  { label: "iOS 15", count: 2800, avg: 4.3 },
]

const formFactorBreakdown: BreakdownRow[] = [
  { label: "Phone", count: 30000, avg: 4.5 },
  { label: "Tablet", count: 8500, avg: 4.6 },
  { label: "Foldable", count: 1200, avg: 4.4 },
]

const deviceBreakdown: BreakdownRow[] = [
  { label: "iPhone 15 Pro", count: 5600, avg: 4.8 },
  { label: "Samsung Galaxy S24", count: 3800, avg: 4.4 },
  { label: "Google Pixel 8", count: 2900, avg: 4.5 },
  { label: "iPhone 14", count: 4200, avg: 4.6 },
  { label: "OnePlus 12", count: 2100, avg: 4.3 },
  { label: "Xiaomi 14", count: 1800, avg: 4.4 },
]

const carrierBreakdown: BreakdownRow[] = [
  { label: "Verizon", count: 8900, avg: 4.5 },
  { label: "AT&T", count: 7600, avg: 4.4 },
  { label: "T-Mobile", count: 6500, avg: 4.6 },
  { label: "Sprint", count: 3200, avg: 4.3 },
  { label: "Other", count: 12300, avg: 4.5 },
]

// Custom tooltip for Rating Contribution
const RatingContributionTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null

  const total = payload.reduce((sum: number, item: any) => sum + item.value, 0)

  return (
    <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
      <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{label}</p>
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
        Total: {compact(total)} ({formatFull(total)})
      </p>
      <div className="space-y-1">
        {payload
          .slice()
          .reverse()
          .map((item: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
                <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 dark:text-gray-100">{compact(item.value)}</span>
                <span className="text-gray-500 dark:text-gray-400">({pct(item.value, total)})</span>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default function ReviewsRatingsPage() {
  const router = useRouter()

  // Filter states
  const [selectedApp, setSelectedApp] = useState<string | null>(null)
  const [selectedOS, setSelectedOS] = useState<string[]>(["android"])
  const [timeRange, setTimeRange] = useState("30d")
  const [selectedRegions, setSelectedRegions] = useState<string[]>(["GLOBAL"])
  const [appSearchOpen, setAppSearchOpen] = useState(false)

  // Shared time filter for both charts
  const { timeFilter, setTimeFilter } = useSharedTimeFilter()
  const [showPeerComparison, setShowPeerComparison] = useState(true)

  // Prepare query for both charts
  const chartQuery = useMemo(() => {
    if (!selectedApp) return null
    return {
      appId: selectedApp,
      os: selectedOS[0] || "android",
      country: selectedRegions[0] || "GLOBAL",
      startDate: timeFilter.from.toISOString().split("T")[0],
      endDate: timeFilter.to.toISOString().split("T")[0],
      granularity: timeFilter.granularity,
    }
  }, [selectedApp, selectedOS, selectedRegions, timeFilter])

  // Fetch data for both charts
  const averageRatingData = useAverageRatingData(chartQuery)
  const contributionData = useRatingContributionData(chartQuery)

  const selectedAppData = mockApps.find((app) => app.id === selectedApp)

  // Mock KPI data
  const kpiData = useMemo(() => {
    if (!selectedApp) return null
    return {
      avgRating: 4.6,
      previousAvgRating: 4.4,
      totalRatings: 38500,
      withReviews: 9700,
      responseRate: 85,
      trendDelta: 0.2,
    }
  }, [selectedApp])

  const handleOSToggle = (os: string) => {
    setSelectedOS((prev) => {
      if (prev.includes(os)) {
        if (prev.length > 1) {
          return prev.filter((o) => o !== os)
        }
        return prev
      }
      return [...prev, os]
    })
  }

  const handleExportCSV = (chartName: string) => {
    console.log(`Exporting ${chartName} data...`)
    // CSV export logic here
  }

  const handleResetFilters = () => {
    setSelectedApp(null)
    setSelectedOS(["android"])
    setTimeRange("30d")
    setSelectedRegions(["GLOBAL"])
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b sticky top-0 z-50">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push("/applications")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Reviews & Ratings</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Comprehensive analysis and management</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-2" />
                Auto Report
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
            </div>
          </div>

          {/* Fixed Filter Bar */}
          <div className="grid grid-cols-4 gap-3">
            {/* App Selector */}
            <div>
              <Label className="text-xs mb-1.5 block font-medium">
                App <span className="text-red-500">*</span>
              </Label>
              <Popover open={appSearchOpen} onOpenChange={setAppSearchOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={appSearchOpen}
                    className="w-full justify-between h-9 bg-transparent"
                  >
                    {selectedAppData ? (
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-lg">{selectedAppData.icon}</span>
                        <span className="truncate">{selectedAppData.name}</span>
                      </div>
                    ) : (
                      <span className="text-gray-500">Select an app...</span>
                    )}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search apps..." />
                    <CommandList>
                      <CommandEmpty>No apps found</CommandEmpty>
                      <CommandGroup>
                        {mockApps.map((app) => (
                          <CommandItem
                            key={app.id}
                            value={app.id}
                            onSelect={() => {
                              setSelectedApp(app.id)
                              setAppSearchOpen(false)
                            }}
                          >
                            <div className="flex items-center gap-3 w-full">
                              <span className="text-2xl">{app.icon}</span>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">{app.name}</div>
                                <div className="text-xs text-gray-500 truncate">{app.bundle}</div>
                              </div>
                              <Badge
                                variant={app.status === "Live" ? "default" : "secondary"}
                                className="shrink-0 text-xs"
                              >
                                {app.status}
                              </Badge>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* OS Filter */}
            <div>
              <Label className="text-xs mb-1.5 block font-medium">OS</Label>
              <div className="flex items-center gap-4 h-9">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="os-android"
                    checked={selectedOS.includes("android")}
                    onCheckedChange={() => handleOSToggle("android")}
                  />
                  <Label htmlFor="os-android" className="text-sm cursor-pointer">
                    Android
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="os-ios"
                    checked={selectedOS.includes("ios")}
                    onCheckedChange={() => handleOSToggle("ios")}
                  />
                  <Label htmlFor="os-ios" className="text-sm cursor-pointer">
                    iOS
                  </Label>
                </div>
              </div>
            </div>

            {/* Time Range */}
            <div>
              <Label className="text-xs mb-1.5 block font-medium">Time Range</Label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="180d">Last 180 days</SelectItem>
                  <SelectItem value="365d">Last 365 days</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Region Filter */}
            <div>
              <Label className="text-xs mb-1.5 block font-medium">Country/Region</Label>
              <Select value={selectedRegions[0]} onValueChange={(v) => setSelectedRegions([v])}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GLOBAL">🌍 Global</SelectItem>
                  <SelectItem value="US">🇺🇸 United States</SelectItem>
                  <SelectItem value="GB">🇬🇧 United Kingdom</SelectItem>
                  <SelectItem value="CA">🇨🇦 Canada</SelectItem>
                  <SelectItem value="AU">🇦🇺 Australia</SelectItem>
                  <SelectItem value="DE">🇩🇪 Germany</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 space-y-6">
        {!selectedApp ? (
          // Empty State - No App Selected
          <Card className="border-2 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-4 mb-4">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Select an app to view Reviews & Ratings
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md mb-4">
                Choose an app from your portfolio. All metrics will update automatically based on your selected filters.
              </p>
              <Button onClick={() => setAppSearchOpen(true)}>
                <Search className="h-4 w-4 mr-2" />
                Select App
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* KPI Strip */}
            {kpiData && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Average Rating</p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{kpiData.avgRating}</p>
                          <div
                            className={`flex items-center gap-1 text-xs font-medium ${kpiData.trendDelta >= 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {kpiData.trendDelta >= 0 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            <span>{Math.abs(kpiData.trendDelta).toFixed(1)}</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">vs previous period</p>
                      </div>
                      <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                        <Star className="h-5 w-5 text-yellow-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Ratings</p>
                        <p
                          className="text-2xl font-bold text-gray-900 dark:text-gray-100"
                          title={formatFull(kpiData.totalRatings)}
                        >
                          {compact(kpiData.totalRatings)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatFull(kpiData.totalRatings)} total
                        </p>
                      </div>
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Ratings with Reviews</p>
                        <p
                          className="text-2xl font-bold text-gray-900 dark:text-gray-100"
                          title={formatFull(kpiData.withReviews)}
                        >
                          {compact(kpiData.withReviews)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {pct(kpiData.withReviews, kpiData.totalRatings)} of total
                        </p>
                      </div>
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                        <MessageSquare className="h-5 w-5 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Response Rate</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{kpiData.responseRate}%</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Developer replies</p>
                      </div>
                      <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                        <MessageSquare className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Row A - Two side-by-side charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart A1: Average Rating Over Time - NOW WITH WORKING CONTROLS */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Average Rating Over Time</CardTitle>
                      <CardDescription>Your average rating trend with peer comparison</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <SharedTimeFilter value={timeFilter} onChange={setTimeFilter} />
                      <Button variant="ghost" size="sm" onClick={() => handleExportCSV("Average Rating Over Time")}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="show-peers"
                        checked={showPeerComparison}
                        onCheckedChange={setShowPeerComparison}
                        className="scale-75"
                      />
                      <Label htmlFor="show-peers" className="text-xs cursor-pointer">
                        Show peer median
                      </Label>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <AverageRatingChart
                    data={averageRatingData.data}
                    loading={averageRatingData.loading}
                    error={averageRatingData.error}
                    showPeers={showPeerComparison}
                  />
                </CardContent>
              </Card>

              {/* Chart A2: Rating Contribution Over Time */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Rating Contribution Over Time</CardTitle>
                      <CardDescription>Number of ratings by star level (synced with period above)</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleExportCSV("Rating Contribution")}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <RatingContributionChart
                    data={contributionData.data}
                    loading={contributionData.loading}
                    error={contributionData.error}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Row B - Rating Distribution Over Time */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Rating Distribution Over Time</CardTitle>
                    <CardDescription>Monthly breakdown of ratings by star level</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleExportCSV("Rating Distribution")}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={ratingDistMonthly}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "6px",
                      }}
                      formatter={(value: any, name: string, props: any) => {
                        const dataPoint = props.payload
                        const total =
                          dataPoint.rating1 +
                          dataPoint.rating2 +
                          dataPoint.rating3 +
                          dataPoint.rating4 +
                          dataPoint.rating5
                        const percentage = pct(Number(value), total)
                        return [`${compact(Number(value))} (${percentage})`, name]
                      }}
                    />
                    <Legend />
                    <Bar dataKey="rating5" stackId="a" fill={STAR_COLORS.five} name="5★" />
                    <Bar dataKey="rating4" stackId="a" fill={STAR_COLORS.four} name="4★" />
                    <Bar dataKey="rating3" stackId="a" fill={STAR_COLORS.three} name="3★" />
                    <Bar dataKey="rating2" stackId="a" fill={STAR_COLORS.two} name="2★" />
                    <Bar dataKey="rating1" stackId="a" fill={STAR_COLORS.one} name="1★" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Row C - Sentiment Trend */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Sentiment Trend
                      <button className="text-gray-400 hover:text-gray-600">
                        <Info className="h-4 w-4" title="Based on text reviews only" />
                      </button>
                    </CardTitle>
                    <CardDescription>Positive, neutral, and negative sentiment percentages</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleExportCSV("Sentiment Trend")}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={sentimentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#6b7280" />
                    <YAxis domain={[0, 100]} stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "6px",
                      }}
                      formatter={(value: any) => [`${value}%`, ""]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="positive"
                      stroke={CHART_COLORS.positive}
                      strokeWidth={2}
                      name="Positive %"
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="neutral"
                      stroke={CHART_COLORS.neutral}
                      strokeWidth={2}
                      name="Neutral %"
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="negative"
                      stroke={CHART_COLORS.negative}
                      strokeWidth={2}
                      name="Negative %"
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Row D - Rating Breakdown - FIXED LAYOUT TO REMOVE BLANK SPACING */}
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Rating Breakdown</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Detailed analysis across multiple dimensions</p>
              </div>

              {/* Using Grid Dense Layout with self-start alignment to prevent blank spaces */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <BreakdownTable
                  title="Country / Region"
                  icon={<Globe className="h-4 w-4" />}
                  rows={countryBreakdown}
                  onExport={() => handleExportCSV("Country Breakdown")}
                />

                <BreakdownTable
                  title="Language"
                  icon={<MessageSquare className="h-4 w-4" />}
                  rows={languageBreakdown}
                  onExport={() => handleExportCSV("Language Breakdown")}
                />

                <BreakdownTable
                  title="App Version"
                  icon={<Settings className="h-4 w-4" />}
                  rows={versionBreakdown}
                  onExport={() => handleExportCSV("App Version Breakdown")}
                />

                <BreakdownTable
                  title="OS Version (Android/iOS)"
                  icon={<Smartphone className="h-4 w-4" />}
                  rows={osBreakdown}
                  onExport={() => handleExportCSV("OS Version Breakdown")}
                />

                <BreakdownTable
                  title="Form Factor"
                  icon={<Phone className="h-4 w-4" />}
                  rows={formFactorBreakdown}
                  onExport={() => handleExportCSV("Form Factor Breakdown")}
                />

                <BreakdownTable
                  title="Device"
                  icon={<Smartphone className="h-4 w-4" />}
                  rows={deviceBreakdown}
                  onExport={() => handleExportCSV("Device Breakdown")}
                />

                <BreakdownTable
                  title="Carrier"
                  icon={<Wifi className="h-4 w-4" />}
                  rows={carrierBreakdown}
                  onExport={() => handleExportCSV("Carrier Breakdown")}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
