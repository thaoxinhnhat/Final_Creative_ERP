"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Bell,
  X,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Mail,
  MessageSquare,
  Smartphone,
  SettingsIcon,
  ChevronRight,
  Moon,
  Calendar,
  FileText,
  ImageIcon,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

type NotificationPriority = "critical" | "urgent" | "important" | "informational"
type NotificationEventType =
  | "policy_rejection"
  | "publishing_error"
  | "approval_overdue"
  | "deadline_passed"
  | "approval_request"
  | "deadline_24h"
  | "asset_ready"
  | "deadline_3days"
  | "comment_mention"
  | "project_status_change"
  | "project_assigned"
  | "version_published"
  | "general_update"

type ChannelType = "email" | "slack" | "inApp"

interface NotificationRule {
  eventType: NotificationEventType
  priority: NotificationPriority
  channels: {
    email: boolean
    slack: boolean
    inApp: boolean
  }
  canDisable: boolean
  recommended: boolean
  description: string
}

interface ProjectRule {
  projectId: string
  projectName: string
  eventType: NotificationEventType
  channel: ChannelType
}

interface Notification {
  id: string
  type: "critical" | "warning" | "success" | "info"
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
  actionLabel?: string
}

interface NotificationDetail extends Notification {
  context?: {
    appName?: string
    projectName?: string
    version?: string
    market?: string
    assignedTo?: string
    approvedBy?: string
    [key: string]: string | undefined
  }
  mainContent?: {
    description: string
    beforeAfter?: { before: string; after: string }
    items?: string[]
    chart?: { label: string; value: number }[]
    previewImages?: string[]
  }
  actionRequired?: {
    recommendations: string[]
    primaryAction?: { label: string; url: string }
    secondaryActions?: { label: string; url: string }[]
  }
  fullDetailsUrl?: string
}

interface NotificationCenterProps {
  children?: React.ReactNode
}

export function NotificationCenter({ children }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "critical",
      title: "Critical Performance Alert",
      message: 'Keyword "meditation" dropped #3→#8 in US market',
      timestamp: "2h ago",
      read: false,
      actionUrl: "/applications/ab-testing",
      actionLabel: "View Details",
    },
    {
      id: "2",
      type: "warning",
      title: "Deadline Approaching",
      message: '"Winter Campaign" StoreKit due in 3 days',
      timestamp: "5h ago",
      read: false,
      actionUrl: "/applications/storekit",
      actionLabel: "View Project",
    },
    {
      id: "3",
      type: "success",
      title: "Metadata Approved",
      message: "Metadata v3.0 approved by Le Van C",
      timestamp: "1d ago",
      read: true,
      actionUrl: "/applications/metadata-tracking",
      actionLabel: "View Metadata",
    },
    {
      id: "4",
      type: "info",
      title: "Project Assigned",
      message: 'You\'re assigned to "Spring Refresh" project',
      timestamp: "2d ago",
      read: true,
      actionUrl: "/applications/aso-dashboard",
      actionLabel: "Open Project",
    },
    {
      id: "5",
      type: "warning",
      title: "Policy Violation Detected",
      message: "Metadata for Sleep App contains restricted keywords",
      timestamp: "3d ago",
      read: true,
      actionUrl: "/applications/metadata-tracking",
      actionLabel: "Fix Now",
    },
    {
      id: "6",
      type: "success",
      title: "Asset Approved",
      message: "Screenshot Set #5 approved for Meditation Pro",
      timestamp: "4d ago",
      read: true,
      actionUrl: "/applications/tasks-collab",
      actionLabel: "View Asset",
    },
  ])

  const [showSettings, setShowSettings] = useState(false)
  const [settingsTab, setSettingsTab] = useState<"channels" | "events">("channels")

  const [notificationRules, setNotificationRules] = useState<NotificationRule[]>([
    {
      eventType: "policy_rejection",
      priority: "critical",
      channels: { email: true, slack: true, inApp: true },
      canDisable: false,
      recommended: true,
      description: "Metadata vi phạm chính sách Store - cần xử lý ngay",
    },
    {
      eventType: "publishing_error",
      priority: "critical",
      channels: { email: true, slack: true, inApp: true },
      canDisable: false,
      recommended: true,
      description: "Lỗi khi publish app - cần can thiệp khẩn cấp",
    },
    {
      eventType: "approval_overdue",
      priority: "critical",
      channels: { email: true, slack: true, inApp: true },
      canDisable: false,
      recommended: true,
      description: "Yêu cầu duyệt quá hạn - ảnh hưởng timeline",
    },
    {
      eventType: "deadline_passed",
      priority: "critical",
      channels: { email: true, slack: true, inApp: true },
      canDisable: false,
      recommended: true,
      description: "Deadline đã qua - cần hành động ngay",
    },
    {
      eventType: "approval_request",
      priority: "urgent",
      channels: { email: true, slack: true, inApp: true },
      canDisable: true,
      recommended: true,
      description: "Có yêu cầu duyệt mới - nên xử lý trong ngày",
    },
    {
      eventType: "deadline_24h",
      priority: "urgent",
      channels: { email: true, slack: true, inApp: true },
      canDisable: true,
      recommended: true,
      description: "Deadline còn dưới 24h - cần ưu tiên",
    },
    {
      eventType: "asset_ready",
      priority: "urgent",
      channels: { email: true, slack: false, inApp: true },
      canDisable: true,
      recommended: true,
      description: "Asset mới sẵn sàng review - nên kiểm tra sớm",
    },
    {
      eventType: "deadline_3days",
      priority: "important",
      channels: { email: false, slack: true, inApp: true },
      canDisable: true,
      recommended: false,
      description: "Deadline còn 3 ngày - nên theo dõi",
    },
    {
      eventType: "comment_mention",
      priority: "important",
      channels: { email: false, slack: true, inApp: true },
      canDisable: true,
      recommended: false,
      description: "Có người tag bạn trong comment",
    },
    {
      eventType: "project_status_change",
      priority: "important",
      channels: { email: false, slack: false, inApp: true },
      canDisable: true,
      recommended: false,
      description: "Trạng thái project thay đổi",
    },
    {
      eventType: "project_assigned",
      priority: "informational",
      channels: { email: false, slack: false, inApp: true },
      canDisable: true,
      recommended: false,
      description: "Được gán vào project mới",
    },
    {
      eventType: "version_published",
      priority: "informational",
      channels: { email: false, slack: false, inApp: true },
      canDisable: true,
      recommended: false,
      description: "Phiên bản mới được publish thành công",
    },
    {
      eventType: "general_update",
      priority: "informational",
      channels: { email: false, slack: false, inApp: true },
      canDisable: true,
      recommended: false,
      description: "Cập nhật chung về project",
    },
  ])

  const [digestMode, setDigestMode] = useState({
    enabled: true,
    frequency: "daily", // "realtime" | "hourly" | "daily" | "weekly"
    time: "09:00",
    excludePriorities: ["critical", "urgent"] as NotificationPriority[],
  })

  const [quietHours, setQuietHours] = useState({
    enabled: true,
    startTime: "18:00",
    endTime: "09:00",
    channels: ["slack"] as ChannelType[],
    excludePriorities: ["critical"] as NotificationPriority[],
  })

  const [projectRules, setProjectRules] = useState<ProjectRule[]>([
    { projectId: "1", projectName: "Spring Campaign 2025", eventType: "asset_ready", channel: "slack" },
  ])

  const [initialNotificationRules, setInitialNotificationRules] = useState(notificationRules)
  const [initialDigestMode, setInitialDigestMode] = useState(digestMode)
  const [initialQuietHours, setInitialQuietHours] = useState(quietHours)
  const [initialProjectRules, setInitialProjectRules] = useState(projectRules)

  const [selectedNotification, setSelectedNotification] = useState<NotificationDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState<string | null>(null)

  const { toast } = useToast()

  const hasUnsavedChanges =
    JSON.stringify(notificationRules) !== JSON.stringify(initialNotificationRules) ||
    JSON.stringify(digestMode) !== JSON.stringify(initialDigestMode) ||
    JSON.stringify(quietHours) !== JSON.stringify(initialQuietHours) ||
    JSON.stringify(projectRules) !== JSON.stringify(initialProjectRules)

  const handleToggleSettings = () => {
    if (showSettings && hasUnsavedChanges) {
      const confirmed = window.confirm("Bạn có thay đổi chưa được lưu. Bạn có chắc chắn muốn đóng không?")
      if (!confirmed) {
        return
      }
      setNotificationRules(initialNotificationRules)
      setDigestMode(initialDigestMode)
      setQuietHours(initialQuietHours)
      setProjectRules(initialProjectRules)
    }
    setShowSettings(!showSettings)
  }

  const handleSaveSettings = () => {
    setInitialNotificationRules(notificationRules)
    setInitialDigestMode(digestMode)
    setInitialQuietHours(quietHours)
    setInitialProjectRules(projectRules)

    toast({
      title: "Đã lưu thành công",
      description: "Cài đặt thông báo của bạn đã được cập nhật.",
      duration: 3000,
    })
    setShowSettings(false)
  }

  const toggleChannel = (eventType: NotificationEventType, channel: ChannelType) => {
    setNotificationRules((rules) =>
      rules.map((rule) =>
        rule.eventType === eventType
          ? { ...rule, channels: { ...rule.channels, [channel]: !rule.channels[channel] } }
          : rule,
      ),
    )
  }

  const getPriorityBadge = (priority: NotificationPriority) => {
    const badges = {
      critical: { label: "Critical", className: "bg-red-500 hover:bg-red-600" },
      urgent: { label: "Urgent", className: "bg-orange-500 hover:bg-orange-600" },
      important: { label: "Important", className: "bg-blue-500 hover:bg-blue-600" },
      informational: { label: "Info", className: "bg-gray-500 hover:bg-gray-600" },
    }
    return badges[priority]
  }

  const getEventTypeName = (eventType: NotificationEventType) => {
    const names: Record<NotificationEventType, string> = {
      policy_rejection: "Policy Rejection",
      publishing_error: "Publishing Error",
      approval_overdue: "Approval Overdue",
      deadline_passed: "Deadline Passed",
      approval_request: "Approval Request",
      deadline_24h: "Deadline < 24h",
      asset_ready: "Asset Ready",
      deadline_3days: "Deadline < 3 days",
      comment_mention: "Comment/Mention",
      project_status_change: "Status Change",
      project_assigned: "Project Assigned",
      version_published: "Version Published",
      general_update: "General Update",
    }
    return names[eventType]
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const getIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "warning":
        return <Clock className="h-4 w-4 text-orange-600" />
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case "info":
        return <Info className="h-4 w-4 text-blue-600" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "critical":
        return "bg-red-50 border-red-200"
      case "warning":
        return "bg-orange-50 border-orange-200"
      case "success":
        return "bg-green-50 border-green-200"
      case "info":
        return "bg-blue-50 border-blue-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const showNotificationDetail = async (notification: Notification) => {
    setSelectedNotification(null)
    setDetailLoading(true)
    setDetailError(null)

    // Simulate API call to fetch full notification details
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock detailed data based on notification type
    const detailData: NotificationDetail = {
      ...notification,
      context: {
        appName: "Meditation Pro",
        projectName: "Winter Campaign 2024",
        version: "v3.2.1",
        market: "US App Store",
        assignedTo: "Nguyen Van A",
        approvedBy: notification.type === "success" ? "Le Van C" : undefined,
      },
      mainContent: {
        description:
          notification.type === "critical"
            ? 'Từ khóa "meditation" đã giảm từ vị trí #3 xuống #8 trong 24h qua. Điều này có thể ảnh hưởng đến traffic organics và cần được xem xét ngay lập tức.'
            : notification.type === "warning"
              ? 'Project "Winter Campaign" có deadline là 18/01/2025. Hiện tại còn 3 ngày và vẫn còn 5 tasks chưa hoàn thành.'
              : "Metadata version 3.0 đã được duyệt bởi Le Van C vào lúc 10:30 AM hôm nay. Tất cả changes đã được approve và sẵn sàng để publish.",
        beforeAfter:
          notification.type === "critical"
            ? {
                before: "Ranking #3 - 1,200 downloads/day",
                after: "Ranking #8 - 750 downloads/day",
              }
            : undefined,
        items:
          notification.type === "warning"
            ? [
                "Complete screenshot set #5",
                "Finalize app preview video",
                "Review metadata translations",
                "Test StoreKit configuration",
                "Submit for ASO review",
              ]
            : undefined,
        previewImages:
          notification.type === "success" ? ["/app-screenshot-meditation.jpg", "/app-icon-meditation.jpg"] : undefined,
      },
      actionRequired: {
        recommendations:
          notification.type === "critical"
            ? [
                "Kiểm tra competitors đã có thay đổi gì không",
                "Review keyword strategy cho từ khóa này",
                "Xem xét A/B test metadata mới",
                "Monitor ranking hàng ngày",
              ]
            : notification.type === "warning"
              ? [
                  "Ưu tiên hoàn thành tasks quan trọng nhất",
                  "Xem xét gia hạn deadline nếu cần",
                  "Assign thêm resources cho project",
                ]
              : ["Proceed với publishing lên Store", "Notify stakeholders về approval"],
        primaryAction: {
          label:
            notification.type === "critical"
              ? "View Keyword Analysis"
              : notification.type === "warning"
                ? "View Project Tasks"
                : "Publish to Store",
          url: notification.actionUrl || "#",
        },
        secondaryActions: [
          { label: "View History", url: "#" },
          { label: "Share with Team", url: "#" },
        ],
      },
      fullDetailsUrl: notification.actionUrl,
    }

    setDetailLoading(false)
    setSelectedNotification(detailData)
  }

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedNotification) {
        setSelectedNotification(null)
      }
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [selectedNotification])

  const toggleNotificationRead = (notification: NotificationDetail) => {
    setNotifications(notifications.map((n) => (n.id === notification.id ? { ...n, read: !n.read } : n)))
    if (selectedNotification?.id === notification.id) {
      setSelectedNotification({ ...notification, read: !notification.read })
    }
  }

  return (
    <>
      <DropdownMenu>
        {children && <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>}
        <DropdownMenuContent align="end" className="w-[500px] p-0">
          <div className="p-4 border-b flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Notifications</h3>
              <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all read
              </Button>
              <Button variant="ghost" size="sm" onClick={handleToggleSettings}>
                <SettingsIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {showSettings ? (
            <div className="h-[600px] flex flex-col">
              <Tabs
                value={settingsTab}
                onValueChange={(v) => setSettingsTab(v as any)}
                className="flex-1 flex flex-col"
              >
                <TabsList className="w-full grid grid-cols-2 mx-4 mt-2" style={{ width: "calc(100% - 2rem)" }}>
                  <TabsTrigger value="channels">By Channels</TabsTrigger>
                  <TabsTrigger value="events">By Event Type</TabsTrigger>
                </TabsList>

                <TabsContent value="channels" className="flex-1 overflow-hidden mt-0">
                  <div className="h-[480px] overflow-y-auto px-4 py-4 space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-blue-600" />
                          <h4 className="font-semibold text-sm">Smart Digest Mode</h4>
                        </div>
                        <Switch
                          checked={digestMode.enabled}
                          onCheckedChange={(checked) => setDigestMode({ ...digestMode, enabled: checked })}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Gom tất cả updates không urgent vào 1 email tổng hợp thay vì gửi từng email riêng lẻ
                      </p>

                      {digestMode.enabled && (
                        <div className="ml-6 space-y-2 bg-blue-50 p-3 rounded-lg">
                          <div>
                            <label className="text-xs font-medium">Tần suất gửi</label>
                            <select
                              className="w-full mt-1 p-2 border rounded text-xs"
                              value={digestMode.frequency}
                              onChange={(e) => setDigestMode({ ...digestMode, frequency: e.target.value })}
                            >
                              <option value="realtime">Realtime (không gom)</option>
                              <option value="hourly">Mỗi giờ</option>
                              <option value="daily">Mỗi ngày</option>
                              <option value="weekly">Mỗi tuần</option>
                            </select>
                          </div>
                          {digestMode.frequency !== "realtime" && (
                            <div>
                              <label className="text-xs font-medium">Thời gian gửi</label>
                              <input
                                type="time"
                                className="w-full mt-1 p-2 border rounded text-xs"
                                value={digestMode.time}
                                onChange={(e) => setDigestMode({ ...digestMode, time: e.target.value })}
                              />
                            </div>
                          )}
                          <div className="text-xs text-blue-700 bg-blue-100 p-2 rounded">
                            💡 Critical và Urgent vẫn gửi ngay lập tức
                          </div>
                        </div>
                      )}
                    </div>

                    <DropdownMenuSeparator />

                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Moon className="h-4 w-4 text-purple-600" />
                          <h4 className="font-semibold text-sm">Quiet Hours</h4>
                        </div>
                        <Switch
                          checked={quietHours.enabled}
                          onCheckedChange={(checked) => setQuietHours({ ...quietHours, enabled: checked })}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Tự động tắt Slack notifications ngoài giờ làm việc
                      </p>

                      {quietHours.enabled && (
                        <div className="ml-6 space-y-2 bg-purple-50 p-3 rounded-lg">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-xs font-medium">Bắt đầu</label>
                              <input
                                type="time"
                                className="w-full mt-1 p-2 border rounded text-xs"
                                value={quietHours.startTime}
                                onChange={(e) => setQuietHours({ ...quietHours, startTime: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium">Kết thúc</label>
                              <input
                                type="time"
                                className="w-full mt-1 p-2 border rounded text-xs"
                                value={quietHours.endTime}
                                onChange={(e) => setQuietHours({ ...quietHours, endTime: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="text-xs text-purple-700 bg-purple-100 p-2 rounded">
                            💡 Critical notifications vẫn gửi ngay cả trong Quiet Hours
                          </div>
                        </div>
                      )}
                    </div>

                    <DropdownMenuSeparator />

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <h4 className="font-semibold text-sm">Project-specific Rules</h4>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Thiết lập notification rules riêng cho từng project
                      </p>

                      <div className="space-y-2">
                        {projectRules.map((rule, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2 bg-green-50 rounded text-xs">
                            <ChevronRight className="h-3 w-3" />
                            <span className="flex-1">
                              <span className="font-medium">{rule.projectName}</span>:{" "}
                              {getEventTypeName(rule.eventType)}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {rule.channel}
                            </Badge>
                          </div>
                        ))}
                        <Button variant="outline" size="sm" className="w-full text-xs bg-transparent">
                          + Add Project Rule
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="events" className="flex-1 overflow-hidden mt-0">
                  <div className="h-[480px] overflow-y-auto px-4 py-4 space-y-4">
                    {["critical", "urgent", "important", "informational"].map((priority) => {
                      const rulesInPriority = notificationRules.filter((r) => r.priority === priority)
                      const badge = getPriorityBadge(priority as NotificationPriority)

                      return (
                        <div key={priority} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge className={`${badge.className} text-white`}>{badge.label}</Badge>
                            {priority === "critical" && (
                              <span className="text-xs text-muted-foreground">(Không thể tắt)</span>
                            )}
                          </div>

                          {rulesInPriority.map((rule) => (
                            <div key={rule.eventType} className="border rounded-lg p-3 space-y-2 bg-gray-50">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="font-medium text-sm flex items-center gap-2">
                                    {getEventTypeName(rule.eventType)}
                                    {rule.recommended && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                                      >
                                        Recommended
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1">{rule.description}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 pt-2 border-t">
                                <div className="flex items-center gap-2">
                                  <Mail className="h-3 w-3 text-gray-500" />
                                  <Switch
                                    checked={rule.channels.email}
                                    onCheckedChange={() => toggleChannel(rule.eventType, "email")}
                                    disabled={!rule.canDisable}
                                    className="scale-75"
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <MessageSquare className="h-3 w-3 text-gray-500" />
                                  <Switch
                                    checked={rule.channels.slack}
                                    onCheckedChange={() => toggleChannel(rule.eventType, "slack")}
                                    disabled={!rule.canDisable}
                                    className="scale-75"
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <Smartphone className="h-3 w-3 text-gray-500" />
                                  <Switch
                                    checked={rule.channels.inApp}
                                    onCheckedChange={() => toggleChannel(rule.eventType, "inApp")}
                                    disabled={!rule.canDisable}
                                    className="scale-75"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )
                    })}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="p-4 border-t">
                <Button className="w-full" onClick={handleSaveSettings} disabled={!hasUnsavedChanges}>
                  Save Settings
                </Button>
              </div>
            </div>
          ) : (
            <ScrollArea className="h-[600px]">
              <div className="p-2 space-y-2">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">No notifications</div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border ${getTypeColor(notification.type)} ${
                        !notification.read ? "font-medium" : "opacity-70"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">{getIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="text-sm font-semibold">{notification.title}</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-5 w-5 p-0"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-xs text-gray-700 mb-2">{notification.message}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                            <div className="flex gap-1">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 text-xs"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  Mark read
                                </Button>
                              )}
                              {notification.actionUrl && (
                                <Button
                                  size="sm"
                                  className="h-6 text-xs"
                                  onClick={() => {
                                    markAsRead(notification.id)
                                    showNotificationDetail(notification)
                                  }}
                                >
                                  {notification.actionLabel}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedNotification && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
            onClick={() => setSelectedNotification(null)}
          />

          {/* Detail Panel */}
          <div className="fixed top-0 right-0 h-full w-full md:w-[600px] bg-white shadow-2xl z-50 animate-in slide-in-from-right duration-300 flex flex-col">
            {detailLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">Loading details...</p>
                </div>
              </div>
            ) : detailError ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-6">
                  <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Error Loading Details</h3>
                  <p className="text-sm text-muted-foreground mb-4">{detailError}</p>
                  <Button onClick={() => setSelectedNotification(null)}>Close</Button>
                </div>
              </div>
            ) : (
              <>
                {/* Header - Sticky */}
                <div className="sticky top-0 bg-white border-b px-6 py-4 space-y-3 z-10">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div
                        className={`p-2 rounded-lg ${
                          selectedNotification.type === "critical"
                            ? "bg-red-100"
                            : selectedNotification.type === "warning"
                              ? "bg-orange-100"
                              : selectedNotification.type === "success"
                                ? "bg-green-100"
                                : "bg-blue-100"
                        }`}
                      >
                        {getIcon(selectedNotification.type)}
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl font-bold mb-1">{selectedNotification.title}</h2>
                        <p className="text-sm text-muted-foreground">
                          {new Date().toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => toggleNotificationRead(selectedNotification)}>
                        {selectedNotification.read ? (
                          <>
                            <Eye className="h-4 w-4 mr-1" /> Mark Unread
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-1" /> Mark Read
                          </>
                        )}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setSelectedNotification(null)}>
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Body - Scrollable */}
                <ScrollArea className="flex-1">
                  <div className="px-6 py-6 space-y-6">
                    {/* Context Information */}
                    {selectedNotification.context && (
                      <div className="space-y-3">
                        <h3 className="font-semibold flex items-center gap-2">
                          <Info className="h-4 w-4" />
                          Context Information
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-3">
                          {Object.entries(selectedNotification.context).map(([key, value]) =>
                            value ? (
                              <div key={key} className="space-y-1">
                                <p className="text-xs text-muted-foreground capitalize">
                                  {key.replace(/([A-Z])/g, " $1").trim()}
                                </p>
                                <p className="text-sm font-medium">{value}</p>
                              </div>
                            ) : null,
                          )}
                        </div>
                      </div>
                    )}

                    {/* Main Content */}
                    {selectedNotification.mainContent && (
                      <div className="space-y-4">
                        <h3 className="font-semibold flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Details
                        </h3>

                        <p className="text-sm leading-relaxed">{selectedNotification.mainContent.description}</p>

                        {/* Before/After Comparison */}
                        {selectedNotification.mainContent.beforeAfter && (
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                              <p className="text-xs text-red-600 font-medium mb-1">Before</p>
                              <p className="text-sm">{selectedNotification.mainContent.beforeAfter.before}</p>
                            </div>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                              <p className="text-xs text-green-600 font-medium mb-1">After</p>
                              <p className="text-sm">{selectedNotification.mainContent.beforeAfter.after}</p>
                            </div>
                          </div>
                        )}

                        {/* Items List */}
                        {selectedNotification.mainContent.items && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Pending Tasks:</p>
                            <ul className="space-y-2">
                              {selectedNotification.mainContent.items.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm">
                                  <div className="h-5 w-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-medium flex-shrink-0">
                                    {idx + 1}
                                  </div>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Preview Images */}
                        {selectedNotification.mainContent.previewImages && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium flex items-center gap-2">
                              <ImageIcon className="h-4 w-4" />
                              Asset Preview:
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                              {selectedNotification.mainContent.previewImages.map((img, idx) => (
                                <img
                                  key={idx}
                                  src={img || "/placeholder.svg"}
                                  alt={`Preview ${idx + 1}`}
                                  className="rounded-lg border w-full h-auto"
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Required */}
                    {selectedNotification.actionRequired && (
                      <div className="space-y-3">
                        <h3 className="font-semibold flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-orange-600" />
                          Action Required
                        </h3>
                        <div
                          className={`rounded-lg p-4 ${
                            selectedNotification.type === "critical"
                              ? "bg-red-50 border border-red-200"
                              : selectedNotification.type === "warning"
                                ? "bg-orange-50 border border-orange-200"
                                : "bg-blue-50 border border-blue-200"
                          }`}
                        >
                          <p className="text-sm font-medium mb-3">💡 Recommendations:</p>
                          <ul className="space-y-2">
                            {selectedNotification.actionRequired.recommendations.map((rec, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <ChevronRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Footer - Sticky */}
                <div className="sticky bottom-0 bg-white border-t px-6 py-4 space-y-3">
                  {selectedNotification.actionRequired?.primaryAction && (
                    <Button
                      className="w-full"
                      onClick={() => {
                        window.location.href = selectedNotification.actionRequired!.primaryAction!.url
                      }}
                    >
                      {selectedNotification.actionRequired.primaryAction.label}
                    </Button>
                  )}

                  <div className="flex gap-2">
                    {selectedNotification.actionRequired?.secondaryActions?.map((action, idx) => (
                      <Button
                        key={idx}
                        variant="ghost"
                        className="flex-1 text-sm"
                        onClick={() => (window.location.href = action.url)}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>

                  {selectedNotification.fullDetailsUrl && (
                    <a
                      href={selectedNotification.fullDetailsUrl}
                      className="block text-center text-sm text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      View Full Details →
                    </a>
                  )}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  )
}
