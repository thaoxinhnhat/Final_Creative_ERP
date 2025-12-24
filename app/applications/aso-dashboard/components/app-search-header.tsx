"use client"

import { useState, useEffect } from "react"
import { Search, X, Download, FileText, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { ChartFilters, AppInfo } from "../types"
import { mockApps, countries } from "../data/mock-data"
import { cn } from "@/lib/utils"
import { format, parse, subDays } from "date-fns"

interface AppSearchHeaderProps {
  filters: ChartFilters | null
  onFiltersChange: (updates: Partial<ChartFilters>) => void
}

export function AppSearchHeader({ filters, onFiltersChange }: AppSearchHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [dateOpen, setDateOpen] = useState(false)
  const [countryOpen, setCountryOpen] = useState(false)
  const [filteredApps, setFilteredApps] = useState<AppInfo[]>(mockApps)

  const selectedApp = filters?.appId ? mockApps.find((app) => app.id === filters.appId) : null

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim() === "") {
        setFilteredApps(mockApps)
      } else {
        const query = searchQuery.toLowerCase()
        const filtered = mockApps.filter(
          (app) =>
            app.name.toLowerCase().includes(query) ||
            app.package.toLowerCase().includes(query) ||
            app.id.toLowerCase().includes(query),
        )
        setFilteredApps(filtered)
      }
    }, 250)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleAppSelect = (app: AppInfo) => {
    onFiltersChange({
      appId: app.id,
      store: app.store,
      platform: app.platform,
    })
    setSearchOpen(false)
    setSearchQuery("")

    // Save to localStorage
    localStorage.setItem("aso:lastApp", app.id)
  }

  const handleDatePreset = (days: number) => {
    const end = new Date()
    const start = subDays(end, days - 1)

    onFiltersChange({
      dateStart: format(start, "yyyy-MM-dd"),
      dateEnd: format(end, "yyyy-MM-dd"),
    })
  }

  const handleDateRange = (range: { from: Date | undefined; to: Date | undefined }) => {
    if (range.from && range.to) {
      onFiltersChange({
        dateStart: format(range.from, "yyyy-MM-dd"),
        dateEnd: format(range.to, "yyyy-MM-dd"),
      })
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
          from: parse(filters.dateStart, "yyyy-MM-dd", new Date()),
          to: parse(filters.dateEnd, "yyyy-MM-dd", new Date()),
        }
      : undefined

  const selectedCountries = filters?.countries || []

  // Group apps by store
  const groupedApps = filteredApps.reduce(
    (acc, app) => {
      const key = app.store === "googleplay" ? "Google Play" : "App Store"
      if (!acc[key]) acc[key] = []
      acc[key].push(app)
      return acc
    },
    {} as Record<string, AppInfo[]>,
  )

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-6 py-4">
        {/* Title and Actions */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">ASO Performance Dashboard</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={!filters?.appId}>
              <Download className="h-4 w-4 mr-2" />
              Auto Report
            </Button>
            <Button variant="outline" size="sm" disabled={!filters?.appId}>
              <FileText className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" size="sm" disabled={!filters?.appId}>
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            {/* App Search */}
            <Popover open={searchOpen} onOpenChange={setSearchOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={searchOpen}
                  className="w-[360px] justify-between h-10 bg-white hover:bg-gray-50"
                >
                  {selectedApp ? (
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-xl flex-shrink-0">{selectedApp.icon}</span>
                      <div className="flex flex-col items-start flex-1 min-w-0">
                        <span className="font-medium text-sm truncate w-full">{selectedApp.name}</span>
                        <span className="text-xs text-gray-500 truncate w-full">{selectedApp.package}</span>
                      </div>
                      <Badge variant="secondary" className="ml-auto flex-shrink-0 text-xs">
                        {selectedApp.store === "googleplay" ? "GP" : "AS"}
                      </Badge>
                    </div>
                  ) : (
                    <span className="text-gray-500 text-sm">Search app or package/bundle id</span>
                  )}
                  <Search className="ml-2 h-4 w-4 flex-shrink-0 text-gray-400" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[360px] p-0" align="start">
                <Command shouldFilter={false}>
                  <div className="flex items-center border-b px-3">
                    <Search className="mr-2 h-4 w-4 shrink-0 text-gray-400" />
                    <Input
                      placeholder="Search by name or package..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="border-0 focus-visible:ring-0 h-10"
                    />
                  </div>
                  <CommandList>
                    <CommandEmpty>No apps found</CommandEmpty>
                    <ScrollArea className="h-[420px]">
                      {Object.entries(groupedApps).map(([store, apps]) => (
                        <CommandGroup key={store} heading={store}>
                          {apps.map((app) => (
                            <CommandItem
                              key={app.id}
                              value={app.id}
                              onSelect={() => handleAppSelect(app)}
                              className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                            >
                              <span className="text-xl">{app.icon}</span>
                              <div className="flex flex-col flex-1 min-w-0">
                                <span className="font-medium text-sm">{app.name}</span>
                                <span className="text-xs text-gray-500 truncate">{app.package}</span>
                              </div>
                              <Badge variant="secondary" className="ml-auto text-xs">
                                {app.store === "googleplay" ? "GP" : "AS"}
                              </Badge>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      ))}
                    </ScrollArea>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* OS Toggles */}
            <div className="flex items-center gap-4 px-3 py-2 border border-gray-200 rounded-md bg-white">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="os-android"
                  checked={filters?.platform === "android"}
                  disabled={!selectedApp || selectedApp.platform !== "android"}
                  className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                />
                <Label
                  htmlFor="os-android"
                  className={cn(
                    "text-sm font-medium cursor-pointer",
                    (!selectedApp || selectedApp.platform !== "android") && "text-gray-400",
                  )}
                >
                  Android
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="os-ios"
                  checked={filters?.platform === "ios"}
                  disabled={!selectedApp || selectedApp.platform !== "ios"}
                  className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <Label
                  htmlFor="os-ios"
                  className={cn(
                    "text-sm font-medium cursor-pointer",
                    (!selectedApp || selectedApp.platform !== "ios") && "text-gray-400",
                  )}
                >
                  iOS
                </Label>
              </div>
            </div>

            {/* Date Range */}
            <Popover open={dateOpen} onOpenChange={setDateOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[280px] justify-start text-left font-normal h-10 bg-white">
                  <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                  {dateRange ? (
                    <span className="text-sm">
                      {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd, yyyy")}
                    </span>
                  ) : (
                    <span className="text-gray-500 text-sm">Select date range</span>
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

            {/* Country/Region */}
            <Popover open={countryOpen} onOpenChange={setCountryOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="min-w-[200px] justify-between h-10 bg-white">
                  <span className="text-sm">
                    {filters?.regionMode === "global"
                      ? "Global"
                      : selectedCountries.length === 0
                        ? "Select countries"
                        : `${selectedCountries.length} ${selectedCountries.length === 1 ? "country" : "countries"}`}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[320px] p-0" align="start">
                <div className="p-3 space-y-3">
                  {/* Region Mode Toggle */}
                  <div className="flex gap-2">
                    <Button
                      variant={filters?.regionMode === "global" ? "default" : "outline"}
                      size="sm"
                      onClick={() => onFiltersChange({ regionMode: "global", countries: [] })}
                      className="flex-1"
                    >
                      Global
                    </Button>
                    <Button
                      variant={filters?.regionMode === "countries" ? "default" : "outline"}
                      size="sm"
                      onClick={() => onFiltersChange({ regionMode: "countries" })}
                      className="flex-1"
                    >
                      Countries/Regions
                    </Button>
                  </div>

                  {/* Selected Countries */}
                  {filters?.regionMode === "countries" && selectedCountries.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-gray-500">Selected ({selectedCountries.length}/25)</div>
                      <div className="flex flex-wrap gap-1">
                        {selectedCountries.map((code) => {
                          const country = countries.find((c) => c.code === code)
                          return country ? (
                            <Badge key={code} variant="secondary" className="gap-1">
                              {country.flag} {country.code}
                              <X className="h-3 w-3 cursor-pointer" onClick={() => removeCountry(code)} />
                            </Badge>
                          ) : null
                        })}
                      </div>
                    </div>
                  )}

                  {/* Country List */}
                  {filters?.regionMode === "countries" && (
                    <ScrollArea className="h-[300px] border-t pt-3">
                      <div className="space-y-2 pr-3">
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
                              <span className="text-gray-400">({country.code})</span>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Selection Summary */}
          {filters && selectedApp && (
            <div className="flex items-center gap-2 text-xs text-gray-600 flex-wrap pt-2 border-t">
              <span className="font-medium">App:</span>
              <Badge variant="secondary" className="font-normal">
                {selectedApp.icon} {selectedApp.name}
              </Badge>
              <span className="text-gray-300">•</span>
              <span className="font-medium">Store:</span>
              <Badge variant="secondary" className="font-normal">
                {filters.store === "googleplay" ? "Google Play" : "App Store"}
              </Badge>
              <span className="text-gray-300">•</span>
              <span className="font-medium">OS:</span>
              <Badge variant="secondary" className="font-normal">
                {filters.platform === "android" ? "Android" : "iOS"}
              </Badge>
              <span className="text-gray-300">•</span>
              <span className="font-medium">Region:</span>
              <Badge variant="secondary" className="font-normal">
                {filters.regionMode === "global"
                  ? "Global"
                  : `${selectedCountries.length} ${selectedCountries.length === 1 ? "country" : "countries"}`}
              </Badge>
              {dateRange && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="font-medium">Time:</span>
                  <Badge variant="secondary" className="font-normal">
                    {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd, yyyy")}
                  </Badge>
                </>
              )}
              <span className="text-gray-300">•</span>
              <span className="font-medium">Granularity:</span>
              <Badge variant="secondary" className="font-normal">
                {filters.granularity}
              </Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
