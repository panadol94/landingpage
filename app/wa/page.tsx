'use client'

import { useState } from 'react'

const WA_LINK = 'https://chat.whatsapp.com/Fs2uM7wePNI9WsG6I07UZI?mode=hq2tcla'

export default function WhatsAppRedirectPage() {
  const [copied, setCopied] = useState(false)
  const [showSteps, setShowSteps] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(WA_LINK)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch {
      const el = document.createElement('textarea')
      el.value = WA_LINK
      el.style.position = 'fixed'
      el.style.opacity = '0'
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    }
  }

  const handleOpen = () => {
    // Try opening in new window/tab to escape in-app browser
    const newWin = window.open(WA_LINK, '_blank')
    
    // If blocked or still in-app, show steps after short delay
    setTimeout(() => {
      setShowSteps(true)
    }, 2000)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #075E54 0%, #128C7E 50%, #25D366 100%)',
      padding: '24px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#fff',
      textAlign: 'center',
    }}>
      {/* WhatsApp Icon */}
      <div style={{
        width: 80,
        height: 80,
        borderRadius: '50%',
        background: '#25D366',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}>
        <svg width="44" height="44" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </div>

      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6, margin: '0 0 6px' }}>
        Join Group WhatsApp
      </h1>
      <p style={{ opacity: 0.8, fontSize: 14, margin: '0 0 24px' }}>
        Tekan button di bawah untuk join
      </p>

      {/* Main CTA button */}
      <button
        onClick={handleOpen}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          background: '#fff',
          color: '#075E54',
          padding: '16px 40px',
          borderRadius: 30,
          border: 'none',
          fontWeight: 700,
          fontSize: 17,
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          marginBottom: 14,
        }}
      >
        💬 Buka WhatsApp
      </button>

      {/* Copy link button */}
      <button
        onClick={handleCopy}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          background: 'rgba(255,255,255,0.2)',
          color: '#fff',
          padding: '12px 32px',
          borderRadius: 30,
          border: '1.5px solid rgba(255,255,255,0.4)',
          fontWeight: 600,
          fontSize: 15,
          cursor: 'pointer',
          backdropFilter: 'blur(4px)',
          marginBottom: 24,
        }}
      >
        {copied ? '✅ Disalin!' : '📋 Salin Link'}
      </button>

      {/* Always-visible help box */}
      <div style={{
        background: 'rgba(0,0,0,0.2)',
        borderRadius: 16,
        padding: '18px 22px',
        maxWidth: 340,
        backdropFilter: 'blur(10px)',
        textAlign: 'left',
      }}>
        <p style={{ fontSize: 13, margin: '0 0 14px', opacity: 0.9, textAlign: 'center', fontWeight: 600 }}>
          ⚠️ Tak dapat buka? Ikut langkah ni:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14 }}>
            <span style={{ background: '#25D366', borderRadius: '50%', width: 24, height: 24, minWidth: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>1</span>
            <span>Tekan <b>⋮</b> atau <b>⋯</b> di atas kanan screen</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14 }}>
            <span style={{ background: '#25D366', borderRadius: '50%', width: 24, height: 24, minWidth: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>2</span>
            <span>Pilih <b>&quot;Open in browser&quot;</b></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14 }}>
            <span style={{ background: '#25D366', borderRadius: '50%', width: 24, height: 24, minWidth: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>3</span>
            <span>WhatsApp akan buka ✅</span>
          </div>
        </div>
        <p style={{ fontSize: 12, margin: '14px 0 0', opacity: 0.7, textAlign: 'center' }}>
          Atau tekan &quot;Salin Link&quot; dan paste di Chrome / Safari
        </p>
      </div>
    </div>
  )
}
