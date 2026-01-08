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
import { Settings, Lock, Save, RotateCcw, Plus, Trash2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { IconPicker, RenderIcon } from "./IconPicker"
import { ColorPicker } from "./ColorPicker"
import { uniqueCampaigns } from "../mockData"

// Custom filter option type
export interface CustomFilterOption {
    id: string
    label: string
    icon: string       // Lucide icon name
    color: string      // Hex color
    enabled: boolean
}

// Filter settings configuration
export interface FilterSettings {
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
        brief: boolean
        review: boolean
        final: boolean
        test: boolean
        stopped: boolean
    }
    deploymentStatuses: {
        draft: boolean
        testing: boolean
        live: boolean
        paused: boolean
        stopped: boolean
    }
    // Built-in Team options
    teams: {
        design: boolean
        ai_producer: boolean
        creative: boolean
        pion: boolean
    }
    // Built-in File Type options
    fileTypes: {
        images: boolean
        videos: boolean
        documents: boolean
        templates: boolean
        playables: boolean
        endcards: boolean
        other: boolean
    }
    // Built-in Category options
    categories: {
        final_creative: boolean
        reference: boolean
        brand_asset: boolean
        template: boolean
        campaign_material: boolean
        raw_footage: boolean
    }
    // Built-in Campaign options
    campaigns: {
        [key: string]: boolean
    }
    // Custom options for each category
    customWorkflowStages: CustomFilterOption[]
    customDeploymentStatuses: CustomFilterOption[]
    customTeams: CustomFilterOption[]
    customFileTypes: CustomFilterOption[]
    customCategories: CustomFilterOption[]
    customCampaigns: CustomFilterOption[]
}

const DEFAULT_FILTER_SETTINGS: FilterSettings = {
    sections: {
        trangThai: true,
        adNetworks: true,
        team: true,
        loaiFile: true,
        danhMuc: true,
        campaign: true,
        uploadDate: true,
    },
    workflowStages: {
        brief: true,
        review: true,
        final: true,
        test: true,
        stopped: true,
    },
    deploymentStatuses: {
        draft: true,
        testing: true,
        live: true,
        paused: true,
        stopped: true,
    },
    teams: {
        design: true,
        ai_producer: true,
        creative: true,
        pion: true,
    },
    fileTypes: {
        images: true,
        videos: true,
        documents: true,
        templates: true,
        playables: true,
        endcards: true,
        other: true,
    },
    categories: {
        final_creative: true,
        reference: true,
        brand_asset: true,
        template: true,
        campaign_material: true,
        raw_footage: true,
    },
    campaigns: {},
    customWorkflowStages: [],
    customDeploymentStatuses: [],
    customTeams: [],
    customFileTypes: [],
    customCategories: [],
    customCampaigns: [],
}

interface FilterSettingsModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    settings: FilterSettings
    onSaveSettings: (settings: FilterSettings) => void
    userRole: 'ua_team' | 'creative_team' | 'admin'
}

// New option form state
interface NewOptionForm {
    category: 'workflow' | 'deployment' | 'team' | 'fileType' | 'category' | 'campaign' | null
    label: string
    icon: string
    color: string
}

export function FilterSettingsModal({
    open,
    onOpenChange,
    settings,
    onSaveSettings,
    userRole,
}: FilterSettingsModalProps) {
    const [localSettings, setLocalSettings] = useState<FilterSettings>(settings)
    const [newOption, setNewOption] = useState<NewOptionForm>({
        category: null,
        label: "",
        icon: "Star",
        color: "#3b82f6",
    })

    const canEdit = userRole === 'admin'

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

    const handleReset = () => {
        setLocalSettings(DEFAULT_FILTER_SETTINGS)
    }

    const toggleSection = (section: keyof FilterSettings['sections']) => {
        if (!canEdit) return
        setLocalSettings(prev => ({
            ...prev,
            sections: { ...prev.sections, [section]: !prev.sections[section] },
        }))
    }

    const toggleWorkflowStage = (stage: keyof FilterSettings['workflowStages']) => {
        if (!canEdit) return
        setLocalSettings(prev => ({
            ...prev,
            workflowStages: { ...prev.workflowStages, [stage]: !prev.workflowStages[stage] },
        }))
    }

    const toggleDeploymentStatus = (status: keyof FilterSettings['deploymentStatuses']) => {
        if (!canEdit) return
        setLocalSettings(prev => ({
            ...prev,
            deploymentStatuses: { ...prev.deploymentStatuses, [status]: !prev.deploymentStatuses[status] },
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
        }

        const categoryMap = {
            workflow: 'customWorkflowStages',
            deployment: 'customDeploymentStatuses',
            team: 'customTeams',
            fileType: 'customFileTypes',
            category: 'customCategories',
            campaign: 'customCampaigns',
        } as const

        const key = categoryMap[newOption.category]
        setLocalSettings(prev => ({
            ...prev,
            [key]: [...prev[key], option],
        }))

        setNewOption({ category: null, label: "", icon: "Star", color: "#3b82f6" })
    }

    const removeCustomOption = (
        key: 'customWorkflowStages' | 'customDeploymentStatuses' | 'customTeams' | 'customFileTypes' | 'customCategories' | 'customCampaigns',
        id: string
    ) => {
        if (!canEdit) return
        setLocalSettings(prev => ({
            ...prev,
            [key]: prev[key].filter(opt => opt.id !== id),
        }))
    }

    const toggleCustomOption = (
        key: 'customWorkflowStages' | 'customDeploymentStatuses' | 'customTeams' | 'customFileTypes' | 'customCategories' | 'customCampaigns',
        id: string
    ) => {
        if (!canEdit) return
        setLocalSettings(prev => ({
            ...prev,
            [key]: prev[key].map(opt => opt.id === id ? { ...opt, enabled: !opt.enabled } : opt),
        }))
    }

    const toggleTeam = (team: keyof FilterSettings['teams']) => {
        if (!canEdit) return
        setLocalSettings(prev => ({
            ...prev,
            teams: { ...prev.teams, [team]: !prev.teams[team] },
        }))
    }

    const toggleFileType = (fileType: keyof FilterSettings['fileTypes']) => {
        if (!canEdit) return
        setLocalSettings(prev => ({
            ...prev,
            fileTypes: { ...prev.fileTypes, [fileType]: !prev.fileTypes[fileType] },
        }))
    }

    const toggleCategory = (categoryKey: keyof FilterSettings['categories']) => {
        if (!canEdit) return
        setLocalSettings(prev => ({
            ...prev,
            categories: { ...prev.categories, [categoryKey]: !prev.categories[categoryKey] },
        }))
    }

    const toggleCampaign = (campaignName: string) => {
        if (!canEdit) return
        setLocalSettings(prev => ({
            ...prev,
            campaigns: { ...prev.campaigns, [campaignName]: !prev.campaigns[campaignName] },
        }))
    }

    // Use RenderIcon from IconPicker for icon display

    const sectionLabels: Record<keyof FilterSettings['sections'], string> = {
        trangThai: "Trạng thái (Quy trình + Deployment)",
        adNetworks: "Ad Networks",
        team: "Team",
        loaiFile: "Loại file",
        danhMuc: "Danh mục",
        campaign: "Campaign",
        uploadDate: "Upload Date",
    }

    const workflowLabels: Record<keyof FilterSettings['workflowStages'], string> = {
        brief: "📋 Brief",
        review: "👀 Nghiệm thu",
        final: "✅ Final",
        test: "🧪 Test",
        stopped: "⏹️ Stop",
    }

    const deploymentLabels: Record<keyof FilterSettings['deploymentStatuses'], string> = {
        draft: "📝 Draft",
        testing: "🧪 Testing",
        live: "🟢 Live",
        paused: "⏸️ Paused",
        stopped: "⏹️ Stopped",
    }

    const teamLabels: Record<keyof FilterSettings['teams'], string> = {
        design: "🎨 Design",
        ai_producer: "🤖 AI Producer",
        creative: "💡 Creative",
        pion: "🔷 Pion",
    }

    const fileTypeLabels: Record<keyof FilterSettings['fileTypes'], string> = {
        images: "🖼️ Images",
        videos: "🎬 Videos",
        documents: "📄 Documents",
        templates: "📐 Templates",
        playables: "🎮 Playables",
        endcards: "🃏 Endcards",
        other: "📦 Other",
    }

    const categoryLabels: Record<keyof FilterSettings['categories'], string> = {
        final_creative: "✅ Final Creative",
        reference: "📚 Reference",
        brand_asset: "🏷️ Brand Asset",
        template: "📋 Template",
        campaign_material: "📊 Campaign Material",
        raw_footage: "🎞️ Raw Footage",
    }

    const CustomOptionsList = ({
        options,
        optionKey,
        title,
    }: {
        options: CustomFilterOption[]
        optionKey: 'customWorkflowStages' | 'customDeploymentStatuses' | 'customTeams' | 'customFileTypes' | 'customCategories' | 'customCampaigns'
        title: string
    }) => (
        options.length > 0 && (
            <div className="mt-2 space-y-1">
                <p className="text-[10px] text-muted-foreground uppercase">{title}</p>
                {options.map(opt => (
                    <div key={opt.id} className="flex items-center gap-2 p-1.5 bg-gray-50 dark:bg-gray-800 rounded">
                        <Checkbox
                            checked={opt.enabled}
                            onCheckedChange={() => toggleCustomOption(optionKey, opt.id)}
                            disabled={!canEdit}
                        />
                        <span
                            className="w-4 h-4 rounded flex items-center justify-center"
                            style={{ backgroundColor: opt.color }}
                        >
                            <RenderIcon name={opt.icon} className="h-3 w-3 text-white" />
                        </span>
                        <span className="text-xs flex-1">{opt.label}</span>
                        {canEdit && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-5 w-5 p-0 text-red-500 hover:text-red-700"
                                onClick={() => removeCustomOption(optionKey, opt.id)}
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        )}
                    </div>
                ))}
            </div>
        )
    )

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Cài đặt bộ lọc
                    </DialogTitle>
                    <DialogDescription>
                        {canEdit
                            ? "Tùy chỉnh các mục hiển thị và thêm tùy chọn mới"
                            : "Chỉ Admin mới có quyền chỉnh sửa"
                        }
                    </DialogDescription>
                </DialogHeader>

                <div className={cn("flex-1 overflow-y-auto space-y-4 py-2", !canEdit && "opacity-60")}>
                    {/* Section Visibility */}
                    <div>
                        <h4 className="text-sm font-semibold mb-2">Hiển thị các mục lọc</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {(Object.keys(localSettings.sections) as Array<keyof FilterSettings['sections']>).map((section) => (
                                <div key={section} className="flex items-center">
                                    <Checkbox
                                        id={`section-${section}`}
                                        checked={localSettings.sections[section]}
                                        onCheckedChange={() => toggleSection(section)}
                                        disabled={!canEdit}
                                    />
                                    <Label htmlFor={`section-${section}`} className="ml-2 text-xs cursor-pointer">
                                        {sectionLabels[section]}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Workflow Stage Options */}
                    {localSettings.sections.trangThai && (
                        <div className="border-t pt-4">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-semibold">Tùy chọn Quy trình</h4>
                                {canEdit && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-6 text-xs"
                                        onClick={() => setNewOption(prev => ({ ...prev, category: 'workflow' }))}
                                    >
                                        <Plus className="h-3 w-3 mr-1" />
                                        Thêm
                                    </Button>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {(Object.keys(localSettings.workflowStages) as Array<keyof FilterSettings['workflowStages']>).map((stage) => (
                                    <div key={stage} className="flex items-center">
                                        <Checkbox
                                            id={`workflow-${stage}`}
                                            checked={localSettings.workflowStages[stage]}
                                            onCheckedChange={() => toggleWorkflowStage(stage)}
                                            disabled={!canEdit}
                                        />
                                        <Label htmlFor={`workflow-${stage}`} className="ml-2 text-xs cursor-pointer">
                                            {workflowLabels[stage]}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                            <CustomOptionsList
                                options={localSettings.customWorkflowStages}
                                optionKey="customWorkflowStages"
                                title="Tùy chọn đã thêm"
                            />
                        </div>
                    )}

                    {/* Deployment Status Options */}
                    {localSettings.sections.trangThai && (
                        <div className="border-t pt-4">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-semibold">Tùy chọn Deployment</h4>
                                {canEdit && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-6 text-xs"
                                        onClick={() => setNewOption(prev => ({ ...prev, category: 'deployment' }))}
                                    >
                                        <Plus className="h-3 w-3 mr-1" />
                                        Thêm
                                    </Button>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {(Object.keys(localSettings.deploymentStatuses) as Array<keyof FilterSettings['deploymentStatuses']>).map((status) => (
                                    <div key={status} className="flex items-center">
                                        <Checkbox
                                            id={`deployment-${status}`}
                                            checked={localSettings.deploymentStatuses[status]}
                                            onCheckedChange={() => toggleDeploymentStatus(status)}
                                            disabled={!canEdit}
                                        />
                                        <Label htmlFor={`deployment-${status}`} className="ml-2 text-xs cursor-pointer">
                                            {deploymentLabels[status]}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                            <CustomOptionsList
                                options={localSettings.customDeploymentStatuses}
                                optionKey="customDeploymentStatuses"
                                title="Tùy chọn đã thêm"
                            />
                        </div>
                    )}

                    {/* Team Options */}
                    {localSettings.sections.team && (
                        <div className="border-t pt-4">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-semibold">Tùy chọn Team</h4>
                                {canEdit && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-6 text-xs"
                                        onClick={() => setNewOption(prev => ({ ...prev, category: 'team' }))}
                                    >
                                        <Plus className="h-3 w-3 mr-1" />
                                        Thêm
                                    </Button>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {(Object.keys(localSettings.teams) as Array<keyof FilterSettings['teams']>).map((team) => (
                                    <div key={team} className="flex items-center">
                                        <Checkbox
                                            id={`team-${team}`}
                                            checked={localSettings.teams[team]}
                                            onCheckedChange={() => toggleTeam(team)}
                                            disabled={!canEdit}
                                        />
                                        <Label htmlFor={`team-${team}`} className="ml-2 text-xs cursor-pointer">
                                            {teamLabels[team]}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                            <CustomOptionsList
                                options={localSettings.customTeams}
                                optionKey="customTeams"
                                title="Team tùy chỉnh"
                            />
                        </div>
                    )}

                    {/* File Type Options */}
                    {localSettings.sections.loaiFile && (
                        <div className="border-t pt-4">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-semibold">Tùy chọn Loại file</h4>
                                {canEdit && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-6 text-xs"
                                        onClick={() => setNewOption(prev => ({ ...prev, category: 'fileType' }))}
                                    >
                                        <Plus className="h-3 w-3 mr-1" />
                                        Thêm
                                    </Button>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {(Object.keys(localSettings.fileTypes) as Array<keyof FilterSettings['fileTypes']>).map((fileType) => (
                                    <div key={fileType} className="flex items-center">
                                        <Checkbox
                                            id={`fileType-${fileType}`}
                                            checked={localSettings.fileTypes[fileType]}
                                            onCheckedChange={() => toggleFileType(fileType)}
                                            disabled={!canEdit}
                                        />
                                        <Label htmlFor={`fileType-${fileType}`} className="ml-2 text-xs cursor-pointer">
                                            {fileTypeLabels[fileType]}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                            <CustomOptionsList
                                options={localSettings.customFileTypes}
                                optionKey="customFileTypes"
                                title="Loại file tùy chỉnh"
                            />
                        </div>
                    )}

                    {/* Category Options */}
                    {localSettings.sections.danhMuc && (
                        <div className="border-t pt-4">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-semibold">Tùy chọn Danh mục</h4>
                                {canEdit && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-6 text-xs"
                                        onClick={() => setNewOption(prev => ({ ...prev, category: 'category' }))}
                                    >
                                        <Plus className="h-3 w-3 mr-1" />
                                        Thêm
                                    </Button>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {(Object.keys(localSettings.categories) as Array<keyof FilterSettings['categories']>).map((cat) => (
                                    <div key={cat} className="flex items-center">
                                        <Checkbox
                                            id={`category-${cat}`}
                                            checked={localSettings.categories[cat]}
                                            onCheckedChange={() => toggleCategory(cat)}
                                            disabled={!canEdit}
                                        />
                                        <Label htmlFor={`category-${cat}`} className="ml-2 text-xs cursor-pointer">
                                            {categoryLabels[cat]}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                            <CustomOptionsList
                                options={localSettings.customCategories}
                                optionKey="customCategories"
                                title="Danh mục tùy chỉnh"
                            />
                        </div>
                    )}

                    {/* Campaign Options */}
                    {localSettings.sections.campaign && (
                        <div className="border-t pt-4">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-semibold">Tùy chọn Campaign</h4>
                                {canEdit && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-6 text-xs"
                                        onClick={() => setNewOption(prev => ({ ...prev, category: 'campaign' }))}
                                    >
                                        <Plus className="h-3 w-3 mr-1" />
                                        Thêm
                                    </Button>
                                )}
                            </div>
                            {/* Built-in Campaigns from mockData */}
                            <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                                {uniqueCampaigns.map((campaign) => (
                                    <div key={campaign} className="flex items-center">
                                        <Checkbox
                                            id={`campaign-${campaign}`}
                                            checked={localSettings.campaigns[campaign] !== false}
                                            onCheckedChange={() => toggleCampaign(campaign)}
                                            disabled={!canEdit}
                                        />
                                        <Label htmlFor={`campaign-${campaign}`} className="ml-2 text-xs cursor-pointer truncate">
                                            📁 {campaign}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                            <CustomOptionsList
                                options={localSettings.customCampaigns}
                                optionKey="customCampaigns"
                                title="Campaign tùy chỉnh"
                            />
                        </div>
                    )}
                </div>

                {/* Add New Option Popup */}
                <Dialog open={!!newOption.category} onOpenChange={(open) => {
                    if (!open) setNewOption(prev => ({ ...prev, category: null }))
                }}>
                    <DialogContent className="max-w-sm">
                        <DialogHeader>
                            <DialogTitle className="text-base">
                                Thêm tùy chọn mới ({
                                    newOption.category === 'workflow' ? 'Quy trình' :
                                        newOption.category === 'deployment' ? 'Deployment' :
                                            newOption.category === 'team' ? 'Team' :
                                                newOption.category === 'fileType' ? 'Loại file' :
                                                    newOption.category === 'campaign' ? 'Campaign' : 'Danh mục'
                                })
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                            <div>
                                <Label className="text-sm">Tên hiển thị</Label>
                                <Input
                                    placeholder="Nhập tên..."
                                    value={newOption.label}
                                    onChange={(e) => setNewOption(prev => ({ ...prev, label: e.target.value }))}
                                    className="mt-1"
                                    autoFocus
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm">Icon</Label>
                                    <div className="mt-1">
                                        <IconPicker
                                            value={newOption.icon}
                                            onChange={(icon) => setNewOption(prev => ({ ...prev, icon }))}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm">Màu sắc</Label>
                                    <div className="mt-1">
                                        <ColorPicker
                                            value={newOption.color}
                                            onChange={(color) => setNewOption(prev => ({ ...prev, color }))}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setNewOption(prev => ({ ...prev, category: null }))}
                            >
                                Hủy
                            </Button>
                            <Button
                                onClick={addCustomOption}
                                disabled={!newOption.label.trim()}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Thêm
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
                            <Button variant="outline" onClick={handleReset}>
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Reset
                            </Button>
                            <Button onClick={handleSave}>
                                <Save className="h-4 w-4 mr-2" />
                                Lưu
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

// Hook to manage filter settings with localStorage
export function useFilterSettings() {
    const [settings, setSettings] = useState<FilterSettings>(DEFAULT_FILTER_SETTINGS)

    useEffect(() => {
        const saved = localStorage.getItem('filterSettings')
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                // Merge with defaults to handle new fields
                setSettings({
                    ...DEFAULT_FILTER_SETTINGS,
                    ...parsed,
                    sections: { ...DEFAULT_FILTER_SETTINGS.sections, ...parsed.sections },
                    workflowStages: { ...DEFAULT_FILTER_SETTINGS.workflowStages, ...parsed.workflowStages },
                    deploymentStatuses: { ...DEFAULT_FILTER_SETTINGS.deploymentStatuses, ...parsed.deploymentStatuses },
                })
            } catch {
                setSettings(DEFAULT_FILTER_SETTINGS)
            }
        }
    }, [])

    const saveSettings = (newSettings: FilterSettings) => {
        setSettings(newSettings)
        localStorage.setItem('filterSettings', JSON.stringify(newSettings))
    }

    return { settings, saveSettings }
}

export { DEFAULT_FILTER_SETTINGS }
