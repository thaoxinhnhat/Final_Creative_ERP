"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { Asset, AdNetwork, DeploymentStatus, PerformanceRating, UATestStatus } from "../types"
import { AD_NETWORK_CONFIG, ALL_AD_NETWORKS, DEPLOYMENT_STATUS_CONFIG, PERFORMANCE_RATING_CONFIG } from "../types"
import { Check, X, FlaskConical, Circle, AlertTriangle } from "lucide-react"

interface UATestingPanelProps {
    asset: Asset
    onUpdateUAStatus: (updates: Partial<UATestStatus>) => void
    onSetNetworkStatus: (network: AdNetwork, rating: PerformanceRating) => void
    onUpdateDeployment: (status: DeploymentStatus, stopReason?: string) => void
    onUpdateLiveNetworks: (networks: AdNetwork[]) => void
    compact?: boolean
}

export function UATestingPanel({
    asset,
    onUpdateUAStatus,
    onSetNetworkStatus,
    onUpdateDeployment,
    onUpdateLiveNetworks,
    compact = false,
}: UATestingPanelProps) {
    const [stopReason, setStopReason] = useState(asset.stopReason || "")
    const [showStopReason, setShowStopReason] = useState(false)

    const uaStatus = asset.uaTestStatus || {
        isPlanned: false,
        testedNetworks: [],
        performanceRating: {},
    }

    const handleTestPlanToggle = (checked: boolean) => {
        onUpdateUAStatus({ isPlanned: checked })
    }

    const handleNetworkClick = (network: AdNetwork) => {
        const currentRating = uaStatus.performanceRating?.[network]

        // Cycle through: null -> testing -> good -> bad -> null
        let nextRating: PerformanceRating
        if (!currentRating) {
            nextRating = 'testing'
        } else if (currentRating === 'testing') {
            nextRating = 'good'
        } else if (currentRating === 'good') {
            nextRating = 'bad'
        } else {
            nextRating = null
        }

        onSetNetworkStatus(network, nextRating)
    }

    const handleRatingSelect = (network: AdNetwork, rating: PerformanceRating) => {
        onSetNetworkStatus(network, rating)
    }

    const handleDeploymentChange = (status: DeploymentStatus) => {
        if (status === 'stopped') {
            setShowStopReason(true)
        } else {
            setShowStopReason(false)
            onUpdateDeployment(status)
        }
    }

    const handleStopConfirm = () => {
        onUpdateDeployment('stopped', stopReason)
        setShowStopReason(false)
    }

    const toggleLiveNetwork = (network: AdNetwork) => {
        const current = asset.liveNetworks || []
        const updated = current.includes(network)
            ? current.filter(n => n !== network)
            : [...current, network]
        onUpdateLiveNetworks(updated)
    }

    const getRatingIcon = (rating: PerformanceRating) => {
        if (!rating) return <Circle className="h-3 w-3 text-gray-300" />
        if (rating === 'testing') return <FlaskConical className="h-3 w-3 text-yellow-500" />
        if (rating === 'good') return <Check className="h-3 w-3 text-green-500" />
        if (rating === 'bad') return <X className="h-3 w-3 text-red-500" />
        return null
    }

    if (compact) {
        return (
            <div className="space-y-2">
                {/* Compact Network Indicators */}
                <div className="flex flex-wrap gap-1">
                    {ALL_AD_NETWORKS.map(network => {
                        const config = AD_NETWORK_CONFIG[network]
                        const rating = uaStatus.performanceRating?.[network]
                        const isLive = asset.liveNetworks?.includes(network)

                        return (
                            <Badge
                                key={network}
                                variant="outline"
                                className={cn(
                                    "text-xs cursor-pointer transition-all",
                                    rating === 'good' && "bg-green-50 border-green-300 text-green-700",
                                    rating === 'bad' && "bg-red-50 border-red-300 text-red-700",
                                    rating === 'testing' && "bg-yellow-50 border-yellow-300 text-yellow-700",
                                    isLive && "ring-2 ring-green-400"
                                )}
                                onClick={() => handleNetworkClick(network)}
                            >
                                {config.icon} {config.shortLabel}
                                {getRatingIcon(rating ?? null)}
                            </Badge>
                        )
                    })}
                </div>

                {/* Deployment Status */}
                {asset.deploymentStatus && (
                    <Badge className={cn("text-xs", DEPLOYMENT_STATUS_CONFIG[asset.deploymentStatus].color)}>
                        {DEPLOYMENT_STATUS_CONFIG[asset.deploymentStatus].icon} {DEPLOYMENT_STATUS_CONFIG[asset.deploymentStatus].label}
                    </Badge>
                )}
            </div>
        )
    }

    return (
        <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                    <FlaskConical className="h-4 w-4 text-orange-500" />
                    UA Testing Panel
                </h3>

                {/* Test Plan Checkbox */}
                <div className="flex items-center gap-2">
                    <Checkbox
                        id="testPlan"
                        checked={uaStatus.isPlanned}
                        onCheckedChange={handleTestPlanToggle}
                    />
                    <Label htmlFor="testPlan" className="text-xs cursor-pointer">
                        Test Plan
                    </Label>
                </div>
            </div>

            {/* Ad Networks Grid */}
            <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Ad Networks Performance</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {ALL_AD_NETWORKS.map(network => {
                        const config = AD_NETWORK_CONFIG[network]
                        const rating = uaStatus.performanceRating?.[network]
                        const isLive = asset.liveNetworks?.includes(network)

                        return (
                            <div
                                key={network}
                                className={cn(
                                    "p-2 rounded-lg border-2 transition-all cursor-pointer",
                                    "hover:shadow-md",
                                    !rating && "bg-gray-50 border-gray-200",
                                    rating === 'testing' && "bg-yellow-50 border-yellow-300",
                                    rating === 'good' && "bg-green-50 border-green-300",
                                    rating === 'bad' && "bg-red-50 border-red-300",
                                    isLive && "ring-2 ring-offset-1 ring-blue-400"
                                )}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-lg">{config.icon}</span>
                                    {isLive && <Badge className="text-[10px] bg-blue-500">LIVE</Badge>}
                                </div>
                                <p className="text-xs font-medium truncate">{config.label}</p>

                                {/* Rating Buttons */}
                                <div className="flex gap-1 mt-2">
                                    <Button
                                        size="sm"
                                        variant={rating === 'testing' ? "default" : "ghost"}
                                        className={cn(
                                            "h-6 w-6 p-0",
                                            rating === 'testing' && "bg-yellow-500 hover:bg-yellow-600"
                                        )}
                                        onClick={() => handleRatingSelect(network, rating === 'testing' ? null : 'testing')}
                                    >
                                        <FlaskConical className="h-3 w-3" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant={rating === 'good' ? "default" : "ghost"}
                                        className={cn(
                                            "h-6 w-6 p-0",
                                            rating === 'good' && "bg-green-500 hover:bg-green-600"
                                        )}
                                        onClick={() => handleRatingSelect(network, rating === 'good' ? null : 'good')}
                                    >
                                        <Check className="h-3 w-3" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant={rating === 'bad' ? "default" : "ghost"}
                                        className={cn(
                                            "h-6 w-6 p-0",
                                            rating === 'bad' && "bg-red-500 hover:bg-red-600"
                                        )}
                                        onClick={() => handleRatingSelect(network, rating === 'bad' ? null : 'bad')}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>

                                {/* Live Toggle */}
                                <div className="flex items-center gap-1 mt-2">
                                    <Checkbox
                                        checked={isLive}
                                        onCheckedChange={() => toggleLiveNetwork(network)}
                                        className="h-3 w-3"
                                    />
                                    <span className="text-[10px] text-muted-foreground">Live</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Deployment Status */}
            <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Deployment Status</Label>
                <div className="flex items-center gap-4">
                    <Select
                        value={asset.deploymentStatus || 'draft'}
                        onValueChange={(value) => handleDeploymentChange(value as DeploymentStatus)}
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(DEPLOYMENT_STATUS_CONFIG).map(([status, config]) => (
                                <SelectItem key={status} value={status}>
                                    <span className="flex items-center gap-2">
                                        {config.icon} {config.label}
                                    </span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Live Networks Chips */}
                    {asset.liveNetworks && asset.liveNetworks.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {asset.liveNetworks.map(network => (
                                <Badge
                                    key={network}
                                    className="bg-green-500 text-white text-xs"
                                >
                                    {AD_NETWORK_CONFIG[network].icon} {AD_NETWORK_CONFIG[network].shortLabel}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Stop Reason (conditional) */}
            {(showStopReason || asset.deploymentStatus === 'stopped') && (
                <div className="space-y-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200">
                    <div className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-4 w-4" />
                        <Label className="text-xs font-medium">Stop Reason</Label>
                    </div>
                    <Textarea
                        value={stopReason}
                        onChange={(e) => setStopReason(e.target.value)}
                        placeholder="Enter reason for stopping this asset..."
                        className="text-sm"
                        rows={2}
                        disabled={asset.deploymentStatus === 'stopped' && !showStopReason}
                    />
                    {showStopReason && (
                        <div className="flex gap-2">
                            <Button size="sm" variant="destructive" onClick={handleStopConfirm}>
                                Confirm Stop
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setShowStopReason(false)}>
                                Cancel
                            </Button>
                        </div>
                    )}
                    {asset.stoppedAt && (
                        <p className="text-xs text-muted-foreground">
                            Stopped on: {new Date(asset.stoppedAt).toLocaleDateString()}
                        </p>
                    )}
                </div>
            )}

            {/* Performance Summary */}
            <div className="flex items-center gap-4 pt-2 border-t text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                    <Check className="h-3 w-3 text-green-500" />
                    {Object.values(uaStatus.performanceRating || {}).filter(r => r === 'good').length} Good
                </span>
                <span className="flex items-center gap-1">
                    <X className="h-3 w-3 text-red-500" />
                    {Object.values(uaStatus.performanceRating || {}).filter(r => r === 'bad').length} Bad
                </span>
                <span className="flex items-center gap-1">
                    <FlaskConical className="h-3 w-3 text-yellow-500" />
                    {Object.values(uaStatus.performanceRating || {}).filter(r => r === 'testing').length} Testing
                </span>
            </div>
        </div>
    )
}
