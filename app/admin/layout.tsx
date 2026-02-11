"use client"

import { usePathname } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const isLoginPage = pathname === '/admin/login'

    if (isLoginPage) {
        return <>{children}</>
    }

    return (
        <>
            <AdminSidebar />
            <div className="pt-14">
                {children}
            </div>
        </>
    )
}
