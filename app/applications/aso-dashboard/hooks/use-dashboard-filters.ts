"use client"

import { useSearchParams, usePathname, useRouter } from "next/navigation"
import { useCallback, useMemo } from "react"
import type { ChartFilters, OS, CompareMode, Tab, Grain } from "../types"

export function useDashboardFilters() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const filters = useMemo<ChartFilters | null>(() => {
    const appId = searchParams.get("appId")
    if (!appId) return null

    const os = (searchParams.get("os") || "android") as OS
    const from = searchParams.get("from") || getDefaultFrom()
    const to = searchParams.get("to") || getDefaultTo()
    const countries = searchParams.get("country")?.split(",") || ["global"]
    const compare = (searchParams.get("compare") || "none") as CompareMode
    const peers = searchParams.get("peers") === "true"
    const grain = (searchParams.get("grain") || "daily") as Grain

    return { appId, os, from, to, countries, compare, peers, grain }
  }, [searchParams])

  const activeTab = (searchParams.get("tab") || "overview") as Tab

  const updateFilters = useCallback(
    (updates: Partial<ChartFilters> & { tab?: Tab }) => {
      const params = new URLSearchParams(searchParams.toString())

      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === null) {
          params.delete(key)
        } else if (Array.isArray(value)) {
          params.set(key, value.join(","))
        } else {
          params.set(key, String(value))
        }
      })

      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [searchParams, pathname, router],
  )

  return { filters, activeTab, updateFilters }
}

function getDefaultFrom(): string {
  const date = new Date()
  date.setDate(date.getDate() - 28)
  return date.toISOString().split("T")[0]
}

function getDefaultTo(): string {
  return new Date().toISOString().split("T")[0]
}
