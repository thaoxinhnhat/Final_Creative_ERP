"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, X, Lightbulb } from "lucide-react"
import { FileUploader } from "../../briefs/components/FileUploader"
import type { Concept, Attachment } from "../types"

interface ConceptFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (data: Partial<Concept>) => void
    concept?: Concept // For editing
}

export function ConceptForm({ open, onOpenChange, onSubmit, concept }: ConceptFormProps) {
    const [title, setTitle] = useState(concept?.title || "")
    const [description, setDescription] = useState(concept?.description || "")
    const [tagInput, setTagInput] = useState("")
    const [tags, setTags] = useState<string[]>(concept?.tags || [])
    const [attachments, setAttachments] = useState<{ name: string; url: string; type: string }[]>(
        concept?.attachments.map(a => ({ name: a.name, url: a.url, type: a.type })) || []
    )
    const [isSubmitting, setIsSubmitting] = useState(false)

    const addTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()])
            setTagInput("")
        }
    }

    const removeTag = (tag: string) => {
        setTags(tags.filter(t => t !== tag))
    }

    const handleFilesChange = (files: { name: string; url: string; type: string }[]) => {
        setAttachments(files)
    }

    const handleSubmit = async () => {
        if (!title.trim()) return

        setIsSubmitting(true)
        try {
            const formAttachments: Attachment[] = attachments.map((a, i) => ({
                id: `att_${Date.now()}_${i}`,
                name: a.name,
                url: a.url,
                type: a.type as 'image' | 'video' | 'document',
                thumbnailUrl: a.type === 'image' ? a.url : undefined,
            }))

            onSubmit({
                title,
                description,
                tags,
                attachments: formAttachments,
            })

            // Reset form
            setTitle("")
            setDescription("")
            setTags([])
            setAttachments([])
            onOpenChange(false)
        } finally {
            setIsSubmitting(false)
        }
    }

    const isValid = title.trim().length > 0

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-yellow-500" />
                        {concept ? "Chỉnh sửa Concept" : "Tạo Concept mới"}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-5 py-2">
                    {/* Title */}
                    <div>
                        <Label htmlFor="title">Tiêu đề *</Label>
                        <Input
                            id="title"
                            placeholder="VD: Summer Beach Campaign - Video Concept"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1.5"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <Label htmlFor="description">Mô tả ý tưởng</Label>
                        <Textarea
                            id="description"
                            placeholder="Mô tả chi tiết về ý tưởng, target audience, message chính..."
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1.5"
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <Label>Tags</Label>
                        <div className="flex gap-2 mt-1.5">
                            <Input
                                placeholder="Thêm tag..."
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                            />
                            <Button type="button" variant="outline" onClick={addTag}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {tags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                                        {tag}
                                        <button onClick={() => removeTag(tag)} className="hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full p-0.5">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Attachments */}
                    <div>
                        <Label>Tệp đính kèm (ảnh, video, tài liệu)</Label>
                        <p className="text-xs text-muted-foreground mb-2">
                            Upload file hoặc chọn từ Asset Management để mô tả ý tưởng
                        </p>
                        <FileUploader
                            onFilesChange={handleFilesChange}
                            initialFiles={attachments}
                            maxFiles={10}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                        Hủy
                    </Button>
                    <Button onClick={handleSubmit} disabled={!isValid || isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Đang lưu...
                            </>
                        ) : (
                            <>
                                <Lightbulb className="h-4 w-4 mr-2" />
                                {concept ? "Lưu thay đổi" : "Tạo Concept"}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
