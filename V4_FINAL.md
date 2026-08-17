# Bilgin Ustası — Game UI V4 Final

Bu sürüm uygulamanın **ders çalış → test çöz → XP/coin/kristal kazan → item aç → karakter/pet/üs geliştir → yeni dünyaya ilerle** döngüsünü koruyarak masaüstü oyun arayüzüne dönüştürür.

## V4 ana sistemleri

- Tam ekran desktop-first `AppShell`
- Sol oyun navigasyonu, üst HUD, bağlama duyarlı sağ inspector
- Shop + koleksiyon + gerçek yaşam ödülleri
- Common / Rare / Epic / Legendary kart sistemi
- 80 envanter kaydı için 80 ayrı premium WebP kart görseli
- Karakter ekipmanı, pet ve pet aksesuarı
- Sürükle-bırak üs/oda düzenleyici
- Test ve sonuç ekranında focus mode
- Kusursuz testte kristal ödülü
- Dünya haritası + dünya bazlı item kilitleri
- Tekrar Merkezi
- Keşif Arşivi + rozet kasası
- Mobilde bottom dock, masaüstünde 3 panel düzeni

## Premium asset konumu

`src/assets/game-assets/premium/<slot>/<item-id>.webp`

Tüm item kartları merkezi olarak `src/data/gameAssets.js` ve `src/data/catalog.js` üzerinden okunur.

## Çalıştırma

```bash
npm install
npm run dev
```

Üretim build:

```bash
npm run build
```

V4 dosya/asset kontrolü:

```bash
npm run check:v4
```

## Not

Eski profil kayıtları `normalizeProfile()` ile korunur. Yeni `gems` alanı eski profillerde otomatik `0` olarak eklenir.
