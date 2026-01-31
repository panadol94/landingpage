import bcrypt from 'bcrypt'

/**
 * Hash a plain text password using bcrypt
 * @param password Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 12 // Increased from 10 for better security
    return await bcrypt.hash(password, saltRounds)
}

/**
 * Compare a plain text password with a hashed password
 * @param password Plain text password
 * @param hash Hashed password from database
 * @returns True if password matches
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash)
}

/**
 * Validate password strength with comprehensive rules
 * @param password Plain text password
 * @returns Validation result with error message if invalid
 */
export function validatePassword(password: string): { valid: boolean; error?: string } {
    if (!password || password.length < 8) {
        return { valid: false, error: 'Password must be at least 8 characters long' }
    }

    if (!/[A-Z]/.test(password)) {
        return { valid: false, error: 'Password must contain an uppercase letter' }
    }

    if (!/[a-z]/.test(password)) {
        return { valid: false, error: 'Password must contain a lowercase letter' }
    }

    if (!/[0-9]/.test(password)) {
        return { valid: false, error: 'Password must contain a number' }
    }

    if (!/[!@#$%^&*]/.test(password)) {
        return { valid: false, error: 'Password must contain a special character (!@#$%^&*)' }
    }

    return { valid: true }
}

/**
 * Alias for validatePassword for backward compatibility
 * @deprecated Use validatePassword instead
 */
export function isStrongPassword(password: string): { valid: boolean; message?: string } {
    const result = validatePassword(password)
    return {
        valid: result.valid,
        message: result.error
    }
}
