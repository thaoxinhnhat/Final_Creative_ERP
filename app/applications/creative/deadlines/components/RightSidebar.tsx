"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Bell, CheckCircle, Clock } from "lucide-react"
import type { Task, Notification } from "../types"
import { mockNotifications } from "../mockData"

interface RightSidebarProps {
	selectedTask: Task | null
}

export function RightSidebar({ selectedTask }: RightSidebarProps) {
	const notifications = mockNotifications

	return (
		<div className="w-[380px] border-l bg-white overflow-y-auto">
			<Tabs defaultValue="task" className="w-full">
				<TabsList className="w-full">
					<TabsTrigger value="task" className="flex-1">
						Task Detail
					</TabsTrigger>
					<TabsTrigger value="notifications" className="flex-1">
						<Bell className="h-4 w-4 mr-1" />
						Notifications
						{notifications.filter((n) => !n.isRead).length > 0 && (
							<Badge variant="destructive" className="ml-2">
								{notifications.filter((n) => !n.isRead).length}
							</Badge>
						)}
					</TabsTrigger>
				</TabsList>

				{/* Task Detail Tab */}
				<TabsContent value="task" className="p-4">
					{selectedTask ? (
						<div className="space-y-4">
							<div>
								<h3 className="font-semibold text-lg mb-2">
									{selectedTask.title}
								</h3>
								<Badge variant="secondary">{selectedTask.status}</Badge>
							</div>

							<Separator />

							<div className="space-y-3 text-sm">
								<div>
									<Label className="text-xs text-muted-foreground">
										APP
									</Label>
									<p className="font-medium">{selectedTask.appName}</p>
								</div>

								{selectedTask.campaignName && (
									<div>
										<Label className="text-xs text-muted-foreground">
											CAMPAIGN
										</Label>
										<p className="font-medium">{selectedTask.campaignName}</p>
									</div>
								)}

								<div>
									<Label className="text-xs text-muted-foreground">
										DEADLINE
									</Label>
									<p className="font-medium flex items-center gap-1">
										<Clock className="h-4 w-4" />
										{new Date(selectedTask.deadline).toLocaleDateString("vi-VN")}
									</p>
								</div>

								<div>
									<Label className="text-xs text-muted-foreground">
										PRIORITY
									</Label>
									<div className="mt-1">
										<Badge variant="outline">{selectedTask.priority}</Badge>
									</div>
								</div>

								{selectedTask.progress > 0 && (
									<div>
										<div className="flex items-center justify-between mb-2">
											<Label className="text-xs text-muted-foreground">
												PROGRESS
											</Label>
											<span className="text-sm font-medium">
												{selectedTask.progress}%
											</span>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-2">
											<div
												className="bg-blue-600 h-2 rounded-full transition-all duration-500"
												style={{ width: `${selectedTask.progress}%` }}
											/>
										</div>
									</div>
								)}
							</div>

							<Separator />

							<div className="space-y-2">
								<Button className="w-full">View Brief</Button>
								<Button variant="outline" className="w-full">
									Update Status
								</Button>
							</div>
						</div>
					) : (
						<div className="text-center py-12 text-muted-foreground">
							Select a task to view details
						</div>
					)}
				</TabsContent>

				{/* Notifications Tab */}
				<TabsContent value="notifications" className="p-4">
					<div className="space-y-3">
						{notifications.length > 0 ? (
							notifications.map((notif) => (
								<div
									key={notif.id}
									className={`p-3 rounded-lg border cursor-pointer transition-all ${
										!notif.isRead
											? "bg-blue-50 border-blue-200"
											: "hover:bg-gray-50"
									}`}
								>
									<div className="flex items-start gap-3">
										<Bell
											className={`h-5 w-5 flex-shrink-0 ${
												!notif.isRead
													? "text-blue-600"
													: "text-muted-foreground"
											}`}
										/>
										<div className="flex-1 min-w-0">
											<p className="font-medium text-sm">{notif.title}</p>
											<p className="text-xs text-muted-foreground mt-1">
												{notif.message}
											</p>
											<p className="text-xs text-muted-foreground mt-2">
												{new Date(notif.createdAt).toLocaleString("vi-VN")}
											</p>
										</div>
										{!notif.isRead && (
											<Button variant="ghost" size="sm">
												<CheckCircle className="h-4 w-4" />
											</Button>
										)}
									</div>
								</div>
							))
						) : (
							<div className="text-center py-12 text-muted-foreground">
								No notifications
							</div>
						)}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	)
}
