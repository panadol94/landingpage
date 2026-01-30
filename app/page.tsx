"use client"

import { useEffect, useState } from "react"
import { ExternalLink, Zap, BarChart3 } from "lucide-react"

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
  const features = content?.features || {}
  const footer = content?.footer || {}

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero  Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* Logo */}
          <div className="inline-block">
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {hero.title || 'Masuk10'}
            </h1>
          </div>

          {/* Hero Text */}
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              {hero.subtitle || 'Platform Gaming & Link Pendek Terbaik'}
            </h2>
            <p className="text-xl text-gray-300">
              {hero.description || 'Dapatkan tips gaming terkini dan cipta shortlink dalam sekelip mata'}
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex gap-4 justify-center">
            <a
              href={hero.cta_url || 'https://wa.me/60123456789'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/50"
            >
              {hero.cta_text || 'Mulakan Sekarang'}
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {features.title || 'Kenapa Pilih Masuk10?'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-colors group">
            <div className="text-4xl mb-4">
              <Zap className="text-cyan-400" size={48} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              {features.feature1_title || '🎮 Tips Gaming Terkini'}
            </h3>
            <p className="text-gray-300">
              {features.feature1_desc || 'Dapatkan strategi dan tips terbaik untuk game popular'}
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-colors group">
            <div className="text-4xl mb-4">
              <ExternalLink className="text-emerald-400" size={48} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              {features.feature2_title || '🔗 Shortlink Pantas'}
            </h3>
            <p className="text-gray-300">
              {features.feature2_desc || 'Cipta link pendek dalam sekelip mata'}
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-colors group">
            <div className="text-4xl mb-4">
              <BarChart3 className="text-purple-400" size={48} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              {features.feature3_title || '📊 Analytics Lengkap'}
            </h3>
            <p className="text-gray-300">
              {features.feature3_desc || 'Track clicks dan performance shortlink anda'}
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-white/10 mt-20">
        <div className="text-center space-y-4">
          <p className="text-gray-400">
            {footer.tagline || '© 2026 Masuk10. Platform Gaming Terpercaya.'}
          </p>
          <div className="flex justify-center gap-4">
            <a href="/admin" className="text-gray-500 hover:text-cyan-400 transition-colors text-sm">
              Admin
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
