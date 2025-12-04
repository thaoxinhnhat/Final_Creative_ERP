import type {
  ProjectID,
  MetadataVersionID,
  StoreKitVersionID,
  OrderID,
  AssetID,
  TrackingSessionID,
  AlertID,
  ASOProject,
  MetadataVersion,
  StoreKitVersion,
  StoreKitOrder,
  Asset,
  TrackingSession,
  Alert,
  AISuggestion,
  SyncEvent,
} from "@/types/aso-data-sync"

import {
  calculateProjectOverallProgress,
  updateOrderProgress,
  updateStoreKitProgress,
  validateProgressUpdate,
} from "./aso-progress-calculator"

// ========== IN-MEMORY STORES (giả lập database) ==========

export const DATA_STORES = {
  projects: new Map<ProjectID, ASOProject>(),
  metadataVersions: new Map<MetadataVersionID, MetadataVersion>(),
  storeKitVersions: new Map<StoreKitVersionID, StoreKitVersion>(),
  orders: new Map<OrderID, StoreKitOrder>(),
  assets: new Map<AssetID, Asset>(),
  trackingSessions: new Map<TrackingSessionID, TrackingSession>(),
  alerts: new Map<AlertID, Alert>(),
  suggestions: [] as AISuggestion[],
}

// ========== SYNC UTILITIES ==========

/**
 * Phát sự kiện đồng bộ - trigger các hành động liên quan
 */
export function emitSyncEvent(event: Omit<SyncEvent, "eventId" | "timestamp">): void {
  const syncEvent: SyncEvent = {
    ...event,
    eventId: generateId(),
    timestamp: new Date().toISOString(),
  }

  console.log("[ASO Data Sync]", syncEvent.eventType, syncEvent)

  // Xử lý sự kiện theo loại
  handleSyncEvent(syncEvent)
}

/**
 * Xử lý sự kiện đồng bộ
 */
function handleSyncEvent(event: SyncEvent): void {
  switch (event.eventType) {
    case "PROJECT_CREATED":
      handleProjectCreated(event)
      break

    case "PROJECT_UPDATED":
      handleProjectUpdated(event)
      break

    case "METADATA_STATUS_CHANGED":
      handleMetadataStatusChanged(event)
      break

    case "METADATA_APPROVED":
      handleMetadataApproved(event)
      break

    case "METADATA_PUBLISHED":
      handleMetadataPublished(event)
      break

    case "STOREKIT_ORDER_STATUS_CHANGED":
      handleOrderStatusChanged(event)
      break

    case "STOREKIT_APPROVED":
      handleStoreKitApproved(event)
      break

    case "STOREKIT_PUBLISHED":
      handleStoreKitPublished(event)
      break

    case "ASSET_STATUS_CHANGED":
      handleAssetStatusChanged(event)
      break

    case "ASSET_APPROVED":
      handleAssetApproved(event)
      break

    case "TRACKING_DATA_UPDATED":
      handleTrackingDataUpdated(event)
      break

    case "ALERT_CREATED":
      handleAlertCreated(event)
      break

    case "SUGGESTION_APPLIED":
      handleSuggestionApplied(event)
      break
  }
}

// ========== EVENT HANDLERS ==========

function handleProjectCreated(event: SyncEvent): void {
  const project = event.data.project as ASOProject

  // Khởi tạo tracking session cho project mới
  if (event.targetModules.includes("Tracking")) {
    const trackingSession: TrackingSession = {
      trackingSessionId: generateId(),
      projectId: project.projectId,
      downloads: 0,
      cvr: 0,
      ctr: 0,
      keywordRankings: {},
      assetPerformance: {},
      alertIds: [],
      startDate: new Date().toISOString(),
      endDate: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    DATA_STORES.trackingSessions.set(trackingSession.trackingSessionId, trackingSession)

    // Cập nhật project với tracking session ID
    project.trackingSessionIds = [trackingSession.trackingSessionId]
    DATA_STORES.projects.set(project.projectId, project)
  }
}

function handleProjectUpdated(event: SyncEvent): void {
  const projectId = event.projectId!
  const updates = event.data.updates

  // Cập nhật project
  const project = DATA_STORES.projects.get(projectId)
  if (project) {
    Object.assign(project, updates, {
      updatedAt: new Date().toISOString(),
      updatedBy: event.triggeredBy,
    })
    DATA_STORES.projects.set(projectId, project)
  }

  // Nếu thay đổi Market/OS/Scope -> đồng bộ sang các module liên quan
  if (updates.marketIds || updates.os || updates.scope) {
    console.log("[ASO Data Sync] Market/OS/Scope changed - syncing to related modules")

    if (project?.metadataVersionId) {
      const metadata = DATA_STORES.metadataVersions.get(project.metadataVersionId)
      if (metadata && updates.marketIds) {
        console.log("[ASO Data Sync] Syncing market to Metadata:", updates.marketIds)
      }
    }

    if (project?.storeKitVersionId) {
      const storekit = DATA_STORES.storeKitVersions.get(project.storeKitVersionId)
      if (storekit && updates.marketIds) {
        storekit.marketIds = updates.marketIds
        DATA_STORES.storeKitVersions.set(project.storeKitVersionId, storekit)
        console.log("[ASO Data Sync] Synced market to StoreKit:", updates.marketIds)
      }
    }
  }
}

function handleMetadataStatusChanged(event: SyncEvent): void {
  const metadataVersionId = event.metadataVersionId!
  const newStatus = event.data.newStatus

  const metadata = DATA_STORES.metadataVersions.get(metadataVersionId)
  if (!metadata) return

  metadata.status = newStatus
  metadata.updatedAt = new Date().toISOString()
  DATA_STORES.metadataVersions.set(metadataVersionId, metadata)

  console.log("[ASO Progress] Metadata status changed to:", newStatus)

  // Tính lại progress cho project
  recalculateProjectProgress(metadata.projectId)
}

function handleMetadataApproved(event: SyncEvent): void {
  const metadataVersionId = event.metadataVersionId!
  const metadata = DATA_STORES.metadataVersions.get(metadataVersionId)

  if (metadata) {
    metadata.status = "Approved"
    DATA_STORES.metadataVersions.set(metadataVersionId, metadata)

    console.log("[ASO Data Sync] Metadata approved - updating project")
    recalculateProjectProgress(metadata.projectId)
  }
}

function handleMetadataPublished(event: SyncEvent): void {
  const metadataVersionId = event.metadataVersionId!
  const metadata = DATA_STORES.metadataVersions.get(metadataVersionId)

  if (metadata) {
    metadata.status = "Published"
    metadata.publishDate = new Date().toISOString()
    DATA_STORES.metadataVersions.set(metadataVersionId, metadata)

    console.log("[ASO Data Sync] Metadata published - updating tracking")

    // Tính lại progress
    recalculateProjectProgress(metadata.projectId)

    // Tự động chuyển dữ liệu sang Optimization & Tracking
    const project = DATA_STORES.projects.get(metadata.projectId)
    if (project && project.trackingSessionIds.length > 0) {
      const trackingSession = DATA_STORES.trackingSessions.get(project.trackingSessionIds[0])
      if (trackingSession) {
        trackingSession.metadataVersionId = metadataVersionId
        trackingSession.updatedAt = new Date().toISOString()
        DATA_STORES.trackingSessions.set(trackingSession.trackingSessionId, trackingSession)
      }
    }
  }
}

function handleOrderStatusChanged(event: SyncEvent): void {
  const orderId = event.orderId!
  const newStatus = event.data.newStatus

  const order = DATA_STORES.orders.get(orderId)
  if (!order) return

  order.status = newStatus

  // Cập nhật progress cho order
  const updatedOrder = updateOrderProgress(order)
  DATA_STORES.orders.set(orderId, updatedOrder)

  console.log("[ASO Progress] Order status changed:", orderId, "->", newStatus, `(${updatedOrder.progressPercentage}%)`)

  // Tính lại progress cho StoreKit
  const storekit = DATA_STORES.storeKitVersions.get(order.storeKitVersionId)
  if (storekit) {
    const allOrders = Array.from(DATA_STORES.orders.values()).filter(
      (o) => o.storeKitVersionId === storekit.storeKitVersionId,
    )

    const updatedStoreKit = updateStoreKitProgress(storekit, allOrders)
    DATA_STORES.storeKitVersions.set(storekit.storeKitVersionId, updatedStoreKit)

    console.log("[ASO Progress] StoreKit progress recalculated:", `${updatedStoreKit.progressPercentage}%`)

    // Trigger cập nhật Project
    recalculateProjectProgress(order.projectId)
  }
}

function handleStoreKitApproved(event: SyncEvent): void {
  const storeKitVersionId = event.storeKitVersionId!
  const storekit = DATA_STORES.storeKitVersions.get(storeKitVersionId)

  if (storekit) {
    storekit.status = "Approved"
    DATA_STORES.storeKitVersions.set(storeKitVersionId, storekit)

    console.log("[ASO Data Sync] StoreKit approved")
    recalculateProjectProgress(storekit.projectId)
  }
}

function handleStoreKitPublished(event: SyncEvent): void {
  const storeKitVersionId = event.storeKitVersionId!
  const storekit = DATA_STORES.storeKitVersions.get(storeKitVersionId)

  if (storekit) {
    storekit.status = "Published"
    storekit.publishDate = new Date().toISOString()
    DATA_STORES.storeKitVersions.set(storeKitVersionId, storekit)

    console.log("[ASO Data Sync] StoreKit published - updating tracking")

    recalculateProjectProgress(storekit.projectId)

    const project = DATA_STORES.projects.get(storekit.projectId)
    if (project && project.trackingSessionIds.length > 0) {
      const trackingSession = DATA_STORES.trackingSessions.get(project.trackingSessionIds[0])
      if (trackingSession) {
        trackingSession.storeKitVersionId = storeKitVersionId
        trackingSession.updatedAt = new Date().toISOString()
        DATA_STORES.trackingSessions.set(trackingSession.trackingSessionId, trackingSession)
      }
    }
  }
}

function handleAssetStatusChanged(event: SyncEvent): void {
  const assetId = event.assetId!
  const newStatus = event.data.newStatus

  const asset = DATA_STORES.assets.get(assetId)
  if (!asset) return

  asset.status = newStatus
  asset.updatedAt = new Date().toISOString()
  DATA_STORES.assets.set(assetId, asset)

  console.log("[ASO Progress] Asset status changed:", assetId, "->", newStatus)

  // Gửi event về StoreKit với Order_ID tương ứng
  if (asset.orderId) {
    emitSyncEvent({
      eventType: "STOREKIT_ORDER_STATUS_CHANGED",
      sourceModule: "Asset",
      targetModules: ["StoreKit", "Project"],
      data: {
        newStatus: newStatus,
        orderId: asset.orderId,
      },
      orderId: asset.orderId,
      storeKitVersionId: asset.storeKitVersionId,
      triggeredBy: event.triggeredBy,
    })
  }
}

function handleAssetApproved(event: SyncEvent): void {
  const assetId = event.assetId!
  const asset = DATA_STORES.assets.get(assetId)

  if (asset) {
    asset.status = "Approved"
    DATA_STORES.assets.set(assetId, asset)

    console.log("[ASO Data Sync] Asset approved")

    // Trigger order status update
    if (asset.orderId) {
      const order = DATA_STORES.orders.get(asset.orderId)
      if (order) {
        emitSyncEvent({
          eventType: "STOREKIT_ORDER_STATUS_CHANGED",
          sourceModule: "Asset",
          targetModules: ["StoreKit", "Project"],
          data: {
            newStatus: "Approved",
            orderId: asset.orderId,
          },
          orderId: asset.orderId,
          storeKitVersionId: asset.storeKitVersionId,
          triggeredBy: event.triggeredBy,
        })
      }
    }
  }
}

function handleTrackingDataUpdated(event: SyncEvent): void {
  const trackingSessionId = event.data.trackingSessionId as TrackingSessionID
  const updates = event.data.updates

  const trackingSession = DATA_STORES.trackingSessions.get(trackingSessionId)
  if (trackingSession) {
    Object.assign(trackingSession, updates, {
      updatedAt: new Date().toISOString(),
    })
    DATA_STORES.trackingSessions.set(trackingSessionId, trackingSession)

    console.log("[ASO Data Sync] Tracking data updated - checking for alerts")
  }
}

function handleAlertCreated(event: SyncEvent): void {
  const alert = event.data.alert as Alert

  DATA_STORES.alerts.set(alert.alertId, alert)

  const trackingSession = DATA_STORES.trackingSessions.get(alert.trackingSessionId)
  if (trackingSession) {
    trackingSession.alertIds.push(alert.alertId)
    DATA_STORES.trackingSessions.set(alert.trackingSessionId, trackingSession)
  }

  console.log("[ASO Data Sync] Alert created:", alert.type, alert.title)
}

function handleSuggestionApplied(event: SyncEvent): void {
  const suggestionId = event.data.suggestionId as string
  const suggestion = DATA_STORES.suggestions.find((s) => s.suggestionId === suggestionId)

  if (suggestion) {
    suggestion.status = "Applied"

    if (suggestion.actionType === "Create Project") {
      console.log("[ASO Data Sync] Creating new project from suggestion")

      const newProjectId = generateId()
      suggestion.appliedProjectId = newProjectId
    }
  }
}

function recalculateProjectProgress(projectId: ProjectID): void {
  const project = DATA_STORES.projects.get(projectId)
  if (!project) return

  // Lấy metadata và storekit data
  const metadata = project.metadataVersionId ? DATA_STORES.metadataVersions.get(project.metadataVersionId) : null

  const storekit = project.storeKitVersionId ? DATA_STORES.storeKitVersions.get(project.storeKitVersionId) : null

  const orders = storekit
    ? Array.from(DATA_STORES.orders.values()).filter((o) => o.storeKitVersionId === storekit.storeKitVersionId)
    : []

  // Tính toán progress mới
  const oldProgress = project.progress
  const newProgress = calculateProjectOverallProgress(project, metadata, storekit, orders)

  // Validate và cập nhật
  const validatedProgress = validateProgressUpdate(oldProgress, newProgress)

  if (validatedProgress !== oldProgress) {
    project.progress = validatedProgress
    project.updatedAt = new Date().toISOString()
    DATA_STORES.projects.set(projectId, project)

    console.log(`[ASO Progress] Project ${projectId} progress updated: ${oldProgress}% → ${validatedProgress}%`)
  }
}

// ========== QUERY UTILITIES ==========

/**
 * Lấy tất cả dữ liệu liên quan đến một Project
 */
export function getProjectFullData(projectId: ProjectID) {
  const project = DATA_STORES.projects.get(projectId)
  if (!project) return null

  const metadata = project.metadataVersionId ? DATA_STORES.metadataVersions.get(project.metadataVersionId) : null

  const storekit = project.storeKitVersionId ? DATA_STORES.storeKitVersions.get(project.storeKitVersionId) : null

  const orders = storekit
    ? Array.from(DATA_STORES.orders.values()).filter((o) => o.storeKitVersionId === storekit.storeKitVersionId)
    : []

  const assets = orders
    .flatMap((order) => order.assetIds)
    .map((id) => DATA_STORES.assets.get(id))
    .filter(Boolean)

  const trackingSessions = project.trackingSessionIds.map((id) => DATA_STORES.trackingSessions.get(id)).filter(Boolean)

  const alerts = trackingSessions
    .flatMap((ts) => ts!.alertIds)
    .map((id) => DATA_STORES.alerts.get(id))
    .filter(Boolean)

  return {
    project,
    metadata,
    storekit,
    orders,
    assets,
    trackingSessions,
    alerts,
  }
}

/**
 * Lấy module nguồn từ Alert để link ngược
 */
export function getAlertSource(alert: Alert): { module: string; id: string; data: any } | null {
  if (alert.sourceModule === "Metadata" && alert.sourceId) {
    const metadata = DATA_STORES.metadataVersions.get(alert.sourceId as MetadataVersionID)
    return { module: "Metadata", id: alert.sourceId, data: metadata }
  }

  if (alert.sourceModule === "StoreKit" && alert.sourceId) {
    const storekit = DATA_STORES.storeKitVersions.get(alert.sourceId as StoreKitVersionID)
    return { module: "StoreKit", id: alert.sourceId, data: storekit }
  }

  return null
}

// ========== HELPERS ==========

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
