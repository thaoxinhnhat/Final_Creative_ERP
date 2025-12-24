"use client"

import { useState, useMemo } from "react"

export type UserRole = "ua" | "lead" | "creative"

interface User {
  id: string
  name: string
  role: UserRole
}

// Mock users for different roles (for testing)
const MOCK_USERS: Record<UserRole, User> = {
  ua: { id: "ua-1", name: "Marketing Team", role: "ua" },
  lead: { id: "1", name: "Nguyễn Văn An", role: "lead" },
  creative: { id: "2", name: "Trần Thị Bình", role: "creative" },
}

export function useUserRole() {
  const [role, setRole] = useState<UserRole>("ua")
  const [isLoading, setIsLoading] = useState(false)

  // Get current user based on role
  const user = useMemo(() => MOCK_USERS[role], [role])

  // Permission checks
  const canCreateBrief = role === "ua"
  const canConfirmBrief = role === "lead"
  const canAssignBrief = role === "lead"
  const canStartWork = role === "creative"
  const canMarkComplete = role === "creative" || role === "lead"
  const canRequestFix = role === "lead"

  // Handle role change
  const handleSetRole = (newRole: UserRole) => {
    setIsLoading(true)
    // Simulate async role switch
    setTimeout(() => {
      setRole(newRole)
      setIsLoading(false)
    }, 100)
  }

  return {
    role,
    setRole: handleSetRole,
    user,
    isLoading,
    // Permissions
    canCreateBrief,
    canConfirmBrief,
    canAssignBrief,
    canStartWork,
    canMarkComplete,
    canRequestFix,
  }
}

export default useUserRole
