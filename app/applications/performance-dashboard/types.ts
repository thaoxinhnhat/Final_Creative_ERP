export type CaLevel = "None" | "Low" | "Medium" | "High"

export interface CaMarketRow {
  market: string
  caLevel: CaLevel
  share: number // 0..1
  deltaCVR: number // -1..1
  deltaRating: number
}

export interface CaDeviceRow {
  device: string
  caLevel: CaLevel
  share: number
  deltaCVR: number
  deltaRating: number
}

export interface CaBreakdownResponse {
  market: CaMarketRow[]
  device: CaDeviceRow[]
}

export interface DashboardFilters {
  appId?: string
  appName?: string
  appStatus?: "live" | "draft"
  dateRange:
    | "7d"
    | "28d"
    | "90d"
    | "180d"
    | "365d"
    | "this_month"
    | "prev_month"
    | "this_quarter"
    | "prev_quarter"
    | "custom"
  from?: string
  to?: string
  granularity: "daily" | "weekly" | "monthly"
  region: string
  tab: "overview" | "markets" | "keywords" | "ca"
  compare?: boolean
  selectedMarkets?: string[]
  os?: "android" | "ios" | "both"
}

export interface AppInfo {
  id: string
  name: string
  iconUrl: string
  store: "google_play" | "app_store"
  platform: "android" | "ios"
  bundleOrPackage: string
  status: "live" | "draft"
}

export interface KPIData {
  impressions: number
  installs: number
  avgRating: number
  cvr: number
  delta: {
    impressions: number
    installs: number
    avgRating: number
    cvr: number
  }
}

export interface TimeSeriesPoint {
  ts: string
  impressions?: number
  installs?: number
  value?: number
}

export interface ComparisonSeries {
  current: TimeSeriesPoint[]
  previous?: TimeSeriesPoint[]
}

export interface MarketData {
  market: string
  impressions: number
  installs: number
  visitors: number
  acquisitions: number
  cvr: number
  peerDeltaCvr: number
}

export interface KeywordData {
  rank: number
  keyword: string
  installs: number
  impressions: number
  cvr: number
  deltaCvr: number
}

export interface CAData {
  available: boolean
  distribution: {
    none: number
    low: number
    medium: number
    high: number
  }
  impact: {
    deltaCvr: number
    deltaRating: number
    spark: number[]
  }
  byMarket: CaMarketRow[]
  byDevice: CaDeviceRow[]
}

export interface DashboardData {
  kpis: KPIData
  series: {
    performance: ComparisonSeries
    cvr: ComparisonSeries
    rating: ComparisonSeries
    visitors: ComparisonSeries
    acquisitions: ComparisonSeries
  }
  markets: MarketData[]
  keywords: KeywordData[]
  ca: CAData
}
