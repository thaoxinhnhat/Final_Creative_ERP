"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { CAByMarket } from "../types"
import { formatNumber, formatPercent } from "../lib/formatters"

interface CAByMarketTableProps {
  data: CAByMarket[]
}

export function CAByMarketTable({ data }: CAByMarketTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>CA Breakdown by Market</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Country</TableHead>
                <TableHead className="text-right">CA Count</TableHead>
                <TableHead className="text-right">Total Users</TableHead>
                <TableHead className="text-right">CA Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.country} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{row.country}</TableCell>
                  <TableCell className="text-right">{formatNumber(row.caCount)}</TableCell>
                  <TableCell className="text-right">{formatNumber(row.totalUsers)}</TableCell>
                  <TableCell className="text-right">{formatPercent(row.percentage)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
