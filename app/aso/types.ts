export type Platform = "android" | "ios"
export type Store = "googleplay" | "appstore"
export type Granularity = "daily" | "weekly" | "monthly"
export type RegionMode = "global" | "countries"
export type Tab = "overview" | "markets" | "keywords" | "ca"
export type DateRangePreset = "7d" | "28d" | "90d" | "custom"

export interface AppItem {
  id: string
  name: string
  iconUrl: string
  store: Store
  platform: Platform
  bundleOrPackage: string
}

export interface FilterState {
  appId: string | null
  store: Store | null
  platform: Platform | null
  dateStart: string
  dateEnd: string
  granularity: Granularity
  regionMode: RegionMode
  countries: string[]
  tab: Tab
}
