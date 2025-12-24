"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Tab } from "../types"

interface DashboardTabsProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

export function DashboardTabs({ activeTab, onTabChange }: DashboardTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as Tab)}>
      <TabsList className="bg-white border border-gray-200">
        <TabsTrigger value="overview" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
          Overview
        </TabsTrigger>
        <TabsTrigger value="markets" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
          Markets
        </TabsTrigger>
        <TabsTrigger value="keywords" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
          Keywords
        </TabsTrigger>
        <TabsTrigger value="ca" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
          Compression Artifacts
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
