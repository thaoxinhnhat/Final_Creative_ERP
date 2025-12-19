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

export const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string; icon: string }> = {
  urgent: { label: "Urgent", color: "bg-red-100 text-red-700 border-red-200", icon: "🔥" },
  high: { label: "High", color: "bg-orange-100 text-orange-700 border-orange-200", icon: "⬆️" },
  medium: { label: "Medium", color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: "➡️" },
  low: { label: "Low", color: "bg-gray-100 text-gray-600 border-gray-200", icon: "⬇️" },
}

export const TYPE_CONFIG: Record<TaskType, { label: string; color: string; icon: string }> = {
  brief: { label: "Brief", color: "bg-pink-100 text-pink-700", icon: "📋" },
  concept: { label: "Concept", color: "bg-purple-100 text-purple-700", icon: "💡" },
  asset: { label: "Asset", color: "bg-blue-100 text-blue-700", icon: "🎨" },
  review: { label: "Review", color: "bg-green-100 text-green-700", icon: "👁️" },
}

export const NOTIFICATION_CONFIG: Record<NotificationType, { label: string; icon: string; color: string }> = {
  deadline_reminder: { label: "Nhắc deadline", icon: "⏰", color: "text-orange-600" },
  task_assigned: { label: "Giao task mới", icon: "📥", color: "text-blue-600" },
  feedback_received: { label: "Nhận feedback", icon: "💬", color: "text-purple-600" },
  approval_needed: { label: "Cần duyệt", icon: "✋", color: "text-red-600" },
  status_changed: { label: "Đổi trạng thái", icon: "🔄", color: "text-green-600" },
}
