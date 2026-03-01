'use client'

import { useEffect, useState } from 'react'

const WA_LINK = 'https://chat.whatsapp.com/Fs2uM7wePNI9WsG6I07UZI?mode=hq2tcla'

function isInAppBrowser(ua: string): boolean {
  return /TikTok|Instagram|FBAN|FBAV|Line|Snapchat|BytedanceWebview|musical_ly/i.test(ua)
}

export default function WhatsAppRedirectPage() {
  const [inApp, setInApp] = useState(false)
  const [showFallback, setShowFallback] = useState(false)

  useEffect(() => {
    const ua = navigator.userAgent || ''
    const isInApp = isInAppBrowser(ua)
    setInApp(isInApp)

    if (!isInApp) {
      // Normal browser — redirect immediately
      window.location.href = WA_LINK
      return
    }

    // In-app browser — try intent:// for Android
    if (/android/i.test(ua)) {
      const intentUrl = `intent://${WA_LINK.replace('https://', '')}#Intent;scheme=https;package=com.android.chrome;end`
      window.location.href = intentUrl

      // If intent didn't work, show fallback after 1.5s
      setTimeout(() => setShowFallback(true), 1500)
    } else {
      // iOS or other — show instructions immediately
      setShowFallback(true)
    }
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #075E54 0%, #128C7E 50%, #25D366 100%)',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#fff',
      textAlign: 'center',
    }}>
      {/* WhatsApp Icon */}
      <div style={{
        width: 90,
        height: 90,
        borderRadius: '50%',
        background: '#25D366',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}>
        <svg width="50" height="50" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </div>

      {!inApp && (
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 12 }}>
            Redirecting ke WhatsApp...
          </h1>
          <p style={{ opacity: 0.8, fontSize: 14 }}>Sila tunggu sebentar</p>
          <div style={{ marginTop: 20 }}>
            <a
              href={WA_LINK}
              style={{
                display: 'inline-block',
                background: '#fff',
                color: '#075E54',
                padding: '14px 36px',
                borderRadius: 30,
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              💬 Buka WhatsApp
            </a>
          </div>
        </div>
      )}

      {inApp && (
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>
            Join WhatsApp Group
          </h1>

          {!showFallback && (
            <p style={{ opacity: 0.8, fontSize: 14, marginTop: 12 }}>
              Opening browser...
            </p>
          )}

          {showFallback && (
            <div style={{ marginTop: 16 }}>
              <div style={{
                background: 'rgba(255,255,255,0.15)',
                borderRadius: 16,
                padding: '20px 24px',
                marginBottom: 20,
                backdropFilter: 'blur(10px)',
              }}>
                <p style={{ fontSize: 15, lineHeight: 1.6, margin: 0 }}>
                  ⚠️ Link WhatsApp tak boleh dibuka dari dalam app ni.
                </p>
                <p style={{ fontSize: 15, lineHeight: 1.6, margin: '12px 0 0', fontWeight: 600 }}>
                  Sila ikut langkah berikut:
                </p>
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: 16,
                padding: '16px 20px',
                marginBottom: 20,
                textAlign: 'left',
              }}>
                <p style={{ fontSize: 15, margin: '0 0 12px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ background: '#25D366', borderRadius: '50%', width: 28, height: 28, minWidth: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>1</span>
                  <span>Tekan <b>⋮</b> (3 titik) atau <b>⋯</b> di atas kanan</span>
                </p>
                <p style={{ fontSize: 15, margin: '0 0 12px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ background: '#25D366', borderRadius: '50%', width: 28, height: 28, minWidth: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>2</span>
                  <span>Pilih <b>&quot;Open in browser&quot;</b> atau <b>&quot;Buka di browser&quot;</b></span>
                </p>
                <p style={{ fontSize: 15, margin: 0, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ background: '#25D366', borderRadius: '50%', width: 28, height: 28, minWidth: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>3</span>
                  <span>WhatsApp akan terbuka secara automatik ✅</span>
                </p>
              </div>

              {/* Copy link button */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(WA_LINK).then(() => {
                    alert('Link disalin! Paste di browser.')
                  }).catch(() => {
                    // Fallback for older devices
                    const el = document.createElement('textarea')
                    el.value = WA_LINK
                    document.body.appendChild(el)
                    el.select()
                    document.execCommand('copy')
                    document.body.removeChild(el)
                    alert('Link disalin! Paste di browser.')
                  })
                }}
                style={{
                  display: 'inline-block',
                  background: '#fff',
                  color: '#075E54',
                  padding: '14px 36px',
                  borderRadius: 30,
                  border: 'none',
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: 'pointer',
                  marginBottom: 12,
                }}
              >
                📋 Salin Link
              </button>

              <br />

              <a
                href={WA_LINK}
                style={{
                  display: 'inline-block',
                  color: '#fff',
                  padding: '10px 24px',
                  fontSize: 14,
                  textDecoration: 'underline',
                  opacity: 0.8,
                }}
              >
                Cuba buka terus →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
