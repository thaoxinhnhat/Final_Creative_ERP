"use client"

import { useState, useMemo, useCallback } from "react"
import { mockAssets } from "./mockData"
import type { Asset, AssetFilters, AssetType, AssetCategory, UploadAssetFormData } from "./types"

const defaultFilters: AssetFilters = {
  search: "",
  types: [],
  categories: [],
  tags: [],
  campaigns: [],
  sortBy: "newest",
}

function detectFileType(ext: string): AssetType {
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
  const videoExts = ['mp4', 'mov', 'avi', 'webm']
  const docExts = ['pdf', 'doc', 'docx', 'txt', 'ppt', 'pptx']
  const templateExts = ['psd', 'ai', 'figma', 'sketch', 'xd']
  
  if (imageExts.includes(ext.toLowerCase())) return 'image'
  if (videoExts.includes(ext.toLowerCase())) return 'video'
  if (docExts.includes(ext.toLowerCase())) return 'document'
  if (templateExts.includes(ext.toLowerCase())) return 'template'
  return 'other'
}

export function useAssets() {
  const [assets, setAssets] = useState<Asset[]>(mockAssets)
  const [filters, setFilters] = useState<AssetFilters>(defaultFilters)
  const [isLoading] = useState(false)

  const filteredAssets = useMemo(() => {
    let result = [...assets]

    if (filters.search) {
      const search = filters.search.toLowerCase()
      result = result.filter(a =>
        a.name.toLowerCase().includes(search) ||
        a.description?.toLowerCase().includes(search) ||
        a.tags.some(t => t.toLowerCase().includes(search)) ||
        a.campaignName?.toLowerCase().includes(search)
      )
    }

    if (filters.types.length > 0) {
      result = result.filter(a => filters.types.includes(a.type))
    }

    if (filters.categories.length > 0) {
      result = result.filter(a => filters.categories.includes(a.category))
    }

    if (filters.campaigns.length > 0) {
      result = result.filter(a => a.campaignName && filters.campaigns.includes(a.campaignName))
    }

    if (filters.dateRange?.from) {
      result = result.filter(a => new Date(a.uploadedAt) >= new Date(filters.dateRange!.from))
    }
    if (filters.dateRange?.to) {
      result = result.filter(a => new Date(a.uploadedAt) <= new Date(filters.dateRange!.to))
    }

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
    }

    return result
  }, [assets, filters])

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
        uploadedBy: "Creative Team",
        uploadedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "active",
        downloads: 0,
        views: 0,
      }
    })
    setAssets(prev => [...newAssets, ...prev])
    return newAssets
  }, [])

  const deleteAsset = useCallback((id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id))
  }, [])

  const incrementViews = useCallback((id: string) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, views: a.views + 1 } : a))
  }, [])

  const incrementDownloads = useCallback((id: string) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, downloads: a.downloads + 1 } : a))
  }, [])

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.search) count++
    if (filters.types.length > 0) count++
    if (filters.categories.length > 0) count++
    if (filters.campaigns.length > 0) count++
    if (filters.dateRange?.from || filters.dateRange?.to) count++
    return count
  }, [filters])

  return {
    assets: filteredAssets,
    allAssets: assets,
    filters,
    isLoading,
    updateFilters,
    resetFilters,
    toggleTypeFilter,
    toggleCategoryFilter,
    uploadAssets,
    deleteAsset,
    incrementViews,
    incrementDownloads,
    activeFilterCount,
  }
}
