"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Link2,
    FileText,
    Image,
    BarChart3,
    Palette,
    Users,
    LogOut
} from 'lucide-react'
import { signOut } from 'next-auth/react'

const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/shortlinks', label: 'Shortlinks', icon: Link2 },
    { href: '/admin/content', label: 'Content', icon: FileText },
    { href: '/admin/media', label: 'Media', icon: Image },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/admin/themes', label: 'Themes', icon: Palette },
    { href: '/admin/users', label: 'Users', icon: Users },
]

export default function AdminSidebar() {
    const pathname = usePathname()

    return (
        <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-b border-white/10">
            <div className="container mx-auto max-w-7xl px-4">
                <div className="flex items-center justify-between h-14">
                    {/* Logo */}
                    <Link href="/admin/dashboard" className="text-lg font-bold text-white flex items-center gap-2">
                        ⚡ Masuk10
                    </Link>

                    {/* Nav Items */}
                    <div className="flex items-center gap-1 overflow-x-auto">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            const Icon = item.icon
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors whitespace-nowrap ${isActive
                                            ? 'bg-cyan-500/20 text-cyan-400'
                                            : 'text-gray-400 hover:text-white hover:bg-white/10'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="hidden md:inline">{item.label}</span>
                                </Link>
                            )
                        })}
                    </div>

                    {/* Logout */}
                    <button
                        onClick={() => signOut({ callbackUrl: '/admin/login' })}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-gray-400 hover:text-red-400 hover:bg-white/10 rounded-lg text-sm transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden md:inline">Logout</span>
                    </button>
                </div>
            </div>
        </nav>
    )
}
