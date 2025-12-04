"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  TrendingUp,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  CheckCircle2,
  Download,
  ExternalLink,
  Search,
  FileText,
  Share2,
} from "lucide-react"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { AlertItem } from "@/components/alert-item"

export default function Optimization_TrackingPage() {
  const [selectedApp, setSelectedApp] = useState("meditation-pro")
  const [platform, setPlatform] = useState("both")
  const [dateRange, setDateRange] = useState("last-30-days")
  const [compareMode, setCompareMode] = useState("previous")

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Optimization & Tracking</h1>
          <p className="text-gray-600">Theo dõi hiệu suất tự động và tối ưu hóa ứng dụng của bạn</p>
        </div>
      </div>

      <div className="bg-white border-b px-6 py-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label className="text-xs text-gray-600 mb-1.5 block">App Selector</Label>
              <Select value={selectedApp} onValueChange={setSelectedApp}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meditation-pro">Meditation Pro</SelectItem>
                  <SelectItem value="sleep-sounds">Sleep Sounds</SelectItem>
                  <SelectItem value="calm-mind">Calm Mind</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs text-gray-600 mb-1.5 block">Platform</Label>
              <div className="flex gap-1 border rounded-md p-1">
                {["ios", "android", "both"].map((p) => (
                  <Button
                    key={p}
                    variant={platform === p ? "default" : "ghost"}
                    size="sm"
                    className="flex-1 h-8"
                    onClick={() => setPlatform(p)}
                  >
                    {p === "ios" ? "iOS" : p === "android" ? "Android" : "Both"}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-xs text-gray-600 mb-1.5 block">Market</Label>
              <Select defaultValue="us">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">🇺🇸 US</SelectItem>
                  <SelectItem value="uk">🇬🇧 UK</SelectItem>
                  <SelectItem value="vn">🇻🇳 VN</SelectItem>
                  <SelectItem value="th">🇹🇭 TH</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs text-gray-600 mb-1.5 block">Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                  <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                  <SelectItem value="last-90-days">Last 90 Days</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs text-gray-600 mb-1.5 block">Compare to</Label>
              <Select value={compareMode} onValueChange={setCompareMode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="previous">Previous Period</SelectItem>
                  <SelectItem value="previous-version">Previous Version</SelectItem>
                  <SelectItem value="baseline">Baseline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600">Organic Downloads</p>
                    <p className="text-2xl font-bold">125,450</p>
                    <div className="flex items-center gap-1 text-green-600">
                      <TrendingUp className="h-3 w-3" />
                      <span className="text-xs font-medium">↑ 15.3%</span>
                    </div>
                  </div>
                  <div className="h-12 w-20">
                    <svg viewBox="0 0 80 48" className="w-full h-full">
                      <polyline
                        points="0,40 10,35 20,38 30,30 40,32 50,25 60,28 70,20 80,18"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Daily Average: 4,181</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600">Conversion Rate</p>
                    <p className="text-2xl font-bold">2.84%</p>
                    <div className="flex items-center gap-1 text-green-600">
                      <TrendingUp className="h-3 w-3" />
                      <span className="text-xs font-medium">↑ 0.4%</span>
                    </div>
                  </div>
                  <div className="h-12 w-20">
                    <svg viewBox="0 0 80 48" className="w-full h-full">
                      <polyline
                        points="0,30 10,32 20,28 30,30 40,26 50,28 60,24 70,26 80,22"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Category Avg: 2.1%</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="space-y-1">
                  <p className="text-xs text-gray-600">Keyword Rankings</p>
                  <p className="text-2xl font-bold">85</p>
                  <div className="space-y-1 mt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Top 10:</span>
                      <div className="flex items-center gap-1 text-green-600">
                        <span className="font-medium">23</span>
                        <ArrowUp className="h-3 w-3" />
                        <span>5</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Top 100:</span>
                      <div className="flex items-center gap-1 text-red-600">
                        <span className="font-medium">67</span>
                        <ArrowDown className="h-3 w-3" />
                        <span>2</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="space-y-1">
                  <p className="text-xs text-gray-600">Store Rating</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold">4.8</p>
                    <span className="text-yellow-500">★</span>
                  </div>
                  <div className="space-y-1 mt-2">
                    <p className="text-xs text-gray-600">Reviews: 2,341 this month</p>
                    <p className="text-xs text-gray-600">Response Rate: 89%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <Card className="border-2 border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                Alert Center
              </CardTitle>
              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                3 Active Alerts
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <AlertItem
                type="critical"
                source="Metadata"
                title="Keyword 'calm' dropped from #5 to #8"
                impact="Impact: -2K daily downloads estimated"
                projectId="PRJ-2024-001"
                version="v2.3.1"
                publishDate="Dec 20, 2024"
                detectedTime="2 hours ago"
              />
              <AlertItem
                type="warning"
                source="StoreKit"
                title="Screenshot CTR decreased by 12% in Position 4"
                impact="Impact: Lower conversion rate in UK market"
                projectId="PRJ-2024-003"
                version="SK-456"
                publishDate="Dec 18, 2024"
                detectedTime="1 day ago"
              />
              <AlertItem
                type="positive"
                source="Both"
                title="Keyword 'mindfulness' jumped to #2 position"
                impact="Impact: +45% impressions spike, +3.5K downloads/day"
                projectId="PRJ-2024-002"
                version="v2.3.0 / SK-445"
                publishDate="Dec 19, 2024"
                detectedTime="3 hours ago"
              />
            </div>
          </CardContent>
        </Card>

        {/* Phần II: Keyword Performance Tracker */}
        <Card>
          <CardHeader>
            <CardTitle>Keyword Performance Tracker</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Keyword Table */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Keyword</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Rank</TableHead>
                      <TableHead>Change</TableHead>
                      <TableHead>Search Vol</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead>CVR</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      {
                        keyword: "meditation",
                        version: "v2.3.1",
                        project: "PRJ-001",
                        rank: 3,
                        change: 2,
                        volume: "165K",
                        difficulty: "High",
                        cvr: "3.2%",
                        isAlert: false,
                      },
                      {
                        keyword: "sleep sounds",
                        version: "v2.3.0",
                        project: "PRJ-002",
                        rank: 5,
                        change: 1,
                        volume: "89K",
                        difficulty: "Medium",
                        cvr: "2.8%",
                        isAlert: false,
                      },
                      {
                        keyword: "calm",
                        version: "v2.3.1",
                        project: "PRJ-001",
                        rank: 8,
                        change: -3,
                        volume: "234K",
                        difficulty: "High",
                        cvr: "1.9%",
                        isAlert: true,
                      },
                      {
                        keyword: "mindfulness",
                        version: "v2.2.5",
                        project: "PRJ-002",
                        rank: 2,
                        change: 0,
                        volume: "76K",
                        difficulty: "Low",
                        cvr: "4.1%",
                        isAlert: false,
                      },
                      {
                        keyword: "relax music",
                        version: "v2.3.0",
                        project: "PRJ-003",
                        rank: 12,
                        change: 5,
                        volume: "45K",
                        difficulty: "Low",
                        cvr: "3.5%",
                        isAlert: false,
                      },
                    ].map((item, idx) => (
                      <TableRow key={idx} className={item.isAlert ? "bg-red-50" : ""}>
                        <TableCell className="font-medium">{item.keyword}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Badge variant="secondary" className="text-xs w-fit cursor-pointer hover:bg-gray-200">
                              {item.version}
                            </Badge>
                            <span className="text-xs text-gray-500">{item.project}</span>
                          </div>
                        </TableCell>
                        <TableCell>#{item.rank}</TableCell>
                        <TableCell>
                          {item.change !== 0 ? (
                            <div
                              className={`flex items-center gap-1 ${item.change > 0 ? "text-green-600" : "text-red-600"}`}
                            >
                              {item.change > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                              <span className="text-sm">{Math.abs(item.change)}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">—</span>
                          )}
                        </TableCell>
                        <TableCell>{item.volume}</TableCell>
                        <TableCell>
                          <Badge
                            variant={item.difficulty === "High" ? "destructive" : "secondary"}
                            className={`text-xs ${item.difficulty === "Medium" ? "bg-yellow-100 text-yellow-700" : ""} ${item.difficulty === "Low" ? "bg-green-100 text-green-700" : ""}`}
                          >
                            {item.difficulty}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.cvr}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            className={`gap-1 bg-transparent ${item.isAlert ? "text-orange-600 border-orange-600" : ""}`}
                          >
                            {item.isAlert ? (
                              <>
                                <AlertCircle className="h-3 w-3" />
                                Alert
                              </>
                            ) : (
                              <>
                                <Search className="h-3 w-3" />
                                Investigate
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Keyword Grouping View */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: "Brand Keywords (5)", rank: "#4.2", volume: "12K", color: "blue" },
                  { label: "Generic Keywords (45)", rank: "#18.5", volume: "890K", color: "purple" },
                  { label: "Competitor Keywords (15)", rank: "#34.2", volume: "234K", color: "orange" },
                  { label: "Long-tail Keywords (20)", rank: "#8.7", volume: "123K", color: "green" },
                ].map((group, idx) => (
                  <Card key={idx} className={`bg-${group.color}-50 border-${group.color}-200`}>
                    <CardContent className="p-4">
                      <p className={`text-sm font-semibold text-${group.color}-900 mb-2`}>{group.label}</p>
                      <p className={`text-xs text-${group.color}-700`}>Average Rank: {group.rank}</p>
                      <p className={`text-xs text-${group.color}-700`}>Total Volume: {group.volume}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visual Asset Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Top 3 Best Performers */}
              <div>
                <h3 className="font-semibold text-sm mb-3 text-green-700">🏆 Top 3 Best Performers</h3>
                <div className="space-y-2">
                  {[
                    {
                      position: 3,
                      name: "Testimonials",
                      clicks: "1,456",
                      impressions: "32,120",
                      ctr: "4.53%",
                      change: 0.8,
                      storeKit: "SK-445",
                      project: "PRJ-002",
                      isBest: true,
                    },
                    {
                      position: 1,
                      name: "Home Screen",
                      clicks: "1,893",
                      impressions: "45,230",
                      ctr: "4.18%",
                      change: 0.3,
                      storeKit: "SK-443",
                      project: "PRJ-001",
                      isBest: false,
                    },
                    {
                      position: 5,
                      name: "Benefits",
                      clicks: "987",
                      impressions: "28,340",
                      ctr: "3.48%",
                      change: 0.2,
                      storeKit: "SK-447",
                      project: "PRJ-003",
                      isBest: false,
                    },
                  ].map((asset, idx) => (
                    <div
                      key={idx}
                      className={`rounded-lg p-3 ${asset.isBest ? "border-2 border-green-500 bg-green-50" : "border bg-gray-50"}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-semibold text-sm">
                            Position {asset.position}: {asset.name}
                          </p>
                          <p className="text-xs text-gray-600 mt-0.5">
                            {asset.clicks} clicks • {asset.impressions} impressions
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-gray-200">
                              {asset.storeKit}
                            </Badge>
                            <span className="text-xs text-gray-500">{asset.project}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${asset.isBest ? "text-green-700" : ""}`}>{asset.ctr}</p>
                          <div className="flex items-center gap-1 text-green-600 text-xs">
                            <ArrowUp className="h-3 w-3" />
                            <span>{asset.change}%</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full gap-1 mt-2 bg-transparent">
                        <ExternalLink className="h-3 w-3" />
                        View in StoreKit
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top 3 Worst Performers */}
              <div>
                <h3 className="font-semibold text-sm mb-3 text-red-700">⚠️ Top 3 Worst Performers</h3>
                <div className="space-y-2">
                  <div className="border-2 border-red-500 rounded-lg p-3 bg-red-50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-sm">Position 4: Pricing</p>
                        <p className="text-xs text-gray-600 mt-0.5">456 clicks • 29,120 impressions</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-gray-200">
                            SK-456
                          </Badge>
                          <span className="text-xs text-gray-500">PRJ-003</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-red-700">1.57%</p>
                        <div className="flex items-center gap-1 text-red-600 text-xs">
                          <ArrowDown className="h-3 w-3" />
                          <span>0.5%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button variant="destructive" size="sm" className="flex-1 gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Alert
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 gap-1 bg-transparent">
                        <ExternalLink className="h-3 w-3" />
                        Fix in StoreKit
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-3 bg-gray-50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-sm">Position 6: Tutorial</p>
                        <p className="text-xs text-gray-600 mt-0.5">623 clicks • 31,450 impressions</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-gray-200">
                            SK-448
                          </Badge>
                          <span className="text-xs text-gray-500">PRJ-002</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">1.98%</p>
                        <div className="flex items-center gap-1 text-red-600 text-xs">
                          <ArrowDown className="h-3 w-3" />
                          <span>0.3%</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full gap-1 mt-2 bg-transparent">
                      <ExternalLink className="h-3 w-3" />
                      View in StoreKit
                    </Button>
                  </div>

                  <div className="border rounded-lg p-3 bg-gray-50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-sm">Position 2: Features</p>
                        <p className="text-xs text-gray-600 mt-0.5">1,234 clicks • 38,450 impressions</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-gray-200">
                            SK-444
                          </Badge>
                          <span className="text-xs text-gray-500">PRJ-001</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">3.21%</p>
                        <div className="flex items-center gap-1 text-red-600 text-xs">
                          <ArrowDown className="h-3 w-3" />
                          <span>0.1%</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full gap-1 mt-2 bg-transparent">
                      <ExternalLink className="h-3 w-3" />
                      View in StoreKit
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>A/B Test History</CardTitle>
              <Button variant="outline" size="sm">
                Create New Test
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Test Name</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Variants</TableHead>
                    <TableHead>Winner</TableHead>
                    <TableHead>Impact</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Date Completed</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Icon Color Variation</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge variant="outline" className="text-xs w-fit border-blue-300 text-blue-700">
                          StoreKit
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="text-xs w-fit cursor-pointer hover:bg-gray-200"
                          title="Click to view in StoreKit Management"
                        >
                          SK-440
                        </Badge>
                        <span className="text-xs text-gray-500">PRJ-001</span>
                        <span className="text-xs text-gray-400">Published: Nov 20, 2024</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs bg-gray-50">
                            A
                          </Badge>
                          <span className="text-xs text-gray-600">Blue Icon (SK-440-A)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-300">
                            B
                          </Badge>
                          <span className="text-xs text-gray-600">Purple Icon (SK-440-B)</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-purple-100 text-purple-700">Variant B (Purple)</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <span className="text-green-600 font-medium text-sm">+21.7% CVR</span>
                        <p className="text-xs text-gray-500">+5.2K downloads</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-gray-600">14 days</span>
                    </TableCell>
                    <TableCell>Dec 15, 2024</TableCell>
                    <TableCell>
                      <Drawer>
                        <DrawerTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                            <FileText className="h-3 w-3" />
                            View Details
                          </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                          <DrawerHeader>
                            <DrawerTitle>A/B Test Details - Icon Color Variation</DrawerTitle>
                            <DrawerDescription>Chi tiết test và kết quả phân tích</DrawerDescription>
                          </DrawerHeader>
                          <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-semibold mb-2">Test Information</p>
                                <div className="space-y-1 text-sm text-gray-600">
                                  <p>Test Type: Icon Design</p>
                                  <p>StoreKit ID: SK-440</p>
                                  <p>Project: PRJ-001</p>
                                  <p>Platform: iOS & Android</p>
                                  <p>Market: US, UK, VN</p>
                                  <p>Duration: 14 days (Nov 20 - Dec 4)</p>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-semibold mb-2">Test Results</p>
                                <div className="space-y-1 text-sm text-gray-600">
                                  <p>Traffic Split: 50/50</p>
                                  <p>Total Impressions: 245K</p>
                                  <p>Statistical Significance: 98%</p>
                                  <p>Winner: Variant B</p>
                                  <p className="text-green-600 font-medium">CVR Lift: +21.7%</p>
                                  <p className="text-green-600">Downloads Gained: +5.2K</p>
                                </div>
                              </div>
                            </div>

                            <div className="border-t pt-4">
                              <p className="text-sm font-semibold mb-2">Variant Comparison</p>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="border rounded-lg p-3 bg-gray-50">
                                  <p className="font-semibold text-sm mb-2">Variant A (Blue)</p>
                                  <div className="space-y-1 text-xs text-gray-600">
                                    <p>Impressions: 122.5K</p>
                                    <p>Downloads: 3.2K</p>
                                    <p>CVR: 2.61%</p>
                                  </div>
                                </div>
                                <div className="border-2 border-purple-300 rounded-lg p-3 bg-purple-50">
                                  <p className="font-semibold text-sm mb-2 text-purple-900">Variant B (Purple) ✓</p>
                                  <div className="space-y-1 text-xs text-purple-900">
                                    <p>Impressions: 122.5K</p>
                                    <p>Downloads: 3.9K</p>
                                    <p className="font-semibold">CVR: 3.18%</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="border-t pt-4">
                              <p className="text-sm font-semibold mb-2">Quick Actions</p>
                              <div className="flex gap-2">
                                <Button className="gap-1">
                                  <ExternalLink className="h-3 w-3" />
                                  View in StoreKit
                                </Button>
                                <Button variant="outline" className="gap-1 bg-transparent">
                                  <Share2 className="h-3 w-3" />
                                  Share Results
                                </Button>
                              </div>
                            </div>
                          </div>
                        </DrawerContent>
                      </Drawer>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">Title Optimization Test</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge variant="outline" className="text-xs w-fit border-green-300 text-green-700">
                          Metadata
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="text-xs w-fit cursor-pointer hover:bg-gray-200"
                          title="Click to view in Metadata Management"
                        >
                          v2.2.8
                        </Badge>
                        <span className="text-xs text-gray-500">PRJ-002</span>
                        <span className="text-xs text-gray-400">Published: Nov 10, 2024</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs bg-gray-50">
                            A
                          </Badge>
                          <span className="text-xs text-gray-600">Short Title</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-300">
                            B
                          </Badge>
                          <span className="text-xs text-gray-600">Long Title + Keywords</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-700">Variant B</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <span className="text-green-600 font-medium text-sm">+15% CVR</span>
                        <p className="text-xs text-gray-500">+3.8K downloads</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-gray-600">21 days</span>
                    </TableCell>
                    <TableCell>Nov 25, 2024</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                        <FileText className="h-3 w-3" />
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">Screenshot Order Test</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge variant="outline" className="text-xs w-fit border-blue-300 text-blue-700">
                          StoreKit
                        </Badge>
                        <Badge variant="secondary" className="text-xs w-fit cursor-pointer hover:bg-gray-200">
                          SK-435
                        </Badge>
                        <span className="text-xs text-gray-500">PRJ-003</span>
                        <span className="text-xs text-gray-400">Published: Nov 3, 2024</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-300">
                            A
                          </Badge>
                          <span className="text-xs text-gray-600">Features First</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs bg-gray-50">
                            B
                          </Badge>
                          <span className="text-xs text-gray-600">Benefits First</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-700">Variant A</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <span className="text-green-600 font-medium text-sm">+8% CTR</span>
                        <p className="text-xs text-gray-500">+1.9K downloads</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-gray-600">14 days</span>
                    </TableCell>
                    <TableCell>Nov 18, 2024</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                        <FileText className="h-3 w-3" />
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">Description Length Test</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge variant="outline" className="text-xs w-fit border-green-300 text-green-700">
                          Metadata
                        </Badge>
                        <Badge variant="secondary" className="text-xs w-fit cursor-pointer hover:bg-gray-200">
                          v2.2.5
                        </Badge>
                        <span className="text-xs text-gray-500">PRJ-001</span>
                        <span className="text-xs text-gray-400">Published: Oct 25, 2024</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-300">
                            A
                          </Badge>
                          <span className="text-xs text-gray-600">Short (800 chars)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs bg-gray-50">
                            B
                          </Badge>
                          <span className="text-xs text-gray-600">Long (4000 chars)</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-700">Variant A (Short)</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <span className="text-green-600 font-medium text-sm">+5% CVR</span>
                        <p className="text-xs text-gray-500">+1.2K downloads</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-gray-600">18 days</span>
                    </TableCell>
                    <TableCell>Nov 10, 2024</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                        <FileText className="h-3 w-3" />
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">App Preview Video Test</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge variant="outline" className="text-xs w-fit border-orange-300 text-orange-700">
                          Both
                        </Badge>
                        <div className="flex gap-1">
                          <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-gray-200">
                            v2.2.3
                          </Badge>
                          <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-gray-200">
                            SK-432
                          </Badge>
                        </div>
                        <span className="text-xs text-gray-500">PRJ-002</span>
                        <span className="text-xs text-gray-400">Published: Oct 10, 2024</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs bg-gray-50">
                            A
                          </Badge>
                          <span className="text-xs text-gray-600">No Video</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs bg-gray-50">
                            B
                          </Badge>
                          <span className="text-xs text-gray-600">With Preview Video</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-gray-100 text-gray-700">No Winner</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <span className="text-gray-600 text-sm">+2% (Not significant)</span>
                        <p className="text-xs text-gray-500">p-value: 0.18</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-gray-600">21 days</span>
                    </TableCell>
                    <TableCell>Oct 28, 2024</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                        <FileText className="h-3 w-3" />
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              {[
                { label: "Total Tests Run", value: "15", sub: "Last 90 days", color: "blue" },
                { label: "Success Rate", value: "73%", sub: "11 tests positive", color: "green" },
                { label: "Avg CVR Lift", value: "+12.3%", sub: "From winning tests", color: "purple" },
                { label: "Total Impact", value: "+28.5K", sub: "Additional downloads", color: "orange" },
              ].map((stat, idx) => (
                <Card key={idx} className={`bg-${stat.color}-50 border-${stat.color}-200`}>
                  <CardContent className="p-4">
                    <p className={`text-sm font-semibold text-${stat.color}-900 mb-1`}>{stat.label}</p>
                    <p className={`text-2xl font-bold text-${stat.color}-900`}>{stat.value}</p>
                    <p className={`text-xs text-${stat.color}-700 mt-1`}>{stat.sub}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Competitor Rankings by Keyword</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                  <ExternalLink className="h-3 w-3" />
                  View Full Analysis
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">Keyword: "meditation"</h3>
                    <Badge
                      variant="secondary"
                      className="text-xs cursor-pointer hover:bg-gray-200"
                      title="From Metadata v2.3.1"
                    >
                      v2.3.1
                    </Badge>
                    <span className="text-xs text-gray-500">PRJ-001</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      165K searches/month
                    </Badge>
                    <Badge className="bg-green-100 text-green-700 text-xs">Rank #3 (↑2)</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-400">#1</span>
                      <span>Calm</span>
                      <Badge variant="outline" className="text-xs border-red-300 text-red-700">
                        Competitor
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">680K downloads</span>
                      <span className="text-xs text-gray-500">CVR: 4.2%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-400">#2</span>
                      <span>Headspace</span>
                      <Badge variant="outline" className="text-xs border-red-300 text-red-700">
                        Competitor
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">450K downloads</span>
                      <span className="text-xs text-gray-500">CVR: 3.8%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm bg-blue-50 -mx-2 px-2 py-1.5 rounded">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-600">#3</span>
                      <span className="font-semibold text-blue-900">You (Meditation Pro)</span>
                      <div className="flex items-center gap-1 text-green-600 text-xs">
                        <ArrowUp className="h-3 w-3" />
                        <span>2 positions</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-blue-700 font-medium">125K downloads</span>
                      <span className="text-xs text-blue-700">CVR: 3.2%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-400">#4</span>
                      <span>Insight Timer</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">98K downloads</span>
                      <span className="text-xs text-gray-500">CVR: 2.9%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-400">#5</span>
                      <span>Simple Habit</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">76K downloads</span>
                      <span className="text-xs text-gray-500">CVR: 2.5%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t">
                  <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <div className="bg-amber-500 text-white rounded-full p-1 mt-0.5">
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-amber-900 mb-1">Competitor Insights</p>
                      <p className="text-xs text-amber-800">
                        Calm và Headspace đang dẫn đầu với CVR cao hơn. Xem xét tối ưu screenshots và app preview video
                        để cải thiện CVR từ 3.2% lên mục tiêu 3.8%.
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline" className="gap-1 h-7 text-xs bg-transparent">
                          <Search className="h-3 w-3" />
                          Analyze Competitors
                        </Button>
                        <Button size="sm" variant="outline" className="gap-1 h-7 text-xs bg-transparent">
                          <ExternalLink className="h-3 w-3" />
                          View in Smart Reporting
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">Keyword: "sleep sounds"</h3>
                    <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-gray-200">
                      v2.3.0
                    </Badge>
                    <span className="text-xs text-gray-500">PRJ-002</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      89K searches/month
                    </Badge>
                    <Badge className="bg-green-100 text-green-700 text-xs">Rank #5 (↑1)</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-400">#1</span>
                      <span>Sleep Cycle</span>
                      <Badge variant="outline" className="text-xs border-red-300 text-red-700">
                        Competitor
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">234K downloads</span>
                      <span className="text-xs text-gray-500">CVR: 5.1%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-400">#2</span>
                      <span>Calm</span>
                      <Badge variant="outline" className="text-xs border-red-300 text-red-700">
                        Competitor
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">198K downloads</span>
                      <span className="text-xs text-gray-500">CVR: 4.3%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-400">#3</span>
                      <span>Relax Melodies</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">145K downloads</span>
                      <span className="text-xs text-gray-500">CVR: 3.9%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-400">#4</span>
                      <span>White Noise</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">112K downloads</span>
                      <span className="text-xs text-gray-500">CVR: 3.2%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm bg-blue-50 -mx-2 px-2 py-1.5 rounded">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-600">#5</span>
                      <span className="font-semibold text-blue-900">You (Meditation Pro)</span>
                      <div className="flex items-center gap-1 text-green-600 text-xs">
                        <ArrowUp className="h-3 w-3" />
                        <span>1 position</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-blue-700 font-medium">89K downloads</span>
                      <span className="text-xs text-blue-700">CVR: 2.8%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t">
                  <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="bg-blue-500 text-white rounded-full p-1 mt-0.5">
                      <CheckCircle2 className="h-3 w-3" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-blue-900 mb-1">Opportunity Detected</p>
                      <p className="text-xs text-blue-800">
                        Từ khóa này có potential cao. Cải thiện metadata với focus vào "sleep" và "sounds" có thể đẩy
                        lên top 3.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">Keyword: "mindfulness"</h3>
                    <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-gray-200">
                      v2.2.5
                    </Badge>
                    <span className="text-xs text-gray-500">PRJ-002</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      76K searches/month
                    </Badge>
                    <Badge className="bg-green-100 text-green-700 text-xs">Rank #2 (New!)</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-400">#1</span>
                      <span>Headspace</span>
                      <Badge variant="outline" className="text-xs border-red-300 text-red-700">
                        Competitor
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">312K downloads</span>
                      <span className="text-xs text-gray-500">CVR: 6.2%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm bg-green-50 -mx-2 px-2 py-1.5 rounded border-2 border-green-500">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-green-600">#2</span>
                      <span className="font-semibold text-green-900">You (Meditation Pro)</span>
                      <Badge className="bg-green-600 text-white text-xs">New Entry! 🎉</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-green-700 font-medium">156K downloads</span>
                      <span className="text-xs text-green-700">CVR: 4.1%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-400">#3</span>
                      <span>Ten Percent Happier</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">98K downloads</span>
                      <span className="text-xs text-gray-500">CVR: 3.5%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-400">#4</span>
                      <span>Calm</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">87K downloads</span>
                      <span className="text-xs text-gray-500">CVR: 3.2%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-400">#5</span>
                      <span>Insight Timer</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">65K downloads</span>
                      <span className="text-xs text-gray-500">CVR: 2.8%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t">
                  <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="bg-green-500 text-white rounded-full p-1 mt-0.5">
                      <CheckCircle2 className="h-3 w-3" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-green-900 mb-1">Great Success!</p>
                      <p className="text-xs text-green-800">
                        Keyword mới "mindfulness" đã đạt vị trí #2! Đây là kết quả từ Metadata v2.2.5 được published 3
                        tuần trước. Tiếp tục theo dõi để giữ vị trí này.
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" className="gap-1 h-7 text-xs bg-green-600 hover:bg-green-700">
                          <Share2 className="h-3 w-3" />
                          Share Team
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-4">
                  <p className="text-sm font-semibold text-red-900 mb-1">Top Competitor</p>
                  <p className="text-lg font-bold text-red-900">Calm</p>
                  <p className="text-xs text-red-700 mt-1">Ranks #1 for 23 keywords</p>
                </CardContent>
              </Card>
              <Card className="bg-orange-50 border-orange-200">
                <CardContent className="p-4">
                  <p className="text-sm font-semibold text-orange-900 mb-1">Competitive Gap</p>
                  <p className="text-lg font-bold text-orange-900">-1.2%</p>
                  <p className="text-xs text-orange-700 mt-1">Avg CVR vs top 2 competitors</p>
                </CardContent>
              </Card>
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <p className="text-sm font-semibold text-blue-900 mb-1">Market Share</p>
                  <p className="text-lg font-bold text-blue-900">8.3%</p>
                  <p className="text-xs text-blue-700 mt-1">Of total category downloads</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Export Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-6 border-2 border-dashed rounded-lg">
                <div>
                  <p className="font-semibold text-sm mb-1">Export Full Report to Excel</p>
                  <p className="text-xs text-gray-600">
                    Includes all KPIs, keyword rankings, visual performance, test history, and competitor data
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <input
                      type="checkbox"
                      id="include-source"
                      className="h-4 w-4 rounded border-gray-300"
                      defaultChecked
                    />
                    <label htmlFor="include-source" className="text-xs text-gray-600 cursor-pointer">
                      Include Source Data (Project ID, Metadata Version, StoreKit ID)
                    </label>
                  </div>
                </div>
                <Button className="gap-2">
                  <Download className="h-4 w-4" />
                  Export to Excel
                </Button>
              </div>

              <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                <div className="flex items-start gap-2">
                  <div className="bg-blue-500 text-white rounded-full p-1">
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-blue-900 mb-1">Auto-sync với Smart Reporting System</p>
                    <p className="text-xs text-blue-800">
                      Toàn bộ dữ liệu tracking, alerts và insights được tự động gửi sang Smart Reporting System để phân
                      tích sâu và tạo AI suggestions. Xem báo cáo chi tiết tại Smart Reporting.
                    </p>
                    <Button variant="outline" size="sm" className="mt-2 gap-1 bg-transparent">
                      <ExternalLink className="h-3 w-3" />
                      View in Smart Reporting
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
