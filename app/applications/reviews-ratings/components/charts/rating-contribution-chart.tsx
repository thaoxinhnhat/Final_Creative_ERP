"use client"

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { STAR_COLORS, compact, pct } from "@/lib/star-colors"
import type { RatingContributionPoint } from "../../hooks/use-rating-data"

interface RatingContributionChartProps {
  data: RatingContributionPoint[]
  loading: boolean
  error: string | null
}

// Custom tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null

  const total = payload.reduce((sum: number, item: any) => sum + item.value, 0)

  return (
    <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
      <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{label}</p>
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Total: {compact(total)}</p>
      <div className="space-y-1">
        {payload
          .slice()
          .reverse()
          .map((item: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
                <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 dark:text-gray-100">{compact(item.value)}</span>
                <span className="text-gray-500 dark:text-gray-400">({pct(item.value, total)})</span>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export function RatingContributionChart({ data, loading, error }: RatingContributionChartProps) {
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
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: "12px" }} />
        <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: "12px" }} />
        <Area
          type="monotone"
          dataKey="rating5"
          stackId="1"
          stroke={STAR_COLORS.five}
          fill={STAR_COLORS.five}
          fillOpacity={0.6}
          name="5★"
        />
        <Area
          type="monotone"
          dataKey="rating4"
          stackId="1"
          stroke={STAR_COLORS.four}
          fill={STAR_COLORS.four}
          fillOpacity={0.6}
          name="4★"
        />
        <Area
          type="monotone"
          dataKey="rating3"
          stackId="1"
          stroke={STAR_COLORS.three}
          fill={STAR_COLORS.three}
          fillOpacity={0.6}
          name="3★"
        />
        <Area
          type="monotone"
          dataKey="rating2"
          stackId="1"
          stroke={STAR_COLORS.two}
          fill={STAR_COLORS.two}
          fillOpacity={0.6}
          name="2★"
        />
        <Area
          type="monotone"
          dataKey="rating1"
          stackId="1"
          stroke={STAR_COLORS.one}
          fill={STAR_COLORS.one}
          fillOpacity={0.6}
          name="1★"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
