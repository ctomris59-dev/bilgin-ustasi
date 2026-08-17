# Bilgin Ustası V4.3.1 Hotfix

Bu paket Vercel build hatasını düzeltir:

`getWearableAsset is not exported by src/data/gameAssets.js`

Değişen dosyalar:
- `src/data/gameAssets.js`
- `src/components/avatar/AvatarCanvas.jsx`

ZIP içeriğini proje köküne çıkarın ve iki dosyanın da üzerine yazın.
`gameAssets.js` içinde `export const getWearableAsset = ...` bulunmalıdır.
