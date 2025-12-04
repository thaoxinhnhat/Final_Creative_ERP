"use client"

import { useState } from "react"
import { ArrowLeft, Search, Plus, TrendingUp, TrendingDown, Minus, Download } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

const keywordsData = [
  {
    keyword: "puzzle game",
    currentRank: 5,
    previousRank: 7,
    volume: 50000,
    difficulty: "High",
    trend: "up",
    change: -2,
    trendData: [
      { date: "Week 1", rank: 12 },
      { date: "Week 2", rank: 10 },
      { date: "Week 3", rank: 9 },
      { date: "Week 4", rank: 7 },
      { date: "Week 5", rank: 6 },
      { date: "Week 6", rank: 5 },
    ],
  },
  {
    keyword: "brain training",
    currentRank: 3,
    previousRank: 3,
    volume: 35000,
    difficulty: "Medium",
    trend: "stable",
    change: 0,
    trendData: [
      { date: "Week 1", rank: 4 },
      { date: "Week 2", rank: 3 },
      { date: "Week 3", rank: 3 },
      { date: "Week 4", rank: 4 },
      { date: "Week 5", rank: 3 },
      { date: "Week 6", rank: 3 },
    ],
  },
  {
    keyword: "casual game",
    currentRank: 12,
    previousRank: 10,
    volume: 42000,
    difficulty: "High",
    trend: "down",
    change: 2,
    trendData: [
      { date: "Week 1", rank: 8 },
      { date: "Week 2", rank: 9 },
      { date: "Week 3", rank: 10 },
      { date: "Week 4", rank: 10 },
      { date: "Week 5", rank: 11 },
      { date: "Week 6", rank: 12 },
    ],
  },
  {
    keyword: "offline game",
    currentRank: 8,
    previousRank: 12,
    volume: 28000,
    difficulty: "Medium",
    trend: "up",
    change: -4,
    trendData: [
      { date: "Week 1", rank: 15 },
      { date: "Week 2", rank: 13 },
      { date: "Week 3", rank: 12 },
      { date: "Week 4", rank: 10 },
      { date: "Week 5", rank: 9 },
      { date: "Week 6", rank: 8 },
    ],
  },
  {
    keyword: "free game",
    currentRank: 15,
    previousRank: 18,
    volume: 68000,
    difficulty: "Very High",
    trend: "up",
    change: -3,
    trendData: [
      { date: "Week 1", rank: 20 },
      { date: "Week 2", rank: 19 },
      { date: "Week 3", rank: 18 },
      { date: "Week 4", rank: 17 },
      { date: "Week 5", rank: 16 },
      { date: "Week 6", rank: 15 },
    ],
  },
]

export default function KeywordTrackingPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [marketFilter, setMarketFilter] = useState("all")
  const [deviceFilter, setDeviceFilter] = useState("all")
  const [selectedKeyword, setSelectedKeyword] = useState(keywordsData[0])

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/applications")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Keyword Tracking</h1>
            <p className="text-sm text-gray-500">Monitor keyword rankings and performance over time</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Keyword
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={marketFilter} onValueChange={setMarketFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Market" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Markets</SelectItem>
                <SelectItem value="us">🇺🇸 United States</SelectItem>
                <SelectItem value="vn">🇻🇳 Vietnam</SelectItem>
                <SelectItem value="jp">🇯🇵 Japan</SelectItem>
                <SelectItem value="kr">🇰🇷 South Korea</SelectItem>
              </SelectContent>
            </Select>
            <Select value={deviceFilter} onValueChange={setDeviceFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Device" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Devices</SelectItem>
                <SelectItem value="ios">iOS</SelectItem>
                <SelectItem value="android">Android</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Keyword Rank Trend Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Keyword Rank Trend: {selectedKeyword.keyword}</CardTitle>
              <CardDescription>Track ranking position over the last 6 weeks</CardDescription>
            </div>
            <Badge
              className={`text-sm ${
                selectedKeyword.trend === "up"
                  ? "bg-green-100 text-green-700"
                  : selectedKeyword.trend === "down"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700"
              }`}
            >
              {selectedKeyword.trend === "up" ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : selectedKeyword.trend === "down" ? (
                <TrendingDown className="h-4 w-4 mr-1" />
              ) : (
                <Minus className="h-4 w-4 mr-1" />
              )}
              Rank #{selectedKeyword.currentRank}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={selectedKeyword.trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis reversed domain={[0, 25]} label={{ value: "Rank Position", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="rank"
                stroke="#3b82f6"
                strokeWidth={3}
                name="Rank Position"
                dot={{ fill: "#3b82f6", r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-xs text-gray-600 mb-1">Current Rank</p>
                <p className="text-2xl font-bold text-blue-600">#{selectedKeyword.currentRank}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Previous Rank</p>
                <p className="text-2xl font-bold text-gray-700">#{selectedKeyword.previousRank}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Change</p>
                <p
                  className={`text-2xl font-bold ${selectedKeyword.change < 0 ? "text-green-600" : selectedKeyword.change > 0 ? "text-red-600" : "text-gray-600"}`}
                >
                  {selectedKeyword.change > 0 ? "+" : ""}
                  {selectedKeyword.change}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Search Volume</p>
                <p className="text-2xl font-bold text-gray-700">{selectedKeyword.volume.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Keywords Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Tracked Keywords</CardTitle>
          <CardDescription>Complete list of monitored keywords with performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Keyword</TableHead>
                <TableHead>Volume</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Current Rank</TableHead>
                <TableHead>Previous Rank</TableHead>
                <TableHead>Change</TableHead>
                <TableHead>Trend</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keywordsData.map((keyword, index) => (
                <TableRow
                  key={index}
                  className={`cursor-pointer transition-colors ${selectedKeyword.keyword === keyword.keyword ? "bg-blue-50" : "hover:bg-gray-50"}`}
                  onClick={() => setSelectedKeyword(keyword)}
                >
                  <TableCell className="font-medium">{keyword.keyword}</TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-700">{keyword.volume.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        keyword.difficulty === "Very High"
                          ? "border-red-500 text-red-700"
                          : keyword.difficulty === "High"
                            ? "border-orange-500 text-orange-700"
                            : "border-yellow-500 text-yellow-700"
                      }
                    >
                      {keyword.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-blue-600 text-white font-bold">#{keyword.currentRank}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-500">#{keyword.previousRank}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span
                        className={`font-semibold ${
                          keyword.change < 0 ? "text-green-600" : keyword.change > 0 ? "text-red-600" : "text-gray-500"
                        }`}
                      >
                        {keyword.change > 0 ? "+" : ""}
                        {keyword.change}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {keyword.trend === "up" ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-sm font-medium">Up</span>
                        </div>
                      ) : keyword.trend === "down" ? (
                        <div className="flex items-center gap-1 text-red-600">
                          <TrendingDown className="h-4 w-4" />
                          <span className="text-sm font-medium">Down</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-gray-400">
                          <Minus className="h-4 w-4" />
                          <span className="text-sm font-medium">Stable</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
