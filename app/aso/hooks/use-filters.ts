"use client"

import { useCallback, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import type { FilterState, Granularity, RegionMode, Tab } from "../types"
import { subDays, format } from "date-fns"

const DEFAULT_FILTERS: FilterState = {
  appId: null,
  store: null,
  platform: null,
  dateStart: format(subDays(new Date(), 28), "yyyy-MM-dd"),
  dateEnd: format(new Date(), "yyyy-MM-dd"),
  granularity: "daily",
  regionMode: "global",
  countries: [],
  tab: "overview",
}

export function useFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState<FilterState>(() => {
    // Initialize from URL params
    const appId = searchParams.get("appId")
    const store = searchParams.get("store") as any
    const platform = searchParams.get("platform") as any
    const dateStart = searchParams.get("dateStart") || DEFAULT_FILTERS.dateStart
    const dateEnd = searchParams.get("dateEnd") || DEFAULT_FILTERS.dateEnd
    const granularity = (searchParams.get("granularity") as Granularity) || DEFAULT_FILTERS.granularity
    const regionMode = (searchParams.get("regionMode") as RegionMode) || DEFAULT_FILTERS.regionMode
    const countriesParam = searchParams.get("countries")
    const countries = countriesParam ? countriesParam.split(",") : []
    const tab = (searchParams.get("tab") as Tab) || DEFAULT_FILTERS.tab

    return {
      appId,
      store,
      platform,
      dateStart,
      dateEnd,
      granularity,
      regionMode,
      countries,
      tab,
    }
  })

  const updateFilters = useCallback(
    (updates: Partial<FilterState>) => {
      setFilters((prev) => {
        const next = { ...prev, ...updates }

        // Build URL params
        const params = new URLSearchParams()
        if (next.appId) params.set("appId", next.appId)
        if (next.store) params.set("store", next.store)
        if (next.platform) params.set("platform", next.platform)
        params.set("dateStart", next.dateStart)
        params.set("dateEnd", next.dateEnd)
        params.set("granularity", next.granularity)
        params.set("regionMode", next.regionMode)
        if (next.countries.length > 0) params.set("countries", next.countries.join(","))
        params.set("tab", next.tab)

        router.push(`?${params.toString()}`, { scroll: false })

        return next
      })
    },
    [router],
  )

  const refetchAll = useCallback(() => {
    // This will be the hook for triggering data refetch
    console.log("Refetching all data with filters:", filters)
  }, [filters])

  return {
    filters,
    updateFilters,
    refetchAll,
  }
}
