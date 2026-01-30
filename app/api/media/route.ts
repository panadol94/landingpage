import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"

// GET /api/media - List all media files
export async function GET(request: NextRequest) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Parse query parameters
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
        const search = searchParams.get('search') || ''

        // Build where clause
        const where = search
            ? {
                filename: {
                    contains: search,
                    mode: 'insensitive' as const
                }
            }
            : {}

        // Get total count
        const total = await prisma.media.count({ where })

        // Get paginated media
        const media = await prisma.media.findMany({
            where,
            take: limit,
            skip: (page - 1) * limit,
            orderBy: {
                uploadedAt: 'desc'
            },
            include: {
                uploader: {
                    select: {
                        name: true,
                        email: true,
                    }
                }
            }
        })

        return NextResponse.json({
            success: true,
            data: {
                media,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error('Error fetching media:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch media' },
            { status: 500 }
        )
    }
}
