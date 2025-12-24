"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { CompressionArtifact } from "../types"
import { formatNumber, formatPercent, formatRating } from "../lib/formatters"

interface CompressionMetricsTableProps {
  data: CompressionArtifact[]
}

export function CompressionMetricsTable({ data }: CompressionMetricsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>CA Impact on Conversion & Rating</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>CA Type</TableHead>
                <TableHead className="text-right">Count</TableHead>
                <TableHead className="text-right">Percentage</TableHead>
                <TableHead className="text-right">Avg CVR</TableHead>
                <TableHead className="text-right">Avg Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.type} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{row.type}</TableCell>
                  <TableCell className="text-right">{formatNumber(row.count)}</TableCell>
                  <TableCell className="text-right">{formatPercent(row.percentage)}</TableCell>
                  <TableCell className="text-right">{formatPercent(row.avgCvr)}</TableCell>
                  <TableCell className="text-right">{formatRating(row.avgRating)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
