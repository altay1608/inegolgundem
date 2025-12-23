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

            <nav className="hidden lg:flex items-center gap-1">
              {['GÜNDEM', 'EKONOMİ', 'SPOR', 'KÜLTÜR'].map((item) => (
                <button
                  key={item}
                  onClick={() => setFiltreliKategori(item)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    filtreliKategori === item
                      ? 'bg-white text-red-900'
                      : 'text-white text-opacity-80 hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  {item}
                </button>
              ))}
            </nav>

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

      <main className="max-w-7xl mx-auto px-4 py-8">
        {mansetHaber && (
          <section className="mb-12">
            <div className="relative group overflow-hidden rounded-3xl shadow-2xl bg-slate-900">
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
                  {mansetHaber.kategori}
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
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {kategoriler.map((kategori) => (
            <button
              key={kategori}
              onClick={() => setFiltreliKategori(kategori)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                filtreliKategori === kategori
                  ? 'bg-red-900 text-white shadow-lg scale-105'
                  : 'bg-white text-slate-600 hover:bg-slate-100 shadow-md hover:shadow-lg'
              }`}
            >
              {kategori}
            </button>
          ))}
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {digerHaberler.map((haber) => (
            <article
              key={haber.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-1"
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
                <span className="absolute top-4 left-4 bg-red-900 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  {haber.kategori}
                </span>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-red-900 transition-colors duration-300">
                  {haber.baslik}
                </h3>
                <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                  {haber.ozet || haber.icerik?.substring(0, 120)}...
                </p>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-100">
                  <span>{haber.yazar}</span>
                  <span>{tarihFormatla(haber.created_at)}</span>
                </div>
              </div>
            </article>
          ))}
        </section>

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

      <footer className="bg-gradient-to-r from-red-900 via-red-800 to-red-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
                İnegöl ve çevresinden en güncel haberler, son dakika gelişmeleri ve yerel haberler için güvenilir kaynağınız.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Kategoriler</h4>
              <ul className="space-y-2">
                {['Gündem', 'Ekonomi', 'Spor', 'Kültür', 'Eğitim'].map((item) => (
                  <li key={item}>
                    <button className="text-white text-opacity-70 hover:text-white transition-colors text-sm">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
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
          </div>
        </div>
      </footer>
    </div>
  );
}
