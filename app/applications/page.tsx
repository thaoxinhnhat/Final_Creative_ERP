"use client"

import { useState, useTransition } from "react"
import {
  Search,
  Grid3X3,
  List,
  Star,
  Users,
  TrendingUp,
  DollarSign,
  BarChart3,
  Target,
  Briefcase,
  UserCheck,
  Building,
  Scale,
  AppWindow,
  Zap,
  Eye,
  TestTube,
  Layers,
  Gift,
  ImageIcon,
  MoreVertical,
  ExternalLink,
  Pin,
  FileText,
  Package,
  FolderKanban,
  Calendar as CalendarIcon,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Application data structure
interface Application {
  id: string
  name: string
  description?: string
  icon: any
  color: string
  favorite?: boolean
  route?: string
  lastUpdated?: string
  externalUrl?: string
  isExternal?: boolean
}

interface Team {
  id: string
  name: string
  description: string
  color: string
  applications: Application[]
}

// Teams and applications data
const teamsData: Team[] = [
  {
    id: "creative",
    name: "Creative Team",
    description: "Asset production and creative management tools",
    color: "pink",
    applications: [
      {
        id: "creative-briefs",
        name: "Brief & Task Management",
        description: "Quản lý brief từ UA Team và phân công task",
        icon: FileText,
        color: "bg-pink-500",
        favorite: true,
        route: "/applications/creative/briefs",
        lastUpdated: "2024-01-20",
      },
      {
        id: "creative-concepts",
        name: "Concept & Idea Hub",
        description: "Brainstorm và quản lý ý tưởng sáng tạo",
        icon: Target,
        color: "bg-purple-500",
        route: "/applications/creative/concepts",
        lastUpdated: "2024-01-19",
      },
      {
        id: "creative-library",
        name: "Asset Management",
        description: "Quản lý, lưu trữ hình ảnh & video dùng trong Creative",
        icon: ImageIcon,
        color: "bg-blue-500",
        favorite: true,
        route: "/applications/creative/library",
        lastUpdated: "2024-01-18",
      },
      {
        id: "creative-performance",
        name: "Performance Tracking",
        description: "Theo dõi hiệu suất creative",
        icon: TrendingUp,
        color: "bg-orange-500",
        route: "/applications/creative/performance",
        lastUpdated: "2024-01-16",
      },
      {
        id: "creative-deadlines",
        name: "Deadline & Notification",
        description: "Quản lý deadline và workload",
        icon: CalendarIcon,
        color: "bg-red-500",
        route: "/applications/creative/deadlines",
        lastUpdated: "2024-01-15",
      },
    ],
  },
  {
    id: "marketing",
    name: "Marketing Team",
    description: "Campaign management and marketing automation tools",
    color: "blue",
    applications: [
      {
        id: "campaign-mgmt",
        name: "Campaign Management",
        description: "Manage and optimize marketing campaigns",
        icon: TrendingUp,
        color: "bg-blue-500",
        favorite: true,
        lastUpdated: "2024-01-15",
      },
      {
        id: "budget-allocation",
        name: "Budget Allocation",
        description: "Distribute marketing budget across channels",
        icon: DollarSign,
        color: "bg-green-500",
        lastUpdated: "2024-01-10",
      },
      {
        id: "cost-distribution",
        name: "Cost Distribution",
        description: "Analyze cost distribution across campaigns",
        icon: BarChart3,
        color: "bg-purple-500",
        lastUpdated: "2024-01-12",
      },
      {
        id: "smart-bidding",
        name: "Smart Bidding",
        description: "AI-powered bidding optimization",
        icon: Zap,
        color: "bg-yellow-500",
        favorite: true,
        lastUpdated: "2024-01-18",
      },
      {
        id: "creative-mgmt",
        name: "Creative Management",
        description: "Manage creative assets and variations",
        icon: Eye,
        color: "bg-pink-500",
        lastUpdated: "2024-01-14",
      },
    ],
  },
  {
    id: "monetization",
    name: "Monetization Team",
    description: "Revenue optimization and testing tools",
    color: "green",
    applications: [
      {
        id: "ecpm-prediction",
        name: "eCPM Prediction",
        description: "Predict effective cost per mille",
        icon: Target,
        color: "bg-emerald-500",
        favorite: true,
        lastUpdated: "2024-01-16",
      },
      {
        id: "ab-testing",
        name: "A/B Testing",
        description: "Run and analyze A/B experiments",
        icon: TestTube,
        color: "bg-cyan-500",
        lastUpdated: "2024-01-11",
      },
    ],
  },
  {
    id: "aso",
    name: "ASO Team",
    description: "App Store Optimization and management",
    color: "orange",
    applications: [
      {
        id: "aso-dashboard",
        name: "Project Management",
        description: "Quản lý - Theo dõi công việc, dự án của team ASO",
        icon: FolderKanban,
        color: "bg-indigo-500",
        favorite: true,
        route: "/applications/aso-dashboard",
        lastUpdated: "2024-01-20",
      },
      {
        id: "storekit-management",
        name: "StoreKit Management",
        description: "Quản lý - Tối ưu Asset & Metadata",
        icon: Package,
        color: "bg-green-500",
        route: "/applications/storekit",
        lastUpdated: "2024-01-18",
      },
      {
        id: "metadata-tracking",
        name: "Asset Management",
        description: "Quản lý, lưu trữ hình ảnh & video dùng trong StoreKit.",
        icon: ImageIcon,
        color: "bg-purple-500",
        route: "/applications/metadata-tracking",
        lastUpdated: "2024-01-19",
      },
      {
        id: "task-collaboration",
        name: "Asset Production & Approval",
        description: "Bridge với Design team",
        icon: Package,
        color: "bg-orange-500",
        route: "/applications/tasks-collab",
        externalUrl: "https://example.com/asset-production",
        isExternal: true,
        lastUpdated: "2024-01-17",
      },
      {
        id: "ab-testing-aso",
        name: "Optimization & Tracking",
        description: "Đo lường hiệu suất",
        icon: TrendingUp,
        color: "bg-blue-500",
        route: "/applications/ab-testing",
        lastUpdated: "2024-01-16",
      },
      {
        id: "performance-monitoring",
        name: "Smart Reporting System",
        description: "Tổng hợp - Phân tích - Báo cáo dữ liệu",
        icon: BarChart3,
        color: "bg-violet-500",
        route: "/applications/performance-monitoring",
        lastUpdated: "2024-01-15",
      },
    ],
  },
  {
    id: "back-office",
    name: "Back-Office",
    description: "Internal operations and management systems",
    color: "gray",
    applications: [
      {
        id: "hrm",
        name: "HRM",
        description: "Human Resource Management System",
        icon: Users,
        color: "bg-slate-500",
        lastUpdated: "2024-01-13",
      },
      {
        id: "recruitment",
        name: "Recruitment",
        description: "Talent acquisition and hiring platform",
        icon: UserCheck,
        color: "bg-blue-600",
        lastUpdated: "2024-01-09",
      },
      {
        id: "sm-rewards",
        name: "SM Rewards",
        description: "Manage SM Points and rewards system",
        icon: Gift,
        color: "bg-green-600",
        route: "/applications/sm-rewards",
        lastUpdated: "2024-01-08",
      },
      {
        id: "meeting-room",
        name: "Meeting Room",
        description: "Conference room booking system",
        icon: Building,
        color: "bg-purple-600",
        route: "/applications/meeting-room",
        lastUpdated: "2024-01-07",
      },
      {
        id: "asset-mgmt",
        name: "Asset Management",
        description: "Company asset tracking and management",
        icon: Layers,
        color: "bg-gray-600",
        route: "/applications/asset-mgmt",
        lastUpdated: "2024-01-06",
      },
    ],
  },
  {
    id: "bod",
    name: "BoD",
    description: "Board of Directors executive tools",
    color: "red",
    applications: [
      {
        id: "finance",
        name: "Finance",
        description: "Financial reporting and analytics",
        icon: Briefcase,
        color: "bg-emerald-600",
        favorite: true,
        route: "/applications/finance",
        lastUpdated: "2024-01-05",
      },
      {
        id: "legal-mgmt",
        name: "Legal Management",
        description: "Legal document and compliance management",
        icon: Scale,
        color: "bg-red-600",
        route: "/applications/legal-mgmt",
        lastUpdated: "2024-01-04",
      },
    ],
  },
]

export default function ApplicationsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isPending, startTransition] = useTransition()
  const [favorites, setFavorites] = useState<Set<string>>(
    new Set(teamsData.flatMap((team) => team.applications.filter((app) => app.favorite).map((app) => app.id))),
  )

  // Toggle favorite status
  const toggleFavorite = (appId: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(appId)) {
      newFavorites.delete(appId)
    } else {
      newFavorites.add(appId)
    }
    setFavorites(newFavorites)
  }

  // Filter applications based on search term
  const filteredTeams = teamsData
    .map((team) => ({
      ...team,
      applications: team.applications.filter(
        (app) =>
          app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((team) => team.applications.length > 0)

  const handleNavigate = (app: Application) => {
    if (app.isExternal && app.externalUrl) {
      window.open(app.externalUrl, "_blank")
      return
    }

    if (!app.route) return

    if (app.id === "metadata-tracking") {
      // Clear any stored metadata in localStorage or sessionStorage
      if (typeof window !== "undefined") {
        // Clear all metadata-related data
        Object.keys(localStorage).forEach((key) => {
          if (key.includes("metadata") || key.includes("tracking")) {
            localStorage.removeItem(key)
          }
        })
        Object.keys(sessionStorage).forEach((key) => {
          if (key.includes("metadata") || key.includes("tracking")) {
            sessionStorage.removeItem(key)
          }
        })
      }
    }

    startTransition(() => {
      router.push(app.route!)
    })
  }

  // Application Card Component for Grid View
  const ApplicationCard = ({ app, teamId }: { app: Application; teamId: string }) => {
    const Icon = app.icon
    const isFavorite = favorites.has(app.id)

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Card
              className={cn(
                "group hover:shadow-xl transition-all duration-200 cursor-pointer hover:scale-[1.02] border border-gray-200 rounded-2xl",
                isPending && "opacity-50 pointer-events-none",
              )}
              onClick={() => {
                handleNavigate(app)
              }}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className={cn("p-3 rounded-xl text-white flex-shrink-0", app.color)}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 truncate">{app.name}</h3>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(app.id)
                          }}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Star
                            className={cn(
                              "h-4 w-4 transition-colors",
                              isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-400",
                            )}
                          />
                        </button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <MoreVertical className="h-4 w-4 text-gray-500" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                handleNavigate(app)
                              }}
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Open
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                              <Pin className="h-4 w-4 mr-2" />
                              Pin to sidebar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                              <FileText className="h-4 w-4 mr-2" />
                              View docs
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    {app.description && <p className="text-sm text-gray-500 line-clamp-2">{app.description}</p>}
                    {app.lastUpdated && <p className="text-xs text-gray-400 mt-2">Updated {app.lastUpdated}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">{app.description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  // Application Row Component for List View
  const ApplicationRow = ({ app, teamId }: { app: Application; teamId: string }) => {
    const Icon = app.icon
    const isFavorite = favorites.has(app.id)

    return (
      <div
        className={cn(
          "flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors",
          isPending && "opacity-50 pointer-events-none",
        )}
        onClick={() => {
          handleNavigate(app)
        }}
      >
        <div className={cn("p-2 rounded-lg text-white flex-shrink-0", app.color)}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">{app.name}</h3>
          <p className="text-sm text-gray-500 truncate">{app.description}</p>
        </div>
        <div className="text-sm text-gray-500 w-32 text-right">{app.lastUpdated || "N/A"}</div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleFavorite(app.id)
            }}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Star
              className={cn(
                "h-4 w-4 transition-colors",
                isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-400",
              )}
            />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MoreVertical className="h-4 w-4 text-gray-500" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  handleNavigate(app)
                }}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                <Pin className="h-4 w-4 mr-2" />
                Pin to sidebar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                <FileText className="h-4 w-4 mr-2" />
                View docs
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    )
  }

  // Team Section Component
  const TeamSection = ({ team }: { team: Team }) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{team.name}</h2>
          <p className="text-sm text-gray-500">{team.description}</p>
        </div>
        <Badge
          className={cn(
            "text-xs",
            team.color === "blue" && "bg-blue-100 text-blue-700",
            team.color === "green" && "bg-green-100 text-green-700",
            team.color === "orange" && "bg-orange-100 text-orange-700",
            team.color === "gray" && "bg-gray-100 text-gray-700",
            team.color === "red" && "bg-red-100 text-red-700",
            team.color === "pink" && "bg-pink-100 text-pink-700",
          )}
        >
          {team.applications.length} apps
        </Badge>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {team.applications.map((app) => (
            <ApplicationCard key={app.id} app={app} teamId={team.id} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-4 px-4 py-2 text-sm font-medium text-gray-500 border-b">
            <div className="w-8"></div>
            <div className="flex-1">App</div>
            <div className="w-32 text-right">Last Updated</div>
            <div className="w-20 text-right">Actions</div>
          </div>
          {team.applications.map((app) => (
            <ApplicationRow key={app.id} app={app} teamId={team.id} />
          ))}
        </div>
      )}
    </div>
  )

  const displayTeams = searchTerm ? filteredTeams : teamsData

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
            <p className="text-gray-500 mt-1">Access all your business applications organized by team.</p>
          </div>

          {/* Search and Controls */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}



{/* Content */}
        <div className="space-y-8">
          {searchTerm && (
            <div className="mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                Search Results for "{searchTerm}"
                {displayTeams.length === 0 && (
                  <span className="text-gray-500 font-normal ml-2">(No apps found for your query)</span>
                )}
              </h2>
            </div>
          )}

          {displayTeams.length > 0 ? (
            displayTeams.map((team) => <TeamSection key={team.id} team={team} />)
          ) : (
            <div className="text-center py-12">
              <AppWindow className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No apps found for your query</p>
              <p className="text-gray-400 text-sm mt-2">Try searching with different keywords</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
