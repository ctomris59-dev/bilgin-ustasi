/*
 * Bilgin Ustası V3 asset registry
 *
 * V3 rule: every inventory item has exactly one dedicated artwork file.
 * No hash based / random slot assignment remains.
 */

const ASSET_MODULES = import.meta.glob(
  "../assets/game-assets/**/*.{png,jpg,jpeg,webp}",
  { eager: true, query: "?url", import: "default" }
);

function asset(relativePath) {
  const key = `../assets/game-assets/${relativePath}`;
  return ASSET_MODULES[key] || "";
}

const HAIR_ASSETS = {
  "hair-space-buns": asset("avatar/hair/hair-1.png"),
  "hair-long-braid": asset("avatar/hair/hair-2.png"),
  "hair-twin-pigtails": asset("avatar/hair/hair-3.png"),
  "hair-bob-bangs": asset("avatar/hair/hair-4.png"),
  "hair-wavy-long": asset("avatar/hair/hair-5.png"),
  "hair-curly-afro": asset("avatar/hair/hair-6.png"),
};

const PRESETS = {
  blue: asset("avatar/presets/explorer-blue.png"),
  red: asset("avatar/presets/explorer-red.png"),
  casual: asset("avatar/presets/explorer-casual.png"),
  street: asset("avatar/presets/explorer-street.png"),
  pink: asset("avatar/presets/explorer-pink.png"),
};

export const CHARACTER_STYLES = [
  { id: "auto", label: "Ekipmana Göre", description: "Takılı ekipmana göre görünüm değişir.", asset: PRESETS.blue },
  { id: "blue", label: "Mavi Kaşif", description: "Klasik keşif görünümü.", asset: PRESETS.blue },
  { id: "red", label: "Kızıl Kaşif", description: "Saha görevleri için güçlü stil.", asset: PRESETS.red },
  { id: "casual", label: "Doğa Kaşifi", description: "Rahat ve keşif odaklı görünüm.", asset: PRESETS.casual },
  { id: "street", label: "Şehir Kaşifi", description: "Modern ve sade görünüm.", asset: PRESETS.street },
  { id: "pink", label: "Enerji Kaşifi", description: "Canlı macera görünümü.", asset: PRESETS.pink },
];

export const GAME_ASSETS = {
  logo: asset("logo.jpg"),
  roomBackground: asset("rooms/base-study-room.jpg"),
  mapBackground: asset("worlds/map-background.jpg"),
};

function normalizeSlot(slot) {
  const aliases = {
    petSpecies: "petSpecies",
    petAccessory: "petAccessory",
    outfit: "outfit",
    shoes: "shoes",
    headwear: "headwear",
    face: "face",
    wallpaper: "wallpaper",
    rug: "rug",
    desk: "desk",
    lamp: "lamp",
    plant: "plant",
    poster: "poster",
  };
  return aliases[slot] || slot;
}

/**
 * Returns the artwork dedicated to this exact item id.
 * Unlike V2, V3 never maps multiple ids onto a small shared image pool.
 */
export function getItemAsset(itemOrId, slotOverride) {
  const item = typeof itemOrId === "string"
    ? { id: itemOrId, slot: slotOverride }
    : itemOrId || {};

  if (!item.id || !item.slot) return "";
  const slot = normalizeSlot(item.slot);
  return asset(`unique/${slot}/${item.id}.png`);
}

export function getPetAsset(petId) {
  if (!petId) return "";
  return asset(`unique/petSpecies/${petId}.png`);
}

export function getHairAsset(hairId) {
  return HAIR_ASSETS[hairId] || HAIR_ASSETS["hair-bob-bangs"] || "";
}

export function getCharacterStyleAsset(styleId) {
  return PRESETS[styleId] || PRESETS.blue;
}

export function getAvatarPreset(avatar = {}) {
  const explicitStyle = avatar.characterStyle;
  if (explicitStyle && explicitStyle !== "auto" && PRESETS[explicitStyle]) {
    return PRESETS[explicitStyle];
  }

  const outfit = avatar.outfit || "";
  const hair = avatar.hairStyle || "";

  if (/summer|halloween|infinity|galaxy|cloud|christmas/i.test(outfit)) return PRESETS.pink;
  if (/red|gold|prens|crystal/i.test(outfit)) return PRESETS.red;
  if (/labcoat|robe|emerald|green/i.test(outfit)) return PRESETS.casual;
  if (/bob|curly/i.test(hair)) return PRESETS.street;
  if (/pigtail|braid|wavy|space-buns/i.test(hair)) return PRESETS.red;
  return PRESETS.blue;
}

export function getRarity(item = {}) {
  if (item.legendary) return "legendary";
  const price = Number(item.price || 0);
  const worldNumber = Number(String(item.world || "w1").replace("w", "")) || 1;
  if (price >= 220 || worldNumber >= 10) return "epic";
  if (price >= 100 || worldNumber >= 5) return "rare";
  return "common";
}

export function getRarityMeta(rarity) {
  const table = {
    common: { label: "COMMON", color: "#9EB0C8", frame: asset("ui/rarity/common.png") },
    rare: { label: "RARE", color: "#52D8FF", frame: asset("ui/rarity/rare.png") },
    epic: { label: "EPIC", color: "#B46CFF", frame: asset("ui/rarity/epic.png") },
    legendary: { label: "LEGENDARY", color: "#FFBE3D", frame: asset("ui/rarity/legendary.png") },
  };
  return table[rarity] || table.common;
}

export function getWorldAsset(worldId) {
  const n = Math.max(1, Math.min(8, Number(String(worldId || "w1").replace("w", "")) || 1));
  return asset(`worlds/world-${n}.png`);
}
