"use client"

import { useState } from "react"
import { ArrowLeft, Save, Eye, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

const markets = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "VN", name: "Vietnam", flag: "🇻🇳" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
]

const platforms = ["iOS", "Android"]

export default function MetadataMgmtPage() {
  const router = useRouter()
  const [selectedMarket, setSelectedMarket] = useState("US")
  const [selectedPlatform, setSelectedPlatform] = useState("iOS")
  const [title, setTitle] = useState("Amazing Puzzle Game")
  const [subtitle, setSubtitle] = useState("Relax and Challenge Your Mind")
  const [description, setDescription] = useState(
    "Discover the most addictive puzzle game of 2024! With hundreds of levels, stunning graphics, and challenging gameplay, this game will keep you entertained for hours. Download now and start your puzzle adventure!",
  )
  const [keywords, setKeywords] = useState("puzzle, game, brain, challenge, fun")

  const titleLimit = selectedPlatform === "iOS" ? 30 : 50
  const subtitleLimit = 30
  const descriptionLimit = selectedPlatform === "iOS" ? 4000 : 4000
  const keywordsLimit = 100

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
            <h1 className="text-2xl font-bold text-gray-900">Metadata Management</h1>
            <p className="text-sm text-gray-500">Quản lý tiêu đề, mô tả, từ khóa metadata cho ứng dụng</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Market & Platform Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Market & Platform</CardTitle>
          <CardDescription>Choose the market and platform to edit metadata</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Market</Label>
              <Select value={selectedMarket} onValueChange={setSelectedMarket}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {markets.map((market) => (
                    <SelectItem key={market.code} value={market.code}>
                      <div className="flex items-center gap-2">
                        <span>{market.flag}</span>
                        <span>{market.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Platform</Label>
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((platform) => (
                    <SelectItem key={platform} value={platform}>
                      {platform}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metadata Editor */}
      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>App Title</CardTitle>
              <CardDescription>The name of your app as it appears in the store</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="title">Title</Label>
                  <span className={`text-xs ${title.length > titleLimit ? "text-red-600" : "text-gray-500"}`}>
                    {title.length} / {titleLimit}
                  </span>
                </div>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={titleLimit} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subtitle</CardTitle>
              <CardDescription>A short description that appears below the title</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <span className={`text-xs ${subtitle.length > subtitleLimit ? "text-red-600" : "text-gray-500"}`}>
                    {subtitle.length} / {subtitleLimit}
                  </span>
                </div>
                <Input
                  id="subtitle"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  maxLength={subtitleLimit}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="description">
          <Card>
            <CardHeader>
              <CardTitle>App Description</CardTitle>
              <CardDescription>Detailed description of your app's features and benefits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="description">Description</Label>
                  <span
                    className={`text-xs ${description.length > descriptionLimit ? "text-red-600" : "text-gray-500"}`}
                  >
                    {description.length} / {descriptionLimit}
                  </span>
                </div>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={12}
                  maxLength={descriptionLimit}
                  className="resize-none"
                />
                <div className="flex items-center gap-2 mt-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    AI Optimize
                  </Button>
                  <Button variant="outline" size="sm">
                    Translate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keywords">
          <Card>
            <CardHeader>
              <CardTitle>App Keywords</CardTitle>
              <CardDescription>Keywords help users discover your app in search</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="keywords">Keywords (comma separated)</Label>
                    <span className={`text-xs ${keywords.length > keywordsLimit ? "text-red-600" : "text-gray-500"}`}>
                      {keywords.length} / {keywordsLimit}
                    </span>
                  </div>
                  <Textarea
                    id="keywords"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    rows={4}
                    maxLength={keywordsLimit}
                    placeholder="Enter keywords separated by commas"
                  />
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Suggested Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {["puzzle game", "brain training", "casual", "offline", "free"].map((keyword) => (
                      <Badge
                        key={keyword}
                        variant="outline"
                        className="cursor-pointer hover:bg-blue-100"
                        onClick={() => setKeywords(keywords + (keywords ? ", " : "") + keyword)}
                      >
                        + {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Keyword Tips</h4>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Use relevant keywords that describe your app's features</li>
                    <li>• Separate keywords with commas</li>
                    <li>• Avoid repetition and brand names</li>
                    <li>• Focus on high-volume, low-competition keywords</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>iOS App Store Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-6 bg-white">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-600" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{title}</h3>
                      <p className="text-sm text-gray-600">{subtitle}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className="text-yellow-400">
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">4.8</span>
                      </div>
                    </div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      GET
                    </Button>
                  </div>
                  <div className="mt-6">
                    <h4 className="font-semibold mb-2">About</h4>
                    <p className="text-sm text-gray-700 line-clamp-3">{description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Google Play Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-6 bg-white">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-green-400 to-blue-600" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{title}</h3>
                      <p className="text-xs text-green-600 mb-1">Puzzle • In-app purchases</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">4.7 ★</span>
                        <span className="text-xs text-gray-500">1M+ downloads</span>
                      </div>
                    </div>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Install
                    </Button>
                  </div>
                  <div className="mt-6">
                    <h4 className="font-semibold mb-2 text-sm">About this game</h4>
                    <p className="text-sm text-gray-700 line-clamp-3">{description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
