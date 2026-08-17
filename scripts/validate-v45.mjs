import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
let failed = false;
const fail = (message) => { console.error(`❌ ${message}`); failed = true; };
const ok = (message) => console.log(`✅ ${message}`);

const required = [
  "src/components/avatar/AnimatedAvatar.jsx",
  "src/components/avatar/AvatarCanvas.jsx",
  "src/components/avatar/Wardrobe.jsx",
  "src/components/shell/AppShell.jsx",
  "src/data/avatarRig.js",
  "src/data/avatarParts.js",
  "src/data/premiumRigMasks.js",
  "src/assets/avatar-v5/premium/heroMasterData.js",
  "src/v5-avatar.css",
  "src/v45-game.css",
  "src/v45-master.css",
];

for (const rel of required) {
  if (!fs.existsSync(path.join(root, rel))) fail(`Eksik V4.5 master-hero dosyası: ${rel}`);
}

const read = (rel) => fs.existsSync(path.join(root, rel)) ? fs.readFileSync(path.join(root, rel), "utf8") : "";

const avatarCanvas = read("src/components/avatar/AvatarCanvas.jsx");
if (!avatarCanvas.includes('import AnimatedAvatar from "./AnimatedAvatar"')) fail("AvatarCanvas master AnimatedAvatar motoruna bağlı değil");
else ok("AvatarCanvas → tek premium master hero aktif");

const wardrobe = read("src/components/avatar/Wardrobe.jsx");
if (!wardrobe.includes('import AnimatedAvatar from "./AnimatedAvatar"')) fail("Wardrobe premium master hero kullanmıyor");
if (wardrobe.includes('import GameHero from "./GameHero"')) fail("Legacy GameHero hâlâ Wardrobe içinde aktif");
if (!wardrobe.includes("MOTIONS")) fail("Wardrobe animasyon kontrolü eksik");
else ok("Wardrobe → aynı master hero + animasyon konsolu aktif");

const shell = read("src/components/shell/AppShell.jsx");
if (!shell.includes('import AnimatedAvatar from "../avatar/AnimatedAvatar"')) fail("Odak ekranları master hero kullanmıyor");
else ok("Test / sonuç / dünya / mini oyun → aynı master hero aktif");

const animated = read("src/components/avatar/AnimatedAvatar.jsx");
for (const marker of [
  "heroMasterData.js",
  "PREMIUM_RIG_MASKS",
  "BackAccessory",
  "OutfitDetails",
  "ShoeDetails",
  "PremiumHeadwear",
  "PremiumFaceItem",
  "WingAccessory",
  "BlinkOverlay",
  "motion-${motion}",
]) {
  if (!animated.includes(marker)) fail(`Master avatar katmanı/özelliği eksik: ${marker}`);
}
for (const slot of ["outfit", "shoes", "headwear", "face", "back"]) {
  if (!animated.includes(`loadout.${slot}`)) fail(`Giyilebilir slot bağlanmamış: ${slot}`);
}
if (animated.includes("function HairBack") || animated.includes('className="v5-avatar-svg"')) fail("Legacy primitive SVG kahraman geri dönmüş");
else ok("Premium raster master + ekipman overlay rig aktif");

const main = read("src/main.jsx");
if (!main.includes('import "./v45-master.css"')) fail("V4.5 master hero CSS importu eksik");
else ok("V4.5 master presentation CSS aktif");

try {
  const partsPath = path.join(root, "src/data/avatarParts.js");
  const moduleUrl = `${pathToFileURL(partsPath).href}?validate=${Date.now()}`;
  const parts = await import(moduleUrl);
  const allowed = new Set(["outfit", "shoes", "headwear", "face", "back"]);
  const wearable = (parts.ITEMS || []).filter((item) => allowed.has(item.slot));
  const unsupported = (parts.ITEMS || []).filter((item) => !allowed.has(item.slot));
  if (!wearable.length) fail("Giyilebilir item kataloğu boş");
  else ok(`${wearable.length} giyilebilir item master rig'e bağlı`);
  if (unsupported.length) console.log(`ℹ️ Wearable dışı katalog kaydı: ${unsupported.length}`);
} catch (error) {
  fail(`Avatar item kataloğu doğrulanamadı: ${error.message}`);
}

try {
  const dataPath = path.join(root, "src/assets/avatar-v5/premium/heroMasterData.js");
  const source = fs.readFileSync(dataPath, "utf8");
  if (!source.includes("data:image/webp;base64")) fail("Premium hero master WebP data URI değil");
  else ok("Premium master-art WebP bundle aktif");
} catch (error) {
  fail(`Premium master-art okunamadı: ${error.message}`);
}

if (failed) {
  console.error("\nV4.5 master hero doğrulaması başarısız. Vite build başlatılmadı.");
  process.exit(1);
}

console.log("\n🚀 V4.5 — Tek Master Hero / Tüm Ekipmanlar / Animasyon doğrulaması başarılı.");
