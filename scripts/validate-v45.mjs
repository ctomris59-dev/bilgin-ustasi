import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
let failed = false;
const fail = (message) => { console.error(`❌ ${message}`); failed = true; };
const ok = (message) => console.log(`✅ ${message}`);
const read = (rel) => fs.existsSync(path.join(root, rel)) ? fs.readFileSync(path.join(root, rel), "utf8") : "";

const required = [
  "src/components/avatar/AnimatedAvatar.jsx",
  "src/components/avatar/AvatarCanvas.jsx",
  "src/components/avatar/Wardrobe.jsx",
  "src/components/shell/AppShell.jsx",
  "src/data/avatarRig.js",
  "src/data/avatarParts.js",
  "src/data/gameAssets.js",
  "src/assets/avatar-v5/premium/heroMasterData.js",
  "src/v5-avatar.css",
  "src/v45-game.css",
  "src/v45-master.css",
  "src/v45-live-rig.css",
];
for (const rel of required) if (!fs.existsSync(path.join(root, rel))) fail(`Eksik V4.5 dosyası: ${rel}`);

const avatarCanvas = read("src/components/avatar/AvatarCanvas.jsx");
if (!avatarCanvas.includes('import AnimatedAvatar from "./AnimatedAvatar"')) fail("AvatarCanvas master AnimatedAvatar motoruna bağlı değil");
else ok("AvatarCanvas → tek master hero aktif");

const wardrobe = read("src/components/avatar/Wardrobe.jsx");
if (!wardrobe.includes('import AnimatedAvatar from "./AnimatedAvatar"')) fail("Wardrobe master hero kullanmıyor");
if (!wardrobe.includes("MOTIONS")) fail("Wardrobe animasyon konsolu eksik");
else ok("Wardrobe → live master hero + animasyon konsolu aktif");

const shell = read("src/components/shell/AppShell.jsx");
if (!shell.includes('import AnimatedAvatar from "../avatar/AnimatedAvatar"')) fail("Odak ekranları master hero kullanmıyor");
else ok("Test / sonuç / dünya / mini oyun → aynı hero motoru aktif");

const animated = read("src/components/avatar/AnimatedAvatar.jsx");
for (const marker of ["getWearableAsset", "getItemCardAsset", "getCharacterStyleAsset", "WearableLayer", "MotionFX", "motion-${motion}", "v45-live-stack"]) {
  if (!animated.includes(marker)) fail(`Live rig marker eksik: ${marker}`);
}
for (const slot of ["outfit", "shoes", "headwear", "face", "back"]) {
  if (!animated.includes(`loadout.${slot}`) && !animated.includes(`loadout[slot]`)) fail(`Giyilebilir slot bağlanmamış: ${slot}`);
}
if (animated.includes("PREMIUM_RIG_MASKS") || animated.includes("TintedMasterLayer")) fail("Eski renk-maskesi rig hâlâ aktif");
else ok("Gerçek wearable asset rig aktif; eski tint-mask rig kaldırıldı");

const liveCss = read("src/v45-live-rig.css");
for (const marker of ["v45LiveIdle", "v45LiveThinking", "v45LiveHappy", "v45LiveVictory", "v45LiveEquip", "v45-live-wearable.is-outfit", "v45-live-wearable.is-shoes", "v45-live-wearable.is-headwear", "v45-live-wearable.is-face", "v45-live-wearable.is-back"]) {
  if (!liveCss.includes(marker)) fail(`Live rig CSS marker eksik: ${marker}`);
}
const main = read("src/main.jsx");
if (!main.includes('import "./v45-live-rig.css"')) fail("Live rig CSS importu eksik");
else ok("Görünür hareket + gerçek wearable CSS production'a bağlı");

function countWebp(dir) {
  if (!fs.existsSync(dir)) return 0;
  let count = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) count += countWebp(full);
    else if (entry.name.toLowerCase().endsWith(".webp")) count += 1;
  }
  return count;
}
const wearablesDir = path.join(root, "src/assets/game-assets/wearables");
const wearableAssetCount = countWebp(wearablesDir);
if (wearableAssetCount < 20) fail(`Native wearable export sayısı beklenenden düşük: ${wearableAssetCount}`);
else ok(`${wearableAssetCount} native wearable export bulundu; yeni itemlerde card-art fallback aktif`);

for (const rel of [
  "src/assets/game-assets/wearables/outfit/outfit-tshirt.webp",
  "src/assets/game-assets/wearables/shoes/shoes-sneaker.webp",
]) {
  if (!fs.existsSync(path.join(root, rel))) fail(`Starter wearable eksik: ${rel}`);
}

try {
  const partsPath = path.join(root, "src/data/avatarParts.js");
  const parts = await import(`${pathToFileURL(partsPath).href}?validate=${Date.now()}`);
  const allowed = new Set(["outfit", "shoes", "headwear", "face", "back"]);
  const wearableItems = (parts.ITEMS || []).filter((item) => allowed.has(item.slot));
  if (!wearableItems.length) fail("Giyilebilir item kataloğu boş");
  else ok(`${wearableItems.length} giyilebilir katalog itemi live rig'e yönlendiriliyor`);
} catch (error) {
  fail(`Avatar item kataloğu doğrulanamadı: ${error.message}`);
}

if (failed) {
  console.error("\nV4.5 live wearable doğrulaması başarısız. Vite build başlatılmadı.");
  process.exit(1);
}
console.log("\n🚀 V4.5.2 — Live Wearables + Visible Motion doğrulaması başarılı.");