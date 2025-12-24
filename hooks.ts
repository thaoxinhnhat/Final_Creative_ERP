"use client"

import { useState } from "react"
import useSWR from "swr"
import type { Task, Notification, WorkloadSummary } from "./types"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function useDeadlines() {
  const { data, error, isLoading, mutate } = useSWR<Task[]>(
    '/api/deadlines',
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
    }
  )
  
  return {
    tasks: data || [],
    isLoading,
    error,
    refresh: mutate
  }
}

export function useNotifications(userId: string) {
  const { data, error, isLoading, mutate } = useSWR<Notification[]>(
    `/api/notifications/${userId}`,
    fetcher
  )
  
  const markAsRead = async (notificationId: string) => {
    // API call
    await mutate()
  }
  
  return {
    notifications: data || [],
    unreadCount: data?.filter(n => !n.isRead).length || 0,
    isLoading,
    markAsRead,
    refresh: mutate
  }
}

export function useWorkload(userId?: string) {
  const { data } = useSWR<WorkloadSummary>(
    userId ? `/api/workload/${userId}` : '/api/workload/team',
    fetcher
  )
  
  return {
    workload: data,
    isOverloaded: (data?.utilizationRate || 0) > 80
  }
}
