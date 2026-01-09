# İnegöl Gündem - Haber Portalı v2.0

İnegöl'ün en güncel haber portalı. n8n otomasyon entegrasyonu ile çalışır.

## 🚀 Teknolojiler

- **Next.js 14** - React Framework
- **Tailwind CSS** - Styling
- **TypeScript** - Type Safety
- **n8n** - Haber Otomasyonu

## 📦 Kurulum

```bash
npm install
npm run dev
```

## ⚙️ n8n Entegrasyonu

`.env.local` dosyası oluşturun:

```env
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/haberler
```

n8n workflow'unuz şu formatta JSON döndürmeli:

```json
[
  {
    "id": 1,
    "kategori": "GÜNDEM",
    "baslik": "Haber Başlığı",
    "ozet": "Haber özeti...",
    "tarih": "9 Ocak 2025",
    "saat": "14:32",
    "resim": "https://example.com/image.jpg",
    "yazar": "Yazar Adı",
    "okunmaSuresi": "4 dk"
  }
]
```

## 🎨 Özellikler

- ✅ Responsive tasarım
- ✅ Son dakika haberleri banner
- ✅ Kategori filtreleme
- ✅ Haber arama
- ✅ Hava durumu widget
- ✅ Döviz kurları widget
- ✅ Sosyal medya entegrasyonu
- ✅ SEO optimizasyonu
- ✅ Otomatik haber güncelleme (5 dk)

## 🌐 Deploy

### Vercel
```bash
npm run build
vercel --prod
```

### Cloudflare Pages
```bash
npm run build
# Build output: .next (static export için out)
```

## 📝 Lisans

© 2025 İnegöl Gündem - Tüm hakları saklıdır.
