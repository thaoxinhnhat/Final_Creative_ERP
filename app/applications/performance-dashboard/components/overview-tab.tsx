"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import type { DashboardData, DashboardFilters } from "../types"
import { formatDateByGranularity } from "../lib/date-utils"

interface OverviewTabProps {
  data: DashboardData
  filters: DashboardFilters
  onCompareChange: (compare: boolean) => void
}

export function OverviewTab({ data, filters, onCompareChange }: OverviewTabProps) {
  const formatXAxis = (ts: string) => formatDateByGranularity(ts, filters.granularity)

  // Prepare CVR data
  const cvrData = data.series.cvr.current.map((point, idx) => ({
    ts: point.ts,
    current: point.value,
    previous: filters.compare && data.series.cvr.previous?.[idx]?.value,
  }))

  // Prepare Rating data
  const ratingData = data.series.rating.current.map((point, idx) => ({
    ts: point.ts,
    current: point.value,
    previous: filters.compare && data.series.rating.previous?.[idx]?.value,
  }))

  // Prepare Performance data
  const performanceData = data.series.performance.current.map((point, idx) => ({
    ts: point.ts,
    impressions: point.impressions,
    installs: point.installs,
    prevImpressions: filters.compare && data.series.performance.previous?.[idx]?.impressions,
    prevInstalls: filters.compare && data.series.performance.previous?.[idx]?.installs,
  }))

  // Prepare Visitors/Acquisitions data
  const visitorsData = data.series.visitors.current.map((point, idx) => ({
    ts: point.ts,
    visitors: point.value,
    acquisitions: data.series.acquisitions.current[idx]?.value,
    prevVisitors: filters.compare && data.series.visitors.previous?.[idx]?.value,
    prevAcquisitions: filters.compare && data.series.acquisitions.previous?.[idx]?.value,
  }))

  return (
    <div className="space-y-6">
      {/* Compare Toggle */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <Switch id="compare-mode" checked={filters.compare} onCheckedChange={onCompareChange} />
            <Label htmlFor="compare-mode" className="cursor-pointer">
              Compare to previous period
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
          <CardDescription>Impressions and Installs over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ts" tickFormatter={formatXAxis} />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip labelFormatter={formatXAxis} />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="impressions"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Impressions"
                dot={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="installs"
                stroke="#10b981"
                strokeWidth={2}
                name="Installs"
                dot={false}
              />
              {filters.compare && (
                <>
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="prevImpressions"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    opacity={0.5}
                    name="Prev Impressions"
                    dot={false}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="prevInstalls"
                    stroke="#10b981"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    opacity={0.5}
                    name="Prev Installs"
                    dot={false}
                  />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* CVR Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Rate Trend</CardTitle>
          <CardDescription>CVR over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={cvrData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ts" tickFormatter={formatXAxis} />
              <YAxis />
              <Tooltip labelFormatter={formatXAxis} formatter={(value: number) => `${value.toFixed(2)}%`} />
              <Legend />
              <Line type="monotone" dataKey="current" stroke="#8b5cf6" strokeWidth={2} name="Current CVR" dot={false} />
              {filters.compare && (
                <Line
                  type="monotone"
                  dataKey="previous"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  opacity={0.5}
                  name="Previous CVR"
                  dot={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Rating Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Rating Trend</CardTitle>
          <CardDescription>Average rating over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={ratingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ts" tickFormatter={formatXAxis} />
              <YAxis domain={[0, 5]} />
              <Tooltip labelFormatter={formatXAxis} formatter={(value: number) => value.toFixed(1)} />
              <Legend />
              <Line
                type="monotone"
                dataKey="current"
                stroke="#f59e0b"
                strokeWidth={2}
                name="Current Rating"
                dot={false}
              />
              {filters.compare && (
                <Line
                  type="monotone"
                  dataKey="previous"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  opacity={0.5}
                  name="Previous Rating"
                  dot={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Store Listing Visitors/Acquisitions */}
      <Card>
        <CardHeader>
          <CardTitle>Store Listing Performance</CardTitle>
          <CardDescription>Visitors and Acquisitions over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={visitorsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ts" tickFormatter={formatXAxis} />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip labelFormatter={formatXAxis} />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="visitors"
                stroke="#06b6d4"
                strokeWidth={2}
                name="Visitors"
                dot={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="acquisitions"
                stroke="#ec4899"
                strokeWidth={2}
                name="Acquisitions"
                dot={false}
              />
              {filters.compare && (
                <>
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="prevVisitors"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    opacity={0.5}
                    name="Prev Visitors"
                    dot={false}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="prevAcquisitions"
                    stroke="#ec4899"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    opacity={0.5}
                    name="Prev Acquisitions"
                    dot={false}
                  />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
