"use client"

interface RoleBadgeProps {
    role: 'ADMIN' | 'EDITOR'
}

export default function RoleBadge({ role }: RoleBadgeProps) {
    const styles = {
        ADMIN: {
            bg: 'bg-cyan-500/20',
            text: 'text-cyan-400',
            border: 'border-cyan-400/30'
        },
        EDITOR: {
            bg: 'bg-purple-500/20',
            text: 'text-purple-400',
            border: 'border-purple-400/30'
        }
    }

    const style = styles[role]

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style.bg} ${style.text} ${style.border}`}>
            {role}
        </span>
    )
}
