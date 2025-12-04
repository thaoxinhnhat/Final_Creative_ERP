"use client"

import { Search, TrendingUp, BarChart3, Target } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  onBrowseRecent?: () => void
}

export function EmptyState({ onBrowseRecent }: EmptyStateProps) {
  return (
    <div className="p-6 flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-12 text-center">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Search className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <TrendingUp className="h-3 w-3 text-white" />
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-3">Select an app to view Overview</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Search for any app using the search bar above to view comprehensive ASO analytics, keyword rankings, and
            performance metrics.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-muted/50 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-sm mb-1">Keyword Rankings</h3>
              <p className="text-xs text-muted-foreground">Track keyword positions over time</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <Target className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-sm mb-1">Market Analysis</h3>
              <p className="text-xs text-muted-foreground">Compare across regions and platforms</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-sm mb-1">Performance Metrics</h3>
              <p className="text-xs text-muted-foreground">Downloads, revenue, and engagement</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Button onClick={onBrowseRecent} variant="outline">
              Browse Recent Apps
            </Button>
            <Button onClick={onBrowseRecent}>
              <Search className="h-4 w-4 mr-2" />
              Search Apps
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
