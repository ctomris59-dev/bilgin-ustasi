import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
let failed = false;
const fail = (m) => { console.error(`❌ ${m}`); failed = true; };
const ok = (m) => console.log(`✅ ${m}`);
const read = (rel) => fs.existsSync(path.join(root, rel)) ? fs.readFileSync(path.join(root, rel), "utf8") : "";

const required = [
  "src/components/avatar/AnimatedAvatar.jsx",
  "src/components/avatar/AvatarCanvas.jsx",
  "src/components/avatar/Wardrobe.jsx",
  "src/components/shell/AppShell.jsx",
  "src/data/avatarRig.js",
  "src/data/avatarParts.js",
  "src/data/premiumRigMasks.js",
  "src/assets/avatar-v5/premium/heroMasterData.js",
  "src/v45-live-rig.css",
];
for (const rel of required) if (!fs.existsSync(path.join(root, rel))) fail(`Eksik V4.5.6 dosyası: ${rel}`);

const animated = read("src/components/avatar/AnimatedAvatar.jsx");
for (const marker of ["heroMaster", "PREMIUM_RIG_MASKS", "MaskedSlot", "OutfitDetails", "ShoeDetails", "HeadwearLayer", "AccessoryLayer", "BackBehind", "requestAnimationFrame", "v456-core-svg"]) {
  if (!animated.includes(marker)) fail(`Core rig marker eksik: ${marker}`);
}
if (/getWearableAsset|getItemCardAsset|v45-body-rig|OutfitRig\(|ShoesRig\(/.test(animated)) fail("Eski ürün-sticker/body-vector rig kodu AnimatedAvatar içinde aktif");
else ok("Ürün görselleri karaktere sticker olarak bindirilmiyor");
if (!animated.includes('data-avatar-version="4.5.6-core18"')) fail("Renderer sürümü 4.5.6-core18 değil");
else ok("Tek master + Core 18 renderer aktif");

const maskSource = read("src/data/premiumRigMasks.js");
for (const slot of ["outfit", "shoes", "back", "headwear"]) {
  if (!maskSource.includes(`\"${slot}\"`) && !maskSource.includes(`${slot}:`)) fail(`Master mask eksik: ${slot}`);
}
ok("Master pixel mask şablonları mevcut");

const wardrobe = read("src/components/avatar/Wardrobe.jsx");
if (!wardrobe.includes("V4.5.6 · CORE 18")) fail("Wardrobe Core 18 sürüm etiketi eksik");
if (!wardrobe.includes("MOTIONS")) fail("Animasyon konsolu eksik");
if (!wardrobe.includes("chooseAndEquip")) fail("Envanter tek tık kuşanma bağlı değil");
else ok("Wardrobe: tek tık kuşanma + motion state bağlı");

const canvas = read("src/components/avatar/AvatarCanvas.jsx");
const shell = read("src/components/shell/AppShell.jsx");
if (!canvas.includes("AnimatedAvatar")) fail("AvatarCanvas master renderer kullanmıyor");
if (!shell.includes("AnimatedAvatar")) fail("AppShell master renderer kullanmıyor");
else ok("Oyunun avatar gösterimleri tek AnimatedAvatar motorunda");

const storage = read("src/lib/storage.js");
if (!storage.includes("sanitizeUnlockedItems") || !storage.includes("sanitizeAvatar")) fail("Legacy wearable migration eksik");
else ok("Eski wearable ID'leri Core 18'e migrate ediliyor");

try {
  const partsPath = path.join(root, "src/data/avatarParts.js");
  const parts = await import(`${pathToFileURL(partsPath).href}?validate=${Date.now()}`);
  const items = parts.ITEMS || [];
  if (items.length !== 18) fail(`Core katalog 18 item olmalı; bulunan: ${items.length}`);
  else ok("Core katalog tam 18 item");

  const expected = { outfit: 4, shoes: 4, headwear: 3, face: 4, back: 3 };
  for (const [slot, count] of Object.entries(expected)) {
    const actual = items.filter((entry) => entry.slot === slot).length;
    if (actual !== count) fail(`${slot} slotu ${count} item olmalı; bulunan ${actual}`);
    else ok(`${slot}: ${actual}/${count}`);
  }

  const ids = new Set(items.map((entry) => entry.id));
  if (ids.size !== items.length) fail("Core item ID tekrarları var");
  const starters = items.filter((entry) => entry.starter);
  if (starters.length !== 5) fail(`Başlangıç loadout'u 5 slot olmalı; bulunan ${starters.length}`);
  else ok("Başlangıç loadout'u 5/5 slotu dolduruyor");

  for (const entry of items) {
    if (!entry.rig?.style) fail(`${entry.id}: rig.style eksik`);
    const artId = entry.assetId || entry.id;
    const artSlot = entry.assetSlot || entry.slot;
    const webp = path.join(root, `src/assets/game-assets/premium/${artSlot}/${artId}.webp`);
    const png = path.join(root, `src/assets/game-assets/unique/${artSlot}/${artId}.png`);
    if (!fs.existsSync(webp) && !fs.existsSync(png)) fail(`${entry.id}: shop artwork bulunamadı (${artSlot}/${artId})`);
  }
  ok("18 itemin shop artwork eşlemeleri doğrulandı");
} catch (error) {
  fail(`Core katalog okunamadı: ${error.message}`);
}

if (failed) {
  console.error("\nV4.5.6 Core 18 doğrulaması başarısız. Build durduruldu.");
  process.exit(1);
}
console.log("\n🚀 V4.5.6 — ONE MASTER HERO / CORE 18 / 5 FIXED SLOTS / SHOP+WORN IDENTITY doğrulaması başarılı.");
