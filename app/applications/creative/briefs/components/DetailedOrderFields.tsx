"use client"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Lightbulb, MapPin, Film, Settings, StickyNote } from "lucide-react"
import { cn } from "@/lib/utils"
import type { DetailedOrderData } from "../types"
import { RichTextEditor } from "./RichTextEditor"
import { SceneEditor } from "./SceneEditor"

interface DetailedOrderFieldsProps {
  data: DetailedOrderData
  onChange: (data: DetailedOrderData) => void
  disabled?: boolean
  showValidation?: boolean
}

const MIN_CONCEPT_LENGTH = 100
const MIN_CONTEXT_LENGTH = 50

function getCharCount(html: string): number {
  if (!html) return 0
  let text = html.replace(/<[^>]*>/g, "")
  text = text.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim()
  return text.length
}

export function DetailedOrderFields({ data, onChange, disabled = false, showValidation = false }: DetailedOrderFieldsProps) {
  const conceptCharCount = getCharCount(data.concept)
  const contextCharCount = getCharCount(data.mainContext)

  return (
    <div className="space-y-6">
      {/* Concept - Optional */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-yellow-500" />
          Concept tổng quan
        </Label>
        <RichTextEditor
          value={data.concept}
          onChange={(value) => onChange({ ...data, concept: value })}
          placeholder="Mô tả concept chính của video..."
          disabled={disabled}
          minHeight={150}
        />
        {conceptCharCount > 0 && (
          <span className="text-xs text-muted-foreground">{conceptCharCount} ký tự</span>
        )}
      </div>

      {/* Main Context - Optional */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-blue-500" />
          Bối cảnh chính
        </Label>
        <RichTextEditor
          value={data.mainContext}
          onChange={(value) => onChange({ ...data, mainContext: value })}
          placeholder="Mô tả bối cảnh chính..."
          disabled={disabled}
          minHeight={120}
        />
        {contextCharCount > 0 && (
          <span className="text-xs text-muted-foreground">{contextCharCount} ký tự</span>
        )}
      </div>

      <Separator />

      {/* Scenes - Optional */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <Film className="h-4 w-4 text-purple-500" />
          Script - Các Scenes
          {data.scenes.length > 0 && (
            <Badge variant="secondary">{data.scenes.length} scenes</Badge>
          )}
        </Label>
        <SceneEditor
          scenes={data.scenes}
          onChange={(scenes) => onChange({ ...data, scenes })}
          disabled={disabled}
          showValidation={false}
        />
      </div>

      <Separator />

      {/* Technical Requirements - Optional */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-gray-500" />
          Technical Requirements
        </Label>
        <Textarea
          value={data.technicalRequirements || ""}
          onChange={(e) => onChange({ ...data, technicalRequirements: e.target.value })}
          placeholder="Resolution, duration, frame rate..."
          disabled={disabled}
          className="min-h-[100px]"
        />
      </div>

      {/* Special Notes - Optional */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <StickyNote className="h-4 w-4 text-yellow-500" />
          Ghi chú đặc biệt
        </Label>
        <Textarea
          value={data.specialNotes || ""}
          onChange={(e) => onChange({ ...data, specialNotes: e.target.value })}
          placeholder="Các lưu ý đặc biệt..."
          disabled={disabled}
          className="min-h-[80px]"
        />
      </div>
    </div>
  )
}

export default DetailedOrderFields
