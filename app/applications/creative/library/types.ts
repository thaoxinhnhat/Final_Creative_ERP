// ============================================
// ASSET TYPES - Extended for Smart Asset Management
// ============================================

// ============================================
// WORKFLOW & STAGE TYPES
// ============================================
export type WorkflowStage = 'brief' | 'review' | 'final' | 'test' | 'stopped'

export const WORKFLOW_STAGE_CONFIG: Record<WorkflowStage, {
  label: string
  icon: string
  color: string
  bgColor: string
  headerBg: string
  headerBorder: string
  order: number
}> = {
  brief: {
    label: "Brief",
    icon: "📋",
    color: "text-slate-700",
    bgColor: "bg-slate-50",
    headerBg: "bg-gradient-to-r from-slate-100 to-slate-50",
    headerBorder: "border-l-4 border-l-slate-400",
    order: 1
  },
  review: {
    label: "Nghiệm thu",
    icon: "👀",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    headerBg: "bg-gradient-to-r from-amber-100 to-amber-50",
    headerBorder: "border-l-4 border-l-amber-400",
    order: 2
  },
  final: {
    label: "Final",
    icon: "✅",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    headerBg: "bg-gradient-to-r from-emerald-100 to-emerald-50",
    headerBorder: "border-l-4 border-l-emerald-500",
    order: 3
  },
  test: {
    label: "Test",
    icon: "🧪",
    color: "text-sky-700",
    bgColor: "bg-sky-50",
    headerBg: "bg-gradient-to-r from-sky-100 to-sky-50",
    headerBorder: "border-l-4 border-l-sky-500",
    order: 4
  },
  stopped: {
    label: "Stop",
    icon: "⏹️",
    color: "text-rose-600",
    bgColor: "bg-rose-50",
    headerBg: "bg-gradient-to-r from-rose-100 to-rose-50",
    headerBorder: "border-l-4 border-l-rose-400",
    order: 5
  },
}

// ============================================
// AD NETWORKS & UA TESTING TYPES
// ============================================
export type AdNetwork = 'google' | 'meta' | 'mintegral' | 'axon' | 'unity' | 'tiktok' | 'apple_search_ads'

export const AD_NETWORK_CONFIG: Record<AdNetwork, {
  label: string
  shortLabel: string
  icon: string
  color: string
}> = {
  google: { label: "Google Ads", shortLabel: "Google", icon: "🔍", color: "bg-blue-500" },
  meta: { label: "Meta Ads", shortLabel: "Meta", icon: "📘", color: "bg-indigo-500" },
  mintegral: { label: "Mintegral", shortLabel: "Mint", icon: "📱", color: "bg-cyan-500" },
  axon: { label: "Axon (AppLovin)", shortLabel: "Axon", icon: "⚡", color: "bg-red-500" },
  unity: { label: "Unity Ads", shortLabel: "Unity", icon: "🎯", color: "bg-gray-700" },
  tiktok: { label: "TikTok Ads", shortLabel: "TikTok", icon: "🎵", color: "bg-pink-500" },
  apple_search_ads: { label: "Apple Search Ads", shortLabel: "ASA", icon: "🍎", color: "bg-gray-500" },
}

export const ALL_AD_NETWORKS: AdNetwork[] = ['google', 'meta', 'mintegral', 'axon', 'unity', 'tiktok', 'apple_search_ads']

export type PerformanceRating = 'good' | 'bad' | 'testing' | null

export const PERFORMANCE_RATING_CONFIG: Record<Exclude<PerformanceRating, null>, {
  label: string
  icon: string
  color: string
}> = {
  good: { label: "Good", icon: "✅", color: "text-green-600 bg-green-50" },
  bad: { label: "Bad", icon: "❌", color: "text-red-600 bg-red-50" },
  testing: { label: "Testing", icon: "🧪", color: "text-yellow-600 bg-yellow-50" },
}

export interface UATestStatus {
  isPlanned: boolean
  testedNetworks: AdNetwork[]
  performanceRating: Partial<Record<AdNetwork, PerformanceRating>>
}

// ============================================
// DEPLOYMENT TYPES
// ============================================
export type DeploymentStatus = 'draft' | 'testing' | 'live' | 'paused' | 'stopped'

export const DEPLOYMENT_STATUS_CONFIG: Record<DeploymentStatus, {
  label: string
  icon: string
  color: string
}> = {
  draft: { label: "Draft", icon: "📝", color: "text-gray-500 bg-gray-50" },
  testing: { label: "Testing", icon: "🧪", color: "text-yellow-600 bg-yellow-50" },
  live: { label: "Live", icon: "🟢", color: "text-green-600 bg-green-50" },
  paused: { label: "Paused", icon: "⏸️", color: "text-orange-600 bg-orange-50" },
  stopped: { label: "Stopped", icon: "⏹️", color: "text-red-600 bg-red-50" },
}

// ============================================
// TEAM TYPES (Teams that create products)
// ============================================
export type CreativeTeam = 'design' | 'ai_producer' | 'creative' | 'pion'

export const TEAM_CONFIG: Record<CreativeTeam, {
  label: string
  icon: string
  color: string
  description: string
}> = {
  design: { label: "Design", icon: "🎨", color: "bg-blue-100 text-blue-700", description: "Design Team" },
  ai_producer: { label: "AI Producer", icon: "🤖", color: "bg-purple-100 text-purple-700", description: "AI-generated content" },
  creative: { label: "Creative", icon: "💡", color: "bg-orange-100 text-orange-700", description: "Creative Team" },
  pion: { label: "Pion", icon: "🎮", color: "bg-green-100 text-green-700", description: "Pion Team" },
}

// ============================================
// GAME THEMES (Platforms như Cinema, Theater, Stadium...)
// ============================================
export type GameTheme = 'cinema' | 'theater' | 'stadium' | 'arena' | 'museum' | 'gallery' | 'park' | 'other'

export const GAME_THEME_CONFIG: Record<GameTheme, {
  label: string
  icon: string
  color: string
}> = {
  cinema: { label: "Cinema", icon: "🎬", color: "bg-red-100 text-red-700" },
  theater: { label: "Theater", icon: "🎭", color: "bg-purple-100 text-purple-700" },
  stadium: { label: "Stadium", icon: "🏟️", color: "bg-green-100 text-green-700" },
  arena: { label: "Arena", icon: "⚔️", color: "bg-orange-100 text-orange-700" },
  museum: { label: "Museum", icon: "🏛️", color: "bg-amber-100 text-amber-700" },
  gallery: { label: "Gallery", icon: "🖼️", color: "bg-blue-100 text-blue-700" },
  park: { label: "Park", icon: "🌳", color: "bg-emerald-100 text-emerald-700" },
  other: { label: "Other", icon: "📦", color: "bg-gray-100 text-gray-700" },
}

// ============================================
// ASSET TYPES (Extended)
// ============================================
export type AssetType = 'image' | 'video' | 'document' | 'template' | 'playable' | 'endcard' | 'other'

export type AssetCategory =
  | 'final_creative'
  | 'reference'
  | 'brand_asset'
  | 'template'
  | 'campaign_material'
  | 'raw_footage'

export type AssetStatus = 'active' | 'archived'

export interface Asset {
  id: string
  name: string
  type: AssetType
  category: AssetCategory
  fileUrl: string
  thumbnailUrl?: string
  fileSize: number
  fileExtension: string
  description?: string
  tags: string[]
  campaignName?: string
  appName?: string
  assetPlatform?: 'app' | 'game'  // Whether this asset belongs to App or Game
  briefId?: string
  briefName?: string  // Display name of the Brief this asset belongs to
  conceptId?: string
  uploadedBy: string
  uploadedAt: string
  updatedAt: string
  status: AssetStatus
  downloads: number
  views: number

  // ============================================
  // NEW: Google Drive Integration
  // ============================================
  driveUrl?: string
  driveFileId?: string

  // ============================================
  // NEW: Workflow Tracking
  // ============================================
  workflowStage: WorkflowStage
  currentOwner?: string
  taskIds?: string[]
  workflowHistory?: {
    stage: WorkflowStage
    changedAt: string
    changedBy: string
  }[]

  // ============================================
  // NEW: Smart Metadata (Parsed from filename)
  // ============================================
  parsedAssetId?: string  // SP01-GCVAI-ThuyBT-0006
  projectCode?: string    // SP01
  teamCode?: string       // GCVAI
  creatorCode?: string    // ThuyBT
  sequenceNumber?: string // 0006
  gameTheme?: GameTheme   // Cinema, Theater, Stadium (game themes)
  team?: CreativeTeam
  isCreativeAI?: boolean

  // ============================================
  // NEW: UA Testing
  // ============================================
  uaTestStatus?: UATestStatus

  // ============================================
  // NEW: Deployment
  // ============================================
  deploymentStatus?: DeploymentStatus
  liveNetworks?: AdNetwork[]
  stopReason?: string
  stoppedAt?: string

  // ============================================
  // NEW: External Links
  // ============================================
  youtubeUrl?: string
  playableUrl?: string
  endcardUrl?: string
  landingPageUrl?: string

  // ============================================
  // NEW: Production Team
  // ============================================
  productionTeam?: string

  // ============================================
  // NEW: Themes (separate from tags)
  // ============================================
  themes?: string[]

  // ============================================
  // NEW: Date Tracking with Metadata
  // ============================================
  uploadSource?: 'user_upload' | 'erp_report' | 'drive_import'
  uploadedByTeam?: string

  finalizedAt?: string
  finalizedBy?: string
  finalizedByTeam?: string

  liveAt?: string
}

// ============================================
// FILTER TYPES (Extended)
// ============================================
export interface AssetFilters {
  search: string
  types: AssetType[]
  categories: AssetCategory[]
  tags: string[]
  campaigns: string[]
  dateRange?: { from: string; to: string }
  sortBy: 'newest' | 'oldest' | 'name_asc' | 'name_desc' | 'size' | 'downloads' | 'performance'

  // NEW: Workflow filters
  workflowStages?: WorkflowStage[]
  teams?: CreativeTeam[]

  // NEW: UA Testing filters
  adNetworks?: AdNetwork[]
  performanceRatings?: PerformanceRating[]
  hasTestPlan?: boolean

  // NEW: Deployment filters
  deploymentStatuses?: DeploymentStatus[]

  // NEW: Custom filters (from settings)
  customFilters?: string[]
}

// ============================================
// UPLOAD FORM TYPES (Extended)
// ============================================
export interface UploadAssetFormData {
  files: File[]
  category: AssetCategory
  description?: string
  tags: string[]
  campaignName?: string
  appName?: string
  assetPlatform?: 'app' | 'game'
  briefId?: string
  conceptId?: string

  // NEW: Workflow
  workflowStage?: WorkflowStage
  team?: CreativeTeam

  // NEW: Production Team & Themes
  productionTeam?: string
  themes?: string[]
  youtubeUrl?: string

  // NEW: From Drive
  driveUrl?: string
  driveFileId?: string
}

// ============================================
// DRIVE IMPORT TYPES
// ============================================
export interface DriveFileInfo {
  id: string
  name: string
  mimeType: string
  size: number
  createdTime: string
  modifiedTime: string
  thumbnailLink?: string
  webViewLink: string
  webContentLink?: string
  iconLink?: string

  // Parsed from filename
  parsedAssetId?: string
  projectCode?: string
  teamCode?: string
  creatorCode?: string
  sequenceNumber?: string
}

// ============================================
// STATS TYPES
// ============================================
export interface AssetStats {
  total: number
  byType: Record<AssetType, number>
  byCategory: Record<AssetCategory, number>
  byWorkflowStage: Record<WorkflowStage, number>
  byTeam: Record<CreativeTeam, number>
  byDeploymentStatus: Record<DeploymentStatus, number>
  byNetwork: Record<AdNetwork, { total: number; good: number; bad: number; testing: number }>
}

// ============================================
// CONFIG (Backward compatible)
// ============================================
export const CATEGORY_CONFIG: Record<AssetCategory, { label: string; icon: string; color: string }> = {
  final_creative: { label: "Final Creative", icon: "✅", color: "bg-green-100 text-green-700 border-green-200" },
  reference: { label: "Reference", icon: "📚", color: "bg-blue-100 text-blue-700 border-blue-200" },
  brand_asset: { label: "Brand Asset", icon: "🎨", color: "bg-purple-100 text-purple-700 border-purple-200" },
  template: { label: "Template", icon: "📋", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  campaign_material: { label: "Campaign Material", icon: "📢", color: "bg-pink-100 text-pink-700 border-pink-200" },
  raw_footage: { label: "Raw Footage", icon: "🎬", color: "bg-orange-100 text-orange-700 border-orange-200" },
}

export const TYPE_CONFIG: Record<AssetType, { label: string; icon: string }> = {
  image: { label: "Images", icon: "🖼️" },
  video: { label: "Videos", icon: "🎬" },
  document: { label: "Documents", icon: "📄" },
  template: { label: "Templates", icon: "📋" },
  playable: { label: "Playables", icon: "🎮" },
  endcard: { label: "Endcards", icon: "🏷️" },
  other: { label: "Other", icon: "📦" },
}
