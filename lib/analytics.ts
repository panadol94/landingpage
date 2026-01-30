import { headers } from "next/headers"

/**
 * Parse User-Agent to detect device type
 */
export function getDeviceType(userAgent: string): string {
    const ua = userAgent.toLowerCase()

    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return 'tablet'
    }

    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return 'mobile'
    }

    return 'desktop'
}

/**
 * Parse User-Agent to detect browser
 */
export function getBrowser(userAgent: string): string {
    if (userAgent.includes('Firefox')) return 'Firefox'
    if (userAgent.includes('Edg')) return 'Edge'
    if (userAgent.includes('Chrome')) return 'Chrome'
    if (userAgent.includes('Safari')) return 'Safari'
    if (userAgent.includes('Opera')) return 'Opera'
    return 'Other'
}

/**
 * Get client IP address from request headers
 */
export async function getClientIP(): Promise<string | null> {
    const headersList = await headers()

    // Check various headers for IP address
    const forwardedFor = headersList.get('x-forwarded-for')
    if (forwardedFor) {
        return forwardedFor.split(',')[0].trim()
    }

    const realIP = headersList.get('x-real-ip')
    if (realIP) {
        return realIP
    }

    return null
}

/**
 * Get referrer from request headers
 */
export async function getReferrer(): Promise<string | null> {
    const headersList = await headers()
    return headersList.get('referer')
}

/**
 * Get user agent from request headers
 */
export async function getUserAgent(): Promise<string> {
    const headersList = await headers()
    return headersList.get('user-agent') || 'Unknown'
}
