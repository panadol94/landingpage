import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString('ms-MY', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

/**
 * Generate random alphanumeric string
 */
export function generateRandomString(length: number = 8): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}

/**
 * Validate shortlink code format
 */
export function isValidShortlinkCode(code: string): boolean {
    // Only allow alphanumeric and hyphens, 2-50 characters
    return /^[a-zA-Z0-9-]{2,50}$/.test(code)
}

/**
 * Reserved routes that cannot be used as shortlink codes
 */
export const RESERVED_ROUTES = [
    'admin', 'api', 'login', 'logout', 'dashboard',
    '_next', 'static', 'public', 'about', 'contact',
    'terms', 'privacy', 'help', 'settings', 'signup',
    'register', 'signin', 'profile', 'account'
]

/**
 * Check if shortlink code is reserved
 */
export function isReservedRoute(code: string): boolean {
    return RESERVED_ROUTES.includes(code.toLowerCase())
}
