import { NextRequest, NextResponse } from "next/server"
import { unlink } from "fs/promises"
import { join } from "path"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"

// DELETE /api/media/[id] - Delete media file
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

        const { id } = params

        // Find media record
        const media = await prisma.media.findUnique({
            where: { id }
        })

        if (!media) {
            return NextResponse.json(
                { success: false, error: 'Media not found' },
                { status: 404 }
            )
        }

        // Delete physical file
        try {
            const filePath = join(process.cwd(), 'public', 'uploads', media.filename)
            await unlink(filePath)
        } catch (fileError) {
            console.error('Error deleting file:', fileError)
            // Continue with database deletion even if file is missing
        }

        // Delete database record
        await prisma.media.delete({
            where: { id }
        })

        return NextResponse.json({
            success: true,
            message: 'Media deleted successfully'
        })
    } catch (error) {
        console.error('Error deleting media:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to delete media' },
            { status: 500 }
        )
    }
}
