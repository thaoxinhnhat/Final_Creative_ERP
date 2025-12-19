// ============================================
// CONCEPT STATUS
// ============================================
export type ConceptStatus =
    | 'draft'           // Nháp
    | 'pending_review'  // Chờ duyệt
    | 'approved'        // Đã duyệt
    | 'rejected'        // Từ chối
    | 'sent_to_design'  // Đã gửi Design

// ============================================
// ATTACHMENT
// ============================================
export interface Attachment {
    id: string
    name: string
    url: string
    type: 'image' | 'video' | 'document'
    thumbnailUrl?: string
    size?: number
}

// ============================================
// COMMENT
// ============================================
export interface Comment {
    id: string
    userId: string
    userName: string
    userAvatar?: string
    content: string
    createdAt: string
}

// ============================================
// CONCEPT
// ============================================
export interface Concept {
    id: string
    title: string
    description: string
    status: ConceptStatus
    linkedBriefId?: string
    linkedBriefTitle?: string
    attachments: Attachment[]
    tags: string[]
    createdBy: string
    createdByName: string
    createdAt: string
    updatedAt: string
    approvedBy?: string
    approvedByName?: string
    approvedAt?: string
    rejectedReason?: string
    designNotes?: string
    comments: Comment[]
}

// ============================================
// FILTERS
// ============================================
export interface ConceptFilters {
    search: string
    status: ConceptStatus | 'all'
    briefId: string | 'all'
    tags: string[]
    sortBy: 'newest' | 'oldest' | 'title'
}

// ============================================
// STATUS CONFIG
// ============================================
export const STATUS_CONFIG: Record<ConceptStatus, { label: string; color: string; icon: string }> = {
    draft: {
        label: "Nháp",
        color: "bg-gray-100 text-gray-700 border-gray-200",
        icon: "📝"
    },
    pending_review: {
        label: "Chờ duyệt",
        color: "bg-yellow-100 text-yellow-700 border-yellow-200",
        icon: "⏳"
    },
    approved: {
        label: "Đã duyệt",
        color: "bg-green-100 text-green-700 border-green-200",
        icon: "✅"
    },
    rejected: {
        label: "Từ chối",
        color: "bg-red-100 text-red-700 border-red-200",
        icon: "❌"
    },
    sent_to_design: {
        label: "Đã gửi Design",
        color: "bg-purple-100 text-purple-700 border-purple-200",
        icon: "🎨"
    },
}
