"use client"

import { useState } from "react"
import {
  Home,
  Target,
  BarChart3,
  FileText,
  Users,
  Settings,
  Bell,
  ChevronLeft,
  ChevronRight,
  User,
  Menu,
  Search,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSearchParams } from "next/navigation"
import type React from "react"
import { Suspense } from "react"

export default function LocalizationLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const navigationItems = [
    { id: "dashboard", icon: Home, label: "Dashboard", href: "/applications/localization" },
    { id: "campaigns", icon: Target, label: "Campaign", href: "/applications/localization/campaigns" },
    { id: "kpi", icon: BarChart3, label: "KPI", href: "/applications/localization/kpi" },
    { id: "reports", icon: FileText, label: "Báo cáo", href: "/applications/localization/reports" },
    { id: "users", icon: Users, label: "Người dùng", href: "/applications/localization/users" },
    { id: "settings", icon: Settings, label: "Cài đặt", href: "/applications/localization/settings" },
  ]

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen)
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex h-screen bg-gray-50">
        {/* Mobile Header */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 md:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" onClick={toggleMobileSidebar}>
                <Menu className="h-4 w-4" />
              </Button>
              <h1 className="text-lg font-semibold text-blue-600">ASO ERP</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                  3
                </Badge>
              </Button>
              <Button variant="ghost" size="icon">
                <div className="h-6 w-6 overflow-hidden rounded-full bg-blue-100">
                  <User className="h-full w-full p-1 text-blue-600" />
                </div>
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col",
            sidebarCollapsed ? "w-16" : "w-64",
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
            "top-16 md:top-0",
          )}
        >
          {/* Logo */}
          <div className="hidden md:flex items-center justify-between border-b border-gray-200 px-4 py-4">
            {!sidebarCollapsed && <h1 className="text-xl font-bold text-blue-600">ASO ERP</h1>}
            {sidebarCollapsed && (
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                A
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-auto py-4">
            <div className="space-y-1 px-2">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                      sidebarCollapsed && "justify-center",
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* Collapse Toggle */}
          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-20 hidden md:flex items-center justify-center h-6 w-6 rounded-full bg-white border border-gray-200 shadow-sm z-50 text-gray-500 hover:text-gray-900"
          >
            {sidebarCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
          </button>
        </aside>

        {/* Mobile Overlay */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div
          className={cn(
            "flex-1 flex flex-col transition-all duration-300 ease-in-out",
            sidebarCollapsed ? "md:ml-16" : "md:ml-64",
            "pt-16 md:pt-0",
          )}
        >
          {/* Header */}
          <header className="hidden md:flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
            <div className="flex items-center gap-4 flex-1 max-w-xl">
              <Search className="h-5 w-5 text-gray-400" />
              <Input
                placeholder="Tìm kiếm chiến dịch, KPI, báo cáo..."
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                  3
                </Badge>
              </Button>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">admin@example.com</p>
                </div>
                <div className="h-10 w-10 overflow-hidden rounded-full bg-blue-100">
                  <User className="h-full w-full p-2 text-blue-600" />
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </Suspense>
  )
}
