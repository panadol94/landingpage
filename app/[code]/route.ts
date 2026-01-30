import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getClientIP, getUserAgent, getReferrer, getDeviceType, getBrowser } from "@/lib/analytics"

// Dynamic route handler for shortlink redirects
// Route: /[code]
export async function GET(
    request: Request,
    { params }: { params: Promise<{ code: string }> }
) {
    const { code } = await params

    try {
        // Find shortlink
        const shortlink = await prisma.shortlink.findUnique({
            where: { code }
        })

        // If not found, redirect to home
        if (!shortlink) {
            redirect('/')
        }

        // Check if expired
        if (shortlink.expiresAt && new Date() > shortlink.expiresAt) {
            redirect('/')
        }

        // Check if active
        if (!shortlink.isActive) {
            redirect('/')
        }

        // Track click (async, don't wait)
        const userAgent = await getUserAgent()
        const ipAddress = await getClientIP()
        const referrer = await getReferrer()

        // Record click in background
        prisma.shortlinkClick.create({
            data: {
                shortlinkId: shortlink.id,
                ipAddress,
                userAgent,
                referrer,
                deviceType: getDeviceType(userAgent),
                browser: getBrowser(userAgent),
                // TODO: Add geolocation (country, city) via IP lookup service
            }
        }).catch(err => {
            console.error('Error tracking click:', err)
            // Don't fail redirect if tracking fails
        })

        // Redirect to destination
        redirect(shortlink.destination)
    } catch (error) {
        console.error('Error in shortlink redirect:', error)
        redirect('/')
    }
}
