import { format, subDays, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, differenceInDays } from "date-fns"

export interface DateRange {
  from: string
  to: string
}

export function getDateRangeFromPreset(preset: string): DateRange {
  const now = new Date()

  switch (preset) {
    case "7d":
      return {
        from: format(subDays(now, 7), "yyyy-MM-dd"),
        to: format(now, "yyyy-MM-dd"),
      }
    case "28d":
      return {
        from: format(subDays(now, 28), "yyyy-MM-dd"),
        to: format(now, "yyyy-MM-dd"),
      }
    case "90d":
      return {
        from: format(subDays(now, 90), "yyyy-MM-dd"),
        to: format(now, "yyyy-MM-dd"),
      }
    case "180d":
      return {
        from: format(subDays(now, 180), "yyyy-MM-dd"),
        to: format(now, "yyyy-MM-dd"),
      }
    case "365d":
      return {
        from: format(subDays(now, 365), "yyyy-MM-dd"),
        to: format(now, "yyyy-MM-dd"),
      }
    case "this_month":
      return {
        from: format(startOfMonth(now), "yyyy-MM-dd"),
        to: format(now, "yyyy-MM-dd"),
      }
    case "prev_month":
      const prevMonth = subDays(startOfMonth(now), 1)
      return {
        from: format(startOfMonth(prevMonth), "yyyy-MM-dd"),
        to: format(endOfMonth(prevMonth), "yyyy-MM-dd"),
      }
    case "this_quarter":
      return {
        from: format(startOfQuarter(now), "yyyy-MM-dd"),
        to: format(now, "yyyy-MM-dd"),
      }
    case "prev_quarter":
      const prevQuarter = subDays(startOfQuarter(now), 1)
      return {
        from: format(startOfQuarter(prevQuarter), "yyyy-MM-dd"),
        to: format(endOfQuarter(prevQuarter), "yyyy-MM-dd"),
      }
    default:
      return {
        from: format(subDays(now, 28), "yyyy-MM-dd"),
        to: format(now, "yyyy-MM-dd"),
      }
  }
}

export function getPreviousDateRange(from: string, to: string): DateRange {
  const start = new Date(from)
  const end = new Date(to)
  const duration = differenceInDays(end, start)

  return {
    from: format(subDays(start, duration + 1), "yyyy-MM-dd"),
    to: format(subDays(start, 1), "yyyy-MM-dd"),
  }
}

export function formatDateByGranularity(date: string, granularity: "daily" | "weekly" | "monthly"): string {
  const d = new Date(date)

  switch (granularity) {
    case "daily":
      return format(d, "dd/MM")
    case "weekly":
      const weekNum = Math.ceil(differenceInDays(d, startOfMonth(d)) / 7) + 1
      return `W${weekNum} ${format(d, "yyyy")}`
    case "monthly":
      return format(d, "MMM yyyy")
    default:
      return format(d, "yyyy-MM-dd")
  }
}

export function getRecommendedGranularity(from: string, to: string): "daily" | "weekly" | "monthly" {
  const duration = differenceInDays(new Date(to), new Date(from))

  if (duration <= 30) return "daily"
  if (duration <= 180) return "weekly"
  return "monthly"
}
