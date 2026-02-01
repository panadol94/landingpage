"use client"

import { useEffect, useState } from 'react'
import { Users, Plus, Edit, Trash2, Lock, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import RoleBadge from '@/components/admin/RoleBadge'
import UserFormModal from '@/components/admin/UserFormModal'
import PasswordChangeModal from '@/components/admin/PasswordChangeModal'

interface User {
    id: string
    email: string
    name?: string | null
    role: 'ADMIN' | 'EDITOR'
    createdAt: string
    lastLogin?: string | null
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [filteredUsers, setFilteredUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)

    useEffect(() => {
        fetchUsers()
    }, [])

    useEffect(() => {
        // Filter users based on search
        if (search) {
            const filtered = users.filter(user =>
                user.name?.toLowerCase().includes(search.toLowerCase()) ||
                user.email.toLowerCase().includes(search.toLowerCase())
            )
            setFilteredUsers(filtered)
        } else {
            setFilteredUsers(users)
        }
    }, [search, users])

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/users')
            const data = await res.json()

            if (data.success) {
                setUsers(data.data.users)
                setFilteredUsers(data.data.users)
            } else {
                toast.error(`❌ ${data.error}`)
            }
        } catch {
            toast.error('❌ Failed to fetch users')
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (user: User) => {
        setSelectedUser(user)
        setShowEditModal(true)
    }

    const handleChangePassword = (user: User) => {
        setSelectedUser(user)
        setShowPasswordModal(true)
    }

    const handleDelete = async (user: User) => {
        const confirmed = confirm(`Are you sure you want to delete user "${user.name || user.email}"?\n\nThis action cannot be undone.`)

        if (!confirmed) return

        try {
            const res = await fetch(`/api/users/${user.id}`, {
                method: 'DELETE'
            })

            const data = await res.json()

            if (data.success) {
                toast.success('✅ User deleted successfully!')
                fetchUsers()
            } else {
                toast.error(`❌ ${data.error}`)
            }
        } catch {
            toast.error('❌ Failed to delete user')
        }
    }

    const formatDate = (dateString?: string | null) => {
        if (!dateString) return 'Never'
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    return (
        <div className="min-h-screen p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Users className="w-8 h-8 text-cyan-400" />
                        User Management
                    </h1>
                    <p className="text-gray-400 mt-2">Manage admin and editor accounts</p>
                </div>

                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add User
                </button>
            </div>

            {/* Search */}
            <div className="mb-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4">
                <div className="relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-400">
                        Loading users...
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="p-12 text-center">
                        <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">
                            {search ? 'No users found matching your search' : 'No users yet'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/5 border-b border-white/10">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Name</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Email</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Role</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Created</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Last Login</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-white font-medium">
                                                {user.name || <span className="text-gray-500 italic">No name</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-300">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <RoleBadge role={user.role} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-400 text-sm">{formatDate(user.createdAt)}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-400 text-sm">{formatDate(user.lastLogin)}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(user)}
                                                    className="p-2 hover:bg-cyan-500/20 text-cyan-400 rounded-lg transition-colors"
                                                    title="Edit user"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleChangePassword(user)}
                                                    className="p-2 hover:bg-purple-500/20 text-purple-400 rounded-lg transition-colors"
                                                    title="Change password"
                                                >
                                                    <Lock className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user)}
                                                    className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                                                    title="Delete user"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Stats */}
                {!loading && filteredUsers.length > 0 && (
                    <div className="px-6 py-4 bg-white/5 border-t border-white/10">
                        <p className="text-sm text-gray-400">
                            Showing {filteredUsers.length} of {users.length} user{users.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                )}
            </div>

            {/* Modals */}
            <UserFormModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSuccess={fetchUsers}
                mode="add"
            />

            <UserFormModal
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false)
                    setSelectedUser(null)
                }}
                onSuccess={fetchUsers}
                mode="edit"
                initialData={selectedUser || undefined}
            />

            <PasswordChangeModal
                isOpen={showPasswordModal}
                onClose={() => {
                    setShowPasswordModal(false)
                    setSelectedUser(null)
                }}
                onSuccess={() => { }}
                userId={selectedUser?.id || ''}
                userName={selectedUser?.name}
            />
        </div>
    )
}
