"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import type { ReactNode } from "react"

interface KeywordSectionProps {
  title: string
  controls?: ReactNode
  children: ReactNode
}

export function KeywordSection({ title, controls, children }: KeywordSectionProps) {
  return (
    <div className="px-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{title}</CardTitle>
            {controls && <div className="flex items-center gap-2">{controls}</div>}
          </div>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  )
}

export function EmptyKeywordState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
      <p className="text-sm text-muted-foreground max-w-md">
        The selected filters returned no data. Try adjusting your filters or selecting a different date range.
      </p>
    </div>
  )
}
