export type OS = "android" | "ios"
export type Store = "googleplay" | "appstore"
export type Granularity = "day" | "week" | "month"
export type RegionMode = "global" | "countries"
export type Tab = "overview" | "markets" | "keywords" | "ca"
export type AppStatus = "live" | "draft"

export interface ChartFilters {
  appId: string
  store: Store
  platform: OS
  dateStart: string // YYYY-MM-DD
  dateEnd: string // YYYY-MM-DD
  granularity: Granularity
  regionMode: RegionMode
  countries: string[] // ISO2 codes
  tab?: Tab
}

export interface AppInfo {
  id: string
  name: string
  package: string
  icon: string
  iconUrl: string
  store: Store
  platform: OS
  status: AppStatus
}

export interface KPIData {
  totalImpressions: { value: number; deltaPct: number }
  conversionRate: { value: number; deltaPct: number }
  totalInstalls: { value: number; deltaPct: number }
  averageRating: { value: number; deltaPct: number }
  storeVisitors: { value: number; deltaPct: number }
}

export interface SeriesPoint {
  date: string
  impressions: number
  installs: number
  cvr: number
  rating: number
  visitors: number
  acquisitions: number
  impressions_prev?: number
  installs_prev?: number
  cvr_prev?: number
  rating_prev?: number
  visitors_prev?: number
  acquisitions_prev?: number
}

export interface MarketMetrics {
  country: string
  countryCode: string
  visitors: number
  acquisitions: number
  cvr: number
  impressions: number
  installs: number
  cvrVsPeers28dPct: number
  peerMedian: number
  peerRange: [number, number]
}

export interface KeywordMetrics {
  rank: number
  keyword: string
  installs: number
  impressions: number
  cvr: number
  deltaCvrPct: number
}

export interface KeywordTrendPoint {
  date: string
  impressions: number
  installs: number
  cvr: number
}

export interface CADistribution {
  none: number
  low: number
  medium: number
  high: number
}

export interface CAImpact {
  cvrDeltaVsNonCA: number
  ratingDeltaVsNonCA: number
  sparklineDays: number[]
}

export interface CAByMarket {
  country: string
  cvrCA: number
  cvrNonCA: number
  ratingCA: number
  ratingNonCA: number
}

export interface CAByDevice {
  device: string
  cvrCA: number
  cvrNonCA: number
  ratingCA: number
  ratingNonCA: number
}

export interface CAData {
  available: boolean
  distribution: CADistribution
  impact: CAImpact
  byMarket: CAByMarket[]
  byDevice: CAByDevice[]
}
