"use client"

import { useState, useMemo, useCallback } from "react"
import { mockConcepts } from "./mockData"
import type { Concept, ConceptFilters, ConceptStatus, Attachment, Comment } from "./types"

const defaultFilters: ConceptFilters = {
    search: "",
    status: "all",
    briefId: "all",
    tags: [],
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

    // Create concept
    const createConcept = useCallback((data: Partial<Concept>): Concept => {
        const newConcept: Concept = {
            id: `concept_${Date.now()}`,
            title: data.title || "Untitled Concept",
            description: data.description || "",
            status: "draft",
            attachments: data.attachments || [],
            tags: data.tags || [],
            createdBy: data.createdBy || "1",
            createdByName: data.createdByName || "Current User",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            comments: [],
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
    const submitForReview = useCallback((id: string) => {
        updateConcept(id, { status: "pending_review" })
    }, [updateConcept])

    // Approve concept
    const approveConcept = useCallback((id: string, approverName: string) => {
        updateConcept(id, {
            status: "approved",
            approvedBy: "1",
            approvedByName: approverName,
            approvedAt: new Date().toISOString()
        })
    }, [updateConcept])

    // Reject concept
    const rejectConcept = useCallback((id: string, reason: string) => {
        updateConcept(id, {
            status: "rejected",
            rejectedReason: reason
        })
    }, [updateConcept])

    // Send to design
    const sendToDesign = useCallback((id: string, designNotes: string) => {
        updateConcept(id, {
            status: "sent_to_design",
            designNotes
        })
    }, [updateConcept])

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
            userId: "1",
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

    // Stats
    const stats = useMemo(() => ({
        total: concepts.length,
        draft: concepts.filter(c => c.status === 'draft').length,
        pending_review: concepts.filter(c => c.status === 'pending_review').length,
        approved: concepts.filter(c => c.status === 'approved').length,
        rejected: concepts.filter(c => c.status === 'rejected').length,
        sent_to_design: concepts.filter(c => c.status === 'sent_to_design').length,
    }), [concepts])

    return {
        concepts: filteredConcepts,
        allConcepts: concepts,
        filters,
        isLoading,
        stats,
        updateFilters,
        resetFilters,
        createConcept,
        updateConcept,
        deleteConcept,
        submitForReview,
        approveConcept,
        rejectConcept,
        sendToDesign,
        linkToBrief,
        addComment,
        addAttachments,
    }
}
