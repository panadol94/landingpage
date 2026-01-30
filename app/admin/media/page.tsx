"use client"

import { useEffect, useState, useRef } from "react"
import { Upload, Copy, Trash2, Search, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import toast from "react-hot-toast"
import { format } from "date-fns"

interface Media {
    id: string
    filename: string
    url: string
    fileSize: number | null
    mimeType: string | null
    uploadedAt: string
    uploader?: {
        name: string | null
        email: string
    }
}

interface MediaResponse {
    media: Media[]
    total: number
    page: number
    limit: number
    totalPages: number
}

export default function MediaLibraryPage() {
    const [media, setMedia] = useState<Media[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [total, setTotal] = useState(0)
    const [search, setSearch] = useState("")
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        fetchMedia()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, search])

    const fetchMedia = async () => {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '20',
                ...(search && { search })
            })

            const res = await fetch(`/api/media?${params.toString()}`)
            const data = await res.json()

            if (data.success) {
                setMedia(data.data.media)
                setTotal(data.data.total)
                setTotalPages(data.data.totalPages)
            }
        } catch (error) {
            console.error('Error fetching media:', error)
            toast.error('❌ Failed to load media')
        } finally {
            setLoading(false)
        }
    }

    const handleFileUpload = async (files: FileList | null) => {
        if (!files || files.length === 0) return

        setUploading(true)

        try {
            const uploadPromises = Array.from(files).map(async (file) => {
                const formData = new FormData()
                formData.append('file', file)

                const res = await fetch('/api/media/upload', {
                    method: 'POST',
                    body: formData,
                })

                const data = await res.json()
                if (!data.success) {
                    throw new Error(data.error)
                }
                return data.data
            })

            await Promise.all(uploadPromises)
            toast.success(`✅ ${files.length} file(s) uploaded successfully!`)
            fetchMedia() // Refresh media list
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Upload failed'
            toast.error(`❌ ${message}`)
        } finally {
            setUploading(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        handleFileUpload(e.dataTransfer.files)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const copyUrl = (url: string) => {
        const fullUrl = `${window.location.origin}${url}`
        navigator.clipboard.writeText(fullUrl)
        toast.success('📋 URL copied to clipboard!')
    }

    const deleteMedia = async (id: string) => {
        if (!confirm('Are you sure you want to delete this media file?')) return

        try {
            const res = await fetch(`/api/media/${id}`, {
                method: 'DELETE',
            })

            const data = await res.json()
            if (data.success) {
                toast.success('✅ Media deleted successfully!')
                fetchMedia()
            } else {
                throw new Error(data.error)
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Delete failed'
            toast.error(`❌ ${message}`)
        }
    }

    const formatFileSize = (bytes: number | null) => {
        if (!bytes) return 'Unknown'
        if (bytes < 1024) return bytes + ' B'
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
                <div className="text-white">Loading media...</div>
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
                            <h1 className="text-3xl font-bold text-white mb-2">📸 Media Library</h1>
                            <p className="text-gray-400">Manage images and files</p>
                        </div>
                        <a
                            href="/admin/dashboard"
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                        >
                            ← Back to Dashboard
                        </a>
                    </div>
                </div>

                {/* Upload Zone */}
                <div className="mb-8">
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${isDragging
                            ? 'border-cyan-400 bg-cyan-500/10'
                            : 'border-white/20 bg-white/5 hover:border-white/40'
                            }`}
                    >
                        <Upload className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">
                            {uploading ? 'Uploading...' : 'Upload Images'}
                        </h3>
                        <p className="text-gray-400 mb-4">
                            Drag and drop files here, or click to browse
                        </p>
                        <p className="text-sm text-gray-500">
                            Supported: JPG, PNG, GIF, WebP • Max 5MB per file
                        </p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e.target.files)}
                            className="hidden"
                        />
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by filename..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value)
                                setPage(1)
                            }}
                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>
                </div>

                {/* Stats */}
                {total > 0 && (
                    <div className="mb-6 text-gray-400 text-sm">
                        Showing {media.length} of {total} file{total !== 1 ? 's' : ''}
                    </div>
                )}

                {/* Media Grid */}
                {media.length === 0 ? (
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-12 text-center">
                        <ImageIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400">
                            {search ? 'No media found matching your search' : 'No media uploaded yet'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                        {media.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden group"
                            >
                                {/* Image Preview */}
                                <div className="relative aspect-video bg-slate-800">
                                    <Image
                                        src={item.url}
                                        alt={item.filename}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    />
                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                        <button
                                            onClick={() => copyUrl(item.url)}
                                            className="p-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-white transition-colors"
                                            title="Copy URL"
                                        >
                                            <Copy size={20} />
                                        </button>
                                        <button
                                            onClick={() => deleteMedia(item.id)}
                                            className="p-3 bg-red-500 hover:bg-red-600 rounded-lg text-white transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>

                                {/* File Info */}
                                <div className="p-4">
                                    <p className="text-white font-medium text-sm truncate mb-1" title={item.filename}>
                                        {item.filename}
                                    </p>
                                    <div className="flex justify-between text-xs text-gray-400">
                                        <span>{formatFileSize(item.fileSize)}</span>
                                        <span>{format(new Date(item.uploadedAt), 'MMM d, yyyy')}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2 text-white">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
