"use client"

import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Search, X, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import type {
  AssetFilters,
  AssetType,
  AssetCategory,
  WorkflowStage,
  AdNetwork,
  CreativeTeam,
  DeploymentStatus
} from "../types"
import {
  TYPE_CONFIG,
  CATEGORY_CONFIG,
  WORKFLOW_STAGE_CONFIG,
  AD_NETWORK_CONFIG,
  ALL_AD_NETWORKS,
  TEAM_CONFIG,
  DEPLOYMENT_STATUS_CONFIG
} from "../types"
import { assetStats, uniqueCampaigns } from "../mockData"

interface FilterPanelProps {
  filters: AssetFilters
  onUpdateFilters: (updates: Partial<AssetFilters>) => void
  onResetFilters: () => void
  onToggleType: (type: AssetType) => void
  onToggleCategory: (category: AssetCategory) => void
  onToggleWorkflow?: (stage: WorkflowStage) => void
  onToggleNetwork?: (network: AdNetwork) => void
  activeFilterCount: number
}

export function FilterPanel({
  filters,
  onUpdateFilters,
  onResetFilters,
  onToggleType,
  onToggleCategory,
  onToggleWorkflow,
  onToggleNetwork,
  activeFilterCount,
}: FilterPanelProps) {
  const [expandedSections, setExpandedSections] = useState({
    type: true,
    category: true,
    workflow: true,
    networks: false,
    team: false,
    deployment: false,
    campaign: false,
    date: false,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const SectionHeader = ({
    title,
    section,
    count
  }: {
    title: string
    section: keyof typeof expandedSections
    count?: number
  }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between text-sm font-semibold hover:text-primary transition-colors"
    >
      <span>
        {title}
        {count !== undefined && count > 0 && (
          <Badge variant="secondary" className="ml-2 text-xs">{count}</Badge>
        )}
      </span>
      {expandedSections[section] ? (
        <ChevronUp className="h-4 w-4" />
      ) : (
        <ChevronDown className="h-4 w-4" />
      )}
    </button>
  )

  return (
    <div className="w-full h-full border-r bg-white dark:bg-gray-900 overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* Search */}
        <div>
          <Label className="text-sm font-semibold mb-2 block">Tìm kiếm</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tên file, ID, tags..."
              className="pl-9"
              value={filters.search}
              onChange={(e) => onUpdateFilters({ search: e.target.value })}
            />
          </div>
        </div>

        <Separator />

        {/* Workflow Stage - NEW */}
        <div className="space-y-2">
          <SectionHeader
            title="Workflow Stage"
            section="workflow"
            count={filters.workflowStages?.length}
          />
          {expandedSections.workflow && (
            <div className="space-y-1.5 pt-1">
              {(Object.keys(WORKFLOW_STAGE_CONFIG) as WorkflowStage[]).map((stage) => (
                <div key={stage} className="flex items-center">
                  <Checkbox
                    id={`workflow-${stage}`}
                    checked={filters.workflowStages?.includes(stage)}
                    onCheckedChange={() => onToggleWorkflow?.(stage)}
                  />
                  <Label
                    htmlFor={`workflow-${stage}`}
                    className="ml-2 text-xs cursor-pointer flex-1 flex items-center gap-1"
                  >
                    <span>{WORKFLOW_STAGE_CONFIG[stage].icon}</span>
                    <span>{WORKFLOW_STAGE_CONFIG[stage].label}</span>
                    <span className="text-muted-foreground">({assetStats.byWorkflowStage[stage]})</span>
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Ad Networks - NEW */}
        <div className="space-y-2">
          <SectionHeader
            title="Ad Networks"
            section="networks"
            count={filters.adNetworks?.length}
          />
          {expandedSections.networks && (
            <div className="space-y-1.5 pt-1">
              {ALL_AD_NETWORKS.map((network) => (
                <div key={network} className="flex items-center">
                  <Checkbox
                    id={`network-${network}`}
                    checked={filters.adNetworks?.includes(network)}
                    onCheckedChange={() => onToggleNetwork?.(network)}
                  />
                  <Label
                    htmlFor={`network-${network}`}
                    className="ml-2 text-xs cursor-pointer flex-1 flex items-center gap-1"
                  >
                    <span>{AD_NETWORK_CONFIG[network].icon}</span>
                    <span>{AD_NETWORK_CONFIG[network].shortLabel}</span>
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Team - NEW */}
        <div className="space-y-2">
          <SectionHeader
            title="Team"
            section="team"
            count={filters.teams?.length}
          />
          {expandedSections.team && (
            <div className="space-y-1.5 pt-1">
              {(Object.keys(TEAM_CONFIG) as CreativeTeam[]).map((team) => (
                <div key={team} className="flex items-center">
                  <Checkbox
                    id={`team-${team}`}
                    checked={filters.teams?.includes(team)}
                    onCheckedChange={() => {
                      const current = filters.teams || []
                      const updated = current.includes(team)
                        ? current.filter(t => t !== team)
                        : [...current, team]
                      onUpdateFilters({ teams: updated })
                    }}
                  />
                  <Label
                    htmlFor={`team-${team}`}
                    className="ml-2 text-xs cursor-pointer flex-1 flex items-center gap-1"
                  >
                    <span>{TEAM_CONFIG[team].icon}</span>
                    <span>{TEAM_CONFIG[team].label}</span>
                    <span className="text-muted-foreground">({assetStats.byTeam[team]})</span>
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Deployment Status - NEW */}
        <div className="space-y-2">
          <SectionHeader
            title="Deployment Status"
            section="deployment"
            count={filters.deploymentStatuses?.length}
          />
          {expandedSections.deployment && (
            <div className="space-y-1.5 pt-1">
              {(Object.keys(DEPLOYMENT_STATUS_CONFIG) as DeploymentStatus[]).map((status) => (
                <div key={status} className="flex items-center">
                  <Checkbox
                    id={`deployment-${status}`}
                    checked={filters.deploymentStatuses?.includes(status)}
                    onCheckedChange={() => {
                      const current = filters.deploymentStatuses || []
                      const updated = current.includes(status)
                        ? current.filter(s => s !== status)
                        : [...current, status]
                      onUpdateFilters({ deploymentStatuses: updated })
                    }}
                  />
                  <Label
                    htmlFor={`deployment-${status}`}
                    className="ml-2 text-xs cursor-pointer flex-1 flex items-center gap-1"
                  >
                    <span>{DEPLOYMENT_STATUS_CONFIG[status].icon}</span>
                    <span>{DEPLOYMENT_STATUS_CONFIG[status].label}</span>
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Asset Type */}
        <div className="space-y-2">
          <SectionHeader
            title="Loại file"
            section="type"
            count={filters.types.length}
          />
          {expandedSections.type && (
            <div className="space-y-1.5 pt-1">
              {(Object.keys(TYPE_CONFIG) as AssetType[]).map((type) => (
                <div key={type} className="flex items-center">
                  <Checkbox
                    id={`type-${type}`}
                    checked={filters.types.includes(type)}
                    onCheckedChange={() => onToggleType(type)}
                  />
                  <Label htmlFor={`type-${type}`} className="ml-2 text-xs cursor-pointer flex-1">
                    {TYPE_CONFIG[type].icon} {TYPE_CONFIG[type].label}
                    <span className="text-muted-foreground ml-1">({assetStats.byType[type]})</span>
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Category */}
        <div className="space-y-2">
          <SectionHeader
            title="Danh mục"
            section="category"
            count={filters.categories.length}
          />
          {expandedSections.category && (
            <div className="space-y-1.5 pt-1">
              {(Object.keys(CATEGORY_CONFIG) as AssetCategory[]).map((cat) => (
                <div key={cat} className="flex items-center">
                  <Checkbox
                    id={`cat-${cat}`}
                    checked={filters.categories.includes(cat)}
                    onCheckedChange={() => onToggleCategory(cat)}
                  />
                  <Label htmlFor={`cat-${cat}`} className="ml-2 text-xs cursor-pointer flex-1">
                    {CATEGORY_CONFIG[cat].icon} {CATEGORY_CONFIG[cat].label}
                    <span className="text-muted-foreground ml-1">({assetStats.byCategory[cat]})</span>
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Campaign */}
        <div className="space-y-2">
          <SectionHeader
            title="Campaign"
            section="campaign"
            count={filters.campaigns.length}
          />
          {expandedSections.campaign && (
            <div className="space-y-1 max-h-32 overflow-y-auto pt-1">
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
                  <Label htmlFor={`campaign-${campaign}`} className="ml-2 text-xs cursor-pointer truncate">
                    {campaign}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Date Range */}
        <div className="space-y-2">
          <SectionHeader title="Upload date" section="date" />
          {expandedSections.date && (
            <div className="space-y-2 pt-1">
              <Input
                type="date"
                className="text-xs"
                value={filters.dateRange?.from || ""}
                onChange={(e) => onUpdateFilters({
                  dateRange: { from: e.target.value, to: filters.dateRange?.to || "" }
                })}
              />
              <Input
                type="date"
                className="text-xs"
                value={filters.dateRange?.to || ""}
                onChange={(e) => onUpdateFilters({
                  dateRange: { from: filters.dateRange?.from || "", to: e.target.value }
                })}
              />
            </div>
          )}
        </div>

        {/* Clear Filters */}
        {activeFilterCount > 0 && (
          <>
            <Separator />
            <Button variant="outline" size="sm" className="w-full" onClick={onResetFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear filters
              <Badge variant="secondary" className="ml-2">{activeFilterCount}</Badge>
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
