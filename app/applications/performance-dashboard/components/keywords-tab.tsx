"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, TrendingDown } from "lucide-react"
import type { DashboardData } from "../types"

interface KeywordsTabProps {
  data: DashboardData
}

export function KeywordsTab({ data }: KeywordsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Keywords Performance</CardTitle>
        <CardDescription>Keywords driving the most installs</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Rank</TableHead>
              <TableHead>Keyword</TableHead>
              <TableHead className="text-right">Impressions</TableHead>
              <TableHead className="text-right">Installs</TableHead>
              <TableHead className="text-right">CVR</TableHead>
              <TableHead className="text-right">Δ CVR</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.keywords.map((keyword, index) => (
              <TableRow key={index} className="cursor-pointer hover:bg-muted/50">
                <TableCell>
                  <Badge variant="outline" className="font-mono">
                    #{keyword.rank}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{keyword.keyword}</TableCell>
                <TableCell className="text-right">{keyword.impressions.toLocaleString()}</TableCell>
                <TableCell className="text-right">{keyword.installs.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <span className="font-semibold">{keyword.cvr.toFixed(1)}%</span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {keyword.deltaCvr > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : keyword.deltaCvr < 0 ? (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    ) : null}
                    <span
                      className={`font-mono ${
                        keyword.deltaCvr > 0
                          ? "text-green-600"
                          : keyword.deltaCvr < 0
                            ? "text-red-600"
                            : "text-gray-500"
                      }`}
                    >
                      {keyword.deltaCvr > 0 ? "+" : ""}
                      {keyword.deltaCvr.toFixed(1)}%
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
