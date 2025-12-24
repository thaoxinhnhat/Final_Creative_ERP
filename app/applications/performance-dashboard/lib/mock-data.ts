import type { DashboardData, AppInfo, TimeSeriesPoint } from "../types"
import { getPreviousDateRange } from "./date-utils"
import { addDays, format } from "date-fns"

export const mockApps: AppInfo[] = [
  {
    id: "app1",
    name: "Puzzle Master",
    iconUrl: "/placeholder.svg?height=32&width=32",
    store: "google_play",
    platform: "android",
    bundleOrPackage: "com.example.puzzlemaster",
    status: "live",
  },
  {
    id: "app2",
    name: "Brain Training Pro",
    iconUrl: "/placeholder.svg?height=32&width=32",
    store: "app_store",
    platform: "ios",
    bundleOrPackage: "com.example.braintraining",
    status: "live",
  },
  {
    id: "app3",
    name: "Quiz Challenge",
    iconUrl: "/placeholder.svg?height=32&width=32",
    store: "google_play",
    platform: "android",
    bundleOrPackage: "com.example.quiz",
    status: "draft",
  },
]

function generateTimeSeries(
  from: string,
  to: string,
  granularity: "daily" | "weekly" | "monthly",
  baseValue: number,
  variance: number,
): TimeSeriesPoint[] {
  const start = new Date(from)
  const end = new Date(to)
  const points: TimeSeriesPoint[] = []

  let current = new Date(start)
  const step = granularity === "daily" ? 1 : granularity === "weekly" ? 7 : 30

  while (current <= end) {
    const value = baseValue + (Math.random() - 0.5) * variance
    points.push({
      ts: format(current, "yyyy-MM-dd"),
      value: Math.max(0, value),
    })
    current = addDays(current, step)
  }

  return points
}

function generatePerformanceSeries(
  from: string,
  to: string,
  granularity: "daily" | "weekly" | "monthly",
): TimeSeriesPoint[] {
  const start = new Date(from)
  const end = new Date(to)
  const points: TimeSeriesPoint[] = []

  let current = new Date(start)
  const step = granularity === "daily" ? 1 : granularity === "weekly" ? 7 : 30

  while (current <= end) {
    const impressions = 50000 + Math.random() * 20000
    const installs = impressions * (0.03 + Math.random() * 0.02)
    points.push({
      ts: format(current, "yyyy-MM-dd"),
      impressions: Math.floor(impressions),
      installs: Math.floor(installs),
    })
    current = addDays(current, step)
  }

  return points
}

export function generateMockData(
  granularity: "daily" | "weekly" | "monthly",
  from: string,
  to: string,
  withComparison = false,
  selectedMarkets?: string[],
): DashboardData {
  const currentPerformance = generatePerformanceSeries(from, to, granularity)
  const currentCvr = generateTimeSeries(from, to, granularity, 3.5, 0.5)
  const currentRating = generateTimeSeries(from, to, granularity, 4.3, 0.3)
  const currentVisitors = generateTimeSeries(from, to, granularity, 45000, 10000)
  const currentAcquisitions = generateTimeSeries(from, to, granularity, 1500, 300)

  let previousPerformance: TimeSeriesPoint[] | undefined
  let previousCvr: TimeSeriesPoint[] | undefined
  let previousRating: TimeSeriesPoint[] | undefined
  let previousVisitors: TimeSeriesPoint[] | undefined
  let previousAcquisitions: TimeSeriesPoint[] | undefined

  if (withComparison) {
    const prevRange = getPreviousDateRange(from, to)
    previousPerformance = generatePerformanceSeries(prevRange.from, prevRange.to, granularity)
    previousCvr = generateTimeSeries(prevRange.from, prevRange.to, granularity, 3.2, 0.5)
    previousRating = generateTimeSeries(prevRange.from, prevRange.to, granularity, 4.1, 0.3)
    previousVisitors = generateTimeSeries(prevRange.from, prevRange.to, granularity, 42000, 10000)
    previousAcquisitions = generateTimeSeries(prevRange.from, prevRange.to, granularity, 1400, 300)
  }

  const allMarkets = [
    "United States",
    "Vietnam",
    "Japan",
    "South Korea",
    "United Kingdom",
    "Germany",
    "France",
    "Brazil",
  ]

  const marketsToShow = selectedMarkets && selectedMarkets.length > 0 ? selectedMarkets : allMarkets

  const markets = marketsToShow.map((market) => ({
    market,
    impressions: Math.floor(30000 + Math.random() * 50000),
    installs: Math.floor(1000 + Math.random() * 2000),
    visitors: Math.floor(25000 + Math.random() * 40000),
    acquisitions: Math.floor(800 + Math.random() * 1500),
    cvr: 3.2 + Math.random() * 1.5,
    peerDeltaCvr: (Math.random() - 0.5) * 2,
  }))

  const keywords = Array.from({ length: 10 }, (_, i) => ({
    rank: i + 1,
    keyword: `keyword ${i + 1}`,
    installs: Math.floor(500 + Math.random() * 1000),
    impressions: Math.floor(10000 + Math.random() * 20000),
    cvr: 3 + Math.random() * 2,
    deltaCvr: (Math.random() - 0.5) * 1,
  }))

  return {
    kpis: {
      impressions: 2500000,
      installs: 85000,
      avgRating: 4.3,
      cvr: 3.4,
      delta: {
        impressions: 12.5,
        installs: 8.3,
        avgRating: 0.2,
        cvr: 0.3,
      },
    },
    series: {
      performance: {
        current: currentPerformance,
        previous: previousPerformance,
      },
      cvr: {
        current: currentCvr,
        previous: previousCvr,
      },
      rating: {
        current: currentRating,
        previous: previousRating,
      },
      visitors: {
        current: currentVisitors,
        previous: previousVisitors,
      },
      acquisitions: {
        current: currentAcquisitions,
        previous: previousAcquisitions,
      },
    },
    markets,
    keywords,
    ca: {
      available: true,
      distribution: {
        none: 45,
        low: 25,
        medium: 20,
        high: 10,
      },
      impact: {
        deltaCvr: 1.2,
        deltaRating: 0.3,
        spark: [0.8, 1.0, 1.2, 1.5, 1.3, 1.1],
      },
      byMarket: [],
      byDevice: [],
    },
  }
}
