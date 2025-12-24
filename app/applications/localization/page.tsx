"use client"

import { useState } from "react"
import { ArrowLeft, Save, Eye, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

const markets = [
  { code: "US", name: "United States", flag: "🇺🇸", status: "active" },
  { code: "VN", name: "Vietnam", flag: "🇻🇳", status: "active" },
  { code: "JP", name: "Japan", flag: "🇯🇵", status: "active" },
  { code: "KR", name: "South Korea", flag: "🇰🇷", status: "draft" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", status: "active" },
  { code: "DE", name: "Germany", flag: "🇩🇪", status: "draft" },
]

const marketData: Record<
  string,
  {
    title: string
    subtitle: string
    description: string
  }
> = {
  US: {
    title: "Amazing Puzzle Game",
    subtitle: "Challenge Your Mind Daily",
    description:
      "Discover the ultimate puzzle experience with hundreds of brain-teasing challenges. Train your mind, relax, and have fun! Perfect for all ages, our game offers daily challenges, offline mode, and stunning graphics. Download now and join millions of players worldwide!",
  },
  VN: {
    title: "Trò Chơi Giải Đố Tuyệt Vời",
    subtitle: "Thử Thách Trí Tuệ Mỗi Ngày",
    description:
      "Khám phá trải nghiệm giải đố tuyệt vời với hàng trăm thử thách trí tuệ. Rèn luyện tư duy, thư giãn và vui chơi! Hoàn hảo cho mọi lứa tuổi, trò chơi của chúng tôi cung cấp thử thách hàng ngày, chế độ ngoại tuyến và đồ họa tuyệt đẹp.",
  },
  JP: {
    title: "素晴らしいパズルゲーム",
    subtitle: "毎日頭脳に挑戦",
    description:
      "何百もの頭脳を刺激するチャレンジで究極のパズル体験を発見してください。思考を鍛え、リラックスして楽しみましょう！すべての年齢に最適で、毎日のチャレンジ、オフラインモード、美しいグラフィックスを提供します。",
  },
  KR: {
    title: "놀라운 퍼즐 게임",
    subtitle: "매일 두뇌 도전",
    description:
      "수백 가지 두뇌 자극 도전으로 궁극의 퍼즐 경험을 발견하세요. 생각을 훈련하고 휴식을 취하며 즐거움을 누리세요! 모든 연령대에 완벽하며 일일 도전, 오프라인 모드 및 멋진 그래픽을 제공합니다.",
  },
  GB: {
    title: "Amazing Puzzle Game",
    subtitle: "Challenge Your Mind Daily",
    description:
      "Discover the ultimate puzzle experience with hundreds of brain-teasing challenges. Train your mind, relax, and have fun! Perfect for all ages, our game offers daily challenges, offline mode, and stunning graphics.",
  },
  DE: {
    title: "Erstaunliches Puzzlespiel",
    subtitle: "Fordere deinen Geist täglich",
    description:
      "Entdecke das ultimative Puzzle-Erlebnis mit Hunderten von Herausforderungen. Trainiere deinen Geist, entspanne dich und hab Spaß! Perfekt für alle Altersgruppen, bietet unser Spiel tägliche Herausforderungen, Offline-Modus und atemberaubende Grafiken.",
  },
}

export default function LocalizationPage() {
  const router = useRouter()
  const [selectedMarket, setSelectedMarket] = useState("US")
  const [title, setTitle] = useState(marketData[selectedMarket].title)
  const [subtitle, setSubtitle] = useState(marketData[selectedMarket].subtitle)
  const [description, setDescription] = useState(marketData[selectedMarket].description)

  const titleLimit = 30
  const subtitleLimit = 30
  const descriptionLimit = 4000

  const handleMarketChange = (marketCode: string) => {
    setSelectedMarket(marketCode)
    const data = marketData[marketCode] || { title: "", subtitle: "", description: "" }
    setTitle(data.title)
    setSubtitle(data.subtitle)
    setDescription(data.description)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Markets List */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/applications")}
            className="w-full justify-start mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Apps
          </Button>
          <h2 className="font-semibold text-lg text-gray-900">Markets</h2>
          <p className="text-xs text-gray-500">Select a market to edit</p>
        </div>
        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="p-2 space-y-1">
            {markets.map((market) => (
              <button
                key={market.code}
                onClick={() => handleMarketChange(market.code)}
                className={`w-full p-3 rounded-lg text-left transition-all ${
                  selectedMarket === market.code
                    ? "bg-blue-50 border-2 border-blue-500"
                    : "bg-white border-2 border-transparent hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{market.flag}</span>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-900">{market.code}</p>
                    <p className="text-xs text-gray-500">{market.name}</p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs ${market.status === "active" ? "border-green-500 text-green-700" : "border-gray-400 text-gray-600"}`}
                >
                  {market.status}
                </Badge>
              </button>
            ))}
          </div>
          <div className="p-2">
            <Button variant="outline" size="sm" className="w-full bg-transparent">
              <Plus className="h-4 w-4 mr-2" />
              Add Market
            </Button>
          </div>
        </ScrollArea>
      </div>

      {/* Main Panel - Form */}
      <div className="flex-1 flex">
        <div className="flex-1 overflow-auto">
          <div className="p-6 max-w-3xl">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{markets.find((m) => m.code === selectedMarket)?.flag}</span>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{selectedMarket} - Localization</h1>
                  <p className="text-sm text-gray-500">{markets.find((m) => m.code === selectedMarket)?.name}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview All
                </Button>
                <Button variant="outline">Auto-Translate</Button>
                <Button variant="outline">Copy from US</Button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              {/* Title */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">App Title</CardTitle>
                  <CardDescription>The main title shown in the store</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={titleLimit}
                    className="text-base"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">Recommended: Short and memorable</p>
                    <p
                      className={`text-xs ${title.length > titleLimit ? "text-red-600 font-semibold" : "text-gray-500"}`}
                    >
                      {title.length} / {titleLimit}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Subtitle */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Subtitle</CardTitle>
                  <CardDescription>A brief description below the title</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Input
                    id="subtitle"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    maxLength={subtitleLimit}
                    className="text-base"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">Highlight your unique value</p>
                    <p
                      className={`text-xs ${subtitle.length > subtitleLimit ? "text-red-600 font-semibold" : "text-gray-500"}`}
                    >
                      {subtitle.length} / {subtitleLimit}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Description</CardTitle>
                  <CardDescription>Full app description with features and benefits</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={12}
                    maxLength={descriptionLimit}
                    className="text-base resize-none"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">Include keywords naturally</p>
                    <p
                      className={`text-xs ${description.length > descriptionLimit ? "text-red-600 font-semibold" : "text-gray-500"}`}
                    >
                      {description.length} / {descriptionLimit}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="w-96 bg-white border-l border-gray-200 overflow-auto">
          <div className="p-6 space-y-6 sticky top-0">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Store Preview</h3>
              <p className="text-xs text-gray-500">How it appears in app stores</p>
            </div>

            {/* iOS Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">iOS App Store</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 bg-gradient-to-b from-gray-50 to-white">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm line-clamp-2 mb-1">{title}</h3>
                      <p className="text-xs text-gray-600 line-clamp-1 mb-2">{subtitle}</p>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className="text-yellow-400 text-xs">
                            ★
                          </span>
                        ))}
                        <span className="text-xs text-gray-500 ml-1">4.5 • 10K</span>
                      </div>
                    </div>
                    <Button size="sm" className="bg-blue-600 text-xs h-8 px-4">
                      GET
                    </Button>
                  </div>
                  <div className="border-t pt-3">
                    <p className="text-xs font-semibold text-gray-900 mb-1">About</p>
                    <p className="text-xs text-gray-700 line-clamp-6 leading-relaxed">{description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Android Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Google Play Store</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 bg-white">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-green-400 to-blue-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm line-clamp-2 mb-1">{title}</h3>
                      <p className="text-xs text-green-600 mb-2">Puzzle • Contains ads</p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-medium">4.5 ★</span>
                        <span className="text-gray-500">100K+ downloads</span>
                      </div>
                    </div>
                    <Button size="sm" className="bg-green-600 text-xs h-8 px-4">
                      Install
                    </Button>
                  </div>
                  <div className="border-t pt-3">
                    <p className="text-xs font-semibold text-gray-900 mb-1">About this game</p>
                    <p className="text-xs text-gray-700 line-clamp-6 leading-relaxed">{description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Translation Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Title</span>
                  <Badge className="bg-green-100 text-green-700">Complete</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Subtitle</span>
                  <Badge className="bg-green-100 text-green-700">Complete</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Description</span>
                  <Badge className="bg-green-100 text-green-700">Complete</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
