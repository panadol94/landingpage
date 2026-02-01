"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Star } from "lucide-react"
// import Tilt from 'react-parallax-tilt' // Disabled for performance

export default function Testimonials() {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1
    })

    const testimonials = [
        {
            name: "Ahmad Razak",
            role: "Member Aktif",
            avatar: "👨‍💼",
            text: "Tips cara tangkap ikan memang power! Lepas belajar teknik dari komuniti ni, skill saya naik banyak. Recommended!",
            rating: 5
        },
        {
            name: "Siti Nurhaliza",
            role: "VIP Member",
            avatar: "👩‍💼",
            text: "Strategi buka kerang dekat seaworld yang diorang ajar tu memang betul. Sekarang dah faham pattern macam mana nak approach. Best sangat!",
            rating: 5
        },
        {
            name: "Kumar Rajesh",
            role: "Pro Member",
            avatar: "👨‍💻",
            text: "Teknik beruang panjat pokok dapat madu tu genius! Community support sangat helpful, tips sentiasa update. Worth it join!",
            rating: 5
        }
    ]

    return (
        <section ref={ref} className="py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Apa Kata Member Kami
                    </h2>
                    <p className="text-xl text-gray-400">
                        Sertai ribuan members yang berpuas hati
                    </p>
                </motion.div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, delay: index * 0.2 }}
                            whileHover={{ y: -5 }}
                            className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all"
                        >
                            {/* Stars */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>

                            {/* Quote */}
                            <p className="text-gray-300 mb-6 leading-relaxed">
                                "{testimonial.text}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-2xl">
                                    {testimonial.avatar}
                                </div>
                                <div>
                                    <div className="font-semibold text-white">{testimonial.name}</div>
                                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                                </div>
                                <div className="ml-auto">
                                    <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-semibold">
                                        ✓ Verified
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
