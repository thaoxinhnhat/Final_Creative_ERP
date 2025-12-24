"use client"

import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle } from "lucide-react"
import { useFilters } from "./hooks/use-filters"
import { ASOHeader } from "./components/aso-header"
import { OverviewTab } from "./components/overview-tab"
import { MarketsTab } from "./components/markets-tab"
import { KeywordsTab } from "./components/keywords-tab"
import { CATab } from "./components/ca-tab"

function ASOContent() {
  const { filters, updateFilters, refetchAll } = useFilters()

  if (!filters.appId) {
    return (
      <>
        <ASOHeader filters={filters} onFiltersChange={updateFilters} />
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4">
          <AlertCircle className="h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Select an app to start</h2>
          <p className="text-gray-500 text-center max-w-md">
            Choose an application from the dropdown to view ASO performance metrics and analytics.
          </p>
        </div>
      </>
    )
  }

  return (
    <>
      <ASOHeader filters={filters} onFiltersChange={updateFilters} />

      <div className="px-6 py-6">
        <Tabs value={filters.tab} onValueChange={(tab) => updateFilters({ tab: tab as any })}>
          <TabsList className="mb-6 bg-transparent border-b border-gray-200 rounded-none w-full justify-start p-0 h-auto">
            <TabsTrigger
              value="overview"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent px-6 py-3 text-gray-600 data-[state=active]:text-gray-900"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="markets"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent px-6 py-3 text-gray-600 data-[state=active]:text-gray-900"
            >
              Markets
            </TabsTrigger>
            <TabsTrigger
              value="keywords"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent px-6 py-3 text-gray-600 data-[state=active]:text-gray-900"
            >
              Keywords
            </TabsTrigger>
            <TabsTrigger
              value="ca"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent px-6 py-3 text-gray-600 data-[state=active]:text-gray-900"
            >
              CA
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="markets" className="mt-0">
            <MarketsTab />
          </TabsContent>

          <TabsContent value="keywords" className="mt-0">
            <KeywordsTab />
          </TabsContent>

          <TabsContent value="ca" className="mt-0">
            <CATab />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

export default function ASOPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ASOContent />
    </Suspense>
  )
}
