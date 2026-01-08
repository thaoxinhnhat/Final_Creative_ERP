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
// GENERATED 100 TEST ASSETS WITH PROPER DISTRIBUTION
// - 20 assets per workflow stage (brief, review, final, test, stopped)
// - Logical deployment status per stage
// - New date tracking fields (finalizedAt, liveAt, uploadSource)
// - Only final stage assets can go live
// ============================================

export const mockAssets: Asset[] = generateMockAssets()

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

  // Generate 100 assets with equal distribution across workflow stages
  // Each stage gets 20 assets: brief(0-19), review(20-39), final(40-59), test(60-79), stopped(80-99)
  for (let i = 0; i < 100; i++) {
    const assetIndex = i + 1  // 1-based for asset naming
    let seed = assetIndex * 1000  // Base seed for this asset

    const projectCode = projectCodes[Math.floor(seededRandom(seed++) * projectCodes.length)]
    const teamInfo = teamCodes[Math.floor(seededRandom(seed++) * teamCodes.length)]
    const creatorCode = creatorCodes[Math.floor(seededRandom(seed++) * creatorCodes.length)]
    const sequenceNumber = String(Math.floor(seededRandom(seed++) * 999) + 1).padStart(4, '0')

    const assetType = assetTypes[Math.floor(seededRandom(seed++) * assetTypes.length)]
    const category = categories[Math.floor(seededRandom(seed++) * categories.length)]

    // Distribute workflow stages evenly: 20 each
    const stageIndex = Math.floor(i / 20)
    const workflowStage = workflowStages[stageIndex]

    // Deployment status based on workflow stage (logical consistency)
    let deploymentStatus: DeploymentStatus
    if (workflowStage === 'final') {
      // Only final assets can be live or testing
      const finalStatuses: DeploymentStatus[] = ['draft', 'testing', 'live', 'live', 'paused']
      deploymentStatus = finalStatuses[i % finalStatuses.length]
    } else if (workflowStage === 'stopped') {
      deploymentStatus = 'stopped'
    } else if (workflowStage === 'test') {
      deploymentStatus = 'testing'
    } else {
      deploymentStatus = 'draft'
    }

    const ext = extensions[assetType][Math.floor(seededRandom(seed++) * extensions[assetType].length)]
    const filename = `${projectCode}-${teamInfo.code}-${creatorCode}-${sequenceNumber}.${ext}`

    const isCreativeAI = teamInfo.code === 'GCVAI' || teamInfo.code === 'AIP'
    const hasDriveUrl = seededRandom(seed++) > 0.3
    const hasBrief = seededRandom(seed++) > 0.4

    // Generate dates
    const daysAgo = 100 - assetIndex
    const uploadMonth = 12 - Math.floor(daysAgo / 30)
    const uploadDay = Math.max(1, 28 - (daysAgo % 28))
    const uploadDate = `2024-${String(Math.max(1, uploadMonth)).padStart(2, '0')}-${String(uploadDay).padStart(2, '0')}T${String(10 + (i % 14)).padStart(2, '0')}:00:00Z`

    // Finalized date (only for final, test, stopped stages)
    const finalizedAt = ['final', 'test', 'stopped'].includes(workflowStage)
      ? `2024-${String(Math.max(1, uploadMonth)).padStart(2, '0')}-${String(Math.min(28, uploadDay + 3)).padStart(2, '0')}T14:00:00Z`
      : undefined

    // Live date (only for live status)
    const liveAt = deploymentStatus === 'live'
      ? `2024-${String(Math.max(1, uploadMonth)).padStart(2, '0')}-${String(Math.min(28, uploadDay + 5)).padStart(2, '0')}T10:00:00Z`
      : undefined

    // Generate UA test status deterministically
    const hasTestPlan = seededRandom(seed++) > 0.3
    const testedNetworks: AdNetwork[] = []
    const performanceRating: Partial<Record<AdNetwork, 'good' | 'bad' | 'testing'>> = {}

    // Only generate test data for final/test stages (logical consistency)
    if (hasTestPlan && ['final', 'test'].includes(workflowStage)) {
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

    // Generate live networks (only if final stage and live status)
    const liveNetworks: AdNetwork[] = []
    if (workflowStage === 'final' && deploymentStatus === 'live') {
      testedNetworks.filter(n => performanceRating[n] === 'good').forEach((n, idx) => {
        if (seededRandom(seed + idx) > 0.3) liveNetworks.push(n)
      })
      // Ensure at least 1 live network if status is live
      if (liveNetworks.length === 0 && testedNetworks.length > 0) {
        liveNetworks.push(testedNetworks[0])
      }
    }

    // Upload source
    const uploadSources: Array<'user_upload' | 'erp_report' | 'drive_import'> = ['user_upload', 'erp_report', 'drive_import']
    const uploadSource = hasDriveUrl ? 'drive_import' : uploadSources[i % 2] as 'user_upload' | 'erp_report'

    const asset: Asset = {
      id: `asset_${String(assetIndex).padStart(3, '0')}`,
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
      updatedAt: '2025-01-07T10:00:00Z',
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
      // NEW: Date tracking
      uploadSource: uploadSource,
      finalizedAt: finalizedAt,
      liveAt: liveAt,
    }

    // Add Drive URL for some assets
    if (hasDriveUrl) {
      const driveId = `drive_${assetIndex.toString(36)}_fixed`
      asset.driveUrl = `https://drive.google.com/file/d/${driveId}/view`
      asset.driveFileId = driveId
    }

    // Add stop reason for stopped assets
    if (workflowStage === 'stopped') {
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
      asset.youtubeUrl = `https://youtube.com/watch?v=vid_${assetIndex.toString(36)}`
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
