"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, FileText, FileSpreadsheet, Loader2 } from "lucide-react"
import type { Brief } from "../types"
import { useExport } from "../hooks/useExport"

interface ExportMenuProps {
  brief?: Brief | null
  briefs?: Brief[]
  onSuccess?: (format: string) => void
  onError?: (error: string) => void
}

export function ExportMenu({ brief, briefs, onSuccess, onError }: ExportMenuProps) {
  const { exportBrief, exportBriefs, exportToCSV, isExporting } = useExport({
    onSuccess: (format) => {
      onSuccess?.(`Đã export thành công (${format.toUpperCase()})`)
    },
    onError: (error) => {
      onError?.(error)
    },
  })

  const handleExport = async (format: "pdf" | "excel" | "csv") => {
    if (brief) {
      await exportBrief(brief, format)
    } else if (briefs && briefs.length > 0) {
      if (format === "csv") {
        exportToCSV(briefs)
      } else {
        await exportBriefs(briefs, format)
      }
    }
  }

  const hasData = brief || (briefs && briefs.length > 0)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={!hasData || isExporting}>
          {isExporting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("pdf")}>
          <FileText className="h-4 w-4 mr-2" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("excel")}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export as Excel
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleExport("csv")}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ExportMenu
