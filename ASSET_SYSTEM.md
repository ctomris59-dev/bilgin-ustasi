# Bilgin Ustası – Profesyonel Game Asset Sistemi

Bu sürümde eski SVG/kodla çizilen avatar, pet ve envanter görselleri yerine asset tabanlı sistem kullanılır.

## Ana klasör

`public/game-assets/`

- `avatar/presets/` – yüksek kaliteli tam karakter renderları
- `avatar/hair/` – saç önizlemeleri
- `items/tops/` – üst giyim görselleri
- `items/bottoms/` – alt giyim görselleri
- `items/shoes/` – ayakkabılar
- `items/headwear/` – başlık/şapka parçaları
- `items/accessories/` – aksesuar ve ekipmanlar
- `pets/` – keşif dostları
- `rooms/items/` – oda/üs eşyaları
- `worlds/` – bölge görselleri
- `ui/rarity/` – Common / Rare / Epic / Legendary çerçeveleri

## Görselleri uygulamaya bağlayan dosya

`src/data/gameAssets.js`

Yeni bir görseli sisteme bağlamak için çoğu durumda React bileşenlerine dokunmak gerekmez. Görseli ilgili klasöre koyup `gameAssets.js` içindeki asset listesine eklemek yeterlidir.

## Avatar

`src/components/avatar/AvatarCanvas.jsx`

Artık SVG ile yüz/gövde çizmez. `gameAssets.js` içinden profesyonel karakter renderını alır. Takılı başlık ve aksesuarlar ayrıca ekipman rozeti olarak gösterilir.

## Dükkan

`src/components/Shop.jsx`

Her ürün gerçek asset görseliyle, rarity çerçevesi içinde gösterilir. Aynı görsel detay modalında daha büyük kullanılır.

## Karakter Profili

`src/components/avatar/Wardrobe.jsx`

Saç seçeneklerinde gerçek önizleme, ekipman kartlarında gerçek ürün görseli, pet sekmesinde gerçek pet renderı kullanılır.

## Oda / Üs

`RoomBackground.jsx`, `RoomItemGlyph.jsx` ve `RoomBuilder.jsx` gerçek oda assetlerini kullanır.

## Kaliteyi daha da yükseltmek

İleride aynı sistem içinde 1024px şeffaf PNG/WebP renderlar eklenebilir. Dosya isimleri ve resolver eşleşmeleri korunduğu sürece uygulamanın geri kalanını değiştirmek gerekmez.
