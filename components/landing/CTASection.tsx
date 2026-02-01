"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Gift, CheckCircle, Shield } from "lucide-react"

interface CTASectionProps {
    ctaUrl?: string
}

export default function CTASection({ ctaUrl = "https://wa.me/60123456789" }: CTASectionProps) {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1
    })

    const benefits = [
        { icon: Gift, text: "Tips Eksklusif Setiap Hari" },
        { icon: CheckCircle, text: "Strategi Gaming Terkini" },
        { icon: Shield, text: "Community Support 24/7" }
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
                            <span className="ml-2 text-orange-400 font-bold">KOMUNITI EKSKLUSIF</span>
                            <span className="ml-2 text-2xl">🔥</span>
                        </div>
                    </motion.div>

                    {/* Main Headline */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-center mb-8"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Sertai Komuniti Kami Hari Ini
                        </h2>
                        <p className="text-xl text-gray-300">
                            Dapatkan akses kepada tips eksklusif & strategi terkini setiap hari
                        </p>
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
                            📊 Sertai 5,000+ members yang belajar strategi setiap hari!
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
                                <span>SERTAI WHATSAPP GROUP</span>
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
