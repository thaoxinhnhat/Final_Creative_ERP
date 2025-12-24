"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Lightbulb,
    Plus,
    ExternalLink,
    ChevronRight,
    Clock,
    CheckCircle2,
    XCircle,
    Eye
} from "lucide-react"
import { useRouter } from "next/navigation"
import type { Brief, LinkedConceptSummary } from "../types"

interface LinkedConceptsSectionProps {
    brief: Brief
    onCreateConcept: () => void
}

// Status badge config for concepts
const conceptStatusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    'draft': { label: 'Nháp', color: 'bg-gray-100 text-gray-700', icon: <Clock className="h-3 w-3" /> },
    'pending_review': { label: 'Chờ Lead duyệt', color: 'bg-yellow-100 text-yellow-700', icon: <Clock className="h-3 w-3" /> },
    'approved': { label: 'Lead đã duyệt', color: 'bg-green-100 text-green-700', icon: <CheckCircle2 className="h-3 w-3" /> },
    'rejected': { label: 'Lead từ chối', color: 'bg-red-100 text-red-700', icon: <XCircle className="h-3 w-3" /> },
    'waiting_ua_approval': { label: 'Chờ UA duyệt', color: 'bg-amber-100 text-amber-700', icon: <Eye className="h-3 w-3" /> },
    'ua_approved': { label: 'UA đã duyệt', color: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle2 className="h-3 w-3" /> },
    'ua_rejected': { label: 'UA từ chối', color: 'bg-red-100 text-red-700', icon: <XCircle className="h-3 w-3" /> },
    'sent_to_design': { label: 'Đang order', color: 'bg-purple-100 text-purple-700', icon: <Clock className="h-3 w-3" /> },
    'design_in_progress': { label: 'Đang order', color: 'bg-purple-100 text-purple-700', icon: <Clock className="h-3 w-3" /> },
    'completed': { label: 'Hoàn thành', color: 'bg-green-100 text-green-700', icon: <CheckCircle2 className="h-3 w-3" /> },
}

// UA Approval status badge
const uaApprovalBadge: Record<string, { label: string; color: string }> = {
    'pending': { label: 'Chờ UA', color: 'bg-amber-50 text-amber-600 border-amber-200' },
    'approved': { label: 'UA OK', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    'rejected': { label: 'UA Reject', color: 'bg-red-50 text-red-600 border-red-200' },
}

export function LinkedConceptsSection({ brief, onCreateConcept }: LinkedConceptsSectionProps) {
    const router = useRouter()
    const [isExpanded, setIsExpanded] = useState(true)

    const linkedConcepts = brief.linkedConcepts || []
    const conceptCount = brief.conceptCount || linkedConcepts.length
    const totalOrders = brief.totalOrderCount || linkedConcepts.reduce((sum, c) => sum + c.orderCount, 0)

    // Only allow creating Concept when Brief is in active work statuses
    const allowedStatusesForConcept: string[] = [
        'confirmed',           // Đã xác nhận - sẵn sàng brainstorm
        'in_progress',         // Đang thực hiện
        'waiting_design',      // Chờ Design
        'design_done',         // Design xong, có thể tạo thêm Concept
        'need_revision',       // Cần chỉnh sửa - có thể brainstorm lại
    ]
    const canCreateConcept = allowedStatusesForConcept.includes(brief.status)

    const handleViewConcept = (conceptId: string) => {
        // Navigate to concept page with this specific concept selected
        router.push(`/applications/creative/concepts?conceptId=${conceptId}`)
    }

    const handleViewAllConcepts = () => {
        // Navigate to concepts filtered by this brief
        router.push(`/applications/creative/concepts?briefId=${brief.id}`)
    }

    const getStatusConfig = (status: string) => {
        return conceptStatusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-700', icon: null }
    }

    return (
        <Card className="border-blue-100 bg-gradient-to-br from-blue-50/50 to-white">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg bg-yellow-100 flex items-center justify-center">
                            <Lightbulb className="h-4 w-4 text-yellow-600" />
                        </div>
                        <span>Concepts liên kết</span>
                        {conceptCount > 0 && (
                            <Badge variant="secondary" className="text-xs">
                                {conceptCount}
                            </Badge>
                        )}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        {linkedConcepts.length > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs h-7"
                                onClick={handleViewAllConcepts}
                            >
                                Xem tất cả
                                <ExternalLink className="h-3 w-3 ml-1" />
                            </Button>
                        )}
                        {canCreateConcept && (
                            <Button
                                size="sm"
                                className="h-7 text-xs bg-yellow-500 hover:bg-yellow-600"
                                onClick={onCreateConcept}
                            >
                                <Plus className="h-3 w-3 mr-1" />
                                Tạo Concept
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-0">
                {linkedConcepts.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                        <Lightbulb className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">Chưa có concept nào</p>
                        <p className="text-xs mt-1">
                            {canCreateConcept
                                ? 'Nhấn "Tạo Concept" để bắt đầu'
                                : 'Brief cần ở trạng thái "Đã xác nhận" hoặc "Đang thực hiện" để tạo Concept'
                            }
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {/* Quick stats */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                            <span>📦 {totalOrders} orders</span>
                            <span>🎨 {linkedConcepts.filter(c => c.status.includes('design')).length} đang design</span>
                        </div>

                        {/* Concept list */}
                        <ScrollArea className={linkedConcepts.length > 3 ? "h-[200px]" : ""}>
                            <div className="space-y-2">
                                {linkedConcepts.map((concept) => {
                                    const statusConfig = getStatusConfig(concept.status)
                                    const uaStatus = concept.uaApprovalStatus ? uaApprovalBadge[concept.uaApprovalStatus] : null

                                    return (
                                        <div
                                            key={concept.conceptId}
                                            className="flex items-center justify-between p-3 rounded-lg bg-white border hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer group"
                                            onClick={() => handleViewConcept(concept.conceptId)}
                                        >
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <Avatar className="h-8 w-8 flex-shrink-0">
                                                    <AvatarFallback className="text-xs bg-yellow-100 text-yellow-700">
                                                        💡
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium truncate group-hover:text-blue-600">
                                                        {concept.conceptTitle}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge
                                                            variant="secondary"
                                                            className={`text-[10px] px-1.5 py-0 ${statusConfig.color}`}
                                                        >
                                                            {statusConfig.icon}
                                                            <span className="ml-1">{statusConfig.label}</span>
                                                        </Badge>
                                                        {uaStatus && (
                                                            <Badge
                                                                variant="outline"
                                                                className={`text-[10px] px-1.5 py-0 ${uaStatus.color}`}
                                                            >
                                                                {uaStatus.label}
                                                            </Badge>
                                                        )}
                                                        {concept.orderCount > 0 && (
                                                            <span className="text-[10px] text-muted-foreground">
                                                                📦 {concept.orderCount}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 flex-shrink-0" />
                                        </div>
                                    )
                                })}
                            </div>
                        </ScrollArea>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
