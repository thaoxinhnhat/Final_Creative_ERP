"use client"

import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useCallback, useMemo } from "react"
import type { ChartFilters, Tab, Granularity, RegionMode } from "../types"
import { format, subDays } from "date-fns"

export function useFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const filters: ChartFilters | null = useMemo(() => {
    const appId = searchParams.get("appId")
    if (!appId) return null

    const store = (searchParams.get("store") || "googleplay") as "googleplay" | "appstore"
    const platform = (searchParams.get("platform") || "android") as "android" | "ios"
    const granularity = (searchParams.get("granularity") || "day") as Granularity
    const regionMode = (searchParams.get("regionMode") || "global") as RegionMode
    const countriesParam = searchParams.get("countries")
    const countries = countriesParam ? countriesParam.split(",") : []

    const today = new Date()
    const defaultStart = subDays(today, 27)
    const dateStart = searchParams.get("dateStart") || format(defaultStart, "yyyy-MM-dd")
    const dateEnd = searchParams.get("dateEnd") || format(today, "yyyy-MM-dd")

    return {
      appId,
      store,
      platform,
      dateStart,
      dateEnd,
      granularity,
      regionMode,
      countries,
    }
  }, [searchParams])

  const activeTab = (searchParams.get("tab") || "overview") as Tab

  const updateFilters = useCallback(
    (updates: Partial<ChartFilters & { tab?: Tab }>) => {
      const params = new URLSearchParams(searchParams.toString())

      if (updates.appId !== undefined) params.set("appId", updates.appId)
      if (updates.store !== undefined) params.set("store", updates.store)
      if (updates.platform !== undefined) params.set("platform", updates.platform)
      if (updates.dateStart !== undefined) params.set("dateStart", updates.dateStart)
      if (updates.dateEnd !== undefined) params.set("dateEnd", updates.dateEnd)
      if (updates.granularity !== undefined) params.set("granularity", updates.granularity)
      if (updates.regionMode !== undefined) params.set("regionMode", updates.regionMode)
      if (updates.countries !== undefined) {
        if (updates.countries.length > 0) {
          params.set("countries", updates.countries.join(","))
        } else {
          params.delete("countries")
        }
      }
      if (updates.tab !== undefined) params.set("tab", updates.tab)

      router.push(`${pathname}?${params.toString()}`)
    },
    [searchParams, router, pathname],
  )

  return {
    filters,
    activeTab,
    updateFilters,
  }
}
