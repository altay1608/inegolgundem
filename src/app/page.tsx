'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useParams, useRouter } from 'next/navigation'
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

function formatTarih(dateStr?: string): string {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch {
    return dateStr
  }
}

function getKategoriRenk(kategori: string): string {
  const renkler: { [key: string]: string } = {
    'gundem': '#DC2626',
    'ekonomi': '#059669',
    'spor': '#2563EB',
    'kultur': '#7C3AED',
    'yasam': '#EA580C',
    'saglik': '#0891B2',
  }
  if (!kategori) return '#666'
  const k = kategori.toLowerCase().replace(/[üışğöç]/g, c => ({ü:'u',ı:'i',ş:'s',ğ:'g',ö:'o',ç:'c'}[c] || c))
  return renkler[k] || '#666'
}

export default function HaberDetay() {
  const params = useParams()
  const router = useRouter()
  const [haber, setHaber] = useState<Haber | null>(null)
  const [benzerHaberler, setBenzerHaberler] = useState<Haber[]>([])
  const [yukleniyor, setYukleniyor] = useState(true)

  useEffect(() => {
    async function loadHaber() {
      setYukleniyor(true)
      try {
        const id = params.id
        
        // Haberi çek
        const { data, error } = await supabase
          .from('haberler')
          .select('*')
          .eq('id', id)
          .single()
        
        if (error || !data) {
          console.error('Haber bulunamadı:', error)
          router.push('/')
          return
        }
        
        setHaber(data)
        
        // Benzer haberleri çek
        const { data: benzer } = await supabase
          .from('haberler')
          .select('*')
          .eq('kategori', data.kategori)
          .neq('id', id)
          .order('id', { ascending: false })
          .limit(4)
        
        if (benzer) {
          setBenzerHaberler(benzer)
        }
      } catch (e) {
        console.error('Hata:', e)
      }
      setYukleniyor(false)
    }
    
    if (params.id) {
      loadHaber()
    }
  }, [params.id, router])

  if (yukleniyor) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!haber) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">😕</p>
          <h1 className="text-2xl font-bold mb-2">Haber Bulunamadı</h1>
          <Link href="/" className="text-red-600 hover:underline">Ana Sayfaya Dön</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* HEADER */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="inline-block">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                <span className="text-gray-900">İNEGÖL</span>
                <span className="text-red-600">GÜNDEM</span>
              </h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em]">Bağımsız • Güvenilir • Yerel</p>
            </Link>
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm font-medium">Ana Sayfa</span>
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <article>
          {/* KATEGORİ */}
          <div className="mb-4">
            <span 
              className="inline-block px-3 py-1 text-xs font-bold text-white rounded-full uppercase"
              style={{ backgroundColor: getKategoriRenk(haber.kategori) }}
            >
              {haber.kategori}
            </span>
          </div>

          {/* BAŞLIK */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
            {haber.baslik}
          </h1>

          {/* META */}
          <div className="flex items-center gap-4 text-gray-500 text-sm mb-6 pb-6 border-b">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {haber.yazar || 'Editör'}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatTarih(haber.created_at)}
            </span>
          </div>

          {/* RESİM */}
          {haber.resim_url && (
            <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
              <img 
                src={haber.resim_url} 
                alt={haber.baslik}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* ÖZET */}
          <p className="text-xl text-gray-700 leading-relaxed mb-8 font-medium">
            {haber.ozet}
          </p>

          {/* İÇERİK */}
          {haber.icerik && (
            <div className="prose prose-lg max-w-none">
              {haber.icerik.split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className="text-gray-700 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                )
              ))}
            </div>
          )}

          {/* PAYLAŞ */}
          <div className="mt-12 pt-8 border-t">
            <h3 className="text-lg font-bold mb-4">Bu Haberi Paylaş</h3>
            <div className="flex gap-3">
              <a 
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(haber.baslik)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                𝕏 Twitter
              </a>
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Facebook
              </a>
              <a 
                href={`https://wa.me/?text=${encodeURIComponent(haber.baslik + ' ' + (typeof window !== 'undefined' ? window.location.href : ''))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full text-sm font-medium hover:bg-green-600 transition-colors"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </article>

        {/* BENZER HABERLER */}
        {benzerHaberler.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Benzer Haberler</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {benzerHaberler.map(h => (
                <Link href={`/haber/${h.id}`} key={h.id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img 
                      src={h.resim_url || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&q=80'} 
                      alt={h.baslik}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors">
                      {h.baslik}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2">{formatTarih(h.created_at)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-black text-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-black mb-2">İNEGÖL<span className="text-red-500">GÜNDEM</span></h2>
          <p className="text-gray-400 text-sm mb-4">İnegöl'ün en güvenilir haber kaynağı.</p>
          <p className="text-gray-500 text-sm">© 2025 İnegölGündem.com</p>
        </div>
      </footer>
    </div>
  )
}
