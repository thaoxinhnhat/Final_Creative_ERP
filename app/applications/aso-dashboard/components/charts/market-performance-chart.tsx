"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { MarketMetrics } from "../../types"
import { formatNumber } from "../../lib/formatters"

interface MarketPerformanceChartProps {
  data: MarketMetrics[]
}

export function MarketPerformanceChart({ data }: MarketPerformanceChartProps) {
  const chartData = data.slice(0, 10).map((market) => ({
    country: market.countryCode,
    impressions: market.impressions,
    installs: market.installs,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="country" stroke="#666" fontSize={12} />
            <YAxis stroke="#666" fontSize={12} tickFormatter={(value) => formatNumber(value)} />
            <Tooltip
              contentStyle={{ backgroundColor: "white", border: "1px solid #ccc" }}
              formatter={(value: number) => formatNumber(value)}
            />
            <Legend />
            <Bar dataKey="impressions" fill="#3b82f6" name="Impressions" />
            <Bar dataKey="installs" fill="#10b981" name="Installs" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
