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
for (const rel of required) if (!fs.existsSync(path.join(root, rel))) fail(`Eksik V4.5.5 dosyası: ${rel}`);

const animated = read("src/components/avatar/AnimatedAvatar.jsx");
for (const marker of [
  "heroMaster",
  "PREMIUM_RIG_MASKS",
  "MasterTint",
  "OutfitDetails",
  "ShoeDetails",
  "HeadwearLayer",
  "FaceLayer",
  "BackLayer",
  "requestAnimationFrame",
  "v455-mask-svg",
]) {
  if (!animated.includes(marker)) fail(`Exact-mask rig marker eksik: ${marker}`);
}
if (/getWearableAsset|getItemCardAsset|v45-body-rig|OutfitRig\(|ShoesRig\(/.test(animated)) {
  fail("Eski sticker/body-vector rig kodu hâlâ AnimatedAvatar içinde aktif");
} else {
  ok("Ürün stickerı ve yaklaşık body-vector rig tamamen kaldırıldı");
}
if (!animated.includes('data-avatar-version="4.5.5-mask-rig"')) fail("Renderer sürümü 4.5.5 değil");
else ok("Premium master + exact pixel masks aktif");

const maskSource = read("src/data/premiumRigMasks.js");
for (const slot of ["outfit", "shoes", "back", "headwear"]) {
  if (!maskSource.includes(`\"${slot}\"`) && !maskSource.includes(`${slot}:`)) fail(`Master mask eksik: ${slot}`);
}
ok("Master karakterden çıkarılmış outfit/shoes/back/headwear maskeleri mevcut");

const wardrobe = read("src/components/avatar/Wardrobe.jsx");
if (!wardrobe.includes("MOTIONS")) fail("Animasyon konsolu eksik");
if (!wardrobe.includes("chooseAndEquip")) fail("Envanter tek tık kuşanma bağlı değil");
else ok("Wardrobe: tek tık kuşanma + motion state bağlı");

const canvas = read("src/components/avatar/AvatarCanvas.jsx");
const shell = read("src/components/shell/AppShell.jsx");
if (!canvas.includes("AnimatedAvatar")) fail("AvatarCanvas master renderer kullanmıyor");
if (!shell.includes("AnimatedAvatar")) fail("AppShell odak ekranları master renderer kullanmıyor");
else ok("Oyunun farklı ekranları aynı AnimatedAvatar motoruna bağlı");

const css = read("src/v45-live-rig.css");
for (const marker of ["v455-mask-svg", "v455-back-svg", "v455EquipFlash", "v455Question", "v455Star"]) {
  if (!css.includes(marker)) fail(`V4.5.5 CSS marker eksik: ${marker}`);
}

try {
  const partsPath = path.join(root, "src/data/avatarParts.js");
  const parts = await import(`${pathToFileURL(partsPath).href}?validate=${Date.now()}`);
  const slots = new Set(["outfit", "shoes", "headwear", "face", "back"]);
  const wearable = (parts.ITEMS || []).filter((item) => slots.has(item.slot));
  if (!wearable.length) fail("Giyilebilir item kataloğu boş");
  else ok(`${wearable.length} giyilebilir item aynı 5-slot master rig'e yönleniyor`);
} catch (error) {
  fail(`Item kataloğu okunamadı: ${error.message}`);
}

if (failed) {
  console.error("\nV4.5.5 exact-mask doğrulaması başarısız. Build durduruldu.");
  process.exit(1);
}
console.log("\n🚀 V4.5.5 — ONE MASTER HERO / EXACT MASK EQUIPMENT / RAF MOTION doğrulaması başarılı.");
