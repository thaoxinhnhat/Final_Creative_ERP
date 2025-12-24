"use client"

import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Calendar as CalendarIcon,
  Globe,
  Smartphone,
  Users,
  Target,
  Clock,
  Paperclip,
  TrendingUp,
  Flag,
} from "lucide-react"
import { format, differenceInDays } from "date-fns"
import { cn } from "@/lib/utils"
import type { Brief, TeamMember } from "../types"
import { AttachmentPreview } from "./AttachmentPreview"

// ============================================
// PROPS
// ============================================
interface BriefSidebarProps {
  brief: Brief
  teamMembers: TeamMember[]
}

// ============================================
// HELPER COMPONENTS
// ============================================
const InfoRow = ({
  icon: Icon,
  label,
  children,
  className,
}: {
  icon: any
  label: string
  children: React.ReactNode
  className?: string
}) => (
  <div className={cn("flex items-start gap-3", className)}>
    <div className="h-8 w-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
      <Icon className="h-4 w-4 text-muted-foreground" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="text-sm font-medium mt-0.5">{children}</div>
    </div>
  </div>
)

const KpiCard = ({
  label,
  value,
  unit,
}: {
  label: string
  value: number
  unit: string
}) => {
  if (value <= 0) return null
  return (
    <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-center">
      <p className="text-[10px] text-muted-foreground uppercase">{label}</p>
      <p className="text-sm font-bold">
        {unit === "$" && unit}
        {value}
        {unit !== "$" && unit}
      </p>
    </div>
  )
}

// ============================================
// BRIEF SIDEBAR COMPONENT
// ============================================
export function BriefSidebar({ brief, teamMembers }: BriefSidebarProps) {
  const daysUntilDeadline = differenceInDays(new Date(brief.deadline), new Date())
  const isOverdue =
    daysUntilDeadline < 0 && brief.status !== "completed" && brief.status !== "returned_to_ua"
  const isUrgent =
    daysUntilDeadline >= 0 && daysUntilDeadline <= 3 && brief.status !== "completed" && brief.status !== "returned_to_ua"

  // Get assigned members
  const assignedMembers = teamMembers.filter((m) => brief.assignedTo.includes(m.id))

  // Get priority config
  const priorityConfig = {
    low: { label: "Thấp", color: "bg-gray-100 text-gray-700", emoji: "🟢" },
    medium: { label: "Trung bình", color: "bg-blue-100 text-blue-700", emoji: "🟡" },
    high: { label: "Cao", color: "bg-red-100 text-red-700", emoji: "🔴" },
  }[brief.priority]

  // Check if KPIs have values
  const hasKpis =
    brief.kpiTargets.ctr > 0 ||
    brief.kpiTargets.cvr > 0 ||
    brief.kpiTargets.cpi > 0 ||
    brief.kpiTargets.roas > 0

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div>
          <h3 className="font-semibold text-sm mb-1">Chi tiết Brief</h3>
          <p className="text-xs text-muted-foreground">#{brief.id}</p>
        </div>

        <Separator />

        {/* Basic Info */}
        <div className="space-y-4">
          {/* Deadline */}
          <InfoRow icon={CalendarIcon} label="Deadline">
            <div
              className={cn(
                isOverdue && "text-red-600",
                isUrgent && !isOverdue && "text-orange-600"
              )}
            >
              {format(new Date(brief.deadline), "dd/MM/yyyy")}
              {isOverdue && (
                <span className="text-xs ml-1">(Quá hạn {Math.abs(daysUntilDeadline)} ngày)</span>
              )}
              {isUrgent && !isOverdue && (
                <span className="text-xs ml-1">(Còn {daysUntilDeadline} ngày)</span>
              )}
            </div>
          </InfoRow>

          {/* Region */}
          <InfoRow icon={Globe} label="Region">
            {brief.region}
          </InfoRow>

          {/* Platform */}
          <InfoRow icon={Smartphone} label="Platform">
            <Badge variant="outline" className="text-xs">
              {brief.platform === "iOS" && "🍎 "}
              {brief.platform === "Android" && "🤖 "}
              {brief.platform}
            </Badge>
          </InfoRow>

          {/* Priority */}
          <InfoRow icon={Flag} label="Độ ưu tiên">
            <Badge className={cn("text-xs", priorityConfig.color)}>
              {priorityConfig.emoji} {priorityConfig.label}
            </Badge>
          </InfoRow>

          {/* Created by */}
          <InfoRow icon={Users} label="Người tạo">
            {brief.createdBy}
          </InfoRow>

          {/* Created at */}
          <InfoRow icon={Clock} label="Ngày tạo">
            {format(new Date(brief.createdAt), "dd/MM/yyyy HH:mm")}
          </InfoRow>
        </div>

        {/* KPI Targets */}
        {hasKpis && (
          <>
            <Separator />
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-semibold text-sm">KPI Targets</h4>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <KpiCard label="CTR" value={brief.kpiTargets.ctr} unit="%" />
                <KpiCard label="CVR" value={brief.kpiTargets.cvr} unit="%" />
                <KpiCard label="CPI" value={brief.kpiTargets.cpi} unit="$" />
                <KpiCard label="ROAS" value={brief.kpiTargets.roas} unit="x" />
              </div>
            </div>
          </>
        )}

        {/* Lead Objective */}
        {brief.leadObjective && (
          <>
            <Separator />
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-semibold text-sm">Mục tiêu từ Lead</h4>
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                {brief.leadObjective}
              </p>
            </div>
          </>
        )}

        {/* Assigned Members */}
        {assignedMembers.length > 0 && (
          <>
            <Separator />
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-semibold text-sm">Người thực hiện</h4>
              </div>
              <div className="space-y-2">
                {assignedMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800"
                  >
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                        {member.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{member.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {member.role.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Attachments with Preview */}
        <Separator />
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Paperclip className="h-4 w-4 text-muted-foreground" />
            <h4 className="font-semibold text-sm">Tài liệu đính kèm</h4>
          </div>
          <AttachmentPreview
            attachments={brief.attachments}
            maxVisible={6}
          />
        </div>

        {/* Return Reason (if returned_to_ua) */}
        {brief.status === "returned_to_ua" && brief.returnReason && (
          <>
            <Separator />
            <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
              <h4 className="font-semibold text-sm text-red-700 dark:text-red-300 mb-1">
                Lý do trả về
              </h4>
              <p className="text-sm text-red-600 dark:text-red-400">
                {brief.returnReason}
              </p>
            </div>
          </>
        )}
      </div>
    </ScrollArea>
  )
}

export default BriefSidebar
