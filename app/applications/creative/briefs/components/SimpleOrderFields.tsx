"use client"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Target, ListChecks, FileVideo, StickyNote, Info, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SimpleOrderData } from "../types"
import { RichTextEditor } from "./RichTextEditor"

interface SimpleOrderFieldsProps {
  data: SimpleOrderData
  onChange: (data: SimpleOrderData) => void
  disabled?: boolean
  showValidation?: boolean
}

const MIN_OBJECTIVE_LENGTH = 50
const MIN_REQUIREMENTS_LENGTH = 100

// Strip HTML tags
function stripHtmlTags(html: string): string {
  if (!html) return ""
  let text = html.replace(/<[^>]*>/g, "")
  text = text.replace(/&nbsp;/g, " ")
  text = text.replace(/&amp;/g, "&")
  text = text.replace(/&lt;/g, "<")
  text = text.replace(/&gt;/g, ">")
  text = text.replace(/\s+/g, " ").trim()
  return text
}

function getCharCount(html: string): number {
  return stripHtmlTags(html).length
}

export function SimpleOrderFields({ 
  data, 
  onChange, 
  disabled = false,
  showValidation = false 
}: SimpleOrderFieldsProps) {
  const objectiveCharCount = getCharCount(data.objective)
  const requirementsCharCount = getCharCount(data.requirements)

  return (
    <div className="space-y-6">
      {/* Objective - Optional */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Target className="h-4 w-4 text-blue-500" />
          Mục tiêu
        </Label>
        <RichTextEditor
          value={data.objective}
          onChange={(value) => onChange({ ...data, objective: value })}
          placeholder="Mô tả mục tiêu chính của creative...

Ví dụ:
- Tăng CTR từ 2% lên 3%
- Tăng install rate cho user segment 25-34
- Highlight tính năng mới của app"
          disabled={disabled}
          minHeight={120}
        />
        {objectiveCharCount > 0 && (
          <div className="text-xs text-muted-foreground">
            {objectiveCharCount} ký tự
          </div>
        )}
      </div>

      {/* Requirements - Optional */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <ListChecks className="h-4 w-4 text-green-500" />
          Yêu cầu chi tiết
        </Label>
        <RichTextEditor
          value={data.requirements}
          onChange={(value) => onChange({ ...data, requirements: value })}
          placeholder="Liệt kê các yêu cầu cụ thể...

Ví dụ:
- Style: Modern, minimalist
- Color palette: Blue (#0066CC), White
- Key messages: Sale 50%, Free shipping
- CTA: 'Download Now' hoặc 'Shop Now'
- Mood: Energetic, youthful
- Reference: Xem file đính kèm"
          disabled={disabled}
          minHeight={180}
        />
        {requirementsCharCount > 0 && (
          <div className="text-xs text-muted-foreground">
            {requirementsCharCount} ký tự
          </div>
        )}
      </div>

      {/* Format Requirements - Optional */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <FileVideo className="h-4 w-4 text-purple-500" />
          Định dạng yêu cầu
        </Label>
        <Textarea
          value={data.formatRequirements}
          onChange={(e) => onChange({ ...data, formatRequirements: e.target.value })}
          placeholder="Ví dụ:
- 6 videos (15s, 30s variants)
- 3 endcards (1080x1920, 1200x628)
- 1 playable ad
- Adapt cho cả iOS và Android"
          disabled={disabled}
          className="min-h-[100px]"
        />
      </div>

      {/* Notes - Optional */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <StickyNote className="h-4 w-4 text-yellow-500" />
          Ghi chú thêm
        </Label>
        <Textarea
          value={data.notes || ""}
          onChange={(e) => onChange({ ...data, notes: e.target.value })}
          placeholder="Các lưu ý khác..."
          disabled={disabled}
          className="min-h-[80px]"
        />
      </div>
    </div>
  )
}

export default SimpleOrderFields
