import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
let failed = false;
const fail = (message) => { console.error(`❌ ${message}`); failed = true; };
const ok = (message) => console.log(`✅ ${message}`);

const required = [
  "src/components/shell/AppShell.jsx",
  "src/components/shell/RightRail.jsx",
  "src/components/Shop.jsx",
  "src/components/avatar/AnimatedAvatar.jsx",
  "src/components/avatar/AvatarCanvas.jsx",
  "src/components/avatar/Wardrobe.jsx",
  "src/components/avatar/RoomBackground.jsx",
  "src/data/avatarRig.js",
  "src/data/avatarParts.js",
  "src/data/catalog.js",
  "src/v5-avatar.css",
];

for (const rel of required) {
  if (!fs.existsSync(path.join(root, rel))) fail(`Eksik V5 dosyası: ${rel}`);
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
console.log(`🎨 Shop premium art: ${premiumCount}/200`);
if (premiumCount !== 200) fail(`Premium shop asset sayısı 200 olmalı; bulunan: ${premiumCount}`);
else ok("200 premium shop asseti korunuyor");

const avatarCanvasPath = path.join(root, "src/components/avatar/AvatarCanvas.jsx");
if (fs.existsSync(avatarCanvasPath)) {
  const avatarCanvas = fs.readFileSync(avatarCanvasPath, "utf8");
  if (!avatarCanvas.includes('import AnimatedAvatar from "./AnimatedAvatar"')) fail("AvatarCanvas V5 AnimatedAvatar motoruna bağlı değil");
  else ok("AvatarCanvas → AnimatedAvatar V5 bridge aktif");
  if (avatarCanvas.includes("getWearableAsset") || avatarCanvas.includes("game-assets/wearables")) fail("V5 karakter motoru legacy wearable PNG sistemine bağlı olmamalı");
  else ok("Legacy wearable overlay bağımlılığı kaldırıldı");
}

const animatedPath = path.join(root, "src/components/avatar/AnimatedAvatar.jsx");
if (fs.existsSync(animatedPath)) {
  const animated = fs.readFileSync(animatedPath, "utf8");
  for (const marker of ["v5-bone-head", "v5-bone-torso", "v5-slot-outfit", "v5-slot-shoes", "v5-slot-headwear", "v5-slot-face", "v5-slot-back"]) {
    if (!animated.includes(marker)) fail(`AnimatedAvatar rig marker eksik: ${marker}`);
  }
  if (!animated.includes("EYE = \"#35D58B\"")) fail("Yeşil gözlü tek kahraman tanımı doğrulanamadı");
  else ok("Tek kahraman SVG rig ve ekipman slotları mevcut");
}

const mainPath = path.join(root, "src/main.jsx");
if (fs.existsSync(mainPath)) {
  const main = fs.readFileSync(mainPath, "utf8");
  if (!main.includes('import "./v5-avatar.css"')) fail("V5 avatar CSS importu eksik");
  if (main.includes('import "./v44-avatar-rig.css"')) fail("Legacy V4.4 avatar CSS importu kaldırılmalı");
}

if (failed) {
  console.error("\nV5 doğrulaması başarısız. Vite build başlatılmadı.");
  process.exit(1);
}

console.log("\n🚀 V5 — Animated Avatar System doğrulaması başarılı.");
