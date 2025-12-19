import { NextRequest, NextResponse } from "next/server"

// Shared in-memory storage reference (trong thực tế sẽ dùng database)
// Note: This is a simplified example. In production, use a proper database.
let briefs: any[] = []

const initializeBriefs = async () => {
  if (briefs.length === 0) {
    // Fetch from main route to sync data
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/briefs`)
    const data = await response.json()
    briefs = data.briefs || []
  }
}

// GET /api/briefs/:id
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await initializeBriefs()
  
  const brief = briefs.find(b => b.id === params.id)
  
  if (!brief) {
    return NextResponse.json(
      { error: "Brief not found" },
      { status: 404 }
    )
  }

  return NextResponse.json({ brief })
}

// PATCH /api/briefs/:id
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await initializeBriefs()
  
  try {
    const body = await request.json()
    const briefIndex = briefs.findIndex(b => b.id === params.id)

    if (briefIndex === -1) {
      return NextResponse.json(
        { error: "Brief not found" },
        { status: 404 }
      )
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Simulate random failure for testing (10% chance)
    if (Math.random() < 0.1) {
      return NextResponse.json(
        { error: "Random server error for testing" },
        { status: 500 }
      )
    }

    // Build activity log entry
    let activityAction = ""
    if (body.status) {
      switch (body.status) {
        case "confirmed":
          activityAction = body.assignedTo?.length > 0 
            ? `Xác nhận brief, phân công cho ${body.assigneeNames || "team"}`
            : "Xác nhận brief"
          break
        case "refunded":
          activityAction = `Refund với lý do: ${body.refundReason || "N/A"}`
          break
        case "in_progress":
          activityAction = body.fromNeedFix ? "Đã sửa xong, chờ review" : "Bắt đầu thực hiện"
          break
        case "completed":
          activityAction = "Đánh dấu hoàn thành"
          break
        case "need_fix":
          activityAction = "Yêu cầu chỉnh sửa"
          break
        default:
          activityAction = `Cập nhật trạng thái: ${body.status}`
      }
    }

    const updatedBrief = {
      ...briefs[briefIndex],
      ...body,
      activityLog: activityAction ? [
        ...briefs[briefIndex].activityLog,
        {
          action: activityAction,
          by: body.updatedBy || "Unknown",
          at: new Date().toISOString(),
        },
      ] : briefs[briefIndex].activityLog,
    }

    briefs[briefIndex] = updatedBrief

    return NextResponse.json({ brief: updatedBrief })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update brief" },
      { status: 500 }
    )
  }
}

// DELETE /api/briefs/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await initializeBriefs()
  
  const briefIndex = briefs.findIndex(b => b.id === params.id)

  if (briefIndex === -1) {
    return NextResponse.json(
      { error: "Brief not found" },
      { status: 404 }
    )
  }

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300))

  briefs.splice(briefIndex, 1)

  return NextResponse.json({ success: true })
}
