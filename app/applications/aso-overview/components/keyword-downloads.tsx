"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import {
  Star,
  ExternalLink,
  Calendar,
  Globe,
  Smartphone,
  Download,
  ArrowUpDown,
  Filter,
  RefreshCw,
  Eye,
  EyeOff,
  Target,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

type Point = { date: string; value: number }
type Series = { term: string; color?: string; points: Point[]; tracked?: boolean }

type Row = {
  term: string
  traffic?: number
  iphoneRank?: number
  ipadRank?: number
  density?: string
  downloads: number
  percent: number
  deltaRankIphone?: number
  deltaRankIpad?: number
  tracked?: boolean
}

interface Props {
  dateRange: { start: string; end: string }
  country: string
  device: "iPhone" | "iPad" | "Android"
  keywords?: string[] | "all"
  app: { id: string; name: string; iconUrl?: string; developer?: string }
}

const seriesColors = [
  "#3b82f6",
  "#10b981",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#ec4899",
  "#14b8a6",
  "#gray-400",
]

const mockSeries: Series[] = [
  {
    term: "fashion show",
    points: [
      { date: "2025-07-05", value: 120 },
      { date: "2025-07-12", value: 460 },
      { date: "2025-07-19", value: 410 },
      { date: "2025-07-26", value: 460 },
      { date: "2025-08-02", value: 340 },
      { date: "2025-08-09", value: 450 },
      { date: "2025-08-16", value: 380 },
      { date: "2025-08-23", value: 400 },
      { date: "2025-08-30", value: 300 },
      { date: "2025-09-06", value: 280 },
      { date: "2025-09-13", value: 290 },
      { date: "2025-09-20", value: 180 },
    ],
    tracked: true,
    color: seriesColors[0],
  },
  {
    term: "fashion show games",
    points: [
      { date: "2025-07-05", value: 40 },
      { date: "2025-09-20", value: 60 },
    ],
    tracked: true,
    color: seriesColors[1],
  },
  {
    term: "fashion",
    points: [
      { date: "2025-07-05", value: 5 },
      { date: "2025-09-20", value: 32 },
    ],
    tracked: true,
    color: seriesColors[2],
  },
  {
    term: "barby",
    points: [
      { date: "2025-07-05", value: 3 },
      { date: "2025-09-20", value: 24 },
    ],
    tracked: true,
    color: seriesColors[3],
  },
  {
    term: "dress",
    points: [
      { date: "2025-07-05", value: 8 },
      { date: "2025-09-20", value: 15 },
    ],
    tracked: true,
    color: seriesColors[4],
  },
  {
    term: "suitu",
    points: [
      { date: "2025-07-05", value: 1 },
      { date: "2025-09-20", value: 4 },
    ],
    tracked: true,
    color: seriesColors[5],
  },
  {
    term: "Other",
    points: [
      { date: "2025-07-05", value: 10 },
      { date: "2025-09-20", value: 9 },
    ],
    tracked: false,
    color: seriesColors[8],
  },
]

const mockRows: Row[] = [
  { term: "Total", downloads: 4976, percent: 100 },
  {
    term: "fashion show",
    traffic: 3.4,
    iphoneRank: 1,
    ipadRank: 1,
    density: "8.8%",
    downloads: 3013,
    percent: 60.6,
    tracked: true,
  },
  {
    term: "fashion show games",
    traffic: 2.1,
    iphoneRank: 1,
    ipadRank: 1,
    density: "0.0%",
    downloads: 947,
    percent: 19.0,
    tracked: true,
  },
  {
    term: "بدون بنطال",
    traffic: 2.1,
    iphoneRank: 3,
    ipadRank: 2,
    density: "0.0%",
    downloads: 242,
    percent: 4.9,
    tracked: true,
  },
  {
    term: "fashion",
    traffic: 5.8,
    iphoneRank: 14,
    ipadRank: 21,
    density: "12.5%",
    downloads: 98,
    percent: 2.0,
    tracked: true,
    deltaRankIphone: 1,
    deltaRankIpad: -2,
  },
  {
    term: "fashion games",
    traffic: 5.8,
    iphoneRank: 17,
    ipadRank: 25,
    density: "0.9%",
    downloads: 81,
    percent: 1.6,
    tracked: true,
  },
  {
    term: "barby",
    traffic: 1.9,
    iphoneRank: 6,
    ipadRank: 12,
    density: "0.0%",
    downloads: 24,
    percent: 0.5,
    tracked: true,
  },
]

export default function KeywordDownloads({ dateRange, country, device, keywords = "all", app }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [plotType, setPlotType] = useState<"stacked" | "area" | "line">("stacked")
  const [granularity, setGranularity] = useState<"auto" | "day" | "week" | "month">("auto")
  const [filterText, setFilterText] = useState("")
  const [sortColumn, setSortColumn] = useState<keyof Row>("downloads")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [isFavorite, setIsFavorite] = useState(false)
  const [showUntracked, setShowUntracked] = useState(false)
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set())

  const visibleSeries = useMemo(() => {
    return mockSeries.filter((s) => {
      if (!s.tracked && !showUntracked) return false
      if (hiddenSeries.has(s.term)) return false
      return true
    })
  }, [showUntracked, hiddenSeries])

  const chartData = useMemo(() => {
    const dates = new Set<string>()
    visibleSeries.forEach((s) => s.points.forEach((p) => dates.add(p.date)))

    return Array.from(dates)
      .sort()
      .map((date) => {
        const data: any = { date }
        visibleSeries.forEach((s) => {
          const point = s.points.find((p) => p.date === date)
          data[s.term] = point?.value || 0
        })
        return data
      })
  }, [visibleSeries])

  const filteredRows = useMemo(() => {
    const filtered = mockRows.filter((row) => {
      if (row.term === "Total") return true
      if (!row.tracked && !showUntracked) return false
      if (filterText && !row.term.toLowerCase().includes(filterText.toLowerCase())) return false
      return true
    })

    const totalRow = filtered.find((r) => r.term === "Total")
    const dataRows = filtered.filter((r) => r.term !== "Total")

    dataRows.sort((a, b) => {
      const aVal = a[sortColumn] ?? 0
      const bVal = b[sortColumn] ?? 0
      if (sortDirection === "asc") {
        return aVal > bVal ? 1 : -1
      }
      return aVal < bVal ? 1 : -1
    })

    return totalRow ? [totalRow, ...dataRows] : dataRows
  }, [showUntracked, filterText, sortColumn, sortDirection])

  const handleSort = (column: keyof Row) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("desc")
    }
  }

  const toggleSeries = (term: string) => {
    const newHidden = new Set(hiddenSeries)
    if (newHidden.has(term)) {
      newHidden.delete(term)
    } else {
      newHidden.add(term)
    }
    setHiddenSeries(newHidden)
  }

  const exportCSV = () => {
    const headers = ["Search Term", "Traffic", "iPhone Rank", "iPad Rank", "Density", "Downloads", "Percent"]
    const rows = filteredRows.map((row) => [
      row.term,
      row.traffic || "",
      row.iphoneRank || "",
      row.ipadRank || "",
      row.density || "",
      row.downloads,
      row.percent + "%",
    ])

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "aso_keyword_downloads.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <Skeleton className="h-80 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="rounded-2xl">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <p className="text-red-600">{error}</p>
            <Button onClick={() => setError(null)} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="rounded-2xl">
        <CardContent className="p-6 space-y-6">
          {/* Row 1: App Info */}
          <div className="flex items-start gap-6">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                {app.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg">{app.name}</h3>
                  <Button variant="ghost" size="sm" onClick={() => setIsFavorite(!isFavorite)} className="h-6 w-6 p-0">
                    <Star className={`h-4 w-4 ${isFavorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
                  </Button>
                </div>
                {app.developer && <p className="text-sm text-gray-600">{app.developer}</p>}
                <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                  Switch to another app
                </Button>
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-gray-50 p-4 rounded-xl space-y-2 min-w-[220px]">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Category</span>
                <span className="font-semibold">Games • Puzzle</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">IAP</span>
                <Badge variant="secondary">Yes</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Price</span>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Free</Badge>
              </div>
              <Button variant="link" size="sm" className="h-auto p-0 text-blue-600">
                <ExternalLink className="h-3 w-3 mr-1" />
                View in App Store
              </Button>
            </div>
          </div>

          <div className="border-t pt-4" />

          {/* Row 2: Controls */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Date Range:</span>
                <Badge variant="outline">
                  {dateRange.start} → {dateRange.end}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Country:</span>
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
              </div>

              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Device:</span>
                <Select value={device}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="iPhone">iPhone</SelectItem>
                    <SelectItem value="iPad">iPad</SelectItem>
                    <SelectItem value="Android">Android</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Keywords:</span>
                <Select value="all">
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Keywords</SelectItem>
                    <SelectItem value="top5">Top 5</SelectItem>
                    <SelectItem value="custom">Custom...</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Granularity:</span>
                <Select value={granularity} onValueChange={(v) => setGranularity(v as any)}>
                  <SelectTrigger className="w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="day">Day</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters */}
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
              <span className="font-medium">Active Filters:</span>
              <Badge variant="secondary">{device}</Badge>
              <span className="text-gray-400">•</span>
              <Badge variant="secondary">{country}</Badge>
              <span className="text-gray-400">•</span>
              <Badge variant="secondary">Granularity: {granularity}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart Section */}
      <Card className="rounded-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Keyword Downloads – {app.name}</CardTitle>
              <CardDescription>Downloads attributed to each keyword over time</CardDescription>
            </div>
            <Select value={plotType} onValueChange={(v) => setPlotType(v as any)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stacked">Stacked</SelectItem>
                <SelectItem value="area">Area</SelectItem>
                <SelectItem value="line">Line</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {chartData.length === 0 ? (
            <div className="h-80 flex items-center justify-center text-gray-500">Select keywords to view downloads</div>
          ) : (
            <ResponsiveContainer width="100%" height={360}>
              <AreaChart data={chartData}>
                <defs>
                  {visibleSeries.map((s) => (
                    <linearGradient key={s.term} id={`colorDownload${s.term}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={s.color} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={s.color} stopOpacity={0.3} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis label={{ value: "Downloads", angle: -90, position: "insideLeft" }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 border rounded-lg shadow-lg">
                          <p className="font-semibold mb-2">{payload[0].payload.date}</p>
                          {payload.map((entry, index) => (
                            <p key={index} className="text-sm" style={{ color: entry.color }}>
                              {entry.dataKey}: {entry.value}
                            </p>
                          ))}
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
                        const series = visibleSeries.find((s) => s.term === entry.value)
                        return (
                          <button
                            key={`item-${index}`}
                            onClick={() => toggleSeries(entry.value as string)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-opacity ${
                              hiddenSeries.has(entry.value as string) ? "opacity-40" : ""
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
                {visibleSeries.map((series) => (
                  <Area
                    key={series.term}
                    type="monotone"
                    dataKey={series.term}
                    stackId={plotType === "stacked" ? "1" : undefined}
                    stroke={series.color}
                    fill={`url(#colorDownload${series.term})`}
                    name={series.term}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          )}

          {/* Untracked Keywords Strip */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border">
            <span className="text-sm font-medium text-gray-700">Untracked Keywords:</span>
            <div className="flex gap-2">
              <Button size="sm" variant={showUntracked ? "default" : "outline"} onClick={() => setShowUntracked(true)}>
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
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card className="rounded-2xl">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Filter keywords..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="pl-9 w-64"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline">Manage Keywords</Button>
              <Button variant="outline" onClick={exportCSV}>
                <Download className="h-4 w-4 mr-2" />
                Download CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
                  <TableHead className="text-right cursor-pointer" onClick={() => handleSort("iphoneRank")}>
                    <div className="flex items-center justify-end gap-1">
                      iPhone Rank
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right cursor-pointer" onClick={() => handleSort("ipadRank")}>
                    <div className="flex items-center justify-end gap-1">
                      iPad Rank
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Density</TableHead>
                  <TableHead className="text-right cursor-pointer" onClick={() => handleSort("downloads")}>
                    <div className="flex items-center justify-end gap-1">
                      Downloads
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right cursor-pointer" onClick={() => handleSort("percent")}>
                    <div className="flex items-center justify-end gap-1">
                      Percent
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRows.map((row, idx) => (
                  <TableRow key={idx} className={row.term === "Total" ? "bg-gray-50 font-bold" : ""}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {row.term !== "Total" && <span className="text-xs">🇺🇸</span>}
                        {row.term}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{row.traffic ? row.traffic.toFixed(1) : "—"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {row.iphoneRank || "—"}
                        {row.deltaRankIphone !== undefined && row.deltaRankIphone !== 0 && (
                          <span className={`text-xs ${row.deltaRankIphone > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                            {row.deltaRankIphone > 0 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {row.ipadRank || "—"}
                        {row.deltaRankIpad !== undefined && row.deltaRankIpad !== 0 && (
                          <span className={`text-xs ${row.deltaRankIpad > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                            {row.deltaRankIpad > 0 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{row.density || "—"}</TableCell>
                    <TableCell className="text-right font-semibold">{row.downloads.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2">
                        <Progress value={row.percent} className="flex-1 h-2" />
                        <span className="text-sm font-medium w-12">{row.percent.toFixed(1)}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
