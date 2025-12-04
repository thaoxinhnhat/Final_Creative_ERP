"use client"

import { useState, useMemo } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CalendarIcon, X, Download, FileText, Check, ChevronsUpDown } from "lucide-react"
import { format, subDays } from "date-fns"
import { cn } from "@/lib/utils"
import type { ChartFilters } from "../types"
import { mockApps, countries } from "../data/mock-data"

interface FilterBarProps {
  filters: ChartFilters | null
  onFiltersChange: (updates: Partial<ChartFilters>) => void
}

export function FilterBar({ filters, onFiltersChange }: FilterBarProps) {
  const [appOpen, setAppOpen] = useState(false)
  const [dateOpen, setDateOpen] = useState(false)
  const [countryOpen, setCountryOpen] = useState(false)
  const [appSearch, setAppSearch] = useState("")

  const selectedApp = filters?.appId ? mockApps.find((app) => app.id === filters.appId) : null

  const filteredApps = useMemo(() => {
    if (!appSearch) return mockApps
    const search = appSearch.toLowerCase()
    return mockApps.filter(
      (app) => app.name.toLowerCase().includes(search) || app.package.toLowerCase().includes(search),
    )
  }, [appSearch])

  const handleAppSelect = (appId: string) => {
    const app = mockApps.find((a) => a.id === appId)
    if (app) {
      onFiltersChange({
        appId: app.id,
        store: app.store,
        platform: app.platform,
      })
      localStorage.setItem("aso:lastApp", app.id)
      setAppOpen(false)
      setAppSearch("")
    }
  }

  const handleDatePreset = (days: number) => {
    const end = new Date()
    const start = subDays(end, days - 1)
    onFiltersChange({
      dateStart: format(start, "yyyy-MM-dd"),
      dateEnd: format(end, "yyyy-MM-dd"),
    })
    setDateOpen(false)
  }

  const handleDateRange = (range: { from: Date | undefined; to: Date | undefined }) => {
    if (range.from && range.to) {
      onFiltersChange({
        dateStart: format(range.from, "yyyy-MM-dd"),
        dateEnd: format(range.to, "yyyy-MM-dd"),
      })
    }
  }

  const handleOSToggle = (os: "android" | "ios", checked: boolean) => {
    if (checked) {
      onFiltersChange({ platform: os })
    }
  }

  const toggleCountry = (countryCode: string) => {
    const current = filters?.countries || []
    const updated = current.includes(countryCode)
      ? current.filter((c) => c !== countryCode)
      : current.length < 25
        ? [...current, countryCode]
        : current

    onFiltersChange({ countries: updated })
  }

  const removeCountry = (countryCode: string) => {
    const updated = (filters?.countries || []).filter((c) => c !== countryCode)
    onFiltersChange({ countries: updated })
  }

  const dateRange =
    filters?.dateStart && filters?.dateEnd
      ? {
          from: new Date(filters.dateStart),
          to: new Date(filters.dateEnd),
        }
      : undefined

  const selectedCountries = filters?.countries || []
  const canApply = filters?.regionMode === "global" || selectedCountries.length > 0

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Comprehensive Analysis and Management</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={!filters?.appId}>
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" size="sm" disabled={!filters?.appId}>
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-[300px_auto] gap-6">
          {/* Left Column - App & OS */}
          <div className="space-y-4">
            {/* App Select */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                App <span className="text-red-500">*</span>
              </Label>
              <Popover open={appOpen} onOpenChange={setAppOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={appOpen}
                    className="w-full justify-between font-normal bg-transparent"
                  >
                    {selectedApp ? (
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{selectedApp.icon}</span>
                        <div className="flex flex-col items-start">
                          <span className="text-sm font-medium">{selectedApp.name}</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Select an app...</span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search apps..." value={appSearch} onValueChange={setAppSearch} />
                    <CommandList>
                      <CommandEmpty>No apps found.</CommandEmpty>
                      <CommandGroup>
                        {filteredApps.map((app) => (
                          <CommandItem
                            key={app.id}
                            value={app.id}
                            onSelect={handleAppSelect}
                            className="flex items-center justify-between py-3"
                          >
                            <div className="flex items-center gap-2 flex-1">
                              <span className="text-xl">{app.icon}</span>
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">{app.name}</span>
                                <span className="text-xs text-gray-500">{app.package}</span>
                              </div>
                            </div>
                            <Badge variant={app.status === "live" ? "default" : "secondary"} className="ml-2">
                              {app.status === "live" ? "Live" : "Draft"}
                            </Badge>
                            {selectedApp?.id === app.id && <Check className="ml-2 h-4 w-4" />}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* OS Checkboxes */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">OS</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="os-android"
                    checked={filters?.platform === "android"}
                    onCheckedChange={(checked) => handleOSToggle("android", checked as boolean)}
                    disabled={!selectedApp || selectedApp.platform !== "android"}
                  />
                  <Label
                    htmlFor="os-android"
                    className="text-sm font-normal cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
                  >
                    Android
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="os-ios"
                    checked={filters?.platform === "ios"}
                    onCheckedChange={(checked) => handleOSToggle("ios", checked as boolean)}
                    disabled={!selectedApp || selectedApp.platform !== "ios"}
                  />
                  <Label
                    htmlFor="os-ios"
                    className="text-sm font-normal cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
                  >
                    iOS
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Other Filters */}
          <div className="grid grid-cols-3 gap-4">
            {/* Date Range */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Date Range <span className="text-red-500">*</span>
              </Label>
              <Popover open={dateOpen} onOpenChange={setDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !dateRange && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange ? (
                      <span className="text-sm">
                        {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd, yyyy")}
                      </span>
                    ) : (
                      <span className="text-sm">Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="p-3 border-b space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleDatePreset(7)}>
                        Last 7 days
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDatePreset(28)}>
                        Last 28 days
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDatePreset(90)}>
                        Last 90 days
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDatePreset(180)}>
                        Last 180 days
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDatePreset(365)}>
                        Last 365 days
                      </Button>
                    </div>
                  </div>
                  <Calendar
                    initialFocus
                    mode="range"
                    selected={dateRange}
                    onSelect={(range) => handleDateRange({ from: range?.from, to: range?.to })}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Granularity */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Granularity</Label>
              <div className="flex gap-2">
                {[
                  { value: "day", label: "Daily" },
                  { value: "week", label: "Weekly" },
                  { value: "month", label: "Monthly" },
                ].map((option) => (
                  <Button
                    key={option.value}
                    variant={filters?.granularity === option.value ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                    onClick={() => onFiltersChange({ granularity: option.value as any })}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Region Mode */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Region</Label>
              <div className="flex gap-2">
                <Button
                  variant={filters?.regionMode === "global" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() =>
                    onFiltersChange({
                      regionMode: "global",
                      countries: [],
                    })
                  }
                >
                  Global
                </Button>
                <Button
                  variant={filters?.regionMode === "countries" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => onFiltersChange({ regionMode: "countries" })}
                >
                  Countries
                </Button>
              </div>
            </div>

            {/* Country Multi-Select */}
            {filters?.regionMode === "countries" && (
              <div className="col-span-3">
                <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Countries <span className="text-red-500">*</span>
                </Label>
                <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between bg-transparent h-auto min-h-[40px] py-2"
                    >
                      <div className="flex flex-wrap gap-1">
                        {selectedCountries.length === 0 ? (
                          <span className="text-muted-foreground text-sm">Select countries (max 25)</span>
                        ) : (
                          selectedCountries.map((code) => {
                            const country = countries.find((c) => c.code === code)
                            return country ? (
                              <Badge key={code} variant="secondary" className="gap-1">
                                {country.flag} {country.code}
                                <X
                                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    removeCountry(code)
                                  }}
                                />
                              </Badge>
                            ) : null
                          })
                        )}
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0" align="start">
                    <div className="p-3 border-b">
                      <div className="text-sm font-medium text-gray-700">
                        Select Countries ({selectedCountries.length}/25)
                      </div>
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
                              <span>{country.flag}</span>
                              <span>{country.name}</span>
                              <span className="text-gray-500">({country.code})</span>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
        </div>

        {/* Selection Summary */}
        {filters && selectedApp && canApply && (
          <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600 flex items-center gap-2 flex-wrap">
            <span className="font-medium">App:</span>
            <Badge variant="secondary">
              {selectedApp.icon} {selectedApp.name}
            </Badge>
            <span className="text-gray-300">•</span>
            <span className="font-medium">Store:</span>
            <Badge variant="secondary">{filters.store === "googleplay" ? "Google Play" : "App Store"}</Badge>
            <span className="text-gray-300">•</span>
            <span className="font-medium">OS:</span>
            <Badge variant="secondary">{filters.platform === "android" ? "Android" : "iOS"}</Badge>
            <span className="text-gray-300">•</span>
            <span className="font-medium">Region:</span>
            <Badge variant="secondary">
              {filters.regionMode === "global"
                ? "Global"
                : `${selectedCountries.length} ${selectedCountries.length === 1 ? "country" : "countries"}`}
            </Badge>
            {dateRange && (
              <>
                <span className="text-gray-300">•</span>
                <span className="font-medium">Time:</span>
                <Badge variant="secondary">
                  {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd, yyyy")}
                </Badge>
              </>
            )}
            <span className="text-gray-300">•</span>
            <span className="font-medium">Granularity:</span>
            <Badge variant="secondary">
              {filters.granularity === "day" ? "Daily" : filters.granularity === "week" ? "Weekly" : "Monthly"}
            </Badge>
          </div>
        )}

        {/* Warning when countries not selected */}
        {filters?.regionMode === "countries" && selectedCountries.length === 0 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
            ⚠️ Please select at least 1 country to view data
          </div>
        )}
      </div>
    </div>
  )
}
