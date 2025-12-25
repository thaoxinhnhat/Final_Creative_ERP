/**
 * Data Aggregator for Deadline & Notification Center
 * Aggregates data from Brief and Concept/Order modules
 */

import type { Task, TaskStatus, TaskPriority, OrderTeamType } from "./types"
import type { Brief } from "../briefs/types"
import type { Concept, OrderAssignment, TeamType } from "../concepts/types"

// ============================================
// MAPPING FUNCTIONS
// ============================================

/**
 * Map a Brief to a Task format for display in Deadline calendar
 */
export function mapBriefToTask(brief: Brief): Task {
    const now = new Date()
    const deadline = new Date(brief.deadline)
    const isOverdue = deadline < now && brief.status !== 'completed'

    // Map brief status to task status
    const statusMap: Record<string, TaskStatus> = {
        draft: 'pending',
        pending: 'pending',
        confirmed: 'in_progress',
        in_progress: 'in_progress',
        waiting_design: 'in_progress',
        design_done: 'review',
        waiting_ua_review: 'review',
        need_revision: 'in_progress',
        completed: 'completed',
        rejected: 'pending',
    }

    // Map brief priority
    const priorityMap: Record<string, TaskPriority> = {
        urgent: 'urgent',
        high: 'high',
        medium: 'medium',
        low: 'low',
    }

    return {
        id: `brief-${brief.id}`,
        briefId: brief.id,
        title: brief.title,
        type: 'brief',
        status: isOverdue ? 'overdue' : (statusMap[brief.status] || 'pending'),
        priority: priorityMap[brief.priority] || 'medium',
        assignedTo: brief.assignedTo || [],
        assignedBy: brief.createdBy || 'ua',
        createdAt: brief.createdAt,
        deadline: brief.deadline,
        appName: brief.appCampaign.split(' - ')[0] || brief.appCampaign,
        campaignName: brief.appCampaign,
        description: brief.requirements,
        progress: calculateBriefProgress(brief),
        // Integration fields
        source: 'brief',
        briefStatus: brief.status,
        linkedBriefTitle: brief.title,
    }
}

/**
 * Map an Order (from Concept) to a Task format
 */
export function mapOrderToTask(
    concept: Concept,
    order: OrderAssignment,
    orderIndex: number
): Task {
    const now = new Date()
    const deadline = new Date(order.deadline)
    const isOverdue = deadline < now && order.status !== 'completed'

    // Map order status to task status
    const statusMap: Record<string, TaskStatus> = {
        pending: 'pending',
        in_progress: 'in_progress',
        returned: 'review',
        completed: 'completed',
    }

    // Determine priority based on deadline proximity
    const daysUntil = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    let priority: TaskPriority = 'medium'
    if (daysUntil < 0) priority = 'urgent'
    else if (daysUntil <= 2) priority = 'high'
    else if (daysUntil <= 5) priority = 'medium'
    else priority = 'low'

    // Team type config for display
    const teamLabels: Record<TeamType, string> = {
        design: 'Design',
        art_stylist: 'Art & Stylist',
        ai_producer: 'AI Producer',
        creative: 'Creative',
    }

    return {
        id: `order-${concept.id}-${orderIndex}`,
        briefId: concept.linkedBriefId || '',
        title: `${concept.title} - ${teamLabels[order.teamType]}`,
        type: 'order',
        status: isOverdue ? 'overdue' : (statusMap[order.status] || 'pending'),
        priority,
        assignedTo: order.assignedTo,
        assignedBy: order.assignedBy,
        createdAt: order.assignedAt,
        deadline: order.deadline,
        appName: concept.linkedBriefTitle?.split(' - ')[0] || 'N/A',
        campaignName: concept.linkedBriefTitle,
        description: concept.description,
        progress: order.status === 'completed' ? 100 : order.status === 'in_progress' ? 50 : 0,
        // Integration fields
        source: 'order',
        conceptId: concept.id,
        orderId: `${concept.id}-${orderIndex}`,
        teamType: order.teamType as OrderTeamType,
        conceptStatus: concept.status,
        orderStatus: order.status,
        linkedBriefTitle: concept.linkedBriefTitle,
        linkedConceptTitle: concept.title,
    }
}

/**
 * Calculate brief progress based on status
 */
function calculateBriefProgress(brief: Brief): number {
    const progressMap: Record<string, number> = {
        draft: 0,
        pending: 10,
        confirmed: 20,
        in_progress: 40,
        waiting_design: 50,
        design_done: 70,
        waiting_ua_review: 85,
        need_revision: 60,
        completed: 100,
        rejected: 0,
    }
    return progressMap[brief.status] || 0
}

// ============================================
// AGGREGATION FUNCTIONS
// ============================================

/**
 * Aggregate all Briefs to Task format
 */
export function aggregateBriefTasks(briefs: Brief[]): Task[] {
    return briefs.map(mapBriefToTask)
}

/**
 * Aggregate all Orders from Concepts to Task format
 */
export function aggregateOrderTasks(concepts: Concept[]): Task[] {
    const tasks: Task[] = []
    concepts.forEach(concept => {
        if (concept.orderAssignments) {
            concept.orderAssignments.forEach((order, index) => {
                tasks.push(mapOrderToTask(concept, order, index))
            })
        }
    })
    return tasks
}

/**
 * Aggregate all tasks from Briefs and Orders
 */
export function aggregateAllTasks(briefs: Brief[], concepts: Concept[]): Task[] {
    return [
        ...aggregateBriefTasks(briefs),
        ...aggregateOrderTasks(concepts),
    ]
}

// ============================================
// FILTER HELPERS
// ============================================

export type SourceFilter = 'all' | 'brief' | 'order'
export type TeamFilter = 'all' | OrderTeamType

export interface AggregatedFilters {
    source?: SourceFilter
    team?: TeamFilter
    briefStatus?: string
    orderStatus?: string
}

/**
 * Filter aggregated tasks by source and team
 */
export function filterAggregatedTasks(
    tasks: Task[],
    filters: AggregatedFilters
): Task[] {
    return tasks.filter(task => {
        // Filter by source
        if (filters.source && filters.source !== 'all') {
            if (task.source !== filters.source) return false
        }

        // Filter by team (only applies to orders)
        if (filters.team && filters.team !== 'all') {
            if (task.source === 'order' && task.teamType !== filters.team) return false
            if (task.source === 'brief') return true // Briefs pass through
        }

        return true
    })
}
