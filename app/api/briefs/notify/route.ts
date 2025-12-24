import { NextRequest, NextResponse } from "next/server"

interface NotificationPayload {
  briefId: string
  briefTitle: string
  action: "created" | "confirmed" | "refunded" | "completed" | "assigned" | "need_fix"
  recipients: string[]
  message?: string
  triggeredBy: string
}

// Mock email service - in production, use services like SendGrid, AWS SES, etc.
async function sendEmail(to: string, subject: string, html: string) {
  // Simulate email sending
  console.log(`[EMAIL] To: ${to}, Subject: ${subject}`)
  return { success: true, messageId: `msg-${Date.now()}` }
}

const EMAIL_TEMPLATES: Record<NotificationPayload["action"], { subject: string; getBody: (data: any) => string }> = {
  created: {
    subject: "📝 New Brief Created",
    getBody: (data) => `
      <h2>New Brief: ${data.briefTitle}</h2>
      <p>A new brief has been created and is waiting for your review.</p>
      <p><strong>Created by:</strong> ${data.triggeredBy}</p>
      <a href="${data.url}" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px;">View Brief</a>
    `,
  },
  confirmed: {
    subject: "✅ Brief Confirmed",
    getBody: (data) => `
      <h2>Brief Confirmed: ${data.briefTitle}</h2>
      <p>The brief has been confirmed and assigned.</p>
      <p><strong>Confirmed by:</strong> ${data.triggeredBy}</p>
      <a href="${data.url}" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px;">View Brief</a>
    `,
  },
  refunded: {
    subject: "🔄 Brief Refunded",
    getBody: (data) => `
      <h2>Brief Refunded: ${data.briefTitle}</h2>
      <p>The brief has been refunded.</p>
      <p><strong>Reason:</strong> ${data.message || "N/A"}</p>
      <p><strong>Refunded by:</strong> ${data.triggeredBy}</p>
    `,
  },
  completed: {
    subject: "🎉 Brief Completed",
    getBody: (data) => `
      <h2>Brief Completed: ${data.briefTitle}</h2>
      <p>The brief has been marked as completed.</p>
      <p><strong>Completed by:</strong> ${data.triggeredBy}</p>
    `,
  },
  assigned: {
    subject: "👤 You've Been Assigned to a Brief",
    getBody: (data) => `
      <h2>New Assignment: ${data.briefTitle}</h2>
      <p>You have been assigned to work on this brief.</p>
      <p><strong>Assigned by:</strong> ${data.triggeredBy}</p>
      <a href="${data.url}" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px;">View Brief</a>
    `,
  },
  need_fix: {
    subject: "⚠️ Brief Needs Fixes",
    getBody: (data) => `
      <h2>Fixes Required: ${data.briefTitle}</h2>
      <p>The brief requires additional fixes.</p>
      <p><strong>Feedback:</strong> ${data.message || "N/A"}</p>
      <a href="${data.url}" style="display: inline-block; padding: 12px 24px; background: #f59e0b; color: white; text-decoration: none; border-radius: 8px;">View Brief</a>
    `,
  },
}

export async function POST(request: NextRequest) {
  try {
    const payload: NotificationPayload = await request.json()
    
    const template = EMAIL_TEMPLATES[payload.action]
    if (!template) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const briefUrl = `${baseUrl}/applications/creative/briefs?id=${payload.briefId}`

    const results = await Promise.all(
      payload.recipients.map(async (email) => {
        const html = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
              h2 { color: #1a1a1a; }
              a { color: #3b82f6; }
            </style>
          </head>
          <body>
            ${template.getBody({ ...payload, url: briefUrl })}
            <hr style="margin-top: 40px; border: none; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 12px; color: #999;">
              This is an automated notification from Brief & Task Management.
            </p>
          </body>
          </html>
        `

        return sendEmail(email, template.subject, html)
      })
    )

    return NextResponse.json({
      success: true,
      sent: results.length,
      results,
    })
  } catch (error) {
    console.error("Notification error:", error)
    return NextResponse.json({ error: "Failed to send notifications" }, { status: 500 })
  }
}
