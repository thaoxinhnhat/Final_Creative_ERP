"use client"

import { useState, useEffect, Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import {
  Calendar,
  Search,
  AlertCircle,
  MoreVertical,
  Eye,
  Edit,
  Copy,
  Trash2,
  X,
  Plus,
  CheckCircle2,
  Upload,
  ExternalLink,
  FileText,
  Video,
  ImageIcon as ImageIconLucide,
  Grid3x3,
  ThumbsUp,
  ThumbsDown,
  Clock,
  RefreshCw,
  LinkIcon,
  TrendingUp,
  BadgeCheck,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Bell,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getStatusBadge } from "@/lib/storekit-utils"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PROJECTS_DATA } from "@/app/applications/aso-dashboard/projects-data"
import { Command, CommandGroup, CommandItem, CommandList } from "cmdk"

// Mock data cho apps
const mockApps = [
  { id: "1", name: "Fashion Show", bundleId: "com.example.fashionshow", icon: "/fashion-app-icon.jpg" },
  { id: "2", name: "Puzzle Master", bundleId: "com.example.puzzlemaster", icon: "/puzzle-game-icon.png" },
  { id: "3", name: "Racing Game", bundleId: "com.example.racinggame", icon: "/racing-game-icon.png" },
  { id: "1", name: "Meditation Pro", bundleId: "com.example.meditationpro", icon: "/meditation-app-icon.png" }, // Thêm cho ví dụ mới
  { id: "999", name: "Sleep Sounds", bundleId: "com.example.sleepsounds", icon: "/sleep-sounds-app-icon.jpg" }, // Thêm cho ví dụ mới
  {
    id: "4",
    name: "Focus Timer - Pomodoro",
    bundleId: "com.example.focustimer",
    icon: "/focus-timer-pomodoro-icon.jpg",
  }, // Thêm cho ví dụ mới
]

// Mock data cho StoreKit
const initialStoreKitItems = [
  {
    id: "stk-test-project-1",
    name: "Test FROM PROJECT - Check Badge",
    version: "v2.0.0-test",
    app: "Test App From Project",
    platform: "iOS",
    markets: ["US"],
    projectId: "1",
    metadataVersionId: "meta-test-project-1",
    campaignId: "Test-Campaign",
    hasMetadataSync: true,
    hasMultiScope: true,
    isFromProject: true, // ✅ Test: Entry từ Project → Có badge Project
    isLive: false,
    assetsPending: 1,
    assetDeadline: "2025-01-25",
    keywords: {
      count: 10,
      top5: ["test", "project", "badge", "check", "verify"],
    },
    assets: {
      total: 20,
      icon: 2,
      screenshot: 5,
      video: 1,
      featureGraphic: 1,
      promoBanner: 0,
      others: 0,
      thumbnails: [{ url: "/test-icon.png", type: "icon", locale: "en-US" }],
    },
    owner: "Test User",
    status: "approved", // SẴN SÀNG PUSH
    createdDate: "2025-01-18",
    updatedDate: "2025-01-18 10:00",
  },
  {
    id: "stk-test-adhoc-1",
    name: "Test AD-HOC - No Project Badge",
    version: "v1.0.0-adhoc",
    app: "Test Ad-hoc Update",
    platform: "Android",
    markets: ["US"],
    projectId: "999",
    hasMetadataSync: false,
    hasMultiScope: false,
    isFromProject: false, // ✅ Test: Ad-hoc → Không có badge Project
    isLive: false,
    assetsPending: 0,
    keywords: {
      count: 5,
      top5: ["adhoc", "test", "hotfix", "emergency", "quick"],
    },
    assets: {
      total: 15,
      icon: 1,
      screenshot: 3,
      video: 0,
      featureGraphic: 1,
      promoBanner: 0,
      others: 0,
      thumbnails: [{ url: "/test-adhoc-icon.png", type: "icon", locale: "en-US" }],
    },
    owner: "Test User",
    status: "in_design",
    createdDate: "2025-01-18",
    updatedDate: "2025-01-18 11:00",
  },
  {
    id: "stk-1",
    name: "Meditation Pro Winter 2025",
    version: "Spring-2025-STK-v1", // Naming convention với campaign (test vấn đề 5/)
    app: "Meditation Pro",
    platform: "iOS",
    markets: ["US", "UK", "CA"],
    projectId: "1",
    metadataVersionId: "meta-1",
    campaignId: "Winter-2025", // Campaign ID sync với Metadata
    hasMetadataSync: true,
    hasMultiScope: true, // Project scope Both
    isFromProject: true,
    isLive: true, // Version đang LIVE
    assetsPending: 0,
    assetDeadline: "2025-01-15", // Deadline từ Project (test vấn đề 6/)
    keywords: {
      count: 28,
      top5: ["meditation", "mindfulness", "sleep", "relax", "calm"],
    },
    assets: {
      total: 89,
      icon: 4,
      screenshot: 18,
      video: 3,
      featureGraphic: 2,
      promoBanner: 1,
      others: 0,
      thumbnails: [
        { url: "/meditation-app-icon.png", type: "icon", locale: "en-US" },
        { url: "/spring-fashion.jpg", type: "screenshot", locale: "en-US" },
      ],
    },
    owner: "Nguyen Van A",
    status: "published",
    createdDate: "2025-01-05",
    updatedDate: "2025-01-08 10:00",
  },
  {
    id: "stk-1-old",
    name: "Meditation Pro Winter 2025 v1",
    version: "Winter-2025-STK-v0.5",
    app: "Meditation Pro",
    platform: "iOS",
    markets: ["US", "UK"],
    projectId: "1",
    metadataVersionId: "meta-1-old",
    campaignId: "Winter-2025",
    hasMetadataSync: true,
    hasMultiScope: true,
    isFromProject: true,
    isLive: false, // Không LIVE, có thể rollback
    assetsPending: 0,
    assetDeadline: "2025-01-10",
    keywords: {
      count: 25,
      top5: ["meditation", "sleep", "relax", "mindfulness", "wellness"],
    },
    assets: {
      total: 75,
      icon: 3,
      screenshot: 15,
      video: 2,
      featureGraphic: 2,
      promoBanner: 0,
      others: 0,
      thumbnails: [{ url: "/meditation-app-icon.png", type: "icon", locale: "en-US" }],
    },
    owner: "Nguyen Van A",
    status: "published",
    createdDate: "2024-12-28",
    updatedDate: "2025-01-02 10:00",
  },
  {
    id: "stk-2",
    name: "Meditation Pro Vietnamese",
    version: "Winter-2025-STK-v2",
    app: "Meditation Pro",
    platform: "iOS",
    markets: ["VN"],
    projectId: "1",
    metadataVersionId: "meta-2",
    campaignId: "Winter-2025",
    hasMetadataSync: true,
    hasMultiScope: true, // Project scope Both, metadata đã push, chờ storekit
    isFromProject: true,
    isLive: false,
    assetsPending: 2, // Còn 2 assets đang pending
    assetDeadline: "2025-01-18", // Deadline từ Project
    keywords: {
      count: 30,
      top5: ["thiền", "thư giãn", "ngủ ngon", "meditation", "sleep"],
    },
    assets: {
      total: 80,
      icon: 4,
      screenshot: 16,
      video: 2,
      featureGraphic: 2,
      promoBanner: 1,
      others: 0,
      thumbnails: [{ url: "/meditation-app-icon.png", type: "icon", locale: "vi-VN" }],
    },
    owner: "Tran Thi B",
    status: "approved", // SẴN SÀNG PUSH
    createdDate: "2025-01-10",
    updatedDate: "2025-01-12 14:00",
  },
  {
    id: "stk-adhoc-1",
    name: "Sleep Sounds Hotfix",
    version: "v1.5.3-hotfix",
    app: "Sleep Sounds",
    platform: "Android",
    markets: ["US"],
    projectId: "999", // Không có project thực
    hasMetadataSync: false,
    hasMultiScope: false,
    isFromProject: false, // Ad-hoc update
    isLive: false,
    assetsPending: 1,
    keywords: {
      count: 20,
      top5: ["sleep", "sounds", "white noise", "relax", "sleep aid"],
    },
    assets: {
      total: 50,
      icon: 2,
      screenshot: 10,
      video: 1,
      featureGraphic: 1,
      promoBanner: 0,
      others: 0,
      thumbnails: [{ url: "/sleep-sounds-app-icon.jpg", type: "icon", locale: "en-US" }],
    },
    owner: "Le Van C",
    status: "in_design",
    createdDate: "2025-01-14",
    updatedDate: "2025-01-15 09:00",
  },
  {
    id: "stk-focus",
    name: "Focus Timer Spring Campaign",
    version: "Spring-2025-STK-v1",
    app: "Focus Timer - Pomodoro",
    platform: "Android",
    markets: ["US", "UK", "CA"],
    projectId: "4",
    metadataVersionId: "meta-4",
    campaignId: "Spring-2025", // Sync với metadata
    hasMetadataSync: true,
    hasMultiScope: true,
    isFromProject: true,
    isLive: true,
    assetsPending: 3,
    assetDeadline: "2025-01-20", // Deadline từ Project, gửi sang Asset Production
    keywords: {
      count: 35,
      top5: ["pomodoro", "timer", "productivity", "focus", "study"],
    },
    assets: {
      total: 95,
      icon: 5,
      screenshot: 20,
      video: 4,
      featureGraphic: 3,
      promoBanner: 2,
      others: 1,
      thumbnails: [{ url: "/focus-timer-pomodoro-icon.jpg", type: "icon", locale: "en-US" }],
    },
    owner: "Pham Thi D",
    status: "published",
    createdDate: "2025-01-08",
    updatedDate: "2025-01-10 16:00",
  },
  // Existing mock items (kept for completeness but could be commented out/removed if not needed for new examples)
  {
    id: "11",
    name: "Fashion Show Winter 2025",
    version: "v2.5",
    app: "Fashion Show",
    platform: "iOS",
    markets: ["US", "UK", "CA"],
    projectId: "1",
    metadataVersionId: "meta-v1",
    hasMetadataSync: true,
    assetsPending: 2,
    keywords: {
      count: 28,
      top5: ["winter", "fashion", "style", "clothing", "trendy"],
    },
    assets: {
      total: 89,
      icon: 4,
      screenshot: 18,
      video: 3,
      featureGraphic: 2,
      promoBanner: 1,
      others: 0,
      thumbnails: [
        { url: "/fashion-app-icon.jpg", type: "icon", locale: "en-US" },
        { url: "/spring-fashion.jpg", type: "screenshot", locale: "en-US" },
        { url: "/new-year-banner.jpg", type: "featureGraphic", locale: "en-US" },
      ],
    },
    owner: "Cao Thanh Tú",
    status: "published",
    createdDate: "2025-01-05",
    updatedDate: "2025-01-08 10:00",
  },
  {
    id: "12",
    name: "Fashion Show Winter 2025 - Updated Icon",
    version: "v2.6",
    app: "Fashion Show",
    platform: "iOS",
    markets: ["US", "UK", "CA"],
    projectId: "2",
    metadataVersionId: "meta-v2",
    hasMetadataSync: true,
    assetsPending: 5,
    keywords: {
      count: 28,
      top5: ["winter", "fashion", "style", "clothing", "trendy"],
    },
    assets: {
      total: 45,
      icon: 4,
      screenshot: 10,
      video: 4,
      featureGraphic: 2,
      promoBanner: 0,
      others: 1,
      thumbnails: [
        { url: "/spring-fashion.jpg", type: "icon", locale: "en-US" },
        { url: "/fashion-app-icon.jpg", type: "screenshot", locale: "en-US" },
      ],
    },
    owner: "Cao Thanh Tú",
    status: "approved",
    createdDate: "2025-01-12",
    updatedDate: "2025-01-14 15:30",
  },
  {
    id: "1",
    name: "Puzzle Master v3 - Spring Edition",
    version: "v3.0",
    app: "Puzzle Master",
    platform: "iOS",
    markets: ["US", "UK", "FR"],
    projectId: "3",
    hasMetadataSync: false,
    assetsPending: 0,
    keywords: {
      count: 35,
      top5: ["puzzle", "brain", "game", "logic", "challenge"],
    },
    assets: {
      total: 60,
      icon: 3,
      screenshot: 12,
      video: 2,
      featureGraphic: 1,
      promoBanner: 1,
      others: 0,
      thumbnails: [
        { url: "/puzzle-game-icon.png", type: "icon", locale: "en-US" },
        { url: "/racing-game-icon.png", type: "screenshot", locale: "en-US" },
      ],
    },
    owner: "Nguyễn Văn A",
    status: "in_design",
    createdDate: "2025-01-10",
    updatedDate: "2025-01-15 14:00",
  },
  {
    id: "2",
    name: "Puzzle Master v2.5",
    version: "v2.5",
    app: "Puzzle Master",
    platform: "Android",
    markets: ["US", "UK"],
    projectId: "4",
    metadataVersionId: "meta-v3",
    hasMetadataSync: true,
    assetsPending: 1,
    keywords: {
      count: 32,
      top5: ["puzzle", "brain", "game", "logic", "challenge"],
    },
    assets: {
      total: 55,
      icon: 3,
      screenshot: 10,
      video: 1,
      featureGraphic: 1,
      promoBanner: 0,
      others: 0,
      thumbnails: [
        { url: "/puzzle-game-icon.png", type: "icon", locale: "en-US" },
        { url: "/racing-game-icon.png", type: "screenshot", locale: "en-US" },
      ],
    },
    owner: "Trần Thị B",
    status: "design_completed",
    createdDate: "2025-01-08",
    updatedDate: "2025-01-13 16:45",
  },
  {
    id: "3",
    name: "Racing Game 2025",
    version: "v1.0",
    app: "Racing Game",
    platform: "iOS",
    markets: ["US"],
    hasMetadataSync: false,
    assetsPending: 0,
    keywords: {
      count: 40,
      top5: ["racing", "car", "speed", "drive", "game"],
    },
    assets: {
      total: 70,
      icon: 2,
      screenshot: 15,
      video: 3,
      featureGraphic: 1,
      promoBanner: 1,
      others: 0,
      thumbnails: [
        { url: "/racing-game-icon.png", type: "icon", locale: "en-US" },
        { url: "/fashion-app-icon.jpg", type: "screenshot", locale: "en-US" },
      ],
    },
    owner: "Lê Văn C",
    status: "draft",
    createdDate: "2025-01-15",
    updatedDate: "2025-01-15 09:20",
  },
]

const allMarkets = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "VN", name: "Vietnam", flag: "🇻🇳" },
  { code: "TH", name: "Thailand", flag: "🇹🇭" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "NO", name: "Norway", flag: "🇳🇴" },
  { code: "DK", name: "Denmark", flag: "🇩🇰" },
  { code: "FI", name: "Finland", flag: "🇫🇮" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿" },
  { code: "PH", name: "Philippines", flag: "🇵🇭" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾" },
  { code: "PK", name: "Pakistan", flag: "🇵🇰" },
  { code: "BD", name: "Bangladesh", flag: "🇧🇩" },
  { code: "EG", name: "Egypt", flag: "🇪🇬" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "TR", name: "Turkey", flag: "🇹🇷" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "PT", name: "Portugal", flag: "🇵🇹" },
  { code: "GR", name: "Greece", flag: "🇬🇷" },
  { code: "BE", name: "Belgium", flag: "🇧🇪" },
  { code: "AT", name: "Austria", flag: "🇦🇹" },
  { code: "PL", name: "Poland", flag: "🇵🇱" },
  { code: "HU", name: "Hungary", flag: "🇭🇺" },
  { code: "CZ", name: "Czech Republic", flag: "🇨🇿" },
  { code: "RO", name: "Romania", flag: "🇷🇴" },
  { code: "UA", name: "Ukraine", flag: "🇺🇦" },
  { code: "RU", name: "Russia", flag: "🇷🇺" },
  { code: "KZ", name: "Kazakhstan", flag: "🇰🇿" },
  { code: "UZ", name: "Uzbekistan", flag: "🇺🇿" },
  { code: "AZ", name: "Azerbaijan", flag: "🇦🇿" },
  { code: "GE", name: "Georgia", flag: "🇬🇪" },
  { code: "AM", name: "Armenia", flag: "🇦🇲" },
  { code: "LB", name: "Lebanon", flag: "🇱🇧" },
  { code: "JO", name: "Jordan", flag: "🇯🇴" },
  { code: "IQ", name: "Iraq", flag: "🇮🇶" },
  { code: "SY", name: "Syria", flag: "🇸🇾" },
  { code: "KW", name: "Kuwait", flag: "🇰🇼" },
  { code: "OM", name: "Oman", flag: "🇴🇲" },
  { code: "QA", name: "Qatar", flag: "🇶🇦" },
  { code: "BH", name: "Bahrain", flag: "🇧🇭" },
  { code: "CY", name: "Cyprus", flag: "🇨🇾" },
  { code: "MT", name: "Malta", flag: "🇲🇹" },
  { code: "LU", name: "Luxembourg", flag: "🇱🇺" },
  { code: "MC", name: "Monaco", flag: "🇲🇨" },
  { code: "AD", name: "Andorra", flag: "🇦🇩" },
  { code: "IS", name: "Iceland", flag: "🇮🇸" },
  { code: "LI", name: "Liechtenstein", flag: "🇱🇮" },
  { code: "SM", name: "San Marino", flag: "🇸🇲" },
  { code: "VA", name: "Vatican City", flag: "🇻🇦" },
  { code: "AL", name: "Albania", flag: "🇦🇱" },
  { code: "BA", name: "Bosnia and Herzegovina", flag: "🇧🇦" },
  { code: "HR", name: "Croatia", flag: "🇭🇷" },
  { code: "ME", name: "Montenegro", flag: "🇲🇪" },
  { code: "MK", name: "North Macedonia", flag: "🇲🇰" },
  { code: "RS", name: "Serbia", flag: "🇷🇸" },
  { code: "SI", name: "Slovenia", flag: "🇸🇮" },
  { code: "BG", name: "Bulgaria", flag: "🇧🇬" },
  { code: "EE", name: "Estonia", flag: "🇪🇪" },
  { code: "LV", name: "Latvia", flag: "🇱🇻" },
  { code: "LT", name: "Lithuania", flag: "🇱🇹" },
  { code: "MD", name: "Moldova", flag: "🇲🇩" },
  { code: "BY", name: "Belarus", flag: "🇧🇾" },
  { code: "UA", name: "Ukraine", flag: "🇺🇦" },
  { code: "GE", name: "Georgia", flag: "🇬🇪" },
  { code: "AZ", name: "Azerbaijan", flag: "🇦🇿" },
  { code: "KZ", name: "Kazakhstan", flag: "🇰🇿" },
  { code: "UZ", name: "Uzbekistan", flag: "🇺🇿" },
  { code: "TM", name: "Turkmenistan", flag: "🇹🇲" },
  { code: "AF", name: "Afghanistan", flag: "🇦🇫" },
  { code: "PK", name: "Pakistan", flag: "🇵🇰" },
  { code: "AF", name: "Afghanistan", flag: "🇦🇫" },
  { code: "LK", name: "Sri Lanka", flag: "🇱🇰" },
  { code: "NP", name: "Nepal", flag: "🇳🇵" },
  { code: "BT", name: "Bhutan", flag: "🇧🇹" },
  { code: "MM", name: "Myanmar", flag: "🇲🇲" },
  { code: "LA", name: "Laos", flag: "🇱🇦" },
  { code: "KH", name: "Cambodia", flag: "🇰🇭" },
  { code: "TL", name: "East Timor", flag: "🇹🇱" },
  { code: "MN", name: "Mongolia", flag: "🇲🇳" },
  { code: "HK", name: "Hong Kong", flag: "🇭🇰" },
  { code: "MO", name: "Macau", flag: "🇲🇴" },
  { code: "TW", name: "Taiwan", flag: "🇨🇳" },
  { code: "BN", name: "Brunei", flag: "🇧🇳" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾" },
  { code: "PH", name: "Philippines", flag: "🇵🇭" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "TH", name: "Thailand", flag: "🇹🇭" },
  { code: "TL", name: "East Timor", flag: "🇹🇱" },
  { code: "CX", name: "Christmas Island", flag: "🇨🇽" },
  { code: "CC", name: "Cocos (Keeling) Islands", flag: "🇨🇨" },
  { code: "HM", name: "Heard Island and McDonald Islands", flag: "🇭🇲" },
  { code: "NF", name: "Norfolk Island", flag: "🇳🇫" },
]

const statusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Sent to Design", value: "sent_to_design" },
  { label: "Design in Progress", value: "design_in_progress" },
  { label: "Design Completed", value: "design_completed" },
  { label: "Need Redesign", value: "need_redesign" },
  { label: "ASO Testing", value: "aso_testing" },
  { label: "Pending Lead Review", value: "pending_lead_review" },
  { label: "Approved", value: "approved" },
  { label: "Published", value: "published" },
  { label: "Previously Published", value: "previously_published" },
  { label: "Rejected", value: "rejected" },
]

const dateRangeOptions = [
  { label: "Last 7 days", value: "7days" },
  { label: "Last 30 days", value: "30days" },
  { label: "Last 90 days", value: "90days" },
  { label: "Custom range", value: "custom" },
]

function AssetsPillCell({ item }: { item: (typeof initialStoreKitItems)[0] }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  const { assets } = item

  // Tính toán các loại asset có sẵn (không bao gồm số 0)
  const assetTypes = [
    { key: "screenshot", label: "Shot", icon: "🖼️", count: assets.screenshot },
    { key: "video", label: "Video", icon: "▶️", count: assets.video },
    { key: "icon", label: "Icon", icon: "🟢", count: assets.icon },
    { key: "featureGraphic", label: "Feature", icon: "⭐", count: assets.featureGraphic },
    { key: "promoBanner", label: "Banner", icon: "🎯", count: assets.promoBanner },
    { key: "others", label: "Others", icon: "📦", count: assets.others },
  ].filter((type) => type.count > 0)

  // Hiển thị tối đa 4 pills, phần còn lại hiển thị +N
  const visibleTypes = assetTypes.slice(0, 4)
  const hiddenCount = assetTypes.length - 4

  // Empty state
  if (assets.total === 0) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="text-muted-foreground text-sm">—</div>
        </TooltipTrigger>
        <TooltipContent>
          <p>No assets</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  const handlePillClick = (type?: string) => {
    if (type) {
      setActiveTab(type)
    }
    setDrawerOpen(true)
  }

  return (
    <>
      <div className="flex flex-col gap-1.5 max-w-[220px]">
        {/* Dòng 1: Total pill */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => handlePillClick()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  handlePillClick()
                }
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 w-fit"
              aria-label={`${item.name} – Total assets – ${assets.total} items`}
            >
              <Grid3x3 className="h-3.5 w-3.5" />
              <span>Total {assets.total}</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Total: {assets.total} assets (click to view)</p>
          </TooltipContent>
        </Tooltip>

        {/* Dòng 2: Pills loại asset */}
        <div className="flex flex-wrap gap-1">
          {visibleTypes.map((type) => (
            <Tooltip key={type.key}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => handlePillClick(type.key)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      handlePillClick(type.key)
                    }
                  }}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
                  aria-label={`${item.name} – ${type.label} – ${type.count} items`}
                >
                  <span>{type.icon}</span>
                  <span>
                    {type.label} {type.count}
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {type.label}: {type.count} assets (click to view)
                </p>
              </TooltipContent>
            </Tooltip>
          ))}

          {hiddenCount > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => handlePillClick()}
                  className="inline-flex items-center px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-xs border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
                  aria-label={`${hiddenCount} more asset types`}
                >
                  +{hiddenCount}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{hiddenCount} more types (click to view all)</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Drawer for full asset view */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <span>{item.name}</span>
              <Badge variant="secondary" className="text-xs">
                Total {assets.total}
              </Badge>
            </SheetTitle>
            <SheetDescription>View and manage all assets for this StoreKit</SheetDescription>
          </SheetHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="icon">Icons ({assets.icon})</TabsTrigger>
              <TabsTrigger value="screenshot">Screenshots ({assets.screenshot})</TabsTrigger>
              <TabsTrigger value="video">Videos ({assets.video})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {assets.thumbnails.map((thumb, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={thumb.url || "/placeholder.svg"}
                      alt={`Asset ${idx + 1}`}
                      className="w-full aspect-video rounded-lg border object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="text-[10px] uppercase">
                        {thumb.type}
                      </Badge>
                    </div>
                    <div className="absolute bottom-2 right-2">
                      <Badge variant="secondary" className="text-[10px]">
                        {thumb.locale}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3">Asset Summary</h4>
                <div className="space-y-2 text-sm">
                  {assetTypes.map((type) => (
                    <div key={type.key} className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        {type.icon} {type.label}
                      </span>
                      <span className="font-medium">{type.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="icon" className="mt-4">
              <div className="grid grid-cols-3 gap-3">
                {assets.thumbnails
                  .filter((t) => t.type === "icon")
                  .map((thumb, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={thumb.url || "/placeholder.svg"}
                        alt={`Icon ${idx + 1}`}
                        className="w-full aspect-square rounded-lg border object-cover"
                      />
                      <div className="absolute bottom-2 right-2">
                        <Badge variant="secondary" className="text-[10px]">
                          {thumb.locale}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="screenshot" className="mt-4">
              <div className="grid grid-cols-2 gap-3">
                {assets.thumbnails
                  .filter((t) => t.type === "screenshot")
                  .map((thumb, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={thumb.url || "/placeholder.svg"}
                        alt={`Screenshot ${idx + 1}`}
                        className="w-full aspect-video rounded-lg border object-cover"
                      />
                      <div className="absolute bottom-2 right-2">
                        <Badge variant="secondary" className="text-[10px]">
                          {thumb.locale}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="video" className="mt-4">
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: assets.video }).map((_, idx) => (
                  <div key={idx} className="relative">
                    <div className="w-full aspect-video rounded-lg border bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <Video className="h-12 w-12 text-gray-400" />
                    </div>
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="text-[10px]">
                        Video {idx + 1}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 pt-4 border-t">
            <Button variant="outline" className="w-full bg-transparent" onClick={() => setDrawerOpen(false)}>
              Close
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

function StorekitPageContent() {
  const [storeKitItems, setStoreKitItems] = useState(initialStoreKitItems)

  const [searchTerm, setSearchTerm] = useState("")
  const [platformFilter, setPlatformFilter] = useState("all")
  const [marketFilter, setMarketFilter] = useState("all")
  const [marketSearchTerm, setMarketSearchTerm] = useState("") // Added market search state
  const [marketPopoverOpen, setMarketPopoverOpen] = useState(false) // Added market popover state
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateRangeType, setDateRangeType] = useState("30days")
  const [customStartDate, setCustomStartDate] = useState("")
  const [customEndDate, setCustomEndDate] = useState("")
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("list")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [projectFilter, setProjectFilter] = useState("all")
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<(typeof initialStoreKitItems)[0] | null>(null)
  const [detailActiveTab, setDetailActiveTab] = useState("assets")

  const [selectedMarkets, setSelectedMarkets] = useState<string[]>([])
  const [sendToDesign, setSendToDesign] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<{ type: string; files: File[] }[]>([])

  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string } | null>(null)

  // State for publish confirmation dialog
  const [publishDialogOpen, setPublishDialogOpen] = useState(false)
  const [itemToPublish, setItemToPublish] = useState<(typeof initialStoreKitItems)[0] | null>(null)

  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [selectedItemForReview, setSelectedItemForReview] = useState<(typeof initialStoreKitItems)[0] | null>(null)

  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [itemToApprove, setItemToApprove] = useState<(typeof initialStoreKitItems)[0] | null>(null)
  const [itemToReject, setItemToReject] = useState<(typeof initialStoreKitItems)[0] | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")

  const { toast } = useToast()
  const router = useRouter()

  // Use the searchParams hook for accessing query parameters
  const searchParams = new URLSearchParams(window.location.search)
  const projectIdFromUrl = searchParams.get("project_id")
  const [selectedProject, setSelectedProject] = useState<string>(projectFilter) // State to hold the selected project ID for filtering

  const [projectEntries, setProjectEntries] = useState<string[]>([])

  const [isToolbarExpanded, setIsToolbarExpanded] = useState(false)
  const [isGuideExpanded, setIsGuideExpanded] = useState(false)
  const [isNotificationExpanded, setIsNotificationExpanded] = useState(false)
  const [notificationListExpanded, setNotificationListExpanded] = useState(false)
  const [readNotifications, setReadNotifications] = useState<Set<string>>(new Set())
  const [deletedNotifications, setDeletedNotifications] = useState<Set<string>>(new Set()) // NEW: Track deleted notifications
  const [notificationMenuOpen, setNotificationMenuOpen] = useState<string | null>(null) // NEW: Track which menu is open
  const [deleteNotificationDialogOpen, setDeleteNotificationDialogOpen] = useState(false) // NEW: Delete dialog state
  const [notificationToDelete, setNotificationToDelete] = useState<string | null>(null) // NEW: Track notification to delete
  const [selectedFilter, setSelectedFilter] = useState("all") // Added state for selected filter

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter)
    // Implement actual filtering logic here based on the 'filter' value
    // For example, you might update the 'statusFilter' or other filter states.
    // For now, it just updates the visual state of the buttons.
  }

  useEffect(() => {
    if (projectIdFromUrl) {
      setSelectedProject(projectIdFromUrl)
      setProjectFilter(projectIdFromUrl) // Also set the filter to the project ID from URL
    }
  }, [projectIdFromUrl])

  useEffect(() => {
    const entriesFromProjects = initialStoreKitItems // Use initialStoreKitItems directly here
      .filter((s) => s.isFromProject && s.projectId && s.projectId !== "0" && s.projectId !== "999")
      .map((s) => s.projectId)
      .filter((id): id is string => id !== undefined)
    setProjectEntries([...new Set(entriesFromProjects)])
  }, [])

  useEffect(() => {
    try {
      const savedItems = localStorage.getItem("storekit_items")
      if (savedItems) {
        const parsedItems = JSON.parse(savedItems)
        // Merge saved items with initial items, avoiding duplicates by ID
        const existingIds = new Set(initialStoreKitItems.map((item) => item.id))
        const newItems = parsedItems.filter((item: any) => !existingIds.has(item.id))
        setStoreKitItems([...newItems, ...initialStoreKitItems])
      }
    } catch (error) {
      console.error("Failed to load from localStorage:", error)
    }
  }, [])

  const handleDeleteItem = (itemId: string, itemName: string) => {
    setItemToDelete({ id: itemId, name: itemName })
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!itemToDelete) return

    // Remove from state
    setStoreKitItems((prev) => prev.filter((item) => item.id !== itemToDelete.id))

    // Remove from localStorage
    try {
      const savedItems = localStorage.getItem("storekit_items")
      if (savedItems) {
        const parsedItems = JSON.parse(savedItems)
        const updatedItems = parsedItems.filter((item: any) => item.id !== itemToDelete.id)
        localStorage.setItem("storekit_items", JSON.stringify(updatedItems))
      }
    } catch (error) {
      console.error("Failed to update localStorage:", error)
    }

    // Show success toast with green checkmark
    toast({
      title: "Xóa thành công",
      description: `StoreKit "${itemToDelete.name}" đã được xóa khỏi hệ thống.`,
    })

    // Close dialog and reset state
    setDeleteDialogOpen(false)
    setItemToDelete(null)
  }

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false)
    setItemToDelete(null)
  }

  const handlePublishToStore = (item: (typeof initialStoreKitItems)[0]) => {
    setItemToPublish(item)
    setPublishDialogOpen(true)
  }

  const handleConfirmPublish = async () => {
    if (!itemToPublish) return

    const storeName = itemToPublish.platform === "iOS" ? "App Store" : "Google Play"

    setPublishDialogOpen(false)

    toast({
      title: "🚀 Đang publish...",
      description: `Đang đẩy thông tin lên ${storeName}. Vui lòng đợi...`,
    })

    // Simulate API call to publish
    setTimeout(() => {
      const now = new Date()
      const currentDateTime = `${now.toISOString().split("T")[0]} ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`

      setStoreKitItems((prev) =>
        prev.map((i) => {
          if (i.id === itemToPublish.id) {
            return {
              ...i,
              status: "published" as const,
              updatedDate: currentDateTime,
            }
          }
          if (i.app === itemToPublish.app && i.status === "published" && i.id !== itemToPublish.id) {
            return {
              ...i,
              status: "previously_published" as const,
              updatedDate: currentDateTime,
            }
          }
          return i
        }),
      )

      // Update localStorage
      try {
        const savedItems = localStorage.getItem("storekit_items")
        if (savedItems) {
          const parsedItems = JSON.parse(savedItems)
          const updatedItems = parsedItems.map((i: any) => {
            if (i.id === itemToPublish.id) {
              return {
                ...i,
                status: "published",
                updatedDate: currentDateTime,
              }
            }
            if (i.app === itemToPublish.app && i.status === "published" && i.id !== itemToPublish.id) {
              return {
                ...i,
                status: "previously_published",
                updatedDate: currentDateTime,
              }
            }
            return i
          })
          localStorage.setItem("storekit_items", JSON.stringify(updatedItems))
        }
      } catch (error) {
        console.error("Failed to update localStorage:", error)
      }

      toast({
        title: "✅ Publish thành công!",
        description: `StoreKit "${itemToPublish.name}" đã được publish lên ${storeName}. Các phiên bản cũ đã được chuyển về trạng thái "Previously Published".`,
      })

      setItemToPublish(null)
    }, 2000)
  }

  const handleCancelPublish = () => {
    setPublishDialogOpen(false)
    setItemToPublish(null)
  }

  const handleOpenReviewDialog = (item: (typeof initialStoreKitItems)[0]) => {
    setSelectedItemForReview(item)
    setReviewDialogOpen(true)
  }

  const handleApproveDesign = (item: (typeof initialStoreKitItems)[0]) => {
    setItemToApprove(item)
    setApproveDialogOpen(true)
  }

  const handleConfirmApprove = () => {
    if (!itemToApprove) return

    const now = new Date()
    const currentDateTime = `${now.toISOString().split("T")[0]} ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`

    // Update item status to aso_testing
    setStoreKitItems((prev) =>
      prev.map((i) =>
        i.id === itemToApprove.id
          ? {
            ...i,
            status: "aso_testing" as const,
            updatedDate: currentDateTime,
          }
          : i,
      ),
    )

    // Update localStorage
    try {
      const savedItems = localStorage.getItem("storekit_items")
      if (savedItems) {
        const parsedItems = JSON.parse(savedItems)
        const updatedItems = parsedItems.map((i: any) =>
          i.id === itemToApprove.id
            ? {
              ...i,
              status: "aso_testing",
              updatedDate: currentDateTime,
            }
            : i,
        )
        localStorage.setItem("storekit_items", JSON.stringify(updatedItems))
      }
    } catch (error) {
      console.error("Failed to update localStorage:", error)
    }

    toast({
      title: "✅ Đã duyệt Design",
      description: `StoreKit "${itemToApprove.name}" đã được duyệt và chuyển sang trạng thái "ASO Testing".`,
    })

    setApproveDialogOpen(false)
    setItemToApprove(null)
  }

  const handleRejectDesign = (item: (typeof initialStoreKitItems)[0]) => {
    setItemToReject(item)
    setRejectDialogOpen(true)
  }

  const handleConfirmReject = () => {
    if (!itemToReject) return

    if (!rejectionReason.trim()) {
      toast({
        title: "Thiếu lý do từ chối",
        description: "Bạn cần nhập lý do từ chối để Design team biết cần chỉnh sửa gì.",
        variant: "destructive",
      })
      return
    }

    const now = new Date()
    const currentDateTime = `${now.toISOString().split("T")[0]} ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`

    // Update item status to need_redesign and save rejection reason
    setStoreKitItems((prev) =>
      prev.map((i) =>
        i.id === itemToReject.id
          ? {
            ...i,
            status: "need_redesign" as const,
            updatedDate: currentDateTime,
            rejectionReason: rejectionReason.trim(),
          }
          : i,
      ),
    )

    // Update localStorage
    try {
      const savedItems = localStorage.getItem("storekit_items")
      if (savedItems) {
        const parsedItems = JSON.parse(savedItems)
        const updatedItems = parsedItems.map((i: any) =>
          i.id === itemToReject.id
            ? {
              ...i,
              status: "need_redesign",
              updatedDate: new Date().toISOString(),
              rejectionReason: rejectionReason.trim(),
            }
            : i,
        )
        localStorage.setItem("storekit_items", JSON.stringify(updatedItems))
      }
    } catch (error) {
      console.error("Failed to update localStorage:", error)
    }

    toast({
      title: "⚠️ Đã yêu cầu chỉnh sửa",
      description: `StoreKit "${itemToReject.name}" đã được chuyển về trạng thái "Need Redesign" với lý do: "${rejectionReason.trim()}".`,
    })

    setRejectDialogOpen(false)
    setItemToReject(null)
    setRejectionReason("")
  }

  // Filter logic
  const filteredItems = storeKitItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.app.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.version.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesPlatform = platformFilter === "all" || item.platform.toLowerCase() === platformFilter.toLowerCase()

    const matchesMarket = marketFilter === "all" || item.markets.includes(marketFilter)

    const matchesStatus = statusFilter === "all" || item.status === statusFilter

    const matchesProject = projectFilter === "all" || item.projectId === projectFilter

    // Apply the new quick filter logic
    let matchesQuickFilter = false
    switch (selectedFilter) {
      case "all":
        matchesQuickFilter = true
        break
      case "pending_aso":
        matchesQuickFilter = item.status === "design_completed"
        break
      case "waiting_to_create":
        matchesQuickFilter = item.status === "pending_lead_review"
        break
      case "ready_to_publish":
        matchesQuickFilter = item.status === "approved"
        break
      default:
        matchesQuickFilter = true
    }

    return matchesSearch && matchesPlatform && matchesMarket && matchesStatus && matchesProject && matchesQuickFilter
  })

  const sortedItems = [...filteredItems].sort((a, b) => {
    // 1. Published lên đầu tiên, ưu tiên LIVE hơn
    if (a.isLive && !b.isLive) return -1
    if (!a.isLive && b.isLive) return 1
    if (a.status === "published" && b.status !== "published") return -1
    if (a.status !== "published" && b.status === "published") return 1

    // 2. Nếu cả hai đều published hoặc đều không published, sắp xếp theo updatedDate (mới nhất trước)
    const dateA = new Date(a.updatedDate).getTime()
    const dateB = new Date(b.updatedDate).getTime()
    return dateB - dateA
  })

  const getDateRangeLabel = () => {
    const option = dateRangeOptions.find((opt) => opt.value === dateRangeType)
    if (dateRangeType === "custom" && customStartDate && customEndDate) {
      return `${customStartDate} → ${customEndDate}`
    }
    return option?.label || "Chọn khoảng thời gian"
  }

  const handleApplyDateRange = () => {
    setDatePickerOpen(false)
  }

  const totalPages = Math.ceil(sortedItems.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedItems = sortedItems.slice(startIndex, endIndex)

  const handleDuplicateItem = (item: (typeof initialStoreKitItems)[0]) => {
    // Create a new unique ID
    const newId = `${Date.now()}`

    // Create a timestamp for the current date and time
    const now = new Date()
    const currentDate = now.toISOString().split("T")[0]
    const currentDateTime = `${currentDate} ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`

    // Create a copy with new information
    const duplicatedItem: (typeof initialStoreKitItems)[0] = {
      ...item,
      id: newId,
      name: `${item.name} (Copy)`,
      status: "draft" as const,
      createdDate: currentDate,
      updatedDate: currentDateTime,
      isLive: false, // Duplicated items are not live by default
      projectId: "", // Reset project link for duplicated items
      metadataVersionId: "", // Reset metadata version ID
      hasMetadataSync: false, // Reset metadata sync
      hasMultiScope: false, // Reset multi scope
      campaignId: "", // Reset campaign ID
      isFromProject: false, // Duplicated items are treated as ad-hoc unless re-linked
      assetDeadline: item.assetDeadline || "", // Ensure assetDeadline is always a string
    }

    setStoreKitItems((prev) => [duplicatedItem, ...prev])

    try {
      const existingItems = JSON.parse(localStorage.getItem("storekit_items") || "[]")
      existingItems.push(duplicatedItem)
      localStorage.setItem("storekit_items", JSON.stringify(existingItems))
    } catch (error) {
      console.error("Failed to save to localStorage:", error)
    }

    toast({
      title: "📋 Đã sao chép StoreKit",
      description: `Đã tạo bản sao của "${item.name}". Bạn có thể chỉnh sửa và lưu.`,
    })

    // Redirect to the edit page of the new copy
    setTimeout(() => {
      router.push(`/applications/storekit-management/${newId}?mode=edit`)
    }, 500)
  }

  const handleRequestAsset = (item: (typeof initialStoreKitItems)[0]) => {
    toast({
      title: "Request Asset",
      description: `Sending asset request for ${item.name} to Asset Production & Approval...`,
    })
    // Logic gửi brief sang Asset Production & Approval
  }

  const handleViewAssetProgress = (item: (typeof initialStoreKitItems)[0]) => {
    toast({
      title: "View Asset Progress",
      description: `Opening asset production progress for ${item.name}...`,
    })
    // Navigate to Asset Production & Approval
  }

  const handleViewProject = (item: (typeof initialStoreKitItems)[0]) => {
    if (item.projectId && item.projectId !== "999") {
      // Ignore ad-hoc projects
      router.push(`/applications/aso-dashboard/${item.projectId}`)
    } else {
      toast({
        title: "No Project Linked",
        description: "This StoreKit is not linked to a project.",
      })
    }
  }

  const handleViewPerformance = (item: (typeof initialStoreKitItems)[0]) => {
    if (item.status === "published" || item.isLive) {
      toast({
        title: "View Performance",
        description: `Opening performance data for ${item.name}...`,
      })
      // Navigate to Optimization & Tracking
    } else {
      toast({
        title: "Performance Not Available",
        description: "Performance data is only available for published StoreKits.",
      })
    }
  }

  const handleOpenDetailModal = (item: (typeof initialStoreKitItems)[0]) => {
    setSelectedItemForDetail(item)
    setDetailModalOpen(true)
  }

  const filteredMarkets = allMarkets.filter(
    (market) =>
      market.name.toLowerCase().includes(marketSearchTerm.toLowerCase()) ||
      market.code.toLowerCase().includes(marketSearchTerm.toLowerCase()),
  )

  const selectedMarket = allMarkets.find((m) => m.code === marketFilter) || allMarkets[0]

  // Cập nhật notificationCounts dựa trên trạng thái mới
  const notificationCounts = {
    needAsoReview: storeKitItems.filter((item) => item.status === "design_completed").length,
    pendingCreate: storeKitItems.filter((item) => item.status === "pending_lead_review").length,
    readyToPublish: storeKitItems.filter((item) => item.status === "approved").length,
    assetsPending: storeKitItems.filter((item) => item.assetsPending > 0 && item.status !== "published").length,
  }

  // NEW: Build notifications array for expand/collapse logic
  const allNotifications = [
    ...(notificationCounts.needAsoReview > 0 ? [{
      id: 'needAsoReview',
      type: 'warning' as const,
      icon: AlertCircle,
      iconBg: 'bg-orange-100 dark:bg-orange-900/30',
      iconColor: 'text-orange-600 dark:text-orange-400',
      badgeColor: 'bg-red-500',
      badgeVariant: 'destructive' as const,
      title: 'StoreKits cần ASO duyệt',
      count: notificationCounts.needAsoReview,
      description: `${notificationCounts.needAsoReview} StoreKit đang chờ ASO review và duyệt design`,
      timestamp: '2 giờ trước',
      onClick: () => {
        markAsRead('needAsoReview') // Mark as read when clicked
        setStatusFilter("design_completed")
        setIsNotificationExpanded(false)
      }
    }] : []),
    ...(notificationCounts.pendingCreate > 0 ? [{
      id: 'pendingCreate',
      type: 'info' as const,
      icon: Clock,
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      badgeColor: 'bg-blue-600',
      badgeVariant: 'default' as const,
      title: 'StoreKits chờ Create',
      count: notificationCounts.pendingCreate,
      description: `${notificationCounts.pendingCreate} StoreKit đang chờ được tạo mới`,
      timestamp: '5 giờ trước',
      onClick: () => {
        markAsRead('pendingCreate')
        setStatusFilter("pending_lead_review")
        setIsNotificationExpanded(false)
      }
    }] : []),
    ...(notificationCounts.readyToPublish > 0 ? [{
      id: 'readyToPublish',
      type: 'success' as const,
      icon: CheckCircle2,
      iconBg: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400',
      badgeColor: 'bg-green-600',
      badgeVariant: 'default' as const,
      title: 'Sẵn sàng Publish',
      count: notificationCounts.readyToPublish,
      description: `${notificationCounts.readyToPublish} StoreKit đã được duyệt và sẵn sàng publish lên store`,
      timestamp: '1 ngày trước',
      onClick: () => {
        markAsRead('readyToPublish')
        setStatusFilter("approved")
        setIsNotificationExpanded(false)
      }
    }] : []),
    ...(notificationCounts.assetsPending > 0 ? [{
      id: 'assetsPending',
      type: 'warning' as const,
      icon: Clock,
      iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      badgeColor: 'bg-yellow-600',
      badgeVariant: 'default' as const,
      title: 'Assets đang chờ',
      count: notificationCounts.assetsPending,
      description: `${notificationCounts.assetsPending} StoreKit có assets đang trong quá trình sản xuất`,
      timestamp: '3 giờ trước',
      onClick: () => {
        markAsRead('assetsPending')
        setIsNotificationExpanded(false)
      }
    }] : []),

    // FAKE DATA FOR TESTING - XÓA SAU KHI TEST XONG
    ...(true ? [{
      id: 'test5',
      type: 'info' as const,
      icon: Clock,
      iconBg: 'bg-gray-100 dark:bg-gray-900/30',
      iconColor: 'text-gray-600 dark:text-gray-400',
      badgeColor: 'bg-gray-600',
      badgeVariant: 'default' as const,
      title: 'Test Notification 5',
      count: 5,
      description: 'Test notification to trigger show more button',
      timestamp: '5 giờ trước',
      onClick: () => {
        markAsRead('test5')
        setIsNotificationExpanded(false)
      },
    }] : []),

    ...(true ? [{
      id: 'test6',
      type: 'info' as const,
      icon: Clock,
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-600',
      badgeColor: 'bg-gray-600',
      badgeVariant: 'default' as const,
      title: 'Test 6',
      count: 1,
      description: 'Another test',
      timestamp: '6h ago',
      onClick: () => {
        markAsRead('test6')
      },
    }] : []),
  ]

  // NEW: Helper functions for read state
  const markAsRead = (id: string) => {
    setReadNotifications(prev => new Set([...prev, id]))
  }

  // NEW: Toggle read/unread
  const toggleReadStatus = (id: string) => {
    setReadNotifications(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const markAllAsRead = () => {
    setReadNotifications(new Set(allNotifications.map(n => n.id)))
  }

  // NEW: Delete notification handlers
  const handleDeleteNotification = (id: string) => {
    setNotificationToDelete(id)
    setDeleteNotificationDialogOpen(true)
    setNotificationMenuOpen(null)
  }

  const confirmDeleteNotification = () => {
    if (notificationToDelete) {
      setDeletedNotifications(prev => new Set([...prev, notificationToDelete]))
      toast({
        title: "✓ Đã xóa thông báo",
        description: "Thông báo đã được xóa thành công.",
      })
    }
    setDeleteNotificationDialogOpen(false)
    setNotificationToDelete(null)
  }

  // Filter out deleted notifications
  const visibleNotifications = allNotifications.filter(n => !deletedNotifications.has(n.id))

  const unreadCount = visibleNotifications.filter(n => !readNotifications.has(n.id)).length

  const NOTIFICATION_LIMIT = 3
  const displayedNotifications = notificationListExpanded
    ? visibleNotifications
    : visibleNotifications.slice(0, NOTIFICATION_LIMIT)
  const hasMoreNotifications = visibleNotifications.length > NOTIFICATION_LIMIT

  // ...existing code until Bell icon notification section...

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/applications")}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Quay lại
            </Button>
            <div className="border-l border-gray-300 dark:border-gray-700 h-6"></div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">StoreKit Management</h1>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                Quản lý visual assets và StoreKit configurations
              </p>
            </div>
          </div>

          {/* Bell icon notification at header */}
          <div className="flex items-center gap-3">
            <Popover open={isNotificationExpanded} onOpenChange={(open) => {
              setIsNotificationExpanded(open)
              if (!open) {
                setNotificationListExpanded(false)
                setNotificationMenuOpen(null)
              }
            }}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-6 w-6 text-gray-900 dark:text-gray-100" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96 p-0" align="end">
                {/* Header with Mark all as read button */}
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-base">Notifications</h4>
                      {unreadCount > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {unreadCount} new
                        </Badge>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950 h-7 px-2"
                        onClick={markAllAsRead}
                      >
                        Đánh dấu đã đọc
                      </Button>
                    )}
                  </div>
                </div>

                {/* Notification List with expand/collapse */}
                <div
                  className={`overflow-y-auto transition-all duration-300 ${notificationListExpanded ? 'max-h-[600px]' : 'max-h-[400px]'
                    }`}
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#d1d5db transparent',
                  }}
                >
                  {visibleNotifications.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      <Bell className="h-10 w-10 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">No new notifications</p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {displayedNotifications.map((notification) => {
                        const IconComponent = notification.icon
                        const isRead = readNotifications.has(notification.id)
                        return (
                          <div
                            key={notification.id}
                            className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors relative group ${isRead ? 'opacity-60' : ''
                              }`}
                            onClick={notification.onClick}
                          >
                            <div className="flex items-start gap-3">
                              <div className="relative mt-1">
                                <div className={`h-10 w-10 rounded-full ${notification.iconBg} flex items-center justify-center`}>
                                  <IconComponent className={`h-5 w-5 ${notification.iconColor}`} />
                                </div>
                                {/* Only show blue dot for unread */}
                                {!isRead && (
                                  <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-blue-500 rounded-full border-2 border-white dark:border-gray-900"></span>
                                )}
                              </div>
                              <div className="flex-1 min-w-0 pr-6">
                                <div className="flex items-center gap-2">
                                  <p className={`text-sm font-medium text-gray-900 dark:text-gray-100 ${isRead ? 'font-normal' : ''}`}>
                                    {notification.title}
                                  </p>
                                  <Badge
                                    variant={notification.badgeVariant}
                                    className={`text-[10px] px-1.5 py-0 h-5 ${notification.badgeVariant === 'default' ? notification.badgeColor : ''}`}
                                  >
                                    {notification.count}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {notification.description}
                                </p>
                                <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  <span>{notification.timestamp}</span>
                                </div>
                              </div>

                              {/* Context Menu Button */}
                              <div className="absolute top-3 right-3">
                                <DropdownMenu
                                  open={notificationMenuOpen === notification.id}
                                  onOpenChange={(open) => {
                                    setNotificationMenuOpen(open ? notification.id : null)
                                  }}
                                >
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                      }}
                                    >
                                      <MoreVertical className="h-4 w-4 text-gray-500" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        toggleReadStatus(notification.id)
                                        setNotificationMenuOpen(null)
                                      }}
                                    >
                                      {isRead ? (
                                        <>
                                          <Eye className="h-4 w-4 mr-2" />
                                          Đánh dấu chưa đọc
                                        </>
                                      ) : (
                                        <>
                                          <CheckCircle2 className="h-4 w-4 mr-2" />
                                          Đánh dấu đã đọc
                                        </>
                                      )}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-red-600 focus:text-red-600"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleDeleteNotification(notification.id)
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Xóa thông báo
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Expand/Collapse Button */}
                {hasMoreNotifications && (
                  <div className="p-2 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950"
                      onClick={() => setNotificationListExpanded(!notificationListExpanded)}
                    >
                      {notificationListExpanded ? (
                        <>
                          <ChevronUp className="h-4 w-4 mr-2" />
                          Thu gọn
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4 mr-2" />
                          Xem thêm {visibleNotifications.length - NOTIFICATION_LIMIT} thông báo
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {projectIdFromUrl && projectEntries.includes(projectIdFromUrl) && (
            <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-600 text-white rounded-full p-2">
                    <BadgeCheck className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">From Project Management</h3>
                    <p className="text-sm text-gray-700 mb-3">
                      Các StoreKit entries dưới đây được tạo từ Project{" "}
                      <strong>
                        {PROJECTS_DATA.find((p) => p.id === projectIdFromUrl)?.appName || `#${projectIdFromUrl}`}
                      </strong>
                      . StoreKit từ Project được đánh dấu với badge "Project" để phân biệt với entries ad-hoc.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/applications/aso-dashboard/${projectIdFromUrl}`)}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Project
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedProject("all")
                          router.push("/applications/storekit-management")
                        }}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Clear Filter
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Toolbar with Search and 4 Filters */}
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <Input
                    placeholder="Tìm theo App, StoreKit hoặc phiên bản…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 h-9 text-sm"
                  />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 h-11 text-base font-bold px-6"
                    onClick={() => {
                      router.push(`/applications/storekit-create`)
                    }}
                    title="Setup ban đầu cho app mới hoặc tạo version mới ad-hoc"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Tạo StoreKit mới
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Area */}
          {/* Notification Area - Moved to Bell icon in header */}

          {/* Empty State */}
          {sortedItems.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <AlertCircle className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Không có StoreKit phù hợp
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-4">
                  Không có StoreKit phù hợp với bộ lọc hiện tại. Hãy thử đổi Market/Status/Platform/Period để xem thêm.
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchTerm("")
                      setPlatformFilter("all")
                      setMarketFilter("all")
                      setStatusFilter("all")
                      setProjectFilter("all") // Reset project filter
                      setIsToolbarExpanded(true) // Open the toolbar when clearing filters
                      setSelectedFilter("all") // Reset the new quick filter
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Xóa bộ lọc
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Table of StoreKit Items */}
          {sortedItems.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Danh sách StoreKit</CardTitle>
                  </div>
                  {/* Filters and Date Range */}
                  <div className="flex items-center gap-2">
                    {/* Platform Filter */}
                    <Select value={platformFilter} onValueChange={setPlatformFilter}>
                      <SelectTrigger className="w-[150px] h-9 text-sm">
                        <SelectValue placeholder="Platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Platforms</SelectItem>
                        <SelectItem value="ios">iOS</SelectItem>
                        <SelectItem value="android">Android</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Market Filter */}
                    <Popover open={marketPopoverOpen} onOpenChange={setMarketPopoverOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-[180px] justify-between h-9 text-sm bg-transparent"
                        >
                          {marketFilter === "all"
                            ? "All Markets"
                            : allMarkets.find((m) => m.code === marketFilter)?.name || "All Markets"}
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Input
                          placeholder="Search markets..."
                          className="h-8 mb-2"
                          value={marketSearchTerm}
                          onChange={(e) => setMarketSearchTerm(e.target.value)}
                        />
                        <Command>
                          <CommandList>
                            <CommandGroup>
                              <CommandItem
                                onSelect={() => {
                                  setMarketFilter("all")
                                  setMarketPopoverOpen(false)
                                }}
                                className="cursor-pointer"
                              >
                                All Markets
                              </CommandItem>
                              {filteredMarkets.map((market) => (
                                <CommandItem
                                  key={market.code}
                                  value={market.code}
                                  onSelect={(value) => {
                                    setMarketFilter(value)
                                    setMarketPopoverOpen(false)
                                  }}
                                  className="cursor-pointer"
                                >
                                  {market.name} ({market.code})
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    {/* Project Filter */}
                    <Select value={projectFilter} onValueChange={setProjectFilter}>
                      <SelectTrigger className="w-[180px] h-9 text-sm">
                        <SelectValue placeholder="Project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Projects</SelectItem>
                        {PROJECTS_DATA.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.appName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Status Filter */}
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[180px] h-9 text-sm">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Date Range Filter */}
                    <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-[200px] justify-between h-9 text-sm bg-transparent">
                          <Calendar className="mr-2 h-4 w-4" />
                          <span>{getDateRangeLabel()}</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="end" className="w-auto p-0">
                        <Select
                          value={dateRangeType}
                          onValueChange={setDateRangeType}
                          onOpenChange={(open) => {
                            if (!open) setDatePickerOpen(false)
                          }}
                        >
                          <SelectTrigger className="m-2 w-[180px]">
                            <SelectValue placeholder="Select date range" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            {dateRangeOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {dateRangeType === "custom" && (
                          <div className="p-4">
                            <div className="flex items-center space-x-2">
                              <div className="grid flex-1 gap-1">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                  Start Date
                                </label>
                                <Input
                                  type="date"
                                  value={customStartDate}
                                  onChange={(e) => setCustomStartDate(e.target.value)}
                                />
                              </div>
                              <div className="grid flex-1 gap-1">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                  End Date
                                </label>
                                <Input
                                  type="date"
                                  value={customEndDate}
                                  onChange={(e) => setCustomEndDate(e.target.value)}
                                />
                              </div>
                            </div>
                            <Button size="sm" className="mt-4 w-full" onClick={handleApplyDateRange}>
                              Apply Date Range
                            </Button>
                          </div>
                        )}
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <TooltipProvider>
                  <div className="rounded-md border relative">
                    <div className="max-h-[600px] overflow-y-auto">
                      <Table>
                        <TableHeader className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b-2 border-gray-300 dark:border-gray-600">
                          <TableRow className="border-b-2 border-gray-300 dark:border-gray-600">
                            <TableHead className="w-[200px] font-bold text-sm bg-gray-100 dark:bg-gray-800">
                              App
                            </TableHead>
                            <TableHead className="w-[80px] font-bold text-sm bg-gray-100 dark:bg-gray-800">
                              Version
                            </TableHead>
                            <TableHead className="w-[160px] font-bold text-sm bg-gray-100 dark:bg-gray-800">
                              StoreKit
                            </TableHead>
                            <TableHead className="w-[120px] font-bold text-sm bg-gray-100 dark:bg-gray-800">
                              Markets
                            </TableHead>
                            <TableHead className="w-[180px] font-bold text-sm bg-gray-100 dark:bg-gray-800">
                              Images
                            </TableHead>
                            <TableHead className="w-[120px] font-bold text-sm bg-gray-100 dark:bg-gray-800">
                              Owner
                            </TableHead>
                            <TableHead className="w-[120px] font-bold text-sm bg-gray-100 dark:bg-gray-800">
                              Status
                            </TableHead>
                            <TableHead className="w-[100px] font-bold text-sm bg-gray-100 dark:bg-gray-800">
                              Updated
                            </TableHead>
                            <TableHead className="w-[80px] text-right font-bold text-sm bg-gray-100 dark:bg-gray-800">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedItems.map((item) => {
                            const app = mockApps.find((a) => a.name === item.app)
                            const project = PROJECTS_DATA.find((p) => p.id === item.projectId) //

                            return (
                              <TableRow key={item.id} className="hover:bg-muted/50">
                                <TableCell>
                                  <button
                                    className="flex items-center gap-3 text-left hover:opacity-80 transition-opacity"
                                    onClick={() => handleOpenDetailModal(item)}
                                  >
                                    <img
                                      src={app?.icon || "/placeholder.svg?height=40&width=40"}
                                      alt={item.app}
                                      className="h-8 w-8 rounded-lg border object-cover flex-shrink-0"
                                    />
                                    <div className="flex flex-col min-w-0">
                                      <span className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
                                        {item.app}
                                      </span>
                                      <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                                        {app?.bundleId || "com.example.app"}
                                      </span>
                                    </div>
                                  </button>
                                </TableCell>

                                <TableCell>
                                  <Badge variant="outline" className="font-mono text-[10px] px-1 py-0">
                                    {item.version}
                                  </Badge>
                                </TableCell>

                                <TableCell>
                                  <div className="flex flex-col gap-1.5">
                                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                      {item.name}
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                      {/* Badge M cho Metadata sync */}
                                      {item.hasMetadataSync && (
                                        <Badge
                                          variant="outline"
                                          className="text-[10px] px-1 py-0 h-4 bg-green-50 text-green-700 border-green-300"
                                        >
                                          <RefreshCw className="h-2.5 w-2.5 mr-0.5" />M
                                        </Badge>
                                      )}
                                      {/* Project ID link */}
                                      {item.projectId &&
                                        item.projectId !== "999" && ( // Hide link for ad-hoc projects
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-4 px-1.5 text-[10px] bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300"
                                            onClick={() => handleViewProject(item)}
                                          >
                                            <LinkIcon className="h-2.5 w-2.5 mr-0.5" />
                                            {project?.appName || `P-${item.projectId}`}
                                          </Button>
                                        )}
                                      {/* Campaign ID */}
                                      {item.campaignId && (
                                        <Badge
                                          variant="outline"
                                          className="h-4 px-1.5 text-[10px] bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-300"
                                        >
                                          <span className="font-bold">C:</span>
                                          {item.campaignId}
                                        </Badge>
                                      )}
                                      {/* Ad-hoc marker */}
                                      {!item.isFromProject && (
                                        <Badge
                                          variant="outline"
                                          className="h-4 px-1.5 text-[10px] bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-300"
                                        >
                                          Ad-hoc
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </TableCell>

                                {/* Markets - Badge theo mã thị trường */}
                                <TableCell>
                                  <div className="flex flex-wrap gap-1">
                                    {item.markets.slice(0, 3).map(
                                      (
                                        market, // Show max 3 markets
                                      ) => (
                                        <Badge key={market} variant="secondary" className="text-[10px] px-1 py-0">
                                          {market}
                                        </Badge>
                                      ),
                                    )}
                                    {item.markets.length > 3 && (
                                      <Badge variant="outline" className="text-[10px] px-1 py-0 bg-muted">
                                        +{item.markets.length - 3}
                                      </Badge>
                                    )}
                                  </div>
                                </TableCell>

                                <TableCell>
                                  <div className="flex flex-col gap-1">
                                    <AssetsPillCell item={item} />
                                    {item.assetsPending > 0 && (
                                      <Badge
                                        variant="outline"
                                        className="text-[10px] w-fit px-1 py-0 h-4 bg-orange-50 text-orange-700 border-orange-300"
                                      >
                                        +{item.assetsPending} pending
                                      </Badge>
                                    )}
                                    {/* Display asset deadline if available */}
                                    {item.assetDeadline && item.assetsPending > 0 && (
                                      <div className="text-xs text-orange-600 dark:text-orange-400">
                                        <Clock className="h-3.5 w-3.5 inline-block mr-0.5" /> Due: {item.assetDeadline}
                                      </div>
                                    )}
                                  </div>
                                </TableCell>

                                {/* Owner (ASO PIC) */}
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-[10px] font-semibold text-blue-700 dark:text-blue-300">
                                      {item.owner
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .toUpperCase()}
                                    </div>
                                    <span className="text-xs">{item.owner}</span>
                                  </div>
                                </TableCell>

                                {/* Status */}
                                <TableCell>{getStatusBadge(item.status)}</TableCell>

                                {/* Updated Time */}
                                <TableCell>
                                  <div className="text-xs text-muted-foreground">{item.updatedDate}</div>
                                </TableCell>

                                {/* Actions: View • Edit • Duplicate • Publish (if approved) • Delete */}
                                <TableCell className="text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem
                                        onClick={() => router.push(`/applications/storekit-management/${item.id}`)}
                                      >
                                        <Eye className="h-4 w-4 mr-2" />
                                        View
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => router.push(`/applications/storekit-management/${item.id}?mode=edit`)}
                                      >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit
                                      </DropdownMenuItem>

                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem onClick={() => handleRequestAsset(item)}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Request Asset
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleViewAssetProgress(item)}>
                                        <Clock className="h-4 w-4 mr-2" />
                                        View Asset Progress
                                      </DropdownMenuItem>
                                      {item.projectId &&
                                        item.projectId !== "999" && ( // Hide link for ad-hoc projects
                                          <DropdownMenuItem onClick={() => handleViewProject(item)}>
                                            <ExternalLink className="h-4 w-4 mr-2" />
                                            View Project
                                          </DropdownMenuItem>
                                        )}
                                      {/* Show performance button only if isLive or status is published */}
                                      {(item.isLive || item.status === "published") && (
                                        <DropdownMenuItem onClick={() => handleViewPerformance(item)}>
                                          <TrendingUp className="h-4 w-4 mr-2" />
                                          View Performance
                                        </DropdownMenuItem>
                                      )}

                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem onClick={() => handleDuplicateItem(item)}>
                                        <Copy className="h-4 w-4 mr-2" />
                                        Duplicate
                                      </DropdownMenuItem>

                                      {item.status === "design_completed" && (
                                        <>
                                          <DropdownMenuSeparator />
                                          <DropdownMenuItem
                                            onClick={() => handleApproveDesign(item)}
                                            className="text-green-600 focus:text-green-600"
                                          >
                                            <ThumbsUp className="h-4 w-4 mr-2" />
                                            Duyệt Design
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            onClick={() => handleRejectDesign(item)}
                                            className="text-orange-600 focus:text-orange-600"
                                          >
                                            <ThumbsDown className="h-4 w-4 mr-2" />
                                            Không Duyệt
                                          </DropdownMenuItem>
                                        </>
                                      )}

                                      {/* Conditional Publish button based on 'approved' status */}
                                      {item.status === "approved" && !item.isLive && (
                                        <>
                                          <DropdownMenuSeparator />
                                          <DropdownMenuItem
                                            onClick={() => handlePublishToStore(item)}
                                            className="text-green-600 focus:text-green-600"
                                          >
                                            <Upload className="h-4 w-4 mr-2" />
                                            Publish to {item.platform === "iOS" ? "App Store" : "Google Play"}
                                          </DropdownMenuItem>
                                        </>
                                      )}
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        className="text-red-600 focus:text-red-600"
                                        onClick={() => handleDeleteItem(item.id, item.name)}
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </TooltipProvider>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Publish Confirmation Dialog */}
      {publishDialogOpen && itemToPublish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Xác nhận Publish to Store</h2>
              <button
                onClick={handleCancelPublish}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                Bạn có chắc chắn muốn publish StoreKit <strong>"{itemToPublish.name}"</strong> lên{" "}
                <strong>{itemToPublish.platform === "iOS" ? "App Store" : "Google Play"}</strong>?
              </p>
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-semibold mb-1">Lưu ý:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Thông tin sẽ được tự động đẩy lên store mà không cần nhập lại</li>
                      <li>Các phiên bản cũ của cùng app sẽ chuyển về trạng thái "Previously Published"</li>
                      <li>Bạn vẫn có thể publish lại các phiên bản cũ nếu cần</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 mt-6">
              <Button variant="outline" onClick={handleCancelPublish}>
                Cancel
              </Button>
              <Button onClick={handleConfirmPublish} className="bg-green-600 hover:bg-green-700">
                <Upload className="h-4 w-4 mr-2" />
                Confirm Publish
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Xác nhận xóa StoreKit</h2>
              <button
                onClick={handleCancelDelete}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              Bạn có chắc chắn muốn xóa StoreKit <strong>"{itemToDelete?.name}"</strong>? Hành động này không thể hoàn
              tác.
            </p>
            <div className="flex items-center justify-end gap-2 mt-6">
              <Button variant="outline" onClick={handleCancelDelete}>
                Cancel
              </Button>
              <Button onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}

      {reviewDialogOpen && selectedItemForReview && (
        <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <img
                  src={mockApps.find((a) => a.name === selectedItemForReview.app)?.icon || "/placeholder.svg"}
                  alt={selectedItemForReview.app}
                  className="h-12 w-12 rounded-lg border object-cover"
                />
                <div>
                  <div className="text-xl font-bold">{selectedItemForReview.name}</div>
                  <div className="text-sm text-muted-foreground font-normal">
                    {selectedItemForReview.app} • {selectedItemForReview.version}
                  </div>
                </div>
              </DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="overview" className="mt-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                <TabsTrigger value="metadata">Metadata</TabsTrigger>
                <TabsTrigger value="assets">Assets</TabsTrigger>
                <TabsTrigger value="status">Status & Updates</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin chung</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Platform</div>
                        <div className="font-medium">
                          {selectedItemForReview.platform === "iOS" ? "🍎 iOS" : "🤖 Android"}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Version</div>
                        <div className="font-medium">{selectedItemForReview.version}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Markets</div>
                        <div className="flex flex-wrap gap-1">
                          {selectedItemForReview.markets.map((market) => (
                            <Badge key={market} variant="secondary">
                              {market}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Owner</div>
                        <div className="font-medium">{selectedItemForReview.owner}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Created</div>
                        <div className="font-medium">{selectedItemForReview.createdDate}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Last Updated</div>
                        <div className="font-medium">{selectedItemForReview.updatedDate}</div>
                      </div>
                      {/* Add Project and Campaign Info to Overview */}
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Project</div>
                        <div className="font-medium">
                          {selectedItemForReview.projectId && selectedItemForReview.projectId !== "999" ? (
                            <Button
                              variant="link"
                              className="p-0 h-auto text-sm font-medium"
                              onClick={() => handleViewProject(selectedItemForReview)}
                            >
                              {PROJECTS_DATA.find((p) => p.id === selectedItemForReview.projectId)?.appName ||
                                `Project ${selectedItemForReview.projectId}`}
                            </Button>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Campaign</div>
                        <div className="font-medium">
                          {selectedItemForReview.campaignId ? (
                            <Badge variant="outline" className="text-xs">
                              {selectedItemForReview.campaignId}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </div>
                      </div>
                      {/* Add LIVE status */}
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Status</div>
                        <div className="font-medium">
                          {selectedItemForReview.isLive ? (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Live</Badge>
                          ) : (
                            <Badge variant="outline">{selectedItemForReview.status}</Badge>
                          )}
                        </div>
                      </div>
                      {/* Add Assets Pending and Deadline */}
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Assets Pending</div>
                        <div className="font-medium">
                          {selectedItemForReview.assetsPending > 0 ? (
                            <Badge variant="outline" className="text-orange-600">
                              {selectedItemForReview.assetsPending}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </div>
                      </div>
                      {selectedItemForReview.assetsPending > 0 && (
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Asset Deadline</div>
                          <div className="font-medium text-orange-600">{selectedItemForReview.assetDeadline}</div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Assets Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex flex-col items-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <ImageIconLucide className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-2" />
                        <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                          {selectedItemForReview.assets.icon}
                        </div>
                        <div className="text-xs text-muted-foreground">Icons</div>
                      </div>
                      <div className="flex flex-col items-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                        <ImageIconLucide className="h-8 w-8 text-green-600 dark:text-green-400 mb-2" />
                        <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                          {selectedItemForReview.assets.screenshot}
                        </div>
                        <div className="text-xs text-muted-foreground">Screenshots</div>
                      </div>
                      <div className="flex flex-col items-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                        <ImageIconLucide className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-2" />
                        <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                          {selectedItemForReview.assets.promoBanner}
                        </div>
                        <div className="text-xs text-muted-foreground">Banners</div>
                      </div>
                      <div className="flex flex-col items-center p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                        <Video className="h-8 w-8 text-orange-600 dark:text-orange-400 mb-2" />
                        <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                          {selectedItemForReview.assets.video}
                        </div>
                        <div className="text-xs text-muted-foreground">Videos</div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Total Assets</span>
                        <span className="text-lg font-bold">{selectedItemForReview.assets.total}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Metadata Tab */}
              <TabsContent value="metadata" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>App Metadata</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">App Title</div>
                      <div className="text-base">{selectedItemForReview.name}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Short Description</div>
                      <div className="text-sm text-muted-foreground">
                        Mô tả ngắn về app (dữ liệu mẫu - sẽ được load từ database thực tế)
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Full Description</div>
                      <div className="text-sm text-muted-foreground">
                        Mô tả đầy đủ về app, tính năng, lợi ích... (dữ liệu mẫu - sẽ được load từ database thực tế)
                      </div>
                    </div>
                    {/* Add Metadata Sync status */}
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Metadata Sync Status</div>
                      {selectedItemForReview.hasMetadataSync ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Synced (Version: {selectedItemForReview.metadataVersionId})
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-orange-50 text-orange-700">
                          Not Synced
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Assets Tab */}
              <TabsContent value="assets" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Graphics & Assets</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <ImageIconLucide className="h-4 w-4" />
                        <div className="text-sm font-medium">Icons</div>
                        <Badge variant="secondary">{selectedItemForReview.assets.icon}</Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {selectedItemForReview.assets.thumbnails
                          .filter((t) => t.type === "icon")
                          .map((thumb, idx) => (
                            <img
                              key={idx}
                              src={thumb.url || "/placeholder.svg"}
                              alt={`Icon ${idx + 1}`}
                              className="w-full aspect-square rounded-lg border object-cover"
                            />
                          ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <ImageIconLucide className="h-4 w-4" />
                        <div className="text-sm font-medium">Screenshots</div>
                        <Badge variant="secondary">{selectedItemForReview.assets.screenshot}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedItemForReview.assets.thumbnails
                          .filter((t) => t.type === "screenshot")
                          .map((thumb, idx) => (
                            <img
                              key={idx}
                              src={thumb.url || "/placeholder.svg"}
                              alt={`Screenshot ${idx + 1}`}
                              className="w-full aspect-video rounded-lg border object-cover"
                            />
                          ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <ImageIconLucide className="h-4 w-4" />
                        <div className="text-sm font-medium">Banners</div>
                        <Badge variant="secondary">{selectedItemForReview.assets.promoBanner}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {selectedItemForReview.assets.promoBanner} banners uploaded
                      </div>
                    </div>

                    {selectedItemForReview.assets.video > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Video className="h-4 w-4" />
                          <div className="text-sm font-medium">Videos</div>
                          <Badge variant="secondary">{selectedItemForReview.assets.video}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {selectedItemForReview.assets.video} videos uploaded
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Status & Updates Tab */}
              <TabsContent value="status" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(selectedItemForReview.status)}
                      <span className="text-sm text-muted-foreground">
                        Updated: {selectedItemForReview.updatedDate}
                      </span>
                      {/* Removed LIVE badge */}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">Created</div>
                          <div className="text-sm text-muted-foreground">{selectedItemForReview.createdDate}</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                          <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">Last Updated</div>
                          <div className="text-sm text-muted-foreground">{selectedItemForReview.updatedDate}</div>
                        </div>
                      </div>
                      {/* Add status change history if available */}
                      {(selectedItemForReview as any).statusHistory?.map((history: { status: string; timestamp: string }, index: number) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                            {/* Placeholder for status icon */}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium capitalize">{history.status.replace("_", " ")}</div>
                            <div className="text-sm text-muted-foreground">{history.timestamp}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}

      {/* Approve Confirmation Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận duyệt Design</DialogTitle>
          </DialogHeader>
          <p className="text-gray-700 dark:text-gray-300">
            Bạn có chắc chắn muốn duyệt design cho StoreKit <strong>"{itemToApprove?.name}"</strong>?
          </p>
          <div className="flex items-center justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmApprove} className="bg-green-600 hover:bg-green-700">
              <ThumbsUp className="h-4 w-4 mr-2" />
              Duyệt
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Confirmation Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yêu cầu chỉnh sửa Design</DialogTitle>
          </DialogHeader>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Vui lòng nhập lý do từ chối để Design team biết cần chỉnh sửa gì cho StoreKit <strong>"{itemToReject?.name}"</strong>.
          </p>
          <Textarea
            placeholder="Nhập lý do từ chối..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex items-center justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => {
              setRejectDialogOpen(false)
              setRejectionReason("")
            }}>
              Cancel
            </Button>
            <Button onClick={handleConfirmReject} className="bg-orange-600 hover:bg-orange-700">
              <ThumbsDown className="h-4 w-4 mr-2" />
              Gửi yêu cầu chỉnh sửa
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Notification Confirmation Dialog */}
      <Dialog open={deleteNotificationDialogOpen} onOpenChange={setDeleteNotificationDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-600" />
              Xóa thông báo
            </DialogTitle>
          </DialogHeader>
          <p className="text-gray-700 dark:text-gray-300">
            Bạn có chắc chắn muốn xóa thông báo này? Hành động này không thể hoàn tác.
          </p>
          <div className="flex items-center justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteNotificationDialogOpen(false)
                setNotificationToDelete(null)
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={confirmDeleteNotification}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Xóa
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
export default function StorekitPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <StorekitPageContent />
    </Suspense>
  )
}