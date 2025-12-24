"use client"

import { useState, useMemo, useCallback } from "react"
import { mockTasks, mockNotifications, calculateWorkloadSummary, teamMembers, apps } from "./mockData"
import type { Task, Notification, DeadlineFilters, TaskStatus, TaskPriority } from "./types"

const defaultFilters: DeadlineFilters = { search: "", assignees: [], status: [], priority: [], taskType: [], apps: [], view: "list" }

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [filters, setFilters] = useState<DeadlineFilters>(defaultFilters)

  const filteredTasks = useMemo(() => {
    let result = [...tasks]
    if (filters.search) { const s = filters.search.toLowerCase(); result = result.filter(t => t.title.toLowerCase().includes(s) || t.appName.toLowerCase().includes(s) || t.campaignName?.toLowerCase().includes(s)) }
    if (filters.assignees.length > 0) result = result.filter(t => t.assignedTo.some(a => filters.assignees.includes(a)))
    if (filters.status.length > 0) result = result.filter(t => filters.status.includes(t.status))
    if (filters.priority.length > 0) result = result.filter(t => filters.priority.includes(t.priority))
    if (filters.taskType.length > 0) result = result.filter(t => filters.taskType.includes(t.type))
    if (filters.apps.length > 0) result = result.filter(t => filters.apps.includes(t.appName))
    if (filters.dateRange?.from) result = result.filter(t => new Date(t.deadline) >= new Date(filters.dateRange!.from))
    if (filters.dateRange?.to) result = result.filter(t => new Date(t.deadline) <= new Date(filters.dateRange!.to))
    const priorityOrder: Record<TaskPriority, number> = { urgent: 0, high: 1, medium: 2, low: 3 }
    result.sort((a, b) => { const dateA = new Date(a.deadline).getTime(), dateB = new Date(b.deadline).getTime(); if (dateA !== dateB) return dateA - dateB; return priorityOrder[a.priority] - priorityOrder[b.priority] })
    return result
  }, [tasks, filters])

  const updateFilters = useCallback((updates: Partial<DeadlineFilters>) => setFilters(prev => ({ ...prev, ...updates })), [])
  const resetFilters = useCallback(() => setFilters(defaultFilters), [])
  const toggleFilter = useCallback(<K extends keyof DeadlineFilters>(key: K, value: any) => {
    setFilters(prev => { const current = prev[key] as unknown[]; const updated = current.includes(value) ? current.filter(v => v !== value) : [...current, value]; return { ...prev, [key]: updated } })
  }, [])
  const updateTaskStatus = useCallback((taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus, completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined, progress: newStatus === 'completed' ? 100 : t.progress } : t))
  }, [])
  const getTaskById = useCallback((id: string) => tasks.find(t => t.id === id), [tasks])
  const activeFilterCount = useMemo(() => { let c = 0; if (filters.search) c++; if (filters.assignees.length > 0) c++; if (filters.status.length > 0) c++; if (filters.priority.length > 0) c++; if (filters.taskType.length > 0) c++; if (filters.apps.length > 0) c++; if (filters.dateRange?.from || filters.dateRange?.to) c++; return c }, [filters])

  return { tasks: filteredTasks, allTasks: tasks, filters, updateFilters, resetFilters, toggleFilter, updateTaskStatus, getTaskById, activeFilterCount, teamMembers, apps }
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const unreadCount = useMemo(() => notifications.filter(n => !n.isRead).length, [notifications])
  const markAsRead = useCallback((id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n)), [])
  const markAllAsRead = useCallback(() => setNotifications(prev => prev.map(n => ({ ...n, isRead: true }))), [])
  const clearNotification = useCallback((id: string) => setNotifications(prev => prev.filter(n => n.id !== id)), [])
  return { notifications, unreadCount, markAsRead, markAllAsRead, clearNotification }
}

export function useWorkload() {
  const workloadSummary = useMemo(() => calculateWorkloadSummary(), [])
  return { workloadSummary, teamMembers }
}
