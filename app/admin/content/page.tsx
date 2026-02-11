"use client"

import { useEffect, useState } from "react"
import RichTextEditor from "@/components/admin/RichTextEditor"
import { Eye, EyeOff, Save } from "lucide-react"
import Link from "next/link"
import toast from "react-hot-toast"

export default function ContentEditorPage() {
    const [content, setContent] = useState<Record<string, Record<string, string>>>({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [selectedSection, setSelectedSection] = useState('hero')
    const [selectedKey, setSelectedKey] = useState<string | null>(null)
    const [showPreview, setShowPreview] = useState(false)
    const [editingValue, setEditingValue] = useState('')

    useEffect(() => {
        fetchContent()
    }, [])

    const fetchContent = async () => {
        try {
            const res = await fetch('/api/content')
            const data = await res.json()
            if (data.success) {
                setContent(data.data)
            }
        } catch {
            toast.error('Gagal memuat kandungan')
        } finally {
            setLoading(false)
        }
    }

    const handleUpdate = async (section: string, key: string, value: string) => {
        setSaving(true)
        try {
            const res = await fetch('/api/content', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ section, key, value })
            })

            if (res.ok) {
                // Update local state
                setContent(prev => ({
                    ...prev,
                    [section]: {
                        ...prev[section],
                        [key]: value
                    }
                }))
                toast.success('✅ Berjaya disimpan!')
            } else {
                toast.error('❌ Gagal menyimpan')
            }
        } catch {
            toast.error('❌ Ralat menyimpan')
        } finally {
            setSaving(false)
        }
    }

    const handleSave = () => {
        if (selectedKey) {
            handleUpdate(selectedSection, selectedKey, editingValue)
            setSelectedKey(null)
        }
    }

    const sections = Object.keys(content)

    // Determine if a field should use rich text editor
    const shouldUseRichText = (key: string, value: string) => {
        const richTextKeys = ['description', 'subtitle', 'whatsapp_description']
        return richTextKeys.includes(key) || value.length > 150
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
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">📝 Edit Landing Page</h1>
                        <p className="text-gray-400">Update content dengan rich text editor</p>
                    </div>
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                    >
                        {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {showPreview ? 'Sembunyikan Preview' : 'Lihat Preview'}
                    </button>
                </div>

                <div className="grid grid-cols-12 gap-6">
                    {/* Section Selector */}
                    <div className="col-span-3">
                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 sticky top-6">
                            <h2 className="text-white font-semibold mb-4">Sections</h2>
                            <div className="space-y-2">
                                {sections.map(section => (
                                    <button
                                        key={section}
                                        onClick={() => {
                                            setSelectedSection(section)
                                            setSelectedKey(null)
                                        }}
                                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors capitalize ${selectedSection === section
                                            ? 'bg-cyan-500 text-white'
                                            : 'bg-white/5 text-gray-300 hover:bg-white/10'
                                            }`}
                                    >
                                        {section}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Content Editor */}
                    <div className={showPreview ? "col-span-5" : "col-span-9"}>
                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                            <h2 className="text-xl font-bold text-white mb-6 capitalize">{selectedSection}</h2>

                            <div className="space-y-6">
                                {content[selectedSection] && Object.entries(content[selectedSection]).map(([key, value]) => (
                                    <div key={key} className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-300 capitalize">
                                            {key.replace(/_/g, ' ')}
                                        </label>

                                        {shouldUseRichText(key, value) ? (
                                            <div className="space-y-2">
                                                <RichTextEditor
                                                    content={selectedKey === key ? editingValue : value}
                                                    onChange={(html) => {
                                                        setSelectedKey(key)
                                                        setEditingValue(html)
                                                    }}
                                                    placeholder={`Masukkan ${key.replace(/_/g, ' ')}...`}
                                                />
                                                {selectedKey === key && (
                                                    <button
                                                        onClick={handleSave}
                                                        disabled={saving}
                                                        className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 text-white rounded-lg transition-colors text-sm"
                                                    >
                                                        <Save className="w-4 h-4" />
                                                        {saving ? 'Menyimpan...' : 'Simpan'}
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            <input
                                                type="text"
                                                key={`${selectedSection}-${key}`}
                                                defaultValue={value}
                                                onBlur={(e) => {
                                                    if (e.target.value !== value) {
                                                        handleUpdate(selectedSection, key, e.target.value)
                                                    }
                                                }}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Preview Panel */}
                    {showPreview && (
                        <div className="col-span-4">
                            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 sticky top-6">
                                <h2 className="text-xl font-bold text-white mb-4">Preview</h2>
                                <div className="space-y-4 text-white">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-400 mb-2">Section</h3>
                                        <p className="text-lg capitalize">{selectedSection}</p>
                                    </div>
                                    {selectedKey && (
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-400 mb-2">Current Field</h3>
                                            <p className="text-sm capitalize">{selectedKey.replace(/_/g, ' ')}</p>
                                            <div
                                                className="mt-2 p-4 bg-white/5 rounded-lg prose prose-invert prose-sm max-w-none"
                                                dangerouslySetInnerHTML={{ __html: editingValue || content[selectedSection]?.[selectedKey] || '' }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Back Button */}
                <div className="mt-6">
                    <Link
                        href="/admin/dashboard"
                        className="inline-block px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                    >
                        ← Kembali ke Dashboard
                    </Link>
                </div>
            </div>
        </div>
    )
}
