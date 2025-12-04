"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams, usePathname, useRouter } from "next/navigation"
import type { TimeFilterState, TimeMode, Granularity } from "../components/shared-time-filter"

export function useSharedTimeFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Parse initial state from URL or use defaults
  const getInitialState = useCallback((): TimeFilterState => {
    const mode = (searchParams.get("timeMode") as TimeMode) || "daily"
    const fromParam = searchParams.get("timeFrom")
    const toParam = searchParams.get("timeTo")

    const to = toParam ? new Date(toParam) : new Date()
    const from = fromParam ? new Date(fromParam) : new Date(to.getTime() - 28 * 24 * 60 * 60 * 1000)

    const granularity: Granularity =
      mode === "daily" ? "day" : mode === "weekly" ? "week" : mode === "monthly" ? "month" : "auto"

    return { mode, from, to, granularity }
  }, [searchParams])

  const [timeFilter, setTimeFilter] = useState<TimeFilterState>(getInitialState)
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null)

  // Update URL when filter changes (with debounce) - PRESERVE ALL EXISTING PARAMS
  const updateURL = useCallback(
    (state: TimeFilterState) => {
      // Create new URLSearchParams from existing params to preserve everything
      const params = new URLSearchParams(searchParams.toString())

      // Update only time-related params
      params.set("timeMode", state.mode)
      params.set("timeFrom", state.from.toISOString().split("T")[0])
      params.set("timeTo", state.to.toISOString().split("T")[0])

      // Use replace to avoid adding to browser history for every change
      // Keep the same pathname, only update query string
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [router, pathname, searchParams],
  )

  const handleFilterChange = useCallback(
    (newState: TimeFilterState) => {
      setTimeFilter(newState)

      // Clear existing timeout
      if (debounceTimeout) {
        clearTimeout(debounceTimeout)
      }

      // Set new debounced update
      const timeout = setTimeout(() => {
        updateURL(newState)
      }, 250)

      setDebounceTimeout(timeout)
    },
    [debounceTimeout, updateURL],
  )

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout)
      }
    }
  }, [debounceTimeout])

  return {
    timeFilter,
    setTimeFilter: handleFilterChange,
  }
}
