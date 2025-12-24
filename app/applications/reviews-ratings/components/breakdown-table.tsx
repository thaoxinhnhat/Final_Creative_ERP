"use client"

import type React from "react"
import { useMemo, useState } from "react"
import { Download, ChevronDown, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { compact, formatFull } from "@/lib/star-colors"

export type BreakdownRow = {
  label: string
  count: number
  avg: number
  onClick?: () => void
}

type BreakdownTableProps = {
  title: string
  icon?: React.ReactNode
  rows: BreakdownRow[]
  initialCount?: number
  pageSize?: number
  loading?: boolean
  emptyText?: string
  defaultOpen?: boolean
  onExport?: () => void
}

export function BreakdownTable({
  title,
  icon,
  rows,
  initialCount = 5,
  pageSize = 5,
  loading = false,
  emptyText = "No data for current filter",
  defaultOpen = true,
  onExport,
}: BreakdownTableProps) {
  const total = rows?.length ?? 0
  const [visible, setVisible] = useState<number>(Math.min(initialCount, total))
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [sortBy, setSortBy] = useState<"count" | "avg">("count")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const remaining = Math.max(total - visible, 0)

  const sortedRows = useMemo(() => {
    if (!rows || rows.length === 0) return []
    return [...rows].sort((a, b) => {
      const aVal = sortBy === "count" ? a.count : a.avg
      const bVal = sortBy === "count" ? b.count : b.avg
      return sortOrder === "desc" ? bVal - aVal : aVal - bVal
    })
  }, [rows, sortBy, sortOrder])

  const visibleRows = useMemo(() => {
    return sortedRows.slice(0, visible)
  }, [sortedRows, visible])

  const handleSort = (column: "count" | "avg") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc")
    } else {
      setSortBy(column)
      setSortOrder("desc")
    }
  }

  const handleShowMore = () => {
    if (remaining <= 0) return
    setVisible((v) => Math.min(v + pageSize, total))
  }

  const handleShowLess = () => {
    setVisible(Math.min(initialCount, total))
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                {icon}
                {title}
              </CardTitle>
              <div className="flex items-center gap-2">
                {onExport && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onExport()
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}
                <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent>
            {loading && <div className="px-3 py-6 text-sm text-gray-500">Loading…</div>}

            {!loading && total === 0 && <div className="px-3 py-6 text-sm text-gray-500">{emptyText}</div>}

            {!loading && total > 0 && (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2 font-medium text-gray-500 dark:text-gray-400">Name</th>
                        <th
                          className="text-right py-3 px-2 font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                          onClick={() => handleSort("count")}
                        >
                          <div className="flex items-center justify-end gap-1">
                            Number of ratings
                            {sortBy === "count" && <span className="text-xs">{sortOrder === "desc" ? "↓" : "↑"}</span>}
                          </div>
                        </th>
                        <th
                          className="text-right py-3 px-2 font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                          onClick={() => handleSort("avg")}
                        >
                          <div className="flex items-center justify-end gap-1">
                            Average rating
                            {sortBy === "avg" && <span className="text-xs">{sortOrder === "desc" ? "↓" : "↑"}</span>}
                          </div>
                        </th>
                        <th className="text-right py-3 px-2 font-medium text-gray-500 dark:text-gray-400">Explore</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleRows.map((item, idx) => (
                        <tr key={`${item.label}-${idx}`} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="py-3 px-2 font-medium text-gray-900 dark:text-gray-100">{item.label}</td>
                          <td className="text-right py-3 px-2">
                            <span
                              className="font-semibold text-gray-900 dark:text-gray-100"
                              title={formatFull(item.count)}
                            >
                              {compact(item.count)}
                            </span>
                          </td>
                          <td className="text-right py-3 px-2">
                            <div className="flex items-center justify-end gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold text-gray-900 dark:text-gray-100">
                                {item.avg.toFixed(1)}
                              </span>
                            </div>
                          </td>
                          <td className="text-right py-3 px-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={item.onClick}
                              aria-label={`Explore ${item.label}`}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {total > initialCount && (
                  <div className="mt-4 text-center">
                    {remaining > 0 ? (
                      <Button type="button" variant="outline" size="sm" onClick={handleShowMore}>
                        Show more ({remaining} more)
                      </Button>
                    ) : (
                      visible > initialCount && (
                        <Button type="button" variant="outline" size="sm" onClick={handleShowLess}>
                          Show less
                        </Button>
                      )
                    )}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}
