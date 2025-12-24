// ============================================
// SHARED WORKFLOW TYPES - Brief & Concept Sync
// ============================================

/**
 * Shared status types for UA review stages shared between Brief and Concept
 */
export type SharedUAReviewStatus =
    | 'waiting_ua_review'    // Shared: waiting for UA approval
    | 'ua_approved'          // Shared: UA has approved
    | 'ua_rejected'          // Shared: UA has rejected

/**
 * Status mapping between Brief and Concept modules
 */
export const BRIEF_TO_CONCEPT_STATUS_MAP: Record<string, string> = {
    'waiting_ua_review': 'waiting_ua_approval',
    'completed': 'completed',
}

export const CONCEPT_TO_BRIEF_STATUS_MAP: Record<string, string> = {
    'waiting_ua_approval': 'waiting_ua_review',
    'ua_approved': 'waiting_ua_review', // Brief stays in UA review until all concepts done
    'completed': 'completed',
}

/**
 * Check if a concept status should trigger Brief status update
 */
export function shouldSyncBriefStatus(conceptStatus: string): boolean {
    const syncTriggerStatuses = [
        'waiting_ua_approval',
        'ua_approved',
        'ua_rejected',
        'completed',
    ]
    return syncTriggerStatuses.includes(conceptStatus)
}

/**
 * Calculate Brief status based on linked Concept statuses
 * @param conceptStatuses Array of concept statuses linked to a Brief
 * @returns Recommended Brief status or null if no change needed
 */
export function calculateBriefStatusFromConcepts(
    conceptStatuses: string[]
): string | null {
    if (conceptStatuses.length === 0) return null

    // All concepts completed → Brief completed
    const allCompleted = conceptStatuses.every(s => s === 'completed')
    if (allCompleted) return 'completed'

    // Any concept waiting UA approval → Brief waiting UA review
    const anyWaitingUA = conceptStatuses.some(s =>
        s === 'waiting_ua_approval' || s === 'ua_approved'
    )
    if (anyWaitingUA) return 'waiting_ua_review'

    // Any concept rejected → Brief needs revision
    const anyRejected = conceptStatuses.some(s => s === 'ua_rejected')
    if (anyRejected) return 'need_revision'

    return null
}

/**
 * Get sync status label for display
 */
export function getSyncStatusLabel(status: string): string {
    const labels: Record<string, string> = {
        'waiting_ua_review': 'Chờ UA duyệt',
        'waiting_ua_approval': 'Chờ UA duyệt',
        'ua_approved': 'UA đã duyệt',
        'ua_rejected': 'UA từ chối',
        'completed': 'Hoàn thành',
        'need_revision': 'Cần chỉnh sửa',
    }
    return labels[status] || status
}

/**
 * Concept progress summary for Brief display
 */
export interface ConceptProgressSummary {
    total: number
    completed: number
    inProgress: number
    waitingUA: number
    rejected: number
    completionRate: number
}

export function calculateConceptProgress(conceptStatuses: string[]): ConceptProgressSummary {
    const total = conceptStatuses.length
    const completed = conceptStatuses.filter(s => s === 'completed').length
    const waitingUA = conceptStatuses.filter(s =>
        s === 'waiting_ua_approval' || s === 'ua_approved'
    ).length
    const rejected = conceptStatuses.filter(s => s === 'ua_rejected').length
    const inProgress = total - completed - waitingUA - rejected

    return {
        total,
        completed,
        inProgress,
        waitingUA,
        rejected,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    }
}
