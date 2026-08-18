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
  "src/v45-game.css",
  "src/v45-master.css",
  "src/v45-live-rig.css",
];
for (const rel of required) if (!fs.existsSync(path.join(root, rel))) fail(`Eksik V4.5.3 dosyası: ${rel}`);

const avatarCanvas = read("src/components/avatar/AvatarCanvas.jsx");
if (!avatarCanvas.includes('import AnimatedAvatar from "./AnimatedAvatar"')) fail("AvatarCanvas master AnimatedAvatar motoruna bağlı değil");
else ok("AvatarCanvas → tek master hero aktif");

const wardrobe = read("src/components/avatar/Wardrobe.jsx");
if (!wardrobe.includes('import AnimatedAvatar from "./AnimatedAvatar"')) fail("Wardrobe master hero kullanmıyor");
if (!wardrobe.includes("chooseAndEquip")) fail("Envanter kartı tek tık kuşanma akışına bağlı değil");
if (!wardrobe.includes("setMotion(id)")) fail("Wardrobe animasyon butonları motion state'e bağlı değil");
else ok("Wardrobe → tek tık kuşanma + motion state aktif");

const shell = read("src/components/shell/AppShell.jsx");
if (!shell.includes('import AnimatedAvatar from "../avatar/AnimatedAvatar"')) fail("Odak ekranları master hero kullanmıyor");
else ok("Test / sonuç / dünya / mini oyun → aynı hero motoru aktif");

const animated = read("src/components/avatar/AnimatedAvatar.jsx");
for (const marker of ["heroMaster", "getWearableAsset", "WearableLayer", "requestAnimationFrame", "motionFrame", "stackRef", "MotionFX", "v45-live-stack"]) {
  if (!animated.includes(marker)) fail(`Master live rig marker eksik: ${marker}`);
}
if (animated.includes("getCharacterStyleAsset")) fail("Kıyafete göre eski preset karaktere geçiş hâlâ aktif");
if (animated.includes("PREMIUM_RIG_MASKS") || animated.includes("TintedMasterLayer")) fail("Eski tint-mask rig hâlâ aktif");
else ok("Karakter heroMaster'a kilitli; eski preset/tint rig kaldırıldı");

for (const slot of ["outfit", "shoes", "headwear", "face", "back"]) {
  if (!animated.includes(`avatar.${slot}`) && !animated.includes(`loadout[slot]`)) fail(`Giyilebilir slot bağlanmamış: ${slot}`);
}

const liveCss = read("src/v45-live-rig.css");
for (const marker of ["is-native-wearable", "object-fit:fill", "transform:none!important", "v453WearableFlash", "v45-fx-question", "v45-fx-star"]) {
  if (!liveCss.includes(marker)) fail(`V4.5.3 wearable/motion CSS marker eksik: ${marker}`);
}
const main = read("src/main.jsx");
if (!main.includes('import "./v45-live-rig.css"')) fail("Live rig CSS importu eksik");
else ok("Full-canvas wearable CSS production'a bağlı");

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
if (wearableAssetCount < 100) fail(`Native wearable export sayısı beklenenden düşük: ${wearableAssetCount}`);
else ok(`${wearableAssetCount} native wearable export bulundu`);

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
  else ok(`${wearableItems.length} giyilebilir katalog itemi live rig'e bağlı`);
} catch (error) {
  fail(`Avatar item kataloğu doğrulanamadı: ${error.message}`);
}

if (failed) {
  console.error("\nV4.5.3 doğrulaması başarısız. Vite build başlatılmadı.");
  process.exit(1);
}
console.log("\n🚀 V4.5.3 — Fixed Master Hero / Full Canvas Wearables / RAF Motion doğrulaması başarılı.");
