"use client"

import { useState, useMemo, useCallback } from "react"
import { mockConcepts, allTeamMembers } from "./mockData"
import type {
    Concept,
    ConceptFilters,
    ConceptStatus,
    Attachment,
    Comment,
    TeamType,
    OrderAssignment,
    ConceptTeamMember
} from "./types"
import { shouldSyncBriefStatus } from "../shared/workflowTypes"

// Callback type for notifying Brief when Concept status changes
export type OnConceptStatusChangeCallback = (
    conceptId: string,
    briefId: string | undefined,
    newStatus: ConceptStatus,
    allLinkedConceptStatuses: string[]
) => void

const defaultFilters: ConceptFilters = {
    search: "",
    status: "all",
    briefId: "all",
    tags: [],
    team: "all",
    sortBy: "newest",
}

export function useConcepts() {
    const [concepts, setConcepts] = useState<Concept[]>(mockConcepts)
    const [filters, setFilters] = useState<ConceptFilters>(defaultFilters)
    const [isLoading] = useState(false)

    // Filter and sort concepts
    const filteredConcepts = useMemo(() => {
        let result = [...concepts]

        // Search filter
        if (filters.search) {
            const search = filters.search.toLowerCase()
            result = result.filter(c =>
                c.title.toLowerCase().includes(search) ||
                c.description.toLowerCase().includes(search) ||
                c.tags.some(t => t.toLowerCase().includes(search))
            )
        }

        // Status filter
        if (filters.status !== "all") {
            result = result.filter(c => c.status === filters.status)
        }

        // Brief filter
        if (filters.briefId !== "all") {
            result = result.filter(c => c.linkedBriefId === filters.briefId)
        }

        // Tags filter
        if (filters.tags.length > 0) {
            result = result.filter(c =>
                filters.tags.some(tag => c.tags.includes(tag))
            )
        }

        // Team filter
        if (filters.team !== "all") {
            result = result.filter(c => c.currentHandler === filters.team)
        }

        // Sort
        switch (filters.sortBy) {
            case "newest":
                result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                break
            case "oldest":
                result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                break
            case "title":
                result.sort((a, b) => a.title.localeCompare(b.title))
                break
        }

        return result
    }, [concepts, filters])

    // Update filters
    const updateFilters = useCallback((updates: Partial<ConceptFilters>) => {
        setFilters(prev => ({ ...prev, ...updates }))
    }, [])

    const resetFilters = useCallback(() => {
        setFilters(defaultFilters)
    }, [])

    // Helper to add workflow history entry
    const addWorkflowEntry = (
        concept: Concept,
        action: string,
        by: string,
        byTeam: TeamType,
        notes?: string
    ): Concept["workflowHistory"] => {
        const entry = {
            action,
            by,
            byTeam,
            at: new Date().toISOString(),
            ...(notes && { notes })
        }
        return [...(concept.workflowHistory || []), entry]
    }

    // Create concept
    const createConcept = useCallback((data: Partial<Concept>): Concept => {
        const userName = data.createdByName || "Current User"
        const newConcept: Concept = {
            id: `concept_${Date.now()}`,
            title: data.title || "Untitled Concept",
            description: data.description || "",
            status: "draft",
            attachments: data.attachments || [],
            tags: data.tags || [],
            createdBy: data.createdBy || "c-1",
            createdByName: userName,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            comments: [],
            workflowHistory: [{
                action: "Tạo concept",
                by: userName,
                byTeam: "creative",
                at: new Date().toISOString()
            }],
            ...data,
        }
        setConcepts(prev => [newConcept, ...prev])
        return newConcept
    }, [])

    // Update concept
    const updateConcept = useCallback((id: string, updates: Partial<Concept>) => {
        setConcepts(prev => prev.map(c =>
            c.id === id
                ? { ...c, ...updates, updatedAt: new Date().toISOString() }
                : c
        ))
    }, [])

    // Delete concept
    const deleteConcept = useCallback((id: string) => {
        setConcepts(prev => prev.filter(c => c.id !== id))
    }, [])

    // Submit for review
    const submitForReview = useCallback((id: string, userName: string) => {
        setConcepts(prev => prev.map(c => {
            if (c.id !== id) return c
            return {
                ...c,
                status: "pending_review" as ConceptStatus,
                updatedAt: new Date().toISOString(),
                workflowHistory: addWorkflowEntry(c, "Gửi duyệt concept", userName, "creative")
            }
        }))
    }, [])

    // Approve concept
    const approveConcept = useCallback((id: string, approverName: string) => {
        setConcepts(prev => prev.map(c => {
            if (c.id !== id) return c
            return {
                ...c,
                status: "approved" as ConceptStatus,
                approvedBy: "c-lead",
                approvedByName: approverName,
                approvedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                workflowHistory: addWorkflowEntry(c, "Duyệt concept", approverName, "creative")
            }
        }))
    }, [])

    // Reject concept
    const rejectConcept = useCallback((id: string, reason: string, reviewerName: string = "Lead Creative") => {
        setConcepts(prev => prev.map(c => {
            if (c.id !== id) return c
            return {
                ...c,
                status: "rejected" as ConceptStatus,
                rejectedReason: reason,
                updatedAt: new Date().toISOString(),
                workflowHistory: addWorkflowEntry(c, "Từ chối concept", reviewerName, "creative", reason)
            }
        }))
    }, [])

    // Submit to UA for approval (after Creative approval)
    const submitForUaApproval = useCallback((id: string, submitterName: string = "Lead Creative") => {
        setConcepts(prev => prev.map(c => {
            if (c.id !== id) return c
            return {
                ...c,
                status: "waiting_ua_approval" as ConceptStatus,
                uaApproval: {
                    status: 'pending',
                },
                updatedAt: new Date().toISOString(),
                workflowHistory: addWorkflowEntry(c, "Gửi UA duyệt concept", submitterName, "creative")
            }
        }))
    }, [])

    // UA approves concept (can now create orders)
    const uaApproveConcept = useCallback((id: string, reviewerName: string, feedback?: string) => {
        setConcepts(prev => prev.map(c => {
            if (c.id !== id) return c
            return {
                ...c,
                status: "ua_approved" as ConceptStatus,
                uaApproval: {
                    status: 'approved',
                    reviewedBy: 'ua-team',
                    reviewedByName: reviewerName,
                    reviewedAt: new Date().toISOString(),
                    feedback,
                },
                updatedAt: new Date().toISOString(),
                workflowHistory: addWorkflowEntry(c, "UA duyệt concept", reviewerName, "creative", feedback)
            }
        }))
    }, [])

    // UA rejects concept (back to Creative for brainstorm)
    const uaRejectConcept = useCallback((id: string, reviewerName: string, feedback: string) => {
        setConcepts(prev => prev.map(c => {
            if (c.id !== id) return c
            return {
                ...c,
                status: "ua_rejected" as ConceptStatus,
                uaApproval: {
                    status: 'rejected',
                    reviewedBy: 'ua-team',
                    reviewedByName: reviewerName,
                    reviewedAt: new Date().toISOString(),
                    feedback,
                },
                updatedAt: new Date().toISOString(),
                workflowHistory: addWorkflowEntry(c, "UA từ chối concept - cần brainstorm lại", reviewerName, "creative", feedback)
            }
        }))
    }, [])

    // Send order to a team
    const sendOrderToTeam = useCallback((
        id: string,
        teamType: TeamType,
        assignedTo: string[],
        notes: string,
        deadline: string,
        senderName: string = "Lead Creative"
    ) => {
        const statusMap: Record<TeamType, ConceptStatus> = {
            design: "sent_to_design",
            art_stylist: "sent_to_art",
            ai_producer: "sent_to_ai",
            creative: "pending_review"
        }

        const teamLabelMap: Record<TeamType, string> = {
            design: "Design",
            art_stylist: "Art & Stylist",
            ai_producer: "AI Producer",
            creative: "Creative"
        }

        setConcepts(prev => prev.map(c => {
            if (c.id !== id) return c

            const newAssignment: OrderAssignment = {
                teamType,
                assignedTo,
                assignedAt: new Date().toISOString(),
                assignedBy: senderName,
                deadline,
                status: "pending"
            }

            return {
                ...c,
                status: statusMap[teamType],
                currentHandler: teamType,
                designNotes: notes,
                orderAssignments: [...(c.orderAssignments || []), newAssignment],
                updatedAt: new Date().toISOString(),
                workflowHistory: addWorkflowEntry(
                    c,
                    `Gửi order cho ${teamLabelMap[teamType]}`,
                    senderName,
                    "creative"
                )
            }
        }))
    }, [])

    // Team starts working on order
    const startOrderWork = useCallback((id: string, teamType: TeamType, memberName: string) => {
        const statusMap: Record<TeamType, ConceptStatus> = {
            design: "design_in_progress",
            art_stylist: "art_in_progress",
            ai_producer: "ai_in_progress",
            creative: "pending_review"
        }

        const teamLabelMap: Record<TeamType, string> = {
            design: "Design",
            art_stylist: "Art & Stylist",
            ai_producer: "AI Producer",
            creative: "Creative"
        }

        setConcepts(prev => prev.map(c => {
            if (c.id !== id) return c

            const updatedAssignments = c.orderAssignments?.map(a =>
                a.teamType === teamType && a.status === "pending"
                    ? { ...a, status: "in_progress" as const }
                    : a
            )

            return {
                ...c,
                status: statusMap[teamType],
                orderAssignments: updatedAssignments,
                updatedAt: new Date().toISOString(),
                workflowHistory: addWorkflowEntry(
                    c,
                    `${teamLabelMap[teamType]} bắt đầu thực hiện`,
                    memberName,
                    teamType
                )
            }
        }))
    }, [])

    // Team completes order
    const completeOrder = useCallback((
        id: string,
        teamType: TeamType,
        memberName: string,
        deliverables?: Attachment[]
    ) => {
        const statusMap: Record<TeamType, ConceptStatus> = {
            design: "design_completed",
            art_stylist: "art_completed",
            ai_producer: "ai_completed",
            creative: "completed"
        }

        const teamLabelMap: Record<TeamType, string> = {
            design: "Design",
            art_stylist: "Art & Stylist",
            ai_producer: "AI Producer",
            creative: "Creative"
        }

        setConcepts(prev => prev.map(c => {
            if (c.id !== id) return c

            const updatedAssignments = c.orderAssignments?.map(a =>
                a.teamType === teamType && a.status === "in_progress"
                    ? {
                        ...a,
                        status: "completed" as const,
                        completedAt: new Date().toISOString(),
                        deliverables
                    }
                    : a
            )

            return {
                ...c,
                status: statusMap[teamType],
                currentHandler: "creative", // Return to creative for review
                orderAssignments: updatedAssignments,
                updatedAt: new Date().toISOString(),
                workflowHistory: addWorkflowEntry(
                    c,
                    `${teamLabelMap[teamType]} hoàn thành`,
                    memberName,
                    teamType
                )
            }
        }))
    }, [])

    // Team returns order
    const returnOrder = useCallback((
        id: string,
        teamType: TeamType,
        memberName: string,
        reason: string
    ) => {
        const statusMap: Record<TeamType, ConceptStatus> = {
            design: "design_returned",
            art_stylist: "art_returned",
            ai_producer: "ai_returned",
            creative: "rejected"
        }

        const teamLabelMap: Record<TeamType, string> = {
            design: "Design",
            art_stylist: "Art & Stylist",
            ai_producer: "AI Producer",
            creative: "Creative"
        }

        setConcepts(prev => prev.map(c => {
            if (c.id !== id) return c

            const updatedAssignments = c.orderAssignments?.map(a =>
                a.teamType === teamType && (a.status === "pending" || a.status === "in_progress")
                    ? { ...a, status: "returned" as const, returnReason: reason }
                    : a
            )

            return {
                ...c,
                status: statusMap[teamType],
                currentHandler: "creative", // Return to creative
                orderAssignments: updatedAssignments,
                updatedAt: new Date().toISOString(),
                workflowHistory: addWorkflowEntry(
                    c,
                    `${teamLabelMap[teamType]} trả lại order`,
                    memberName,
                    teamType,
                    reason
                )
            }
        }))
    }, [])

    // Creative reviews final result
    const reviewFinalResult = useCallback((id: string, approved: boolean, reviewerName: string, notes?: string) => {
        setConcepts(prev => prev.map(c => {
            if (c.id !== id) return c

            const newStatus: ConceptStatus = approved ? "completed" : "waiting_creative_review"
            const action = approved ? "Duyệt final và hoàn thành" : "Yêu cầu chỉnh sửa"

            return {
                ...c,
                status: newStatus,
                updatedAt: new Date().toISOString(),
                workflowHistory: addWorkflowEntry(c, action, reviewerName, "creative", notes)
            }
        }))
    }, [])

    // Legacy: Send to design (backward compatibility)
    const sendToDesign = useCallback((id: string, designNotes: string, deadline: string) => {
        sendOrderToTeam(id, "design", [], designNotes, deadline, "Lead Creative")
    }, [sendOrderToTeam])

    // Link to brief
    const linkToBrief = useCallback((id: string, briefId: string, briefTitle: string) => {
        updateConcept(id, {
            linkedBriefId: briefId,
            linkedBriefTitle: briefTitle
        })
    }, [updateConcept])

    // Add comment
    const addComment = useCallback((conceptId: string, content: string, userName: string) => {
        const newComment: Comment = {
            id: `cmt_${Date.now()}`,
            userId: "c-1",
            userName,
            content,
            createdAt: new Date().toISOString()
        }
        setConcepts(prev => prev.map(c =>
            c.id === conceptId
                ? { ...c, comments: [...c.comments, newComment], updatedAt: new Date().toISOString() }
                : c
        ))
    }, [])

    // Add attachments
    const addAttachments = useCallback((conceptId: string, newAttachments: Attachment[]) => {
        setConcepts(prev => prev.map(c =>
            c.id === conceptId
                ? { ...c, attachments: [...c.attachments, ...newAttachments], updatedAt: new Date().toISOString() }
                : c
        ))
    }, [])

    // Enhanced Stats
    const stats = useMemo(() => ({
        total: concepts.length,
        // Creative workflow
        draft: concepts.filter(c => c.status === 'draft').length,
        pending_review: concepts.filter(c => c.status === 'pending_review').length,
        approved: concepts.filter(c => c.status === 'approved').length,
        rejected: concepts.filter(c => c.status === 'rejected').length,
        // UA Approval
        waiting_ua_approval: concepts.filter(c => c.status === 'waiting_ua_approval').length,
        ua_approved: concepts.filter(c => c.status === 'ua_approved').length,
        ua_rejected: concepts.filter(c => c.status === 'ua_rejected').length,
        // Design workflow
        sent_to_design: concepts.filter(c => c.status === 'sent_to_design').length,
        design_in_progress: concepts.filter(c => c.status === 'design_in_progress').length,
        design_returned: concepts.filter(c => c.status === 'design_returned').length,
        design_completed: concepts.filter(c => c.status === 'design_completed').length,
        // Art & Stylist workflow
        sent_to_art: concepts.filter(c => c.status === 'sent_to_art').length,
        art_in_progress: concepts.filter(c => c.status === 'art_in_progress').length,
        art_returned: concepts.filter(c => c.status === 'art_returned').length,
        art_completed: concepts.filter(c => c.status === 'art_completed').length,
        // AI Producer workflow
        sent_to_ai: concepts.filter(c => c.status === 'sent_to_ai').length,
        ai_in_progress: concepts.filter(c => c.status === 'ai_in_progress').length,
        ai_returned: concepts.filter(c => c.status === 'ai_returned').length,
        ai_completed: concepts.filter(c => c.status === 'ai_completed').length,
        // Final
        waiting_creative_review: concepts.filter(c => c.status === 'waiting_creative_review').length,
        completed: concepts.filter(c => c.status === 'completed').length,
    }), [concepts])

    // Stats by handler
    const statsByHandler = useMemo(() => ({
        design: concepts.filter(c => c.currentHandler === 'design').length,
        art_stylist: concepts.filter(c => c.currentHandler === 'art_stylist').length,
        ai_producer: concepts.filter(c => c.currentHandler === 'ai_producer').length,
        creative: concepts.filter(c => c.currentHandler === 'creative' || !c.currentHandler).length,
    }), [concepts])

    // Create concept from Brief (quick action)
    const createConceptFromBrief = useCallback((briefData: {
        briefId: string
        briefTitle: string
        appCampaign: string
        deadline: string
        priority: 'low' | 'medium' | 'high'
        status: string
        createdBy: string
    }, conceptData: Partial<Concept>): Concept => {
        const userName = conceptData.createdByName || "Current User"
        const newConcept: Concept = {
            id: `concept_${Date.now()}`,
            title: conceptData.title || `Concept cho ${briefData.briefTitle}`,
            description: conceptData.description || "",
            status: "draft",
            source: "from_brief",
            linkedBriefId: briefData.briefId,
            linkedBriefTitle: briefData.briefTitle,
            linkedBrief: {
                id: briefData.briefId,
                title: briefData.briefTitle,
                appCampaign: briefData.appCampaign,
                deadline: briefData.deadline,
                priority: briefData.priority,
                status: briefData.status,
                createdBy: briefData.createdBy,
            },
            attachments: conceptData.attachments || [],
            tags: conceptData.tags || [briefData.appCampaign.toLowerCase()],
            createdBy: conceptData.createdBy || "c-1",
            createdByName: userName,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            comments: [],
            workflowHistory: [{
                action: `Tạo concept từ Brief: ${briefData.briefTitle}`,
                by: userName,
                byTeam: "creative",
                at: new Date().toISOString()
            }],
            ...conceptData,
        }
        setConcepts(prev => [newConcept, ...prev])
        return newConcept
    }, [])

    // Change Brief linkage
    const changeBriefLink = useCallback((conceptId: string, briefData: {
        briefId: string
        briefTitle: string
        appCampaign: string
        deadline: string
        priority: 'low' | 'medium' | 'high'
        status: string
        createdBy: string
    } | null, userName: string = "Current User") => {
        setConcepts(prev => prev.map(c => {
            if (c.id !== conceptId) return c
            if (briefData === null) {
                // Remove brief link
                return {
                    ...c,
                    linkedBriefId: undefined,
                    linkedBriefTitle: undefined,
                    linkedBrief: undefined,
                    updatedAt: new Date().toISOString(),
                    workflowHistory: addWorkflowEntry(c, "Hủy liên kết Brief", userName, "creative")
                }
            }
            return {
                ...c,
                linkedBriefId: briefData.briefId,
                linkedBriefTitle: briefData.briefTitle,
                linkedBrief: {
                    id: briefData.briefId,
                    title: briefData.briefTitle,
                    appCampaign: briefData.appCampaign,
                    deadline: briefData.deadline,
                    priority: briefData.priority,
                    status: briefData.status,
                    createdBy: briefData.createdBy,
                },
                updatedAt: new Date().toISOString(),
                workflowHistory: addWorkflowEntry(c, `Liên kết với Brief: ${briefData.briefTitle}`, userName, "creative")
            }
        }))
    }, [])
    // Get all concept statuses linked to a specific Brief
    const getLinkedBriefStatuses = useCallback((briefId: string): string[] => {
        return concepts
            .filter(c => c.linkedBriefId === briefId)
            .map(c => c.status)
    }, [concepts])

    return {
        concepts: filteredConcepts,
        allConcepts: concepts,
        filters,
        isLoading,
        stats,
        statsByHandler,
        teamMembers: allTeamMembers,
        updateFilters,
        resetFilters,
        createConcept,
        createConceptFromBrief,
        updateConcept,
        deleteConcept,
        submitForReview,
        approveConcept,
        rejectConcept,
        // UA Approval
        submitForUaApproval,
        uaApproveConcept,
        uaRejectConcept,
        // Orders
        sendToDesign,
        sendOrderToTeam,
        startOrderWork,
        completeOrder,
        returnOrder,
        reviewFinalResult,
        // Brief linkage
        linkToBrief,
        changeBriefLink,
        getLinkedBriefStatuses, // NEW: Get all concept statuses for a Brief
        // Other
        addComment,
        addAttachments,
    }
}
