import { PETS, PET_ACCESSORIES, ROOM_ITEMS } from "./petsAndRoom";
import { WORLDS } from "./worlds";
import { getRarity, getRarityMeta, getItemAsset, getItemCardAsset } from "./gameAssets";

// V5.0: Character wearables were removed. The shared catalog now only owns
// companion and base/room items; character appearances live in characterStyles.js.
export const CATALOG_ITEMS = [...PETS, ...PET_ACCESSORIES, ...ROOM_ITEMS];

export const SLOT_META = {
  petSpecies: { label: "Keşif Dostu", category: "pets", icon: "✦" },
  petAccessory: { label: "Dost Aksesuarı", category: "pets", icon: "◇" },
  wallpaper: { label: "Duvar Teması", category: "room", icon: "▧" },
  rug: { label: "Halı", category: "room", icon: "▱" },
  desk: { label: "Masa", category: "room", icon: "▤" },
  lamp: { label: "Aydınlatma", category: "room", icon: "☼" },
  plant: { label: "Bitki", category: "room", icon: "♣" },
  poster: { label: "Poster", category: "room", icon: "▣" },
};

export const CATEGORY_FILTERS = [
  { id: "all", label: "Tümü" },
  { id: "pets", label: "Dostlar" },
  { id: "room", label: "Üs" },
];

export function getCatalogItem(id) {
  return CATALOG_ITEMS.find((item) => item.id === id) || null;
}

export function getCatalogMeta(item) {
  if (!item) return null;
  const world = WORLDS.find((w) => w.id === item.world) || WORLDS[0];
  const rarity = getRarity(item);
  const rarityMeta = getRarityMeta(rarity);
  const slotMeta = SLOT_META[item.slot] || { label: "Özel Eşya", category: "other", icon: "✦" };
  return {
    ...item,
    world,
    rarity,
    rarityMeta,
    slotMeta,
    asset: item.asset || getItemAsset(item),
    cardAsset: item.cardAsset || getItemCardAsset(item),
  };
}

export function isItemEquipped(profile, item) {
  if (!profile || !item) return false;
  if (item.slot === "petSpecies") return profile.pet?.activeSpecies === item.id;
  if (item.slot === "petAccessory") return profile.pet?.accessory === item.id;
  if (["wallpaper", "rug", "desk", "lamp", "plant", "poster"].includes(item.slot)) {
    return Object.values(profile.rooms || {}).some((room) => room?.wallpaper === item.id || (room?.items || []).some((placed) => placed.itemId === item.id));
  }
  return false;
}

export function filterCatalog(items, category) {
  if (!category || category === "all") return items;
  if (category === "pets") return items.filter((item) => ["petSpecies", "petAccessory"].includes(item.slot));
  if (category === "room") return items.filter((item) => ["wallpaper", "rug", "desk", "lamp", "plant", "poster"].includes(item.slot));
  return items.filter((item) => item.slot === category);
}
