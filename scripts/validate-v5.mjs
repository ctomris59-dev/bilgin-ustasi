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
  "src/data/premiumRigMasks.js",
  "src/assets/avatar-v5/premium/hero-master.webp",
  "src/v5-avatar.css",
];

for (const rel of required) {
  if (!fs.existsSync(path.join(root, rel))) fail(`Eksik V5.1 dosyası: ${rel}`);
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

const masterPath = path.join(root, "src/assets/avatar-v5/premium/hero-master.webp");
if (fs.existsSync(masterPath)) {
  const bytes = fs.statSync(masterPath).size;
  if (bytes < 20000) fail(`Premium hero master beklenenden küçük: ${bytes} byte`);
  else ok(`Premium raster hero master mevcut · ${Math.round(bytes / 1024)} KB`);
}

const avatarCanvasPath = path.join(root, "src/components/avatar/AvatarCanvas.jsx");
if (fs.existsSync(avatarCanvasPath)) {
  const avatarCanvas = fs.readFileSync(avatarCanvasPath, "utf8");
  if (!avatarCanvas.includes('import AnimatedAvatar from "./AnimatedAvatar"')) fail("AvatarCanvas V5 AnimatedAvatar motoruna bağlı değil");
  else ok("AvatarCanvas → premium AnimatedAvatar bridge aktif");
}

const animatedPath = path.join(root, "src/components/avatar/AnimatedAvatar.jsx");
if (fs.existsSync(animatedPath)) {
  const animated = fs.readFileSync(animatedPath, "utf8");
  if (!animated.includes('hero-master.webp')) fail("AnimatedAvatar premium master-art kullanmıyor");
  if (!animated.includes("PREMIUM_RIG_MASKS")) fail("Premium pixel-aligned rig maskeleri bağlı değil");
  for (const marker of ["v5p-outfit", "v5p-shoes", "v5p-headwear", "v5p-back", "PremiumFaceItem", "PremiumHeadwear"]) {
    if (!animated.includes(marker)) fail(`Premium rig marker eksik: ${marker}`);
  }
  if (animated.includes('className="v5-avatar-svg"') || animated.includes("function HairBack")) {
    fail("Legacy primitive SVG kahraman renderer hâlâ aktif");
  } else {
    ok("Primitive SVG kahraman kaldırıldı; raster master + clip rig aktif");
  }
}

const masksPath = path.join(root, "src/data/premiumRigMasks.js");
if (fs.existsSync(masksPath)) {
  const masks = fs.readFileSync(masksPath, "utf8");
  for (const slot of ["outfit", "shoes", "headwear", "back"]) {
    if (!masks.includes(`\"${slot}\"`)) fail(`Premium rig maskesi eksik: ${slot}`);
  }
}

const mainPath = path.join(root, "src/main.jsx");
if (fs.existsSync(mainPath)) {
  const main = fs.readFileSync(mainPath, "utf8");
  if (!main.includes('import "./v5-avatar.css"')) fail("V5 avatar CSS importu eksik");
  if (main.includes('import "./v44-avatar-rig.css"')) fail("Legacy V4.4 avatar CSS importu kaldırılmalı");
}

if (failed) {
  console.error("\nV5.1 premium avatar doğrulaması başarısız. Vite build başlatılmadı.");
  process.exit(1);
}

console.log("\n🚀 V5.1 — Premium Master-Art Rig doğrulaması başarılı.");
