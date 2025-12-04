"use client"

import type React from "react"
import { Suspense } from "react"

export default function ASODashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full bg-gray-50">
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Đang tải dữ liệu Project...</p>
            </div>
          </div>
        }
      >
        {children}
      </Suspense>
    </div>
  )
}
