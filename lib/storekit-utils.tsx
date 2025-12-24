import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Clock,
  Send,
  Palette,
  FileCheck,
  Loader2,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Rocket,
  History,
} from "lucide-react"

export const getStatusBadge = (status: string) => {
  const statusConfig: Record<string, { label: string; className: string; icon: any; tooltip: string }> = {
    draft: {
      label: "Draft",
      className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
      icon: Clock,
      tooltip: "Mới tạo, chưa gửi yêu cầu",
    },
    sent_to_design: {
      label: "Sent to Design",
      className: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      icon: Send,
      tooltip: "Đã gửi order, Design nhận yêu cầu",
    },
    design_in_progress: {
      label: "Design in Progress",
      className: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
      icon: Palette,
      tooltip: "Design đang xử lý",
    },
    design_completed: {
      label: "Design Completed",
      className: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
      icon: FileCheck,
      tooltip: "Đã có bộ ảnh; ASO cần test",
    },
    aso_testing: {
      label: "ASO Testing",
      className: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300",
      icon: Loader2,
      tooltip: "Đang test A/B hoặc đánh giá hiệu suất",
    },
    need_redesign: {
      label: "Need Redesign",
      className: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
      icon: RotateCcw,
      tooltip: "ASO yêu cầu Design làm lại",
    },
    pending_lead_review: {
      label: "Pending Lead Review",
      className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
      icon: AlertCircle,
      tooltip: "ASO thấy ổn → chuyển Lead duyệt",
    },
    approved: {
      label: "Approved",
      className: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      icon: CheckCircle2,
      tooltip: "Lead duyệt, sẵn sàng publish",
    },
    rejected: {
      label: "Rejected",
      className: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
      icon: XCircle,
      tooltip: "Lead không duyệt, có lý do",
    },
    published: {
      label: "Published",
      className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
      icon: Rocket,
      tooltip: "Đã push lên store",
    },
    previously_published: {
      label: "Last Public",
      className: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
      icon: History,
      tooltip: "Phiên bản công khai trước đó, có phiên bản mới hơn đang active",
    },
  }

  const config = statusConfig[status] || statusConfig.draft
  const Icon = config.icon

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="secondary" className={`${config.className} cursor-help`}>
            <Icon className="h-3 w-3 mr-1" />
            {config.label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{config.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
