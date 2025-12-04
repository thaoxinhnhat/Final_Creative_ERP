"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X, ArrowUpDown, CornerDownLeft, Download, DollarSign, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { mockApps, type App } from "../data/mock-apps"
import { cn } from "@/lib/utils"

interface HeaderSearchProps {
  selectedApp: App | null
  onSelectApp: (app: App | null) => void
}

export function HeaderSearch({ selectedApp, onSelectApp }: HeaderSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const [recentApps, setRecentApps] = useState<App[]>([])
  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Filter apps based on search query
  const filteredApps = searchQuery
    ? mockApps.filter(
        (app) =>
          app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.bundleId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.developer?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : []

  const totalResults = recentApps.length + filteredApps.length

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search with "/"
      if (e.key === "/" && !isOpen) {
        e.preventDefault()
        inputRef.current?.focus()
      }

      if (!isOpen) return

      // Navigate with arrow keys
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setFocusedIndex((prev) => (prev < totalResults - 1 ? prev + 1 : prev))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1))
      } else if (e.key === "Enter" && focusedIndex >= 0) {
        e.preventDefault()
        const allApps = [...recentApps, ...filteredApps]
        const selectedFromList = allApps[focusedIndex]
        if (selectedFromList) {
          handleSelectApp(selectedFromList)
        }
      } else if (e.key === "Escape") {
        setIsOpen(false)
        setSearchQuery("")
        setFocusedIndex(-1)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, focusedIndex, totalResults, recentApps, filteredApps])

  // Load recent apps from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("recentApps")
    if (stored) {
      try {
        const recentIds = JSON.parse(stored) as string[]
        const recent = recentIds.map((id) => mockApps.find((app) => app.id === id)).filter(Boolean) as App[]
        setRecentApps(recent.slice(0, 3))
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, [])

  const handleSelectApp = (app: App) => {
    onSelectApp(app)
    setIsOpen(false)
    setSearchQuery("")
    setFocusedIndex(-1)

    // Save to recent
    const stored = localStorage.getItem("recentApps")
    let recentIds: string[] = []
    if (stored) {
      try {
        recentIds = JSON.parse(stored)
      } catch (e) {
        // Ignore
      }
    }
    recentIds = [app.id, ...recentIds.filter((id) => id !== app.id)].slice(0, 5)
    localStorage.setItem("recentApps", JSON.stringify(recentIds))
  }

  const handleClearSelection = () => {
    onSelectApp(null)
    setSearchQuery("")
  }

  const getPlatformBadge = (platform: string) => {
    if (platform === "both") return "🤖🍎"
    if (platform === "ios") return "🍎"
    return "🤖"
  }

  const getAppIcon = (app: App) => {
    if (app.iconUrl) return app.iconUrl
    // Generate a colorful placeholder
    const colors = ["from-blue-500", "from-green-500", "from-purple-500", "from-pink-500", "from-orange-500"]
    const colorIndex = Number.parseInt(app.id) % colors.length
    return (
      <div
        className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm bg-gradient-to-br to-opacity-80",
          colors[colorIndex],
          colors[colorIndex].replace("from-", "to-"),
        )}
      >
        {app.name.charAt(0)}
      </div>
    )
  }

  return (
    <>
      <div className="sticky top-0 z-50 bg-background border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-3xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                ref={inputRef}
                type="text"
                placeholder="Search or ask a question…"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setIsOpen(true)
                  setFocusedIndex(-1)
                }}
                onFocus={() => setIsOpen(true)}
                className="pl-12 pr-16 h-14 text-base rounded-xl border-2 focus-visible:ring-2"
                aria-label="Search apps"
                aria-expanded={isOpen}
                aria-controls="search-results"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                <kbd className="px-2 py-1 text-xs font-semibold text-muted-foreground bg-muted rounded border">/</kbd>
              </div>

              {/* Search Dropdown */}
              {isOpen && (
                <div
                  ref={dropdownRef}
                  id="search-results"
                  className="absolute top-full left-0 right-0 mt-2 bg-background border-2 rounded-xl shadow-2xl max-h-[600px] overflow-y-auto z-50"
                  role="listbox"
                >
                  {/* Recent Apps */}
                  {!searchQuery && recentApps.length > 0 && (
                    <div className="p-2 border-b">
                      <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Recent
                      </div>
                      {recentApps.map((app, idx) => (
                        <button
                          key={app.id}
                          onClick={() => handleSelectApp(app)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-muted transition-colors text-left",
                            focusedIndex === idx && "bg-muted",
                          )}
                          role="option"
                          aria-selected={focusedIndex === idx}
                        >
                          {typeof getAppIcon(app) === "string" ? (
                            <img
                              src={(getAppIcon(app) as string) || "/placeholder.svg"}
                              alt=""
                              className="w-8 h-8 rounded-lg"
                            />
                          ) : (
                            getAppIcon(app)
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm truncate">{app.name}</div>
                            <div className="text-xs text-muted-foreground truncate">
                              {app.developer} • {app.genre}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Download className="h-3 w-3" />
                              {app.downloads30d}
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              {app.revenue30d}
                            </div>
                          </div>
                          <span className="text-lg">{getPlatformBadge(app.platform)}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Search Results */}
                  {searchQuery && (
                    <div className="p-2">
                      <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Apps {filteredApps.length > 0 && `(${filteredApps.length})`}
                      </div>
                      {filteredApps.length > 0 ? (
                        filteredApps.map((app, idx) => {
                          const actualIndex = recentApps.length + idx
                          return (
                            <button
                              key={app.id}
                              onClick={() => handleSelectApp(app)}
                              className={cn(
                                "w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-muted transition-colors text-left",
                                focusedIndex === actualIndex && "bg-muted",
                              )}
                              role="option"
                              aria-selected={focusedIndex === actualIndex}
                            >
                              {typeof getAppIcon(app) === "string" ? (
                                <img
                                  src={(getAppIcon(app) as string) || "/placeholder.svg"}
                                  alt=""
                                  className="w-8 h-8 rounded-lg"
                                />
                              ) : (
                                getAppIcon(app)
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-sm truncate">{app.name}</div>
                                <div className="text-xs text-muted-foreground truncate">
                                  {app.developer} • {app.genre}
                                </div>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Download className="h-3 w-3" />
                                  {app.downloads30d}
                                </div>
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3" />
                                  {app.revenue30d}
                                </div>
                              </div>
                              <span className="text-lg">{getPlatformBadge(app.platform)}</span>
                            </button>
                          )
                        })
                      ) : (
                        <div className="px-3 py-8 text-center">
                          <p className="text-sm text-muted-foreground mb-2">No apps found</p>
                          <Button variant="link" onClick={() => setAdvancedSearchOpen(true)} className="text-xs">
                            Try Advanced Search
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Footer with keyboard hints */}
                  <div className="border-t bg-muted/30 px-4 py-3 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <ArrowUpDown className="h-3 w-3" />
                        <span>to Select</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CornerDownLeft className="h-3 w-3" />
                        <span>to Open</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 bg-background rounded text-[10px] border">CTRL</kbd>
                        <CornerDownLeft className="h-3 w-3" />
                        <span>to Open in New Tab</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAdvancedSearchOpen(true)}
                      className="h-7 text-xs"
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      Advanced Search ›
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Current Selection Chip */}
            {selectedApp && (
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Current: {selectedApp.name}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSelection}
                  className="h-6 w-6 p-0 hover:bg-blue-100 dark:hover:bg-blue-900"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Advanced Search Modal */}
      <Dialog open={advancedSearchOpen} onOpenChange={setAdvancedSearchOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Advanced Search</DialogTitle>
            <DialogDescription>Filter apps by platform, country, category, and more</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Platform</label>
                <div className="flex gap-2">
                  <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                    🤖 Android
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                    🍎 iOS
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                    Both
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Country</label>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                    🇺🇸 US
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                    🇻🇳 VN
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                    🇯🇵 JP
                  </Badge>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                  Games
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                  Casual
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                  Puzzle
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                  Educational
                </Badge>
              </div>
            </div>
            <div className="pt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setAdvancedSearchOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setAdvancedSearchOpen(false)}>Apply Filters</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40" onClick={() => setIsOpen(false)} />
      )}
    </>
  )
}
