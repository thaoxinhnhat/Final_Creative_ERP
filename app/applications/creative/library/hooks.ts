"use client"

import { useState, useMemo, useCallback } from "react"
import { mockAssets } from "./mockData"
import type {
  Asset,
  AssetFilters,
  AssetType,
  AssetCategory,
  UploadAssetFormData,
  WorkflowStage,
  UATestStatus,
  DeploymentStatus,
  AdNetwork,
  CreativeTeam,
  DriveFileInfo
} from "./types"
import {
  parseGoogleDriveUrl,
  getMockDriveFileInfo,
  parseAssetIdFromFilename,
  detectAssetTypeFromExtension,
  detectWorkflowStage,
  findMatchingBriefId,
  generateTagsFromParsedId,
  fetchDriveFileWithThumbnail,
  isValidDriveUrl,
} from "./utils/driveParser"

const defaultFilters: AssetFilters = {
  search: "",
  types: [],
  categories: [],
  tags: [],
  campaigns: [],
  sortBy: "newest",
  workflowStages: [],
  teams: [],
  adNetworks: [],
  performanceRatings: [],
  deploymentStatuses: [],
}

function detectFileType(ext: string): AssetType {
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
  const videoExts = ['mp4', 'mov', 'avi', 'webm']
  const docExts = ['pdf', 'doc', 'docx', 'txt', 'ppt', 'pptx']
  const templateExts = ['psd', 'ai', 'figma', 'sketch', 'xd']
  const playableExts = ['html', 'htm', 'zip']

  if (imageExts.includes(ext.toLowerCase())) return 'image'
  if (videoExts.includes(ext.toLowerCase())) return 'video'
  if (docExts.includes(ext.toLowerCase())) return 'document'
  if (templateExts.includes(ext.toLowerCase())) return 'template'
  if (playableExts.includes(ext.toLowerCase())) return 'playable'
  return 'other'
}

export function useAssets() {
  const [assets, setAssets] = useState<Asset[]>(mockAssets)
  const [filters, setFilters] = useState<AssetFilters>(defaultFilters)
  const [isLoading, setIsLoading] = useState(false)

  // ============================================
  // FILTERED ASSETS
  // ============================================
  const filteredAssets = useMemo(() => {
    let result = [...assets]

    // Search filter
    if (filters.search) {
      const search = filters.search.toLowerCase()
      result = result.filter(a =>
        a.name.toLowerCase().includes(search) ||
        a.description?.toLowerCase().includes(search) ||
        a.tags.some(t => t.toLowerCase().includes(search)) ||
        a.campaignName?.toLowerCase().includes(search) ||
        a.parsedAssetId?.toLowerCase().includes(search) ||
        a.creatorCode?.toLowerCase().includes(search)
      )
    }

    // Type filter
    if (filters.types.length > 0) {
      result = result.filter(a => filters.types.includes(a.type))
    }

    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter(a => filters.categories.includes(a.category))
    }

    // Campaign filter
    if (filters.campaigns.length > 0) {
      result = result.filter(a => a.campaignName && filters.campaigns.includes(a.campaignName))
    }

    // Date range filter
    if (filters.dateRange?.from) {
      result = result.filter(a => new Date(a.uploadedAt) >= new Date(filters.dateRange!.from))
    }
    if (filters.dateRange?.to) {
      result = result.filter(a => new Date(a.uploadedAt) <= new Date(filters.dateRange!.to))
    }

    // ============================================
    // NEW FILTERS
    // ============================================

    // Workflow stage filter
    if (filters.workflowStages && filters.workflowStages.length > 0) {
      result = result.filter(a => a.workflowStage && filters.workflowStages!.includes(a.workflowStage))
    }

    // Team filter
    if (filters.teams && filters.teams.length > 0) {
      result = result.filter(a => a.team && filters.teams!.includes(a.team))
    }

    // Ad networks filter
    if (filters.adNetworks && filters.adNetworks.length > 0) {
      result = result.filter(a =>
        a.uaTestStatus?.testedNetworks?.some(n => filters.adNetworks!.includes(n))
      )
    }

    // Performance rating filter
    if (filters.performanceRatings && filters.performanceRatings.length > 0) {
      result = result.filter(a => {
        if (!a.uaTestStatus?.performanceRating) return false
        return Object.values(a.uaTestStatus.performanceRating).some(
          rating => rating && filters.performanceRatings!.includes(rating)
        )
      })
    }

    // Test plan filter
    if (filters.hasTestPlan !== undefined) {
      result = result.filter(a => a.uaTestStatus?.isPlanned === filters.hasTestPlan)
    }

    // Deployment status filter
    if (filters.deploymentStatuses && filters.deploymentStatuses.length > 0) {
      result = result.filter(a =>
        a.deploymentStatus && filters.deploymentStatuses!.includes(a.deploymentStatus)
      )
    }

    // ============================================
    // SORTING
    // ============================================
    switch (filters.sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
        break
      case "oldest":
        result.sort((a, b) => new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime())
        break
      case "name_asc":
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "name_desc":
        result.sort((a, b) => b.name.localeCompare(a.name))
        break
      case "size":
        result.sort((a, b) => b.fileSize - a.fileSize)
        break
      case "downloads":
        result.sort((a, b) => b.downloads - a.downloads)
        break
      case "performance":
        // Sort by number of "good" ratings
        result.sort((a, b) => {
          const aGood = Object.values(a.uaTestStatus?.performanceRating || {}).filter(r => r === 'good').length
          const bGood = Object.values(b.uaTestStatus?.performanceRating || {}).filter(r => r === 'good').length
          return bGood - aGood
        })
        break
    }

    return result
  }, [assets, filters])

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
    const newAssets: Asset[] = formData.files.map((file, index) => {
      const ext = file.name.split('.').pop() || ''
      return {
        id: `asset_${Date.now()}_${index}`,
        name: file.name,
        type: detectFileType(ext),
        category: formData.category,
        fileUrl: URL.createObjectURL(file),
        thumbnailUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        fileSize: file.size,
        fileExtension: ext,
        description: formData.description,
        tags: formData.tags,
        campaignName: formData.campaignName,
        appName: formData.appName,
        briefId: formData.briefId,
        conceptId: formData.conceptId,
        uploadedBy: "Creative Team",
        uploadedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "active",
        downloads: 0,
        views: 0,
        workflowStage: formData.workflowStage || 'brief',
        team: formData.team,
        driveUrl: formData.driveUrl,
        driveFileId: formData.driveFileId,
      }
    })
    setAssets(prev => [...newAssets, ...prev])
    return newAssets
  }, [])

  // ============================================
  // NEW: IMPORT FROM GOOGLE DRIVE
  // ============================================
  const importFromDrive = useCallback(async (driveUrl: string): Promise<Asset | null> => {
    setIsLoading(true)
    try {
      const parsed = parseGoogleDriveUrl(driveUrl)
      if (!parsed) {
        throw new Error('Invalid Google Drive URL')
      }

      // Get file info from Drive API (mock)
      const fileInfo = await getMockDriveFileInfo(parsed.fileId)

      // Parse asset ID from filename
      const parsedId = parseAssetIdFromFilename(fileInfo.name)

      // Auto-detect type and workflow stage
      const ext = fileInfo.name.split('.').pop() || ''
      const assetType = detectAssetTypeFromExtension(ext)

      // Find matching brief
      const briefId = findMatchingBriefId(parsedId)

      // Generate tags
      const autoTags = generateTagsFromParsedId(parsedId)

      const newAsset: Asset = {
        id: `asset_${Date.now()}_drive`,
        name: fileInfo.name,
        type: assetType,
        category: 'final_creative',
        fileUrl: fileInfo.webContentLink || fileInfo.webViewLink,
        thumbnailUrl: fileInfo.thumbnailLink,
        fileSize: fileInfo.size,
        fileExtension: ext,
        tags: autoTags,
        uploadedBy: parsedId?.creatorCode || 'Drive Import',
        uploadedAt: fileInfo.createdTime,
        updatedAt: new Date().toISOString(),
        status: 'active',
        downloads: 0,
        views: 0,
        // Drive integration
        driveUrl,
        driveFileId: parsed.fileId,
        // Workflow
        workflowStage: 'brief',
        // Parsed metadata
        parsedAssetId: parsedId?.fullId,
        projectCode: parsedId?.projectCode,
        teamCode: parsedId?.teamCode,
        creatorCode: parsedId?.creatorCode,
        sequenceNumber: parsedId?.sequenceNumber,
        team: parsedId?.team,
        isCreativeAI: parsedId?.isCreativeAI,
        // Auto-link
        briefId,
      }

      // Auto-detect workflow stage
      newAsset.workflowStage = detectWorkflowStage(newAsset)

      setAssets(prev => [newAsset, ...prev])
      return newAsset
    } catch (error) {
      console.error('Error importing from Drive:', error)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  // ============================================
  // NEW: WORKFLOW MANAGEMENT
  // ============================================
  const updateWorkflowStage = useCallback((id: string, stage: WorkflowStage) => {
    setAssets(prev => prev.map(a => {
      if (a.id !== id) return a

      const history = a.workflowHistory || []
      history.push({
        stage: a.workflowStage,
        changedAt: new Date().toISOString(),
        changedBy: 'User',
      })

      return {
        ...a,
        workflowStage: stage,
        workflowHistory: history,
        updatedAt: new Date().toISOString(),
      }
    }))
  }, [])

  // ============================================
  // NEW: UA TESTING MANAGEMENT
  // ============================================
  const updateUATestStatus = useCallback((id: string, updates: Partial<UATestStatus>) => {
    setAssets(prev => prev.map(a => {
      if (a.id !== id) return a

      const currentStatus = a.uaTestStatus || {
        isPlanned: false,
        testedNetworks: [],
        performanceRating: {},
      }

      return {
        ...a,
        uaTestStatus: { ...currentStatus, ...updates },
        updatedAt: new Date().toISOString(),
      }
    }))
  }, [])

  const setNetworkStatus = useCallback((id: string, network: AdNetwork, rating: 'good' | 'bad' | 'testing' | null) => {
    setAssets(prev => prev.map(a => {
      if (a.id !== id) return a

      const currentStatus = a.uaTestStatus || {
        isPlanned: false,
        testedNetworks: [],
        performanceRating: {},
      }

      const testedNetworks = currentStatus.testedNetworks.includes(network)
        ? currentStatus.testedNetworks
        : [...currentStatus.testedNetworks, network]

      return {
        ...a,
        uaTestStatus: {
          ...currentStatus,
          testedNetworks,
          performanceRating: {
            ...currentStatus.performanceRating,
            [network]: rating,
          },
        },
        updatedAt: new Date().toISOString(),
      }
    }))
  }, [])

  // ============================================
  // NEW: DEPLOYMENT MANAGEMENT
  // ============================================
  const updateDeploymentStatus = useCallback((id: string, status: DeploymentStatus, stopReason?: string) => {
    setAssets(prev => prev.map(a => {
      if (a.id !== id) return a

      const updates: Partial<Asset> = {
        deploymentStatus: status,
        updatedAt: new Date().toISOString(),
      }

      if (status === 'stopped') {
        updates.stopReason = stopReason
        updates.stoppedAt = new Date().toISOString()
        updates.workflowStage = 'stopped'
      }

      if (status === 'live') {
        updates.workflowStage = 'test'
      }

      return { ...a, ...updates }
    }))
  }, [])

  const updateLiveNetworks = useCallback((id: string, networks: AdNetwork[]) => {
    setAssets(prev => prev.map(a => {
      if (a.id !== id) return a
      return {
        ...a,
        liveNetworks: networks,
        deploymentStatus: networks.length > 0 ? 'live' : a.deploymentStatus,
        updatedAt: new Date().toISOString(),
      }
    }))
  }, [])

  // ============================================
  // OTHER OPERATIONS
  // ============================================
  const deleteAsset = useCallback((id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id))
  }, [])

  const incrementViews = useCallback((id: string) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, views: a.views + 1 } : a))
  }, [])

  const incrementDownloads = useCallback((id: string) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, downloads: a.downloads + 1 } : a))
  }, [])

  const updateAsset = useCallback((id: string, updates: Partial<Asset>) => {
    setAssets(prev => prev.map(a =>
      a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a
    ))
  }, [])

  // ============================================
  // NEW: GOOGLE DRIVE INFO UPDATE
  // ============================================
  const updateDriveInfo = useCallback(async (id: string, driveUrl: string): Promise<boolean> => {
    // Validate URL
    if (!isValidDriveUrl(driveUrl)) {
      console.error('Invalid Google Drive URL')
      return false
    }

    setIsLoading(true)
    try {
      // Fetch Drive file info with thumbnail
      const driveInfo = await fetchDriveFileWithThumbnail(driveUrl)

      if (!driveInfo) {
        console.error('Could not fetch Drive file info')
        return false
      }

      // Update asset with Drive info and new thumbnail
      setAssets(prev => prev.map(a => {
        if (a.id !== id) return a

        return {
          ...a,
          driveUrl,
          driveFileId: driveInfo.fileId,
          thumbnailUrl: driveInfo.thumbnailUrl, // Update thumbnail from Drive
          updatedAt: new Date().toISOString(),
        }
      }))

      return true
    } catch (error) {
      console.error('Error updating Drive info:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  // ============================================
  // NEW: REMOVE DRIVE LINK
  // ============================================
  const removeDriveLink = useCallback((id: string) => {
    setAssets(prev => prev.map(a => {
      if (a.id !== id) return a

      return {
        ...a,
        driveUrl: undefined,
        driveFileId: undefined,
        updatedAt: new Date().toISOString(),
      }
    }))
  }, [])

  // ============================================
  // STATS & GROUPING
  // ============================================
  const assetsByWorkflow = useMemo(() => {
    const stages: WorkflowStage[] = ['brief', 'review', 'final', 'test', 'stopped']
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
        total: withNetwork.length,
        good: withNetwork.filter(a => a.uaTestStatus?.performanceRating?.[network] === 'good').length,
        bad: withNetwork.filter(a => a.uaTestStatus?.performanceRating?.[network] === 'bad').length,
        testing: withNetwork.filter(a => a.uaTestStatus?.performanceRating?.[network] === 'testing').length,
      }
      return acc
    }, {} as Record<AdNetwork, { total: number; good: number; bad: number; testing: number }>)
  }, [assets])

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.search) count++
    if (filters.types.length > 0) count++
    if (filters.categories.length > 0) count++
    if (filters.campaigns.length > 0) count++
    if (filters.dateRange?.from || filters.dateRange?.to) count++
    if (filters.workflowStages && filters.workflowStages.length > 0) count++
    if (filters.teams && filters.teams.length > 0) count++
    if (filters.adNetworks && filters.adNetworks.length > 0) count++
    if (filters.performanceRatings && filters.performanceRatings.length > 0) count++
    if (filters.deploymentStatuses && filters.deploymentStatuses.length > 0) count++
    return count
  }, [filters])

  return {
    // Data
    assets: filteredAssets,
    allAssets: assets,
    filters,
    isLoading,

    // Filter actions
    updateFilters,
    resetFilters,
    toggleTypeFilter,
    toggleCategoryFilter,
    toggleWorkflowFilter,
    toggleNetworkFilter,
    activeFilterCount,

    // CRUD
    uploadAssets,
    deleteAsset,
    updateAsset,
    incrementViews,
    incrementDownloads,

    // NEW: Drive import
    importFromDrive,
    updateDriveInfo,
    removeDriveLink,

    // NEW: Workflow
    updateWorkflowStage,
    assetsByWorkflow,

    // NEW: UA Testing
    updateUATestStatus,
    setNetworkStatus,
    performanceStats,

    // NEW: Deployment
    updateDeploymentStatus,
    updateLiveNetworks,
  }
}
