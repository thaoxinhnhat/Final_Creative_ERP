import type { Concept } from "./types"

export const mockConcepts: Concept[] = [
    {
        id: "concept_001",
        title: "Summer Beach Campaign - Video Concept",
        description: "Ý tưởng video quảng cáo mùa hè với bối cảnh bãi biển, sử dụng màu sắc tươi sáng và âm nhạc sôi động. Target audience: Gen Z và Millennials thích du lịch.",
        status: "approved",
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
        createdBy: "2",
        createdByName: "Trần Thị Bình",
        createdAt: "2024-12-15T09:00:00Z",
        updatedAt: "2024-12-16T14:30:00Z",
        approvedBy: "1",
        approvedByName: "Nguyễn Văn An",
        approvedAt: "2024-12-16T14:30:00Z",
        designNotes: "Sử dụng font chữ rounded, hiệu ứng wave animation cho text. Ưu tiên vertical format cho TikTok/Reels.",
        comments: [
            {
                id: "cmt_001",
                userId: "1",
                userName: "Nguyễn Văn An",
                content: "Ý tưởng rất tốt! Cần thêm reference về color palette cụ thể.",
                createdAt: "2024-12-16T10:00:00Z"
            },
            {
                id: "cmt_002",
                userId: "2",
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
        status: "sent_to_design",
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
        createdBy: "3",
        createdByName: "Lê Văn Cường",
        createdAt: "2024-12-17T10:00:00Z",
        updatedAt: "2024-12-18T09:00:00Z",
        approvedBy: "1",
        approvedByName: "Nguyễn Văn An",
        approvedAt: "2024-12-17T16:00:00Z",
        designNotes: "Sử dụng glow effects và gradient neon. Text shadow đậm cho visibility. Format: 1200x628 cho Facebook, 1080x1920 cho Stories.",
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
        createdBy: "4",
        createdByName: "Phạm Thị Dung",
        createdAt: "2024-12-18T08:00:00Z",
        updatedAt: "2024-12-18T08:00:00Z",
        comments: [
            {
                id: "cmt_003",
                userId: "4",
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
        createdBy: "5",
        createdByName: "Hoàng Minh Tuấn",
        createdAt: "2024-12-18T11:00:00Z",
        updatedAt: "2024-12-18T11:00:00Z",
        comments: []
    },
    {
        id: "concept_005",
        title: "Influencer Kit Visual Identity",
        description: "Bộ nhận diện hình ảnh cho influencer marketing campaign. Bao gồm logo usage, color scheme, và template cho các assets.",
        status: "rejected",
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
        createdBy: "2",
        createdByName: "Trần Thị Bình",
        createdAt: "2024-12-14T15:00:00Z",
        updatedAt: "2024-12-15T10:00:00Z",
        rejectedReason: "Cần điều chỉnh color scheme để phù hợp hơn với brand guidelines mới.",
        comments: [
            {
                id: "cmt_004",
                userId: "1",
                userName: "Nguyễn Văn An",
                content: "Color scheme chưa phù hợp với brand guidelines mới. Vui lòng cập nhật lại.",
                createdAt: "2024-12-15T10:00:00Z"
            }
        ]
    },
]

// Derived data
export const uniqueConceptTags = [...new Set(mockConcepts.flatMap(c => c.tags))]

export const conceptStats = {
    total: mockConcepts.length,
    draft: mockConcepts.filter(c => c.status === 'draft').length,
    pending_review: mockConcepts.filter(c => c.status === 'pending_review').length,
    approved: mockConcepts.filter(c => c.status === 'approved').length,
    rejected: mockConcepts.filter(c => c.status === 'rejected').length,
    sent_to_design: mockConcepts.filter(c => c.status === 'sent_to_design').length,
}
