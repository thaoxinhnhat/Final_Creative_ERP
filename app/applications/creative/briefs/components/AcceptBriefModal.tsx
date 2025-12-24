"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
    CheckCircle2,
    Loader2,
    Users,
    Flag,
    Palette,
    UserCheck,
    Upload,
    X,
    File,
    FileText,
    Video,
    Image as ImageIcon,
    FolderOpen,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Brief, TeamMember, Priority, BriefAttachment } from "../types"
import { AssetLibraryPicker } from "./AssetLibraryPicker"

// ============================================
// FORM DATA TYPE
// ============================================
export interface AcceptBriefFormData {
    mode: "assign" | "send_to_design"
    // Assign mode fields
    assignedTo: string[]
    priority: Priority
    leadObjective: string
    // Send to design mode fields
    designRequirements: string
    designAttachments: BriefAttachment[]
}

// ============================================
// PROPS
// ============================================
interface AcceptBriefModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    brief: Brief | null
    teamMembers: TeamMember[]
    onAccept: (data: AcceptBriefFormData) => Promise<void> | void
    isSubmitting?: boolean
}

// ============================================
// ASSIGNEE SELECTOR COMPONENT
// ============================================
const AssigneeSelector = ({
    selectedIds,
    onChange,
    teamMembers,
    disabled = false,
}: {
    selectedIds: string[]
    onChange: (ids: string[]) => void
    teamMembers: TeamMember[]
    disabled?: boolean
}) => {
    const creatives = teamMembers.filter(m => m.role === "creative")

    if (creatives.length === 0) {
        return <p className="text-sm text-muted-foreground italic">Không có creative nào trong team</p>
    }

    return (
        <div className="space-y-2 max-h-[180px] overflow-y-auto">
            {creatives.map((member) => {
                const isSelected = selectedIds.includes(member.id)
                return (
                    <div
                        key={member.id}
                        className={cn(
                            "flex items-center gap-3 p-2.5 rounded-lg border transition-all cursor-pointer",
                            isSelected
                                ? "bg-blue-50 dark:bg-blue-950 border-blue-300 dark:border-blue-700 shadow-sm"
                                : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800",
                            disabled && "opacity-50 cursor-not-allowed"
                        )}
                        onClick={() => {
                            if (disabled) return
                            if (isSelected) {
                                onChange(selectedIds.filter(id => id !== member.id))
                            } else {
                                onChange([...selectedIds, member.id])
                            }
                        }}
                    >
                        <Checkbox
                            id={`assignee-${member.id}`}
                            checked={isSelected}
                            disabled={disabled}
                            className="pointer-events-none"
                        />
                        <Avatar className="h-8 w-8">
                            <AvatarFallback className={cn(
                                "text-xs font-medium",
                                isSelected
                                    ? "bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200"
                                    : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                            )}>
                                {member.avatar}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p className="text-sm font-medium">{member.name}</p>
                            <p className="text-xs text-muted-foreground capitalize">{member.role.replace("_", " ")}</p>
                        </div>
                        {isSelected && (
                            <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        )}
                    </div>
                )
            })}
        </div>
    )
}

// ============================================
// PRIORITY SELECTOR COMPONENT
// ============================================
const PrioritySelector = ({
    value,
    onChange,
    disabled = false,
}: {
    value: Priority
    onChange: (value: Priority) => void
    disabled?: boolean
}) => {
    const priorities: { value: Priority; label: string; emoji: string; color: string; activeColor: string }[] = [
        { value: "low", label: "Thấp", emoji: "🟢", color: "border-gray-200 hover:border-gray-400", activeColor: "border-gray-500 bg-gray-50 dark:bg-gray-800" },
        { value: "medium", label: "Trung bình", emoji: "🟡", color: "border-gray-200 hover:border-blue-400", activeColor: "border-blue-500 bg-blue-50 dark:bg-blue-950" },
        { value: "high", label: "Cao", emoji: "🔴", color: "border-gray-200 hover:border-red-400", activeColor: "border-red-500 bg-red-50 dark:bg-red-950" },
    ]

    return (
        <div className="grid grid-cols-3 gap-2">
            {priorities.map((p) => (
                <button
                    key={p.value}
                    type="button"
                    onClick={() => !disabled && onChange(p.value)}
                    disabled={disabled}
                    className={cn(
                        "px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all flex items-center justify-center gap-2",
                        value === p.value ? p.activeColor : p.color,
                        disabled && "opacity-50 cursor-not-allowed"
                    )}
                >
                    <span>{p.emoji}</span>
                    <span>{p.label}</span>
                </button>
            ))}
        </div>
    )
}

// ============================================
// FILE UPLOADER COMPONENT (Inline)
// ============================================
const getFileIcon = (type: string) => {
    switch (type) {
        case "pdf": return FileText
        case "video": return Video
        case "image": return ImageIcon
        default: return File
    }
}

const getFileType = (file: File): "image" | "video" | "pdf" | "zip" | "file" => {
    if (file.type.startsWith("image/")) return "image"
    if (file.type.startsWith("video/")) return "video"
    if (file.type === "application/pdf") return "pdf"
    if (file.type === "application/zip" || file.name.endsWith(".zip")) return "zip"
    return "file"
}

// ============================================
// ACCEPT BRIEF MODAL COMPONENT
// ============================================
export function AcceptBriefModal({
    open,
    onOpenChange,
    brief,
    teamMembers,
    onAccept,
    isSubmitting = false,
}: AcceptBriefModalProps) {
    const [formData, setFormData] = useState<AcceptBriefFormData>({
        mode: "assign",
        assignedTo: [],
        priority: "medium",
        leadObjective: "",
        designRequirements: "",
        designAttachments: [],
    })
    const [localSubmitting, setLocalSubmitting] = useState(false)
    const [dragActive, setDragActive] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [assetPickerOpen, setAssetPickerOpen] = useState(false)

    const isLoading = isSubmitting || localSubmitting

    // Reset form when modal opens
    useEffect(() => {
        if (open && brief) {
            setFormData({
                mode: "assign",
                assignedTo: [],
                priority: "medium",
                leadObjective: "",
                designRequirements: "",
                designAttachments: [],
            })
        }
    }, [open, brief])

    // Handle drag events
    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }, [])

    // Handle file drop
    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (isLoading) return

        const files = e.dataTransfer.files
        if (files && files.length > 0) {
            await handleFilesUpload(files)
        }
    }, [isLoading])

    // Handle file selection
    const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            await handleFilesUpload(files)
        }
        e.target.value = ""
    }, [])

    // Simulate file upload
    const handleFilesUpload = async (files: FileList) => {
        setIsUploading(true)
        setUploadProgress(0)

        const newAttachments: BriefAttachment[] = []

        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            // Simulate upload progress
            setUploadProgress(((i + 1) / files.length) * 100)

            // Create a fake URL for demo (in real app, this would be from API)
            const fakeUrl = URL.createObjectURL(file)

            newAttachments.push({
                id: `upload-${Date.now()}-${i}`,
                name: file.name,
                url: fakeUrl,
                type: getFileType(file),
                size: file.size,
                source: "upload",
            })

            // Simulate network delay
            await new Promise(r => setTimeout(r, 300))
        }

        setFormData(prev => ({
            ...prev,
            designAttachments: [...prev.designAttachments, ...newAttachments],
        }))
        setIsUploading(false)
        setUploadProgress(0)
    }

    // Handle asset library selection
    const handleAssetSelect = (assets: BriefAttachment[]) => {
        setFormData(prev => ({
            ...prev,
            designAttachments: [...prev.designAttachments, ...assets],
        }))
    }

    // Remove attachment
    const removeAttachment = (id: string) => {
        setFormData(prev => ({
            ...prev,
            designAttachments: prev.designAttachments.filter(a => a.id !== id),
        }))
    }

    const handleSubmit = async () => {
        setLocalSubmitting(true)
        try {
            await onAccept(formData)
        } finally {
            setLocalSubmitting(false)
        }
    }

    // Validation
    const canSubmit = () => {
        if (formData.mode === "assign") {
            return formData.assignedTo.length > 0
        } else {
            return formData.designRequirements.trim().length > 0
        }
    }

    if (!brief) return null

    return (
        <>
            <Dialog open={open} onOpenChange={(o) => !isLoading && onOpenChange(o)}>
                <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col p-0">
                    {/* Header */}
                    <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950">
                        <DialogTitle className="text-xl flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            Nhận Brief
                        </DialogTitle>
                        <DialogDescription>
                            Chọn cách xử lý brief &quot;{brief.title}&quot;
                        </DialogDescription>
                    </DialogHeader>

                    {/* Content */}
                    <ScrollArea className="flex-1">
                        <div className="p-6 space-y-6">
                            {/* Mode Selection */}
                            <Card className="shadow-sm">
                                <CardContent className="p-4">
                                    <Label className="text-sm font-medium mb-4 block">Chọn cách xử lý</Label>
                                    <RadioGroup
                                        value={formData.mode}
                                        onValueChange={(v) => setFormData({ ...formData, mode: v as "assign" | "send_to_design" })}
                                        disabled={isLoading}
                                        className="grid grid-cols-2 gap-4"
                                    >
                                        {/* Option 1: Assign to Creative */}
                                        <label
                                            htmlFor="mode-assign"
                                            className={cn(
                                                "flex flex-col items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                                                formData.mode === "assign"
                                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950 shadow-md"
                                                    : "border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:bg-gray-50 dark:hover:bg-gray-800",
                                                isLoading && "opacity-50 cursor-not-allowed"
                                            )}
                                        >
                                            <RadioGroupItem value="assign" id="mode-assign" disabled={isLoading} className="sr-only" />
                                            <div className={cn(
                                                "h-12 w-12 rounded-full flex items-center justify-center",
                                                formData.mode === "assign"
                                                    ? "bg-blue-100 dark:bg-blue-900"
                                                    : "bg-gray-100 dark:bg-gray-800"
                                            )}>
                                                <UserCheck className={cn(
                                                    "h-6 w-6",
                                                    formData.mode === "assign" ? "text-blue-600" : "text-gray-500"
                                                )} />
                                            </div>
                                            <div className="text-center">
                                                <p className="font-semibold text-sm">Người làm Brief</p>
                                                <p className="text-xs text-muted-foreground mt-1">Phân công cho Creative thực hiện</p>
                                            </div>
                                            {formData.mode === "assign" && (
                                                <Badge className="bg-blue-600">Đang chọn</Badge>
                                            )}
                                        </label>

                                        {/* Option 2: Send to Design */}
                                        <label
                                            htmlFor="mode-design"
                                            className={cn(
                                                "flex flex-col items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                                                formData.mode === "send_to_design"
                                                    ? "border-purple-500 bg-purple-50 dark:bg-purple-950 shadow-md"
                                                    : "border-gray-200 dark:border-gray-700 hover:border-purple-300 hover:bg-gray-50 dark:hover:bg-gray-800",
                                                isLoading && "opacity-50 cursor-not-allowed"
                                            )}
                                        >
                                            <RadioGroupItem value="send_to_design" id="mode-design" disabled={isLoading} className="sr-only" />
                                            <div className={cn(
                                                "h-12 w-12 rounded-full flex items-center justify-center",
                                                formData.mode === "send_to_design"
                                                    ? "bg-purple-100 dark:bg-purple-900"
                                                    : "bg-gray-100 dark:bg-gray-800"
                                            )}>
                                                <Palette className={cn(
                                                    "h-6 w-6",
                                                    formData.mode === "send_to_design" ? "text-purple-600" : "text-gray-500"
                                                )} />
                                            </div>
                                            <div className="text-center">
                                                <p className="font-semibold text-sm">Gửi sang Design</p>
                                                <p className="text-xs text-muted-foreground mt-1">Chuyển trực tiếp cho Design team</p>
                                            </div>
                                            {formData.mode === "send_to_design" && (
                                                <Badge className="bg-purple-600">Đang chọn</Badge>
                                            )}
                                        </label>
                                    </RadioGroup>
                                </CardContent>
                            </Card>

                            {/* Conditional Content based on Mode */}
                            {formData.mode === "assign" ? (
                                /* ========== ASSIGN MODE ========== */
                                <div className="space-y-5">
                                    {/* Assignee Selection */}
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-sm">
                                            <Users className="h-4 w-4 text-blue-600" />
                                            Chọn người thực hiện
                                            <span className="text-red-500">*</span>
                                        </Label>
                                        <AssigneeSelector
                                            selectedIds={formData.assignedTo}
                                            onChange={(ids) => setFormData({ ...formData, assignedTo: ids })}
                                            teamMembers={teamMembers}
                                            disabled={isLoading}
                                        />
                                        {formData.assignedTo.length > 0 && (
                                            <p className="text-xs text-blue-600">
                                                ✓ Đã chọn {formData.assignedTo.length} người
                                            </p>
                                        )}
                                    </div>

                                    {/* Priority Selection */}
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-sm">
                                            <Flag className="h-4 w-4 text-blue-600" />
                                            Độ ưu tiên
                                        </Label>
                                        <PrioritySelector
                                            value={formData.priority}
                                            onChange={(v) => setFormData({ ...formData, priority: v })}
                                            disabled={isLoading}
                                        />
                                    </div>

                                    {/* Lead Objective */}
                                    <div className="space-y-2">
                                        <Label className="text-sm text-muted-foreground">
                                            Mục tiêu / Hướng dẫn (tùy chọn)
                                        </Label>
                                        <Textarea
                                            placeholder="Nhập mục tiêu chi tiết hoặc hướng dẫn thực hiện..."
                                            value={formData.leadObjective}
                                            onChange={(e) => setFormData({ ...formData, leadObjective: e.target.value })}
                                            rows={3}
                                            disabled={isLoading}
                                            className="resize-none"
                                        />
                                    </div>
                                </div>
                            ) : (
                                /* ========== SEND TO DESIGN MODE ========== */
                                <div className="space-y-5">
                                    {/* Design Requirements */}
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-sm">
                                            <Palette className="h-4 w-4 text-purple-600" />
                                            Yêu cầu thiết kế
                                            <span className="text-red-500">*</span>
                                        </Label>
                                        <Textarea
                                            placeholder="Mô tả yêu cầu thiết kế chi tiết...&#10;VD: Cần banner 1200x628 với theme summer, màu chủ đạo xanh biển..."
                                            value={formData.designRequirements}
                                            onChange={(e) => setFormData({ ...formData, designRequirements: e.target.value })}
                                            rows={4}
                                            disabled={isLoading}
                                            className="resize-none"
                                        />
                                    </div>

                                    {/* File Upload Area */}
                                    <div className="space-y-3">
                                        <Label className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Upload className="h-4 w-4" />
                                            Hình ảnh / Video mô tả (tùy chọn)
                                        </Label>

                                        {/* Drop Zone */}
                                        <div
                                            className={cn(
                                                "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
                                                dragActive && "border-purple-500 bg-purple-50 dark:bg-purple-950",
                                                isLoading && "opacity-50 cursor-not-allowed",
                                                !isLoading && "cursor-pointer hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900"
                                            )}
                                            onDragEnter={handleDrag}
                                            onDragLeave={handleDrag}
                                            onDragOver={handleDrag}
                                            onDrop={handleDrop}
                                            onClick={() => !isLoading && document.getElementById("design-file-input")?.click()}
                                        >
                                            <input
                                                id="design-file-input"
                                                type="file"
                                                multiple
                                                className="hidden"
                                                onChange={handleFileSelect}
                                                disabled={isLoading}
                                                accept="image/*,video/*,.pdf"
                                            />

                                            {isUploading ? (
                                                <div className="space-y-3">
                                                    <Loader2 className="h-8 w-8 mx-auto text-purple-500 animate-spin" />
                                                    <p className="text-sm text-muted-foreground">Đang upload...</p>
                                                    <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
                                                </div>
                                            ) : (
                                                <>
                                                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                                    <p className="text-sm font-medium">Kéo thả file hoặc click để upload</p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        Hỗ trợ: Images, Videos, PDF
                                                    </p>
                                                </>
                                            )}
                                        </div>

                                        {/* Asset Library Button */}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setAssetPickerOpen(true)}
                                            disabled={isLoading}
                                            className="w-full"
                                        >
                                            <FolderOpen className="h-4 w-4 mr-2" />
                                            Chọn từ Asset Library
                                        </Button>

                                        {/* Uploaded Files */}
                                        {formData.designAttachments.length > 0 && (
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium text-muted-foreground">
                                                    Files đã thêm ({formData.designAttachments.length})
                                                </p>
                                                <div className="space-y-2 max-h-[150px] overflow-y-auto">
                                                    {formData.designAttachments.map((file) => {
                                                        const Icon = getFileIcon(file.type)
                                                        return (
                                                            <div
                                                                key={file.id}
                                                                className="flex items-center gap-3 p-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                                            >
                                                                <div className="p-2 bg-white dark:bg-gray-700 rounded">
                                                                    <Icon className="h-4 w-4 text-muted-foreground" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-medium truncate">{file.name}</p>
                                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                        {file.size && (
                                                                            <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                                                        )}
                                                                        {file.source === "library" && (
                                                                            <Badge variant="secondary" className="text-[10px] px-1 py-0">
                                                                                Library
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        removeAttachment(file.id)
                                                                    }}
                                                                    disabled={isLoading}
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    {/* Footer */}
                    <DialogFooter className="px-6 py-4 border-t bg-gray-50 dark:bg-gray-900">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isLoading || !canSubmit()}
                            className={cn(
                                "min-w-[140px]",
                                formData.mode === "assign"
                                    ? "bg-blue-600 hover:bg-blue-700"
                                    : "bg-purple-600 hover:bg-purple-700",
                                !canSubmit() && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                            )}
                            {formData.mode === "assign" ? "Phân công" : "Gửi sang Design"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Asset Library Picker */}
            <AssetLibraryPicker
                open={assetPickerOpen}
                onOpenChange={setAssetPickerOpen}
                onSelect={handleAssetSelect}
                selectedIds={formData.designAttachments.filter(a => a.libraryAssetId).map(a => a.libraryAssetId!)}
            />
        </>
    )
}

export default AcceptBriefModal
