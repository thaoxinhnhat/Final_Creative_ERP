"use client"

import { useState, useCallback } from "react"
import type { Brief } from "../types"

type ExportFormat = "pdf" | "excel" | "csv"

interface UseExportOptions {
  onSuccess?: (format: ExportFormat) => void
  onError?: (error: string) => void
}

export function useExport(options: UseExportOptions = {}) {
  const { onSuccess, onError } = options
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)

  const exportBrief = useCallback(
    async (brief: Brief, format: ExportFormat) => {
      setIsExporting(true)
      setExportProgress(10)

      try {
        const response = await fetch("/api/briefs/export", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ briefId: brief.id, format }),
        })

        setExportProgress(50)

        if (!response.ok) {
          throw new Error("Export failed")
        }

        const blob = await response.blob()
        setExportProgress(80)

        // Download file
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `brief-${brief.id}-${new Date().toISOString().split("T")[0]}.${format === "excel" ? "xlsx" : format}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)

        setExportProgress(100)
        onSuccess?.(format)
      } catch (error) {
        onError?.((error as Error).message)
      } finally {
        setIsExporting(false)
        setExportProgress(0)
      }
    },
    [onSuccess, onError]
  )

  const exportBriefs = useCallback(
    async (briefs: Brief[], format: ExportFormat) => {
      setIsExporting(true)
      setExportProgress(10)

      try {
        const response = await fetch("/api/briefs/export-bulk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ briefIds: briefs.map((b) => b.id), format }),
        })

        setExportProgress(50)

        if (!response.ok) {
          throw new Error("Export failed")
        }

        const blob = await response.blob()
        setExportProgress(80)

        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `briefs-export-${new Date().toISOString().split("T")[0]}.${format === "excel" ? "xlsx" : format}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)

        setExportProgress(100)
        onSuccess?.(format)
      } catch (error) {
        onError?.((error as Error).message)
      } finally {
        setIsExporting(false)
        setExportProgress(0)
      }
    },
    [onSuccess, onError]
  )

  // Client-side CSV export (fallback)
  const exportToCSV = useCallback((briefs: Brief[]) => {
    const headers = [
      "ID",
      "Title",
      "App/Campaign",
      "Status",
      "Priority",
      "Deadline",
      "Region",
      "Platform",
      "Created By",
      "Created At",
      "Requirements",
    ]

    const rows = briefs.map((b) => [
      b.id,
      b.title,
      b.appCampaign,
      b.status,
      b.priority,
      b.deadline,
      b.region,
      b.platform,
      b.createdBy,
      b.createdAt,
      b.requirements.replace(/\n/g, " "),
    ])

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `briefs-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    onSuccess?.("csv")
  }, [onSuccess])

  return {
    exportBrief,
    exportBriefs,
    exportToCSV,
    isExporting,
    exportProgress,
  }
}

export default useExport
