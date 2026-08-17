import { ITEMS } from "./avatarParts";
import { PETS, PET_ACCESSORIES, ROOM_ITEMS } from "./petsAndRoom";
import { WORLDS } from "./worlds";
import { getRarity, getRarityMeta, getItemAsset, getItemCardAsset } from "./gameAssets";

export const CATALOG_ITEMS = [...ITEMS, ...PETS, ...PET_ACCESSORIES, ...ROOM_ITEMS];

export const SLOT_META = {
  outfit: { label: "Kıyafet", category: "equipment", icon: "◈" },
  shoes: { label: "Ayakkabı", category: "equipment", icon: "⌁" },
  headwear: { label: "Başlık", category: "equipment", icon: "△" },
  face: { label: "Aksesuar", category: "equipment", icon: "◎" },
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
  { id: "equipment", label: "Ekipman" },
  { id: "outfit", label: "Kıyafet" },
  { id: "shoes", label: "Ayakkabı" },
  { id: "headwear", label: "Başlık" },
  { id: "face", label: "Aksesuar" },
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
  const slotMeta = SLOT_META[item.slot] || { label: "Özel Eşya", category: "equipment", icon: "✦" };
  return {
    ...item,
    world,
    rarity,
    rarityMeta,
    slotMeta,
    asset: getItemAsset(item),
    cardAsset: getItemCardAsset(item),
  };
}

export function isItemEquipped(profile, item) {
  if (!profile || !item) return false;
  if (["outfit", "shoes", "headwear", "face"].includes(item.slot)) {
    return profile.avatar?.[item.slot] === item.id;
  }
  if (item.slot === "petSpecies") return profile.pet?.activeSpecies === item.id;
  if (item.slot === "petAccessory") return profile.pet?.accessory === item.id;
  if (["wallpaper", "rug", "desk", "lamp", "plant", "poster"].includes(item.slot)) {
    return Object.values(profile.rooms || {}).some((room) =>
      room?.wallpaper === item.id || (room?.items || []).some((placed) => placed.itemId === item.id)
    );
  }
  return false;
}

export function filterCatalog(items, category) {
  if (!category || category === "all") return items;
  if (category === "equipment") return items.filter((item) => ["outfit", "shoes", "headwear", "face"].includes(item.slot));
  if (category === "pets") return items.filter((item) => ["petSpecies", "petAccessory"].includes(item.slot));
  if (category === "room") return items.filter((item) => ["wallpaper", "rug", "desk", "lamp", "plant", "poster"].includes(item.slot));
  return items.filter((item) => item.slot === category);
}
