"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Bell, CheckCircle, Clock, User } from "lucide-react"
import type { Task, Notification } from "../app/applications/creative/deadlines/types"

// Demo notifications
const mockNotifications: Notification[] = [
  {
    id: "notif-001",
    type: "deadline_reminder",
    title: "Deadline Approaching",
    message: "Banner for Summer Campaign is due tomorrow.",
    taskId: "task-001",
    userId: "user-01",
    isRead: false,
    createdAt: "2024-06-09T09:00:00Z",
    actionUrl: "/applications/creative/deadlines?task=task-001"
  },
  {
    id: "notif-002",
    type: "task_assigned",
    title: "New Task Assigned",
    message: "You have been assigned to Concept Brainstorm: Summer Slogan.",
    taskId: "task-002",
    userId: "user-03",
    isRead: true,
    createdAt: "2024-06-03T10:05:00Z",
    actionUrl: "/applications/creative/deadlines?task=task-002"
  },
  {
    id: "notif-003",
    type: "feedback_received",
    title: "Feedback Received",
    message: "Feedback on Banner Design is available.",
    taskId: "task-006",
    userId: "user-06",
    isRead: false,
    createdAt: "2024-06-05T12:30:00Z",
    actionUrl: "/applications/creative/deadlines?task=task-006"
  },
  {
    id: "notif-004",
    type: "approval_needed",
    title: "Approval Needed",
    message: "Asset Approval: Social Media requires your review.",
    taskId: "task-007",
    userId: "user-07",
    isRead: true,
    createdAt: "2024-06-06T13:10:00Z",
    actionUrl: "/applications/creative/deadlines?task=task-007"
  },
  {
    id: "notif-005",
    type: "status_changed",
    title: "Task Status Updated",
    message: "Review Video Asset status changed to 'review'.",
    taskId: "task-003",
    userId: "user-04",
    isRead: false,
    createdAt: "2024-06-04T11:20:00Z",
    actionUrl: "/applications/creative/deadlines?task=task-003"
  }
]

interface RightSidebarProps {
  selectedTask: Task | null
}

export function RightSidebar({ selectedTask }: RightSidebarProps) {
  const notifications: Notification[] = mockNotifications

  return (
    <div className="w-[380px] border-l bg-white overflow-y-auto">
      <Tabs defaultValue="task" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="task" className="flex-1">Task Detail</TabsTrigger>
          <TabsTrigger value="notifications" className="flex-1">
            <Bell className="h-4 w-4 mr-1" />
            Notifications
            {notifications.filter(n => !n.isRead).length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {notifications.filter(n => !n.isRead).length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Task Detail Tab */}
        <TabsContent value="task" className="p-4">
          {selectedTask ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">{selectedTask.title}</h3>
                <Badge variant="secondary">{selectedTask.status}</Badge>
              </div>

              <Separator />

              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">App:</span>
                  <p className="font-medium">{selectedTask.appName}</p>
                </div>

                {selectedTask.campaignName && (
                  <div>
                    <span className="text-muted-foreground">Campaign:</span>
                    <p className="font-medium">{selectedTask.campaignName}</p>
                  </div>
                )}

                <div>
                  <span className="text-muted-foreground">Deadline:</span>
                  <p className="font-medium flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {new Date(selectedTask.deadline).toLocaleDateString('vi-VN')}
                  </p>
                </div>

                <div>
                  <span className="text-muted-foreground">Priority:</span>
                  <Badge variant="outline">{selectedTask.priority}</Badge>
                </div>

                <div>
                  <span className="text-muted-foreground">Assigned to:</span>
                  <div className="flex gap-2 mt-2">
                    {selectedTask.assignedTo.map((_: string, i: number) => (
                      <div key={i} className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>U{i + 1}</AvatarFallback>
                        </Avatar>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedTask.description && (
                  <div>
                    <span className="text-muted-foreground">Description:</span>
                    <p className="mt-1">{selectedTask.description}</p>
                  </div>
                )}

                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">Progress:</span>
                    <span className="font-medium">{selectedTask.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${selectedTask.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Button className="w-full">View Brief</Button>
                <Button variant="outline" className="w-full">Update Status</Button>
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
              notifications.map(notif => (
                <div
                  key={notif.id}
                  className={`p-3 rounded-lg border cursor-pointer transition ${!notif.isRead ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <Bell className={`h-5 w-5 flex-shrink-0 ${!notif.isRead ? 'text-blue-600' : 'text-muted-foreground'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{notif.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notif.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(notif.createdAt).toLocaleString('vi-VN')}
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
