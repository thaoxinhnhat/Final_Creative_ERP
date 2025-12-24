"use client"

import { useState, useEffect, useCallback } from "react"
import type { Brief, CreateBriefFormData, ConfirmBriefFormData, Priority, BriefAttachment } from "../types"

// Accept Brief form data type
type AcceptBriefFormData = {
  mode: "assign" | "design"
  // For assign mode
  assignedTo: string[]
  priority: Priority
  leadObjective?: string
  // For design mode
  designRequirements: string
  designFiles?: File[]
}

// API functions
const briefsApi = {
  getAll: async (): Promise<{ briefs: Brief[]; total: number }> => {
    const res = await fetch("/api/briefs")
    if (!res.ok) throw new Error("Failed to fetch briefs")
    return res.json()
  },

  create: async (data: Omit<CreateBriefFormData, 'kpiTargets'> & {
    createdBy: string;
    status: string;
    kpiTargets: { ctr: number; cvr: number; cpi: number; roas: number };
    priority: string;
    assignedTo: string[];
    attachments: any[];
  }): Promise<{ brief: Brief }> => {
    const res = await fetch("/api/briefs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error("Failed to create brief")
    return res.json()
  },

  update: async (id: string, data: Partial<Brief> & { updatedBy?: string; fromNeedFix?: boolean }): Promise<{ brief: Brief }> => {
    const res = await fetch(`/api/briefs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error("Failed to update brief")
    return res.json()
  },

  delete: async (id: string): Promise<{ success: boolean }> => {
    const res = await fetch(`/api/briefs/${id}`, { method: "DELETE" })
    if (!res.ok) throw new Error("Failed to delete brief")
    return res.json()
  },
}

// Main hook - exports acceptBrief for accepting pending briefs
export function useBriefs() {
  const [briefs, setBriefs] = useState<Brief[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Fetch briefs
  const fetchBriefs = useCallback(async (showValidating = false) => {
    if (showValidating) {
      setIsValidating(true)
    }

    try {
      const data = await briefsApi.getAll()
      setBriefs(data.briefs || [])
      setError(null)
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
      setIsValidating(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchBriefs()
  }, [fetchBriefs])

  // Create brief with optimistic update
  const createBrief = useCallback(async (
    formData: CreateBriefFormData,
    isDraft: boolean,
    createdBy: string
  ): Promise<Brief> => {
    const newBriefData = {
      title: formData.title,
      appCampaign: formData.appCampaign,
      kpiTargets: {
        ctr: parseFloat(formData.kpiTargets.ctr) || 0,
        cvr: parseFloat(formData.kpiTargets.cvr) || 0,
        cpi: parseFloat(formData.kpiTargets.cpi) || 0,
        roas: parseFloat(formData.kpiTargets.roas) || 0,
      },
      deadline: formData.deadline,
      region: formData.region,
      audience: formData.audience || undefined,  // NEW
      platform: formData.platform,
      formats: formData.formats || [],            // NEW
      requirements: formData.requirements,
      status: isDraft ? "draft" : "pending",
      priority: "medium" as const,
      assignedTo: [] as string[],
      createdBy,
      attachments: [] as any[],
    }

    // Optimistic update
    const optimisticBrief: Brief = {
      id: `temp-${Date.now()}`,
      ...newBriefData,
      createdAt: new Date().toISOString(),
      activityLog: [{
        action: isDraft ? "Tạo brief nháp" : "Tạo và gửi brief",
        by: createdBy,
        at: new Date().toISOString(),
      }],
    } as Brief

    // Add optimistically
    setBriefs(prev => [optimisticBrief, ...prev])

    try {
      const response = await briefsApi.create({
        ...newBriefData,
        createdBy,
        status: isDraft ? "draft" : "pending",
        orderType: "simple"
      })

      // Replace optimistic with real data
      setBriefs(prev => prev.map(b =>
        b.id === optimisticBrief.id ? response.brief : b
      ))

      return response.brief
    } catch (err) {
      // Rollback on error
      setBriefs(prev => prev.filter(b => b.id !== optimisticBrief.id))
      throw err
    }
  }, [])

  // Update brief status with optimistic update
  const updateBriefStatus = useCallback(async (
    briefId: string,
    updates: Partial<Brief>,
    updatedBy: string
  ): Promise<Brief> => {
    // Get current brief for rollback
    const currentBrief = briefs.find(b => b.id === briefId)
    if (!currentBrief) throw new Error("Brief not found")

    // Create optimistic update
    const optimisticBrief: Brief = {
      ...currentBrief,
      ...updates,
      activityLog: [
        ...currentBrief.activityLog,
        {
          action: getActivityAction(updates),
          by: updatedBy,
          at: new Date().toISOString(),
        },
      ],
    }

    // Optimistically update
    setBriefs(prev => prev.map(b => b.id === briefId ? optimisticBrief : b))

    try {
      const response = await briefsApi.update(briefId, {
        ...updates,
        updatedBy,
        fromNeedFix: currentBrief.status === "need_revision" && updates.status === "in_progress",
      })

      // Update with server response
      setBriefs(prev => prev.map(b => b.id === briefId ? response.brief : b))

      return response.brief
    } catch (err) {
      // Rollback on error
      setBriefs(prev => prev.map(b => b.id === briefId ? currentBrief : b))
      throw err
    }
  }, [briefs])

  // Confirm/Refund brief with optimistic update
  const confirmBrief = useCallback(async (
    briefId: string,
    data: ConfirmBriefFormData,
    updatedBy: string,
    teamMembers: { id: string; name: string }[]
  ): Promise<Brief> => {
    const isConfirm = data.action === "confirm"

    const updates: Partial<Brief> = isConfirm
      ? {
        status: "confirmed",
        priority: data.priority,
        assignedTo: data.assignedTo,
        leadObjective: data.leadObjective,
      }
      : {
        status: "returned_to_ua" as const,
        returnReason: data.refundReason,
      }

    return updateBriefStatus(briefId, updates, updatedBy)
  }, [updateBriefStatus])

  // Accept brief - for pending briefs
  const acceptBrief = useCallback(async (
    briefId: string,
    data: AcceptBriefFormData,
    acceptedBy: string
  ): Promise<Brief> => {
    let updates: Partial<Brief>

    if (data.mode === "assign") {
      // Assign to Creative members
      updates = {
        status: "confirmed" as const,
        priority: data.priority,
        assignedTo: data.assignedTo,
        leadObjective: data.leadObjective || undefined,
      }
    } else {
      // Send to Design
      updates = {
        status: "waiting_design" as const,
        designRequest: {
          requirements: data.designRequirements,
          requestedAt: new Date().toISOString(),
          requestedBy: acceptedBy,
        },
      }
    }

    return updateBriefStatus(briefId, updates, acceptedBy)
  }, [updateBriefStatus])

  // Refresh data
  const refresh = useCallback(() => {
    fetchBriefs(true)
  }, [fetchBriefs])

  return {
    briefs,
    isLoading,
    isValidating,
    error,
    createBrief,
    updateBriefStatus,
    confirmBrief,
    acceptBrief,
    refresh,
  }
}

// Helper function to generate activity action
function getActivityAction(updates: Partial<Brief>): string {
  if (!updates.status) return "Cập nhật brief"

  switch (updates.status) {
    case "confirmed":
      return updates.assignedTo?.length
        ? `Xác nhận brief`
        : "Xác nhận brief"
    case "waiting_design":
      return "Gửi yêu cầu Design"
    case "returned_to_ua":
      return `Trả về UA`
    case "in_progress":
      return "Bắt đầu thực hiện"
    case "completed":
      return "Đánh dấu hoàn thành"
    case "need_revision":
      return "Yêu cầu chỉnh sửa"
    default:
      return `Cập nhật trạng thái: ${updates.status}`
  }
}

export default useBriefs

