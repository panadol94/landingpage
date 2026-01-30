import { NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"

// POST /api/media/upload - Upload image files
export async function POST(request: NextRequest) {
    try {
        // Authenticate user
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Parse form data
        const formData = await request.formData()
        const file = formData.get('file') as File | null

        if (!file) {
            return NextResponse.json(
                { success: false, error: 'No file provided' },
                { status: 400 }
            )
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { success: false, error: 'Invalid file type. Allowed: JPG, PNG, GIF, WebP' },
                { status: 400 }
            )
        }

        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024 // 5MB in bytes
        if (file.size > maxSize) {
            return NextResponse.json(
                { success: false, error: 'File too large. Maximum size: 5MB' },
                { status: 400 }
            )
        }

        // Sanitize and create unique filename
        const timestamp = Date.now()
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
        const filename = `${timestamp}-${originalName}`

        // Convert file to buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Save file to public/uploads directory
        const uploadPath = join(process.cwd(), 'public', 'uploads', filename)
        await writeFile(uploadPath, buffer)

        // Create database record
        const media = await prisma.media.create({
            data: {
                filename: filename,
                url: `/uploads/${filename}`,
                fileSize: file.size,
                mimeType: file.type,
                uploadedBy: session.user.id,
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
                id: media.id,
                filename: media.filename,
                url: media.url,
                fileSize: media.fileSize,
                mimeType: media.mimeType,
                uploadedAt: media.uploadedAt,
                uploader: media.uploader,
            }
        })
    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to upload file' },
            { status: 500 }
        )
    }
}
