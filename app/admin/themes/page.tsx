"use client"

import { useEffect, useState } from "react"
import { Palette, Check, Settings2, RotateCcw, Save, Eye } from "lucide-react"
import toast from "react-hot-toast"

interface Theme {
    id: string
    name: string
    displayName: string
    description: string
    previewUrl: string | null
    cssVars: Record<string, string>
    animations: Record<string, unknown> | null
    typography: Record<string, unknown> | null
    isActive: boolean
}


export default function ThemeManagementPage() {
    const [themes, setThemes] = useState<Theme[]>([])
    const [activeTheme, setActiveTheme] = useState<Theme | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [showCustomizer, setShowCustomizer] = useState(false)

    // Customization state
    const [customColors, setCustomColors] = useState<Record<string, string>>({})
    const [customFonts, setCustomFonts] = useState<Record<string, string>>({})

    useEffect(() => {
        fetchThemes()
        fetchActiveTheme()
    }, [])

    const fetchThemes = async () => {
        try {
            const res = await fetch('/api/themes')
            const data = await res.json()
            if (data.success) {
                setThemes(data.data)
            }
        } catch (error) {
            console.error('Error fetching themes:', error)
            toast.error('❌ Failed to load themes')
        } finally {
            setLoading(false)
        }
    }

    const fetchActiveTheme = async () => {
        try {
            const res = await fetch('/api/themes/active')
            const data = await res.json()
            if (data.success) {
                setActiveTheme(data.data.theme)
                // setCustomization(data.data.customization) // Removed unused variable assignment

                // Initialize customization state
                if (data.data.customization) {
                    setCustomColors(data.data.customization.customColors || {})
                    setCustomFonts(data.data.customization.customFonts || {})
                }
            }
        } catch (error) {
            console.error('Error fetching active theme:', error)
        }
    }

    const handleSetActiveTheme = async (themeId: string) => {
        setSaving(true)
        try {
            const res = await fetch('/api/themes/active', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ themeId })
            })

            if (res.ok) {
                toast.success('✅ Theme activated!')
                fetchActiveTheme()
                fetchThemes()
            } else {
                toast.error('❌ Failed to activate theme')
            }
        } catch (error) {
            console.error('Error:', error)
            toast.error('❌ Error activating theme')
        } finally {
            setSaving(false)
        }
    }

    const handleSaveCustomization = async () => {
        if (!activeTheme) return

        setSaving(true)
        try {
            const res = await fetch('/api/themes/customize', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    activeThemeId: activeTheme.id,
                    customColors,
                    customFonts,
                    customSpacing: null,
                    customAnimations: null,
                    customEffects: null
                })
            })

            if (res.ok) {
                toast.success('✅ Customization saved!')
                fetchActiveTheme()
            } else {
                toast.error('❌ Failed to save customization')
            }
        } catch (error) {
            console.error('Error:', error)
            toast.error('❌ Error saving customization')
        } finally {
            setSaving(false)
        }
    }

    const getThemePreviewStyle = (theme: Theme) => {
        const cssVars = theme.cssVars as Record<string, string>
        return {
            background: `linear-gradient(135deg, ${cssVars['--color-bg-gradient-start'] || '#000'}, ${cssVars['--color-bg-gradient-end'] || '#111'})`,
            borderColor: cssVars['--color-primary'] || '#00f5ff',
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading themes...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Palette className="w-8 h-8 text-cyan-400" />
                        <h1 className="text-3xl font-bold text-white">🎨 Theme Settings</h1>
                    </div>
                    <p className="text-gray-400">Pilih tema premium untuk landing page anda</p>
                </div>

                {/* Theme Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {themes.map((theme) => (
                        <div
                            key={theme.id}
                            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all"
                        >
                            {/* Theme Preview */}
                            <div
                                className="h-32 rounded-lg mb-4 border-2 relative overflow-hidden"
                                style={getThemePreviewStyle(theme)}
                            >
                                {theme.isActive && (
                                    <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                        <Check className="w-3 h-3" />
                                        Active
                                    </div>
                                )}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold mb-1" style={{ color: (theme.cssVars as Record<string, string>)['--color-primary'] }}>
                                            {theme.displayName}
                                        </div>
                                        <div className="text-sm opacity-80" style={{ color: (theme.cssVars as Record<string, string>)['--color-text-secondary'] }}>
                                            Preview
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Theme Info */}
                            <h3 className="text-xl font-bold text-white mb-2">{theme.displayName}</h3>
                            <p className="text-gray-400 text-sm mb-4">{theme.description}</p>

                            {/* Actions */}
                            <div className="flex gap-2">
                                {!theme.isActive && (
                                    <button
                                        onClick={() => handleSetActiveTheme(theme.id)}
                                        disabled={saving}
                                        className="flex-1 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 text-white rounded-lg transition-colors font-semibold"
                                    >
                                        Set Active
                                    </button>
                                )}
                                {theme.isActive && (
                                    <button
                                        onClick={() => setShowCustomizer(!showCustomizer)}
                                        className="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors font-semibold flex items-center justify-center gap-2"
                                    >
                                        <Settings2 className="w-4 h-4" />
                                        Customize
                                    </button>
                                )}
                                <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                                    <Eye className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Customization Panel */}
                {showCustomizer && activeTheme && (
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <Settings2 className="w-6 h-6 text-purple-400" />
                                <h2 className="text-2xl font-bold text-white">Customize {activeTheme.displayName}</h2>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setCustomColors({})
                                        setCustomFonts({})
                                        toast.success('Reset to defaults')
                                    }}
                                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    Reset
                                </button>
                                <button
                                    onClick={handleSaveCustomization}
                                    disabled={saving}
                                    className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2 font-semibold"
                                >
                                    <Save className="w-4 h-4" />
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Color Customization */}
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4">🎨 Colors</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Primary Color</label>
                                        <input
                                            type="color"
                                            value={customColors.primary || (activeTheme.cssVars as Record<string, string>)['--color-primary']}
                                            onChange={(e) => setCustomColors({ ...customColors, primary: e.target.value })}
                                            className="w-full h-12 rounded-lg cursor-pointer"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Secondary Color</label>
                                        <input
                                            type="color"
                                            value={customColors.secondary || (activeTheme.cssVars as Record<string, string>)['--color-secondary']}
                                            onChange={(e) => setCustomColors({ ...customColors, secondary: e.target.value })}
                                            className="w-full h-12 rounded-lg cursor-pointer"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Accent Color</label>
                                        <input
                                            type="color"
                                            value={customColors.accent || (activeTheme.cssVars as Record<string, string>)['--color-accent']}
                                            onChange={(e) => setCustomColors({ ...customColors, accent: e.target.value })}
                                            className="w-full h-12 rounded-lg cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Typography Customization */}
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4">✍️ Typography</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Heading Font</label>
                                        <select
                                            value={customFonts.heading || ''}
                                            onChange={(e) => setCustomFonts({ ...customFonts, heading: e.target.value })}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                        >
                                            <option value="">Default</option>
                                            <option value="'Poppins', sans-serif">Poppins</option>
                                            <option value="'Montserrat', sans-serif">Montserrat</option>
                                            <option value="'Playfair Display', serif">Playfair Display</option>
                                            <option value="'Orbitron', sans-serif">Orbitron</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Body Font</label>
                                        <select
                                            value={customFonts.body || ''}
                                            onChange={(e) => setCustomFonts({ ...customFonts, body: e.target.value })}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                        >
                                            <option value="">Default</option>
                                            <option value="'Inter', sans-serif">Inter</option>
                                            <option value="'Roboto', sans-serif">Roboto</option>
                                            <option value="'Lato', sans-serif">Lato</option>
                                            <option value="'Open Sans', sans-serif">Open Sans</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                            <p className="text-cyan-400 text-sm">
                                💡 <strong>Tip:</strong> Customizations will be applied to the landing page immediately after saving.
                                You can reset to theme defaults anytime.
                            </p>
                        </div>
                    </div>
                )}

                {/* Back Button */}
                <div>
                    <a
                        href="/admin/dashboard"
                        className="inline-block px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                    >
                        ← Kembali ke Dashboard
                    </a>
                </div>
            </div>
        </div>
    )
}
