import type { CaLevel, CaMarketRow, CaDeviceRow, CaBreakdownResponse } from "../types"

// Seeded random for consistent mock data
function seededRandom(seed: string): number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  const x = Math.sin(hash) * 10000
  return x - Math.floor(x)
}

function pickCaLevel(random: number): CaLevel {
  if (random < 0.4) return "None"
  if (random < 0.65) return "Low"
  if (random < 0.85) return "Medium"
  return "High"
}

export function generateCaBreakdownMock(params: {
  appId: string
  os: string
  start: string
  end: string
  region: string
  gran: string
}): CaBreakdownResponse {
  const seed = `${params.appId}-${params.os}-${params.start}-${params.end}-${params.region}`

  const markets = ["United States", "Vietnam", "Japan", "South Korea", "United Kingdom", "Germany", "France", "Brazil"]

  const devices = [
    "iPhone 15 Pro",
    "iPhone 14",
    "Samsung Galaxy S24",
    "Samsung Galaxy S23",
    "Google Pixel 8",
    "Xiaomi 13",
    "OnePlus 11",
    "OPPO Find X6",
  ]

  const marketRows: CaMarketRow[] = markets.map((market, idx) => {
    const marketSeed = `${seed}-market-${idx}`
    const r1 = seededRandom(marketSeed + "1")
    const r2 = seededRandom(marketSeed + "2")
    const r3 = seededRandom(marketSeed + "3")
    const r4 = seededRandom(marketSeed + "4")

    const caLevel = pickCaLevel(r1)
    const share = 0.05 + r2 * 0.4 // 5-45%

    // CA impact depends on level
    let deltaCVR = 0
    let deltaRating = 0

    switch (caLevel) {
      case "High":
        deltaCVR = -0.02 - r3 * 0.015 // -2% to -3.5%
        deltaRating = -0.08 - r4 * 0.08 // -0.08 to -0.16
        break
      case "Medium":
        deltaCVR = -0.008 - r3 * 0.012 // -0.8% to -2%
        deltaRating = -0.03 - r4 * 0.05 // -0.03 to -0.08
        break
      case "Low":
        deltaCVR = 0.002 - r3 * 0.008 // +0.2% to -0.6%
        deltaRating = 0.01 - r4 * 0.03 // +0.01 to -0.02
        break
      case "None":
        deltaCVR = 0.005 + r3 * 0.01 // +0.5% to +1.5%
        deltaRating = 0.02 + r4 * 0.03 // +0.02 to +0.05
        break
    }

    return {
      market,
      caLevel,
      share,
      deltaCVR,
      deltaRating,
    }
  })

  const deviceRows: CaDeviceRow[] = devices.map((device, idx) => {
    const deviceSeed = `${seed}-device-${idx}`
    const r1 = seededRandom(deviceSeed + "1")
    const r2 = seededRandom(deviceSeed + "2")
    const r3 = seededRandom(deviceSeed + "3")
    const r4 = seededRandom(deviceSeed + "4")

    const caLevel = pickCaLevel(r1)
    const share = 0.03 + r2 * 0.25 // 3-28%

    let deltaCVR = 0
    let deltaRating = 0

    switch (caLevel) {
      case "High":
        deltaCVR = -0.025 - r3 * 0.02
        deltaRating = -0.1 - r4 * 0.1
        break
      case "Medium":
        deltaCVR = -0.01 - r3 * 0.015
        deltaRating = -0.04 - r4 * 0.06
        break
      case "Low":
        deltaCVR = 0.003 - r3 * 0.01
        deltaRating = 0.015 - r4 * 0.04
        break
      case "None":
        deltaCVR = 0.008 + r3 * 0.012
        deltaRating = 0.03 + r4 * 0.04
        break
    }

    return {
      device,
      caLevel,
      share,
      deltaCVR,
      deltaRating,
    }
  })

  return {
    market: marketRows.sort((a, b) => b.share - a.share),
    device: deviceRows.sort((a, b) => b.share - a.share),
  }
}
