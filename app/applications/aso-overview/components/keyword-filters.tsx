"use client"

import { Calendar, Globe, Smartphone } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export type Device = "iPhone" | "iPad" | "Android"
export type Granularity = "auto" | "day" | "week" | "month"

export type KeywordFilters = {
  dateFrom: string
  dateTo: string
  country: string
  device: Device
  minTraffic: number
  keywords: string[]
  granularity: Granularity
}

const dateRangeOptions = [
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 90 Days", value: "90d" },
  { label: "Custom Range", value: "custom" },
]

interface KeywordFiltersBarProps {
  filters: KeywordFilters
  onFiltersChange: (patch: Partial<KeywordFilters>) => void
}

export function KeywordFiltersBar({ filters, onFiltersChange }: KeywordFiltersBarProps) {
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [dateRangeType, setDateRangeType] = useState("30d")

  const getDateRangeLabel = () => {
    if (dateRangeType === "custom") {
      return `${filters.dateFrom.slice(0, 10)} → ${filters.dateTo.slice(0, 10)}`
    }
    return dateRangeOptions.find((opt) => opt.value === dateRangeType)?.label || "Select Range"
  }

  const getOSIcon = (device: string) => {
    return device.toLowerCase().includes("android") ? "🤖" : "🍎"
  }

  const getCountryFlag = (country: string) => {
    const flags: Record<string, string> = {
      global: "🌍",
      us: "🇺🇸",
      jp: "🇯🇵",
      vn: "🇻🇳",
      kr: "🇰🇷",
      uk: "🇬🇧",
      de: "🇩🇪",
      fr: "🇫🇷",
    }
    return flags[country] || "🌍"
  }

  return (
    <div className="sticky top-0 z-20 bg-background border-b shadow-sm">
      <div className="px-6 py-4 space-y-4">
        {/* Primary Filters */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Date Range */}
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-64 justify-start bg-transparent">
                <Calendar className="h-4 w-4 mr-2" />
                {getDateRangeLabel()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="start">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-3">Select Date Range</h4>
                  <div className="space-y-2">
                    {dateRangeOptions.map((option) => (
                      <div key={option.value}>
                        <button
                          onClick={() => {
                            setDateRangeType(option.value)
                            if (option.value !== "custom") {
                              const now = new Date()
                              const start = new Date(now)
                              if (option.value === "7d") start.setDate(now.getDate() - 7)
                              else if (option.value === "30d") start.setDate(now.getDate() - 30)
                              else if (option.value === "90d") start.setDate(now.getDate() - 90)

                              onFiltersChange({
                                dateFrom: start.toISOString().slice(0, 10),
                                dateTo: now.toISOString().slice(0, 10),
                              })
                            }
                          }}
                          className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                            dateRangeType === option.value
                              ? "bg-blue-100 text-blue-700 font-medium dark:bg-blue-950 dark:text-blue-300"
                              : "hover:bg-muted"
                          }`}
                        >
                          {option.label}
                        </button>
                        {option.value === "custom" && dateRangeType === "custom" && (
                          <div className="mt-2 ml-3 space-y-2">
                            <div>
                              <label className="text-xs text-muted-foreground mb-1 block">Start Date</label>
                              <Input
                                type="date"
                                value={filters.dateFrom}
                                onChange={(e) => onFiltersChange({ dateFrom: e.target.value })}
                                className="h-8"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-muted-foreground mb-1 block">End Date</label>
                              <Input
                                type="date"
                                value={filters.dateTo}
                                onChange={(e) => onFiltersChange({ dateTo: e.target.value })}
                                className="h-8"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-3 border-t">
                  <Button onClick={() => setDatePickerOpen(false)} className="flex-1" size="sm">
                    Apply
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Country */}
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Country:</span>
            <Select value={filters.country} onValueChange={(v) => onFiltersChange({ country: v })}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="global">🌍 Global</SelectItem>
                <SelectItem value="us">🇺🇸 United States</SelectItem>
                <SelectItem value="vn">🇻🇳 Vietnam</SelectItem>
                <SelectItem value="jp">🇯🇵 Japan</SelectItem>
                <SelectItem value="kr">🇰🇷 South Korea</SelectItem>
                <SelectItem value="uk">🇬🇧 United Kingdom</SelectItem>
                <SelectItem value="de">🇩🇪 Germany</SelectItem>
                <SelectItem value="fr">🇫🇷 France</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Device */}
          <div className="flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Device:</span>
            <Select value={filters.device} onValueChange={(v) => onFiltersChange({ device: v as Device })}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="iPhone">🍎 iPhone</SelectItem>
                <SelectItem value="iPad">🍎 iPad</SelectItem>
                <SelectItem value="Android">🤖 Android</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Min Traffic */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Min Traffic:</span>
            <Select
              value={String(filters.minTraffic)}
              onValueChange={(v) => onFiltersChange({ minTraffic: Number(v) })}
            >
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">All</SelectItem>
                <SelectItem value="1">1+</SelectItem>
                <SelectItem value="5">5+</SelectItem>
                <SelectItem value="10">10+</SelectItem>
                <SelectItem value="20">20+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Granularity */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Granularity:</span>
            <Select
              value={filters.granularity}
              onValueChange={(v) => onFiltersChange({ granularity: v as Granularity })}
            >
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto</SelectItem>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Keywords Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Keywords (optional):</span>
          <Input
            placeholder="Enter keywords separated by commas..."
            value={filters.keywords.join(", ")}
            onChange={(e) =>
              onFiltersChange({
                keywords: e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
            className="max-w-md"
          />
        </div>

        {/* Active Filters Summary */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
          <span className="font-medium">Active Filters:</span>
          <Badge variant="secondary">
            {getOSIcon(filters.device)} {filters.device}
          </Badge>
          <span className="text-muted-foreground">•</span>
          <Badge variant="secondary">
            {getCountryFlag(filters.country)} {filters.country === "global" ? "Global" : filters.country.toUpperCase()}
          </Badge>
          <span className="text-muted-foreground">•</span>
          <Badge variant="secondary">{getDateRangeLabel()}</Badge>
          <span className="text-muted-foreground">•</span>
          <Badge variant="secondary">Traffic: {filters.minTraffic}+</Badge>
          <span className="text-muted-foreground">•</span>
          <Badge variant="secondary">Granularity: {filters.granularity}</Badge>
          {filters.keywords.length > 0 && (
            <>
              <span className="text-muted-foreground">•</span>
              <Badge variant="secondary">{filters.keywords.length} keyword(s)</Badge>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
