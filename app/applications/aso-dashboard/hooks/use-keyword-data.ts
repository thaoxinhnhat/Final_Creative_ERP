"use client"

import { useState, useEffect } from "react"
import type { KeywordSummary, KeywordTrendData, ChartFilters } from "../types"
import { mockKeywordSummary, mockKeywordTrend } from "../data/mock-data"

export function useKeywordSummary(filters: ChartFilters | null) {
  const [data, setData] = useState<KeywordSummary | null>(null)
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
        setData(mockKeywordSummary)
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

export function useKeywordTrend(filters: ChartFilters | null, keyword: string) {
  const [data, setData] = useState<KeywordTrendData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!filters || !filters.appId || !keyword) {
      setData(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const timer = setTimeout(() => {
      try {
        setData(mockKeywordTrend)
        setLoading(false)
      } catch (err) {
        setError(err as Error)
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [filters, keyword])

  return { data, loading, error }
}
