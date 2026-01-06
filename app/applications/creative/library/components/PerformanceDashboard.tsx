"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import type { Asset, AdNetwork, WorkflowStage } from "../types"
import {
    WORKFLOW_STAGE_CONFIG,
    AD_NETWORK_CONFIG,
    ALL_AD_NETWORKS,
    TEAM_CONFIG
} from "../types"
import {
    BarChart3,
    TrendingUp,
    Trophy,
    Activity,
    Check,
    X,
    FlaskConical,
    Layers
} from "lucide-react"

interface PerformanceDashboardProps {
    assets: Asset[]
    performanceStats: Record<AdNetwork, { total: number; good: number; bad: number; testing: number }>
    assetsByWorkflow: Record<WorkflowStage, Asset[]>
}

export function PerformanceDashboard({
    assets,
    performanceStats,
    assetsByWorkflow,
}: PerformanceDashboardProps) {
    // Top performers (assets with most "good" ratings)
    const topPerformers = useMemo(() => {
        return [...assets]
            .filter(a => a.uaTestStatus?.performanceRating)
            .map(asset => ({
                asset,
                goodCount: Object.values(asset.uaTestStatus?.performanceRating || {}).filter(r => r === 'good').length,
                totalTested: asset.uaTestStatus?.testedNetworks?.length || 0,
            }))
            .filter(a => a.goodCount > 0)
            .sort((a, b) => b.goodCount - a.goodCount)
            .slice(0, 5)
    }, [assets])

    // Recent activity (last 5 updated assets)
    const recentActivity = useMemo(() => {
        return [...assets]
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .slice(0, 5)
    }, [assets])

    // Overall stats
    const overallStats = useMemo(() => {
        let totalGood = 0, totalBad = 0, totalTesting = 0
        ALL_AD_NETWORKS.forEach(network => {
            const stats = performanceStats[network]
            totalGood += stats.good
            totalBad += stats.bad
            totalTesting += stats.testing
        })
        return { good: totalGood, bad: totalBad, testing: totalTesting, total: totalGood + totalBad + totalTesting }
    }, [performanceStats])

    // Team distribution
    const teamStats = useMemo(() => {
        return {
            creative: assets.filter(a => a.team === 'creative').length,
            design: assets.filter(a => a.team === 'design').length,
            video: assets.filter(a => a.team === 'video').length,
        }
    }, [assets])

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {/* Overall Performance Card */}
            <Card className="col-span-1">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-blue-500" />
                        Overall Performance
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold">{overallStats.total}</span>
                            <span className="text-xs text-muted-foreground">Total Tests</span>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Check className="h-3 w-3 text-green-500" />
                                <span className="text-xs flex-1">Good</span>
                                <span className="text-xs font-medium">{overallStats.good}</span>
                                <Progress
                                    value={(overallStats.good / Math.max(overallStats.total, 1)) * 100}
                                    className="w-16 h-1.5"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <X className="h-3 w-3 text-red-500" />
                                <span className="text-xs flex-1">Bad</span>
                                <span className="text-xs font-medium">{overallStats.bad}</span>
                                <Progress
                                    value={(overallStats.bad / Math.max(overallStats.total, 1)) * 100}
                                    className="w-16 h-1.5 [&>div]:bg-red-500"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <FlaskConical className="h-3 w-3 text-yellow-500" />
                                <span className="text-xs flex-1">Testing</span>
                                <span className="text-xs font-medium">{overallStats.testing}</span>
                                <Progress
                                    value={(overallStats.testing / Math.max(overallStats.total, 1)) * 100}
                                    className="w-16 h-1.5 [&>div]:bg-yellow-500"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Network Performance Card */}
            <Card className="col-span-1 md:col-span-2 lg:col-span-1">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-purple-500" />
                        Performance by Network
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {ALL_AD_NETWORKS.map(network => {
                            const stats = performanceStats[network]
                            const config = AD_NETWORK_CONFIG[network]
                            const successRate = stats.total > 0
                                ? Math.round((stats.good / stats.total) * 100)
                                : 0

                            return (
                                <div key={network} className="flex items-center gap-2">
                                    <span className="text-sm w-6">{config.icon}</span>
                                    <span className="text-xs flex-1 truncate">{config.shortLabel}</span>
                                    <div className="flex gap-1 text-[10px]">
                                        <span className="text-green-600">{stats.good}✓</span>
                                        <span className="text-red-600">{stats.bad}✗</span>
                                        <span className="text-yellow-600">{stats.testing}⏳</span>
                                    </div>
                                    <Progress
                                        value={successRate}
                                        className="w-12 h-1.5"
                                    />
                                    <span className="text-xs w-8 text-right">{successRate}%</span>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Workflow Distribution Card */}
            <Card className="col-span-1">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Layers className="h-4 w-4 text-orange-500" />
                        Workflow Distribution
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {Object.entries(WORKFLOW_STAGE_CONFIG).map(([stage, config]) => {
                            const count = assetsByWorkflow[stage as WorkflowStage]?.length || 0
                            const percentage = assets.length > 0
                                ? Math.round((count / assets.length) * 100)
                                : 0

                            return (
                                <div key={stage} className="flex items-center gap-2">
                                    <span className="text-sm">{config.icon}</span>
                                    <span className="text-xs flex-1">{config.label}</span>
                                    <Badge variant="outline" className="text-[10px]">
                                        {count}
                                    </Badge>
                                    <Progress value={percentage} className="w-12 h-1.5" />
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Top Performers Card */}
            <Card className="col-span-1">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        Top Performers
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {topPerformers.length === 0 ? (
                        <p className="text-xs text-muted-foreground text-center py-4">
                            No performance data yet
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {topPerformers.map(({ asset, goodCount, totalTested }, index) => (
                                <div
                                    key={asset.id}
                                    className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800"
                                >
                                    <span className={cn(
                                        "w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold",
                                        index === 0 && "bg-yellow-100 text-yellow-700",
                                        index === 1 && "bg-gray-200 text-gray-700",
                                        index === 2 && "bg-orange-100 text-orange-700",
                                        index > 2 && "bg-gray-100 text-gray-600"
                                    )}>
                                        {index + 1}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium truncate">
                                            {asset.parsedAssetId || asset.name}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground">
                                            {goodCount}/{totalTested} networks
                                        </p>
                                    </div>
                                    <div className="flex">
                                        {Array.from({ length: goodCount }).slice(0, 3).map((_, i) => (
                                            <Check key={i} className="h-3 w-3 text-green-500 -ml-1 first:ml-0" />
                                        ))}
                                        {goodCount > 3 && (
                                            <span className="text-[10px] ml-0.5">+{goodCount - 3}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Team Stats Card */}
            <Card className="col-span-1">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Activity className="h-4 w-4 text-green-500" />
                        Team Distribution
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {Object.entries(TEAM_CONFIG).map(([team, config]) => {
                            const count = teamStats[team as keyof typeof teamStats] || 0
                            const percentage = assets.length > 0
                                ? Math.round((count / assets.length) * 100)
                                : 0

                            return (
                                <div key={team} className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs flex items-center gap-1">
                                            {config.icon} {config.label}
                                        </span>
                                        <span className="text-xs font-medium">{count}</span>
                                    </div>
                                    <Progress value={percentage} className="h-2" />
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Recent Activity Card */}
            <Card className="col-span-1">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Activity className="h-4 w-4 text-cyan-500" />
                        Recent Activity
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {recentActivity.map(asset => (
                            <div
                                key={asset.id}
                                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                <div className="w-8 h-8 rounded bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0">
                                    {asset.thumbnailUrl ? (
                                        <img
                                            src={asset.thumbnailUrl}
                                            alt={asset.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-sm">
                                            {asset.type === 'video' ? '🎬' : '🖼️'}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium truncate">
                                        {asset.parsedAssetId || asset.name}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground">
                                        {formatDate(asset.updatedAt)}
                                    </p>
                                </div>
                                <Badge
                                    variant="outline"
                                    className={cn("text-[10px]", WORKFLOW_STAGE_CONFIG[asset.workflowStage].bgColor)}
                                >
                                    {WORKFLOW_STAGE_CONFIG[asset.workflowStage].icon}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
