"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  CheckCircle2, 
  RefreshCw, 
  Loader2, 
  Calendar as CalendarIcon, 
  Globe, 
  Smartphone,
  Target,
  Users,
  Flag,
  FileText,
  AlertTriangle,
  Paperclip,
  TrendingUp,
  Clock,
  XCircle,
} from "lucide-react"
import { format, differenceInDays, addDays } from "date-fns"
import { cn } from "@/lib/utils"
import type { Brief, TeamMember, ConfirmBriefFormData, Priority } from "../types"

// ============================================
// EXTENDED FORM DATA TYPE
// ============================================
interface ExtendedConfirmBriefFormData extends ConfirmBriefFormData {
  newDeadline?: string
}

// ============================================
// PROPS
// ============================================
interface ConfirmBriefModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  brief: Brief | null
  teamMembers: TeamMember[]
  onConfirm: (data: ConfirmBriefFormData) => Promise<void> | void
  isSubmitting?: boolean
}

// ============================================
// KPI DISPLAY COMPONENT
// ============================================
const KpiDisplay = ({ kpiTargets }: { kpiTargets: Brief["kpiTargets"] }) => {
  const kpis = [
    { key: "ctr", label: "CTR", value: kpiTargets.ctr, unit: "%", color: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" },
    { key: "cvr", label: "CVR", value: kpiTargets.cvr, unit: "%", color: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300" },
    { key: "cpi", label: "CPI", value: kpiTargets.cpi, unit: "$", color: "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300" },
    { key: "roas", label: "ROAS", value: kpiTargets.roas, unit: "x", color: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300" },
  ].filter(kpi => kpi.value > 0)

  if (kpis.length === 0) return null

  return (
    <div className="grid grid-cols-4 gap-2">
      {kpis.map((kpi) => (
        <div key={kpi.key} className={cn("p-2 rounded-lg text-center", kpi.color)}>
          <p className="text-[10px] uppercase tracking-wide opacity-70">{kpi.label}</p>
          <p className="text-sm font-bold">{kpi.key === "cpi" ? `$${kpi.value}` : `${kpi.value}${kpi.unit}`}</p>
        </div>
      ))}
    </div>
  )
}

// ============================================
// ASSIGNEE SELECTOR COMPONENT
// ============================================
const AssigneeSelector = ({
  selectedIds,
  onChange,
  teamMembers,
  disabled = false,
}: {
  selectedIds: string[]
  onChange: (ids: string[]) => void
  teamMembers: TeamMember[]
  disabled?: boolean
}) => {
  const creatives = teamMembers.filter(m => m.role === "creative")
  
  if (creatives.length === 0) {
    return <p className="text-sm text-muted-foreground italic">Không có creative nào trong team</p>
  }

  return (
    <div className="space-y-2 max-h-[160px] overflow-y-auto">
      {creatives.map((member) => {
        const isSelected = selectedIds.includes(member.id)
        return (
          <div 
            key={member.id} 
            className={cn(
              "flex items-center gap-3 p-2.5 rounded-lg border transition-all cursor-pointer",
              isSelected 
                ? "bg-blue-50 dark:bg-blue-950 border-blue-300 dark:border-blue-700 shadow-sm" 
                : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => {
              if (disabled) return
              if (isSelected) {
                onChange(selectedIds.filter(id => id !== member.id))
              } else {
                onChange([...selectedIds, member.id])
              }
            }}
          >
            <Checkbox
              id={`assignee-${member.id}`}
              checked={isSelected}
              disabled={disabled}
              className="pointer-events-none"
            />
            <Avatar className="h-8 w-8">
              <AvatarFallback className={cn(
                "text-xs font-medium",
                isSelected 
                  ? "bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200" 
                  : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              )}>
                {member.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium">{member.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{member.role.replace("_", " ")}</p>
            </div>
            {isSelected && (
              <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ============================================
// PRIORITY SELECTOR COMPONENT
// ============================================
const PrioritySelector = ({
  value,
  onChange,
  disabled = false,
}: {
  value: Priority
  onChange: (value: Priority) => void
  disabled?: boolean
}) => {
  const priorities: { value: Priority; label: string; emoji: string; color: string; activeColor: string }[] = [
    { value: "low", label: "Thấp", emoji: "🟢", color: "border-gray-200 hover:border-gray-400", activeColor: "border-gray-500 bg-gray-50 dark:bg-gray-800" },
    { value: "medium", label: "Trung bình", emoji: "🟡", color: "border-gray-200 hover:border-blue-400", activeColor: "border-blue-500 bg-blue-50 dark:bg-blue-950" },
    { value: "high", label: "Cao", emoji: "🔴", color: "border-gray-200 hover:border-red-400", activeColor: "border-red-500 bg-red-50 dark:bg-red-950" },
  ]

  return (
    <div className="grid grid-cols-3 gap-2">
      {priorities.map((p) => (
        <button
          key={p.value}
          type="button"
          onClick={() => !disabled && onChange(p.value)}
          disabled={disabled}
          className={cn(
            "px-3 py-2.5 rounded-lg border-2 text-sm font-medium transition-all flex items-center justify-center gap-2",
            value === p.value ? p.activeColor : p.color,
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <span>{p.emoji}</span>
          <span>{p.label}</span>
        </button>
      ))}
    </div>
  )
}

// ============================================
// OVERDUE ALERT COMPONENT
// ============================================
const OverdueAlert = ({ 
  daysOverdue, 
  isSevere, 
  onSuggestRefund 
}: { 
  daysOverdue: number
  isSevere: boolean
  onSuggestRefund: () => void
}) => {
  return (
    <Alert variant="destructive" className={cn(
      "border-2",
      isSevere ? "bg-red-100 dark:bg-red-950 border-red-500" : "bg-orange-100 dark:bg-orange-950 border-orange-500"
    )}>
      <AlertTriangle className={cn(
        "h-5 w-5",
        isSevere ? "text-red-600" : "text-orange-600"
      )} />
      <AlertTitle className={cn(
        "font-bold",
        isSevere ? "text-red-800 dark:text-red-200" : "text-orange-800 dark:text-orange-200"
      )}>
        ⚠️ Brief đã quá hạn {daysOverdue} ngày!
      </AlertTitle>
      <AlertDescription className={cn(
        isSevere ? "text-red-700 dark:text-red-300" : "text-orange-700 dark:text-orange-300"
      )}>
        <div className="space-y-2 mt-2">
          <p>
            {isSevere 
              ? "Brief này đã quá hạn hơn 30 ngày. Khuyến nghị Refund và yêu cầu UA Team tạo brief mới với deadline phù hợp."
              : "Deadline của brief này đã qua. Bạn có thể xác nhận với deadline mới hoặc refund cho UA Team."}
          </p>
          {isSevere && (
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white dark:bg-gray-900 border-red-300 text-red-700 hover:bg-red-50"
              onClick={onSuggestRefund}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Chuyển sang Refund
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  )
}

// ============================================
// CONFIRM BRIEF MODAL COMPONENT
// ============================================
export function ConfirmBriefModal({ 
  open, 
  onOpenChange, 
  brief, 
  teamMembers,
  onConfirm,
  isSubmitting = false,
}: ConfirmBriefModalProps) {
  const [formData, setFormData] = useState<ExtendedConfirmBriefFormData>({
    action: "confirm",
    leadObjective: "",
    assignedTo: [],
    priority: "medium",
    refundReason: "",
    newDeadline: "",
  })
  const [localSubmitting, setLocalSubmitting] = useState(false)

  const isLoading = isSubmitting || localSubmitting

  // Calculate overdue status
  const daysUntilDeadline = brief ? differenceInDays(new Date(brief.deadline), new Date()) : 0
  const isOverdue = daysUntilDeadline < 0
  const daysOverdue = Math.abs(daysUntilDeadline)
  const isSeverelyOverdue = isOverdue && daysOverdue > 30
  const isUrgent = daysUntilDeadline >= 0 && daysUntilDeadline <= 3

  // Generate suggested new deadline (7 days from today)
  const suggestedNewDeadline = format(addDays(new Date(), 7), "yyyy-MM-dd")

  // Reset form when brief changes or modal opens
  useEffect(() => {
    if (brief && open) {
      // Auto-suggest refund if severely overdue
      const shouldSuggestRefund = isSeverelyOverdue
      
      // Pre-fill refund reason for overdue briefs
      const overdueRefundReason = isOverdue 
        ? `Brief đã quá hạn ${daysOverdue} ngày (deadline gốc: ${format(new Date(brief.deadline), "dd/MM/yyyy")}). Vui lòng tạo brief mới với deadline phù hợp.`
        : ""

      setFormData({
        action: shouldSuggestRefund ? "refund" : "confirm",
        leadObjective: "",
        assignedTo: [],
        priority: "medium",
        refundReason: shouldSuggestRefund ? overdueRefundReason : "",
        newDeadline: isOverdue ? suggestedNewDeadline : "",
      })
    }
  }, [brief, open, isOverdue, daysOverdue, isSeverelyOverdue, suggestedNewDeadline])

  const handleSuggestRefund = () => {
    if (!brief) return
    const overdueRefundReason = `Brief đã quá hạn ${daysOverdue} ngày (deadline gốc: ${format(new Date(brief.deadline), "dd/MM/yyyy")}). Vui lòng tạo brief mới với deadline phù hợp.`
    setFormData({
      ...formData,
      action: "refund",
      refundReason: overdueRefundReason,
    })
  }

  const handleSubmit = async () => {
    // Validation for overdue briefs choosing confirm
    if (formData.action === "confirm" && isOverdue && !formData.newDeadline) {
      // This will be handled by required field validation
      return
    }

    setLocalSubmitting(true)
    try {
      // Include new deadline in leadObjective if overdue
      let finalData = { ...formData }
      if (formData.action === "confirm" && isOverdue && formData.newDeadline) {
        const newDeadlineInfo = `\n\n📅 Deadline mới: ${format(new Date(formData.newDeadline), "dd/MM/yyyy")} (deadline gốc: ${format(new Date(brief!.deadline), "dd/MM/yyyy")} - quá hạn ${daysOverdue} ngày)`
        finalData.leadObjective = (formData.leadObjective || "") + newDeadlineInfo
      }
      await onConfirm(finalData)
    } finally {
      setLocalSubmitting(false)
    }
  }

  // Validation check
  const isConfirmValid = () => {
    if (formData.action !== "confirm") return true
    if (formData.assignedTo.length === 0) return false
    if (isOverdue && !formData.newDeadline) return false
    return true
  }

  const isRefundValid = () => {
    if (formData.action !== "refund") return true
    return formData.refundReason.trim().length > 0
  }

  const canSubmit = formData.action === "confirm" ? isConfirmValid() : isRefundValid()

  if (!brief) return null

  return (
    <Dialog open={open} onOpenChange={(o) => !isLoading && onOpenChange(o)}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b bg-gray-50 dark:bg-gray-900">
          <DialogTitle className="text-xl flex items-center gap-2">
            {formData.action === "confirm" ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Xác nhận Brief
              </>
            ) : (
              <>
                <RefreshCw className="h-5 w-5 text-red-600" />
                Refund Brief
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {formData.action === "confirm" 
              ? "Review thông tin brief từ UA Team, thêm mục tiêu cụ thể và phân công người thực hiện" 
              : "Trả lại brief cho UA Team với lý do chi tiết"}
          </DialogDescription>
        </DialogHeader>

        {/* Overdue Warning Alert - Sticky at top */}
        {isOverdue && (
          <div className="px-6 py-3 border-b bg-red-50/50 dark:bg-red-950/30">
            <OverdueAlert 
              daysOverdue={daysOverdue}
              isSevere={isSeverelyOverdue}
              onSuggestRefund={handleSuggestRefund}
            />
          </div>
        )}

        {/* Two Column Layout */}
        <ScrollArea className="flex-1">
          <div className="grid grid-cols-2 gap-0 divide-x">
            {/* ======================================== */}
            {/* LEFT COLUMN: UA Team Info (Readonly) */}
            {/* ======================================== */}
            <div className="p-6 space-y-5 bg-orange-50/30 dark:bg-orange-950/10">
              {/* Section Header */}
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Thông tin từ UA Team</h3>
                  <p className="text-xs text-muted-foreground">Chỉ đọc - không thể chỉnh sửa</p>
                </div>
              </div>

              {/* Brief Title & App */}
              <Card className="shadow-sm">
                <CardContent className="p-4 space-y-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Tiêu đề Brief</Label>
                    <p className="font-semibold text-base mt-0.5">{brief.title}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">App / Campaign</Label>
                    <p className="font-medium text-sm mt-0.5">{brief.appCampaign}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Deadline Card with Overdue Highlight */}
                <Card className={cn(
                  "shadow-sm",
                  isOverdue && "border-red-300 dark:border-red-700 bg-red-50/50 dark:bg-red-950/30"
                )}>
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <CalendarIcon className="h-3.5 w-3.5" />
                      <Label className="text-xs">Deadline gốc</Label>
                    </div>
                    <p className={cn(
                      "font-semibold text-sm",
                      isOverdue && "text-red-600 line-through",
                      isUrgent && "text-orange-600"
                    )}>
                      {format(new Date(brief.deadline), "dd/MM/yyyy")}
                    </p>
                    {isOverdue && (
                      <div className="flex items-center gap-1 mt-1">
                        <XCircle className="h-3.5 w-3.5 text-red-600" />
                        <p className="text-xs text-red-600 font-medium">Quá hạn {daysOverdue} ngày</p>
                      </div>
                    )}
                    {isUrgent && !isOverdue && (
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="h-3.5 w-3.5 text-orange-600" />
                        <p className="text-xs text-orange-600">Còn {daysUntilDeadline} ngày</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Globe className="h-3.5 w-3.5" />
                      <Label className="text-xs">Region</Label>
                    </div>
                    <p className="font-semibold text-sm">{brief.region}</p>
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Smartphone className="h-3.5 w-3.5" />
                      <Label className="text-xs">Platform</Label>
                    </div>
                    <p className="font-semibold text-sm">{brief.platform}</p>
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Users className="h-3.5 w-3.5" />
                      <Label className="text-xs">Người tạo</Label>
                    </div>
                    <p className="font-semibold text-sm">{brief.createdBy}</p>
                  </CardContent>
                </Card>
              </div>

              {/* KPIs */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-xs text-muted-foreground">KPI Targets</Label>
                </div>
                <KpiDisplay kpiTargets={brief.kpiTargets} />
              </div>

              {/* Requirements */}
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Yêu cầu chi tiết</Label>
                <div className="p-3 bg-white dark:bg-gray-900 rounded-lg border max-h-[120px] overflow-y-auto">
                  <p className="text-sm whitespace-pre-wrap">{brief.requirements}</p>
                </div>
              </div>

              {/* Attachments */}
              {brief.attachments.length > 0 && (
                <div className="flex items-center gap-2">
                  <Paperclip className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="secondary" className="text-xs">
                    {brief.attachments.length} tài liệu đính kèm
                  </Badge>
                </div>
              )}
            </div>

            {/* ======================================== */}
            {/* RIGHT COLUMN: Lead Creative Input */}
            {/* ======================================== */}
            <div className="p-6 space-y-5 bg-blue-50/30 dark:bg-blue-950/10">
              {/* Section Header */}
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Lead Creative nhập</h3>
                  <p className="text-xs text-muted-foreground">Điền thông tin để xử lý brief</p>
                </div>
              </div>
              
              {/* Action Selection - Radio Buttons */}
              <Card className={cn(
                "shadow-sm border-2 transition-colors",
                formData.action === "confirm" 
                  ? "border-green-300 dark:border-green-700" 
                  : "border-red-300 dark:border-red-700"
              )}>
                <CardContent className="p-4">
                  <Label className="text-xs text-muted-foreground mb-3 block">Quyết định của bạn</Label>
                  <RadioGroup 
                    value={formData.action} 
                    onValueChange={(v) => setFormData({ ...formData, action: v as "confirm" | "refund" })}
                    disabled={isLoading}
                    className="grid grid-cols-2 gap-3"
                  >
                    <label
                      htmlFor="action-confirm"
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all",
                        formData.action === "confirm" 
                          ? "border-green-500 bg-green-50 dark:bg-green-950" 
                          : "border-gray-200 dark:border-gray-700 hover:border-green-300",
                        isLoading && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <RadioGroupItem value="confirm" id="action-confirm" disabled={isLoading} />
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <span className="font-medium">Xác nhận</span>
                      </div>
                    </label>
                    <label
                      htmlFor="action-refund"
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all",
                        formData.action === "refund" 
                          ? "border-red-500 bg-red-50 dark:bg-red-950" 
                          : "border-gray-200 dark:border-gray-700 hover:border-red-300",
                        isLoading && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <RadioGroupItem value="refund" id="action-refund" disabled={isLoading} />
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-5 w-5 text-red-600" />
                        <span className="font-medium">Refund</span>
                      </div>
                    </label>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Conditional Content based on Action */}
              {formData.action === "confirm" ? (
                <div className="space-y-5">
                  {/* NEW: New Deadline field for overdue briefs */}
                  {isOverdue && (
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm">
                        <CalendarIcon className="h-4 w-4 text-red-600" />
                        Deadline mới
                        <span className="text-red-500">*</span>
                        <Badge variant="destructive" className="text-[10px] ml-2">Bắt buộc</Badge>
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Brief đã quá hạn. Vui lòng đặt deadline mới để tiếp tục.
                      </p>
                      <Input
                        type="date"
                        value={formData.newDeadline}
                        onChange={(e) => setFormData({ ...formData, newDeadline: e.target.value })}
                        min={format(new Date(), "yyyy-MM-dd")}
                        disabled={isLoading}
                        className={cn(
                          "bg-white dark:bg-gray-900",
                          !formData.newDeadline && "border-red-500 focus-visible:ring-red-500"
                        )}
                      />
                      {formData.newDeadline && (
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Deadline mới: {format(new Date(formData.newDeadline), "dd/MM/yyyy")}
                        </p>
                      )}
                      {!formData.newDeadline && (
                        <p className="text-xs text-red-600 flex items-center gap-1">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          Vui lòng chọn deadline mới
                        </p>
                      )}
                    </div>
                  )}

                  {/* Lead Objective */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm">
                      <Target className="h-4 w-4 text-blue-600" />
                      Mục tiêu cụ thể cho team
                    </Label>
                    <Textarea
                      placeholder="Nhập mục tiêu chi tiết, hướng dẫn thực hiện...&#10;VD: Tạo 3 concepts khác nhau, focus vào USP mới, deadline nội bộ 25/01"
                      value={formData.leadObjective}
                      onChange={(e) => setFormData({ ...formData, leadObjective: e.target.value })}
                      rows={3}
                      disabled={isLoading}
                      className="resize-none bg-white dark:bg-gray-900"
                    />
                  </div>

                  {/* Assignee Selection */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-blue-600" />
                      Phân công người thực hiện
                      <span className="text-red-500">*</span>
                    </Label>
                    <AssigneeSelector
                      selectedIds={formData.assignedTo}
                      onChange={(ids) => setFormData({ ...formData, assignedTo: ids })}
                      teamMembers={teamMembers}
                      disabled={isLoading}
                    />
                    {formData.assignedTo.length > 0 && (
                      <p className="text-xs text-blue-600">
                        ✓ Đã chọn {formData.assignedTo.length} người
                      </p>
                    )}
                  </div>

                  {/* Priority Selection */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm">
                      <Flag className="h-4 w-4 text-blue-600" />
                      Độ ưu tiên
                    </Label>
                    <PrioritySelector
                      value={formData.priority}
                      onChange={(v) => setFormData({ ...formData, priority: v })}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              ) : (
                /* Refund Section */
                <div className="space-y-4">
                  {/* Warning */}
                  <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-red-700 dark:text-red-300">Lưu ý khi Refund</p>
                      <p className="text-red-600 dark:text-red-400 mt-1">
                        Brief sẽ được trả về cho UA Team ({brief.createdBy}). Họ có thể chỉnh sửa và gửi lại.
                      </p>
                    </div>
                  </div>

                  {/* Refund Reason */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm">
                      <RefreshCw className="h-4 w-4 text-red-600" />
                      Lý do refund
                      <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      placeholder="Nhập lý do trả lại brief chi tiết để UA Team có thể chỉnh sửa...&#10;VD: Timeline quá gấp, thiếu thông tin target audience, KPIs không khả thi..."
                      value={formData.refundReason}
                      onChange={(e) => setFormData({ ...formData, refundReason: e.target.value })}
                      rows={6}
                      disabled={isLoading}
                      className="resize-none bg-white dark:bg-gray-900"
                    />
                    {formData.refundReason.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {formData.refundReason.length} ký tự
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 border-t bg-gray-50 dark:bg-gray-900">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isLoading || !canSubmit}
            className={cn(
              "min-w-[140px]",
              formData.action === "refund" 
                ? "bg-red-600 hover:bg-red-700" 
                : "bg-green-600 hover:bg-green-700",
              !canSubmit && "opacity-50 cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : formData.action === "confirm" ? (
              <CheckCircle2 className="h-4 w-4 mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {formData.action === "confirm" ? "Xác nhận Brief" : "Refund Brief"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmBriefModal
