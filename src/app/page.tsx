'use client'

import { useState, useEffect, useCallback } from 'react'

// TİPLER
interface Haber {
  id: number
  kategori: string
  baslik: string
  ozet: string
  tarih: string
  saat: string
  resim: string
  yazar: string
  okunmaSuresi?: string
}

// SABİTLER
const kategoriler = [
  { id: 'tumu', isim: 'Tümü', renk: '#1a1a1a', icon: '📰' },
  { id: 'gundem', isim: 'Gündem', renk: '#DC2626', icon: '🔴' },
  { id: 'ekonomi', isim: 'Ekonomi', renk: '#059669', icon: '📈' },
  { id: 'spor', isim: 'Spor', renk: '#2563EB', icon: '⚽' },
  { id: 'kultur', isim: 'Kültür', renk: '#7C3AED', icon: '🎭' },
  { id: 'yasam', isim: 'Yaşam', renk: '#EA580C', icon: '🌟' },
  { id: 'saglik', isim: 'Sağlık', renk: '#0891B2', icon: '🏥' },
]

const N8N_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || ''

const ornekHaberler: Haber[] = [
  { id: 1, kategori: "GÜNDEM", baslik: "İnegöl Belediyesi'nden Büyük Yatırım: Yeni Sosyal Tesis Kompleksi", ozet: "Belediye Başkanı, ilçenin doğu yakasında yapılacak yeni sosyal tesisin temelini önümüzdeki ay atacaklarını açıkladı.", tarih: "9 Ocak 2025", saat: "14:32", resim: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&q=80", yazar: "Ahmet Yılmaz", okunmaSuresi: "4 dk" },
  { id: 2, kategori: "EKONOMİ", baslik: "Mobilya Sektöründe Tarihi Rekor: İhracat %45 Arttı", ozet: "İnegöl mobilya sektörü 2024 yılında ihracatta tarihi bir başarıya imza attı.", tarih: "9 Ocak 2025", saat: "12:15", resim: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80", yazar: "Zeynep Kaya", okunmaSuresi: "5 dk" },
  { id: 3, kategori: "SPOR", baslik: "İnegölspor Zirve Yarışında: Deplasmandan 3 Puanla Döndü", ozet: "Ligin kritik maçında İnegölspor deplasmanda 2-1 galip geldi.", tarih: "8 Ocak 2025", saat: "21:45", resim: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80", yazar: "Murat Demir", okunmaSuresi: "3 dk" },
  { id: 4, kategori: "KÜLTÜR", baslik: "Tarihi Osmanlı Çarşısı Restorasyonu Tamamlandı", ozet: "Osmanlı döneminden kalma tarihi çarşı, özgün mimarisiyle yeniden hayat buldu.", tarih: "8 Ocak 2025", saat: "16:20", resim: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", yazar: "Elif Arslan", okunmaSuresi: "4 dk" },
  { id: 5, kategori: "YAŞAM", baslik: "Modern Kütüphane Açıldı: 50.000 Kitap Kapasitesi", ozet: "İnegöl'ün en büyük kütüphanesi kapılarını açtı.", tarih: "7 Ocak 2025", saat: "10:00", resim: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=80", yazar: "Can Özdemir", okunmaSuresi: "3 dk" },
  { id: 6, kategori: "SAĞLIK", baslik: "Devlet Hastanesine Son Teknoloji MR Cihazı", ozet: "Yeni nesil MR cihazı sayesinde vatandaşlar artık tetkik için il dışına gitmek zorunda kalmayacak.", tarih: "7 Ocak 2025", saat: "09:30", resim: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&q=80", yazar: "Dr. Ayşe Çelik", okunmaSuresi: "4 dk" },
  { id: 7, kategori: "GÜNDEM", baslik: "Yeni Metro Hattı Projesi İçin Fizibilite Çalışmaları", ozet: "İnegöl-Bursa arası hızlı ulaşım için metro projesi masaya yatırıldı.", tarih: "6 Ocak 2025", saat: "15:00", resim: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80", yazar: "Mehmet Aydın", okunmaSuresi: "5 dk" },
  { id: 8, kategori: "EKONOMİ", baslik: "Organize Sanayi'de 15 Yeni Fabrika Yatırımı", ozet: "OSB'de 15 yeni fabrika için yer tahsisi yapıldı.", tarih: "6 Ocak 2025", saat: "11:30", resim: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80", yazar: "Ali Kara", okunmaSuresi: "4 dk" }
]

const sonDakikaHaberleri = [
  "🔴 Belediye'den su kesintisi duyurusu: Yarın 4 mahallede su kesilecek",
  "⚽ İnegölspor'a yeni transfer müjdesi",
  "📈 Mobilya fuarı için geri sayım başladı",
  "🏥 Sağlık Bakanlığı'ndan yeni hastane müjdesi"
]

function getKategoriRenk(kategori: string): string {
  const k = kategori.toLowerCase().replace(/[üışğöç]/g, c => ({ü:'u',ı:'i',ş:'s',ğ:'g',ö:'o',ç:'c'}[c] || c))
  const kat = kategoriler.find(x => x.isim.toLowerCase().replace(/[üışğöç]/g, c => ({ü:'u',ı:'i',ş:'s',ğ:'g',ö:'o',ç:'c'}[c] || c)) === k)
  return kat?.renk || '#666'
}

export default function Home() {
  const [haberler, setHaberler] = useState<Haber[]>(ornekHaberler)
  const [yukleniyor, setYukleniyor] = useState(true)
  const [scrollY, setScrollY] = useState(0)
  const [aktifKategori, setAktifKategori] = useState('tumu')
  const [menuAcik, setMenuAcik] = useState(false)
  const [sonDakikaIndex, setSonDakikaIndex] = useState(0)
  const [currentTime, setCurrentTime] = useState('')
  const [aramaAcik, setAramaAcik] = useState(false)
  const [aramaMetni, setAramaMetni] = useState('')

  const loadHaberler = useCallback(async () => {
    setYukleniyor(true)
    try {
      if (N8N_WEBHOOK_URL) {
        const res = await fetch(N8N_WEBHOOK_URL, { cache: 'no-store' })
        if (res.ok) { const data = await res.json(); if (data.length) setHaberler(data) }
      }
    } catch (e) { console.error(e) }
    setYukleniyor(false)
  }, [])

  useEffect(() => { loadHaberler(); const i = setInterval(loadHaberler, 300000); return () => clearInterval(i) }, [loadHaberler])
  useEffect(() => { const h = () => setScrollY(window.scrollY); window.addEventListener('scroll', h, { passive: true }); return () => window.removeEventListener('scroll', h) }, [])
  useEffect(() => { const i = setInterval(() => setSonDakikaIndex(p => (p + 1) % sonDakikaHaberleri.length), 5000); return () => clearInterval(i) }, [])
  useEffect(() => { const u = () => setCurrentTime(new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })); u(); const i = setInterval(u, 1000); return () => clearInterval(i) }, [])

  const filtrelenmis = aktifKategori === 'tumu' ? haberler : haberler.filter(h => h.kategori.toLowerCase().replace(/[üışğöç]/g, c => ({ü:'u',ı:'i',ş:'s',ğ:'g',ö:'o',ç:'c'}[c] || c)).includes(aktifKategori))
  const aranan = aramaMetni ? filtrelenmis.filter(h => h.baslik.toLowerCase().includes(aramaMetni.toLowerCase())) : filtrelenmis
  const manset = aranan[0], vitrin = aranan.slice(1, 3), grid = aranan.slice(3, 7), liste = aranan.slice(7)

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* SON DAKİKA */}
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

      {/* HEADER */}
      <header className="sticky top-0 z-50 transition-all duration-300" style={{ backgroundColor: `rgba(255,255,255,${Math.min(scrollY/100,1)})`, backdropFilter: scrollY > 0 ? 'blur(20px)' : 'none', boxShadow: scrollY > 50 ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <button className="lg:hidden p-2 -ml-2" onClick={() => setMenuAcik(!menuAcik)}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuAcik ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg></button>
            <div className="flex-1 lg:flex-none text-center lg:text-left">
              <a href="/" className="inline-block group">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight"><span className="text-gray-900">İNEGÖL</span><span className="text-red-600">GÜNDEM</span></h1>
                <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-[0.2em]">Bağımsız • Güvenilir • Yerel</p>
              </a>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden lg:block text-right">
                <p className="text-sm font-semibold text-gray-900">{new Date().toLocaleDateString('tr-TR', { weekday: 'long' })}</p>
                <p className="text-xs text-gray-500">{new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              <div className="relative">
                <button className="p-2 hover:bg-gray-100 rounded-full" onClick={() => setAramaAcik(!aramaAcik)}><svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></button>
                {aramaAcik && <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border p-3 z-50"><input type="text" placeholder="Haberlerde ara..." value={aramaMetni} onChange={e => setAramaMetni(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" autoFocus /></div>}
              </div>
            </div>
          </div>
          <nav className="hidden lg:flex items-center justify-center gap-1 py-2">
            {kategoriler.map(k => <button key={k.id} onClick={() => setAktifKategori(k.id)} className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${aktifKategori === k.id ? 'text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100'}`} style={aktifKategori === k.id ? { backgroundColor: k.renk } : {}}>{k.isim}</button>)}
          </nav>
        </div>
        {menuAcik && <div className="lg:hidden bg-white border-t shadow-lg"><div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 gap-2">{kategoriler.map(k => <button key={k.id} onClick={() => { setAktifKategori(k.id); setMenuAcik(false) }} className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${aktifKategori === k.id ? 'text-white' : 'bg-gray-50 text-gray-700'}`} style={aktifKategori === k.id ? { backgroundColor: k.renk } : {}}><span>{k.icon}</span>{k.isim}</button>)}</div></div>}
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
        {yukleniyor ? <div className="flex items-center justify-center py-20"><div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div></div> : aranan.length === 0 ? <div className="text-center py-20"><p className="text-6xl mb-4">🔍</p><h3 className="text-xl font-semibold mb-2">Sonuç Bulunamadı</h3><button onClick={() => { setAramaMetni(''); setAktifKategori('tumu') }} className="mt-4 px-6 py-2 bg-red-600 text-white rounded-full">Temizle</button></div> : (
          <div className="grid grid-cols-12 gap-6 lg:gap-8">
            <div className="col-span-12 lg:col-span-8 space-y-8">
              {/* MANŞET */}
              {manset && <article className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img src={manset.resim} alt={manset.baslik} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <span className="absolute top-4 left-4 px-3 py-1.5 text-xs font-bold text-white rounded-full uppercase" style={{ backgroundColor: getKategoriRenk(manset.kategori) }}>{manset.kategori}</span>
                  <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-3 group-hover:text-red-300 transition-colors">{manset.baslik}</h2>
                    <p className="text-white/80 text-sm sm:text-base line-clamp-2 mb-4">{manset.ozet}</p>
                    <div className="flex items-center gap-4 text-white/60 text-sm"><span>{manset.yazar}</span><span>{manset.tarih} • {manset.saat}</span></div>
                  </div>
                </div>
              </article>}
              {/* VİTRİN */}
              {vitrin.length > 0 && <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">{vitrin.map(h => <article key={h.id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg cursor-pointer"><div className="relative aspect-[4/3] overflow-hidden"><img src={h.resim} alt={h.baslik} className="w-full h-full object-cover group-hover:scale-105 transition-transform" /><span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold text-white rounded-full uppercase" style={{ backgroundColor: getKategoriRenk(h.kategori) }}>{h.kategori}</span></div><div className="p-4"><h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-red-600 mb-2">{h.baslik}</h3><p className="text-gray-500 text-sm line-clamp-2 mb-3">{h.ozet}</p><div className="flex justify-between text-xs text-gray-400"><span>{h.yazar}</span><span>{h.tarih}</span></div></div></article>)}</div>}
              {/* GRID */}
              {grid.length > 0 && <div><div className="flex items-center gap-3 mb-4"><h2 className="text-xl font-bold">Son Haberler</h2><div className="flex-1 h-px bg-gray-200"></div></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{grid.map(h => <article key={h.id} className="group flex gap-4 bg-white p-4 rounded-xl hover:bg-gray-50 cursor-pointer"><div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-lg overflow-hidden"><img src={h.resim} alt={h.baslik} className="w-full h-full object-cover group-hover:scale-110 transition-transform" /></div><div className="flex-1 min-w-0"><span className="inline-block px-2 py-0.5 text-[10px] font-bold text-white rounded mb-2" style={{ backgroundColor: getKategoriRenk(h.kategori) }}>{h.kategori}</span><h3 className="text-sm font-semibold line-clamp-2 group-hover:text-red-600">{h.baslik}</h3><p className="text-xs text-gray-400 mt-2">{h.tarih}</p></div></article>)}</div></div>}
              {/* LİSTE */}
              {liste.length > 0 && <div><div className="flex items-center gap-3 mb-4"><h2 className="text-xl font-bold">Diğer Haberler</h2><div className="flex-1 h-px bg-gray-200"></div></div><div className="space-y-3">{liste.map((h, i) => <article key={h.id} className="group flex items-center gap-4 p-4 bg-white rounded-xl hover:bg-gray-50 cursor-pointer"><span className="text-3xl font-black text-gray-200 w-8">{String(i+1).padStart(2,'0')}</span><div className="flex-1"><div className="flex items-center gap-2 mb-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: getKategoriRenk(h.kategori) }}></span><span className="text-xs font-medium text-gray-500">{h.kategori}</span></div><h3 className="text-sm font-semibold line-clamp-1 group-hover:text-red-600">{h.baslik}</h3></div><span className="text-xs text-gray-400">{h.saat}</span></article>)}</div></div>}
            </div>
            {/* SIDEBAR */}
            <aside className="col-span-12 lg:col-span-4 space-y-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white"><div className="flex items-center gap-2 mb-4"><span className="text-sm">📍 İnegöl, Bursa</span></div><div className="flex justify-between"><div><p className="text-6xl font-light">6°</p><p className="text-blue-200 text-sm mt-1">Parçalı Bulutlu</p></div><span className="text-6xl">⛅</span></div><div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-white/20"><div className="text-center"><p className="text-blue-200 text-xs">Nem</p><p className="text-lg font-semibold">%72</p></div><div className="text-center"><p className="text-blue-200 text-xs">Rüzgar</p><p className="text-lg font-semibold">15 km/s</p></div></div></div>
              <div className="bg-white rounded-2xl p-6 shadow-sm"><h3 className="text-lg font-bold mb-4">Piyasalar</h3><div className="space-y-3">{[{isim:'Dolar',deger:'35.42',d:'+0.18',u:true},{isim:'Euro',deger:'36.85',d:'+0.12',u:true},{isim:'Sterlin',deger:'44.52',d:'-0.08',u:false},{isim:'Altın',deger:'2.892',d:'+15',u:true}].map((k,i) => <div key={i} className="flex justify-between py-3 border-b border-gray-100 last:border-0"><span className="font-medium">{k.isim}</span><div className="text-right"><p className="font-bold">{k.deger} ₺</p><p className={`text-xs ${k.u ? 'text-green-600' : 'text-red-600'}`}>{k.u ? '↑' : '↓'} {k.d}</p></div></div>)}</div></div>
              <div className="bg-white rounded-2xl p-6 shadow-sm"><h3 className="text-lg font-bold mb-4">Bizi Takip Edin</h3><div className="grid grid-cols-2 gap-3">{[{n:'Twitter',i:'𝕏',r:'bg-black'},{n:'Instagram',i:'📷',r:'bg-gradient-to-br from-purple-600 to-pink-500'},{n:'Facebook',i:'f',r:'bg-blue-600'},{n:'YouTube',i:'▶',r:'bg-red-600'}].map((s,i) => <a key={i} href="#" className={`${s.r} text-white rounded-xl p-4 flex flex-col items-center gap-1`}><span className="text-2xl">{s.i}</span><span className="text-xs">{s.n}</span></a>)}</div></div>
            </aside>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-black text-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2"><h2 className="text-2xl font-black mb-2">İNEGÖL<span className="text-red-500">GÜNDEM</span></h2><p className="text-gray-400 text-sm mb-4">İnegöl'ün en güvenilir haber kaynağı.</p></div>
            <div><h4 className="font-semibold text-sm uppercase text-gray-300 mb-4">Kategoriler</h4><ul className="space-y-2">{kategoriler.slice(1).map(k => <li key={k.id}><a href="#" className="text-gray-400 hover:text-white text-sm">{k.isim}</a></li>)}</ul></div>
            <div><h4 className="font-semibold text-sm uppercase text-gray-300 mb-4">Kurumsal</h4><ul className="space-y-2">{['Hakkımızda','İletişim','Künye','Reklam','Gizlilik'].map(x => <li key={x}><a href="#" className="text-gray-400 hover:text-white text-sm">{x}</a></li>)}</ul></div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">© 2025 İnegölGündem.com</p>
            <p className="text-gray-600 text-xs">n8n otomasyon ile güçlendirilmiştir 🤖</p>
          </div>
        </div>
      </footer>

      {scrollY > 500 && <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-6 right-6 w-12 h-12 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 flex items-center justify-center z-40"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg></button>}
    </div>
  )
}
