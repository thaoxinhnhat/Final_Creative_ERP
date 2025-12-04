"use client"

import { useMemo } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { CHART_COLORS } from "@/lib/star-colors"
import type { TrendPoint } from "../hooks/use-rating-trend"

interface AverageRatingChartProps {
  data: TrendPoint[]
  loading: boolean
  error: string | null
  showPeers: boolean
}

export function AverageRatingChart({ data, loading, error, showPeers }: AverageRatingChartProps) {
  const chartData = useMemo(() => {
    return data.map((point) => ({
      date: point.date,
      yourAvg: point.yourAvg,
      peerMedian: showPeers ? point.peersMedian : null,
    }))
  }, [data, showPeers])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="text-sm text-gray-500 dark:text-gray-400">Loading chart data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="text-sm text-red-600 dark:text-red-400">Error: {error}</div>
      </div>
    )
  }

  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="text-sm text-gray-500 dark:text-gray-400">No data available for selected filters</div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: "12px" }} />
        <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} stroke="#6b7280" style={{ fontSize: "12px" }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "6px",
            fontSize: "12px",
          }}
          formatter={(value: any) => [Number(value).toFixed(2), ""]}
        />
        <Legend wrapperStyle={{ fontSize: "12px" }} />
        <Line
          type="monotone"
          dataKey="yourAvg"
          stroke={CHART_COLORS.yourApp}
          strokeWidth={3}
          name="Your daily average"
          dot={{ r: 4 }}
        />
        {showPeers && (
          <Line
            type="monotone"
            dataKey="peerMedian"
            stroke={CHART_COLORS.peer}
            strokeWidth={2}
            strokeDasharray="5 5"
            name="Peers' median"
            dot={{ r: 3 }}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  )
}
