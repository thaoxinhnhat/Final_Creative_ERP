"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts"
import type { KeywordSOV } from "../../types"

interface ShareOfVoiceChartProps {
  data: KeywordSOV[]
}

const COLORS = ["#3b82f6", "#6b7280", "#9ca3af"]

export function ShareOfVoiceChart({ data }: ShareOfVoiceChartProps) {
  const chartData = data.map((item) => ({
    brand: item.brand,
    share: item.share * 100,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share of Voice</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" stroke="#888" fontSize={12} tickFormatter={(value) => `${value}%`} />
            <YAxis dataKey="brand" type="category" stroke="#888" fontSize={12} width={120} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
              formatter={(value: number) => `${value.toFixed(1)}%`}
            />
            <Legend />
            <Bar dataKey="share" name="Market Share" radius={[0, 8, 8, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
