import { auth } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'

/**
 * Check if the current session user has ADMIN role
 * @returns Authorization result with user data if authorized
 */
export async function checkAdminRole() {
    const session = await auth()

    if (!session?.user?.id) {
        return {
            authorized: false,
            error: 'Unauthorized - Please login',
            status: 401
        }
    }

    // Fetch user with role from database
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            email: true,
            role: true,
            name: true
        }
    })

    if (!user) {
        return {
            authorized: false,
            error: 'User not found',
            status: 404
        }
    }

    if (user.role !== 'ADMIN') {
        return {
            authorized: false,
            error: 'Admin access required',
            status: 403
        }
    }

    return {
        authorized: true,
        user
    }
}

/**
 * Get current session user with role
 * @returns User data if authenticated
 */
export async function getCurrentUser() {
    const session = await auth()

    if (!session?.user?.id) {
        return null
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            email: true,
            role: true,
            name: true
        }
    })

    return user
}
