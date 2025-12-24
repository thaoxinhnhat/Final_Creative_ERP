"use client"

import { Loader2, Lightbulb } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Concept, ConceptFilters } from "../types"
import { ConceptCard } from "./ConceptCard"

interface ConceptListProps {
    concepts: Concept[]
    isLoading: boolean
    selectedId: string | null
    onSelectConcept: (concept: Concept) => void
    sortBy: ConceptFilters['sortBy']
    onSortChange: (sortBy: ConceptFilters['sortBy']) => void
}

export function ConceptList({
    concepts,
    isLoading,
    selectedId,
    onSelectConcept,
    sortBy,
    onSortChange,
}: ConceptListProps) {
    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        )
    }

    return (
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 p-6">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Hiển thị <span className="font-medium text-foreground">{concepts.length}</span> concept
                </p>
                <Select value={sortBy} onValueChange={(v) => onSortChange(v as ConceptFilters['sortBy'])}>
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Sắp xếp" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Mới nhất</SelectItem>
                        <SelectItem value="oldest">Cũ nhất</SelectItem>
                        <SelectItem value="title">Theo tên</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Concepts Grid */}
            {concepts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {concepts.map(concept => (
                        <ConceptCard
                            key={concept.id}
                            concept={concept}
                            isSelected={concept.id === selectedId}
                            onClick={() => onSelectConcept(concept)}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-30" />
                    <p className="text-muted-foreground font-medium">Không có concept nào</p>
                    <p className="text-sm text-muted-foreground mt-1">Tạo concept mới để bắt đầu brainstorm</p>
                </div>
            )}
        </div>
    )
}
