'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

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
  slug: string;
}

export default function HaberDetay() {
  const params = useParams();
  const [haber, setHaber] = useState<Haber | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [benzerHaberler, setBenzerHaberler] = useState<Haber[]>([]);

  useEffect(() => {
    const haberiGetir = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/haberler?slug=eq.${params.slug}&aktif=eq.true`,
          {
            headers: {
              apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            },
          }
        );
        const data = await response.json();
        if (data && data.length > 0) {
          setHaber(data[0]);
        }

        const benzerResponse = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/haberler?aktif=eq.true&order=created_at.desc&limit=4`,
          {
            headers: {
              apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            },
          }
        );
        const benzerData = await benzerResponse.json();
        setBenzerHaberler(benzerData.filter((h: Haber) => h.slug !== params.slug).slice(0, 3));
      } catch (error) {
        console.error('Haber yüklenirken hata:', error);
      } finally {
        setYukleniyor(false);
      }
    };

    if (params.slug) {
      haberiGetir();
    }
  }, [params.slug]);

  const tarihFormatla = (tarih: string) => {
    return new Date(tarih).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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
          <p className="text-white text-opacity-70 text-lg tracking-wider">Haber yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!haber) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Haber Bulunamadı</h1>
          <p className="text-slate-600 mb-6">Aradığınız haber mevcut değil veya kaldırılmış olabilir.</p>
          <Link href="/" className="bg-red-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-800 transition-colors">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-gradient-to-r from-red-900 via-red-800 to-red-900 shadow-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-4">
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
            </Link>
            <Link href="/" className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors">
              ← Ana Sayfa
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <article>
          <nav className="text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:text-red-900">Ana Sayfa</Link>
            <span className="mx-2">›</span>
            <span className="text-slate-700">Haber</span>
          </nav>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-6 leading-tight">
            {haber.baslik}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-8 pb-6 border-b border-slate-200">
            <span className="flex items-center gap-1">
              <span>📅</span>
              {tarihFormatla(haber.created_at)}
            </span>
            <span className="flex items-center gap-1">
              <span>✍️</span>
              {haber.yazar}
            </span>
            {haber.kaynak_url && (
              <span className="flex items-center gap-1">
                <span>📰</span>
                Kaynak: {kaynakAdiGetir(haber.kaynak_url)}
              </span>
            )}
          </div>

          <div className="relative aspect-video rounded-2xl overflow-hidden mb-8 shadow-lg">
            <img
              src={haber.resim_url || '/son-dakika.png'}
              alt={haber.baslik}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/son-dakika.png';
              }}
            />
          </div>

          <div className="bg-slate-100 rounded-xl p-6 mb-8">
            <p className="text-lg text-slate-700 leading-relaxed font-medium">
              {haber.ozet || haber.icerik?.substring(0, 300)}
            </p>
          </div>

          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
              {haber.icerik}
            </p>
          </div>

          {haber.kaynak_url && (
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 mb-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-white/70 text-sm mb-1">Haberin devamı için</p>
                  <p className="text-white font-semibold">
                    📰 {kaynakAdiGetir(haber.kaynak_url)} sitesini ziyaret edin
                  </p>
                </div>
                <a
                  href={haber.kaynak_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg flex items-center gap-2"
                >
                  Haberin Devamını Oku
                  <span>→</span>
                </a>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 py-6 border-t border-b border-slate-200 mb-8">
            <span className="text-slate-600 font-medium">Paylaş:</span>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(haber.baslik)}&url=${encodeURIComponent(`https://inegolgundem.com/haber/${haber.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-100 hover:bg-slate-200 p-2 rounded-lg transition-colors"
            >
              𝕏
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://inegolgundem.com/haber/${haber.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-100 hover:bg-slate-200 p-2 rounded-lg transition-colors"
            >
              📘
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(haber.baslik + ' - https://inegolgundem.com/haber/' + haber.slug)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-100 hover:bg-slate-200 p-2 rounded-lg transition-colors"
            >
              💬
            </a>
          </div>
        </article>

        {benzerHaberler.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span className="w-1 h-8 bg-red-900 rounded"></span>
              Diğer Haberler
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {benzerHaberler.map((benzerHaber) => (
                <Link
                  key={benzerHaber.id}
                  href={`/haber/${benzerHaber.slug}`}
                  className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={benzerHaber.resim_url || '/son-dakika.png'}
                      alt={benzerHaber.baslik}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/son-dakika.png';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-slate-800 line-clamp-2 group-hover:text-red-900 transition-colors">
                      {benzerHaber.baslik}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="bg-gradient-to-r from-red-900 via-red-800 to-red-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-white text-opacity-50 text-sm">
            <p>© 2025 İnegöl Gündem. Tüm hakları saklıdır.</p>
            <p className="mt-2 text-xs">Bu site bir haber agregatorüdür. Haberler ilgili kaynaklardan derlenmekte olup, tüm haklar ilgili kaynaklara aittir.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
