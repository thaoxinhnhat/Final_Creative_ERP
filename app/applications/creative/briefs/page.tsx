"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ArrowLeft,
  Plus,
  Search,
  Calendar as CalendarIcon,
  Target,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  User,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { format, addDays, isBefore } from "date-fns"
import { cn } from "@/lib/utils"

// ============================================
// LOCAL TOAST HOOK (Self-contained)
// ============================================
import * as React from "react"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

type Toast = ToastProps & { id: string }

const ToastContext = React.createContext<{
  toast: (props: ToastProps) => void
  toasts: Toast[]
  dismiss: (id: string) => void
} | null>(null)

function useLocalToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    // Fallback implementation
    return {
      toast: (props: ToastProps) => {
        console.log("Toast:", props.title, props.description)
      },
      toasts: [] as Toast[],
      dismiss: (id: string) => {},
    }
  }
  return context
}

function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const toast = React.useCallback((props: ToastProps) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { ...props, id }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toast, toasts, dismiss }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "p-4 rounded-lg shadow-lg border max-w-sm animate-in slide-in-from-right",
              t.variant === "destructive"
                ? "bg-red-50 border-red-200 text-red-800"
                : "bg-white border-gray-200 text-gray-800"
            )}
          >
            {t.title && <p className="font-semibold text-sm">{t.title}</p>}
            {t.description && <p className="text-sm mt-1">{t.description}</p>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// ============================================
// TYPES
// ============================================
interface Brief {
  id: string
  title: string
  app: string
  campaign: string
  status: "pending" | "in_progress" | "need_fix" | "completed" | "rejected"
  priority: "low" | "medium" | "high" | "urgent"
  deadline: string
  createdDate: string
  updatedDate: string
  creator: string
  assignee?: string
  region: string[]
  kpis: {
    ctr?: number
    cvr?: number
    cpi?: number
    roas?: number
  }
  requirements: string
  attachments: { name: string; url: string }[]
  feedback?: string
  rejectionReason?: string
}

// ============================================
// MOCK DATA (Self-contained)
// ============================================
const mockApps = [
  { id: "1", name: "Fashion Show", icon: "/fashion-app-icon.jpg" },
  { id: "2", name: "Puzzle Master", icon: "/puzzle-game-icon.png" },
  { id: "3", name: "Racing Game", icon: "/racing-game-icon.png" },
  { id: "4", name: "Meditation Pro", icon: "/meditation-app-icon.png" },
]

const regions = [
  { code: "US", name: "United States" },
  { code: "UK", name: "United Kingdom" },
  { code: "VN", name: "Vietnam" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "TH", name: "Thailand" },
  { code: "ID", name: "Indonesia" },
  { code: "GLOBAL", name: "Global" },
]

const initialBriefs: Brief[] = [
  {
    id: "brief-1",
    title: "Summer Campaign - Video Ads",
    app: "Fashion Show",
    campaign: "Summer 2025",
    status: "pending",
    priority: "high",
    deadline: "2025-01-25",
    createdDate: "2025-01-18",
    updatedDate: "2025-01-18",
    creator: "Marketing Team",
    region: ["US", "UK"],
    kpis: { ctr: 2.5, cvr: 1.8, cpi: 0.5 },
    requirements: "Cần 3 video ads 15s và 30s cho campaign mùa hè. Focus vào tính năng mới: Virtual Try-on.",
    attachments: [{ name: "brand-guidelines.pdf", url: "/files/brand-guidelines.pdf" }],
  },
  {
    id: "brief-2",
    title: "Holiday Banner Set",
    app: "Puzzle Master",
    campaign: "Lunar New Year 2025",
    status: "in_progress",
    priority: "urgent",
    deadline: "2025-01-22",
    createdDate: "2025-01-15",
    updatedDate: "2025-01-19",
    creator: "UA Team",
    assignee: "Nguyễn Văn A",
    region: ["VN", "TH", "ID"],
    kpis: { ctr: 3.0, cvr: 2.0 },
    requirements: "Set 5 banner cho Tết Nguyên Đán. Theme: Rồng vàng, màu đỏ chủ đạo.",
    attachments: [],
  },
  {
    id: "brief-3",
    title: "App Icon Refresh",
    app: "Racing Game",
    campaign: "Q1 2025",
    status: "need_fix",
    priority: "medium",
    deadline: "2025-01-28",
    createdDate: "2025-01-10",
    updatedDate: "2025-01-17",
    creator: "Product Team",
    assignee: "Trần Thị B",
    region: ["GLOBAL"],
    kpis: { cvr: 2.5 },
    requirements: "Làm mới icon app, giữ nguyên concept xe đua nhưng modern hơn.",
    attachments: [],
    feedback: "Icon mới chưa nổi bật, cần tăng contrast và thêm hiệu ứng speed.",
  },
  {
    id: "brief-4",
    title: "Meditation Promo Video",
    app: "Meditation Pro",
    campaign: "Wellness Month",
    status: "completed",
    priority: "low",
    deadline: "2025-01-15",
    createdDate: "2025-01-05",
    updatedDate: "2025-01-14",
    creator: "Marketing Team",
    assignee: "Lê Văn C",
    region: ["US", "UK", "JP"],
    kpis: { ctr: 1.8, cvr: 1.2, roas: 2.5 },
    requirements: "Video 30s giới thiệu tính năng Sleep Stories mới.",
    attachments: [],
  },
  {
    id: "brief-5",
    title: "Fashion Show Screenshots",
    app: "Fashion Show",
    campaign: "ASO Update",
    status: "rejected",
    priority: "medium",
    deadline: "2025-01-20",
    createdDate: "2025-01-12",
    updatedDate: "2025-01-18",
    creator: "ASO Team",
    region: ["US"],
    kpis: { cvr: 3.0 },
    requirements: "Cập nhật 6 screenshots cho App Store.",
    attachments: [],
    rejectionReason: "Budget không đủ cho Q1, chuyển sang Q2.",
  },
]

// ============================================
// HELPER COMPONENTS (Self-contained)
// ============================================
const getStatusBadge = (status: Brief["status"]) => {
  const config = {
    pending: { label: "Pending", className: "bg-gray-100 text-gray-700 border-gray-300" },
    in_progress: { label: "In Progress", className: "bg-blue-100 text-blue-700 border-blue-300" },
    need_fix: { label: "Need Fix", className: "bg-orange-100 text-orange-700 border-orange-300" },
    completed: { label: "Completed", className: "bg-green-100 text-green-700 border-green-300" },
    rejected: { label: "Rejected", className: "bg-red-100 text-red-700 border-red-300" },
  }
  const { label, className } = config[status]
  return <Badge variant="outline" className={className}>{label}</Badge>
}

const getPriorityBadge = (priority: Brief["priority"]) => {
  const config = {
    low: { label: "Low", className: "bg-gray-50 text-gray-600" },
    medium: { label: "Medium", className: "bg-blue-50 text-blue-600" },
    high: { label: "High", className: "bg-orange-50 text-orange-600" },
    urgent: { label: "Urgent", className: "bg-red-50 text-red-600" },
  }
  const { label, className } = config[priority]
  return <Badge variant="secondary" className={className}>{label}</Badge>
}

// ============================================
// MAIN COMPONENT
// ============================================
function BriefsPageContent() {
  const router = useRouter()
  const { toast } = useLocalToast()

  // State
  const [briefs, setBriefs] = useState<Brief[]>(initialBriefs)
  const [selectedBrief, setSelectedBrief] = useState<Brief | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [appFilter, setAppFilter] = useState<string>("all")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")

  // Form state for new brief
  const [newBrief, setNewBrief] = useState({
    title: "",
    app: "",
    campaign: "",
    priority: "medium" as Brief["priority"],
    deadline: "",
    region: [] as string[],
    kpis: { ctr: "", cvr: "", cpi: "", roas: "" },
    requirements: "",
  })

  // Filter briefs
  const filteredBriefs = useMemo(() => {
    return briefs.filter((brief) => {
      const matchesSearch =
        brief.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brief.app.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brief.campaign.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || brief.status === statusFilter
      const matchesApp = appFilter === "all" || brief.app === appFilter
      return matchesSearch && matchesStatus && matchesApp
    })
  }, [briefs, searchTerm, statusFilter, appFilter])

  // Group briefs by status
  const briefsByStatus = useMemo(() => {
    return {
      pending: filteredBriefs.filter((b) => b.status === "pending"),
      in_progress: filteredBriefs.filter((b) => b.status === "in_progress"),
      need_fix: filteredBriefs.filter((b) => b.status === "need_fix"),
      completed: filteredBriefs.filter((b) => b.status === "completed"),
      rejected: filteredBriefs.filter((b) => b.status === "rejected"),
    }
  }, [filteredBriefs])

  // Get briefs for selected date
  const briefsForSelectedDate = useMemo(() => {
    if (!selectedDate) return []
    const dateStr = format(selectedDate, "yyyy-MM-dd")
    return briefs.filter((brief) => brief.deadline === dateStr)
  }, [briefs, selectedDate])

  // Get dates with deadlines
  const datesWithDeadlines = useMemo(() => {
    return briefs.reduce((acc, brief) => {
      const date = brief.deadline
      if (!acc[date]) acc[date] = []
      acc[date].push(brief)
      return acc
    }, {} as Record<string, Brief[]>)
  }, [briefs])

  // Handlers
  const handleCreateBrief = () => {
    if (!newBrief.title || !newBrief.app || !newBrief.deadline) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng điền đầy đủ các trường bắt buộc.",
        variant: "destructive",
      })
      return
    }

    const brief: Brief = {
      id: `brief-${Date.now()}`,
      title: newBrief.title,
      app: newBrief.app,
      campaign: newBrief.campaign,
      status: "pending",
      priority: newBrief.priority,
      deadline: newBrief.deadline,
      createdDate: format(new Date(), "yyyy-MM-dd"),
      updatedDate: format(new Date(), "yyyy-MM-dd"),
      creator: "Current User",
      region: newBrief.region,
      kpis: {
        ctr: newBrief.kpis.ctr ? parseFloat(newBrief.kpis.ctr) : undefined,
        cvr: newBrief.kpis.cvr ? parseFloat(newBrief.kpis.cvr) : undefined,
        cpi: newBrief.kpis.cpi ? parseFloat(newBrief.kpis.cpi) : undefined,
        roas: newBrief.kpis.roas ? parseFloat(newBrief.kpis.roas) : undefined,
      },
      requirements: newBrief.requirements,
      attachments: [],
    }

    setBriefs((prev) => [brief, ...prev])
    setCreateDialogOpen(false)
    setNewBrief({
      title: "",
      app: "",
      campaign: "",
      priority: "medium",
      deadline: "",
      region: [],
      kpis: { ctr: "", cvr: "", cpi: "", roas: "" },
      requirements: "",
    })

    toast({
      title: "✓ Tạo brief thành công",
      description: `Brief "${brief.title}" đã được tạo.`,
    })
  }

  const handleApproveBrief = () => {
    if (!selectedBrief) return

    setBriefs((prev) =>
      prev.map((b) =>
        b.id === selectedBrief.id
          ? { ...b, status: "in_progress" as const, updatedDate: format(new Date(), "yyyy-MM-dd") }
          : b
      )
    )
    setApproveDialogOpen(false)
    setSelectedBrief((prev) => prev ? { ...prev, status: "in_progress" } : null)

    toast({
      title: "✓ Đã xác nhận brief",
      description: `Brief "${selectedBrief.title}" đã được chuyển sang In Progress.`,
    })
  }

  const handleRejectBrief = () => {
    if (!selectedBrief || !rejectionReason.trim()) {
      toast({
        title: "Thiếu lý do",
        description: "Vui lòng nhập lý do từ chối.",
        variant: "destructive",
      })
      return
    }

    setBriefs((prev) =>
      prev.map((b) =>
        b.id === selectedBrief.id
          ? {
              ...b,
              status: "rejected" as const,
              rejectionReason: rejectionReason.trim(),
              updatedDate: format(new Date(), "yyyy-MM-dd"),
            }
          : b
      )
    )
    setRejectDialogOpen(false)
    setRejectionReason("")
    setSelectedBrief((prev) =>
      prev ? { ...prev, status: "rejected", rejectionReason: rejectionReason.trim() } : null
    )

    toast({
      title: "Brief đã bị từ chối",
      description: `Brief "${selectedBrief.title}" đã được từ chối.`,
    })
  }

  const handleMarkComplete = (brief: Brief) => {
    setBriefs((prev) =>
      prev.map((b) =>
        b.id === brief.id
          ? { ...b, status: "completed" as const, updatedDate: format(new Date(), "yyyy-MM-dd") }
          : b
      )
    )
    if (selectedBrief?.id === brief.id) {
      setSelectedBrief((prev) => prev ? { ...prev, status: "completed" } : null)
    }
    toast({
      title: "✓ Hoàn thành",
      description: `Brief "${brief.title}" đã được đánh dấu hoàn thành.`,
    })
  }

  const handleRequestFix = (brief: Brief) => {
    setBriefs((prev) =>
      prev.map((b) =>
        b.id === brief.id
          ? { ...b, status: "need_fix" as const, updatedDate: format(new Date(), "yyyy-MM-dd") }
          : b
      )
    )
    if (selectedBrief?.id === brief.id) {
      setSelectedBrief((prev) => prev ? { ...prev, status: "need_fix" } : null)
    }
    toast({
      title: "Yêu cầu chỉnh sửa",
      description: `Brief "${brief.title}" cần được chỉnh sửa.`,
    })
  }

  // Brief Card Component
  const BriefCard = ({ brief }: { brief: Brief }) => {
    const isOverdue = isBefore(new Date(brief.deadline), new Date()) && brief.status !== "completed"
    const isNearDeadline = !isOverdue && isBefore(new Date(brief.deadline), addDays(new Date(), 3))

    return (
      <Card
        className={cn(
          "cursor-pointer hover:shadow-md transition-all border-l-4",
          selectedBrief?.id === brief.id && "ring-2 ring-blue-500",
          brief.status === "completed" && "border-l-green-500",
          brief.status === "in_progress" && "border-l-blue-500",
          brief.status === "need_fix" && "border-l-orange-500",
          brief.status === "pending" && "border-l-gray-400",
          brief.status === "rejected" && "border-l-red-500"
        )}
        onClick={() => setSelectedBrief(brief)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="font-semibold text-sm line-clamp-1">{brief.title}</h4>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedBrief(brief) }}>
                  Xem chi tiết
                </DropdownMenuItem>
                {brief.status === "pending" && (
                  <>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedBrief(brief); setApproveDialogOpen(true) }}>
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                      Xác nhận
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedBrief(brief); setRejectDialogOpen(true) }}>
                      <XCircle className="h-4 w-4 mr-2 text-red-600" />
                      Từ chối
                    </DropdownMenuItem>
                  </>
                )}
                {brief.status === "in_progress" && (
                  <>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleMarkComplete(brief) }}>
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                      Hoàn thành
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleRequestFix(brief) }}>
                      <AlertCircle className="h-4 w-4 mr-2 text-orange-600" />
                      Yêu cầu sửa
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-xs">{brief.app}</Badge>
            {getPriorityBadge(brief.priority)}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <CalendarIcon className="h-3 w-3" />
            <span className={cn(isOverdue && "text-red-600 font-medium", isNearDeadline && "text-orange-600")}>
              {format(new Date(brief.deadline), "dd/MM/yyyy")}
              {isOverdue && " (Quá hạn)"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            {getStatusBadge(brief.status)}
            {brief.assignee && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                <span>{brief.assignee}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Status Section Component
  const StatusSection = ({ 
    title, 
    briefs, 
    color 
  }: { 
    title: string
    briefs: Brief[]
    color: string 
  }) => {
    if (briefs.length === 0) return null
    
    return (
      <div>
        <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${color}`}>
          <span className={`w-2 h-2 rounded-full ${color.replace('text-', 'bg-').replace('-600', '-500').replace('-500', '-500')}`}></span>
          {title} ({briefs.length})
        </h3>
        <div className="space-y-2">
          {briefs.map((brief) => (
            <BriefCard key={brief.id} brief={brief} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.push("/applications")}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Quay lại
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h1 className="text-xl font-bold">Brief & Task Management</h1>
              <p className="text-xs text-muted-foreground">Quản lý brief từ UA Team</p>
            </div>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Tạo Brief mới
          </Button>
        </div>
      </div>

      {/* Main Content - 3 Column Layout */}
      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-12 h-full">
          {/* Left Column - Brief List */}
          <div className="col-span-4 border-r bg-white dark:bg-gray-900 flex flex-col">
            {/* Filters */}
            <div className="p-4 border-b space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm brief..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="need_fix">Need Fix</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={appFilter} onValueChange={setAppFilter}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="App" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả app</SelectItem>
                    {mockApps.map((app) => (
                      <SelectItem key={app.id} value={app.name}>{app.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Brief List */}
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-6">
                {briefsByStatus.pending.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                      Pending ({briefsByStatus.pending.length})
                    </h3>
                    <div className="space-y-2">
                      {briefsByStatus.pending.map((brief) => (
                        <BriefCard key={brief.id} brief={brief} />
                      ))}
                    </div>
                  </div>
                )}

                {briefsByStatus.in_progress.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-blue-600 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      In Progress ({briefsByStatus.in_progress.length})
                    </h3>
                    <div className="space-y-2">
                      {briefsByStatus.in_progress.map((brief) => (
                        <BriefCard key={brief.id} brief={brief} />
                      ))}
                    </div>
                  </div>
                )}

                {briefsByStatus.need_fix.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-orange-600 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                      Need Fix ({briefsByStatus.need_fix.length})
                    </h3>
                    <div className="space-y-2">
                      {briefsByStatus.need_fix.map((brief) => (
                        <BriefCard key={brief.id} brief={brief} />
                      ))}
                    </div>
                  </div>
                )}

                {briefsByStatus.completed.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-green-600 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      Completed ({briefsByStatus.completed.length})
                    </h3>
                    <div className="space-y-2">
                      {briefsByStatus.completed.map((brief) => (
                        <BriefCard key={brief.id} brief={brief} />
                      ))}
                    </div>
                  </div>
                )}

                {briefsByStatus.rejected.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-red-600 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      Rejected ({briefsByStatus.rejected.length})
                    </h3>
                    <div className="space-y-2">
                      {briefsByStatus.rejected.map((brief) => (
                        <BriefCard key={brief.id} brief={brief} />
                      ))}
                    </div>
                  </div>
                )}

                {filteredBriefs.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>Không có brief nào</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Middle Column - Brief Detail */}
          <div className="col-span-5 bg-white dark:bg-gray-900 flex flex-col">
            {selectedBrief ? (
              <>
                <div className="p-4 border-b">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-lg font-bold">{selectedBrief.title}</h2>
                      <p className="text-sm text-muted-foreground">{selectedBrief.campaign}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedBrief.status === "pending" && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => setRejectDialogOpen(true)}>
                            <XCircle className="h-4 w-4 mr-1" />
                            Từ chối
                          </Button>
                          <Button size="sm" onClick={() => setApproveDialogOpen(true)}>
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Xác nhận
                          </Button>
                        </>
                      )}
                      {selectedBrief.status === "in_progress" && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => handleRequestFix(selectedBrief)}>
                            <AlertCircle className="h-4 w-4 mr-1" />
                            Yêu cầu sửa
                          </Button>
                          <Button size="sm" onClick={() => handleMarkComplete(selectedBrief)}>
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Hoàn thành
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <ScrollArea className="flex-1">
                  <div className="p-4 space-y-6">
                    {/* Status & Priority */}
                    <div className="flex items-center gap-3">
                      {getStatusBadge(selectedBrief.status)}
                      {getPriorityBadge(selectedBrief.priority)}
                    </div>

                    {/* Rejection Reason */}
                    {selectedBrief.status === "rejected" && selectedBrief.rejectionReason && (
                      <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                        <p className="text-sm font-medium text-red-700 dark:text-red-300 mb-1">Lý do từ chối:</p>
                        <p className="text-sm text-red-600 dark:text-red-400">{selectedBrief.rejectionReason}</p>
                      </div>
                    )}

                    {/* Feedback */}
                    {selectedBrief.status === "need_fix" && selectedBrief.feedback && (
                      <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800">
                        <p className="text-sm font-medium text-orange-700 dark:text-orange-300 mb-1">Feedback:</p>
                        <p className="text-sm text-orange-600 dark:text-orange-400">{selectedBrief.feedback}</p>
                      </div>
                    )}

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">App</p>
                        <p className="text-sm font-medium">{selectedBrief.app}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Campaign</p>
                        <p className="text-sm font-medium">{selectedBrief.campaign}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Deadline</p>
                        <p className="text-sm font-medium">{format(new Date(selectedBrief.deadline), "dd/MM/yyyy")}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Creator</p>
                        <p className="text-sm font-medium">{selectedBrief.creator}</p>
                      </div>
                      {selectedBrief.assignee && (
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Assignee</p>
                          <p className="text-sm font-medium">{selectedBrief.assignee}</p>
                        </div>
                      )}
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Region</p>
                        <div className="flex flex-wrap gap-1">
                          {selectedBrief.region.map((r) => (
                            <Badge key={r} variant="secondary" className="text-xs">{r}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* KPIs */}
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        KPIs Target
                      </h3>
                      <div className="grid grid-cols-4 gap-3">
                        {selectedBrief.kpis.ctr !== undefined && (
                          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-center">
                            <p className="text-xs text-muted-foreground">CTR</p>
                            <p className="text-lg font-bold text-blue-600">{selectedBrief.kpis.ctr}%</p>
                          </div>
                        )}
                        {selectedBrief.kpis.cvr !== undefined && (
                          <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg text-center">
                            <p className="text-xs text-muted-foreground">CVR</p>
                            <p className="text-lg font-bold text-green-600">{selectedBrief.kpis.cvr}%</p>
                          </div>
                        )}
                        {selectedBrief.kpis.cpi !== undefined && (
                          <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg text-center">
                            <p className="text-xs text-muted-foreground">CPI</p>
                            <p className="text-lg font-bold text-purple-600">${selectedBrief.kpis.cpi}</p>
                          </div>
                        )}
                        {selectedBrief.kpis.roas !== undefined && (
                          <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg text-center">
                            <p className="text-xs text-muted-foreground">ROAS</p>
                            <p className="text-lg font-bold text-orange-600">{selectedBrief.kpis.roas}x</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <Separator />

                    {/* Requirements */}
                    <div>
                      <h3 className="font-semibold mb-3">Requirements</h3>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedBrief.requirements}</p>
                    </div>

                    {/* Attachments */}
                    {selectedBrief.attachments.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <h3 className="font-semibold mb-3">Attachments</h3>
                          <div className="space-y-2">
                            {selectedBrief.attachments.map((file, idx) => (
                              <div key={idx} className="flex items-center gap-2 p-2 border rounded-lg">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{file.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Timeline */}
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-3">Timeline</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-muted-foreground">Tạo:</span>
                          <span>{format(new Date(selectedBrief.createdDate), "dd/MM/yyyy")}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <span className="text-muted-foreground">Cập nhật:</span>
                          <span>{format(new Date(selectedBrief.updatedDate), "dd/MM/yyyy")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <FileText className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p>Chọn một brief để xem chi tiết</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Calendar */}
          <div className="col-span-3 border-l bg-white dark:bg-gray-900 flex flex-col">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Calendar Deadline</h3>
            </div>
            <div className="p-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                modifiers={{
                  hasDeadline: (date) => {
                    const dateStr = format(date, "yyyy-MM-dd")
                    return !!datesWithDeadlines[dateStr]
                  },
                }}
                modifiersStyles={{
                  hasDeadline: {
                    fontWeight: "bold",
                    textDecoration: "underline",
                    color: "#3b82f6",
                  },
                }}
              />
            </div>

            {/* Briefs for selected date */}
            <div className="flex-1 border-t">
              <div className="p-4">
                <h4 className="text-sm font-semibold mb-3">
                  {selectedDate && format(selectedDate, "dd/MM/yyyy")}
                </h4>
                {briefsForSelectedDate.length > 0 ? (
                  <div className="space-y-2">
                    {briefsForSelectedDate.map((brief) => (
                      <Card
                        key={brief.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedBrief(brief)}
                      >
                        <CardContent className="p-3">
                          <p className="text-sm font-medium line-clamp-1">{brief.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{brief.app}</Badge>
                            {getStatusBadge(brief.status)}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Không có deadline nào</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Brief Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tạo Brief mới</DialogTitle>
            <DialogDescription>Điền thông tin brief để gửi cho Creative Team</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tiêu đề *</Label>
                <Input
                  placeholder="VD: Summer Campaign - Video Ads"
                  value={newBrief.title}
                  onChange={(e) => setNewBrief({ ...newBrief, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>App *</Label>
                <Select value={newBrief.app} onValueChange={(v) => setNewBrief({ ...newBrief, app: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn app" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockApps.map((app) => (
                      <SelectItem key={app.id} value={app.name}>{app.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Campaign</Label>
                <Input
                  placeholder="VD: Summer 2025"
                  value={newBrief.campaign}
                  onChange={(e) => setNewBrief({ ...newBrief, campaign: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={newBrief.priority}
                  onValueChange={(v: Brief["priority"]) => setNewBrief({ ...newBrief, priority: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Deadline *</Label>
                <Input
                  type="date"
                  value={newBrief.deadline}
                  onChange={(e) => setNewBrief({ ...newBrief, deadline: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Region</Label>
                <Select
                  value={newBrief.region[0] || ""}
                  onValueChange={(v) => setNewBrief({ ...newBrief, region: [v] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((r) => (
                      <SelectItem key={r.code} value={r.code}>{r.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div>
              <Label className="mb-3 block">KPIs Target</Label>
              <div className="grid grid-cols-4 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">CTR (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="2.5"
                    value={newBrief.kpis.ctr}
                    onChange={(e) => setNewBrief({ ...newBrief, kpis: { ...newBrief.kpis, ctr: e.target.value } })}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">CVR (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="1.8"
                    value={newBrief.kpis.cvr}
                    onChange={(e) => setNewBrief({ ...newBrief, kpis: { ...newBrief.kpis, cvr: e.target.value } })}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">CPI ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.50"
                    value={newBrief.kpis.cpi}
                    onChange={(e) => setNewBrief({ ...newBrief, kpis: { ...newBrief.kpis, cpi: e.target.value } })}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">ROAS (x)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="2.5"
                    value={newBrief.kpis.roas}
                    onChange={(e) => setNewBrief({ ...newBrief, kpis: { ...newBrief.kpis, roas: e.target.value } })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Requirements *</Label>
              <Textarea
                placeholder="Mô tả chi tiết yêu cầu..."
                rows={4}
                value={newBrief.requirements}
                onChange={(e) => setNewBrief({ ...newBrief, requirements: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreateBrief}>
              Tạo Brief
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận Brief</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xác nhận brief "{selectedBrief?.title}"?
              Brief sẽ được chuyển sang trạng thái In Progress.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleApproveBrief}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Từ chối Brief</DialogTitle>
            <DialogDescription>
              Vui lòng nhập lý do từ chối brief "{selectedBrief?.title}".
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Nhập lý do từ chối..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setRejectDialogOpen(false); setRejectionReason("") }}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleRejectBrief}>
              <XCircle className="h-4 w-4 mr-2" />
              Từ chối
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ============================================
// EXPORT WITH TOAST PROVIDER
// ============================================
export default function BriefsPage() {
  return (
    <ToastProvider>
      <BriefsPageContent />
    </ToastProvider>
  )
}
