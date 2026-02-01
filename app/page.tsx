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
        <footer className="relative overflow-hidden">
          {/* Premium gradient border */}
          <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Educational Disclaimer */}
              <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">⚠️</span>
                  <div>
                    <h3 className="text-yellow-400 font-bold text-lg mb-2">Educational Disclaimer</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Masuk10 is an educational platform providing gaming analytics, statistical insights, and strategy learning resources.
                      Results vary based on individual learning and application. We do not guarantee specific outcomes or financial returns.
                      All content is for educational purposes only.
                    </p>
                  </div>
                </div>
              </div>

              {/* Main Footer Content */}
              <div className="text-center space-y-6">
                <p className="text-gray-400 text-lg">
                  {footer.tagline || '© 2026 Masuk10. Professional Gaming Analytics & Education Platform.'}
                </p>

                {/* Legal Links */}
                <div className="flex flex-wrap justify-center gap-6 text-sm">
                  <a href="/terms" className="text-gray-500 hover:text-cyan-400 transition-colors">
                    Terms of Service
                  </a>
                  <span className="text-gray-700">•</span>
                  <a href="/privacy" className="text-gray-500 hover:text-cyan-400 transition-colors">
                    Privacy Policy
                  </a>
                  <span className="text-gray-700">•</span>
                  <a href="/disclaimer" className="text-gray-500 hover:text-cyan-400 transition-colors">
                    Educational Disclaimer
                  </a>
                  <span className="text-gray-700">•</span>
                  <a href="/responsible-gaming" className="text-gray-500 hover:text-cyan-400 transition-colors">
                    Responsible Gaming
                  </a>
                  <span className="text-gray-700">•</span>
                  <a href="/admin" className="text-gray-500 hover:text-cyan-400 transition-colors">
                    Admin
                  </a>
                </div>

                {/* Additional Info */}
                <p className="text-gray-500 text-xs max-w-2xl mx-auto">
                  This platform is designed for educational and analytical purposes. All strategies and insights shared are based on statistical analysis and should be used responsibly as part of your learning journey.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  )
}
