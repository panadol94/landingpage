import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/themes - Get all available themes
export async function GET() {
    try {
        const themes = await prisma.theme.findMany({
            orderBy: { createdAt: 'asc' }
        })

        return NextResponse.json({
            success: true,
            data: themes
        })
    } catch (error) {
        console.error('Error fetching themes:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch themes' },
            { status: 500 }
        )
    }
}

// POST /api/themes - Create a new theme (admin only)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            name,
            displayName,
            description,
            previewUrl,
            cssVars,
            animations,
            typography,
            isActive
        } = body

        if (!name || !displayName || !cssVars) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // If setting as active, deactivate others
        if (isActive) {
            await prisma.theme.updateMany({
                data: { isActive: false }
            })
        }

        const theme = await prisma.theme.create({
            data: {
                name,
                displayName,
                description,
                previewUrl,
                cssVars,
                animations,
                typography,
                isActive: isActive || false
            }
        })

        return NextResponse.json({
            success: true,
            data: theme
        })
    } catch (error) {
        console.error('Error creating theme:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to create theme' },
            { status: 500 }
        )
    }
}
