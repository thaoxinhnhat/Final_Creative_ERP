"use client"

import { useState, useCallback, useMemo, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Save, 
  Send, 
  Loader2, 
  Users, 
  Video, 
  Image as ImageIcon, 
  Smartphone, 
  AlertCircle,
  Upload,
  FolderOpen,
  Paperclip,
  Info,
  AlertTriangle,
  X,
  FileText,
  Package,
  Trash2,
  Zap,
  BookOpen,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { CreateBriefFormData, Platform, BriefAttachment, OrderType, SimpleOrderData, DetailedOrderData, Scene } from "../types"
import { FORMAT_OPTIONS, FORMAT_DESCRIPTIONS } from "../types"
import { RichTextEditor } from "./RichTextEditor"
import { AssetLibraryPicker } from "./AssetLibraryPicker"
import { SimpleOrderFields } from "./SimpleOrderFields"
import { DetailedOrderFields } from "./DetailedOrderFields"

// ============================================
// PROPS
// ============================================
interface CreateBriefModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateBriefFormData & { attachments?: BriefAttachment[] }, isDraft: boolean) => Promise<void> | void
  isSubmitting?: boolean
}

// ============================================
// DEFAULT VALUES
// ============================================
const defaultSimpleOrder: SimpleOrderData = {
  objective: "",
  requirements: "",
  formatRequirements: "",
  notes: "",
}

const defaultDetailedOrder: DetailedOrderData = {
  concept: "",
  mainContext: "",
  scenes: [],
  technicalRequirements: "",
  specialNotes: "",
}

// ============================================
// VALIDATION HELPERS
// ============================================
const MIN_REQUIREMENTS_LENGTH = 20

// Strip HTML tags and get plain text content
function stripHtmlTags(html: string): string {
  if (!html) return ""
  let text = html.replace(/<[^>]*>/g, "")
  text = text.replace(/&nbsp;/g, " ")
  text = text.replace(/&amp;/g, "&")
  text = text.replace(/&lt;/g, "<")
  text = text.replace(/&gt;/g, ">")
  text = text.replace(/&quot;/g, '"')
  text = text.replace(/&#39;/g, "'")
  text = text.replace(/\s+/g, " ").trim()
  return text
}

// Get character count from rich text
function getRequirementsCharCount(html: string): number {
  return stripHtmlTags(html).length
}

function getCharCount(html: string): number {
  return stripHtmlTags(html).length
}

// ============================================
// FORMAT SELECTOR COMPONENT WITH TOOLTIPS
// ============================================
const FormatSelector = ({
  selectedFormats,
  onChange,
  disabled = false,
}: {
  selectedFormats: string[]
  onChange: (formats: string[]) => void
  disabled?: boolean
}) => {
  const videoFormats = FORMAT_OPTIONS.filter(f => f.value.startsWith("video"))
  const staticFormats = FORMAT_OPTIONS.filter(f => f.value.startsWith("static"))
  const otherFormats = FORMAT_OPTIONS.filter(f => !f.value.startsWith("video") && !f.value.startsWith("static"))

  const toggleFormat = (value: string) => {
    if (disabled) return
    if (selectedFormats.includes(value)) {
      onChange(selectedFormats.filter(f => f !== value))
    } else {
      onChange([...selectedFormats, value])
    }
  }

  const FormatCheckbox = ({ format }: { format: typeof FORMAT_OPTIONS[number] }) => {
    const isSelected = selectedFormats.includes(format.value)
    const description = FORMAT_DESCRIPTIONS[format.value]

    return (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <div
            className={cn(
              "flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all",
              isSelected 
                ? "bg-blue-50 border-blue-300 dark:bg-blue-950 dark:border-blue-700" 
                : "bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700 hover:border-gray-400",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => toggleFormat(format.value)}
          >
            <Checkbox
              checked={isSelected}
              disabled={disabled}
              className="pointer-events-none"
            />
            <span className="text-sm flex-1">{format.label}</span>
            
            <TooltipTrigger asChild>
              <button
                type="button"
                className="p-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors" />
              </button>
            </TooltipTrigger>
          </div>
          
          <TooltipContent 
            side="right" 
            align="start"
            className="max-w-xs p-3 animate-in fade-in-0 duration-200"
          >
            <div className="space-y-2 text-xs">
              <div>
                <span className="font-semibold text-blue-600 dark:text-blue-400">📐 Spec:</span>
                <p className="text-muted-foreground mt-0.5">{description?.spec || "N/A"}</p>
              </div>
              <div>
                <span className="font-semibold text-green-600 dark:text-green-400">✅ Tốt cho:</span>
                <p className="text-muted-foreground mt-0.5">{description?.useCases || "N/A"}</p>
              </div>
              <div>
                <span className="font-semibold text-orange-600 dark:text-orange-400">💡 Lưu ý:</span>
                <p className="text-muted-foreground mt-0.5">{description?.tips || "N/A"}</p>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  const FormatGroup = ({ title, icon: Icon, formats }: { title: string; icon: any; formats: typeof FORMAT_OPTIONS[number][] }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Icon className="h-4 w-4" />
        {title}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {formats.map((format) => (
          <FormatCheckbox key={format.value} format={format} />
        ))}
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      <FormatGroup title="Video Formats" icon={Video} formats={videoFormats} />
      <FormatGroup title="Static Banners" icon={ImageIcon} formats={staticFormats} />
      <FormatGroup title="Other Assets" icon={Smartphone} formats={otherFormats} />
      
      {selectedFormats.length > 0 && (
        <div className="flex items-center gap-2 pt-2 border-t">
          <span className="text-sm text-muted-foreground">Đã chọn:</span>
          <div className="flex flex-wrap gap-1">
            {selectedFormats.map(value => {
              const format = FORMAT_OPTIONS.find(f => f.value === value)
              return format ? (
                <Badge key={value} variant="secondary" className="text-xs">
                  {format.label}
                </Badge>
              ) : null
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// HELPER FUNCTIONS FOR FILE HANDLING
// ============================================
const getFileType = (mimeType: string): "image" | "video" | "pdf" | "zip" | "file" => {
  if (mimeType.startsWith("image/")) return "image"
  if (mimeType.startsWith("video/")) return "video"
  if (mimeType === "application/pdf") return "pdf"
  if (mimeType.includes("zip") || mimeType.includes("compressed")) return "zip"
  return "file"
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}

const VALID_FILE_TYPES = [
  "image/jpeg",
  "image/png", 
  "image/gif",
  "image/webp",
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

// ============================================
// FILE ICON COMPONENT
// ============================================
const FileIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "image":
      return <ImageIcon className="h-5 w-5 text-blue-500" />
    case "video":
      return <Video className="h-5 w-5 text-purple-500" />
    case "pdf":
      return <FileText className="h-5 w-5 text-red-500" />
    case "zip":
      return <Package className="h-5 w-5 text-orange-500" />
    default:
      return <FileText className="h-5 w-5 text-gray-500" />
  }
}

// ============================================
// CREATE BRIEF MODAL COMPONENT
// ============================================
export function CreateBriefModal({ open, onOpenChange, onSubmit, isSubmitting = false }: CreateBriefModalProps) {
  const [formData, setFormData] = useState<CreateBriefFormData>({
    title: "",
    appCampaign: "",
    kpiTargets: { ctr: "", cvr: "", cpi: "", roas: "" },
    deadline: "",
    region: "",
    audience: "",
    platform: "iOS",
    formats: [],
    requirements: "", // Empty string - placeholder will be shown by RichTextEditor
    orderType: "simple",
    simpleOrder: { ...defaultSimpleOrder },
    detailedOrder: { ...defaultDetailedOrder },
  })
  
  const [attachments, setAttachments] = useState<BriefAttachment[]>([])
  const [localSubmitting, setLocalSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [libraryPickerOpen, setLibraryPickerOpen] = useState(false)
  const [showValidation, setShowValidation] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Add missing refs
  const titleInputRef = useRef<HTMLInputElement>(null)
  const appCampaignInputRef = useRef<HTMLInputElement>(null)
  const deadlineInputRef = useRef<HTMLInputElement>(null)
  const regionInputRef = useRef<HTMLInputElement>(null)

  const isLoading = isSubmitting || localSubmitting

  // ============================================
  // VALIDATION FUNCTIONS
  // ============================================
  
  // Validate form and return array of error messages
  const validateForm = useCallback((): string[] => {
    const errors: string[] = []
    
    // Only required fields: title and deadline
    if (!formData.title.trim()) errors.push("Tiêu đề brief là bắt buộc")
    if (!formData.deadline) errors.push("Deadline là bắt buộc")
    
    return errors
  }, [formData])

  // Check if form is valid (real-time)
  const isFormValid = useMemo(() => {
    return validateForm().length === 0
  }, [validateForm])

  // Get errors for specific tabs
  const tabErrors = useMemo(() => {
    const errors = validateForm()
    return {
      basic: errors.some(e => 
        e.includes("Tiêu đề") || 
        e.includes("Deadline")
      ),
      order: false, // No required fields in order tab
      attachments: false, // Attachments are optional
    }
  }, [validateForm])

  // Update validation errors when form changes (only if showValidation is true)
  useEffect(() => {
    if (showValidation) {
      setValidationErrors(validateForm())
    }
  }, [formData, showValidation, validateForm])

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setShowValidation(false)
      setValidationErrors([])
    }
  }, [open])

  // ============================================
  // HANDLERS
  // ============================================

  const handleSubmit = async (isDraft: boolean) => {
    if (!isDraft) {
      // Validate only when "Gửi Brief"
      const errors = validateForm()
      if (errors.length > 0) {
        setShowValidation(true)
        setValidationErrors(errors)
        
        // Focus appropriate tab
        if (tabErrors.basic) {
          setActiveTab("basic")
        } else if (tabErrors.order) {
          setActiveTab("order")
        }
        return // Prevent submit
      }
    }

    setLocalSubmitting(true)
    try {
      await onSubmit({ ...formData, attachments }, isDraft)
      // Reset form on success
      setFormData({
        title: "",
        appCampaign: "",
        kpiTargets: { ctr: "", cvr: "", cpi: "", roas: "" },
        deadline: "",
        region: "",
        audience: "",
        platform: "iOS",
        formats: [],
        requirements: "",
        orderType: "simple",
        simpleOrder: { ...defaultSimpleOrder },
        detailedOrder: { ...defaultDetailedOrder },
      })
      setAttachments([])
      setActiveTab("basic")
      setValidationErrors([])
      setShowValidation(false)
    } finally {
      setLocalSubmitting(false)
    }
  }

  // ============================================
  // DRAG & DROP HANDLERS
  // ============================================
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Only set false if leaving the drop zone entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }, [])

  const handleFiles = useCallback((files: File[]) => {
    const validFiles: File[] = []
    const invalidFiles: { name: string; reason: string }[] = []

    files.forEach((file) => {
      if (!VALID_FILE_TYPES.includes(file.type)) {
        invalidFiles.push({ name: file.name, reason: "Định dạng không hỗ trợ" })
      } else if (file.size > MAX_FILE_SIZE) {
        invalidFiles.push({ name: file.name, reason: "Vượt quá 10MB" })
      } else {
        validFiles.push(file)
      }
    })

    if (invalidFiles.length > 0) {
      // Could show a toast here if toast is available
      console.warn("Invalid files:", invalidFiles)
    }

    const newAttachments: BriefAttachment[] = validFiles.map((file, index) => ({
      id: `upload-${Date.now()}-${index}`,
      name: file.name,
      url: URL.createObjectURL(file),
      type: getFileType(file.type),
      size: file.size,
      source: "upload" as const,
    }))

    setAttachments((prev) => [...prev, ...newAttachments])
  }, [])

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFiles(Array.from(files))
    }
    e.target.value = ""
  }, [handleFiles])

  const removeAttachment = useCallback((id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const removeAllAttachments = useCallback(() => {
    setAttachments([])
  }, [])

  // ============================================
  // FORMAT SELECTOR COMPONENT WITH TOOLTIPS
  // ============================================
  const FormatSelector = ({
    selectedFormats,
    onChange,
    disabled = false,
  }: {
    selectedFormats: string[]
    onChange: (formats: string[]) => void
    disabled?: boolean
  }) => {
    const videoFormats = FORMAT_OPTIONS.filter(f => f.value.startsWith("video"))
    const staticFormats = FORMAT_OPTIONS.filter(f => f.value.startsWith("static"))
    const otherFormats = FORMAT_OPTIONS.filter(f => !f.value.startsWith("video") && !f.value.startsWith("static"))

    const toggleFormat = (value: string) => {
      if (disabled) return
      if (selectedFormats.includes(value)) {
        onChange(selectedFormats.filter(f => f !== value))
      } else {
        onChange([...selectedFormats, value])
      }
    }

    const FormatCheckbox = ({ format }: { format: typeof FORMAT_OPTIONS[number] }) => {
      const isSelected = selectedFormats.includes(format.value)
      const description = FORMAT_DESCRIPTIONS[format.value]

      return (
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <div
              className={cn(
                "flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all",
                isSelected 
                  ? "bg-blue-50 border-blue-300 dark:bg-blue-950 dark:border-blue-700" 
                  : "bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700 hover:border-gray-400",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => toggleFormat(format.value)}
            >
              <Checkbox
                checked={isSelected}
                disabled={disabled}
                className="pointer-events-none"
              />
              <span className="text-sm flex-1">{format.label}</span>
              
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="p-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                </button>
              </TooltipTrigger>
            </div>
            
            <TooltipContent 
              side="right" 
              align="start"
              className="max-w-xs p-3 animate-in fade-in-0 duration-200"
            >
              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">📐 Spec:</span>
                  <p className="text-muted-foreground mt-0.5">{description?.spec || "N/A"}</p>
                </div>
                <div>
                  <span className="font-semibold text-green-600 dark:text-green-400">✅ Tốt cho:</span>
                  <p className="text-muted-foreground mt-0.5">{description?.useCases || "N/A"}</p>
                </div>
                <div>
                  <span className="font-semibold text-orange-600 dark:text-orange-400">💡 Lưu ý:</span>
                  <p className="text-muted-foreground mt-0.5">{description?.tips || "N/A"}</p>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    const FormatGroup = ({ title, icon: Icon, formats }: { title: string; icon: any; formats: typeof FORMAT_OPTIONS[number][] }) => (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Icon className="h-4 w-4" />
          {title}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {formats.map((format) => (
            <FormatCheckbox key={format.value} format={format} />
          ))}
        </div>
      </div>
    )

    return (
      <div className="space-y-4">
        <FormatGroup title="Video Formats" icon={Video} formats={videoFormats} />
        <FormatGroup title="Static Banners" icon={ImageIcon} formats={staticFormats} />
        <FormatGroup title="Other Assets" icon={Smartphone} formats={otherFormats} />
        
        {selectedFormats.length > 0 && (
          <div className="flex items-center gap-2 pt-2 border-t">
            <span className="text-sm text-muted-foreground">Đã chọn:</span>
            <div className="flex flex-wrap gap-1">
              {selectedFormats.map(value => {
                const format = FORMAT_OPTIONS.find(f => f.value === value)
                return format ? (
                  <Badge key={value} variant="secondary" className="text-xs">
                    {format.label}
                  </Badge>
                ) : null
              })}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Character count for requirements
  const requirementsCharCount = useMemo(() => {
    return getRequirementsCharCount(formData.requirements)
  }, [formData.requirements])

  return (
    <>
      <Dialog open={open} onOpenChange={(o) => !isLoading && onOpenChange(o)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tạo Brief mới</DialogTitle>
            <DialogDescription>
              Điền thông tin brief để gửi cho Creative Team
            </DialogDescription>
          </DialogHeader>

          {/* Validation Errors Alert */}
          {showValidation && validationErrors.length > 0 && (
            <Alert variant="destructive" className="animate-in slide-in-from-top-2" role="alert">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <p className="font-medium mb-1">Vui lòng kiểm tra lại:</p>
                <ul className="list-disc list-inside text-sm space-y-0.5">
                  {validationErrors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic" className="relative">
                Thông tin cơ bản
                {showValidation && tabErrors.basic && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
                )}
              </TabsTrigger>
              <TabsTrigger value="order" className="relative">
                Nội dung Order
                {showValidation && tabErrors.order && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
                )}
              </TabsTrigger>
              <TabsTrigger value="attachments" className="flex items-center gap-1.5">
                Tài liệu đính kèm
                {attachments.length > 0 && (
                  <Badge variant="secondary" className="h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                    {attachments.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Basic Info Tab - existing code */}
            <TabsContent value="basic" className="space-y-4 mt-4">
              {/* Title - Required */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Tiêu đề brief <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  ref={titleInputRef}
                  placeholder="VD: Summer Campaign - Video Ads"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  disabled={isLoading}
                  className={cn(
                    showValidation && !formData.title.trim() && "border-red-500 focus-visible:ring-red-500"
                  )}
                  aria-invalid={showValidation && !formData.title.trim()}
                />
              </div>

              {/* App/Campaign - Optional */}
              <div className="space-y-2">
                <Label htmlFor="appCampaign">
                  App/Campaign
                </Label>
                <Input
                  id="appCampaign"
                  ref={appCampaignInputRef}
                  placeholder="VD: Fashion Show - Summer 2025"
                  value={formData.appCampaign}
                  onChange={(e) => setFormData({ ...formData, appCampaign: e.target.value })}
                  disabled={isLoading}
                />
              </div>

              {/* KPI Targets */}
              <div>
                <Label className="mb-2 block">KPI Targets</Label>
                <div className="grid grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">CTR (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="2.5"
                      value={formData.kpiTargets.ctr}
                      onChange={(e) => setFormData({ ...formData, kpiTargets: { ...formData.kpiTargets, ctr: e.target.value } })}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">CVR (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="1.8"
                      value={formData.kpiTargets.cvr}
                      onChange={(e) => setFormData({ ...formData, kpiTargets: { ...formData.kpiTargets, cvr: e.target.value } })}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">CPI ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.50"
                      value={formData.kpiTargets.cpi}
                      onChange={(e) => setFormData({ ...formData, kpiTargets: { ...formData.kpiTargets, cpi: e.target.value } })}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">ROAS (x)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="2.0"
                      value={formData.kpiTargets.roas}
                      onChange={(e) => setFormData({ ...formData, kpiTargets: { ...formData.kpiTargets, roas: e.target.value } })}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Deadline & Region */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deadline">
                    Deadline <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="deadline"
                    ref={deadlineInputRef}
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    disabled={isLoading}
                    className={cn(
                      showValidation && !formData.deadline && "border-red-500 focus-visible:ring-red-500"
                    )}
                    aria-invalid={showValidation && !formData.deadline}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">
                    Region
                  </Label>
                  <Input
                    id="region"
                    ref={regionInputRef}
                    placeholder="VD: US, UK, VN"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Audience */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  Đối tượng mục tiêu
                </Label>
                <Input
                  placeholder="VD: Casual gamers 18-35, iOS users..."
                  value={formData.audience || ""}
                  onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">Mô tả đối tượng người dùng mục tiêu của creative</p>
              </div>

              {/* Platform - Optional */}
              <div className="space-y-2">
                <Label>
                  Platform
                </Label>
                <Select
                  value={formData.platform}
                  onValueChange={(v: Platform) => setFormData({ ...formData, platform: v })}
                  disabled={isLoading}
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

              {/* Formats - Optional */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Định dạng yêu cầu
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p className="text-xs">Hover vào icon ⓘ của mỗi format để xem specs chi tiết</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <p className="text-xs text-muted-foreground mb-2">Chọn định dạng creative cần sản xuất</p>
                <div className="rounded-lg">
                  <FormatSelector
                    selectedFormats={formData.formats}
                    onChange={(formats) => setFormData({ ...formData, formats })}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Order Content Tab - NEW */}
            <TabsContent value="order" className="space-y-6 mt-4">
              {/* Order Type Selector */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Loại Order</Label>
                <RadioGroup
                  value={formData.orderType}
                  onValueChange={(value: OrderType) => setFormData({ ...formData, orderType: value })}
                  disabled={isLoading}
                  className="grid grid-cols-2 gap-4"
                >
                  {/* Simple Order Option */}
                  <Label
                    htmlFor="order-simple"
                    className={cn(
                      "cursor-pointer"
                    )}
                  >
                    <Card className={cn(
                      "transition-all",
                      formData.orderType === "simple" 
                        ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-blue-500" 
                        : "hover:border-gray-400"
                    )}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <RadioGroupItem value="simple" id="order-simple" className="mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Zap className="h-4 w-4 text-yellow-500" />
                              <span className="font-semibold">Order Ngắn</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Brief tóm tắt với mục tiêu, yêu cầu và định dạng. Phù hợp cho các task đơn giản.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Label>

                  {/* Detailed Order Option */}
                  <Label
                    htmlFor="order-detailed"
                    className={cn(
                      "cursor-pointer"
                    )}
                  >
                    <Card className={cn(
                      "transition-all",
                      formData.orderType === "detailed" 
                        ? "border-purple-500 bg-purple-50/50 dark:bg-purple-950/30 ring-2 ring-purple-500" 
                        : "hover:border-gray-400"
                    )}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <RadioGroupItem value="detailed" id="order-detailed" className="mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <BookOpen className="h-4 w-4 text-purple-500" />
                              <span className="font-semibold">Order Chi Tiết</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Script đầy đủ với concept, bối cảnh và các scenes. Phù hợp cho video phức tạp.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Label>
                </RadioGroup>
              </div>

              <Separator />

              {/* Conditional Order Fields */}
              {formData.orderType === "simple" ? (
                <SimpleOrderFields
                  data={formData.simpleOrder || defaultSimpleOrder}
                  onChange={(simpleOrder) => setFormData({ ...formData, simpleOrder })}
                  disabled={isLoading}
                  showValidation={showValidation}
                />
              ) : (
                <DetailedOrderFields
                  data={formData.detailedOrder || defaultDetailedOrder}
                  onChange={(detailedOrder) => setFormData({ ...formData, detailedOrder })}
                  disabled={isLoading}
                  showValidation={showValidation}
                />
              )}
            </TabsContent>

            {/* Attachments Tab - existing code */}
            <TabsContent value="attachments" className="mt-4 space-y-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Paperclip className="h-4 w-4 text-muted-foreground" />
                  Thêm tài liệu đính kèm
                </Label>

                {/* NEW: Unified Drag & Drop Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={cn(
                    "border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200",
                    isDragging
                      ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 scale-[1.02]"
                      : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600",
                    isLoading && "opacity-50 pointer-events-none"
                  )}
                >
                  <div className="flex flex-col items-center gap-4">
                    {/* Icons */}
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-3 rounded-full transition-colors",
                        isDragging ? "bg-blue-100 dark:bg-blue-900" : "bg-gray-100 dark:bg-gray-800"
                      )}>
                        <Upload className={cn(
                          "h-6 w-6 transition-colors",
                          isDragging ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
                        )} />
                      </div>
                      <div className={cn(
                        "p-3 rounded-full transition-colors",
                        isDragging ? "bg-green-100 dark:bg-green-900" : "bg-gray-100 dark:bg-gray-800"
                      )}>
                        <FolderOpen className={cn(
                          "h-6 w-6 transition-colors",
                          isDragging ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"
                        )} />
                      </div>
                    </div>

                    {/* Text */}
                    <div>
                      <p className={cn(
                        "text-base font-medium transition-colors",
                        isDragging ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"
                      )}>
                        {isDragging ? "📥 Thả file vào đây..." : "Kéo thả file vào đây"}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        hoặc click để chọn từ máy hoặc thư viện
                      </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isLoading}
                        className="bg-white dark:bg-gray-900"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Browse Files
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setLibraryPickerOpen(true)}
                        disabled={isLoading}
                        className="bg-white dark:bg-gray-900"
                      >
                        <FolderOpen className="h-4 w-4 mr-2" />
                        Asset Library
                      </Button>
                    </div>

                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*,video/*,.pdf,.zip"
                      className="hidden"
                      onChange={handleFileInputChange}
                      disabled={isLoading}
                    />
                  </div>

                  {/* Supported formats */}
                  <p className="text-xs text-muted-foreground mt-4">
                    Hỗ trợ: Images (JPG, PNG, GIF, WebP), Videos (MP4, MOV), PDF, ZIP • Tối đa 10MB/file
                  </p>
                </div>
              </div>

              {/* Attached Files List */}
              {attachments.length > 0 && (
                <>
                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <span>Đã chọn</span>
                        <Badge variant="secondary" className="text-xs">
                          {attachments.length} files
                        </Badge>
                      </Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeAllAttachments}
                        disabled={isLoading}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Xóa tất cả
                      </Button>
                    </div>

                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {attachments.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                        >
                          {/* Preview/Icon */}
                          {file.type === "image" && file.url ? (
                            <img
                              src={file.url}
                              alt={file.name}
                              className="w-12 h-12 object-cover rounded-lg border flex-shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg flex-shrink-0">
                              <FileIcon type={file.type} />
                            </div>
                          )}

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{file.name}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{formatFileSize(file.size || 0)}</span>
                              {file.source && (
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-[10px] px-1.5 py-0",
                                    file.source === "library"
                                      ? "bg-green-50 text-green-700 border-green-200"
                                      : "bg-blue-50 text-blue-700 border-blue-200"
                                  )}
                                >
                                  {file.source === "library" ? "Library" : "Upload"}
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Remove button */}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAttachment(file.id)}
                            disabled={isLoading}
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Empty state */}
              {attachments.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  <p className="text-sm">Chưa có tài liệu nào được đính kèm</p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            {/* Save Draft Button - Always enabled */}
            <Button 
              variant="outline" 
              onClick={() => handleSubmit(true)}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Lưu nháp
            </Button>
            
            {/* Submit Button - Disabled when form invalid */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex">
                    <Button 
                      onClick={() => handleSubmit(false)}
                      disabled={isLoading || !isFormValid}
                      className={cn(
                        !isFormValid && "opacity-50 cursor-not-allowed"
                      )}
                      aria-label={!isFormValid ? "Vui lòng điền đầy đủ thông tin bắt buộc" : "Gửi brief cho Creative Team"}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4 mr-2" />
                      )}
                      Gửi Brief
                    </Button>
                  </span>
                </TooltipTrigger>
                {!isFormValid && (
                  <TooltipContent side="top">
                    <p className="text-xs">Vui lòng điền đầy đủ thông tin bắt buộc</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Asset Library Picker Modal */}
      <AssetLibraryPicker
        open={libraryPickerOpen}
        onOpenChange={setLibraryPickerOpen}
        onSelect={(selectedAssets) => {
          const existingIds = new Set(attachments.filter(a => a.source === 'library').map(a => a.libraryAssetId))
          const newAssets = selectedAssets.filter(a => !existingIds.has(a.libraryAssetId))
          setAttachments(prev => [...prev, ...newAssets])
        }}
        selectedIds={attachments.filter(a => a.source === 'library').map(a => a.libraryAssetId!)}
      />
    </>
  )
}

export default CreateBriefModal
