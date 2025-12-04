"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
interface KeywordDistribution {
  top1_3: number
  top4_10: number
  top11_50: number
  gt50: number
}

interface KeywordDistributionChartProps {
  data: KeywordDistribution
}

export function KeywordDistributionChart({ data }: KeywordDistributionChartProps) {
  const chartData = [
    { bucket: "Top 1-3", count: data.top1_3, fill: "#10b981" },
    { bucket: "Top 4-10", count: data.top4_10, fill: "#3b82f6" },
    { bucket: "Top 11-50", count: data.top11_50, fill: "#f59e0b" },
    { bucket: ">50", count: data.gt50, fill: "#ef4444" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ranking Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="bucket" stroke="#888" fontSize={12} />
            <YAxis stroke="#888" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey="count" name="Keywords" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Bar key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
