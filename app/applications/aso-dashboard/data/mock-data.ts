import type { AppInfo, KPIData, SeriesPoint, MarketMetrics, KeywordMetrics, CAData } from "../types"

export const mockApps: AppInfo[] = [
  {
    id: "app-1",
    name: "Fashion Show",
    package: "com.fashionshow.app",
    icon: "👗",
    iconUrl: "/placeholder.svg?height=40&width=40",
    store: "googleplay",
    platform: "android",
    status: "live",
  },
  {
    id: "app-2",
    name: "Style Master",
    package: "com.stylemaster.app",
    icon: "👔",
    iconUrl: "/placeholder.svg?height=40&width=40",
    store: "appstore",
    platform: "ios",
    status: "live",
  },
  {
    id: "app-3",
    name: "Dress Up World",
    package: "com.dressupworld.app",
    icon: "👠",
    iconUrl: "/placeholder.svg?height=40&width=40",
    store: "googleplay",
    platform: "android",
    status: "draft",
  },
  {
    id: "app-4",
    name: "Beauty Hub",
    package: "com.beautyhub.app",
    icon: "💄",
    iconUrl: "/placeholder.svg?height=40&width=40",
    store: "appstore",
    platform: "ios",
    status: "live",
  },
  {
    id: "app-5",
    name: "Wardrobe Manager",
    package: "com.wardrobemanager.app",
    icon: "🎽",
    iconUrl: "/placeholder.svg?height=40&width=40",
    store: "googleplay",
    platform: "android",
    status: "draft",
  },
]

export const countries = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "CN", name: "China", flag: "🇨🇳" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "RU", name: "Russia", flag: "🇷🇺" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "TH", name: "Thailand", flag: "🇹🇭" },
  { code: "VN", name: "Vietnam", flag: "🇻🇳" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩" },
  { code: "PH", name: "Philippines", flag: "🇵🇭" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "NO", name: "Norway", flag: "🇳🇴" },
  { code: "DK", name: "Denmark", flag: "🇩🇰" },
]

export function getMockKPIData(): KPIData {
  return {
    totalImpressions: { value: 2450000, deltaPct: 12.5 },
    conversionRate: { value: 3.42, deltaPct: -2.1 },
    totalInstalls: { value: 83800, deltaPct: 8.3 },
    averageRating: { value: 4.6, deltaPct: 0.8 },
    storeVisitors: { value: 125000, deltaPct: 15.2 },
  }
}

export function getMockSeriesData(): SeriesPoint[] {
  const data: SeriesPoint[] = []
  const baseDate = new Date("2024-01-01")

  for (let i = 0; i < 28; i++) {
    const date = new Date(baseDate)
    date.setDate(date.getDate() + i)

    data.push({
      date: date.toISOString().split("T")[0],
      impressions: Math.floor(80000 + Math.random() * 20000 + i * 500),
      installs: Math.floor(2800 + Math.random() * 400 + i * 20),
      cvr: 3.2 + Math.random() * 0.8,
      rating: 4.5 + Math.random() * 0.3,
      visitors: Math.floor(4200 + Math.random() * 600 + i * 30),
      acquisitions: Math.floor(140 + Math.random() * 30 + i * 2),
      impressions_prev: Math.floor(75000 + Math.random() * 18000 + i * 450),
      installs_prev: Math.floor(2600 + Math.random() * 380 + i * 18),
      cvr_prev: 3.0 + Math.random() * 0.7,
      rating_prev: 4.4 + Math.random() * 0.3,
      visitors_prev: Math.floor(4000 + Math.random() * 550 + i * 28),
      acquisitions_prev: Math.floor(130 + Math.random() * 28 + i * 1.8),
    })
  }

  return data
}

export function getMockMarketData(): MarketMetrics[] {
  return [
    {
      country: "United States",
      countryCode: "US",
      visitors: 45000,
      acquisitions: 1580,
      cvr: 3.51,
      impressions: 850000,
      installs: 29800,
      cvrVsPeers28dPct: 8.2,
      peerMedian: 3.24,
      peerRange: [2.1, 4.8],
    },
    {
      country: "United Kingdom",
      countryCode: "GB",
      visitors: 22000,
      acquisitions: 740,
      cvr: 3.36,
      impressions: 420000,
      installs: 14100,
      cvrVsPeers28dPct: 5.1,
      peerMedian: 3.2,
      peerRange: [2.3, 4.5],
    },
    {
      country: "Japan",
      countryCode: "JP",
      visitors: 18500,
      acquisitions: 650,
      cvr: 3.51,
      impressions: 380000,
      installs: 13300,
      cvrVsPeers28dPct: -2.4,
      peerMedian: 3.6,
      peerRange: [2.8, 4.9],
    },
    {
      country: "Germany",
      countryCode: "DE",
      visitors: 16000,
      acquisitions: 520,
      cvr: 3.25,
      impressions: 340000,
      installs: 11100,
      cvrVsPeers28dPct: 1.8,
      peerMedian: 3.19,
      peerRange: [2.4, 4.3],
    },
    {
      country: "Canada",
      countryCode: "CA",
      visitors: 12500,
      acquisitions: 430,
      cvr: 3.44,
      impressions: 280000,
      installs: 9600,
      cvrVsPeers28dPct: 6.5,
      peerMedian: 3.23,
      peerRange: [2.2, 4.6],
    },
  ]
}

export function getMockKeywordData(): KeywordMetrics[] {
  return [
    {
      rank: 1,
      keyword: "fashion app",
      installs: 12400,
      impressions: 340000,
      cvr: 3.65,
      deltaCvrPct: 8.2,
    },
    {
      rank: 2,
      keyword: "style guide",
      installs: 9800,
      impressions: 280000,
      cvr: 3.5,
      deltaCvrPct: -2.1,
    },
    {
      rank: 3,
      keyword: "wardrobe organizer",
      installs: 8200,
      impressions: 245000,
      cvr: 3.35,
      deltaCvrPct: 5.4,
    },
    {
      rank: 5,
      keyword: "outfit planner",
      installs: 7100,
      impressions: 210000,
      cvr: 3.38,
      deltaCvrPct: 1.8,
    },
    {
      rank: 8,
      keyword: "dress designer",
      installs: 5600,
      impressions: 175000,
      cvr: 3.2,
      deltaCvrPct: -4.2,
    },
  ]
}

export function getMockCAData(): CAData {
  return {
    available: true,
    distribution: {
      none: 45,
      low: 28,
      medium: 18,
      high: 9,
    },
    impact: {
      cvrDeltaVsNonCA: -12.5,
      ratingDeltaVsNonCA: -0.3,
      sparklineDays: [3.8, 3.7, 3.6, 3.5, 3.4, 3.3, 3.2],
    },
    byMarket: [
      {
        country: "US",
        cvrCA: 3.1,
        cvrNonCA: 3.6,
        ratingCA: 4.3,
        ratingNonCA: 4.6,
      },
      {
        country: "GB",
        cvrCA: 2.9,
        cvrNonCA: 3.4,
        ratingCA: 4.2,
        ratingNonCA: 4.5,
      },
      {
        country: "DE",
        cvrCA: 3.0,
        cvrNonCA: 3.3,
        ratingCA: 4.4,
        ratingNonCA: 4.6,
      },
    ],
    byDevice: [
      {
        device: "Samsung Galaxy S23",
        cvrCA: 2.8,
        cvrNonCA: 3.5,
        ratingCA: 4.1,
        ratingNonCA: 4.5,
      },
      {
        device: "Google Pixel 7",
        cvrCA: 3.2,
        cvrNonCA: 3.7,
        ratingCA: 4.4,
        ratingNonCA: 4.7,
      },
      {
        device: "OnePlus 11",
        cvrCA: 2.9,
        cvrNonCA: 3.4,
        ratingCA: 4.2,
        ratingNonCA: 4.6,
      },
    ],
  }
}
