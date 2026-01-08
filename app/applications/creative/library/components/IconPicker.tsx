"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { Search } from "lucide-react"
import {
    Star, Heart, Check, X, Plus, Minus, Circle, Square, Flag, Tag, Bookmark,
    Home, User, Users, Settings, Bell, Mail, Calendar, Clock, Play, Pause,
    Upload, Download, File, Folder, Image, Video, Send, Share, Link, Eye,
    Lock, Unlock, Trash, Edit, Copy, Save, RefreshCcw as Refresh, Filter, Grid,
    List, Layers, Layout, Award, Trophy, Zap, Flame, Sun, Moon, ThumbsUp,
    ThumbsDown, MessageCircle, AlertTriangle, Info, HelpCircle, CheckCircle,
    XCircle, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ChevronUp, ChevronDown,
    ChevronLeft, ChevronRight, Activity, Archive, AtSign, BarChart, Battery,
    Book, BookOpen, Box, Briefcase, Camera, Clipboard, Cloud, Code, Coffee,
    Command, Cpu, CreditCard, Database, Disc, DollarSign, ExternalLink,
    Feather, Film, Gift, Globe, HardDrive, Hash, Headphones, Hexagon,
    Inbox, Key, Loader, LogIn, LogOut, MapPin, Map, Menu, Mic, Monitor,
    MoreHorizontal, MoreVertical, MousePointer, Move, Music, Package, Paperclip,
    Percent, Phone, PieChart, Power, Printer, Radio, Repeat, RotateCcw, Rss,
    Scissors, Server, Shield, ShoppingCart, Shuffle, Sidebar, Sliders, Smartphone,
    Speaker, Tablet, Target, Terminal, Thermometer, Wand2 as Tool, TrendingUp, TrendingDown,
    Truck, Tv, Type, Umbrella, Volume2, Watch, Wifi, Wind, ZoomIn, ZoomOut,
    FileText, FolderOpen, UserPlus, UserMinus, UserCheck, AlertCircle, Anchor,
    Aperture, Bluetooth, Bold, Crop, Crosshair, Delete, Droplet,
    Facebook, Frown, Github, Gitlab, Instagram, Italic, Linkedin, Maximize, Minimize,
    Navigation, Octagon, PauseCircle, PlayCircle, PlusCircle, Pocket, RefreshCw,
    Rewind, RotateCw, ShoppingBag, SkipBack, SkipForward, Slack, Smile, Sunrise,
    Sunset, ToggleLeft, ToggleRight, Twitter, Underline, VolumeX, Youtube, Wallet,
    Wrench, Building, Car, Crown, Diamond, Gem, Lightbulb, Rocket, TreePine, Flower,
    Bug, Snowflake, Apple, Dumbbell, Medal, Timer, Pill, Receipt, Calculator,
    GraduationCap, School, Pencil, PenTool, Coins, Banknote, ShieldCheck, Ban, Sparkles,
    Megaphone, MessageSquare, Hand, Pointer, BadgeCheck, BadgeX, Wallet2, type LucideIcon
} from "lucide-react"

// Map icon names to their components
const ICON_MAP: Record<string, LucideIcon> = {
    Star, Heart, Check, X, Plus, Minus, Circle, Square, Flag, Tag, Bookmark,
    Home, User, Users, Settings, Bell, Mail, Calendar, Clock, Play, Pause,
    Upload, Download, File, Folder, Image, Video, Send, Share, Link, Eye,
    Lock, Unlock, Trash, Edit, Copy, Save, Refresh, Filter, Grid,
    List, Layers, Layout, Award, Trophy, Zap, Flame, Sun, Moon, ThumbsUp,
    ThumbsDown, MessageCircle, AlertTriangle, Info, HelpCircle, CheckCircle,
    XCircle, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ChevronUp, ChevronDown,
    ChevronLeft, ChevronRight, Activity, Archive, AtSign, BarChart, Battery,
    Book, BookOpen, Box, Briefcase, Camera, Clipboard, Cloud, Code, Coffee,
    Command, Cpu, CreditCard, Database, Disc, DollarSign, ExternalLink,
    Feather, Film, Gift, Globe, HardDrive, Hash, Headphones, Hexagon,
    Inbox, Key, Loader, LogIn, LogOut, MapPin, Map, Menu, Mic, Monitor,
    MoreHorizontal, MoreVertical, MousePointer, Move, Music, Package, Paperclip,
    Percent, Phone, PieChart, Power, Printer, Radio, Repeat, RotateCcw, Rss,
    Scissors, Server, Shield, ShoppingCart, Shuffle, Sidebar, Sliders, Smartphone,
    Speaker, Tablet, Target, Terminal, Thermometer, Tool, TrendingUp, TrendingDown,
    Truck, Tv, Type, Umbrella, Volume2, Watch, Wifi, Wind, ZoomIn, ZoomOut,
    FileText, FolderOpen, UserPlus, UserMinus, UserCheck, AlertCircle, Anchor,
    Aperture, Bluetooth, Bold, Crop, Crosshair, Delete, Droplet,
    Facebook, Frown, Github, Gitlab, Instagram, Italic, Linkedin, Maximize, Minimize,
    Navigation, Octagon, PauseCircle, PlayCircle, PlusCircle, Pocket, RefreshCw,
    Rewind, RotateCw, ShoppingBag, SkipBack, SkipForward, Slack, Smile, Sunrise,
    Sunset, ToggleLeft, ToggleRight, Twitter, Underline, VolumeX, Youtube, Wallet,
    Wrench, Building, Car, Crown, Diamond, Gem, Lightbulb, Rocket, TreePine, Flower,
    Bug, Snowflake, Apple, Dumbbell, Medal, Timer, Pill, Receipt, Calculator,
    GraduationCap, School, Pencil, PenTool, Coins, Banknote, ShieldCheck, Ban, Sparkles,
    Megaphone, MessageSquare, Hand, Pointer, BadgeCheck, BadgeX, Wallet2,
}

// Icon colors for visual variety
const ICON_COLORS: Record<string, string> = {
    Star: "text-yellow-500", Heart: "text-red-500", Check: "text-green-500", X: "text-red-400",
    Plus: "text-blue-500", Minus: "text-gray-500", Flag: "text-red-600", Tag: "text-purple-500",
    Bookmark: "text-amber-500", Zap: "text-yellow-400", Flame: "text-orange-500", Sun: "text-yellow-400",
    Moon: "text-indigo-400", Award: "text-amber-500", Trophy: "text-yellow-600", Crown: "text-yellow-500",
    Diamond: "text-cyan-400", Gem: "text-purple-400", Sparkles: "text-pink-400",
    ThumbsUp: "text-green-500", ThumbsDown: "text-red-500", AlertTriangle: "text-amber-500",
    AlertCircle: "text-red-500", Info: "text-blue-500", HelpCircle: "text-gray-500",
    CheckCircle: "text-green-500", XCircle: "text-red-500", BadgeCheck: "text-green-600", BadgeX: "text-red-600",
    Mail: "text-blue-400", Bell: "text-amber-400", Calendar: "text-indigo-500", Clock: "text-gray-600",
    User: "text-blue-500", Users: "text-blue-600", Home: "text-teal-500", Settings: "text-gray-500",
    Lock: "text-gray-600", Unlock: "text-green-500", Shield: "text-blue-600", ShieldCheck: "text-green-600",
    Trash: "text-red-500", Edit: "text-blue-500", Copy: "text-gray-500", Save: "text-green-500",
    Upload: "text-blue-500", Download: "text-green-500", File: "text-gray-500", Folder: "text-amber-500",
    Image: "text-purple-500", Video: "text-red-500", Music: "text-pink-500",
    Camera: "text-gray-600", Film: "text-purple-600", Mic: "text-red-400",
    Play: "text-green-500", Pause: "text-amber-500", Coffee: "text-amber-700",
    Rocket: "text-orange-500", Lightbulb: "text-yellow-500", Gift: "text-pink-500",
}

// Get list of all icon names
const ICON_LIST = Object.keys(ICON_MAP)

// Suggested icons (shown first)
const SUGGESTED_ICONS = [
    "Star", "Heart", "Check", "Flag", "Tag", "Bookmark", "Zap", "Flame",
    "Award", "Trophy", "Crown", "Diamond", "Gem", "Sparkles", "ThumbsUp",
    "User", "Users", "Home", "Settings", "Bell", "Mail", "Calendar", "Clock",
    "File", "Folder", "Image", "Video", "Upload", "Download", "Link",
    "CheckCircle", "XCircle", "AlertCircle", "Info", "HelpCircle",
    "ArrowUp", "ArrowDown", "Play", "Pause", "Refresh",
]

interface IconPickerProps {
    value: string
    onChange: (iconName: string) => void
    disabled?: boolean
}

// Render icon component by name with color
function RenderIcon({ name, className, withColor = false }: { name: string; className?: string; withColor?: boolean }) {
    const IconComponent = ICON_MAP[name]
    if (!IconComponent) {
        return <span className={cn("text-xs", className)}>?</span>
    }
    const colorClass = withColor ? (ICON_COLORS[name] || "text-gray-600") : ""
    return <IconComponent className={cn(className || "h-4 w-4", colorClass)} />
}

export function IconPicker({ value, onChange, disabled }: IconPickerProps) {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [search, setSearch] = useState("")

    // Get sorted and filtered icons
    const getFilteredIcons = () => {
        const searchLower = search.toLowerCase().trim()

        if (!searchLower) {
            const suggestedSet = new Set(SUGGESTED_ICONS)
            const otherIcons = ICON_LIST.filter(name => !suggestedSet.has(name)).sort()
            return [...SUGGESTED_ICONS, ...otherIcons]
        }

        return ICON_LIST.filter(name =>
            name.toLowerCase().includes(searchLower)
        ).sort((a, b) => {
            const aExact = a.toLowerCase() === searchLower
            const bExact = b.toLowerCase() === searchLower
            if (aExact && !bExact) return -1
            if (!aExact && bExact) return 1
            return a.localeCompare(b)
        })
    }

    const filteredIcons = getFilteredIcons()

    const handleSelect = (iconName: string) => {
        onChange(iconName)
        setDialogOpen(false)
        setSearch("")
    }

    return (
        <>
            {/* Trigger Button */}
            <Button
                variant="outline"
                className="w-full justify-between h-9"
                disabled={disabled}
                type="button"
                onClick={() => setDialogOpen(true)}
            >
                <span className="flex items-center gap-2">
                    {value ? (
                        <>
                            <RenderIcon name={value} className="h-4 w-4" withColor />
                            <span className="text-xs truncate">{value}</span>
                        </>
                    ) : (
                        <span className="text-muted-foreground text-xs">Chọn icon...</span>
                    )}
                </span>
                <ChevronDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
            </Button>

            {/* Icon Selection Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Chọn Icon</DialogTitle>
                    </DialogHeader>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Tìm icon... (star, heart, arrow...)"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-8"
                            autoFocus
                        />
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {filteredIcons.length} icons {search && `cho "${search}"`}
                    </p>

                    {/* Icon Grid */}
                    <ScrollArea className="h-64">
                        <div className="grid grid-cols-8 gap-2 pr-3">
                            {filteredIcons.map((iconName) => (
                                <button
                                    key={iconName}
                                    type="button"
                                    onClick={() => handleSelect(iconName)}
                                    className={cn(
                                        "p-2 rounded-lg hover:bg-accent flex items-center justify-center transition-colors border-2",
                                        value === iconName
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "border-transparent hover:border-gray-300"
                                    )}
                                    title={iconName}
                                >
                                    <RenderIcon
                                        name={iconName}
                                        className="h-5 w-5"
                                        withColor={value !== iconName}
                                    />
                                </button>
                            ))}
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </>
    )
}

// Export for use in other components
export { ICON_MAP, ICON_LIST, ICON_COLORS, RenderIcon }
