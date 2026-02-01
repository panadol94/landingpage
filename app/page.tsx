"use client"

import { useEffect, useState } from "react"
import ThemeProvider from "@/components/ThemeProvider"
import Hero from "@/components/landing/Hero"
import StatsBar from "@/components/landing/StatsBar"
import Testimonials from "@/components/landing/Testimonials"
import CTASection from "@/components/landing/CTASection"

interface ContentData {
  hero: Record<string, string>
  features: Record<string, string>
  footer: Record<string, string>
}

export default function HomePage() {
  const [content, setContent] = useState<ContentData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/content')
      const data = await res.json()
      if (data.success) {
        setContent(data.data as ContentData)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  const hero = content?.hero || {}
  const footer = content?.footer || {}

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        {/* Hero Section */}
        <Hero
          title={hero.title}
          subtitle={hero.subtitle}
          description={hero.description}
          ctaText={hero.cta_text}
          ctaUrl={hero.cta_url}
        />

        {/* Stats Bar */}
        <StatsBar />

        {/* Testimonials */}
        <Testimonials />

        {/* Main CTA Section */}
        <CTASection ctaUrl={hero.cta_url} />

        {/* Footer */}
        <footer className="container mx-auto px-4 py-12 border-t border-white/10">
          <div className="text-center space-y-4">
            <p className="text-gray-400">
              {footer.tagline || '© 2026 Masuk10. Professional Gaming Analytics & Education Platform.'}
            </p>
            <div className="flex justify-center gap-4">
              <a href="/admin" className="text-gray-500 hover:text-cyan-400 transition-colors text-sm">
                Admin
              </a>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  )
}
