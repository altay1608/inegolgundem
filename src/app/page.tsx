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
  kaynak_url: string;
}

export default function Home() {
  const [haberler, setHaberler] = useState<Haber[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [aramaMetni, setAramaMetni] = useState('');

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
    return haber.baslik.toLowerCase().includes(aramaMetni.toLowerCase());
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

  const kaynakAdiGetir = (url: string) => {
    try {
      const hostname = new URL(url).hostname;
      return hostname.replace('www.', '');
    } catch {
      return 'Kaynak';
    }
  };

  if (yukleniyor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-red-800 border-opacity-30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-red-800 rounded-full animate-spin"></div>
          </div>
          <p className="text-white text-opacity-70 text-lg tracking-wider">Haberler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-gradient-to-r from-red-900 via-red-800 to-red-900 shadow-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 bg-white rounded-xl shadow-lg flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                  <span className="text-red-900 font-black text-2xl">İG</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                  İnegöl Gündem
                </h1>
                <p className="text-white text-opacity-70 text-sm tracking-widest">
                  Güncel • Tarafsız • Güvenilir
                </p>
              </div>
            </div>

            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Haber ara..."
                value={aramaMetni}
                onChange={(e) => setAramaMetni(e.target.value)}
                className="w-64 px-5 py-2.5 pl-12 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-full text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30 transition-all duration-300"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white text-opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-red-950 border-t border-white border-opacity-10">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-4">
            <span className="flex items-center gap-2 bg-white text-red-900 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider shrink-0">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              Son Dakika
            </span>
            <div className="overflow-hidden flex-1">
              <div className="whitespace-nowrap overflow-x-auto">
                {haberler.slice(0, 5).map((haber, index) => (
                  <span key={haber.id} className="text-white text-opacity-90 text-sm mx-4 inline-block">
                    {haber.baslik}
                    {index < 4 && <span className="mx-4 text-white text-opacity-30">•</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Reklam Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <a 
            href="https://maps.google.com/?q=İhraç+Fazlası+Giyim+İnegöl" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-r from-pink-900/30 via-slate-800/50 to-pink-900/30 rounded-2xl p-4 md:p-5 border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-600 to-pink-800 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-pink-600/30">
                İF
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-bold text-lg">İhraç Fazlası Giyim</h3>
                  <span className="bg-yellow-500 text-slate-900 text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">REKLAM</span>
                </div>
                <p className="text-white/60 text-sm">Kaliteli Giyim, Uygun Fiyat</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-yellow-400 text-sm">★★★★★</span>
                  <span className="text-white/50 text-xs">5.0 (57 yorum)</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-white/70 text-sm">
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>Ertuğrulgazi, Kozluca Yolu 13/AA</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📞</span>
                <span className="font-semibold text-white">0538 479 36 96</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-pink-600 to-pink-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm group-hover:from-pink-500 group-hover:to-pink-600 transition-all shadow-lg shadow-pink-600/30">
              🗺️ Yol Tarifi Al
            </div>
          </a>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {mansetHaber && (
          <section className="mb-12">
            <a 
              href={mansetHaber.kaynak_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block relative group overflow-hidden rounded-3xl shadow-2xl bg-slate-900 cursor-pointer"
            >
              <div className="aspect-video md:aspect-[21/9] relative">
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
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                <span className="inline-block bg-red-900 text-white px-4 py-1.5 rounded-full text-sm font-bold mb-4 shadow-lg">
                  MANŞET
                </span>
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight drop-shadow-lg">
                  {mansetHaber.baslik}
                </h2>
                <p className="text-white text-opacity-80 text-base md:text-lg mb-6 max-w-3xl line-clamp-2">
                  {mansetHaber.ozet || mansetHaber.icerik?.substring(0, 200)}
                </p>
                <div className="flex items-center gap-4 text-white text-opacity-60 text-sm">
                  <span>{mansetHaber.yazar}</span>
                  <span>•</span>
                  <span>{tarihFormatla(mansetHaber.created_at)}</span>
                  {mansetHaber.kaynak_url && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <span>📰</span>
                        Kaynak: {kaynakAdiGetir(mansetHaber.kaynak_url)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </a>
          </section>
        )}

        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
            <span className="w-1 h-8 bg-red-900 rounded"></span>
            Son Haberler
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {digerHaberler.map((haber) => (
              
                key={haber.id}
                href={haber.kaynak_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-1 cursor-pointer block"
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
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    <span>🔗</span>
                    Devamını Oku
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-red-900 transition-colors duration-300">
                    {haber.baslik}
                  </h3>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                    {haber.ozet || haber.icerik?.substring(0, 120)}...
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-100">
                    <span>{tarihFormatla(haber.created_at)}</span>
                    {haber.kaynak_url && (
                      <span className="text-red-800 font-medium">
                        📰 {kaynakAdiGetir(haber.kaynak_url)}
                      </span>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {filtrelenmisHaberler.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">Haber Bulunamadı</h3>
            <p className="text-slate-500">Aradığınız kriterlere uygun haber bulunmuyor.</p>
          </div>
        )}
      </main>

      <footer className="bg-gradient-to-r from-red-900 via-red-800 to-red-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                  <span className="text-red-900 font-black text-xl">İG</span>
                </div>
                <div>
                  <h3 className="text-xl font-black">İnegöl Gündem</h3>
                  <p className="text-white text-opacity-60 text-sm">Güncel • Tarafsız • Güvenilir</p>
                </div>
              </div>
              <p className="text-white text-opacity-70 text-sm leading-relaxed max-w-md">
                İnegöl ve çevresinden en güncel haberler, son dakika gelişmeleri ve yerel haberler için güvenilir kaynağınız. Haberler ilgili kaynaklardan derlenmektedir.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">İletişim</h4>
              <ul className="space-y-2 text-white text-opacity-70 text-sm">
                <li>İnegöl, Bursa</li>
                <li>info@inegolgundem.com</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white border-opacity-10 mt-8 pt-8 text-center text-white text-opacity-50 text-sm">
            <p>© 2025 İnegöl Gündem. Tüm hakları saklıdır.</p>
            <p className="mt-2 text-xs">Bu site bir haber agregatorüdür. Haberler ilgili kaynaklardan derlenmekte olup, tüm haklar ilgili kaynaklara aittir.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
