import type { NextAuthConfig } from "next-auth"

/**
 * Edge-compatible auth config (no Prisma imports).
 * Used by middleware. The full config with Prisma is in auth-config.ts.
 */
export const authConfig = {
    pages: {
        signIn: "/admin/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isOnAdmin = nextUrl.pathname.startsWith("/admin")
            const isOnLoginPage = nextUrl.pathname === "/admin/login"

            if (isOnAdmin) {
                if (isOnLoginPage) return true // Allow login page always
                if (isLoggedIn) return true    // Allow authenticated users
                return false                   // Redirect to login
            }
            return true // Allow all non-admin pages
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id as string
                token.role = (user as { role: string }).role
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.role = token.role as string
            }
            return session
        }
    },
    providers: [], // Providers are added in auth-config.ts
    session: {
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60, // 7 days
    },
    secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig
