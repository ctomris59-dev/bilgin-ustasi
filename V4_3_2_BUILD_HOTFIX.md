# V4.3.2 Build Hotfix

Bu hotfix Vercel'deki şu hatayı kalıcı olarak kaldırır:

`getWearableAsset is not exported by src/data/gameAssets.js`

## Değişen tek kaynak dosya

`src/components/avatar/AvatarCanvas.jsx`

`AvatarCanvas` artık `getWearableAsset` fonksiyonunu `gameAssets.js` içinden import etmez.
Wearable WebP dosyalarını `import.meta.glob` ile doğrudan yükler.

Bu nedenle eski veya yeni `gameAssets.js` sürümü ile build edilebilir.
