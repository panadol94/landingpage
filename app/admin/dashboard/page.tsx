import { auth } from "@/lib/auth-config"
import { redirect } from "next/navigation"

export default async function AdminDashboardPage() {
    const session = await auth()

    if (!session) {
        redirect("/admin/login")
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
                            Selamat datang, {session.user?.name || session.user?.email}
                        </p>
                    </div>
                    <form action={async () => {
                        "use server"
                        const { signOut } = await import("@/lib/auth-config")
                        await signOut({ redirectTo: "/admin/login" })
                    }}>
                        <button className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors">
                            Logout
                        </button>
                    </form>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                        <div className="text-cyan-400 font-semibold mb-2">Total Shortlinks</div>
                        <div className="text-3xl font-bold text-white">0</div>
                        <div className="text-sm text-gray-400 mt-1">Coming soon...</div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                        <div className="text-emerald-400 font-semibold mb-2">Total Clicks</div>
                        <div className="text-3xl font-bold text-white">0</div>
                        <div className="text-sm text-gray-400 mt-1">Coming soon...</div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                        <div className="text-purple-400 font-semibold mb-2">Clicks Today</div>
                        <div className="text-3xl font-bold text-white">0</div>
                        <div className="text-sm text-gray-400 mt-1">Coming soon...</div>
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

                {/* Development Status */}
                <div className="mt-8 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                        <div className="text-2xl">🚧</div>
                        <div>
                            <h3 className="text-yellow-400 font-semibold mb-2">Development Progress - Day 2/21</h3>
                            <div className="text-gray-300 text-sm space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-green-400">✓</span>
                                    <span>Authentication system implemented</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-green-400">✓</span>
                                    <span>Admin login functional</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-yellow-400">⟳</span>
                                    <span>Database setup (next)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-500">○</span>
                                    <span>Content editor (Week 2)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-500">○</span>
                                    <span>Shortlink management (Week 2)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
