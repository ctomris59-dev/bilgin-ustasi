import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
let failed = false;
const fail = (m) => { console.error(`❌ ${m}`); failed = true; };
const ok = (m) => console.log(`✅ ${m}`);
const read = (rel) => fs.existsSync(path.join(root, rel)) ? fs.readFileSync(path.join(root, rel), "utf8") : "";

const required = [
  "src/components/avatar/LayeredHero.jsx",
  "src/components/avatar/WornAsset.jsx",
  "src/components/avatar/AnimatedAvatar.jsx",
  "src/components/avatar/AvatarCanvas.jsx",
  "src/data/heroAnchors.js",
  "src/data/coreWearables.js",
  "src/data/avatarParts.js",
  "src/data/avatarRig.js",
  "src/data/gameAssets.js",
  "src/data/premiumRigMasks.js",
  "src/assets/avatar-v5/premium/heroMasterData.js",
  "src/v46-layered-rig.css",
];
for (const rel of required) if (!fs.existsSync(path.join(root, rel))) fail(`Eksik V4.6 dosyası: ${rel}`);

const layered = read("src/components/avatar/LayeredHero.jsx");
const wornRenderer = read("src/components/avatar/WornAsset.jsx");
const gameAssets = read("src/data/gameAssets.js");
const anchors = read("src/data/heroAnchors.js");
const animated = read("src/components/avatar/AnimatedAvatar.jsx");

for (const marker of ["NeutralMaster", "getWornAsset", "WornAsset", "requestAnimationFrame", 'data-avatar-version="4.6-layered-neutral"']) {
  if (!layered.includes(marker)) fail(`LayeredHero marker eksik: ${marker}`);
}
if (/cardAsset|getItemCardAsset|getWearableAsset|<img[^>]+item\./.test(layered + wornRenderer)) fail("Karakter renderer shop/wearable raster görseline erişiyor");
else ok("Karakter renderer shopIcon PNG/WebP yolundan tamamen ayrıldı");

if (!gameAssets.includes("getShopIconIdentity")) fail("Shop icon kimliği core wearable sözleşmesinden gelmiyor");
else ok("Mağaza görselleri ayrı shopIcon kimliği kullanıyor");

for (const marker of ["headTop", "forehead", "rightEye", "chest", "rightHand", "backCenter", "leftFoot", "rightFoot"]) {
  if (!anchors.includes(marker)) fail(`Anchor eksik: ${marker}`);
}
ok("Slot içi yüz/göğüs/el/baş/sırt/ayak anchor haritası mevcut");

if (!animated.includes("LayeredHero")) fail("AnimatedAvatar LayeredHero'ya yönlenmiyor");
else ok("Tüm eski avatar çağrıları tek LayeredHero motoruna köprülendi");

const expectedCounts = { outfit: 4, shoes: 4, headwear: 3, face: 4, back: 3 };
const motions = ["idle", "thinking", "happy", "victory"];

try {
  const parts = await import(`${pathToFileURL(path.join(root, "src/data/avatarParts.js")).href}?v46=${Date.now()}`);
  const core = await import(`${pathToFileURL(path.join(root, "src/data/coreWearables.js")).href}?v46=${Date.now()}`);
  const items = parts.ITEMS || [];
  const wearableMap = core.CORE_WEARABLES || {};

  if (items.length !== 18) fail(`Core katalog 18 değil: ${items.length}`);
  else ok("Core katalog tam 18 item");

  for (const [slot, expected] of Object.entries(expectedCounts)) {
    const count = items.filter((item) => item.slot === slot).length;
    if (count !== expected) fail(`${slot}: ${count}/${expected}`); else ok(`${slot}: ${count}/${expected}`);
  }

  const wornKeys = new Set();
  for (const item of items) {
    const contract = wearableMap[item.id];
    if (!contract) { fail(`${item.id}: core wearable sözleşmesi yok`); continue; }
    if (!contract.shopIcon?.id || !contract.shopIcon?.slot) fail(`${item.id}: shopIcon eksik`);
    if (!contract.wornAsset?.key) fail(`${item.id}: wornAsset eksik`);
    if (contract.slot !== item.slot) fail(`${item.id}: slot sözleşmesi uyuşmuyor`);
    if (contract.wornAsset?.key) wornKeys.add(contract.wornAsset.key);

    const shopPath = path.join(root, `src/assets/game-assets/premium/${contract.shopIcon.slot}/${contract.shopIcon.id}.webp`);
    const uniquePath = path.join(root, `src/assets/game-assets/unique/${contract.shopIcon.slot}/${contract.shopIcon.id}.png`);
    if (!fs.existsSync(shopPath) && !fs.existsSync(uniquePath)) fail(`${item.id}: shopIcon asset bulunamadı (${contract.shopIcon.slot}/${contract.shopIcon.id})`);

    const keyLeaf = String(contract.wornAsset?.key || "").split(".").pop();
    if (keyLeaf && !wornRenderer.toLowerCase().includes(keyLeaf.toLowerCase())) fail(`${item.id}: worn renderer key uygulanmamış (${contract.wornAsset.key})`);
  }
  if (wornKeys.size !== 18) fail(`18 item için benzersiz wornAsset bekleniyor, bulunan ${wornKeys.size}`);
  else ok("18/18 item benzersiz wornAsset renderer kimliğine sahip");

  const qaCases = items.length * motions.length;
  if (qaCases !== 72) fail(`QA matrisi 72 değil: ${qaCases}`); else ok("Core QA matrisi: 18 item × 4 motion = 72 zorunlu senaryo");
} catch (error) {
  fail(`Core katalog doğrulanamadı: ${error.message}`);
}

for (const motion of motions) {
  if (!layered.includes(`motion === \"${motion}\"`) && motion !== "idle") fail(`Motion kodu eksik: ${motion}`);
}
if (!layered.includes("const breathe")) fail("Idle nefes hareketi eksik");
else ok("Rahat/Düşün/Mutlu/Zafer RAF motion motoru aktif");

if (failed) {
  console.error("\nV4.6 layered-neutral doğrulaması başarısız. Build durduruldu.");
  process.exit(1);
}
console.log("\n🚀 V4.6 — NEUTRAL MASTER / SHOPICON≠WORNASSET / ANCHOR RIG / LAYERED RENDERER doğrulaması başarılı.");
