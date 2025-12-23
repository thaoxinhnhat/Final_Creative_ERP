import type { Task, Notification, WorkloadSummary, TaskStatus, TaskPriority, Attachment, Comment, Version } from "./types"

export const teamMembers = [
  { id: "1", name: "Nguyễn Văn An", avatar: "NA", role: "lead_creative" },
  { id: "2", name: "Trần Thị Bình", avatar: "TB", role: "creative" },
  { id: "3", name: "Lê Văn Cường", avatar: "LC", role: "creative" },
  { id: "4", name: "Phạm Thị Dung", avatar: "PD", role: "creative" },
  { id: "5", name: "Hoàng Minh Tuấn", avatar: "HT", role: "creative" },
]

export const apps = ["Fashion Show", "Puzzle Master", "Racing Game", "Meditation Pro"]

// Sample attachments
const sampleAttachments: Attachment[] = [
  { id: "att_001", name: "Brief_Tet2025.pdf", url: "#", type: "file", fileType: "pdf", size: 2500000, uploadedBy: "1", uploadedAt: "2025-12-01T09:00:00Z" },
  { id: "att_002", name: "Reference_Mood.zip", url: "#", type: "file", fileType: "zip", size: 15000000, uploadedBy: "1", uploadedAt: "2025-12-01T09:30:00Z" },
  { id: "att_003", name: "Brand Guidelines", url: "https://example.com/guidelines", type: "link", uploadedBy: "1", uploadedAt: "2025-12-01T10:00:00Z" },
]

// Sample comments
const sampleComments: Comment[] = [
  { id: "cmt_001", userId: "1", userName: "Nguyễn Văn An", userAvatar: "NA", content: "Các bạn chú ý màu sắc theo brand guideline nhé!", createdAt: "2025-12-19T09:00:00Z" },
  { id: "cmt_002", userId: "2", userName: "Trần Thị Bình", userAvatar: "TB", content: "Em đã update theo feedback, @NA anh review giúp em!", createdAt: "2025-12-20T14:30:00Z", mentions: ["1"] },
  { id: "cmt_003", userId: "1", userName: "Nguyễn Văn An", userAvatar: "NA", content: "Looks good! ✅ Approved.", createdAt: "2025-12-21T10:00:00Z" },
]

// Sample version history
const sampleVersions: Version[] = [
  { id: "v_001", versionNumber: 1, thumbnailUrl: "https://picsum.photos/seed/v1/400/300", createdBy: "2", createdByName: "Trần Thị Bình", createdAt: "2025-12-18T09:00:00Z", status: "rejected", notes: "Initial draft" },
  { id: "v_002", versionNumber: 2, thumbnailUrl: "https://picsum.photos/seed/v2/400/300", createdBy: "2", createdByName: "Trần Thị Bình", createdAt: "2025-12-20T14:00:00Z", status: "submitted", notes: "Incorporated feedback on colors" },
  { id: "v_003", versionNumber: 3, thumbnailUrl: "https://picsum.photos/seed/v3/400/300", createdBy: "2", createdByName: "Trần Thị Bình", createdAt: "2025-12-21T10:00:00Z", approvedBy: "1", approvedByName: "Nguyễn Văn An", approvedAt: "2025-12-21T11:00:00Z", status: "approved", notes: "Final approved version" },
]

export const mockTasks: Task[] = [
  // Dec 8 - 4 tasks
  { id: "task_001", briefId: "brief-001", title: "Banner Design", type: "asset", status: "overdue", priority: "urgent", assignedTo: ["2"], assignedBy: "1", createdAt: "2025-12-01T09:00:00Z", deadline: "2025-12-08T17:00:00Z", startDate: "2025-12-02T09:00:00Z", appName: "Puzzle Master", campaignName: "Tết 2025", description: "Banner cho Tết", progress: 75, estimatedHours: 8, actualHours: 10, thumbnail: "https://picsum.photos/seed/banner1/400/300", format: "Banner 1200x628", platform: "Facebook Feed", attachments: sampleAttachments, comments: sampleComments.slice(0, 2), relatedTasks: ["task_003"] },
  { id: "task_002", briefId: "brief-002", title: "App Icon Update", type: "asset", status: "pending", priority: "high", assignedTo: ["4"], assignedBy: "1", createdAt: "2025-12-03T09:00:00Z", deadline: "2025-12-08T17:00:00Z", startDate: "2025-12-04T09:00:00Z", appName: "Racing Game", description: "Update icon", progress: 60, estimatedHours: 4, actualHours: 6, thumbnail: "https://picsum.photos/seed/icon1/400/300", format: "Icon 1024x1024", platform: "App Store" },
  { id: "task_003", briefId: "brief-003", title: "Tết Banner Export", type: "asset", status: "in_progress", priority: "urgent", assignedTo: ["2", "3"], assignedBy: "1", createdAt: "2025-12-05T09:00:00Z", deadline: "2025-12-08T17:00:00Z", startDate: "2025-12-06T09:00:00Z", appName: "Puzzle Master", campaignName: "Tết 2025", description: "Export banner", progress: 80, estimatedHours: 3, actualHours: 2, thumbnail: "https://picsum.photos/seed/tet1/400/300", format: "Multi-size Export", relatedTasks: ["task_001"] },
  { id: "task_004", briefId: "brief-004", title: "Spring Video", type: "asset", status: "review", priority: "urgent", assignedTo: ["2"], assignedBy: "1", createdAt: "2025-12-07T09:00:00Z", deadline: "2025-12-08T17:00:00Z", startDate: "2025-12-07T09:00:00Z", appName: "Fashion Show", campaignName: "Spring Launch", description: "Video 15s", progress: 100, estimatedHours: 6, actualHours: 5, thumbnail: "https://picsum.photos/seed/spring1/400/300", format: "Video 9:16", platform: "Instagram Story", versionHistory: sampleVersions },

  // Dec 10 - 2 tasks
  { id: "task_005", briefId: "brief-005", title: "New Car Renders", type: "asset", status: "in_progress", priority: "high", assignedTo: ["4"], assignedBy: "1", createdAt: "2025-12-08T09:00:00Z", deadline: "2025-12-10T17:00:00Z", startDate: "2025-12-09T09:00:00Z", appName: "Racing Game", campaignName: "Spring Update", description: "Render xe mới", progress: 65, estimatedHours: 10, actualHours: 7, thumbnail: "https://picsum.photos/seed/car1/400/300", format: "3D Render 4K" },
  { id: "task_006", briefId: "brief-006", title: "Sunrise Visuals", type: "asset", status: "in_progress", priority: "high", assignedTo: ["3"], assignedBy: "1", createdAt: "2025-12-08T09:00:00Z", deadline: "2025-12-10T17:00:00Z", startDate: "2025-12-09T09:00:00Z", appName: "Meditation Pro", campaignName: "Q1 Refresh", description: "Visuals cho morning", progress: 50, estimatedHours: 8, actualHours: 4, thumbnail: "https://picsum.photos/seed/sunrise1/400/300", format: "Image Set 1920x1080" },

  // Dec 12 - 3 tasks
  { id: "task_007", briefId: "brief-007", title: "Holiday Ads Template", type: "concept", status: "pending", priority: "medium", assignedTo: ["2", "5"], assignedBy: "1", createdAt: "2025-12-09T09:00:00Z", deadline: "2025-12-12T17:00:00Z", appName: "Puzzle Master", campaignName: "Holiday 2025", description: "Template master", progress: 0, estimatedHours: 12, thumbnail: "https://picsum.photos/seed/holiday1/400/300", format: "Template PSD" },
  { id: "task_008", briefId: "brief-008", title: "Social Ads Concept", type: "concept", status: "in_progress", priority: "high", assignedTo: ["2", "5"], assignedBy: "1", createdAt: "2025-12-10T09:00:00Z", deadline: "2025-12-12T17:00:00Z", startDate: "2025-12-11T09:00:00Z", appName: "Fashion Show", campaignName: "New Year 2025", description: "Concept cho social ads", progress: 40, estimatedHours: 8, actualHours: 3, thumbnail: "https://picsum.photos/seed/social1/400/300", format: "Concept Deck" },
  { id: "task_009", briefId: "brief-009", title: "Tournament Promo", type: "asset", status: "pending", priority: "high", assignedTo: ["2", "3"], assignedBy: "1", createdAt: "2025-12-10T09:00:00Z", deadline: "2025-12-12T17:00:00Z", appName: "Racing Game", campaignName: "Holiday Special", description: "Video hype", progress: 0, estimatedHours: 16, thumbnail: "https://picsum.photos/seed/promo1/400/300", format: "Video 16:9", platform: "YouTube" },

  // Dec 15 - 4 tasks
  { id: "task_010", briefId: "brief-010", title: "Feature Banners", type: "asset", status: "pending", priority: "medium", assignedTo: ["4", "5"], assignedBy: "1", createdAt: "2025-12-12T09:00:00Z", deadline: "2025-12-15T17:00:00Z", appName: "Meditation Pro", campaignName: "Q1 Refresh", description: "Banners cho feature", progress: 0, estimatedHours: 6, thumbnail: "https://picsum.photos/seed/feature1/400/300", format: "Banner Set" },
  { id: "task_011", briefId: "brief-011", title: "Brain Training Assets", type: "asset", status: "pending", priority: "medium", assignedTo: ["3", "4"], assignedBy: "1", createdAt: "2025-12-13T09:00:00Z", deadline: "2025-12-15T17:00:00Z", appName: "Puzzle Master", campaignName: "Q1 Refresh", description: "Static ads", progress: 0, estimatedHours: 10, thumbnail: "https://picsum.photos/seed/brain1/400/300", format: "Static Ads" },
  { id: "task_012", briefId: "brief-012", title: "Car Pack Showcase", type: "asset", status: "pending", priority: "high", assignedTo: ["2", "5"], assignedBy: "1", createdAt: "2025-12-13T09:00:00Z", deadline: "2025-12-15T17:00:00Z", appName: "Racing Game", campaignName: "Summer 2025", description: "Video showcase", progress: 0, estimatedHours: 20, thumbnail: "https://picsum.photos/seed/carpack1/400/300", format: "Video 16:9", platform: "App Store" },
  { id: "task_013", briefId: "brief-013", title: "Video Ads Review", type: "review", status: "pending", priority: "medium", assignedTo: ["1"], assignedBy: "1", createdAt: "2025-12-13T09:00:00Z", deadline: "2025-12-15T17:00:00Z", appName: "Fashion Show", campaignName: "Summer 2025", description: "Review concepts", progress: 0, estimatedHours: 2 },

  // Dec 18 - 2 tasks
  { id: "task_014", briefId: "brief-014", title: "Social Ads Multiplayer", type: "asset", status: "in_progress", priority: "high", assignedTo: ["3", "5"], assignedBy: "1", createdAt: "2025-12-15T09:00:00Z", deadline: "2025-12-18T17:00:00Z", startDate: "2025-12-16T09:00:00Z", appName: "Puzzle Master", campaignName: "Summer 2025", description: "Ads multiplayer", progress: 55, estimatedHours: 12, actualHours: 6, thumbnail: "https://picsum.photos/seed/multi1/400/300", format: "Video 1:1", platform: "Facebook Feed" },
  { id: "task_015", briefId: "brief-015", title: "Workwear Lookbook", type: "asset", status: "in_progress", priority: "medium", assignedTo: ["2"], assignedBy: "1", createdAt: "2025-12-16T09:00:00Z", deadline: "2025-12-18T17:00:00Z", startDate: "2025-12-17T09:00:00Z", appName: "Fashion Show", campaignName: "Q1 Refresh", description: "Lookbook", progress: 35, estimatedHours: 8, actualHours: 3, thumbnail: "https://picsum.photos/seed/lookbook1/400/300", format: "PDF Lookbook" },

  // Dec 20 - 3 tasks
  { id: "task_016", briefId: "brief-016", title: "Kids Meditation Designs", type: "concept", status: "review", priority: "high", assignedTo: ["3", "5"], assignedBy: "1", createdAt: "2025-12-17T09:00:00Z", deadline: "2025-12-20T17:00:00Z", startDate: "2025-12-18T09:00:00Z", appName: "Meditation Pro", campaignName: "Holiday Special", description: "Character designs", progress: 100, estimatedHours: 10, actualHours: 9, thumbnail: "https://picsum.photos/seed/kids1/400/300", format: "Character Set", comments: sampleComments },
  { id: "task_017", briefId: "brief-017", title: "World Tour Visuals", type: "asset", status: "review", priority: "medium", assignedTo: ["2", "4"], assignedBy: "1", createdAt: "2025-12-18T09:00:00Z", deadline: "2025-12-20T17:00:00Z", startDate: "2025-12-19T09:00:00Z", appName: "Puzzle Master", campaignName: "Summer 2025", description: "Landmark visuals", progress: 100, estimatedHours: 8, actualHours: 7, thumbnail: "https://picsum.photos/seed/world1/400/300", format: "Image Set 4K" },
  { id: "task_018", briefId: "brief-018", title: "Neon Assets", type: "asset", status: "in_progress", priority: "high", assignedTo: ["4", "5"], assignedBy: "1", createdAt: "2025-12-19T09:00:00Z", deadline: "2025-12-20T17:00:00Z", startDate: "2025-12-19T09:00:00Z", appName: "Racing Game", campaignName: "Q1 Refresh", description: "Neon assets", progress: 45, estimatedHours: 14, actualHours: 6, thumbnail: "https://picsum.photos/seed/neon1/400/300", format: "Effect Pack" },

  // Dec 22 - 2 tasks
  { id: "task_019", briefId: "brief-019", title: "Meditation Promo 30s", type: "asset", status: "completed", priority: "medium", assignedTo: ["3"], assignedBy: "1", createdAt: "2025-12-10T09:00:00Z", deadline: "2025-12-22T17:00:00Z", startDate: "2025-12-11T09:00:00Z", completedAt: "2025-12-22T18:00:00Z", appName: "Meditation Pro", campaignName: "Wellness Month", description: "Video 30s", progress: 100, estimatedHours: 12, actualHours: 10, thumbnail: "https://picsum.photos/seed/med30/400/300", format: "Video 9:16", platform: "Instagram Story", versionHistory: sampleVersions, attachments: sampleAttachments.slice(0, 1) },
  { id: "task_020", briefId: "brief-020", title: "Meditation Promo 60s", type: "asset", status: "completed", priority: "medium", assignedTo: ["3"], assignedBy: "1", createdAt: "2025-12-10T09:00:00Z", deadline: "2025-12-22T17:00:00Z", startDate: "2025-12-11T09:00:00Z", completedAt: "2025-12-22T19:00:00Z", appName: "Meditation Pro", campaignName: "Wellness Month", description: "Video 60s", progress: 100, estimatedHours: 16, actualHours: 14, thumbnail: "https://picsum.photos/seed/med60/400/300", format: "Video 9:16", platform: "YouTube Pre-roll", relatedTasks: ["task_019"] },
]

// Utility function to add days to current date
function addDays(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

export const mockNotifications: Notification[] = [
  { id: "notif_001", type: "deadline_reminder", title: "Deadline hôm nay!", message: "Tết Banner - Final Export cần hoàn thành hôm nay", taskId: "task_003", userId: "2", isRead: false, createdAt: addDays(0), actionUrl: "/applications/creative/deadlines?task=task_003", priority: "attention" },
  { id: "notif_002", type: "deadline_reminder", title: "Deadline hôm nay!", message: "Spring Collection - Video 15s cần hoàn thành hôm nay", taskId: "task_004", userId: "2", isRead: false, createdAt: addDays(0), actionUrl: "/applications/creative/deadlines?task=task_004", priority: "attention" },
  { id: "notif_003", type: "task_assigned", title: "Task mới được giao", message: "Bạn được giao Holiday Static Ads - Template", taskId: "task_007", userId: "5", isRead: false, createdAt: addDays(0), actionUrl: "/applications/creative/deadlines?task=task_007", priority: "fyi" },
  { id: "notif_004", type: "approval_needed", title: "Cần review", message: "Kids Meditation - Character Designs đang chờ review", taskId: "task_016", userId: "1", isRead: false, createdAt: addDays(-1), actionUrl: "/applications/creative/deadlines?task=task_016", priority: "urgent" },
  { id: "notif_005", type: "feedback_received", title: "Feedback mới", message: "Nhận feedback cho App Icon - Motion Blur Effect", taskId: "task_002", userId: "4", isRead: true, createdAt: addDays(-2), actionUrl: "/applications/creative/deadlines?task=task_002", priority: "fyi" },
  { id: "notif_006", type: "status_changed", title: "Đổi trạng thái", message: "Meditation Promo Video 30s đã hoàn thành", taskId: "task_018", userId: "3", isRead: true, createdAt: addDays(-6), actionUrl: "/applications/creative/deadlines?task=task_018", priority: "fyi" },
  { id: "notif_007", type: "deadline_reminder", title: "Deadline ngày mai!", message: "Racing Game - New Car Renders deadline ngày mai", taskId: "task_005", userId: "4", isRead: false, createdAt: addDays(0), actionUrl: "/applications/creative/deadlines?task=task_005", priority: "attention" },
  { id: "notif_008", type: "deadline_reminder", title: "Deadline ngày mai!", message: "Morning Routine - Sunrise Visuals deadline ngày mai", taskId: "task_006", userId: "3", isRead: false, createdAt: addDays(0), actionUrl: "/applications/creative/deadlines?task=task_006", priority: "attention" },
  { id: "notif_009", type: "approval_needed", title: "Cần duyệt gấp!", message: "Banner Design quá hạn 14 ngày - cần action ngay", taskId: "task_001", userId: "1", isRead: false, createdAt: addDays(0), actionUrl: "/applications/creative/deadlines?task=task_001", priority: "urgent" },
  { id: "notif_010", type: "approval_needed", title: "Cần review", message: "World Tour Visuals đang chờ approval", taskId: "task_017", userId: "1", isRead: false, createdAt: addDays(-1), actionUrl: "/applications/creative/deadlines?task=task_017", priority: "urgent" },
]

export function calculateWorkloadSummary(): WorkloadSummary[] {
  return teamMembers.map(member => {
    const memberTasks = mockTasks.filter(t => t.assignedTo.includes(member.id))
    const byStatus: Record<TaskStatus, number> = { pending: 0, in_progress: 0, review: 0, completed: 0, overdue: 0 }
    const byPriority: Record<TaskPriority, number> = { urgent: 0, high: 0, medium: 0, low: 0 }
    memberTasks.forEach(task => { byStatus[task.status]++; byPriority[task.priority]++ })
    const activeTasks = memberTasks.filter(t => !['completed'].includes(t.status)).length
    const utilizationRate = Math.min(100, Math.round((activeTasks / 8) * 100))
    return { userId: member.id, userName: member.name, avatar: member.avatar, totalTasks: memberTasks.length, byStatus, byPriority, utilizationRate, overdueCount: byStatus.overdue }
  })
}

export const getTasksByDeadline = (tasks: Task[]) => {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1)
  const weekEnd = new Date(today); weekEnd.setDate(weekEnd.getDate() + 7)
  return {
    overdue: tasks.filter(t => new Date(t.deadline) < today && t.status !== 'completed'),
    today: tasks.filter(t => { const d = new Date(t.deadline); d.setHours(0, 0, 0, 0); return d.getTime() === today.getTime() && t.status !== 'completed' }),
    tomorrow: tasks.filter(t => { const d = new Date(t.deadline); d.setHours(0, 0, 0, 0); return d.getTime() === tomorrow.getTime() && t.status !== 'completed' }),
    thisWeek: tasks.filter(t => { const d = new Date(t.deadline); return d > tomorrow && d <= weekEnd && t.status !== 'completed' }),
    later: tasks.filter(t => new Date(t.deadline) > weekEnd && t.status !== 'completed'),
    completed: tasks.filter(t => t.status === 'completed'),
  }
}

export const getTaskStats = (tasks: Task[]) => {
  const grouped = getTasksByDeadline(tasks)
  return { total: tasks.length, overdue: grouped.overdue.length, dueToday: grouped.today.length, dueTomorrow: grouped.tomorrow.length, dueThisWeek: grouped.thisWeek.length, completed: grouped.completed.length, inProgress: tasks.filter(t => t.status === 'in_progress').length, inReview: tasks.filter(t => t.status === 'review').length }
}
