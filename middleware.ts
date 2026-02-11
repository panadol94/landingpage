import { auth } from "@/lib/auth-config"
import { NextResponse } from "next/server"

export default auth((req) => {
    const { pathname } = req.nextUrl

    // Skip login page — it's the entry point
    if (pathname === "/admin/login") {
        return NextResponse.next()
    }

    // Protect all /admin/* routes
    if (pathname.startsWith("/admin")) {
        if (!req.auth) {
            const loginUrl = new URL("/admin/login", req.url)
            return NextResponse.redirect(loginUrl)
        }
    }

    return NextResponse.next()
})

export const config = {
    matcher: ["/admin/:path*"]
}
