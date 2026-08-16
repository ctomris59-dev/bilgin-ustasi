const ROOT = "/game-assets";

const SLOT_ASSETS = {
  outfit: Array.from({ length: 7 }, (_, i) => `${ROOT}/items/tops/top-${i + 1}.png`),
  shoes: Array.from({ length: 7 }, (_, i) => `${ROOT}/items/shoes/shoes-${i + 1}.png`),
  headwear: Array.from({ length: 6 }, (_, i) => `${ROOT}/items/headwear/head-${i + 1}.png`),
  face: Array.from({ length: 6 }, (_, i) => `${ROOT}/items/accessories/accessory-${i + 1}.png`),
  petSpecies: Array.from({ length: 8 }, (_, i) => `${ROOT}/pets/pet-${i + 1}.png`),
  petAccessory: [
    `${ROOT}/items/headwear/head-4.png`,
    `${ROOT}/items/headwear/head-2.png`,
    `${ROOT}/items/accessories/accessory-5.png`,
    `${ROOT}/items/headwear/head-5.png`,
  ],
  wallpaper: Array.from({ length: 8 }, (_, i) => `${ROOT}/worlds/world-${i + 1}.png`),
  rug: [`${ROOT}/rooms/items/room-3.png`, `${ROOT}/rooms/items/room-8.png`, `${ROOT}/rooms/items/room-2.png`],
  desk: [`${ROOT}/rooms/items/room-5.png`, `${ROOT}/rooms/items/room-12.png`, `${ROOT}/rooms/items/room-6.png`],
  lamp: [`${ROOT}/rooms/items/room-2.png`, `${ROOT}/rooms/items/room-3.png`],
  plant: [`${ROOT}/rooms/items/room-13.png`, `${ROOT}/rooms/items/room-8.png`],
  poster: [`${ROOT}/rooms/items/room-1.png`, `${ROOT}/rooms/items/room-7.png`],
};

const HAIR_ASSETS = {
  "hair-space-buns": `${ROOT}/avatar/hair/hair-1.png`,
  "hair-long-braid": `${ROOT}/avatar/hair/hair-2.png`,
  "hair-twin-pigtails": `${ROOT}/avatar/hair/hair-3.png`,
  "hair-bob-bangs": `${ROOT}/avatar/hair/hair-4.png`,
  "hair-wavy-long": `${ROOT}/avatar/hair/hair-5.png`,
  "hair-curly-afro": `${ROOT}/avatar/hair/hair-6.png`,
};

const PET_ASSETS = {
  "pet-dog-white": `${ROOT}/pets/pet-1.png`,
  "pet-cat-orange": `${ROOT}/pets/pet-2.png`,
  "pet-owl-purple": `${ROOT}/pets/pet-3.png`,
  "pet-dragon": `${ROOT}/pets/pet-4.png`,
  "pet-phoenix": `${ROOT}/pets/pet-4.png`,
  "pet-cat-gray": `${ROOT}/pets/pet-6.png`,
  "pet-dog-brown": `${ROOT}/pets/pet-1.png`,
  "pet-owl-teal": `${ROOT}/pets/pet-3.png`,
};

const PRESETS = {
  blue: `${ROOT}/avatar/presets/explorer-blue.png`,
  casual: `${ROOT}/avatar/presets/explorer-casual.png`,
  street: `${ROOT}/avatar/presets/explorer-street.png`,
  red: `${ROOT}/avatar/presets/explorer-red.png`,
  pink: `${ROOT}/avatar/presets/explorer-pink.png`,
};

export const GAME_ASSETS = {
  root: ROOT,
  logo: `${ROOT}/logo.jpg`,
  roomBackground: `${ROOT}/rooms/base-study-room.jpg`,
  mapBackground: `${ROOT}/worlds/map-background.jpg`,
};

function hashIndex(text, length) {
  if (!length) return 0;
  let hash = 0;
  const value = String(text || "item");
  for (let i = 0; i < value.length; i += 1) hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  return hash % length;
}

export function getItemAsset(itemOrId, slotOverride) {
  const item = typeof itemOrId === "string" ? { id: itemOrId, slot: slotOverride } : itemOrId || {};
  if (item.slot === "petSpecies" && PET_ASSETS[item.id]) return PET_ASSETS[item.id];
  const list = SLOT_ASSETS[item.slot] || SLOT_ASSETS.face;
  return list[hashIndex(item.id, list.length)];
}

export function getPetAsset(petId) {
  return PET_ASSETS[petId] || SLOT_ASSETS.petSpecies[hashIndex(petId, SLOT_ASSETS.petSpecies.length)];
}

export function getHairAsset(hairId) {
  return HAIR_ASSETS[hairId] || HAIR_ASSETS["hair-bob-bangs"];
}

export function getAvatarPreset(avatar = {}) {
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
    common: { label: "COMMON", color: "#9EB0C8", frame: `${ROOT}/ui/rarity/common.png` },
    rare: { label: "RARE", color: "#52D8FF", frame: `${ROOT}/ui/rarity/rare.png` },
    epic: { label: "EPIC", color: "#B46CFF", frame: `${ROOT}/ui/rarity/epic.png` },
    legendary: { label: "LEGENDARY", color: "#FFBE3D", frame: `${ROOT}/ui/rarity/legendary.png` },
  };
  return table[rarity] || table.common;
}

export function getWorldAsset(worldId) {
  const n = Math.max(1, Math.min(8, Number(String(worldId || "w1").replace("w", "")) || 1));
  return `${ROOT}/worlds/world-${n}.png`;
}
