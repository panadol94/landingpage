"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface StatsData {
    totalShortlinks: number
    activeShortlinks: number
    totalClicks: number
    clicksToday: number
    clicksThisWeek: number
    clicksThisMonth: number
}

export default function AdminDashboardPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState<StatsData | null>(null)
    const [user, setUser] = useState<{ name?: string; email?: string } | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        checkAuth()
        fetchStats()
    }, [])

    const checkAuth = async () => {
        try {
            const res = await fetch('/api/auth/session')
            if (!res.ok) {
                router.push('/admin/login')
                return
            }
            const session = await res.json()
            setUser(session.user)
        } catch (err) {
            router.push('/admin/login')
        }
    }

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/analytics/stats')
            const data = await res.json()

            if (data.success) {
                setStats(data.data)
            } else {
                setError('Failed to load statistics')
            }
        } catch (err) {
            setError('Error fetching stats')
            console.error('Stats error:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/signout', { method: 'POST' })
            router.push('/admin/login')
        } catch (err) {
            console.error('Logout error:', err)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Dashboard Admin
                        </h1>
                        <p className="text-gray-400">
                            Selamat datang, {user?.name || user?.email || 'Admin'}
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                    >
                        Logout
                    </button>
                </div>

                {/* Error State */}
                {error && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400">
                        {error}
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                        <div className="text-cyan-400 font-semibold mb-2">Total Shortlinks</div>
                        <div className="text-3xl font-bold text-white">
                            {stats?.totalShortlinks?.toLocaleString() || 0}
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                            {stats?.activeShortlinks || 0} active
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                        <div className="text-emerald-400 font-semibold mb-2">Total Clicks</div>
                        <div className="text-3xl font-bold text-white">
                            {stats?.totalClicks?.toLocaleString() || 0}
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                            {stats?.clicksThisWeek?.toLocaleString() || 0} this week
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                        <div className="text-purple-400 font-semibold mb-2">Clicks Today</div>
                        <div className="text-3xl font-bold text-white">
                            {stats?.clicksToday?.toLocaleString() || 0}
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                            {stats?.clicksThisMonth?.toLocaleString() || 0} this month
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <a href="/admin/content" className="block p-4 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 rounded-lg text-left transition-colors group">
                            <div className="text-cyan-400 font-semibold mb-1">📝 Edit Landing Page</div>
                            <div className="text-sm text-gray-400">Update content, images, and text</div>
                        </a>

                        <a href="/admin/shortlinks" className="block p-4 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg text-left transition-colors group">
                            <div className="text-emerald-400 font-semibold mb-1">🔗 Manage Shortlinks</div>
                            <div className="text-sm text-gray-400">Create and track shortlinks</div>
                        </a>

                        <a href="/admin/analytics" className="block p-4 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-lg text-left transition-colors group">
                            <div className="text-purple-400 font-semibold mb-1">📊 View Analytics</div>
                            <div className="text-sm text-gray-400">Track clicks and performance</div>
                        </a>

                        <a href="/admin/media" className="block p-4 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 rounded-lg text-left transition-colors group">
                            <div className="text-orange-400 font-semibold mb-1">🖼️ Media Library</div>
                            <div className="text-sm text-gray-400">Upload and manage images</div>
                        </a>

                        <a href="/admin/users" className="block p-4 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg text-left transition-colors group">
                            <div className="text-rose-400 font-semibold mb-1">👥 User Management</div>
                            <div className="text-sm text-gray-400">Manage admin and editor users</div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
