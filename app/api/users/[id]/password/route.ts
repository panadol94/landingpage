import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminRole, getCurrentUser } from '@/lib/check-admin'
import { hashPassword, validatePassword } from '@/lib/password'

// PATCH /api/users/[id]/password - Change user password
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()
        const { newPassword } = body

        // Validate password
        if (!newPassword) {
            return NextResponse.json(
                { success: false, error: 'New password is required' },
                { status: 400 }
            )
        }

        const passwordValidation = validatePassword(newPassword)
        if (!passwordValidation.valid) {
            return NextResponse.json(
                { success: false, error: passwordValidation.error },
                { status: 400 }
            )
        }

        // Check if user is admin OR changing their own password
        const currentUser = await getCurrentUser()
        if (!currentUser) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const isAdmin = currentUser.role === 'ADMIN'
        const isOwn = currentUser.id === id

        if (!isAdmin && !isOwn) {
            return NextResponse.json(
                { success: false, error: 'You can only change your own password' },
                { status: 403 }
            )
        }

        // Check if target user exists
        const targetUser = await prisma.user.findUnique({
            where: { id }
        })

        if (!targetUser) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            )
        }

        // Hash new password
        const passwordHash = await hashPassword(newPassword)

        // Update password
        await prisma.user.update({
            where: { id },
            data: { passwordHash }
        })

        return NextResponse.json({
            success: true,
            message: 'Password changed successfully'
        })
    } catch (error) {
        console.error('Error changing password:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to change password' },
            { status: 500 }
        )
    }
}
