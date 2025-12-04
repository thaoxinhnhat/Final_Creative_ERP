"use client"

import { useEffect, useState } from "react"
import type { CaBreakdownResponse } from "../types"
import { generateCaBreakdownMock } from "../lib/mock-ca-breakdown"

interface UseCaBreakdownParams {
  appId?: string
  os: string
  start?: string
  end?: string
  region: string
  gran: string
}

export function useCaBreakdown({ appId, os, start, end, region, gran }: UseCaBreakdownParams) {
  const [data, setData] = useState<CaBreakdownResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let aborted = false

    if (!appId || !start || !end) {
      setData(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    // Debounce to avoid flicker
    const timeoutId = setTimeout(async () => {
      try {
        const url = `/api/aso/ca-breakdown?appId=${encodeURIComponent(appId)}&os=${os}&start=${start}&end=${end}&region=${encodeURIComponent(region)}&gran=${gran}`

        const response = await fetch(url)

        if (aborted) return

        if (response.ok) {
          const json = await response.json()
          setData(json)
        } else if (response.status === 404 || response.status === 501) {
          // Fallback to mock
          const mockData = generateCaBreakdownMock({ appId, os, start, end, region, gran })
          setData(mockData)
        } else {
          throw new Error(`HTTP ${response.status}`)
        }
      } catch (err) {
        if (aborted) return

        // Always fallback to mock on error
        const mockData = generateCaBreakdownMock({ appId, os, start, end, region, gran })
        setData(mockData)
      } finally {
        if (!aborted) {
          setLoading(false)
        }
      }
    }, 200)

    return () => {
      aborted = true
      clearTimeout(timeoutId)
    }
  }, [appId, os, start, end, region, gran])

  const retry = () => {
    setLoading(true)
    setError(null)
  }

  return { data, loading, error, retry }
}
