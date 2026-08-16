/*
 * Bilgin Ustası asset registry
 *
 * All production artwork lives under src/assets/game-assets and is bundled by Vite.
 * This avoids broken /game-assets URLs on deployments that use a sub-path or omit
 * nested public folders.
 */

const ASSET_MODULES = import.meta.glob(
  "../assets/game-assets/**/*.{png,jpg,jpeg,webp}",
  { eager: true, query: "?url", import: "default" }
);

function asset(relativePath) {
  const key = `../assets/game-assets/${relativePath}`;
  return ASSET_MODULES[key] || "";
}

const SLOT_ASSETS = {
  outfit: Array.from({ length: 7 }, (_, i) => asset(`items/tops/top-${i + 1}.png`)),
  shoes: Array.from({ length: 7 }, (_, i) => asset(`items/shoes/shoes-${i + 1}.png`)),
  headwear: Array.from({ length: 6 }, (_, i) => asset(`items/headwear/head-${i + 1}.png`)),
  face: Array.from({ length: 6 }, (_, i) => asset(`items/accessories/accessory-${i + 1}.png`)),
  petSpecies: Array.from({ length: 8 }, (_, i) => asset(`pets/pet-${i + 1}.png`)),
  petAccessory: [
    asset("items/headwear/head-4.png"),
    asset("items/headwear/head-2.png"),
    asset("items/accessories/accessory-5.png"),
    asset("items/headwear/head-5.png"),
  ],
  wallpaper: Array.from({ length: 8 }, (_, i) => asset(`worlds/world-${i + 1}.png`)),
  rug: [asset("rooms/items/room-3.png"), asset("rooms/items/room-8.png"), asset("rooms/items/room-2.png")],
  desk: [asset("rooms/items/room-5.png"), asset("rooms/items/room-12.png"), asset("rooms/items/room-6.png")],
  lamp: [asset("rooms/items/room-2.png"), asset("rooms/items/room-3.png")],
  plant: [asset("rooms/items/room-13.png"), asset("rooms/items/room-8.png")],
  poster: [asset("rooms/items/room-1.png"), asset("rooms/items/room-7.png")],
};

const HAIR_ASSETS = {
  "hair-space-buns": asset("avatar/hair/hair-1.png"),
  "hair-long-braid": asset("avatar/hair/hair-2.png"),
  "hair-twin-pigtails": asset("avatar/hair/hair-3.png"),
  "hair-bob-bangs": asset("avatar/hair/hair-4.png"),
  "hair-wavy-long": asset("avatar/hair/hair-5.png"),
  "hair-curly-afro": asset("avatar/hair/hair-6.png"),
};

const PET_ASSETS = {
  "pet-dog-white": asset("pets/pet-1.png"),
  "pet-cat-orange": asset("pets/pet-2.png"),
  "pet-owl-purple": asset("pets/pet-3.png"),
  "pet-dragon": asset("pets/pet-4.png"),
  "pet-phoenix": asset("pets/pet-4.png"),
  "pet-cat-gray": asset("pets/pet-6.png"),
  "pet-dog-brown": asset("pets/pet-1.png"),
  "pet-owl-teal": asset("pets/pet-3.png"),
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

function hashIndex(text, length) {
  if (!length) return 0;
  let hash = 0;
  const value = String(text || "item");
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash % length;
}

export function getItemAsset(itemOrId, slotOverride) {
  const item = typeof itemOrId === "string"
    ? { id: itemOrId, slot: slotOverride }
    : itemOrId || {};

  if (item.slot === "petSpecies" && PET_ASSETS[item.id]) {
    return PET_ASSETS[item.id];
  }

  const list = SLOT_ASSETS[item.slot] || SLOT_ASSETS.face;
  return list[hashIndex(item.id, list.length)] || "";
}

export function getPetAsset(petId) {
  return PET_ASSETS[petId] || SLOT_ASSETS.petSpecies[hashIndex(petId, SLOT_ASSETS.petSpecies.length)] || "";
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
