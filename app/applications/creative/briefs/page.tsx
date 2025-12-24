"use client"

import { useState, useCallback } from "react"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Plus, Loader2, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

// Import types
import type { Brief, CreateBriefFormData, ConfirmBriefFormData } from "./types"
import { teamMembers } from "./mockData"

// Import hooks
import { useUserRole, useBriefs } from "./hooks"

// Import components
import {
  BriefList,
  BriefDetail,
  BriefSidebar,
  CreateBriefModal,
  ConfirmBriefModal,
  ResizableDivider,
} from "./components"

// ============================================
// COLUMN WIDTH CONSTRAINTS
// ============================================
const MIN_LEFT_WIDTH = 280
const MAX_LEFT_WIDTH = 480
const DEFAULT_LEFT_WIDTH = 320

const MIN_RIGHT_WIDTH = 240
const MAX_RIGHT_WIDTH = 400
const DEFAULT_RIGHT_WIDTH = 288

// ============================================
// LOCAL TOAST HOOK
// ============================================
type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

type Toast = ToastProps & { id: string; isExiting?: boolean }

const ToastContext = React.createContext<{
  toast: (props: ToastProps) => void
  toasts: Toast[]
  dismiss: (id: string) => void
} | null>(null)

function useLocalToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    return {
      toast: (props: ToastProps) => console.log("Toast:", props.title, props.description),
      toasts: [] as Toast[],
      dismiss: () => { },
    }
  }
  return context
}

function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const toast = React.useCallback((props: ToastProps) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { ...props, id, isExiting: false }])

    // Auto dismiss after 3 seconds with exit animation
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => t.id === id ? { ...t, isExiting: true } : t)
      )
      // Remove after animation completes
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 300)
    }, 3000)
  }, [])

  const dismiss = React.useCallback((id: string) => {
    // Start exit animation
    setToasts((prev) =>
      prev.map((t) => t.id === id ? { ...t, isExiting: true } : t)
    )
    // Remove after animation completes
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 300)
  }, [])

  return (
    <ToastContext.Provider value={{ toast, toasts, dismiss }}>
      {children}
      {/* Toast Container - Maximum z-index to appear above all modals */}
      <div
        className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none"
        style={{ isolation: 'isolate' }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              // Base styles
              "p-4 rounded-xl shadow-2xl shadow-black/20 max-w-sm pointer-events-auto",
              "backdrop-blur-md ring-1 ring-black/5 border",
              // Border & background
              "border",
              t.variant === "destructive"
                ? "bg-red-50/95 border-red-300 text-red-900"
                : "bg-white/95 border-gray-300 text-gray-950",
              // Animation
              "transition-all duration-300 ease-out",
              t.isExiting
                ? "animate-out fade-out-0 slide-out-to-right-full"
                : "animate-in slide-in-from-right-full fade-in-0",
            )}
            role="alert"
            aria-live="polite"
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                {t.title && (
                  <p className={cn(
                    "font-semibold text-sm",
                    t.variant === "destructive" ? "text-red-900" : "text-gray-950"
                  )}>
                    {t.title}
                  </p>
                )}
                {t.description && (
                  <p className={cn(
                    "text-sm mt-1",
                    t.variant === "destructive" ? "text-red-700" : "text-gray-700"
                  )}>
                    {t.description}
                  </p>
                )}
              </div>
              {/* Dismiss button */}
              <button
                onClick={() => dismiss(t.id)}
                className={cn(
                  "flex-shrink-0 p-1 rounded-full transition-colors",
                  t.variant === "destructive"
                    ? "hover:bg-red-200/50 text-red-600"
                    : "hover:bg-gray-200/50 text-gray-500"
                )}
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// ============================================
// MAIN PAGE CONTENT
// ============================================
function BriefsPageContent() {
  const router = useRouter()
  const { toast } = useLocalToast()

  // Simple hooks - no role complexity
  const { user } = useUserRole()
  const {
    briefs,
    isLoading: isLoadingBriefs,
    error: briefsError,
    createBrief,
    updateBriefStatus,
    confirmBrief,
  } = useBriefs()

  // Column widths state
  const [leftWidth, setLeftWidth] = useState(DEFAULT_LEFT_WIDTH)
  const [rightWidth, setRightWidth] = useState(DEFAULT_RIGHT_WIDTH)

  // Resize handlers
  const handleLeftResize = useCallback((delta: number) => {
    setLeftWidth((prev) => Math.min(Math.max(prev + delta, MIN_LEFT_WIDTH), MAX_LEFT_WIDTH))
  }, [])

  const handleRightResize = useCallback((delta: number) => {
    setRightWidth((prev) => Math.min(Math.max(prev - delta, MIN_RIGHT_WIDTH), MAX_RIGHT_WIDTH))
  }, [])

  // Local state
  const [selectedBrief, setSelectedBrief] = useState<Brief | null>(null)
  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false)
  const [isSubmittingConfirm, setIsSubmittingConfirm] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)

  // Update selected brief when briefs change
  React.useEffect(() => {
    if (selectedBrief) {
      const updated = briefs.find((b) => b.id === selectedBrief.id)
      if (updated) setSelectedBrief(updated)
    }
  }, [briefs, selectedBrief?.id])

  // Show error toast if briefs failed to load
  React.useEffect(() => {
    if (briefsError) {
      toast({
        title: "❌ Lỗi tải dữ liệu",
        description: "Không thể tải danh sách briefs. Vui lòng thử lại.",
        variant: "destructive",
      })
    }
  }, [briefsError, toast])

  // Handlers
  const handleCreateBrief = async (data: CreateBriefFormData, isDraft: boolean) => {
    if (!data.title || !data.deadline) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng điền Tiêu đề và Deadline.",
        variant: "destructive",
      })
      return
    }

    setIsSubmittingCreate(true)
    try {
      const newBrief = await createBrief(data, isDraft, user.name)
      setCreateModalOpen(false)
      toast({
        title: isDraft ? "✓ Đã lưu nháp" : "✓ Đã gửi brief",
        description: `Brief "${newBrief.title}" ${isDraft ? "đã được lưu nháp" : "đã được gửi"}.`,
      })
    } catch {
      toast({
        title: "❌ Lỗi tạo brief",
        description: "Không thể tạo brief. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingCreate(false)
    }
  }

  const handleConfirmBrief = async (data: ConfirmBriefFormData) => {
    if (!selectedBrief) return

    if (data.action === "refund" && !data.refundReason.trim()) {
      toast({ title: "Thiếu lý do", description: "Vui lòng nhập lý do refund.", variant: "destructive" })
      return
    }

    if (data.action === "confirm" && data.assignedTo.length === 0) {
      toast({ title: "Chưa phân công", description: "Vui lòng chọn ít nhất một người thực hiện.", variant: "destructive" })
      return
    }

    setIsSubmittingConfirm(true)
    try {
      await confirmBrief(selectedBrief.id, data, user.name, teamMembers)
      setConfirmModalOpen(false)
      const assigneeNames = data.assignedTo.map((id) => teamMembers.find((m) => m.id === id)?.name).filter(Boolean).join(", ")
      toast({
        title: data.action === "confirm" ? "✓ Đã xác nhận brief" : "Brief đã được refund",
        description: data.action === "confirm" ? `Brief đã phân công cho ${assigneeNames}.` : `Brief đã được trả lại.`,
      })
    } catch {
      toast({ title: "❌ Lỗi xử lý brief", description: "Không thể xử lý brief.", variant: "destructive" })
    } finally {
      setIsSubmittingConfirm(false)
    }
  }

  const handleUpdateStatus = async (newStatus: Brief["status"]) => {
    if (!selectedBrief) return
    setIsUpdatingStatus(true)
    try {
      await updateBriefStatus(selectedBrief.id, { status: newStatus }, user.name)
      toast({ title: "✓ Đã cập nhật", description: `Brief đã chuyển sang trạng thái ${newStatus}.` })
    } catch {
      toast({ title: "❌ Lỗi cập nhật", description: "Không thể cập nhật trạng thái.", variant: "destructive" })
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  // Handler for creating concept from brief
  const handleCreateConceptFromBrief = (data: { title: string; description: string; tags: string[] }) => {
    if (!selectedBrief) return

    // Show success toast with concept info
    toast({
      title: "✓ Đã tạo Concept",
      description: `Concept "${data.title}" đã được tạo từ Brief "${selectedBrief.title}".`,
    })

    // Navigate to Concepts page after creation
    // In real app, this would call concepts API and then navigate
    router.push("/applications/creative/concepts")
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950">
      {/* Simplified Header - No Refresh button, no role text */}
      <div className="bg-white dark:bg-gray-900 border-b px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.push("/applications")}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Quay lại
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h1 className="text-xl font-bold">Brief & Task Management</h1>
              <p className="text-xs text-muted-foreground">
                Quản lý briefs và tasks cho Creative Team
              </p>
            </div>
          </div>

          {/* Only Create Brief button */}
          <Button onClick={() => setCreateModalOpen(true)} disabled={isSubmittingCreate}>
            {isSubmittingCreate ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            Tạo Brief mới
          </Button>
        </div>
      </div>

      {/* Main Content - 3 Column Layout */}
      <div className="flex-1 overflow-hidden flex">
        {/* Left Column - Brief List */}
        <div
          className="border-r bg-white dark:bg-gray-900 flex-shrink-0 overflow-hidden"
          style={{ width: `${leftWidth}px` }}
        >
          <BriefList
            briefs={briefs}
            selectedId={selectedBrief?.id || null}
            onSelect={setSelectedBrief}
            isLoading={isLoadingBriefs}
            teamMembers={teamMembers}
          />
        </div>

        <ResizableDivider direction="vertical" onResize={handleLeftResize} />

        {/* Middle Column - Brief Detail */}
        <div className="flex-1 bg-white dark:bg-gray-900 min-w-0 overflow-hidden">
          <BriefDetail
            brief={selectedBrief}
            teamMembers={teamMembers}
            currentUserId={user.id}
            onApprove={() => selectedBrief?.status === "pending" && setConfirmModalOpen(true)}
            onReject={() => selectedBrief?.status === "pending" && setConfirmModalOpen(true)}
            onComplete={() => handleUpdateStatus("completed")}
            onStartWork={() => handleUpdateStatus("in_progress")}
            onMarkFixed={() => handleUpdateStatus("in_progress")}
            isUpdating={isUpdatingStatus}
            onCreateConceptFromBrief={handleCreateConceptFromBrief}
          />
        </div>

        {/* Right Column - Sidebar */}
        {selectedBrief && (
          <>
            <ResizableDivider direction="vertical" onResize={handleRightResize} />
            <div
              className="border-l bg-gray-50 dark:bg-gray-900 flex-shrink-0 overflow-hidden"
              style={{ width: `${rightWidth}px` }}
            >
              <BriefSidebar brief={selectedBrief} teamMembers={teamMembers} />
            </div>
          </>
        )}
      </div>

      {/* Create Brief Modal */}
      <CreateBriefModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSubmit={handleCreateBrief}
        isSubmitting={isSubmittingCreate}
      />

      {/* Confirm Brief Modal */}
      <ConfirmBriefModal
        open={confirmModalOpen}
        onOpenChange={setConfirmModalOpen}
        brief={selectedBrief}
        teamMembers={teamMembers}
        onConfirm={handleConfirmBrief}
        isSubmitting={isSubmittingConfirm}
      />
    </div>
  )
}

// ============================================
// EXPORT WITH TOAST PROVIDER
// ============================================
export default function BriefsPage() {
  return (
    <ToastProvider>
      <BriefsPageContent />
    </ToastProvider>
  )
}
