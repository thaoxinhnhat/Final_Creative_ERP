// ============================================
// GOOGLE DRIVE PARSER UTILITIES
// ============================================

import type { Asset, DriveFileInfo, WorkflowStage, CreativeTeam, AssetType } from '../types'

// ============================================
// GOOGLE DRIVE URL PARSING
// ============================================

/**
 * Parse Google Drive URL to extract file ID and share type
 * Supports formats:
 * - https://drive.google.com/file/d/FILE_ID/view
 * - https://drive.google.com/open?id=FILE_ID
 * - https://docs.google.com/document/d/FILE_ID/edit
 * - https://drive.google.com/drive/folders/FOLDER_ID
 */
export function parseGoogleDriveUrl(url: string): { fileId: string; shareType: 'file' | 'folder' } | null {
    if (!url) return null

    try {
        const urlObj = new URL(url)

        // Check if it's a Google Drive URL
        if (!urlObj.hostname.includes('google.com')) {
            return null
        }

        // Format: /file/d/FILE_ID/view or /file/d/FILE_ID/edit
        const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
        if (fileMatch) {
            return { fileId: fileMatch[1], shareType: 'file' }
        }

        // Format: /document/d/FILE_ID/edit or /spreadsheets/d/FILE_ID/edit
        const docMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/)
        if (docMatch) {
            return { fileId: docMatch[1], shareType: 'file' }
        }

        // Format: ?id=FILE_ID
        const idParam = urlObj.searchParams.get('id')
        if (idParam) {
            return { fileId: idParam, shareType: 'file' }
        }

        // Format: /folders/FOLDER_ID
        const folderMatch = url.match(/\/folders\/([a-zA-Z0-9_-]+)/)
        if (folderMatch) {
            return { fileId: folderMatch[1], shareType: 'folder' }
        }

        return null
    } catch {
        return null
    }
}

// ============================================
// ASSET ID PARSING FROM FILENAME
// ============================================

export interface ParsedAssetId {
    fullId: string
    projectCode: string    // SP01
    teamCode: string       // GCVAI
    creatorCode: string    // ThuyBT
    sequenceNumber: string // 0006
    team?: CreativeTeam
    isCreativeAI: boolean
}

/**
 * Parse asset ID from filename
 * Format: SP01-GCVAI-ThuyBT-0006.mp4 or similar
 * Also supports: PROJ-TEAM-NAME-001
 */
export function parseAssetIdFromFilename(filename: string): ParsedAssetId | null {
    if (!filename) return null

    // Remove extension
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '')

    // Pattern: CODE-TEAM-CREATOR-NUMBER
    // Example: SP01-GCVAI-ThuyBT-0006
    const pattern = /^([A-Z0-9]+)-([A-Z0-9]+)-([A-Za-z]+)-(\d+)$/
    const match = nameWithoutExt.match(pattern)

    if (!match) {
        // Try alternative pattern: just extract if has 4 parts separated by dash
        const parts = nameWithoutExt.split('-')
        if (parts.length >= 4) {
            return {
                fullId: parts.slice(0, 4).join('-'),
                projectCode: parts[0],
                teamCode: parts[1],
                creatorCode: parts[2],
                sequenceNumber: parts[3],
                team: detectTeamFromCode(parts[1]),
                isCreativeAI: parts[1].includes('AI') || parts[1].includes('GPT'),
            }
        }
        return null
    }

    const [, projectCode, teamCode, creatorCode, sequenceNumber] = match

    return {
        fullId: `${projectCode}-${teamCode}-${creatorCode}-${sequenceNumber}`,
        projectCode,
        teamCode,
        creatorCode,
        sequenceNumber,
        team: detectTeamFromCode(teamCode),
        isCreativeAI: teamCode.includes('AI') || teamCode.includes('GPT'),
    }
}

/**
 * Detect team from team code
 */
function detectTeamFromCode(code: string): CreativeTeam | undefined {
    const upperCode = code.toUpperCase()
    if (upperCode.includes('DSG') || upperCode.includes('DES')) return 'design'
    if (upperCode.includes('AI') || upperCode.includes('GPT') || upperCode.includes('GCVAI')) return 'ai_producer'
    if (upperCode.includes('CRE') || upperCode.includes('GC') || upperCode.includes('VID') || upperCode.includes('MOV')) return 'creative'
    if (upperCode.includes('PION') || upperCode.includes('PN')) return 'pion'
    return undefined
}

// ============================================
// MIME TYPE DETECTION
// ============================================

export function detectAssetTypeFromMime(mimeType: string): AssetType {
    if (mimeType.startsWith('image/')) return 'image'
    if (mimeType.startsWith('video/')) return 'video'
    if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text')) return 'document'
    if (mimeType.includes('photoshop') || mimeType.includes('figma') || mimeType.includes('sketch')) return 'template'
    if (mimeType.includes('html') || mimeType.includes('javascript')) return 'playable'
    return 'other'
}

export function detectAssetTypeFromExtension(extension: string): AssetType {
    const ext = extension.toLowerCase().replace('.', '')

    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff']
    const videoExts = ['mp4', 'mov', 'avi', 'webm', 'mkv', 'm4v', 'flv']
    const docExts = ['pdf', 'doc', 'docx', 'txt', 'ppt', 'pptx', 'xls', 'xlsx']
    const templateExts = ['psd', 'ai', 'figma', 'sketch', 'xd', 'indd', 'aep']
    const playableExts = ['html', 'htm', 'zip'] // Playable ads often come as HTML or ZIP

    if (imageExts.includes(ext)) return 'image'
    if (videoExts.includes(ext)) return 'video'
    if (docExts.includes(ext)) return 'document'
    if (templateExts.includes(ext)) return 'template'
    if (playableExts.includes(ext)) return 'playable'
    return 'other'
}

// ============================================
// WORKFLOW STAGE DETECTION
// ============================================

/**
 * Auto-detect workflow stage based on asset context
 */
export function detectWorkflowStage(asset: Partial<Asset>): WorkflowStage {
    // If has live networks, it's in test (actively running)
    if (asset.liveNetworks && asset.liveNetworks.length > 0) {
        return 'test'
    }

    // If has UA test status with tested networks, it's in test queue
    if (asset.uaTestStatus?.testedNetworks && asset.uaTestStatus.testedNetworks.length > 0) {
        return 'test'
    }

    // If has UA test plan, it's in review (nghiệm thu)
    if (asset.uaTestStatus?.isPlanned) {
        return 'review'
    }

    // If linked to a brief or task, it's final (completed, ready for test)
    if (asset.briefId || (asset.taskIds && asset.taskIds.length > 0)) {
        return 'final'
    }

    // Default to brief stage
    return 'brief'
}

// ============================================
// THUMBNAIL UTILITIES
// ============================================

/**
 * High-quality thumbnail URLs for different asset types
 * In production, these would come from Google Drive API
 */
const HIGH_QUALITY_THUMBNAILS: Record<string, string[]> = {
    video: [
        'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&h=600&fit=crop&q=90',
        'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&h=600&fit=crop&q=90',
        'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800&h=600&fit=crop&q=90',
        'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=600&fit=crop&q=90',
    ],
    image: [
        'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=600&fit=crop&q=90',
        'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop&q=90',
        'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=600&fit=crop&q=90',
        'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=800&h=600&fit=crop&q=90',
    ],
    document: [
        'https://images.unsplash.com/photo-1568667256549-094345857637?w=800&h=600&fit=crop&q=90',
        'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=600&fit=crop&q=90',
    ],
    default: [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop&q=90',
    ],
}

// Legacy thumbnails for backward compatibility
const MOCK_THUMBNAILS: Record<string, string> = {
    video: HIGH_QUALITY_THUMBNAILS.video[0],
    image: HIGH_QUALITY_THUMBNAILS.image[0],
    document: HIGH_QUALITY_THUMBNAILS.document[0],
    default: HIGH_QUALITY_THUMBNAILS.default[0],
}

/**
 * Get Google Drive thumbnail URL with custom size
 * In production, this would construct the actual Drive API thumbnail URL
 * @param fileId - Google Drive file ID
 * @param size - Thumbnail size (s=small, m=medium, l=large, xl=extra large)
 */
export function getDriveThumbnailUrl(fileId: string, size: 's' | 'm' | 'l' | 'xl' = 'l'): string {
    const sizeMap = { s: 220, m: 400, l: 800, xl: 1600 }
    // In production: return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${sizeMap[size]}`
    // For mock, return a high-quality placeholder based on fileId hash
    const hash = fileId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const thumbnails = HIGH_QUALITY_THUMBNAILS.video
    return thumbnails[hash % thumbnails.length]
}

/**
 * Get high-quality thumbnail from Drive URL
 * Automatically detects file type and returns appropriate thumbnail
 */
export async function getHighQualityThumbnail(driveUrl: string): Promise<string | null> {
    const parsed = parseGoogleDriveUrl(driveUrl)
    if (!parsed) return null

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300))

    // In production, this would call Drive API to get actual thumbnail
    // For now, return a high-quality mock thumbnail based on fileId
    return getDriveThumbnailUrl(parsed.fileId, 'l')
}

/**
 * Fetch Drive file info with high-quality thumbnail
 * Used when adding/updating Drive link to an asset
 */
export async function fetchDriveFileWithThumbnail(driveUrl: string): Promise<{
    fileId: string
    fileName: string
    thumbnailUrl: string
    fileSize: number
    mimeType: string
} | null> {
    const parsed = parseGoogleDriveUrl(driveUrl)
    if (!parsed) return null

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    const fileInfo = await getMockDriveFileInfo(parsed.fileId)
    const assetType = detectAssetTypeFromMime(fileInfo.mimeType)

    // Get high-quality thumbnail based on file type
    const thumbnails = HIGH_QUALITY_THUMBNAILS[assetType] || HIGH_QUALITY_THUMBNAILS.default
    const hash = parsed.fileId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const thumbnailUrl = thumbnails[hash % thumbnails.length]

    return {
        fileId: parsed.fileId,
        fileName: fileInfo.name,
        thumbnailUrl,
        fileSize: fileInfo.size,
        mimeType: fileInfo.mimeType,
    }
}

// ============================================
// MOCK GOOGLE DRIVE API
// ============================================

/**
 * Mock Google Drive API response for development
 * In production, this would call actual Drive API
 */
export async function getMockDriveFileInfo(fileId: string): Promise<DriveFileInfo> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Generate mock data based on fileId
    const mockNames = [
        'SP01-GCVAI-ThuyBT-0001.mp4',
        'SP02-DSG-AnhNT-0023.png',
        'SP01-VID-MinhPT-0015.mov',
        'campaign-hero-banner.jpg',
        'product-showcase-v2.psd',
    ]

    const randomName = mockNames[Math.floor(Math.random() * mockNames.length)]
    const extension = randomName.split('.').pop() || 'mp4'
    const isVideo = ['mp4', 'mov', 'avi', 'webm'].includes(extension)
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)

    const assetType = isVideo ? 'video' : isImage ? 'image' : 'document'
    const parsedId = parseAssetIdFromFilename(randomName)

    const mockMimeTypes: Record<string, string> = {
        mp4: 'video/mp4',
        mov: 'video/quicktime',
        png: 'image/png',
        jpg: 'image/jpeg',
        psd: 'image/vnd.adobe.photoshop',
        pdf: 'application/pdf',
    }

    return {
        id: fileId,
        name: randomName,
        mimeType: mockMimeTypes[extension] || 'application/octet-stream',
        size: Math.floor(Math.random() * 50000000) + 1000000, // 1MB - 50MB
        createdTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        modifiedTime: new Date().toISOString(),
        thumbnailLink: MOCK_THUMBNAILS[assetType] || MOCK_THUMBNAILS.default,
        webViewLink: `https://drive.google.com/file/d/${fileId}/view`,
        webContentLink: `https://drive.google.com/uc?id=${fileId}&export=download`,
        iconLink: `https://drive-thirdparty.googleusercontent.com/16/type/${mockMimeTypes[extension]}`,
        parsedAssetId: parsedId?.fullId,
        projectCode: parsedId?.projectCode,
        teamCode: parsedId?.teamCode,
        creatorCode: parsedId?.creatorCode,
        sequenceNumber: parsedId?.sequenceNumber,
    }
}

// ============================================
// BRIEF/TASK AUTO-LINKING
// ============================================

/**
 * Try to find matching Brief ID based on parsed asset ID
 * In production, this would query the database
 */
export function findMatchingBriefId(parsedId: ParsedAssetId | null): string | undefined {
    if (!parsedId) return undefined

    // Mock: Return brief ID if project code matches
    // In production, query briefs database
    const mockBriefMapping: Record<string, string> = {
        'SP01': 'brief_001',
        'SP02': 'brief_002',
        'SP03': 'brief_003',
        'CAMP01': 'brief_campaign_01',
    }

    return mockBriefMapping[parsedId.projectCode]
}

/**
 * Generate tags from parsed asset ID
 */
export function generateTagsFromParsedId(parsedId: ParsedAssetId | null): string[] {
    if (!parsedId) return []

    const tags: string[] = [
        `project:${parsedId.projectCode}`,
        `team:${parsedId.teamCode}`,
        `creator:${parsedId.creatorCode}`,
    ]

    if (parsedId.isCreativeAI) {
        tags.push('ai-generated')
    }

    return tags
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Format file size to human readable
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}

/**
 * Generate thumbnail URL for video (placeholder)
 * In production, would extract frame from video
 */
export function generateVideoThumbnail(videoUrl: string): string {
    // Return a placeholder for now
    return MOCK_THUMBNAILS.video
}

/**
 * Validate Google Drive URL
 * Accepts any link containing drive.google.com or docs.google.com
 * Supports with or without protocol (http://, https://)
 */
export function isValidDriveUrl(url: string): boolean {
    if (!url || !url.trim()) return false

    const trimmedUrl = url.trim().toLowerCase()

    // Add protocol if missing for URL parsing
    let urlToCheck = trimmedUrl
    if (!urlToCheck.startsWith('http://') && !urlToCheck.startsWith('https://')) {
        urlToCheck = 'https://' + urlToCheck
    }

    try {
        const urlObj = new URL(urlToCheck)
        const hostname = urlObj.hostname

        // Accept any Google Drive or Google Docs related domains
        return (
            hostname.includes('drive.google.com') ||
            hostname.includes('docs.google.com') ||
            hostname.includes('sheets.google.com') ||
            hostname.includes('slides.google.com')
        )
    } catch {
        // If URL parsing fails, just check if it contains the domain
        return (
            trimmedUrl.includes('drive.google.com') ||
            trimmedUrl.includes('docs.google.com') ||
            trimmedUrl.includes('sheets.google.com') ||
            trimmedUrl.includes('slides.google.com')
        )
    }
}
