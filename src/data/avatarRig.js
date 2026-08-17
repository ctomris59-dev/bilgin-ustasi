import { ITEMS } from "./avatarParts";

export const HERO_PROFILE = Object.freeze({
  id: "alya",
  name: "Bilgin Kaşif",
  title: "Tek Kahraman",
  hair: "curly-brown",
  eyes: "emerald-green",
  skin: "warm",
});

export const RIG_SLOTS = ["back", "outfit", "shoes", "headwear", "face"];

const SET_PALETTES = {
  gunluk: ["#29A7FF", "#0B5FC6"],
  buyulu: ["#9A6CFF", "#5530B8"],
  deniz: ["#27D8C2", "#087D91"],
  prens: ["#FFD66B", "#C78318"],
  uzay: ["#62D8FF", "#3E62E8"],
  bilim: ["#52E3C2", "#087A6A"],
  pijama: ["#FF8FC7", "#A84791"],
  kozmik: ["#D889FF", "#6844D8"],
};

function hash(input = "") {
  let value = 0;
  for (let i = 0; i < input.length; i += 1) value = (value * 31 + input.charCodeAt(i)) >>> 0;
  return value;
}

function findItem(id) {
  return ITEMS.find((item) => item.id === id) || null;
}

function paletteFor(item) {
  const palette = SET_PALETTES[item?.set] || [item?.color || "#29A7FF", "#0B5FC6"];
  if (!item?.color) return palette;
  return [item.color, palette[1]];
}

function outfitKind(item) {
  const id = item?.id || "";
  if (/labcoat|science/i.test(id)) return "lab";
  if (/robe|crystal|galaxy|cloud/i.test(id)) return "robe";
  if (/summer|dress/i.test(id)) return "dress";
  if (/halloween|armor/i.test(id)) return "armor";
  if (/overall/i.test(id)) return "overall";
  return ["jacket", "hoodie", "utility"][hash(id) % 3];
}

function shoesKind(item) {
  const id = item?.id || "";
  if (/sandal/i.test(id)) return "sandals";
  if (/boot|cloud/i.test(id)) return "boots";
  return ["sneakers", "boots"][hash(id) % 2];
}

function backKind(item) {
  if (!item) return null;
  const id = item.id || "";
  if (item.shape === "wings" || /wing/i.test(id)) return "wings";
  return "backpack";
}

export function describeRigItem(id, slotOverride) {
  const item = findItem(id);
  if (!item) return null;
  const slot = slotOverride || item.slot;
  const [primary, secondary] = paletteFor(item);
  return {
    ...item,
    slot,
    primary,
    secondary,
    variant: hash(item.id) % 4,
    kind:
      slot === "outfit" ? outfitKind(item) :
      slot === "shoes" ? shoesKind(item) :
      slot === "back" ? backKind(item) :
      item.shape || "default",
  };
}

export function getRigLoadout(avatar = {}) {
  const outfit = describeRigItem(avatar.outfit, "outfit");
  const shoes = describeRigItem(avatar.shoes, "shoes");
  const headwear = describeRigItem(avatar.headwear, "headwear");
  const face = describeRigItem(avatar.face, "face");
  const back = describeRigItem(avatar.back, "back");
  return { outfit, shoes, headwear, face, back };
}

export function getRigSignature(avatar = {}) {
  return RIG_SLOTS.map((slot) => avatar?.[slot] || "-").join("|");
}

export function getHeroSummary(avatar = {}) {
  const loadout = getRigLoadout(avatar);
  return {
    equippedCount: Object.values(loadout).filter(Boolean).length,
    outfitName: loadout.outfit?.label || "Temel Kaşif Takımı",
    shoesName: loadout.shoes?.label || "Temel Botlar",
  };
}
