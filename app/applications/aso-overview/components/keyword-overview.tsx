"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Star,
  ExternalLink,
  Calendar,
  Globe,
  Smartphone,
  Download,
  Plus,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  Filter,
  RefreshCw,
} from "lucide-react"
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

type BucketKey = "1-2" | "3-5" | "6-10" | "11-20" | "21+"
type OverviewPoint = { date: string; buckets: Record<BucketKey, number> }
type KeywordRow = {
  term: string
  traffic: number
  iphoneDifficulty: number
  ipadDifficulty: number
  iphoneApps: number
  ipadApps: number
  iphoneRank?: number
  ipadRank?: number
  density: string
  changeIPhone?: number
  changeIPad?: number
}

interface Props {
  dateRange: { start: string; end: string }
  country: string
  device: "iPhone" | "iPad" | "Android"
  minTraffic?: number
  app: { id: string; name: string; iconUrl?: string; developer?: string }
}

const mockOverviewSeries: OverviewPoint[] = [
  { date: "2025-07-10", buckets: { "1-2": 2, "3-5": 6, "6-10": 8, "11-20": 15, "21+": 5 } },
  { date: "2025-07-20", buckets: { "1-2": 2, "3-5": 5, "6-10": 9, "11-20": 16, "21+": 6 } },
  { date: "2025-08-01", buckets: { "1-2": 3, "3-5": 6, "6-10": 10, "11-20": 14, "21+": 7 } },
  { date: "2025-08-15", buckets: { "1-2": 3, "3-5": 7, "6-10": 11, "11-20": 13, "21+": 7 } },
  { date: "2025-09-01", buckets: { "1-2": 4, "3-5": 8, "6-10": 11, "11-20": 12, "21+": 8 } },
  { date: "2025-09-15", buckets: { "1-2": 3, "3-5": 8, "6-10": 12, "11-20": 13, "21+": 7 } },
  { date: "2025-10-01", buckets: { "1-2": 4, "3-5": 9, "6-10": 12, "11-20": 14, "21+": 6 } },
]

const mockKeywordRows: KeywordRow[] = [
  {
    term: "acrylic",
    traffic: 0.5,
    iphoneDifficulty: 7.9,
    ipadDifficulty: 7.5,
    iphoneApps: 192,
    ipadApps: 193,
    iphoneRank: 20,
    ipadRank: 117,
    density: "0.0%",
    changeIPhone: -1,
  },
  {
    term: "angela",
    traffic: 4.6,
    iphoneDifficulty: 9.2,
    ipadDifficulty: 9.1,
    iphoneApps: 8500,
    ipadApps: 189,
    iphoneRank: 84,
    ipadRank: 159,
    density: "0.0%",
    changeIPhone: 2,
  },
  {
    term: "barbie",
    traffic: 5.7,
    iphoneDifficulty: 9.1,
    ipadDifficulty: 9.2,
    iphoneApps: 3783,
    ipadApps: 217,
    iphoneRank: 48,
    ipadRank: 78,
    density: "0.0%",
    changeIPhone: 1,
  },
  {
    term: "fashion",
    traffic: 5.8,
    iphoneDifficulty: 8.4,
    ipadDifficulty: 9.2,
    iphoneApps: 27030,
    ipadApps: 231,
    iphoneRank: 14,
    ipadRank: 21,
    density: "12.5%",
    changeIPhone: -3,
  },
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
    changeIPhone: -4,
  },
  {
    term: "makeup",
    traffic: 6.1,
    iphoneDifficulty: 8.7,
    ipadDifficulty: 8.9,
    iphoneApps: 12450,
    ipadApps: 198,
    iphoneRank: 7,
    ipadRank: 12,
    density: "3.2%",
    changeIPhone: 2,
    changeIPad: 1,
  },
  {
    term: "stylist",
    traffic: 2.8,
    iphoneDifficulty: 7.3,
    ipadDifficulty: 7.8,
    iphoneApps: 5621,
    ipadApps: 145,
    iphoneRank: 25,
    ipadRank: 35,
    density: "1.8%",
    changeIPhone: -2,
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
    changeIPhone: 0,
    changeIPad: -1,
  },
]

const bucketColors = {
  "1-2": "#10b981",
  "3-5": "#3b82f6",
  "6-10": "#8b5cf6",
  "11-20": "#f59e0b",
  "21+": "#ef4444",
}

export default function KeywordOverview({ dateRange, country, device, minTraffic = 0, app }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [plotType, setPlotType] = useState<"stacked" | "area" | "line">("stacked")
  const [minTrafficScore, setMinTrafficScore] = useState(minTraffic)
  const [filterText, setFilterText] = useState("")
  const [sortColumn, setSortColumn] = useState<keyof KeywordRow>("traffic")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [isFavorite, setIsFavorite] = useState(false)
  const [addKeywordOpen, setAddKeywordOpen] = useState(false)
  const [hiddenBuckets, setHiddenBuckets] = useState<Set<BucketKey>>(new Set())

  const filteredKeywords = useMemo(() => {
    let filtered = mockKeywordRows.filter((kw) => kw.traffic >= minTrafficScore)

    if (filterText) {
      filtered = filtered.filter((kw) => kw.term.toLowerCase().includes(filterText.toLowerCase()))
    }

    return filtered.sort((a, b) => {
      const aVal = a[sortColumn] ?? 0
      const bVal = b[sortColumn] ?? 0
      if (sortDirection === "asc") {
        return aVal > bVal ? 1 : -1
      }
      return aVal < bVal ? 1 : -1
    })
  }, [minTrafficScore, filterText, sortColumn, sortDirection])

  const chartData = useMemo(() => {
    return mockOverviewSeries.map((point) => {
      const data: any = { date: point.date }
      Object.entries(point.buckets).forEach(([bucket, count]) => {
        if (!hiddenBuckets.has(bucket as BucketKey)) {
          data[bucket] = count
        }
      })
      return data
    })
  }, [hiddenBuckets])

  const handleSort = (column: keyof KeywordRow) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("desc")
    }
  }

  const toggleBucket = (bucket: BucketKey) => {
    const newHidden = new Set(hiddenBuckets)
    if (newHidden.has(bucket)) {
      newHidden.delete(bucket)
    } else {
      newHidden.add(bucket)
    }
    setHiddenBuckets(newHidden)
  }

  const exportCSV = () => {
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
    ]
    const rows = filteredKeywords.map((kw) => [
      kw.term,
      kw.traffic,
      kw.iphoneDifficulty,
      kw.ipadDifficulty,
      kw.iphoneApps,
      kw.ipadApps,
      kw.iphoneRank || "",
      kw.ipadRank || "",
      kw.density,
    ])

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "aso_keyword_overview.csv"
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
                <span className="text-sm text-gray-500">Min. Traffic Score:</span>
                <Select value={minTrafficScore.toString()} onValueChange={(v) => setMinTrafficScore(Number(v))}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">All</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
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
              <Badge variant="secondary">Min Traffic: {minTrafficScore}+</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart Section */}
      <Card className="rounded-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Keyword Overview – All Keywords</CardTitle>
              <CardDescription>Keywords distribution by rank buckets over time</CardDescription>
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
        <CardContent>
          {chartData.length === 0 ? (
            <div className="h-80 flex items-center justify-center text-gray-500">
              No keywords meeting the traffic threshold
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={360}>
              <AreaChart data={chartData}>
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
                      {payload?.map((entry, index) => (
                        <button
                          key={`item-${index}`}
                          onClick={() => toggleBucket(entry.value as BucketKey)}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-opacity ${
                            hiddenBuckets.has(entry.value as BucketKey) ? "opacity-40" : ""
                          }`}
                          style={{ backgroundColor: entry.color, color: "white" }}
                        >
                          {entry.value}
                        </button>
                      ))}
                    </div>
                  )}
                />
                {(Object.keys(bucketColors) as BucketKey[]).map((bucket) => (
                  <Area
                    key={bucket}
                    type="monotone"
                    dataKey={bucket}
                    stackId={plotType === "stacked" ? "1" : undefined}
                    stroke={bucketColors[bucket]}
                    fill={`url(#color${bucket})`}
                    name={bucket}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card className="rounded-2xl">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Select value="all">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Keywords</SelectItem>
                  <SelectItem value="tracked">Tracked Only</SelectItem>
                </SelectContent>
              </Select>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Filter keywords..."
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  className="pl-9 w-64"
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
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("term")}>
                    <div className="flex items-center gap-1">
                      Search Term
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right cursor-pointer" onClick={() => handleSort("traffic")}>
                    <div className="flex items-center justify-end gap-1">
                      Traffic
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">iPhone Difficulty</TableHead>
                  <TableHead className="text-right">iPad Difficulty</TableHead>
                  <TableHead className="text-right">iPhone Apps</TableHead>
                  <TableHead className="text-right">iPad Apps</TableHead>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredKeywords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12 text-gray-500">
                      No keywords found. Try adjusting your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredKeywords.map((keyword, idx) => (
                    <TableRow
                      key={idx}
                      className={`${
                        keyword.changeIPhone && keyword.changeIPhone > 0
                          ? "bg-emerald-50"
                          : keyword.changeIPhone && keyword.changeIPhone < 0
                            ? "bg-rose-50"
                            : ""
                      }`}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <span className="text-xs">🇺🇸</span>
                          {keyword.term}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{keyword.traffic.toFixed(1)}</TableCell>
                      <TableCell className="text-right">{keyword.iphoneDifficulty.toFixed(1)}</TableCell>
                      <TableCell className="text-right">{keyword.ipadDifficulty.toFixed(1)}</TableCell>
                      <TableCell className="text-right">{keyword.iphoneApps.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{keyword.ipadApps.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {keyword.iphoneRank || "—"}
                          {keyword.changeIPhone !== undefined && keyword.changeIPhone !== 0 && (
                            <span
                              className={`text-xs ${keyword.changeIPhone > 0 ? "text-emerald-600" : "text-rose-600"}`}
                            >
                              {keyword.changeIPhone > 0 ? (
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
                          {keyword.ipadRank || "—"}
                          {keyword.changeIPad !== undefined && keyword.changeIPad !== 0 && (
                            <span
                              className={`text-xs ${keyword.changeIPad > 0 ? "text-emerald-600" : "text-rose-600"}`}
                            >
                              {keyword.changeIPad > 0 ? (
                                <TrendingUp className="h-3 w-3" />
                              ) : (
                                <TrendingDown className="h-3 w-3" />
                              )}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{keyword.density}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
