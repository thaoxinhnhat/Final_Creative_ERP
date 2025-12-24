// Unified color palette for 1★→5★ ratings
export const STAR_COLORS = {
  one: "#2D7FF9", // 1★ - Blue
  two: "#59C4FF", // 2★ - Light Blue
  three: "#F5C04E", // 3★ - Yellow
  four: "#7AD77A", // 4★ - Light Green
  five: "#2BB673", // 5★ - Green
}

// Compact number formatting with K/M suffix
export const compact = (n: number): string => {
  if (n >= 1_000_000) {
    const decimal = n % 1_000_000 ? 1 : 0
    return `${(n / 1_000_000).toFixed(decimal)}M`
  }
  if (n >= 1_000) {
    const decimal = n % 1_000 ? 1 : 0
    return `${(n / 1_000).toFixed(decimal)}K`
  }
  return `${n}`
}

// Percentage calculation with 1 decimal place
export const pct = (part: number, total: number): string => {
  if (!total) return "0.0%"
  return `${((part / total) * 100).toFixed(1)}%`
}

// Format full number with thousand separators (for tooltips)
export const formatFull = (n: number): string => {
  return n.toLocaleString()
}

// Breakdown data types
export type BreakdownRow = {
  key: string // e.g., "United States" / "Android 14" / "English"
  count: number // number of ratings
  avg: number // average rating
  deepLink?: string // optional Explore →
}

export type BreakdownBlock = {
  dimension: "country" | "language" | "appVersion" | "osVersion" | "formFactor" | "device" | "carrier"
  rows: BreakdownRow[]
  total: number
  updatedAt: string
}

// Other sentiment/chart colors
export const CHART_COLORS = {
  positive: "#22c55e",
  neutral: "#eab308",
  negative: "#ef4444",
  yourApp: "#3b82f6",
  peer: "#94a3b8",
}
