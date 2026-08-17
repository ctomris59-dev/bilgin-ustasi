import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
let failed = false;
const fail = (message) => { console.error(`❌ ${message}`); failed = true; };
const ok = (message) => console.log(`✅ ${message}`);

const chunkPaths = Array.from({ length: 6 }, (_, i) => `src/assets/avatar-v5/premium/heroMasterChunk${i}.js`);
const dataRel = "src/assets/avatar-v5/premium/heroMasterData.js";
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
  dataRel,
  ...chunkPaths,
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

let masterSourceBytes = 0;
for (const rel of chunkPaths) {
  const full = path.join(root, rel);
  if (fs.existsSync(full)) masterSourceBytes += fs.statSync(full).size;
}
if (masterSourceBytes < 40000) fail(`Premium hero master bundle eksik/küçük: ${masterSourceBytes} byte`);
else ok(`Premium hero master-art bundle aktif · ${Math.round(masterSourceBytes / 1024)} KB source`);

const dataPath = path.join(root, dataRel);
if (fs.existsSync(dataPath)) {
  const dataSource = fs.readFileSync(dataPath, "utf8");
  if (!dataSource.includes("data:image/webp;base64")) fail("Master-art data URI WebP olarak kurulmamış");
  for (let i = 0; i < 6; i += 1) {
    if (!dataSource.includes(`heroMasterChunk${i}.js`)) fail(`Master-art chunk importu eksik: ${i}`);
  }

  try {
    const moduleUrl = `${pathToFileURL(dataPath).href}?validate=${Date.now()}`;
    const heroModule = await import(moduleUrl);
    const dataUri = heroModule.default || "";
    const prefix = "data:image/webp;base64,";
    if (!dataUri.startsWith(prefix)) {
      fail("Birleştirilen master-art geçerli WebP data URI değil");
    } else {
      const buffer = Buffer.from(dataUri.slice(prefix.length), "base64");
      const riff = buffer.subarray(0, 4).toString("ascii");
      const webp = buffer.subarray(8, 12).toString("ascii");
      if (riff !== "RIFF" || webp !== "WEBP") fail(`Master-art binary imzası geçersiz: ${riff}/${webp}`);
      else if (buffer.length < 30000) fail(`Master-art binary beklenenden küçük: ${buffer.length} byte`);
      else ok(`Master-art binary doğrulandı · RIFF/WEBP · ${Math.round(buffer.length / 1024)} KB`);
    }
  } catch (error) {
    fail(`Master-art bundle import edilemedi: ${error.message}`);
  }
}

const avatarCanvasPath = path.join(root, "src/components/avatar/AvatarCanvas.jsx");
if (fs.existsSync(avatarCanvasPath)) {
  const avatarCanvas = fs.readFileSync(avatarCanvasPath, "utf8");
  if (!avatarCanvas.includes('import AnimatedAvatar from "./AnimatedAvatar"')) fail("AvatarCanvas premium AnimatedAvatar motoruna bağlı değil");
  else ok("AvatarCanvas → premium AnimatedAvatar bridge aktif");
}

const animatedPath = path.join(root, "src/components/avatar/AnimatedAvatar.jsx");
if (fs.existsSync(animatedPath)) {
  const animated = fs.readFileSync(animatedPath, "utf8");
  if (!animated.includes("heroMasterData.js")) fail("AnimatedAvatar premium master-art bundle kullanmıyor");
  if (!animated.includes("PREMIUM_RIG_MASKS")) fail("Premium pixel-aligned rig maskeleri bağlı değil");
  for (const slot of ["back", "outfit", "shoes", "headwear"]) {
    if (!animated.includes(`slot=\"${slot}\"`)) fail(`Premium rig slotu eksik: ${slot}`);
  }
  for (const marker of ["PremiumFaceItem", "PremiumHeadwear", "BlinkOverlay", "v5p-master-image"]) {
    if (!animated.includes(marker)) fail(`Premium avatar marker eksik: ${marker}`);
  }
  if (animated.includes("function HairBack") || animated.includes('className="v5-avatar-svg"')) {
    fail("Legacy primitive SVG kahraman renderer hâlâ aktif");
  } else {
    ok("Primitive SVG kaldırıldı; premium raster master + pixel mask rig aktif");
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

console.log("\n🚀 V5.1.3 — Premium Master-Art Rig doğrulaması başarılı.");
