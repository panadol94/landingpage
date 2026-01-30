import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth-config"
import { isValidShortlinkCode, isReservedRoute } from "@/lib/utils"

// GET /api/shortlinks - List all shortlinks (admin only)
export async function GET(request: NextRequest) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const skip = (page - 1) * limit

        const [shortlinks, total] = await Promise.all([
            prisma.shortlink.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    _count: {
                        select: { clicks: true }
                    }
                }
            }),
            prisma.shortlink.count()
        ])

        return NextResponse.json({
            success: true,
            data: shortlinks,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error('Error fetching shortlinks:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch shortlinks' },
            { status: 500 }
        )
    }
}

// POST /api/shortlinks - Create new shortlink (admin only)
export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { code, destination, title, description, expiresAt } = body

        // Validation
        if (!code || !destination) {
            return NextResponse.json(
                { success: false, error: 'Code and destination are required' },
                { status: 400 }
            )
        }

        if (!isValidShortlinkCode(code)) {
            return NextResponse.json(
                { success: false, error: 'Invalid code format. Use alphanumeric and hyphens only (2-50 chars)' },
                { status: 400 }
            )
        }

        if (isReservedRoute(code)) {
            return NextResponse.json(
                { success: false, error: 'This code is reserved and cannot be used' },
                { status: 400 }
            )
        }

        // Check if code already exists
        const existing = await prisma.shortlink.findUnique({
            where: { code }
        })

        if (existing) {
            return NextResponse.json(
                { success: false, error: 'Code already exists' },
                { status: 409 }
            )
        }

        // Create shortlink
        const shortlink = await prisma.shortlink.create({
            data: {
                code,
                destination,
                title,
                description,
                expiresAt: expiresAt ? new Date(expiresAt) : null,
                createdBy: session.user.id
            }
        })

        return NextResponse.json({
            success: true,
            data: shortlink
        }, { status: 201 })
    } catch (error) {
        console.error('Error creating shortlink:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to create shortlink' },
            { status: 500 }
        )
    }
}
