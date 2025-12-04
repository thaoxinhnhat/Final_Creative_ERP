"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { SeriesPoint } from "../../types"
import { formatNumber } from "../../lib/formatters"

interface VisitorsAcquisitionsChartProps {
  data: SeriesPoint[]
}

export function VisitorsAcquisitionsChart({ data }: VisitorsAcquisitionsChartProps) {
  const chartData = data.map((point) => ({
    date: new Date(point.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    visitors: point.visitors,
    acquisitions: point.acquisitions,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Store Listing Visitors vs Acquisitions</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="date" stroke="#666" fontSize={12} />
            <YAxis stroke="#666" fontSize={12} tickFormatter={(value) => formatNumber(value)} />
            <Tooltip
              contentStyle={{ backgroundColor: "white", border: "1px solid #ccc" }}
              formatter={(value: number) => formatNumber(value)}
            />
            <Legend />
            <Bar dataKey="visitors" fill="#3b82f6" name="Visitors" />
            <Bar dataKey="acquisitions" fill="#10b981" name="Acquisitions" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
