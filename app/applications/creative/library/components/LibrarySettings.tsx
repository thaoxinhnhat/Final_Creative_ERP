"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Settings, Lock, Save, RotateCcw, Plus, Trash2, ChevronDown, ChevronRight, Smartphone, Gamepad2, Users, Filter, List } from "lucide-react"
import { cn } from "@/lib/utils"
import { IconPicker, RenderIcon } from "./IconPicker"
import { ColorPicker } from "./ColorPicker"
import { uniqueCampaigns } from "../mock-data"

// ============================================
// TYPES
// ============================================

export interface CustomFilterOption {
    id: string
    label: string
    icon: string
    color: string
    enabled: boolean
    options?: CustomFilterOption[]  // Sub-options for custom sections
}

export interface LibrarySettingsData {
    dropdowns: {
        apps: string[]
        games: string[]
        productionTeams: string[]
    }
    filters: {
        sections: {
            trangThai: boolean
            adNetworks: boolean
            team: boolean
            loaiFile: boolean
            danhMuc: boolean
            campaign: boolean
            uploadDate: boolean
        }
        workflowStages: {
            final: boolean
            live: boolean
            stopped: boolean
        }
        deploymentStatuses: {
            draft: boolean
            testing: boolean
            live: boolean
            paused: boolean
            stopped: boolean
        }
        teams: {
            design: boolean
            ai_producer: boolean
            creative: boolean
            pion: boolean
        }
        fileTypes: {
            images: boolean
            videos: boolean
            templates: boolean
            playables: boolean
            endcards: boolean
            other: boolean
        }
        categories: {
            final_creative: boolean
            reference: boolean
            brand_asset: boolean
            template: boolean
            campaign_material: boolean
            raw_footage: boolean
        }
        campaigns: Record<string, boolean>
        customWorkflowStages: CustomFilterOption[]
        customDeploymentStatuses: CustomFilterOption[]
        customTeams: CustomFilterOption[]
        customFileTypes: CustomFilterOption[]
        customCategories: CustomFilterOption[]
        customCampaigns: CustomFilterOption[]
        customSections: CustomFilterOption[]  // Custom filter sections
    }
}

// ============================================
// DEFAULTS
// ============================================

const DEFAULT_APPS = [
    'Fitness App', 'Shopping App', 'Finance App', 'Travel App',
    'Food Delivery', 'Social App', 'Education App', 'Lifestyle App', 'Utility App'
]

const DEFAULT_GAMES = [
    'Puzzle Master', 'Super Racing', 'Farm World', 'Candy Match 3',
    'Idle Hero', 'Zombie Shooter', 'Word Game'
]

const DEFAULT_PRODUCTION_TEAMS = [
    'Team A - Video Production', 'Team B - Graphic Design',
    'Team C - Animation', 'Team D - Creative AI', 'External/Outsource'
]

export const DEFAULT_LIBRARY_SETTINGS: LibrarySettingsData = {
    dropdowns: {
        apps: DEFAULT_APPS,
        games: DEFAULT_GAMES,
        productionTeams: DEFAULT_PRODUCTION_TEAMS,
    },
    filters: {
        sections: {
            trangThai: true,
            adNetworks: true,
            team: true,
            loaiFile: true,
            danhMuc: true,
            campaign: true,
            uploadDate: true,
        },
        workflowStages: { final: true, live: true, stopped: true },
        deploymentStatuses: { draft: true, testing: true, live: true, paused: true, stopped: true },
        teams: { design: true, ai_producer: true, creative: true, pion: true },
        fileTypes: { images: true, videos: true, templates: true, playables: true, endcards: true, other: true },
        categories: { final_creative: true, reference: true, brand_asset: true, template: true, campaign_material: true, raw_footage: true },
        campaigns: {},
        customWorkflowStages: [],
        customDeploymentStatuses: [],
        customTeams: [],
        customFileTypes: [],
        customCategories: [],
        customCampaigns: [],
        customSections: [],
    }
}

const STORAGE_KEY = 'librarySettings'

// ============================================
// HOOK
// ============================================

export function useLibrarySettings() {
    const [settings, setSettings] = useState<LibrarySettingsData>(DEFAULT_LIBRARY_SETTINGS)

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                setSettings({
                    dropdowns: {
                        apps: parsed.dropdowns?.apps || DEFAULT_APPS,
                        games: parsed.dropdowns?.games || DEFAULT_GAMES,
                        productionTeams: parsed.dropdowns?.productionTeams || DEFAULT_PRODUCTION_TEAMS,
                    },
                    filters: {
                        ...DEFAULT_LIBRARY_SETTINGS.filters,
                        ...parsed.filters,
                        sections: { ...DEFAULT_LIBRARY_SETTINGS.filters.sections, ...parsed.filters?.sections },
                        workflowStages: { ...DEFAULT_LIBRARY_SETTINGS.filters.workflowStages, ...parsed.filters?.workflowStages },
                        deploymentStatuses: { ...DEFAULT_LIBRARY_SETTINGS.filters.deploymentStatuses, ...parsed.filters?.deploymentStatuses },
                        teams: { ...DEFAULT_LIBRARY_SETTINGS.filters.teams, ...parsed.filters?.teams },
                        fileTypes: { ...DEFAULT_LIBRARY_SETTINGS.filters.fileTypes, ...parsed.filters?.fileTypes },
                        categories: { ...DEFAULT_LIBRARY_SETTINGS.filters.categories, ...parsed.filters?.categories },
                    }
                })
            } catch {
                setSettings(DEFAULT_LIBRARY_SETTINGS)
            }
        }
    }, [])

    const saveSettings = (newSettings: LibrarySettingsData) => {
        setSettings(newSettings)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings))
    }

    return { settings, saveSettings }
}

// ============================================
// EDITABLE LIST COMPONENT
// ============================================

function EditableList({ items, onItemsChange, placeholder, icon, disabled }: {
    items: string[]
    onItemsChange: (items: string[]) => void
    placeholder: string
    icon: React.ReactNode
    disabled?: boolean
}) {
    const [newItem, setNewItem] = useState("")

    const addItem = () => {
        const trimmed = newItem.trim()
        if (trimmed && !items.includes(trimmed)) {
            onItemsChange([...items, trimmed])
            setNewItem("")
        }
    }

    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <Input
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem())}
                    placeholder={placeholder}
                    className="flex-1 h-8 text-sm"
                    disabled={disabled}
                />
                <Button type="button" size="sm" className="h-8" onClick={addItem} disabled={disabled || !newItem.trim()}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
            <div className="max-h-28 overflow-y-auto space-y-1">
                {items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 p-1.5 bg-gray-50 dark:bg-gray-800 rounded text-xs group">
                        {icon}
                        <span className="flex-1 truncate">{item}</span>
                        {!disabled && (
                            <Button type="button" variant="ghost" size="sm" className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100"
                                onClick={() => onItemsChange(items.filter((_, idx) => idx !== i))}>
                                <Trash2 className="h-3 w-3 text-red-500" />
                            </Button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

// ============================================
// SECTION HEADER
// ============================================

function SectionHeader({ title, icon, isOpen, onToggle, count }: {
    title: string
    icon: React.ReactNode
    isOpen: boolean
    onToggle: () => void
    count?: number
}) {
    return (
        <button
            onClick={onToggle}
            className="flex items-center gap-2 w-full text-left text-sm font-medium py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            {icon}
            <span className="flex-1">{title}</span>
            {count !== undefined && <span className="text-xs text-muted-foreground">({count})</span>}
        </button>
    )
}

// ============================================
// MAIN COMPONENT
// ============================================

interface LibrarySettingsModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    settings: LibrarySettingsData
    onSaveSettings: (settings: LibrarySettingsData) => void
    userRole: 'ua_team' | 'creative_team' | 'admin'
}

interface NewOptionForm {
    category: 'workflow' | 'deployment' | 'team' | 'fileType' | 'category' | 'campaign' | 'section' | null
    parentSectionId?: string  // For adding options to a custom section
    label: string
    icon: string
    color: string
}

export function LibrarySettingsModal({
    open, onOpenChange, settings, onSaveSettings, userRole,
}: LibrarySettingsModalProps) {
    const [localSettings, setLocalSettings] = useState<LibrarySettingsData>(settings)
    const [expandedSections, setExpandedSections] = useState({
        dropdowns: true,
        filterVisibility: true,
        filterOptions: false,
    })
    const [newOption, setNewOption] = useState<NewOptionForm>({ category: null, label: "", icon: "Star", color: "#3b82f6" })

    const canEdit = true // Temporarily removed role check: userRole === 'admin'

    useEffect(() => {
        if (open) {
            setLocalSettings(settings)
            setNewOption({ category: null, label: "", icon: "Star", color: "#3b82f6" })
        }
    }, [open, settings])

    const handleSave = () => {
        onSaveSettings(localSettings)
        onOpenChange(false)
    }

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
    }

    // Dropdown handlers
    const updateApps = (apps: string[]) => setLocalSettings(prev => ({ ...prev, dropdowns: { ...prev.dropdowns, apps } }))
    const updateGames = (games: string[]) => setLocalSettings(prev => ({ ...prev, dropdowns: { ...prev.dropdowns, games } }))
    const updateTeams = (productionTeams: string[]) => setLocalSettings(prev => ({ ...prev, dropdowns: { ...prev.dropdowns, productionTeams } }))

    // Filter visibility handlers
    const toggleFilterSection = (section: keyof LibrarySettingsData['filters']['sections']) => {
        if (!canEdit) return
        setLocalSettings(prev => ({
            ...prev,
            filters: { ...prev.filters, sections: { ...prev.filters.sections, [section]: !prev.filters.sections[section] } }
        }))
    }

    // Filter option handlers
    const toggleWorkflowStage = (stage: keyof LibrarySettingsData['filters']['workflowStages']) => {
        if (!canEdit) return
        setLocalSettings(prev => ({
            ...prev,
            filters: { ...prev.filters, workflowStages: { ...prev.filters.workflowStages, [stage]: !prev.filters.workflowStages[stage] } }
        }))
    }

    const toggleDeploymentStatus = (status: keyof LibrarySettingsData['filters']['deploymentStatuses']) => {
        if (!canEdit) return
        setLocalSettings(prev => ({
            ...prev,
            filters: { ...prev.filters, deploymentStatuses: { ...prev.filters.deploymentStatuses, [status]: !prev.filters.deploymentStatuses[status] } }
        }))
    }

    const toggleTeam = (team: keyof LibrarySettingsData['filters']['teams']) => {
        if (!canEdit) return
        setLocalSettings(prev => ({
            ...prev,
            filters: { ...prev.filters, teams: { ...prev.filters.teams, [team]: !prev.filters.teams[team] } }
        }))
    }

    const toggleFileType = (fileType: keyof LibrarySettingsData['filters']['fileTypes']) => {
        if (!canEdit) return
        setLocalSettings(prev => ({
            ...prev,
            filters: { ...prev.filters, fileTypes: { ...prev.filters.fileTypes, [fileType]: !prev.filters.fileTypes[fileType] } }
        }))
    }

    const toggleCategory = (cat: keyof LibrarySettingsData['filters']['categories']) => {
        if (!canEdit) return
        setLocalSettings(prev => ({
            ...prev,
            filters: { ...prev.filters, categories: { ...prev.filters.categories, [cat]: !prev.filters.categories[cat] } }
        }))
    }

    const addCustomOption = () => {
        if (!canEdit || !newOption.category || !newOption.label.trim()) return
        const option: CustomFilterOption = {
            id: `custom_${Date.now()}`,
            label: newOption.label.trim(),
            icon: newOption.icon,
            color: newOption.color,
            enabled: true,
            options: newOption.category === 'section' ? [] : undefined,
        }

        // If adding option to a custom section
        if (newOption.parentSectionId) {
            setLocalSettings(prev => ({
                ...prev,
                filters: {
                    ...prev.filters,
                    customSections: prev.filters.customSections.map(section =>
                        section.id === newOption.parentSectionId
                            ? { ...section, options: [...(section.options || []), option] }
                            : section
                    )
                }
            }))
            setNewOption({ category: null, parentSectionId: undefined, label: "", icon: "Star", color: "#3b82f6" })
            return
        }

        const categoryMap = {
            workflow: 'customWorkflowStages',
            deployment: 'customDeploymentStatuses',
            team: 'customTeams',
            fileType: 'customFileTypes',
            category: 'customCategories',
            campaign: 'customCampaigns',
            section: 'customSections',
        } as const
        const key = categoryMap[newOption.category as keyof typeof categoryMap]
        if (key) {
            setLocalSettings(prev => ({
                ...prev,
                filters: { ...prev.filters, [key]: [...prev.filters[key], option] }
            }))
        }
        setNewOption({ category: null, parentSectionId: undefined, label: "", icon: "Star", color: "#3b82f6" })
    }

    // Remove option from custom section
    const removeCustomSectionOption = (sectionId: string, optionId: string) => {
        if (!canEdit) return
        setLocalSettings(prev => ({
            ...prev,
            filters: {
                ...prev.filters,
                customSections: prev.filters.customSections.map(section =>
                    section.id === sectionId
                        ? { ...section, options: (section.options || []).filter(opt => opt.id !== optionId) }
                        : section
                )
            }
        }))
    }

    // Toggle option in custom section
    const toggleCustomSectionOption = (sectionId: string, optionId: string) => {
        if (!canEdit) return
        setLocalSettings(prev => ({
            ...prev,
            filters: {
                ...prev.filters,
                customSections: prev.filters.customSections.map(section =>
                    section.id === sectionId
                        ? {
                            ...section,
                            options: (section.options || []).map(opt =>
                                opt.id === optionId ? { ...opt, enabled: !opt.enabled } : opt
                            )
                        }
                        : section
                )
            }
        }))
    }

    const removeCustomOption = (key: 'customWorkflowStages' | 'customDeploymentStatuses' | 'customTeams' | 'customFileTypes' | 'customCategories' | 'customCampaigns' | 'customSections', id: string) => {
        if (!canEdit) return
        setLocalSettings(prev => ({
            ...prev,
            filters: { ...prev.filters, [key]: prev.filters[key].filter(opt => opt.id !== id) }
        }))
    }

    const toggleCustomOption = (key: 'customWorkflowStages' | 'customDeploymentStatuses' | 'customTeams' | 'customFileTypes' | 'customCategories' | 'customCampaigns' | 'customSections', id: string) => {
        if (!canEdit) return
        setLocalSettings(prev => ({
            ...prev,
            filters: { ...prev.filters, [key]: prev.filters[key].map(opt => opt.id === id ? { ...opt, enabled: !opt.enabled } : opt) }
        }))
    }

    const sectionLabels: Record<keyof LibrarySettingsData['filters']['sections'], string> = {
        trangThai: "Trạng thái", adNetworks: "Ad Networks", team: "Team",
        loaiFile: "Loại file", danhMuc: "Danh mục", campaign: "Campaign", uploadDate: "Upload Date",
    }

    const workflowLabels = { final: "✅ Final", live: "🟢 Live", stopped: "⏹️ Stop" }
    const deploymentLabels = { draft: "📝 Draft", testing: "🧪 Testing", live: "🟢 Live", paused: "⏸️ Paused", stopped: "⏹️ Stopped" }
    const teamLabels = { design: "🎨 Design", ai_producer: "🤖 AI Producer", creative: "💡 Creative", pion: "🔷 Pion" }
    const fileTypeLabels = { images: "🖼️ Images", videos: "🎬 Videos", templates: "📐 Templates", playables: "🎮 Playables", endcards: "🃏 Endcards", other: "📦 Other" }
    const categoryLabels = { final_creative: "✅ Final Creative", reference: "📚 Reference", brand_asset: "🏷️ Brand Asset", template: "📋 Template", campaign_material: "📊 Campaign Material", raw_footage: "🎞️ Raw Footage" }

    const CustomOptionsList = ({ options, optionKey }: {
        options: CustomFilterOption[]
        optionKey: 'customWorkflowStages' | 'customDeploymentStatuses' | 'customTeams' | 'customFileTypes' | 'customCategories' | 'customCampaigns'
    }) => options.length > 0 && (
        <div className="mt-2 space-y-1 pl-4">
            {options.map(opt => (
                <div key={opt.id} className="flex items-center gap-2 p-1.5 bg-gray-50 dark:bg-gray-800 rounded">
                    <Checkbox checked={opt.enabled} onCheckedChange={() => toggleCustomOption(optionKey, opt.id)} disabled={!canEdit} />
                    <span className="w-4 h-4 rounded flex items-center justify-center" style={{ backgroundColor: opt.color }}>
                        <RenderIcon name={opt.icon} className="h-3 w-3 text-white" />
                    </span>
                    <span className="text-xs flex-1">{opt.label}</span>
                    {canEdit && (
                        <Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-red-500" onClick={() => removeCustomOption(optionKey, opt.id)}>
                            <Trash2 className="h-3 w-3" />
                        </Button>
                    )}
                </div>
            ))}
        </div>
    )

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Cài đặt Library
                    </DialogTitle>
                    <DialogDescription>
                        {canEdit ? "Quản lý danh sách dropdown và cài đặt hiển thị bộ lọc" : "Chỉ Admin mới có quyền chỉnh sửa"}
                    </DialogDescription>
                </DialogHeader>

                <div className={cn("flex-1 overflow-y-auto space-y-2 py-2", !canEdit && "opacity-60")}>
                    {/* SECTION 1: Dropdown Lists */}
                    <div className="border rounded-lg">
                        <SectionHeader
                            title="Danh sách lựa chọn (Upload Form)"
                            icon={<List className="h-4 w-4 text-blue-600" />}
                            isOpen={expandedSections.dropdowns}
                            onToggle={() => toggleSection('dropdowns')}
                            count={localSettings.dropdowns.productionTeams.length}
                        />
                        {expandedSections.dropdowns && (
                            <div className="px-4 pb-4 space-y-4">
                                <div>
                                    <Label className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                                        <Users className="h-3 w-3" /> Team Dựng
                                    </Label>
                                    <EditableList items={localSettings.dropdowns.productionTeams} onItemsChange={updateTeams}
                                        placeholder="Thêm team..." icon={<Users className="h-3 w-3 text-green-500" />} disabled={!canEdit} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* SECTION 2: Filter Section Visibility */}
                    <div className="border rounded-lg">
                        <SectionHeader
                            title="Hiển thị mục lọc"
                            icon={<Filter className="h-4 w-4 text-green-600" />}
                            isOpen={expandedSections.filterVisibility}
                            onToggle={() => toggleSection('filterVisibility')}
                        />
                        {expandedSections.filterVisibility && (
                            <div className="px-4 pb-4">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs text-muted-foreground">Các mục lọc hiển thị</span>
                                    {canEdit && (
                                        <Button variant="outline" size="sm" className="h-6 text-xs"
                                            onClick={() => setNewOption(prev => ({ ...prev, category: 'section' as never }))}>
                                            <Plus className="h-3 w-3 mr-1" /> Thêm
                                        </Button>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {(Object.keys(localSettings.filters.sections) as Array<keyof LibrarySettingsData['filters']['sections']>).map((section) => (
                                        <div key={section} className="flex items-center">
                                            <Checkbox id={`section-${section}`} checked={localSettings.filters.sections[section]}
                                                onCheckedChange={() => toggleFilterSection(section)} disabled={!canEdit} />
                                            <Label htmlFor={`section-${section}`} className="ml-2 text-xs cursor-pointer">{sectionLabels[section]}</Label>
                                        </div>
                                    ))}
                                </div>
                                {/* Custom sections */}
                                {localSettings.filters.customSections && localSettings.filters.customSections.length > 0 && (
                                    <div className="mt-3 pt-3 border-t">
                                        <p className="text-[10px] text-muted-foreground mb-2 uppercase">Mục lọc tùy chỉnh</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {localSettings.filters.customSections.map(opt => (
                                                <div key={opt.id} className="flex items-center group">
                                                    <Checkbox checked={opt.enabled}
                                                        onCheckedChange={() => toggleCustomOption('customSections', opt.id)} disabled={!canEdit} />
                                                    <span className="ml-2 flex items-center gap-1 text-xs flex-1">
                                                        <span className="w-4 h-4 rounded flex items-center justify-center" style={{ backgroundColor: opt.color }}>
                                                            <RenderIcon name={opt.icon} className="h-3 w-3 text-white" />
                                                        </span>
                                                        {opt.label}
                                                    </span>
                                                    {canEdit && (
                                                        <Button variant="ghost" size="sm" className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 text-red-500"
                                                            onClick={() => removeCustomOption('customSections', opt.id)}>
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* SECTION 3: Filter Options */}
                    <div className="border rounded-lg">
                        <SectionHeader
                            title="Tùy chọn trong bộ lọc"
                            icon={<Settings className="h-4 w-4 text-purple-600" />}
                            isOpen={expandedSections.filterOptions}
                            onToggle={() => toggleSection('filterOptions')}
                        />
                        {expandedSections.filterOptions && (
                            <div className="px-4 pb-4 space-y-4">
                                {/* Workflow Stages */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <Label className="text-xs font-medium">Quy trình</Label>
                                        {canEdit && (
                                            <Button variant="outline" size="sm" className="h-6 text-xs"
                                                onClick={() => setNewOption(prev => ({ ...prev, category: 'workflow' }))}>
                                                <Plus className="h-3 w-3 mr-1" /> Thêm
                                            </Button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        {(Object.keys(localSettings.filters.workflowStages) as Array<keyof typeof localSettings.filters.workflowStages>).map(stage => (
                                            <div key={stage} className="flex items-center">
                                                <Checkbox id={`wf-${stage}`} checked={localSettings.filters.workflowStages[stage]}
                                                    onCheckedChange={() => toggleWorkflowStage(stage)} disabled={!canEdit} />
                                                <Label htmlFor={`wf-${stage}`} className="ml-1 text-xs cursor-pointer">{workflowLabels[stage]}</Label>
                                            </div>
                                        ))}
                                    </div>
                                    <CustomOptionsList options={localSettings.filters.customWorkflowStages} optionKey="customWorkflowStages" />
                                </div>

                                {/* Deployment Statuses */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <Label className="text-xs font-medium">Deployment</Label>
                                        {canEdit && (
                                            <Button variant="outline" size="sm" className="h-6 text-xs"
                                                onClick={() => setNewOption(prev => ({ ...prev, category: 'deployment' }))}>
                                                <Plus className="h-3 w-3 mr-1" /> Thêm
                                            </Button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        {(Object.keys(localSettings.filters.deploymentStatuses) as Array<keyof typeof localSettings.filters.deploymentStatuses>).map(status => (
                                            <div key={status} className="flex items-center">
                                                <Checkbox id={`dep-${status}`} checked={localSettings.filters.deploymentStatuses[status]}
                                                    onCheckedChange={() => toggleDeploymentStatus(status)} disabled={!canEdit} />
                                                <Label htmlFor={`dep-${status}`} className="ml-1 text-xs cursor-pointer">{deploymentLabels[status]}</Label>
                                            </div>
                                        ))}
                                    </div>
                                    <CustomOptionsList options={localSettings.filters.customDeploymentStatuses} optionKey="customDeploymentStatuses" />
                                </div>

                                {/* Teams */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <Label className="text-xs font-medium">Team</Label>
                                        {canEdit && (
                                            <Button variant="outline" size="sm" className="h-6 text-xs"
                                                onClick={() => setNewOption(prev => ({ ...prev, category: 'team' }))}>
                                                <Plus className="h-3 w-3 mr-1" /> Thêm
                                            </Button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {(Object.keys(localSettings.filters.teams) as Array<keyof typeof localSettings.filters.teams>).map(team => (
                                            <div key={team} className="flex items-center">
                                                <Checkbox id={`team-${team}`} checked={localSettings.filters.teams[team]}
                                                    onCheckedChange={() => toggleTeam(team)} disabled={!canEdit} />
                                                <Label htmlFor={`team-${team}`} className="ml-1 text-xs cursor-pointer">{teamLabels[team]}</Label>
                                            </div>
                                        ))}
                                    </div>
                                    <CustomOptionsList options={localSettings.filters.customTeams} optionKey="customTeams" />
                                </div>

                                {/* File Types */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <Label className="text-xs font-medium">Loại file</Label>
                                        {canEdit && (
                                            <Button variant="outline" size="sm" className="h-6 text-xs"
                                                onClick={() => setNewOption(prev => ({ ...prev, category: 'fileType' }))}>
                                                <Plus className="h-3 w-3 mr-1" /> Thêm
                                            </Button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        {(Object.keys(localSettings.filters.fileTypes) as Array<keyof typeof localSettings.filters.fileTypes>).map(ft => (
                                            <div key={ft} className="flex items-center">
                                                <Checkbox id={`ft-${ft}`} checked={localSettings.filters.fileTypes[ft]}
                                                    onCheckedChange={() => toggleFileType(ft)} disabled={!canEdit} />
                                                <Label htmlFor={`ft-${ft}`} className="ml-1 text-xs cursor-pointer">{fileTypeLabels[ft]}</Label>
                                            </div>
                                        ))}
                                    </div>
                                    <CustomOptionsList options={localSettings.filters.customFileTypes} optionKey="customFileTypes" />
                                </div>

                                {/* Categories */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <Label className="text-xs font-medium">Danh mục</Label>
                                        {canEdit && (
                                            <Button variant="outline" size="sm" className="h-6 text-xs"
                                                onClick={() => setNewOption(prev => ({ ...prev, category: 'category' }))}>
                                                <Plus className="h-3 w-3 mr-1" /> Thêm
                                            </Button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {(Object.keys(localSettings.filters.categories) as Array<keyof typeof localSettings.filters.categories>).map(cat => (
                                            <div key={cat} className="flex items-center">
                                                <Checkbox id={`cat-${cat}`} checked={localSettings.filters.categories[cat]}
                                                    onCheckedChange={() => toggleCategory(cat)} disabled={!canEdit} />
                                                <Label htmlFor={`cat-${cat}`} className="ml-1 text-xs cursor-pointer">{categoryLabels[cat]}</Label>
                                            </div>
                                        ))}
                                    </div>
                                    <CustomOptionsList options={localSettings.filters.customCategories} optionKey="customCategories" />
                                </div>

                                {/* Custom Sections - Display each custom section with its options */}
                                {localSettings.filters.customSections && localSettings.filters.customSections.length > 0 && (
                                    <>
                                        {localSettings.filters.customSections.filter(s => s.enabled).map(section => (
                                            <div key={section.id} className="border-t pt-3">
                                                <div className="flex items-center justify-between mb-2">
                                                    <Label className="text-xs font-medium flex items-center gap-1.5">
                                                        <span className="w-4 h-4 rounded flex items-center justify-center" style={{ backgroundColor: section.color }}>
                                                            <RenderIcon name={section.icon} className="h-3 w-3 text-white" />
                                                        </span>
                                                        {section.label}
                                                    </Label>
                                                    {canEdit && (
                                                        <Button variant="outline" size="sm" className="h-6 text-xs"
                                                            onClick={() => setNewOption(prev => ({ ...prev, category: 'section', parentSectionId: section.id }))}>
                                                            <Plus className="h-3 w-3 mr-1" /> Thêm
                                                        </Button>
                                                    )}
                                                </div>
                                                {section.options && section.options.length > 0 ? (
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {section.options.map(opt => (
                                                            <div key={opt.id} className="flex items-center group">
                                                                <Checkbox id={`${section.id}-${opt.id}`} checked={opt.enabled}
                                                                    onCheckedChange={() => toggleCustomSectionOption(section.id, opt.id)} disabled={!canEdit} />
                                                                <Label htmlFor={`${section.id}-${opt.id}`} className="ml-1 text-xs cursor-pointer flex items-center gap-1">
                                                                    <span className="w-3 h-3 rounded flex items-center justify-center" style={{ backgroundColor: opt.color }}>
                                                                        <RenderIcon name={opt.icon} className="h-2 w-2 text-white" />
                                                                    </span>
                                                                    {opt.label}
                                                                </Label>
                                                                {canEdit && (
                                                                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 text-red-500 ml-auto"
                                                                        onClick={() => removeCustomSectionOption(section.id, opt.id)}>
                                                                        <Trash2 className="h-3 w-3" />
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-muted-foreground italic pl-4">Chưa có tùy chọn. Nhấn "Thêm" để thêm mới.</p>
                                                )}
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Add New Option Dialog */}
                <Dialog open={!!newOption.category} onOpenChange={(open) => { if (!open) setNewOption(prev => ({ ...prev, category: null, parentSectionId: undefined })) }}>
                    <DialogContent className="max-w-sm">
                        <DialogHeader>
                            <DialogTitle className="text-base">
                                {newOption.parentSectionId
                                    ? `Thêm tùy chọn cho "${localSettings.filters.customSections.find(s => s.id === newOption.parentSectionId)?.label || 'Mục lọc'}"`
                                    : 'Thêm tùy chọn mới'
                                }
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                            <div>
                                <Label className="text-sm">Tên hiển thị</Label>
                                <Input placeholder="Nhập tên..." value={newOption.label}
                                    onChange={(e) => setNewOption(prev => ({ ...prev, label: e.target.value }))} className="mt-1" autoFocus />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm">Icon</Label>
                                    <div className="mt-1">
                                        <IconPicker value={newOption.icon} onChange={(icon) => setNewOption(prev => ({ ...prev, icon }))} />
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm">Màu sắc</Label>
                                    <div className="mt-1">
                                        <ColorPicker value={newOption.color} onChange={(color) => setNewOption(prev => ({ ...prev, color }))} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setNewOption(prev => ({ ...prev, category: null, parentSectionId: undefined }))}>Hủy</Button>
                            <Button onClick={addCustomOption} disabled={!newOption.label.trim()}>
                                <Plus className="h-4 w-4 mr-2" />Thêm
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <DialogFooter className="gap-2 border-t pt-4">
                    {!canEdit && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mr-auto">
                            <Lock className="h-3 w-3" />
                            Chỉ Admin có quyền chỉnh sửa
                        </div>
                    )}
                    {canEdit && (
                        <>
                            <Button variant="outline" onClick={() => setLocalSettings(DEFAULT_LIBRARY_SETTINGS)}>
                                <RotateCcw className="h-4 w-4 mr-2" />Reset
                            </Button>
                            <Button onClick={handleSave}>
                                <Save className="h-4 w-4 mr-2" />Lưu cài đặt
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
