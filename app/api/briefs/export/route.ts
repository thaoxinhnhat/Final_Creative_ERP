import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { briefId, format } = await request.json()

    // Fetch brief data
    const briefResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/briefs/${briefId}`)
    const { brief } = await briefResponse.json()

    if (!brief) {
      return NextResponse.json({ error: "Brief not found" }, { status: 404 })
    }

    if (format === "csv") {
      const csv = generateCSV([brief])
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="brief-${briefId}.csv"`,
        },
      })
    }

    if (format === "pdf") {
      // Generate simple HTML that can be converted to PDF
      const html = generatePDFHTML(brief)
      return new NextResponse(html, {
        headers: {
          "Content-Type": "text/html",
          "Content-Disposition": `attachment; filename="brief-${briefId}.html"`,
        },
      })
    }

    if (format === "excel") {
      // Return CSV for Excel (simple implementation)
      const csv = generateCSV([brief])
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="brief-${briefId}.csv"`,
        },
      })
    }

    return NextResponse.json({ error: "Invalid format" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: "Export failed" }, { status: 500 })
  }
}

function generateCSV(briefs: any[]): string {
  const headers = ["ID", "Title", "App/Campaign", "Status", "Priority", "Deadline", "Region", "Platform", "Created By", "Created At"]
  const rows = briefs.map((b) => [
    b.id, b.title, b.appCampaign, b.status, b.priority, b.deadline, b.region, b.platform, b.createdBy, b.createdAt
  ])
  return [headers, ...rows].map((row) => row.map((c: any) => `"${c}"`).join(",")).join("\n")
}

function generatePDFHTML(brief: any): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Brief: ${brief.title}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
    h1 { color: #1a1a1a; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
    .section { margin: 20px 0; }
    .label { font-weight: bold; color: #666; font-size: 12px; text-transform: uppercase; }
    .value { margin-top: 5px; font-size: 14px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
    .status-pending { background: #fef3c7; color: #92400e; }
    .status-completed { background: #d1fae5; color: #065f46; }
    .requirements { background: #f3f4f6; padding: 15px; border-radius: 8px; white-space: pre-wrap; }
    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
    .kpi-card { background: #f3f4f6; padding: 10px; border-radius: 8px; text-align: center; }
    .kpi-value { font-size: 18px; font-weight: bold; color: #3b82f6; }
    .kpi-label { font-size: 11px; color: #666; }
  </style>
</head>
<body>
  <h1>${brief.title}</h1>
  <p style="color: #666;">${brief.appCampaign}</p>
  
  <div class="grid">
    <div class="section">
      <div class="label">Status</div>
      <div class="value"><span class="badge status-${brief.status}">${brief.status}</span></div>
    </div>
    <div class="section">
      <div class="label">Priority</div>
      <div class="value">${brief.priority}</div>
    </div>
    <div class="section">
      <div class="label">Deadline</div>
      <div class="value">${brief.deadline}</div>
    </div>
    <div class="section">
      <div class="label">Platform</div>
      <div class="value">${brief.platform}</div>
    </div>
    <div class="section">
      <div class="label">Region</div>
      <div class="value">${brief.region}</div>
    </div>
    <div class="section">
      <div class="label">Created By</div>
      <div class="value">${brief.createdBy}</div>
    </div>
  </div>

  <div class="section">
    <div class="label">KPI Targets</div>
    <div class="kpi-grid" style="margin-top: 10px;">
      <div class="kpi-card">
        <div class="kpi-value">${brief.kpiTargets?.ctr || 0}%</div>
        <div class="kpi-label">CTR</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${brief.kpiTargets?.cvr || 0}%</div>
        <div class="kpi-label">CVR</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">$${brief.kpiTargets?.cpi || 0}</div>
        <div class="kpi-label">CPI</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${brief.kpiTargets?.roas || 0}x</div>
        <div class="kpi-label">ROAS</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="label">Requirements</div>
    <div class="requirements">${brief.requirements}</div>
  </div>

  <div class="section" style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
    <p style="font-size: 11px; color: #999;">
      Exported on ${new Date().toLocaleDateString()} | Brief ID: ${brief.id}
    </p>
  </div>
</body>
</html>`
}
