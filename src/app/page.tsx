'use client'

import { useState, useEffect } from 'react'

// Supabase config
const SUPABASE_URL = 'https://efjkmnynetnivthjcajv.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_0XXSlSALspgR73tU2AiQoQ_Q3iEidzU'

interface Haber {
  id: number
  baslik: string
  ozet: string
  icerik: string
  kategori: string
  resim_url: string
  yazar: string
  yayinlanma_tarihi: string
  okunma_sayisi: number
}

export default function Home() {
  const [haberler, setHaberler] = useState<Haber[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('TÜMÜ')
  const [scrolled, setScrolled] = useState(false)
  const [currentTicker, setCurrentTicker] = useState(0)

  const categories = ['TÜMÜ', 'GÜNDEM', 'EKONOMİ', 'SPOR', 'KÜLTÜR', 'EĞİTİM', 'SAĞLIK']

  // Fetch haberler from Supabase
  useEffect(() => {
    async function fetchHaberler() {
      try {
        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/haberler?select=*&order=yayinlanma_tarihi.desc&limit=20`,
          {
            headers: {
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
          }
        )
        const data = await response.json()
        setHaberler(data)
      } catch (error) {
        console.error('Haberler yüklenirken hata:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchHaberler()
  }, [])

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Ticker rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTicker(prev => (prev + 1) % Math.min(haberler.length, 3))
    }, 4000)
    return () => clearInterval(interval)
  }, [haberler.length])

  const filteredHaberler = activeCategory === 'TÜMÜ' 
    ? haberler 
    : haberler.filter(h => h.kategori === activeCategory)

  const mansetHaber = filteredHaberler[0]
  const digerHaberler = filteredHaberler.slice(1, 7)
  const sonDakikaHaberler = haberler.slice(0, 3)

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-bordo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-bordo-800 font-serif text-xl">Haberler Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`transition-all duration-500 ${scrolled ? 'w-10 h-10' : 'w-14 h-14'} bg-gradient-to-br from-bordo-700 to-bordo-900 rounded-xl flex items-center justify-center shadow-lg`}>
                <span className="text-amber-400 font-bold text-lg">İG</span>
              </div>
              <div>
                <h1 className={`font-serif font-bold transition-all duration-500 ${scrolled ? 'text-xl' : 'text-2xl'} text-bordo-900`}>
                  İnegöl Gündem
                </h1>
                <p className={`text-bordo-600 transition-all duration-500 ${scrolled ? 'text-xs' : 'text-sm'}`}>
                  Güncel • Tarafssatisfied • Güvenilir
                </p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              {categories.slice(1, 5).map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-sm font-medium transition-colors ${
                    activeCategory === cat ? 'text-bordo-700' : 'text-stone-600 hover:text-bordo-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Haber ara..." 
                  className="pl-10 pr-4 py-2 bg-stone-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-bordo-500 w-40 lg:w-56"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Son Dakika Ticker */}
      {sonDakikaHaberler.length > 0 && (
        <div className="fixed top-20 left-0 right-0 z-40 bg-gradient-to-r from-red-700 via-red-600 to-red-700">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-4">
            <span className="bg-white text-red-600 px-3 py-1 rounded text-xs font-bold animate-pulse flex items-center gap-1">
              <span className="w-2 h-2 bg-red-600 rounded-full"></span>
              SON DAKİKA
            </span>
            <div className="flex-1 overflow-hidden">
              <p className="text-white text-sm font-medium truncate animate-slide-in">
                {sonDakikaHaberler[currentTicker]?.baslik}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hero / Manşet */}
      {mansetHaber && (
        <section className="pt-36 pb-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="relative h-[70vh] rounded-3xl overflow-hidden group cursor-pointer">
              <img 
                src={mansetHaber.resim_url || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&q=80'} 
                alt={mansetHaber.baslik}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                <span className="inline-block bg-bordo-600 text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
                  {mansetHaber.kategori}
                </span>
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4 leading-tight">
                  {mansetHaber.baslik}
                </h2>
                <p className="text-stone-200 text-lg md:text-xl max-w-3xl mb-6">
                  {mansetHaber.ozet}
                </p>
                <div className="flex items-center gap-4 text-stone-300 text-sm">
                  <span>{mansetHaber.yazar}</span>
                  <span>•</span>
                  <span>{new Date(mansetHaber.yayinlanma_tarihi).toLocaleDateString('tr-TR')}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Kategoriler */}
      <section className="py-4 px-4 border-b border-stone-200 sticky top-32 bg-white/95 backdrop-blur-md z-30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat 
                    ? 'bg-bordo-700 text-white shadow-lg' 
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Haber Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {digerHaberler.map((haber, index) => (
              <article 
                key={haber.id} 
                className="group cursor-pointer animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-56 rounded-2xl overflow-hidden mb-4">
                  <img 
                    src={haber.resim_url || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&q=80'} 
                    alt={haber.baslik}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-bordo-700 px-3 py-1 rounded-full text-xs font-medium">
                    {haber.kategori}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold text-stone-800 mb-2 group-hover:text-bordo-700 transition-colors line-clamp-2">
                  {haber.baslik}
                </h3>
                <p className="text-stone-600 text-sm line-clamp-2 mb-3">
                  {haber.ozet}
                </p>
                <div className="flex items-center gap-3 text-xs text-stone-500">
                  <span>{haber.yazar}</span>
                  <span>•</span>
                  <span>{new Date(haber.yayinlanma_tarihi).toLocaleDateString('tr-TR')}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Sidebar bölümü - Hava Durumu & Döviz */}
      <section className="py-12 px-4 bg-stone-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Hava Durumu */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
                İnegöl Hava Durumu
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-5xl font-light">12°</p>
                  <p className="text-blue-200">Parçalı Bulutlu</p>
                </div>
                <svg className="w-20 h-20 text-yellow-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z" />
                </svg>
              </div>
            </div>

            {/* Döviz */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-medium text-stone-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Döviz Kurları
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-stone-600">USD/TRY</span>
                  <span className="font-semibold text-stone-800">34.85 ₺</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-600">EUR/TRY</span>
                  <span className="font-semibold text-stone-800">36.42 ₺</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-600">Gram Altın</span>
                  <span className="font-semibold text-stone-800">2,945 ₺</span>
                </div>
              </div>
            </div>

            {/* Sosyal Medya */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-medium text-stone-800 mb-4">Bizi Takip Edin</h3>
              <div className="grid grid-cols-3 gap-4">
                <a href="#" className="flex flex-col items-center p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors">
                  <span className="text-2xl mb-1">📘</span>
                  <span className="text-xs text-stone-600">Facebook</span>
                </a>
                <a href="#" className="flex flex-col items-center p-3 rounded-xl bg-sky-50 hover:bg-sky-100 transition-colors">
                  <span className="text-2xl mb-1">🐦</span>
                  <span className="text-xs text-stone-600">Twitter</span>
                </a>
                <a href="#" className="flex flex-col items-center p-3 rounded-xl bg-pink-50 hover:bg-pink-100 transition-colors">
                  <span className="text-2xl mb-1">📷</span>
                  <span className="text-xs text-stone-600">Instagram</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-4 bg-gradient-to-br from-bordo-800 to-bordo-950">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-serif font-bold text-white mb-4">
            Güncel Haberlerden Haberdar Olun
          </h2>
          <p className="text-bordo-200 mb-8">
            E-posta bültenimize abone olun, önemli gelişmeleri kaçırmayın.
          </p>
          <form className="flex gap-3 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="E-posta adresiniz" 
              className="flex-1 px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-bordo-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-bordo-900 font-semibold rounded-full transition-colors">
              Abone Ol
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-bordo-600 to-bordo-800 rounded-xl flex items-center justify-center">
                  <span className="text-amber-400 font-bold text-lg">İG</span>
                </div>
                <div>
                  <h3 className="font-serif font-bold text-white text-lg">İnegöl Gündem</h3>
                  <p className="text-xs">Güncel • Tarafsız • Güvenilir</p>
                </div>
              </div>
              <p className="text-sm">
                İnegöl ve çevresinin en güncel haber kaynağı. 7/24 kesintisiz haber akışı.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Kategoriler</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Gündem</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Ekonomi</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Spor</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kültür</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Kurumsal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Hakkımızda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">İletişim</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Künye</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Reklam</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">İletişim</h4>
              <ul className="space-y-2 text-sm">
                <li>📍 İnegöl, Bursa</li>
                <li>📧 info@inegolgundem.com</li>
                <li>📞 (0224) 000 00 00</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-800 pt-8 text-center text-sm">
            <p>© 2024 İnegöl Gündem. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
