"use client"

import { useEffect, useState, useCallback } from "react"

interface ThemeData {
    theme: {
        id: string
        name: string
        displayName: string
        cssVars: Record<string, string>
        animations: Record<string, unknown> | null
        typography: Record<string, unknown> | null
    }
    customization: {
        customColors: Record<string, string> | null
        customFonts: Record<string, string> | null
    } | null
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [themeLoaded, setThemeLoaded] = useState(false)

    const applyTheme = useCallback((themeData: ThemeData) => {
        const { theme, customization } = themeData

        // Apply theme CSS variables
        const root = document.documentElement

        // Apply base theme CSS vars
        Object.entries(theme.cssVars).forEach(([key, value]) => {
            root.style.setProperty(key, value)
        })

        // Apply customizations if they exist
        if (customization?.customColors) {
            Object.entries(customization.customColors).forEach(([key, value]) => {
                root.style.setProperty(`--color-${key}`, value)
            })
        }

        if (customization?.customFonts) {
            if (customization.customFonts.heading) {
                root.style.setProperty('--font-heading', customization.customFonts.heading)
            }
            if (customization.customFonts.body) {
                root.style.setProperty('--font-body', customization.customFonts.body)
            }
        }

        // Apply typography if available
        if (theme.typography) {
            const typography = theme.typography as Record<string, string>
            Object.entries(typography).forEach(([key, value]) => {
                root.style.setProperty(`--typography-${key}`, value)
            })
        }

        // Store theme name as data attribute for debugging
        root.setAttribute('data-theme', theme.name)

        console.log(`✅ Theme applied: ${theme.displayName}`)
    }, [])

    const loadActiveTheme = useCallback(async () => {
        try {
            const res = await fetch('/api/themes/active')
            const data = await res.json()

            if (data.success) {
                applyTheme(data.data)
            } else {
                console.warn('No active theme found, using defaults')
            }
        } catch (error) {
            console.error('Error loading theme:', error)
        } finally {
            setThemeLoaded(true)
        }
    }, [applyTheme])

    useEffect(() => {
        loadActiveTheme()
    }, [loadActiveTheme])

    // Show loading state briefly to prevent flash of unstyled content
    if (!themeLoaded) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        )
    }

    return <>{children}</>
}
