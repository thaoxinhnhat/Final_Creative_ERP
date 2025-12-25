// ============================================
// ASSET TYPES
// ============================================
export type AssetType = 'image' | 'video' | 'document' | 'template' | 'other'

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
  briefId?: string
  conceptId?: string  // NEW: Link to concept
  uploadedBy: string
  uploadedAt: string
  updatedAt: string
  status: AssetStatus
  downloads: number
  views: number
}

export interface AssetFilters {
  search: string
  types: AssetType[]
  categories: AssetCategory[]
  tags: string[]
  campaigns: string[]
  dateRange?: { from: string; to: string }
  sortBy: 'newest' | 'oldest' | 'name_asc' | 'name_desc' | 'size' | 'downloads'
}

export interface UploadAssetFormData {
  files: File[]
  category: AssetCategory
  description?: string
  tags: string[]
  campaignName?: string
  appName?: string
  briefId?: string
  conceptId?: string  // NEW: Link to concept
}

// ============================================
// CONFIG
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
  other: { label: "Other", icon: "📦" },
}
