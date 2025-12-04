// ========== ĐỊNH DANH CHÍNH ==========

export type ProjectID = string
export type CampaignID = string
export type MetadataVersionID = string
export type StoreKitVersionID = string
export type AssetID = string
export type TaskID = string
export type MarketID = string
export type AppID = string
export type TrackingSessionID = string
export type AlertID = string
export type OrderID = string // Thêm OrderID để track StoreKit orders

// ========== ENTITIES ==========

export interface ASOProject {
  projectId: ProjectID
  appId: AppID
  appName: string
  scope: "Metadata" | "StoreKit" | "Both"
  marketIds: MarketID[]
  os: "iOS" | "Android" | "Both"
  status: string
  progress: number
  deadline: string
  lead: string
  team: string[]

  // Liên kết
  metadataVersionId?: MetadataVersionID
  storeKitVersionId?: StoreKitVersionID
  campaignId?: CampaignID
  trackingSessionIds: TrackingSessionID[]

  // Metadata
  createdAt: string
  updatedAt: string
  updatedBy: string
}

export interface MetadataVersion {
  metadataVersionId: MetadataVersionID
  projectId: ProjectID
  campaignId?: CampaignID

  // Nội dung
  title: string
  subtitle: string
  description: string
  keywords: string[]

  status: "Draft" | "Editing" | "Review" | "Approved" | "Published"
  publishDate?: string
  marketId: MarketID

  // Metadata
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface StoreKitOrder {
  orderId: OrderID
  storeKitVersionId: StoreKitVersionID
  projectId: ProjectID

  // Order info
  orderName: string
  assetType: "Icon" | "Screenshot" | "Banner" | "Video"
  status: "Brief" | "In Design" | "Need Fix" | "Review" | "Approved" | "Delivered"

  // Assets
  assetIds: AssetID[]

  // Progress
  progressPercentage: number // Auto-calculated based on status

  // Metadata
  createdAt: string
  updatedAt: string
}

export interface StoreKitVersion {
  storeKitVersionId: StoreKitVersionID
  projectId: ProjectID
  campaignId?: CampaignID

  orderIds: OrderID[]

  progressPercentage: number // Calculated from orders

  // Thông tin
  status: "Draft" | "In Design" | "Approved" | "Published"
  publishDate?: string
  marketIds: MarketID[]

  // Metadata
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface Asset {
  assetId: AssetID
  orderId: OrderID // Link to order instead of storekit directly
  storeKitVersionId: StoreKitVersionID
  taskId?: TaskID // Link to ERP

  // Thông tin
  type: "Icon" | "Screenshot" | "Banner" | "Video"
  url: string
  fileName: string
  status: "Brief" | "In Design" | "Need Fix" | "Review" | "Approved" | "Delivered"

  // Designer
  assignedTo?: string
  brief?: string
  deadline?: string

  // Metadata
  createdAt: string
  updatedAt: string
  version: number
}

export interface TrackingSession {
  trackingSessionId: TrackingSessionID
  projectId: ProjectID
  metadataVersionId?: MetadataVersionID
  storeKitVersionId?: StoreKitVersionID

  // Performance data
  downloads: number
  cvr: number
  ctr: number
  keywordRankings: Record<string, number>
  assetPerformance: Record<
    AssetID,
    {
      ctr: number
      impressions: number
      clicks: number
    }
  >

  // Alerts
  alertIds: AlertID[]

  // Period
  startDate: string
  endDate: string

  // Metadata
  createdAt: string
  updatedAt: string
}

export interface Alert {
  alertId: AlertID
  trackingSessionId: TrackingSessionID

  // Alert info
  type: "Critical" | "Warning" | "Positive"
  category: "Keyword" | "Asset" | "CVR" | "Feature"
  title: string
  description: string
  impact: string

  // Source - để link ngược
  sourceModule: "Metadata" | "StoreKit"
  sourceId: MetadataVersionID | StoreKitVersionID

  // Actions
  suggestedActions: string[]
  status: "New" | "Acknowledged" | "Resolved" | "Dismissed"

  // Metadata
  createdAt: string
  detectedAt: string
}

export interface AISuggestion {
  suggestionId: string
  trackingSessionId: TrackingSessionID

  // Suggestion info
  title: string
  description: string
  priority: "High" | "Medium" | "Low"
  impact: string

  // Action
  actionType: "Create Project" | "Update Metadata" | "Update StoreKit" | "Test"
  targetScope?: "Metadata" | "StoreKit" | "Both"

  // Status
  status: "Pending" | "Applied" | "Dismissed"
  appliedProjectId?: ProjectID

  // Metadata
  createdAt: string
  updatedAt: string
}

// ========== CAMPAIGN (scope = Both) ==========

export interface Campaign {
  campaignId: CampaignID
  projectId: ProjectID
  name: string

  // Linked versions
  metadataVersionIds: MetadataVersionID[]
  storeKitVersionIds: StoreKitVersionID[]

  // Info
  publishDate?: string
  status: "Planning" | "In Progress" | "Ready" | "Published"

  // Metadata
  createdAt: string
  updatedAt: string
}

// ========== SYNC EVENTS ==========

export type SyncEventType =
  | "PROJECT_CREATED"
  | "PROJECT_UPDATED"
  | "PROJECT_DELETED"
  | "METADATA_STATUS_CHANGED"
  | "METADATA_APPROVED"
  | "METADATA_PUBLISHED"
  | "STOREKIT_ORDER_STATUS_CHANGED"
  | "STOREKIT_APPROVED"
  | "STOREKIT_PUBLISHED"
  | "ASSET_STATUS_CHANGED"
  | "ASSET_APPROVED"
  | "ASSET_DELIVERED"
  | "TRACKING_DATA_UPDATED"
  | "ALERT_CREATED"
  | "SUGGESTION_CREATED"
  | "SUGGESTION_APPLIED"

export interface SyncEvent {
  eventId: string
  eventType: SyncEventType
  sourceModule: "Project" | "Metadata" | "StoreKit" | "Asset" | "Tracking" | "Reporting"
  targetModules: Array<"Project" | "Metadata" | "StoreKit" | "Asset" | "Tracking" | "Reporting">

  // Payload
  data: Record<string, any>

  // Related IDs
  projectId?: ProjectID
  metadataVersionId?: MetadataVersionID
  storeKitVersionId?: StoreKitVersionID
  orderId?: OrderID
  assetId?: AssetID

  // Metadata
  timestamp: string
  triggeredBy: string
}
