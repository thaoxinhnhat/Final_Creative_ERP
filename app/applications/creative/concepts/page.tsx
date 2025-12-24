"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Plus, Lightbulb } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

import type { Concept } from "./types"
import { useConcepts } from "./hooks"
import {
    ConceptList,
    ConceptDetail,
    ConceptForm,
    FilterPanel,
    LinkBriefModal
} from "./components"

export default function ConceptHubPage() {
    const router = useRouter()
    const { toast } = useToast()

    const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null)
    const [showConceptForm, setShowConceptForm] = useState(false)
    const [showLinkBriefModal, setShowLinkBriefModal] = useState(false)

    const {
        concepts,
        filters,
        isLoading,
        stats,
        statsByHandler,
        updateFilters,
        resetFilters,
        createConcept,
        updateConcept,
        deleteConcept,
        approveConcept,
        rejectConcept,
        sendToDesign,
        linkToBrief,
        addComment,
    } = useConcepts()

    // Handlers
    const handleCreateConcept = (data: Partial<Concept>) => {
        const newConcept = createConcept({
            ...data,
            createdBy: "c-1",
            createdByName: "Nguyễn Văn An",
        })
        toast({
            title: "Đã tạo concept",
            description: `"${newConcept.title}" đã được tạo thành công`,
        })
    }

    const handleApprove = () => {
        if (selectedConcept) {
            approveConcept(selectedConcept.id, "Nguyễn Văn An")
            setSelectedConcept(prev => prev ? { ...prev, status: 'approved' } : null)
            toast({
                title: "Đã duyệt concept",
                description: "Concept đã được chuyển sang trạng thái Đã duyệt",
            })
        }
    }

    const handleReject = (reason: string) => {
        if (selectedConcept) {
            rejectConcept(selectedConcept.id, reason)
            setSelectedConcept(prev => prev ? { ...prev, status: 'rejected', rejectedReason: reason } : null)
            toast({
                title: "Đã từ chối concept",
                description: "Concept đã được chuyển sang trạng thái Từ chối",
                variant: "destructive",
            })
        }
    }

    const handleSendToDesign = (notes: string, deadline?: string) => {
        if (selectedConcept) {
            // Use provided deadline, or brief deadline, or default to 7 days from now
            const orderDeadline = deadline ||
                selectedConcept.linkedBrief?.deadline ||
                new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            sendToDesign(selectedConcept.id, notes, orderDeadline)
            setSelectedConcept(prev => prev ? { ...prev, status: 'sent_to_design', designNotes: notes } : null)
            toast({
                title: "Đã gửi sang Design",
                description: "Concept đã được gửi cho Design team",
            })
        }
    }

    const handleLinkBrief = (briefId: string, briefTitle: string) => {
        if (selectedConcept) {
            linkToBrief(selectedConcept.id, briefId, briefTitle)
            setSelectedConcept(prev => prev ? { ...prev, linkedBriefId: briefId, linkedBriefTitle: briefTitle } : null)
            toast({
                title: "Đã liên kết Brief",
                description: `Concept đã được liên kết với "${briefTitle}"`,
            })
        }
    }

    const handleAddComment = (content: string) => {
        if (selectedConcept) {
            addComment(selectedConcept.id, content, "Nguyễn Văn An")
            // Optimistic update for selected concept
            const newComment = {
                id: `cmt_${Date.now()}`,
                userId: "c-1",
                userName: "Nguyễn Văn An",
                content,
                createdAt: new Date().toISOString()
            }
            setSelectedConcept(prev => prev ? { ...prev, comments: [...prev.comments, newComment] } : null)
        }
    }

    const handleDelete = () => {
        if (selectedConcept) {
            deleteConcept(selectedConcept.id)
            setSelectedConcept(null)
            toast({
                title: "Đã xóa concept",
                description: "Concept đã được xóa thành công",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950">
            {/* Header */}
            <div className="bg-white dark:bg-gray-900 border-b px-4 py-3 flex-shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" onClick={() => router.push("/applications")}>
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            Quay lại
                        </Button>
                        <Separator orientation="vertical" className="h-6" />
                        <div>
                            <h1 className="text-xl font-bold flex items-center gap-2">
                                <Lightbulb className="h-5 w-5 text-yellow-500" />
                                Concept & Order
                            </h1>
                            <p className="text-xs text-muted-foreground">
                                Quản lý brainstorm, concept và duyệt ý tưởng
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Quick Stats - Enhanced */}
                        <div className="hidden md:flex items-center gap-3 text-xs text-muted-foreground">
                            <span>📝 {stats.draft} nháp</span>
                            <span>⏳ {stats.pending_review} chờ duyệt</span>
                            <span>🎨 {statsByHandler.design} Design</span>
                            <span>🖌️ {statsByHandler.art_stylist} Art</span>
                            <span>🤖 {statsByHandler.ai_producer} AI</span>
                            <span>🎉 {stats.completed} xong</span>
                        </div>
                        <Separator orientation="vertical" className="h-6 hidden md:block" />
                        <Button onClick={() => setShowConceptForm(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Tạo Concept
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden flex">
                {/* Left: Filter Panel */}
                <FilterPanel
                    filters={filters}
                    onUpdateFilters={updateFilters}
                    onResetFilters={resetFilters}
                    stats={stats}
                    statsByHandler={statsByHandler}
                />

                {/* Center: Concept List */}
                <ConceptList
                    concepts={concepts}
                    isLoading={isLoading}
                    selectedId={selectedConcept?.id || null}
                    onSelectConcept={setSelectedConcept}
                    sortBy={filters.sortBy}
                    onSortChange={(sortBy) => updateFilters({ sortBy })}
                />

                {/* Right: Concept Detail */}
                {selectedConcept && (
                    <ConceptDetail
                        concept={selectedConcept}
                        onClose={() => setSelectedConcept(null)}
                        onApprove={handleApprove}
                        onReject={handleReject}
                        onSendToDesign={handleSendToDesign}
                        onLinkBrief={() => setShowLinkBriefModal(true)}
                        onAddComment={handleAddComment}
                        onDelete={handleDelete}
                    />
                )}
            </div>

            {/* Modals */}
            <ConceptForm
                open={showConceptForm}
                onOpenChange={setShowConceptForm}
                onSubmit={handleCreateConcept}
            />

            <LinkBriefModal
                open={showLinkBriefModal}
                onOpenChange={setShowLinkBriefModal}
                onSelect={handleLinkBrief}
                currentBriefId={selectedConcept?.linkedBriefId}
            />
        </div>
    )
}
