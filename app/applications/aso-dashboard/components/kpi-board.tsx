"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Download, Users, Target, Star, Hash } from "lucide-react"
import type { KPIData } from "../types"
import { formatNumber, formatPercent, formatDelta, formatRating } from "../lib/formatters"

interface KPIBoardProps {
  data: KPIData
}

export function KPIBoard({ data }: KPIBoardProps) {
  const kpis = [
    {
      id: "impressions",
      label: "Total Impressions",
      value: formatNumber(data.impressions.value),
      delta: data.impressions.delta,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: "installs",
      label: "Total Installs",
      value: formatNumber(data.installs.value),
      delta: data.installs.delta,
      icon: Download,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
    },
    {
      id: "cvr",
      label: "Conversion Rate",
      value: formatPercent(data.cvr.value),
      delta: data.cvr.delta,
      icon: Target,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      id: "rating",
      label: "Average Rating",
      value: formatRating(data.rating.value),
      delta: data.rating.delta,
      icon: Star,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      id: "keywords",
      label: "Keyword Health",
      value: `↑${data.keywordHealth.upTop10} / ↓${data.keywordHealth.downTop10}`,
      delta: null,
      icon: Hash,
      color: "text-green-600",
      bgColor: "bg-green-50",
      subtitle: "Keywords (Top 1-10)",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon
        const isPositive = kpi.delta ? kpi.delta >= 0 : null

        return (
          <Card key={kpi.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                  <Icon className={`h-6 w-6 ${kpi.color}`} />
                </div>
                {isPositive !== null && (
                  <div className={`flex items-center gap-1 ${isPositive ? "text-green-600" : "text-red-600"}`}>
                    {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    <span className="text-sm font-medium">{formatDelta(kpi.delta!)}</span>
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                <p className="text-sm text-gray-500">{kpi.subtitle || kpi.label}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
