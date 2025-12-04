"use client"

import { useState } from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { CalendarIcon, Check, ChevronsUpDown, FileText, Mail, Download } from "lucide-react"
import { format } from "date-fns"
import type { FilterState } from "../types"
import { mockApps, countries } from "../lib/mock-data"

interface ASOHeaderProps {
  filters: FilterState
  onFiltersChange: (updates: Partial<FilterState>) => void
}

export function ASOHeader({ filters, onFiltersChange }: ASOHeaderProps) {
  const [appOpen, setAppOpen] = useState(false)
  const [dateOpen, setDateOpen] = useState(false)
  const [regionOpen, setRegionOpen] = useState(false)

  const selectedApp = filters.appId ? mockApps.find((app) => app.id === filters.appId) : null

  const handleAppSelect = (appId: string) => {
    const app = mockApps.find((a) => a.id === appId)
    if (app) {
      onFiltersChange({
        appId: app.id,
        store: app.store,
        platform: app.platform,
      })
      setAppOpen(false)
    }
  }

  const handleCountryToggle = (countryCode: string) => {
    const newCountries = filters.countries.includes(countryCode)
      ? filters.countries.filter((c) => c !== countryCode)
      : [...filters.countries, countryCode].slice(0, 25)

    onFiltersChange({ countries: newCountries })
  }

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center gap-3 flex-wrap">
          {/* App Select */}
          <div className="w-[360px]">
            <Popover open={appOpen} onOpenChange={setAppOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="w-full justify-between h-10 font-normal bg-white">
                  {selectedApp ? (
                    <div className="flex items-center gap-2">
                      <img src={selectedApp.iconUrl || "/placeholder.svg"} alt="" className="w-5 h-5 rounded" />
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">{selectedApp.name}</span>
                        <span className="text-xs text-gray-500">{selectedApp.bundleOrPackage}</span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">Search app or bundle/package id</span>
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[360px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search apps..." />
                  <CommandList>
                    <CommandEmpty>No apps found.</CommandEmpty>
                    <CommandGroup>
                      {mockApps.map((app) => (
                        <CommandItem
                          key={app.id}
                          value={app.id}
                          onSelect={() => handleAppSelect(app.id)}
                          className="flex items-center gap-2 py-2"
                        >
                          <img src={app.iconUrl || "/placeholder.svg"} alt="" className="w-6 h-6 rounded" />
                          <div className="flex flex-col flex-1">
                            <span className="text-sm font-medium">{app.name}</span>
                            <span className="text-xs text-gray-500">{app.bundleOrPackage}</span>
                          </div>
                          {selectedApp?.id === app.id && <Check className="h-4 w-4" />}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* OS Toggles */}
          <div className="flex items-center gap-2 h-10 px-3 border border-gray-200 rounded-lg bg-white">
            <Checkbox
              id="android"
              checked={filters.platform === "android"}
              disabled={selectedApp?.platform !== "android"}
              onCheckedChange={(checked) => {
                if (checked && selectedApp?.platform === "android") {
                  onFiltersChange({ platform: "android" })
                }
              }}
            />
            <Label htmlFor="android" className="text-sm font-normal cursor-pointer">
              Android
            </Label>
            <div className="w-px h-4 bg-gray-200 mx-1" />
            <Checkbox
              id="ios"
              checked={filters.platform === "ios"}
              disabled={selectedApp?.platform !== "ios"}
              onCheckedChange={(checked) => {
                if (checked && selectedApp?.platform === "ios") {
                  onFiltersChange({ platform: "ios" })
                }
              }}
            />
            <Label htmlFor="ios" className="text-sm font-normal cursor-pointer">
              iOS
            </Label>
          </div>

          {/* Date Range */}
          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start h-10 font-normal bg-white">
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span className="text-sm">
                  {format(new Date(filters.dateStart), "MMM d")} - {format(new Date(filters.dateEnd), "MMM d, yyyy")}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={{
                  from: new Date(filters.dateStart),
                  to: new Date(filters.dateEnd),
                }}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    onFiltersChange({
                      dateStart: format(range.from, "yyyy-MM-dd"),
                      dateEnd: format(range.to, "yyyy-MM-dd"),
                    })
                  }
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          {/* Granularity */}
          <div className="flex gap-1 h-10">
            {[
              { value: "daily", label: "Daily" },
              { value: "weekly", label: "Weekly" },
              { value: "monthly", label: "Monthly" },
            ].map((option) => (
              <Button
                key={option.value}
                variant={filters.granularity === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => onFiltersChange({ granularity: option.value as any })}
                className="h-10 px-3"
              >
                {option.label}
              </Button>
            ))}
          </div>

          {/* Region */}
          <Popover open={regionOpen} onOpenChange={setRegionOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[200px] justify-start h-10 font-normal bg-white">
                <span className="text-sm">
                  {filters.regionMode === "global"
                    ? "Global"
                    : `${filters.countries.length} ${filters.countries.length === 1 ? "Country" : "Countries"}`}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-4" align="start">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="global-region"
                    checked={filters.regionMode === "global"}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onFiltersChange({ regionMode: "global", countries: [] })
                      }
                    }}
                  />
                  <Label htmlFor="global-region" className="text-sm font-medium cursor-pointer">
                    Global
                  </Label>
                </div>

                <div className="border-t pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium">Countries/Regions</Label>
                    <span className="text-xs text-gray-500">{filters.countries.length}/25</span>
                  </div>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {countries.map((country) => (
                      <div key={country.code} className="flex items-center gap-2">
                        <Checkbox
                          id={`country-${country.code}`}
                          checked={filters.countries.includes(country.code)}
                          disabled={
                            filters.regionMode === "global" ||
                            (!filters.countries.includes(country.code) && filters.countries.length >= 25)
                          }
                          onCheckedChange={(checked) => {
                            if (checked) {
                              onFiltersChange({ regionMode: "countries" })
                            }
                            handleCountryToggle(country.code)
                          }}
                        />
                        <Label
                          htmlFor={`country-${country.code}`}
                          className="text-sm font-normal cursor-pointer flex items-center gap-2"
                        >
                          <span>{country.flag}</span>
                          <span>{country.name}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Actions */}
          <div className="ml-auto flex gap-2 h-10">
            <Button variant="outline" size="sm" disabled={!filters.appId} className="h-10 bg-transparent">
              <Mail className="h-4 w-4 mr-2" />
              Auto Report
            </Button>
            <Button variant="outline" size="sm" disabled={!filters.appId} className="h-10 bg-transparent">
              <FileText className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" size="sm" disabled={!filters.appId} className="h-10 bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
