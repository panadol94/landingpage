import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    // Skip login page — it's the entry point
    if (pathname === "/admin/login") {
        return NextResponse.next()
    }

    // Protect all /admin/* routes
    if (pathname.startsWith("/admin")) {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

        if (!token) {
            const loginUrl = new URL("/admin/login", req.url)
            return NextResponse.redirect(loginUrl)
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/admin/:path*"]
}
