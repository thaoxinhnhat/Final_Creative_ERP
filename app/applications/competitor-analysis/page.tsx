"use client"

import { useState } from "react"
import { ArrowLeft, Plus, Download, TrendingUp, TrendingDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

const competitorsData = [
  {
    id: 1,
    appId: "com.competitor.app1",
    name: "Competitor App 1",
    title: "Best Puzzle Game - Brain Training",
    subtitle: "Challenge Your Mind Daily",
    keywords: "puzzle, brain, game, training",
    avgRank: 12,
    downloads: "500K+",
    rating: 4.5,
  },
  {
    id: 2,
    appId: "com.competitor.app2",
    name: "Competitor App 2",
    title: "Puzzle Master - Fun Games",
    subtitle: "Solve & Relax",
    keywords: "puzzle, casual, fun, offline",
    avgRank: 8,
    downloads: "1M+",
    rating: 4.7,
  },
  {
    id: 3,
    appId: "com.competitor.app3",
    name: "Competitor App 3",
    title: "Brain Games - IQ Test",
    subtitle: "Train Your Brain",
    keywords: "brain, IQ, test, training",
    avgRank: 15,
    downloads: "200K+",
    rating: 4.3,
  },
]

const rankingTrendData = [
  { date: "Week 1", yourApp: 10, competitor1: 12, competitor2: 8, competitor3: 15 },
  { date: "Week 2", yourApp: 9, competitor1: 11, competitor2: 9, competitor3: 14 },
  { date: "Week 3", yourApp: 8, competitor1: 13, competitor2: 7, competitor3: 16 },
  { date: "Week 4", yourApp: 7, competitor1: 12, competitor2: 8, competitor3: 15 },
  { date: "Week 5", yourApp: 6, competitor1: 14, competitor2: 9, competitor3: 17 },
  { date: "Week 6", yourApp: 5, competitor1: 12, competitor2: 8, competitor3: 15 },
]

const keywordComparisonData = [
  {
    keyword: "puzzle game",
    yourApp: 5,
    competitor1: 12,
    competitor2: 8,
    volume: 50000,
  },
  {
    keyword: "brain training",
    yourApp: 3,
    competitor1: 15,
    competitor2: 10,
    volume: 35000,
  },
  {
    keyword: "casual game",
    yourApp: 8,
    competitor1: 20,
    competitor2: 5,
    volume: 42000,
  },
  {
    keyword: "offline game",
    yourApp: 12,
    competitor1: 8,
    competitor2: 18,
    volume: 28000,
  },
]

export default function CompetitorAnalysisPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [newCompetitorId, setNewCompetitorId] = useState("")

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
            <h1 className="text-2xl font-bold text-gray-900">Competitor Analysis</h1>
            <p className="text-sm text-gray-500">Phân tích đối thủ về từ khóa và xếp hạng</p>
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Add Competitor */}
      <Card>
        <CardHeader>
          <CardTitle>Add Competitor</CardTitle>
          <CardDescription>Enter competitor app ID to track and analyze</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="com.competitor.appid"
              value={newCompetitorId}
              onChange={(e) => setNewCompetitorId(e.target.value)}
              className="flex-1"
            />
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Competitor
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Ranking Trend Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Keyword Ranking Trend</CardTitle>
          <CardDescription>Compare your app's ranking with competitors over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={rankingTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis reversed domain={[0, 20]} label={{ value: "Rank", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="yourApp" stroke="#3b82f6" strokeWidth={3} name="Your App" />
              <Line type="monotone" dataKey="competitor1" stroke="#ef4444" strokeWidth={2} name="Competitor 1" />
              <Line type="monotone" dataKey="competitor2" stroke="#f59e0b" strokeWidth={2} name="Competitor 2" />
              <Line type="monotone" dataKey="competitor3" stroke="#8b5cf6" strokeWidth={2} name="Competitor 3" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Keyword Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Keyword Ranking Comparison</CardTitle>
          <CardDescription>Compare keyword rankings across competitors</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Keyword</TableHead>
                <TableHead>Volume</TableHead>
                <TableHead>Your App</TableHead>
                <TableHead>Competitor 1</TableHead>
                <TableHead>Competitor 2</TableHead>
                <TableHead>Advantage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keywordComparisonData.map((item, index) => {
                const bestRank = Math.min(item.yourApp, item.competitor1, item.competitor2)
                const isYourAppBest = item.yourApp === bestRank

                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.keyword}</TableCell>
                    <TableCell>{item.volume.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={isYourAppBest ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                        #{item.yourApp}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">#{item.competitor1}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">#{item.competitor2}</Badge>
                    </TableCell>
                    <TableCell>
                      {isYourAppBest ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-sm font-medium">Leading</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-orange-600">
                          <TrendingDown className="h-4 w-4" />
                          <span className="text-sm font-medium">Behind</span>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Competitor Metadata Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Metadata Comparison</CardTitle>
          <CardDescription>Compare title, subtitle, and description with competitors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {competitorsData.map((competitor) => (
              <div key={competitor.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{competitor.name}</h3>
                    <p className="text-xs text-gray-500">{competitor.appId}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Avg Rank</p>
                      <p className="text-lg font-bold text-gray-900">#{competitor.avgRank}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Downloads</p>
                      <p className="text-sm font-medium text-gray-900">{competitor.downloads}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Rating</p>
                      <p className="text-sm font-medium text-yellow-600">★ {competitor.rating}</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Title</p>
                    <p className="text-sm font-medium text-gray-900">{competitor.title}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Subtitle</p>
                    <p className="text-sm text-gray-700">{competitor.subtitle}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Keywords</p>
                    <p className="text-sm text-gray-700">{competitor.keywords}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
