"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { SeriesPoint } from "../../types"

interface CVRTrendChartProps {
  data: SeriesPoint[]
  showCompare: boolean
  onCompareChange: (value: boolean) => void
}

export function CVRTrendChart({ data, showCompare, onCompareChange }: CVRTrendChartProps) {
  const chartData = data.map((point) => ({
    date: new Date(point.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    cvr: point.cvr,
    cvr_prev: point.cvr_prev,
  }))

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Conversion Rate Trend</CardTitle>
        <div className="flex items-center gap-2">
          <Switch id="compare-cvr" checked={showCompare} onCheckedChange={onCompareChange} />
          <Label htmlFor="compare-cvr" className="text-sm cursor-pointer">
            Compare
          </Label>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="date" stroke="#666" fontSize={12} />
            <YAxis stroke="#666" fontSize={12} tickFormatter={(value) => `${value.toFixed(1)}%`} />
            <Tooltip
              contentStyle={{ backgroundColor: "white", border: "1px solid #ccc" }}
              formatter={(value: number) => `${value.toFixed(2)}%`}
            />
            <Legend />
            <Line type="monotone" dataKey="cvr" stroke="#f59e0b" strokeWidth={2} name="CVR" />
            {showCompare && (
              <Line
                type="monotone"
                dataKey="cvr_prev"
                stroke="#fcd34d"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="CVR (prev)"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
