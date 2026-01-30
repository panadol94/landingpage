import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth-config"

// GET /api/shortlinks/[id] - Get single shortlink
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const shortlink = await prisma.shortlink.findUnique({
            where: { id: params.id },
            include: {
                _count: {
                    select: { clicks: true }
                }
            }
        })

        if (!shortlink) {
            return NextResponse.json(
                { success: false, error: 'Shortlink not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            data: shortlink
        })
    } catch (error) {
        console.error('Error fetching shortlink:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch shortlink' },
            { status: 500 }
        )
    }
}

// PUT /api/shortlinks/[id] - Update shortlink
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { destination, title, description, isActive, expiresAt } = body

        const updated = await prisma.shortlink.update({
            where: { id: params.id },
            data: {
                destination,
                title,
                description,
                isActive,
                expiresAt: expiresAt ? new Date(expiresAt) : null,
            }
        })

        return NextResponse.json({
            success: true,
            data: updated
        })
    } catch (error) {
        console.error('Error updating shortlink:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update shortlink' },
            { status: 500 }
        )
    }
}

// DELETE /api/shortlinks/[id] - Delete shortlink
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        await prisma.shortlink.delete({
            where: { id: params.id }
        })

        return NextResponse.json({
            success: true,
            message: 'Shortlink deleted'
        })
    } catch (error) {
        console.error('Error deleting shortlink:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to delete shortlink' },
            { status: 500 }
        )
    }
}
