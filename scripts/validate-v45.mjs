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
  "src/assets/avatar-v5/premium/heroMasterData.js",
  "src/v45-live-rig.css",
  "src/v45-master.css",
];
for (const rel of required) if (!fs.existsSync(path.join(root, rel))) fail(`Eksik V4.5.4 dosyası: ${rel}`);

const canvas = read("src/components/avatar/AvatarCanvas.jsx");
if (!canvas.includes('import AnimatedAvatar from "./AnimatedAvatar"')) fail("AvatarCanvas master hero bridge eksik");
else ok("AvatarCanvas → tek AnimatedAvatar master motoru");

const wardrobe = read("src/components/avatar/Wardrobe.jsx");
if (!wardrobe.includes("chooseAndEquip")) fail("Envanter kartına tek tık kuşanma eksik");
if (!wardrobe.includes("MOTIONS")) fail("Motion konsolu eksik");
else ok("Wardrobe → tek tık kuşanma + motion state aktif");

const animated = read("src/components/avatar/AnimatedAvatar.jsx");
for (const marker of ["heroMaster", "requestAnimationFrame", "BackRig", "FrontRig", "OutfitRig", "ShoesRig", "HeadRig", "FaceRig", "motionFrame"]) {
  if (!animated.includes(marker)) fail(`Body rig marker eksik: ${marker}`);
}
if (animated.includes("getWearableAsset") || animated.includes("getItemCardAsset") || animated.includes("WearableLayer")) fail("Sticker/card-art wearable sistemi hâlâ aktif");
else ok("Ürün kartı sticker overlay kaldırıldı; body-anchored vector rig aktif");

const css = read("src/v45-live-rig.css");
for (const marker of ["v45-body-rig", "v45-body-rig-back", "v45-body-rig-front", "v454RigFlash", "v454Question", "v454StarPop"]) {
  if (!css.includes(marker)) fail(`Body rig CSS marker eksik: ${marker}`);
}
if (css.includes("v45-live-wearable.is-native-wearable")) fail("Eski full-canvas wearable CSS hâlâ aktif");
else ok("Body-anchored SVG rig CSS aktif");

try {
  const partsPath = path.join(root, "src/data/avatarParts.js");
  const parts = await import(`${pathToFileURL(partsPath).href}?validate=${Date.now()}`);
  const allowed = new Set(["outfit", "shoes", "headwear", "face", "back"]);
  const wearable = (parts.ITEMS || []).filter((item) => allowed.has(item.slot));
  if (!wearable.length) fail("Giyilebilir katalog boş");
  else ok(`${wearable.length} giyilebilir item body rig tür/renk/variant sistemine bağlı`);
} catch (e) {
  fail(`Katalog doğrulanamadı: ${e.message}`);
}

if (failed) {
  console.error("\nV4.5.4 doğrulaması başarısız; Vite build durduruldu.");
  process.exit(1);
}
console.log("\n🚀 V4.5.4 — Single Master Hero / Body Anchored Equipment / RAF Motion doğrulaması başarılı.");
