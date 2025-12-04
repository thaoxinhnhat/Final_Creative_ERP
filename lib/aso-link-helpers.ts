import type { ProjectID } from "@/types/aso-data-sync"

/**
 * Tạo URL để mở Metadata Management từ Project hoặc Alert
 */
export function getLinkToMetadata(projectId: ProjectID, metadataVersionId?: string): string {
  const baseUrl = "/applications/metadata-mgmt"
  const params = new URLSearchParams({
    projectId,
    ...(metadataVersionId && { versionId: metadataVersionId }),
  })
  return `${baseUrl}?${params.toString()}`
}

/**
 * Tạo URL để mở StoreKit Management từ Project hoặc Alert
 */
export function getLinkToStoreKit(projectId: ProjectID, storeKitVersionId?: string): string {
  const baseUrl = "/applications/aso/storekit-management"
  const params = new URLSearchParams({
    projectId,
    ...(storeKitVersionId && { versionId: storeKitVersionId }),
  })
  return `${baseUrl}?${params.toString()}`
}

/**
 * Tạo URL để mở Asset Production từ StoreKit
 */
export function getLinkToAssetProduction(assetId: string): string {
  return `/applications/tasks-collab?assetId=${assetId}`
}

/**
 * Tạo URL để mở Tracking Session
 */
export function getLinkToTracking(projectId: ProjectID): string {
  return `/applications/ab-testing?projectId=${projectId}`
}

/**
 * Tạo URL để mở Smart Reporting
 */
export function getLinkToReporting(projectId: ProjectID): string {
  return `/applications/performance-monitoring?projectId=${projectId}`
}

/**
 * Tạo URL để quay về Project Management từ bất kỳ module nào
 */
export function getLinkToProject(projectId: ProjectID): string {
  return `/applications/aso-dashboard/${projectId}`
}
