"use client"

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { CHART_COLORS } from "@/lib/star-colors"
import type { RatingTrendPoint } from "../../hooks/use-rating-data"

interface AverageRatingChartProps {
  data: RatingTrendPoint[]
  loading: boolean
  error: string | null
  showPeers: boolean
}

export function AverageRatingChart({ data, loading, error, showPeers }: AverageRatingChartProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="text-sm text-gray-500">Loading chart data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="text-sm text-red-600">Error: {error}</div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="text-sm text-gray-500">No data available for the selected period</div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
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
          formatter={(value: any) => [Number(value).toFixed(1), ""]}
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
            dataKey="peersMedian"
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
