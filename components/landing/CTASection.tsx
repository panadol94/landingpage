"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useState, useEffect } from "react"
import { Clock, Gift, CheckCircle, Shield } from "lucide-react"

interface CTASectionProps {
    ctaUrl?: string
}

export default function CTASection({ ctaUrl = "https://wa.me/60123456789" }: CTASectionProps) {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1
    })

    // Countdown timer (15 minutes)
    const [timeLeft, setTimeLeft] = useState({ minutes: 14, seconds: 59 })

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev.seconds > 0) {
                    return { ...prev, seconds: prev.seconds - 1 }
                } else if (prev.minutes > 0) {
                    return { minutes: prev.minutes - 1, seconds: 59 }
                } else {
                    // Reset to 15 minutes when it reaches 0
                    return { minutes: 14, seconds: 59 }
                }
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    const benefits = [
        { icon: Gift, text: "Free Premium Trial (7 Days)" },
        { icon: CheckCircle, text: "Full access to analytics dashboard" },
        { icon: Shield, text: "Personal strategy consultation" }
    ]

    return (
        <section ref={ref} className="py-20 md:py-32 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent" />

            <div className="max-w-4xl mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.8 }}
                    className="bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10 backdrop-blur-xl border border-green-500/20 rounded-3xl p-8 md:p-12 shadow-2xl shadow-green-500/10"
                >
                    {/* Fire Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-center mb-6"
                    >
                        <div className="inline-block bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-full px-6 py-2">
                            <span className="text-2xl">🔥</span>
                            <span className="ml-2 text-orange-400 font-bold">FREE STRATEGY WEBINAR</span>
                            <span className="ml-2 text-2xl">🔥</span>
                        </div>
                    </motion.div>

                    {/* Countdown */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-center mb-8"
                    >
                        <p className="text-lg text-gray-300 mb-4">Next webinar starts in</p>
                        <div className="flex items-center justify-center gap-4 mb-2">
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-6 py-4">
                                <div className="text-5xl font-bold text-white tabular-nums">
                                    {timeLeft.minutes.toString().padStart(2, '0')}
                                </div>
                                <div className="text-sm text-gray-400 mt-1">Minutes</div>
                            </div>
                            <div className="text-4xl text-white">:</div>
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-6 py-4">
                                <div className="text-5xl font-bold text-white tabular-nums">
                                    {timeLeft.seconds.toString().padStart(2, '0')}
                                </div>
                                <div className="text-sm text-gray-400 mt-1">Seconds</div>
                            </div>
                        </div>
                        <p className="text-gray-400">to unlock these benefits</p>
                    </motion.div>

                    {/* Benefits */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="space-y-4 mb-8"
                    >
                        {benefits.map((benefit, index) => {
                            const Icon = benefit.icon
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={inView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                                    className="flex items-center gap-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4"
                                >
                                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                        <Icon className="w-6 h-6 text-green-400" />
                                    </div>
                                    <span className="text-lg text-white">{benefit.text}</span>
                                </motion.div>
                            )
                        })}
                    </motion.div>

                    {/* Urgency Text */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="text-center mb-8"
                    >
                        <p className="text-xl font-bold text-cyan-400 mb-2">
                            📊 Join 5,000+ members learning daily!
                        </p>
                    </motion.div>

                    {/* Main CTA Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.9 }}
                        className="text-center mb-6"
                    >
                        <motion.a
                            href={ctaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-block w-full sm:w-auto px-12 py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-xl rounded-2xl transition-all shadow-2xl shadow-green-500/50 hover:shadow-green-500/70"
                        >
                            <span className="flex items-center justify-center gap-3">
                                <span className="text-3xl">💬</span>
                                <span>JOIN WHATSAPP GROUP - FREE</span>
                            </span>
                        </motion.a>
                    </motion.div>

                    {/* Trust Badges */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.6, delay: 1 }}
                        className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400"
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-green-400">🔒</span>
                            <span>100% Secure</span>
                        </div>
                        <div className="w-px h-4 bg-gray-600" />
                        <div className="flex items-center gap-2">
                            <span className="text-green-400">🚫</span>
                            <span>No Spam</span>
                        </div>
                        <div className="w-px h-4 bg-gray-600" />
                        <div className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            <span>Cancel Anytime</span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
