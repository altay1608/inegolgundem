'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

interface Haber {
  id: number
  kategori: string
  baslik: string
  ozet: string
  icerik?: string
  resim_url?: string
  yazar?: string
  created_at?: string
}

const kategoriler = [
  { id: 'tumu', isim: 'Tümü', renk: '#1a1a1a', icon: '📰' },
  { id: 'gundem', isim: 'Gündem', renk: '#DC2626', icon: '🔴' },
  { id: 'ekonomi', isim: 'Ekonomi', renk: '#059669', icon: '📈' },
  { id: 'spor', isim: 'Spor', renk: '#2563EB', icon: '⚽' },
  { id: 'kultur', isim: 'Kültür', renk: '#7C3AED', icon: '🎭' },
  { id: 'yasam', isim: 'Yaşam', renk: '#EA580C', icon: '🌟' },
  { id: 'saglik', isim: 'Sağlık', renk: '#0891B2', icon: '🏥' },
]

const sonDakikaHaberleri = [
  "🔴 Belediye'den su kesintisi duyurusu: Yarın 4 mahallede su kesilecek",
  "⚽ İnegölspor'a yeni transfer müjdesi",
  "📈 Mobilya fuarı için geri sayım başladı",
  "🏥 Sağlık Bakanlığı'ndan yeni hastane müjdesi"
]

function getKategoriRenk(kategori: string): string {
  if (!kategori) return '#666'
  const k = kategori.toLowerCase().replace(/[üışğöç]/g, c => ({ü:'u',ı:'i',ş:'s',ğ:'g',ö:'o',ç:'c'}[c] || c))
  const kat = kategoriler.find(x => x.isim.toLowerCase().replace(/[üışğöç]/g, c => ({ü:'u',ı:'i',ş:'s',ğ:'g',ö:'o',ç:'c'}[c] || c)) === k)
  return kat?.renk || '#666'
}

function formatTarih(dateStr?: string): string {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return dateStr
  }
}

function formatSaat(dateStr?: string): string {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

function IhracFazlasiAd({ variant = 'horizontal' }: { variant?: 'horizontal' | 'square' | 'wide' }) {
  if (variant === 'square') {
    return (
      <a href="https://maps.google.com/?q=İhraç+Fazlası+Giyim+İnegöl" target="_blank" rel="noopener noreferrer" className="block group">
        <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-2xl p-5 text-white relative overflow-hidden shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">👕</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-medium">REKLAM</span>
            </div>
            <h3 className="text-lg font-black leading-tight mb-1">İhraç Fazlası</h3>
            <h4 className="text-xl font-black text-yellow-300 mb-2">GİYİM İNEGÖL</h4>
            <div className="flex items-center gap-1 mb-2">
              {[1,2,3,4,5].map(i => <span key={i} className="text-yellow-400 text-sm">★</span>)}
              <span className="text-xs text-white/80 ml-1">5.0 (57)</span>
            </div>
            <p className="text-xs text-white/90 mb-2">Markalı ürünlerde uygun fiyatlar!</p>
            <div className="flex items-center gap-2 text-xs text-white/80 mb-3">
              <span>📍 Ertuğrulgazi Mah.</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs bg-green-500 px-2 py-1 rounded-full font-medium">✓ Açık</span>
              <span className="text-xs font-bold group-hover:underline">📞 0538 479 36 96</span>
            </div>
          </div>
        </div>
      </a>
    )
  }
  if (variant === 'wide') {
    return (
      <a href="tel:+905384793696" className="block group">
        <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 rounded-2xl p-4 sm:p-6 text-white relative overflow-hidden shadow-lg hover:shadow-xl transition-all">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl shrink-0">👕</div>
              <div>
                <p className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-medium inline-block mb-1">REKLAM</p>
                <h3 className="text-lg sm:text-xl font-black">İhraç Fazlası Giyim İnegöl</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex">{[1,2,3,4,5].map(i => <span key={i} className="text-yellow-400 text-xs">★</span>)}</div>
                  <span className="text-xs text-white/80">5.0 (57)</span>
                  <span className="text-xs bg-green-500 px-2 py-0.5 rounded-full">Açık</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center sm:text-right">
                <p className="text-xs text-white/70">Hemen Ara</p>
                <p className="text-lg font-bold">0538 479 36 96</p>
              </div>
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </div>
            </div>
          </div>
        </div>
      </a>
    )
  }
  return (
    <a href="tel:+905384793696" className="block group">
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 py-2.5 px-4 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 sm:gap-6 text-sm">
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-medium shrink-0">REKLAM</span>
          <span className="font-bold">👕 İhraç Fazlası Giyim İnegöl</span>
          <span className="hidden md:flex items-center gap-1">{[1,2,3,4,5].map(i => <span key={i} className="text-yellow-400">★</span>)}</span>
          <span className="hidden lg:inline text-white/90">📍 Ertuğrulgazi Mah.</span>
          <span className="bg-white text-purple-600 px-3 py-1 rounded-full text-xs font-bold group-hover:bg-yellow-400 transition-colors">📞 0538 479 36 96</span>
        </div>
      </div>
    </a>
  )
}

function YalduzWebAd({ variant = 'horizontal' }: { variant?: 'horizontal' | 'square' | 'wide' }) {
  if (variant === 'square') {
    return (
      <a href="tel:+905495261608" className="block group">
        <div className="bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-700 rounded-2xl p-5 text-white relative overflow-hidden shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-cyan-400/20 rounded-full blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">💻</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-medium">REKLAM</span>
            </div>
            <h3 className="text-lg font-black leading-tight mb-1">YALDUZ Web & SEO</h3>
            <h4 className="text-base font-bold text-cyan-300 mb-2">İnegöl Web Tasarım</h4>
            <div className="space-y-1 mb-3">
              <p className="text-xs text-white/90 flex items-center gap-1">✓ Profesyonel Web Sitesi</p>
              <p className="text-xs text-white/90 flex items-center gap-1">✓ SEO & E-Ticaret</p>
              <p className="text-xs text-white/90 flex items-center gap-1">✓ Sosyal Medya Yönetimi</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/80 mb-3">
              <span className="bg-green-500 px-2 py-0.5 rounded-full">🟢 24 Saat Açık</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs">📍 İnegöl Bölgesi</span>
              <span className="text-xs font-bold group-hover:underline">Ara →</span>
            </div>
          </div>
        </div>
      </a>
    )
  }
  if (variant === 'wide') {
    return (
      <a href="tel:+905495261608" className="block group">
        <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 rounded-2xl p-4 sm:p-6 text-white relative overflow-hidden shadow-lg hover:shadow-xl transition-all">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl shrink-0">💻</div>
              <div>
                <p className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-medium inline-block mb-1">REKLAM</p>
                <h3 className="text-lg sm:text-xl font-black">YALDUZ Web & SEO | İnegöl Web Tasarım</h3>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-white/80">
                  <span>✓ Web Sitesi</span>
                  <span>✓ SEO</span>
                  <span>✓ E-Ticaret</span>
                  <span className="bg-green-500 px-2 py-0.5 rounded-full text-white">24 Saat</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center sm:text-right">
                <p className="text-xs text-white/70">Ücretsiz Teklif Al</p>
                <p className="text-lg font-bold">0549 526 16 08</p>
              </div>
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </div>
            </div>
          </div>
        </div>
      </a>
    )
  }
  return (
    <a href="tel:+905495261608" className="block group">
      <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 py-2.5 px-4 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 sm:gap-6 text-sm">
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-medium shrink-0">REKLAM</span>
          <span className="font-bold">💻 YALDUZ Web & SEO | İnegöl</span>
          <span className="hidden md:inline text-white/90">Web Tasarım • SEO • E-Ticaret</span>
          <span className="hidden lg:inline text-xs bg-green-500 px-2 py-0.5 rounded-full">24 Saat Açık</span>
          <span className="bg-white text-blue-600 px-3 py-1 rounded-full text-xs font-bold group-hover:bg-cyan-400 transition-colors">📞 0549 526 16 08</span>
        </div>
      </div>
    </a>
  )
}

export default function Home() {
  const [haberler, setHaberler] = useState<Haber[]>([])
  const [yukleniyor, setYukleniyor] = useState(true)
  const [scrollY, setScrollY] = useState(0)
  const [aktifKategori, setAktifKategori] = useState('tumu')
  const [menuAcik, setMenuAcik] = useState(false)
  const [sonDakikaIndex, setSonDakikaIndex] = useState(0)
  const [currentTime, setCurrentTime] = useState('')
  const [aramaAcik, setAramaAcik] = useState(false)
  const [aramaMetni, setAramaMetni] = useState('')
  const [headerAd, setHeaderAd] = useState(0)

  const loadHaberler = useCallback(async () => {
    setYukleniyor(true)
    try {
      const { data, error } = await supabase
        .from('haberler')
        .select('*')
        .order('id', { ascending: false })
        .limit(50)
      
      if (error) {
        console.error('Supabase error:', error)
      } else if (data && data.length > 0) {
        setHaberler(data)
      }
    } catch (e) {
      console.error('Fetch error:', e)
    }
    setYukleniyor(false)
  }, [])

  useEffect(() => { loadHaberler(); const i = setInterval(loadHaberler, 300000); return () => clearInterval(i) }, [loadHaberler])
  useEffect(() => { const h = () => setScrollY(window.scrollY); window.addEventListener('scroll', h, { passive: true }); return () => window.removeEventListener('scroll', h) }, [])
  useEffect(() => { const i = setInterval(() => setSonDakikaIndex(p => (p + 1) % sonDakikaHaberleri.length), 5000); return () => clearInterval(i) }, [])
  useEffect(() => { const u = () => setCurrentTime(new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })); u(); const i = setInterval(u, 1000); return () => clearInterval(i) }, [])
  useEffect(() => { const i = setInterval(() => setHeaderAd(p => (p + 1) % 2), 10000); return () => clearInterval(i) }, [])

  const filtrelenmis = aktifKategori === 'tumu' ? haberler : haberler.filter(h => {
    const hKat = (h.kategori || '').toLowerCase().replace(/[üışğöç]/g, c => ({ü:'u',ı:'i',ş:'s',ğ:'g',ö:'o',ç:'c'}[c] || c))
    return hKat.includes(aktifKategori)
  })
  const aranan = aramaMetni ? filtrelenmis.filter(h => (h.baslik || '').toLowerCase().includes(aramaMetni.toLowerCase())) : filtrelenmis
  const manset = aranan[0], vitrin = aranan.slice(1, 3), grid = aranan.slice(3, 7), liste = aranan.slice(7, 15)

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="transition-all duration-500">
        {headerAd === 0 ? <IhracFazlasiAd variant="horizontal" /> : <YalduzWebAd variant="horizontal" />}
      </div>

      <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute h-full w-full rounded-full bg-white opacity-75"></span><span className="relative rounded-full h-2.5 w-2.5 bg-white"></span></span>
            <span className="font-bold text-xs uppercase tracking-wider">Son Dakika</span>
          </div>
          <div className="flex-1 overflow-hidden"><span className="text-sm font-medium">{sonDakikaHaberleri[sonDakikaIndex]}</span></div>
          <span className="text-xs opacity-70 hidden sm:block">{currentTime}</span>
        </div>
      </div>

      <header className="sticky top-0 z-50 transition-all duration-300 bg-white" style={{ boxShadow: scrollY > 50 ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <button className="lg:hidden p-2 -ml-2" onClick={() => setMenuAcik(!menuAcik)}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuAcik ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg></button>
            <div className="flex-1 lg:flex-none text-center lg:text-left">
              <Link href="/" className="inline-block"><h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight"><span className="text-gray-900">İNEGÖL</span><span className="text-red-600">GÜNDEM</span></h1><p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-[0.2em]">Bağımsız • Güvenilir • Yerel</p></Link>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden lg:block text-right"><p className="text-sm font-semibold text-gray-900">{new Date().toLocaleDateString('tr-TR', { weekday: 'long' })}</p><p className="text-xs text-gray-500">{new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</p></div>
              <div className="relative">
                <button className="p-2 hover:bg-gray-100 rounded-full" onClick={() => setAramaAcik(!aramaAcik)}><svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></button>
                {aramaAcik && <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border p-3 z-50"><input type="text" placeholder="Haberlerde ara..." value={aramaMetni} onChange={e => setAramaMetni(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" autoFocus /></div>}
              </div>
            </div>
          </div>
          <nav className="hidden lg:flex items-center justify-center gap-1 py-2">{kategoriler.map(k => <button key={k.id} onClick={() => setAktifKategori(k.id)} className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${aktifKategori === k.id ? 'text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100'}`} style={aktifKategori === k.id ? { backgroundColor: k.renk } : {}}>{k.isim}</button>)}</nav>
        </div>
        {menuAcik && <div className="lg:hidden bg-white border-t shadow-lg"><div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 gap-2">{kategoriler.map(k => <button key={k.id} onClick={() => { setAktifKategori(k.id); setMenuAcik(false) }} className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${aktifKategori === k.id ? 'text-white' : 'bg-gray-50 text-gray-700'}`} style={aktifKategori === k.id ? { backgroundColor: k.renk } : {}}><span>{k.icon}</span>{k.isim}</button>)}</div></div>}
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
        {yukleniyor ? <div className="flex items-center justify-center py-20"><div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div></div> : aranan.length === 0 ? <div className="text-center py-20"><p className="text-6xl mb-4">🔍</p><h3 className="text-xl font-semibold mb-2">Haber Bulunamadı</h3><button onClick={() => { setAramaMetni(''); setAktifKategori('tumu'); loadHaberler() }} className="mt-4 px-6 py-2 bg-red-600 text-white rounded-full">Yenile</button></div> : (
          <div className="grid grid-cols-12 gap-6 lg:gap-8">
            <div className="col-span-12 lg:col-span-8 space-y-6">
              {manset && <Link href={`/haber/${manset.id}`}><article className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer"><div className="relative aspect-[16/9] overflow-hidden"><img src={manset.resim_url || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&q=80'} alt={manset.baslik} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div><span className="absolute top-4 left-4 px-3 py-1.5 text-xs font-bold text-white rounded-full uppercase" style={{ backgroundColor: getKategoriRenk(manset.kategori) }}>{manset.kategori}</span><div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8"><h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-3">{manset.baslik}</h2><p className="text-white/80 text-sm sm:text-base line-clamp-2 mb-4">{manset.ozet}</p><div className="flex items-center gap-4 text-white/60 text-sm"><span>{manset.yazar || 'Editör'}</span><span>{formatTarih(manset.created_at)}</span></div></div></div></article></Link>}
              
              <YalduzWebAd variant="wide" />

              {vitrin.length > 0 && <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">{vitrin.map(h => <Link href={`/haber/${h.id}`} key={h.id}><article className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg cursor-pointer"><div className="relative aspect-[4/3] overflow-hidden"><img src={h.resim_url || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&q=80'} alt={h.baslik} className="w-full h-full object-cover group-hover:scale-105 transition-transform" /><span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold text-white rounded-full uppercase" style={{ backgroundColor: getKategoriRenk(h.kategori) }}>{h.kategori}</span></div><div className="p-4"><h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-red-600 mb-2">{h.baslik}</h3><p className="text-gray-500 text-sm line-clamp-2 mb-3">{h.ozet}</p><div className="flex justify-between text-xs text-gray-400"><span>{h.yazar || 'Editör'}</span><span>{formatTarih(h.created_at)}</span></div></div></article></Link>)}</div>}
              
              <IhracFazlasiAd variant="wide" />

              {grid.length > 0 && <div><div className="flex items-center gap-3 mb-4"><h2 className="text-xl font-bold">Son Haberler</h2><div className="flex-1 h-px bg-gray-200"></div></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{grid.map(h => <Link href={`/haber/${h.id}`} key={h.id}><article className="group flex gap-4 bg-white p-4 rounded-xl hover:bg-gray-50 cursor-pointer"><div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-lg overflow-hidden"><img src={h.resim_url || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&q=80'} alt={h.baslik} className="w-full h-full object-cover group-hover:scale-110 transition-transform" /></div><div className="flex-1 min-w-0"><span className="inline-block px-2 py-0.5 text-[10px] font-bold text-white rounded mb-2" style={{ backgroundColor: getKategoriRenk(h.kategori) }}>{h.kategori}</span><h3 className="text-sm font-semibold line-clamp-2 group-hover:text-red-600">{h.baslik}</h3><p className="text-xs text-gray-400 mt-2">{formatTarih(h.created_at)}</p></div></article></Link>)}</div></div>}
              
              {liste.length > 0 && <div><div className="flex items-center gap-3 mb-4"><h2 className="text-xl font-bold">Diğer Haberler</h2><div className="flex-1 h-px bg-gray-200"></div></div><div className="space-y-3">{liste.map((h, i) => <Link href={`/haber/${h.id}`} key={h.id}><article className="group flex items-center gap-4 p-4 bg-white rounded-xl hover:bg-gray-50 cursor-pointer"><span className="text-3xl font-black text-gray-200 w-8">{String(i+1).padStart(2,'0')}</span><div className="flex-1"><div className="flex items-center gap-2 mb-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: getKategoriRenk(h.kategori) }}></span><span className="text-xs font-medium text-gray-500">{h.kategori}</span></div><h3 className="text-sm font-semibold line-clamp-1 group-hover:text-red-600">{h.baslik}</h3></div><span className="text-xs text-gray-400">{formatSaat(h.created_at)}</span></article></Link>)}</div></div>}
            </div>

            <aside className="col-span-12 lg:col-span-4 space-y-6">
              <IhracFazlasiAd variant="square" />
              <YalduzWebAd variant="square" />
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white"><div className="flex items-center gap-2 mb-4"><span className="text-sm">📍 İnegöl, Bursa</span></div><div className="flex justify-between"><div><p className="text-5xl font-light">6°</p><p className="text-blue-200 text-sm mt-1">Parçalı Bulutlu</p></div><span className="text-5xl">⛅</span></div><div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/20"><div className="text-center"><p className="text-blue-200 text-xs">Nem</p><p className="text-lg font-semibold">%72</p></div><div className="text-center"><p className="text-blue-200 text-xs">Rüzgar</p><p className="text-lg font-semibold">15 km/s</p></div></div></div>
              <div className="bg-white rounded-2xl p-6 shadow-sm"><h3 className="text-lg font-bold mb-4">Piyasalar</h3><div className="space-y-3">{[{isim:'Dolar',deger:'35.42',d:'+0.18',u:true},{isim:'Euro',deger:'36.85',d:'+0.12',u:true},{isim:'Altın',deger:'2.892',d:'+15',u:true}].map((k,i) => <div key={i} className="flex justify-between py-2 border-b border-gray-100 last:border-0"><span className="font-medium text-sm">{k.isim}</span><div className="text-right"><p className="font-bold text-sm">{k.deger} ₺</p><p className={`text-xs ${k.u ? 'text-green-600' : 'text-red-600'}`}>{k.u ? '↑' : '↓'} {k.d}</p></div></div>)}</div></div>
            </aside>
          </div>
        )}
      </main>

      <footer className="bg-black text-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2"><h2 className="text-2xl font-black mb-2">İNEGÖL<span className="text-red-500">GÜNDEM</span></h2><p className="text-gray-400 text-sm mb-4">İnegöl'ün en güvenilir haber kaynağı.</p></div>
            <div><h4 className="font-semibold text-sm uppercase text-gray-300 mb-4">Kategoriler</h4><ul className="space-y-2">{kategoriler.slice(1,5).map(k => <li key={k.id}><a href="#" className="text-gray-400 hover:text-white text-sm">{k.isim}</a></li>)}</ul></div>
            <div><h4 className="font-semibold text-sm uppercase text-gray-300 mb-4">Kurumsal</h4><ul className="space-y-2">{['Hakkımızda','İletişim','Reklam'].map(x => <li key={x}><a href="#" className="text-gray-400 hover:text-white text-sm">{x}</a></li>)}</ul></div>
          </div>
          <div className="border-t border-white/10 pt-6 text-center"><p className="text-gray-500 text-sm">© 2025 İnegölGündem.com</p></div>
        </div>
      </footer>

      {scrollY > 500 && <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-6 right-6 w-12 h-12 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 flex items-center justify-center z-40"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg></button>}
    </div>
  )
}
