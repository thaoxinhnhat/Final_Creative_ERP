"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, ChevronDown, ChevronUp, Film, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Scene } from "../types"

interface SceneEditorProps {
  scenes: Scene[]
  onChange: (scenes: Scene[]) => void
  disabled?: boolean
  showValidation?: boolean
}

const createEmptyScene = (index: number): Scene => ({
  id: `scene-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  name: `Scene ${index + 1}`,
  description: "",
})

export function SceneEditor({ 
  scenes, 
  onChange, 
  disabled = false,
  showValidation = false 
}: SceneEditorProps) {
  const [expandedScenes, setExpandedScenes] = useState<Set<string>>(
    new Set(scenes.map(s => s.id))
  )

  const addScene = () => {
    const newScene = createEmptyScene(scenes.length)
    onChange([...scenes, newScene])
    setExpandedScenes(prev => new Set([...prev, newScene.id]))
  }

  const removeScene = (id: string) => {
    onChange(scenes.filter(s => s.id !== id))
  }

  const updateScene = (id: string, updates: Partial<Scene>) => {
    onChange(scenes.map(s => s.id === id ? { ...s, ...updates } : s))
  }

  const toggleExpanded = (id: string) => {
    setExpandedScenes(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className="space-y-4">
      {/* Scenes List */}
      {scenes.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <Film className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-3">Chưa có scene nào</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addScene}
            disabled={disabled}
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm Scene đầu tiên
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {scenes.map((scene, index) => (
            <Card 
              key={scene.id} 
              className={cn(
                showValidation && (!scene.name.trim() || !scene.description.trim()) && "border-red-300"
              )}
            >
              <Collapsible open={expandedScenes.has(scene.id)} onOpenChange={() => toggleExpanded(scene.id)}>
                <CardHeader className="p-3">
                  <div className="flex items-center gap-2">
                    {/* Scene Number */}
                    <Badge variant="outline">{index + 1}</Badge>

                    {/* Scene Name Input */}
                    <Input
                      value={scene.name}
                      onChange={(e) => updateScene(scene.id, { name: e.target.value })}
                      placeholder="Tên scene..."
                      disabled={disabled}
                      className="h-8 flex-1"
                      onClick={(e) => e.stopPropagation()}
                    />

                    {/* Duration */}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <Input
                        value={scene.duration || ""}
                        onChange={(e) => updateScene(scene.id, { duration: e.target.value })}
                        placeholder="5s"
                        disabled={disabled}
                        className="h-7 w-14 text-xs text-center"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    {/* Expand/Collapse */}
                    <CollapsibleTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                      >
                        {expandedScenes.has(scene.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>

                    {/* Delete */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-red-500"
                      onClick={() => removeScene(scene.id)}
                      disabled={disabled}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CollapsibleContent>
                  <CardContent className="p-3 pt-0 space-y-3">
                    {/* Description */}
                    <div className="space-y-1.5">
                      <Label className="text-xs">Mô tả scene *</Label>
                      <Textarea
                        value={scene.description}
                        onChange={(e) => updateScene(scene.id, { description: e.target.value })}
                        placeholder="Mô tả chi tiết scene..."
                        disabled={disabled}
                        className="min-h-[80px] text-sm"
                      />
                    </div>

                    {/* Actions/Dialogue */}
                    <div className="space-y-1.5">
                      <Label className="text-xs">Actions / Dialogue</Label>
                      <Textarea
                        value={scene.actions || ""}
                        onChange={(e) => updateScene(scene.id, { actions: e.target.value })}
                        placeholder="Hành động, lời thoại..."
                        disabled={disabled}
                        className="min-h-[60px] text-sm"
                      />
                    </div>

                    {/* Visual & Sound Notes */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Visual Notes</Label>
                        <Textarea
                          value={scene.visualNotes || ""}
                          onChange={(e) => updateScene(scene.id, { visualNotes: e.target.value })}
                          placeholder="Camera, lighting, effects..."
                          disabled={disabled}
                          className="min-h-[60px] text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Sound Notes</Label>
                        <Textarea
                          value={scene.soundNotes || ""}
                          onChange={(e) => updateScene(scene.id, { soundNotes: e.target.value })}
                          placeholder="Music, SFX, voiceover..."
                          disabled={disabled}
                          className="min-h-[60px] text-sm"
                        />
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>
      )}

      {/* Add Scene Button */}
      {scenes.length > 0 && (
        <Button
          type="button"
          variant="outline"
          onClick={addScene}
          disabled={disabled}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm Scene mới
        </Button>
      )}

      {/* Validation Message */}
      {showValidation && scenes.length === 0 && (
        <p className="text-xs text-red-500 text-center">
          Vui lòng thêm ít nhất 1 scene
        </p>
      )}
    </div>
  )
}

export default SceneEditor
