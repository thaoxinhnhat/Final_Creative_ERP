"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import {
    X, CheckCircle2, XCircle, Send, Link2, MessageSquare,
    Play, FileText, Image as ImageIcon, Trash2, Edit, Clock,
    Palette, GripVertical
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { Concept } from "../types"
import { STATUS_CONFIG } from "../types"

interface ConceptDetailProps {
    concept: Concept
    onClose: () => void
    onApprove: () => void
    onReject: (reason: string) => void
    onSendToDesign: (notes: string) => void
    onLinkBrief: () => void
    onAddComment: (content: string) => void
    onDelete: () => void
}

export function ConceptDetail({
    concept,
    onClose,
    onApprove,
    onReject,
    onSendToDesign,
    onLinkBrief,
    onAddComment,
    onDelete,
}: ConceptDetailProps) {
    const [commentText, setCommentText] = useState("")
    const [rejectReason, setRejectReason] = useState("")
    const [designNotes, setDesignNotes] = useState(concept.designNotes || "")
    const [showRejectForm, setShowRejectForm] = useState(false)
    const [showDesignForm, setShowDesignForm] = useState(false)

    // Resizable panel state
    const [panelWidth, setPanelWidth] = useState(400)
    const isResizing = useRef(false)
    const panelRef = useRef<HTMLDivElement>(null)

    const MIN_WIDTH = 320
    const MAX_WIDTH = 600

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault()
        isResizing.current = true
        document.body.style.cursor = 'col-resize'
        document.body.style.userSelect = 'none'
    }, [])

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing.current) return

            const newWidth = window.innerWidth - e.clientX
            if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
                setPanelWidth(newWidth)
            }
        }

        const handleMouseUp = () => {
            isResizing.current = false
            document.body.style.cursor = ''
            document.body.style.userSelect = ''
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [])

    const statusConfig = STATUS_CONFIG[concept.status]
    const initials = concept.createdByName.split(' ').map(n => n[0]).join('').slice(0, 2)

    const handleAddComment = () => {
        if (commentText.trim()) {
            onAddComment(commentText)
            setCommentText("")
        }
    }

    const handleReject = () => {
        if (rejectReason.trim()) {
            onReject(rejectReason)
            setShowRejectForm(false)
            setRejectReason("")
        }
    }

    const handleSendToDesign = () => {
        onSendToDesign(designNotes)
        setShowDesignForm(false)
    }

    return (
        <div
            ref={panelRef}
            className="border-l bg-white dark:bg-gray-900 flex-shrink-0 flex flex-col relative"
            style={{ width: panelWidth }}
        >
            {/* Resize Handle */}
            <div
                className="absolute left-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-blue-500/30 active:bg-blue-500/50 transition-colors group flex items-center justify-center z-20"
                onMouseDown={handleMouseDown}
            >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="h-6 w-6 text-gray-400" />
                </div>
            </div>

            {/* Header */}
            <div className="p-4 border-b flex items-start justify-between pl-4">
                <div className="flex-1 min-w-0 pr-2">
                    <Badge variant="secondary" className={cn("text-xs mb-2", statusConfig.color)}>
                        {statusConfig.icon} {statusConfig.label}
                    </Badge>
                    <h2 className="font-bold text-lg">{concept.title}</h2>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-5">
                    {/* Description */}
                    <div>
                        <p className="text-sm text-muted-foreground">{concept.description}</p>
                    </div>

                    {/* Linked Brief */}
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Brief liên kết</p>
                        {concept.linkedBriefTitle ? (
                            <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950/30 rounded border border-blue-200">
                                <Link2 className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-700">{concept.linkedBriefTitle}</span>
                            </div>
                        ) : (
                            <Button variant="outline" size="sm" onClick={onLinkBrief} className="w-full">
                                <Link2 className="h-4 w-4 mr-2" />
                                Liên kết với Brief
                            </Button>
                        )}
                    </div>

                    {/* Attachments */}
                    {concept.attachments.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                                Tệp đính kèm ({concept.attachments.length})
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                                {concept.attachments.map(att => (
                                    <div key={att.id} className="aspect-square rounded-lg overflow-hidden border">
                                        {att.type === 'image' && att.thumbnailUrl ? (
                                            <img src={att.thumbnailUrl} alt={att.name} className="w-full h-full object-cover" />
                                        ) : att.type === 'video' ? (
                                            <div className="w-full h-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
                                                <Play className="h-6 w-6 text-purple-600" />
                                            </div>
                                        ) : (
                                            <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                                <FileText className="h-6 w-6 text-gray-500" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tags */}
                    {concept.tags.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Tags</p>
                            <div className="flex flex-wrap gap-1">
                                {concept.tags.map(tag => (
                                    <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Design Notes (if sent to design) */}
                    {concept.status === 'sent_to_design' && concept.designNotes && (
                        <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200">
                            <p className="text-xs font-semibold text-purple-700 uppercase mb-1 flex items-center gap-1">
                                <Palette className="h-3 w-3" /> Ghi chú cho Design
                            </p>
                            <p className="text-sm text-purple-800 dark:text-purple-200">{concept.designNotes}</p>
                        </div>
                    )}

                    {/* Rejected Reason */}
                    {concept.status === 'rejected' && concept.rejectedReason && (
                        <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
                            <p className="text-xs font-semibold text-red-700 uppercase mb-1">Lý do từ chối</p>
                            <p className="text-sm text-red-800 dark:text-red-200">{concept.rejectedReason}</p>
                        </div>
                    )}

                    {/* Timeline */}
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Lịch sử</p>
                        <div className="space-y-2 text-xs">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                Tạo bởi {concept.createdByName} • {format(new Date(concept.createdAt), "dd/MM/yyyy HH:mm")}
                            </div>
                            {concept.approvedAt && (
                                <div className="flex items-center gap-2 text-green-600">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Duyệt bởi {concept.approvedByName} • {format(new Date(concept.approvedAt), "dd/MM/yyyy HH:mm")}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Comments */}
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                            Thảo luận ({concept.comments.length})
                        </p>
                        <div className="space-y-3">
                            {concept.comments.map(comment => (
                                <div key={comment.id} className="flex gap-2">
                                    <Avatar className="h-6 w-6 flex-shrink-0">
                                        <AvatarFallback className="text-[10px] bg-blue-100 text-blue-700">
                                            {comment.userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-medium">{comment.userName}</span>
                                            <span className="text-[10px] text-muted-foreground">
                                                {format(new Date(comment.createdAt), "dd/MM HH:mm")}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-0.5">{comment.content}</p>
                                    </div>
                                </div>
                            ))}

                            {/* Add Comment */}
                            <div className="flex gap-2 pt-2">
                                <Textarea
                                    placeholder="Thêm bình luận..."
                                    rows={2}
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    className="text-sm"
                                />
                                <Button size="sm" onClick={handleAddComment} disabled={!commentText.trim()}>
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollArea>

            {/* Actions Footer */}
            <div className="p-4 border-t space-y-3">
                {/* Reject Form */}
                {showRejectForm && (
                    <div className="space-y-2 p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
                        <Textarea
                            placeholder="Nhập lý do từ chối..."
                            rows={2}
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                        />
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => setShowRejectForm(false)} className="flex-1">
                                Hủy
                            </Button>
                            <Button size="sm" variant="destructive" onClick={handleReject} className="flex-1" disabled={!rejectReason.trim()}>
                                Xác nhận từ chối
                            </Button>
                        </div>
                    </div>
                )}

                {/* Design Form */}
                {showDesignForm && (
                    <div className="space-y-2 p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                        <Textarea
                            placeholder="Ghi chú cho Design team..."
                            rows={3}
                            value={designNotes}
                            onChange={(e) => setDesignNotes(e.target.value)}
                        />
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => setShowDesignForm(false)} className="flex-1">
                                Hủy
                            </Button>
                            <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700" onClick={handleSendToDesign}>
                                <Palette className="h-4 w-4 mr-2" />
                                Gửi Design
                            </Button>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                {!showRejectForm && !showDesignForm && (
                    <div className="flex flex-wrap gap-2">
                        {concept.status === 'pending_review' && (
                            <>
                                <Button size="sm" className="flex-1" onClick={onApprove}>
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    Duyệt
                                </Button>
                                <Button size="sm" variant="outline" className="flex-1 text-red-600" onClick={() => setShowRejectForm(true)}>
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Từ chối
                                </Button>
                            </>
                        )}

                        {concept.status === 'approved' && (
                            <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => setShowDesignForm(true)}>
                                <Palette className="h-4 w-4 mr-2" />
                                Gửi sang Design
                            </Button>
                        )}

                        {concept.status === 'draft' && (
                            <Button size="sm" className="w-full" onClick={() => {/* submit for review */ }}>
                                <Send className="h-4 w-4 mr-2" />
                                Gửi duyệt
                            </Button>
                        )}

                        {concept.status === 'rejected' && (
                            <Button size="sm" variant="outline" className="w-full">
                                <Edit className="h-4 w-4 mr-2" />
                                Chỉnh sửa và gửi lại
                            </Button>
                        )}
                    </div>
                )}

                {/* Delete */}
                <Button variant="ghost" size="sm" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50" onClick={onDelete}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa concept
                </Button>
            </div>
        </div>
    )
}
