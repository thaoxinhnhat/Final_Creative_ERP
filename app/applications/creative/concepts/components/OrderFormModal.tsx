"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Palette,
    Sparkles,
    Camera,
    Loader2,
    Calendar,
    FileText,
    Users
} from "lucide-react"
import type { TeamType, Concept, OrderAssignment } from "../types"
import { TEAM_CONFIG } from "../types"

// ============================================
// TEAM-SPECIFIC FORM FIELDS
// ============================================
interface DesignFormData {
    designType: "banner" | "video" | "icon" | "screenshot" | "other"
    dimensions: string
    colorScheme: string
    referenceLinks: string
    notes: string
}

interface ArtStylistFormData {
    styleDirection: string
    moodBoard: string
    characterDescription: string
    sceneDescription: string
    notes: string
}

interface AIProducerFormData {
    modelType: "image" | "video" | "text2image" | "other"
    promptDescription: string
    styleReference: string
    iterations: number
    notes: string
}

// ============================================
// ORDER FORM MODAL COMPONENT
// ============================================
interface OrderFormModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    concept: Concept | null
    teamType: TeamType
    onSubmit: (data: OrderAssignment) => void
    teamMembers?: { id: string; name: string; role: string }[]
}

export function OrderFormModal({
    open,
    onOpenChange,
    concept,
    teamType,
    onSubmit,
    teamMembers = [],
}: OrderFormModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [deadline, setDeadline] = useState("")
    const [assignedTo, setAssignedTo] = useState<string[]>([])
    const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")

    // Design form state
    const [designData, setDesignData] = useState<DesignFormData>({
        designType: "banner",
        dimensions: "",
        colorScheme: "",
        referenceLinks: "",
        notes: "",
    })

    // Art & Stylist form state
    const [artData, setArtData] = useState<ArtStylistFormData>({
        styleDirection: "",
        moodBoard: "",
        characterDescription: "",
        sceneDescription: "",
        notes: "",
    })

    // AI Producer form state
    const [aiData, setAIData] = useState<AIProducerFormData>({
        modelType: "image",
        promptDescription: "",
        styleReference: "",
        iterations: 3,
        notes: "",
    })

    const teamConfig = TEAM_CONFIG[teamType]
    const filteredMembers = teamMembers.filter(m => m.role === teamType || m.role === `lead_${teamType}`)

    const handleSubmit = async () => {
        if (!concept || !deadline) return

        setIsSubmitting(true)
        try {
            const orderData: OrderAssignment = {
                teamType,
                assignedTo,
                assignedAt: new Date().toISOString(),
                assignedBy: "current-user", // TODO: Get from context
                deadline, // Required deadline field
                status: "pending",
            }

            await onSubmit(orderData)
            onOpenChange(false)
            resetForm()
        } finally {
            setIsSubmitting(false)
        }
    }

    const getTeamSpecificRequirements = (): string => {
        switch (teamType) {
            case "design":
                return JSON.stringify(designData)
            case "art_stylist":
                return JSON.stringify(artData)
            case "ai_producer":
                return JSON.stringify(aiData)
            default:
                return ""
        }
    }

    const resetForm = () => {
        setDeadline("")
        setAssignedTo([])
        setPriority("medium")
        setDesignData({ designType: "banner", dimensions: "", colorScheme: "", referenceLinks: "", notes: "" })
        setArtData({ styleDirection: "", moodBoard: "", characterDescription: "", sceneDescription: "", notes: "" })
        setAIData({ modelType: "image", promptDescription: "", styleReference: "", iterations: 3, notes: "" })
    }

    const TeamIcon = teamType === "design" ? Palette : teamType === "art_stylist" ? Camera : Sparkles

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${teamConfig?.bgColor || 'bg-gray-100'}`}>
                            <TeamIcon className={`h-5 w-5 ${teamConfig?.color || 'text-gray-600'}`} />
                        </div>
                        <div>
                            <span>Tạo Order cho {teamConfig?.label || teamType}</span>
                            {concept && (
                                <p className="text-sm font-normal text-muted-foreground mt-1">
                                    Concept: {concept.title}
                                </p>
                            )}
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Common Fields */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Deadline <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="date"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Độ ưu tiên</Label>
                            <Select value={priority} onValueChange={(v) => setPriority(v as typeof priority)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">🟢 Thấp</SelectItem>
                                    <SelectItem value="medium">🟡 Trung bình</SelectItem>
                                    <SelectItem value="high">🔴 Cao</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Team Member Assignment */}
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Phân công
                        </Label>
                        <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
                            {filteredMembers.length > 0 ? (
                                filteredMembers.map((member) => (
                                    <label
                                        key={member.id}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer transition
                      ${assignedTo.includes(member.id)
                                                ? 'bg-blue-100 dark:bg-blue-900 border-blue-300'
                                                : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                    >
                                        <Checkbox
                                            checked={assignedTo.includes(member.id)}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setAssignedTo([...assignedTo, member.id])
                                                } else {
                                                    setAssignedTo(assignedTo.filter(id => id !== member.id))
                                                }
                                            }}
                                        />
                                        <span className="text-sm">{member.name}</span>
                                    </label>
                                ))
                            ) : (
                                <span className="text-sm text-muted-foreground">Không có thành viên trong team này</span>
                            )}
                        </div>
                    </div>

                    {/* Team-Specific Fields */}
                    <div className="border-t pt-4">
                        <h4 className="font-medium mb-4 flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Chi tiết yêu cầu cho {teamConfig?.label}
                        </h4>

                        {teamType === "design" && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Loại thiết kế</Label>
                                        <Select
                                            value={designData.designType}
                                            onValueChange={(v) => setDesignData({ ...designData, designType: v as DesignFormData["designType"] })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="banner">Banner</SelectItem>
                                                <SelectItem value="video">Video</SelectItem>
                                                <SelectItem value="icon">Icon/Logo</SelectItem>
                                                <SelectItem value="screenshot">Screenshot</SelectItem>
                                                <SelectItem value="other">Khác</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Kích thước</Label>
                                        <Input
                                            placeholder="VD: 1080x1920, 16:9"
                                            value={designData.dimensions}
                                            onChange={(e) => setDesignData({ ...designData, dimensions: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Color Scheme / Brand Guidelines</Label>
                                    <Input
                                        placeholder="VD: #FF5733, brand blue"
                                        value={designData.colorScheme}
                                        onChange={(e) => setDesignData({ ...designData, colorScheme: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Reference Links</Label>
                                    <Textarea
                                        placeholder="Dán các link tham khảo, mỗi link một dòng"
                                        value={designData.referenceLinks}
                                        onChange={(e) => setDesignData({ ...designData, referenceLinks: e.target.value })}
                                        rows={2}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Ghi chú thêm</Label>
                                    <Textarea
                                        placeholder="Các yêu cầu đặc biệt..."
                                        value={designData.notes}
                                        onChange={(e) => setDesignData({ ...designData, notes: e.target.value })}
                                        rows={3}
                                    />
                                </div>
                            </div>
                        )}

                        {teamType === "art_stylist" && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Phong cách / Style Direction</Label>
                                    <Input
                                        placeholder="VD: Minimalist, Cyberpunk, Vintage"
                                        value={artData.styleDirection}
                                        onChange={(e) => setArtData({ ...artData, styleDirection: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Mood Board / Reference</Label>
                                    <Textarea
                                        placeholder="Mô tả mood, cảm xúc, hoặc link reference"
                                        value={artData.moodBoard}
                                        onChange={(e) => setArtData({ ...artData, moodBoard: e.target.value })}
                                        rows={2}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Mô tả nhân vật (nếu có)</Label>
                                    <Textarea
                                        placeholder="Đặc điểm nhân vật, trang phục, biểu cảm..."
                                        value={artData.characterDescription}
                                        onChange={(e) => setArtData({ ...artData, characterDescription: e.target.value })}
                                        rows={2}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Mô tả bối cảnh / Scene</Label>
                                    <Textarea
                                        placeholder="Không gian, ánh sáng, đạo cụ..."
                                        value={artData.sceneDescription}
                                        onChange={(e) => setArtData({ ...artData, sceneDescription: e.target.value })}
                                        rows={2}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Ghi chú thêm</Label>
                                    <Textarea
                                        placeholder="Các yêu cầu đặc biệt..."
                                        value={artData.notes}
                                        onChange={(e) => setArtData({ ...artData, notes: e.target.value })}
                                        rows={2}
                                    />
                                </div>
                            </div>
                        )}

                        {teamType === "ai_producer" && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Loại model</Label>
                                        <Select
                                            value={aiData.modelType}
                                            onValueChange={(v) => setAIData({ ...aiData, modelType: v as AIProducerFormData["modelType"] })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="image">Image Generation</SelectItem>
                                                <SelectItem value="video">Video Generation</SelectItem>
                                                <SelectItem value="text2image">Text to Image</SelectItem>
                                                <SelectItem value="other">Khác</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Số lượng iterations</Label>
                                        <Input
                                            type="number"
                                            min={1}
                                            max={10}
                                            value={aiData.iterations}
                                            onChange={(e) => setAIData({ ...aiData, iterations: parseInt(e.target.value) || 3 })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Prompt / Mô tả chi tiết</Label>
                                    <Textarea
                                        placeholder="Mô tả chi tiết những gì cần AI tạo ra..."
                                        value={aiData.promptDescription}
                                        onChange={(e) => setAIData({ ...aiData, promptDescription: e.target.value })}
                                        rows={4}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Style Reference</Label>
                                    <Input
                                        placeholder="VD: Ghibli style, Realistic, Anime"
                                        value={aiData.styleReference}
                                        onChange={(e) => setAIData({ ...aiData, styleReference: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Ghi chú thêm</Label>
                                    <Textarea
                                        placeholder="Các yêu cầu đặc biệt, negative prompts..."
                                        value={aiData.notes}
                                        onChange={(e) => setAIData({ ...aiData, notes: e.target.value })}
                                        rows={2}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !deadline}
                        className={teamConfig?.bgColor?.replace('bg-', 'bg-') || 'bg-blue-500'}
                    >
                        {isSubmitting ? (
                            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Đang gửi...</>
                        ) : (
                            <>Gửi Order cho {teamConfig?.label}</>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default OrderFormModal
