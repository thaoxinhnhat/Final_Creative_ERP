"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { CompressionArtifact } from "../../types"

interface CompressionDistributionChartProps {
  data: CompressionArtifact[]
}

const COLORS = ["#ef4444", "#f97316", "#f59e0b", "#10b981"]

export function CompressionDistributionChart({ data }: CompressionDistributionChartProps) {
  const chartData = data.map((item) => ({
    name: item.type,
    value: item.count,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compression Artifact Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
