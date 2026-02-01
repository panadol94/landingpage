"use client"

import { motion } from "framer-motion"
import { Sparkles, TrendingUp, Users } from "lucide-react"

interface HeroProps {
    title?: string
    subtitle?: string
    description?: string
    ctaText?: string
    ctaUrl?: string
    memberCount?: string
    rating?: string
}

export default function Hero({
    title = "MASUK10",
    subtitle = "Advanced Gaming Analytics & Strategy Platform",
    description = "Join 5,000+ members learning data-driven game analysis, statistical insights, and professional strategy development",
    ctaText = "JOIN FREE ANALYTICS COMMUNITY",
    ctaUrl = "https://wa.me/60123456789",
    memberCount = "5,234+",
    rating = "4.9/5"
}: HeroProps) {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Animated Background Orbs */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -100, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
                    animate={{
                        x: [0, -100, 0],
                        y: [0, 100, 0],
                        scale: [1, 1.3, 1],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 text-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-block mb-6"
                >
                    <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-sm border border-cyan-500/20 rounded-full px-6 py-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        <span className="text-cyan-400 font-semibold">Premium Community</span>
                    </div>
                </motion.div>

                {/* Main Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-5xl md:text-7xl font-bold mb-6"
                >
                    <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-gradient">
                        {title}
                    </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight"
                >
                    {subtitle}
                </motion.h2>

                {/* Description with Benefits */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="max-w-3xl mx-auto mb-8"
                >
                    <p className="text-xl text-gray-300 mb-6">{description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                                <span className="text-green-400 text-sm">✓</span>
                            </div>
                            <span className="text-gray-300">Data-driven game analysis</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                                <span className="text-green-400 text-sm">✓</span>
                            </div>
                            <span className="text-gray-300">Advanced analytics tools</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                                <span className="text-green-400 text-sm">✓</span>
                            </div>
                            <span className="text-gray-300">Real-time statistical insights</span>
                        </div>
                    </div>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
                >
                    <motion.a
                        href={ctaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-green-500/50 hover:shadow-green-500/70 flex items-center gap-2"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            💬 {ctaText}
                        </span>
                        <motion.div
                            className="absolute inset-0 bg-white/20 rounded-xl"
                            initial={{ scale: 0, opacity: 0 }}
                            whileHover={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        />
                    </motion.a>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20 text-white font-semibold rounded-xl transition-all flex items-center gap-2"
                    >
                        <TrendingUp className="w-5 h-5" />
                        See Live Stats
                    </motion.button>
                </motion.div>

                {/* Social Proof */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm"
                >
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-cyan-400" />
                        <span className="text-gray-300">{memberCount} Active Members</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="text-2xl">⭐⭐⭐⭐⭐</span>
                        <span className="text-gray-300 ml-2">{rating} from 2,341 reviews</span>
                    </div>
                </motion.div>

                {/* Trust badges */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                    className="mt-8 flex items-center justify-center gap-4 text-xs text-gray-400"
                >
                    <div className="flex items-center gap-1">
                        <span>🔒</span>
                        <span>100% Secure</span>
                    </div>
                    <div className="w-px h-4 bg-gray-600" />
                    <div className="flex items-center gap-1">
                        <span>🚫</span>
                        <span>No Spam</span>
                    </div>
                    <div className="w-px h-4 bg-gray-600" />
                    <div className="flex items-center gap-1">
                        <span>✓</span>
                        <span>Cancel Anytime</span>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.5 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center p-2"
                >
                    <motion.div className="w-1.5 h-1.5 bg-white rounded-full" />
                </motion.div>
            </motion.div>
        </section>
    )
}
