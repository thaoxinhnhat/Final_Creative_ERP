"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import type { KeywordMetrics } from "../types"
import { formatNumber, formatPercent } from "../lib/formatters"

interface KeywordsTableProps {
  data: KeywordMetrics[]
}

export function KeywordsTable({ data }: KeywordsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Keywords Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Keyword</TableHead>
                <TableHead className="text-right">Rank</TableHead>
                <TableHead className="text-right">Change</TableHead>
                <TableHead className="text-right">Installs</TableHead>
                <TableHead className="text-right">Impressions</TableHead>
                <TableHead className="text-right">CVR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.keyword} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{row.keyword}</TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      #{row.rank}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {row.change > 0 ? (
                        <>
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-600">+{row.change}</span>
                        </>
                      ) : row.change < 0 ? (
                        <>
                          <TrendingDown className="h-4 w-4 text-red-600" />
                          <span className="text-sm font-medium text-red-600">{row.change}</span>
                        </>
                      ) : (
                        <>
                          <Minus className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-500">0</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">{formatNumber(row.installs)}</TableCell>
                  <TableCell className="text-right">{formatNumber(row.impressions)}</TableCell>
                  <TableCell className="text-right">{formatPercent(row.cvr)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
