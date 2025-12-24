"use client"

import { useState, useMemo } from "react"
import {
  Star,
  Store,
  Globe,
  Smartphone,
  Calendar,
  TrendingUp,
  TrendingDown,
  Filter,
  FileDown,
  Pencil,
  Trash2,
  Plus,
  X,
  Search,
  EyeOff,
  ChevronDown,
  Minus,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Types
type RankPoint = { date: string; rank: number }
type Series = {
  id: string
  name: string
  type: "app" | "keyword"
  points: RankPoint[]
  color?: string
  visible: boolean
}
type KeywordRow = {
  term: string
  traffic: number
  iphoneDifficulty: number
  ipadDifficulty: number
  iphoneApps: number
  ipadApps: number
  iphoneRank: number
  ipadRank: number
  density: string
  downloads: string
  change: number
}

type TopApp = {
  rank: number
  name: string
  rating: number
  price: string
  iconUrl: string
}

interface KeywordRankingProps {
  dateRange: { start: string; end: string }
  country: string
  device: "iPhone" | "iPad" | "Android"
  app: { id: string; name: string; iconUrl: string; developer?: string }
  competitors?: { id: string; name: string; iconUrl?: string }[]
}

const chartColors = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899", "#14b8a6"]

// Mock data
const mockSeries: Series[] = [
  {
    id: "main",
    name: "Fashion Show: Dress Up, Makeup",
    type: "app",
    visible: true,
    color: chartColors[0],
    points: [
      { date: "07/10", rank: 24 },
      { date: "07/20", rank: 21 },
      { date: "08/01", rank: 22 },
      { date: "08/10", rank: 14 },
      { date: "08/11", rank: 10 },
      { date: "08/12", rank: 10 },
    ],
  },
  {
    id: "comp1",
    name: "Covet Fashion",
    type: "app",
    visible: true,
    color: chartColors[1],
    points: [
      { date: "07/10", rank: 8 },
      { date: "07/20", rank: 7 },
      { date: "08/01", rank: 7 },
      { date: "08/10", rank: 6 },
      { date: "08/11", rank: 6 },
      { date: "08/12", rank: 6 },
    ],
  },
  {
    id: "comp2",
    name: "Super Stylist Fashion",
    type: "app",
    visible: true,
    color: chartColors[2],
    points: [
      { date: "07/10", rank: 15 },
      { date: "07/20", rank: 14 },
      { date: "08/01", rank: 13 },
      { date: "08/10", rank: 12 },
      { date: "08/11", rank: 11 },
      { date: "08/12", rank: 11 },
    ],
  },
]

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

const mockKeywords: KeywordRow[] = [
  {
    term: "dress",
    traffic: 3.7,
    iphoneDifficulty: 8.0,
    ipadDifficulty: 8.4,
    iphoneApps: 16338,
    ipadApps: 231,
    iphoneRank: 11,
    ipadRank: 45,
    density: "5.6%",
    downloads: "0 (0%)",
    change: 2,
  },
  {
    term: "stardoll",
    traffic: 2.7,
    iphoneDifficulty: 8.9,
    ipadDifficulty: 8.8,
    iphoneApps: 72,
    ipadApps: 95,
    iphoneRank: 11,
    ipadRank: 12,
    density: "0.0%",
    downloads: "0 (0%)",
    change: 0,
  },
  {
    term: "covet",
    traffic: 3.4,
    iphoneDifficulty: 7.8,
    ipadDifficulty: 8.0,
    iphoneApps: 345,
    ipadApps: 206,
    iphoneRank: 12,
    ipadRank: 11,
    density: "0.0%",
    downloads: "0 (0%)",
    change: -1,
  },
  {
    term: "fashion",
    traffic: 4.2,
    iphoneDifficulty: 9.1,
    ipadDifficulty: 9.0,
    iphoneApps: 23445,
    ipadApps: 1234,
    iphoneRank: 15,
    ipadRank: 18,
    density: "3.2%",
    downloads: "245 (12%)",
    change: 3,
  },
  {
    term: "dress up games",
    traffic: 2.9,
    iphoneDifficulty: 7.5,
    ipadDifficulty: 7.8,
    iphoneApps: 5678,
    ipadApps: 432,
    iphoneRank: 8,
    ipadRank: 9,
    density: "4.1%",
    downloads: "187 (9%)",
    change: 1,
  },
  {
    term: "makeup",
    traffic: 3.1,
    iphoneDifficulty: 8.3,
    ipadDifficulty: 8.1,
    iphoneApps: 8765,
    ipadApps: 654,
    iphoneRank: 22,
    ipadRank: 25,
    density: "2.8%",
    downloads: "98 (5%)",
    change: -2,
  },
  {
    term: "stylist",
    traffic: 2.5,
    iphoneDifficulty: 7.2,
    ipadDifficulty: 7.6,
    iphoneApps: 3421,
    ipadApps: 289,
    iphoneRank: 18,
    ipadRank: 21,
    density: "1.9%",
    downloads: "134 (7%)",
    change: 0,
  },
  {
    term: "fashion show",
    traffic: 2.1,
    iphoneDifficulty: 6.8,
    ipadDifficulty: 7.1,
    iphoneApps: 2345,
    ipadApps: 178,
    iphoneRank: 14,
    ipadRank: 16,
    density: "6.3%",
    downloads: "203 (10%)",
    change: 4,
  },
  {
    term: "girl games",
    traffic: 3.8,
    iphoneDifficulty: 8.7,
    ipadDifficulty: 8.5,
    iphoneApps: 12456,
    ipadApps: 876,
    iphoneRank: 28,
    ipadRank: 32,
    density: "1.5%",
    downloads: "67 (3%)",
    change: -3,
  },
  {
    term: "dress up",
    traffic: 4.5,
    iphoneDifficulty: 9.3,
    ipadDifficulty: 9.2,
    iphoneApps: 18765,
    ipadApps: 1543,
    iphoneRank: 19,
    ipadRank: 22,
    density: "5.1%",
    downloads: "289 (14%)",
    change: 2,
  },
]

export default function KeywordRanking({ dateRange, country, device, app, competitors }: KeywordRankingProps) {
  const [series, setSeries] = useState<Series[]>(mockSeries)
  const [chartBy, setChartBy] = useState<"app" | "keyword">("app")
  const [showCompetitors, setShowCompetitors] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [keywordFilter, setKeywordFilter] = useState("")
  const [sortColumn, setSortColumn] = useState<keyof KeywordRow>("iphoneRank")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [keywords, setKeywords] = useState<KeywordRow[]>(mockKeywords)
  const [isLoading, setIsLoading] = useState(false)
  const [adaptiveColors, setAdaptiveColors] = useState(false)

  // Filter and sort keywords
  const filteredKeywords = useMemo(() => {
    const filtered = keywords.filter((kw) => kw.term.toLowerCase().includes(keywordFilter.toLowerCase()))

    filtered.sort((a, b) => {
      const aVal = a[sortColumn]
      const bVal = b[sortColumn]
      const multiplier = sortDirection === "asc" ? 1 : -1

      if (typeof aVal === "number" && typeof bVal === "number") {
        return (aVal - bVal) * multiplier
      }
      return String(aVal).localeCompare(String(bVal)) * multiplier
    })

    return filtered
  }, [keywords, keywordFilter, sortColumn, sortDirection])

  const handleSort = (column: keyof KeywordRow) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const hideAllSeries = () => {
    setSeries(series.map((s) => ({ ...s, visible: false })))
  }

  const clearAllSeries = () => {
    setSeries([series[0]]) // Keep only main app
  }

  const exportToCSV = () => {
    const headers = [
      "Search Term",
      "Traffic",
      "iPhone Difficulty",
      "iPad Difficulty",
      "iPhone Apps",
      "iPad Apps",
      "iPhone Rank",
      "iPad Rank",
      "Density",
      "Downloads",
      "Change",
    ]
    const csvContent = [
      headers.join(","),
      ...filteredKeywords.map((kw) =>
        [
          kw.term,
          kw.traffic,
          kw.iphoneDifficulty,
          kw.ipadDifficulty,
          kw.iphoneApps,
          kw.ipadApps,
          kw.iphoneRank,
          kw.ipadRank,
          kw.density,
          kw.downloads,
          kw.change,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "aso_keyword_ranking.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const visibleSeries = series.filter((s) => s.visible)

  // Prepare chart data
  const chartData = useMemo(() => {
    if (visibleSeries.length === 0) return []

    const allDates = new Set<string>()
    visibleSeries.forEach((s) => s.points.forEach((p) => allDates.add(p.date)))
    const dates = Array.from(allDates).sort()

    return dates.map((date) => {
      const dataPoint: any = { date }
      visibleSeries.forEach((s) => {
        const point = s.points.find((p) => p.date === date)
        dataPoint[s.id] = point?.rank || null
      })
      return dataPoint
    })
  }, [visibleSeries])

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card className="rounded-2xl">
        <CardContent className="p-6 space-y-4">
          {/* Row 1 - App Info */}
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="flex items-start gap-4 flex-1">
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Switch to another app
              </Button>

              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border flex-1">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  {app.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg">{app.name}</h3>
                  <p className="text-sm text-gray-500">{app.developer || "Fashion Studios Inc."}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={isFavorite ? "text-yellow-500" : "text-gray-400"}
                >
                  <Star className={`h-5 w-5 ${isFavorite ? "fill-yellow-500" : ""}`} />
                </Button>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl space-y-2 min-w-[240px]">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Category</span>
                <span className="font-semibold">Games</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">IAP</span>
                <Badge variant="secondary">Yes</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Price</span>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Free</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Store</span>
                <Button variant="link" size="sm" className="h-auto p-0">
                  <Store className="h-4 w-4 mr-1" />
                  View in Store
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t" />

          {/* Row 2 - Controls */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {dateRange.start} → {dateRange.end}
                </span>
              </div>

              <Select value={country}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">🇺🇸 US</SelectItem>
                  <SelectItem value="UK">🇬🇧 UK</SelectItem>
                  <SelectItem value="JP">🇯🇵 JP</SelectItem>
                </SelectContent>
              </Select>

              <Select value={device}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="iPhone">
                    <Smartphone className="h-4 w-4 inline mr-2" />
                    iPhone
                  </SelectItem>
                  <SelectItem value="iPad">
                    <Smartphone className="h-4 w-4 inline mr-2" />
                    iPad
                  </SelectItem>
                  <SelectItem value="Android">
                    <Smartphone className="h-4 w-4 inline mr-2" />
                    Android
                  </SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Switch checked={showCompetitors} onCheckedChange={setShowCompetitors} />
                <span className="text-sm text-gray-600">Show Competitors</span>
              </div>

              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Add another app..." className="pl-9" />
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-md">
                <span className="text-sm text-gray-600">Chart By:</span>
                <Button
                  variant={chartBy === "app" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setChartBy("app")}
                  className="h-7 text-xs"
                >
                  App
                </Button>
                <Button
                  variant={chartBy === "keyword" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setChartBy("keyword")}
                  className="h-7 text-xs"
                >
                  Keyword
                </Button>
              </div>

              <Button variant="outline" size="sm" onClick={clearAllSeries}>
                Clear All
              </Button>
              <Button variant="outline" size="sm" onClick={hideAllSeries}>
                <EyeOff className="h-4 w-4 mr-1" />
                Hide All
              </Button>
            </div>

            {/* Active selections */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-gray-500">Active:</span>
              {visibleSeries.map((s) => (
                <Badge key={s.id} variant="secondary" className="text-xs">
                  {s.name}
                  <button
                    onClick={() => setSeries(series.map((sr) => (sr.id === s.id ? { ...sr, visible: false } : sr)))}
                    className="ml-2 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart and Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Main Chart */}
        <Card className="rounded-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Ranking Over Time</CardTitle>
                <CardDescription>Lower rank is better (Rank 1 is best)</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={adaptiveColors} onCheckedChange={setAdaptiveColors} />
                <span className="text-sm text-gray-600">Adaptive Colors</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {visibleSeries.length === 0 ? (
              <div className="h-[400px] flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <Globe className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">No data for selected range</p>
                  <p className="text-sm text-gray-500">Add apps or keywords to start tracking</p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis
                    reversed
                    domain={[0, 50]}
                    label={{ value: "Rank Position (lower is better)", angle: -90, position: "insideLeft" }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 border rounded-lg shadow-lg">
                            <p className="font-semibold mb-2">{payload[0].payload.date}</p>
                            {payload.map((entry, index) => {
                              const s = visibleSeries.find((ser) => ser.id === entry.dataKey)
                              if (s && entry.value) {
                                return (
                                  <p key={index} className="text-sm" style={{ color: s.color }}>
                                    {s.name}: #{entry.value}
                                  </p>
                                )
                              }
                              return null
                            })}
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Legend />
                  {visibleSeries.map((s) => (
                    <Line
                      key={s.id}
                      type="monotone"
                      dataKey={s.id}
                      stroke={s.color}
                      strokeWidth={2}
                      name={s.name}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Sidebar - Top Apps */}
        <Card className="rounded-2xl hidden lg:block">
          <CardHeader>
            <CardTitle className="text-lg">Top Apps for Fashion</CardTitle>
            <CardDescription>Top performing apps in this category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {mockTopApps.map((topApp) => (
                <div key={topApp.rank} className="flex items-center gap-3 p-2 border rounded-lg hover:bg-gray-50">
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
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Keywords Table */}
      <Card className="rounded-2xl">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle>All Keywords</CardTitle>
              <CardDescription>Track and manage your keyword rankings</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => alert("Add New Keyword")}>
                <Plus className="h-4 w-4 mr-1" />
                Add New Keyword
              </Button>
              <Button variant="outline" size="sm">
                <Pencil className="h-4 w-4 mr-1" />
                Edit Keywords
              </Button>
              <Button variant="outline" size="sm" onClick={exportToCSV}>
                <FileDown className="h-4 w-4 mr-1" />
                Download Reports
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Manage Tabs
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Add Tab</DropdownMenuItem>
                  <DropdownMenuItem>Rename Tab</DropdownMenuItem>
                  <DropdownMenuItem>Delete Tab</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="mt-4">
            <div className="relative max-w-sm">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Filter keywords..."
                value={keywordFilter}
                onChange={(e) => setKeywordFilter(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("term")}>
                    <div className="flex items-center gap-1">
                      Search Term
                      {sortColumn === "term" && (sortDirection === "asc" ? "↑" : "↓")}
                    </div>
                  </TableHead>
                  <TableHead className="text-right cursor-pointer" onClick={() => handleSort("traffic")}>
                    <div className="flex items-center justify-end gap-1">
                      Traffic
                      {sortColumn === "traffic" && (sortDirection === "asc" ? "↑" : "↓")}
                    </div>
                  </TableHead>
                  <TableHead className="text-right cursor-pointer" onClick={() => handleSort("iphoneDifficulty")}>
                    <div className="flex items-center justify-end gap-1">
                      iPhone Difficulty
                      {sortColumn === "iphoneDifficulty" && (sortDirection === "asc" ? "↑" : "↓")}
                    </div>
                  </TableHead>
                  <TableHead className="text-right cursor-pointer" onClick={() => handleSort("ipadDifficulty")}>
                    <div className="flex items-center justify-end gap-1">
                      iPad Difficulty
                      {sortColumn === "ipadDifficulty" && (sortDirection === "asc" ? "↑" : "↓")}
                    </div>
                  </TableHead>
                  <TableHead className="text-right cursor-pointer" onClick={() => handleSort("iphoneApps")}>
                    <div className="flex items-center justify-end gap-1">
                      iPhone Apps
                      {sortColumn === "iphoneApps" && (sortDirection === "asc" ? "↑" : "↓")}
                    </div>
                  </TableHead>
                  <TableHead className="text-right cursor-pointer" onClick={() => handleSort("ipadApps")}>
                    <div className="flex items-center justify-end gap-1">
                      iPad Apps
                      {sortColumn === "ipadApps" && (sortDirection === "asc" ? "↑" : "↓")}
                    </div>
                  </TableHead>
                  <TableHead className="text-right cursor-pointer" onClick={() => handleSort("iphoneRank")}>
                    <div className="flex items-center justify-end gap-1">
                      iPhone Rank
                      {sortColumn === "iphoneRank" && (sortDirection === "asc" ? "↑" : "↓")}
                    </div>
                  </TableHead>
                  <TableHead className="text-right cursor-pointer" onClick={() => handleSort("ipadRank")}>
                    <div className="flex items-center justify-end gap-1">
                      iPad Rank
                      {sortColumn === "ipadRank" && (sortDirection === "asc" ? "↑" : "↓")}
                    </div>
                  </TableHead>
                  <TableHead className="text-right cursor-pointer" onClick={() => handleSort("density")}>
                    <div className="flex items-center justify-end gap-1">
                      Density
                      {sortColumn === "density" && (sortDirection === "asc" ? "↑" : "↓")}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Downloads</TableHead>
                  <TableHead className="text-center cursor-pointer" onClick={() => handleSort("change")}>
                    <div className="flex items-center justify-center gap-1">
                      C{sortColumn === "change" && (sortDirection === "asc" ? "↑" : "↓")}
                    </div>
                  </TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredKeywords.map((keyword, index) => (
                  <TableRow
                    key={index}
                    className={`${
                      keyword.change > 0
                        ? "bg-emerald-50 hover:bg-emerald-100"
                        : keyword.change < 0
                          ? "bg-rose-50 hover:bg-rose-100"
                          : "hover:bg-gray-50"
                    }`}
                  >
                    <TableCell className="font-medium">{keyword.term}</TableCell>
                    <TableCell className="text-right">{keyword.traffic.toFixed(1)}</TableCell>
                    <TableCell className="text-right">{keyword.iphoneDifficulty.toFixed(1)}</TableCell>
                    <TableCell className="text-right">{keyword.ipadDifficulty.toFixed(1)}</TableCell>
                    <TableCell className="text-right">{keyword.iphoneApps.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{keyword.ipadApps.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-bold">#{keyword.iphoneRank}</TableCell>
                    <TableCell className="text-right font-bold">#{keyword.ipadRank}</TableCell>
                    <TableCell className="text-right">{keyword.density}</TableCell>
                    <TableCell className="text-right text-sm">{keyword.downloads}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        {keyword.change > 0 ? (
                          <>
                            <TrendingUp className="h-4 w-4 text-emerald-600" />
                            <span className="text-sm font-medium text-emerald-600">+{keyword.change}</span>
                          </>
                        ) : keyword.change < 0 ? (
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
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:text-red-600">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredKeywords.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No keywords found</p>
              <p className="text-sm text-gray-500 mb-4">Try adjusting your filters or add new keywords</p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Keyword
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
