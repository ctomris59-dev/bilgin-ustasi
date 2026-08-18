// Bilgin Ustasi V4.6 — authoritative Core 18 wearable contract.
// shopIcon is for the store/inventory card only.
// wornAsset is a renderer key consumed by LayeredHero; it is never a product PNG.

export const CORE_WEARABLES = Object.freeze({
  "outfit-labcoat": {
    slot: "outfit",
    shopIcon: { id: "outfit-labcoat", slot: "outfit" },
    wornAsset: { key: "outfit.explorer", anchor: "torso", layer: "OUTFIT" },
  },
  "outfit-infinity-cape": {
    slot: "outfit",
    shopIcon: { id: "outfit-infinity-cape", slot: "outfit" },
    wornAsset: { key: "outfit.cosmicArmor", anchor: "torso", layer: "OUTFIT" },
  },
  "outfit-cloud-dress": {
    slot: "outfit",
    shopIcon: { id: "outfit-cloud-dress", slot: "outfit" },
    wornAsset: { key: "outfit.cloudDress", anchor: "torso", layer: "OUTFIT" },
  },
  "outfit-robe-emerald": {
    slot: "outfit",
    shopIcon: { id: "outfit-robe-emerald", slot: "outfit" },
    wornAsset: { key: "outfit.emeraldRobe", anchor: "torso", layer: "OUTFIT" },
  },

  "shoes-cape-boots": {
    slot: "shoes",
    shopIcon: { id: "shoes-cape-boots", slot: "shoes" },
    wornAsset: { key: "shoes.explorerBoots", anchors: ["leftFoot", "rightFoot"], layer: "SHOES" },
  },
  "shoes-sneaker-red": {
    slot: "shoes",
    shopIcon: { id: "shoes-sneaker-red", slot: "shoes" },
    wornAsset: { key: "shoes.redSneakers", anchors: ["leftFoot", "rightFoot"], layer: "SHOES" },
  },
  "shoes-cloud": {
    slot: "shoes",
    shopIcon: { id: "shoes-cloud", slot: "shoes" },
    wornAsset: { key: "shoes.cloud", anchors: ["leftFoot", "rightFoot"], layer: "SHOES" },
  },
  "shoes-sandals": {
    slot: "shoes",
    shopIcon: { id: "shoes-sandals", slot: "shoes" },
    wornAsset: { key: "shoes.sandals", anchors: ["leftFoot", "rightFoot"], layer: "SHOES" },
  },

  "headwear-pilot-goggles": {
    slot: "headwear",
    shopIcon: { id: "face-v4-pilot-goggles", slot: "face" },
    wornAsset: { key: "head.pilotGoggles", anchor: "forehead", layer: "HEADWEAR" },
  },
  "headwear-wizardhat": {
    slot: "headwear",
    shopIcon: { id: "headwear-wizardhat", slot: "headwear" },
    wornAsset: { key: "head.wizardHat", anchor: "headTop", layer: "HEADWEAR" },
  },
  "headwear-crown-gold": {
    slot: "headwear",
    shopIcon: { id: "headwear-crown-gold", slot: "headwear" },
    wornAsset: { key: "head.goldCrown", anchor: "headTop", layer: "HEADWEAR" },
  },

  "face-v4-archive-monocle": {
    slot: "face",
    shopIcon: { id: "face-v4-archive-monocle", slot: "face" },
    wornAsset: { key: "accessory.monocle", anchor: "rightEye", layer: "FACE_ACCESSORY" },
  },
  "face-compass-necklace": {
    slot: "face",
    shopIcon: { id: "face-v4-compass-eye", slot: "face" },
    wornAsset: { key: "accessory.compassNecklace", anchor: "chest", layer: "CHEST_ACCESSORY" },
  },
  "face-star-brooch": {
    slot: "face",
    shopIcon: { id: "face-backpack-badge", slot: "face" },
    wornAsset: { key: "accessory.starBrooch", anchor: "rightShoulder", layer: "CHEST_ACCESSORY" },
  },
  "face-wand": {
    slot: "face",
    shopIcon: { id: "face-wand", slot: "face" },
    wornAsset: { key: "accessory.wand", anchor: "rightHand", layer: "HAND_ACCESSORY" },
  },

  "back-v4-daypack": {
    slot: "back",
    shopIcon: { id: "back-v4-daypack", slot: "back" },
    wornAsset: { key: "back.explorerPack", anchor: "backCenter", layer: "BACK_BEHIND", frontKey: "back.explorerPackStraps" },
  },
  "back-crystal-wings": {
    slot: "back",
    shopIcon: { id: "headwear-wings", slot: "headwear" },
    wornAsset: { key: "back.crystalWings", anchor: "backShoulders", layer: "BACK_BEHIND" },
  },
  "back-v4-archive": {
    slot: "back",
    shopIcon: { id: "back-v4-archive", slot: "back" },
    wornAsset: { key: "back.scrollPack", anchor: "backCenter", layer: "BACK_BEHIND", frontKey: "back.scrollPackStrap" },
  },
});

export const CORE_WEARABLE_IDS = Object.freeze(Object.keys(CORE_WEARABLES));

export function getCoreWearable(id) {
  return id ? CORE_WEARABLES[id] || null : null;
}

export function getShopIconIdentity(item) {
  const meta = getCoreWearable(item?.id);
  return meta?.shopIcon || { id: item?.assetId || item?.id, slot: item?.assetSlot || item?.slot };
}

export function getWornAsset(itemOrId) {
  const id = typeof itemOrId === "string" ? itemOrId : itemOrId?.id;
  return getCoreWearable(id)?.wornAsset || null;
}
