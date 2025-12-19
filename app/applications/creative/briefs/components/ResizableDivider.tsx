"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ResizableDividerProps {
  direction: "vertical" | "horizontal"
  onResize: (delta: number) => void
  className?: string
}

export function ResizableDivider({ direction, onResize, className }: ResizableDividerProps) {
  const [isDragging, setIsDragging] = React.useState(false)

  const handleMouseDown = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  React.useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      if (direction === "vertical") {
        onResize(e.movementX)
      } else {
        onResize(e.movementY)
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, direction, onResize])

  return (
    <div
      className={cn(
        "flex-shrink-0 bg-transparent hover:bg-blue-500/20 transition-colors",
        direction === "vertical" 
          ? "w-1 cursor-col-resize hover:w-1" 
          : "h-1 cursor-row-resize hover:h-1",
        isDragging && "bg-blue-500/30",
        className
      )}
      onMouseDown={handleMouseDown}
    />
  )
}