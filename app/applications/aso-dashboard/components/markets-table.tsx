"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
} from "recharts"
import type { MarketMetrics } from "../types"
import { formatNumber, formatPercentage } from "../lib/formatters"

interface MarketsTableProps {
  data: MarketMetrics[]
}

type SortKey = keyof MarketMetrics

export function MarketsTable({ data }: MarketsTableProps) {
  const [sortBy, setSortBy] = useState<SortKey>("visitors")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedMarket, setSelectedMarket] = useState<MarketMetrics | null>(null)

  const sortedData = [...data].sort((a, b) => {
    const aVal = a[sortBy]
    const bVal = b[sortBy]
    const multiplier = sortOrder === "asc" ? 1 : -1
    if (typeof aVal === "number" && typeof bVal === "number") {
      return (aVal - bVal) * multiplier
    }
    if (typeof aVal === "string" && typeof bVal === "string") {
      return aVal.localeCompare(bVal) * multiplier
    }
    return 0
  })

  const handleSort = (column: SortKey) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("desc")
    }
  }

  // Mock trend data for slide-over
  const trendData = Array.from({ length: 30 }, (_, i) => {
    const baseCvr = selectedMarket?.cvr || 0.04
    return {
      date: `Day ${i + 1}`,
      cvr: baseCvr + (Math.random() - 0.5) * 0.01,
    }
  })

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Market Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button variant="ghost" size="sm" onClick={() => handleSort("market")} className="h-8 px-2">
                      Market
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleSort("visitors")} className="h-8 px-2">
                      Store Listing Visitors
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleSort("acquisitions")} className="h-8 px-2">
                      Store Listing Acquisitions
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleSort("cvr")} className="h-8 px-2">
                      Store Listing CVR
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleSort("impressions")} className="h-8 px-2">
                      Impressions
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleSort("installs")} className="h-8 px-2">
                      Installs
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">vs Peers</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((row) => (
                  <TableRow
                    key={row.countryCode}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => setSelectedMarket(row)}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{row.countryCode}</span>
                        <span>{row.market}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{formatNumber(row.visitors)}</TableCell>
                    <TableCell className="text-right">{formatNumber(row.acquisitions)}</TableCell>
                    <TableCell className="text-right font-medium">{formatPercentage(row.cvr)}</TableCell>
                    <TableCell className="text-right">{formatNumber(row.impressions)}</TableCell>
                    <TableCell className="text-right">{formatNumber(row.installs)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {row.crVsPeers >= 0 ? (
                          <ArrowUp className="h-3 w-3 text-green-600" />
                        ) : (
                          <ArrowDown className="h-3 w-3 text-red-600" />
                        )}
                        <span className={row.crVsPeers >= 0 ? "text-green-600" : "text-red-600"}>
                          {formatPercentage(Math.abs(row.crVsPeers))}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Market Detail Slide-over */}
      <Sheet open={!!selectedMarket} onOpenChange={(open) => !open && setSelectedMarket(null)}>
        <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto">
          {selectedMarket && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <span className="text-2xl">{selectedMarket.countryCode}</span>
                  <span>{selectedMarket.market}</span>
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Store Listing CVR</p>
                    <p className="text-2xl font-bold">{formatPercentage(selectedMarket.cvr)}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Peer Median</p>
                    <p className="text-2xl font-bold">{formatPercentage(selectedMarket.peerMedian)}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Visitors</p>
                    <p className="text-2xl font-bold">{formatNumber(selectedMarket.visitors)}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Acquisitions</p>
                    <p className="text-2xl font-bold">{formatNumber(selectedMarket.acquisitions)}</p>
                  </div>
                </div>

                {/* CR Trend with Peer Range */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">CR Trend vs Peers</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trendData}>
                      <defs>
                        <linearGradient id="peerRangeGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#e5e7eb" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#e5e7eb" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" stroke="#888" fontSize={10} interval={4} />
                      <YAxis stroke="#888" fontSize={10} tickFormatter={(value) => `${(value * 100).toFixed(1)}%`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => `${(value * 100).toFixed(2)}%`}
                      />
                      {/* Peer range shaded area - simulated */}
                      <Area
                        type="monotone"
                        dataKey={() => selectedMarket.peerRange[1]}
                        stroke="none"
                        fill="url(#peerRangeGradient)"
                        fillOpacity={0.3}
                      />
                      <ReferenceLine
                        y={selectedMarket.peerMedian}
                        stroke="#6b7280"
                        strokeDasharray="3 3"
                        label={{ value: "Peer Median", position: "right", fontSize: 10 }}
                      />
                      <Line type="monotone" dataKey="cvr" name="CVR" stroke="#f97316" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>
                      Peer Range: {formatPercentage(selectedMarket.peerRange[0])} -{" "}
                      {formatPercentage(selectedMarket.peerRange[1])}
                    </p>
                  </div>
                </div>

                {/* Additional Metrics */}
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-3">Additional Metrics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Impressions</span>
                      <span className="font-medium">{formatNumber(selectedMarket.impressions)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Installs</span>
                      <span className="font-medium">{formatNumber(selectedMarket.installs)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">CR vs Peers</span>
                      <span
                        className={`font-medium ${selectedMarket.crVsPeers >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {selectedMarket.crVsPeers >= 0 ? "+" : ""}
                        {formatPercentage(selectedMarket.crVsPeers)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
