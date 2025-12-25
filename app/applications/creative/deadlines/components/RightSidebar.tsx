"use client"

import { useState, useMemo, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog"
import {
	Bell,
	CheckCircle,
	Clock,
	ExternalLink,
	AlertTriangle,
	CheckCircle2,
	MessageSquare,
	UserCheck,
	RefreshCw,
	X,
	Eye,
	Paperclip,
	Link2,
	FileText,
	History,
	ChevronDown,
	ChevronRight,
	Image as ImageIcon,
	Users,
	GitBranch
} from "lucide-react"
import type { Task, Notification, NotificationType, NotificationPriority } from "../types"
import { mockNotifications, teamMembers, mockTasks } from "../mockData"
import { NOTIFICATION_CONFIG, NOTIFICATION_PRIORITY_CONFIG, PRIORITY_CONFIG, TYPE_CONFIG } from "../types"
import { cn } from "@/lib/utils"

interface RightSidebarProps {
	selectedTask: Task | null
	activeTab?: 'task' | 'notifications'
	onTabChange?: (tab: 'task' | 'notifications') => void
}

export function RightSidebar({ selectedTask, activeTab: externalTab, onTabChange }: RightSidebarProps) {
	const [notifications, setNotifications] = useState(mockNotifications)
	const [activeTab, setActiveTab] = useState<string>(externalTab || "task")
	const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
		fyi: true // FYI section collapsed by default
	})
	// Popup state for notification task preview
	const [previewTask, setPreviewTask] = useState<Task | null>(null)
	const [previewNotification, setPreviewNotification] = useState<Notification | null>(null)
	const [showPreviewDialog, setShowPreviewDialog] = useState(false)

	// Sync with external tab prop
	useEffect(() => {
		if (externalTab) {
			setActiveTab(externalTab)
		}
	}, [externalTab])

	const unreadCount = notifications.filter(n => !n.isRead).length

	// Mark single notification as read
	const handleMarkAsRead = (notifId: string) => {
		setNotifications(prev =>
			prev.map(n => n.id === notifId ? { ...n, isRead: true } : n)
		)
	}

	// Mark all as read
	const handleMarkAllAsRead = () => {
		setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
	}

	// Delete notification
	const handleDeleteNotification = (notifId: string) => {
		setNotifications(prev => prev.filter(n => n.id !== notifId))
	}

	// Toggle section collapse
	const toggleSection = (section: string) => {
		setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }))
	}

	// Handle notification click - open popup instead of navigating
	const handleNotificationClick = (notif: Notification) => {
		// Find related task from mockTasks based on notification's taskId
		const relatedTask = notif.taskId
			? mockTasks.find(t => t.id === notif.taskId)
			: null

		if (relatedTask) {
			setPreviewTask(relatedTask)
			setPreviewNotification(notif)
			setShowPreviewDialog(true)
			// Mark as read when clicked
			handleMarkAsRead(notif.id)
		} else {
			// If no related task, just mark as read
			handleMarkAsRead(notif.id)
		}
	}

	// Close preview dialog
	const handleClosePreview = () => {
		setShowPreviewDialog(false)
		setPreviewTask(null)
		setPreviewNotification(null)
	}

	// Action handlers for different notification types
	const handleApprove = () => {
		// TODO: API call to approve task/deliverable
		alert('✅ Đã duyệt thành công!')
		handleClosePreview()
	}

	const handleReject = () => {
		// TODO: API call to reject with reason
		alert('❌ Đã từ chối')
		handleClosePreview()
	}

	const handleConfirmAssignment = () => {
		// TODO: API call to confirm task assignment
		alert('✅ Đã xác nhận nhận task!')
		handleClosePreview()
	}

	const handleReviewFeedback = () => {
		// Navigate to review page or open review modal
		window.location.href = `/applications/creative/deadlines?task=${previewTask?.id}&review=true`
	}

	// Group notifications by priority
	const groupedNotifications = useMemo(() => {
		const groups: Record<NotificationPriority, Notification[]> = {
			urgent: [],
			attention: [],
			fyi: []
		}

		notifications.forEach(notif => {
			const priority = notif.priority || NOTIFICATION_CONFIG[notif.type].priority
			groups[priority].push(notif)
		})

		// Sort each group by date (newest first)
		Object.keys(groups).forEach(key => {
			groups[key as NotificationPriority].sort((a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
			)
		})

		return groups
	}, [notifications])

	// Get icon for notification type
	const getNotificationIcon = (type: NotificationType) => {
		switch (type) {
			case 'deadline_reminder':
				return <Clock className="h-4 w-4 text-orange-500" />
			case 'task_assigned':
				return <UserCheck className="h-4 w-4 text-blue-500" />
			case 'feedback_received':
				return <MessageSquare className="h-4 w-4 text-purple-500" />
			case 'approval_needed':
				return <AlertTriangle className="h-4 w-4 text-red-500" />
			case 'status_changed':
				return <RefreshCw className="h-4 w-4 text-green-500" />
			default:
				return <Bell className="h-4 w-4" />
		}
	}

	// Calculate deadline status for selected task
	const getDeadlineStatus = (task: Task) => {
		const now = new Date()
		now.setHours(0, 0, 0, 0)
		const deadline = new Date(task.deadline)
		deadline.setHours(0, 0, 0, 0)
		const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

		if (task.status === 'completed') {
			return { label: 'Hoàn thành', color: 'text-green-600 bg-green-50', icon: CheckCircle2 }
		}
		if (diffDays < 0) {
			return { label: `Quá hạn ${Math.abs(diffDays)} ngày`, color: 'text-red-600 bg-red-50', icon: AlertTriangle }
		}
		if (diffDays === 0) {
			return { label: 'Hết hạn hôm nay', color: 'text-orange-600 bg-orange-50', icon: Clock }
		}
		if (diffDays === 1) {
			return { label: 'Hết hạn ngày mai', color: 'text-orange-600 bg-orange-50', icon: Clock }
		}
		return { label: `Còn ${diffDays} ngày`, color: 'text-blue-600 bg-blue-50', icon: Clock }
	}

	// Get assigned team members
	const getAssignees = (task: Task) => {
		return teamMembers.filter(m => task.assignedTo.includes(m.id))
	}

	// Get related tasks
	const getRelatedTasks = (task: Task) => {
		if (!task.relatedTasks?.length) return []
		return mockTasks.filter(t => task.relatedTasks?.includes(t.id))
	}

	// Render notification group
	const renderNotificationGroup = (priority: NotificationPriority, notifs: Notification[]) => {
		if (notifs.length === 0) return null

		const config = NOTIFICATION_PRIORITY_CONFIG[priority]
		const isCollapsed = collapsedSections[priority]
		const unreadInGroup = notifs.filter(n => !n.isRead).length

		return (
			<div key={priority} className={cn("mb-4 rounded-lg border", config.bgColor)}>
				{/* Group Header */}
				<button
					onClick={() => toggleSection(priority)}
					className="w-full p-3 flex items-center justify-between hover:bg-white/50 transition-colors rounded-t-lg"
				>
					<div className="flex items-center gap-2">
						<span className="text-lg">{config.icon}</span>
						<span className={cn("font-semibold", config.color)}>{config.label}</span>
						<Badge variant="secondary" className="h-5 px-1.5">
							{notifs.length}
						</Badge>
						{unreadInGroup > 0 && (
							<Badge variant="destructive" className="h-5 px-1.5">
								{unreadInGroup} mới
							</Badge>
						)}
					</div>
					{isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
				</button>

				{/* Notifications */}
				{!isCollapsed && (
					<div className="p-2 space-y-2">
						{notifs.map((notif) => (
							<div
								key={notif.id}
								className={cn(
									"p-3 rounded-lg border transition-all duration-200 group bg-white cursor-pointer hover:shadow-md hover:border-blue-300",
									!notif.isRead && "ring-1 ring-blue-200"
								)}
								onClick={() => handleNotificationClick(notif)}
							>
								<div className="flex items-start gap-3">
									<div className={cn(
										"p-2 rounded-full flex-shrink-0",
										!notif.isRead ? "bg-blue-50" : "bg-gray-100"
									)}>
										{getNotificationIcon(notif.type)}
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex items-start justify-between gap-2">
											<p className={cn(
												"text-sm",
												!notif.isRead && "font-semibold"
											)}>
												{notif.title}
											</p>
											<button
												onClick={(e) => { e.stopPropagation(); handleDeleteNotification(notif.id) }}
												className="opacity-0 group-hover:opacity-100 transition-opacity"
											>
												<X className="h-4 w-4 text-gray-400 hover:text-red-500" />
											</button>
										</div>
										<p className="text-xs text-muted-foreground mt-1">
											{notif.message}
										</p>
										<div className="flex items-center gap-2 mt-2">
											<p className="text-xs text-muted-foreground">
												{new Date(notif.createdAt).toLocaleString("vi-VN", {
													day: 'numeric',
													month: 'short',
													hour: '2-digit',
													minute: '2-digit'
												})}
											</p>
											{!notif.isRead && (
												<button
													onClick={(e) => { e.stopPropagation(); handleMarkAsRead(notif.id) }}
													className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
												>
													<CheckCircle className="h-3 w-3" />
													Đánh dấu đã đọc
												</button>
											)}
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		)
	}

	return (
		<div className="w-full h-full bg-white overflow-hidden flex flex-col">
			<Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
				<TabsList className="w-full grid grid-cols-2 p-1 bg-gray-100 flex-shrink-0">
					<TabsTrigger value="task" className="data-[state=active]:bg-white">
						Chi tiết Task
					</TabsTrigger>
					<TabsTrigger value="notifications" className="data-[state=active]:bg-white relative">
						<Bell className="h-4 w-4 mr-1" />
						Thông báo
						{unreadCount > 0 && (
							<Badge variant="destructive" className="ml-1 h-5 min-w-[20px] px-1">
								{unreadCount}
							</Badge>
						)}
					</TabsTrigger>
				</TabsList>

				{/* Task Detail Tab */}
				<TabsContent value="task" className="flex-1 overflow-y-auto p-4 m-0 min-h-0">
					{selectedTask ? (
						<div className="space-y-4">
							{/* Thumbnail Preview */}
							{selectedTask.thumbnail && (
								<div className="relative rounded-lg overflow-hidden border">
									<img
										src={selectedTask.thumbnail}
										alt={selectedTask.title}
										className="w-full h-40 object-cover"
									/>
									{selectedTask.format && (
										<span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
											{selectedTask.format}
										</span>
									)}
									{selectedTask.platform && (
										<span className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
											📱 {selectedTask.platform}
										</span>
									)}
								</div>
							)}

							{/* Task Title & Status */}
							<div>
								<h3 className="font-bold text-lg mb-2 leading-tight">
									{selectedTask.title}
								</h3>
								<div className="flex flex-wrap gap-2">
									<Badge className={cn(TYPE_CONFIG[selectedTask.type].badgeClass)}>
										{TYPE_CONFIG[selectedTask.type].icon} {TYPE_CONFIG[selectedTask.type].label}
									</Badge>
									<Badge className={cn(PRIORITY_CONFIG[selectedTask.priority].badgeClass)}>
										{PRIORITY_CONFIG[selectedTask.priority].icon} {PRIORITY_CONFIG[selectedTask.priority].label}
									</Badge>
								</div>
							</div>

							{/* Deadline Status */}
							{(() => {
								const status = getDeadlineStatus(selectedTask)
								return (
									<div className={cn(
										"p-3 rounded-lg border flex items-center gap-2",
										status.color
									)}>
										<status.icon className="h-5 w-5" />
										<span className="font-medium">{status.label}</span>
									</div>
								)
							})()}

							<Separator />

							{/* Details */}
							<div className="space-y-3 text-sm">
								<div>
									<Label className="text-xs text-muted-foreground">APP</Label>
									<p className="font-medium">{selectedTask.appName}</p>
								</div>

								{selectedTask.campaignName && (
									<div>
										<Label className="text-xs text-muted-foreground">CAMPAIGN</Label>
										<p className="font-medium">{selectedTask.campaignName}</p>
									</div>
								)}

								{/* NEW: Source Section (Brief/Order Integration) */}
								{selectedTask.source && selectedTask.source !== 'standalone' && (
									<div className="p-3 rounded-lg bg-gray-50 border">
										<Label className="text-xs text-muted-foreground mb-2 block">NGUỒN</Label>
										<div className="space-y-2">
											{/* Source Badge */}
											<div className="flex items-center gap-2">
												<Badge className={cn(
													"text-xs px-2 py-1",
													selectedTask.source === 'brief'
														? "bg-pink-100 text-pink-700 border-pink-200"
														: "bg-cyan-100 text-cyan-700 border-cyan-200"
												)}>
													{selectedTask.source === 'brief' ? '📄 Brief' : '📦 Order'}
												</Badge>
												{/* Team Badge (for Orders) */}
												{selectedTask.source === 'order' && selectedTask.teamType && (
													<Badge className={cn(
														"text-xs px-2 py-1",
														selectedTask.teamType === 'design' ? "bg-purple-100 text-purple-700" :
															selectedTask.teamType === 'art_stylist' ? "bg-pink-100 text-pink-700" :
																"bg-cyan-100 text-cyan-700"
													)}>
														{selectedTask.teamType === 'design' ? '🎨 Design' :
															selectedTask.teamType === 'art_stylist' ? '📸 Art & Stylist' : '✨ AI Producer'}
													</Badge>
												)}
											</div>

											{/* Linked Brief */}
											{selectedTask.linkedBriefTitle && (
												<div className="flex items-center gap-2 text-sm">
													<FileText className="h-4 w-4 text-pink-500" />
													<a
														href={`/applications/creative/briefs?id=${selectedTask.briefId}`}
														className="text-pink-600 hover:underline font-medium"
													>
														{selectedTask.linkedBriefTitle}
													</a>
												</div>
											)}

											{/* Linked Concept (for Orders) */}
											{selectedTask.linkedConceptTitle && (
												<div className="flex items-center gap-2 text-sm">
													<GitBranch className="h-4 w-4 text-cyan-500" />
													<a
														href={`/applications/creative/concepts?id=${selectedTask.conceptId}`}
														className="text-cyan-600 hover:underline font-medium"
													>
														{selectedTask.linkedConceptTitle}
													</a>
												</div>
											)}

											{/* Source Status */}
											{(selectedTask.briefStatus || selectedTask.orderStatus) && (
												<div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200">
													<span className="text-xs text-gray-500">Status:</span>
													{selectedTask.source === 'brief' && selectedTask.briefStatus && (
														<Badge variant="outline" className="text-xs">
															{selectedTask.briefStatus}
														</Badge>
													)}
													{selectedTask.source === 'order' && selectedTask.orderStatus && (
														<Badge variant="outline" className={cn(
															"text-xs",
															selectedTask.orderStatus === 'completed' ? "border-green-300 text-green-700" :
																selectedTask.orderStatus === 'in_progress' ? "border-yellow-300 text-yellow-700" :
																	selectedTask.orderStatus === 'returned' ? "border-red-300 text-red-700" :
																		"border-gray-300"
														)}>
															{selectedTask.orderStatus}
														</Badge>
													)}
												</div>
											)}
										</div>
									</div>
								)}

								<div>
									<Label className="text-xs text-muted-foreground">DEADLINE</Label>
									<p className="font-medium flex items-center gap-1">
										<Clock className="h-4 w-4" />
										{new Date(selectedTask.deadline).toLocaleDateString("vi-VN", {
											weekday: 'long',
											day: 'numeric',
											month: 'long',
											year: 'numeric'
										})}
									</p>
								</div>

								{/* Assignees */}
								<div>
									<Label className="text-xs text-muted-foreground">ĐƯỢC GIAO CHO</Label>
									<div className="flex flex-wrap gap-2 mt-1">
										{getAssignees(selectedTask).map(member => (
											<div key={member.id} className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1">
												<Avatar className="h-6 w-6">
													<AvatarFallback className="bg-purple-100 text-purple-700 text-xs">
														{member.avatar}
													</AvatarFallback>
												</Avatar>
												<span className="text-sm">{member.name}</span>
											</div>
										))}
									</div>
								</div>

								{/* Progress */}
								{selectedTask.progress > 0 && (
									<div>
										<div className="flex items-center justify-between mb-2">
											<Label className="text-xs text-muted-foreground">TIẾN ĐỘ</Label>
											<span className="text-sm font-bold">
												{selectedTask.progress}%
											</span>
										</div>
										<Progress
											value={selectedTask.progress}
											className={cn(
												"h-2",
												selectedTask.progress === 100 && "[&>div]:bg-green-500",
												selectedTask.progress >= 50 && selectedTask.progress < 100 && "[&>div]:bg-blue-500",
												selectedTask.progress < 50 && "[&>div]:bg-orange-500",
											)}
										/>
									</div>
								)}

								{/* Description */}
								{selectedTask.description && (
									<div>
										<Label className="text-xs text-muted-foreground">MÔ TẢ</Label>
										<p className="mt-1 text-gray-600">{selectedTask.description}</p>
									</div>
								)}
							</div>

							<Separator />

							{/* 📎 Attachments Section */}
							<div>
								<div className="flex items-center gap-2 mb-2">
									<Paperclip className="h-4 w-4 text-gray-500" />
									<Label className="text-xs text-muted-foreground font-semibold">ATTACHMENTS</Label>
									{selectedTask.attachments && (
										<Badge variant="secondary" className="h-5 px-1.5">
											{selectedTask.attachments.length}
										</Badge>
									)}
								</div>
								{selectedTask.attachments && selectedTask.attachments.length > 0 ? (
									<div className="space-y-2">
										{selectedTask.attachments.map(att => (
											<div key={att.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
												{att.type === 'link' ? (
													<Link2 className="h-4 w-4 text-blue-500" />
												) : (
													<FileText className="h-4 w-4 text-gray-500" />
												)}
												<span className="text-sm flex-1 truncate">{att.name}</span>
												{att.size && (
													<span className="text-xs text-gray-400">
														{(att.size / 1024 / 1024).toFixed(1)}MB
													</span>
												)}
											</div>
										))}
									</div>
								) : (
									<p className="text-xs text-gray-400">Không có file đính kèm</p>
								)}
							</div>

							<Separator />

							{/* 💬 Comments Section */}
							<div>
								<div className="flex items-center gap-2 mb-2">
									<MessageSquare className="h-4 w-4 text-gray-500" />
									<Label className="text-xs text-muted-foreground font-semibold">COMMENTS</Label>
									{selectedTask.comments && (
										<Badge variant="secondary" className="h-5 px-1.5">
											{selectedTask.comments.length}
										</Badge>
									)}
								</div>
								{selectedTask.comments && selectedTask.comments.length > 0 ? (
									<div className="space-y-3">
										{selectedTask.comments.slice(0, 3).map(comment => (
											<div key={comment.id} className="p-2 bg-gray-50 rounded-lg">
												<div className="flex items-center gap-2 mb-1">
													<Avatar className="h-5 w-5">
														<AvatarFallback className="bg-blue-100 text-blue-700 text-[10px]">
															{comment.userAvatar}
														</AvatarFallback>
													</Avatar>
													<span className="text-xs font-medium">{comment.userName}</span>
													<span className="text-xs text-gray-400">
														{new Date(comment.createdAt).toLocaleDateString('vi-VN')}
													</span>
												</div>
												<p className="text-sm text-gray-600">{comment.content}</p>
											</div>
										))}
										{selectedTask.comments.length > 3 && (
											<Button variant="ghost" size="sm" className="w-full text-xs">
												Xem thêm {selectedTask.comments.length - 3} comments
											</Button>
										)}
									</div>
								) : (
									<p className="text-xs text-gray-400">Chưa có comment</p>
								)}
							</div>

							<Separator />

							{/* 📋 Version History Section */}
							<div>
								<div className="flex items-center gap-2 mb-2">
									<History className="h-4 w-4 text-gray-500" />
									<Label className="text-xs text-muted-foreground font-semibold">VERSION HISTORY</Label>
									{selectedTask.versionHistory && (
										<Badge variant="secondary" className="h-5 px-1.5">
											{selectedTask.versionHistory.length}
										</Badge>
									)}
								</div>
								{selectedTask.versionHistory && selectedTask.versionHistory.length > 0 ? (
									<div className="space-y-2">
										{selectedTask.versionHistory.slice().reverse().map((version, idx) => (
											<div key={version.id} className={cn(
												"flex items-start gap-2 p-2 rounded-lg border",
												version.status === 'approved' && "bg-green-50 border-green-200",
												version.status === 'rejected' && "bg-red-50 border-red-200",
												version.status === 'submitted' && "bg-blue-50 border-blue-200"
											)}>
												<div className="flex flex-col items-center">
													<div className={cn(
														"w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
														version.status === 'approved' && "bg-green-500 text-white",
														version.status === 'rejected' && "bg-red-500 text-white",
														version.status === 'submitted' && "bg-blue-500 text-white",
														version.status === 'draft' && "bg-gray-400 text-white"
													)}>
														v{version.versionNumber}
													</div>
													{idx < selectedTask.versionHistory!.length - 1 && (
														<div className="w-0.5 h-4 bg-gray-200 mt-1" />
													)}
												</div>
												<div className="flex-1 min-w-0">
													<div className="flex items-center gap-2">
														<span className="text-sm font-medium truncate">{version.notes || `Version ${version.versionNumber}`}</span>
														{version.status === 'approved' && <CheckCircle2 className="h-3 w-3 text-green-600" />}
													</div>
													<p className="text-xs text-gray-500">
														{version.createdByName} · {new Date(version.createdAt).toLocaleDateString('vi-VN')}
													</p>
													{version.approvedByName && (
														<p className="text-xs text-green-600">
															✓ Approved by {version.approvedByName}
														</p>
													)}
												</div>
												{version.thumbnailUrl && (
													<img
														src={version.thumbnailUrl}
														alt={`v${version.versionNumber}`}
														className="w-12 h-12 rounded object-cover"
													/>
												)}
											</div>
										))}
									</div>
								) : (
									<p className="text-xs text-gray-400">Chưa có version history</p>
								)}
							</div>

							<Separator />

							{/* 🔗 Related Tasks Section */}
							<div>
								<div className="flex items-center gap-2 mb-2">
									<GitBranch className="h-4 w-4 text-gray-500" />
									<Label className="text-xs text-muted-foreground font-semibold">RELATED TASKS</Label>
								</div>
								{selectedTask.relatedTasks && selectedTask.relatedTasks.length > 0 ? (
									<div className="space-y-2">
										{getRelatedTasks(selectedTask).map(task => (
											<div key={task.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
												{task.thumbnail ? (
													<img src={task.thumbnail} alt={task.title} className="w-8 h-8 rounded object-cover" />
												) : (
													<div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center">
														<ImageIcon className="h-4 w-4 text-gray-400" />
													</div>
												)}
												<div className="flex-1 min-w-0">
													<p className="text-sm font-medium truncate">{task.title}</p>
													<p className="text-xs text-gray-500">{task.appName}</p>
												</div>
												<Badge variant="outline" className="text-[10px]">
													{task.status}
												</Badge>
											</div>
										))}
									</div>
								) : (
									<p className="text-xs text-gray-400">Không có task liên quan</p>
								)}
							</div>

							<Separator />

							{/* Actions */}
							<div className="space-y-2">
								<Button
									className="w-full gap-2"
									onClick={() => {
										if (selectedTask?.briefId) {
											window.location.href = `/applications/creative/briefs/${selectedTask.briefId}`
										}
									}}
								>
									<ExternalLink className="h-4 w-4" />
									Xem Brief
								</Button>
							</div>
						</div>
					) : (
						<div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-12">
							<Eye className="h-12 w-12 mb-4 text-gray-300" />
							<p className="font-medium">Chọn một task để xem chi tiết</p>
							<p className="text-sm mt-1">Click vào task trong calendar hoặc danh sách</p>
						</div>
					)}
				</TabsContent>

				{/* Notifications Tab */}
				<TabsContent value="notifications" className="flex-1 overflow-auto m-0">
					{/* Notification Actions */}
					<div className="p-3 border-b bg-gray-50 flex items-center justify-between sticky top-0 z-10">
						<span className="text-sm font-medium">
							{unreadCount > 0 ? `${unreadCount} chưa đọc` : 'Tất cả đã đọc'}
						</span>
						{unreadCount > 0 && (
							<Button
								variant="ghost"
								size="sm"
								onClick={handleMarkAllAsRead}
								className="text-blue-600 hover:text-blue-700"
							>
								<CheckCircle className="h-4 w-4 mr-1" />
								Đánh dấu tất cả đã đọc
							</Button>
						)}
					</div>

					{/* Grouped Notifications */}
					<div className="p-4">
						{renderNotificationGroup('urgent', groupedNotifications.urgent)}
						{renderNotificationGroup('attention', groupedNotifications.attention)}
						{renderNotificationGroup('fyi', groupedNotifications.fyi)}

						{notifications.length === 0 && (
							<div className="text-center py-12 text-muted-foreground">
								<Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
								<p className="font-medium">Không có thông báo</p>
							</div>
						)}
					</div>
				</TabsContent>
			</Tabs>

			{/* Task Preview Dialog */}
			<Dialog open={showPreviewDialog} onOpenChange={(open) => !open && handleClosePreview()}>
				<DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							{previewTask?.title}
						</DialogTitle>
						<DialogDescription>
							{previewTask?.appName} • {previewTask?.campaignName}
						</DialogDescription>
					</DialogHeader>

					{previewTask && (
						<div className="space-y-4">
							{/* Thumbnail */}
							{previewTask.thumbnail && (
								<div className="rounded-lg overflow-hidden border">
									<img
										src={previewTask.thumbnail}
										alt={previewTask.title}
										className="w-full h-40 object-cover"
									/>
								</div>
							)}

							{/* Status and Priority */}
							<div className="flex items-center gap-2 flex-wrap">
								<Badge className={cn(
									"px-2 py-1",
									previewTask.status === 'completed' ? "bg-green-100 text-green-700" :
										previewTask.status === 'overdue' ? "bg-red-100 text-red-700" :
											previewTask.status === 'in_progress' ? "bg-blue-100 text-blue-700" :
												previewTask.status === 'review' ? "bg-purple-100 text-purple-700" :
													"bg-gray-100 text-gray-700"
								)}>
									{previewTask.status}
								</Badge>
								<Badge className={cn(
									"px-2 py-1",
									previewTask.priority === 'urgent' ? "bg-red-100 text-red-700" :
										previewTask.priority === 'high' ? "bg-orange-100 text-orange-700" :
											previewTask.priority === 'medium' ? "bg-yellow-100 text-yellow-700" :
												"bg-green-100 text-green-700"
								)}>
									{previewTask.priority}
								</Badge>
							</div>

							{/* Description */}
							{previewTask.description && (
								<div>
									<Label className="text-xs text-muted-foreground">Mô tả</Label>
									<p className="text-sm mt-1">{previewTask.description}</p>
								</div>
							)}

							{/* Deadline */}
							<div className="flex items-center gap-2">
								<Clock className="h-4 w-4 text-gray-500" />
								<span className="text-sm">
									Deadline: {new Date(previewTask.deadline).toLocaleDateString("vi-VN", {
										weekday: 'long',
										day: 'numeric',
										month: 'long',
										year: 'numeric'
									})}
								</span>
							</div>

							{/* Assignees */}
							<div>
								<Label className="text-xs text-muted-foreground">Được giao cho</Label>
								<div className="flex flex-wrap gap-2 mt-1">
									{previewTask.assignedTo.map(assigneeId => {
										const member = teamMembers.find(m => m.id === assigneeId)
										return member ? (
											<div key={assigneeId} className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1">
												<Avatar className="h-6 w-6">
													<AvatarFallback className="bg-purple-100 text-purple-700 text-xs">
														{member.avatar}
													</AvatarFallback>
												</Avatar>
												<span className="text-sm">{member.name}</span>
											</div>
										) : null
									})}
								</div>
							</div>

							{/* Progress */}
							{previewTask.progress > 0 && (
								<div>
									<div className="flex items-center justify-between mb-2">
										<Label className="text-xs text-muted-foreground">Tiến độ</Label>
										<span className="text-sm font-bold">{previewTask.progress}%</span>
									</div>
									<Progress value={previewTask.progress} className="h-2" />
								</div>
							)}
						</div>
					)}

					<DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
						{/* Context-aware action buttons based on notification type */}
						{previewNotification?.type === 'approval_needed' && (
							<>
								<Button variant="destructive" onClick={handleReject} className="flex-1">
									<X className="h-4 w-4 mr-2" />
									Từ chối
								</Button>
								<Button onClick={handleApprove} className="flex-1 bg-green-600 hover:bg-green-700">
									<CheckCircle className="h-4 w-4 mr-2" />
									Duyệt
								</Button>
							</>
						)}

						{previewNotification?.type === 'task_assigned' && (
							<Button onClick={handleConfirmAssignment} className="flex-1 bg-blue-600 hover:bg-blue-700">
								<CheckCircle className="h-4 w-4 mr-2" />
								Xác nhận nhận Task
							</Button>
						)}

						{previewNotification?.type === 'feedback_received' && (
							<Button onClick={handleReviewFeedback} className="flex-1 bg-purple-600 hover:bg-purple-700">
								<Eye className="h-4 w-4 mr-2" />
								Xem & Phản hồi Feedback
							</Button>
						)}

						{previewNotification?.type === 'status_changed' && previewTask?.status === 'completed' && (
							<Button variant="outline" onClick={handleClosePreview} className="flex-1">
								<CheckCircle2 className="h-4 w-4 mr-2" />
								Đã ghi nhận
							</Button>
						)}

						{previewNotification?.type === 'deadline_reminder' && (
							<Button onClick={() => {
								window.location.href = `/applications/creative/deadlines?task=${previewTask?.id}`
							}} className="flex-1 bg-orange-600 hover:bg-orange-700">
								<Clock className="h-4 w-4 mr-2" />
								Xử lý ngay
							</Button>
						)}

						{/* Always show these buttons */}
						<div className="flex gap-2 w-full sm:w-auto">
							<Button variant="outline" onClick={handleClosePreview}>
								Đóng
							</Button>
							<Button variant="secondary" onClick={() => {
								window.location.href = `/applications/creative/deadlines?task=${previewTask?.id}`
							}}>
								<ExternalLink className="h-4 w-4 mr-2" />
								Xem chi tiết
							</Button>
						</div>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}
