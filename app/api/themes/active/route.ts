import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth-config"

// GET /api/themes/active - Get currently active theme with customizations
export async function GET() {
    try {
        // Get active theme
        const activeTheme = await prisma.theme.findFirst({
            where: { isActive: true }
        })

        if (!activeTheme) {
            return NextResponse.json(
                { success: false, error: 'No active theme found' },
                { status: 404 }
            )
        }

        // Get customizations
        const customization = await prisma.themeCustomization.findFirst({
            where: { activeThemeId: activeTheme.id }
        })

        return NextResponse.json({
            success: true,
            data: {
                theme: activeTheme,
                customization: customization || null
            }
        })
    } catch (error) {
        console.error('Error fetching active theme:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch active theme' },
            { status: 500 }
        )
    }
}

// PUT /api/themes/active - Set active theme (admin only)
export async function PUT(request: NextRequest) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { themeId } = body

        if (!themeId) {
            return NextResponse.json(
                { success: false, error: 'Missing themeId' },
                { status: 400 }
            )
        }

        // Verify theme exists
        const theme = await prisma.theme.findUnique({
            where: { id: themeId }
        })

        if (!theme) {
            return NextResponse.json(
                { success: false, error: 'Theme not found' },
                { status: 404 }
            )
        }

        // Deactivate all themes
        await prisma.theme.updateMany({
            data: { isActive: false }
        })

        // Activate selected theme
        const updatedTheme = await prisma.theme.update({
            where: { id: themeId },
            data: { isActive: true }
        })

        return NextResponse.json({
            success: true,
            data: updatedTheme
        })
    } catch (error) {
        console.error('Error setting active theme:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to set active theme' },
            { status: 500 }
        )
    }
}
