import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'İnegöl Gündem - İnegöl\'ün Haber Portalı',
  description: 'İnegöl\'den en güncel haberler, yerel etkinlikler, spor, ekonomi ve daha fazlası. İnegöl\'ün en güvenilir haber kaynağı.',
  keywords: 'İnegöl, haber, gündem, Bursa, yerel haber, İnegöl haberleri',
  openGraph: {
    title: 'İnegöl Gündem - İnegöl\'ün Haber Portalı',
    description: 'İnegöl\'den en güncel haberler',
    url: 'https://inegolgundem.com',
    siteName: 'İnegöl Gündem',
    locale: 'tr_TR',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
