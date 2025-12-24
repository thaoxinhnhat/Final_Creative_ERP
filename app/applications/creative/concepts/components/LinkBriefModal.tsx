"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Search, Link2, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock briefs for selection
const mockBriefs = [
    { id: "brief_001", title: "Summer Campaign 2025", status: "in_progress", appName: "Fashion App" },
    { id: "brief_002", title: "Holiday Campaign Q4", status: "pending", appName: "Shopping App" },
    { id: "brief_003", title: "Gaming App UA Campaign", status: "confirmed", appName: "Super Game" },
    { id: "brief_004", title: "Influencer Campaign Q1", status: "draft", appName: "Lifestyle App" },
    { id: "brief_005", title: "App Launch 2025", status: "in_progress", appName: "Fitness App" },
]

interface LinkBriefModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSelect: (briefId: string, briefTitle: string) => void
    currentBriefId?: string
}

export function LinkBriefModal({ open, onOpenChange, onSelect, currentBriefId }: LinkBriefModalProps) {
    const [search, setSearch] = useState("")
    const [selectedId, setSelectedId] = useState<string | null>(currentBriefId || null)

    const filteredBriefs = mockBriefs.filter(b =>
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.appName.toLowerCase().includes(search.toLowerCase())
    )

    const handleConfirm = () => {
        if (selectedId) {
            const brief = mockBriefs.find(b => b.id === selectedId)
            if (brief) {
                onSelect(brief.id, brief.title)
                onOpenChange(false)
            }
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Link2 className="h-5 w-5 text-blue-600" />
                        Liên kết với Brief
                    </DialogTitle>
                </DialogHeader>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm brief theo tên, app..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Brief List */}
                <ScrollArea className="h-[300px] border rounded-lg">
                    <div className="p-2 space-y-1">
                        {filteredBriefs.map(brief => (
                            <div
                                key={brief.id}
                                className={cn(
                                    "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                                    selectedId === brief.id
                                        ? "bg-blue-50 dark:bg-blue-950 border border-blue-200"
                                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                                )}
                                onClick={() => setSelectedId(brief.id)}
                            >
                                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded">
                                    <FileText className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate">{brief.title}</p>
                                    <p className="text-xs text-muted-foreground">{brief.appName}</p>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                    {brief.status}
                                </Badge>
                            </div>
                        ))}

                        {filteredBriefs.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                <FileText className="h-8 w-8 mx-auto mb-2 opacity-30" />
                                <p className="text-sm">Không tìm thấy brief</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy
                    </Button>
                    <Button onClick={handleConfirm} disabled={!selectedId}>
                        <Link2 className="h-4 w-4 mr-2" />
                        Liên kết
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
