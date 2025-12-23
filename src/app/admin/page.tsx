'use client'

import { useState, useEffect } from 'react'

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
  aktif: boolean
}

export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [password, setPassword] = useState('')
  const [haberler, setHaberler] = useState<Haber[]>([])
  const [loading, setLoading] = useState(false)
  const [editingHaber, setEditingHaber] = useState<Haber | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    baslik: '',
    ozet: '',
    icerik: '',
    kategori: 'GÜNDEM',
    resim_url: '',
    yazar: 'Editör'
  })

  const ADMIN_PASSWORD = 'inegol2024' // Basit şifre - sonra değiştir!

  const categories = ['GÜNDEM', 'EKONOMİ', 'SPOR', 'KÜLTÜR', 'EĞİTİM', 'SAĞLIK']

  // Haberleri çek
  const fetchHaberler = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/haberler?select=*&order=yayinlanma_tarihi.desc`,
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
      console.error('Hata:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      fetchHaberler()
    }
  }, [isLoggedIn])

  // Giriş yap
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsLoggedIn(true)
    } else {
      alert('Yanlış şifre!')
    }
  }

  // Haber ekle
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/haberler`,
        {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            ...formData,
            yayinlanma_tarihi: new Date().toISOString(),
            aktif: true
          })
        }
      )
      if (response.ok) {
        alert('Haber eklendi!')
        setShowForm(false)
        setFormData({ baslik: '', ozet: '', icerik: '', kategori: 'GÜNDEM', resim_url: '', yazar: 'Editör' })
        fetchHaberler()
      }
    } catch (error) {
      console.error('Hata:', error)
    }
  }

  // Haber güncelle
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingHaber) return
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/haberler?id=eq.${editingHaber.id}`,
        {
          method: 'PATCH',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify(formData)
        }
      )
      if (response.ok) {
        alert('Haber güncellendi!')
        setEditingHaber(null)
        setShowForm(false)
        setFormData({ baslik: '', ozet: '', icerik: '', kategori: 'GÜNDEM', resim_url: '', yazar: 'Editör' })
        fetchHaberler()
      }
    } catch (error) {
      console.error('Hata:', error)
    }
  }

  // Haber sil
  const handleDelete = async (id: number) => {
    if (!confirm('Bu haberi silmek istediğinize emin misiniz?')) return
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/haberler?id=eq.${id}`,
        {
          method: 'DELETE',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          }
        }
      )
      if (response.ok) {
        alert('Haber silindi!')
        fetchHaberler()
      }
    } catch (error) {
      console.error('Hata:', error)
    }
  }

  // Düzenlemeye başla
  const startEdit = (haber: Haber) => {
    setEditingHaber(haber)
    setFormData({
      baslik: haber.baslik,
      ozet: haber.ozet || '',
      icerik: haber.icerik || '',
      kategori: haber.kategori,
      resim_url: haber.resim_url || '',
      yazar: haber.yazar || 'Editör'
    })
    setShowForm(true)
  }

  // Giriş ekranı
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-red-700 to-red-900 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-amber-400 font-bold text-2xl">İG</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Paneli</h1>
            <p className="text-gray-500">İnegöl Gündem</p>
          </div>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              type="submit"
              className="w-full bg-red-700 text-white py-3 rounded-lg font-semibold hover:bg-red-800 transition-colors"
            >
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-700 to-red-900 rounded-lg flex items-center justify-center">
              <span className="text-amber-400 font-bold">İG</span>
            </div>
            <div>
              <h1 className="font-bold text-gray-800">İnegöl Gündem</h1>
              <p className="text-xs text-gray-500">Admin Paneli</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-gray-600 hover:text-gray-800 text-sm">
              ← Siteye Dön
            </a>
            <button
              onClick={() => setIsLoggedIn(false)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Çıkış
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Üst Bar */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Haberler ({haberler.length})
          </h2>
          <button
            onClick={() => {
              setEditingHaber(null)
              setFormData({ baslik: '', ozet: '', icerik: '', kategori: 'GÜNDEM', resim_url: '', yazar: 'Editör' })
              setShowForm(true)
            }}
            className="bg-red-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-800 transition-colors flex items-center gap-2"
          >
            <span>+</span> Yeni Haber
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <h3 className="text-xl font-bold text-gray-800">
                  {editingHaber ? 'Haber Düzenle' : 'Yeni Haber Ekle'}
                </h3>
              </div>
              <form onSubmit={editingHaber ? handleUpdate : handleAdd} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Başlık *</label>
                  <input
                    type="text"
                    required
                    value={formData.baslik}
                    onChange={(e) => setFormData({ ...formData, baslik: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Özet</label>
                  <textarea
                    rows={2}
                    value={formData.ozet}
                    onChange={(e) => setFormData({ ...formData, ozet: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">İçerik</label>
                  <textarea
                    rows={5}
                    value={formData.icerik}
                    onChange={(e) => setFormData({ ...formData, icerik: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                    <select
                      value={formData.kategori}
                      onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Yazar</label>
                    <input
                      type="text"
                      value={formData.yazar}
                      onChange={(e) => setFormData({ ...formData, yazar: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resim URL</label>
                  <input
                    type="url"
                    value={formData.resim_url}
                    onChange={(e) => setFormData({ ...formData, resim_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setEditingHaber(null)
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-red-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-800 transition-colors"
                  >
                    {editingHaber ? 'Güncelle' : 'Ekle'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Haber Listesi */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Başlık</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Yazar</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {haberler.map((haber) => (
                  <tr key={haber.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 line-clamp-1">
                        {haber.baslik}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                        {haber.kategori}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {haber.yazar}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(haber.yayinlanma_tarihi).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => startEdit(haber)}
                        className="text-blue-600 hover:text-blue-800 text-sm mr-4"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDelete(haber.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
