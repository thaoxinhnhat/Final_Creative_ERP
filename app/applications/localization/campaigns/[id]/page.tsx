"use client"

import { useState } from "react"
import { ArrowLeft, Calendar, DollarSign, TrendingUp, Users, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

// Mock campaign data
const campaignData: Record<string, any> = {
  "1": {
    id: "1",
    name: "Summer Sale 2024 - Vietnam",
    market: "Vietnam",
    status: "active",
    startDate: "2024-01-15",
    endDate: "2024-12-31",
    budget: 50000,
    spent: 32500,
    impressions: 1250000,
    installs: 8500,
    conversionRate: 3.2,
    team: ["John Doe", "Jane Smith", "Mike Johnson"],
  },
  "2": {
    id: "2",
    name: "Holiday Campaign - US",
    market: "United States",
    status: "active",
    startDate: "2024-02-01",
    endDate: "2024-12-25",
    budget: 100000,
    spent: 45000,
    impressions: 2500000,
    installs: 15000,
    conversionRate: 4.1,
    team: ["Sarah Wilson", "Tom Brown"],
  },
  "3": {
    id: "3",
    name: "Spring Launch - Japan",
    market: "Japan",
    status: "completed",
    startDate: "2024-03-01",
    endDate: "2024-05-31",
    budget: 75000,
    spent: 73200,
    impressions: 1800000,
    installs: 12000,
    conversionRate: 3.8,
    team: ["Yuki Tanaka", "Kenji Sato"],
  },
}

// Performance data for charts
const performanceData = [
  { date: "Jan", impressions: 150000, installs: 1200, cvr: 2.8 },
  { date: "Feb", impressions: 180000, installs: 1400, cvr: 2.9 },
  { date: "Mar", impressions: 220000, installs: 1800, cvr: 3.1 },
  { date: "Apr", impressions: 250000, installs: 2100, cvr: 3.2 },
  { date: "May", impressions: 280000, installs: 2400, cvr: 3.3 },
  { date: "Jun", impressions: 320000, installs: 2800, cvr: 3.4 },
]

const keywordData = [
  { keyword: "game mobile", rank: 3, volume: 50000, difficulty: "High" },
  { keyword: "casual game", rank: 8, volume: 35000, difficulty: "Medium" },
  { keyword: "puzzle game", rank: 5, volume: 42000, difficulty: "High" },
  { keyword: "free game", rank: 12, volume: 68000, difficulty: "Very High" },
]

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("performance")

  const campaign = campaignData[params.id]

  if (!campaign) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Campaign Not Found</h2>
            <p className="text-gray-500 mb-4">The campaign you're looking for doesn't exist.</p>
            <Button onClick={() => router.push("/applications/localization/campaigns")}>Return to Campaigns</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const budgetProgress = (campaign.spent / campaign.budget) * 100

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{campaign.name}</h1>
            <p className="text-sm text-gray-500">{campaign.market}</p>
          </div>
        </div>
        <Badge
          className={
            campaign.status === "active"
              ? "bg-green-100 text-green-700"
              : campaign.status === "completed"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700"
          }
        >
          {campaign.status}
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Impressions</p>
                <p className="text-2xl font-bold text-gray-900">{campaign.impressions.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Installs</p>
                <p className="text-2xl font-bold text-gray-900">{campaign.installs.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{campaign.conversionRate}%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Budget</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <Progress value={budgetProgress} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Impressions & Installs Trend</CardTitle>
              <CardDescription>Monthly performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="impressions"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Impressions"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="installs"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Installs"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conversion Rate Trend</CardTitle>
              <CardDescription>Monthly CVR performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="cvr" fill="#8b5cf6" name="CVR (%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keywords" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Keyword Performance</CardTitle>
              <CardDescription>Top performing keywords for this campaign</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {keywordData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.keyword}</p>
                      <p className="text-sm text-gray-500">Search Volume: {item.volume.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Rank</p>
                        <p className="text-lg font-bold text-gray-900">#{item.rank}</p>
                      </div>
                      <Badge
                        className={
                          item.difficulty === "High" || item.difficulty === "Very High"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }
                      >
                        {item.difficulty}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>People working on this campaign</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {campaign.team.map((member: string, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{member}</p>
                      <p className="text-sm text-gray-500">Campaign Manager</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Timeline</CardTitle>
              <CardDescription>Important dates and milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Calendar className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Campaign Start</p>
                    <p className="text-sm text-gray-500">{campaign.startDate}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Currently Running</p>
                    <p className="text-sm text-gray-500">Active phase</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Calendar className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Campaign End</p>
                    <p className="text-sm text-gray-500">{campaign.endDate}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
