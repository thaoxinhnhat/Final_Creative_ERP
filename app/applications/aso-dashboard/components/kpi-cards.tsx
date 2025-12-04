"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import type { KPIData } from "../types"
import { formatNumber, formatPercentage, formatDelta, formatRating } from "../lib/formatters"

interface KPICardsProps {
  data: KPIData
}

export function KPICards({ data }: KPICardsProps) {
  const kpis = [
    {
      label: "Total Impressions",
      value: formatNumber(data.totalImpressions.value),
      delta: data.totalImpressions.deltaPct,
      icon: "📊",
    },
    {
      label: "Conversion Rate",
      value: formatPercentage(data.conversionRate.value),
      delta: data.conversionRate.deltaPct,
      icon: "🎯",
    },
    {
      label: "Total Installs",
      value: formatNumber(data.totalInstalls.value),
      delta: data.totalInstalls.deltaPct,
      icon: "⬇️",
    },
    {
      label: "Average Rating",
      value: formatRating(data.averageRating.value),
      delta: data.averageRating.deltaPct,
      icon: "⭐",
    },
    {
      label: "Store Visitors",
      value: formatNumber(data.storeVisitors.value),
      delta: data.storeVisitors.deltaPct,
      icon: "👥",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {kpis.map((kpi) => (
        <Card key={kpi.label}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <p className="text-sm text-gray-600">{kpi.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{kpi.value}</span>
                  <span className="text-2xl">{kpi.icon}</span>
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1">
              {kpi.delta >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span className={`text-sm font-medium ${kpi.delta >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatDelta(kpi.delta)}
              </span>
              <span className="text-sm text-gray-500">vs previous period</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
