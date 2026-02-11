import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth-config"

// GET /api/content - Get all landing page content
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const section = searchParams.get('section')
        const language = searchParams.get('language') || 'ms'

        const where = language ? { language } : undefined
        const sectionFilter = section ? { section } : {}

        const content = await prisma.landingContent.findMany({
            where: {
                ...where,
                ...sectionFilter
            },
            orderBy: [
                { section: 'asc' },
                { key: 'asc' }
            ]
        })

        // Group by section for easier consumption
        const grouped = content.reduce((acc, item) => {
            if (!acc[item.section]) {
                acc[item.section] = {}
            }
            acc[item.section][item.key] = item.value
            return acc
        }, {} as Record<string, Record<string, string>>)

        return NextResponse.json({
            success: true,
            data: grouped,
            raw: content
        })
    } catch (error) {
        console.error('Error fetching content:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch content' },
            { status: 500 }
        )
    }
}

// PUT /api/content - Update content (admin only)
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
        const { section, key, value, language = 'ms' } = body

        if (!section || !key || value === undefined || value === null) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            )
        }

        const updated = await prisma.landingContent.upsert({
            where: {
                section_key_language: {
                    section,
                    key,
                    language
                }
            },
            update: {
                value,
                updatedBy: session.user.id,
                updatedAt: new Date()
            },
            create: {
                section,
                key,
                value,
                language,
                updatedBy: session.user.id
            }
        })

        return NextResponse.json({
            success: true,
            data: updated
        })
    } catch (error) {
        console.error('Error updating content:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update content' },
            { status: 500 }
        )
    }
}
