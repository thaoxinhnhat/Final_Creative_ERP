import type { ASOProject, MetadataVersion, StoreKitVersion, StoreKitOrder } from "@/types/aso-data-sync"

// ========== PROGRESS CALCULATION CONSTANTS ==========

export const METADATA_STATUS_PROGRESS = {
  Draft: 0,
  Editing: 20,
  Review: 40,
  Approved: 70,
  Published: 100,
} as const

export const ORDER_STATUS_PROGRESS = {
  Brief: 0,
  "In Design": 25,
  "Need Fix": 25, // Không lùi về 0
  Review: 50,
  Approved: 75,
  Delivered: 100,
} as const

// ========== PROGRESS CALCULATORS ==========

/**
 * Tính progress cho Metadata dựa trên status
 */
export function calculateMetadataProgress(metadata: MetadataVersion): number {
  return METADATA_STATUS_PROGRESS[metadata.status] || 0
}

/**
 * Tính progress cho một StoreKit Order dựa trên status
 */
export function calculateOrderProgress(order: StoreKitOrder): number {
  return ORDER_STATUS_PROGRESS[order.status] || 0
}

/**
 * Tính progress cho StoreKit Version dựa trên tất cả orders
 * StoreKit Progress = Σ(Order_i Progress) / Total Orders
 */
export function calculateStoreKitProgress(storekit: StoreKitVersion, orders: StoreKitOrder[]): number {
  if (orders.length === 0) {
    return 0
  }

  const totalProgress = orders.reduce((sum, order) => {
    return sum + calculateOrderProgress(order)
  }, 0)

  return Math.round(totalProgress / orders.length)
}

/**
 * Tính Overall Progress cho Project dựa trên scope
 *
 * Công thức:
 * - Chỉ Metadata: Overall Progress = Metadata Progress
 * - Chỉ StoreKit: Overall Progress = StoreKit Progress
 * - Cả hai: Overall Progress = (Metadata Progress × 50%) + (StoreKit Progress × 50%)
 */
export function calculateProjectOverallProgress(
  project: ASOProject,
  metadata: MetadataVersion | null,
  storekit: StoreKitVersion | null,
  orders: StoreKitOrder[],
): number {
  const scope = project.scope

  if (scope === "Metadata") {
    // Chỉ Metadata
    if (!metadata) return 0
    return calculateMetadataProgress(metadata)
  }

  if (scope === "StoreKit") {
    // Chỉ StoreKit
    if (!storekit) return 0
    return calculateStoreKitProgress(storekit, orders)
  }

  if (scope === "Both") {
    // Cả hai - trọng số 50/50
    const metadataProgress = metadata ? calculateMetadataProgress(metadata) : 0
    const storekitProgress = storekit ? calculateStoreKitProgress(storekit, orders) : 0

    return Math.round(metadataProgress * 0.5 + storekitProgress * 0.5)
  }

  return 0
}

/**
 * Cập nhật progress cho order khi status thay đổi
 */
export function updateOrderProgress(order: StoreKitOrder): StoreKitOrder {
  return {
    ...order,
    progressPercentage: calculateOrderProgress(order),
    updatedAt: new Date().toISOString(),
  }
}

/**
 * Cập nhật progress cho StoreKit khi có order thay đổi
 */
export function updateStoreKitProgress(storekit: StoreKitVersion, orders: StoreKitOrder[]): StoreKitVersion {
  return {
    ...storekit,
    progressPercentage: calculateStoreKitProgress(storekit, orders),
    updatedAt: new Date().toISOString(),
  }
}

/**
 * Kiểm tra và validate progress rules
 * - Progress chỉ tăng, không giảm (trừ rollback)
 * - Approval status không ảnh hưởng đến progress
 * - Deadline overdue không ảnh hưởng đến progress
 */
export function validateProgressUpdate(oldProgress: number, newProgress: number, allowDecrease = false): number {
  // Nếu không cho phép giảm và progress mới nhỏ hơn cũ -> giữ nguyên
  if (!allowDecrease && newProgress < oldProgress) {
    console.warn(`[Progress] Attempted to decrease progress from ${oldProgress} to ${newProgress}. Keeping old value.`)
    return oldProgress
  }

  // Đảm bảo progress trong khoảng 0-100
  return Math.max(0, Math.min(100, newProgress))
}

// ========== SCENARIO EXAMPLES ==========

/**
 * Ví dụ minh họa:
 *
 * Project scope: Both Metadata + StoreKit
 * - Metadata: Published (100%)
 * - StoreKit có 3 orders:
 *   + ORD001: In Design (25%)
 *   + ORD002: Approved (75%)
 *   + ORD003: Delivered (100%)
 *
 * Tính toán:
 * - StoreKit Progress = (25 + 75 + 100) / 3 = 66.67% ≈ 67%
 * - Overall Progress = (100% × 0.5) + (67% × 0.5) = 83.5% ≈ 83%
 *
 * Khi ORD001 chuyển sang Review:
 * - StoreKit Progress = (50 + 75 + 100) / 3 = 75%
 * - Overall Progress = (100% × 0.5) + (75% × 0.5) = 87.5% ≈ 88%
 */
export function exampleProgressCalculation() {
  const project: ASOProject = {
    projectId: "PRJ001",
    appId: "APP001",
    appName: "Example App",
    scope: "Both",
    marketIds: ["US"],
    os: "iOS",
    status: "In Progress",
    progress: 0,
    deadline: "2025-12-31",
    lead: "John Doe",
    team: [],
    trackingSessionIds: [],
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
    updatedBy: "system",
  }

  const metadata: MetadataVersion = {
    metadataVersionId: "MV001",
    projectId: "PRJ001",
    title: "Example App",
    subtitle: "Subtitle",
    description: "Description",
    keywords: [],
    status: "Published",
    marketId: "US",
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
    createdBy: "user",
  }

  const orders: StoreKitOrder[] = [
    {
      orderId: "ORD001",
      storeKitVersionId: "SKV001",
      projectId: "PRJ001",
      orderName: "Icon Design",
      assetType: "Icon",
      status: "In Design",
      assetIds: [],
      progressPercentage: 25,
      createdAt: "2025-01-01",
      updatedAt: "2025-01-01",
    },
    {
      orderId: "ORD002",
      storeKitVersionId: "SKV001",
      projectId: "PRJ001",
      orderName: "Screenshot Set 1",
      assetType: "Screenshot",
      status: "Approved",
      assetIds: [],
      progressPercentage: 75,
      createdAt: "2025-01-01",
      updatedAt: "2025-01-01",
    },
    {
      orderId: "ORD003",
      storeKitVersionId: "SKV001",
      projectId: "PRJ001",
      orderName: "Banner",
      assetType: "Banner",
      status: "Delivered",
      assetIds: [],
      progressPercentage: 100,
      createdAt: "2025-01-01",
      updatedAt: "2025-01-01",
    },
  ]

  const storekit: StoreKitVersion = {
    storeKitVersionId: "SKV001",
    projectId: "PRJ001",
    orderIds: ["ORD001", "ORD002", "ORD003"],
    progressPercentage: 0,
    status: "In Design",
    marketIds: ["US"],
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
    createdBy: "user",
  }

  console.log("=== Example Progress Calculation ===")
  console.log("Metadata Progress:", calculateMetadataProgress(metadata), "%")
  console.log("StoreKit Progress:", calculateStoreKitProgress(storekit, orders), "%")
  console.log("Overall Progress:", calculateProjectOverallProgress(project, metadata, storekit, orders), "%")

  console.log("\n--- After ORD001 changes to Review ---")
  orders[0].status = "Review"
  console.log("New StoreKit Progress:", calculateStoreKitProgress(storekit, orders), "%")
  console.log("New Overall Progress:", calculateProjectOverallProgress(project, metadata, storekit, orders), "%")
}
