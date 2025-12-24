"use client"

import { useState, useEffect } from "react"
import type { Granularity } from "../components/shared-time-filter"

export type RatingTrendPoint = {
  date: string
  yourAvg: number
  peersMedian?: number | null
}

export type RatingContributionPoint = {
  date: string
  rating1: number
  rating2: number
  rating3: number
  rating4: number
  rating5: number
}

interface RatingDataQuery {
  appId: string
  os: string
  country: string
  startDate: string
  endDate: string
  granularity: Granularity
}

// Mock API for Average Rating
async function fetchAverageRating(query: RatingDataQuery): Promise<RatingTrendPoint[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const daysDiff = Math.ceil(
    (new Date(query.endDate).getTime() - new Date(query.startDate).getTime()) / (1000 * 60 * 60 * 24),
  )

  let points = 7
  if (query.granularity === "day") points = Math.min(daysDiff, 28)
  if (query.granularity === "week") points = Math.min(Math.ceil(daysDiff / 7), 12)
  if (query.granularity === "month") points = Math.min(Math.ceil(daysDiff / 30), 6)

  return Array.from({ length: points }, (_, i) => ({
    date:
      query.granularity === "day" ? `Day ${i + 1}` : query.granularity === "week" ? `Week ${i + 1}` : `Month ${i + 1}`,
    yourAvg: 4.0 + Math.min(0.6, i * 0.02),
    peersMedian: 3.9 + Math.min(0.4, i * 0.015),
  }))
}

// Mock API for Rating Contribution
async function fetchRatingContribution(query: RatingDataQuery): Promise<RatingContributionPoint[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const daysDiff = Math.ceil(
    (new Date(query.endDate).getTime() - new Date(query.startDate).getTime()) / (1000 * 60 * 60 * 24),
  )

  let points = 7
  if (query.granularity === "day") points = Math.min(daysDiff, 28)
  if (query.granularity === "week") points = Math.min(Math.ceil(daysDiff / 7), 12)
  if (query.granularity === "month") points = Math.min(Math.ceil(daysDiff / 30), 6)

  return Array.from({ length: points }, (_, i) => ({
    date:
      query.granularity === "day" ? `Day ${i + 1}` : query.granularity === "week" ? `Week ${i + 1}` : `Month ${i + 1}`,
    rating1: 35 + Math.floor(Math.random() * 20),
    rating2: 25 + Math.floor(Math.random() * 15),
    rating3: 70 + Math.floor(Math.random() * 20),
    rating4: 200 + Math.floor(Math.random() * 30),
    rating5: 370 + Math.floor(Math.random() * 40),
  }))
}

export function useAverageRatingData(query: RatingDataQuery | null) {
  const [data, setData] = useState<RatingTrendPoint[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // If query is null, keep existing data but don't fetch
    if (!query) {
      setLoading(false)
      setError(null)
      return
    }

    let mounted = true
    setLoading(true)
    setError(null)

    fetchAverageRating(query)
      .then((result) => {
        if (mounted) setData(result)
      })
      .catch((err) => {
        if (mounted) {
          setError(err?.message ?? "Failed to load average rating data")
          console.error("Error fetching average rating:", err)
        }
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [query])

  return { data, loading, error }
}

export function useRatingContributionData(query: RatingDataQuery | null) {
  const [data, setData] = useState<RatingContributionPoint[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // If query is null, keep existing data but don't fetch
    if (!query) {
      setLoading(false)
      setError(null)
      return
    }

    let mounted = true
    setLoading(true)
    setError(null)

    fetchRatingContribution(query)
      .then((result) => {
        if (mounted) setData(result)
      })
      .catch((err) => {
        if (mounted) {
          setError(err?.message ?? "Failed to load rating contribution data")
          console.error("Error fetching rating contribution:", err)
        }
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [query])

  return { data, loading, error }
}
