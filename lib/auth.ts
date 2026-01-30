import bcrypt from 'bcryptjs'

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 12
    return bcrypt.hash(password, saltRounds)
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
    password: string,
    hashedPassword: string
): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
}

/**
 * Validate password strength
 */
export function isStrongPassword(password: string): {
    valid: boolean
    message?: string
} {
    if (password.length < 8) {
        return { valid: false, message: 'Password must be at least 8 characters' }
    }

    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: 'Password must contain uppercase letter' }
    }

    if (!/[a-z]/.test(password)) {
        return { valid: false, message: 'Password must contain lowercase letter' }
    }

    if (!/[0-9]/.test(password)) {
        return { valid: false, message: 'Password must contain a number' }
    }

    if (!/[!@#$%^&*]/.test(password)) {
        return { valid: false, message: 'Password must contain special character (!@#$%^&*)' }
    }

    return { valid: true }
}
