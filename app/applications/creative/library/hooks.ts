"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { MOCK_BRIEFS, getBriefName } from "./mock-data"
import { assetService } from "./service"
import type {
  Asset,
  Brief,
  AssetFilters,
  AssetType,
  AssetCategory,
  UploadAssetFormData,
  WorkflowStage,
  UATestStatus,
  DeploymentStatus,
  AdNetwork,
  CreativeTeam,
} from "./types"

const defaultFilters: AssetFilters = {
  search: "",
  types: [],
  categories: [],
  tags: [],
  campaigns: [],
  sortBy: "newest",
  workflowStages: ['final', 'live'], // Default: show Final and Live assets
  teams: [],
  adNetworks: [],
  performanceRatings: [],
  deploymentStatuses: [],
}

export function useAssets() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [briefs, setBriefs] = useState<Brief[]>([])
  const [filters, setFilters] = useState<AssetFilters>(defaultFilters)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch assets when filters change
  const fetchAssets = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await assetService.getAssets(filters)
      setAssets(data)
    } catch (error) {
      console.error("Failed to fetch assets:", error)
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  // Subscribing to filter changes
  useEffect(() => {
    fetchAssets()
  }, [fetchAssets])

  // Fetch briefs once on mount
  useEffect(() => {
    assetService.getBriefs().then(setBriefs)
  }, [])

  // ============================================
  // FILTER ACTIONS
  // ============================================
  const updateFilters = useCallback((updates: Partial<AssetFilters>) => {
    setFilters(prev => ({ ...prev, ...updates }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters)
  }, [])

  const toggleTypeFilter = useCallback((type: AssetType) => {
    setFilters(prev => ({
      ...prev,
      types: prev.types.includes(type) ? prev.types.filter(t => t !== type) : [...prev.types, type]
    }))
  }, [])

  const toggleCategoryFilter = useCallback((category: AssetCategory) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category) ? prev.categories.filter(c => c !== category) : [...prev.categories, category]
    }))
  }, [])

  const toggleWorkflowFilter = useCallback((stage: WorkflowStage) => {
    setFilters(prev => ({
      ...prev,
      workflowStages: prev.workflowStages?.includes(stage)
        ? prev.workflowStages.filter(s => s !== stage)
        : [...(prev.workflowStages || []), stage]
    }))
  }, [])

  const toggleNetworkFilter = useCallback((network: AdNetwork) => {
    setFilters(prev => ({
      ...prev,
      adNetworks: prev.adNetworks?.includes(network)
        ? prev.adNetworks.filter(n => n !== network)
        : [...(prev.adNetworks || []), network]
    }))
  }, [])

  // ============================================
  // ASSET CRUD OPERATIONS
  // ============================================
  const uploadAssets = useCallback(async (formData: UploadAssetFormData): Promise<Asset[]> => {
    setIsLoading(true)
    try {
      const newAssets = await assetService.uploadAssets(formData)
      // Optimistically update or re-fetch. Since we filter locally in service, re-fetch is safest but slower.
      // Let's manually trigger a refresh
      await fetchAssets()
      return newAssets
    } finally {
      setIsLoading(false)
    }
  }, [fetchAssets])

  const importFromDrive = useCallback(async (driveUrl: string): Promise<Asset | null> => {
    setIsLoading(true)
    try {
      const newAsset = await assetService.importFromDrive(driveUrl)
      if (newAsset) await fetchAssets()
      return newAsset
    } finally {
      setIsLoading(false)
    }
  }, [fetchAssets])

  const updateAsset = useCallback(async (id: string, updates: Partial<Asset>) => {
    // Optimistic update
    setAssets(prev => prev.map(a =>
      a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a
    ))

    // Background sync
    const success = await assetService.updateAsset(id, updates)
    if (!success) {
      // Revert if failed (simplified: just refetch)
      await fetchAssets()
    }
    return success
  }, [fetchAssets])

  const deleteAsset = useCallback(async (id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id)) // Optimistic
    await assetService.deleteAsset(id)
    await fetchAssets() // Sync
  }, [fetchAssets])

  const incrementViews = useCallback(async (id: string) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, views: a.views + 1 } : a))
    await assetService.incrementViews(id)
  }, [])

  const incrementDownloads = useCallback(async (id: string) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, downloads: a.downloads + 1 } : a))
    await assetService.incrementDownloads(id)
  }, [])

  const updateWorkflowStage = useCallback(async (id: string, stage: WorkflowStage) => {
    await assetService.updateWorkflowStage(id, stage)
    await fetchAssets()
  }, [fetchAssets])

  const updateUATestStatus = useCallback((id: string, updates: Partial<UATestStatus>) => {
    setAssets(prev => prev.map(a => {
      if (a.id !== id) return a
      const currentStatus = a.uaTestStatus || { isPlanned: false, testedNetworks: [], performanceRating: {} }
      return { ...a, uaTestStatus: { ...currentStatus, ...updates } }
    })) // Optimistic
    assetService.updateUATestStatus(id, updates)
  }, [])

  const setNetworkStatus = useCallback(async (id: string, network: AdNetwork, rating: 'good' | 'bad' | 'testing' | null) => {
    await assetService.setNetworkStatus(id, network, rating)
    await fetchAssets()
  }, [fetchAssets])

  const updateDeploymentStatus = useCallback(async (id: string, status: DeploymentStatus, stopReason?: string) => {
    await assetService.updateDeploymentStatus(id, status, stopReason)
    await fetchAssets()
  }, [fetchAssets])

  const updateLiveNetworks = useCallback(async (id: string, networks: AdNetwork[]) => {
    await assetService.updateLiveNetworks(id, networks)
    await fetchAssets()
  }, [fetchAssets])

  const updateDriveInfo = useCallback(async (id: string, driveUrl: string) => {
    const success = await assetService.updateDriveInfo(id, driveUrl)
    if (success) await fetchAssets()
    return success
  }, [fetchAssets])

  const removeDriveLink = useCallback(async (id: string) => {
    await assetService.removeDriveLink(id)
    await fetchAssets()
  }, [fetchAssets])

  // ============================================
  // Refresh Asset from ERP
  // ============================================
  const refreshAssetFromERP = useCallback(async (id: string): Promise<{ asset: Asset; updatedFields: string[] } | null> => {
    try {
      const result = await assetService.refreshAssetFromERP(id)
      if (result) {
        setAssets(prev => prev.map(a => a.id === id ? result.asset : a))
      }
      return result
    } catch (err) {
      console.error("Failed to refresh asset from ERP:", err)
      return null
    }
  }, [])

  // ============================================
  // STATS - Calculated from current filtered view or full set?
  // Service.getAssets filters data, so `assets` is filtered.
  // Grouping should happen on `assets`.
  // Wait, the previous hook calculated stats on `assets` (which was `mockAssets` array).
  // If `assets` is now filtered, stats will reflect the filtered view.
  // The original hook had `const filteredAssets = useMemo` vs `const [assets, setAssets]`.
  // Originally `assets` was ALL assets, and `filteredAssets` was the subset.

  // PROBLEM: If I fetch filtered assets from service, I lose the ability to calculate stats for the whole library unless I fetch all or ask service for stats.
  // To keep it simple and match "refactor" goals:
  // I should probably fetch ALL assets if I want client-side filtering (which means service logic is just a wrapper),
  // OR strictly follow the plan where service does filtering.
  // If service does filtering, I need `assetsByWorkflow` to be returned by service or just calculate it on what's visible.

  // The UI likely expects `assets` to be the full list for some things, or `filteredAssets` for the view.
  // The original hook exported `assets` (all) AND `filteredAssets` (view).
  // If I move filtering to backend (service), `assets` becomes the result.
  // If the UI relies on "Show All" stats while filtered, I need a separate stats endpoint.
  // BUT: looking at original code, `assetsByWorkflow` was `mockAssets.filter...` no wait.
  // `assetsByWorkflow` in original code used `assets` (the state).

  // Let's keep CLIENT-SIDE filtering for now to minimize risk of breaking UI logic that expects all assets available for stats?
  // NO, the plan said "Move filtering to service.ts". Use Case 1 demands data isolation.
  // So `useAssets` should return `assets` which are the result of the query.
  // If `assetsByWorkflow` is needed, it should probably be based on the CURRENT view or I need a `getStats` method.

  // Let's assume `assetsByWorkflow` is used for the Kanban board columns.
  // If I filter by "Type: Video", Kanban should show only Videos. So calculating from `assets` (which is filtered result) is correct behavior for a filtered view.

  const assetsByWorkflow = useMemo(() => {
    const stages: WorkflowStage[] = ['final', 'live', 'stopped']
    return stages.reduce((acc, stage) => {
      acc[stage] = assets.filter(a => a.workflowStage === stage)
      return acc
    }, {} as Record<WorkflowStage, Asset[]>)
  }, [assets])

  const performanceStats = useMemo(() => {
    const networks: AdNetwork[] = ['google', 'meta', 'mintegral', 'axon', 'unity', 'tiktok', 'apple_search_ads']
    return networks.reduce((acc, network) => {
      const withNetwork = assets.filter(a => a.uaTestStatus?.testedNetworks?.includes(network))
      acc[network] = {
        tested: withNetwork.length,
        good: withNetwork.filter(a => a.uaTestStatus?.performanceRating?.[network] === 'good').length,
        bad: withNetwork.filter(a => a.uaTestStatus?.performanceRating?.[network] === 'bad').length,
        testing: withNetwork.filter(a => a.uaTestStatus?.performanceRating?.[network] === 'testing').length,
      }
      return acc
    }, {} as Record<AdNetwork, { tested: number; good: number; bad: number; testing: number }>)
  }, [assets])

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.search) count++
    if (filters.types.length > 0) count++
    if (filters.categories.length > 0) count++
    if (filters.tags.length > 0) count++
    if (filters.campaigns.length > 0) count++
    if (filters.teams && filters.teams.length > 0) count++
    if (filters.adNetworks && filters.adNetworks.length > 0) count++
    if (filters.performanceRatings && filters.performanceRatings.length > 0) count++
    if (filters.deploymentStatuses && filters.deploymentStatuses.length > 0) count++
    if (filters.hasTestPlan !== undefined) count++
    // Workflow filter is default so maybe don't count if it matches default? 
    // Old logic likely counted it if it was different from default or just counted sections.
    // Let's count it if it's not the default ['final', 'live']? Or just count if active.
    // Simplifying: count if length > 0
    if (filters.workflowStages && filters.workflowStages.length > 0) {
      // Check if different from default?
      const isDefault = filters.workflowStages.length === 2 && filters.workflowStages.includes('final') && filters.workflowStages.includes('live')
      if (!isDefault) count++
    }
    return count
  }, [filters])

  return {
    assets, // This is now the FILTERED list corresponding to `filteredAssets` in old code
    briefs, // Added briefs export
    filteredAssets: assets, // Alias for compatibility if needed, but better to just use assets
    activeFilterCount,
    filters,
    isLoading,
    updateFilters,
    resetFilters,
    toggleTypeFilter,
    toggleCategoryFilter,
    toggleWorkflowFilter,
    toggleNetworkFilter,
    uploadAssets,
    importFromDrive,
    deleteAsset,
    incrementViews,
    incrementDownloads,
    updateAsset,
    updateDriveInfo,
    removeDriveLink,
    updateWorkflowStage,
    updateUATestStatus,
    setNetworkStatus,
    updateDeploymentStatus,
    updateLiveNetworks,
    assetsByWorkflow,
    performanceStats,
    refreshAssetFromERP,
  }
}
