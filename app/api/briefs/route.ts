import { NextRequest, NextResponse } from "next/server"

// In-memory storage (trong thực tế sẽ dùng database)
let briefs: any[] = []

// Initialize với mock data nếu empty
const initializeBriefs = () => {
  if (briefs.length === 0) {
    briefs = [
      {
        id: "brief-draft-1",
        title: "Valentine Campaign - Static Ads",
        appCampaign: "Fashion Show - Valentine 2025",
        kpiTargets: { ctr: 2.0, cvr: 1.5, cpi: 0.55, roas: 1.8 },
        deadline: "2025-02-10",
        region: "US, UK, VN",
        platform: "Both",
        requirements: "Bộ static ads cho Valentine's Day.",
        status: "draft",
        priority: "medium",
        assignedTo: [],
        createdBy: "Marketing Team",
        createdAt: "2025-01-20T08:00:00Z",
        attachments: [],
        activityLog: [{ action: "Tạo brief nháp", by: "Marketing Team", at: "2025-01-20T08:00:00Z" }],
      },
      {
        id: "brief-pending-1",
        title: "Summer Campaign 2025 - Video Ads",
        appCampaign: "Fashion Show - Summer 2025",
        kpiTargets: { ctr: 2.5, cvr: 1.8, cpi: 0.5, roas: 2.0 },
        deadline: "2025-01-28",
        region: "US, UK",
        platform: "Both",
        requirements: "Cần 3 video ads 15s và 30s cho campaign mùa hè.",
        status: "pending",
        priority: "high",
        assignedTo: [],
        createdBy: "Marketing Team",
        createdAt: "2025-01-18T10:00:00Z",
        attachments: [
          { name: "brand-guidelines.pdf", url: "/files/brand-guidelines.pdf", type: "pdf" },
        ],
        activityLog: [
          { action: "Tạo brief mới", by: "Marketing Team", at: "2025-01-18T10:00:00Z" },
          { action: "Gửi brief cho Lead Creative", by: "Marketing Team", at: "2025-01-18T10:05:00Z" },
        ],
      },
      {
        id: "brief-inprogress-1",
        title: "Lunar New Year Banner Set",
        appCampaign: "Puzzle Master - Tết 2025",
        kpiTargets: { ctr: 3.0, cvr: 2.0, cpi: 0.4, roas: 2.5 },
        deadline: "2025-01-22",
        region: "VN, TH, ID",
        platform: "Both",
        requirements: "Set 5 banner cho Tết Nguyên Đán.",
        status: "in_progress",
        priority: "high",
        assignedTo: ["2", "3"],
        createdBy: "UA Team",
        createdAt: "2025-01-15T09:00:00Z",
        leadObjective: "Hoàn thành 5 banner với 2 variations mỗi kích thước.",
        attachments: [],
        activityLog: [
          { action: "Tạo brief mới", by: "UA Team", at: "2025-01-15T09:00:00Z" },
          { action: "Xác nhận brief", by: "Nguyễn Văn An", at: "2025-01-15T14:00:00Z" },
          { action: "Bắt đầu thực hiện", by: "Trần Thị Bình", at: "2025-01-16T08:00:00Z" },
        ],
      },
      {
        id: "brief-completed-1",
        title: "Meditation Promo Video",
        appCampaign: "Meditation Pro - Wellness Month",
        kpiTargets: { ctr: 1.8, cvr: 1.2, cpi: 0.6, roas: 2.5 },
        deadline: "2025-01-15",
        region: "US, UK, JP",
        platform: "iOS",
        requirements: "Video 30s giới thiệu tính năng Sleep Stories mới.",
        status: "completed",
        priority: "low",
        assignedTo: ["3"],
        createdBy: "Marketing Team",
        createdAt: "2025-01-05T08:00:00Z",
        leadObjective: "Video với voice-over tiếng Anh, sub tiếng Nhật.",
        attachments: [{ name: "final-video.mp4", url: "/files/final.mp4", type: "video" }],
        activityLog: [
          { action: "Tạo brief mới", by: "Marketing Team", at: "2025-01-05T08:00:00Z" },
          { action: "Hoàn thành", by: "Lê Văn Cường", at: "2025-01-14T17:00:00Z" },
        ],
      },
      {
        id: "brief-needfix-1",
        title: "App Icon Refresh Q1",
        appCampaign: "Racing Game - Q1 2025",
        kpiTargets: { ctr: 0, cvr: 2.5, cpi: 0, roas: 0 },
        deadline: "2025-01-30",
        region: "GLOBAL",
        platform: "Both",
        requirements: "Làm mới icon app.",
        status: "need_fix",
        priority: "medium",
        assignedTo: ["4"],
        createdBy: "Product Team",
        createdAt: "2025-01-10T08:00:00Z",
        leadObjective: "Tạo 3 concepts khác nhau.",
        attachments: [],
        activityLog: [
          { action: "Tạo brief mới", by: "Product Team", at: "2025-01-10T08:00:00Z" },
          { action: "Yêu cầu chỉnh sửa", by: "Nguyễn Văn An", at: "2025-01-17T16:00:00Z" },
        ],
      },
      {
        id: "brief-refunded-1",
        title: "Fashion Screenshot Update",
        appCampaign: "Fashion Show - ASO Update",
        kpiTargets: { ctr: 0, cvr: 3.0, cpi: 0, roas: 0 },
        deadline: "2025-01-20",
        region: "US",
        platform: "iOS",
        requirements: "Cập nhật 6 screenshots.",
        status: "refunded",
        priority: "medium",
        assignedTo: [],
        createdBy: "ASO Team",
        createdAt: "2025-01-12T08:00:00Z",
        refundReason: "Budget Q1 không đủ.",
        attachments: [],
        activityLog: [
          { action: "Tạo brief mới", by: "ASO Team", at: "2025-01-12T08:00:00Z" },
          { action: "Refund", by: "Nguyễn Văn An", at: "2025-01-13T10:00:00Z" },
        ],
      },
    ]
  }
}

// GET /api/briefs
export async function GET(request: NextRequest) {
  initializeBriefs()
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return NextResponse.json({ briefs, total: briefs.length })
}

// POST /api/briefs
export async function POST(request: NextRequest) {
  initializeBriefs()
  
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.title || !body.appCampaign || !body.deadline) {
      return NextResponse.json(
        { error: "Missing required fields: title, appCampaign, deadline" },
        { status: 400 }
      )
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const newBrief = {
      id: `brief-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      activityLog: [
        {
          action: body.status === "draft" ? "Tạo brief nháp" : "Tạo và gửi brief",
          by: body.createdBy || "Unknown",
          at: new Date().toISOString(),
        },
      ],
    }

    briefs.unshift(newBrief)

    return NextResponse.json({ brief: newBrief }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create brief" },
      { status: 500 }
    )
  }
}
