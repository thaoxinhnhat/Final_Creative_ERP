// ============================================
// TEAM ROLES FOR CONCEPT & ORDER PAGE
// ============================================
export type ConceptTeamRole =
    | 'lead_design'      // Lead Design Team
    | 'design'           // Design Team
    | 'lead_art_stylist' // Lead Art & Stylist Team
    | 'art_stylist'      // Art & Stylist Team
    | 'lead_ai_producer' // Lead AI Producer Team
    | 'ai_producer'      // AI Producer Team
    | 'lead_creative'    // Lead Creative Team
    | 'creative'         // Creative Team

export type TeamType = 'design' | 'art_stylist' | 'ai_producer' | 'creative'

// ============================================
// CONCEPT STATUS - Enhanced for workflow tracking
// ============================================
export type ConceptStatus =
    | 'draft'                    // Nháp - Creative tạo concept
    | 'pending_review'           // Chờ Lead Creative duyệt
    | 'approved'                 // Lead Creative đã duyệt
    | 'rejected'                 // Lead Creative từ chối
    // NEW: UA Approval step (sau khi Creative duyệt, trước khi Order)
    | 'waiting_ua_approval'      // Chờ UA duyệt concept
    | 'ua_approved'              // UA đã duyệt - sẵn sàng order
    | 'ua_rejected'              // UA từ chối - cần brainstorm lại
    // Design Team workflow
    | 'sent_to_design'           // Đã gửi Design
    | 'design_in_progress'       // Design đang xử lý
    | 'design_returned'          // Design trả lại order
    | 'design_completed'         // Design hoàn thành
    // Art & Stylist workflow
    | 'sent_to_art'              // Đã gửi Art & Stylist
    | 'art_in_progress'          // Art & Stylist đang xử lý
    | 'art_returned'             // Art & Stylist trả lại
    | 'art_completed'            // Art & Stylist hoàn thành
    // AI Producer workflow
    | 'sent_to_ai'               // Đã gửi AI Producer
    | 'ai_in_progress'           // AI Producer đang xử lý
    | 'ai_returned'              // AI Producer trả lại
    | 'ai_completed'             // AI Producer hoàn thành
    // Final states
    | 'waiting_creative_review'  // Chờ Creative duyệt final
    | 'completed'                // Hoàn thành

// ============================================
// TEAM MEMBER
// ============================================
export interface ConceptTeamMember {
    id: string
    name: string
    avatar: string
    role: ConceptTeamRole
    team: TeamType
    teamLabel: string
}

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
// ORDER ASSIGNMENT
// ============================================
export interface OrderAssignment {
    teamType: TeamType
    assignedTo: string[]      // Team member IDs
    assignedAt: string
    assignedBy: string
    deadline: string          // REQUIRED: Order deadline (ISO date string)
    status: 'pending' | 'in_progress' | 'returned' | 'completed'
    returnReason?: string
    completedAt?: string
    deliverables?: Attachment[]
}

// ============================================
// CONCEPT - Enhanced with workflow and Brief linkage
// ============================================
export interface Concept {
    id: string
    title: string
    description: string
    status: ConceptStatus

    // Brief Linkage (1 Concept = 1 Brief)
    linkedBriefId?: string
    linkedBriefTitle?: string
    linkedBrief?: {
        id: string
        title: string
        appCampaign: string
        deadline: string
        priority: 'low' | 'medium' | 'high'
        status: string
        createdBy: string
    }

    // Source tracking - how the concept was created
    source?: 'manual' | 'from_brief'

    attachments: Attachment[]
    tags: string[]
    createdBy: string
    createdByName: string
    createdAt: string
    updatedAt: string

    // Lead Creative Approval
    approvedBy?: string
    approvedByName?: string
    approvedAt?: string
    rejectedReason?: string

    // UA Approval (after Creative approval, before ordering)
    uaApproval?: {
        status: 'pending' | 'approved' | 'rejected'
        reviewedBy?: string
        reviewedByName?: string
        reviewedAt?: string
        feedback?: string
    }

    designNotes?: string
    comments: Comment[]

    // Order workflow
    orderAssignments?: OrderAssignment[]
    currentHandler?: TeamType       // Team đang xử lý
    workflowHistory?: {
        action: string
        by: string
        byTeam: TeamType
        at: string
        notes?: string
    }[]

    // Final Deliverables (auto-saved to Library)
    finalDeliverables?: FinalDeliverable[]
}

// NEW: Final deliverable that can be saved to Library
export interface FinalDeliverable {
    id: string
    name: string
    url: string
    thumbnailUrl?: string
    type: 'image' | 'video' | 'document'
    fromTeam: TeamType
    fromOrderId?: string
    approvedBy?: string
    approvedAt?: string
    addedToLibrary: boolean
    libraryAssetId?: string
}

// ============================================
// FILTERS
// ============================================
export interface ConceptFilters {
    search: string
    status: ConceptStatus | 'all'
    briefId: string | 'all'
    tags: string[]
    team: TeamType | 'all'
    sortBy: 'newest' | 'oldest' | 'title'
}

// ============================================
// STATUS CONFIG - Enhanced with team indicators
// ============================================
export const STATUS_CONFIG: Record<ConceptStatus, {
    label: string
    color: string
    icon: string
    team?: TeamType
    description?: string
}> = {
    draft: {
        label: "Nháp",
        color: "bg-gray-100 text-gray-700 border-gray-200",
        icon: "📝",
        description: "Creative đang soạn thảo"
    },
    pending_review: {
        label: "Chờ duyệt",
        color: "bg-yellow-100 text-yellow-700 border-yellow-200",
        icon: "⏳",
        team: "creative",
        description: "Chờ Lead Creative duyệt"
    },
    approved: {
        label: "Đã duyệt",
        color: "bg-green-100 text-green-700 border-green-200",
        icon: "✅",
        team: "creative",
        description: "Creative đã duyệt, sẵn sàng gửi order"
    },
    rejected: {
        label: "Từ chối",
        color: "bg-red-100 text-red-700 border-red-200",
        icon: "❌",
        team: "creative",
        description: "Lead Creative từ chối concept"
    },
    // UA Approval
    waiting_ua_approval: {
        label: "Chờ UA duyệt",
        color: "bg-amber-100 text-amber-700 border-amber-200",
        icon: "👀",
        description: "Chờ UA Team duyệt concept trước khi order"
    },
    ua_approved: {
        label: "UA đã duyệt",
        color: "bg-emerald-100 text-emerald-700 border-emerald-200",
        icon: "✅",
        description: "UA đã duyệt - sẵn sàng tạo order"
    },
    ua_rejected: {
        label: "UA từ chối",
        color: "bg-red-100 text-red-700 border-red-200",
        icon: "🔙",
        description: "UA từ chối - cần brainstorm lại ý tưởng"
    },
    // Design Team
    sent_to_design: {
        label: "Đã gửi Design",
        color: "bg-purple-100 text-purple-700 border-purple-200",
        icon: "🎨",
        team: "design",
        description: "Order đã gửi cho Design Team"
    },
    design_in_progress: {
        label: "Design đang xử lý",
        color: "bg-purple-200 text-purple-800 border-purple-300",
        icon: "🎨",
        team: "design",
        description: "Design Team đang thực hiện"
    },
    design_returned: {
        label: "Design trả lại",
        color: "bg-orange-100 text-orange-700 border-orange-200",
        icon: "↩️",
        team: "design",
        description: "Design Team trả lại order"
    },
    design_completed: {
        label: "Design hoàn thành",
        color: "bg-purple-50 text-purple-600 border-purple-100",
        icon: "✅",
        team: "design",
        description: "Design Team đã hoàn thành"
    },
    // Art & Stylist Team
    sent_to_art: {
        label: "Đã gửi Art & Stylist",
        color: "bg-pink-100 text-pink-700 border-pink-200",
        icon: "🖌️",
        team: "art_stylist",
        description: "Order đã gửi cho Art & Stylist Team"
    },
    art_in_progress: {
        label: "Art & Stylist đang xử lý",
        color: "bg-pink-200 text-pink-800 border-pink-300",
        icon: "🖌️",
        team: "art_stylist",
        description: "Art & Stylist Team đang thực hiện"
    },
    art_returned: {
        label: "Art & Stylist trả lại",
        color: "bg-orange-100 text-orange-700 border-orange-200",
        icon: "↩️",
        team: "art_stylist",
        description: "Art & Stylist Team trả lại order"
    },
    art_completed: {
        label: "Art & Stylist hoàn thành",
        color: "bg-pink-50 text-pink-600 border-pink-100",
        icon: "✅",
        team: "art_stylist",
        description: "Art & Stylist Team đã hoàn thành"
    },
    // AI Producer Team
    sent_to_ai: {
        label: "Đã gửi AI Producer",
        color: "bg-blue-100 text-blue-700 border-blue-200",
        icon: "🤖",
        team: "ai_producer",
        description: "Order đã gửi cho AI Producer Team"
    },
    ai_in_progress: {
        label: "AI Producer đang xử lý",
        color: "bg-blue-200 text-blue-800 border-blue-300",
        icon: "🤖",
        team: "ai_producer",
        description: "AI Producer Team đang thực hiện"
    },
    ai_returned: {
        label: "AI Producer trả lại",
        color: "bg-orange-100 text-orange-700 border-orange-200",
        icon: "↩️",
        team: "ai_producer",
        description: "AI Producer Team trả lại order"
    },
    ai_completed: {
        label: "AI Producer hoàn thành",
        color: "bg-blue-50 text-blue-600 border-blue-100",
        icon: "✅",
        team: "ai_producer",
        description: "AI Producer Team đã hoàn thành"
    },
    // Final states
    waiting_creative_review: {
        label: "Chờ Creative duyệt",
        color: "bg-teal-100 text-teal-700 border-teal-200",
        icon: "👀",
        team: "creative",
        description: "Chờ Creative duyệt kết quả cuối"
    },
    completed: {
        label: "Hoàn thành",
        color: "bg-green-100 text-green-700 border-green-200",
        icon: "🎉",
        description: "Order đã hoàn thành"
    },
}

// ============================================
// TEAM CONFIG
// ============================================
export const TEAM_CONFIG: Record<TeamType, {
    label: string
    color: string
    bgColor: string
    icon: string
}> = {
    design: {
        label: "Design",
        color: "text-purple-700",
        bgColor: "bg-purple-100",
        icon: "🎨"
    },
    art_stylist: {
        label: "Art & Stylist",
        color: "text-pink-700",
        bgColor: "bg-pink-100",
        icon: "🖌️"
    },
    ai_producer: {
        label: "AI Producer",
        color: "text-blue-700",
        bgColor: "bg-blue-100",
        icon: "🤖"
    },
    creative: {
        label: "Creative",
        color: "text-green-700",
        bgColor: "bg-green-100",
        icon: "💡"
    }
}
