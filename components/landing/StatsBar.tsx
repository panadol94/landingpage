"use client"

import { motion } from "framer-motion"
import CountUp from "react-countup"
import { Users, TrendingUp, DollarSign, Award } from "lucide-react"
import { useInView } from "react-intersection-observer"

export default function StatsBar() {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1
    })

    const stats = [
        {
            icon: Users,
            value: 5234,
            suffix: "+",
            label: "Active Members",
            subtext: "Growing Daily",
            color: "cyan"
        },
        {
            icon: TrendingUp,
            value: 98.5,
            suffix: "%",
            label: "Member Satisfaction",
            subtext: "Verified Reviews",
            color: "green"
        },
        {
            icon: TrendingUp,
            value: 12.5,
            suffix: "k+",
            label: "Analyses Performed",
            subtext: "This Month",
            color: "yellow"
        },
        {
            icon: Award,
            value: 4.9,
            suffix: "/5",
            decimals: 1,
            label: "User Rating",
            subtext: "2,341 Reviews",
            color: "purple"
        }
    ]

    const colorMap = {
        cyan: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30",
        green: "from-green-500/20 to-emerald-500/20 border-green-500/30",
        yellow: "from-yellow-500/20 to-orange-500/20 border-yellow-500/30",
        purple: "from-purple-500/20 to-pink-500/20 border-purple-500/30"
    }

    const iconColorMap = {
        cyan: "text-cyan-400",
        green: "text-green-400",
        yellow: "text-yellow-400",
        purple: "text-purple-400"
    }

    return (
        <section className="py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {stats.map((stat, index) => {
                        const Icon = stat.icon
                        return (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={inView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className={`relative bg-gradient-to-br ${colorMap[stat.color as keyof typeof colorMap]} backdrop-blur-lg border rounded-2xl p-6 hover:shadow-xl hover:shadow-${stat.color}-500/20 transition-all duration-300`}
                            >
                                {/* Icon */}
                                <div className="flex items-center justify-between mb-4">
                                    <Icon className={`w-8 h-8 ${iconColorMap[stat.color as keyof typeof iconColorMap]}`} />

                                    {/* Glow effect */}
                                    <motion.div
                                        className={`w-12 h-12 rounded-full bg-${stat.color}-500/10 blur-xl absolute top-4 right-4`}
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            opacity: [0.5, 0.8, 0.5]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    />
                                </div>

                                {/* Counter */}
                                <div className="mb-2">
                                    <div className="text-4xl md:text-5xl font-bold text-white">
                                        {inView ? (
                                            <>
                                                <CountUp
                                                    end={stat.value}
                                                    duration={2.5}
                                                    decimals={stat.decimals || 0}
                                                    decimal="."
                                                />
                                                <span className="text-3xl">{stat.suffix}</span>
                                            </>
                                        ) : (
                                            <span>0{stat.suffix}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Label */}
                                <div>
                                    <div className="text-lg font-semibold text-white mb-1">
                                        {stat.label}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        {stat.subtext}
                                    </div>
                                </div>

                                {/* Shine effect on hover */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-2xl"
                                    initial={{ x: "-100%" }}
                                    whileHover={{ x: "100%" }}
                                    transition={{ duration: 0.6 }}
                                />
                            </motion.div>
                        )
                    })}
                </motion.div>
            </div>
        </section>
    )
}
