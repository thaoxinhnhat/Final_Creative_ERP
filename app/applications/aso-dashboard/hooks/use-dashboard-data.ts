"use client"

import { useState, useEffect } from "react"
import type { KPIData, SeriesPoint, MarketMetrics, KeywordMetrics, CAData } from "../types"
import {
  generateMockKPIData,
  generateMockSeriesData,
  generateMockMarketData,
  generateMockKeywordData,
  generateMockCAData,
} from "../data/mock-data"

interface DataHookResult<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

export function useKPIData(appId: string | null): DataHookResult<KPIData> {
  const [data, setData] = useState<KPIData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!appId) {
      setData(null)
      return
    }

    setLoading(true)
    const timer = setTimeout(() => {
      try {
        setData(generateMockKPIData())
        setError(null)
      } catch (e) {
        setError(e as Error)
      } finally {
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [appId])

  return { data, loading, error }
}

export function useSeriesData(appId: string | null): DataHookResult<SeriesPoint[]> {
  const [data, setData] = useState<SeriesPoint[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!appId) {
      setData(null)
      return
    }

    setLoading(true)
    const timer = setTimeout(() => {
      try {
        setData(generateMockSeriesData(30))
        setError(null)
      } catch (e) {
        setError(e as Error)
      } finally {
        setLoading(false)
      }
    }, 600)

    return () => clearTimeout(timer)
  }, [appId])

  return { data, loading, error }
}

export function useMarketData(appId: string | null): DataHookResult<MarketMetrics[]> {
  const [data, setData] = useState<MarketMetrics[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!appId) {
      setData(null)
      return
    }

    setLoading(true)
    const timer = setTimeout(() => {
      try {
        setData(generateMockMarketData())
        setError(null)
      } catch (e) {
        setError(e as Error)
      } finally {
        setLoading(false)
      }
    }, 700)

    return () => clearTimeout(timer)
  }, [appId])

  return { data, loading, error }
}

export function useKeywordData(appId: string | null): DataHookResult<KeywordMetrics[]> {
  const [data, setData] = useState<KeywordMetrics[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!appId) {
      setData(null)
      return
    }

    setLoading(true)
    const timer = setTimeout(() => {
      try {
        setData(generateMockKeywordData())
        setError(null)
      } catch (e) {
        setError(e as Error)
      } finally {
        setLoading(false)
      }
    }, 650)

    return () => clearTimeout(timer)
  }, [appId])

  return { data, loading, error }
}

export function useCAData(appId: string | null): DataHookResult<CAData> {
  const [data, setData] = useState<CAData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!appId) {
      setData(null)
      return
    }

    setLoading(true)
    const timer = setTimeout(() => {
      try {
        setData(generateMockCAData())
        setError(null)
      } catch (e) {
        setError(e as Error)
      } finally {
        setLoading(false)
      }
    }, 750)

    return () => clearTimeout(timer)
  }, [appId])

  return { data, loading, error }
}
