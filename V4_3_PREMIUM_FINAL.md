# Bilgin Ustası V4.3 — Premium Game UI Final Patch

Bu paket V4.1/V4.2 tabanının üstüne uygulanır.

## Tamamlanan fazlar
- Full-screen desktop-first game shell ve premium cobalt/neon UI polish
- Shop / Inventory: 200 item, kategori + rarity filtreleri, 20 item/sayfa, ürün inspector, set parçaları, kazanım yolları
- Character Hub: büyük karakter sahnesi, pet, ekipman slotları, envanter, görünüm, üs
- True Equip Engine: Shop -> satın al -> envanter -> kuşan -> karakter üzerinde wearable katman
- Yeni `back` (sırt eşyası) slotu
- Pet aksesuarlarının pet üzerinde görsel katmanı
- Room/Pet itemlerinin premium asset fallback'i
- 200/200 benzersiz premium WebP item renderı
- 140/140 giyilebilir item için hizalanmış wearable WebP katmanı

## Oyun döngüsü korunur
Ders/Test -> XP + Coin + Kristal -> Item Aç -> Kuşan/Kullan -> Dünya/Pet/Üs geliştir -> Yeni görev.

## Kopyalama
ZIP içeriğini proje kök dizinine kopyalayın ve aynı isimli dosyaların üzerine yazın.
Yeni `src/assets/game-assets/wearables/` klasörünü mutlaka ekleyin.

## Kontroller
- Katalog: 200 item / 200 benzersiz id / tekrar eden label yok
- Premium asset: 200 dosya / 200 farklı SHA-256
- Wearable: 140 gerekli giyilebilir item / 140 dosya / eksik 0
- JS/JSX TypeScript parser: syntax error 0
- Relative import: eksik 0

Not: Çalışma ortamında Vite paketi bulunmadığı ve npm registry erişimi olmadığı için production `vite build` burada çalıştırılamadı. Kod ve import kontrolleri ayrı parser ile tamamlandı.
