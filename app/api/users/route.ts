import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminRole } from '@/lib/check-admin'
import { hashPassword, validatePassword } from '@/lib/password'

// GET /api/users - List all users
export async function GET() {
    // Check admin authorization
    const adminCheck = await checkAdminRole()
    if (!adminCheck.authorized) {
        return NextResponse.json(
            { success: false, error: adminCheck.error },
            { status: adminCheck.status }
        )
    }

    try {
        // Fetch all users with relevant fields
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                lastLogin: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json({
            success: true,
            data: { users }
        })
    } catch (error) {
        console.error('Error fetching users:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch users' },
            { status: 500 }
        )
    }
}

// POST /api/users - Create new user
export async function POST(request: NextRequest) {
    // Check admin authorization
    const adminCheck = await checkAdminRole()
    if (!adminCheck.authorized) {
        return NextResponse.json(
            { success: false, error: adminCheck.error },
            { status: adminCheck.status }
        )
    }

    try {
        const body = await request.json()
        const { email, password, name, role } = body

        // Validate required fields
        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: 'Email and password are required' },
                { status: 400 }
            )
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, error: 'Invalid email format' },
                { status: 400 }
            )
        }

        // Validate password
        const passwordValidation = validatePassword(password)
        if (!passwordValidation.valid) {
            return NextResponse.json(
                { success: false, error: passwordValidation.error },
                { status: 400 }
            )
        }

        // Validate role
        if (role && role !== 'ADMIN' && role !== 'EDITOR') {
            return NextResponse.json(
                { success: false, error: 'Invalid role. Must be ADMIN or EDITOR' },
                { status: 400 }
            )
        }

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json(
                { success: false, error: 'Email already exists' },
                { status: 409 }
            )
        }

        // Hash password
        const passwordHash = await hashPassword(password)

        // Create user
        const newUser = await prisma.user.create({
            data: {
                email,
                passwordHash,
                name: name || null,
                role: role || 'EDITOR'
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
            data: { user: newUser },
            message: 'User created successfully'
        }, { status: 201 })
    } catch (error) {
        console.error('Error creating user:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to create user' },
            { status: 500 }
        )
    }
}
