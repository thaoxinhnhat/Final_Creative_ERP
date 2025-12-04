"use client"

import { useCallback, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import type { DashboardFilters } from "../types"
import { getDateRangeFromPreset, getRecommendedGranularity } from "../lib/date-utils"

export function useDashboardFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const filters = useMemo<DashboardFilters>(() => {
    const appId = searchParams.get("appId") || undefined
    const dateRange = (searchParams.get("dateRange") as DashboardFilters["dateRange"]) || "28d"
    const tab = (searchParams.get("tab") as DashboardFilters["tab"]) || "overview"
    const compare = searchParams.get("compare") === "true"
    const region = searchParams.get("region") || "Global"
    const selectedMarkets = searchParams.get("markets")?.split(",").filter(Boolean) || undefined

    let from = searchParams.get("from") || undefined
    let to = searchParams.get("to") || undefined

    if (!from || !to) {
      const range = getDateRangeFromPreset(dateRange)
      from = range.from
      to = range.to
    }

    let granularity = searchParams.get("granularity") as "daily" | "weekly" | "monthly" | null

    if (!granularity && from && to) {
      granularity = getRecommendedGranularity(from, to)
    }

    return {
      appId,
      dateRange,
      from,
      to,
      granularity: granularity || "daily",
      region,
      tab,
      compare,
      selectedMarkets,
    }
  }, [searchParams])

  const updateFilters = useCallback(
    (updates: Partial<DashboardFilters>) => {
      const current = new URLSearchParams(searchParams.toString())

      if (updates.dateRange !== undefined) {
        current.set("dateRange", updates.dateRange)
        if (updates.dateRange !== "custom") {
          const range = getDateRangeFromPreset(updates.dateRange)
          current.set("from", range.from)
          current.set("to", range.to)
          const recommended = getRecommendedGranularity(range.from, range.to)
          current.set("granularity", recommended)
        }
      }

      if (updates.from !== undefined) {
        current.set("from", updates.from)
      }

      if (updates.to !== undefined) {
        current.set("to", updates.to)
      }

      if (updates.appId !== undefined) {
        current.set("appId", updates.appId)
      }

      if (updates.granularity !== undefined) {
        current.set("granularity", updates.granularity)
      }

      if (updates.region !== undefined) {
        current.set("region", updates.region)
      }

      if (updates.tab !== undefined) {
        current.set("tab", updates.tab)
      }

      if (updates.compare !== undefined) {
        if (updates.compare) {
          current.set("compare", "true")
        } else {
          current.delete("compare")
        }
      }

      if (updates.selectedMarkets !== undefined) {
        if (updates.selectedMarkets && updates.selectedMarkets.length > 0) {
          current.set("markets", updates.selectedMarkets.join(","))
        } else {
          current.delete("markets")
        }
      }

      router.push(`/applications/performance-dashboard?${current.toString()}`, { scroll: false })
    },
    [searchParams, router],
  )

  return {
    filters,
    updateFilters,
  }
}
