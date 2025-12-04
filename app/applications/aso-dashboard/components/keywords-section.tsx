"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { KeywordMetrics } from "../types"
import { formatNumber, formatPercentage } from "../lib/formatters"
import { ArrowUp, ArrowDown, Minus } from "lucide-react"

interface KeywordsSectionProps {
  data: KeywordMetrics[]
}

export function KeywordsSection({ data }: KeywordsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Keywords</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Rank</TableHead>
              <TableHead>Keyword</TableHead>
              <TableHead className="text-right">Impressions</TableHead>
              <TableHead className="text-right">Installs</TableHead>
              <TableHead className="text-right">CVR</TableHead>
              <TableHead className="text-right">Rank Change</TableHead>
              <TableHead className="text-right">CVR Change</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((keyword) => (
              <TableRow key={keyword.keyword}>
                <TableCell className="font-medium">#{keyword.rank}</TableCell>
                <TableCell>{keyword.keyword}</TableCell>
                <TableCell className="text-right">{formatNumber(keyword.impressions)}</TableCell>
                <TableCell className="text-right">{formatNumber(keyword.installs)}</TableCell>
                <TableCell className="text-right">{formatPercentage(keyword.cvr)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {keyword.rankChange > 0 ? (
                      <ArrowUp className="h-3 w-3 text-green-600" />
                    ) : keyword.rankChange < 0 ? (
                      <ArrowDown className="h-3 w-3 text-red-600" />
                    ) : (
                      <Minus className="h-3 w-3 text-gray-400" />
                    )}
                    <span
                      className={
                        keyword.rankChange > 0
                          ? "text-green-600"
                          : keyword.rankChange < 0
                            ? "text-red-600"
                            : "text-gray-500"
                      }
                    >
                      {Math.abs(keyword.rankChange)}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {keyword.deltaCvr >= 0 ? (
                      <ArrowUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <ArrowDown className="h-3 w-3 text-red-600" />
                    )}
                    <span className={keyword.deltaCvr >= 0 ? "text-green-600" : "text-red-600"}>
                      {formatPercentage(Math.abs(keyword.deltaCvr))}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
