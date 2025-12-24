"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { TrendingDown, TrendingUp } from "lucide-react"
import type { DashboardData, DashboardFilters } from "../types"
import { useCaBreakdown } from "../hooks/use-ca-breakdown"
import { BreakdownTable } from "./ca-breakdown-table"

interface CATabProps {
  data: DashboardData
  filters: DashboardFilters
}

const COLORS = {
  none: "#10b981",
  low: "#f59e0b",
  medium: "#f97316",
  high: "#ef4444",
}

export function CATab({ data, filters }: CATabProps) {
  const {
    data: breakdownData,
    loading,
    error,
    retry,
  } = useCaBreakdown({
    appId: filters.appId,
    os: filters.os || "android",
    start: filters.from,
    end: filters.to,
    region: filters.region || "Global",
    gran: filters.granularity,
  })

  if (!data.ca.available) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground">CA data not available for this app</p>
        </CardContent>
      </Card>
    )
  }

  const distributionData = [
    { name: "None", value: data.ca.distribution.none, color: COLORS.none },
    { name: "Low", value: data.ca.distribution.low, color: COLORS.low },
    { name: "Medium", value: data.ca.distribution.medium, color: COLORS.medium },
    { name: "High", value: data.ca.distribution.high, color: COLORS.high },
  ]

  return (
    <div className="space-y-6">
      {/* Top Row: Distribution and Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CA Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>CA Distribution</CardTitle>
            <CardDescription>Media quality breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={(entry) => `${entry.value.toFixed(0)}%`}
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Impact on CVR */}
        <Card>
          <CardHeader>
            <CardTitle>Impact on CVR</CardTitle>
            <CardDescription>CA vs Non-CA conversion rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  {data.ca.impact.deltaCvr < 0 ? (
                    <TrendingDown className="h-6 w-6 text-red-600" />
                  ) : (
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  )}
                  <span
                    className={`text-4xl font-bold ${data.ca.impact.deltaCvr < 0 ? "text-red-600" : "text-green-600"}`}
                  >
                    {data.ca.impact.deltaCvr.toFixed(1)}%
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {data.ca.impact.deltaCvr < 0 ? "Lower" : "Higher"} CVR with CA
                </p>
              </div>
              <div className="h-16 flex items-end justify-between gap-1">
                {data.ca.impact.spark.map((value, idx) => (
                  <div
                    key={idx}
                    className={`flex-1 rounded-t ${value < 0 ? "bg-red-400" : "bg-green-400"}`}
                    style={{
                      height: `${Math.abs(value) * 30 + 2}px`,
                    }}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Impact on Rating */}
        <Card>
          <CardHeader>
            <CardTitle>Impact on Rating</CardTitle>
            <CardDescription>CA vs Non-CA average rating</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  {data.ca.impact.deltaRating < 0 ? (
                    <TrendingDown className="h-6 w-6 text-red-600" />
                  ) : (
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  )}
                  <span
                    className={`text-4xl font-bold ${
                      data.ca.impact.deltaRating < 0 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {data.ca.impact.deltaRating.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {data.ca.impact.deltaRating < 0 ? "Lower" : "Higher"} rating with CA
                </p>
              </div>
              <div className="h-16 flex items-end justify-between gap-1">
                {data.ca.impact.spark.map((value, idx) => (
                  <div
                    key={idx}
                    className={`flex-1 rounded-t ${value < 0 ? "bg-red-400" : "bg-green-400"}`}
                    style={{
                      height: `${Math.abs(value) * 30 + 2}px`,
                    }}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Breakdown Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <BreakdownTable
          title="Breakdown by Market"
          rows={breakdownData?.market || []}
          loading={loading}
          error={error}
          onRetry={retry}
          kind="market"
        />
        <BreakdownTable
          title="Breakdown by Device"
          rows={breakdownData?.device || []}
          loading={loading}
          error={error}
          onRetry={retry}
          kind="device"
        />
      </div>
    </div>
  )
}
