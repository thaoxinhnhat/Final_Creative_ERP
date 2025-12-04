"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, TrendingUp, TrendingDown } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import type { CaLevel, CaMarketRow, CaDeviceRow } from "../types"

type SortKey = "name" | "caLevel" | "share" | "deltaCVR" | "deltaRating"
type SortDir = "asc" | "desc"

interface BreakdownTableProps {
  title: string
  rows: (CaMarketRow | CaDeviceRow)[]
  loading: boolean
  error: string | null
  onRetry: () => void
  kind: "market" | "device"
}

function getCaLevelColor(level: CaLevel) {
  switch (level) {
    case "None":
      return "bg-gray-100 text-gray-700 border-gray-300"
    case "Low":
      return "bg-green-100 text-green-700 border-green-300"
    case "Medium":
      return "bg-yellow-100 text-yellow-700 border-yellow-300"
    case "High":
      return "bg-red-100 text-red-700 border-red-300"
  }
}

export function BreakdownTable({ title, rows, loading, error, onRetry, kind }: BreakdownTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("share")
  const [sortDir, setSortDir] = useState<SortDir>("desc")
  const [currentPage, setCurrentPage] = useState(0)

  const pageSize = 10

  const sortedRows = useMemo(() => {
    const sorted = [...rows].sort((a, b) => {
      let aVal: any
      let bVal: any

      switch (sortKey) {
        case "name":
          aVal = kind === "market" ? (a as CaMarketRow).market : (a as CaDeviceRow).device
          bVal = kind === "market" ? (b as CaMarketRow).market : (b as CaDeviceRow).device
          break
        case "caLevel":
          aVal = a.caLevel
          bVal = b.caLevel
          break
        case "share":
          aVal = a.share
          bVal = b.share
          break
        case "deltaCVR":
          aVal = a.deltaCVR
          bVal = b.deltaCVR
          break
        case "deltaRating":
          aVal = a.deltaRating
          bVal = b.deltaRating
          break
      }

      if (typeof aVal === "string") {
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }

      return sortDir === "asc" ? aVal - bVal : bVal - aVal
    })

    return sorted
  }, [rows, sortKey, sortDir, kind])

  const paginatedRows = useMemo(() => {
    const start = currentPage * pageSize
    return sortedRows.slice(start, start + pageSize)
  }, [sortedRows, currentPage])

  const totalPages = Math.ceil(sortedRows.length / pageSize)

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDir("desc")
    }
    setCurrentPage(0)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-sm text-red-600 mb-4">{error}</p>
            <Button onClick={onRetry} size="sm">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (rows.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">No CA data for current filters</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort("name")} className="h-8 px-2">
                  {kind === "market" ? "Market" : "Device"}
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort("caLevel")} className="h-8 px-2">
                  CA Level
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort("share")} className="h-8 px-2">
                  Share
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" size="sm" onClick={() => handleSort("deltaCVR")} className="h-8 px-2">
                  Δ CVR
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" size="sm" onClick={() => handleSort("deltaRating")} className="h-8 px-2">
                  Δ Rating
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRows.map((row, idx) => {
              const name = kind === "market" ? (row as CaMarketRow).market : (row as CaDeviceRow).device

              return (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getCaLevelColor(row.caLevel)}>
                      {row.caLevel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">{(row.share * 100).toFixed(1)}%</div>
                      <Progress value={row.share * 100} className="h-1" />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {row.deltaCVR >= 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600" />
                      )}
                      <span className={`font-mono text-sm ${row.deltaCVR >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {row.deltaCVR >= 0 ? "+" : ""}
                        {(row.deltaCVR * 100).toFixed(2)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {row.deltaRating >= 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600" />
                      )}
                      <span className={`font-mono text-sm ${row.deltaRating >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {row.deltaRating >= 0 ? "+" : ""}
                        {row.deltaRating.toFixed(2)} ⭐
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {currentPage * pageSize + 1}-{Math.min((currentPage + 1) * pageSize, sortedRows.length)} of{" "}
              {sortedRows.length}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage === totalPages - 1}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
