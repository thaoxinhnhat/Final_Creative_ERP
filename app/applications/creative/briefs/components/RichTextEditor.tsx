"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Toggle } from "@/components/ui/toggle"
import { Separator } from "@/components/ui/separator"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Undo,
  Redo,
  Quote,
  Minus,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ============================================
// PROPS
// ============================================
interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  minHeight?: number
  className?: string
}

// ============================================
// RICH TEXT EDITOR COMPONENT (Fallback Version)
// Uses a simple textarea with basic formatting hints
// For full rich text, install: @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder
// ============================================
export function RichTextEditor({
  value,
  onChange,
  placeholder = "Nhập nội dung...",
  disabled = false,
  minHeight = 200,
  className,
}: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [localValue, setLocalValue] = useState(value || "")

  // Sync external value changes
  useEffect(() => {
    if (value !== localValue) {
      setLocalValue(value || "")
    }
  }, [value])

  const handleChange = (newValue: string) => {
    setLocalValue(newValue)
    onChange(newValue)
  }

  const insertText = (prefix: string, suffix: string = "") => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = localValue.substring(start, end)
    const newText = localValue.substring(0, start) + prefix + selectedText + suffix + localValue.substring(end)
    
    handleChange(newText)
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + prefix.length, end + prefix.length)
    }, 0)
  }

  const insertAtLineStart = (prefix: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const lineStart = localValue.lastIndexOf("\n", start - 1) + 1
    const newText = localValue.substring(0, lineStart) + prefix + localValue.substring(lineStart)
    
    handleChange(newText)
    
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + prefix.length, start + prefix.length)
    }, 0)
  }

  return (
    <div className={cn("border rounded-lg overflow-hidden", className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b bg-muted/50 flex-wrap">
                <Toggle
                  size="sm"
                  onPressedChange={() => insertText("**", "**")}
                  disabled={disabled}
                  aria-label="Bold"
                  title="Bold (Markdown: **text**)"
                >
                  <Bold className="h-4 w-4" />
                </Toggle>
                <Toggle
                  size="sm"
                  onPressedChange={() => insertText("*", "*")}
                  disabled={disabled}
                  aria-label="Italic"
                  title="Italic (Markdown: *text*)"
                >
                  <Italic className="h-4 w-4" />
                </Toggle>
                <Separator orientation="vertical" className="h-6 mx-1" />
                <Toggle
                  size="sm"
                  onPressedChange={() => insertAtLineStart("## ")}
                  disabled={disabled}
                  aria-label="Heading"
                  title="Heading (Markdown: ## text)"
                >
                  <Heading2 className="h-4 w-4" />
                </Toggle>
                <Toggle
                  size="sm"
                  onPressedChange={() => insertAtLineStart("> ")}
                  disabled={disabled}
                  aria-label="Quote"
                  title="Quote (Markdown: > text)"
                >
                  <Quote className="h-4 w-4" />
                </Toggle>
                <Separator orientation="vertical" className="h-6 mx-1" />
                <Toggle
                  size="sm"
                  onPressedChange={() => insertAtLineStart("- ")}
                  disabled={disabled}
                  aria-label="Bullet List"
                  title="Bullet List (Markdown: - item)"
                >
                  <List className="h-4 w-4" />
                </Toggle>
                <Toggle
                  size="sm"
                  onPressedChange={() => insertAtLineStart("1. ")}
                  disabled={disabled}
                  aria-label="Numbered List"
                  title="Numbered List (Markdown: 1. item)"
                >
                  <ListOrdered className="h-4 w-4" />
                </Toggle>
                <Toggle
                  size="sm"
                  onPressedChange={() => insertText("\n---\n")}
                  disabled={disabled}
                  aria-label="Horizontal Rule"
                  title="Horizontal Rule (Markdown: ---)"
                >
                  <Minus className="h-4 w-4" />
                </Toggle>
              </div>
        
              {/* Editor */}
              <Textarea
                ref={textareaRef}
                value={localValue}
                onChange={(e) => handleChange(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                className="border-0 rounded-none focus-visible:ring-0 resize-none"
                style={{ minHeight }}
              />
            </div>
          )
        }
