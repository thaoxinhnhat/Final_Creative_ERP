"use client"

import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageSquare, Paperclip, Link2, Users } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { Concept } from "../types"
import { STATUS_CONFIG, TEAM_CONFIG } from "../types"

interface ConceptCardProps {
    concept: Concept
    isSelected?: boolean
    onClick: () => void
}

export function ConceptCard({ concept, isSelected = false, onClick }: ConceptCardProps) {
    const statusConfig = STATUS_CONFIG[concept.status]
    const initials = concept.createdByName.split(' ').map(n => n[0]).join('').slice(0, 2)
    const handlerConfig = concept.currentHandler ? TEAM_CONFIG[concept.currentHandler] : null

    // Get latest order assignment status
    const latestAssignment = concept.orderAssignments?.slice(-1)[0]

    return (
        <div
            className={cn(
                "bg-white dark:bg-gray-900 border rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-lg group",
                isSelected
                    ? "ring-2 ring-blue-500 border-blue-300"
                    : "hover:border-gray-300"
            )}
            onClick={onClick}
        >
            {/* Thumbnail */}
            <div className="aspect-video bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                {concept.attachments.length > 0 && concept.attachments[0].thumbnailUrl ? (
                    <img
                        src={concept.attachments[0].thumbnailUrl}
                        alt={concept.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl">{statusConfig.icon}</span>
                    </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className={cn("text-xs", statusConfig.color)}>
                        {statusConfig.icon} {statusConfig.label}
                    </Badge>
                </div>

                {/* Team Handler Badge */}
                {handlerConfig && (
                    <div className={cn(
                        "absolute bottom-2 left-2 text-xs px-2 py-1 rounded-full flex items-center gap-1",
                        handlerConfig.bgColor,
                        handlerConfig.color
                    )}>
                        <Users className="h-3 w-3" />
                        {handlerConfig.label}
                    </div>
                )}

                {/* Attachment count */}
                {concept.attachments.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Paperclip className="h-3 w-3" />
                        {concept.attachments.length}
                    </div>
                )}

                {/* Order returned indicator */}
                {latestAssignment?.status === 'returned' && (
                    <div className="absolute bottom-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                        ↩️ Trả lại
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-semibold text-sm line-clamp-2 mb-2">{concept.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {concept.description}
                </p>

                {/* Tags */}
                {concept.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                        {concept.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">
                                {tag}
                            </Badge>
                        ))}
                        {concept.tags.length > 3 && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                +{concept.tags.length - 3}
                            </Badge>
                        )}
                    </div>
                )}

                {/* Linked Brief */}
                {concept.linkedBriefTitle && (
                    <div className="flex items-center gap-1 text-xs text-blue-600 mb-3">
                        <Link2 className="h-3 w-3" />
                        <span className="truncate">{concept.linkedBriefTitle}</span>
                    </div>
                )}

                {/* Workflow Progress with Deadline */}
                {concept.orderAssignments && concept.orderAssignments.length > 0 && (
                    <div className="mb-3">
                        <div className="flex items-center gap-1">
                            {concept.orderAssignments.map((assignment, idx) => {
                                const teamConfig = TEAM_CONFIG[assignment.teamType]
                                const statusColors = {
                                    pending: 'bg-gray-300',
                                    in_progress: 'bg-yellow-400',
                                    completed: 'bg-green-500',
                                    returned: 'bg-red-400'
                                }

                                // Calculate deadline urgency
                                const deadlineDate = new Date(assignment.deadline)
                                const today = new Date()
                                today.setHours(0, 0, 0, 0)
                                const daysUntil = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                                const isOverdue = daysUntil < 0 && assignment.status !== 'completed'
                                const isUrgent = daysUntil <= 2 && assignment.status !== 'completed'

                                return (
                                    <div
                                        key={idx}
                                        className="flex-1 flex flex-col items-center"
                                        title={`${teamConfig.label}: ${assignment.status} | Deadline: ${format(deadlineDate, "dd/MM")}`}
                                    >
                                        <div className={cn(
                                            "h-1.5 w-full rounded-full",
                                            statusColors[assignment.status]
                                        )} />
                                        <div className="flex items-center gap-0.5 mt-0.5">
                                            <span className="text-[9px] text-muted-foreground">
                                                {teamConfig.icon}
                                            </span>
                                            {assignment.status !== 'completed' && (
                                                <span className={cn(
                                                    "text-[8px] font-medium",
                                                    isOverdue ? "text-red-600" : isUrgent ? "text-orange-500" : "text-gray-400"
                                                )}>
                                                    {format(deadlineDate, "dd/MM")}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-[10px] bg-blue-100 text-blue-700">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">{concept.createdByName}</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {concept.comments.length > 0 && (
                            <span className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                {concept.comments.length}
                            </span>
                        )}
                        <span>{format(new Date(concept.createdAt), "dd/MM")}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
