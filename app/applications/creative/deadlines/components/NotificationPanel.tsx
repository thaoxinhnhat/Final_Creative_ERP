"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, Check, X, CheckCheck } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { Notification } from "../types"
import { NOTIFICATION_CONFIG } from "../types"

interface NotificationPanelProps { notifications: Notification[]; onMarkAsRead: (id: string) => void; onMarkAllAsRead: () => void; onClear: (id: string) => void }

export function NotificationPanel({ notifications, onMarkAsRead, onMarkAllAsRead, onClear }: NotificationPanelProps) {
  const unreadCount = notifications.filter(n => !n.isRead).length
  return (
    <div className="w-[320px] border-l bg-white dark:bg-gray-900 flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2"><Bell className="h-5 w-5" /><h2 className="font-semibold">Thông báo</h2>{unreadCount > 0 && <Badge variant="destructive" className="h-5 px-1.5">{unreadCount}</Badge>}</div>
        {unreadCount > 0 && <Button variant="ghost" size="sm" onClick={onMarkAllAsRead}><CheckCheck className="h-4 w-4 mr-1" />Đọc tất cả</Button>}
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {notifications.map(notif => {
            const config = NOTIFICATION_CONFIG[notif.type]
            return (
              <div key={notif.id} className={cn("p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer group", !notif.isRead && "bg-blue-50/50 dark:bg-blue-900/20")} onClick={() => !notif.isRead && onMarkAsRead(notif.id)}>
                <div className="flex items-start gap-3">
                  <span className={cn("text-lg", config.color)}>{config.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm", !notif.isRead && "font-medium")}>{notif.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notif.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatDistanceToNow(new Date(notif.createdAt), { locale: vi, addSuffix: true })}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100" onClick={(e) => { e.stopPropagation(); onClear(notif.id) }}><X className="h-3 w-3" /></Button>
                </div>
              </div>
            )
          })}
          {notifications.length === 0 && <div className="text-center py-8 text-muted-foreground"><Bell className="h-8 w-8 mx-auto mb-2 opacity-30" /><p className="text-sm">Không có thông báo</p></div>}
        </div>
      </ScrollArea>
    </div>
  )
}
