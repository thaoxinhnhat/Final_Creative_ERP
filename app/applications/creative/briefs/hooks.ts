import { useState } from "react"
import { initialBriefs } from "./mockData"
import type { Brief, CreateBriefFormData, ConfirmBriefFormData, TeamMember } from "./types"

// ============================================
// SIMPLE USER (No role complexity)
// ============================================
export function useUserRole() {
  const [user] = useState({
    id: "user_creative_001",
    name: "Creative Team",
    role: "creative" as const
  })

  return {
    role: "creative" as const,
    user,
    canCreateBrief: true,
    isLoading: false
  }
}

// ============================================
// BRIEFS HOOK (Simplified - no role filtering)
// ============================================
export function useBriefs() {
  const [briefs, setBriefs] = useState<Brief[]>(initialBriefs)
  const [isLoading] = useState(false)
  const [isValidating] = useState(false)
  const [error] = useState<Error | null>(null)

  const createBrief = async (data: CreateBriefFormData, isDraft: boolean, creatorName: string): Promise<Brief> => {
    const status: Brief["status"] = isDraft ? "draft" : "pending"
    const priority: Brief["priority"] = "medium"
    const platform: Brief["platform"] = data.platform || "iOS"
    
    const newBrief: Brief = {
      id: `brief-${Date.now()}`,
      title: data.title,
      appCampaign: data.appCampaign || "",
      kpiTargets: data.kpiTargets 
        ? {
            ctr: Number(data.kpiTargets.ctr) || 0,
            cvr: Number(data.kpiTargets.cvr) || 0,
            cpi: Number(data.kpiTargets.cpi) || 0,
            roas: Number(data.kpiTargets.roas) || 0,
          }
        : { ctr: 0, cvr: 0, cpi: 0, roas: 0 },
      deadline: data.deadline,
      region: data.region || "",
      audience: data.audience || "",
      platform,
      formats: data.formats || [],
      requirements: data.requirements || "",
      status,
      priority,
      assignedTo: [],
      createdBy: creatorName,
      createdAt: new Date().toISOString(),
      attachments: [],
      activityLog: [
        {
          action: isDraft ? "Tạo brief nháp" : "Tạo và gửi brief",
          by: creatorName,
          at: new Date().toISOString(),
        },
      ],
    }

    setBriefs((prev) => [newBrief, ...prev])
    return newBrief
  }

  const updateBriefStatus = async (
    id: string,
    updates: Partial<Brief>,
    updaterName: string
  ): Promise<Brief> => {
    let updatedBrief: Brief | null = null

    setBriefs((prev) =>
      prev.map((brief) => {
        if (brief.id === id) {
          updatedBrief = {
            ...brief,
            ...updates,
            activityLog: [
              ...brief.activityLog,
              {
                action: `Cập nhật trạng thái: ${updates.status || 'unknown'}`,
                by: updaterName,
                at: new Date().toISOString(),
              },
            ],
          }
          return updatedBrief
        }
        return brief
      })
    )

    if (!updatedBrief) {
      throw new Error("Brief not found")
    }

    return updatedBrief
  }

  const confirmBrief = async (
    id: string,
    data: ConfirmBriefFormData,
    confirmerName: string,
    teamMembersList: TeamMember[]
  ): Promise<Brief> => {
    let updatedBrief: Brief | null = null

    setBriefs((prev) =>
      prev.map((brief) => {
        if (brief.id === id) {
          if (data.action === "confirm") {
            const assigneeNames = data.assignedTo
              .map((assigneeId) => teamMembersList.find((m) => m.id === assigneeId)?.name)
              .filter(Boolean)
              .join(", ")

            updatedBrief = {
              ...brief,
              status: "confirmed",
              assignedTo: data.assignedTo,
              priority: data.priority,
              leadObjective: data.leadObjective,
              activityLog: [
                ...brief.activityLog,
                {
                  action: `Xác nhận brief, phân công cho ${assigneeNames}`,
                  by: confirmerName,
                  at: new Date().toISOString(),
                },
              ],
            }
          } else {
            updatedBrief = {
              ...brief,
              status: "refunded",
              refundReason: data.refundReason,
              activityLog: [
                ...brief.activityLog,
                {
                  action: `Refund brief với lý do: ${data.refundReason}`,
                  by: confirmerName,
                  at: new Date().toISOString(),
                },
              ],
            }
          }
          return updatedBrief
        }
        return brief
      })
    )

    if (!updatedBrief) {
      throw new Error("Brief not found")
    }

    return updatedBrief
  }

  return {
    briefs,
    isLoading,
    isValidating,
    error,
    createBrief,
    updateBriefStatus,
    confirmBrief,
  }
}