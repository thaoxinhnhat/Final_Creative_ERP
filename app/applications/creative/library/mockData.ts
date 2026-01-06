import type { Asset, AssetCategory, AssetType, WorkflowStage, AdNetwork, CreativeTeam, DeploymentStatus } from "./types"

// ============================================
// BRIEF MOCK DATA - For Brief grouping display
// ============================================
export const MOCK_BRIEFS: Record<string, { name: string; client: string; color: string }> = {
  brief_001: { name: "Fitness App - Summer Campaign", client: "FitMax", color: "bg-blue-500" },
  brief_002: { name: "Gaming App - Q4 UA", client: "SuperGame", color: "bg-purple-500" },
  brief_003: { name: "Shopping App - Holiday Sale", client: "ShopPlus", color: "bg-emerald-500" },
  brief_005: { name: "Travel App - Launch 2025", client: "TravelGo", color: "bg-amber-500" },
}

// Helper to get Brief name
export function getBriefName(briefId?: string): string | undefined {
  if (!briefId) return undefined
  return MOCK_BRIEFS[briefId]?.name
}

// ============================================
// ENHANCED MOCK ASSETS WITH NEW FIELDS
// ============================================

export const mockAssets: Asset[] = [
  {
    id: "asset_001",
    name: "SP01-GCVAI-ThuyBT-0001.mp4",
    type: "video",
    category: "final_creative",
    fileUrl: "/assets/summer-hero.mp4",
    thumbnailUrl: "https://picsum.photos/seed/orig1/400/400",
    fileSize: 45678900,
    fileExtension: "mp4",
    description: "Hero video for Summer 2025 campaign - 30s version for TikTok/Reels",
    tags: ["summer-2025", "hero-video", "ios", "30s", "vertical", "project:SP01", "team:GCVAI"],
    campaignName: "Summer Campaign 2025",
    appName: "Fashion App",
    uploadedBy: "ThuyBT",
    uploadedAt: "2024-12-01T10:00:00Z",
    updatedAt: "2024-12-20T10:00:00Z",
    status: "active",
    downloads: 12,
    views: 45,
    // NEW FIELDS
    driveUrl: "https://drive.google.com/file/d/1abc123xyz/view",
    driveFileId: "1abc123xyz",
    workflowStage: "test",
    currentOwner: "ThuyBT",
    parsedAssetId: "SP01-GCVAI-ThuyBT-0001",
    projectCode: "SP01",
    teamCode: "GCVAI",
    creatorCode: "ThuyBT",
    sequenceNumber: "0001",
    team: "creative",
    isCreativeAI: true,
    uaTestStatus: {
      isPlanned: true,
      testedNetworks: ["google", "meta", "tiktok"],
      performanceRating: {
        google: "good",
        meta: "good",
        tiktok: "testing",
      },
    },
    deploymentStatus: "live",
    liveNetworks: ["google", "meta"],
    briefId: "brief_001",
  },
  {
    id: "asset_002",
    name: "SP02-DSG-AnhNT-0023.png",
    type: "image",
    category: "final_creative",
    fileUrl: "/assets/brand-logo.png",
    thumbnailUrl: "https://picsum.photos/seed/orig2/400/400",
    fileSize: 234500,
    fileExtension: "png",
    description: "Gaming app banner - High performance design",
    tags: ["logo", "brand", "primary", "transparent", "project:SP02", "team:DSG"],
    uploadedBy: "AnhNT",
    uploadedAt: "2024-11-15T09:00:00Z",
    updatedAt: "2024-12-15T09:00:00Z",
    status: "active",
    downloads: 89,
    views: 234,
    // NEW FIELDS
    workflowStage: "test",
    currentOwner: "AnhNT",
    parsedAssetId: "SP02-DSG-AnhNT-0023",
    projectCode: "SP02",
    teamCode: "DSG",
    creatorCode: "AnhNT",
    sequenceNumber: "0023",
    team: "design",
    isCreativeAI: false,
    uaTestStatus: {
      isPlanned: true,
      testedNetworks: ["meta", "axon", "unity"],
      performanceRating: {
        meta: "good",
        axon: "testing",
        unity: "bad",
      },
    },
    deploymentStatus: "testing",
    briefId: "brief_002",
  },
  {
    id: "asset_003",
    name: "SP01-VID-MinhPT-0015.mov",
    type: "video",
    category: "final_creative",
    fileUrl: "/assets/product-template.mov",
    thumbnailUrl: "https://picsum.photos/seed/orig3/400/400",
    fileSize: 12890000,
    fileExtension: "mov",
    description: "Product showcase video - vertical format",
    tags: ["template", "product", "creative", "vertical", "project:SP01", "team:VID"],
    campaignName: "Product Launch",
    uploadedBy: "MinhPT",
    uploadedAt: "2024-11-20T14:30:00Z",
    updatedAt: "2024-12-10T14:30:00Z",
    status: "active",
    downloads: 34,
    views: 78,
    // NEW FIELDS
    workflowStage: "review",
    currentOwner: "MinhPT",
    parsedAssetId: "SP01-VID-MinhPT-0015",
    projectCode: "SP01",
    teamCode: "VID",
    creatorCode: "MinhPT",
    sequenceNumber: "0015",
    team: "creative",
    isCreativeAI: false,
    uaTestStatus: {
      isPlanned: true,
      testedNetworks: [],
      performanceRating: {},
    },
    deploymentStatus: "draft",
    briefId: "brief_001",
  },
  {
    id: "asset_004",
    name: "competitor-analysis-q4.pdf",
    type: "document",
    category: "reference",
    fileUrl: "/assets/competitor-analysis.pdf",
    fileSize: 5670000,
    fileExtension: "pdf",
    thumbnailUrl: "https://picsum.photos/seed/orig4/400/400",
    description: "Q4 2024 competitor creative analysis - 50+ examples analyzed",
    tags: ["reference", "competitor", "q4-2024", "analysis"],
    campaignName: "Market Research",
    uploadedBy: "UA Team",
    uploadedAt: "2024-10-25T11:00:00Z",
    updatedAt: "2024-10-25T11:00:00Z",
    status: "active",
    downloads: 23,
    views: 56,
    // NEW FIELDS
    workflowStage: "final",
    team: "creative",
  },
  {
    id: "asset_005",
    name: "SP03-GCVAI-LoanNT-0042.jpg",
    type: "image",
    category: "final_creative",
    fileUrl: "/assets/winter-banner.jpg",
    thumbnailUrl: "https://picsum.photos/seed/orig5/400/400",
    fileSize: 890000,
    fileExtension: "jpg",
    description: "Winter sale vertical banner for Instagram/Facebook Stories",
    tags: ["winter-sale", "banner", "stories", "9:16", "vertical", "project:SP03", "ai-generated"],
    campaignName: "Winter Sale 2024",
    appName: "Shopping App",
    uploadedBy: "LoanNT",
    uploadedAt: "2024-12-10T08:00:00Z",
    updatedAt: "2024-12-18T08:00:00Z",
    status: "active",
    downloads: 8,
    views: 23,
    // NEW FIELDS
    driveUrl: "https://drive.google.com/file/d/2def456abc/view",
    driveFileId: "2def456abc",
    workflowStage: "test",
    currentOwner: "LoanNT",
    parsedAssetId: "SP03-GCVAI-LoanNT-0042",
    projectCode: "SP03",
    teamCode: "GCVAI",
    creatorCode: "LoanNT",
    sequenceNumber: "0042",
    team: "creative",
    isCreativeAI: true,
    uaTestStatus: {
      isPlanned: true,
      testedNetworks: ["google", "meta", "mintegral", "axon"],
      performanceRating: {
        google: "good",
        meta: "good",
        mintegral: "good",
        axon: "bad",
      },
    },
    deploymentStatus: "live",
    liveNetworks: ["google", "meta", "mintegral"],
    briefId: "brief_003",
  },
  {
    id: "asset_006",
    name: "app-promo-15s.mp4",
    type: "video",
    category: "final_creative",
    fileUrl: "/assets/app-promo-15s.mp4",
    thumbnailUrl: "https://picsum.photos/seed/orig6/400/400",
    fileSize: 15890000,
    fileExtension: "mp4",
    description: "15-second app promo optimized for TikTok and Reels",
    tags: ["promo", "15s", "tiktok", "reels", "vertical", "app-launch"],
    campaignName: "App Launch 2025",
    appName: "Fitness App",
    briefId: "brief_001",
    uploadedBy: "Creative Team",
    uploadedAt: "2024-12-15T16:00:00Z",
    updatedAt: "2024-12-15T16:00:00Z",
    status: "active",
    downloads: 15,
    views: 67,
    // NEW FIELDS
    workflowStage: "brief",
    team: "creative",
  },
  {
    id: "asset_007",
    name: "brand-guidelines-2025.pdf",
    type: "document",
    category: "brand_asset",
    fileUrl: "/assets/brand-guidelines.pdf",
    fileSize: 8900000,
    fileExtension: "pdf",
    thumbnailUrl: "https://picsum.photos/seed/orig7/400/400",
    description: "Official brand guidelines for 2025 - colors, fonts, usage rules",
    tags: ["brand", "guidelines", "2025", "official"],
    uploadedBy: "Brand Team",
    uploadedAt: "2024-12-01T09:00:00Z",
    updatedAt: "2024-12-01T09:00:00Z",
    status: "active",
    downloads: 156,
    views: 423,
    // NEW FIELDS
    workflowStage: "final",
    team: "design",
  },
  {
    id: "asset_008",
    name: "SP02-VID-HoangPT-0008.mov",
    type: "video",
    category: "raw_footage",
    fileUrl: "/assets/raw-beach.mov",
    thumbnailUrl: "https://picsum.photos/seed/orig8/400/400",
    fileSize: 234567000,
    fileExtension: "mov",
    description: "Raw footage from summer beach photoshoot - 4K quality",
    tags: ["raw", "beach", "summer-2025", "footage", "4k", "project:SP02", "team:VID"],
    campaignName: "Summer Campaign 2025",
    uploadedBy: "HoangPT",
    uploadedAt: "2024-11-28T13:00:00Z",
    updatedAt: "2024-11-28T13:00:00Z",
    status: "active",
    downloads: 3,
    views: 12,
    // NEW FIELDS
    workflowStage: "stopped",
    currentOwner: "HoangPT",
    parsedAssetId: "SP02-VID-HoangPT-0008",
    projectCode: "SP02",
    teamCode: "VID",
    creatorCode: "HoangPT",
    sequenceNumber: "0008",
    team: "creative",
    isCreativeAI: false,
    deploymentStatus: "stopped",
    stopReason: "Campaign ended - Budget exhausted",
    stoppedAt: "2024-12-20T10:00:00Z",
  },
  {
    id: "asset_009",
    name: "social-post-template.figma",
    type: "template",
    category: "template",
    fileUrl: "/assets/social-template.figma",
    fileSize: 2340000,
    fileExtension: "figma",
    thumbnailUrl: "https://picsum.photos/seed/orig9/400/400",
    description: "Social media post template - includes 1:1, 9:16, 16:9 sizes",
    tags: ["template", "social", "figma", "multi-size", "reusable"],
    uploadedBy: "Design Team",
    uploadedAt: "2024-12-05T10:00:00Z",
    updatedAt: "2024-12-05T10:00:00Z",
    status: "active",
    downloads: 67,
    views: 189,
    // NEW FIELDS
    workflowStage: "final",
    team: "design",
  },
  {
    id: "asset_010",
    name: "SP04-DSG-TrangNT-0012.png",
    type: "endcard",
    category: "final_creative",
    fileUrl: "/assets/endcard-gaming.png",
    thumbnailUrl: "https://picsum.photos/seed/orig10/400/400",
    fileSize: 456000,
    fileExtension: "png",
    description: "Gaming app endcard - version 2 with improved CTA",
    tags: ["endcard", "gaming", "v2", "cta", "project:SP04", "team:DSG"],
    campaignName: "Gaming App UA",
    appName: "Super Game",
    briefId: "brief_003",
    uploadedBy: "TrangNT",
    uploadedAt: "2024-12-18T14:00:00Z",
    updatedAt: "2024-12-22T14:00:00Z",
    status: "active",
    downloads: 5,
    views: 18,
    // NEW FIELDS
    workflowStage: "test",
    currentOwner: "TrangNT",
    parsedAssetId: "SP04-DSG-TrangNT-0012",
    projectCode: "SP04",
    teamCode: "DSG",
    creatorCode: "TrangNT",
    sequenceNumber: "0012",
    team: "design",
    isCreativeAI: false,
    uaTestStatus: {
      isPlanned: true,
      testedNetworks: ["unity", "axon"],
      performanceRating: {
        unity: "testing",
        axon: "testing",
      },
    },
    deploymentStatus: "testing",
    endcardUrl: "/assets/endcard-gaming.png",
  },
  {
    id: "asset_011",
    name: "influencer-kit-materials.zip",
    type: "other",
    category: "campaign_material",
    fileUrl: "/assets/influencer-kit.zip",
    fileSize: 78900000,
    fileExtension: "zip",
    thumbnailUrl: "https://picsum.photos/seed/orig11/400/400",
    description: "Complete influencer kit with logos, banners, and guidelines",
    tags: ["influencer", "kit", "campaign", "bundle"],
    campaignName: "Influencer Campaign Q1",
    uploadedBy: "Marketing Team",
    uploadedAt: "2024-12-12T11:00:00Z",
    updatedAt: "2024-12-12T11:00:00Z",
    status: "active",
    downloads: 28,
    views: 95,
    // NEW FIELDS
    workflowStage: "final",
    team: "creative",
  },
  {
    id: "asset_012",
    name: "SP05-GCVAI-ThaoNT-0001.png",
    type: "image",
    category: "final_creative",
    fileUrl: "/assets/color-palette.png",
    thumbnailUrl: "https://picsum.photos/seed/orig12/400/400",
    fileSize: 123000,
    fileExtension: "png",
    description: "AI-generated creative for Q1 campaign",
    tags: ["ai-generated", "q1-2025", "creative", "project:SP05", "team:GCVAI"],
    campaignName: "Q1 Campaign 2025",
    uploadedBy: "ThaoNT",
    uploadedAt: "2024-12-20T10:00:00Z",
    updatedAt: "2024-12-28T10:00:00Z",
    status: "active",
    downloads: 45,
    views: 167,
    // NEW FIELDS
    driveUrl: "https://drive.google.com/file/d/3ghi789xyz/view",
    driveFileId: "3ghi789xyz",
    workflowStage: "test",
    currentOwner: "ThaoNT",
    parsedAssetId: "SP05-GCVAI-ThaoNT-0001",
    projectCode: "SP05",
    teamCode: "GCVAI",
    creatorCode: "ThaoNT",
    sequenceNumber: "0001",
    team: "creative",
    isCreativeAI: true,
    uaTestStatus: {
      isPlanned: true,
      testedNetworks: ["google", "meta", "tiktok", "apple_search_ads"],
      performanceRating: {
        google: "good",
        meta: "good",
        tiktok: "good",
        apple_search_ads: "testing",
      },
    },
    deploymentStatus: "live",
    liveNetworks: ["google", "meta", "tiktok"],
    briefId: "brief_005",
  },
  {
    id: "asset_013",
    name: "playable-puzzle-demo.html",
    type: "playable",
    category: "final_creative",
    fileUrl: "/assets/playable-puzzle.html",
    thumbnailUrl: "https://picsum.photos/seed/orig13/400/400",
    fileSize: 567000,
    fileExtension: "html",
    description: "Interactive playable ad for puzzle game",
    tags: ["playable", "puzzle", "interactive", "html5"],
    campaignName: "Puzzle Game Launch",
    appName: "Puzzle Master",
    uploadedBy: "Creative Team",
    uploadedAt: "2024-12-22T09:00:00Z",
    updatedAt: "2024-12-22T09:00:00Z",
    status: "active",
    downloads: 12,
    views: 34,
    // NEW FIELDS
    workflowStage: "review",
    team: "creative",
    uaTestStatus: {
      isPlanned: true,
      testedNetworks: [],
      performanceRating: {},
    },
    deploymentStatus: "draft",
    playableUrl: "/assets/playable-puzzle.html",
  },
  {
    id: "asset_014",
    name: "SP06-VID-AnhPT-0003.mp4",
    type: "video",
    category: "final_creative",
    fileUrl: "/assets/vertical-ad.mp4",
    thumbnailUrl: "https://picsum.photos/seed/orig14/400/400",
    fileSize: 28900000,
    fileExtension: "mp4",
    description: "Vertical video ad for Instagram Reels",
    tags: ["vertical", "reels", "instagram", "9:16", "project:SP06", "team:VID"],
    campaignName: "Social Media Campaign",
    appName: "Lifestyle App",
    uploadedBy: "AnhPT",
    uploadedAt: "2024-12-25T14:00:00Z",
    updatedAt: "2024-12-28T14:00:00Z",
    status: "active",
    downloads: 3,
    views: 15,
    // NEW FIELDS
    driveUrl: "https://drive.google.com/file/d/4jkl012mno/view",
    driveFileId: "4jkl012mno",
    workflowStage: "final",
    currentOwner: "AnhPT",
    parsedAssetId: "SP06-VID-AnhPT-0003",
    projectCode: "SP06",
    teamCode: "VID",
    creatorCode: "AnhPT",
    sequenceNumber: "0003",
    team: "creative",
    isCreativeAI: false,
    deploymentStatus: "draft",
    youtubeUrl: "https://youtube.com/watch?v=example",
  },
  // ============================================
  // 100 ADDITIONAL ASSETS FOR COMPREHENSIVE TESTING
  // ============================================
  ...generateMockAssets(),
]

// ============================================
// ASSET GENERATOR FUNCTION - Deterministic (no hydration errors)
// ============================================
function generateMockAssets(): Asset[] {
  const assets: Asset[] = []

  // Simple seeded pseudo-random number generator for deterministic results
  function seededRandom(seed: number): number {
    const x = Math.sin(seed * 9999) * 10000
    return x - Math.floor(x)
  }

  // Configuration arrays
  const projectCodes = ['SP01', 'SP02', 'SP03', 'SP04', 'SP05', 'SP06', 'SP07', 'SP08', 'SP09', 'SP10']
  const teamCodes: Array<{ code: string; team: CreativeTeam }> = [
    { code: 'GCVAI', team: 'creative' },
    { code: 'DSG', team: 'design' },
    { code: 'VID', team: 'creative' },
    { code: 'AIP', team: 'ai_producer' },
    { code: 'PION', team: 'pion' },
  ]
  const creatorCodes = [
    'ThuyBT', 'AnhNT', 'MinhPT', 'LoanNT', 'TrangNT', 'ThaoNT', 'HoangPT', 'AnhPT',
    'NgocDT', 'HaiNV', 'KhanhLM', 'AnhVT', 'DucNM', 'HuongTT', 'TuanNQ', 'LinhHT',
    'SonPH', 'MaiNTT', 'DungHV', 'VanTK'
  ]
  const assetTypes: AssetType[] = ['image', 'video', 'document', 'template', 'playable', 'endcard', 'other']
  const categories: AssetCategory[] = ['final_creative', 'reference', 'brand_asset', 'template', 'campaign_material', 'raw_footage']
  const workflowStages: WorkflowStage[] = ['brief', 'review', 'final', 'test', 'stopped']
  const deploymentStatuses: DeploymentStatus[] = ['draft', 'testing', 'live', 'paused', 'stopped']
  const adNetworks: AdNetwork[] = ['google', 'meta', 'mintegral', 'axon', 'unity', 'tiktok', 'apple_search_ads']
  const briefIds = ['brief_001', 'brief_002', 'brief_003', 'brief_005']

  const campaignNames = [
    'Summer Campaign 2025', 'Winter Sale 2024', 'Product Launch', 'App Launch 2025',
    'Gaming App UA', 'Social Media Campaign', 'Influencer Campaign Q1', 'Q1 Campaign 2025',
    'Holiday Special', 'Back to School', 'Black Friday', 'New Year Promo',
    'Valentine Collection', 'Spring Fashion', 'Easter Campaign', 'Mother Day Special'
  ]

  const appNames = [
    'Fashion App', 'Gaming App', 'Shopping App', 'Fitness App', 'Travel App',
    'Finance App', 'Music App', 'Food Delivery', 'Dating App', 'Education App',
    'Puzzle Master', 'Super Game', 'Lifestyle App', 'Health Tracker', 'Photo Editor'
  ]

  const descriptions = [
    'High performance creative for UA campaigns',
    'Optimized for social media platforms',
    'AI-generated with excellent conversion rate',
    'Designed for maximum engagement',
    'Interactive element for better retention',
    'Premium quality asset for brand awareness',
    'Seasonal promotional material',
    'Targeted for specific demographics',
    'A/B testing variant',
    'Localized version for Asian markets',
    'Retargeting creative',
    'Top performing asset from previous campaign',
    'New concept design for testing',
    'Collaboration with influencer team',
    'UGC-style creative for authenticity'
  ]

  const thumbnails = [
    'https://picsum.photos/seed/asset1/400/400',
    'https://picsum.photos/seed/asset2/400/400',
    'https://picsum.photos/seed/asset3/400/400',
    'https://picsum.photos/seed/asset4/400/400',
    'https://picsum.photos/seed/asset5/400/400',
    'https://picsum.photos/seed/asset6/400/400',
    'https://picsum.photos/seed/asset7/400/400',
    'https://picsum.photos/seed/asset8/400/400',
    'https://picsum.photos/seed/asset9/400/400',
    'https://picsum.photos/seed/asset10/400/400',
    'https://picsum.photos/seed/asset11/400/400',
    'https://picsum.photos/seed/asset12/400/400',
    'https://picsum.photos/seed/asset13/400/400',
    'https://picsum.photos/seed/asset14/400/400',
    'https://picsum.photos/seed/asset15/400/400',
    'https://picsum.photos/seed/asset16/400/400',
    'https://picsum.photos/seed/asset17/400/400',
    'https://picsum.photos/seed/asset18/400/400',
    'https://picsum.photos/seed/asset19/400/400',
    'https://picsum.photos/seed/asset20/400/400',
  ]

  const extensions: Record<string, string[]> = {
    image: ['png', 'jpg', 'jpeg', 'webp'],
    video: ['mp4', 'mov', 'webm'],
    document: ['pdf', 'docx', 'pptx'],
    template: ['figma', 'psd', 'ai', 'xd'],
    playable: ['html', 'zip'],
    endcard: ['png', 'jpg'],
    other: ['zip', 'rar'],
  }

  const stopReasons = [
    'Budget exhausted',
    'Campaign ended',
    'Low performance',
    'Creative fatigue',
    'Client request',
    'Replaced by new version',
  ]

  // Generate 100 assets deterministically
  for (let i = 15; i <= 114; i++) {
    let seed = i * 1000  // Base seed for this asset

    const projectCode = projectCodes[Math.floor(seededRandom(seed++) * projectCodes.length)]
    const teamInfo = teamCodes[Math.floor(seededRandom(seed++) * teamCodes.length)]
    const creatorCode = creatorCodes[Math.floor(seededRandom(seed++) * creatorCodes.length)]
    const sequenceNumber = String(Math.floor(seededRandom(seed++) * 999) + 1).padStart(4, '0')

    const assetType = assetTypes[Math.floor(seededRandom(seed++) * assetTypes.length)]
    const category = categories[Math.floor(seededRandom(seed++) * categories.length)]
    const workflowStage = workflowStages[Math.floor(seededRandom(seed++) * workflowStages.length)]
    const deploymentStatus = deploymentStatuses[Math.floor(seededRandom(seed++) * deploymentStatuses.length)]

    const ext = extensions[assetType][Math.floor(seededRandom(seed++) * extensions[assetType].length)]
    const filename = `${projectCode}-${teamInfo.code}-${creatorCode}-${sequenceNumber}.${ext}`

    const isCreativeAI = teamInfo.code === 'GCVAI' || teamInfo.code === 'AIP'
    const hasDriveUrl = seededRandom(seed++) > 0.3
    const hasBrief = seededRandom(seed++) > 0.4

    // Higher ID = more recent date (so sorting by newest works correctly)
    // ID 114 = most recent, ID 15 = oldest
    const daysAgo = 114 - i  // ID 114 = 0 days ago, ID 15 = 99 days ago
    const uploadMonth = 12 - Math.floor(daysAgo / 30)
    const uploadDay = 28 - (daysAgo % 28)
    const uploadDate = `2024-${String(uploadMonth).padStart(2, '0')}-${String(uploadDay).padStart(2, '0')}T${String(10 + (i % 14)).padStart(2, '0')}:00:00Z`

    // Generate UA test status deterministically
    const hasTestPlan = seededRandom(seed++) > 0.3
    const testedNetworks: AdNetwork[] = []
    const performanceRating: Partial<Record<AdNetwork, 'good' | 'bad' | 'testing'>> = {}

    if (hasTestPlan) {
      const numNetworks = Math.floor(seededRandom(seed++) * 5) + 1
      for (let j = 0; j < numNetworks && j < adNetworks.length; j++) {
        const networkIndex = Math.floor(seededRandom(seed++) * adNetworks.length)
        const network = adNetworks[networkIndex]
        if (!testedNetworks.includes(network)) {
          testedNetworks.push(network)
          const ratings: Array<'good' | 'bad' | 'testing'> = ['good', 'bad', 'testing']
          performanceRating[network] = ratings[Math.floor(seededRandom(seed++) * ratings.length)]
        }
      }
    }

    // Generate live networks (only if live status)
    const liveNetworks: AdNetwork[] = []
    if (deploymentStatus === 'live') {
      testedNetworks.filter(n => performanceRating[n] === 'good').forEach((n, idx) => {
        if (seededRandom(seed + idx) > 0.3) liveNetworks.push(n)
      })
    }

    const asset: Asset = {
      id: `asset_${String(i).padStart(3, '0')}`,
      name: filename,
      type: assetType,
      category: category,
      fileUrl: `/assets/${filename}`,
      thumbnailUrl: thumbnails[i % thumbnails.length],
      fileSize: Math.floor(seededRandom(seed++) * 100000000) + 100000,
      fileExtension: ext,
      description: descriptions[i % descriptions.length],
      tags: [
        `project:${projectCode}`,
        `team:${teamInfo.code}`,
        isCreativeAI ? 'ai-generated' : 'manual',
        category.replace('_', '-'),
        assetType,
      ],
      campaignName: campaignNames[i % campaignNames.length],
      appName: appNames[i % appNames.length],
      uploadedBy: creatorCode,
      uploadedAt: uploadDate,
      updatedAt: '2024-12-28T10:00:00Z',
      status: 'active',
      downloads: Math.floor(seededRandom(seed++) * 200),
      views: Math.floor(seededRandom(seed++) * 500),
      // Workflow
      workflowStage: workflowStage,
      currentOwner: creatorCode,
      // Parsed info
      parsedAssetId: `${projectCode}-${teamInfo.code}-${creatorCode}-${sequenceNumber}`,
      projectCode: projectCode,
      teamCode: teamInfo.code,
      creatorCode: creatorCode,
      sequenceNumber: sequenceNumber,
      team: teamInfo.team,
      isCreativeAI: isCreativeAI,
      // UA Testing
      uaTestStatus: {
        isPlanned: hasTestPlan,
        testedNetworks: testedNetworks,
        performanceRating: performanceRating,
      },
      // Deployment
      deploymentStatus: deploymentStatus,
      liveNetworks: liveNetworks.length > 0 ? liveNetworks : undefined,
      // Brief
      briefId: hasBrief ? briefIds[i % briefIds.length] : undefined,
    }

    // Add Drive URL for some assets
    if (hasDriveUrl) {
      const driveId = `drive_${i.toString(36)}_fixed`
      asset.driveUrl = `https://drive.google.com/file/d/${driveId}/view`
      asset.driveFileId = driveId
    }

    // Add stop reason for stopped assets
    if (deploymentStatus === 'stopped') {
      asset.stopReason = stopReasons[i % stopReasons.length]
      asset.stoppedAt = '2024-12-20T10:00:00Z'
    }

    // Add playable URL for playable assets
    if (assetType === 'playable') {
      asset.playableUrl = `/assets/playable/${filename}`
    }

    // Add endcard URL for endcard assets
    if (assetType === 'endcard') {
      asset.endcardUrl = `/assets/endcard/${filename}`
    }

    // Add YouTube URL for some video assets (deterministic)
    if (assetType === 'video' && i % 3 === 0) {
      asset.youtubeUrl = `https://youtube.com/watch?v=vid_${i.toString(36)}`
    }

    assets.push(asset)
  }

  return assets
}

// ============================================
// DERIVED DATA
// ============================================
export const uniqueCampaigns = [...new Set(mockAssets.filter(a => a.campaignName).map(a => a.campaignName!))]
export const uniqueTags = [...new Set(mockAssets.flatMap(a => a.tags))]
export const uniqueProjects = [...new Set(mockAssets.filter(a => a.projectCode).map(a => a.projectCode!))]
export const uniqueCreators = [...new Set(mockAssets.filter(a => a.creatorCode).map(a => a.creatorCode!))]

// ============================================
// ASSET STATS
// ============================================
export const assetStats = {
  total: mockAssets.length,
  byType: {
    image: mockAssets.filter(a => a.type === 'image').length,
    video: mockAssets.filter(a => a.type === 'video').length,
    document: mockAssets.filter(a => a.type === 'document').length,
    template: mockAssets.filter(a => a.type === 'template').length,
    playable: mockAssets.filter(a => a.type === 'playable').length,
    endcard: mockAssets.filter(a => a.type === 'endcard').length,
    other: mockAssets.filter(a => a.type === 'other').length,
  } as Record<AssetType, number>,
  byCategory: {
    final_creative: mockAssets.filter(a => a.category === 'final_creative').length,
    reference: mockAssets.filter(a => a.category === 'reference').length,
    brand_asset: mockAssets.filter(a => a.category === 'brand_asset').length,
    template: mockAssets.filter(a => a.category === 'template').length,
    campaign_material: mockAssets.filter(a => a.category === 'campaign_material').length,
    raw_footage: mockAssets.filter(a => a.category === 'raw_footage').length,
  } as Record<AssetCategory, number>,
  byWorkflowStage: {
    brief: mockAssets.filter(a => a.workflowStage === 'brief').length,
    review: mockAssets.filter(a => a.workflowStage === 'review').length,
    final: mockAssets.filter(a => a.workflowStage === 'final').length,
    test: mockAssets.filter(a => a.workflowStage === 'test').length,
    stopped: mockAssets.filter(a => a.workflowStage === 'stopped').length,
  } as Record<WorkflowStage, number>,
  byTeam: {
    design: mockAssets.filter(a => a.team === 'design').length,
    ai_producer: mockAssets.filter(a => a.team === 'ai_producer').length,
    creative: mockAssets.filter(a => a.team === 'creative').length,
    pion: mockAssets.filter(a => a.team === 'pion').length,
  } as Record<CreativeTeam, number>,
  byDeploymentStatus: {
    draft: mockAssets.filter(a => a.deploymentStatus === 'draft').length,
    testing: mockAssets.filter(a => a.deploymentStatus === 'testing').length,
    live: mockAssets.filter(a => a.deploymentStatus === 'live').length,
    paused: mockAssets.filter(a => a.deploymentStatus === 'paused').length,
    stopped: mockAssets.filter(a => a.deploymentStatus === 'stopped').length,
  } as Record<DeploymentStatus, number>,
}

// ============================================
// NETWORK PERFORMANCE STATS
// ============================================
export function getNetworkPerformanceStats() {
  const networks: AdNetwork[] = ['google', 'meta', 'mintegral', 'axon', 'unity', 'tiktok', 'apple_search_ads']

  return networks.reduce((acc, network) => {
    const assetsWithNetwork = mockAssets.filter(
      a => a.uaTestStatus?.testedNetworks?.includes(network)
    )

    acc[network] = {
      total: assetsWithNetwork.length,
      good: assetsWithNetwork.filter(a => a.uaTestStatus?.performanceRating?.[network] === 'good').length,
      bad: assetsWithNetwork.filter(a => a.uaTestStatus?.performanceRating?.[network] === 'bad').length,
      testing: assetsWithNetwork.filter(a => a.uaTestStatus?.performanceRating?.[network] === 'testing').length,
    }

    return acc
  }, {} as Record<AdNetwork, { total: number; good: number; bad: number; testing: number }>)
}
