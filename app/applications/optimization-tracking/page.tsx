"use client"

import { useState } from "react"
import { ArrowLeft, TestTube, Plus, Play, Pause, TrendingUp, Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const testsData = [
  {
    id: 1,
    name: "Icon Test - Spring Theme",
    type: "Icon",
    status: "running",
    startDate: "2024-09-15",
    endDate: "2024-10-15",
    progress: 65,
    variants: [
      { name: "Variant A (Current)", impressions: 45000, conversions: 1350, cvr: 3.0 },
      { name: "Variant B (New)", impressions: 45000, conversions: 1575, cvr: 3.5 },
    ],
    winner: "B",
  },
  {
    id: 2,
    name: "Screenshot Comparison",
    type: "Screenshots",
    status: "running",
    startDate: "2024-09-20",
    endDate: "2024-10-20",
    progress: 45,
    variants: [
      { name: "Variant A (Current)", impressions: 32000, conversions: 960, cvr: 3.0 },
      { name: "Variant B (New)", impressions: 32000, conversions: 1088, cvr: 3.4 },
    ],
    winner: "B",
  },
  {
    id: 3,
    name: "Description Test - Short vs Long",
    type: "Description",
    status: "completed",
    startDate: "2024-08-01",
    endDate: "2024-09-01",
    progress: 100,
    variants: [
      { name: "Variant A (Short)", impressions: 120000, conversions: 3600, cvr: 3.0 },
      { name: "Variant B (Long)", impressions: 120000, conversions: 4080, cvr: 3.4 },
    ],
    winner: "B",
  },
  {
    id: 4,
    name: "App Name Test",
    type: "Title",
    status: "draft",
    startDate: "2024-10-01",
    endDate: "2024-11-01",
    progress: 0,
    variants: [
      { name: "Variant A (Current)", impressions: 0, conversions: 0, cvr: 0 },
      { name: "Variant B (New)", impressions: 0, conversions: 0, cvr: 0 },
    ],
    winner: null,
  },
]

export default function ABTestingASOPage() {
  const router = useRouter()
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredTests = statusFilter === "all" ? testsData : testsData.filter((test) => test.status === statusFilter)

  const runningTests = testsData.filter((t) => t.status === "running").length
  const completedTests = testsData.filter((t) => t.status === "completed").length
  const avgImprovement = 15.7

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
            <h1 className="text-2xl font-bold text-gray-900">A/B Testing</h1>
            <p className="text-sm text-gray-500">Thử nghiệm hình ảnh, icon, mô tả để tối ưu chuyển đổi</p>
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Create New Test
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Running Tests</p>
                <p className="text-3xl font-bold text-gray-900">{runningTests}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Play className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed Tests</p>
                <p className="text-3xl font-bold text-gray-900">{completedTests}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TestTube className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg CVR Improvement</p>
                <p className="text-3xl font-bold text-green-600">+{avgImprovement}%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Tabs defaultValue="all" onValueChange={setStatusFilter}>
        <TabsList>
          <TabsTrigger value="all">All Tests</TabsTrigger>
          <TabsTrigger value="running">Running</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
        </TabsList>

        <TabsContent value={statusFilter} className="space-y-4 mt-6">
          {filteredTests.map((test) => (
            <Card key={test.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <TestTube className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{test.name}</CardTitle>
                      <CardDescription>
                        {test.startDate} - {test.endDate}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        test.status === "running"
                          ? "bg-blue-100 text-blue-700"
                          : test.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                      }
                    >
                      {test.status}
                    </Badge>
                    <Badge variant="outline">{test.type}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Test Progress</span>
                      <span className="text-sm font-medium">{test.progress}%</span>
                    </div>
                    <Progress value={test.progress} />
                  </div>

                  {/* Variants Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {test.variants.map((variant, idx) => (
                      <div
                        key={idx}
                        className={`p-4 border rounded-lg ${test.winner === (idx === 0 ? "A" : "B") ? "border-green-500 bg-green-50" : "border-gray-200"}`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900">{variant.name}</h4>
                          {test.winner === (idx === 0 ? "A" : "B") && (
                            <Badge className="bg-green-100 text-green-700">Winner</Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <p className="text-xs text-gray-500">Impressions</p>
                            <p className="text-lg font-semibold text-gray-900">
                              {variant.impressions.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Conversions</p>
                            <p className="text-lg font-semibold text-gray-900">
                              {variant.conversions.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">CVR</p>
                            <p className="text-lg font-semibold text-blue-600">{variant.cvr}%</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chart */}
                  {test.status !== "draft" && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Conversion Comparison</h4>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={test.variants}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="cvr" fill="#3b82f6" name="CVR %" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    {test.status === "running" && (
                      <Button variant="outline" size="sm">
                        <Pause className="h-4 w-4 mr-2" />
                        Pause Test
                      </Button>
                    )}
                    {test.status === "draft" && (
                      <Button className="bg-blue-600 hover:bg-blue-700" size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Start Test
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
