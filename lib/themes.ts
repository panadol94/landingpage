/**
 * Premium Landing Page Themes for Masuk10
 * 4 Stunning themes with full customization support
 */

export interface ThemeColors {
    // Primary colors
    primary: string
    primaryLight: string
    primaryDark: string

    // Secondary colors
    secondary: string
    secondaryLight: string
    secondaryDark: string

    // Accent colors
    accent: string
    accentGlow: string

    // Background colors
    bgPrimary: string
    bgSecondary: string
    bgGradientStart: string
    bgGradientEnd: string

    // Text colors
    textPrimary: string
    textSecondary: string
    textMuted: string

    // UI colors
    border: string
    card: string
    cardHover: string
}

export interface ThemeTypography {
    fontFamily: {
        heading: string
        body: string
    }
    fontSize: {
        xs: string
        sm: string
        base: string
        lg: string
        xl: string
        '2xl': string
        '3xl': string
        '4xl': string
        '5xl': string
    }
    fontWeight: {
        normal: number
        medium: number
        semibold: number
        bold: number
        extrabold: number
    }
}

export interface ThemeAnimations {
    duration: {
        fast: string
        normal: string
        slow: string
    }
    easing: {
        default: string
        inOut: string
        spring: string
    }
    effects: {
        pulse: boolean
        float: boolean
        glow: boolean
        wave: boolean
        particles: boolean
    }
}

export interface ThemeEffects {
    blur: {
        card: string
        modal: string
    }
    shadow: {
        sm: string
        md: string
        lg: string
        glow: string
    }
    borderRadius: {
        sm: string
        md: string
        lg: string
        xl: string
    }
}

export interface ThemeConfig {
    id: string
    name: string
    displayName: string
    description: string
    previewUrl?: string
    colors: ThemeColors
    typography: ThemeTypography
    animations: ThemeAnimations
    effects: ThemeEffects
}

// ============================================
// THEME 1: CYBER NEON 🌆
// ============================================
export const cyberNeonTheme: ThemeConfig = {
    id: 'cyber-neon',
    name: 'cyber_neon',
    displayName: 'Cyber Neon',
    description: 'Futuristic cyberpunk aesthetic with electric neon lights and animated gradients',
    colors: {
        primary: '#00f5ff',        // Electric cyan
        primaryLight: '#5ffbff',
        primaryDark: '#00b8c4',

        secondary: '#ff0080',      // Hot magenta
        secondaryLight: '#ff4da6',
        secondaryDark: '#cc0066',

        accent: '#ffed00',         // Electric yellow
        accentGlow: '#ffed0080',

        bgPrimary: '#0a0a0f',      // Deep dark
        bgSecondary: '#1a1a2e',
        bgGradientStart: '#0a0a0f',
        bgGradientEnd: '#1a1a2e',

        textPrimary: '#ffffff',
        textSecondary: '#e0e0e0',
        textMuted: '#888888',

        border: '#00f5ff40',
        card: '#16161d99',
        cardHover: '#1a1a2ebb',
    },
    typography: {
        fontFamily: {
            heading: "'Orbitron', 'Rajdhani', sans-serif",
            body: "'Inter', 'Roboto', sans-serif",
        },
        fontSize: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
            '4xl': '2.25rem',
            '5xl': '3rem',
        },
        fontWeight: {
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
            extrabold: 800,
        },
    },
    animations: {
        duration: {
            fast: '150ms',
            normal: '300ms',
            slow: '500ms',
        },
        easing: {
            default: 'ease',
            inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
            spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        },
        effects: {
            pulse: true,
            float: true,
            glow: true,
            wave: true,
            particles: true,
        },
    },
    effects: {
        blur: {
            card: '12px',
            modal: '24px',
        },
        shadow: {
            sm: '0 2px 4px rgba(0,245,255,0.1)',
            md: '0 4px 8px rgba(0,245,255,0.2)',
            lg: '0 8px 16px rgba(0,245,255,0.3)',
            glow: '0 0 20px rgba(0,245,255,0.5), 0 0 40px rgba(255,0,128,0.3)',
        },
        borderRadius: {
            sm: '0.25rem',
            md: '0.5rem',
            lg: '0.75rem',
            xl: '1rem',
        },
    },
}

// ============================================
// THEME 2: GLASS MORPHISM PRO ✨
// ============================================
export const glassMorphismTheme: ThemeConfig = {
    id: 'glass-morphism',
    name: 'glass_morphism',
    displayName: 'Glass Morphism Pro',
    description: 'Ultra-modern glassmorphism with 3D depth and floating elements',
    colors: {
        primary: '#667eea',        // Soft purple
        primaryLight: '#a3b3ff',
        primaryDark: '#4c63d6',

        secondary: '#f093fb',      // Soft pink
        secondaryLight: '#ffc4ff',
        secondaryDark: '#d975e5',

        accent: '#4facfe',         // Sky blue
        accentGlow: '#4facfe80',

        bgPrimary: '#f7f8ff',      // Soft white
        bgSecondary: '#eef2ff',
        bgGradientStart: '#667eea',
        bgGradientEnd: '#4facfe',

        textPrimary: '#1a1a2e',
        textSecondary: '#4a4a68',
        textMuted: '#9999b3',

        border: '#ffffff60',
        card: '#ffffff40',
        cardHover: '#ffffff60',
    },
    typography: {
        fontFamily: {
            heading: "'Poppins', 'Inter', sans-serif",
            body: "'Inter', 'Roboto', sans-serif",
        },
        fontSize: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
            '4xl': '2.25rem',
            '5xl': '3rem',
        },
        fontWeight: {
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
            extrabold: 800,
        },
    },
    animations: {
        duration: {
            fast: '200ms',
            normal: '400ms',
            slow: '600ms',
        },
        easing: {
            default: 'ease',
            inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
            spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        },
        effects: {
            pulse: false,
            float: true,
            glow: true,
            wave: false,
            particles: false,
        },
    },
    effects: {
        blur: {
            card: '20px',
            modal: '40px',
        },
        shadow: {
            sm: '0 4px 6px rgba(102,126,234,0.1)',
            md: '0 8px 16px rgba(102,126,234,0.15)',
            lg: '0 16px 32px rgba(102,126,234,0.2)',
            glow: '0 8px 32px rgba(102,126,234,0.3)',
        },
        borderRadius: {
            sm: '0.5rem',
            md: '1rem',
            lg: '1.5rem',
            xl: '2rem',
        },
    },
}

// ============================================
// THEME 3: GRADIENT WAVE 🌊
// ============================================
export const gradientWaveTheme: ThemeConfig = {
    id: 'gradient-wave',
    name: 'gradient_wave',
    displayName: 'Gradient Wave',
    description: 'Dynamic wave animations with bold gradients and immersive experience',
    colors: {
        primary: '#f857a6',        // Bold pink
        primaryLight: '#ff8cc7',
        primaryDark: '#d93a7c',

        secondary: '#ff5858',      // Coral red
        secondaryLight: '#ff8a8a',
        secondaryDark: '#e63946',

        accent: '#ffd700',         // Gold
        accentGlow: '#ffd70080',

        bgPrimary: '#1a0a3e',      // Deep purple
        bgSecondary: '#2d1b5e',
        bgGradientStart: '#f857a6',
        bgGradientEnd: '#5b73ff',

        textPrimary: '#ffffff',
        textSecondary: '#f0e6ff',
        textMuted: '#b8a1ff',

        border: '#f857a640',
        card: '#2d1b5e99',
        cardHover: '#3d2b7ebb',
    },
    typography: {
        fontFamily: {
            heading: "'Montserrat', 'Poppins', sans-serif",
            body: "'Inter', 'Roboto', sans-serif",
        },
        fontSize: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '2rem',
            '4xl': '2.5rem',
            '5xl': '3.5rem',
        },
        fontWeight: {
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
            extrabold: 900,
        },
    },
    animations: {
        duration: {
            fast: '250ms',
            normal: '500ms',
            slow: '800ms',
        },
        easing: {
            default: 'ease-in-out',
            inOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
            spring: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
        },
        effects: {
            pulse: true,
            float: true,
            glow: true,
            wave: true,
            particles: true,
        },
    },
    effects: {
        blur: {
            card: '16px',
            modal: '32px',
        },
        shadow: {
            sm: '0 4px 8px rgba(248,87,166,0.2)',
            md: '0 8px 16px rgba(248,87,166,0.3)',
            lg: '0 16px 32px rgba(248,87,166,0.4)',
            glow: '0 0 40px rgba(248,87,166,0.6), 0 0 80px rgba(91,115,255,0.4)',
        },
        borderRadius: {
            sm: '0.5rem',
            md: '1rem',
            lg: '1.5rem',
            xl: '2rem',
        },
    },
}

// ============================================
// THEME 4: DARK LUXURY 👑
// ============================================
export const darkLuxuryTheme: ThemeConfig = {
    id: 'dark-luxury',
    name: 'dark_luxury',
    displayName: 'Dark Luxury',
    description: 'Premium dark theme with gold accents and sophisticated elegance',
    colors: {
        primary: '#d4af37',        // Classic gold
        primaryLight: '#f4d06f',
        primaryDark: '#a88b2d',

        secondary: '#8b7355',      // Bronze
        secondaryLight: '#b39876',
        secondaryDark: '#6b5534',

        accent: '#ff6b35',         // Burnt orange
        accentGlow: '#ff6b3580',

        bgPrimary: '#0f0f0f',      // Pure dark
        bgSecondary: '#1a1a1a',
        bgGradientStart: '#0f0f0f',
        bgGradientEnd: '#2a2520',

        textPrimary: '#f5f5f5',
        textSecondary: '#d4d4d4',
        textMuted: '#999999',

        border: '#d4af3730',
        card: '#1a1a1a99',
        cardHover: '#2a2520bb',
    },
    typography: {
        fontFamily: {
            heading: "'Playfair Display', 'Cormorant Garamond', serif",
            body: "'Inter', 'Lato', sans-serif",
        },
        fontSize: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
            '4xl': '2.5rem',
            '5xl': '3.5rem',
        },
        fontWeight: {
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
            extrabold: 800,
        },
    },
    animations: {
        duration: {
            fast: '200ms',
            normal: '400ms',
            slow: '700ms',
        },
        easing: {
            default: 'ease',
            inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
            spring: 'cubic-bezier(0.34, 1.2, 0.64, 1)',
        },
        effects: {
            pulse: false,
            float: false,
            glow: true,
            wave: false,
            particles: false,
        },
    },
    effects: {
        blur: {
            card: '8px',
            modal: '16px',
        },
        shadow: {
            sm: '0 2px 8px rgba(212,175,55,0.1)',
            md: '0 4px 16px rgba(212,175,55,0.15)',
            lg: '0 8px 32px rgba(212,175,55,0.2)',
            glow: '0 0 30px rgba(212,175,55,0.4)',
        },
        borderRadius: {
            sm: '0.25rem',
            md: '0.5rem',
            lg: '0.75rem',
            xl: '1rem',
        },
    },
}

// Export all themes
export const THEMES = [
    cyberNeonTheme,
    glassMorphismTheme,
    gradientWaveTheme,
    darkLuxuryTheme,
]

// Helper function to get theme by name
export function getThemeByName(name: string): ThemeConfig | undefined {
    return THEMES.find(theme => theme.name === name)
}

// Helper function to convert theme config to CSS variables
export function themeToCSSVars(theme: ThemeConfig): Record<string, string> {
    return {
        // Colors
        '--color-primary': theme.colors.primary,
        '--color-primary-light': theme.colors.primaryLight,
        '--color-primary-dark': theme.colors.primaryDark,
        '--color-secondary': theme.colors.secondary,
        '--color-secondary-light': theme.colors.secondaryLight,
        '--color-secondary-dark': theme.colors.secondaryDark,
        '--color-accent': theme.colors.accent,
        '--color-accent-glow': theme.colors.accentGlow,
        '--color-bg-primary': theme.colors.bgPrimary,
        '--color-bg-secondary': theme.colors.bgSecondary,
        '--color-bg-gradient-start': theme.colors.bgGradientStart,
        '--color-bg-gradient-end': theme.colors.bgGradientEnd,
        '--color-text-primary': theme.colors.textPrimary,
        '--color-text-secondary': theme.colors.textSecondary,
        '--color-text-muted': theme.colors.textMuted,
        '--color-border': theme.colors.border,
        '--color-card': theme.colors.card,
        '--color-card-hover': theme.colors.cardHover,

        // Typography
        '--font-heading': theme.typography.fontFamily.heading,
        '--font-body': theme.typography.fontFamily.body,

        // Animations
        '--duration-fast': theme.animations.duration.fast,
        '--duration-normal': theme.animations.duration.normal,
        '--duration-slow': theme.animations.duration.slow,

        // Effects
        '--blur-card': theme.effects.blur.card,
        '--blur-modal': theme.effects.blur.modal,
        '--shadow-glow': theme.effects.shadow.glow,
        '--radius-lg': theme.effects.borderRadius.lg,
        '--radius-xl': theme.effects.borderRadius.xl,
    }
}
