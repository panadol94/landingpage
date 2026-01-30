import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminRole } from '@/lib/check-admin'

// GET /api/users/[id] - Get single user
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    // Check admin authorization
    const adminCheck = await checkAdminRole()
    if (!adminCheck.authorized) {
        return NextResponse.json(
            { success: false, error: adminCheck.error },
            { status: adminCheck.status }
        )
    }

    try {
        const { id } = await params

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                lastLogin: true,
            }
        })

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            data: { user }
        })
    } catch (error) {
        console.error('Error fetching user:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch user' },
            { status: 500 }
        )
    }
}

// PATCH /api/users/[id] - Update user
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    // Check admin authorization
    const adminCheck = await checkAdminRole()
    if (!adminCheck.authorized) {
        return NextResponse.json(
            { success: false, error: adminCheck.error },
            { status: adminCheck.status }
        )
    }

    try {
        const { id } = await params
        const body = await request.json()
        const { name, role } = body

        // Validate role if provided
        if (role && role !== 'ADMIN' && role !== 'EDITOR') {
            return NextResponse.json(
                { success: false, error: 'Invalid role. Must be ADMIN or EDITOR' },
                { status: 400 }
            )
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id }
        })

        if (!existingUser) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            )
        }

        // Safety check: Prevent demoting last admin
        if (role === 'EDITOR' && existingUser.role === 'ADMIN') {
            const adminCount = await prisma.user.count({
                where: { role: 'ADMIN' }
            })

            if (adminCount <= 1) {
                return NextResponse.json(
                    { success: false, error: 'Cannot change role of last admin' },
                    { status: 403 }
                )
            }
        }

        // Update user
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                ...(name !== undefined && { name }),
                ...(role && { role })
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                lastLogin: true,
            }
        })

        return NextResponse.json({
            success: true,
            data: { user: updatedUser },
            message: 'User updated successfully'
        })
    } catch (error) {
        console.error('Error updating user:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update user' },
            { status: 500 }
        )
    }
}

// DELETE /api/users/[id] - Delete user
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    // Check admin authorization
    const adminCheck = await checkAdminRole()
    if (!adminCheck.authorized) {
        return NextResponse.json(
            { success: false, error: adminCheck.error },
            { status: adminCheck.status }
        )
    }

    try {
        const { id } = await params

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { id }
        })

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            )
        }

        // Prevent self-deletion
        if (user.id === adminCheck.user?.id) {
            return NextResponse.json(
                { success: false, error: 'Cannot delete yourself' },
                { status: 403 }
            )
        }

        // Prevent deleting last admin
        if (user.role === 'ADMIN') {
            const adminCount = await prisma.user.count({
                where: { role: 'ADMIN' }
            })

            if (adminCount <= 1) {
                return NextResponse.json(
                    { success: false, error: 'Cannot delete last admin' },
                    { status: 403 }
                )
            }
        }

        // Delete user
        await prisma.user.delete({
            where: { id }
        })

        return NextResponse.json({
            success: true,
            message: 'User deleted successfully'
        })
    } catch (error) {
        console.error('Error deleting user:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to delete user' },
            { status: 500 }
        )
    }
}
