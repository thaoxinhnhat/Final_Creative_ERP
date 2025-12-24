"use client"

import { useState, useEffect } from "react"
import type { OverviewData, ChartFilters } from "../types"
import { mockOverviewData } from "../data/mock-data"

export function useOverviewData(filters: ChartFilters | null) {
  const [data, setData] = useState<OverviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!filters || !filters.appId) {
      setData(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    // Simulate API call
    const timer = setTimeout(() => {
      try {
        // In production: fetch(`/api/aso/overview?${queryString}`)
        setData(mockOverviewData)
        setLoading(false)
      } catch (err) {
        setError(err as Error)
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [filters])

  return { data, loading, error }
}
