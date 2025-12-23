// ============================================
// TASK TYPES
// ============================================
export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low'

export type TaskStatus =
  | 'pending'
  | 'in_progress'
  | 'review'
  | 'completed'
  | 'overdue'

export type TaskType = 'brief' | 'concept' | 'asset' | 'review'

export type NotificationType =
  | 'deadline_reminder'
  | 'task_assigned'
  | 'feedback_received'
  | 'approval_needed'
  | 'status_changed'

// Notification priority for grouping
export type NotificationPriority = 'urgent' | 'attention' | 'fyi'

// ============================================
// ATTACHMENT & COMMENT TYPES
// ============================================
export interface Attachment {
  id: string
  name: string
  url: string
  type: 'file' | 'link' | 'reference'
  fileType?: string // e.g., 'pdf', 'psd', 'ai', 'sketch'
  size?: number
  uploadedBy: string
  uploadedAt: string
}

export interface Comment {
  id: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  createdAt: string
  versionId?: string // Which version this comment is about
  mentions?: string[] // User IDs that were mentioned
}

export interface Version {
  id: string
  versionNumber: number
  thumbnailUrl?: string
  fileUrl?: string
  createdBy: string
  createdByName: string
  createdAt: string
  approvedBy?: string
  approvedByName?: string
  approvedAt?: string
  status: 'draft' | 'submitted' | 'approved' | 'rejected'
  notes?: string
}

export interface Task {
  id: string
  briefId: string
  title: string
  type: TaskType
  status: TaskStatus
  priority: TaskPriority
  assignedTo: string[]
  assignedBy: string
  createdAt: string
  deadline: string
  startDate?: string
  completedAt?: string
  appName: string
  campaignName?: string
  description?: string
  progress: number
  estimatedHours?: number
  actualHours?: number
  // New creative workflow fields
  thumbnail?: string // URL to asset thumbnail
  format?: string // e.g., "Video 9:16", "Banner 1200x628"
  platform?: string // e.g., "Instagram Story", "Facebook Feed"
  attachments?: Attachment[]
  comments?: Comment[]
  versionHistory?: Version[]
  relatedTasks?: string[] // IDs of related tasks
}

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  taskId?: string
  userId: string
  isRead: boolean
  createdAt: string
  actionUrl?: string
  priority?: NotificationPriority // For grouping
}

export interface WorkloadSummary {
  userId: string
  userName: string
  avatar: string
  totalTasks: number
  byStatus: Record<TaskStatus, number>
  byPriority: Record<TaskPriority, number>
  utilizationRate: number
  overdueCount: number
}

export interface DeadlineFilters {
  search: string
  assignees: string[]
  status: TaskStatus[]
  priority: TaskPriority[]
  taskType: TaskType[]
  dateRange?: { from: string; to: string }
  apps: string[]
  view: 'list' | 'calendar' | 'workload'
}

// ============================================
// CONFIG
// ============================================
export const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; icon: string }> = {
  pending: { label: "Chờ xử lý", color: "bg-gray-100 text-gray-700 border-gray-200", icon: "⏳" },
  in_progress: { label: "Đang làm", color: "bg-blue-100 text-blue-700 border-blue-200", icon: "🔄" },
  review: { label: "Đang review", color: "bg-purple-100 text-purple-700 border-purple-200", icon: "👀" },
  completed: { label: "Hoàn thành", color: "bg-green-100 text-green-700 border-green-200", icon: "✅" },
  overdue: { label: "Quá hạn", color: "bg-red-100 text-red-700 border-red-200", icon: "⚠️" },
}

export const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string; icon: string; badgeClass: string }> = {
  urgent: { label: "Urgent", color: "bg-red-100 text-red-700 border-red-200", icon: "🔥", badgeClass: "bg-gradient-to-r from-red-500 to-rose-500 text-white border-0 shadow-sm" },
  high: { label: "High", color: "bg-orange-100 text-orange-700 border-orange-200", icon: "⬆️", badgeClass: "bg-gradient-to-r from-orange-400 to-amber-400 text-white border-0 shadow-sm" },
  medium: { label: "Medium", color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: "➡️", badgeClass: "bg-gradient-to-r from-yellow-400 to-lime-400 text-gray-800 border-0 shadow-sm" },
  low: { label: "Low", color: "bg-gray-100 text-gray-600 border-gray-200", icon: "⬇️", badgeClass: "bg-gradient-to-r from-gray-200 to-slate-200 text-gray-700 border-0" },
}

export const TYPE_CONFIG: Record<TaskType, { label: string; color: string; icon: string; badgeClass: string }> = {
  brief: { label: "Brief", color: "bg-pink-100 text-pink-700", icon: "📋", badgeClass: "bg-gradient-to-r from-pink-400 to-rose-400 text-white border-0 shadow-sm" },
  concept: { label: "Concept", color: "bg-purple-100 text-purple-700", icon: "💡", badgeClass: "bg-gradient-to-r from-purple-400 to-violet-400 text-white border-0 shadow-sm" },
  asset: { label: "Asset", color: "bg-blue-100 text-blue-700", icon: "🎨", badgeClass: "bg-gradient-to-r from-blue-400 to-cyan-400 text-white border-0 shadow-sm" },
  review: { label: "Review", color: "bg-green-100 text-green-700", icon: "👁️", badgeClass: "bg-gradient-to-r from-green-400 to-emerald-400 text-white border-0 shadow-sm" },
}

export const NOTIFICATION_CONFIG: Record<NotificationType, { label: string; icon: string; color: string; priority: NotificationPriority }> = {
  deadline_reminder: { label: "Nhắc deadline", icon: "⏰", color: "text-orange-600", priority: "attention" },
  task_assigned: { label: "Giao task mới", icon: "📥", color: "text-blue-600", priority: "fyi" },
  feedback_received: { label: "Nhận feedback", icon: "💬", color: "text-purple-600", priority: "fyi" },
  approval_needed: { label: "Cần duyệt", icon: "✋", color: "text-red-600", priority: "urgent" },
  status_changed: { label: "Đổi trạng thái", icon: "🔄", color: "text-green-600", priority: "fyi" },
}

export const NOTIFICATION_PRIORITY_CONFIG: Record<NotificationPriority, { label: string; color: string; bgColor: string; icon: string }> = {
  urgent: { label: "Cần action ngay", color: "text-red-700", bgColor: "bg-red-50 border-red-200", icon: "🔴" },
  attention: { label: "Sắp deadline", color: "text-amber-700", bgColor: "bg-amber-50 border-amber-200", icon: "🟡" },
  fyi: { label: "Thông tin", color: "text-gray-600", bgColor: "bg-gray-50 border-gray-200", icon: "⚪" },
}
