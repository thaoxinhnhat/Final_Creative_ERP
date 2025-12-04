"use client"

import { useState, useEffect } from "react"
import { Calendar } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"

export type TimeMode = "daily" | "weekly" | "monthly" | "custom"

export type Granularity = "day" | "week" | "month" | "auto"

export interface TimeFilterState {
  mode: TimeMode
  from: Date
  to: Date
  granularity: Granularity
}

interface SharedTimeFilterProps {
  value: TimeFilterState
  onChange: (state: TimeFilterState) => void
  className?: string
}

// Helper to calculate automatic granularity based on date range
function calculateAutoGranularity(from: Date, to: Date): Granularity {
  const daysDiff = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24))

  if (daysDiff < 45) return "day"
  if (daysDiff <= 180) return "week"
  return "month"
}

// Helper to get default date range based on mode
function getDefaultDateRange(mode: TimeMode): { from: Date; to: Date } {
  const to = new Date()
  const from = new Date()

  switch (mode) {
    case "daily":
      from.setDate(to.getDate() - 28)
      break
    case "weekly":
      from.setDate(to.getDate() - 84) // 12 weeks
      break
    case "monthly":
      from.setMonth(to.getMonth() - 6)
      break
    case "custom":
      from.setDate(to.getDate() - 28)
      break
  }

  return { from, to }
}

export function SharedTimeFilter({ value, onChange, className }: SharedTimeFilterProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: value.from,
    to: value.to,
  })

  useEffect(() => {
    setDateRange({ from: value.from, to: value.to })
  }, [value.from, value.to])

  const handleModeChange = (newMode: TimeMode) => {
    const { from, to } = getDefaultDateRange(newMode)
    const granularity =
      newMode === "custom" ? "auto" : newMode === "daily" ? "day" : newMode === "weekly" ? "week" : "month"

    onChange({
      mode: newMode,
      from,
      to,
      granularity,
    })
  }

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (!range) return

    setDateRange(range)

    // Only update parent when both dates are selected
    if (range.from && range.to) {
      const granularity = calculateAutoGranularity(range.from, range.to)
      onChange({
        mode: "custom",
        from: range.from,
        to: range.to,
        granularity,
      })
      setIsCalendarOpen(false)
    }
  }

  const formatDateRange = () => {
    if (!dateRange?.from) return "Select date range"
    if (!dateRange.to) return format(dateRange.from, "MMM dd, yyyy")
    return `${format(dateRange.from, "MMM dd")} - ${format(dateRange.to, "MMM dd, yyyy")}`
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Label className="text-xs font-medium text-gray-500 dark:text-gray-400">Period:</Label>

      {/* Mode Selector */}
      <Select value={value.mode} onValueChange={(v) => handleModeChange(v as TimeMode)}>
        <SelectTrigger className="w-32 h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="daily">Daily</SelectItem>
          <SelectItem value="weekly">Weekly</SelectItem>
          <SelectItem value="monthly">Monthly</SelectItem>
          <SelectItem value="custom">Custom</SelectItem>
        </SelectContent>
      </Select>

      {/* Date Range Picker (visible only in custom mode) */}
      {value.mode === "custom" && (
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button type="button" variant="outline" size="sm" className="h-8 text-xs bg-transparent">
              <Calendar className="h-3 w-3 mr-2" />
              {formatDateRange()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <CalendarComponent
              mode="range"
              selected={dateRange}
              onSelect={handleDateRangeChange}
              numberOfMonths={2}
              disabled={{ after: new Date() }}
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}
