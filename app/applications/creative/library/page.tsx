"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Upload,
  Grid,
  List,
  FolderOpen,
  Image as ImageIcon,
  FileText,
  Layers,
  Clock,
  BarChart3,
  ChevronDown,
  HardDrive,
  FileArchive,
  GripVertical,
  UserCog
} from "lucide-react"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

import type { Asset, AssetFilters, WorkflowStage } from "./types"
import { useAssets } from "./hooks"
import { FilterPanel } from "./components/FilterPanel"
import { AssetGrid } from "./components/AssetGrid"
import { AssetDetail } from "./components/AssetDetail"
import { UploadModal } from "./components/UploadModal"
import { KanbanBoard } from "./components/KanbanBoard"
import { TimelineView } from "./components/TimelineView"
import { PerformanceDashboard } from "./components/PerformanceDashboard"
import { useFilterSettings } from "./components/FilterSettingsModal"

type ViewMode = 'grid' | 'list' | 'kanban' | 'timeline' | 'dashboard'
type LibraryType = 'media' | 'document'

const VIEW_CONFIG: Record<ViewMode, { label: string; icon: React.ReactNode }> = {
  grid: { label: "Grid", icon: <Grid className="h-4 w-4" /> },
  list: { label: "List", icon: <List className="h-4 w-4" /> },
  kanban: { label: "Kanban", icon: <Layers className="h-4 w-4" /> },
  timeline: { label: "Timeline", icon: <Clock className="h-4 w-4" /> },
  dashboard: { label: "Dashboard", icon: <BarChart3 className="h-4 w-4" /> },
}

const LIBRARY_CONFIG: Record<LibraryType, {
  label: string
  icon: React.ReactNode
  types: string[]
}> = {
  media: {
    label: "Media Library",
    icon: <HardDrive className="h-4 w-4" />,
    types: ['image', 'video', 'playable', 'endcard']
  },
  document: {
    label: "Document Library",
    icon: <FileArchive className="h-4 w-4" />,
    types: ['document', 'template', 'other']
  }
}

// Min/max widths for resizable panels
const FILTER_MIN_WIDTH = 200
const FILTER_MAX_WIDTH = 400
const FILTER_DEFAULT_WIDTH = 280

const DETAIL_MIN_WIDTH = 300
const DETAIL_MAX_WIDTH = 500
const DETAIL_DEFAULT_WIDTH = 380

export default function CreativeLibraryPage() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [libraryType, setLibraryType] = useState<LibraryType>('media')
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)

  // Resizable panel widths
  const [filterWidth, setFilterWidth] = useState(FILTER_DEFAULT_WIDTH)
  const [detailWidth, setDetailWidth] = useState(DETAIL_DEFAULT_WIDTH)
  const [isResizingFilter, setIsResizingFilter] = useState(false)
  const [isResizingDetail, setIsResizingDetail] = useState(false)

  // User role for testing (UA team can Confirm Live, Creative cannot, Admin can edit settings)
  const [userRole, setUserRole] = useState<'ua_team' | 'creative_team' | 'admin'>('creative_team')

  // Filter settings
  const { settings: filterSettings, saveSettings: saveFilterSettings } = useFilterSettings()

  const {
    assets,
    allAssets,
    filters,
    isLoading,
    updateFilters,
    resetFilters,
    toggleTypeFilter,
    toggleCategoryFilter,
    toggleWorkflowFilter,
    toggleNetworkFilter,
    uploadAssets,
    deleteAsset,
    incrementViews,
    incrementDownloads,
    activeFilterCount,
    importFromDrive,
    updateWorkflowStage,
    assetsByWorkflow,
    updateUATestStatus,
    setNetworkStatus,
    performanceStats,
    updateDeploymentStatus,
    updateLiveNetworks,
    updateDriveInfo,
    removeDriveLink,
  } = useAssets()

  // Derive selectedAsset from allAssets to keep it in sync after updates
  const selectedAsset = selectedAssetId
    ? allAssets.find(a => a.id === selectedAssetId) || null
    : null

  // Filter assets by library type
  // For documents: ignore workflow filter, show all documents
  // For media: apply workflow filter as normal
  const libraryAssets = libraryType === 'document'
    ? allAssets.filter(asset => LIBRARY_CONFIG[libraryType].types.includes(asset.type))
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
    : assets.filter(asset => LIBRARY_CONFIG[libraryType].types.includes(asset.type))

  const handleSelectAsset = (asset: Asset) => {
    setSelectedAssetId(asset.id)
    incrementViews(asset.id)
  }

  const handleDownload = (asset: Asset) => {
    incrementDownloads(asset.id)
    if (asset.driveUrl) {
      window.open(asset.driveUrl, '_blank')
    } else {
      const link = document.createElement('a')
      link.href = asset.fileUrl
      link.download = asset.name
      link.click()
    }
  }

  const handleUpload = async (formData: any) => {
    await uploadAssets(formData)
    setUploadModalOpen(false)
  }

  const handleImportFromDrive = async (driveUrl: string) => {
    const asset = await importFromDrive(driveUrl)
    if (asset) {
      setSelectedAssetId(asset.id)
    }
  }

  const handleDelete = (assetId: string) => {
    deleteAsset(assetId)
    setSelectedAssetId(null)
  }

  const handleMoveAsset = (assetId: string, newStage: WorkflowStage) => {
    updateWorkflowStage(assetId, newStage)
  }

  // Resize handlers for Filter Panel
  const handleFilterResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizingFilter(true)

    const startX = e.clientX
    const startWidth = filterWidth

    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - startX
      const newWidth = Math.min(FILTER_MAX_WIDTH, Math.max(FILTER_MIN_WIDTH, startWidth + diff))
      setFilterWidth(newWidth)
    }

    const handleMouseUp = () => {
      setIsResizingFilter(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [filterWidth])

  // Resize handlers for Detail Panel
  const handleDetailResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizingDetail(true)

    const startX = e.clientX
    const startWidth = detailWidth

    const handleMouseMove = (e: MouseEvent) => {
      const diff = startX - e.clientX
      const newWidth = Math.min(DETAIL_MAX_WIDTH, Math.max(DETAIL_MIN_WIDTH, startWidth + diff))
      setDetailWidth(newWidth)
    }

    const handleMouseUp = () => {
      setIsResizingDetail(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [detailWidth])

  // Count by library type
  const mediaCount = allAssets.filter(a => LIBRARY_CONFIG.media.types.includes(a.type)).length
  const documentCount = allAssets.filter(a => LIBRARY_CONFIG.document.types.includes(a.type)).length

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
                Smart Asset Management
              </h1>
              <p className="text-xs text-muted-foreground">
                Quản lý assets với tham chiếu tới kho lưu trữ bên ngoài
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Library Type Tabs */}
            <Tabs value={libraryType} onValueChange={(v) => setLibraryType(v as LibraryType)}>
              <TabsList className="h-9">
                <TabsTrigger value="media" className="gap-2 text-xs px-3">
                  <ImageIcon className="h-3.5 w-3.5" />
                  Media
                  <Badge variant="secondary" className="ml-1 text-[10px]">{mediaCount}</Badge>
                </TabsTrigger>
                <TabsTrigger value="document" className="gap-2 text-xs px-3">
                  <FileText className="h-3.5 w-3.5" />
                  Documents
                  <Badge variant="secondary" className="ml-1 text-[10px]">{documentCount}</Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Separator orientation="vertical" className="h-6" />

            {/* View Mode Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  {VIEW_CONFIG[viewMode].icon}
                  {VIEW_CONFIG[viewMode].label}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {Object.entries(VIEW_CONFIG).map(([mode, config]) => (
                  <DropdownMenuItem
                    key={mode}
                    onClick={() => setViewMode(mode as ViewMode)}
                    className="gap-2"
                  >
                    {config.icon}
                    {config.label}
                    {mode === viewMode && <Badge className="ml-auto text-xs">Active</Badge>}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Role Selector for Testing */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className={cn(
                  "gap-2",
                  userRole === 'admin' ? "border-red-500 text-red-700" :
                    userRole === 'ua_team' ? "border-purple-500 text-purple-700" :
                      "border-orange-500 text-orange-700"
                )}>
                  <UserCog className="h-4 w-4" />
                  {userRole === 'admin' ? 'Admin' : userRole === 'ua_team' ? 'UA Team' : 'Creative Team'}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setUserRole('creative_team')} className="gap-2">
                  🎨 Creative Team
                  {userRole === 'creative_team' && <Badge className="ml-auto text-xs">Active</Badge>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setUserRole('ua_team')} className="gap-2">
                  📊 UA Team
                  {userRole === 'ua_team' && <Badge className="ml-auto text-xs">Active</Badge>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setUserRole('admin')} className="gap-2">
                  🔧 Admin
                  {userRole === 'admin' && <Badge className="ml-auto text-xs">Active</Badge>}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button onClick={() => setUploadModalOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              {libraryType === 'media' ? 'Import từ Drive' : 'Thêm tài liệu'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Left: Resizable Filter Panel */}
        {!['dashboard', 'kanban'].includes(viewMode) && (
          <div
            className="flex-shrink-0 flex"
            style={{ width: filterWidth }}
          >
            <div className="flex-1 overflow-hidden">
              <FilterPanel
                filters={filters}
                onUpdateFilters={updateFilters}
                onResetFilters={resetFilters}
                onToggleType={toggleTypeFilter}
                onToggleCategory={toggleCategoryFilter}
                onToggleWorkflow={toggleWorkflowFilter}
                onToggleNetwork={toggleNetworkFilter}
                activeFilterCount={activeFilterCount}
                filterSettings={filterSettings}
                onSaveFilterSettings={saveFilterSettings}
                userRole={userRole}
              />
            </div>
            {/* Resize Handle */}
            <div
              className={cn(
                "w-1 cursor-col-resize hover:bg-blue-400 transition-colors flex items-center justify-center group",
                isResizingFilter ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-700"
              )}
              onMouseDown={handleFilterResize}
            >
              <GripVertical className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        )}

        {/* Center: Main View */}
        <div className="flex-1 overflow-hidden">
          {viewMode === 'grid' || viewMode === 'list' ? (
            <AssetGrid
              assets={libraryAssets}
              viewMode={viewMode}
              isLoading={isLoading}
              selectedId={selectedAsset?.id || null}
              onSelectAsset={handleSelectAsset}
              onDownload={handleDownload}
              sortBy={filters.sortBy}
              onSortChange={(sortBy: AssetFilters['sortBy']) => updateFilters({ sortBy })}
            />
          ) : viewMode === 'kanban' ? (
            <div className="h-full overflow-auto p-4">
              <KanbanBoard
                assetsByWorkflow={assetsByWorkflow}
                onMoveAsset={handleMoveAsset}
                onSelectAsset={handleSelectAsset}
                selectedId={selectedAsset?.id}
              />
            </div>
          ) : viewMode === 'timeline' ? (
            <div className="h-full overflow-auto">
              <TimelineView
                assets={libraryAssets}
                onSelectAsset={handleSelectAsset}
                selectedId={selectedAsset?.id}
              />
            </div>
          ) : viewMode === 'dashboard' ? (
            <div className="h-full overflow-auto">
              <PerformanceDashboard
                assets={allAssets}
                performanceStats={performanceStats}
                assetsByWorkflow={assetsByWorkflow}
              />
            </div>
          ) : null}
        </div>

        {/* Right: Asset Detail removed - now using popup */}
      </div>

      {/* Upload Modal */}
      <UploadModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        onUpload={handleUpload}
        onImportFromDrive={handleImportFromDrive}
      />

      {/* Asset Detail Popup */}
      <AssetDetail
        asset={selectedAsset}
        open={!!selectedAsset}
        onOpenChange={(open) => { if (!open) setSelectedAssetId(null) }}
        onDownload={() => selectedAsset && handleDownload(selectedAsset)}
        onDelete={() => selectedAsset && handleDelete(selectedAsset.id)}
        onUpdateUAStatus={(updates) => selectedAsset && updateUATestStatus(selectedAsset.id, updates)}
        onSetNetworkStatus={(network, rating) => selectedAsset && setNetworkStatus(selectedAsset.id, network, rating)}
        onUpdateDeployment={(status, reason) => selectedAsset && updateDeploymentStatus(selectedAsset.id, status, reason)}
        onUpdateLiveNetworks={(networks) => selectedAsset && updateLiveNetworks(selectedAsset.id, networks)}
        onUpdateDriveInfo={(driveUrl) => selectedAsset ? updateDriveInfo(selectedAsset.id, driveUrl) : Promise.resolve(false)}
        onRemoveDriveLink={() => selectedAsset && removeDriveLink(selectedAsset.id)}
        isUpdatingDrive={isLoading}
        userRole={userRole}
      />
    </div>
  )
}

