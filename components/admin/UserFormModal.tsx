"use client"

import { useState } from 'react'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'

interface User {
    id: string
    email: string
    name?: string | null
    role: 'ADMIN' | 'EDITOR'
}

interface UserFormModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    mode: 'add' | 'edit'
    initialData?: User
}

export default function UserFormModal({
    isOpen,
    onClose,
    onSuccess,
    mode,
    initialData
}: UserFormModalProps) {
    const [formData, setFormData] = useState({
        email: initialData?.email || '',
        password: '',
        name: initialData?.name || '',
        role: initialData?.role || 'EDITOR'
    })
    const [loading, setLoading] = useState(false)

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const url = mode === 'add' ? '/api/users' : `/api/users/${initialData?.id}`
            const method = mode === 'add' ? 'POST' : 'PATCH'

            // For edit mode, don't send password or email
            const body = mode === 'add'
                ? formData
                : { name: formData.name, role: formData.role }

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })

            const data = await res.json()

            if (data.success) {
                toast.success(mode === 'add' ? '✅ User created successfully!' : '✅ User updated successfully!')
                onSuccess()
                onClose()
                // Reset form
                setFormData({ email: '', password: '', name: '', role: 'EDITOR' })
            } else {
                toast.error(`❌ ${data.error}`)
            }
        } catch {
            toast.error('❌ An error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900/95 backdrop-blur-lg border border-white/10 rounded-xl p-6 max-w-md w-full shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">
                        {mode === 'add' ? '➕ Add New User' : '✏️ Edit User'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Email *
                        </label>
                        <input
                            type="email"
                            required
                            disabled={mode === 'edit'}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="user@example.com"
                        />
                        {mode === 'edit' && (
                            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                        )}
                    </div>

                    {/* Password (only for add mode) */}
                    {mode === 'add' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Password *
                            </label>
                            <input
                                type="password"
                                required={mode === 'add'}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                placeholder="Min. 8 characters"
                                minLength={8}
                            />
                        </div>
                    )}

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            placeholder="John Doe"
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Role *
                        </label>
                        <select
                            required
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value as 'ADMIN' | 'EDITOR' })}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                            <option value="EDITOR">Editor</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                            Admins can manage users, Editors cannot
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-lg transition-colors"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : (mode === 'add' ? 'Add User' : 'Save Changes')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
