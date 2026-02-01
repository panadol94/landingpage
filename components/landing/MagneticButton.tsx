"use client"

import { motion } from "framer-motion"
import { useState, useRef, MouseEvent } from "react"

interface MagneticButtonProps {
    children: React.ReactNode
    href?: string
    className?: string
    strength?: number
}

export default function MagneticButton({
    children,
    href,
    className = "",
    strength = 0.3
}: MagneticButtonProps) {
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const buttonRef = useRef<HTMLAnchorElement>(null)

    const handleMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
        if (!buttonRef.current) return

        const rect = buttonRef.current.getBoundingClientRect()
        const buttonCenterX = rect.left + rect.width / 2
        const buttonCenterY = rect.top + rect.height / 2

        const distanceX = e.clientX - buttonCenterX
        const distanceY = e.clientY - buttonCenterY

        setPosition({
            x: distanceX * strength,
            y: distanceY * strength
        })
    }

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 })
    }

    return (
        <motion.a
            ref={buttonRef}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{
                x: position.x,
                y: position.y
            }}
            transition={{
                type: "spring",
                stiffness: 150,
                damping: 15,
                mass: 0.1
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`inline-block relative group ${className}`}
        >
            {/* Ripple effect on tap */}
            <motion.div
                className="absolute inset-0 bg-white/20 rounded-2xl"
                initial={{ scale: 0, opacity: 1 }}
                whileTap={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.6 }}
            />

            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl opacity-75 blur-lg group-hover:opacity-100 transition-opacity"></div>

            {/* Button content */}
            <div className="relative">
                {children}
            </div>
        </motion.a>
    )
}
