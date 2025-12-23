'use client';

import { useEffect, useState } from 'react';

interface Haber {
  id: number;
  baslik: string;
  ozet: string;
  icerik: string;
  kategori: string;
  resim_url: string;
  yazar: string;
  aktif: boolean;
  created_at: string;
}

export default function Home() {
  const [haberler, setHaberler] = useState<Haber[]>([]);
  const [filtreliKategori, setFiltreliKategori] = useState<string>('TÜMÜ');
  const [yukleniyor, setYukleniyor] = useState(true);
  const [aramaMetni, setAramaMetni] = useState('');

  const kategoriler = ['TÜMÜ', 'GÜNDEM', 'EKONOMİ', 'SPOR', 'KÜLTÜR', 'EĞİTİM', 'SAĞLIK'];

  useEffect(() => {
    const haberleriGetir = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/haberler?aktif=eq.true&order=created_at.desc`,
          {
            headers: {
              apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            },
          }
        );
        const data = await response.json();
        setHaberler(data);
      } catch (error) {
        console.error('Haberler yüklenirken hata:', error);
      } finally {
        setYukleniyor(false);
      }
    };

    haberleriGetir();
  }, []);

  const filtrelenmisHaberler = haberler.filter((haber) => {
    const kategoriUyumu = filtreliKategori === 'TÜMÜ' || haber.kategori === filtreliKategori;
    const aramaUyumu = haber.baslik.toLowerCase().includes(aramaMetni.toLowerCase());
    return kategoriUyumu && aramaUyumu;
  });

  const mansetHaber = filtrelenmisHaberler[0];
  const digerHaberler = filtrelenmisHaberler.slice(1);

  const tarihFormatla = (tarih: string) => {
    return new Date(tarih).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (yukleniyor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-burgundy-500/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-burgundy-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-white/70 text-lg tracking-wider">Haberler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#722F37] via-[#8B3A42] to-[#722F37] shadow-2xl sticky top-0 z-50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.03\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-4 py-4 relative">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 bg-white rounded-xl shadow-lg flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                  <span className="text-[#722F37] font-black text-2xl">İG</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                  İnegöl Gündem
                </h1>
                <p className="text-white/70 text-sm tracking-widest">
                  Güncel • Tarafsız • Güvenilir
                </p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {['GÜNDEM', 'EKONOMİ', 'SPOR', 'KÜLTÜR'].map((item) => (
                <button
                  key={item}
                  onClick={() => setFiltreliKategori(item)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    filtreliKategori === item
                      ? 'bg-white text-[#722F37]'
                      : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  {item}
                </button>
              ))}
            </nav>

            {/* Search */}
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Haber ara..."
                value={aramaMetni}
                onChange={(e) => setAramaMetni(e.target.value)}
                className="w-64 px-5 py-2.5 pl-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/20 transition-all duration-300"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Breaking News Ticker */}
        <div className="bg-[#5A252B] border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-4">
            <span className="flex items-center gap-2 bg-white text-[#722F37] px-3 py-1 rounded text-xs font-bold uppercase tracking-wider shrink-0">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              Son Dakika
            </span>
            <div className="overflow-hidden flex-1">
              <div className="animate-marquee whitespace-nowrap">
                {haberler.slice(0, 5).map((haber, index) => (
                  <span key={haber.id} className="text-white/90 text-sm mx-8">
                    {haber.baslik}
                    {index < 4 && <span className="mx-4 text-white/30">•</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section - Manşet */}
        {mansetHaber && (
          <section className="mb-12">
            <div className="relative group overflow-hidden rounded-3xl shadow-2xl bg-slate-900">
              <div className="aspect-[21/9] relative">
                <img
                  src={mansetHaber.resim_url || '/son-dakika.png'}
                  alt={mansetHaber.baslik}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/son-dakika.png';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#722F37]/30 to-transparent"></div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                <span className="inline-block bg-[#722F37] text-white px-4 py-1.5 rounded-full text-sm font-bold mb-4 shadow-lg">
                  {mansetHaber.kategori}
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight drop-shadow-lg">
                  {mansetHaber.baslik}
                </h2>
                <p className="text-white/80 text-lg md:text-xl mb-6 max-w-3xl line-clamp-2">
                  {mansetHaber.ozet || mansetHaber.icerik?.substring(0, 200)}
                </p>
                <div className="flex items-center gap-4 text-white/60 text-sm">
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {mansetHaber.yazar}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {tarihFormatla(mansetHaber.created_at)}
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {kategoriler.map((kategori) => (
            <button
              key={kategori}
              onClick={() => setFiltreliKategori(kategori)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                filtreliKategori === kategori
                  ? 'bg-[#722F37] text-white shadow-lg shadow-[#722F37]/30 scale-105'
                  : 'bg-white text-slate-600 hover:bg-slate-100 shadow-md hover:shadow-lg'
              }`}
            >
              {kategori}
            </button>
          ))}
        </div>

        {/* News Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {digerHaberler.map((haber, index) => (
            <article
              key={haber.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-1"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={haber.resim_url || '/son-dakika.png'}
                  alt={haber.baslik}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/son-dakika.png';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="absolute top-4 left-4 bg-[#722F37] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  {haber.kategori}
                </span>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-[#722F37] transition-colors duration-300">
                  {haber.baslik}
                </h3>
                <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                  {haber.ozet || haber.icerik?.substring(0, 120)}...
                </p>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-100">
                  <span className="flex items-center gap-1.5">
                    <div className="w-6 h-6 bg-[#722F37]/10 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-[#722F37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    {haber.yazar}
                  </span>
                  <span>{tarihFormatla(haber.created_at)}</span>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* Empty State */}
        {filtrelenmisHaberler.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">Haber Bulunamadı</h3>
            <p className="text-slate-500">Bu kategoride henüz haber bulunmuyor.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#722F37] via-[#8B3A42] to-[#722F37] text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo & Description */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                  <span className="text-[#722F37] font-black text-xl">İG</span>
                </div>
                <div>
                  <h3 className="text-xl font-black">İnegöl Gündem</h3>
                  <p className="text-white/60 text-sm">Güncel • Tarafsız • Güvenilir</p>
                </div>
              </div>
              <p className="text-white/70 text-sm leading-relaxed max-w-md">
                İnegöl ve çevresinden en güncel haberler, son dakika gelişmeleri ve yerel haberler için güvenilir kaynağınız.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-lg mb-4">Kategoriler</h4>
              <ul className="space-y-2">
                {['Gündem', 'Ekonomi', 'Spor', 'Kültür', 'Eğitim'].map((item) => (
                  <li key={item}>
                    <button className="text-white/70 hover:text-white transition-colors text-sm">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-lg mb-4">İletişim</h4>
              <ul className="space-y-2 text-white/70 text-sm">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  İnegöl, Bursa
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  info@inegolgundem.com
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/50 text-sm">
            <p>© 2025 İnegöl Gündem. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>

      {/* Custom Styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        
        * {
          font-family: 'Poppins', sans-serif;
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .animate-marquee {
          animation: marquee 30s linear infinite;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        ::-webkit-scrollbar-thumb {
          background: #722F37;
          border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #5A252B;
        }

        /* Smooth scroll */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}
