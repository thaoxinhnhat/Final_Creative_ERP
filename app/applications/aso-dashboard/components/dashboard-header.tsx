"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Download, FileText, X } from "lucide-react"
import type { ChartFilters } from "../types"
import { cn } from "@/lib/utils"
import { format, parse } from "date-fns"
import { useState } from "react"
import { mockApps, countries } from "../data/mock-data"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

interface DashboardHeaderProps {
  filters: ChartFilters | null
  onFiltersChange: (updates: Partial<ChartFilters>) => void
}

export function DashboardHeader({ filters, onFiltersChange }: DashboardHeaderProps) {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: filters?.dateStart ? parse(filters.dateStart, "yyyy-MM-dd", new Date()) : undefined,
    to: filters?.dateEnd ? parse(filters.dateEnd, "yyyy-MM-dd", new Date()) : undefined,
  })
  const [countrySearchOpen, setCountrySearchOpen] = useState(false)

  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    setDateRange(range)
    if (range.from && range.to) {
      onFiltersChange({
        dateStart: format(range.from, "yyyy-MM-dd"),
        dateEnd: format(range.to, "yyyy-MM-dd"),
      })
    }
  }

  const handlePresetChange = (value: string) => {
    const endDate = new Date()
    const startDate = new Date()

    switch (value) {
      case "7d":
        startDate.setDate(endDate.getDate() - 6)
        break
      case "28d":
        startDate.setDate(endDate.getDate() - 27)
        break
      case "90d":
        startDate.setDate(endDate.getDate() - 89)
        break
      case "180d":
        startDate.setDate(endDate.getDate() - 179)
        break
      case "365d":
        startDate.setDate(endDate.getDate() - 364)
        break
      default:
        return
    }

    onFiltersChange({
      dateStart: format(startDate, "yyyy-MM-dd"),
      dateEnd: format(endDate, "yyyy-MM-dd"),
    })

    setDateRange({ from: startDate, to: endDate })
  }

  const toggleCountry = (countryCode: string) => {
    const current = filters?.countries || []
    const updated = current.includes(countryCode) ? current.filter((c) => c !== countryCode) : [...current, countryCode]

    onFiltersChange({ countries: updated })
  }

  const selectedApp = filters?.appId ? mockApps.find((app) => app.id === filters.appId) : null
  const selectedCountries = filters?.countries || []

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">ASO Performance Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" type="button">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" size="sm" type="button">
            <FileText className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-wrap mb-3">
        {/* App Select */}
        <div className="min-w-[250px]">
          <Select
            value={filters?.appId || ""}
            onValueChange={(value) => {
              const app = mockApps.find((a) => a.id === value)
              if (app) {
                onFiltersChange({
                  appId: value,
                  store: app.store,
                  platform: app.platform,
                })
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an app" />
            </SelectTrigger>
            <SelectContent>
              {mockApps.map((app) => (
                <SelectItem key={app.id} value={app.id}>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{app.icon}</span>
                    <div className="flex flex-col">
                      <span className="font-medium">{app.name}</span>
                      <span className="text-xs text-gray-500">{app.package}</span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Range */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !dateRange.from && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "MMM dd, yyyy")} - {format(dateRange.to, "MMM dd, yyyy")}
                  </>
                ) : (
                  format(dateRange.from, "MMM dd, yyyy")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-3 border-b">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => handlePresetChange("7d")}>
                  Last 7 days
                </Button>
                <Button variant="outline" size="sm" onClick={() => handlePresetChange("28d")}>
                  Last 28 days
                </Button>
                <Button variant="outline" size="sm" onClick={() => handlePresetChange("90d")}>
                  Last 90 days
                </Button>
                <Button variant="outline" size="sm" onClick={() => handlePresetChange("180d")}>
                  Last 180 days
                </Button>
                <Button variant="outline" size="sm" onClick={() => handlePresetChange("365d")}>
                  Last 365 days
                </Button>
              </div>
            </div>
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={{ from: dateRange?.from, to: dateRange?.to }}
              onSelect={(range) => handleDateRangeChange({ from: range?.from, to: range?.to })}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        {/* Granularity */}
        <Select
          value={filters?.granularity || "daily"}
          onValueChange={(value) => onFiltersChange({ granularity: value as any })}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>

        {/* Region Mode */}
        <Select
          value={filters?.regionMode || "global"}
          onValueChange={(value) => {
            onFiltersChange({
              regionMode: value as "global" | "countries",
              countries: value === "global" ? [] : filters?.countries || [],
            })
          }}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="global">Global</SelectItem>
            <SelectItem value="countries">Countries</SelectItem>
          </SelectContent>
        </Select>

        {/* Country Multi-Select */}
        {filters?.regionMode === "countries" && (
          <Popover open={countrySearchOpen} onOpenChange={setCountrySearchOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="min-w-[180px] justify-between bg-transparent">
                {selectedCountries.length === 0 ? (
                  <span className="text-muted-foreground">Select countries</span>
                ) : (
                  <span>{selectedCountries.length} selected</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
              <div className="p-3 border-b">
                <div className="font-medium text-sm mb-2">Select Countries (max 25)</div>
                {selectedCountries.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {selectedCountries.map((code) => {
                      const country = countries.find((c) => c.code === code)
                      return country ? (
                        <Badge key={code} variant="secondary" className="gap-1">
                          {country.flag} {country.code}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleCountry(code)
                            }}
                          />
                        </Badge>
                      ) : null
                    })}
                  </div>
                )}
              </div>
              <ScrollArea className="h-[300px]">
                <div className="p-3 space-y-2">
                  {countries.map((country) => (
                    <div key={country.code} className="flex items-center space-x-2">
                      <Checkbox
                        id={`country-${country.code}`}
                        checked={selectedCountries.includes(country.code)}
                        onCheckedChange={() => toggleCountry(country.code)}
                        disabled={!selectedCountries.includes(country.code) && selectedCountries.length >= 25}
                      />
                      <Label
                        htmlFor={`country-${country.code}`}
                        className="flex items-center gap-2 text-sm font-normal cursor-pointer flex-1"
                      >
                        <span className="text-lg">{country.flag}</span>
                        <span>{country.name}</span>
                        <span className="text-gray-500">({country.code})</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Selection Summary Bar */}
      {filters && selectedApp && (
        <div className="text-sm text-gray-600 flex items-center gap-2 flex-wrap">
          <span className="font-medium">App:</span>
          <Badge variant="secondary">
            {selectedApp.icon} {selectedApp.name}
          </Badge>
          <span className="text-gray-400">•</span>
          <span className="font-medium">Store:</span>
          <Badge variant="secondary">{filters.store}</Badge>
          <span className="text-gray-400">•</span>
          <span className="font-medium">OS:</span>
          <Badge variant="secondary">{filters.platform}</Badge>
          <span className="text-gray-400">•</span>
          <span className="font-medium">Region:</span>
          <Badge variant="secondary">
            {filters.regionMode === "global"
              ? "Global"
              : `${selectedCountries.length} ${selectedCountries.length === 1 ? "country" : "countries"}`}
          </Badge>
          <span className="text-gray-400">•</span>
          <span className="font-medium">Time:</span>
          <Badge variant="secondary">
            {dateRange.from && dateRange.to
              ? `${format(dateRange.from, "MMM dd")} - ${format(dateRange.to, "MMM dd, yyyy")}`
              : "Select dates"}
          </Badge>
          <span className="text-gray-400">•</span>
          <span className="font-medium">Granularity:</span>
          <Badge variant="secondary">{filters.granularity}</Badge>
        </div>
      )}
    </div>
  )
}
