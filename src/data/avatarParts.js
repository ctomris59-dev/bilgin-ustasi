// Bilgin Ustası V4.5.6 — Tek master karakter / 18 çekirdek giyilebilir eşya
// Bu dosya artık eski geniş wearable kataloğunu bilerek dışarıda bırakır.

export const SETS = {
  kasif: { id: "kasif", label: "Kaşif Çekirdeği", color: "#29A7FF" },
  bilim: { id: "bilim", label: "Bilim Çekirdeği", color: "#52E3C2" },
  buyulu: { id: "buyulu", label: "Büyülü Çekirdek", color: "#9A6CFF" },
  gokyuzu: { id: "gokyuzu", label: "Gökyüzü Çekirdeği", color: "#70D6FF" },
  efsane: { id: "efsane", label: "Efsane Çekirdeği", color: "#FFD66B" },
};

export const SLOTS = {
  SKIN: "skin",
  HAIR: "hair",
  OUTFIT: "outfit",
  SHOES: "shoes",
  HEADWEAR: "headwear",
  FACE: "face",
  BACK: "back",
};

// Master kahramanın kimliği sabittir; bu değerler eski profil şemasını kırmamak için korunur.
export const SKIN_TONES = [{ id: "skin-master", hex: "#E9AE82" }];
export const HAIR_STYLES = [{ id: "hair-master-curly", label: "Kıvırcık Kahverengi" }];
export const HAIR_COLORS = ["#6B351F"];

const item = (config) => ({ core: true, wearableVersion: 2, ...config });

export const ITEMS = [
  // ── KIYAFET · 4 ──────────────────────────────────────────────────────────
  item({
    id: "outfit-labcoat", slot: SLOTS.OUTFIT, set: "bilim", world: "w1",
    label: "Keşif Ceketi", price: 0, starter: true, color: "#F3F8FB",
    rig: { style: "explorer", base: "#F3F8FB", secondary: "#CFE7EF", trim: "#39D8B5", dark: "#254B62", pattern: "field" },
  }),
  item({
    id: "outfit-infinity-cape", slot: SLOTS.OUTFIT, set: "efsane", world: "w6",
    label: "Sonsuz Keşif Zırhı", price: 0, color: "#664BFF", legendary: true,
    unlock: { type: "fullScore", subject: "any" },
    rig: { style: "cosmicArmor", base: "#5636D9", secondary: "#1769D9", trim: "#59ECFF", dark: "#25175E", pattern: "stars" },
  }),
  item({
    id: "outfit-cloud-dress", slot: SLOTS.OUTFIT, set: "gokyuzu", world: "w4",
    label: "Bulut Elbisesi", price: 150, color: "#BDEBFF",
    rig: { style: "cloud", base: "#B9E8FF", secondary: "#82BCFF", trim: "#F8FDFF", dark: "#5D86B5", pattern: "cloud" },
  }),
  item({
    id: "outfit-robe-emerald", slot: SLOTS.OUTFIT, set: "buyulu", world: "w3",
    label: "Zümrüt Cübbe", price: 140, color: "#15996E",
    rig: { style: "emeraldRobe", base: "#168B63", secondary: "#0E5E48", trim: "#E6C76E", dark: "#093C31", pattern: "arcane" },
  }),

  // ── AYAKKABI · 4 ─────────────────────────────────────────────────────────
  item({
    id: "shoes-cape-boots", slot: SLOTS.SHOES, set: "kasif", world: "w1",
    label: "Kaşif Botları", price: 0, starter: true, color: "#8B5A32",
    rig: { style: "boots", base: "#70411F", secondary: "#9A6738", trim: "#49C7FF", dark: "#2D1B13" },
  }),
  item({
    id: "shoes-sneaker-red", slot: SLOTS.SHOES, set: "kasif", world: "w2",
    label: "Kırmızı Spor Ayakkabı", price: 85, color: "#E84A58",
    rig: { style: "sneaker", base: "#E94B58", secondary: "#B72836", trim: "#FFFFFF", dark: "#572027" },
  }),
  item({
    id: "shoes-cloud", slot: SLOTS.SHOES, set: "gokyuzu", world: "w4",
    label: "Bulut Ayakkabısı", price: 125, color: "#D9F5FF",
    rig: { style: "cloudBoot", base: "#DDF8FF", secondary: "#8BCBFF", trim: "#FFFFFF", dark: "#547FA4" },
  }),
  item({
    id: "shoes-sandals", slot: SLOTS.SHOES, set: "kasif", world: "w2",
    label: "Sandalet", price: 75, color: "#B87945",
    rig: { style: "sandal", base: "#9B653C", secondary: "#6A422A", trim: "#E7B36C", dark: "#3A261C" },
  }),

  // ── BAŞLIK · 3 ───────────────────────────────────────────────────────────
  item({
    id: "headwear-pilot-goggles", assetId: "face-v4-pilot-goggles", assetSlot: "face",
    slot: SLOTS.HEADWEAR, set: "kasif", world: "w1", label: "Pilot Gözlüğü",
    price: 0, starter: true, color: "#C98A35", shape: "pilot-goggles",
    rig: { style: "pilotGoggles", anchor: "forehead", base: "#A56628", secondary: "#2A8BC2", trim: "#E8B85C", dark: "#55351D" },
  }),
  item({
    id: "headwear-wizardhat", slot: SLOTS.HEADWEAR, set: "buyulu", world: "w3",
    label: "Büyücü Şapkası", price: 125, color: "#6037B8", shape: "wizardhat",
    rig: { style: "wizardHat", anchor: "crown", base: "#5C35B5", secondary: "#35206E", trim: "#E1C15D", dark: "#241749" },
  }),
  item({
    id: "headwear-crown-gold", slot: SLOTS.HEADWEAR, set: "efsane", world: "w5",
    label: "Altın Taç", price: 240, color: "#F1B83D", shape: "crown",
    rig: { style: "goldCrown", anchor: "crown", base: "#E3A52D", secondary: "#B8791C", trim: "#FFF1A3", dark: "#765013" },
  }),

  // ── AKSESUAR · 4 ─────────────────────────────────────────────────────────
  item({
    id: "face-v4-archive-monocle", slot: SLOTS.FACE, set: "bilim", world: "w2",
    label: "Monokl", price: 90, color: "#D6B15A", shape: "monocle",
    rig: { style: "monocle", anchor: "face", base: "#D4AE50", trim: "#FFF0A0", dark: "#72531D" },
  }),
  item({
    id: "face-compass-necklace", assetId: "face-v4-compass-eye", assetSlot: "face",
    slot: SLOTS.FACE, set: "kasif", world: "w1", label: "Pusula Kolyesi",
    price: 0, starter: true, color: "#D39B45", shape: "necklace",
    rig: { style: "compassNecklace", anchor: "chest", base: "#C88D35", trim: "#F7D47B", dark: "#614119" },
  }),
  item({
    id: "face-star-brooch", assetId: "face-backpack-badge", assetSlot: "face",
    slot: SLOTS.FACE, set: "gokyuzu", world: "w3", label: "Yıldız Broşu",
    price: 95, color: "#65D7FF", shape: "brooch",
    rig: { style: "starBrooch", anchor: "chest", base: "#57CFF6", trim: "#E9FBFF", dark: "#275B80" },
  }),
  item({
    id: "face-wand", slot: SLOTS.FACE, set: "buyulu", world: "w4",
    label: "Sihir Değneği", price: 145, color: "#6FDFFF", shape: "wand",
    rig: { style: "wand", anchor: "rightHand", base: "#5AD7F8", trim: "#F7F0A2", dark: "#305E78" },
  }),

  // ── SIRT · 3 ─────────────────────────────────────────────────────────────
  item({
    id: "back-v4-daypack", slot: SLOTS.BACK, set: "kasif", world: "w1",
    label: "Kaşif Sırt Çantası", price: 0, starter: true, color: "#8B5B35",
    rig: { style: "explorerPack", anchor: "back", base: "#80502D", secondary: "#A87848", trim: "#DAB36F", dark: "#3F291C" },
  }),
  item({
    id: "back-crystal-wings", assetId: "headwear-wings", assetSlot: "headwear",
    slot: SLOTS.BACK, set: "gokyuzu", world: "w6", label: "Kristal Kanatlar",
    price: 0, color: "#73E6FF", shape: "wings", legendary: true,
    unlock: { type: "fullScore", subject: "Fen Bilimleri" },
    rig: { style: "crystalWings", anchor: "shoulders", base: "#70E6FF", secondary: "#8C73FF", trim: "#F3FDFF", dark: "#324F9B" },
  }),
  item({
    id: "back-v4-archive", slot: SLOTS.BACK, set: "bilim", world: "w3",
    label: "Parşömen Çantası", price: 135, color: "#A66F3C",
    rig: { style: "scrollPack", anchor: "back", base: "#8C5A31", secondary: "#C3945C", trim: "#E8C58D", dark: "#4D301D" },
  }),
];

export const CORE_ITEM_IDS = Object.freeze(ITEMS.map((entry) => entry.id));
export const CORE_ITEM_ID_SET = new Set(CORE_ITEM_IDS);
export const CORE_ITEMS_BY_SLOT = Object.freeze(
  Object.fromEntries([SLOTS.OUTFIT, SLOTS.SHOES, SLOTS.HEADWEAR, SLOTS.FACE, SLOTS.BACK].map((slot) => [slot, ITEMS.filter((entry) => entry.slot === slot)]))
);

export const DEFAULT_AVATAR = {
  characterStyle: "master",
  skin: "skin-master",
  hairStyle: "hair-master-curly",
  hairColor: "#6B351F",
  outfit: "outfit-labcoat",
  shoes: "shoes-cape-boots",
  headwear: "headwear-pilot-goggles",
  face: "face-compass-necklace",
  back: "back-v4-daypack",
};

export const STARTER_UNLOCKED = ITEMS.filter((entry) => entry.starter).map((entry) => entry.id);
