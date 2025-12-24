"use client"
import { User, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type React from "react"

export default function ABTestingASOLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/applications">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-lg font-semibold text-purple-600">A/B Testing</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <div className="h-6 w-6 overflow-hidden rounded-full bg-purple-100">
                <User className="h-full w-full p-1 text-purple-600" />
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col pt-16 md:pt-0">
        {/* Header */}
        <header className="hidden md:flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/applications">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">A/B Testing</h1>
              <p className="text-sm text-gray-500">Thử nghiệm hình ảnh, icon, mô tả để tối ưu chuyển đổi</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">ASO Manager</p>
                <p className="text-xs text-gray-500">aso@example.com</p>
              </div>
              <div className="h-10 w-10 overflow-hidden rounded-full bg-purple-100">
                <User className="h-full w-full p-2 text-purple-600" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
