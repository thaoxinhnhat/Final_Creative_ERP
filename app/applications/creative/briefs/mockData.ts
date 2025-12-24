import type { Brief, TeamMember } from "./types"

// ============================================
// TEAM MEMBERS
// ============================================
export const teamMembers: TeamMember[] = [
  { id: "1", name: "Nguyễn Văn An", avatar: "NA", role: "lead_creative" },
  { id: "2", name: "Trần Thị Bình", avatar: "TB", role: "creative" },
  { id: "3", name: "Lê Văn Cường", avatar: "LC", role: "creative" },
  { id: "4", name: "Phạm Thị Dung", avatar: "PD", role: "creative" },
  { id: "5", name: "Hoàng Minh Tuấn", avatar: "HT", role: "creative" },
]

export const mockUsers = {
  ua: { id: "ua-1", name: "Marketing Team", role: "ua" },
  ua2: { id: "ua-2", name: "UA Team", role: "ua" },
  lead: { id: "1", name: "Nguyễn Văn An", role: "lead" },
  creative: { id: "2", name: "Trần Thị Bình", role: "creative" },
}

export const mockApps = [
  { id: "1", name: "Fashion Show", bundleId: "com.example.fashionshow" },
  { id: "2", name: "Puzzle Master", bundleId: "com.example.puzzlemaster" },
  { id: "3", name: "Racing Game", bundleId: "com.example.racinggame" },
  { id: "4", name: "Meditation Pro", bundleId: "com.example.meditationpro" },
  { id: "5", name: "Focus Timer", bundleId: "com.example.focustimer" },
]

export const regions = [
  { code: "US", name: "United States" },
  { code: "UK", name: "United Kingdom" },
  { code: "VN", name: "Vietnam" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "GLOBAL", name: "Global" },
]

// Helper to generate attachments
const createAttachments = (briefId: string, uploadedBy: string) => [
  // 3 Banners
  { id: `${briefId}-b1`, name: "banner_main.jpg", url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800", type: "image" as const, size: 2097152, uploadedAt: "2025-12-10T08:00:00Z", uploadedBy },
  { id: `${briefId}-b2`, name: "banner_alt.jpg", url: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800", type: "image" as const, size: 1835008, uploadedAt: "2025-12-10T08:02:00Z", uploadedBy },
  { id: `${briefId}-b3`, name: "banner_mobile.jpg", url: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800", type: "image" as const, size: 1572864, uploadedAt: "2025-12-10T08:04:00Z", uploadedBy },
  // 2 Screenshots
  { id: `${briefId}-s1`, name: "screenshot_1.jpg", url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800", type: "image" as const, size: 1310720, uploadedAt: "2025-12-10T08:06:00Z", uploadedBy },
  { id: `${briefId}-s2`, name: "screenshot_2.jpg", url: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800", type: "image" as const, size: 1245184, uploadedAt: "2025-12-10T08:08:00Z", uploadedBy },
  // 5 Icons
  { id: `${briefId}-i1`, name: "icon_main.png", url: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=400", type: "image" as const, size: 524288, uploadedAt: "2025-12-10T08:10:00Z", uploadedBy },
  { id: `${briefId}-i2`, name: "icon_alt.png", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400", type: "image" as const, size: 458752, uploadedAt: "2025-12-10T08:12:00Z", uploadedBy },
  { id: `${briefId}-i3`, name: "icon_dark.png", url: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=400", type: "image" as const, size: 393216, uploadedAt: "2025-12-10T08:14:00Z", uploadedBy },
  { id: `${briefId}-i4`, name: "icon_light.png", url: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400", type: "image" as const, size: 327680, uploadedAt: "2025-12-10T08:16:00Z", uploadedBy },
  { id: `${briefId}-i5`, name: "icon_holiday.png", url: "https://images.unsplash.com/photo-1521967906867-14ec9d64bee8?w=400", type: "image" as const, size: 491520, uploadedAt: "2025-12-10T08:18:00Z", uploadedBy },
  // 3 Videos
  { id: `${briefId}-v1`, name: "video_promo.mp4", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", type: "video" as const, size: 8388608, uploadedAt: "2025-12-10T08:20:00Z", uploadedBy },
  { id: `${briefId}-v2`, name: "video_demo.mp4", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", type: "video" as const, size: 10485760, uploadedAt: "2025-12-10T08:22:00Z", uploadedBy },
  { id: `${briefId}-v3`, name: "video_reference.mp4", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", type: "video" as const, size: 6291456, uploadedAt: "2025-12-10T08:24:00Z", uploadedBy },
  // 2 PDFs
  { id: `${briefId}-p1`, name: "brand_guidelines.pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", type: "pdf" as const, size: 2097152, uploadedAt: "2025-12-10T08:26:00Z", uploadedBy },
  { id: `${briefId}-p2`, name: "brief_document.pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", type: "pdf" as const, size: 1572864, uploadedAt: "2025-12-10T08:28:00Z", uploadedBy },
]

// ============================================
// MOCK BRIEFS - 5 briefs per status, 2 overdue max per status
// ============================================
export const initialBriefs: Brief[] = [
  // ========== DRAFT (5 briefs, 2 overdue) ==========
  { id: "draft-1", title: "Valentine Campaign - Banner Set", appCampaign: "Fashion Show - Valentine 2026", kpiTargets: { ctr: 2.0, cvr: 1.5, cpi: 0.55, roas: 1.8 }, deadline: "2026-01-25", region: "US, UK", audience: "Women 18-35", platform: "iOS", formats: ["static_1_1", "static_9_16"], requirements: "Valentine banner campaign với theme romantic", status: "draft", priority: "medium", assignedTo: [], createdBy: "Marketing Team", createdAt: "2025-12-10T08:00:00Z", attachments: createAttachments("draft-1", "Marketing Team"), activityLog: [{ action: "Tạo brief nháp", by: "Marketing Team", at: "2025-12-10T08:00:00Z" }] },
  { id: "draft-2", title: "Spring Collection Preview", appCampaign: "Fashion Show - Spring 2026", kpiTargets: { ctr: 2.5, cvr: 1.8, cpi: 0.5, roas: 2.0 }, deadline: "2026-02-10", region: "GLOBAL", audience: "Fashion enthusiasts 18-45", platform: "iOS", formats: ["video_15s", "static_9_16"], requirements: "Spring collection launch campaign", status: "draft", priority: "high", assignedTo: [], createdBy: "Marketing Team", createdAt: "2025-12-12T10:00:00Z", attachments: createAttachments("draft-2", "Marketing Team"), activityLog: [{ action: "Tạo brief nháp", by: "Marketing Team", at: "2025-12-12T10:00:00Z" }] },
  { id: "draft-3", title: "Puzzle Master Easter Update", appCampaign: "Puzzle Master - Easter 2026", kpiTargets: { ctr: 2.2, cvr: 1.6, cpi: 0.48, roas: 1.9 }, deadline: "2026-03-01", region: "US, UK, JP", audience: "Casual gamers 25-50", platform: "Android", formats: ["static_1_1", "app_icon"], requirements: "Easter themed puzzle campaign", status: "draft", priority: "medium", assignedTo: [], createdBy: "UA Team", createdAt: "2025-12-14T09:00:00Z", attachments: createAttachments("draft-3", "UA Team"), activityLog: [{ action: "Tạo brief nháp", by: "UA Team", at: "2025-12-14T09:00:00Z" }] },
  // 2 Overdue drafts
  { id: "draft-4", title: "Racing Game Icon Refresh", appCampaign: "Racing Game - Q4 2025", kpiTargets: { ctr: 0, cvr: 2.5, cpi: 0, roas: 0 }, deadline: "2025-11-15", region: "GLOBAL", audience: "Racing fans 16-40", platform: "iOS", formats: ["app_icon"], requirements: "Làm mới icon app cho Q4", status: "draft", priority: "low", assignedTo: [], createdBy: "Product Team", createdAt: "2025-10-01T08:00:00Z", attachments: createAttachments("draft-4", "Product Team"), activityLog: [{ action: "Tạo brief nháp", by: "Product Team", at: "2025-10-01T08:00:00Z" }] },
  { id: "draft-5", title: "Meditation Holiday Campaign", appCampaign: "Meditation Pro - Holiday 2025", kpiTargets: { ctr: 1.8, cvr: 1.2, cpi: 0.6, roas: 2.0 }, deadline: "2025-12-01", region: "US, UK", audience: "Wellness seekers 25-55", platform: "iOS", formats: ["video_30s"], requirements: "Holiday relaxation campaign", status: "draft", priority: "medium", assignedTo: [], createdBy: "Marketing Team", createdAt: "2025-10-15T10:00:00Z", attachments: createAttachments("draft-5", "Marketing Team"), activityLog: [{ action: "Tạo brief nháp", by: "Marketing Team", at: "2025-10-15T10:00:00Z" }] },

  // ========== PENDING (5 briefs, 2 overdue) ==========
  { id: "pending-1", title: "Summer Video Campaign", appCampaign: "Fashion Show - Summer 2026", kpiTargets: { ctr: 2.5, cvr: 1.8, cpi: 0.5, roas: 2.0 }, deadline: "2026-01-28", region: "US, UK", audience: "Fashion enthusiasts 18-45", platform: "iOS", formats: ["video_15s", "video_30s"], requirements: "Video ads cho summer collection", status: "pending", priority: "high", assignedTo: [], createdBy: "Marketing Team", createdAt: "2025-12-10T10:00:00Z", attachments: createAttachments("pending-1", "Marketing Team"), activityLog: [{ action: "Tạo brief mới", by: "Marketing Team", at: "2025-12-10T10:00:00Z" }, { action: "Gửi brief cho Lead Creative", by: "Marketing Team", at: "2025-12-10T10:05:00Z" }] },
  { id: "pending-2", title: "Puzzle Master Brain Week", appCampaign: "Puzzle Master - Q1 2026", kpiTargets: { ctr: 2.4, cvr: 1.7, cpi: 0.42, roas: 2.2 }, deadline: "2026-02-05", region: "GLOBAL", audience: "Adults 30-60", platform: "Android", formats: ["static_1_1", "video_15s"], requirements: "Brain training week campaign", status: "pending", priority: "medium", assignedTo: [], createdBy: "UA Team", createdAt: "2025-12-11T09:00:00Z", attachments: createAttachments("pending-2", "UA Team"), activityLog: [{ action: "Tạo brief mới", by: "UA Team", at: "2025-12-11T09:00:00Z" }] },
  { id: "pending-3", title: "Racing Championship Season", appCampaign: "Racing Game - Q1 2026", kpiTargets: { ctr: 3.2, cvr: 1.9, cpi: 0.38, roas: 2.8 }, deadline: "2026-02-10", region: "US, UK, KR", audience: "Racing fans 16-40", platform: "iOS", formats: ["video_30s", "static_16_9"], requirements: "Championship season campaign", status: "pending", priority: "high", assignedTo: [], createdBy: "UA Team", createdAt: "2025-12-12T10:00:00Z", attachments: createAttachments("pending-3", "UA Team"), activityLog: [{ action: "Tạo brief mới", by: "UA Team", at: "2025-12-12T10:00:00Z" }] },
  // 2 Overdue pending
  { id: "pending-4", title: "Meditation Sleep Stories", appCampaign: "Meditation Pro - Holiday 2025", kpiTargets: { ctr: 1.8, cvr: 1.3, cpi: 0.58, roas: 2.0 }, deadline: "2025-11-20", region: "US, UK, JP", audience: "Adults 25-55", platform: "iOS", formats: ["video_30s"], requirements: "Sleep stories feature launch", status: "pending", priority: "medium", assignedTo: [], createdBy: "Marketing Team", createdAt: "2025-10-20T15:00:00Z", attachments: createAttachments("pending-4", "Marketing Team"), activityLog: [{ action: "Tạo brief mới", by: "Marketing Team", at: "2025-10-20T15:00:00Z" }] },
  { id: "pending-5", title: "Fashion Valentine Collection", appCampaign: "Fashion Show - Holiday 2025", kpiTargets: { ctr: 2.8, cvr: 2.0, cpi: 0.45, roas: 2.4 }, deadline: "2025-12-08", region: "US, UK, VN", audience: "Couples 18-40", platform: "iOS", formats: ["static_1_1", "video_15s"], requirements: "Valentine collection promotion", status: "pending", priority: "high", assignedTo: [], createdBy: "Marketing Team", createdAt: "2025-11-01T11:00:00Z", attachments: createAttachments("pending-5", "Marketing Team"), activityLog: [{ action: "Tạo brief mới", by: "Marketing Team", at: "2025-11-01T11:00:00Z" }] },

  // ========== CONFIRMED (5 briefs, 2 overdue) ==========
  { id: "confirmed-1", title: "Holiday Static Ads Q1", appCampaign: "Puzzle Master - Holiday 2026", kpiTargets: { ctr: 2.2, cvr: 1.5, cpi: 0.45, roas: 1.8 }, deadline: "2026-02-01", region: "GLOBAL", platform: "iOS", requirements: "Static ads cho các dịp lễ Q1", status: "confirmed", priority: "medium", assignedTo: ["2", "5"], createdBy: "Marketing Team", createdAt: "2025-12-08T08:00:00Z", leadObjective: "Tạo template master có thể swap text/elements", attachments: createAttachments("confirmed-1", "Marketing Team"), activityLog: [{ action: "Tạo brief mới", by: "Marketing Team", at: "2025-12-08T08:00:00Z" }, { action: "Xác nhận brief", by: "Nguyễn Văn An", at: "2025-12-08T14:00:00Z" }] },
  { id: "confirmed-2", title: "New Year Social Ads", appCampaign: "Fashion Show - New Year 2026", kpiTargets: { ctr: 2.2, cvr: 1.6, cpi: 0.48, roas: 2.1 }, deadline: "2026-01-15", region: "VN, TH", audience: "Fashion enthusiasts 18-35", platform: "iOS", formats: ["static_9_16", "video_15s"], requirements: "Social ads cho Tết Nguyên Đán", status: "confirmed", priority: "high", assignedTo: ["2", "5"], createdBy: "Marketing Team", createdAt: "2025-12-10T10:00:00Z", leadObjective: "Focus Tết theme, bright colors", attachments: createAttachments("confirmed-2", "Marketing Team"), activityLog: [{ action: "Tạo brief mới", by: "Marketing Team", at: "2025-12-10T10:00:00Z" }, { action: "Xác nhận brief", by: "Nguyễn Văn An", at: "2025-12-10T14:00:00Z" }] },
  { id: "confirmed-3", title: "Racing New Car Pack", appCampaign: "Racing Game - Summer 2026", kpiTargets: { ctr: 3.0, cvr: 1.8, cpi: 0.40, roas: 2.6 }, deadline: "2026-02-12", region: "US, UK, KR", audience: "Car enthusiasts 18-45", platform: "iOS", formats: ["video_30s", "static_16_9"], requirements: "New premium car pack launch", status: "confirmed", priority: "high", assignedTo: ["2", "5"], createdBy: "Product Team", createdAt: "2025-12-12T10:00:00Z", leadObjective: "Highlight premium feel of new cars", attachments: createAttachments("confirmed-3", "Product Team"), activityLog: [{ action: "Tạo brief mới", by: "Product Team", at: "2025-12-12T10:00:00Z" }, { action: "Xác nhận brief", by: "Nguyễn Văn An", at: "2025-12-12T15:00:00Z" }] },
  // 2 Overdue confirmed
  { id: "confirmed-4", title: "Meditation Focus Music", appCampaign: "Meditation Pro - Q4 2025", kpiTargets: { ctr: 2.1, cvr: 1.5, cpi: 0.50, roas: 2.0 }, deadline: "2025-11-25", region: "US, UK, VN", audience: "Remote workers 25-45", platform: "iOS", formats: ["static_9_16", "video_15s"], requirements: "Focus music feature launch", status: "confirmed", priority: "medium", assignedTo: ["4", "5"], createdBy: "Product Team", createdAt: "2025-10-18T14:00:00Z", leadObjective: "Show productivity benefits", attachments: createAttachments("confirmed-4", "Product Team"), activityLog: [{ action: "Tạo brief mới", by: "Product Team", at: "2025-10-18T14:00:00Z" }, { action: "Xác nhận brief", by: "Nguyễn Văn An", at: "2025-10-18T17:00:00Z" }] },
  { id: "confirmed-5", title: "Puzzle World Tour", appCampaign: "Puzzle Master - Summer 2025", kpiTargets: { ctr: 2.5, cvr: 1.8, cpi: 0.44, roas: 2.3 }, deadline: "2025-12-05", region: "GLOBAL", audience: "Travel lovers 25-55", platform: "Android", formats: ["static_1_1", "video_15s"], requirements: "World landmarks puzzle collection", status: "confirmed", priority: "medium", assignedTo: ["2", "4"], createdBy: "UA Team", createdAt: "2025-11-05T14:00:00Z", leadObjective: "Wanderlust aesthetic", attachments: createAttachments("confirmed-5", "UA Team"), activityLog: [{ action: "Tạo brief mới", by: "UA Team", at: "2025-11-05T14:00:00Z" }, { action: "Xác nhận brief", by: "Nguyễn Văn An", at: "2025-11-05T17:00:00Z" }] },

  // ========== IN_PROGRESS (5 briefs, 2 overdue) ==========
  { id: "inprogress-1", title: "Lunar New Year Banner Set", appCampaign: "Puzzle Master - Tết 2026", kpiTargets: { ctr: 3.0, cvr: 2.0, cpi: 0.4, roas: 2.5 }, deadline: "2026-01-22", region: "VN, TH, ID", audience: "Casual gamers 18-45", platform: "Android", formats: ["static_1_1", "static_9_16"], requirements: "Set 5 banner cho Tết Nguyên Đán", status: "in_progress", priority: "high", assignedTo: ["2", "3"], createdBy: "Marketing Team", createdAt: "2025-12-01T09:00:00Z", leadObjective: "Hoàn thành 5 banner với 2 variations", attachments: createAttachments("inprogress-1", "Marketing Team"), activityLog: [{ action: "Tạo brief mới", by: "Marketing Team", at: "2025-12-01T09:00:00Z" }, { action: "Bắt đầu thực hiện", by: "Trần Thị Bình", at: "2025-12-02T08:00:00Z" }] },
  { id: "inprogress-2", title: "Racing Spring Update", appCampaign: "Racing Game - Spring 2026", kpiTargets: { ctr: 2.8, cvr: 1.5, cpi: 0.45, roas: 2.2 }, deadline: "2026-01-25", region: "US, UK, DE", audience: "Racing fans 16-40", platform: "iOS", formats: ["static_16_9", "video_30s"], requirements: "Spring Update banners và video", status: "in_progress", priority: "medium", assignedTo: ["4"], createdBy: "UA Team", createdAt: "2025-12-05T11:00:00Z", leadObjective: "Focus vào new car models", attachments: createAttachments("inprogress-2", "UA Team"), activityLog: [{ action: "Tạo brief mới", by: "UA Team", at: "2025-12-05T11:00:00Z" }, { action: "Bắt đầu thực hiện", by: "Phạm Thị Dung", at: "2025-12-06T09:00:00Z" }] },
  { id: "inprogress-3", title: "Morning Routine Series", appCampaign: "Meditation Pro - Q1 2026", kpiTargets: { ctr: 2.0, cvr: 1.4, cpi: 0.52, roas: 1.9 }, deadline: "2026-01-28", region: "US, UK, VN", audience: "Early risers 25-50", platform: "iOS", formats: ["video_30s", "static_9_16"], requirements: "Morning routine meditation series", status: "in_progress", priority: "medium", assignedTo: ["3"], createdBy: "Marketing Team", createdAt: "2025-12-08T08:00:00Z", leadObjective: "Warm sunrise aesthetic", attachments: createAttachments("inprogress-3", "Marketing Team"), activityLog: [{ action: "Tạo brief mới", by: "Marketing Team", at: "2025-12-08T08:00:00Z" }, { action: "Bắt đầu thực hiện", by: "Lê Văn Cường", at: "2025-12-09T09:00:00Z" }] },
  // 2 Overdue in_progress
  { id: "inprogress-4", title: "Fashion Workwear Collection", appCampaign: "Fashion Show - Q4 2025", kpiTargets: { ctr: 2.4, cvr: 1.6, cpi: 0.48, roas: 2.2 }, deadline: "2025-11-30", region: "US, UK, VN", audience: "Working professionals 25-45", platform: "iOS", formats: ["video_15s", "static_9_16"], requirements: "Professional workwear collection", status: "in_progress", priority: "medium", assignedTo: ["2"], createdBy: "Marketing Team", createdAt: "2025-10-15T11:00:00Z", leadObjective: "Sophisticated yet approachable", attachments: createAttachments("inprogress-4", "Marketing Team"), activityLog: [{ action: "Tạo brief mới", by: "Marketing Team", at: "2025-10-15T11:00:00Z" }, { action: "Bắt đầu thực hiện", by: "Trần Thị Bình", at: "2025-10-16T09:00:00Z" }] },
  { id: "inprogress-5", title: "Puzzle Multiplayer Mode", appCampaign: "Puzzle Master - Summer 2025", kpiTargets: { ctr: 2.7, cvr: 1.8, cpi: 0.44, roas: 2.3 }, deadline: "2025-12-10", region: "US, UK, JP", audience: "Social gamers 18-45", platform: "Android", formats: ["video_30s", "static_1_1"], requirements: "Multiplayer mode launch campaign", status: "in_progress", priority: "high", assignedTo: ["3", "5"], createdBy: "UA Team", createdAt: "2025-11-01T09:00:00Z", leadObjective: "Highlight social aspect", attachments: createAttachments("inprogress-5", "UA Team"), activityLog: [{ action: "Tạo brief mới", by: "UA Team", at: "2025-11-01T09:00:00Z" }, { action: "Bắt đầu thực hiện", by: "Lê Văn Cường", at: "2025-11-02T08:00:00Z" }] },

  // ========== NEED_REVISION (5 briefs, 2 overdue) ==========
  { id: "needfix-1", title: "App Icon Refresh Q1", appCampaign: "Racing Game - Q1 2026", kpiTargets: { ctr: 0, cvr: 2.5, cpi: 0, roas: 0 }, deadline: "2026-01-30", region: "GLOBAL", audience: "Racing fans 16-40", platform: "Android", formats: ["app_icon"], requirements: "Làm mới icon app", status: "need_revision", priority: "medium", assignedTo: ["4"], createdBy: "Product Team", createdAt: "2025-12-01T08:00:00Z", leadObjective: "Cần revision: thêm motion blur effect", attachments: createAttachments("needfix-1", "Product Team"), activityLog: [{ action: "Tạo brief mới", by: "Product Team", at: "2025-12-01T08:00:00Z" }, { action: "Yêu cầu chỉnh sửa", by: "Nguyễn Văn An", at: "2025-12-10T16:00:00Z" }] },
  { id: "needfix-2", title: "Holiday Theme Icons", appCampaign: "Puzzle Master - Holiday 2026", kpiTargets: { ctr: 0, cvr: 2.5, cpi: 0, roas: 0 }, deadline: "2026-02-01", region: "GLOBAL", audience: "Casual gamers 25-55", platform: "Android", formats: ["app_icon"], requirements: "Holiday themed app icon variations", status: "need_revision", priority: "medium", assignedTo: ["5"], createdBy: "ASO Team", createdAt: "2025-12-05T09:00:00Z", leadObjective: "Valentine icon cần thêm hearts", attachments: createAttachments("needfix-2", "ASO Team"), activityLog: [{ action: "Tạo brief mới", by: "ASO Team", at: "2025-12-05T09:00:00Z" }, { action: "Yêu cầu chỉnh sửa", by: "Nguyễn Văn An", at: "2025-12-12T16:00:00Z" }] },
  { id: "needfix-3", title: "Garage Customization Feature", appCampaign: "Racing Game - Spring 2026", kpiTargets: { ctr: 2.8, cvr: 1.7, cpi: 0.45, roas: 2.4 }, deadline: "2026-02-03", region: "US, UK, JP", audience: "Car customization fans 18-40", platform: "Android", formats: ["video_30s", "static_16_9"], requirements: "Garage customization feature promotion", status: "need_revision", priority: "high", assignedTo: ["4"], createdBy: "Product Team", createdAt: "2025-12-08T10:00:00Z", leadObjective: "Thêm UI screens của garage menu", attachments: createAttachments("needfix-3", "Product Team"), activityLog: [{ action: "Tạo brief mới", by: "Product Team", at: "2025-12-08T10:00:00Z" }, { action: "Yêu cầu chỉnh sửa", by: "Nguyễn Văn An", at: "2025-12-14T15:00:00Z" }] },
  // 2 Overdue need_revision
  { id: "needfix-4", title: "Breathing Exercise Feature", appCampaign: "Meditation Pro - Spring 2025", kpiTargets: { ctr: 2.0, cvr: 1.4, cpi: 0.52, roas: 2.0 }, deadline: "2025-11-15", region: "US, UK, JP", audience: "Anxiety sufferers 20-50", platform: "iOS", formats: ["video_30s", "static_9_16"], requirements: "Guided breathing exercises feature", status: "need_revision", priority: "medium", assignedTo: ["3"], createdBy: "Product Team", createdAt: "2025-10-01T10:00:00Z", leadObjective: "Animation timing không khớp với breathing pattern", attachments: createAttachments("needfix-4", "Product Team"), activityLog: [{ action: "Tạo brief mới", by: "Product Team", at: "2025-10-01T10:00:00Z" }, { action: "Yêu cầu chỉnh sửa", by: "Nguyễn Văn An", at: "2025-10-20T14:00:00Z" }] },
  { id: "needfix-5", title: "Night Racing Mode", appCampaign: "Racing Game - Q4 2025", kpiTargets: { ctr: 3.2, cvr: 1.9, cpi: 0.38, roas: 2.7 }, deadline: "2025-12-01", region: "US, UK, KR", audience: "Racing fans 16-40", platform: "iOS", formats: ["video_30s", "static_16_9"], requirements: "Night racing mode promotion", status: "need_revision", priority: "high", assignedTo: ["4", "5"], createdBy: "UA Team", createdAt: "2025-10-17T10:00:00Z", leadObjective: "Neon colors cần vibrant hơn", attachments: createAttachments("needfix-5", "UA Team"), activityLog: [{ action: "Tạo brief mới", by: "UA Team", at: "2025-10-17T10:00:00Z" }, { action: "Yêu cầu chỉnh sửa", by: "Nguyễn Văn An", at: "2025-11-01T14:00:00Z" }] },

  // ========== COMPLETED (5 briefs, 2 overdue - completed after deadline) ==========
  { id: "completed-1", title: "Meditation Promo Video", appCampaign: "Meditation Pro - Wellness Month", kpiTargets: { ctr: 1.8, cvr: 1.2, cpi: 0.6, roas: 2.5 }, deadline: "2025-12-15", region: "US, UK, JP", audience: "Wellness-focused adults 25-55", platform: "iOS", formats: ["video_30s", "video_60s"], requirements: "Video giới thiệu tính năng Sleep Stories", status: "completed", priority: "low", assignedTo: ["3"], createdBy: "Marketing Team", createdAt: "2025-11-20T08:00:00Z", leadObjective: "Video với voice-over tiếng Anh", attachments: createAttachments("completed-1", "Marketing Team"), activityLog: [{ action: "Tạo brief mới", by: "Marketing Team", at: "2025-11-20T08:00:00Z" }, { action: "Hoàn thành brief", by: "Lê Văn Cường", at: "2025-12-14T17:00:00Z" }] },
  { id: "completed-2", title: "Puzzle Holiday Update", appCampaign: "Puzzle Master - Holiday 2025", kpiTargets: { ctr: 2.5, cvr: 1.8, cpi: 0.44, roas: 2.3 }, deadline: "2025-12-10", region: "GLOBAL", audience: "Casual gamers 25-50", platform: "Android", formats: ["static_1_1", "app_icon"], requirements: "Holiday themed banners and icons", status: "completed", priority: "medium", assignedTo: ["2", "5"], createdBy: "UA Team", createdAt: "2025-11-15T10:00:00Z", leadObjective: "Festive theme với snow effects", attachments: createAttachments("completed-2", "UA Team"), activityLog: [{ action: "Tạo brief mới", by: "UA Team", at: "2025-11-15T10:00:00Z" }, { action: "Hoàn thành brief", by: "Trần Thị Bình", at: "2025-12-09T16:00:00Z" }] },
  { id: "completed-3", title: "Racing Christmas Event", appCampaign: "Racing Game - Holiday 2025", kpiTargets: { ctr: 3.0, cvr: 1.9, cpi: 0.40, roas: 2.6 }, deadline: "2025-12-12", region: "US, UK, KR", audience: "Racing fans 16-40", platform: "iOS", formats: ["video_30s", "static_16_9"], requirements: "Christmas themed racing event", status: "completed", priority: "high", assignedTo: ["4"], createdBy: "UA Team", createdAt: "2025-11-18T10:00:00Z", leadObjective: "Snow tracks và holiday decorations", attachments: createAttachments("completed-3", "UA Team"), activityLog: [{ action: "Tạo brief mới", by: "UA Team", at: "2025-11-18T10:00:00Z" }, { action: "Hoàn thành brief", by: "Phạm Thị Dung", at: "2025-12-11T17:00:00Z" }] },
  // 2 Completed after deadline (was overdue)
  { id: "completed-4", title: "Fashion Black Friday", appCampaign: "Fashion Show - Holiday 2025", kpiTargets: { ctr: 3.5, cvr: 2.5, cpi: 0.35, roas: 3.0 }, deadline: "2025-11-25", region: "US, UK", audience: "Deal hunters 18-45", platform: "iOS", formats: ["static_9_16", "video_15s"], requirements: "Black Friday sale campaign", status: "completed", priority: "high", assignedTo: ["2", "3"], createdBy: "Marketing Team", createdAt: "2025-11-01T09:00:00Z", leadObjective: "Urgency messaging với countdown", attachments: createAttachments("completed-4", "Marketing Team"), activityLog: [{ action: "Tạo brief mới", by: "Marketing Team", at: "2025-11-01T09:00:00Z" }, { action: "Hoàn thành brief", by: "Trần Thị Bình", at: "2025-11-28T17:00:00Z" }] },
  { id: "completed-5", title: "Meditation Thanksgiving", appCampaign: "Meditation Pro - Holiday 2025", kpiTargets: { ctr: 1.9, cvr: 1.3, cpi: 0.55, roas: 2.1 }, deadline: "2025-11-20", region: "US", audience: "Families 25-55", platform: "iOS", formats: ["video_30s"], requirements: "Thanksgiving gratitude meditation", status: "completed", priority: "low", assignedTo: ["3"], createdBy: "Marketing Team", createdAt: "2025-10-25T08:00:00Z", leadObjective: "Gratitude và family bonding theme", attachments: createAttachments("completed-5", "Marketing Team"), activityLog: [{ action: "Tạo brief mới", by: "Marketing Team", at: "2025-10-25T08:00:00Z" }, { action: "Hoàn thành brief", by: "Lê Văn Cường", at: "2025-11-22T15:00:00Z" }] },

  // ========== RETURNED_TO_UA (5 briefs) ==========
  { id: "returned-1", title: "Fashion Screenshot Update", appCampaign: "Fashion Show - ASO Update", kpiTargets: { ctr: 0, cvr: 3.0, cpi: 0, roas: 0 }, deadline: "2026-01-20", region: "US", audience: "Fashion-forward millennials", platform: "iOS", formats: ["screenshot"], requirements: "Cập nhật 6 screenshots cho App Store", status: "returned_to_ua", priority: "medium", assignedTo: [], createdBy: "ASO Team", createdAt: "2025-12-05T08:00:00Z", returnReason: "Budget Q1 không đủ. Sẽ reschedule cho Q2.", attachments: createAttachments("returned-1", "ASO Team"), activityLog: [{ action: "Tạo brief mới", by: "ASO Team", at: "2025-12-05T08:00:00Z" }, { action: "Trả về UA", by: "Nguyễn Văn An", at: "2025-12-08T10:00:00Z" }] },
  { id: "returned-2", title: "Puzzle AR Feature", appCampaign: "Puzzle Master - Tech Update", kpiTargets: { ctr: 2.5, cvr: 1.5, cpi: 0.50, roas: 2.0 }, deadline: "2026-02-01", region: "US, UK", audience: "Tech-savvy gamers 20-40", platform: "iOS", formats: ["video_30s"], requirements: "AR puzzle feature promotion", status: "returned_to_ua", priority: "high", assignedTo: [], createdBy: "Product Team", createdAt: "2025-12-01T10:00:00Z", returnReason: "AR feature bị delay sang Q3. Sẽ tạo brief mới khi feature ready.", attachments: createAttachments("returned-2", "Product Team"), activityLog: [{ action: "Tạo brief mới", by: "Product Team", at: "2025-12-01T10:00:00Z" }, { action: "Trả về UA", by: "Nguyễn Văn An", at: "2025-12-10T09:00:00Z" }] },
  { id: "returned-3", title: "Racing VR Mode", appCampaign: "Racing Game - VR Launch", kpiTargets: { ctr: 3.0, cvr: 2.0, cpi: 0.40, roas: 2.5 }, deadline: "2026-01-15", region: "US, UK, JP", audience: "VR gamers 18-35", platform: "iOS", formats: ["video_60s"], requirements: "VR racing mode launch", status: "returned_to_ua", priority: "high", assignedTo: [], createdBy: "Product Team", createdAt: "2025-11-20T14:00:00Z", returnReason: "VR development chưa hoàn thành. Postpone vô thời hạn.", attachments: createAttachments("returned-3", "Product Team"), activityLog: [{ action: "Tạo brief mới", by: "Product Team", at: "2025-11-20T14:00:00Z" }, { action: "Trả về UA", by: "Nguyễn Văn An", at: "2025-12-01T11:00:00Z" }] },
  { id: "returned-4", title: "Meditation Kids Content", appCampaign: "Meditation Pro - Kids", kpiTargets: { ctr: 2.0, cvr: 1.4, cpi: 0.55, roas: 1.8 }, deadline: "2026-02-14", region: "US, UK", audience: "Parents 28-45", platform: "iOS", formats: ["video_30s", "static_9_16"], requirements: "Kids meditation content", status: "returned_to_ua", priority: "medium", assignedTo: [], createdBy: "Marketing Team", createdAt: "2025-12-02T09:00:00Z", returnReason: "Legal review của kids content chưa xong. Pending approval.", attachments: createAttachments("returned-4", "Marketing Team"), activityLog: [{ action: "Tạo brief mới", by: "Marketing Team", at: "2025-12-02T09:00:00Z" }, { action: "Trả về UA", by: "Nguyễn Văn An", at: "2025-12-12T14:00:00Z" }] },
  { id: "returned-5", title: "Fashion NFT Collection", appCampaign: "Fashion Show - NFT", kpiTargets: { ctr: 2.5, cvr: 1.0, cpi: 0.60, roas: 1.5 }, deadline: "2026-03-01", region: "GLOBAL", audience: "Crypto enthusiasts 20-40", platform: "iOS", formats: ["video_15s", "static_1_1"], requirements: "NFT fashion collection launch", status: "returned_to_ua", priority: "low", assignedTo: [], createdBy: "Marketing Team", createdAt: "2025-11-25T10:00:00Z", returnReason: "NFT market không còn phù hợp với brand strategy. Cancel project.", attachments: createAttachments("returned-5", "Marketing Team"), activityLog: [{ action: "Tạo brief mới", by: "Marketing Team", at: "2025-11-25T10:00:00Z" }, { action: "Trả về UA", by: "Nguyễn Văn An", at: "2025-12-05T16:00:00Z" }] },
]

// ============================================
// HELPER FUNCTIONS
// ============================================
export const getBriefsByStatus = (briefs: Brief[]) => ({
  draft: briefs.filter(b => b.status === "draft"),
  pending: briefs.filter(b => b.status === "pending"),
  confirmed: briefs.filter(b => b.status === "confirmed"),
  in_progress: briefs.filter(b => b.status === "in_progress"),
  waiting_design: briefs.filter(b => b.status === "waiting_design"),
  design_returned: briefs.filter(b => b.status === "design_returned"),
  design_done: briefs.filter(b => b.status === "design_done"),
  waiting_lead_review: briefs.filter(b => b.status === "waiting_lead_review"),
  waiting_ua_review: briefs.filter(b => b.status === "waiting_ua_review"),
  need_revision: briefs.filter(b => b.status === "need_revision"),
  completed: briefs.filter(b => b.status === "completed"),
  returned_to_ua: briefs.filter(b => b.status === "returned_to_ua"),
})

export const getBriefStats = (briefs: Brief[]) => ({
  total: briefs.length,
  draft: briefs.filter(b => b.status === "draft").length,
  pending: briefs.filter(b => b.status === "pending").length,
  confirmed: briefs.filter(b => b.status === "confirmed").length,
  inProgress: briefs.filter(b => b.status === "in_progress").length,
  waitingDesign: briefs.filter(b => b.status === "waiting_design").length,
  designReturned: briefs.filter(b => b.status === "design_returned").length,
  designDone: briefs.filter(b => b.status === "design_done").length,
  waitingLeadReview: briefs.filter(b => b.status === "waiting_lead_review").length,
  waitingUaReview: briefs.filter(b => b.status === "waiting_ua_review").length,
  needRevision: briefs.filter(b => b.status === "need_revision").length,
  completed: briefs.filter(b => b.status === "completed").length,
  returnedToUa: briefs.filter(b => b.status === "returned_to_ua").length,
  overdue: briefs.filter(b => {
    if (b.status === "completed" || b.status === "returned_to_ua") return false
    return new Date(b.deadline) < new Date()
  }).length,
})

export const getTeamMemberById = (id: string): TeamMember | undefined => {
  return teamMembers.find(m => m.id === id)
}

export const getTeamMembersByIds = (ids: string[]): TeamMember[] => {
  return ids.map(id => teamMembers.find(m => m.id === id)).filter((m): m is TeamMember => m !== undefined)
}

export const getCreatives = (): TeamMember[] => {
  return teamMembers.filter(m => m.role === "creative")
}

export const getLeadCreatives = (): TeamMember[] => {
  return teamMembers.filter(m => m.role === "lead_creative")
}
