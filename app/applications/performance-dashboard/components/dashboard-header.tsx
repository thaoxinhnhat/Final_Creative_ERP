"use client"

import { Calendar, Download, FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { useState } from "react"
import { format } from "date-fns"
import type { DashboardFilters } from "../types"
import { mockApps } from "../lib/mock-data"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

interface DashboardHeaderProps {
  filters: DashboardFilters
  onFiltersChange: (updates: Partial<DashboardFilters>) => void
  onExportPDF: () => void
  onExportExcel: () => void
  isExporting?: boolean
}

const dateRangePresets = [
  { value: "7d", label: "Last 7 days" },
  { value: "28d", label: "Last 28 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "180d", label: "Last 180 days" },
  { value: "365d", label: "Last 365 days" },
  { value: "this_month", label: "This month" },
  { value: "prev_month", label: "Previous month" },
  { value: "this_quarter", label: "This quarter" },
  { value: "prev_quarter", label: "Previous quarter" },
  { value: "custom", label: "Custom range" },
]

const granularityOptions = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
]

const countries = [
  { code: "Global", name: "Global" },
  { code: "US", name: "United States" },
  { code: "VN", name: "Vietnam" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "GB", name: "United Kingdom" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
]

export function DashboardHeader({
  filters,
  onFiltersChange,
  onExportPDF,
  onExportExcel,
  isExporting,
}: DashboardHeaderProps) {
  const [dateOpen, setDateOpen] = useState(false)
  const [appOpen, setAppOpen] = useState(false)
  const [from, setFrom] = useState<Date | undefined>(filters.from ? new Date(filters.from) : undefined)
  const [to, setTo] = useState<Date | undefined>(filters.to ? new Date(filters.to) : undefined)

  const selectedApp = mockApps.find((app) => app.id === filters.appId)
  const selectedPlatform = selectedApp?.platform

  const handleDateRangeChange = (value: string) => {
    if (value === "custom") {
      onFiltersChange({ dateRange: "custom" as any })
      setDateOpen(true)
    } else {
      onFiltersChange({ dateRange: value as DashboardFilters["dateRange"] })
    }
  }

  const handleCustomDateApply = () => {
    if (from && to) {
      onFiltersChange({
        dateRange: "custom",
        from: format(from, "yyyy-MM-dd"),
        to: format(to, "yyyy-MM-dd"),
      })
      setDateOpen(false)
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-3 flex-1 flex-wrap">
        {/* App Select */}
        <Popover open={appOpen} onOpenChange={setAppOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className={cn("w-[360px] justify-start text-left font-normal", !filters.appId && "text-muted-foreground")}
            >
              {selectedApp ? (
                <div className="flex items-center gap-2 w-full">
                  <img
                    src={selectedApp.iconUrl || "/placeholder.svg"}
                    alt={selectedApp.name}
                    className="h-5 w-5 rounded"
                  />
                  <span className="flex-1 truncate">{selectedApp.name}</span>
                  <Badge variant={selectedApp.status === "live" ? "default" : "secondary"} className="text-xs">
                    {selectedApp.status === "live" ? "Live" : "Draft"}
                  </Badge>
                </div>
              ) : (
                "Search app or bundle/package id"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[360px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search app..." />
              <CommandList>
                <CommandEmpty>No app found.</CommandEmpty>
                <CommandGroup>
                  {mockApps.map((app) => (
                    <CommandItem
                      key={app.id}
                      value={`${app.name} ${app.bundleOrPackage}`}
                      onSelect={() => {
                        onFiltersChange({ appId: app.id })
                        setAppOpen(false)
                      }}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <img src={app.iconUrl || "/placeholder.svg"} alt={app.name} className="h-6 w-6 rounded" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{app.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{app.bundleOrPackage}</div>
                        </div>
                        <Badge variant={app.status === "live" ? "default" : "secondary"} className="text-xs">
                          {app.status === "live" ? "Live" : "Draft"}
                        </Badge>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* OS Toggles */}
        <div className="flex items-center gap-2 border rounded-md p-1">
          <div className="flex items-center gap-2 px-2">
            <Checkbox
              id="os-android"
              checked={selectedPlatform === "android"}
              disabled={!selectedApp || selectedPlatform === "ios"}
            />
            <Label htmlFor="os-android" className="text-sm cursor-pointer">
              Android
            </Label>
          </div>
          <div className="flex items-center gap-2 px-2">
            <Checkbox
              id="os-ios"
              checked={selectedPlatform === "ios"}
              disabled={!selectedApp || selectedPlatform === "android"}
            />
            <Label htmlFor="os-ios" className="text-sm cursor-pointer">
              iOS
            </Label>
          </div>
        </div>

        {/* Date Range */}
        <Select value={filters.dateRange} onValueChange={handleDateRangeChange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {dateRangePresets.map((preset) => (
              <SelectItem key={preset.value} value={preset.value}>
                {preset.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Custom Date Picker */}
        {filters.dateRange === "custom" && (
          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-60 justify-start text-left bg-transparent">
                <Calendar className="mr-2 h-4 w-4" />
                {from && to ? `${format(from, "MMM d, yyyy")} - ${format(to, "MMM d, yyyy")}` : "Pick date range"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4" align="start">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label>From</Label>
                  <CalendarComponent
                    mode="single"
                    selected={from}
                    onSelect={setFrom}
                    disabled={(date) => date > new Date() || (to ? date > to : false)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>To</Label>
                  <CalendarComponent
                    mode="single"
                    selected={to}
                    onSelect={setTo}
                    disabled={(date) => date > new Date() || (from ? date < from : false)}
                  />
                </div>
                <Button onClick={handleCustomDateApply} className="w-full">
                  Apply
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}

        {/* Granularity */}
        <Select
          value={filters.granularity}
          onValueChange={(value) => onFiltersChange({ granularity: value as DashboardFilters["granularity"] })}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {granularityOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Region */}
        <Select value={filters.region} onValueChange={(value) => onFiltersChange({ region: value })}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onExportPDF} disabled={!filters.appId || isExporting}>
          {isExporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileText className="h-4 w-4 mr-2" />}
          Export PDF
        </Button>
        <Button variant="outline" size="sm" onClick={onExportExcel} disabled={!filters.appId || isExporting}>
          {isExporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
          Export Excel
        </Button>
      </div>
    </div>
  )
}
