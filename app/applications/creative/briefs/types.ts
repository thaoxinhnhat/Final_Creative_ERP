// ============================================
// BRIEF INTERFACE
// ============================================
export interface Brief {
  id: string
  title: string
  appCampaign: string
  kpiTargets: {
    ctr: number
    cvr: number
    cpi: number
    roas: number
  }
  deadline: string
  region: string
  audience?: string
  platform: Platform
  formats?: string[]
  requirements: string
  status: BriefStatus
  priority: Priority
  assignedTo: string[]
  createdBy: string
  createdAt: string
  leadObjective?: string
  returnReason?: string  // Renamed from refundReason
  attachments: Attachment[]
  activityLog: ActivityLogEntry[]
  // Design workflow fields
  designRequest?: {
    requirements: string
    requestedAt: string
    requestedBy: string
  }
  designResponse?: {
    assets: Attachment[]
    feedback?: string
    respondedAt: string
    respondedBy: string
  }
  // Revision info (when Lead or UA returns brief)
  revisionInfo?: {
    reason: string
    requestedBy: "lead" | "ua"
    requestedAt: string
    requirements?: string
  }
  // NEW: Linked Concepts tracking
  linkedConcepts?: LinkedConceptSummary[]
  conceptCount?: number
  totalOrderCount?: number
  totalDeliverableCount?: number
}

// NEW: Summary of linked concept for Brief view
export interface LinkedConceptSummary {
  conceptId: string
  conceptTitle: string
  status: string  // Concept status
  uaApprovalStatus?: 'pending' | 'approved' | 'rejected'
  orderCount: number
  createdAt: string
  createdBy: string
}

// ============================================
// ENUMS & LITERAL TYPES
// ============================================
export type BriefStatus =
  | "draft"                 // Nháp - Creative tạo và save draft
  | "pending"               // Chờ nhận - UA gửi, Lead chưa xác nhận
  | "confirmed"             // Đã xác nhận - Lead nhận và phân công
  | "in_progress"           // Đang thực hiện - Member đang làm
  | "waiting_design"        // Chờ Design - Đã gửi yêu cầu thiết kế
  | "design_returned"       // Design trả về - Design từ chối, cần sửa
  | "design_done"           // Design Done - Design hoàn thành, chờ duyệt
  | "waiting_lead_review"   // Chờ Lead duyệt - Member gửi Lead duyệt
  | "waiting_ua_review"     // Chờ UA nghiệm thu - Lead ok, chờ UA
  | "need_revision"         // Cần chỉnh sửa - Lead/UA trả về
  | "completed"             // Hoàn thành - UA nghiệm thu xong
  | "returned_to_ua"        // Trả về UA - Creative từ chối/cần điều chỉnh

export type Priority = "low" | "medium" | "high"

export type Platform = "iOS" | "Android"

export type UserRole = "ua_team" | "lead_creative" | "creative"

// ============================================
// SUB-INTERFACES
// ============================================
export interface KpiTargets {
  ctr: number
  cvr: number
  cpi: number
  roas: number
}

export interface Attachment {
  id: string              // ADD THIS
  name: string
  url: string
  type: "image" | "video" | "pdf" | "zip"
  size: number
  uploadedAt: string
  uploadedBy: string
}

// Attachment type used in CreateBriefModal
export interface BriefAttachment {
  id: string
  name: string
  url: string
  type: "image" | "video" | "pdf" | "zip" | "file"
  size?: number
  source?: "upload" | "library"
  libraryAssetId?: string
}

export interface ActivityLogEntry {
  action: string
  by: string
  at: string
}

export interface TeamMember {
  id: string
  name: string
  avatar: string
  role: UserRole
}

// NEW: Library Asset interface
export interface LibraryAsset {
  id: string
  name: string
  url: string
  thumbnail: string
  type: 'image' | 'video' | 'pdf' | 'zip'
  size: number
  app?: string
  campaign?: string
  tags?: string[]
  createdAt: string
  createdBy: string
}

// ============================================
// FILTER OPTIONS
// ============================================
export interface FilterOptions {
  status: BriefStatus | "all"
  priority: Priority | "all"
  platform: Platform | "all"
  assignee: string | "all"
  dateRange: DateRangeOption
}

export type DateRangeOption =
  | "all"
  | "today"
  | "this_week"
  | "this_month"
  | "overdue"
  | "custom"

export interface StatusFilterOption {
  value: BriefStatus | "all"
  label: string
  color: string
}

export interface PriorityFilterOption {
  value: Priority | "all"
  label: string
  color: string
}

// ============================================
// FORM DATA TYPES
// ============================================
export interface ConfirmBriefFormData {
  action: "confirm" | "refund"
  leadObjective: string
  assignedTo: string[]
  priority: Priority
  refundReason: string
}

export interface UpdateBriefFormData {
  title?: string
  appCampaign?: string
  kpiTargets?: Partial<KpiTargets>
  deadline?: string
  region?: string
  platform?: Platform
  requirements?: string
  priority?: Priority
  assignedTo?: string[]
  leadObjective?: string
}

// ============================================
// API RESPONSE TYPES
// ============================================
export interface BriefListResponse {
  briefs: Brief[]
  total: number
  page: number
  pageSize: number
}

export interface BriefDetailResponse {
  brief: Brief
  relatedBriefs?: Brief[]
}

export interface BriefActionResponse {
  success: boolean
  message: string
  brief?: Brief
}

// ============================================
// STATS TYPES
// ============================================
export interface BriefStats {
  total: number
  draft: number
  pending: number
  confirmed: number
  inProgress: number
  waitingDesign: number
  designReturned: number
  designDone: number
  waitingLeadReview: number
  waitingUaReview: number
  needRevision: number
  completed: number
  returnedToUa: number
  overdue: number
}

export interface BriefsByStatus {
  draft: Brief[]
  pending: Brief[]
  confirmed: Brief[]
  in_progress: Brief[]
  waiting_design: Brief[]
  design_returned: Brief[]
  design_done: Brief[]
  waiting_lead_review: Brief[]
  waiting_ua_review: Brief[]
  need_revision: Brief[]
  completed: Brief[]
  returned_to_ua: Brief[]
}

// ============================================
// UI COMPONENT PROPS
// ============================================
export interface BriefCardProps {
  brief: Brief
  isSelected: boolean
  onClick: () => void
}

export interface BriefDetailProps {
  brief: Brief | null
  onApprove: () => void
  onReject: () => void
  onComplete: () => void
  onRequestFix: () => void
  onStartWork: () => void
}

export interface BriefSidebarProps {
  brief: Brief
  teamMembers: TeamMember[]
}

export interface CreateBriefModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateBriefFormData, isDraft: boolean) => void
}

export interface ConfirmBriefModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  brief: Brief | null
  onConfirm: (data: ConfirmBriefFormData) => void
  teamMembers: TeamMember[]
}

// ============================================
// STATUS & PRIORITY CONFIG TYPES
// ============================================
export interface StatusConfig {
  label: string
  color: string
  dotColor: string
  bgColor: string
  borderColor: string
}

export interface PriorityConfig {
  label: string
  color: string
  bgColor: string
}

export type StatusConfigMap = Record<BriefStatus, StatusConfig>

export type PriorityConfigMap = Record<Priority, PriorityConfig>

// ============================================
// CONSTANTS (exported as types for type-safety)
// ============================================
export const STATUS_OPTIONS: StatusFilterOption[] = [
  { value: "all", label: "Tất cả status", color: "gray" },
  // === Workflow Order ===
  // 1. Khởi tạo
  { value: "draft", label: "Nháp", color: "gray" },
  { value: "pending", label: "Chờ nhận", color: "yellow" },
  // 2. Đang thực hiện
  { value: "confirmed", label: "Đã xác nhận", color: "blue" },
  { value: "in_progress", label: "Đang thực hiện", color: "blue" },
  // 3. Design workflow
  { value: "waiting_design", label: "Chờ Design", color: "purple" },
  { value: "design_done", label: "Design Done", color: "cyan" },
  { value: "design_returned", label: "Design trả về", color: "orange" },
  // 4. Review workflow
  { value: "need_revision", label: "Cần chỉnh sửa", color: "orange" },
  { value: "waiting_lead_review", label: "Chờ Lead duyệt", color: "indigo" },
  { value: "waiting_ua_review", label: "Chờ UA nghiệm thu", color: "teal" },
  // 5. Kết thúc
  { value: "completed", label: "Hoàn thành", color: "green" },
  { value: "returned_to_ua", label: "Trả về UA", color: "red" },
]

export const PRIORITY_OPTIONS: PriorityFilterOption[] = [
  { value: "all", label: "Tất cả", color: "gray" },
  { value: "low", label: "Thấp", color: "gray" },
  { value: "medium", label: "Trung bình", color: "blue" },
  { value: "high", label: "Cao", color: "red" },
]

export const PLATFORM_OPTIONS: { value: Platform; label: string }[] = [
  { value: "iOS", label: "iOS" },
  { value: "Android", label: "Android" },
]

// Format options with descriptions
export const FORMAT_OPTIONS = [
  { value: "video_15s", label: "Video 15s" },
  { value: "video_30s", label: "Video 30s" },
  { value: "video_60s", label: "Video 60s" },
  { value: "static_1_1", label: "Static Banner 1:1" },
  { value: "static_9_16", label: "Static Banner 9:16" },
  { value: "static_16_9", label: "Static Banner 16:9" },
  { value: "app_icon", label: "App Icon" },
  { value: "screenshot", label: "Screenshot" },
] as const

// NEW: Format descriptions with specs, use cases, and tips
export const FORMAT_DESCRIPTIONS: Record<string, {
  spec: string
  useCases: string
  tips: string
}> = {
  video_15s: {
    spec: "1080x1920 (9:16) hoặc 1920x1080 (16:9), MP4/MOV, max 30MB",
    useCases: "TikTok, Instagram Reels, Facebook Stories, YouTube Shorts",
    tips: "Hook trong 3s đầu, CTA rõ ràng ở cuối. Tối ưu cho vertical viewing.",
  },
  video_30s: {
    spec: "1080x1920 (9:16) hoặc 1920x1080 (16:9), MP4/MOV, max 50MB",
    useCases: "Facebook/Instagram Feed, YouTube Pre-roll, Google UAC",
    tips: "Storytelling ngắn gọn, highlight 2-3 features chính. Có thể dùng voiceover.",
  },
  video_60s: {
    spec: "1080x1920 (9:16) hoặc 1920x1080 (16:9), MP4/MOV, max 100MB",
    useCases: "YouTube In-stream, Facebook Watch, App Store Preview",
    tips: "Phù hợp demo gameplay/features chi tiết. Chia thành segments rõ ràng.",
  },
  static_1_1: {
    spec: "1080x1080px, PNG/JPG, max 5MB",
    useCases: "Instagram Feed, Facebook Feed, Google Display Network",
    tips: "Design đơn giản, text ≤20% diện tích. Màu sắc nổi bật để scroll-stopping.",
  },
  static_9_16: {
    spec: "1080x1920px, PNG/JPG, max 5MB",
    useCases: "Instagram/Facebook Stories, TikTok Ads, Snapchat",
    tips: "Tận dụng full-screen vertical. Safe zone: tránh 150px top/bottom cho UI overlay.",
  },
  static_16_9: {
    spec: "1920x1080px, PNG/JPG, max 5MB",
    useCases: "YouTube Display, Google Discovery, Web banners",
    tips: "Landscape format cho desktop/tablet. Text lớn, dễ đọc từ xa.",
  },
  app_icon: {
    spec: "1024x1024px, PNG (no transparency cho iOS), max 1MB",
    useCases: "App Store, Google Play, Home screen icon",
    tips: "Đơn giản, recognizable ở size nhỏ (29x29). Tránh text, gradient quá phức tạp.",
  },
  screenshot: {
    spec: "iOS: 1290x2796 (6.7\"), Android: 1080x1920, PNG/JPG",
    useCases: "App Store listing, Google Play Store, ASO optimization",
    tips: "5-8 screenshots, highlight key features. Dùng text overlay và device frames.",
  },
}

// ============================================
// ORDER TYPES
// ============================================
export type OrderType = "simple" | "detailed"

export type SimpleOrderData = {
  objective: string          // Mục tiêu - Rich text
  requirements: string       // Yêu cầu chi tiết - Rich text with markdown
  formatRequirements: string // Định dạng yêu cầu
  references?: BriefAttachment[] // Tài liệu tham khảo
  notes?: string             // Ghi chú thêm
}

export type Scene = {
  id: string
  name: string              // Tên scene
  description: string       // Mô tả chi tiết scene
  actions?: string          // Action/Dialogue
  visualNotes?: string      // Visual notes
  soundNotes?: string       // Sound/Music notes
  duration?: string         // Thời lượng dự kiến
}

export type DetailedOrderData = {
  concept: string                 // Concept tổng quan
  mainContext: string            // Bối cảnh chính
  scenes: Scene[]                // Array of scenes
  visualReferences?: BriefAttachment[] // Visual references
  technicalRequirements?: string  // Technical specs
  specialNotes?: string          // Notes đặc biệt
}

// ============================================
// CREATE BRIEF FORM DATA (with Order Types)
// ============================================
export interface CreateBriefFormData {
  title: string
  appCampaign: string
  kpiTargets: {
    ctr: string
    cvr: string
    cpi: string
    roas: string
  }
  deadline: string
  region: string
  audience?: string
  platform: Platform
  formats: string[]
  requirements: string
  orderType: OrderType
  simpleOrder?: SimpleOrderData
  detailedOrder?: DetailedOrderData
}
