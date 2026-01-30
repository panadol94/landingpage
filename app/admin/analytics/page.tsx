"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { Calendar, Download } from "lucide-react"
import { format, subDays, startOfDay, endOfDay } from 'date-fns'
import { exportAnalyticsCSV } from "@/lib/csv-export"
import toast from "react-hot-toast"

interface Stats {
    dateRange?: {
        start: string
        end: string
    }
    shortlinks: {
        total: number
        active: number
    }
    clicks: {
        total: number
        today: number
        thisWeek: number
        thisMonth: number
    }
    topLinks: Array<{
        code: string
        title?: string
        clicks: number
    }>
    devices: Array<{
        type: string
        count: number
    }>
    browsers: Array<{
        name: string
        count: number
    }>
}

type DatePreset = 'today' | 'week' | 'month' | 'all'

const COLORS = ['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']

export default function AnalyticsPage() {
    const [stats, setStats] = useState<Stats | null>(null)
    const [loading, setLoading] = useState(true)
    const [datePreset, setDatePreset] = useState<DatePreset>('all')
    const [startDate, setStartDate] = useState<Date>(new Date(0))
    const [endDate, setEndDate] = useState<Date>(new Date())

    const fetchStats = async () => {
        try {
            const params = new URLSearchParams()
            if (datePreset !== 'all') {
                params.append('startDate', startDate.toISOString())
                params.append('endDate', endDate.toISOString())
            }

            const res = await fetch(`/api/analytics/stats?${params.toString()}`)
            const data = await res.json()
            if (data.success) {
                setStats(data.data)
            }
        } catch (error) {
            console.error('Error fetching stats:', error)
            toast.error('❌ Failed to load analytics')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStats()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDate, endDate])

    const handlePresetChange = (preset: DatePreset) => {
        setDatePreset(preset)
        const now = new Date()

        switch (preset) {
            case 'today':
                setStartDate(startOfDay(now))
                setEndDate(endOfDay(now))
                break
            case 'week':
                setStartDate(startOfDay(subDays(now, 7)))
                setEndDate(endOfDay(now))
                break
            case 'month':
                setStartDate(startOfDay(subDays(now, 30)))
                setEndDate(endOfDay(now))
                break
            case 'all':
            default:
                setStartDate(new Date(0))
                setEndDate(new Date())
                break
        }
    }

    const handleExportCSV = () => {
        if (!stats) return

        try {
            exportAnalyticsCSV(stats, {
                start: startDate,
                end: endDate
            })
            toast.success('✅ CSV exported successfully!')
        } catch {
            toast.error('❌ Failed to export CSV')
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
                <div className="text-white">Loading analytics...</div>
            </div>
        )
    }

    if (!stats) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
                <div className="text-white">Failed to load analytics</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">📊 Analytics</h1>
                            <p className="text-gray-400">Track performance and insights</p>
                        </div>
                        <button
                            onClick={handleExportCSV}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                        >
                            <Download size={18} />
                            Export CSV
                        </button>
                    </div>

                    {/* Date Range Picker */}
                    <div className="flex flex-wrap items-center gap-3 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-gray-300">
                            <Calendar size={18} />
                            <span className="text-sm font-medium">Date Range:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => handlePresetChange('today')}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${datePreset === 'today'
                                    ? 'bg-cyan-500 text-white'
                                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                    }`}
                            >
                                Today
                            </button>
                            <button
                                onClick={() => handlePresetChange('week')}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${datePreset === 'week'
                                    ? 'bg-cyan-500 text-white'
                                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                    }`}
                            >
                                Last 7 Days
                            </button>
                            <button
                                onClick={() => handlePresetChange('month')}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${datePreset === 'month'
                                    ? 'bg-cyan-500 text-white'
                                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                    }`}
                            >
                                Last 30 Days
                            </button>
                            <button
                                onClick={() => handlePresetChange('all')}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${datePreset === 'all'
                                    ? 'bg-cyan-500 text-white'
                                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                    }`}
                            >
                                All Time
                            </button>
                        </div>
                        <div className="text-sm text-gray-400">
                            {datePreset === 'all' ? (
                                'Showing all-time data'
                            ) : (
                                `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                        <div className="text-cyan-400 font-semibold mb-2">Total Clicks</div>
                        <div className="text-4xl font-bold text-white">{stats.clicks.total.toLocaleString()}</div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                        <div className="text-emerald-400 font-semibold mb-2">Today</div>
                        <div className="text-4xl font-bold text-white">{stats.clicks.today.toLocaleString()}</div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                        <div className="text-purple-400 font-semibold mb-2">This Week</div>
                        <div className="text-4xl font-bold text-white">{stats.clicks.thisWeek.toLocaleString()}</div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                        <div className="text-orange-400 font-semibold mb-2">This Month</div>
                        <div className="text-4xl font-bold text-white">{stats.clicks.thisMonth.toLocaleString()}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Top Links */}
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-6">Top Performing Links</h2>
                        {stats.topLinks.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">No clicks yet</p>
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={stats.topLinks}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                    <XAxis dataKey="code" stroke="#fff" />
                                    <YAxis stroke="#fff" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ffffff20', borderRadius: '8px' }}
                                        labelStyle={{ color: '#fff' }}
                                    />
                                    <Bar dataKey="clicks" fill="#06b6d4" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* Device Breakdown */}
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-6">Device Distribution</h2>
                        {stats.devices.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">No device data yet</p>
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={stats.devices}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="count"
                                        nameKey="type"
                                        label
                                    >
                                        {stats.devices.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ffffff20', borderRadius: '8px' }}
                                    />
                                    <Legend
                                        wrapperStyle={{ color: '#fff' }}
                                        formatter={(value) => <span style={{ color: '#fff' }}>{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Browser Stats */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 mb-6">
                    <h2 className="text-xl font-bold text-white mb-6">Browser Statistics</h2>
                    {stats.browsers.length === 0 ? (
                        <p className="text-gray-400 text-center py-8">No browser data yet</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={stats.browsers} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis type="number" stroke="#fff" />
                                <YAxis dataKey="name" type="category" stroke="#fff" width={100} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ffffff20', borderRadius: '8px' }}
                                    labelStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="count" fill="#8b5cf6" />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Back Button */}
                <div>
                    <a
                        href="/admin/dashboard"
                        className="inline-block px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                    >
                        ← Kembali ke Dashboard
                    </a>
                </div>
            </div>
        </div>
    )
}
