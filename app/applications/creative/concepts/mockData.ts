import type { Concept, ConceptTeamMember, TeamType } from "./types"

// ============================================
// TEAM MEMBERS - 6 members + 1 lead per team
// ============================================

// Design Team (7 total)
export const designTeam: ConceptTeamMember[] = [
    { id: "d-lead", name: "Nguyễn Minh Anh", avatar: "NMA", role: "lead_design", team: "design", teamLabel: "Design" },
    { id: "d-1", name: "Trần Hoàng Nam", avatar: "THN", role: "design", team: "design", teamLabel: "Design" },
    { id: "d-2", name: "Lê Thị Hương", avatar: "LTH", role: "design", team: "design", teamLabel: "Design" },
    { id: "d-3", name: "Phạm Văn Đức", avatar: "PVD", role: "design", team: "design", teamLabel: "Design" },
    { id: "d-4", name: "Hoàng Thị Lan", avatar: "HTL", role: "design", team: "design", teamLabel: "Design" },
    { id: "d-5", name: "Đặng Quốc Việt", avatar: "DQV", role: "design", team: "design", teamLabel: "Design" },
    { id: "d-6", name: "Vũ Thị Ngọc", avatar: "VTN", role: "design", team: "design", teamLabel: "Design" },
]

// Art & Stylist Team (7 total)
export const artStylistTeam: ConceptTeamMember[] = [
    { id: "a-lead", name: "Lê Thị Mai", avatar: "LTM", role: "lead_art_stylist", team: "art_stylist", teamLabel: "Art & Stylist" },
    { id: "a-1", name: "Phạm Quốc Huy", avatar: "PQH", role: "art_stylist", team: "art_stylist", teamLabel: "Art & Stylist" },
    { id: "a-2", name: "Trần Văn Khôi", avatar: "TVK", role: "art_stylist", team: "art_stylist", teamLabel: "Art & Stylist" },
    { id: "a-3", name: "Nguyễn Thị Bảo", avatar: "NTB", role: "art_stylist", team: "art_stylist", teamLabel: "Art & Stylist" },
    { id: "a-4", name: "Hoàng Minh Tú", avatar: "HMT", role: "art_stylist", team: "art_stylist", teamLabel: "Art & Stylist" },
    { id: "a-5", name: "Lý Văn Phong", avatar: "LVP", role: "art_stylist", team: "art_stylist", teamLabel: "Art & Stylist" },
    { id: "a-6", name: "Đỗ Thị Hạnh", avatar: "DTH", role: "art_stylist", team: "art_stylist", teamLabel: "Art & Stylist" },
]

// AI Producer Team (7 total)
export const aiProducerTeam: ConceptTeamMember[] = [
    { id: "ai-lead", name: "Đặng Văn Tuấn", avatar: "DVT", role: "lead_ai_producer", team: "ai_producer", teamLabel: "AI Producer" },
    { id: "ai-1", name: "Hoàng Thu Hà", avatar: "HTH", role: "ai_producer", team: "ai_producer", teamLabel: "AI Producer" },
    { id: "ai-2", name: "Nguyễn Công Minh", avatar: "NCM", role: "ai_producer", team: "ai_producer", teamLabel: "AI Producer" },
    { id: "ai-3", name: "Trần Thị Yến", avatar: "TTY", role: "ai_producer", team: "ai_producer", teamLabel: "AI Producer" },
    { id: "ai-4", name: "Lê Đình Khoa", avatar: "LDK", role: "ai_producer", team: "ai_producer", teamLabel: "AI Producer" },
    { id: "ai-5", name: "Phạm Thị Linh", avatar: "PTL", role: "ai_producer", team: "ai_producer", teamLabel: "AI Producer" },
    { id: "ai-6", name: "Vũ Hoàng Long", avatar: "VHL", role: "ai_producer", team: "ai_producer", teamLabel: "AI Producer" },
]

// Creative Team (7 total)
export const creativeTeam: ConceptTeamMember[] = [
    { id: "c-lead", name: "Nguyễn Văn An", avatar: "NVA", role: "lead_creative", team: "creative", teamLabel: "Creative" },
    { id: "c-1", name: "Trần Thị Bình", avatar: "TTB", role: "creative", team: "creative", teamLabel: "Creative" },
    { id: "c-2", name: "Lê Văn Cường", avatar: "LVC", role: "creative", team: "creative", teamLabel: "Creative" },
    { id: "c-3", name: "Phạm Thị Dung", avatar: "PTD", role: "creative", team: "creative", teamLabel: "Creative" },
    { id: "c-4", name: "Hoàng Minh Tuấn", avatar: "HMT", role: "creative", team: "creative", teamLabel: "Creative" },
    { id: "c-5", name: "Đặng Thị Hoa", avatar: "DTH", role: "creative", team: "creative", teamLabel: "Creative" },
    { id: "c-6", name: "Vũ Văn Thành", avatar: "VVT", role: "creative", team: "creative", teamLabel: "Creative" },
]

// All team members combined
export const allTeamMembers: ConceptTeamMember[] = [
    ...designTeam,
    ...artStylistTeam,
    ...aiProducerTeam,
    ...creativeTeam,
]

// Helper to get team by type
export const getTeamByType = (teamType: TeamType): ConceptTeamMember[] => {
    switch (teamType) {
        case 'design': return designTeam
        case 'art_stylist': return artStylistTeam
        case 'ai_producer': return aiProducerTeam
        case 'creative': return creativeTeam
    }
}

// Helper to get team lead
export const getTeamLead = (teamType: TeamType): ConceptTeamMember | undefined => {
    const team = getTeamByType(teamType)
    return team.find(m => m.role.startsWith('lead_'))
}

// Helper to get team members (excluding lead)
export const getTeamMembersOnly = (teamType: TeamType): ConceptTeamMember[] => {
    const team = getTeamByType(teamType)
    return team.filter(m => !m.role.startsWith('lead_'))
}

// ============================================
// MOCK CONCEPTS - với workflow và order assignments
// ============================================
export const mockConcepts: Concept[] = [
    {
        id: "concept_001",
        title: "Summer Beach Campaign - Video Concept",
        description: "Ý tưởng video quảng cáo mùa hè với bối cảnh bãi biển, sử dụng màu sắc tươi sáng và âm nhạc sôi động. Target audience: Gen Z và Millennials thích du lịch.",
        status: "design_in_progress",
        linkedBriefId: "brief_001",
        linkedBriefTitle: "Summer Campaign 2025",
        attachments: [
            {
                id: "att_001",
                name: "beach-moodboard.jpg",
                url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
                type: "image",
                thumbnailUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400"
            },
            {
                id: "att_002",
                name: "summer-palette.png",
                url: "https://images.unsplash.com/photo-1525909002-1b05e0c869d8?w=800",
                type: "image",
                thumbnailUrl: "https://images.unsplash.com/photo-1525909002-1b05e0c869d8?w=400"
            }
        ],
        tags: ["summer", "video", "beach", "gen-z"],
        createdBy: "c-1",
        createdByName: "Trần Thị Bình",
        createdAt: "2024-12-15T09:00:00Z",
        updatedAt: "2024-12-18T14:30:00Z",
        approvedBy: "c-lead",
        approvedByName: "Nguyễn Văn An",
        approvedAt: "2024-12-16T14:30:00Z",
        designNotes: "Sử dụng font chữ rounded, hiệu ứng wave animation cho text. Ưu tiên vertical format cho TikTok/Reels.",
        currentHandler: "design",
        orderAssignments: [
            {
                teamType: "design",
                assignedTo: ["d-1", "d-2"],
                assignedAt: "2024-12-17T09:00:00Z",
                assignedBy: "c-lead",
                deadline: "2024-12-25T17:00:00Z",
                status: "in_progress"
            }
        ],
        workflowHistory: [
            { action: "Tạo concept", by: "Trần Thị Bình", byTeam: "creative", at: "2024-12-15T09:00:00Z" },
            { action: "Duyệt concept", by: "Nguyễn Văn An", byTeam: "creative", at: "2024-12-16T14:30:00Z" },
            { action: "Gửi order cho Design Team", by: "Nguyễn Văn An", byTeam: "creative", at: "2024-12-17T09:00:00Z" },
            { action: "Bắt đầu thực hiện", by: "Trần Hoàng Nam", byTeam: "design", at: "2024-12-18T09:00:00Z" },
        ],
        comments: [
            {
                id: "cmt_001",
                userId: "c-lead",
                userName: "Nguyễn Văn An",
                content: "Ý tưởng rất tốt! Cần thêm reference về color palette cụ thể.",
                createdAt: "2024-12-16T10:00:00Z"
            },
            {
                id: "cmt_002",
                userId: "c-1",
                userName: "Trần Thị Bình",
                content: "Đã bổ sung color palette reference ạ.",
                createdAt: "2024-12-16T11:30:00Z"
            }
        ]
    },
    {
        id: "concept_002",
        title: "Gaming App Endcard Series",
        description: "Series endcard cho game với phong cách neon cyberpunk. Tập trung vào CTA mạnh và visual bắt mắt.",
        status: "ai_completed",
        linkedBriefId: "brief_003",
        linkedBriefTitle: "Gaming App UA Campaign",
        attachments: [
            {
                id: "att_003",
                name: "cyberpunk-ref.jpg",
                url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800",
                type: "image",
                thumbnailUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400"
            }
        ],
        tags: ["gaming", "endcard", "neon", "cyberpunk"],
        createdBy: "c-2",
        createdByName: "Lê Văn Cường",
        createdAt: "2024-12-17T10:00:00Z",
        updatedAt: "2024-12-20T16:00:00Z",
        approvedBy: "c-lead",
        approvedByName: "Nguyễn Văn An",
        approvedAt: "2024-12-17T16:00:00Z",
        designNotes: "Sử dụng glow effects và gradient neon. Text shadow đậm cho visibility. Format: 1200x628 cho Facebook, 1080x1920 cho Stories.",
        currentHandler: "creative",
        orderAssignments: [
            {
                teamType: "ai_producer",
                assignedTo: ["ai-1", "ai-2"],
                assignedAt: "2024-12-18T09:00:00Z",
                assignedBy: "c-lead",
                deadline: "2024-12-22T17:00:00Z",
                status: "completed",
                completedAt: "2024-12-20T16:00:00Z",
                deliverables: [
                    { id: "del_001", name: "endcard_v1.mp4", url: "#", type: "video" },
                    { id: "del_002", name: "endcard_v2.mp4", url: "#", type: "video" }
                ]
            }
        ],
        workflowHistory: [
            { action: "Tạo concept", by: "Lê Văn Cường", byTeam: "creative", at: "2024-12-17T10:00:00Z" },
            { action: "Duyệt concept", by: "Nguyễn Văn An", byTeam: "creative", at: "2024-12-17T16:00:00Z" },
            { action: "Gửi order cho AI Producer", by: "Nguyễn Văn An", byTeam: "creative", at: "2024-12-18T09:00:00Z" },
            { action: "AI Producer hoàn thành", by: "Hoàng Thu Hà", byTeam: "ai_producer", at: "2024-12-20T16:00:00Z" },
        ],
        comments: []
    },
    {
        id: "concept_003",
        title: "Holiday Sale Banner Concept",
        description: "Banner quảng cáo giảm giá mùa lễ hội với theme đỏ-vàng truyền thống, kết hợp với elements hiện đại.",
        status: "pending_review",
        linkedBriefId: "brief_002",
        linkedBriefTitle: "Holiday Campaign Q4",
        attachments: [
            {
                id: "att_004",
                name: "holiday-theme.jpg",
                url: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800",
                type: "image",
                thumbnailUrl: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400"
            }
        ],
        tags: ["holiday", "sale", "banner", "traditional"],
        createdBy: "c-3",
        createdByName: "Phạm Thị Dung",
        createdAt: "2024-12-18T08:00:00Z",
        updatedAt: "2024-12-18T08:00:00Z",
        workflowHistory: [
            { action: "Tạo concept", by: "Phạm Thị Dung", byTeam: "creative", at: "2024-12-18T08:00:00Z" },
        ],
        comments: [
            {
                id: "cmt_003",
                userId: "c-3",
                userName: "Phạm Thị Dung",
                content: "Xin ý kiến về hướng đi này ạ.",
                createdAt: "2024-12-18T08:00:00Z"
            }
        ]
    },
    {
        id: "concept_004",
        title: "App Onboarding Flow Redesign",
        description: "Thiết kế lại flow onboarding với animation smooth và copy ngắn gọn, dễ hiểu.",
        status: "draft",
        attachments: [],
        tags: ["onboarding", "ux", "animation"],
        createdBy: "c-4",
        createdByName: "Hoàng Minh Tuấn",
        createdAt: "2024-12-18T11:00:00Z",
        updatedAt: "2024-12-18T11:00:00Z",
        comments: []
    },
    {
        id: "concept_005",
        title: "Influencer Kit Visual Identity",
        description: "Bộ nhận diện hình ảnh cho influencer marketing campaign. Bao gồm logo usage, color scheme, và template cho các assets.",
        status: "art_returned",
        linkedBriefId: "brief_004",
        linkedBriefTitle: "Influencer Campaign Q1",
        attachments: [
            {
                id: "att_005",
                name: "identity-sketch.jpg",
                url: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=800",
                type: "image",
                thumbnailUrl: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400"
            }
        ],
        tags: ["influencer", "branding", "identity"],
        createdBy: "c-1",
        createdByName: "Trần Thị Bình",
        createdAt: "2024-12-14T15:00:00Z",
        updatedAt: "2024-12-19T10:00:00Z",
        approvedBy: "c-lead",
        approvedByName: "Nguyễn Văn An",
        approvedAt: "2024-12-15T10:00:00Z",
        currentHandler: "creative",
        orderAssignments: [
            {
                teamType: "art_stylist",
                assignedTo: ["a-1", "a-2"],
                assignedAt: "2024-12-16T09:00:00Z",
                assignedBy: "c-lead",
                deadline: "2024-12-24T17:00:00Z",
                status: "returned",
                returnReason: "Cần điều chỉnh color scheme để phù hợp hơn với brand guidelines mới."
            }
        ],
        workflowHistory: [
            { action: "Tạo concept", by: "Trần Thị Bình", byTeam: "creative", at: "2024-12-14T15:00:00Z" },
            { action: "Duyệt concept", by: "Nguyễn Văn An", byTeam: "creative", at: "2024-12-15T10:00:00Z" },
            { action: "Gửi order cho Art & Stylist", by: "Nguyễn Văn An", byTeam: "creative", at: "2024-12-16T09:00:00Z" },
            { action: "Art & Stylist trả lại order", by: "Phạm Quốc Huy", byTeam: "art_stylist", at: "2024-12-19T10:00:00Z", notes: "Cần điều chỉnh color scheme để phù hợp hơn với brand guidelines mới." },
        ],
        comments: [
            {
                id: "cmt_004",
                userId: "a-1",
                userName: "Phạm Quốc Huy",
                content: "Color scheme chưa phù hợp với brand guidelines mới. Vui lòng cập nhật lại yêu cầu.",
                createdAt: "2024-12-19T10:00:00Z"
            }
        ]
    },
    {
        id: "concept_006",
        title: "Product Launch Video",
        description: "Video giới thiệu sản phẩm mới với style minimalist và professional.",
        status: "waiting_creative_review",
        linkedBriefId: "brief_005",
        linkedBriefTitle: "Q1 Product Launch",
        attachments: [],
        tags: ["product", "launch", "video", "minimalist"],
        createdBy: "c-2",
        createdByName: "Lê Văn Cường",
        createdAt: "2024-12-10T09:00:00Z",
        updatedAt: "2024-12-21T16:00:00Z",
        approvedBy: "c-lead",
        approvedByName: "Nguyễn Văn An",
        approvedAt: "2024-12-11T14:00:00Z",
        currentHandler: "creative",
        orderAssignments: [
            {
                teamType: "design",
                assignedTo: ["d-3", "d-4"],
                assignedAt: "2024-12-12T09:00:00Z",
                assignedBy: "c-lead",
                deadline: "2024-12-20T17:00:00Z",
                status: "completed",
                completedAt: "2024-12-18T16:00:00Z",
                deliverables: [
                    { id: "del_003", name: "product_video_v1.mp4", url: "#", type: "video" }
                ]
            },
            {
                teamType: "ai_producer",
                assignedTo: ["ai-3"],
                assignedAt: "2024-12-19T09:00:00Z",
                assignedBy: "c-lead",
                deadline: "2024-12-23T17:00:00Z",
                status: "completed",
                completedAt: "2024-12-21T16:00:00Z",
                deliverables: [
                    { id: "del_004", name: "product_video_final.mp4", url: "#", type: "video" }
                ]
            }
        ],
        workflowHistory: [
            { action: "Tạo concept", by: "Lê Văn Cường", byTeam: "creative", at: "2024-12-10T09:00:00Z" },
            { action: "Duyệt concept", by: "Nguyễn Văn An", byTeam: "creative", at: "2024-12-11T14:00:00Z" },
            { action: "Gửi order cho Design", by: "Nguyễn Văn An", byTeam: "creative", at: "2024-12-12T09:00:00Z" },
            { action: "Design hoàn thành", by: "Phạm Văn Đức", byTeam: "design", at: "2024-12-18T16:00:00Z" },
            { action: "Gửi order cho AI Producer", by: "Nguyễn Văn An", byTeam: "creative", at: "2024-12-19T09:00:00Z" },
            { action: "AI Producer hoàn thành", by: "Trần Thị Yến", byTeam: "ai_producer", at: "2024-12-21T16:00:00Z" },
        ],
        comments: []
    },
    {
        id: "concept_007",
        title: "Fashion Lookbook",
        description: "Lookbook cho bộ sưu tập thời trang mùa xuân với phong cách trẻ trung.",
        status: "completed",
        linkedBriefId: "brief_006",
        linkedBriefTitle: "Spring Fashion Collection",
        attachments: [],
        tags: ["fashion", "lookbook", "spring"],
        createdBy: "c-3",
        createdByName: "Phạm Thị Dung",
        createdAt: "2024-12-01T09:00:00Z",
        updatedAt: "2024-12-15T17:00:00Z",
        approvedBy: "c-lead",
        approvedByName: "Nguyễn Văn An",
        approvedAt: "2024-12-02T10:00:00Z",
        orderAssignments: [
            {
                teamType: "art_stylist",
                assignedTo: ["a-3", "a-4", "a-5"],
                assignedAt: "2024-12-03T09:00:00Z",
                assignedBy: "c-lead",
                deadline: "2024-12-13T17:00:00Z",
                status: "completed",
                completedAt: "2024-12-12T16:00:00Z"
            },
            {
                teamType: "design",
                assignedTo: ["d-5"],
                assignedAt: "2024-12-13T09:00:00Z",
                assignedBy: "c-lead",
                deadline: "2024-12-16T17:00:00Z",
                status: "completed",
                completedAt: "2024-12-15T14:00:00Z"
            }
        ],
        workflowHistory: [
            { action: "Tạo concept", by: "Phạm Thị Dung", byTeam: "creative", at: "2024-12-01T09:00:00Z" },
            { action: "Duyệt concept", by: "Nguyễn Văn An", byTeam: "creative", at: "2024-12-02T10:00:00Z" },
            { action: "Gửi order cho Art & Stylist", by: "Nguyễn Văn An", byTeam: "creative", at: "2024-12-03T09:00:00Z" },
            { action: "Art & Stylist hoàn thành", by: "Nguyễn Thị Bảo", byTeam: "art_stylist", at: "2024-12-12T16:00:00Z" },
            { action: "Gửi order cho Design", by: "Nguyễn Văn An", byTeam: "creative", at: "2024-12-13T09:00:00Z" },
            { action: "Design hoàn thành", by: "Đặng Quốc Việt", byTeam: "design", at: "2024-12-15T14:00:00Z" },
            { action: "Duyệt final và hoàn thành", by: "Nguyễn Văn An", byTeam: "creative", at: "2024-12-15T17:00:00Z" },
        ],
        comments: []
    },
]

// ============================================
// DERIVED DATA & STATS
// ============================================
export const uniqueConceptTags = [...new Set(mockConcepts.flatMap(c => c.tags))]

export const conceptStats = {
    total: mockConcepts.length,
    draft: mockConcepts.filter(c => c.status === 'draft').length,
    pending_review: mockConcepts.filter(c => c.status === 'pending_review').length,
    approved: mockConcepts.filter(c => c.status === 'approved').length,
    rejected: mockConcepts.filter(c => c.status === 'rejected').length,
    // Design workflow
    sent_to_design: mockConcepts.filter(c => c.status === 'sent_to_design').length,
    design_in_progress: mockConcepts.filter(c => c.status === 'design_in_progress').length,
    design_returned: mockConcepts.filter(c => c.status === 'design_returned').length,
    design_completed: mockConcepts.filter(c => c.status === 'design_completed').length,
    // Art & Stylist workflow
    sent_to_art: mockConcepts.filter(c => c.status === 'sent_to_art').length,
    art_in_progress: mockConcepts.filter(c => c.status === 'art_in_progress').length,
    art_returned: mockConcepts.filter(c => c.status === 'art_returned').length,
    art_completed: mockConcepts.filter(c => c.status === 'art_completed').length,
    // AI Producer workflow
    sent_to_ai: mockConcepts.filter(c => c.status === 'sent_to_ai').length,
    ai_in_progress: mockConcepts.filter(c => c.status === 'ai_in_progress').length,
    ai_returned: mockConcepts.filter(c => c.status === 'ai_returned').length,
    ai_completed: mockConcepts.filter(c => c.status === 'ai_completed').length,
    // Final
    waiting_creative_review: mockConcepts.filter(c => c.status === 'waiting_creative_review').length,
    completed: mockConcepts.filter(c => c.status === 'completed').length,
}

// Stats by team handling
export const statsByTeam = {
    design: mockConcepts.filter(c => c.currentHandler === 'design').length,
    art_stylist: mockConcepts.filter(c => c.currentHandler === 'art_stylist').length,
    ai_producer: mockConcepts.filter(c => c.currentHandler === 'ai_producer').length,
    creative: mockConcepts.filter(c => c.currentHandler === 'creative' || !c.currentHandler).length,
}
