"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import {
  ChevronRight,
  ArrowLeft,
  Pencil,
  Trash2,
  Plus,
  Upload,
  Download,
  Share2,
  Eye,
  FileText,
  Clock,
  Users,
  Calendar,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  Send,
  Loader2,
  CheckCircle2,
  XCircle,
  X,
  Play,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"

import { getProjectById, updateProjectById } from "../projects-data"

// Mock projects data - trong thực tế sẽ fetch từ API hoặc context
// const getProjectById = (projectId: string) => {
//   // Mock projects data - trong thực tế sẽ fetch từ API hoặc context
//   const projects = [
//     {
//       id: "1",
//       appName: "Meditation Pro",
//       os: "iOS",
//       market: "US",
//       region: "North America",
//       category: "Health & Fitness",
//       progress: 75,
//       lead: { name: "Nguyen Van A", avatar: "/male-avatar.png", email: "nguyenvana@example.com" },
//       status: "In Preparation",
//       deadline: "2024-12-15",
//       description: "A comprehensive meditation app focused on mindfulness and stress reduction.",
//       keywords: ["meditation", "mindfulness", "relaxation", "stress relief", "sleep", "calm", "yoga", "breathing"],
//     },
//     {
//       id: "2",
//       appName: "Sleep Sounds",
//       os: "Android",
//       market: "UK",
//       region: "Europe",
//       category: "Health & Fitness",
//       progress: 45,
//       lead: { name: "Tran Thi B", avatar: "/female-avatar.png", email: "tranthib@example.com" },
//       status: "Draft",
//       deadline: "2024-12-20",
//       description: "Relaxing sleep sounds and white noise for better sleep quality.",
//       keywords: ["sleep", "sounds", "white noise", "relaxation", "bedtime", "calm", "peaceful", "rest"],
//     },
//     // Add more projects as needed
//   ]

//   return projects.find((p) => p.id === projectId)
// }

export default function ProjectDetailPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const projectId = params.projectId as string
  const foundProject = getProjectById(projectId)

  const [project, setProject] = useState(() => {
    if (!foundProject) {
      return {
        id: projectId,
        appName: "Project Not Found",
        os: "iOS",
        market: "US",
        region: "North America",
        category: "Unknown",
        progress: 0,
        lead: { name: "Unknown", avatar: "", email: "" },
        status: "Draft",
        deadline: new Date().toISOString().split("T")[0],
        createdBy: "Admin User",
        createdDate: "2024-11-01",
        lastUpdatedBy: "Unknown",
        lastUpdatedDate: "2024-12-05",
        description: "No description available",
        keywords: [],
        metadataVersion: "v1.0",
        metadataTitle: "No title",
        metadataSubtitle: "No subtitle",
        storekits: [],
        orders: [],
        activities: [],
        teamMembers: [],
        approvalStatus: {
          stage: "Not started",
          status: "Pending",
          lastFeedback: "",
          timestamp: "",
        },
        assets: [],
      }
    }

    return {
      ...foundProject,
      createdBy: "Admin User",
      createdDate: "2024-11-01",
      lastUpdatedBy: foundProject.lead.name,
      lastUpdatedDate: "2024-12-05",
      metadataVersion: "v2.3",
      metadataTitle: `${foundProject.appName} - Mindfulness & Sleep`,
      metadataSubtitle: `${foundProject.description.slice(0, 50)}...`,
      storekits: [
        {
          id: "sk1",
          platform: foundProject.os,
          market: foundProject.market,
          language: "English",
          status: "Active",
          lastUpdated: "2024-12-03",
        },
      ],
      orders: [
        {
          id: "ORD001",
          type: "Design Request",
          recipient: "Design Team",
          status: "In Progress",
          deadline: foundProject.deadline,
          description: "Create app icon variations",
          priority: "Medium", // Added priority
        },
      ],
      activities: [
        {
          id: "act1",
          user: { name: foundProject.lead.name, avatar: foundProject.lead.avatar },
          action: "Updated metadata version to v2.3",
          timestamp: "2 hours ago",
          type: "update",
        },
        {
          id: "act2",
          user: { name: "Design Team", avatar: "" },
          action: "Uploaded new app screenshots",
          timestamp: "5 hours ago",
          type: "upload",
        },
      ],
      teamMembers: [
        { name: foundProject.lead.name, avatar: foundProject.lead.avatar, role: "Lead" },
        { name: "Tran Thi B", avatar: "/female-avatar.png", role: "ASO" },
        { name: "Le Van C", avatar: "/male-avatar.png", role: "Designer" },
      ],
      approvalStatus: {
        stage: "Marketing Review",
        status: "Pending",
        lastFeedback: "Need to update app screenshots to match new...",
        timestamp: "1 day ago",
      },
      assets: [
        { id: "1", name: "icon-1.png", type: "image", url: "/placeholder.svg?height=100&width=100" },
        { id: "2", name: "screenshot-1.png", type: "image", url: "/placeholder.svg?height=100&width=100" },
      ],
    }
  })

  useEffect(() => {
    if (!foundProject) {
      toast({
        title: "Không tìm thấy dự án",
        description: "Dự án này không tồn tại hoặc đã bị xóa.",
        variant: "destructive",
        duration: 3000,
      })
      setTimeout(() => {
        router.push("/applications/aso-dashboard")
      }, 1500)
    }
  }, [foundProject, router, toast])

  useEffect(() => {
    const mode = searchParams.get("mode")
    if (mode === "edit") {
      setIsEditProjectOpen(true)
    }
  }, [searchParams])

  const [showAllKeywords, setShowAllKeywords] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [activityFilter, setActivityFilter] = useState("all")

  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [showSaveConfirm, setShowSaveConfirm] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false)
  const [isEditOrderOpen, setIsEditOrderOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false)
  const [viewingOrder, setViewingOrder] = useState<any>(null)
  const [newComment, setNewComment] = useState("")

  const [isEditMode, setIsEditMode] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [originalOrderData, setOriginalOrderData] = useState<any>(null)
  const [isConfirmSaveOpen, setIsConfirmSaveOpen] = useState(false)

  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [isRequestApprovalOpen, setIsRequestApprovalOpen] = useState(false)
  const [isApprovalHistoryOpen, setIsApprovalHistoryOpen] = useState(false)
  const [isAssetPreviewOpen, setIsAssetPreviewOpen] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<any>(null)
  const [isEditingField, setIsEditingField] = useState<string | null>(null)
  const [editedValue, setEditedValue] = useState("")
  const [selectedMember, setSelectedMember] = useState<any>(null)
  const [isExporting, setIsExporting] = useState(false)

  const [selectedStorekit, setSelectedStorekit] = useState<any>(null)
  const [isStorekitPopupOpen, setIsStorekitPopupOpen] = useState(false)

  const [uploadingFiles, setUploadingFiles] = useState<
    Array<{
      id: string
      name: string
      size: number
      progress: number
      status: "uploading" | "success" | "error"
      error?: string
      file?: File // Added file to the state for easier access
    }>
  >([])

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const editFormInitialState = {
    appName: project.appName,
    os: project.os,
    market: project.market,
    region: project.region,
    lead: project.lead.name,
    deadline: project.deadline,
    description: project.description,
    teams: { aso: true, design: true, marketing: true, dev: false },
    workflowTemplate: "Standard ASO Workflow",
  }
  const [editForm, setEditForm] = useState(editFormInitialState)

  const [orderForm, setOrderForm] = useState({
    type: "",
    recipient: "",
    priority: "",
    deadline: "",
    description: "",
  })

  const [memberForm, setMemberForm] = useState({
    userId: "",
    role: "",
  })

  const [approvalForm, setApprovalForm] = useState({
    message: "",
  })

  const getOrderActivities = (orderId: string) => [
    {
      id: "act1",
      user: { name: "Design Team", avatar: "" },
      action: "started working on the order",
      timestamp: "2 hours ago",
      type: "status_change",
    },
    {
      id: "act2",
      user: { name: "Nguyen Van A", avatar: "/male-avatar.png" },
      action: "updated the deadline",
      timestamp: "5 hours ago",
      type: "update",
    },
    {
      id: "act3",
      user: { name: "Design Team", avatar: "" },
      action: "accepted the order",
      timestamp: "1 day ago",
      type: "status_change",
    },
  ]

  const getOrderComments = (orderId: string) => [
    {
      id: "comment1",
      user: { name: "Nguyen Van A", avatar: "/male-avatar.png" },
      message: "Please focus on modern, minimalist design for the app icon.",
      timestamp: "3 hours ago",
    },
    {
      id: "comment2",
      user: { name: "Design Team", avatar: "" },
      message: "Understood! I'll prepare 3 variations for your review.",
      timestamp: "2 hours ago",
    },
  ]

  // Tính số ngày còn lại
  const calculateDaysLeft = (deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysLeft = calculateDaysLeft(project.deadline)

  const getStatusColor = (status: string) => {
    switch (status) {
      // Nhóm 1: Initial Setup (màu xám/xanh nhạt)
      case "Draft":
        return "bg-gray-100 text-gray-800 border-gray-300"
      case "Researching":
        return "bg-blue-50 text-blue-600 border-blue-200"

      // Nhóm 2: Preparation (màu xanh dương)
      case "In Preparation":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "Waiting for Assets":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "Under Review":
        return "bg-blue-100 text-blue-800 border-blue-300"

      // Nhóm 3: Approval (màu vàng/cam)
      case "Pending Approval":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "Need Revision":
        return "bg-orange-100 text-orange-800 border-orange-300"
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-300"

      // Nhóm 4: Live & Optimization (màu xanh lá/tím)
      case "Approved":
        return "bg-green-100 text-green-800 border-green-300"
      case "Published":
        return "bg-green-100 text-green-800 border-green-300"
      case "Optimizing":
        return "bg-purple-100 text-purple-800 border-purple-300"

      // Nhóm 5: Inactive (màu xám đậm)
      case "On Hold":
        return "bg-gray-200 text-gray-900 border-gray-400"
      case "Archived":
        return "bg-gray-300 text-gray-900 border-gray-500"

      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getDeadlineColor = () => {
    if (daysLeft < 0) return "text-red-600"
    if (daysLeft < 7) return "text-orange-600"
    return "text-green-600"
  }

  const displayedKeywords = showAllKeywords ? project.keywords : project.keywords.slice(0, 8)

  const filteredActivities =
    activityFilter === "all" ? project.activities : project.activities.filter((act) => act.type === activityFilter)

  const handleEditProject = () => {
    router.push(`/applications/aso-dashboard/${params.projectId}?mode=edit`)
    setEditForm({
      appName: project.appName,
      os: project.os,
      market: project.market,
      region: project.region,
      lead: project.lead.name,
      deadline: project.deadline,
      description: project.description,
      teams: { aso: true, design: true, marketing: true, dev: false },
      workflowTemplate: "Standard ASO Workflow",
    })
    setValidationErrors({})
    setIsEditProjectOpen(true)
  }

  const handleCancelEdit = () => {
    setShowCancelConfirm(true)
  }

  const handleConfirmCancel = () => {
    setShowCancelConfirm(false)
    setIsEditProjectOpen(false)
    const url = new URL(window.location.href)
    url.searchParams.delete("mode")
    window.history.replaceState({}, "", url.pathname)
    // Reset form to initial state when closing without saving
    setEditForm(editFormInitialState)
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!editForm.appName || editForm.appName.trim() === "") {
      errors.appName = "Tên ứng dụng là bắt buộc"
    }

    if (!editForm.market || editForm.market.trim() === "") {
      errors.market = "Market là bắt buộc"
    }

    if (!editForm.lead || editForm.lead.trim() === "") {
      errors.lead = "Project Lead là bắt buộc"
    }

    if (!editForm.deadline || editForm.deadline.trim() === "") {
      errors.deadline = "Deadline là bắt buộc"
    }

    if (!editForm.workflowTemplate || editForm.workflowTemplate.trim() === "") {
      errors.workflowTemplate = "Workflow Template là bắt buộc"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSaveProject = () => {
    if (!validateForm()) {
      toast({
        title: "Lỗi validation",
        description: "Vui lòng điền đầy đủ các trường bắt buộc.",
        variant: "destructive",
        duration: 3000,
      })
      return
    }
    setShowSaveConfirm(true)
  }

  const handleConfirmSave = () => {
    const previousMarket = project.market
    const previousOS = project.os

    // Kiểm tra xem có thay đổi về Market hoặc OS không
    const hasMarketOrOSChange = previousMarket !== editForm.market || previousOS !== editForm.os

    const updatedProject = {
      ...project,
      appName: editForm.appName,
      os: editForm.os,
      market: editForm.market,
      region: editForm.region,
      deadline: editForm.deadline,
      description: editForm.description,
      lead: {
        ...project.lead,
        name: editForm.lead,
      },
      lastUpdatedBy: editForm.lead,
      lastUpdatedDate: new Date().toISOString().split("T")[0],
    }

    setProject(updatedProject)

    updateProjectById(projectId, {
      appName: editForm.appName,
      os: editForm.os,
      market: editForm.market,
      region: editForm.region,
      deadline: editForm.deadline,
      description: editForm.description,
      lead: {
        ...project.lead,
        name: editForm.lead,
      },
    })

    setShowSaveConfirm(false)
    setIsEditProjectOpen(false)

    const url = new URL(window.location.href)
    url.searchParams.delete("mode")
    window.history.replaceState({}, "", url.pathname)

    toast({
      title: "Dự án đã được cập nhật thành công.",
      description: hasMarketOrOSChange
        ? "Dữ liệu liên quan trong Metadata, StoreKit và Tracking đã được đồng bộ."
        : "Thông tin dự án đã được lưu.",
      duration: 3000,
    })

    console.log("[v0] Project updated and synced:", {
      projectId,
      previousMarket,
      previousOS,
      newMarket: editForm.market,
      newOS: editForm.os,
      hasMarketOrOSChange,
    })
  }

  const handleCloseEditModal = () => {
    setIsEditProjectOpen(false)
    const url = new URL(window.location.href)
    url.searchParams.delete("mode")
    window.history.replaceState({}, "", url.pathname)
    // Reset form to initial state when closing without saving
    setEditForm(editFormInitialState)
  }

  const handleDelete = () => {
    toast({
      title: "Dự án đã được xóa",
      description: "Dự án đã bị xóa vĩnh viễn khỏi hệ thống.",
      duration: 3000,
    })
    setIsDeleteDialogOpen(false)
    setTimeout(() => {
      router.push("/applications/aso-dashboard")
    }, 1000)
  }

  const handleCreateOrder = () => {
    const newOrder = {
      id: `ORD${String(project.orders.length + 1).padStart(3, "0")}`,
      type: orderForm.type,
      recipient: orderForm.recipient,
      status: "Pending",
      deadline: orderForm.deadline,
      description: orderForm.description,
      priority: orderForm.priority, // Added priority
    }
    setProject({
      ...project,
      orders: [...project.orders, newOrder],
    })
    setIsCreateOrderOpen(false)
    setOrderForm({ type: "", recipient: "", priority: "", deadline: "", description: "" })
    toast({
      title: "Order đã được tạo thành công!",
      description: `${orderForm.recipient} đã được thông báo.`,
      duration: 3000,
    })
  }

  const handleEditOrder = (order: any) => {
    // If currently viewing and switching to edit mode
    if (isOrderDetailOpen && viewingOrder?.id === order.id) {
      handleSwitchToEdit()
      return
    }

    // Open edit modal for a standalone order
    setSelectedOrder(order)
    setOriginalOrderData(order)
    setOrderForm({
      type: order.type,
      recipient: order.recipient,
      priority: order.priority || "Medium",
      deadline: order.deadline,
      description: order.description,
    })
    setIsEditOrderOpen(true)
  }

  const handleUpdateOrder = () => {
    const updatedOrders = project.orders.map((order) =>
      order.id === selectedOrder.id
        ? {
            ...order,
            type: orderForm.type,
            recipient: orderForm.recipient,
            deadline: orderForm.deadline,
            description: orderForm.description,
            priority: orderForm.priority, // Ensure priority is updated too
          }
        : order,
    )
    setProject({ ...project, orders: updatedOrders })
    setIsEditOrderOpen(false)
    toast({
      title: "Order đã được cập nhật",
      duration: 3000,
    })
  }

  const handleViewOrder = (orderId: string) => {
    const order = project.orders.find((o) => o.id === orderId)
    if (order) {
      setViewingOrder({
        ...order,
        activities: getOrderActivities(orderId),
        comments: getOrderComments(orderId),
      })
      setIsOrderDetailOpen(true)
    }
  }

  const handleSwitchToEdit = () => {
    setOriginalOrderData({ ...viewingOrder })
    setOrderForm({
      type: viewingOrder.type,
      recipient: viewingOrder.recipient,
      priority: viewingOrder.priority || "Medium",
      deadline: viewingOrder.deadline,
      description: viewingOrder.description,
    })
    setIsEditMode(true)
    setHasUnsavedChanges(false)
  }

  // Redeclared handleCancelEdit function for the order detail sheet
  const handleCancelOrderEdit = () => {
    if (hasUnsavedChanges) {
      const confirm = window.confirm("Bạn có thay đổi chưa lưu. Bạn có chắc muốn hủy không?")
      if (!confirm) return
    }

    setIsEditMode(false)
    setHasUnsavedChanges(false)
    // Reset orderForm to original data or clear it
    if (originalOrderData) {
      setOrderForm({
        type: originalOrderData.type,
        recipient: originalOrderData.recipient,
        priority: originalOrderData.priority || "Medium",
        deadline: originalOrderData.deadline,
        description: originalOrderData.description,
      })
    } else {
      setOrderForm({ type: "", recipient: "", priority: "", deadline: "", description: "" })
    }
  }

  const handleSaveEditMode = () => {
    // Validation
    if (!orderForm.type || !orderForm.recipient || !orderForm.deadline || !orderForm.description) {
      toast({
        title: "Vui lòng điền đầy đủ thông tin",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    setIsConfirmSaveOpen(true)
  }

  // Redeclared handleConfirmSave function for the order detail sheet
  const handleConfirmOrderSave = () => {
    // Track changes for activity log
    const changes: string[] = []
    if (originalOrderData.type !== orderForm.type) {
      changes.push(`changed type from "${originalOrderData.type}" to "${orderForm.type}"`)
    }
    if (originalOrderData.priority !== orderForm.priority) {
      changes.push(`changed priority from "${originalOrderData.priority}" to "${orderForm.priority}"`)
    }
    if (originalOrderData.deadline !== orderForm.deadline) {
      changes.push(`changed deadline from "${originalOrderData.deadline}" to "${orderForm.deadline}"`)
    }
    if (originalOrderData.recipient !== orderForm.recipient) {
      changes.push(`changed recipient from "${originalOrderData.recipient}" to "${orderForm.recipient}"`)
    }
    if (originalOrderData.description !== orderForm.description) {
      changes.push(`changed description`)
    }

    // Update order in the main project state
    const updatedOrders = project.orders.map((order) =>
      order.id === viewingOrder.id
        ? {
            ...order,
            type: orderForm.type,
            recipient: orderForm.recipient,
            priority: orderForm.priority,
            deadline: orderForm.deadline,
            description: orderForm.description,
          }
        : order,
    )

    // Create activity log entry
    const newActivity = {
      id: `act${Date.now()}`,
      user: { name: "Nguyen Van A", avatar: "" },
      action: changes.length > 0 ? `updated order: ${changes.join(", ")}` : "made minor updates",
      timestamp: new Date().toLocaleString("vi-VN"),
    }

    setProject({ ...project, orders: updatedOrders })

    // Update viewing order with new data and activity
    const updatedViewingOrder = {
      ...viewingOrder,
      type: orderForm.type,
      recipient: orderForm.recipient,
      priority: orderForm.priority,
      deadline: orderForm.deadline,
      description: orderForm.description,
      activities: [newActivity, ...(viewingOrder.activities || [])],
    }

    setViewingOrder(updatedViewingOrder)
    setIsEditMode(false)
    setHasUnsavedChanges(false)
    setOriginalOrderData(null)
    setIsConfirmSaveOpen(false)

    toast({
      title: "Đã lưu thay đổi",
      description: "Thông tin đơn hàng đã được cập nhật thành công",
      duration: 3000,
    })
  }

  const handleOrderFormChange = (field: string, value: string) => {
    setOrderForm({ ...orderForm, [field]: value })
    setHasUnsavedChanges(true)
  }

  const handleSendComment = () => {
    if (!newComment.trim()) return

    toast({
      title: "Comment đã được gửi",
      description: "Comment của bạn đã được thêm vào order.",
      duration: 2000,
    })

    // Update viewingOrder với comment mới
    setViewingOrder({
      ...viewingOrder,
      comments: [
        {
          id: `comment${Date.now()}`,
          user: { name: project.lead.name, avatar: project.lead.avatar }, // Assuming current user is the one commenting
          message: newComment,
          timestamp: "Just now",
        },
        ...viewingOrder.comments,
      ],
    })

    setNewComment("")
  }

  const handleViewMetadata = () => {
    router.push(`/applications/metadata-tracking?project_id=${projectId}`)
  }

  const handleViewAllStoreKits = () => {
    router.push(`/applications/aso/storekit-management?project_id=${projectId}`)
  }

  const handleStorekitClick = (storekitId: string) => {
    const storekit = project?.storekits.find((sk) => sk.id === storekitId)
    if (storekit) {
      setSelectedStorekit(storekit)
      setIsStorekitPopupOpen(true)
    }
  }

  const handleViewInStorekitManagement = () => {
    if (selectedStorekit) {
      router.push(`/applications/aso/storekit-management?storekit_id=${selectedStorekit.id}`)
    }
  }

  const handleCopyStorekitLink = () => {
    if (selectedStorekit) {
      const link = `${window.location.origin}/applications/aso/storekit-management/${selectedStorekit.id}`
      navigator.clipboard.writeText(link)
      toast({
        title: "Link Copied",
        description: "StoreKit link has been copied to clipboard",
      })
    }
  }

  const handleUploadAsset = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.multiple = true
    input.accept = ".png,.jpg,.jpeg,.webp,.mp4,.mov,.sketch,.fig,.psd,.pdf,.docx"

    input.onchange = async (e: any) => {
      const files = Array.from(e.target.files) as File[]

      if (files.length === 0) return

      // Validate files
      const maxSize = 10 * 1024 * 1024 // 10MB
      const validFiles: File[] = []
      const invalidFiles: Array<{ name: string; reason: string }> = []

      files.forEach((file) => {
        if (file.size > maxSize) {
          invalidFiles.push({ name: file.name, reason: "File quá lớn (tối đa 10MB)" })
        } else {
          validFiles.push(file)
        }
      })

      // Show error for invalid files
      if (invalidFiles.length > 0) {
        invalidFiles.forEach((file) => {
          toast({
            title: "Upload thất bại",
            description: `${file.name}: ${file.reason}`,
            variant: "destructive",
            duration: 5000,
          })
        })
      }

      if (validFiles.length === 0) return

      // Create upload tracking entries
      const uploadEntries = validFiles.map((file) => ({
        id: `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        progress: 0,
        status: "uploading" as const,
        file: file, // Store the file object itself
      }))

      setUploadingFiles(uploadEntries)

      // Simulate upload for each file
      for (const entry of uploadEntries) {
        try {
          // Simulate upload progress
          for (let progress = 0; progress <= 100; progress += 10) {
            await new Promise((resolve) => setTimeout(resolve, 100)) // Shorter delay for quicker simulation
            setUploadingFiles((prev) => prev.map((item) => (item.id === entry.id ? { ...item, progress } : item)))
          }

          // Determine file type and create URL
          const fileExtension = entry.name.split(".").pop()?.toLowerCase()
          let fileType = "document"
          let fileUrl = "/icons/document.svg" // Default icon for documents

          if (["png", "jpg", "jpeg", "webp"].includes(fileExtension || "")) {
            fileType = "image"
            fileUrl = URL.createObjectURL(entry.file) // Use URL.createObjectURL for images
          } else if (["mp4", "mov"].includes(fileExtension || "")) {
            fileType = "video"
            fileUrl = URL.createObjectURL(entry.file) // Use URL.createObjectURL for videos
          }

          // Add to assets with animation
          const newAsset = {
            id: entry.id,
            name: entry.name,
            type: fileType,
            url: fileUrl,
            size: entry.size,
            uploadedBy: project.lead.name, // Assuming current user is the uploader
            uploadedDate: new Date().toLocaleString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
          }

          setProject((prev) => ({
            ...prev,
            assets: [newAsset, ...prev.assets], // Add to beginning
          }))

          // Mark as success
          setUploadingFiles((prev) =>
            prev.map((item) => (item.id === entry.id ? { ...item, status: "success" as const } : item)),
          )
        } catch (error) {
          // Mark as error
          setUploadingFiles((prev) =>
            prev.map((item) =>
              item.id === entry.id ? { ...item, status: "error" as const, error: "Lỗi khi upload file" } : item,
            ),
          )

          toast({
            title: "Upload thất bại",
            description: `${entry.name}: Lỗi khi upload file`,
            variant: "destructive",
            duration: 5000,
          })
        }
      }

      // Show success message only if there were successful uploads
      const successfulUploads = uploadEntries.filter((entry) => entry.status === "success").length
      if (successfulUploads > 0) {
        toast({
          title: "Upload thành công!",
          description: `${successfulUploads} file đã được thêm vào thư viện`,
          duration: 3000,
        })
      }

      // Clear upload tracking after 2 seconds
      setTimeout(() => {
        setUploadingFiles((prev) => prev.filter((item) => item.status !== "success")) // Keep errors visible briefly if needed, or filter all out
      }, 2000)
    }

    input.click()
  }

  const handleCancelUpload = (uploadId: string) => {
    setUploadingFiles((prev) => prev.filter((item) => item.id !== uploadId))
    toast({
      title: "Đã hủy upload",
      description: "File đã được hủy upload",
      duration: 2000,
    })
  }

  const handleViewAllAssets = () => {
    router.push(`/projects/${params.projectId}/assets`)
  }

  const handleAssetClick = (asset: any) => {
    setSelectedAsset(asset)
    setIsAssetPreviewOpen(true)
  }

  const handleAddMember = () => {
    const newMember = {
      name: "New User", // Placeholder for now, ideally from userId
      avatar: "", // Placeholder
      role: memberForm.role,
    }
    setProject({
      ...project,
      teamMembers: [...project.teamMembers, newMember],
    })
    setIsAddMemberOpen(false)
    setMemberForm({ userId: "", role: "" })
    toast({
      title: "Thành viên đã được thêm vào dự án",
      duration: 3000,
    })
  }

  const handleRequestApproval = () => {
    setProject({
      ...project,
      approvalStatus: {
        ...project.approvalStatus,
        status: "Pending Approval",
      },
    })
    setIsRequestApprovalOpen(false)
    setApprovalForm({ message: "" })
    toast({
      title: "Yêu cầu phê duyệt đã được gửi",
      description: "Lead Marketing sẽ được thông báo.",
      duration: 3000,
    })
  }

  const handleViewWorkflow = () => {
    router.push(`/projects/${params.projectId}/workflow`)
  }

  const handleExportReport = () => {
    setIsExporting(true)
    toast({
      title: "Đang tạo báo cáo...",
      description: "Báo cáo sẽ được tải xuống trong giây lát.",
      duration: 2000,
    })
    setTimeout(() => {
      setIsExporting(false)
      toast({
        title: "Báo cáo đã được tải xuống",
        duration: 3000,
      })
    }, 3000)
  }

  const handleCopyProjectLink = () => {
    const url = `https://aso-tool.com/projects/${params.projectId}`
    navigator.clipboard.writeText(url)
    toast({
      title: "Link đã được sao chép!",
      duration: 2000,
    })
  }

  const handleStartEdit = (field: string, value: string) => {
    setIsEditingField(field)
    setEditedValue(value)
  }

  const handleSaveEdit = (field: string) => {
    setProject({ ...project, [field]: editedValue })
    setIsEditingField(null)
    toast({
      title: "Đã cập nhật thành công",
      duration: 2000,
    })
  }

  const handleCancelEditField = () => {
    setIsEditingField(null)
    setEditedValue("")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <button onClick={() => router.push("/applications/aso-dashboard")} className="hover:text-indigo-600">
              Projects
            </button>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">{project.appName}</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-600">Overview</span>
          </div>

          {/* Title and Actions */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.push("/applications/aso-dashboard")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{project.appName}</h1>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                    {project.os}
                  </Badge>
                  <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                </div>
                <p className="text-gray-600">{project.category}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleEditProject}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit Project
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 bg-transparent"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Overall Progress */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Overall Progress</span>
                <TrendingUp className="h-4 w-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">{project.progress}%</div>
              <Progress value={project.progress} className="h-2" />
            </CardContent>
          </Card>

          {/* Deadline */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Deadline</span>
                <Calendar className="h-4 w-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {new Date(project.deadline).toLocaleDateString("vi-VN")}
              </div>
              <span className={`text-sm font-medium ${getDeadlineColor()}`}>
                {daysLeft >= 0 ? `${daysLeft} days left` : `${Math.abs(daysLeft)} days overdue`}
              </span>
            </CardContent>
          </Card>

          {/* Project Lead */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Project Lead</span>
                <Users className="h-4 w-4 text-indigo-600" />
              </div>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={project.lead.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-indigo-500 text-white text-xs">
                    {project.lead.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-gray-900">{project.lead.name}</div>
                  <div className="text-xs text-gray-500">{project.lead.email}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Market */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Market</span>
                <Target className="h-4 w-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{project.market}</div>
              <span className="text-sm text-gray-600">{project.region}</span>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN (65%) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">App Name</span>
                    <p className="font-semibold text-gray-900">{project.appName}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">OS</span>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                      {project.os}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Target Market</span>
                    <p className="font-semibold text-gray-900">{project.market}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Region</span>
                    <p className="font-semibold text-gray-900">{project.region}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Category</span>
                    <p className="font-semibold text-gray-900">{project.category}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <span className="text-sm text-gray-600 block mb-2">Keywords</span>
                  <div className="flex flex-wrap gap-2">
                    {displayedKeywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-700">
                        {keyword}
                      </Badge>
                    ))}
                    {project.keywords.length > 8 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-indigo-600"
                        onClick={() => setShowAllKeywords(!showAllKeywords)}
                      >
                        {showAllKeywords ? "Show less" : `+${project.keywords.length - 8} more`}
                      </Button>
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <span className="text-sm text-gray-600 block mb-2">Description</span>
                  <p className="text-gray-700">
                    {showFullDescription ? project.description : `${project.description.slice(0, 150)}...`}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-indigo-600 px-0"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                  >
                    {showFullDescription ? "Show less" : "Show more"}
                  </Button>
                </div>

                <Separator />

                {/* Timestamps */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Created by</span>
                    <p className="font-medium text-gray-900">
                      {project.createdBy} • {project.createdDate}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Last updated by</span>
                    <p className="font-medium text-gray-900">
                      {project.lastUpdatedBy} • {project.lastUpdatedDate}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Orders & Collaboration</CardTitle>
                  <Button size="sm" onClick={() => setIsCreateOrderOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Order
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {project.orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-gray-600" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">{order.id}</span>
                            <Badge variant="secondary" className="text-xs">
                              {order.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{order.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            To: {order.recipient} • Deadline: {order.deadline}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={
                            order.status === "In Progress" ? "bg-blue-50 text-blue-700" : "bg-yellow-50 text-yellow-700"
                          }
                        >
                          {order.status}
                        </Badge>
                        <Button variant="ghost" size="sm" onClick={() => handleViewOrder(order.id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEditOrder(order)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Metadata Summary</CardTitle>
                  <Badge variant="secondary">{project.metadataVersion}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Title</span>
                  <p className="font-semibold text-gray-900">{project.metadataTitle}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Subtitle</span>
                  <p className="text-gray-700">{project.metadataSubtitle}</p>
                </div>
                <Button variant="outline" className="w-full bg-transparent" onClick={handleViewMetadata}>
                  View Full Metadata
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">StoreKit Summary</CardTitle>
                  <Button variant="outline" size="sm" onClick={handleViewAllStoreKits}>
                    View All StoreKits
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {project.storekits.map((storekit) => (
                    <div
                      key={storekit.id}
                      className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                      onClick={() => handleStorekitClick(storekit.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          {storekit.platform}
                        </Badge>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {storekit.market} - {storekit.language}
                          </div>
                          <p className="text-xs text-gray-500">Last updated: {storekit.lastUpdated}</p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          storekit.status === "Active" ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-700"
                        }
                      >
                        {storekit.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Files & Assets</CardTitle>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={handleUploadAsset}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload New Asset
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleViewAllAssets}>
                      View All Assets
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {uploadingFiles.length > 0 && (
                  <div className="mb-4 space-y-2">
                    {uploadingFiles.map((file) => (
                      <div key={file.id} className="bg-white border rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {file.status === "uploading" && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
                            {file.status === "success" && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                            {file.status === "error" && <XCircle className="h-4 w-4 text-red-600" />}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{file.name}</p>
                              <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          {file.status === "uploading" && (
                            <Button variant="ghost" size="sm" onClick={() => handleCancelUpload(file.id)}>
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        {file.status === "uploading" && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs text-gray-600">
                              <span>Đang upload...</span>
                              <span>{file.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${file.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                        {file.status === "error" && file.error && <p className="text-xs text-red-600">{file.error}</p>}
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-4 gap-4">
                  {project.assets.map((asset, index) => (
                    <div
                      key={asset.id}
                      className="relative group cursor-pointer animate-in fade-in slide-in-from-top-2 duration-300"
                      style={{ animationDelay: `${index * 50}ms` }}
                      onClick={() => handleAssetClick(asset)}
                    >
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        {asset.type === "image" && (
                          <img
                            src={asset.url || "/placeholder.svg"}
                            alt={asset.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                        {asset.type === "video" && (
                          <div className="relative w-full h-full bg-gray-900">
                            <video
                              src={asset.url}
                              className="w-full h-full object-cover"
                              // muted // Autoplay might be blocked by browser without muted
                              // autoPlay // Autoplay might be blocked by browser
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-12 h-12 bg-black/60 rounded-full flex items-center justify-center">
                                <Play className="h-6 w-6 text-white ml-1" fill="white" />
                              </div>
                            </div>
                          </div>
                        )}
                        {asset.type === "document" && (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileText className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col items-center justify-center p-2 text-white">
                        <span className="text-xs font-medium text-center mb-1 line-clamp-2">{asset.name}</span>
                        {asset.size && (
                          <span className="text-xs text-gray-300">{(asset.size / 1024 / 1024).toFixed(2)} MB</span>
                        )}
                        {asset.uploadedDate && <span className="text-xs text-gray-300 mt-1">{asset.uploadedDate}</span>}
                        {asset.uploadedBy && <span className="text-xs text-gray-300">By {asset.uploadedBy}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN (35%) */}
          <div className="space-y-6">
            {/* Activity Feed */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Activity Feed</CardTitle>
                <Tabs value={activityFilter} onValueChange={setActivityFilter} className="mt-4">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="comment">Comments</TabsTrigger>
                    <TabsTrigger value="approval">Approvals</TabsTrigger>
                    <TabsTrigger value="upload">Files</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredActivities.map((activity) => (
                    <div key={activity.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={activity.user.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs">
                          {activity.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          <span className="font-semibold">{activity.user.name}</span> {activity.action}
                        </p>
                        <p className="text-xs text-gray-500">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                  <Button variant="ghost" className="w-full text-indigo-600">
                    Load More
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Team Members</CardTitle>
                  <Button size="sm" variant="outline" onClick={() => setIsAddMemberOpen(true)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {project.teamMembers.map((member, index) => (
                    <Popover key={index}>
                      <PopoverTrigger asChild>
                        <div className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={member.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs">
                                {member.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{member.name}</p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {member.role}
                          </Badge>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-64">
                        <div className="space-y-2">
                          <h4 className="font-semibold">{member.name}</h4>
                          <p className="text-sm text-gray-600">email@example.com</p>
                          <p className="text-sm text-gray-600">Role: {member.role}</p>
                          <Button variant="destructive" size="sm" className="w-full">
                            Remove from project
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Approval Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-semibold text-gray-900">{project.approvalStatus.stage}</p>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 mt-1">
                      {project.approvalStatus.status}
                    </Badge>
                  </div>
                </div>
                <Separator />
                <div>
                  <span className="text-sm text-gray-600">Last Feedback</span>
                  <p className="text-sm text-gray-700 mt-1">{project.approvalStatus.lastFeedback}</p>
                  <p className="text-xs text-gray-500 mt-1">{project.approvalStatus.timestamp}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                    onClick={() => setIsRequestApprovalOpen(true)}
                  >
                    Request Approval
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => setIsApprovalHistoryOpen(true)}
                  >
                    View History
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent" onClick={handleViewWorkflow}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Workflow
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={handleExportReport}
                  disabled={isExporting}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isExporting ? "Exporting..." : "Export Report"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={handleCopyProjectLink}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Copy Project Link
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Project Modal */}
      <Dialog
        open={isEditProjectOpen}
        onOpenChange={(open) => {
          if (!open) {
            // Only allow closing via X button if user explicitly closes
            if (hasUnsavedChanges || JSON.stringify(editForm) !== JSON.stringify(editFormInitialState)) {
              // Check if there are unsaved changes
              setShowCancelConfirm(true) // Prompt for confirmation
            } else {
              handleCloseEditModal() // Close directly if no changes
            }
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>
                App Name <span className="text-red-500">*</span>
              </Label>
              <Input
                value={editForm.appName}
                onChange={(e) => {
                  setEditForm({ ...editForm, appName: e.target.value })
                  if (validationErrors.appName) {
                    setValidationErrors({ ...validationErrors, appName: "" })
                  }
                }}
                className={validationErrors.appName ? "border-red-500" : ""}
              />
              {validationErrors.appName && <p className="text-red-500 text-sm mt-1">{validationErrors.appName}</p>}
            </div>
            <div>
              <Label>Operating System</Label>
              <Select
                value={editForm.os}
                onValueChange={(value) => {
                  setEditForm({ ...editForm, os: value })
                  // Implicitly mark as changed for form state management
                  // setHasUnsavedChanges(true); // Uncomment if OS change should also prompt save confirmation
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="iOS">iOS</SelectItem>
                  <SelectItem value="Android">Android</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>
                Market <span className="text-red-500">*</span>
              </Label>
              <Select
                value={editForm.market}
                onValueChange={(value) => {
                  setEditForm({ ...editForm, market: value })
                  if (validationErrors.market) {
                    setValidationErrors({ ...validationErrors, market: "" })
                  }
                  // setHasUnsavedChanges(true); // Uncomment if market change should also prompt save confirmation
                }}
              >
                <SelectTrigger className={validationErrors.market ? "border-red-500" : ""}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">🇺🇸 United States</SelectItem>
                  <SelectItem value="UK">🇬🇧 United Kingdom</SelectItem>
                  <SelectItem value="VN">🇻🇳 Vietnam</SelectItem>
                </SelectContent>
              </Select>
              {validationErrors.market && <p className="text-red-500 text-sm mt-1">{validationErrors.market}</p>}
            </div>
            <div>
              <Label>Region</Label>
              <Input
                value={editForm.region}
                onChange={(e) => {
                  setEditForm({ ...editForm, region: e.target.value })
                  // setHasUnsavedChanges(true); // Uncomment if region change should also prompt save confirmation
                }}
              />
            </div>
            <div>
              <Label>
                Project Lead <span className="text-red-500">*</span>
              </Label>
              <Select
                value={editForm.lead}
                onValueChange={(value) => {
                  setEditForm({ ...editForm, lead: value })
                  if (validationErrors.lead) {
                    setValidationErrors({ ...validationErrors, lead: "" })
                  }
                  // setHasUnsavedChanges(true); // Uncomment if lead change should also prompt save confirmation
                }}
              >
                <SelectTrigger className={validationErrors.lead ? "border-red-500" : ""}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nguyen Van A">Nguyen Van A</SelectItem>
                  <SelectItem value="Tran Thi B">Tran Thi B</SelectItem>
                  <SelectItem value="Le Van C">Le Van C</SelectItem>
                  <SelectItem value="Pham Thi D">Pham Thi D</SelectItem>
                </SelectContent>
              </Select>
              {validationErrors.lead && <p className="text-red-500 text-sm mt-1">{validationErrors.lead}</p>}
            </div>
            <div>
              <Label>
                Deadline <span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                value={editForm.deadline}
                onChange={(e) => {
                  setEditForm({ ...editForm, deadline: e.target.value })
                  if (validationErrors.deadline) {
                    setValidationErrors({ ...validationErrors, deadline: "" })
                  }
                  // setHasUnsavedChanges(true); // Uncomment if deadline change should also prompt save confirmation
                }}
                className={validationErrors.deadline ? "border-red-500" : ""}
              />
              {validationErrors.deadline && <p className="text-red-500 text-sm mt-1">{validationErrors.deadline}</p>}
            </div>
            <div>
              <Label>
                Workflow Template <span className="text-red-500">*</span>
              </Label>
              <Select
                value={editForm.workflowTemplate}
                onValueChange={(value) => {
                  setEditForm({ ...editForm, workflowTemplate: value })
                  if (validationErrors.workflowTemplate) {
                    setValidationErrors({ ...validationErrors, workflowTemplate: "" })
                  }
                  // setHasUnsavedChanges(true); // Uncomment if workflowTemplate change should also prompt save confirmation
                }}
              >
                <SelectTrigger className={validationErrors.workflowTemplate ? "border-red-500" : ""}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standard ASO Workflow">Standard ASO Workflow</SelectItem>
                  <SelectItem value="Quick Launch Workflow">Quick Launch Workflow</SelectItem>
                  <SelectItem value="Full Marketing Workflow">Full Marketing Workflow</SelectItem>
                  <SelectItem value="Update & Optimization Workflow">Update & Optimization Workflow</SelectItem>
                </SelectContent>
              </Select>
              {validationErrors.workflowTemplate && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.workflowTemplate}</p>
              )}
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={editForm.description}
                onChange={(e) => {
                  setEditForm({ ...editForm, description: e.target.value })
                  // setHasUnsavedChanges(true); // Uncomment if description change should also prompt save confirmation
                }}
                rows={4}
              />
            </div>
            <div>
              <Label>Assign Teams</Label>
              <div className="space-y-2 mt-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={editForm.teams.aso}
                    onCheckedChange={(checked) =>
                      setEditForm({ ...editForm, teams: { ...editForm.teams, aso: checked as boolean } })
                    }
                  />
                  <Label>ASO Team</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={editForm.teams.design}
                    onCheckedChange={(checked) =>
                      setEditForm({ ...editForm, teams: { ...editForm.teams, design: checked as boolean } })
                    }
                  />
                  <Label>Design Team</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={editForm.teams.dev}
                    onCheckedChange={(checked) =>
                      setEditForm({ ...editForm, teams: { ...editForm.teams, dev: checked as boolean } })
                    }
                  />
                  <Label>Dev Team</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={editForm.teams.marketing}
                    onCheckedChange={(checked) =>
                      setEditForm({ ...editForm, teams: { ...editForm.teams, marketing: checked as boolean } })
                    }
                  />
                  <Label>Marketing Team</Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                if (hasUnsavedChanges || JSON.stringify(editForm) !== JSON.stringify(editFormInitialState)) {
                  setShowCancelConfirm(true)
                } else {
                  handleCloseEditModal()
                }
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveProject}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hủy chỉnh sửa?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn hủy các thay đổi vừa thực hiện không? Mọi thông tin chưa lưu sẽ bị mất.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Tiếp tục chỉnh sửa</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleConfirmCancel() // Call the existing confirm cancel handler
                // Reset form state after confirmation to avoid showing changes again
                setEditForm(editFormInitialState)
              }}
            >
              Đồng ý
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showSaveConfirm} onOpenChange={setShowSaveConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Lưu thay đổi?</AlertDialogTitle>
            <AlertDialogDescription>Bạn có chắc chắn muốn lưu các thay đổi vừa thực hiện không?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSave}>Lưu thay đổi</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa dự án vĩnh viễn?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create Order Modal */}
      <Dialog open={isCreateOrderOpen} onOpenChange={setIsCreateOrderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Order Type</Label>
              <Select value={orderForm.type} onValueChange={(value) => setOrderForm({ ...orderForm, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Design Request">Design Request</SelectItem>
                  <SelectItem value="Feature Request">Feature Request</SelectItem>
                  <SelectItem value="Video Production">Video Production</SelectItem>
                  <SelectItem value="Icon Design">Icon Design</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Recipient Team</Label>
              <Select
                value={orderForm.recipient}
                onValueChange={(value) => setOrderForm({ ...orderForm, recipient: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Design Team">Design Team</SelectItem>
                  <SelectItem value="Marketing Team">Marketing Team</SelectItem>
                  <SelectItem value="Dev Team">Dev Team</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Priority</Label>
              <Select
                value={orderForm.priority}
                onValueChange={(value) => setOrderForm({ ...orderForm, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Deadline</Label>
              <Input
                type="date"
                value={orderForm.deadline}
                onChange={(e) => setOrderForm({ ...orderForm, deadline: e.target.value })}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={orderForm.description}
                onChange={(e) => setOrderForm({ ...orderForm, description: e.target.value })}
                placeholder="Describe the order details..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOrderOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateOrder}>Create Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Order Modal */}
      <Dialog open={isEditOrderOpen} onOpenChange={setIsEditOrderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Order Type</Label>
              <Select value={orderForm.type} onValueChange={(value) => setOrderForm({ ...orderForm, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Design Request">Design Request</SelectItem>
                  <SelectItem value="Feature Request">Feature Request</SelectItem>
                  <SelectItem value="Video Production">Video Production</SelectItem>
                  <SelectItem value="Icon Design">Icon Design</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Recipient Team</Label>
              <Select
                value={orderForm.recipient}
                onValueChange={(value) => setOrderForm({ ...orderForm, recipient: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Design Team">Design Team</SelectItem>
                  <SelectItem value="Marketing Team">Marketing Team</SelectItem>
                  <SelectItem value="Dev Team">Dev Team</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Deadline</Label>
              <Input
                type="date"
                value={orderForm.deadline}
                onChange={(e) => setOrderForm({ ...orderForm, deadline: e.target.value })}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={orderForm.description}
                onChange={(e) => setOrderForm({ ...orderForm, description: e.target.value })}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOrderOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateOrder}>Update Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet
        open={isOrderDetailOpen}
        onOpenChange={(open) => {
          if (!open && isEditMode && hasUnsavedChanges) {
            const confirm = window.confirm("Bạn có thay đổi chưa lưu. Bạn có chắc muốn đóng không?")
            if (!confirm) return
          }
          setIsOrderDetailOpen(open)
          setIsEditMode(false)
          setHasUnsavedChanges(false)
          setOriginalOrderData(null) // Reset original data when sheet closes
          setOrderForm({ type: "", recipient: "", priority: "", deadline: "", description: "" }) // Reset form
        }}
      >
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle className="text-2xl">
                  {isEditMode ? `Edit Order ${viewingOrder?.id}` : viewingOrder?.id}
                </SheetTitle>
                <SheetDescription className="mt-1">
                  {isEditMode ? "Modify order details" : "View order details and activity"}
                </SheetDescription>
              </div>
              {!isEditMode && (
                <Button size="sm" onClick={handleSwitchToEdit}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Order Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isEditMode ? (
                  // View Mode
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-600">Order ID</span>
                        <p className="text-base font-semibold text-gray-900">{viewingOrder?.id}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Status</span>
                        <div className="mt-1">
                          <Badge
                            variant="outline"
                            className={
                              viewingOrder?.status === "In Progress"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-yellow-50 text-yellow-700"
                            }
                          >
                            {viewingOrder?.status}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Type</span>
                        <p className="font-semibold text-gray-900">{viewingOrder?.type}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Priority</span>
                        <Badge
                          variant="outline"
                          className={
                            viewingOrder?.priority === "High"
                              ? "bg-red-50 text-red-700"
                              : viewingOrder?.priority === "Medium"
                                ? "bg-yellow-50 text-yellow-700"
                                : "bg-gray-50 text-gray-700"
                          }
                        >
                          {viewingOrder?.priority || "Medium"}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Recipient</span>
                        <p className="font-semibold text-gray-900">{viewingOrder?.recipient}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Deadline</span>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-600" />
                          <p className="font-semibold text-gray-900">
                            {viewingOrder?.deadline && new Date(viewingOrder.deadline).toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Created</span>
                        <p className="text-gray-900">2024-12-01</p> {/* Assuming a static creation date for mock */}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <span className="text-sm text-gray-600 block mb-2">Description</span>
                      <p className="text-gray-700">{viewingOrder?.description}</p>
                    </div>
                  </>
                ) : (
                  // Edit Mode
                  <div className="space-y-4 transition-all duration-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>
                          Order Type {hasUnsavedChanges && orderForm.type !== originalOrderData?.type && "*"}
                        </Label>
                        <Select value={orderForm.type} onValueChange={(value) => handleOrderFormChange("type", value)}>
                          <SelectTrigger className="focus:ring-2 focus:ring-blue-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Design Request">Design Request</SelectItem>
                            <SelectItem value="Feature Request">Feature Request</SelectItem>
                            <SelectItem value="Video Production">Video Production</SelectItem>
                            <SelectItem value="Icon Design">Icon Design</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>
                          Priority {hasUnsavedChanges && orderForm.priority !== originalOrderData?.priority && "*"}
                        </Label>
                        <Select
                          value={orderForm.priority}
                          onValueChange={(value) => handleOrderFormChange("priority", value)}
                        >
                          <SelectTrigger className="focus:ring-2 focus:ring-blue-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>
                          Recipient Team{" "}
                          {hasUnsavedChanges && orderForm.recipient !== originalOrderData?.recipient && "*"}
                        </Label>
                        <Select
                          value={orderForm.recipient}
                          onValueChange={(value) => handleOrderFormChange("recipient", value)}
                        >
                          <SelectTrigger className="focus:ring-2 focus:ring-blue-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Design Team">Design Team</SelectItem>
                            <SelectItem value="Marketing Team">Marketing Team</SelectItem>
                            <SelectItem value="Dev Team">Dev Team</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>
                          Deadline {hasUnsavedChanges && orderForm.deadline !== originalOrderData?.deadline && "*"}
                        </Label>
                        <Input
                          type="date"
                          value={orderForm.deadline}
                          onChange={(e) => handleOrderFormChange("deadline", e.target.value)}
                          className="focus:ring-2 focus:ring-blue-200"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>
                        Description{" "}
                        {hasUnsavedChanges && orderForm.description !== originalOrderData?.description && "*"}
                      </Label>
                      <Textarea
                        value={orderForm.description}
                        onChange={(e) => handleOrderFormChange("description", e.target.value)}
                        rows={4}
                        className="focus:ring-2 focus:ring-blue-200"
                        placeholder="Describe the order details..."
                      />
                    </div>

                    <Separator />

                    {/* Edit Mode Actions */}
                    <div className="flex items-center justify-between pt-2">
                      <p className="text-sm text-gray-600">
                        {hasUnsavedChanges ? "You have unsaved changes" : "No changes yet"}
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={handleCancelOrderEdit}>
                          Cancel
                        </Button>
                        <Button onClick={handleSaveEditMode} disabled={!hasUnsavedChanges}>
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Activity Log */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Activity Log
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {viewingOrder?.activities?.map((activity: any) => (
                    <div key={activity.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={activity.user.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs">
                          {activity.user.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          <span className="font-semibold">{activity.user.name}</span> {activity.action}
                        </p>
                        <p className="text-xs text-gray-500">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Comments ({viewingOrder?.comments?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Existing Comments */}
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {viewingOrder?.comments?.map((comment: any) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.user.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs">
                          {comment.user.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm font-semibold text-gray-900">{comment.user.name}</p>
                          <p className="text-sm text-gray-700 mt-1">{comment.message}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{comment.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Add Comment */}
                <div className="space-y-2">
                  <Label>Add Comment</Label>
                  <div className="flex gap-2">
                    <Textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      rows={3}
                      className="flex-1"
                    />
                  </div>
                  <Button size="sm" onClick={handleSendComment} disabled={!newComment.trim()}>
                    <Send className="h-4 w-4 mr-2" />
                    Send Comment
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Related Files */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Attached Files
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">No files attached yet</div>
                <Button variant="outline" size="sm" className="mt-3 bg-transparent">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
              </CardContent>
            </Card>
          </div>
        </SheetContent>
      </Sheet>

      {/* Add Member Modal */}
      <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Select User</Label>
              <Select
                value={memberForm.userId}
                onValueChange={(value) => setMemberForm({ ...memberForm, userId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Search and select user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user1">John Doe</SelectItem>
                  <SelectItem value="user2">Jane Smith</SelectItem>
                  <SelectItem value="user3">Bob Johnson</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Role</Label>
              <Select value={memberForm.role} onValueChange={(value) => setMemberForm({ ...memberForm, role: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lead">Lead</SelectItem>
                  <SelectItem value="ASO">ASO</SelectItem>
                  <SelectItem value="Designer">Designer</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMember}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Approval Modal */}
      <Dialog open={isRequestApprovalOpen} onOpenChange={setIsRequestApprovalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Approval</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>To</Label>
              <Input value="Lead Marketing" disabled />
            </div>
            <div>
              <Label>Message</Label>
              <Textarea
                value={approvalForm.message}
                onChange={(e) => setApprovalForm({ ...approvalForm, message: e.target.value })}
                placeholder="Enter your approval request message..."
                rows={4}
              />
            </div>
            <div>
              <Label>Attach</Label>
              <div className="text-sm text-gray-600">Current metadata & assets will be attached</div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRequestApprovalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRequestApproval}>Send Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approval History Modal */}
      <Dialog open={isApprovalHistoryOpen} onOpenChange={setIsApprovalHistoryOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Approval History</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-l-2 border-gray-300 pl-4 space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-semibold">Approved</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Metadata v2.2 approved by Lead Marketing</p>
                <p className="text-xs text-gray-500">2024-11-20 10:30 AM</p>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <span className="font-semibold">Need Revision</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Need to update app screenshots to match new brand guidelines
                </p>
                <p className="text-xs text-gray-500">2024-11-15 03:15 PM</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Asset Preview Modal */}
      <Dialog open={isAssetPreviewOpen} onOpenChange={setIsAssetPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedAsset?.name}</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center bg-gray-100 rounded-lg p-8">
            {selectedAsset?.type === "image" && (
              <img
                src={selectedAsset?.url || "/placeholder.svg"}
                alt={selectedAsset?.name}
                className="max-w-full max-h-[60vh] object-contain"
              />
            )}
            {selectedAsset?.type === "video" && (
              <video src={selectedAsset?.url} controls className="max-w-full max-h-[60vh] object-contain" />
            )}
            {selectedAsset?.type === "document" && (
              <div className="text-center">
                <FileText className="h-24 w-24 text-gray-500 mx-auto mb-4" />
                <p className="text-lg text-gray-700">Preview for documents not available. Please download.</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Save Dialog */}
      <AlertDialog open={isConfirmSaveOpen} onOpenChange={setIsConfirmSaveOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận lưu thay đổi</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                <p className="mb-2">Bạn có chắc chắn muốn lưu các thay đổi này không?</p>
                <div className="mt-4 space-y-2 text-sm">
                  <p className="font-semibold text-foreground">Thông tin sẽ được cập nhật:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    {originalOrderData && orderForm.type !== originalOrderData.type && (
                      <li>
                        • Loại: {originalOrderData.type} → {orderForm.type}
                      </li>
                    )}
                    {originalOrderData && orderForm.recipient !== originalOrderData.recipient && (
                      <li>
                        • Người nhận: {originalOrderData.recipient} → {orderForm.recipient}
                      </li>
                    )}
                    {originalOrderData && orderForm.priority !== originalOrderData.priority && (
                      <li>
                        • Mức độ ưu tiên: {originalOrderData.priority} → {orderForm.priority}
                      </li>
                    )}
                    {originalOrderData && orderForm.deadline !== originalOrderData.deadline && (
                      <li>
                        • Deadline: {originalOrderData.deadline} → {orderForm.deadline}
                      </li>
                    )}
                    {originalOrderData && orderForm.description !== originalOrderData.description && (
                      <li>• Mô tả đã được thay đổi</li>
                    )}
                  </ul>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmOrderSave}>Xác nhận lưu</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isStorekitPopupOpen} onOpenChange={setIsStorekitPopupOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold">StoreKit Details</DialogTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {selectedStorekit?.platform}
                </Badge>
                <Badge variant="outline" className="bg-purple-50 text-purple-700">
                  {selectedStorekit?.language}
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    selectedStorekit?.status === "Active"
                      ? "bg-green-50 text-green-700"
                      : selectedStorekit?.status === "Draft"
                        ? "bg-gray-50 text-gray-700"
                        : selectedStorekit?.status === "In Review"
                          ? "bg-yellow-50 text-yellow-700"
                          : "bg-blue-50 text-blue-700"
                  }
                >
                  {selectedStorekit?.status}
                </Badge>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* StoreKit Name & Version */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">StoreKit Name</p>
                <p className="text-base font-semibold text-gray-900 mt-1">
                  {selectedStorekit?.market} - {selectedStorekit?.language}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Version</p>
                <p className="text-base font-semibold text-gray-900 mt-1">v1.2.0</p>
              </div>
            </div>

            <Separator />

            {/* Markets & Images */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Markets</p>
                <p className="text-base text-gray-900 mt-1">{selectedStorekit?.market}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Images Count</p>
                <p className="text-base text-gray-900 mt-1">12 images</p>
              </div>
            </div>

            <Separator />

            {/* Owner & Last Updated */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Owner</p>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">JD</AvatarFallback>
                  </Avatar>
                  <p className="text-base text-gray-900">John Doe</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Last Updated</p>
                <p className="text-base text-gray-900 mt-1">{selectedStorekit?.lastUpdated}</p>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <p className="text-sm font-medium text-gray-500">Description</p>
              <p className="text-sm text-gray-700 mt-1 line-clamp-3">
                This StoreKit contains all visual assets and metadata for the {selectedStorekit?.market} market in{" "}
                {selectedStorekit?.language} language.
              </p>
            </div>
          </div>

          <DialogFooter className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={handleCopyStorekitLink}>
              <Share2 className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
            <Button onClick={handleViewInStorekitManagement}>
              <FileText className="h-4 w-4 mr-2" />
              View in StoreKit Management
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
