import fs from "node:fs";
const read=(p)=>fs.readFileSync(new URL(`../${p}`,import.meta.url),"utf8");
const avatar=read("src/data/avatarParts.js");
const hub=read("src/components/v47/HeroHub.jsx");
const storage=read("src/lib/storage.js");
const main=read("src/main.jsx");
const pkg=JSON.parse(read("package.json"));
const checks=[
  [pkg.version==="4.9.0","Sürüm 4.9.0"],
  [(avatar.match(/id:\"(?:outfit|shoes|headwear|face|back)-v49-/g)||[]).length===15,"15 yeni item"],
  [avatar.includes('setPrice: 360')&&avatar.includes('setPrice: 340'),"3 tamamlanmış set fiyatı"],
  [hub.includes('getCharacterSetAsset')&&hub.includes('v49-set-hero'),"Tam karakter set renderı"],
  [hub.includes('makeAvatarForSet')&&hub.includes('Set bütünlüğü: 5 parça birlikte uygulanır'),"Set bütünlüğü aktif"],
  [!hub.includes('WardrobeAvatar'),"Eski katmanlı WardrobeAvatar kapalı"],
  [!fs.existsSync(new URL('../src/components/v48/WardrobeAvatar.jsx',import.meta.url)),"Eski V4.8 renderer silindi"],
  [!fs.existsSync(new URL('../src/v48-wardrobe.css',import.meta.url)),"Eski V4.8 CSS silindi"],
  [main.includes('./v49-wardrobe.css'),"V4.9 görsel CSS aktif"],
  [storage.includes('makeAvatarForSet')&&storage.includes('detectedSet'),"Eski profil V4.9 sete migrate oluyor"],
  [fs.existsSync(new URL('../src/assets/v49/explorerFull.js',import.meta.url))&&fs.existsSync(new URL('../src/assets/v49/cloudFull.js',import.meta.url))&&fs.existsSync(new URL('../src/assets/v49/forestFull.js',import.meta.url)),"Üç karaktere özel görsel paket mevcut"],
];
let failed=false;for(const [ok,label] of checks){console.log(`${ok?'✅':'❌'} ${label}`);if(!ok)failed=true;}if(failed)process.exit(1);console.log('🚀 V4.9 — CHARACTER-LOCKED FULL-RENDER WARDROBE doğrulaması başarılı.');
