"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { ChevronDown, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

// Tailwind color palette with shades
const COLOR_PALETTE = {
    red: {
        name: "Đỏ",
        shades: {
            100: "#fee2e2", 200: "#fecaca", 300: "#fca5a5", 400: "#f87171",
            500: "#ef4444", 600: "#dc2626", 700: "#b91c1c", 800: "#991b1b"
        }
    },
    orange: {
        name: "Cam",
        shades: {
            100: "#ffedd5", 200: "#fed7aa", 300: "#fdba74", 400: "#fb923c",
            500: "#f97316", 600: "#ea580c", 700: "#c2410c", 800: "#9a3412"
        }
    },
    amber: {
        name: "Vàng đậm",
        shades: {
            100: "#fef3c7", 200: "#fde68a", 300: "#fcd34d", 400: "#fbbf24",
            500: "#f59e0b", 600: "#d97706", 700: "#b45309", 800: "#92400e"
        }
    },
    yellow: {
        name: "Vàng",
        shades: {
            100: "#fef9c3", 200: "#fef08a", 300: "#fde047", 400: "#facc15",
            500: "#eab308", 600: "#ca8a04", 700: "#a16207", 800: "#854d0e"
        }
    },
    lime: {
        name: "Chanh",
        shades: {
            100: "#ecfccb", 200: "#d9f99d", 300: "#bef264", 400: "#a3e635",
            500: "#84cc16", 600: "#65a30d", 700: "#4d7c0f", 800: "#3f6212"
        }
    },
    green: {
        name: "Xanh lá",
        shades: {
            100: "#dcfce7", 200: "#bbf7d0", 300: "#86efac", 400: "#4ade80",
            500: "#22c55e", 600: "#16a34a", 700: "#15803d", 800: "#166534"
        }
    },
    emerald: {
        name: "Ngọc lục",
        shades: {
            100: "#d1fae5", 200: "#a7f3d0", 300: "#6ee7b7", 400: "#34d399",
            500: "#10b981", 600: "#059669", 700: "#047857", 800: "#065f46"
        }
    },
    teal: {
        name: "Xanh ngọc",
        shades: {
            100: "#ccfbf1", 200: "#99f6e4", 300: "#5eead4", 400: "#2dd4bf",
            500: "#14b8a6", 600: "#0d9488", 700: "#0f766e", 800: "#115e59"
        }
    },
    cyan: {
        name: "Lam",
        shades: {
            100: "#cffafe", 200: "#a5f3fc", 300: "#67e8f9", 400: "#22d3ee",
            500: "#06b6d4", 600: "#0891b2", 700: "#0e7490", 800: "#155e75"
        }
    },
    sky: {
        name: "Trời",
        shades: {
            100: "#e0f2fe", 200: "#bae6fd", 300: "#7dd3fc", 400: "#38bdf8",
            500: "#0ea5e9", 600: "#0284c7", 700: "#0369a1", 800: "#075985"
        }
    },
    blue: {
        name: "Xanh dương",
        shades: {
            100: "#dbeafe", 200: "#bfdbfe", 300: "#93c5fd", 400: "#60a5fa",
            500: "#3b82f6", 600: "#2563eb", 700: "#1d4ed8", 800: "#1e40af"
        }
    },
    indigo: {
        name: "Chàm",
        shades: {
            100: "#e0e7ff", 200: "#c7d2fe", 300: "#a5b4fc", 400: "#818cf8",
            500: "#6366f1", 600: "#4f46e5", 700: "#4338ca", 800: "#3730a3"
        }
    },
    violet: {
        name: "Tím violet",
        shades: {
            100: "#ede9fe", 200: "#ddd6fe", 300: "#c4b5fd", 400: "#a78bfa",
            500: "#8b5cf6", 600: "#7c3aed", 700: "#6d28d9", 800: "#5b21b6"
        }
    },
    purple: {
        name: "Tím",
        shades: {
            100: "#f3e8ff", 200: "#e9d5ff", 300: "#d8b4fe", 400: "#c084fc",
            500: "#a855f7", 600: "#9333ea", 700: "#7e22ce", 800: "#6b21a8"
        }
    },
    fuchsia: {
        name: "Hồng đậm",
        shades: {
            100: "#fae8ff", 200: "#f5d0fe", 300: "#f0abfc", 400: "#e879f9",
            500: "#d946ef", 600: "#c026d3", 700: "#a21caf", 800: "#86198f"
        }
    },
    pink: {
        name: "Hồng",
        shades: {
            100: "#fce7f3", 200: "#fbcfe8", 300: "#f9a8d4", 400: "#f472b6",
            500: "#ec4899", 600: "#db2777", 700: "#be185d", 800: "#9d174d"
        }
    },
    rose: {
        name: "Hồng đào",
        shades: {
            100: "#ffe4e6", 200: "#fecdd3", 300: "#fda4af", 400: "#fb7185",
            500: "#f43f5e", 600: "#e11d48", 700: "#be123c", 800: "#9f1239"
        }
    },
    gray: {
        name: "Xám",
        shades: {
            100: "#f3f4f6", 200: "#e5e7eb", 300: "#d1d5db", 400: "#9ca3af",
            500: "#6b7280", 600: "#4b5563", 700: "#374151", 800: "#1f2937"
        }
    },
}

type ColorKey = keyof typeof COLOR_PALETTE

interface ColorPickerProps {
    value: string
    onChange: (color: string) => void
    disabled?: boolean
}

export function ColorPicker({ value, onChange, disabled }: ColorPickerProps) {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedPalette, setSelectedPalette] = useState<ColorKey | null>(null)

    const handleSelectColor = (color: string) => {
        onChange(color)
        setDialogOpen(false)
        setSelectedPalette(null)
    }

    // Find color name for display
    const getColorInfo = (hex: string) => {
        for (const [, palette] of Object.entries(COLOR_PALETTE)) {
            for (const [shade, shadeHex] of Object.entries(palette.shades)) {
                if (shadeHex === hex) {
                    return { name: palette.name, shade }
                }
            }
        }
        return null
    }

    const colorInfo = value ? getColorInfo(value) : null

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
                            <span
                                className="w-4 h-4 rounded border"
                                style={{ backgroundColor: value }}
                            />
                            <span className="text-xs text-muted-foreground truncate">
                                {colorInfo ? `${colorInfo.name} ${colorInfo.shade}` : "Màu đã chọn"}
                            </span>
                        </>
                    ) : (
                        <span className="text-muted-foreground text-xs">Chọn màu...</span>
                    )}
                </span>
                <ChevronDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
            </Button>

            {/* Color Selection Dialog */}
            <Dialog open={dialogOpen} onOpenChange={(open) => {
                setDialogOpen(open)
                if (!open) setSelectedPalette(null)
            }}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedPalette ? (
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 px-2"
                                        type="button"
                                        onClick={() => setSelectedPalette(null)}
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                    </Button>
                                    <span>{COLOR_PALETTE[selectedPalette].name}</span>
                                </div>
                            ) : (
                                "Chọn màu sắc"
                            )}
                        </DialogTitle>
                    </DialogHeader>

                    {!selectedPalette ? (
                        // Palette Grid
                        <div className="grid grid-cols-6 gap-3 py-2">
                            {(Object.entries(COLOR_PALETTE) as [ColorKey, typeof COLOR_PALETTE[ColorKey]][]).map(([key, palette]) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => setSelectedPalette(key)}
                                    className="group flex flex-col items-center gap-1"
                                    title={palette.name}
                                >
                                    <span
                                        className="w-8 h-8 rounded-lg border-2 border-transparent group-hover:border-gray-400 transition-all group-hover:scale-110 shadow-sm"
                                        style={{ backgroundColor: palette.shades[500] }}
                                    />
                                    <span className="text-[9px] text-muted-foreground">
                                        {palette.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        // Shade Selection
                        <div className="py-2">
                            <p className="text-sm text-muted-foreground mb-3">Chọn sắc độ:</p>
                            <div className="grid grid-cols-4 gap-3">
                                {Object.entries(COLOR_PALETTE[selectedPalette].shades).map(([shade, hex]) => (
                                    <button
                                        key={shade}
                                        type="button"
                                        onClick={() => handleSelectColor(hex)}
                                        className={cn(
                                            "aspect-square rounded-lg border-2 transition-all hover:scale-110",
                                            value === hex ? "border-gray-900 ring-2 ring-offset-2 ring-gray-400" : "border-transparent hover:border-gray-400"
                                        )}
                                        style={{ backgroundColor: hex }}
                                        title={`${COLOR_PALETTE[selectedPalette].name} ${shade}`}
                                    />
                                ))}
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground mt-2 px-1">
                                <span>Nhạt</span>
                                <span>Đậm</span>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}

// Export color palette for use in other components
export { COLOR_PALETTE }
