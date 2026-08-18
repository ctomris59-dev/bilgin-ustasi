import { ITEMS } from "./avatarParts";

export const HERO_PROFILE = Object.freeze({
  id: "bilgin-kasif-master",
  name: "Bilgin Kaşif",
  title: "Tek Master Kahraman",
  hair: "curly-brown",
  eyes: "emerald-green",
  skin: "warm",
});

export const RIG_SLOTS = ["back", "outfit", "shoes", "headwear", "face"];

const ITEM_MAP = new Map(ITEMS.map((entry) => [entry.id, entry]));

function findItem(id) {
  return id ? ITEM_MAP.get(id) || null : null;
}

function fallbackRig(item, slot) {
  const color = item?.color || "#29A7FF";
  return {
    style: slot === "outfit" ? "explorer" : slot === "shoes" ? "boots" : item?.shape || "default",
    base: color,
    secondary: color,
    trim: "#DFF8FF",
    dark: "#17374B",
    anchor: slot,
  };
}

export function describeRigItem(id, slotOverride) {
  const item = findItem(id);
  if (!item) return null;
  const slot = slotOverride || item.slot;
  const rig = { ...fallbackRig(item, slot), ...(item.rig || {}) };
  return {
    ...item,
    slot,
    rig,
    kind: rig.style,
    primary: rig.base,
    secondary: rig.secondary,
  };
}

export function getRigLoadout(avatar = {}) {
  return {
    outfit: describeRigItem(avatar.outfit, "outfit"),
    shoes: describeRigItem(avatar.shoes, "shoes"),
    headwear: describeRigItem(avatar.headwear, "headwear"),
    face: describeRigItem(avatar.face, "face"),
    back: describeRigItem(avatar.back, "back"),
  };
}

export function getRigSignature(avatar = {}) {
  return RIG_SLOTS.map((slot) => avatar?.[slot] || "-").join("|");
}

export function getHeroSummary(avatar = {}) {
  const loadout = getRigLoadout(avatar);
  return {
    equippedCount: Object.values(loadout).filter(Boolean).length,
    outfitName: loadout.outfit?.label || "Keşif Ceketi",
    shoesName: loadout.shoes?.label || "Kaşif Botları",
  };
}
