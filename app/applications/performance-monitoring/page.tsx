"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  TrendingUp,
  Download,
  FileText,
  Share2,
  Eye,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  Calendar,
  Users,
  Target,
  Activity,
  ExternalLink,
  ArrowRight,
  Info,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useRouter } from "next/navigation"

export default function PerformanceMonitoringPage() {
  const router = useRouter()
  const [isNewTestModalOpen, setIsNewTestModalOpen] = useState(false)
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null)
  const [selectedInsight, setSelectedInsight] = useState<any>(null)
  const [selectedDataPoint, setSelectedDataPoint] = useState<any>(null)
  const [selectedTest, setSelectedTest] = useState<any>(null)
  const [includeSourceData, setIncludeSourceData] = useState(true)

  // Mock data for charts
  const keywordRankingsData = [
    {
      date: "Sep",
      meditation: 5,
      sleep: 8,
      calm: 12,
      metadata_version: "V2.1",
      project_id: "PRJ-001",
      project_name: "Fall Keyword Optimization",
    },
    {
      date: "Oct",
      meditation: 4,
      sleep: 7,
      calm: 15,
      metadata_version: "V2.2",
      project_id: "PRJ-001",
      project_name: "Fall Keyword Optimization",
    },
    {
      date: "Nov",
      meditation: 3,
      sleep: 6,
      calm: 18,
      metadata_version: "V2.3",
      project_id: "PRJ-002",
      project_name: "Winter Update",
      event: "Metadata Published",
    },
    {
      date: "Dec",
      meditation: 3,
      sleep: 4,
      calm: 18,
      metadata_version: "V2.4",
      project_id: "PRJ-003",
      project_name: "Holiday Campaign",
      event: "Featured",
    },
  ]

  const ctrTrendsData = [
    {
      date: "Week 1",
      screenshot1: 4.2,
      screenshot2: 3.5,
      screenshot3: 4.8,
      storekit_id: "SK-101",
      project_id: "PRJ-002",
      project_name: "Winter Update",
    },
    {
      date: "Week 2",
      screenshot1: 3.8,
      screenshot2: 3.2,
      screenshot3: 5.1,
      storekit_id: "SK-102",
      project_id: "PRJ-002",
      project_name: "Winter Update",
      event: "StoreKit Published",
    },
    {
      date: "Week 3",
      screenshot1: 4.5,
      screenshot2: 3.2,
      screenshot3: 5.3,
      storekit_id: "SK-102",
      project_id: "PRJ-002",
      project_name: "Winter Update",
    },
  ]

  const cvrTrendsData = [
    { date: "Week 1", cvr: 2.5, metadata_version: "V2.3", storekit_id: "SK-101", project_id: "PRJ-002" },
    { date: "Week 2", cvr: 2.7, metadata_version: "V2.4", storekit_id: "SK-102", project_id: "PRJ-003" },
    { date: "Week 3", cvr: 2.84, metadata_version: "V2.4", storekit_id: "SK-102", project_id: "PRJ-003" },
  ]

  const aiInsights = [
    {
      id: "INS-001",
      type: "high",
      title: "Keyword 'anxiety relief' trending +45% in US market",
      description: "Impact: +5K downloads/month estimated",
      source: "Alert #ALR-235",
      relatedMetadata: "V2.4",
      relatedStoreKit: null,
      relatedProject: "PRJ-003",
      projectName: "Holiday Campaign",
      action1: "Add to Title",
      action2: "Schedule Update",
    },
    {
      id: "INS-002",
      type: "warning",
      title: "Screenshot 2 CTR dropped 15% this week",
      description: "Current: 3.2% | Previous: 3.8%",
      source: "Analysis #ANL-445",
      relatedMetadata: null,
      relatedStoreKit: "SK-102",
      relatedProject: "PRJ-002",
      projectName: "Winter Update",
      action1: "Swap Position",
      action2: "View Analytics",
    },
    {
      id: "INS-003",
      type: "success",
      title: "Screenshots with faces have +23% avg CTR",
      description: "Recommendation: Apply to App B and C",
      source: "Pattern #PTN-889",
      relatedMetadata: null,
      relatedStoreKit: "SK-101, SK-102",
      relatedProject: "PRJ-002",
      projectName: "Winter Update",
      action1: "View Pattern",
      action2: "Create Task",
    },
    {
      id: "INS-004",
      type: "opportunity",
      title: "Competitor 'Headspace' dropped from #2 to #5",
      description: "Opportunity to capture their traffic with targeted keywords",
      source: "Alert #ALR-236",
      relatedMetadata: "V2.3",
      relatedStoreKit: null,
      relatedProject: "PRJ-001",
      projectName: "Fall Keyword Optimization",
      action1: "View Keywords",
      action2: "Analyze Gap",
    },
  ]

  const tests = [
    {
      id: "TEST-001",
      name: "Icon Color Purple",
      whatChanged: "Icon design",
      status: "done",
      result: "+12% CVR",
      date: "Nov 25",
      storekit_id: "SK-101",
      project_id: "PRJ-002",
      project_name: "Winter Update",
    },
    {
      id: "TEST-002",
      name: "Winter Keywords",
      whatChanged: "Title + Subtitle",
      status: "running",
      result: "TBD (Day 8)",
      date: "Dec 1",
      metadata_version: "V2.4",
      project_id: "PRJ-003",
      project_name: "Holiday Campaign",
    },
    {
      id: "TEST-003",
      name: "Screenshot Order",
      whatChanged: "Position swap",
      status: "done",
      result: "+8% CTR",
      date: "Nov 18",
      storekit_id: "SK-102",
      project_id: "PRJ-002",
      project_name: "Winter Update",
    },
  ]

  const handleViewInOptimization = (section?: string) => {
    router.push(`/applications/ab-testing${section ? `?section=${section}` : ""}`)
  }

  const handleViewInMetadata = (version: string) => {
    router.push(`/applications/metadata?version=${version}`)
  }

  const handleViewInStoreKit = (id: string) => {
    router.push(`/applications/storekit?id=${id}`)
  }

  const handleCreateProject = (insightData: any) => {
    // Logic to create new project in Project Management
    router.push(
      `/applications/project-management?action=create&source=insight&insight_id=${insightData.id}&priority=${insightData.type === "high" ? "high" : "medium"}`,
    )
  }

  const handleApplyInsight = (insight: any) => {
    setSelectedInsight(insight)
  }

  const handleDataPointClick = (data: any) => {
    setSelectedDataPoint(data)
  }

  const handleViewTest = (test: any) => {
    setSelectedTest(test)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Smart Reporting</h1>
            <p className="text-sm text-gray-600 mt-1">ASO Performance Dashboard & Insights</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              <Activity className="h-3 w-3 mr-1" />
              Auto-refresh: 5 min
            </Badge>
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              Synced with O&T
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6 space-y-8">
        {/* PHẦN 1: DASHBOARD TỔNG QUAN */}
        <section>
          <div className="space-y-4">
            {/* Header Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <Select defaultValue="calm-app">
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select App" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="calm-app">Calm - Meditation App</SelectItem>
                  <SelectItem value="sleep-app">Sleep Sounds</SelectItem>
                  <SelectItem value="yoga-app">Yoga Daily</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="us">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="jp">Japan</SelectItem>
                  <SelectItem value="global">Global</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="OS" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="ios">iOS</SelectItem>
                  <SelectItem value="android">Android</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="30">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 Days</SelectItem>
                  <SelectItem value="30">Last 30 Days</SelectItem>
                  <SelectItem value="90">Last 90 Days</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Performance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Total Downloads */}
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedMetric("downloads")}
              >
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-600">Total Downloads</p>
                      <Download className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-3xl font-bold text-gray-900">125,450</p>
                      <div className="flex items-center gap-1 text-sm">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-green-600 font-medium">15.3%</span>
                        <span className="text-gray-500">vs last period</span>
                      </div>
                    </div>
                    {/* Sparkline */}
                    <div className="h-12 mt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={[
                            { value: 100000 },
                            { value: 105000 },
                            { value: 110000 },
                            { value: 115000 },
                            { value: 125450 },
                          ]}
                        >
                          <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 2: Avg Conversion Rate */}
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedMetric("cvr")}
              >
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-600">Avg Conversion Rate</p>
                      <Target className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-3xl font-bold text-gray-900">2.84%</p>
                      <div className="flex items-center gap-1 text-sm">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-green-600 font-medium">0.4%</span>
                        <span className="text-gray-500">vs last period</span>
                      </div>
                    </div>
                    {/* Sparkline */}
                    <div className="h-12 mt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={[{ value: 2.5 }, { value: 2.6 }, { value: 2.7 }, { value: 2.75 }, { value: 2.84 }]}
                        >
                          <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 3: Top Market */}
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedMetric("market")}
              >
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-600">Top Market</p>
                      <Users className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">🇺🇸 US</span>
                          <span className="text-sm font-bold text-gray-900">45%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "45%" }}></div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">🇬🇧 UK</span>
                          <span className="text-sm font-bold text-gray-900">22%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "22%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 4: Top Platform */}
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedMetric("platform")}
              >
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-600">Top Platform</p>
                      <Activity className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">iOS</span>
                          <span className="text-sm font-bold text-gray-900">60%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: "60%" }}></div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">Android</span>
                          <span className="text-sm font-bold text-gray-900">40%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: "40%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* PHẦN 2: AI ACTIONABLE INSIGHTS */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Actionable Insights</h2>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                Quick Wins
              </CardTitle>
              <CardDescription>AI-powered recommendations based on your data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {aiInsights.map((insight) => {
                const bgColor =
                  insight.type === "high"
                    ? "bg-red-50 border-red-600"
                    : insight.type === "warning"
                      ? "bg-yellow-50 border-yellow-600"
                      : insight.type === "success"
                        ? "bg-green-50 border-green-600"
                        : "bg-blue-50 border-blue-600"

                const iconColor =
                  insight.type === "high"
                    ? "text-red-600"
                    : insight.type === "warning"
                      ? "text-yellow-600"
                      : insight.type === "success"
                        ? "text-green-600"
                        : "text-blue-600"

                const badgeBg =
                  insight.type === "high"
                    ? "bg-red-600"
                    : insight.type === "warning"
                      ? "bg-yellow-600"
                      : insight.type === "success"
                        ? "bg-green-600"
                        : "bg-blue-600"

                const badgeText =
                  insight.type === "high"
                    ? "HIGH PRIORITY"
                    : insight.type === "warning"
                      ? "WARNING"
                      : insight.type === "success"
                        ? "SUCCESS PATTERN"
                        : "OPPORTUNITY"

                const Icon =
                  insight.type === "success" ? CheckCircle : insight.type === "opportunity" ? Lightbulb : AlertCircle

                return (
                  <div key={insight.id} className={`${bgColor} border-l-4 rounded-lg p-4`}>
                    <div className="flex items-start gap-3">
                      <Icon className={`h-5 w-5 ${iconColor} mt-0.5 flex-shrink-0`} />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className={`${badgeBg} text-white`}>{badgeText}</Badge>
                          {insight.type === "high" && (
                            <span className="text-sm font-medium text-gray-600">Act Now</span>
                          )}
                        </div>
                        <p className="font-semibold text-gray-900">{insight.title}</p>
                        <p className="text-sm text-gray-600">{insight.description}</p>

                        {/* Source tracking */}
                        <div className="text-xs text-gray-500 flex flex-wrap items-center gap-2">
                          <span>Source: {insight.source}</span>
                          {insight.relatedMetadata && (
                            <>
                              <span>|</span>
                              <button
                                onClick={() => handleViewInMetadata(insight.relatedMetadata)}
                                className="text-blue-600 hover:underline flex items-center gap-1"
                              >
                                Metadata: {insight.relatedMetadata}
                                <ExternalLink className="h-3 w-3" />
                              </button>
                            </>
                          )}
                          {insight.relatedStoreKit && (
                            <>
                              <span>|</span>
                              <button
                                onClick={() => handleViewInStoreKit(insight.relatedStoreKit)}
                                className="text-purple-600 hover:underline flex items-center gap-1"
                              >
                                StoreKit: {insight.relatedStoreKit}
                                <ExternalLink className="h-3 w-3" />
                              </button>
                            </>
                          )}
                          {insight.relatedProject && (
                            <>
                              <span>|</span>
                              <span className="font-medium">Project: {insight.projectName}</span>
                            </>
                          )}
                        </div>

                        {/* 2 Action Buttons */}
                        <div className="flex items-center gap-2 pt-2">
                          <Button size="sm" onClick={() => handleApplyInsight(insight)}>
                            {insight.action1}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              insight.action2.includes("Analytics") || insight.action2.includes("Gap")
                                ? handleViewInOptimization()
                                : handleCreateProject(insight)
                            }
                          >
                            {insight.action2}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </section>

        {/* PHẦN 3: TREND ANALYSIS */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Trend Analysis</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Keyword Rankings */}
            <Card>
              <CardHeader>
                <CardTitle>Keyword Rankings</CardTitle>
                <CardDescription>Last 90 days performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={keywordRankingsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis reversed domain={[0, 20]} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            return (
                              <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg space-y-2">
                                <p className="font-semibold text-gray-900">{data.date}</p>
                                {payload.map((entry: any) => (
                                  <div key={entry.name} className="text-sm">
                                    <span style={{ color: entry.color }}>{entry.name}: </span>
                                    <span className="font-medium">#{entry.value}</span>
                                  </div>
                                ))}
                                <div className="pt-2 border-t text-xs text-gray-500 space-y-1">
                                  <div>Metadata: {data.metadata_version}</div>
                                  <div>Project: {data.project_name}</div>
                                  {data.event && (
                                    <div className="flex items-center gap-1 text-blue-600 font-medium">
                                      <Info className="h-3 w-3" />
                                      {data.event}
                                    </div>
                                  )}
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full mt-2 bg-transparent"
                                  onClick={() => handleDataPointClick(data)}
                                >
                                  View Details
                                </Button>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="meditation" stroke="#10b981" strokeWidth={2} name="meditation" />
                      <Line type="monotone" dataKey="sleep" stroke="#3b82f6" strokeWidth={2} name="sleep" />
                      <Line type="monotone" dataKey="calm" stroke="#ef4444" strokeWidth={2} name="calm" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">meditation:</span>
                    <span className="font-medium text-green-600">#5 → #3 → #3 (stable)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">sleep:</span>
                    <span className="font-medium text-blue-600">#8 → #6 → #4 (improving)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">calm:</span>
                    <span className="font-medium text-red-600">#12 → #15 → #18 (declining)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chart 2: CTR Trends */}
            <Card>
              <CardHeader>
                <CardTitle>CTR Trends</CardTitle>
                <CardDescription>Screenshot performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={ctrTrendsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 6]} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            return (
                              <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg space-y-2">
                                <p className="font-semibold text-gray-900">{data.date}</p>
                                {payload.map((entry: any) => (
                                  <div key={entry.name} className="text-sm">
                                    <span style={{ color: entry.color }}>{entry.name}: </span>
                                    <span className="font-medium">{entry.value}%</span>
                                  </div>
                                ))}
                                <div className="pt-2 border-t text-xs text-gray-500 space-y-1">
                                  <div>StoreKit: {data.storekit_id}</div>
                                  <div>Project: {data.project_name}</div>
                                  {data.event && (
                                    <div className="flex items-center gap-1 text-purple-600 font-medium">
                                      <Info className="h-3 w-3" />
                                      {data.event}
                                    </div>
                                  )}
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full mt-2 bg-transparent"
                                  onClick={() => handleDataPointClick(data)}
                                >
                                  View Details
                                </Button>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="screenshot1"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        name="Screenshot 1"
                      />
                      <Line
                        type="monotone"
                        dataKey="screenshot2"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        name="Screenshot 2"
                      />
                      <Line
                        type="monotone"
                        dataKey="screenshot3"
                        stroke="#10b981"
                        strokeWidth={2}
                        name="Screenshot 3"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Screenshot 1:</span>
                    <span className="font-medium text-gray-900">4.2% → 3.8% → 4.5%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Screenshot 2:</span>
                    <span className="font-medium text-gray-900">3.5% → 3.2% → 3.2%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Screenshot 3:</span>
                    <span className="font-medium text-green-600">4.8% → 5.1% → 5.3%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chart 3: Overall CVR */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Overall Conversion Rate</CardTitle>
                <CardDescription>Steady growth trend</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={cvrTrendsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 4]} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            return (
                              <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg space-y-2">
                                <p className="font-semibold text-gray-900">{data.date}</p>
                                <div className="text-sm">
                                  <span>CVR: </span>
                                  <span className="font-medium">{data.cvr}%</span>
                                </div>
                                <div className="pt-2 border-t text-xs text-gray-500 space-y-1">
                                  <div>Metadata: {data.metadata_version}</div>
                                  <div>StoreKit: {data.storekit_id}</div>
                                  <div>Project: {data.project_id}</div>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full mt-2 bg-transparent"
                                  onClick={() => handleDataPointClick(data)}
                                >
                                  View Details
                                </Button>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="cvr" stroke="#3b82f6" strokeWidth={3} name="Overall CVR %" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    Overall CVR: <span className="font-medium text-green-600">2.5% → 2.7% → 2.84% (steady growth)</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* PHẦN 4: AUTO REPORTS */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Auto Reports</h2>
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>Automated report delivery to your team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Report Name</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Schedule</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Recipients</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Format</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 text-sm text-gray-900">Weekly ASO Summary</td>
                      <td className="py-3 px-4 text-sm text-gray-600">Mon 9:00 AM</td>
                      <td className="py-3 px-4 text-sm text-gray-600">team-aso@company.com</td>
                      <td className="py-3 px-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Badge variant="outline">PDF</Badge>
                          <Badge variant="outline">Excel</Badge>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 text-sm text-gray-900">Monthly Performance</td>
                      <td className="py-3 px-4 text-sm text-gray-600">1st of month</td>
                      <td className="py-3 px-4 text-sm text-gray-600">marketing@company.com</td>
                      <td className="py-3 px-4 text-sm">
                        <Badge variant="outline">PDF</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 text-sm text-gray-900">Bi-weekly Keywords</td>
                      <td className="py-3 px-4 text-sm text-gray-600">Every 2 weeks</td>
                      <td className="py-3 px-4 text-sm text-gray-600">lead-aso@company.com</td>
                      <td className="py-3 px-4 text-sm">
                        <Badge variant="outline">Excel</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t">
                <Button>
                  <Calendar className="h-4 w-4 mr-2" />
                  New Report Schedule
                </Button>
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Send Report Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* PHẦN 5: SIMPLE TEST TRACKER */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Simple Test Tracker</h2>
          <Card>
            <CardHeader>
              <CardTitle>Active/Recent Tests</CardTitle>
              <CardDescription>Track your ASO experiments and results</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Test Name</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">What Changed</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Result</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Source</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tests.map((test) => (
                      <tr key={test.id} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{test.name}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{test.whatChanged}</td>
                        <td className="py-3 px-4">
                          <Badge
                            className={
                              test.status === "done"
                                ? "bg-green-100 text-green-700"
                                : test.status === "running"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-100 text-gray-700"
                            }
                          >
                            {test.status === "done" ? "Done" : test.status === "running" ? "Running" : "Paused"}
                          </Badge>
                        </td>
                        <td
                          className={`py-3 px-4 text-sm font-medium ${test.result.includes("+") ? "text-green-600" : "text-gray-600"}`}
                        >
                          {test.result}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{test.date}</td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {test.metadata_version && (
                              <button
                                onClick={() => handleViewInMetadata(test.metadata_version!)}
                                className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 flex items-center gap-1"
                              >
                                {test.metadata_version}
                                <ExternalLink className="h-3 w-3" />
                              </button>
                            )}
                            {test.storekit_id && (
                              <button
                                onClick={() => handleViewInStoreKit(test.storekit_id!)}
                                className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded hover:bg-purple-100 flex items-center gap-1"
                              >
                                {test.storekit_id}
                                <ExternalLink className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Button size="sm" variant="outline" onClick={() => handleViewTest(test)}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-4 border-t">
                <Dialog open={isNewTestModalOpen} onOpenChange={setIsNewTestModalOpen}>
                  <DialogTrigger asChild>
                    <Button>+ Log New Test</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Log New Test</DialogTitle>
                      <DialogDescription>
                        Record a new ASO experiment or test. This will sync with Optimization & Tracking.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="test-name">Test Name</Label>
                        <Input id="test-name" placeholder="e.g., Icon Color Purple" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="what-changed">What Changed</Label>
                        <Textarea id="what-changed" placeholder="Describe what you changed in this test..." rows={3} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="expected-result">Expected Result</Label>
                        <Input id="expected-result" placeholder="e.g., +15% CVR" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="start-date">Start Date</Label>
                          <Input id="start-date" type="date" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="end-date">End Date</Label>
                          <Input id="end-date" type="date" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select defaultValue="running">
                          <SelectTrigger id="status">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="running">Running</SelectItem>
                            <SelectItem value="done">Done</SelectItem>
                            <SelectItem value="paused">Paused</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="actual-result">Actual Result</Label>
                        <Input id="actual-result" placeholder="e.g., +12% CVR (leave empty if test is running)" />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsNewTestModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          setIsNewTestModalOpen(false)
                          // Sync with Optimization & Tracking
                        }}
                      >
                        Save & Sync
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* PHẦN 6: EXPORT & SHARE */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Export & Share</h2>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <input
                  type="checkbox"
                  id="include-source"
                  checked={includeSourceData}
                  onChange={(e) => setIncludeSourceData(e.target.checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor="include-source" className="text-sm text-gray-700 cursor-pointer">
                  Include Source Data (Project_ID, Metadata_Version, StoreKit_ID, Alert IDs)
                </Label>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button size="lg">
                  <Download className="h-4 w-4 mr-2" />
                  Export Current View to Excel
                </Button>
                <Button size="lg" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate PDF Report
                </Button>
                <Button size="lg" variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Dashboard Link
                </Button>
              </div>

              <div className="pt-3 border-t text-sm text-gray-600 flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-600" />
                <span>
                  All reports automatically include data from Optimization & Tracking, Project Management, Metadata
                  Management, and StoreKit Management.
                </span>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      <Dialog open={!!selectedMetric} onOpenChange={() => setSelectedMetric(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedMetric === "downloads"
                ? "Total Downloads Breakdown"
                : selectedMetric === "cvr"
                  ? "Conversion Rate Details"
                  : selectedMetric === "market"
                    ? "Market Distribution"
                    : "Platform Distribution"}
            </DialogTitle>
            <DialogDescription>Detailed performance metrics and source tracking</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Current Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  {selectedMetric === "downloads" ? "125,450" : selectedMetric === "cvr" ? "2.84%" : "45%"}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Change vs Last Period</p>
                <p className="text-2xl font-bold text-green-600">
                  {selectedMetric === "downloads" ? "+15.3%" : selectedMetric === "cvr" ? "+0.4%" : "+3.2%"}
                </p>
              </div>
            </div>

            <div className="border-t pt-4 space-y-2">
              <p className="text-sm font-semibold text-gray-900">Source Attribution</p>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Latest Metadata: V2.4 (PRJ-003 - Holiday Campaign)</div>
                <div>Latest StoreKit: SK-102 (PRJ-002 - Winter Update)</div>
                <div>Active A/B Tests: 1</div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedMetric(null)}>
              Close
            </Button>
            <Button onClick={() => handleViewInOptimization()}>
              <ExternalLink className="h-4 w-4 mr-2" />
              View in Optimization & Tracking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedInsight} onOpenChange={() => setSelectedInsight(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Apply Insight: {selectedInsight?.action1}</DialogTitle>
            <DialogDescription>Preview and confirm the action</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p className="font-semibold text-gray-900">{selectedInsight?.title}</p>
              <p className="text-sm text-gray-600">{selectedInsight?.description}</p>
            </div>

            <div className="space-y-2">
              <Label>Preview of Changes</Label>
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm">
                <p className="font-medium">This will create a new Project in Project Management with:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                  <li>Priority: {selectedInsight?.type === "high" ? "High" : "Medium"}</li>
                  <li>Scope: {selectedInsight?.relatedMetadata ? "Metadata Update" : "StoreKit Update"}</li>
                  <li>Source: {selectedInsight?.source}</li>
                  <li>Estimated Impact: {selectedInsight?.description}</li>
                </ul>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedInsight(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleCreateProject(selectedInsight)
                setSelectedInsight(null)
              }}
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Create Project & Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedDataPoint} onOpenChange={() => setSelectedDataPoint(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Performance Details - {selectedDataPoint?.date}</DialogTitle>
            <DialogDescription>Detailed breakdown and source tracking</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Metadata Version</p>
                <button
                  onClick={() => handleViewInMetadata(selectedDataPoint?.metadata_version)}
                  className="text-blue-600 hover:underline flex items-center gap-1"
                >
                  {selectedDataPoint?.metadata_version}
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">StoreKit ID</p>
                <button
                  onClick={() => handleViewInStoreKit(selectedDataPoint?.storekit_id)}
                  className="text-purple-600 hover:underline flex items-center gap-1"
                >
                  {selectedDataPoint?.storekit_id}
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-600">Project</p>
              <p className="font-medium text-gray-900">{selectedDataPoint?.project_name}</p>
            </div>

            {selectedDataPoint?.event && (
              <div className="bg-blue-50 border border-blue-200 rounded p-3 flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Event: {selectedDataPoint.event}</span>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedDataPoint(null)}>
              Close
            </Button>
            <Button onClick={() => handleViewInOptimization()}>View Full Analysis in O&T</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedTest} onOpenChange={() => setSelectedTest(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedTest?.name}</DialogTitle>
            <DialogDescription>A/B Test Details and Performance</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">What Changed</p>
                <p className="font-medium text-gray-900">{selectedTest?.whatChanged}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Result</p>
                <p
                  className={`font-bold text-lg ${selectedTest?.result.includes("+") ? "text-green-600" : "text-gray-900"}`}
                >
                  {selectedTest?.result}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-600">Source</p>
              <div className="flex gap-2">
                {selectedTest?.metadata_version && (
                  <button
                    onClick={() => handleViewInMetadata(selectedTest.metadata_version!)}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 flex items-center gap-1"
                  >
                    Metadata: {selectedTest.metadata_version}
                    <ExternalLink className="h-4 w-4" />
                  </button>
                )}
                {selectedTest?.storekit_id && (
                  <button
                    onClick={() => handleViewInStoreKit(selectedTest.storekit_id!)}
                    className="px-3 py-1 bg-purple-50 text-purple-700 rounded hover:bg-purple-100 flex items-center gap-1"
                  >
                    StoreKit: {selectedTest.storekit_id}
                    <ExternalLink className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-600">Project</p>
              <p className="font-medium text-gray-900">{selectedTest?.project_name}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedTest(null)}>
              Close
            </Button>
            <Button onClick={() => handleViewInOptimization("ab-test")}>View in A/B Test History</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
