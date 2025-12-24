"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { CAData } from "../types"
import { formatPercentage } from "../lib/formatters"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface CASectionProps {
  data: CAData
}

const COLORS = {
  none: "#10b981",
  low: "#3b82f6",
  medium: "#f59e0b",
  high: "#ef4444",
}

export function CASection({ data }: CASectionProps) {
  if (!data.available) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-gray-500">No compression artifact data available for this application</p>
        </CardContent>
      </Card>
    )
  }

  const pieData = data.distribution.map((item) => ({
    name: item.level.charAt(0).toUpperCase() + item.level.slice(1),
    value: item.count,
    percentage: item.percentage,
  }))

  return (
    <div className="space-y-6">
      {/* Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Compression Artifact Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `${value} (${pieData.find((d) => d.value === value)?.percentage}%)`}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Impact Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>CVR Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{formatPercentage(data.impact.cvrDelta)}</div>
            <p className="text-sm text-gray-600 mt-1">Average CVR decrease with CA</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Rating Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{data.impact.ratingDelta.toFixed(2)}</div>
            <p className="text-sm text-gray-600 mt-1">Average rating decrease with CA</p>
          </CardContent>
        </Card>
      </div>

      {/* By Market Table */}
      <Card>
        <CardHeader>
          <CardTitle>CA Impact by Market</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Country</TableHead>
                <TableHead>Level</TableHead>
                <TableHead className="text-right">Share</TableHead>
                <TableHead className="text-right">CVR (CA)</TableHead>
                <TableHead className="text-right">CVR (Non-CA)</TableHead>
                <TableHead className="text-right">CVR Delta</TableHead>
                <TableHead className="text-right">Rating Delta</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.byMarket.map((market) => (
                <TableRow key={market.country}>
                  <TableCell className="font-medium">{market.country}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        market.level === "High"
                          ? "bg-red-100 text-red-800"
                          : market.level === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {market.level}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">{formatPercentage(market.share)}</TableCell>
                  <TableCell className="text-right">{formatPercentage(market.cvrCA)}</TableCell>
                  <TableCell className="text-right">{formatPercentage(market.cvrNonCA)}</TableCell>
                  <TableCell className="text-right">
                    <span className="text-red-600">{formatPercentage(market.deltaCvr)}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-red-600">{market.deltaRating.toFixed(2)}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* By Device Table */}
      <Card>
        <CardHeader>
          <CardTitle>CA Impact by Device</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead>Level</TableHead>
                <TableHead className="text-right">Share</TableHead>
                <TableHead className="text-right">CVR (CA)</TableHead>
                <TableHead className="text-right">CVR (Non-CA)</TableHead>
                <TableHead className="text-right">CVR Delta</TableHead>
                <TableHead className="text-right">Rating Delta</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.byDevice.map((device) => (
                <TableRow key={device.device}>
                  <TableCell className="font-medium">{device.device}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        device.level === "High"
                          ? "bg-red-100 text-red-800"
                          : device.level === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {device.level}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">{formatPercentage(device.share)}</TableCell>
                  <TableCell className="text-right">{formatPercentage(device.cvrCA)}</TableCell>
                  <TableCell className="text-right">{formatPercentage(device.cvrNonCA)}</TableCell>
                  <TableCell className="text-right">
                    <span className="text-red-600">{formatPercentage(device.deltaCvr)}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-red-600">{device.deltaRating.toFixed(2)}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
