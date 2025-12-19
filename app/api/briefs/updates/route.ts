import { NextRequest, NextResponse } from "next/server"

// In-memory last update timestamp (in production, use Redis or database)
let lastUpdateTimestamp = new Date().toISOString()

export async function GET(request: NextRequest) {
  const clientLastUpdate = request.headers.get("X-Last-Update")
  
  // Check if there are new updates since client's last check
  const hasUpdates = !clientLastUpdate || new Date(lastUpdateTimestamp) > new Date(clientLastUpdate)

  return NextResponse.json({
    hasUpdates,
    timestamp: lastUpdateTimestamp,
    serverTime: new Date().toISOString(),
  })
}

// Helper function to trigger update (call this when data changes)
export function triggerUpdate() {
  lastUpdateTimestamp = new Date().toISOString()
}
