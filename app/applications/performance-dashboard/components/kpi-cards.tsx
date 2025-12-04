"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Eye, TrendingUp, TrendingDown, Download, Star } from "lucide-react"
import type { KPIData } from "../types"

interface KPICardsProps {
  data: KPIData
}

const kpiConfig = [
  {
    key: "impressions",
    title: "Total Impressions",
    icon: Eye,
    color: "blue",
    format: (value: number) => `${(value / 1000000).toFixed(1)}M`,
  },
  {
    key: "cvr",
    title: "Conversion Rate",
    icon: TrendingUp,
    color: "green",
    format: (value: number) => `${value.toFixed(1)}%`,
  },
  {
    key: "installs",
    title: "Total Installs",
    icon: Download,
    color: "purple",
    format: (value: number) => `${(value / 1000).toFixed(0)}K`,
  },
  {
    key: "avgRating",
    title: "Average Rating",
    icon: Star,
    color: "yellow",
    format: (value: number) => value.toFixed(1),
  },
]

export function KPICards({ data }: KPICardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiConfig.map((kpi) => {
        const Icon = kpi.icon
        const value = data[kpi.key as keyof KPIData] as number
        const delta = data.delta[kpi.key as keyof KPIData["delta"]] as number
        const isPositive = delta > 0

        return (
          <Card key={kpi.key}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{kpi.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{kpi.format(value)}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {isPositive ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
                      {isPositive ? "+" : ""}
                      {kpi.key === "avgRating" ? delta.toFixed(1) : `${delta.toFixed(1)}%`}
                    </span>
                  </div>
                </div>
                <div
                  className={`p-3 rounded-lg ${
                    kpi.color === "blue"
                      ? "bg-blue-100"
                      : kpi.color === "green"
                        ? "bg-green-100"
                        : kpi.color === "purple"
                          ? "bg-purple-100"
                          : "bg-yellow-100"
                  }`}
                >
                  <Icon
                    className={`h-6 w-6 ${
                      kpi.color === "blue"
                        ? "text-blue-600"
                        : kpi.color === "green"
                          ? "text-green-600"
                          : kpi.color === "purple"
                            ? "text-purple-600"
                            : "text-yellow-600"
                    }`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
