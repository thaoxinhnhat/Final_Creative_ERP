"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { SeriesPoint } from "../../types"
import { formatNumber } from "../../lib/formatters"

interface PerformanceOverviewChartProps {
  data: SeriesPoint[]
  showCompare: boolean
  onCompareChange: (value: boolean) => void
}

export function PerformanceOverviewChart({ data, showCompare, onCompareChange }: PerformanceOverviewChartProps) {
  const chartData = data.map((point) => ({
    date: new Date(point.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    impressions: point.impressions,
    installs: point.installs,
    impressions_prev: point.impressions_prev,
    installs_prev: point.installs_prev,
  }))

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Performance Overview</CardTitle>
        <div className="flex items-center gap-2">
          <Switch id="compare-overview" checked={showCompare} onCheckedChange={onCompareChange} />
          <Label htmlFor="compare-overview" className="text-sm cursor-pointer">
            Compare to previous
          </Label>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="date" stroke="#666" fontSize={12} />
            <YAxis stroke="#666" fontSize={12} tickFormatter={(value) => formatNumber(value)} />
            <Tooltip
              contentStyle={{ backgroundColor: "white", border: "1px solid #ccc" }}
              formatter={(value: number) => formatNumber(value)}
            />
            <Legend />
            <Line type="monotone" dataKey="impressions" stroke="#3b82f6" strokeWidth={2} name="Impressions" />
            <Line type="monotone" dataKey="installs" stroke="#10b981" strokeWidth={2} name="Installs" />
            {showCompare && (
              <>
                <Line
                  type="monotone"
                  dataKey="impressions_prev"
                  stroke="#93c5fd"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Impressions (prev)"
                />
                <Line
                  type="monotone"
                  dataKey="installs_prev"
                  stroke="#6ee7b7"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Installs (prev)"
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
