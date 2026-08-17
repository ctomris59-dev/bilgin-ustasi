import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
let failed = false;

function fail(message) {
  console.error(`❌ ${message}`);
  failed = true;
}

function ok(message) {
  console.log(`✅ ${message}`);
}

const required = [
  "src/components/shell/AppShell.jsx",
  "src/components/shell/SideNav.jsx",
  "src/components/shell/TopBar.jsx",
  "src/components/shell/RightRail.jsx",
  "src/components/Shop.jsx",
  "src/components/avatar/AvatarCanvas.jsx",
  "src/components/avatar/Wardrobe.jsx",
  "src/components/avatar/RoomBuilder.jsx",
  "src/components/StickerAlbum.jsx",
  "src/data/avatarParts.js",
  "src/data/petsAndRoom.js",
  "src/data/catalog.js",
  "src/data/gameAssets.js",
];

for (const rel of required) {
  if (!fs.existsSync(path.join(root, rel))) fail(`Eksik dosya: ${rel}`);
}

function countWebp(dir) {
  let count = 0;
  if (!fs.existsSync(dir)) return 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) count += countWebp(full);
    else if (entry.name.toLowerCase().endsWith(".webp")) count += 1;
  }
  return count;
}

const premiumCount = countWebp(path.join(root, "src/assets/game-assets/premium"));
const wearableCount = countWebp(path.join(root, "src/assets/game-assets/wearables"));

console.log(`🎨 Premium item art: ${premiumCount}/200`);
console.log(`🧥 Wearable layers: ${wearableCount}/140`);

if (premiumCount !== 200) fail(`Premium item asset sayısı 200 olmalı; bulunan: ${premiumCount}`);
else ok("200 benzersiz premium item asseti mevcut");

if (wearableCount !== 140) fail(`Wearable asset sayısı 140 olmalı; bulunan: ${wearableCount}`);
else ok("140 wearable katmanı mevcut");

const avatarCanvasPath = path.join(root, "src/components/avatar/AvatarCanvas.jsx");
if (fs.existsSync(avatarCanvasPath)) {
  const avatarCanvas = fs.readFileSync(avatarCanvasPath, "utf8");
  const namedImportPattern = /import\s*\{[^}]*getWearableAsset[^}]*\}\s*from\s*["']\.\.\/\.\.\/data\/gameAssets["']/s;
  if (namedImportPattern.test(avatarCanvas)) {
    fail("AvatarCanvas eski getWearableAsset named importunu kullanıyor");
  } else {
    ok("AvatarCanvas build-safe wearable loader kullanıyor");
  }
}

const gameAssetsPath = path.join(root, "src/data/gameAssets.js");
if (fs.existsSync(gameAssetsPath)) {
  const gameAssets = fs.readFileSync(gameAssetsPath, "utf8");
  for (const requiredExport of ["getAvatarPreset", "getItemCardAsset", "getItemAsset", "getPetAsset"]) {
    const hasExport = new RegExp(`export\\s+(?:function|const)\\s+${requiredExport}\\b`).test(gameAssets);
    if (!hasExport) fail(`gameAssets.js export eksik: ${requiredExport}`);
  }
}

if (failed) {
  console.error("\nV4.3 doğrulaması başarısız. Vite build başlatılmadı.");
  process.exit(1);
}

console.log("\n🚀 V4.3 dosya ve asset kontrolü başarılı.");
