"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Link2, Loader2, Check, AlertCircle, FileType, Calendar, HardDrive, User } from "lucide-react"
import type { DriveFileInfo } from "../types"
import { isValidDriveUrl, parseGoogleDriveUrl, getMockDriveFileInfo, parseAssetIdFromFilename, formatFileSize } from "../utils/driveParser"

interface DriveImportTabProps {
    onImport: (driveUrl: string) => Promise<void>
    isLoading?: boolean
    driveUrl?: string
    onDriveUrlChange?: (url: string) => void
}

export function DriveImportTab({ onImport, isLoading = false, driveUrl: externalDriveUrl, onDriveUrlChange }: DriveImportTabProps) {
    // Use external state if provided, otherwise use internal state
    const [internalDriveUrl, setInternalDriveUrl] = useState("")
    const driveUrl = externalDriveUrl !== undefined ? externalDriveUrl : internalDriveUrl
    const setDriveUrl = onDriveUrlChange || setInternalDriveUrl

    const [fileInfo, setFileInfo] = useState<DriveFileInfo | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isFetching, setIsFetching] = useState(false)

    const handleUrlChange = async (url: string) => {
        setDriveUrl(url)
        setError(null)
        setFileInfo(null)

        if (!url.trim()) return

        // Validate URL format
        if (!isValidDriveUrl(url)) {
            setError("Invalid Google Drive URL")
            return
        }

        // Don't auto-fetch file info, just validate
        setError(null)
    }

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
        const pastedText = e.clipboardData.getData('text')
        handleUrlChange(pastedText)
    }

    const handleImport = async () => {
        if (!driveUrl || !isValidDriveUrl(driveUrl)) return
        await onImport(driveUrl)
        setDriveUrl("")
        setFileInfo(null)
    }

    const parsedId = fileInfo ? parseAssetIdFromFilename(fileInfo.name) : null

    return (
        <div className="space-y-4">
            {/* URL Input */}
            <div className="space-y-2">
                <Label htmlFor="driveUrl" className="text-sm font-medium">
                    Google Drive Link
                </Label>
                <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="driveUrl"
                        placeholder="Paste Google Drive link here..."
                        value={driveUrl}
                        onChange={(e) => handleUrlChange(e.target.value)}
                        onPaste={handlePaste}
                        className={cn(
                            "pl-10",
                            error && "border-red-500 focus-visible:ring-red-500"
                        )}
                    />
                    {isFetching && (
                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-blue-500" />
                    )}
                    {fileInfo && !isFetching && (
                        <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                    )}
                </div>
                {error && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {error}
                    </p>
                )}
                <p className="text-xs text-muted-foreground">
                    Supports: drive.google.com/file/d/..., docs.google.com/..., etc.
                </p>
            </div>

            {/* File Preview */}
            {fileInfo && (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-3 border">
                    <div className="flex items-start gap-3">
                        {/* Thumbnail */}
                        <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0">
                            {fileInfo.thumbnailLink ? (
                                <img
                                    src={fileInfo.thumbnailLink}
                                    alt={fileInfo.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-2xl">
                                    📄
                                </div>
                            )}
                        </div>

                        {/* File Info */}
                        <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate" title={fileInfo.name}>
                                {fileInfo.name}
                            </h4>

                            <div className="flex flex-wrap gap-2 mt-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <FileType className="h-3 w-3" />
                                    {fileInfo.mimeType.split('/').pop()?.toUpperCase()}
                                </span>
                                <span className="flex items-center gap-1">
                                    <HardDrive className="h-3 w-3" />
                                    {formatFileSize(fileInfo.size)}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(fileInfo.createdTime).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Parsed Asset ID */}
                    {parsedId && (
                        <div className="space-y-2 pt-2 border-t">
                            <p className="text-xs text-muted-foreground">Auto-detected metadata:</p>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className="text-xs">
                                    ID: {parsedId.fullId}
                                </Badge>
                                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                                    Project: {parsedId.projectCode}
                                </Badge>
                                <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700">
                                    Team: {parsedId.teamCode}
                                </Badge>
                                <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                                    <User className="h-2.5 w-2.5 mr-1" />
                                    {parsedId.creatorCode}
                                </Badge>
                                {parsedId.isCreativeAI && (
                                    <Badge className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                        🤖 AI Generated
                                    </Badge>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Auto-linking Info */}
                    <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                        <p>✨ This asset will be automatically:</p>
                        <ul className="list-disc list-inside mt-1 space-y-0.5">
                            <li>Tagged with project and team info</li>
                            <li>Linked to matching Brief (if found)</li>
                            <li>Added to workflow at "Brief" stage</li>
                        </ul>
                    </div>
                </div>
            )}

            {/* Import Button */}
            <Button
                onClick={handleImport}
                disabled={!driveUrl || !!error || isLoading || isFetching}
                className="w-full"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Importing...
                    </>
                ) : (
                    <>
                        <Link2 className="h-4 w-4 mr-2" />
                        Import from Drive
                    </>
                )}
            </Button>
        </div>
    )
}
