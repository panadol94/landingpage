"use client"

import { useEffect, useState } from "react"
import { Plus, Trash2, ExternalLink, Copy, BarChart3, QrCode, Download, X } from "lucide-react"
import { generateQRCode, downloadQRCode } from "@/lib/qrcode"
import toast from "react-hot-toast"

interface Shortlink {
    id: string
    code: string
    destination: string
    title?: string
    isActive: boolean
    createdAt: string
    _count: { clicks: number }
}

export default function ShortlinksPage() {
    const [shortlinks, setShortlinks] = useState<Shortlink[]>([])
    const [loading, setLoading] = useState(true)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showQRModal, setShowQRModal] = useState(false)
    const [selectedLink, setSelectedLink] = useState<Shortlink | null>(null)
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState('')
    const [createdShortlink, setCreatedShortlink] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        code: '',
        destination: '',
        title: ''
    })

    useEffect(() => {
        fetchShortlinks()
    }, [])

    const fetchShortlinks = async () => {
        try {
            const res = await fetch('/api/shortlinks?limit=100')
            const data = await res.json()
            if (data.success) {
                setShortlinks(data.data)
            }
        } finally {
            setLoading(false)
        }
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const res = await fetch('/api/shortlinks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await res.json()

            if (res.ok) {
                toast.success('✅ Shortlink berjaya dicipta!')
                // Show success state with created link
                setCreatedShortlink(formData.code)
                fetchShortlinks()
            } else {
                toast.error(`❌ ${data.error}`)
            }
        } catch {
            toast.error('❌ Ralat mencipta shortlink')
        }
    }

    const closeCreateModal = () => {
        setShowCreateModal(false)
        setCreatedShortlink(null)
        setFormData({ code: '', destination: '', title: '' })
    }


    const handleDelete = async (id: string, code: string) => {
        if (!confirm(`Padam shortlink "${code}"?`)) return

        try {
            const res = await fetch(`/api/shortlinks/${id}`, {
                method: 'DELETE'
            })

            if (res.ok) {
                toast.success('✅ Berjaya dipadam!')
                fetchShortlinks()
            }
        } catch {
            toast.error('❌ Ralat memadam')
        }
    }

    const copyToClipboard = (code: string) => {
        const url = `${window.location.origin}/${code}`
        navigator.clipboard.writeText(url)
        toast.success(`📋 Copied: ${url}`)
    }

    const handleShowQR = async (link: Shortlink) => {
        setSelectedLink(link)
        setShowQRModal(true)

        // Generate QR code
        const url = `${window.location.origin}/${link.code}`
        try {
            const qrCode = await generateQRCode(url, {
                width: 400,
                margin: 2,
                color: {
                    dark: '#0891b2', // cyan-600
                    light: '#ffffff',
                }
            })
            setQrCodeDataUrl(qrCode)
        } catch {
            toast.error('❌ Gagal menjana QR code')
        }
    }

    const handleDownloadQR = async () => {
        if (!selectedLink) return

        const url = `${window.location.origin}/${selectedLink.code}`
        const filename = `qr-${selectedLink.code}`

        try {
            await downloadQRCode(url, filename)
            toast.success('✅ QR code dimuat turun!')
        } catch {
            toast.error('❌ Gagal memuat turun QR code')
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">🔗 Manage Shortlinks</h1>
                        <p className="text-gray-400">Create and manage your shortlinks with QR codes</p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
                    >
                        <Plus size={20} />
                        Create New
                    </button>
                </div>

                {/* Create Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 max-w-md w-full mx-4">
                            {createdShortlink ? (
                                // Success State
                                <>
                                    <div className="text-center mb-6">
                                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="text-4xl">✅</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-white mb-2">Shortlink Berjaya Dicipta!</h2>
                                        <p className="text-gray-400">Link anda sudah siap dan boleh digunakan</p>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Created Link Display */}
                                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                            <div className="text-sm text-gray-400 mb-2">Your Shortlink:</div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 bg-black/30 rounded-lg px-4 py-3 font-mono text-cyan-400 text-lg break-all">
                                                    {window.location.origin}/{createdShortlink}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Copy Button */}
                                        <button
                                            onClick={() => copyToClipboard(createdShortlink)}
                                            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-cyan-500/50"
                                        >
                                            <Copy size={20} />
                                            Copy Link
                                        </button>

                                        {/* QR Code Button */}
                                        <button
                                            onClick={() => {
                                                const link = shortlinks.find(l => l.code === createdShortlink)
                                                if (link) {
                                                    handleShowQR(link)
                                                    closeCreateModal()
                                                }
                                            }}
                                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                                        >
                                            <QrCode size={20} />
                                            Generate QR Code
                                        </button>

                                        {/* Done Button */}
                                        <button
                                            onClick={closeCreateModal}
                                            className="w-full px-6 py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl transition-colors"
                                        >
                                            Done
                                        </button>
                                    </div>
                                </>
                            ) : (
                                // Create Form
                                <>
                                    <h2 className="text-2xl font-bold text-white mb-6">Create Shortlink</h2>

                                    <form onSubmit={handleCreate} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Code *
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-400">masuk10.com/</span>
                                                <input
                                                    type="text"
                                                    value={formData.code}
                                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                                    required
                                                    placeholder="fb1"
                                                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">Alphanumeric and hyphens only</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Destination URL *
                                            </label>
                                            <input
                                                type="url"
                                                value={formData.destination}
                                                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                                required
                                                placeholder="https://example.com"
                                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Title (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                placeholder="Facebook Group"
                                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                                            />
                                        </div>

                                        <div className="flex gap-3 pt-4">
                                            <button
                                                type="submit"
                                                className="flex-1 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
                                            >
                                                Create
                                            </button>
                                            <button
                                                type="button"
                                                onClick={closeCreateModal}
                                                className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* QR Code Modal */}
                {showQRModal && selectedLink && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 max-w-md w-full mx-4">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">QR Code</h2>
                                <button
                                    onClick={() => setShowQRModal(false)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="text-center">
                                    <div className="text-cyan-400 font-mono text-lg mb-1">
                                        /{selectedLink.code}
                                    </div>
                                    {selectedLink.title && (
                                        <div className="text-gray-400 text-sm">{selectedLink.title}</div>
                                    )}
                                </div>

                                {/* QR Code Image */}
                                <div className="flex justify-center p-6 bg-white rounded-xl">
                                    {qrCodeDataUrl ? (
                                        /* eslint-disable-next-line @next/next/no-img-element */
                                        <img
                                            src={qrCodeDataUrl}
                                            alt={`QR Code for ${selectedLink.code}`}
                                            className="w-64 h-64"
                                        />
                                    ) : (
                                        <div className="w-64 h-64 flex items-center justify-center">
                                            <div className="text-gray-400">Generating...</div>
                                        </div>
                                    )}
                                </div>

                                <div className="text-center text-sm text-gray-400">
                                    Scan to visit: {window.location.origin}/{selectedLink.code}
                                </div>

                                <button
                                    onClick={handleDownloadQR}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
                                >
                                    <Download size={20} />
                                    Download QR Code
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Shortlinks Table */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-white/5">
                            <tr className="text-left">
                                <th className="px-6 py-4 text-sm font-semibold text-gray-300">Code</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-300">Destination</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-300">Clicks</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-300">Status</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shortlinks.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                        No shortlinks yet. Create your first one!
                                    </td>
                                </tr>
                            ) : (
                                shortlinks.map((link) => (
                                    <tr key={link.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="text-cyan-400 font-mono font-semibold">/{link.code}</div>
                                                {link.title && <div className="text-xs text-gray-500 mt-1">{link.title}</div>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <a
                                                href={link.destination}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-300 hover:text-cyan-400 flex items-center gap-1 max-w-md truncate"
                                            >
                                                {link.destination}
                                                <ExternalLink size={14} />
                                            </a>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-white">
                                                <BarChart3 size={16} className="text-emerald-400" />
                                                {link._count.clicks}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${link.isActive
                                                ? 'bg-emerald-500/20 text-emerald-400'
                                                : 'bg-gray-500/20 text-gray-400'
                                                }`}>
                                                {link.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleShowQR(link)}
                                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-cyan-400"
                                                    title="Show QR Code"
                                                >
                                                    <QrCode size={16} />
                                                </button>
                                                <button
                                                    onClick={() => copyToClipboard(link.code)}
                                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-cyan-400"
                                                    title="Copy URL"
                                                >
                                                    <Copy size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(link.id, link.code)}
                                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-red-400"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Back Button */}
                <div className="mt-6">
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
