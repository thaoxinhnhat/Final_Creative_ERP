"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Check, X } from "lucide-react"
import { Label } from "@/components/ui/label"
import type { DashboardData, DashboardFilters } from "../types"
import { cn } from "@/lib/utils"

interface MarketsTabProps {
  data: DashboardData
  filters: DashboardFilters
  onMarketsChange: (markets: string[] | undefined) => void
}

const allMarkets = ["United States", "Vietnam", "Japan", "South Korea", "United Kingdom", "Germany", "France", "Brazil"]

export function MarketsTab({ data, filters, onMarketsChange }: MarketsTabProps) {
  const [open, setOpen] = useState(false)
  const selectedMarkets = filters.selectedMarkets || []

  const toggleMarket = (market: string) => {
    const newMarkets = selectedMarkets.includes(market)
      ? selectedMarkets.filter((m) => m !== market)
      : [...selectedMarkets, market]
    onMarketsChange(newMarkets.length > 0 ? newMarkets : undefined)
  }

  const clearMarkets = () => {
    onMarketsChange(undefined)
  }

  return (
    <div className="space-y-6">
      {/* Market Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">Markets:</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start bg-transparent">
                  {selectedMarkets.length > 0 ? `${selectedMarkets.length} selected` : "All markets"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search market..." />
                  <CommandList>
                    <CommandEmpty>No market found.</CommandEmpty>
                    <CommandGroup>
                      {allMarkets.map((market) => (
                        <CommandItem key={market} onSelect={() => toggleMarket(market)}>
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedMarkets.includes(market) ? "opacity-100" : "opacity-0",
                            )}
                          />
                          {market}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {selectedMarkets.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearMarkets}>
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
          {selectedMarkets.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedMarkets.map((market) => (
                <Badge key={market} variant="secondary">
                  {market}
                  <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => toggleMarket(market)} />
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance by Market Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Performance by Market</CardTitle>
          <CardDescription>Compare metrics across different markets</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data.markets}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="market" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="impressions" fill="#3b82f6" name="Impressions" />
              <Bar yAxisId="right" dataKey="installs" fill="#10b981" name="Installs" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Market Table */}
      <Card>
        <CardHeader>
          <CardTitle>Store Listing Conversion Analysis</CardTitle>
          <CardDescription>Detailed metrics by market</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Country/Region</TableHead>
                <TableHead className="text-right">Store listing visitors</TableHead>
                <TableHead className="text-right">Store listing acquisitions</TableHead>
                <TableHead className="text-right">Store listing CR</TableHead>
                <TableHead className="text-right">Impressions</TableHead>
                <TableHead className="text-right">Installs</TableHead>
                <TableHead className="text-right">CR vs. peers</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.markets.map((market) => (
                <TableRow key={market.market} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{market.market}</TableCell>
                  <TableCell className="text-right">{market.visitors.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{market.acquisitions.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <span className="font-semibold">{market.cvr.toFixed(2)}%</span>
                  </TableCell>
                  <TableCell className="text-right">{market.impressions.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{market.installs.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={market.peerDeltaCvr > 0 ? "default" : "destructive"} className="font-mono">
                      {market.peerDeltaCvr > 0 ? "+" : ""}
                      {market.peerDeltaCvr.toFixed(1)}%
                    </Badge>
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
