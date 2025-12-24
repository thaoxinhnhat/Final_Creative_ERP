"use client"

import { useState, useEffect } from "react"
import type { MarketsData, ChartFilters } from "../types"
import { mockMarketsData } from "../data/mock-data"

export function useMarketsData(filters: ChartFilters | null) {
  const [data, setData] = useState<MarketsData | null>(null)
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

    const timer = setTimeout(() => {
      try {
        setData(mockMarketsData)
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
