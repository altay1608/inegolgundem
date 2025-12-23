'use client'

import { useState, useEffect } from 'react'

const haberler = [
  {
    id: 1,
    kategori: "GÜNDEM",
    baslik: "İnegöl Belediyesi'nden Yeni Sosyal Tesis Müjdesi",
    ozet: "Belediye Başkanı, ilçenin doğu yakasında yapılacak yeni sosyal tesisin temelini önümüzdeki ay atacaklarını açıkladı.",
    tarih: "23 Aralık 2024",
    saat: "14:32",
    resim: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&q=80",
    yazar: "Ahmet Yılmaz"
  },
  {
    id: 2,
    kategori: "EKONOMİ",
    baslik: "Mobilya İhracatında Rekor: Yüzde 35 Artış",
    ozet: "İnegöl mobilya sektörü bu yıl ihracatta tarihi bir başarıya imza attı.",
    tarih: "23 Aralık 2024",
    saat: "12:15",
    resim: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    yazar: "Zeynep Kaya"
  },
  {
    id: 3,
    kategori: "SPOR",
    baslik: "İnegölspor Zirve Takibini Sürdürüyor",
    ozet: "Ligin kritik maçında İnegölspor deplasmanda 2-1 galip geldi.",
    tarih: "22 Aralık 2024",
    saat: "21:45",
    resim: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80",
    yazar: "Murat Demir"
  },
  {
    id: 4,
    kategori: "KÜLTÜR",
    baslik: "Tarihi Çarşı Restore Ediliyor",
    ozet: "Osmanlı döneminden kalma tarihi çarşı, özgün mimarisiyle yeniden hayat bulacak.",
    tarih: "22 Aralık 2024",
    saat: "16:20",
    resim: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    yazar: "Elif Arslan"
  },
  {
    id: 5,
    kategori: "EĞİTİM",
    baslik: "Yeni Kütüphane Kapılarını Açtı",
    ozet: "50.000 kitap kapasiteli modern kütüphane öğrencilere hizmet vermeye başladı.",
    tarih: "21 Aralık 2024",
    saat: "10:00",
    resim: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=80",
    yazar: "Can Özdemir"
  }
]

const sonDakikaHaberleri = [
  "Belediye'den su kesintisi duyurusu: Yarın 4 mahallede su kesilecek",
  "Mobilya fuarı için geri sayım başladı",
  "İnegölspor'a yeni transfer müjdesi"
]

const kategoriler = ["GÜNDEM", "EKONOMİ", "SPOR", "KÜLTÜR", "EĞİTİM", "SAĞLIK"]

export default function Home() {
  const [aktifSlide, setAktifSlide] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [menuAcik, setMenuAcik] = useState(false)

  useEffect(() => {
    setLoaded(true)
    const interval = setInterval(() => {
      setAktifSlide(prev => (prev + 1) % sonDakikaHaberleri.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const mansetHaber = haberler[0]
  const digerHaberler = haberler.slice(1)

  return (
    <div className="min-h-screen bg-stone-50">
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className={`transition-all duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
              <h1 className="font-editorial text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                <span className={scrolled ? 'text-stone-900' : 'text-white'}>İNEGÖL</span>
                <span className="text-gradient">GÜNDEM</span>
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-8 h-px bg-gradient-to-r from-amber-600 to-transparent"></div>
                <span className={`text-xs tracking-[0.2em] uppercase ${scrolled ? 'text-stone-500' : 'text-white/70'}`}>Haber Portalı</span>
              </div>
            </div>
            <nav className="hidden lg:flex items-center gap-1">
              {kategoriler.map((item) => (
                <a key={item} href="#" className={`px-4 py-2 text-sm font-medium tracking-wide transition-all duration-300 hover:text-amber-600 ${scrolled ? 'text-stone-700' : 'text-white/90'}`}>{item}</a>
              ))}
            </nav>
            <button className={`lg:hidden p-2 ${scrolled ? 'text-stone-700' : 'text-white'}`} onClick={() => setMenuAcik(!menuAcik)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={menuAcik ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <section className="relative min-h-screen">
        <div className="absolute inset-0">
          <img src={mansetHaber.resim} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-stone-950/30" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-32 sm:pt-40 pb-16 sm:pb-20 min-h-screen flex flex-col justify-end">
          <div className={`max-w-3xl transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center gap-4 mb-4">
              <span className="px-3 py-1.5 bg-gradient-to-r from-red-900 to-red-800 text-white text-xs font-bold tracking-wider rounded-sm">{mansetHaber.kategori}</span>
              <span className="text-amber-500 text-sm font-medium">{mansetHaber.tarih}</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-5xl lg:text-6xl text-white font-bold leading-tight mb-4">{mansetHaber.baslik}</h2>
            <p className="text-lg text-stone-300 leading-relaxed mb-6 max-w-2xl">{mansetHaber.ozet}</p>
            <a href="#" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium rounded-sm hover:bg-white hover:text-stone-900 transition-all duration-300">
              Devamını Oku
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </div>
        </div>
      </section>

      <div className="bg-gradient-to-r from-red-950 via-red-900 to-red-950 border-y border-red-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center py-3">
            <div className="flex items-center gap-2 pr-4 border-r border-red-800/50">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span></span>
              <span className="text-amber-500 text-xs font-bold tracking-widest uppercase">Son Dakika</span>
            </div>
            <div className="flex-1 overflow-hidden ml-4">
              <p className="text-white/90 text-sm animate-slide-in" key={aktifSlide}>{sonDakikaHaberleri[aktifSlide]}</p>
            </div>
          </div>
        </div>
      </div>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-2 h-10 bg-gradient-to-b from-red-900 to-red-700 rounded-full"></div>
            <h3 className="font-editorial text-3xl font-bold text-stone-900">Son Haberler</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {digerHaberler.map((haber) => (
              <article key={haber.id} className="group bg-stone-50 rounded-sm overflow-hidden card-hover cursor-pointer">
                <div className="aspect-video overflow-hidden">
                  <img src={haber.resim} alt={haber.baslik} className="w-full h-full object-cover image-zoom" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-red-900 text-xs font-bold tracking-wider">{haber.kategori}</span>
                    <span className="text-stone-400 text-xs">{haber.saat}</span>
                  </div>
                  <h4 className="font-editorial text-xl font-bold text-stone-900 group-hover:text-red-900 transition-colors leading-tight">{haber.baslik}</h4>
                  <p className="text-stone-500 text-sm mt-2 line-clamp-2">{haber.ozet}</p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-200">
                    <span className="text-stone-400 text-xs">{haber.tarih}</span>
                    <span className="text-red-900 text-xs font-medium">Devamını Oku →</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-stone-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="font-editorial text-2xl font-bold">İNEGÖL<span className="text-red-500">GÜNDEM</span></h2>
              <p className="text-stone-400 text-sm mt-1">İnegöl'ün en güvenilir haber kaynağı</p>
            </div>
            <p className="text-stone-500 text-sm">© 2024 İnegölGündem.com — Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
