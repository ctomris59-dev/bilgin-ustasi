# Bilgin Ustası – Game Asset Sistemi

Bu sürümde avatar, pet, dükkan, oda ve dünya görselleri Vite tarafından uygulama paketine dahil edilir. Böylece deploy sırasında `public/game-assets` alt klasörlerinin eksik yüklenmesi nedeniyle kırık görsel oluşmaz.

## Ana asset klasörü

`src/assets/game-assets/`

- `avatar/presets/` – tam karakter renderları
- `avatar/hair/` – hazır saç assetleri (ileride gerçek katmanlı avatar için kullanılabilir)
- `items/tops/` – üst giyim ürün renderları
- `items/bottoms/` – alt giyim ürün renderları
- `items/shoes/` – ayakkabılar
- `items/headwear/` – başlık/şapka renderları
- `items/accessories/` – aksesuarlar
- `pets/` – keşif dostları
- `rooms/items/` – üs eşyaları
- `worlds/` – bölge görselleri
- `ui/rarity/` – Common / Rare / Epic / Legendary çerçeveleri

## Asset registry

`src/data/gameAssets.js`

Dosya `import.meta.glob(...)` kullanır. Görseller build sırasında Vite tarafından fingerprint'li URL'lere dönüştürülür. Bu nedenle Vercel, Netlify veya alt klasörde çalışan deploy'larda mutlak `/game-assets/...` yolu kullanılmaz.

## Karakter sistemi

`src/components/avatar/AvatarCanvas.jsx`

Karakter artık kodla çizilmez. Tam karakter renderları kullanılır.

`src/components/avatar/Wardrobe.jsx`

Karakter ekranındaki "Kaşif Stili" seçenekleri gerçekten avatar görselini değiştirir. "Ekipmana Göre" seçeneğinde görünüm takılı ekipmanlara göre otomatik belirlenir.

Bu sürümde ten tonu ve saç rengi gibi tam karakter renderına uygulanamayan sahte kontroller kaldırılmıştır. Gerçek katmanlı body/hair/top/bottom renderer eklendiğinde bu kontroller yeniden açılabilir.

## Yeni asset eklemek

1. Görseli `src/assets/game-assets/` altında doğru klasöre koy.
2. Gerekirse `src/data/gameAssets.js` içindeki listeye veya eşlemeye ekle.
3. React ekranlarını tek tek değiştirmene gerek yoktur.
