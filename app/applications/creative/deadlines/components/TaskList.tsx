"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, CheckCircle2 } from "lucide-react"
import type { Task } from "../types"
import { TaskCard } from "./TaskCard"
import { getTasksByDeadline } from "../mockData"

interface TaskListProps { tasks: Task[]; isLoading: boolean; onSelectTask: (task: Task) => void }

export function TaskList({ tasks, isLoading, onSelectTask }: TaskListProps) {
  if (isLoading) return <div className="flex-1 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>
  const grouped = getTasksByDeadline(tasks)
  const sections = [
    { key: 'overdue', title: '⚠️ Quá hạn', tasks: grouped.overdue, color: 'text-red-600' },
    { key: 'today', title: '🔥 Hôm nay', tasks: grouped.today, color: 'text-orange-600' },
    { key: 'tomorrow', title: '📅 Ngày mai', tasks: grouped.tomorrow, color: 'text-yellow-600' },
    { key: 'thisWeek', title: '📆 Tuần này', tasks: grouped.thisWeek, color: 'text-blue-600' },
    { key: 'later', title: '🗓️ Sau đó', tasks: grouped.later, color: 'text-gray-600' },
    { key: 'completed', title: '✅ Hoàn thành gần đây', tasks: grouped.completed.slice(0, 5), color: 'text-green-600' },
  ]
  return (
    <ScrollArea className="flex-1">
      <div className="p-4 space-y-6">
        {sections.map(s => s.tasks.length > 0 && (
          <div key={s.key}><h3 className={`font-semibold text-sm mb-3 ${s.color}`}>{s.title} ({s.tasks.length})</h3><div className="space-y-2">{s.tasks.map(task => <TaskCard key={task.id} task={task} onClick={() => onSelectTask(task)} />)}</div></div>
        ))}
        {tasks.length === 0 && <div className="text-center py-12 text-muted-foreground"><CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-30" /><p className="font-medium">Không có task nào</p><p className="text-sm mt-1">Thử thay đổi bộ lọc</p></div>}
      </div>
    </ScrollArea>
  )
}
