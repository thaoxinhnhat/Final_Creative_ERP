"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Link2, Calendar, Target } from "lucide-react"
import type { Brief } from "../types"

interface CreateConceptFromBriefModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    brief: Brief
    onSubmit: (data: {
        title: string
        description: string
        tags: string[]
    }) => void
}

export function CreateConceptFromBriefModal({
    open,
    onOpenChange,
    brief,
    onSubmit,
}: CreateConceptFromBriefModalProps) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [tags, setTags] = useState<string[]>([brief.appCampaign.toLowerCase()])
    const [tagInput, setTagInput] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async () => {
        if (!title.trim()) return

        setIsSubmitting(true)
        try {
            await onSubmit({
                title: title.trim(),
                description: description.trim(),
                tags,
            })
            // Reset form
            setTitle("")
            setDescription("")
            setTags([brief.appCampaign.toLowerCase()])
            setTagInput("")
            onOpenChange(false)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleAddTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim().toLowerCase())) {
            setTags([...tags, tagInput.trim().toLowerCase()])
            setTagInput("")
        }
    }

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(t => t !== tagToRemove))
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault()
            handleAddTag()
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-yellow-100 flex items-center justify-center">
                            <Lightbulb className="h-5 w-5 text-yellow-600" />
                        </div>
                        Tạo Concept từ Brief
                    </DialogTitle>
                </DialogHeader>

                {/* Brief Info Card */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-blue-800 mb-2">
                        <Link2 className="h-4 w-4" />
                        Liên kết với Brief
                    </div>
                    <p className="font-semibold text-gray-900">{brief.title}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            {brief.appCampaign}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Deadline: {new Date(brief.deadline).toLocaleDateString('vi-VN')}
                        </span>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="concept-title">
                            Tên Concept <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="concept-title"
                            placeholder="VD: Summer Beach Video Concept"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="concept-desc">Mô tả ý tưởng</Label>
                        <Textarea
                            id="concept-desc"
                            placeholder="Mô tả chi tiết về concept, ý tưởng, style, reference..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                        />
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <Label>Tags</Label>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                            {tags.map(tag => (
                                <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="cursor-pointer hover:bg-red-100"
                                    onClick={() => handleRemoveTag(tag)}
                                >
                                    {tag} ×
                                </Badge>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Thêm tag..."
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleAddTag}
                            >
                                Thêm
                            </Button>
                        </div>
                    </div>
                </div>

                <DialogFooter className="mt-4">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isSubmitting}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!title.trim() || isSubmitting}
                        className="bg-yellow-500 hover:bg-yellow-600"
                    >
                        {isSubmitting ? "Đang tạo..." : "Tạo Concept"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
