export type AppMarketMetrics = {
  downloads30d?: number
  revenue30d?: number
  dau30d?: number
  timeSpentMonthly?: number // minutes per user/day
  sessionsMonthly?: number
  websiteVisitsMonthly?: number | null
  rating?: number
  ratingCount?: number
  topCountries?: string[] // for region=global
  monetization?: string[] // Free to Play, Ads, IAP, LiveOps...
  category?: string // Games • Casual, Puzzle
  notes?: string[] // highlight text per market
}

export type AppByMarket = {
  android: {
    [regionCode: string]: AppMarketMetrics
  }
  ios: {
    [regionCode: string]: AppMarketMetrics
  }
}

export const mockAppMarket: Record<string, AppByMarket> = {
  // Fashion Show app
  "1": {
    android: {
      global: {
        downloads30d: 24500000,
        revenue30d: 20000,
        dau30d: 3287,
        rating: 4.7,
        ratingCount: 12543,
        timeSpentMonthly: 24.5,
        sessionsMonthly: 45892,
        websiteVisitsMonthly: null,
        monetization: ["Free to Play", "Ads", "In-App Purchases"],
        category: "Games • Casual, Puzzle",
        topCountries: ["🇺🇸 US", "🇯🇵 Japan", "🇻🇳 Vietnam", "🇰🇷 South Korea"],
        notes: ["Strong growth in Tier-1 EN markets", "Stable retention in LATAM"],
      },
      us: {
        downloads30d: 2000000,
        revenue30d: 12000,
        dau30d: 1500,
        rating: 4.6,
        ratingCount: 5400,
        timeSpentMonthly: 22.1,
        sessionsMonthly: 19876,
        websiteVisitsMonthly: 1200,
        category: "Games • Casual, Puzzle",
        monetization: ["Free to Play", "Ads", "In-App Purchases"],
        notes: ["Spike after feature on 08/20", "High ARPDAU from IAP campaigns"],
      },
      jp: {
        downloads30d: 350000,
        revenue30d: 4200,
        dau30d: 420,
        rating: 4.5,
        ratingCount: 1300,
        timeSpentMonthly: 26.8,
        sessionsMonthly: 6310,
        websiteVisitsMonthly: 380,
        category: "Games • Casual, Puzzle",
        monetization: ["Free to Play", "IAP"],
        notes: ['Keyword "パズル" rank ↑', "Users prefer anime style creatives"],
      },
      vn: {
        downloads30d: 480000,
        revenue30d: 1800,
        dau30d: 520,
        rating: 4.8,
        ratingCount: 2100,
        timeSpentMonthly: 28.3,
        sessionsMonthly: 7890,
        websiteVisitsMonthly: 120,
        category: "Games • Casual, Puzzle",
        monetization: ["Free to Play", "Ads"],
        notes: ["Strong organic growth", "High engagement in Hanoi & HCMC"],
      },
    },
    ios: {
      global: {
        downloads30d: 12500000,
        revenue30d: 8000,
        dau30d: 1350,
        rating: 4.7,
        ratingCount: 9800,
        timeSpentMonthly: 23.3,
        sessionsMonthly: 23110,
        websiteVisitsMonthly: null,
        monetization: ["Free to Play", "IAP"],
        category: "Games • Casual, Puzzle",
        topCountries: ["🇺🇸 US", "🇬🇧 UK", "🇨🇦 Canada"],
        notes: ["Strong conversion on App Store screenshots set B"],
      },
      us: {
        downloads30d: 1000000,
        revenue30d: 8000,
        dau30d: 820,
        rating: 4.7,
        ratingCount: 4100,
        timeSpentMonthly: 21.2,
        sessionsMonthly: 11020,
        websiteVisitsMonthly: 760,
        category: "Games • Casual, Puzzle",
        monetization: ["Free to Play", "IAP"],
        notes: ["High store conversion after ASA campaign"],
      },
    },
  },
  // Puzzle Master app
  "2": {
    android: {
      global: {
        downloads30d: 15000000,
        revenue30d: 15000,
        dau30d: 2100,
        rating: 4.6,
        ratingCount: 8900,
        timeSpentMonthly: 20.5,
        sessionsMonthly: 32000,
        websiteVisitsMonthly: null,
        monetization: ["Free to Play", "Ads"],
        category: "Games • Puzzle",
        topCountries: ["🇺🇸 US", "🇩🇪 Germany", "🇫🇷 France"],
        notes: ["Growing in Europe", "Popular with 25-34 age group"],
      },
      us: {
        downloads30d: 1500000,
        revenue30d: 9000,
        dau30d: 980,
        rating: 4.5,
        ratingCount: 3200,
        timeSpentMonthly: 19.8,
        sessionsMonthly: 14500,
        websiteVisitsMonthly: 890,
        category: "Games • Puzzle",
        monetization: ["Free to Play", "Ads"],
        notes: ["Strong weekend engagement", "High ad fill rate"],
      },
    },
    ios: {
      global: {
        downloads30d: 8000000,
        revenue30d: 6000,
        dau30d: 890,
        rating: 4.6,
        ratingCount: 5600,
        timeSpentMonthly: 19.2,
        sessionsMonthly: 15400,
        websiteVisitsMonthly: null,
        monetization: ["Free to Play", "Ads"],
        category: "Games • Puzzle",
        topCountries: ["🇺🇸 US", "🇬🇧 UK"],
        notes: ["Clean UI appreciated by users"],
      },
      us: {
        downloads30d: 800000,
        revenue30d: 5500,
        dau30d: 540,
        rating: 4.6,
        ratingCount: 2800,
        timeSpentMonthly: 18.5,
        sessionsMonthly: 8900,
        websiteVisitsMonthly: 520,
        category: "Games • Puzzle",
        monetization: ["Free to Play", "Ads"],
        notes: ["Effective rewarded video placement"],
      },
    },
  },
}

export function getAppMarketMetrics(appId: string, os: "android" | "ios", region: string): AppMarketMetrics | null {
  const appData = mockAppMarket[appId]
  if (!appData) return null

  const osData = appData[os]
  if (!osData) return null

  return osData[region] || null
}

// Format number with K/M suffix for Summary Metrics
export function formatNumberCompact(num: number | undefined): string {
  if (num === undefined) return "N/A"

  if (num < 1000) {
    return num.toString()
  } else if (num < 1000000) {
    const k = Math.floor(num / 1000)
    return `${k}K`
  } else {
    const m = Math.floor(num / 1000000)
    return `${m}M`
  }
}

// Format revenue with K/M suffix
export function formatRevenueCompact(num: number | undefined): string {
  if (num === undefined) return "N/A"

  if (num < 1000) {
    return `$${num}`
  } else if (num < 1000000) {
    const k = Math.floor(num / 1000)
    return `$${k}K`
  } else {
    const m = Math.floor(num / 1000000)
    return `$${m}M`
  }
}

// Standard formatting (for detailed views)
export function formatNumber(num: number | undefined): string {
  if (num === undefined) return "N/A"
  return new Intl.NumberFormat("en-US").format(num)
}

export function formatRevenue(num: number | undefined): string {
  if (num === undefined) return "N/A"
  return `$${new Intl.NumberFormat("en-US").format(num)}`
}

export function formatRating(rating: number | undefined, count: number | undefined): string {
  if (rating === undefined) return "N/A"
  const ratingStr = rating.toFixed(1)
  const countStr = count ? `(${formatNumber(count)} reviews)` : ""
  return `${ratingStr} ${countStr}`.trim()
}

export function getRegionLabel(region: string): string {
  const labels: Record<string, string> = {
    global: "Global",
    us: "🇺🇸 United States",
    vn: "🇻🇳 Vietnam",
    jp: "🇯🇵 Japan",
    kr: "🇰🇷 South Korea",
    uk: "🇬🇧 United Kingdom",
    de: "🇩🇪 Germany",
    fr: "🇫🇷 France",
  }
  return labels[region] || region
}
