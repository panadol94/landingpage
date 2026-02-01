import { notFound, redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

// Reserved routes that should not be handled as shortlinks
const RESERVED_ROUTES = [
    'admin', 'api', '_next', 'favicon.ico', 'robots.txt', 'sitemap.xml'
]

interface PageProps {
    params: Promise<{ code: string }>
}

/**
 * Shortlink redirect handler
 * Handles /:code routes and redirects to destination URL
 */
export default async function ShortlinkRedirectPage({ params }: PageProps) {
    const { code } = await params

    // Skip reserved routes
    if (RESERVED_ROUTES.includes(code.toLowerCase())) {
        notFound()
    }

    // Find shortlink in database
    const shortlink = await prisma.shortlink.findUnique({
        where: { code }
    })

    if (!shortlink) {
        notFound()
    }

    // Check if shortlink is active
    if (!shortlink.isActive) {
        notFound()
    }

    // Check if shortlink is expired
    if (shortlink.expiresAt && new Date(shortlink.expiresAt) < new Date()) {
        notFound()
    }

    // Track the click asynchronously
    try {
        const headersList = await headers()
        const userAgent = headersList.get('user-agent') || ''
        const referer = headersList.get('referer') || ''
        const ip = headersList.get('x-forwarded-for')?.split(',')[0] ||
            headersList.get('x-real-ip') ||
            'unknown'

        // Parse device info from user agent
        const isMobile = /mobile|android|iphone|ipad/i.test(userAgent)
        const isTablet = /tablet|ipad/i.test(userAgent)
        const deviceType = isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop'

        // Parse browser from user agent
        let browser = 'unknown'
        if (/chrome/i.test(userAgent) && !/edge|edg/i.test(userAgent)) {
            browser = 'Chrome'
        } else if (/firefox/i.test(userAgent)) {
            browser = 'Firefox'
        } else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) {
            browser = 'Safari'
        } else if (/edge|edg/i.test(userAgent)) {
            browser = 'Edge'
        } else if (/opera|opr/i.test(userAgent)) {
            browser = 'Opera'
        }

        // Record click (fire and forget - don't block redirect)
        prisma.shortlinkClick.create({
            data: {
                shortlinkId: shortlink.id,
                ipAddress: ip.substring(0, 45), // Limit IP length
                userAgent: userAgent.substring(0, 500), // Limit UA length
                referrer: referer.substring(0, 500), // Note: schema uses 'referrer'
                deviceType,
                browser
                // os field not in schema - would need migration to add
            }
        }).catch(err => {
            console.error('Failed to record click:', err)
        })
    } catch (error) {
        console.error('Error tracking click:', error)
        // Don't fail redirect if tracking fails
    }

    // Redirect to destination
    redirect(shortlink.destination)
}

/**
 * Generate metadata for SEO (won't be seen since we redirect)
 */
export async function generateMetadata({ params }: PageProps) {
    const { code } = await params

    const shortlink = await prisma.shortlink.findUnique({
        where: { code },
        select: { title: true, description: true }
    })

    return {
        title: shortlink?.title || 'Redirecting...',
        description: shortlink?.description || 'Shortlink redirect',
        robots: 'noindex, nofollow' // Don't index redirect pages
    }
}
