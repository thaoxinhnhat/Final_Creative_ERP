"use client"

import { Suspense, useEffect, useState } from "react"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "./components/dashboard-header"
import { KPICards } from "./components/kpi-cards"
import { OverviewTab } from "./components/overview-tab"
import { MarketsTab } from "./components/markets-tab"
import { KeywordsTab } from "./components/keywords-tab"
import { CATab } from "./components/ca-tab"
import { useDashboardFilters } from "./hooks/use-dashboard-filters"
import { generateMockData, mockApps } from "./lib/mock-data"
import type { DashboardData } from "./types"

function DashboardContent() {
  const router = useRouter()
  const { filters, updateFilters } = useDashboardFilters()
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    if (filters.appId && filters.from && filters.to) {
      setIsLoading(true)
      const timeoutId = setTimeout(() => {
        const mockData = generateMockData(
          filters.granularity,
          filters.from!,
          filters.to!,
          filters.compare,
          filters.selectedMarkets,
        )
        setData(mockData)
        setIsLoading(false)
      }, 300)

      return () => clearTimeout(timeoutId)
    } else {
      setData(null)
      setIsLoading(false)
    }
  }, [
    filters.appId,
    filters.granularity,
    filters.from,
    filters.to,
    filters.region,
    filters.compare,
    filters.selectedMarkets,
  ])

  const handleExportPDF = async () => {
    setIsExporting(true)
    const app = mockApps.find((a) => a.id === filters.appId)
    const filename = `ASO_${app?.name}_${filters.region}_${filters.granularity}_${filters.from}_${filters.to}.pdf`

    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log("Exporting PDF:", filename)
    alert(`PDF export ready: ${filename}\n(This is a stub implementation)`)
    setIsExporting(false)
  }

  const handleExportExcel = async () => {
    setIsExporting(true)
    const app = mockApps.find((a) => a.id === filters.appId)
    const filename = `ASO_${app?.name}_${filters.region}_${filters.granularity}_${filters.from}_${filters.to}.xlsx`

    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log("Exporting Excel:", filename)
    alert(`Excel export ready: ${filename}\n(This is a stub implementation)`)
    setIsExporting(false)
  }

  if (!filters.appId) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.push("/applications")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ASO Performance Dashboard</h1>
            <p className="text-sm text-gray-500">Tổng quan KPI chính của ASO</p>
          </div>
        </div>

        <DashboardHeader
          filters={filters}
          onFiltersChange={updateFilters}
          onExportPDF={handleExportPDF}
          onExportExcel={handleExportExcel}
          isExporting={isExporting}
        />

        <div className="flex items-center justify-center h-[400px] bg-white rounded-lg border">
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900">Chọn Ứng dụng để xem ASO Dashboard</p>
            <p className="text-sm text-gray-500 mt-2">
              Select an app from the dropdown above to view performance metrics
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading || !data) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.push("/applications")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ASO Performance Dashboard</h1>
            <p className="text-sm text-gray-500">Tổng quan KPI chính của ASO</p>
          </div>
        </div>

        <DashboardHeader
          filters={filters}
          onFiltersChange={updateFilters}
          onExportPDF={handleExportPDF}
          onExportExcel={handleExportExcel}
          isExporting={isExporting}
        />

        <div className="flex items-center justify-center h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.push("/applications")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ASO Performance Dashboard</h1>
          <p className="text-sm text-gray-500">Tổng quan KPI chính của ASO</p>
        </div>
      </div>

      <DashboardHeader
        filters={filters}
        onFiltersChange={updateFilters}
        onExportPDF={handleExportPDF}
        onExportExcel={handleExportExcel}
        isExporting={isExporting}
      />

      <KPICards data={data.kpis} />

      <Tabs value={filters.tab} onValueChange={(value) => updateFilters({ tab: value as any })}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="markets">Markets</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="ca">CA</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab data={data} filters={filters} onCompareChange={(compare) => updateFilters({ compare })} />
        </TabsContent>

        <TabsContent value="markets">
          <MarketsTab
            data={data}
            filters={filters}
            onMarketsChange={(markets) => updateFilters({ selectedMarkets: markets })}
          />
        </TabsContent>

        <TabsContent value="keywords">
          <KeywordsTab data={data} />
        </TabsContent>

        <TabsContent value="ca">
          <CATab data={data} filters={filters} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function PerformanceDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  )
}
