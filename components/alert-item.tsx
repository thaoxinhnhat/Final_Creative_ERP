"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { AlertCircle, CheckCircle2, Search, ExternalLink } from "lucide-react"

type AlertType = "critical" | "warning" | "positive"

interface AlertItemProps {
  type: AlertType
  source: "Metadata" | "StoreKit" | "Both"
  title: string
  impact: string
  projectId: string
  version: string
  publishDate: string
  detectedTime: string
}

export function AlertItem({
  type,
  source,
  title,
  impact,
  projectId,
  version,
  publishDate,
  detectedTime,
}: AlertItemProps) {
  const config = {
    critical: {
      icon: AlertCircle,
      badge: "🔴 Critical Alert",
      bgClass: "border-red-500 bg-red-50",
      badgeClass: "bg-red-600",
      textClass: "text-red-900",
      impactClass: "text-red-800",
      timeClass: "text-red-700",
      tagClass: "border-red-300 text-red-700",
      iconBg: "bg-red-500",
    },
    warning: {
      icon: AlertCircle,
      badge: "🟡 Warning Alert",
      bgClass: "border-yellow-500 bg-yellow-50",
      badgeClass: "bg-yellow-600",
      textClass: "text-yellow-900",
      impactClass: "text-yellow-800",
      timeClass: "text-yellow-700",
      tagClass: "border-yellow-300 text-yellow-700",
      iconBg: "bg-yellow-500",
    },
    positive: {
      icon: CheckCircle2,
      badge: "🟢 Positive Alert",
      bgClass: "border-green-500 bg-green-50",
      badgeClass: "bg-green-600",
      textClass: "text-green-900",
      impactClass: "text-green-800",
      timeClass: "text-green-700",
      tagClass: "border-green-300 text-green-700",
      iconBg: "bg-green-500",
    },
  }

  const c = config[type]
  const Icon = c.icon

  return (
    <div className={`border-2 rounded-lg p-4 bg-white ${c.bgClass}`}>
      <div className="flex items-start gap-3">
        <div className={`${c.iconBg} text-white rounded-full p-1.5 mt-0.5`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge className={`${c.badgeClass} text-white`}>{c.badge}</Badge>
            <Badge variant="outline" className={`text-xs ${c.tagClass}`}>
              {source}
            </Badge>
            <span className={`text-xs ${c.timeClass}`}>Detected: {detectedTime}</span>
          </div>
          <p className={`font-semibold text-sm ${c.textClass} mb-1`}>{title}</p>
          <p className={`text-sm ${c.impactClass} mb-2`}>{impact}</p>
          <div className="flex items-center gap-2 mb-3 text-xs text-gray-600">
            <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-gray-200">
              Project: {projectId}
            </Badge>
            <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-gray-200">
              Version: {version}
            </Badge>
            <span>Published: {publishDate}</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {type !== "positive" && (
              <>
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button
                      size="sm"
                      variant={type === "critical" ? "destructive" : "default"}
                      className={`gap-1 ${type === "warning" ? "bg-yellow-600 hover:bg-yellow-700" : ""}`}
                    >
                      <Search className="h-3 w-3" />
                      Investigate
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Alert Details</DrawerTitle>
                      <DrawerDescription>Chi tiết cảnh báo và các hành động khả thi</DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4">
                      <div className="flex gap-2">
                        <Button className="gap-1">
                          <ExternalLink className="h-3 w-3" />
                          Fix in {source}
                        </Button>
                        <Button variant="outline" className="gap-1 bg-transparent">
                          <ExternalLink className="h-3 w-3" />
                          View Full Analysis
                        </Button>
                      </div>
                    </div>
                  </DrawerContent>
                </Drawer>
                <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                  Set Action Plan
                </Button>
              </>
            )}
            {type === "positive" && (
              <>
                <Button size="sm" className="bg-green-600 hover:bg-green-700 gap-1">
                  View Metrics
                </Button>
                <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                  Share Team
                </Button>
              </>
            )}
            <Button size="sm" variant="ghost">
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
