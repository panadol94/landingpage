"use client"

import { useCallback } from "react"
import Particles from "react-tsparticles"
import type { Engine } from "tsparticles-engine"
import { loadSlim } from "tsparticles-slim"

export default function ParticlesBackground() {
    const particlesInit = useCallback(async (engine: Engine) => {
        await loadSlim(engine)
    }, [])

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            options={{
                background: {
                    color: {
                        value: "transparent",
                    },
                },
                fpsLimit: 30, // Reduced from 120 for better performance
                interactivity: {
                    events: {
                        onClick: {
                            enable: false, // Disabled to reduce CPU usage
                            mode: "push",
                        },
                        onHover: {
                            enable: false, // Disabled repulse for performance
                            mode: "repulse",
                        },
                        resize: true,
                    },
                    modes: {
                        push: {
                            quantity: 2,
                        },
                        repulse: {
                            distance: 80,
                            duration: 0.3,
                        },
                    },
                },
                particles: {
                    color: {
                        value: ["#06b6d4", "#8b5cf6"], // Reduced colors
                    },
                    links: {
                        color: "#06b6d4",
                        distance: 120, // Reduced from 150
                        enable: true,
                        opacity: 0.15, // Reduced opacity
                        width: 1,
                    },
                    move: {
                        direction: "none",
                        enable: true,
                        outModes: {
                            default: "bounce",
                        },
                        random: false,
                        speed: 0.5, // Slower movement for less CPU
                        straight: false,
                    },
                    number: {
                        density: {
                            enable: true,
                            area: 1000, // Increased area = fewer particles per space
                        },
                        value: 25, // Reduced from 60 for performance
                    },
                    opacity: {
                        value: 0.3,
                    },
                    shape: {
                        type: "circle",
                    },
                    size: {
                        value: { min: 1, max: 3 },
                    },
                },
                detectRetina: true,
            }}
            className="absolute inset-0 z-0"
        />
    )
}
