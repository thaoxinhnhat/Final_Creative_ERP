"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Upload, Grid, List, FolderOpen, Image, FileText, Video, Package } from "lucide-react"
import { useRouter } from "next/navigation"

import type { Asset, AssetFilters } from "./types"
import { useAssets } from "./hooks"
import { FilterPanel } from "./components/FilterPanel"
import { AssetGrid } from "./components/AssetGrid"
import { AssetDetail } from "./components/AssetDetail"
import { UploadModal } from "./components/UploadModal"

export default function CreativeLibraryPage() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)

  const {
    assets,
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
  } = useAssets()

  const handleSelectAsset = (asset: Asset) => {
    setSelectedAsset(asset)
    incrementViews(asset.id)
  }

  const handleDownload = (asset: Asset) => {
    incrementDownloads(asset.id)
    const link = document.createElement('a')
    link.href = asset.fileUrl
    link.download = asset.name
    link.click()
  }

  const handleUpload = async (formData: any) => {
    await uploadAssets(formData)
    setUploadModalOpen(false)
  }

  const handleDelete = (assetId: string) => {
    deleteAsset(assetId)
    setSelectedAsset(null)
  }

  // Quick stats
  const stats = {
    images: assets.filter(a => a.type === 'image').length,
    videos: assets.filter(a => a.type === 'video').length,
    documents: assets.filter(a => a.type === 'document').length,
    others: assets.filter(a => ['template', 'other'].includes(a.type)).length,
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.push("/applications")}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Quay lại
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-blue-600" />
                Asset Management
              </h1>
              <p className="text-xs text-muted-foreground">Kho lưu trữ tập trung cho tất cả creative assets</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Quick Stats */}
            <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Image className="h-3.5 w-3.5 text-green-600" />
                {stats.images} ảnh
              </span>
              <span className="flex items-center gap-1">
                <Video className="h-3.5 w-3.5 text-purple-600" />
                {stats.videos} video
              </span>
              <span className="flex items-center gap-1">
                <FileText className="h-3.5 w-3.5 text-red-600" />
                {stats.documents} tài liệu
              </span>
              <span className="flex items-center gap-1">
                <Package className="h-3.5 w-3.5 text-orange-600" />
                {stats.others} khác
              </span>
            </div>
            <Separator orientation="vertical" className="h-6 hidden md:block" />
            {/* View Mode Toggle */}
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={() => setUploadModalOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Assets
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Left: Filter Panel */}
        <FilterPanel
          filters={filters}
          onUpdateFilters={updateFilters}
          onResetFilters={resetFilters}
          onToggleType={toggleTypeFilter}
          onToggleCategory={toggleCategoryFilter}
          activeFilterCount={activeFilterCount}
        />

        {/* Center: Asset Grid */}
        <AssetGrid
          assets={assets}
          viewMode={viewMode}
          isLoading={isLoading}
          selectedId={selectedAsset?.id || null}
          onSelectAsset={handleSelectAsset}
          onDownload={handleDownload}
          sortBy={filters.sortBy}
          onSortChange={(sortBy: AssetFilters['sortBy']) => updateFilters({ sortBy })}
        />

        {/* Right: Asset Detail Sidebar */}
        {selectedAsset && (
          <AssetDetail
            asset={selectedAsset}
            onClose={() => setSelectedAsset(null)}
            onDownload={() => handleDownload(selectedAsset)}
            onDelete={() => handleDelete(selectedAsset.id)}
          />
        )}
      </div>

      {/* Upload Modal */}
      <UploadModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        onUpload={handleUpload}
      />
    </div>
  )
}
