/*
 * Bilgin Ustası V4.5.6 asset registry
 * Shop artwork and worn-rig identity are intentionally separate.
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
  { id: "master", label: "Bilgin Kaşif", description: "Tek sabit master karakter.", asset: PRESETS.street },
];

export const GAME_ASSETS = {
  logo: asset("logo.jpg"),
  roomBackground: asset("rooms/base-study-room.jpg"),
  mapBackground: asset("worlds/map-background.jpg"),
  heroStage: asset("scenes/hero-character-stage.webp"),
  premiumBaseRoom: asset("scenes/premium-base-room.webp"),
};

function normalizeSlot(slot) {
  const aliases = {
    petSpecies: "petSpecies",
    petAccessory: "petAccessory",
    outfit: "outfit",
    shoes: "shoes",
    headwear: "headwear",
    face: "face",
    back: "back",
    wallpaper: "wallpaper",
    rug: "rug",
    desk: "desk",
    lamp: "lamp",
    plant: "plant",
    poster: "poster",
  };
  return aliases[slot] || slot;
}

function resolveArtIdentity(itemOrId, slotOverride) {
  const item = typeof itemOrId === "string"
    ? { id: itemOrId, slot: slotOverride }
    : itemOrId || {};
  return {
    item,
    id: item.assetId || item.id,
    slot: normalizeSlot(item.assetSlot || item.slot || slotOverride),
  };
}

export function getItemAsset(itemOrId, slotOverride) {
  const { id, slot } = resolveArtIdentity(itemOrId, slotOverride);
  if (!id || !slot) return "";
  return asset(`premium/${slot}/${id}.webp`) || asset(`unique/${slot}/${id}.png`);
}

export function getItemCardAsset(itemOrId, slotOverride) {
  const { id, slot } = resolveArtIdentity(itemOrId, slotOverride);
  if (!id || !slot) return "";
  return asset(`premium/${slot}/${id}.webp`) || asset(`unique/${slot}/${id}.png`) || getItemAsset(itemOrId, slotOverride);
}

// Kept only for legacy callers. Core V4.5.6 wearables are rendered by the master rig,
// never by dropping these product images over the character.
export const getWearableAsset = (itemOrId, slotOverride) => {
  const { id, slot } = resolveArtIdentity(itemOrId, slotOverride);
  if (!id || !slot) return "";
  return asset(`wearables/${slot}/${id}.webp`);
};

export function getPetAsset(petId) {
  if (!petId) return "";
  return asset(`premium/petSpecies/${petId}.webp`) || asset(`unique/petSpecies/${petId}.png`);
}

export function getHairAsset(hairId) {
  return HAIR_ASSETS[hairId] || HAIR_ASSETS["hair-curly-afro"] || "";
}

export function getCharacterStyleAsset() {
  return PRESETS.street || PRESETS.blue;
}

export function getAvatarPreset() {
  return PRESETS.street || PRESETS.blue;
}

export function getRarity(item = {}) {
  if (item.legendary) return "legendary";
  const price = Number(item.price || 0);
  const worldNumber = Number(String(item.world || "w1").replace("w", "")) || 1;
  if (price >= 180 || worldNumber >= 5) return "epic";
  if (price >= 100 || worldNumber >= 3) return "rare";
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
