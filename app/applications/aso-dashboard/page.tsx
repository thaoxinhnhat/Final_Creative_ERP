"use client"

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs" // Thêm Tabs components

import type React from "react"

import { useState, startTransition, useEffect } from "react" // Added useEffect
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Plus, Search, Download, Upload, MoreVertical, Edit, Trash2, Eye, CalendarIcon, AlertCircle, CheckCircle2, Clock, Users, FolderKanban, TrendingUp, FileText, Workflow, ArrowUpDown, Gamepad2, Smartphone, GitBranch, ArrowLeft } from 'lucide-react'
import { format, differenceInDays } from "date-fns"
import { cn } from "@/lib/utils"
import { PauseCircle, Apple, HandCoins as Android2 } from 'lucide-react' // Added missing imports
import { toast } from "@/components/ui/use-toast" // Thêm toast import

import { PROJECTS_DATA } from "./projects-data"

// Function to get icon for each status
const getStatusIcon = (status: string) => {
  switch (status) {
    case "Draft":
      return <FileText className="w-4 h-4" />
    case "Researching":
      return <Search className="w-4 h-4" />
    case "In Preparation":
      return <Workflow className="w-4 h-4" />
    case "Waiting for Assets":
      return <Upload className="w-4 h-4" />
    case "Under Review":
      return <Clock className="w-4 h-4" />
    case "Pending Approval":
      return <AlertCircle className="w-4 h-4" />
    case "Need Revision":
      return <Edit className="w-4 h-4" />
    case "Rejected":
      return <Trash2 className="w-4 h-4" />
    case "Approved":
      return <CheckCircle2 className="w-4 h-4" />
    case "Published":
      return <TrendingUp className="w-4 h-4" />
    case "Optimizing":
      return <FileText className="w-4 h-4" />
    case "On Hold":
      return <PauseCircle className="w-4 h-4" />
    case "Archived":
      return <FolderKanban className="w-4 h-4" />
    default:
      return null
  }
}

// Function to get icon for urgency
const getUrgencyIcon = (isUrgent: boolean) => {
  if (isUrgent) {
    return <AlertCircle className="w-4 h-4 text-red-500" />
  }
  return null
}

// Function to get icon for OS
const getOSIcon = (os: string) => {
  if (os === "iOS") {
    return <Apple className="w-4 h-4" />
  } else if (os === "Android") {
    return <Android2 className="w-4 h-4" />
  }
  return null
}

// Function to get category icon
const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Game":
      return <Gamepad2 className="w-4 h-4" />
    case "App":
      return <Smartphone className="w-4 h-4" />
    default:
      return null
  }
}

// Function to determine badge color based on status
const getStatusColor = (status: string) => {
  switch (status) {
    case "Draft":
      return "border-gray-400 text-gray-700 bg-gray-100"
    case "Researching":
      return "border-blue-400 text-blue-700 bg-blue-50"
    case "In Preparation":
      return "border-blue-500 text-blue-800 bg-blue-100"
    case "Waiting for Assets":
      return "border-blue-500 text-blue-800 bg-blue-100"
    case "Under Review":
      return "border-yellow-500 text-yellow-800 bg-yellow-50"
    case "Pending Approval":
      return "border-orange-500 text-orange-800 bg-orange-50"
    case "Need Revision":
      return "border-red-500 text-red-700 bg-red-50"
    case "Rejected":
      return "border-red-600 text-red-900 bg-red-100"
    case "Approved":
      return "border-green-500 text-green-700 bg-green-50"
    case "Published":
      return "border-green-600 text-green-900 bg-green-100"
    case "Optimizing":
      return "border-purple-500 text-purple-700 bg-purple-50"
    case "On Hold":
      return "border-gray-500 text-gray-700 bg-gray-100"
    case "Archived":
      return "border-gray-500 text-gray-700 bg-gray-100"
    default:
      return "border-gray-300 text-gray-600"
  }
}

const parseDeadline = (deadlineStr: string): Date => {
  const [day, month, year] = deadlineStr.split("/")
  return new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day))
}

const getDeadlineDisplay = (deadlineStr: string, status: string) => {
  const deadline = parseDeadline(deadlineStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  deadline.setHours(0, 0, 0, 0)

  const daysLeft = differenceInDays(deadline, today)

  // Rule 1: Terminal States → Show completion date, NO warnings
  if (status === "Published" || status === "Archived") {
    return {
      type: "terminal",
      daysLeft,
      bgColor: status === "Published" ? "bg-green-50" : "bg-gray-50",
      textColor: status === "Published" ? "text-green-700" : "text-gray-600",
      icon: status === "Published" ? "✅" : "📁",
      label: `${status} on ${deadlineStr}`,
      hideStatusRow: true,
    }
  }

  // Rule 4: Optimizing → Different label with blue color
  if (status === "Optimizing") {
    if (daysLeft < 0) {
      return {
        type: "optimizing_overdue",
        daysLeft,
        bgColor: "bg-blue-50",
        textColor: "text-blue-700",
        icon: "📊",
        label: "Review overdue",
        hideStatusRow: false,
      }
    }
    return {
      type: "optimizing",
      daysLeft,
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      icon: "📊",
      label: `${daysLeft} ${daysLeft === 1 ? "day" : "days"} left`,
      hideStatusRow: false,
    }
  }

  // Rule 3: Blocked States → Add context label
  if (status === "Rejected" || status === "On Hold") {
    const daysOverdue = Math.abs(daysLeft)
    let textColor = "text-red-700"
    let bgColor = "bg-red-50"

    if (daysOverdue > 30) {
      textColor = "text-red-900"
      bgColor = "bg-red-100"
    } else if (daysOverdue >= 8) {
      textColor = "text-red-700"
      bgColor = "bg-red-50"
    } else {
      textColor = "text-red-600"
      bgColor = "bg-red-50"
    }

    return {
      type: "blocked",
      daysLeft,
      bgColor,
      textColor,
      icon: "🔴",
      label:
        daysLeft < 0
          ? `${Math.abs(daysLeft)} ${Math.abs(daysLeft) === 1 ? "day" : "days"} overdue (${status})`
          : `${daysLeft} ${daysLeft === 1 ? "day" : "days"} left (${status})`,
      hideStatusRow: true,
    }
  }

  // Rule 2: Active States → Normal deadline logic
  if (daysLeft < 0) {
    const daysOverdue = Math.abs(daysLeft)
    let textColor = "text-red-700"
    let bgColor = "bg-red-50"

    if (daysOverdue > 30) {
      textColor = "text-red-900"
      bgColor = "bg-red-100"
    } else if (daysOverdue >= 8) {
      textColor = "text-red-700"
      bgColor = "bg-red-50"
    } else {
      textColor = "text-red-600"
      bgColor = "bg-red-50"
    }

    return {
      type: "overdue",
      daysLeft,
      bgColor,
      textColor,
      icon: "🔴",
      label: `${Math.abs(daysLeft)} ${Math.abs(daysLeft) === 1 ? "day" : "days"} overdue`,
      hideStatusRow: false,
    }
  } else if (daysLeft <= 3) {
    return {
      type: "critical",
      daysLeft,
      bgColor: "bg-yellow-50",
      textColor: "text-orange-600",
      icon: "🟡",
      label: daysLeft === 0 ? "Today" : `${daysLeft} ${daysLeft === 1 ? "day" : "days"} left`,
      hideStatusRow: false,
    }
  } else if (daysLeft <= 7) {
    return {
      type: "warning",
      daysLeft,
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700",
      icon: "⚠️",
      label: `${daysLeft} ${daysLeft === 1 ? "day" : "days"} left`,
      hideStatusRow: false,
    }
  } else {
    return {
      type: "normal",
      daysLeft,
      bgColor: "transparent",
      textColor: "text-gray-600",
      icon: null,
      label: `${daysLeft} ${daysLeft === 1 ? "day" : "days"} left`,
      hideStatusRow: false,
    }
  }
}

export default function ASODashboardPage() { // Renamed component
  const router = useRouter()
  const [projects, setProjects] = useState(PROJECTS_DATA) // Use PROJECTS_DATA from shared file
  
  const [showBackToMetadata, setShowBackToMetadata] = useState(false)

  useEffect(() => {
    // Cập nhật state projects mỗi khi component được mount hoặc khi quay lại trang
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setProjects([...PROJECTS_DATA])
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    // Cập nhật khi focus vào window
    const handleFocus = () => {
      setProjects([...PROJECTS_DATA])
    }

    window.addEventListener("focus", handleFocus)
    
    const shouldReturnToMetadata = sessionStorage.getItem('returnToMetadata')
    if (shouldReturnToMetadata === 'true') {
      setShowBackToMetadata(true)
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("focus", handleFocus)
    }
  }, [])

  const [filterStatus, setFilterStatus] = useState<string>("All")
  const [filterCategory, setFilterCategory] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [showWorkflowDialog, setShowWorkflowDialog] = useState(false)
  const [selectedProjectForWorkflow, setSelectedProjectForWorkflow] = useState<any>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [currentProject, setCurrentProject] = useState<any>(null)
  const [dateRange, setDateRange] = useState<any>({
    from: undefined,
    to: undefined,
  })
  const [sortDeadlineAsc, setSortDeadlineAsc] = useState(false)

  // Removed: isCreateModalOpen, setIsCreateModalOpen, isDeleteDialogOpen, setIsDeleteDialogOpen, projectToDelete, setProjectToDelete, isConfirmCreateOpen, setIsConfirmCreateOpen
  const [isExtendDeadlineOpen, setIsExtendDeadlineOpen] = useState(false)
  const [projectToExtend, setProjectToExtend] = useState<any>(null)
  const [extendDeadlineData, setExtendDeadlineData] = useState({
    newDeadline: "",
    extendByDays: 0,
    reason: "",
    notifyAssignee: true,
  })
  const [initialExtendData, setInitialExtendData] = useState({
    newDeadline: "",
    extendByDays: 0,
    reason: "",
    notifyAssignee: true,
  })
  const [isConfirmExtendOpen, setIsConfirmExtendOpen] = useState(false)
  const [isCancelExtendOpen, setIsCancelExtendOpen] = useState(false)

  const [newProject, setNewProject] = useState({
    appName: "",
    os: "",
    market: "",
    region: "",
    category: "",
    lead: "",
    deadline: "",
    team: [] as string[],
    workflowTemplate: "",
    optimizationScope: "Both",
    description: "",
    icon: "",
  })

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [detailProject, setDetailProject] = useState<any>(null)
  const [detailTab, setDetailTab] = useState("overview")

  const statusGroups = {
    inProgress: ["Researching", "In Preparation", "Waiting for Assets", "Under Review"],
    pendingApproval: ["Pending Approval"],
    published: ["Published", "Optimizing"],
  }

  const getStatusCounts = () => {
    return {
      inProgress: projects.filter((p) => statusGroups.inProgress.includes(p.status)).length,
      pendingApproval: projects.filter((p) => statusGroups.pendingApproval.includes(p.status)).length,
      published: projects.filter((p) => statusGroups.published.includes(p.status)).length,
    }
  }

  const counts = getStatusCounts()

  const statuses = [
    "All",
    "Draft",
    "Researching",
    "In Preparation",
    "Waiting for Assets",
    "Under Review",
    "Pending Approval",
    "Need Revision",
    "Rejected",
    "Approved",
    "Published",
    "Optimizing",
    "On Hold",
    "Archived",
  ]

  const categories = ["All", "Game", "App"]

  const handleFilterChange = (value: string) => {
    startTransition(() => {
      setFilterStatus(value)
    })
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const handleAppNameClick = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/applications/aso-dashboard/${projectId}`)
  }

  const handleViewWorkflow = (project: any, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedProjectForWorkflow(project)
    setShowWorkflowDialog(true)
  }

  const handleProjectClick = (project: any) => {
    setCurrentProject(project)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setCurrentProject(null)
  }

  const handleBackToMetadata = () => {
    const returnUrl = sessionStorage.getItem('returnUrl') || '/applications/metadata-tracking'
    sessionStorage.removeItem('returnToMetadata')
    sessionStorage.removeItem('returnUrl')
    router.push(returnUrl)
  }

  const filteredProjects = projects
    .filter((project) => {
      const statusMatch = filterStatus === "All" || project.status === filterStatus
      const categoryMatch = filterCategory === "All" || project.category === filterCategory
      const searchMatch =
        project.appName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.keywords.some((keyword: string) => keyword.toLowerCase().includes(searchQuery.toLowerCase()))

      const dateMatch =
        (!dateRange.from || new Date(project.deadline.split("/").reverse().join("-")) >= dateRange.from) &&
        (!dateRange.to || new Date(project.deadline.split("/").reverse().join("-")) <= dateRange.to)

      return statusMatch && categoryMatch && searchMatch && dateMatch
    })
    .sort((a, b) => {
      const displayA = getDeadlineDisplay(a.deadline, a.status)
      const displayB = getDeadlineDisplay(b.deadline, b.status)

      if (sortDeadlineAsc) {
        return displayA.daysLeft - displayB.daysLeft
      } else {
        // Default: Overdue first → Nearest deadline → Farthest
        if (displayA.type === "overdue" && displayB.type !== "overdue") return -1
        if (displayA.type !== "overdue" && displayB.type === "overdue") return 1
        return displayA.daysLeft - displayB.daysLeft
      }
    })

  // Removed: handleAddProject, handleCreateProject, handleConfirmCreateProject functions

  const handleCloseCreateModal = () => {
    const hasChanges = newProject.appName || newProject.os || newProject.market || newProject.lead

    if (hasChanges) {
      const confirm = window.confirm("Bạn có chắc muốn hủy tạo dự án mới? Mọi thông tin chưa lưu sẽ bị mất.")
      if (!confirm) return
    }

    setNewProject({
      appName: "",
      os: "",
      market: "",
      region: "",
      category: "",
      lead: "",
      deadline: "",
      team: [],
      workflowTemplate: "",
      optimizationScope: "Both",
      description: "",
      icon: "",
    })
    // Removed: setIsCreateModalOpen(false)
  }

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Kiểm tra file type
      if (!file.type.startsWith("image/")) {
        alert("Vui lòng chọn file ảnh!")
        return
      }

      // Kiểm tra kích thước file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Kích thước file không được vượt quá 5MB!")
        return
      }

      // Đọc file và chuyển thành base64 để preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewProject({ ...newProject, icon: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveIcon = () => {
    setNewProject({ ...newProject, icon: "" })
  }

  const handleDeleteProject = (project: any, e: React.MouseEvent) => {
    e.stopPropagation()
    // Removed: setProjectToDelete(project), setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    // Removed: if (!projectToDelete) return

    // Xóa project khỏi PROJECTS_DATA
    const projectIndex = PROJECTS_DATA.findIndex((p) => p.id === projectToDelete.id) // Removed: projectToDelete
    if (projectIndex !== -1) {
      PROJECTS_DATA.splice(projectIndex, 1)
    }

    // Cập nhật state local để UI refresh ngay lập tức
    setProjects([...PROJECTS_DATA])

    // Đóng dialog và reset state
    // Removed: setIsDeleteDialogOpen(false), setProjectToDelete(null)

    // Hiển thị thông báo thành công (có thể thay bằng toast notification)
    alert("Dự án đã được xóa thành công.")
  }

  const handleCancelDelete = () => {
    // Removed: setIsDeleteDialogOpen(false), setProjectToDelete(null)
  }

  const handleOpenExtendDeadline = (project: any, e: React.MouseEvent) => {
    e.stopPropagation()
    setProjectToExtend(project)
    const initialData = {
      newDeadline: project.deadline,
      extendByDays: 0,
      reason: "",
      notifyAssignee: true,
    }
    setExtendDeadlineData(initialData)
    setInitialExtendData(initialData)
    setIsExtendDeadlineOpen(true)
  }

  const handleExtendByDaysChange = (days: number) => {
    if (!projectToExtend) return

    const currentDeadline = parseDeadline(projectToExtend.deadline)
    const newDate = new Date(currentDeadline)
    newDate.setDate(newDate.getDate() + days)

    const formatted = `${String(newDate.getDate()).padStart(2, "0")}/${String(newDate.getMonth() + 1).padStart(2, "0")}/${newDate.getFullYear()}`

    setExtendDeadlineData({
      ...extendDeadlineData,
      extendByDays: days,
      newDeadline: formatted,
    })
  }

  const handleNewDeadlineChange = (dateStr: string) => {
    if (!projectToExtend) return

    const selectedDate = new Date(dateStr)
    const currentDeadline = parseDeadline(projectToExtend.deadline)

    const diffTime = selectedDate.getTime() - currentDeadline.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    const formatted = `${String(selectedDate.getDate()).padStart(2, "0")}/${String(selectedDate.getMonth() + 1).padStart(2, "0")}/${selectedDate.getFullYear()}`

    setExtendDeadlineData({
      ...extendDeadlineData,
      newDeadline: formatted,
      extendByDays: Math.max(0, diffDays),
    })
  }

  const hasExtendDeadlineChanges = () => {
    return (
      extendDeadlineData.newDeadline !== initialExtendData.newDeadline ||
      extendDeadlineData.extendByDays !== initialExtendData.extendByDays ||
      extendDeadlineData.reason.trim() !== initialExtendData.reason.trim() ||
      extendDeadlineData.notifyAssignee !== initialExtendData.notifyAssignee
    )
  }

  const handleCancelExtendDeadline = () => {
    if (hasExtendDeadlineChanges()) {
      setIsCancelExtendOpen(true)
    } else {
      setIsExtendDeadlineOpen(false)
      setProjectToExtend(null)
    }
  }

  const handleConfirmCancelExtend = () => {
    setIsCancelExtendOpen(false)
    setIsExtendDeadlineOpen(false)
    setProjectToExtend(null)
    setExtendDeadlineData({
      newDeadline: "",
      extendByDays: 0,
      reason: "",
      notifyAssignee: true,
    })
  }

  const handleOpenConfirmExtend = () => {
    if (!extendDeadlineData.reason.trim()) {
      alert("Vui lòng nhập lý do gia hạn deadline!")
      return
    }
    setIsConfirmExtendOpen(true)
  }

  const handleConfirmExtendDeadline = () => {
    if (!projectToExtend || !extendDeadlineData.reason.trim()) {
      alert("Vui lòng nhập lý do gia hạn deadline!")
      return
    }

    // Cập nhật deadline trong PROJECTS_DATA
    const projectIndex = PROJECTS_DATA.findIndex((p) => p.id === projectToExtend.id)
    if (projectIndex !== -1) {
      PROJECTS_DATA[projectIndex].deadline = extendDeadlineData.newDeadline

      // Thêm log activity (có thể mở rộng thêm nếu cần)
      console.log("[v0] Extended deadline for project:", {
        projectId: projectToExtend.id,
        projectName: projectToExtend.appName,
        oldDeadline: projectToExtend.deadline,
        newDeadline: extendDeadlineData.newDeadline,
        extendByDays: extendDeadlineData.extendByDays,
        reason: extendDeadlineData.reason,
        notifyAssignee: extendDeadlineData.notifyAssignee,
      })

      // Gửi thông báo cho assignee nếu được chọn
      if (extendDeadlineData.notifyAssignee) {
        // TODO: Implement notification logic
        console.log("[v0] Notification sent to:", projectToExtend.lead.email)
      }
    }

    // Cập nhật state để refresh UI
    setProjects([...PROJECTS_DATA])

    setIsConfirmExtendOpen(false)
    setIsExtendDeadlineOpen(false)
    setProjectToExtend(null)
    setExtendDeadlineData({
      newDeadline: "",
      extendByDays: 0,
      reason: "",
      notifyAssignee: true,
    })

    alert("Deadline đã được gia hạn thành công!")
  }

  const handleViewProjectDetails = (project: any, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setDetailProject(project)
    setDetailTab("overview")
    setIsDetailModalOpen(true)
  }

  const getOptimizationScopeBadge = (scope: string) => {
    if (scope === "Metadata") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
          M
        </span>
      )
    } else if (scope === "StoreKit") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
          S
        </span>
      )
    } else if (scope === "Both") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
          M+S
        </span>
      )
    }
    return null
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {showBackToMetadata && (
        <Button
          variant="ghost"
          onClick={handleBackToMetadata}
          className="mb-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Metadata Management
        </Button>
      )}
      
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">ASO Project Management</h1>
        {/* Removed: <Button onClick={handleAddProject} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create New Project
        </Button> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
          </CardContent>
        </Card>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="cursor-help">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{counts.inProgress}</div>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="w-64">
              <div className="space-y-1 text-sm">
                <p className="font-semibold mb-2">In Progress ({counts.inProgress})</p>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>├─ Researching:</span>
                    <span className="font-medium">{projects.filter((p) => p.status === "Researching").length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>├─ In Preparation:</span>
                    <span className="font-medium">{projects.filter((p) => p.status === "In Preparation").length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>├─ Waiting for Assets:</span>
                    <span className="font-medium">
                      {projects.filter((p) => p.status === "Waiting for Assets").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>└─ Under Review:</span>
                    <span className="font-medium">{projects.filter((p) => p.status === "Under Review").length}</span>
                  </div>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.pendingApproval}</div>
          </CardContent>
        </Card>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="cursor-help">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Published</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{counts.published}</div>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="w-64">
              <div className="space-y-1 text-sm">
                <p className="font-semibold mb-2">Published ({counts.published})</p>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>├─ Published:</span>
                    <span className="font-medium">{projects.filter((p) => p.status === "Published").length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>└─ Optimizing:</span>
                    <span className="font-medium">{projects.filter((p) => p.status === "Optimizing").length}</span>
                  </div>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="sticky top-0 z-10 bg-background">
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by app name, keywords, or description..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">
                    <div className="flex items-center gap-2 font-medium">All Projects ({projects.length})</div>
                  </SelectItem>

                  {/* In Progress Group */}
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                    In Progress ({counts.inProgress})
                  </div>
                  <SelectItem value="Researching">
                    <div className="flex items-center gap-2 pl-4">
                      {getStatusIcon("Researching")}
                      Researching
                    </div>
                  </SelectItem>
                  <SelectItem value="In Preparation">
                    <div className="flex items-center gap-2 pl-4">
                      {getStatusIcon("In Preparation")}
                      In Preparation
                    </div>
                  </SelectItem>
                  <SelectItem value="Waiting for Assets">
                    <div className="flex items-center gap-2 pl-4">
                      {getStatusIcon("Waiting for Assets")}
                      Waiting Assets
                    </div>
                  </SelectItem>
                  <SelectItem value="Under Review">
                    <div className="flex items-center gap-2 pl-4">
                      {getStatusIcon("Under Review")}
                      Under Review
                    </div>
                  </SelectItem>

                  {/* Approval Group */}
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">
                    Approval ({counts.pendingApproval})
                  </div>
                  <SelectItem value="Pending Approval">
                    <div className="flex items-center gap-2 pl-4">
                      {getStatusIcon("Pending Approval")}
                      Pending Approval
                    </div>
                  </SelectItem>

                  {/* Published Group */}
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">
                    Published ({counts.published})
                  </div>
                  <SelectItem value="Published">
                    <div className="flex items-center gap-2 pl-4">
                      {getStatusIcon("Published")}
                      Published
                    </div>
                  </SelectItem>
                  <SelectItem value="Optimizing">
                    <div className="flex items-center gap-2 pl-4">
                      {getStatusIcon("Optimizing")}
                      Optimizing
                    </div>
                  </SelectItem>

                  {/* Other Group */}
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">Other</div>
                  <SelectItem value="Draft">
                    <div className="flex items-center gap-2 pl-4">
                      {getStatusIcon("Draft")}
                      Draft
                    </div>
                  </SelectItem>
                  <SelectItem value="Need Revision">
                    <div className="flex items-center gap-2 pl-4">
                      {getStatusIcon("Need Revision")}
                      Needs Fix
                    </div>
                  </SelectItem>
                  <SelectItem value="Rejected">
                    <div className="flex items-center gap-2 pl-4">
                      {getStatusIcon("Rejected")}
                      Rejected
                    </div>
                  </SelectItem>
                  <SelectItem value="Approved">
                    <div className="flex items-center gap-2 pl-4">
                      {getStatusIcon("Approved")}
                      Approved
                    </div>
                  </SelectItem>
                  <SelectItem value="On Hold">
                    <div className="flex items-center gap-2 pl-4">
                      {getStatusIcon("On Hold")}
                      On Hold
                    </div>
                  </SelectItem>
                  <SelectItem value="Archived">
                    <div className="flex items-center gap-2 pl-4">
                      {getStatusIcon("Archived")}
                      Archived
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(category)}
                        <span>{category === "All" ? "All Categories" : category}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !dateRange.from && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL d, y")} - {format(dateRange.to, "LLL d, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL d, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={dateRange}
                    onSelect={(selected) => {
                      if (selected) {
                        setDateRange(selected)
                      }
                    }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <Download className="w-4 h-4" /> Export
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>Projects List</CardTitle>
          <CardDescription>
            Showing {filteredProjects.length} of {projects.length} projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px] text-sm font-semibold"></TableHead>
                <TableHead className="text-sm font-semibold">App Name</TableHead>
                <TableHead className="text-sm font-semibold">Category</TableHead>
                <TableHead className="text-sm font-semibold">OS</TableHead>
                <TableHead className="text-sm font-semibold">Status</TableHead>
                <TableHead className="text-sm font-semibold">Progress</TableHead>
                <TableHead className="text-sm font-semibold">Lead</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50 text-sm font-semibold"
                  onClick={() => setSortDeadlineAsc(!sortDeadlineAsc)}
                >
                  <div className="flex items-center gap-2">
                    Deadline
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </TableHead>
                <TableHead className="text-right text-sm font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => {
                const deadlineDisplay = getDeadlineDisplay(project.deadline, project.status)
                const createdDate = new Date(2024, 10, 1) // Mock created date
                const deadlineDate = parseDeadline(project.deadline)
                const totalDuration = differenceInDays(deadlineDate, createdDate)

                return (
                  <TableRow
                    key={project.id}
                    className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                    onClick={() => handleProjectClick(project)} // Added click handler for the whole row
                  >
                    <TableCell>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={project.icon || "/placeholder.svg"} alt={project.appName} />
                        <AvatarFallback>{project.appName.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell
                      className="font-medium cursor-pointer hover:text-primary hover:underline"
                      onClick={(e) => handleAppNameClick(project.id, e)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{project.appName}</span>
                        {getOptimizationScopeBadge((project as any).optimizationScope || "Both")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(project.category)}
                        <span className="text-sm">{project.category}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {project.os === "iOS" && <Apple className="w-4 h-4" />}
                        {project.os === "Android" && <Android2 className="w-4 h-4" />}
                        <span className="text-sm">{project.os}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "border inline-flex items-center gap-1.5 px-3 py-1 rounded-2xl text-[13px] font-medium whitespace-nowrap min-w-[130px] max-w-[150px]",
                          getStatusColor(project.status),
                        )}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                      >
                        {getStatusIcon(project.status)}
                        <span className="overflow-hidden text-ellipsis">
                          {project.status === "Waiting for Assets"
                            ? "Waiting Assets"
                            : project.status === "Need Revision"
                              ? "Needs Fix"
                              : project.status}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Progress value={project.progress} className="w-24" />
                        <span className="text-sm font-medium text-gray-700 min-w-[45px] text-right">
                          {project.progress}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={project.lead.avatar || "/placeholder.svg"} alt={project.lead.name} />
                          <AvatarFallback>{project.lead.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{project.lead.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Popover>
                        <PopoverTrigger asChild>
                          <div
                            className={cn(
                              "rounded-lg px-3 py-2.5 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all",
                              deadlineDisplay.bgColor,
                            )}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div
                              className={cn(
                                "flex items-center gap-2 text-[15px] font-bold mb-1",
                                deadlineDisplay.textColor,
                              )}
                            >
                              <span>{project.deadline}</span>
                            </div>
                            {!deadlineDisplay.hideStatusRow && (
                              <div
                                className={cn(
                                  "text-xs pl-1 opacity-75 flex items-center gap-1",
                                  deadlineDisplay.textColor,
                                )}
                              >
                                <span>{deadlineDisplay.label}</span>
                                {deadlineDisplay.icon && <span className="text-[10px]">{deadlineDisplay.icon}</span>}
                              </div>
                            )}
                            {deadlineDisplay.hideStatusRow && deadlineDisplay.type === "terminal" && (
                              <div
                                className={cn(
                                  "text-xs pl-1 opacity-75 flex items-center gap-1",
                                  deadlineDisplay.textColor,
                                )}
                              >
                                <span className="text-[10px]">{deadlineDisplay.icon}</span>
                                <span>{deadlineDisplay.label}</span>
                              </div>
                            )}
                            {deadlineDisplay.hideStatusRow && deadlineDisplay.type === "blocked" && (
                              <div
                                className={cn(
                                  "text-xs pl-1 opacity-75 flex items-center gap-1",
                                  deadlineDisplay.textColor,
                                )}
                              >
                                <span>{deadlineDisplay.label}</span>
                                <span className="text-[10px]">{deadlineDisplay.icon}</span>
                              </div>
                            )}
                          </div>
                        </PopoverTrigger>
                        <PopoverContent side="left" className="w-64 p-0">
                          <Card className="border-0 shadow-none">
                            <CardContent className="p-3 space-y-3">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Created:</span>
                                <span className="font-medium">01/11/2024</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Total Duration:</span>
                                <span className="font-medium">{totalDuration} days</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Remaining:</span>
                                <span className={cn("font-medium", deadlineDisplay.textColor)}>
                                  {deadlineDisplay.daysLeft >= 0
                                    ? `${deadlineDisplay.daysLeft} ${deadlineDisplay.daysLeft === 1 ? "day" : "days"}`
                                    : `${Math.abs(deadlineDisplay.daysLeft)} ${Math.abs(deadlineDisplay.daysLeft) === 1 ? "day" : "days"} overdue`}
                                </span>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full mt-2 bg-transparent"
                                onClick={(e) => handleOpenExtendDeadline(project, e)}
                              >
                                Extend Deadline
                              </Button>
                            </CardContent>
                          </Card>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => handleViewProjectDetails(project, e)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {(project.status === "Published" || project.status === "Optimizing") && (
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                router.push(`/applications/optimization-tracking?project_id=${project.id}`)
                              }}
                            >
                              <TrendingUp className="mr-2 h-4 w-4" />
                              View Performance
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={(e) => handleViewWorkflow(project, e)}>
                            <GitBranch className="mr-2 h-4 w-4" />
                            View Workflow
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              router.push(`/applications/aso-dashboard/${project.id}?mode=edit`)
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500 hover:text-red-500 focus:text-red-500"
                            onClick={(e) => handleDeleteProject(project, e)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          {filteredProjects.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">No projects found matching your filters.</div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showWorkflowDialog} onOpenChange={setShowWorkflowDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Workflow Visualization - {selectedProjectForWorkflow?.appName}</DialogTitle>
            <DialogDescription>Visual representation of the ASO workflow for this project</DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <div className="space-y-6">
              {/* Workflow Timeline */}
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

                {/* Draft Stage */}
                <div className="relative pl-12 pb-8">
                  <div className="absolute left-0 w-8 h-8 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-gray-700" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Initial Setup</h3>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline" className="bg-gray-100 text-gray-700">
                        Draft
                      </Badge>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        Researching
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Project initialization and market research phase</p>
                  </div>
                </div>

                {/* Preparation Stage */}
                <div className="relative pl-12 pb-8">
                  <div className="absolute left-0 w-8 h-8 rounded-full bg-blue-100 border-2 border-blue-300 flex items-center justify-center">
                    <Workflow className="w-4 h-4 text-blue-800" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Preparation</h3>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">
                        In Preparation
                      </Badge>
                      <Badge variant="outline" className="bg-blue-200 text-blue-900">
                        Waiting for Assets
                      </Badge>
                      <Badge variant="outline" className="bg-blue-100 text-blue-700">
                        Under Review
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Metadata preparation and asset collection</p>
                  </div>
                </div>

                {/* Approval Stage */}
                <div className="relative pl-12 pb-8">
                  <div className="absolute left-0 w-8 h-8 rounded-full bg-yellow-100 border-2 border-yellow-300 flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-yellow-800" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Approval Process</h3>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                        Pending Approval
                      </Badge>
                      <Badge variant="outline" className="bg-orange-100 text-orange-800">
                        Need Revision
                      </Badge>
                      <Badge variant="outline" className="bg-red-100 text-red-800">
                        Rejected
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Lead Marketing review and approval</p>
                  </div>
                </div>

                {/* Live Stage */}
                <div className="relative pl-12 pb-8">
                  <div className="absolute left-0 w-8 h-8 rounded-full bg-green-100 border-2 border-green-300 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-green-800" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Live & Optimization</h3>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        Approved
                      </Badge>
                      <Badge variant="outline" className="bg-green-200 text-green-900">
                        Published
                      </Badge>
                      <Badge variant="outline" className="bg-purple-100 text-purple-800">
                        Optimizing
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Store publishing and continuous optimization</p>
                  </div>
                </div>

                {/* Inactive Stage */}
                <div className="relative pl-12">
                  <div className="absolute left-0 w-8 h-8 rounded-full bg-gray-200 border-2 border-gray-400 flex items-center justify-center">
                    <PauseCircle className="w-4 h-4 text-gray-700" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Inactive</h3>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline" className="bg-gray-200 text-gray-700">
                        On Hold
                      </Badge>
                      <Badge variant="outline" className="bg-gray-300 text-gray-800">
                        Archived
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Paused or completed projects</p>
                  </div>
                </div>
              </div>

              {/* Current Project Status */}
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-lg">Current Status: {selectedProjectForWorkflow?.status}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm text-muted-foreground">{selectedProjectForWorkflow?.progress}%</span>
                    </div>
                    <Progress value={selectedProjectForWorkflow?.progress} className="h-2" />
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div>
                        <p className="text-sm font-medium">Deadline</p>
                        <p className="text-sm text-muted-foreground">{selectedProjectForWorkflow?.deadline}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Lead</p>
                        <p className="text-sm text-muted-foreground">{selectedProjectForWorkflow?.lead.name}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWorkflowDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentProject?.appName}</DialogTitle>
            <DialogDescription>{currentProject?.description}</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Project Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Workflow className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Status:</span>
                  <Badge variant="outline" className={cn("border-2", getStatusColor(currentProject?.status))}>
                    {currentProject?.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Progress:</span>
                  <Progress value={currentProject?.progress} className="w-[60%]" />
                  <span>{currentProject?.progress}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Team Size:</span>
                  <span>{currentProject?.team.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Deadline:</span>
                  <span>{currentProject?.deadline}</span>
                  {currentProject?.isUrgent && <AlertCircle className="w-4 h-4 text-red-500" />}
                </div>
                <div className="flex items-center gap-2">
                  {getCategoryIcon(currentProject?.category)}
                  <span className="font-medium">Category:</span>
                  <span className="flex items-center gap-1">
                    {currentProject?.category === "Game" && <span>🎮</span>}
                    {currentProject?.category === "App" && <span>📱</span>}
                    {currentProject?.category}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">OS:</span>
                  <span>{currentProject?.os}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Market:</span>
                  <span>{currentProject?.market}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Region:</span>
                  <span>{currentProject?.region}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Lead Developer</h3>
              <div className="flex items-center gap-3">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={currentProject?.lead.avatar || "/placeholder.svg"}
                    alt={currentProject?.lead.name}
                  />
                  <AvatarFallback>{currentProject?.lead.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{currentProject?.lead.name}</p>
                  <p className="text-sm text-muted-foreground">{currentProject?.lead.email}</p>
                </div>
              </div>

              <h3 className="font-semibold mt-6 mb-2">Team Members</h3>
              <div className="space-y-3">
                {currentProject?.team.map((member: any, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Close
            </Button>
            <Button
              onClick={() => {
                handleCloseDialog()
                router.push(`/applications/aso-dashboard/${currentProject?.id}`)
              }}
            >
              View Details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Removed: Dialog for delete confirmation */}
      {/* <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              Xác nhận xóa dự án
            </DialogTitle>
            <div className="text-sm text-muted-foreground pt-4">
              Bạn có chắc chắn muốn xóa dự án{" "}
              <span className="font-semibold text-foreground">{projectToDelete?.appName}</span> này không?
              <br />
              <br />
              Hành động này sẽ:
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>Xóa vĩnh viễn dự án khỏi hệ thống</li>
                <li>Gỡ bỏ toàn bộ dữ liệu liên quan (Metadata, StoreKit, Asset)</li>
                <li>Không thể hoàn tác sau khi xóa</li>
              </ul>
            </div>
          </DialogHeader>
          <DialogFooter className="flex items-center justify-end gap-3 pt-4">
            <Button variant="outline" onClick={handleCancelDelete}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              <Trash2 className="w-4 h-4 mr-2" />
              Xác nhận xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}

      {/* Removed: Create New Project Dialog */}
      {/* <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>Fill in the details to create a new ASO project</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                App Name <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Enter app name"
                value={newProject.appName}
                onChange={(e) => setNewProject({ ...newProject, appName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">App Icon</label>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <Avatar className="h-20 w-20 rounded-lg border-2 border-dashed border-gray-300">
                    <AvatarImage src={newProject.icon || "/placeholder.svg"} alt="App icon" />
                    <AvatarFallback className="rounded-lg bg-gray-100">
                      <Upload className="h-8 w-8 text-gray-400" />
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("icon-upload")?.click()}
                      className="bg-transparent"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Chọn ảnh
                    </Button>
                    {newProject.icon && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveIcon}
                        className="bg-transparent text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Xóa
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Định dạng: PNG, JPG, JPEG. Kích thước tối đa: 5MB. Khuyến nghị: 1024x1024px
                  </p>
                  <input
                    id="icon-upload"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleIconUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Operating System <span className="text-red-500">*</span>
              </label>
              <Select value={newProject.os} onValueChange={(value) => setNewProject({ ...newProject, os: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select OS" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="iOS">iOS</SelectItem>
                  <SelectItem value="Android">Android</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Market <span className="text-red-500">*</span>
              </label>
              <Select
                value={newProject.market}
                onValueChange={(value) => setNewProject({ ...newProject, market: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select market" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">🇺🇸 United States</SelectItem>
                  <SelectItem value="UK">🇬🇧 United Kingdom</SelectItem>
                  <SelectItem value="VN">🇻🇳 Vietnam</SelectItem>
                  <SelectItem value="JP">🇯🇵 Japan</SelectItem>
                  <SelectItem value="KR">🇰🇷 South Korea</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Region</label>
              <Input
                placeholder="Enter region (e.g., North America, Asia)"
                value={newProject.region}
                onChange={(e) => setNewProject({ ...newProject, region: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={newProject.category}
                onValueChange={(value) => setNewProject({ ...newProject, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Game">🎮 Game</SelectItem>
                  <SelectItem value="App">📱 App</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Project Lead <span className="text-red-500">*</span>
              </label>
              <Select value={newProject.lead} onValueChange={(value) => setNewProject({ ...newProject, lead: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project lead" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sarah Chen">Sarah Chen</SelectItem>
                  <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                  <SelectItem value="Emily Davis">Emily Davis</SelectItem>
                  <SelectItem value="Alex Kim">Alex Kim</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Deadline <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={newProject.deadline ? newProject.deadline.split("/").reverse().join("-") : ""}
                onChange={(e) => {
                  if (!e.target.value) {
                    setNewProject({ ...newProject, deadline: "" })
                    return
                  }
                  const date = new Date(e.target.value)
                  const formatted = `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`
                  setNewProject({ ...newProject, deadline: formatted })
                }}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Workflow Template <span className="text-red-500">*</span>
              </label>
              <Select
                value={newProject.workflowTemplate}
                onValueChange={(value) => setNewProject({ ...newProject, workflowTemplate: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select workflow template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standard ASO">Standard ASO</SelectItem>
                  <SelectItem value="Quick Launch">Quick Launch</SelectItem>
                  <SelectItem value="Full Optimization">Full Optimization</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Optimization Scope</label>
              <Select
                value={newProject.optimizationScope}
                onValueChange={(value) => setNewProject({ ...newProject, optimizationScope: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select optimization scope" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Metadata">Metadata Only</SelectItem>
                  <SelectItem value="StoreKit">StoreKit Only</SelectItem>
                  <SelectItem value="Both">Both Metadata & StoreKit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                placeholder="Brief description of the project"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter className="flex items-center justify-end gap-3 pt-4">
            <Button variant="outline" onClick={handleCloseCreateModal}>
              Cancel
            </Button>
            <Button onClick={handleCreateProject}>Create Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}

      {/* <Dialog open={isConfirmCreateOpen} onOpenChange={setIsConfirmCreateOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-blue-600">
              <CheckCircle2 className="w-5 h-5" />
              Xác nhận tạo dự án mới
            </DialogTitle>
            <div className="text-sm text-muted-foreground pt-4">
              Bạn có chắc chắn muốn tạo dự án mới với thông tin sau không?
              <br />
              <br />
              <div className="space-y-2 bg-muted/50 p-3 rounded-md">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">App Name:</span>
                  <span className="font-medium">{newProject.appName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">OS:</span>
                  <span className="font-medium">{newProject.os}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Market:</span>
                  <span className="font-medium">{newProject.market}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-medium">{newProject.category || "App"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Project Lead:</span>
                  <span className="font-medium">{newProject.lead}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Deadline:</span>
                  <span className="font-medium">{newProject.deadline}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Workflow:</span>
                  <span className="font-medium">{newProject.workflowTemplate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Optimization:</span>
                  <span className="font-medium">{newProject.optimizationScope}</span>
                </div>
              </div>
              <br />
              Hệ thống sẽ tự động tạo các order tương ứng cho{" "}
              {newProject.optimizationScope === "Both" ? "Metadata và StoreKit" : newProject.optimizationScope}.
            </div>
          </DialogHeader>
          <DialogFooter className="flex items-center justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsConfirmCreateOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleConfirmCreateProject} className="bg-blue-600 hover:bg-blue-700">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Xác nhận tạo dự án
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}

      <Dialog open={isExtendDeadlineOpen} onOpenChange={setIsExtendDeadlineOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Extend Deadline</DialogTitle>
            <DialogDescription>
              Gia hạn deadline cho dự án:{" "}
              <span className="font-semibold text-foreground">{projectToExtend?.appName}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Current Deadline (readonly) */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Deadline</label>
              <Input value={projectToExtend?.deadline || ""} readOnly disabled className="bg-muted" />
            </div>

            {/* Extend by (days) */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Extend by (days)</label>
              <Input
                type="number"
                min="0"
                value={extendDeadlineData.extendByDays}
                onChange={(e) => handleExtendByDaysChange(Number.parseInt(e.target.value) || 0)}
                placeholder="Enter number of days"
              />
            </div>

            {/* New Deadline (date picker) */}
            <div className="space-y-2">
              <label className="text-sm font-medium">New Deadline</label>
              <Input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={
                  extendDeadlineData.newDeadline ? extendDeadlineData.newDeadline.split("/").reverse().join("-") : ""
                }
                onChange={(e) => handleNewDeadlineChange(e.target.value)}
              />
              {extendDeadlineData.newDeadline && (
                <p className="text-xs text-muted-foreground">Formatted: {extendDeadlineData.newDeadline}</p>
              )}
            </div>

            {/* Reason (textarea) */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Nhập lý do gia hạn deadline..."
                value={extendDeadlineData.reason}
                onChange={(e) => setExtendDeadlineData({ ...extendDeadlineData, reason: e.target.value })}
              />
            </div>

            {/* Notify Assignee (checkbox) */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="notifyAssignee"
                checked={extendDeadlineData.notifyAssignee}
                onChange={(e) => setExtendDeadlineData({ ...extendDeadlineData, notifyAssignee: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="notifyAssignee" className="text-sm font-medium cursor-pointer">
                Notify assignee ({projectToExtend?.lead.name})
              </label>
            </div>
          </div>

          <DialogFooter className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={handleCancelExtendDeadline}>
              Cancel
            </Button>
            <Button onClick={handleOpenConfirmExtend} disabled={!extendDeadlineData.reason.trim()}>
              Confirm & Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmExtendOpen} onOpenChange={setIsConfirmExtendOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              Xác nhận gia hạn deadline
            </DialogTitle>
            <div className="text-sm text-muted-foreground pt-4">
              Bạn có chắc chắn muốn gia hạn deadline cho dự án{" "}
              <span className="font-semibold text-foreground">{projectToExtend?.appName}</span> không?
              <br />
              <br />
              <div className="space-y-2 bg-muted/50 p-3 rounded-md">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Deadline hiện tại:</span>
                  <span className="font-medium">{projectToExtend?.deadline}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Deadline mới:</span>
                  <span className="font-medium text-blue-600">{extendDeadlineData.newDeadline}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Gia hạn:</span>
                  <span className="font-medium">+{extendDeadlineData.extendByDays} ngày</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Lý do:</span>
                  <span className="font-medium text-right max-w-[250px] truncate">{extendDeadlineData.reason}</span>
                </div>
                {extendDeadlineData.notifyAssignee && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Thông báo:</span>
                    <span className="font-medium">{projectToExtend?.lead.name}</span>
                  </div>
                )}
              </div>
            </div>
          </DialogHeader>
          <DialogFooter className="flex items-center justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsConfirmExtendOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleConfirmExtendDeadline} className="bg-blue-600 hover:bg-blue-700">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Xác nhận gia hạn
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCancelExtendOpen} onOpenChange={setIsCancelExtendOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-orange-600">
              <AlertCircle className="w-5 h-5" />
              Xác nhận hủy thao tác
            </DialogTitle>
            <div className="text-sm text-muted-foreground pt-4">
              Bạn đã thay đổi thông tin gia hạn deadline. Nếu hủy thao tác, tất cả thông tin chỉnh sửa sẽ không được
              lưu.
              <br />
              <br />
              Bạn có chắc chắn muốn hủy không?
            </div>
          </DialogHeader>
          <DialogFooter className="flex items-center justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsCancelExtendOpen(false)}>
              Tiếp tục chỉnh sửa
            </Button>
            <Button variant="destructive" onClick={handleConfirmCancelExtend}>
              Xác nhận hủy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <img src={detailProject?.icon || "/placeholder.svg"} alt="icon" className="h-10 w-10 rounded-lg" />
              <div>
                <div className="flex items-center gap-2">
                  {detailProject?.appName}
                  {getOptimizationScopeBadge((detailProject as any)?.optimizationScope || "Both")}
                </div>
                <p className="text-sm text-muted-foreground font-normal">Project ID: {detailProject?.id}</p>
              </div>
            </DialogTitle>
          </DialogHeader>

          <Tabs value={detailTab} onValueChange={setDetailTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="metadata">Metadata</TabsTrigger>
              <TabsTrigger value="storekit">StoreKit</TabsTrigger>
              <TabsTrigger value="assets">Assets</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {detailProject && (
                <div className="space-y-4">
                  {/* Overall Deadline */}
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium mb-2">Overall Deadline</div>
                    <div className="text-lg font-bold">{detailProject.deadline}</div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="metadata" className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Metadata versions linked to this project</p>
                <Button
                  size="sm"
                  onClick={() => {
                    router.push(`/applications/metadata-tracking?project_id=${detailProject?.id}`)
                  }}
                >
                  View in Metadata Management
                </Button>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  No metadata versions found. Create one in Metadata Management.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="storekit" className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">StoreKit assets linked to this project</p>
                <Button
                  size="sm"
                  onClick={() => {
                    router.push(`/applications/aso/storekit-management?project_id=${detailProject?.id}`)
                  }}
                >
                  View in StoreKit Management
                </Button>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  No StoreKit assets found. Create one in StoreKit Management.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="assets" className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Asset production progress</p>
                <Button
                  size="sm"
                  onClick={() => {
                    router.push(`/projects/${detailProject?.id}/assets`)
                  }}
                >
                  View Assets
                </Button>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  Asset production tracking will appear here once assets are created.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              {detailProject?.status === "Published" || detailProject?.status === "Optimizing" ? (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Performance metrics from Optimization & Tracking</p>
                    <Button
                      size="sm"
                      onClick={() => {
                        router.push(`/applications/optimization-tracking?project_id=${detailProject?.id}`)
                      }}
                    >
                      View Full Performance
                    </Button>
                  </div>
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">
                      Performance data will be available once the project is published and tracking begins.
                    </p>
                  </div>
                </>
              ) : (
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    Performance metrics are only available for published projects.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
