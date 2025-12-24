"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  CheckCircle2,
  XCircle,
  RefreshCw,
  AlertTriangle,
  MessageSquare,
  Target,
  FileText,
  Play,
  Wrench,
  Loader2,
  Send,
  Upload,
  UserPlus,
  Image,
  X,
  Users,
  Palette,
} from "lucide-react"
import { format, isAfter, isBefore, addDays } from "date-fns"
import { StatusBadge, PriorityBadge } from "./BriefCard"
import type { Brief, TeamMember } from "../types"
import { useState, useEffect, useRef } from "react"
import { RefundModal } from "./RefundModal"
import { LinkedConceptsSection } from "./LinkedConceptsSection"
import { CreateConceptFromBriefModal } from "./CreateConceptFromBriefModal"
import { toast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

// ============================================
// SIMPLIFIED PROPS - No role complexity
// ============================================
interface BriefDetailProps {
  brief: Brief | null
  teamMembers: TeamMember[]
  currentUserId?: string
  onApprove: () => void
  onReject: () => void
  onComplete: () => void
  onStartWork: () => void
  onMarkFixed: () => void
  isUpdating?: boolean
  // NEW: Concept integration
  onCreateConceptFromBrief?: (data: { title: string; description: string; tags: string[] }) => void
}

// ============================================
// BRIEF DETAIL COMPONENT
// ============================================
export function BriefDetail({
  brief,
  teamMembers,
  currentUserId,
  onApprove,
  onReject,
  onComplete,
  onStartWork,
  onMarkFixed,
  isUpdating = false,
  onCreateConceptFromBrief,
}: BriefDetailProps) {
  // Empty state
  if (!brief) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <FileText className="h-12 w-12 mb-4 opacity-30" />
        <p className="text-lg font-medium">Chọn brief để xem chi tiết</p>
        <p className="text-sm">Danh sách briefs ở bên trái</p>
      </div>
    )
  }

  const getAssigneeInfo = (id: string) => teamMembers.find(m => m.id === id)

  const [showRefundModal, setShowRefundModal] = useState(false)
  const [showCreateConceptModal, setShowCreateConceptModal] = useState(false)
  const [isRefunded, setIsRefunded] = useState(brief.status === "returned_to_ua")
  const [loading, setLoading] = useState(false)

  // --- TEMP: Mock submitBriefApi if not available ---
  async function submitBriefApi(brief: Brief): Promise<{ success: boolean; message?: string }> {
    await new Promise(res => setTimeout(res, 800))
    return { success: true }
  }

  // Cleanup loading state on unmount (prevents floating button)
  useEffect(() => {
    return () => {
      setLoading(false)
    }
  }, [])

  // Only set refunded after API confirms
  const handleRefundSuccess = () => {
    setIsRefunded(true)
    toast({ title: "Refund thành công", description: "Brief đã được refund." })
  }

  // Reset refund state on modal close
  const handleRefundModalClose = () => {
    setShowRefundModal(false)
    setLoading(false)
  }

  // --- Overdue Brief Return-to-UA Modal State ---
  const [showReturnToUAModal, setShowReturnToUAModal] = useState(false)
  const [returnReason, setReturnReason] = useState("")
  const [returnDeadline, setReturnDeadline] = useState("")
  const [returnLoading, setReturnLoading] = useState(false)
  const [returnError, setReturnError] = useState<string | null>(null)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const cancelBtnRef = useRef<HTMLButtonElement>(null)

  // --- Per-brief local state ---
  // Use brief.id as key to avoid affecting other briefs
  const [briefLocalState, setBriefLocalState] = useState<{
    [briefId: string]: {
      isReturnedToUA: boolean
      pendingNewDeadline: string | null
      briefStatus: string
      briefDeadline: string
      originalStatus: string | null  // Track status before returning to UA
    }
  }>({})

  // Initialize local state for this brief if not present
  useEffect(() => {
    if (!brief) return
    setBriefLocalState(prev => {
      if (prev[brief.id]) return prev
      return {
        ...prev,
        [brief.id]: {
          isReturnedToUA: false,
          pendingNewDeadline: null,
          briefStatus: brief.status,
          briefDeadline: brief.deadline,
          originalStatus: null,
        }
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brief?.id])

  // Helper to get/set state for current brief
  const getBriefState = () => briefLocalState[brief.id] || {
    isReturnedToUA: false,
    pendingNewDeadline: null,
    briefStatus: brief.status,
    briefDeadline: brief.deadline,
    originalStatus: null,
  }
  const setBriefState = (patch: Partial<{
    isReturnedToUA: boolean
    pendingNewDeadline: string | null
    briefStatus: string
    briefDeadline: string
    originalStatus: string | null
  }>) => {
    setBriefLocalState(prev => ({
      ...prev,
      [brief.id]: {
        ...getBriefState(),
        ...patch,
      }
    }))
  }

  // Use local state for this brief
  const isReturnedToUA = getBriefState().isReturnedToUA
  const pendingNewDeadline = getBriefState().pendingNewDeadline
  const briefStatus = getBriefState().briefStatus
  const briefDeadline = getBriefState().briefDeadline
  const originalStatus = getBriefState().originalStatus

  // Helper: isOverdue - check for all non-completed/refunded statuses
  const isOverdue = (() => {
    if (!briefDeadline) return false
    const deadline = new Date(briefDeadline)
    // Brief is overdue if deadline passed and status is not completed/refunded
    return isBefore(deadline, new Date()) &&
      !["completed", "returned_to_ua"].includes(briefStatus)
  })()
  const daysOverdue = (() => {
    if (!briefDeadline) return 0
    const deadline = new Date(briefDeadline)
    const now = new Date()
    const diff = Math.floor((now.getTime() - deadline.getTime()) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : 0
  })()

  // --- TEMP: Mock API for returning brief to UA ---
  async function returnBriefToUA({ briefId, requestedDeadline, reason }: { briefId: string, requestedDeadline: string, reason: string }) {
    await new Promise(res => setTimeout(res, 800))
    // Save original status before returning to UA, then update state
    const currentStatus = getBriefState().briefStatus
    setBriefState({
      isReturnedToUA: true,
      briefStatus: "returned_to_ua",
      pendingNewDeadline: requestedDeadline,
      originalStatus: currentStatus,  // Save the original status
    })
    return { status: "RETURNED_TO_UA", notificationSent: true, updatedAt: new Date().toISOString() }
  }
  async function notifyUATeam(briefId: string) {
    await new Promise(res => setTimeout(res, 200))
    return true
  }

  // --- UA Team confirm with new deadline (simulate) ---
  const handleUAConfirm = async () => {
    if (!pendingNewDeadline) return
    // Restore the original status (before returning to UA) with the new deadline
    const statusToRestore = originalStatus || brief.status
    setBriefState({
      briefStatus: statusToRestore,  // Restore original status
      briefDeadline: pendingNewDeadline,
      isReturnedToUA: false,
      pendingNewDeadline: null,
      originalStatus: null,  // Clear original status
    })
    toast({
      title: "UA Team đã xác nhận deadline mới",
      description: `Brief đã trở lại trạng thái trước đó với deadline mới.`
    })
  }

  // --- Handle Send Brief (overdue workflow) ---
  const handleSendBrief = async () => {
    if (isOverdue) {
      setShowReturnToUAModal(true)
      return
    }
    setLoading(true)
    submitBriefApi(brief)
      .then((res: { success: boolean; message?: string }) => {
        if (res.success) {
          toast({ title: "Gửi brief thành công" })
        } else {
          toast({ variant: "destructive", title: "Lỗi", description: res.message || "Gửi brief thất bại." })
        }
      })
      .catch(() => {
        toast({ variant: "destructive", title: "Lỗi", description: "Có lỗi xảy ra khi gửi brief." })
      })
      .finally(() => setLoading(false))
  }

  // --- Handle Return-to-UA Modal Submit ---
  const handleReturnToUASubmit = async () => {
    setReturnError(null)
    if (!returnDeadline || !isAfter(new Date(returnDeadline), new Date())) {
      setReturnError("Vui lòng chọn deadline mới hợp lệ (sau hôm nay).")
      return
    }
    if (!returnReason || returnReason.trim().length < 10) {
      setReturnError("Vui lòng nhập lý do (tối thiểu 10 ký tự).")
      return
    }
    setReturnLoading(true)
    try {
      await returnBriefToUA({
        briefId: brief.id,
        requestedDeadline: returnDeadline,
        reason: returnReason,
      })
      await notifyUATeam(brief.id)
      toast({
        title: "Đã trả về UA Team",
        description: "Brief đã được chuyển sang trạng thái 'Trả về UA'. Chờ UA Team xác nhận deadline mới.",
        variant: "default"
      })
      setShowReturnToUAModal(false)
      setReturnReason("")
      setReturnDeadline("")
    } catch (e) {
      setReturnError("Có lỗi xảy ra, vui lòng thử lại.")
    } finally {
      setReturnLoading(false)
    }
  }

  // --- Handle Cancel Button in Return-to-UA Modal ---
  const handleCancelClick = () => {
    if (returnReason.trim() !== "" || returnDeadline.trim() !== "") {
      setShowCancelConfirm(true)
    } else {
      setShowReturnToUAModal(false)
      setReturnError(null)
      setReturnReason("")
      setReturnDeadline("")
    }
  }

  const handleCancelConfirm = () => {
    setShowCancelConfirm(false)
    setShowReturnToUAModal(false)
    setReturnError(null)
    setReturnReason("")
    setReturnDeadline("")
  }

  const handleCancelAbort = () => {
    setShowCancelConfirm(false)
    // Restore focus to Cancel button for accessibility
    setTimeout(() => cancelBtnRef.current?.focus(), 0)
  }

  // State for "Đã sửa xong" confirmation popup
  const [showFixedConfirm, setShowFixedConfirm] = useState(false)
  const [fixedNote, setFixedNote] = useState("")
  const [fixedLoading, setFixedLoading] = useState(false)
  const [fixedError, setFixedError] = useState<string | null>(null)

  // Handler for "Đã sửa xong" button
  const handleMarkFixedClick = () => {
    setShowFixedConfirm(true)
    setFixedNote("")
    setFixedError(null)
  }

  // Handler for confirm in popup
  const handleFixedConfirm = async () => {
    if (!fixedNote.trim() || fixedNote.trim().length < 5) {
      setFixedError("Vui lòng nhập nội dung đã sửa (tối thiểu 5 ký tự).")
      return
    }
    setFixedLoading(true)
    try {
      // Call the original onMarkFixed, but you may want to pass fixedNote to backend
      await onMarkFixed()
      setShowFixedConfirm(false)
      setFixedNote("")
      setFixedError(null)
      // Optionally show a toast here
      toast({ title: "Đã xác nhận sửa xong", description: "Brief đã chuyển sang trạng thái tiếp theo." })
    } catch (e) {
      setFixedError("Có lỗi xảy ra, vui lòng thử lại.")
    } finally {
      setFixedLoading(false)
    }
  }

  // State for "Chỉnh sửa lại" popup (Lead Creative yêu cầu sửa)
  const [showNeedFixModal, setShowNeedFixModal] = useState(false)
  const [needFixNote, setNeedFixNote] = useState("")
  const [needFixImages, setNeedFixImages] = useState<File[]>([])
  const [needFixLoading, setNeedFixLoading] = useState(false)
  const [needFixError, setNeedFixError] = useState<string | null>(null)

  // State for "Gửi Lead Creative duyệt" (member gửi duyệt)
  const [showSendForReview, setShowSendForReview] = useState(false)
  const [sendReviewLoading, setSendReviewLoading] = useState(false)

  // State for "Hoàn thành gửi sang UA" (Lead Creative duyệt hoàn thành)
  const [showCompleteToUA, setShowCompleteToUA] = useState(false)
  const [completeToUALoading, setCompleteToUALoading] = useState(false)

  // State for "Đang xử lý" popup - show processing overview
  const [showProcessingModal, setShowProcessingModal] = useState(false)
  const [processingLoading, setProcessingLoading] = useState(false)

  // State for "Đang thực hiện..." popup (for Lead - show who is working)
  const [showInProgressInfo, setShowInProgressInfo] = useState(false)

  // State for "Gửi sản phẩm hoàn thành" popup (for assigned Member)
  const [showSendComplete, setShowSendComplete] = useState(false)
  const [sendCompleteLoading, setSendCompleteLoading] = useState(false)

  // State for "Chuyển UA Nghiệm Thu" popup (for confirmed briefs)
  const [showSendToUAReview, setShowSendToUAReview] = useState(false)
  const [sendToUAReviewLoading, setSendToUAReviewLoading] = useState(false)
  const [sendToUASuccess, setSendToUASuccess] = useState(false)

  // State for viewing attachment in lightbox
  const [viewingAttachment, setViewingAttachment] = useState<{ url: string; name: string; type: string } | null>(null)

  // State for "Nhận Brief" popup (Lead nhận và phân công)
  const [showAcceptBriefModal, setShowAcceptBriefModal] = useState(false)
  const [acceptBriefMode, setAcceptBriefMode] = useState<"assign" | "design">("assign")
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [designRequirements, setDesignRequirements] = useState("")
  const [designFiles, setDesignFiles] = useState<File[]>([])
  const [acceptBriefLoading, setAcceptBriefLoading] = useState(false)
  const [acceptBriefError, setAcceptBriefError] = useState<string | null>(null)

  // Handler: Nhận Brief - Phân công member
  const handleAcceptBriefAssign = async () => {
    if (selectedMembers.length === 0) {
      setAcceptBriefError("Vui lòng chọn ít nhất 1 thành viên để phân công.")
      return
    }
    setAcceptBriefLoading(true)
    try {
      setBriefState({ briefStatus: "confirmed" })
      toast({ title: "Đã nhận Brief", description: `Brief đã được phân công cho ${selectedMembers.length} thành viên.` })
      setShowAcceptBriefModal(false)
      setSelectedMembers([])
      setAcceptBriefError(null)
    } finally {
      setAcceptBriefLoading(false)
    }
  }

  // Handler: Nhận Brief - Gửi sang Design
  const handleAcceptBriefDesign = async () => {
    if (!designRequirements.trim() || designRequirements.trim().length < 10) {
      setAcceptBriefError("Vui lòng nhập yêu cầu thiết kế (tối thiểu 10 ký tự).")
      return
    }
    setAcceptBriefLoading(true)
    try {
      setBriefState({ briefStatus: "waiting_design" })
      toast({ title: "Đã gửi yêu cầu thiết kế", description: "Brief đã được chuyển sang team Design." })
      setShowAcceptBriefModal(false)
      setDesignRequirements("")
      setDesignFiles([])
      setAcceptBriefError(null)
    } finally {
      setAcceptBriefLoading(false)
    }
  }

  // Handler: File upload for design requirements
  const handleDesignFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDesignFiles([...designFiles, ...Array.from(e.target.files)])
    }
  }
  const handleDesignFileRemove = (idx: number) => {
    setDesignFiles(designFiles.filter((_, i) => i !== idx))
  }

  // Toggle member selection
  const toggleMemberSelection = (memberId: string) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    )
  }

  // Handler: Member gửi Lead Creative duyệt
  const handleSendForReview = async () => {
    setSendReviewLoading(true)
    try {
      // Call API to set status to "review"
      setBriefState({ briefStatus: "review" })
      toast({ title: "Đã gửi Lead Creative duyệt", description: "Brief đang chờ Lead Creative duyệt hoàn thành." })
      setShowSendForReview(false)
    } finally {
      setSendReviewLoading(false)
    }
  }

  // Handler: Member gửi sản phẩm hoàn thành (chuyển sang waiting_lead_review)
  const handleSendComplete = async () => {
    setSendCompleteLoading(true)
    try {
      // Call API to set status to "waiting_lead_review"
      setBriefState({ briefStatus: "waiting_lead_review" })
      toast({ title: "Đã gửi sản phẩm hoàn thành", description: "Brief đang chờ Lead duyệt." })
      setShowSendComplete(false)
    } finally {
      setSendCompleteLoading(false)
    }
  }

  // Handler: Lead Creative duyệt hoàn thành gửi UA
  const handleCompleteToUA = async () => {
    setCompleteToUALoading(true)
    try {
      // Call API to set status to "completed"
      setBriefState({ briefStatus: "completed" })
      toast({ title: "Brief đã hoàn thành", description: "Brief đã được gửi sang UA Team." })
      setShowCompleteToUA(false)
    } finally {
      setCompleteToUALoading(false)
    }
  }

  // Handler: Chuyển Brief sang UA nghiệm thu (từ confirmed -> waiting_ua_review)
  const handleSendToUAReview = async () => {
    setSendToUAReviewLoading(true)
    try {
      // Call API to set status to "waiting_ua_review"
      setBriefState({ briefStatus: "waiting_ua_review" })
      setSendToUASuccess(true)
      toast({ title: "Đã gửi sang UA Team", description: "Brief đang chờ UA Team nghiệm thu." })
    } finally {
      setSendToUAReviewLoading(false)
    }
  }

  // Handler: Lead Creative yêu cầu chỉnh sửa lại
  const handleNeedFix = async () => {
    if (!needFixNote.trim() || needFixNote.trim().length < 5) {
      setNeedFixError("Vui lòng nhập nội dung cần chỉnh sửa (tối thiểu 5 ký tự).")
      return
    }
    setNeedFixLoading(true)
    try {
      // Call API to set status to "need_revision" and save note/images
      setBriefState({ briefStatus: "need_revision" })
      toast({ title: "Đã gửi yêu cầu chỉnh sửa", description: "Brief đã quay lại trạng thái chờ xử lý." })
      setShowNeedFixModal(false)
      setNeedFixNote("")
      setNeedFixImages([])
      setNeedFixError(null)
    } finally {
      setNeedFixLoading(false)
    }
  }

  // Handler: Upload images for need fix
  const handleNeedFixImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNeedFixImages([...needFixImages, ...Array.from(e.target.files)])
    }
  }
  const handleNeedFixImageRemove = (idx: number) => {
    setNeedFixImages(needFixImages.filter((_, i) => i !== idx))
  }

  // Status-based action rendering - NO role checks
  const renderActions = () => {
    switch (briefStatus) {
      case "pending": // Chờ nhận - Lead cần nhận Brief
        return (
          <Button onClick={() => { setShowAcceptBriefModal(true); setAcceptBriefMode("assign"); setAcceptBriefError(null); }} disabled={isUpdating}>
            {isUpdating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <UserPlus className="h-4 w-4 mr-2" />}
            Nhận Brief
          </Button>
        )
      case "confirmed": // Đã xác nhận - Chuyển UA nghiệm thu
        return (
          <Button onClick={() => { setShowSendToUAReview(true); setSendToUASuccess(false); }} disabled={isUpdating}>
            {isUpdating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
            Chuyển UA Nghiệm Thu
          </Button>
        )
      case "in_progress": // Đang thực hiện
        // Check if current user is assigned to this brief
        const isAssignedMember = currentUserId && brief.assignedTo.includes(currentUserId)

        if (isAssignedMember) {
          // Member được phân công → Button gửi sản phẩm hoàn thành
          return (
            <Button onClick={() => setShowSendComplete(true)} disabled={isUpdating}>
              {isUpdating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
              Gửi sản phẩm hoàn thành
            </Button>
          )
        } else {
          // Lead hoặc người khác → Button thông báo đang thực hiện
          return (
            <Button variant="outline" onClick={() => setShowInProgressInfo(true)} disabled={isUpdating}>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Đang thực hiện...
            </Button>
          )
        }
      case "waiting_lead_review": // Chờ Lead duyệt - Lead duyệt Brief
        return (
          <div className="flex gap-2">
            <Button onClick={() => setShowCompleteToUA(true)} disabled={isUpdating}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Duyệt Brief
            </Button>
            <Button variant="outline" className="text-red-600 hover:text-red-700" onClick={() => setShowNeedFixModal(true)} disabled={isUpdating}>
              <Wrench className="h-4 w-4 mr-2" />
              Yêu cầu chỉnh sửa
            </Button>
          </div>
        )
      case "review": // Xác nhận Brief (Lead Creative duyệt hoặc trả lại)
        return (
          <div className="flex gap-2">
            <Button onClick={() => setShowCompleteToUA(true)} disabled={isUpdating}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Hoàn thành
            </Button>
            <Button variant="outline" className="text-red-600 hover:text-red-700" onClick={() => setShowNeedFixModal(true)} disabled={isUpdating}>
              <Wrench className="h-4 w-4 mr-2" />
              Đã trả lại
            </Button>
          </div>
        )
      case "completed": // Hoàn thành
        return null
      case "returned_to_ua": // Đã trả lại
        return null
      default:
        return null
    }
  }

  const hasActions = !["completed", "returned_to_ua"].includes(briefStatus)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b flex-shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-lg font-bold truncate">{brief.title}</h2>
            <p className="text-sm text-muted-foreground">{brief.appCampaign}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <StatusBadge status={brief.status} />
            <PriorityBadge priority={brief.priority} />
          </div>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Overdue Alert - moved to top */}
          {isOverdue && (
            <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded mb-4">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <span>
                Brief đã quá hạn <b>{daysOverdue} ngày</b>. Vui lòng trả về UA Team để xác nhận deadline mới.
              </span>
            </div>
          )}

          {/* Trạng thái "Trả về UA" */}
          {isReturnedToUA && (
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-2 rounded mb-4">
              <AlertTriangle className="h-5 w-5 text-blue-600" />
              <span>
                Brief đang ở trạng thái <b>Trả về UA</b>. Chờ UA Team xác nhận deadline mới: <b>{pendingNewDeadline && format(new Date(pendingNewDeadline), "dd/MM/yyyy")}</b>
              </span>
              <Button size="sm" variant="outline" className="ml-auto" onClick={handleUAConfirm}>
                UA xác nhận deadline mới
              </Button>
            </div>
          )}

          {/* Return Reason */}
          {brief.status === "returned_to_ua" && brief.returnReason && (
            <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-700 dark:text-red-300">Lý do trả về:</p>
                  <p className="text-sm text-red-600 dark:text-red-400">{brief.returnReason}</p>
                </div>
              </div>
            </div>
          )}

          {/* Section: Thông tin từ UA */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Thông tin Brief
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">App/Campaign</p>
                <p className="font-medium">{brief.appCampaign || "—"}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Region/Platform</p>
                <p className="font-medium">{brief.region || "—"} • {brief.platform}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Deadline</p>
                <p className="font-medium">{format(new Date(brief.deadline), "dd/MM/yyyy")}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Người tạo</p>
                <p className="font-medium">{brief.createdBy}</p>
              </div>
            </div>

            {/* KPI Targets */}
            {(brief.kpiTargets.ctr > 0 || brief.kpiTargets.cvr > 0 || brief.kpiTargets.cpi > 0 || brief.kpiTargets.roas > 0) && (
              <div className="mt-4">
                <p className="text-muted-foreground mb-2 text-sm">KPI Targets</p>
                <div className="grid grid-cols-4 gap-2">
                  {brief.kpiTargets.ctr > 0 && (
                    <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded text-center">
                      <p className="text-xs text-muted-foreground">CTR</p>
                      <p className="font-bold text-blue-600">{brief.kpiTargets.ctr}%</p>
                    </div>
                  )}
                  {brief.kpiTargets.cvr > 0 && (
                    <div className="p-2 bg-green-50 dark:bg-green-950 rounded text-center">
                      <p className="text-xs text-muted-foreground">CVR</p>
                      <p className="font-bold text-green-600">{brief.kpiTargets.cvr}%</p>
                    </div>
                  )}
                  {brief.kpiTargets.cpi > 0 && (
                    <div className="p-2 bg-purple-50 dark:bg-purple-950 rounded text-center">
                      <p className="text-xs text-muted-foreground">CPI</p>
                      <p className="font-bold text-purple-600">${brief.kpiTargets.cpi}</p>
                    </div>
                  )}
                  {brief.kpiTargets.roas > 0 && (
                    <div className="p-2 bg-orange-50 dark:bg-orange-950 rounded text-center">
                      <p className="text-xs text-muted-foreground">ROAS</p>
                      <p className="font-bold text-orange-600">{brief.kpiTargets.roas}x</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Requirements */}
            {brief.requirements && (
              <div className="mt-4">
                <p className="text-muted-foreground mb-2 text-sm">Yêu cầu chi tiết</p>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm whitespace-pre-wrap">
                  {brief.requirements}
                </div>
              </div>
            )}
          </div>

          {/* Section: Linked Concepts */}
          <Separator />
          <LinkedConceptsSection
            brief={brief}
            onCreateConcept={() => setShowCreateConceptModal(true)}
          />

          {/* Section: Lead Creative Info */}
          {!["draft", "pending", "returned_to_ua"].includes(brief.status) && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Thông tin thực hiện
                </h3>

                {brief.leadObjective && (
                  <div className="mb-4">
                    <p className="text-muted-foreground mb-1 text-sm">Mục tiêu cụ thể</p>
                    <p className="text-sm">{brief.leadObjective}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground mb-2 text-sm">Người thực hiện</p>
                    <div className="flex flex-wrap gap-2">
                      {brief.assignedTo.length > 0 ? (
                        brief.assignedTo.map((id) => {
                          const member = getAssigneeInfo(id)
                          return member ? (
                            <div key={id} className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-1">
                              <Avatar className="h-5 w-5">
                                <AvatarFallback className="text-[10px] bg-blue-100 text-blue-700">
                                  {member.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs">{member.name}</span>
                            </div>
                          ) : null
                        })
                      ) : (
                        <span className="text-sm text-muted-foreground">Chưa phân công</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-2 text-sm">Độ ưu tiên</p>
                    <PriorityBadge priority={brief.priority} />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Action Buttons - Status-based only */}
          {hasActions && !isReturnedToUA && (
            <div className="pt-4 border-t">
              {isOverdue ? (
                <Button
                  onClick={handleSendBrief}
                  disabled={loading || returnLoading || isReturnedToUA}
                >
                  {loading || returnLoading ? "Đang gửi..." : "Trả về UA Team"}
                </Button>
              ) : (
                renderActions()
              )}
            </div>
          )}

          {/* Completed/Returned message */}
          {!hasActions && (
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                {brief.status === "completed" && "✓ Brief đã hoàn thành"}
                {brief.status === "returned_to_ua" && "Brief đã trả về UA Team"}
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Returned Success Banner */}
      {isRefunded && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded mb-4">
          Brief đã được trả về UA Team.
        </div>
      )}

      {/* Return-to-UA Modal for Overdue Briefs */}
      <Dialog open={showReturnToUAModal} onOpenChange={open => { setShowReturnToUAModal(open); setReturnError(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Trả Brief về cho UA Team</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              Brief đã quá hạn <b>{daysOverdue} ngày</b> (deadline gốc: <b>{format(new Date(briefDeadline), "dd/MM/yyyy")}</b>).
              <br />
              Vui lòng đề xuất deadline mới và lý do trả về.
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">
                Deadline mới đề xuất <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={returnDeadline}
                min={format(addDays(new Date(), 1), "yyyy-MM-dd")}
                onChange={e => setReturnDeadline(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">
                Lý do <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={returnReason}
                onChange={e => setReturnReason(e.target.value)}
                placeholder="Vui lòng nhập lý do trả brief về UA Team..."
                rows={3}
              />
            </div>
            {returnError && <div className="text-red-600 text-xs">{returnError}</div>}
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={handleCancelClick}
              disabled={returnLoading}
              ref={cancelBtnRef}
            >
              Hủy
            </Button>
            <Button onClick={handleReturnToUASubmit} disabled={returnLoading}>
              {returnLoading ? "Đang gửi..." : "Gửi về UA Team"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Cancel Dialog */}
      <Dialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận hủy thao tác?</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground mb-4">
            Bạn đã nhập thông tin vào form. Nếu bạn hủy, mọi thông tin sẽ không được lưu.<br />
            Bạn có chắc chắn muốn hủy thao tác này?
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelAbort}>
              Quay lại
            </Button>
            <Button variant="destructive" onClick={handleCancelConfirm}>
              Xác nhận hủy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Refund Modal */}
      {showRefundModal && (
        <RefundModal
          brief={brief}
          onClose={handleRefundModalClose}
          onRefundSuccess={handleRefundSuccess}
        />
      )}

      {/* Create Concept from Brief Modal */}
      <CreateConceptFromBriefModal
        open={showCreateConceptModal}
        onOpenChange={setShowCreateConceptModal}
        brief={brief}
        onSubmit={(data) => {
          if (onCreateConceptFromBrief) {
            onCreateConceptFromBrief(data)
          }
        }}
      />

      {/* Popup: Member gửi Lead Creative duyệt */}
      <Dialog open={showSendForReview} onOpenChange={setShowSendForReview}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gửi Lead Creative duyệt</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground mb-4">
            Bạn xác nhận đã hoàn thành chỉnh sửa và muốn gửi Lead Creative duyệt Brief này?
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowSendForReview(false)} disabled={sendReviewLoading}>
              Hủy
            </Button>
            <Button onClick={handleSendForReview} disabled={sendReviewLoading}>
              {sendReviewLoading ? "Đang gửi..." : "Gửi duyệt"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Popup: Lead Creative duyệt hoàn thành gửi UA */}
      <Dialog open={showCompleteToUA} onOpenChange={setShowCompleteToUA}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận hoàn thành Brief</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground mb-4">
            Bạn xác nhận Brief đã hoàn thành và muốn gửi sang UA Team?
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowCompleteToUA(false)} disabled={completeToUALoading}>
              Hủy
            </Button>
            <Button onClick={handleCompleteToUA} disabled={completeToUALoading}>
              {completeToUALoading ? "Đang gửi..." : "Gửi UA Team"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Popup: Member gửi sản phẩm hoàn thành */}
      <Dialog open={showSendComplete} onOpenChange={setShowSendComplete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gửi sản phẩm hoàn thành</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground mb-4">
            Bạn xác nhận đã hoàn thành sản phẩm và muốn gửi cho Lead duyệt?
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowSendComplete(false)} disabled={sendCompleteLoading}>
              Hủy
            </Button>
            <Button onClick={handleSendComplete} disabled={sendCompleteLoading}>
              {sendCompleteLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
              {sendCompleteLoading ? "Đang gửi..." : "Gửi sản phẩm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Popup: Lead xem thông tin Brief đang thực hiện */}
      <Dialog open={showInProgressInfo} onOpenChange={setShowInProgressInfo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
              Brief đang được thực hiện
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Brief này đang được thực hiện bởi:
            </p>
            <div className="flex flex-wrap gap-2">
              {brief.assignedTo.map((id) => {
                const member = getAssigneeInfo(id)
                return member ? (
                  <div key={id} className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-full px-3 py-1.5">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                        {member.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{member.name}</span>
                  </div>
                ) : null
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              Vui lòng chờ thành viên hoàn thành và gửi sản phẩm để duyệt.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowInProgressInfo(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Popup: Chuyển UA Nghiệm Thu - Hiển thị thông tin sản phẩm hoàn thành */}
      <Dialog open={showSendToUAReview} onOpenChange={(open) => { setShowSendToUAReview(open); if (!open) setSendToUASuccess(false); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-blue-600" />
              {sendToUASuccess ? "Đã gửi sang UA Team" : "Chuyển UA Nghiệm Thu"}
            </DialogTitle>
          </DialogHeader>

          {sendToUASuccess ? (
            // Success state
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <div>
                <p className="text-lg font-semibold text-green-700 dark:text-green-400">Đã gửi thành công!</p>
                <p className="text-sm text-muted-foreground mt-1">Brief đã được chuyển sang UA Team nghiệm thu.</p>
              </div>
              <DialogFooter className="justify-center">
                <Button onClick={() => setShowSendToUAReview(false)}>
                  Đóng
                </Button>
              </DialogFooter>
            </div>
          ) : (
            // Review info before sending
            <div className="space-y-4">
              {/* Brief Info */}
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-1">{brief.title}</h4>
                <p className="text-sm text-muted-foreground">{brief.appCampaign}</p>
              </div>

              {/* Product Info Summary */}
              <div className="space-y-3">
                <p className="text-sm font-medium">Thông tin sản phẩm hoàn thành:</p>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Deadline</p>
                    <p className="font-medium">{format(new Date(brief.deadline), "dd/MM/yyyy")}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Độ ưu tiên</p>
                    <PriorityBadge priority={brief.priority} />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Region</p>
                    <p className="font-medium">{brief.region || "—"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Platform</p>
                    <p className="font-medium">{brief.platform}</p>
                  </div>
                </div>

                {/* Assignees */}
                {brief.assignedTo.length > 0 && (
                  <div>
                    <p className="text-muted-foreground text-xs mb-2">Người thực hiện</p>
                    <div className="flex flex-wrap gap-2">
                      {brief.assignedTo.map((id) => {
                        const member = getAssigneeInfo(id)
                        return member ? (
                          <div key={id} className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 rounded-full px-2.5 py-1">
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="text-[10px] bg-blue-100 text-blue-700">
                                {member.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-medium">{member.name}</span>
                          </div>
                        ) : null
                      })}
                    </div>
                  </div>
                )}

                {/* Attachments - Hiển thị chi tiết từng file */}
                {brief.attachments && brief.attachments.length > 0 && (
                  <div>
                    <p className="text-muted-foreground text-xs mb-2">Tệp đính kèm ({brief.attachments.length})</p>
                    <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                      {brief.attachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className="relative group cursor-pointer rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-400 transition-colors"
                          onClick={() => setViewingAttachment({ url: attachment.url, name: attachment.name, type: attachment.type })}
                        >
                          {attachment.type === "image" ? (
                            <img
                              src={attachment.url}
                              alt={attachment.name}
                              className="w-full h-16 object-cover"
                            />
                          ) : attachment.type === "video" ? (
                            <div className="w-full h-16 bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
                              <Play className="h-6 w-6 text-purple-600" />
                            </div>
                          ) : attachment.type === "pdf" ? (
                            <div className="w-full h-16 bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
                              <FileText className="h-6 w-6 text-red-600" />
                            </div>
                          ) : (
                            <div className="w-full h-16 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                              <FileText className="h-6 w-6 text-gray-500" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-[10px] text-center px-1 truncate">{attachment.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* KPI Targets */}
                {(brief.kpiTargets.ctr > 0 || brief.kpiTargets.cvr > 0 || brief.kpiTargets.cpi > 0 || brief.kpiTargets.roas > 0) && (
                  <div>
                    <p className="text-muted-foreground text-xs mb-2">KPI Targets</p>
                    <div className="grid grid-cols-4 gap-2">
                      {brief.kpiTargets.ctr > 0 && (
                        <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded text-center">
                          <p className="text-[10px] text-muted-foreground">CTR</p>
                          <p className="font-bold text-blue-600 text-sm">{brief.kpiTargets.ctr}%</p>
                        </div>
                      )}
                      {brief.kpiTargets.cvr > 0 && (
                        <div className="p-2 bg-green-50 dark:bg-green-950 rounded text-center">
                          <p className="text-[10px] text-muted-foreground">CVR</p>
                          <p className="font-bold text-green-600 text-sm">{brief.kpiTargets.cvr}%</p>
                        </div>
                      )}
                      {brief.kpiTargets.cpi > 0 && (
                        <div className="p-2 bg-purple-50 dark:bg-purple-950 rounded text-center">
                          <p className="text-[10px] text-muted-foreground">CPI</p>
                          <p className="font-bold text-purple-600 text-sm">${brief.kpiTargets.cpi}</p>
                        </div>
                      )}
                      {brief.kpiTargets.roas > 0 && (
                        <div className="p-2 bg-orange-50 dark:bg-orange-950 rounded text-center">
                          <p className="text-[10px] text-muted-foreground">ROAS</p>
                          <p className="font-bold text-orange-600 text-sm">{brief.kpiTargets.roas}x</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="ghost" onClick={() => setShowSendToUAReview(false)} disabled={sendToUAReviewLoading}>
                  Hủy
                </Button>
                <Button onClick={handleSendToUAReview} disabled={sendToUAReviewLoading}>
                  {sendToUAReviewLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                  {sendToUAReviewLoading ? "Đang gửi..." : "Xác nhận gửi UA"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Popup: Lead Creative yêu cầu chỉnh sửa lại */}
      <Dialog open={showNeedFixModal} onOpenChange={setShowNeedFixModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yêu cầu chỉnh sửa lại Brief</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              Nhập nội dung cần chỉnh sửa và (tuỳ chọn) thêm ảnh mô tả.
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">
                Nội dung cần chỉnh sửa <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={needFixNote}
                onChange={e => setNeedFixNote(e.target.value)}
                placeholder="Mô tả các nội dung cần chỉnh sửa..."
                rows={4}
              />
              {needFixError && <div className="text-red-600 text-xs mt-1">{needFixError}</div>}
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 flex items-center gap-1">
                Ảnh mô tả (tùy chọn)
                <Upload className="h-4 w-4" />
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                className="block w-full text-xs"
                onChange={handleNeedFixImageUpload}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {needFixImages.map((file, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`img-${idx}`}
                      className="w-16 h-16 object-cover rounded border"
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-0.5 text-xs opacity-80 hover:opacity-100"
                      onClick={() => handleNeedFixImageRemove(idx)}
                      tabIndex={-1}
                    >×</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowNeedFixModal(false)} disabled={needFixLoading}>
              Hủy
            </Button>
            <Button onClick={handleNeedFix} disabled={needFixLoading}>
              {needFixLoading ? "Đang gửi..." : "Gửi yêu cầu chỉnh sửa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Đã sửa xong - Xác nhận nội dung đã sửa */}
      <Dialog open={showFixedConfirm} onOpenChange={setShowFixedConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận nội dung đã sửa</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              Vui lòng nhập các nội dung đã chỉnh sửa trước khi xác nhận chuyển trạng thái.
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">
                Nội dung đã sửa <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={fixedNote}
                onChange={e => setFixedNote(e.target.value)}
                placeholder="Mô tả các nội dung đã chỉnh sửa..."
                rows={4}
              />
              {fixedError && <div className="text-red-600 text-xs mt-1">{fixedError}</div>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowFixedConfirm(false)} disabled={fixedLoading}>
              Hủy
            </Button>
            <Button onClick={handleFixedConfirm} disabled={fixedLoading}>
              {fixedLoading ? "Đang xác nhận..." : "Xác nhận sửa xong"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Đang xử lý - Processing Overview Modal */}
      <Dialog open={showProcessingModal} onOpenChange={setShowProcessingModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-blue-600" />
              Xác nhận bắt đầu xử lý Brief
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Brief Info */}
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">{brief.title}</h4>
              <p className="text-sm text-muted-foreground">{brief.appCampaign}</p>
            </div>

            {/* Overview Info */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground text-xs mb-1">Deadline</p>
                <p className="font-medium">{format(new Date(brief.deadline), "dd/MM/yyyy")}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">Độ ưu tiên</p>
                <PriorityBadge priority={brief.priority} />
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">Region</p>
                <p className="font-medium">{brief.region || "—"}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">Platform</p>
                <p className="font-medium">{brief.platform}</p>
              </div>
            </div>

            {/* Assignees */}
            {brief.assignedTo.length > 0 && (
              <div>
                <p className="text-muted-foreground text-xs mb-2">Người thực hiện</p>
                <div className="flex flex-wrap gap-2">
                  {brief.assignedTo.map((id) => {
                    const member = getAssigneeInfo(id)
                    return member ? (
                      <div key={id} className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 rounded-full px-2.5 py-1">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-[10px] bg-blue-100 text-blue-700">
                            {member.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium">{member.name}</span>
                      </div>
                    ) : null
                  })}
                </div>
              </div>
            )}

            {/* Lead Objective */}
            {brief.leadObjective && (
              <div>
                <p className="text-muted-foreground text-xs mb-1">Mục tiêu từ Lead Creative</p>
                <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-800 dark:text-amber-300">{brief.leadObjective}</p>
                </div>
              </div>
            )}

            {/* Requirements */}
            {brief.requirements && (
              <div>
                <p className="text-muted-foreground text-xs mb-1">Yêu cầu chi tiết</p>
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm max-h-24 overflow-y-auto">
                  {brief.requirements}
                </div>
              </div>
            )}

            {/* KPI Targets */}
            {(brief.kpiTargets.ctr > 0 || brief.kpiTargets.cvr > 0 || brief.kpiTargets.cpi > 0 || brief.kpiTargets.roas > 0) && (
              <div>
                <p className="text-muted-foreground text-xs mb-2">KPI Targets</p>
                <div className="grid grid-cols-4 gap-2">
                  {brief.kpiTargets.ctr > 0 && (
                    <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded text-center">
                      <p className="text-[10px] text-muted-foreground">CTR</p>
                      <p className="font-bold text-blue-600 text-sm">{brief.kpiTargets.ctr}%</p>
                    </div>
                  )}
                  {brief.kpiTargets.cvr > 0 && (
                    <div className="p-2 bg-green-50 dark:bg-green-950 rounded text-center">
                      <p className="text-[10px] text-muted-foreground">CVR</p>
                      <p className="font-bold text-green-600 text-sm">{brief.kpiTargets.cvr}%</p>
                    </div>
                  )}
                  {brief.kpiTargets.cpi > 0 && (
                    <div className="p-2 bg-purple-50 dark:bg-purple-950 rounded text-center">
                      <p className="text-[10px] text-muted-foreground">CPI</p>
                      <p className="font-bold text-purple-600 text-sm">${brief.kpiTargets.cpi}</p>
                    </div>
                  )}
                  {brief.kpiTargets.roas > 0 && (
                    <div className="p-2 bg-orange-50 dark:bg-orange-950 rounded text-center">
                      <p className="text-[10px] text-muted-foreground">ROAS</p>
                      <p className="font-bold text-orange-600 text-sm">{brief.kpiTargets.roas}x</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action notice */}
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Khi xác nhận, Brief sẽ chuyển sang trạng thái <span className="font-semibold text-blue-600">"Đang thực hiện"</span> và bạn sẽ bắt đầu công việc.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowProcessingModal(false)} disabled={processingLoading}>
              Hủy
            </Button>
            <Button
              onClick={async () => {
                setProcessingLoading(true)
                try {
                  await onStartWork()
                  setShowProcessingModal(false)
                  toast({ title: "Đã bắt đầu xử lý Brief", description: "Brief đã chuyển sang trạng thái đang thực hiện." })
                } finally {
                  setProcessingLoading(false)
                }
              }}
              disabled={processingLoading}
            >
              {processingLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
              {processingLoading ? "Đang xử lý..." : "Xác nhận bắt đầu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Accept Brief Modal - Nhận Brief */}
      <Dialog open={showAcceptBriefModal} onOpenChange={(open) => { setShowAcceptBriefModal(open); if (!open) { setSelectedMembers([]); setDesignRequirements(""); setDesignFiles([]); setAcceptBriefError(null); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-blue-600" />
              Nhận Brief
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Brief Info */}
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-1">{brief.title}</h4>
              <p className="text-sm text-muted-foreground">{brief.appCampaign}</p>
            </div>

            {/* Mode Selection Tabs */}
            <div className="flex rounded-lg border p-1 bg-gray-100 dark:bg-gray-800">
              <button
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${acceptBriefMode === "assign"
                  ? "bg-white dark:bg-gray-700 shadow text-blue-600"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
                onClick={() => { setAcceptBriefMode("assign"); setAcceptBriefError(null); }}
              >
                <Users className="h-4 w-4" />
                Phân công member
              </button>
              <button
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${acceptBriefMode === "design"
                  ? "bg-white dark:bg-gray-700 shadow text-purple-600"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
                onClick={() => { setAcceptBriefMode("design"); setAcceptBriefError(null); }}
              >
                <Palette className="h-4 w-4" />
                Gửi sang Design
              </button>
            </div>

            {/* Assign Mode - Member Selection */}
            {acceptBriefMode === "assign" && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Chọn thành viên để phân công Brief này:</p>
                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                  {teamMembers.filter(m => m.role === "creative").map((member) => (
                    <div
                      key={member.id}
                      className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-all ${selectedMembers.includes(member.id)
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                      onClick={() => toggleMemberSelection(member.id)}
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${selectedMembers.includes(member.id)
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                        }`}>
                        {selectedMembers.includes(member.id) && (
                          <CheckCircle2 className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                          {member.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{member.role.replace("_", " ")}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {selectedMembers.length > 0 && (
                  <p className="text-sm text-blue-600 font-medium">
                    Đã chọn {selectedMembers.length} thành viên
                  </p>
                )}
              </div>
            )}

            {/* Design Mode - Requirements Form */}
            {acceptBriefMode === "design" && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Nhập yêu cầu thiết kế cho team Design:</p>
                <Textarea
                  value={designRequirements}
                  onChange={(e) => setDesignRequirements(e.target.value)}
                  placeholder="Mô tả chi tiết yêu cầu thiết kế, kích thước, màu sắc, phong cách..."
                  rows={4}
                  className="resize-none"
                />

                {/* File Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tài liệu tham khảo (tùy chọn)</label>
                  <div
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-purple-400 transition-colors"
                    onClick={() => document.getElementById("design-file-input")?.click()}
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (e.dataTransfer.files) {
                        setDesignFiles([...designFiles, ...Array.from(e.dataTransfer.files)]);
                      }
                    }}
                  >
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Kéo thả hoặc click để tải lên hình ảnh/video
                    </p>
                    <input
                      id="design-file-input"
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={handleDesignFileUpload}
                    />
                  </div>

                  {/* Uploaded Files Preview */}
                  {designFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {designFiles.map((file, idx) => (
                        <div key={idx} className="relative group">
                          <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                            {file.type.startsWith("image/") ? (
                              <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <FileText className="h-6 w-6 text-gray-400" />
                            )}
                          </div>
                          <button
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleDesignFileRemove(idx)}
                          >
                            <X className="h-3 w-3" />
                          </button>
                          <p className="text-[10px] text-center truncate w-16">{file.name}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Error Message */}
            {acceptBriefError && (
              <div className="text-red-600 text-sm bg-red-50 dark:bg-red-950/30 p-2 rounded">
                {acceptBriefError}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowAcceptBriefModal(false)} disabled={acceptBriefLoading}>
              Hủy
            </Button>
            {acceptBriefMode === "assign" ? (
              <Button onClick={handleAcceptBriefAssign} disabled={acceptBriefLoading || selectedMembers.length === 0}>
                {acceptBriefLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                {acceptBriefLoading ? "Đang xử lý..." : "Xác nhận phân công"}
              </Button>
            ) : (
              <Button onClick={handleAcceptBriefDesign} disabled={acceptBriefLoading} className="bg-purple-600 hover:bg-purple-700">
                {acceptBriefLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Palette className="h-4 w-4 mr-2" />}
                {acceptBriefLoading ? "Đang gửi..." : "Gửi sang Design"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lightbox Modal - Xem tệp đính kèm to */}
      <Dialog open={viewingAttachment !== null} onOpenChange={(open) => { if (!open) setViewingAttachment(null); }}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="p-4 pb-2">
            <DialogTitle className="flex items-center justify-between">
              <span className="truncate pr-4">{viewingAttachment?.name}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-900 min-h-[300px] max-h-[70vh] overflow-auto">
            {viewingAttachment?.type === "image" && (
              <img
                src={viewingAttachment.url}
                alt={viewingAttachment.name}
                className="max-w-full max-h-[65vh] object-contain rounded"
              />
            )}
            {viewingAttachment?.type === "video" && (
              <video
                src={viewingAttachment.url}
                controls
                autoPlay
                className="max-w-full max-h-[65vh] rounded"
              />
            )}
            {viewingAttachment?.type === "pdf" && (
              <div className="text-center space-y-4">
                <FileText className="h-16 w-16 text-red-600 mx-auto" />
                <p className="text-sm text-muted-foreground">{viewingAttachment.name}</p>
                <a
                  href={viewingAttachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Mở PDF
                </a>
              </div>
            )}
            {viewingAttachment?.type === "zip" && (
              <div className="text-center space-y-4">
                <FileText className="h-16 w-16 text-gray-600 mx-auto" />
                <p className="text-sm text-muted-foreground">{viewingAttachment.name}</p>
                <a
                  href={viewingAttachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Tải xuống
                </a>
              </div>
            )}
          </div>
          <DialogFooter className="p-4 pt-2">
            <Button onClick={() => setViewingAttachment(null)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default BriefDetail
