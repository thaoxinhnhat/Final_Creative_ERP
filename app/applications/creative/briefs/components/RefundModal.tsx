import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

import type { Brief } from "../types"

// --- TEMP: Mock refund API if not available ---
async function refundBriefApi(briefId: string, reason: string): Promise<{ success: boolean; message?: string }> {
  // Simulate API call
  await new Promise(res => setTimeout(res, 800))
  // Always succeed for mock
  return { success: true }
}

function getOverdueDays(brief: Brief): number {
  if (!brief.deadline) return 0
  const deadline = new Date(brief.deadline)
  const now = new Date()
  const diff = Math.floor((now.getTime() - deadline.getTime()) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : 0
}

function getDeadlineDisplay(brief: Brief): string {
  if (!brief.deadline) return ""
  const d = new Date(brief.deadline)
  return d.toLocaleDateString("vi-VN")
}

export function RefundModal({ brief, onClose, onRefundSuccess }: { brief: Brief; onClose: () => void; onRefundSuccess: () => void }) {
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastError, setLastError] = useState<string | null>(null)

  const overdueDays = getOverdueDays(brief)
  const deadlineDisplay = getDeadlineDisplay(brief)
  const placeholderText = `Brief đã quá hạn ${overdueDays} ngày (deadline gốc: ${deadlineDisplay}). Vui lòng tạo brief mới với deadline phù hợp.`

  const handleRefund = async () => {
    setError(null)
    setLoading(true)
    try {
      if (!reason.trim()) {
        setError("Vui lòng nhập lý do refund.")
        if (lastError !== "Vui lòng nhập lý do refund.") {
          toast({ variant: "destructive", title: "Lỗi", description: "Vui lòng nhập lý do refund." })
          setLastError("Vui lòng nhập lý do refund.")
        }
        setLoading(false)
        return
      }
      // Call refund API
      const res = await refundBriefApi(brief.id, reason)
      if (res.success) {
        onRefundSuccess()
        onClose()
      } else {
        setError(res.message || "Refund thất bại.")
        if (lastError !== (res.message || "Refund thất bại.")) {
          toast({ variant: "destructive", title: "Lỗi", description: res.message || "Refund thất bại." })
          setLastError(res.message || "Refund thất bại.")
        }
      }
    } catch (e: any) {
      setError("Có lỗi xảy ra khi refund.")
      if (lastError !== "Có lỗi xảy ra khi refund.") {
        toast({ variant: "destructive", title: "Lỗi", description: "Có lỗi xảy ra khi refund." })
        setLastError("Có lỗi xảy ra khi refund.")
      }
    } finally {
      setLoading(false)
    }
  }

  // Reset state on modal close
  const handleClose = () => {
    setReason("")
    setError(null)
    setLastError(null)
    setLoading(false)
    onClose()
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Yêu cầu hoàn tiền</h3>
      <Textarea
        value={reason}
        onChange={e => setReason(e.target.value)}
        placeholder={placeholderText}
        className="font-normal"
        rows={4}
      />
      {error && <div className="text-red-600 text-xs mt-1">{error}</div>}
      <div className="flex justify-end mt-4 gap-2">
        <Button variant="ghost" onClick={handleClose} disabled={loading}>
          Hủy
        </Button>
        <Button onClick={handleRefund} disabled={loading}>
          {loading ? "Đang gửi..." : "Gửi Refund"}
        </Button>
      </div>
    </div>
  )
}