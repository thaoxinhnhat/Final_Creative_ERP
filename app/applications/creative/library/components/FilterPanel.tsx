"use client"

import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, X } from "lucide-react"
import type { AssetFilters, AssetType, AssetCategory } from "../types"
import { TYPE_CONFIG, CATEGORY_CONFIG } from "../types"
import { assetStats, uniqueCampaigns } from "../mockData"

interface FilterPanelProps {
  filters: AssetFilters
  onUpdateFilters: (updates: Partial<AssetFilters>) => void
  onResetFilters: () => void
  onToggleType: (type: AssetType) => void
  onToggleCategory: (category: AssetCategory) => void
  activeFilterCount: number
}

export function FilterPanel({
  filters,
  onUpdateFilters,
  onResetFilters,
  onToggleType,
  onToggleCategory,
  activeFilterCount,
}: FilterPanelProps) {
  return (
    <div className="w-[280px] border-r bg-white dark:bg-gray-900 flex-shrink-0 overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Search */}
        <div>
          <Label className="text-sm font-semibold mb-2 block">Tìm kiếm</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tên file, tags..."
              className="pl-9"
              value={filters.search}
              onChange={(e) => onUpdateFilters({ search: e.target.value })}
            />
          </div>
        </div>

        {/* Asset Type */}
        <div>
          <Label className="text-sm font-semibold mb-3 block">Loại file</Label>
          <div className="space-y-2">
            {(Object.keys(TYPE_CONFIG) as AssetType[]).map((type) => (
              <div key={type} className="flex items-center">
                <Checkbox
                  id={`type-${type}`}
                  checked={filters.types.includes(type)}
                  onCheckedChange={() => onToggleType(type)}
                />
                <Label htmlFor={`type-${type}`} className="ml-2 text-sm cursor-pointer flex-1">
                  {TYPE_CONFIG[type].icon} {TYPE_CONFIG[type].label}
                  <span className="text-muted-foreground ml-1">({assetStats.byType[type]})</span>
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Category */}
        <div>
          <Label className="text-sm font-semibold mb-3 block">Danh mục</Label>
          <div className="space-y-2">
            {(Object.keys(CATEGORY_CONFIG) as AssetCategory[]).map((cat) => (
              <div key={cat} className="flex items-center">
                <Checkbox
                  id={`cat-${cat}`}
                  checked={filters.categories.includes(cat)}
                  onCheckedChange={() => onToggleCategory(cat)}
                />
                <Label htmlFor={`cat-${cat}`} className="ml-2 text-sm cursor-pointer flex-1">
                  {CATEGORY_CONFIG[cat].icon} {CATEGORY_CONFIG[cat].label}
                  <span className="text-muted-foreground ml-1">({assetStats.byCategory[cat]})</span>
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Campaign */}
        <div>
          <Label className="text-sm font-semibold mb-3 block">Campaign</Label>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {uniqueCampaigns.map((campaign) => (
              <div key={campaign} className="flex items-center">
                <Checkbox
                  id={`campaign-${campaign}`}
                  checked={filters.campaigns.includes(campaign)}
                  onCheckedChange={() => {
                    const newCampaigns = filters.campaigns.includes(campaign)
                      ? filters.campaigns.filter(c => c !== campaign)
                      : [...filters.campaigns, campaign]
                    onUpdateFilters({ campaigns: newCampaigns })
                  }}
                />
                <Label htmlFor={`campaign-${campaign}`} className="ml-2 text-sm cursor-pointer truncate">
                  {campaign}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div>
          <Label className="text-sm font-semibold mb-3 block">Upload date</Label>
          <div className="space-y-2">
            <Input
              type="date"
              value={filters.dateRange?.from || ""}
              onChange={(e) => onUpdateFilters({ 
                dateRange: { from: e.target.value, to: filters.dateRange?.to || "" } 
              })}
            />
            <Input
              type="date"
              value={filters.dateRange?.to || ""}
              onChange={(e) => onUpdateFilters({ 
                dateRange: { from: filters.dateRange?.from || "", to: e.target.value } 
              })}
            />
          </div>
        </div>

        {/* Clear Filters */}
        {activeFilterCount > 0 && (
          <Button variant="outline" size="sm" className="w-full" onClick={onResetFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear filters
            <Badge variant="secondary" className="ml-2">{activeFilterCount}</Badge>
          </Button>
        )}
      </div>
    </div>
  )
}
