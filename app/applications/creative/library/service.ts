import { mockAssets, mockBriefs, MOCK_BRIEFS, getBriefName } from "./mock-data"
import type {
    Asset,
    AssetFilters,
    AssetType,
    UploadAssetFormData,
    WorkflowStage,
    UATestStatus,
    DeploymentStatus,
    AdNetwork,
    DriveFileInfo
} from "./types"
import {
    parseGoogleDriveUrl,
    getMockDriveFileInfo,
    parseAssetIdFromFilename,
    detectAssetTypeFromExtension,
    detectWorkflowStage,
    findMatchingBriefId,
    generateTagsFromParsedId,
    fetchDriveFileWithThumbnail,
    isValidDriveUrl,
} from "./utils/driveParser"

// Simulating a database
let assetsDB: Asset[] = [...mockAssets]

const DELAY_MS = 600

function delay() {
    return new Promise(resolve => setTimeout(resolve, DELAY_MS))
}

function detectFileType(ext: string): AssetType | null {
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
    const videoExts = ['mp4', 'mov', 'avi', 'webm']
    const docExts = ['pdf', 'doc', 'docx', 'txt', 'ppt', 'pptx']
    const templateExts = ['psd', 'ai', 'figma', 'sketch', 'xd']
    const playableExts = ['html', 'htm', 'zip']

    if (imageExts.includes(ext.toLowerCase())) return 'image'
    if (videoExts.includes(ext.toLowerCase())) return 'video'
    if (docExts.includes(ext.toLowerCase())) return null // Documents not supported
    if (templateExts.includes(ext.toLowerCase())) return 'template'
    if (playableExts.includes(ext.toLowerCase())) return 'playable'
    return 'other'
}

export const assetService = {
    async getAssets(filters: AssetFilters): Promise<Asset[]> {
        await delay()

        let result = [...assetsDB]

        // Search filter
        if (filters.search) {
            const search = filters.search.toLowerCase()
            result = result.filter(a =>
                a.name.toLowerCase().includes(search) ||
                a.description?.toLowerCase().includes(search) ||
                a.tags.some(t => t.toLowerCase().includes(search)) ||
                a.campaignName?.toLowerCase().includes(search) ||
                a.parsedAssetId?.toLowerCase().includes(search) ||
                a.creatorCode?.toLowerCase().includes(search)
            )
        }

        // Type filter
        if (filters.types.length > 0) {
            result = result.filter(a => filters.types.includes(a.type))
        }

        // Category filter
        if (filters.categories.length > 0) {
            result = result.filter(a => filters.categories.includes(a.category))
        }

        // Campaign filter
        if (filters.campaigns.length > 0) {
            result = result.filter(a => a.campaignName && filters.campaigns.includes(a.campaignName))
        }

        // Date range filter
        if (filters.dateRange?.from) {
            result = result.filter(a => new Date(a.uploadedAt) >= new Date(filters.dateRange!.from))
        }
        if (filters.dateRange?.to) {
            result = result.filter(a => new Date(a.uploadedAt) <= new Date(filters.dateRange!.to))
        }

        // Workflow stage filter
        if (filters.workflowStages && filters.workflowStages.length > 0) {
            result = result.filter(a => a.workflowStage && filters.workflowStages!.includes(a.workflowStage))
        }

        // Team filter
        if (filters.teams && filters.teams.length > 0) {
            result = result.filter(a => a.team && filters.teams!.includes(a.team))
        }

        // Ad networks filter
        if (filters.adNetworks && filters.adNetworks.length > 0) {
            result = result.filter(a =>
                a.uaTestStatus?.testedNetworks?.some(n => filters.adNetworks!.includes(n))
            )
        }

        // Performance rating filter
        if (filters.performanceRatings && filters.performanceRatings.length > 0) {
            result = result.filter(a => {
                if (!a.uaTestStatus?.performanceRating) return false
                return Object.values(a.uaTestStatus.performanceRating).some(
                    rating => rating && filters.performanceRatings!.includes(rating)
                )
            })
        }

        // Test plan filter
        if (filters.hasTestPlan !== undefined) {
            result = result.filter(a => a.uaTestStatus?.isPlanned === filters.hasTestPlan)
        }

        // Deployment status filter
        if (filters.deploymentStatuses && filters.deploymentStatuses.length > 0) {
            result = result.filter(a =>
                a.deploymentStatus && filters.deploymentStatuses!.includes(a.deploymentStatus)
            )
        }

        // SORTING
        switch (filters.sortBy) {
            case "newest":
                result.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
                break
            case "oldest":
                result.sort((a, b) => new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime())
                break
            case "name_asc":
                result.sort((a, b) => a.name.localeCompare(b.name))
                break
            case "name_desc":
                result.sort((a, b) => b.name.localeCompare(a.name))
                break
            case "size":
                result.sort((a, b) => b.fileSize - a.fileSize)
                break
            case "downloads":
                result.sort((a, b) => b.downloads - a.downloads)
                break
            case "performance":
                // Sort by number of "good" ratings
                result.sort((a, b) => {
                    const aGood = Object.values(a.uaTestStatus?.performanceRating || {}).filter(r => r === 'good').length
                    const bGood = Object.values(b.uaTestStatus?.performanceRating || {}).filter(r => r === 'good').length
                    return bGood - aGood
                })
                break
        }

        return result
    },

    async uploadAssets(formData: UploadAssetFormData): Promise<Asset[]> {
        await delay()
        // In a real scenario, this would handle file uploads to a server/storage
        const newAssets: Asset[] = formData.files.map((file, index) => {
            const ext = file.name.split('.').pop() || ''
            return {
                id: `asset_${Date.now()}_${index}`,
                name: file.name,
                type: detectFileType(ext),
                category: formData.category,
                fileUrl: URL.createObjectURL(file),
                thumbnailUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
                fileSize: file.size,
                fileExtension: ext,
                description: formData.description,
                tags: formData.tags,
                campaignName: formData.campaignName,
                appName: formData.appName,
                briefId: formData.briefId,
                briefName: formData.briefName,
                conceptId: formData.conceptId,
                uploadedBy: "Creative Team",
                uploadedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                status: "active",
                downloads: 0,
                views: 0,
                workflowStage: formData.workflowStage || 'final',
                team: formData.team,
                driveUrl: formData.driveUrl,
                driveFileId: formData.driveFileId,
                // New fields
                productionTeam: formData.productionTeam,
                themes: formData.themes,
                youtubeUrl: formData.youtubeUrl,
                assetPlatform: formData.assetPlatform,
                // Date tracking
                uploadSource: formData.driveUrl ? 'drive_import' : 'user_upload',
            }
        }).filter(a => a.type !== null) as Asset[] // Filter out unsupported types

        assetsDB = [...newAssets, ...assetsDB]
        return newAssets
    },

    async importFromDrive(driveUrl: string): Promise<Asset | null> {
        await delay()
        try {
            const parsed = parseGoogleDriveUrl(driveUrl)
            if (!parsed) {
                throw new Error('Invalid Google Drive URL')
            }

            // Get file info from Drive API (mock)
            const fileInfo = await getMockDriveFileInfo(parsed.fileId)

            // Parse asset ID from filename
            const parsedId = parseAssetIdFromFilename(fileInfo.name)

            // Auto-detect type and workflow stage
            const ext = fileInfo.name.split('.').pop() || ''
            const assetType = detectAssetTypeFromExtension(ext)
            if (!assetType) {
                throw new Error('Unsupported file type (Documents are not supported)')
            }

            // Find matching brief
            const briefId = findMatchingBriefId(parsedId)

            // Generate tags
            const autoTags = generateTagsFromParsedId(parsedId)

            const newAsset: Asset = {
                id: `asset_${Date.now()}_drive`,
                name: fileInfo.name,
                type: assetType,
                category: 'final_creative',
                fileUrl: fileInfo.webContentLink || fileInfo.webViewLink,
                thumbnailUrl: fileInfo.thumbnailLink,
                fileSize: fileInfo.size,
                fileExtension: ext,
                tags: autoTags,
                uploadedBy: parsedId?.creatorCode || 'Drive Import',
                uploadedAt: fileInfo.createdTime,
                updatedAt: new Date().toISOString(),
                status: 'active',
                downloads: 0,
                views: 0,
                // Drive integration
                driveUrl,
                driveFileId: parsed.fileId,
                // Workflow - Library assets are Final by default
                workflowStage: 'final',
                // Parsed metadata
                parsedAssetId: parsedId?.fullId,
                projectCode: parsedId?.projectCode,
                teamCode: parsedId?.teamCode,
                creatorCode: parsedId?.creatorCode,
                sequenceNumber: parsedId?.sequenceNumber,
                team: parsedId?.team,
                isCreativeAI: parsedId?.isCreativeAI,
                // Auto-link Brief with name lookup
                briefId,
                briefName: briefId ? getBriefName(briefId) : undefined,
            }

            // Auto-detect workflow stage
            newAsset.workflowStage = detectWorkflowStage(newAsset)

            assetsDB = [newAsset, ...assetsDB]
            return newAsset
        } catch (error) {
            console.error('Error importing from Drive:', error)
            return null
        }
    },

    async updateAsset(id: string, updates: Partial<Asset>): Promise<boolean> {
        await delay()
        assetsDB = assetsDB.map(a =>
            a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a
        )
        return true
    },

    async deleteAsset(id: string): Promise<void> {
        await delay()
        assetsDB = assetsDB.filter(a => a.id !== id)
    },

    async incrementViews(id: string): Promise<void> {
        assetsDB = assetsDB.map(a => a.id === id ? { ...a, views: a.views + 1 } : a)
        // No delay needed for stats interactions usually, but keeps it async
    },

    async incrementDownloads(id: string): Promise<void> {
        assetsDB = assetsDB.map(a => a.id === id ? { ...a, downloads: a.downloads + 1 } : a)
    },

    async updateWorkflowStage(id: string, stage: WorkflowStage): Promise<void> {
        await delay()
        assetsDB = assetsDB.map(a => {
            if (a.id !== id) return a
            const history = a.workflowHistory || []
            history.push({
                stage: a.workflowStage,
                changedAt: new Date().toISOString(),
                changedBy: 'User',
            })
            return {
                ...a,
                workflowStage: stage,
                workflowHistory: history,
                updatedAt: new Date().toISOString(),
            }
        })
    },

    async updateUATestStatus(id: string, updates: Partial<UATestStatus>): Promise<void> {
        await delay()
        assetsDB = assetsDB.map(a => {
            if (a.id !== id) return a
            const currentStatus = a.uaTestStatus || {
                isPlanned: false,
                testedNetworks: [],
                performanceRating: {},
            }
            return {
                ...a,
                uaTestStatus: { ...currentStatus, ...updates },
                updatedAt: new Date().toISOString(),
            }
        })
    },

    async setNetworkStatus(id: string, network: AdNetwork, rating: 'good' | 'bad' | 'testing' | null): Promise<void> {
        await delay()
        assetsDB = assetsDB.map(a => {
            if (a.id !== id) return a

            const currentStatus = a.uaTestStatus || {
                isPlanned: false,
                testedNetworks: [],
                performanceRating: {},
            }

            let testedNetworks: AdNetwork[]
            let newPerformanceRating = { ...currentStatus.performanceRating }
            let newLiveNetworks = [...(a.liveNetworks || [])]

            if (rating === null) {
                testedNetworks = currentStatus.testedNetworks.filter(n => n !== network)
                delete newPerformanceRating[network]
                newLiveNetworks = newLiveNetworks.filter(n => n !== network)
            } else {
                testedNetworks = currentStatus.testedNetworks.includes(network)
                    ? currentStatus.testedNetworks
                    : [...currentStatus.testedNetworks, network]
                newPerformanceRating[network] = rating

                const isFinalized = a.workflowStage === 'final'
                if (isFinalized && !newLiveNetworks.includes(network)) {
                    newLiveNetworks = [...newLiveNetworks, network]
                }
            }

            return {
                ...a,
                uaTestStatus: {
                    ...currentStatus,
                    testedNetworks,
                    performanceRating: newPerformanceRating,
                },
                liveNetworks: newLiveNetworks,
                deploymentStatus: newLiveNetworks.length > 0 ? 'live' : (a.deploymentStatus === 'live' ? 'draft' : a.deploymentStatus),
                updatedAt: new Date().toISOString(),
            }
        })
    },

    async updateDeploymentStatus(id: string, status: DeploymentStatus, stopReason?: string): Promise<void> {
        await delay()
        assetsDB = assetsDB.map(a => {
            if (a.id !== id) return a

            const updates: Partial<Asset> = {
                deploymentStatus: status,
                updatedAt: new Date().toISOString(),
            }

            if (status === 'stopped') {
                updates.stopReason = stopReason
                updates.stoppedAt = new Date().toISOString()
                updates.workflowStage = 'stopped'
            }

            if (status === 'live') {
                updates.workflowStage = 'live'
            }

            return { ...a, ...updates }
        })
    },

    async updateLiveNetworks(id: string, networks: AdNetwork[]): Promise<void> {
        await delay()
        assetsDB = assetsDB.map(a => {
            if (a.id !== id) return a

            const currentStatus = a.uaTestStatus || {
                isPlanned: false,
                testedNetworks: [],
                performanceRating: {},
            }

            const removedFromLive = (a.liveNetworks || []).filter(n => !networks.includes(n))
            const newTestedNetworks = currentStatus.testedNetworks.filter(n => !removedFromLive.includes(n))
            const newPerformanceRating = { ...currentStatus.performanceRating }
            removedFromLive.forEach(n => delete newPerformanceRating[n])

            const isNowLive = networks.length > 0

            return {
                ...a,
                liveNetworks: networks,
                uaTestStatus: {
                    ...currentStatus,
                    testedNetworks: newTestedNetworks,
                    performanceRating: newPerformanceRating,
                },
                deploymentStatus: isNowLive ? 'live' : 'draft',
                liveAt: isNowLive && !a.liveAt ? new Date().toISOString() : (isNowLive ? a.liveAt : undefined),
                updatedAt: new Date().toISOString(),
            }
        })
    },

    async updateDriveInfo(id: string, driveUrl: string): Promise<boolean> {
        if (!isValidDriveUrl(driveUrl)) {
            console.error('Invalid Google Drive URL')
            return false
        }

        await delay()
        try {
            const driveInfo = await fetchDriveFileWithThumbnail(driveUrl)

            if (!driveInfo) {
                console.error('Could not fetch Drive file info')
                return false
            }

            assetsDB = assetsDB.map(a => {
                if (a.id !== id) return a
                return {
                    ...a,
                    driveUrl,
                    driveFileId: driveInfo.fileId,
                    thumbnailUrl: driveInfo.thumbnailUrl,
                    updatedAt: new Date().toISOString(),
                }
            })

            return true
        } catch (error) {
            console.error('Error updating Drive info:', error)
            return false
        }
    },

    async removeDriveLink(id: string): Promise<void> {
        await delay()
        assetsDB = assetsDB.map(a => {
            if (a.id !== id) return a
            return {
                ...a,
                driveUrl: undefined,
                driveFileId: undefined,
                updatedAt: new Date().toISOString(),
            }
        })
    },

    async getBriefs() {
        // Return briefs sorted by newest first
        return [...mockBriefs].sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
    }

}
