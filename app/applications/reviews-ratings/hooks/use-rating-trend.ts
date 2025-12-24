"use client"

import { useState, useEffect } from "react"

export type Granularity = "daily" | "weekly" | "monthly"

export type TrendPoint = {
  date: string
  yourAvg: number
  peersMedian?: number | null
}

export type TrendQuery = {
  appId: string
  os: string
  country: string
  dateFrom: string
  dateTo: string
  granularity: Granularity
  comparePrev?: boolean
}

// Mock API - replace with real API call
async function fetchAverageRatingTrend(query: TrendQuery): Promise<TrendPoint[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const seed = query.granularity === "daily" ? 28 : query.granularity === "weekly" ? 12 : 6

  return Array.from({ length: seed }, (_, i) => ({
    date:
      query.granularity === "daily"
        ? `Day ${i + 1}`
        : query.granularity === "weekly"
          ? `Week ${i + 1}`
          : `Month ${i + 1}`,
    yourAvg: 4.0 + Math.min(0.6, i * 0.02),
    peersMedian: 3.9 + Math.min(0.4, i * 0.015),
  }))
}

export function useRatingTrend(query: TrendQuery | null) {
  const [data, setData] = useState<TrendPoint[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!query) {
      setData([])
      return
    }

    let mounted = true
    setLoading(true)
    setError(null)

    fetchAverageRatingTrend(query)
      .then((result) => {
        if (mounted) setData(result)
      })
      .catch((err) => {
        if (mounted) setError(err?.message ?? "Failed to load data")
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [query]) // Updated dependency array to use the entire query object

  return { data, loading, error }
}
