import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth-config"

// GET /api/themes/customize - Get current theme customizations
export async function GET() {
    try {
        const customization = await prisma.themeCustomization.findFirst({
            orderBy: { updatedAt: 'desc' }
        })

        if (!customization) {
            return NextResponse.json({
                success: true,
                data: null
            })
        }

        return NextResponse.json({
            success: true,
            data: customization
        })
    } catch (error) {
        console.error('Error fetching customizations:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch customizations' },
            { status: 500 }
        )
    }
}

// PUT /api/themes/customize - Update theme customizations (admin only)
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
        const {
            activeThemeId,
            customColors,
            customFonts,
            customSpacing,
            customAnimations,
            customEffects
        } = body

        if (!activeThemeId) {
            return NextResponse.json(
                { success: false, error: 'Missing activeThemeId' },
                { status: 400 }
            )
        }

        // Check if customization exists
        const existing = await prisma.themeCustomization.findFirst({
            where: { activeThemeId }
        })

        let customization

        if (existing) {
            // Update existing customization
            customization = await prisma.themeCustomization.update({
                where: { id: existing.id },
                data: {
                    customColors,
                    customFonts,
                    customSpacing,
                    customAnimations,
                    customEffects,
                    updatedBy: session.user.id,
                    updatedAt: new Date()
                }
            })
        } else {
            // Create new customization
            customization = await prisma.themeCustomization.create({
                data: {
                    activeThemeId,
                    customColors,
                    customFonts,
                    customSpacing,
                    customAnimations,
                    customEffects,
                    updatedBy: session.user.id
                }
            })
        }

        return NextResponse.json({
            success: true,
            data: customization
        })
    } catch (error) {
        console.error('Error updating customizations:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update customizations' },
            { status: 500 }
        )
    }
}
