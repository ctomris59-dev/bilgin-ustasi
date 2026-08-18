// Bilgin Ustası V4.9 — karaktere özel, tam-set giydirme sistemi.
// Görsel bütünlük için parçalar tek tek kataloglanır; ancak kahraman sahnesinde
// her item ait olduğu tamamlanmış karakter setini uygular. Böylece hiçbir parça
// master karakterin vücut oranından kopmaz veya sticker gibi görünmez.

export const SLOTS = Object.freeze({
  SKIN: "skin",
  HAIR: "hair",
  OUTFIT: "outfit",
  SHOES: "shoes",
  HEADWEAR: "headwear",
  FACE: "face",
  BACK: "back",
});

export const SETS = Object.freeze({
  explorer: {
    id: "explorer",
    label: "Kaşif Seti",
    shortLabel: "Kaşif",
    color: "#20B8FF",
    rarity: "common",
    setPrice: 0,
    bonus: "+5 Keşif",
    description: "Bilgin Kaşif'in klasik saha ekipmanı. Hafif, dayanıklı ve her derse hazır.",
  },
  cloud: {
    id: "cloud",
    label: "Gökyüzü Seti",
    shortLabel: "Gökyüzü",
    color: "#8EE8FF",
    rarity: "rare",
    setPrice: 360,
    bonus: "+6 Odak",
    description: "Bulut ve yıldız temalı hafif keşif seti. Işık kanatlarıyla birlikte tamamlanır.",
  },
  forest: {
    id: "forest",
    label: "Orman Seti",
    shortLabel: "Orman",
    color: "#39D58B",
    rarity: "epic",
    setPrice: 340,
    bonus: "+7 Dayanıklılık",
    description: "Harita, saha notları ve izcilik ekipmanı taşıyan doğa keşif seti.",
  },
});

export const SKIN_TONES = [{ id: "skin-master", hex: "#E9AE82" }];
export const HAIR_STYLES = [{ id: "hair-master-curly", label: "Kıvırcık Kahverengi" }];
export const HAIR_COLORS = ["#6B351F"];

const item = (config) => Object.freeze({
  wearableVersion: 4,
  characterLocked: "bilgin-kasif-master",
  fitMode: "full-render-set",
  ...config,
});

export const ITEMS = Object.freeze([
  item({ id:"outfit-v49-explorer", slot:SLOTS.OUTFIT, set:"explorer", world:"w1", label:"Mavi Kaşif Ceketi", starter:true, price:0, color:"#247FD0" }),
  item({ id:"shoes-v49-explorer", slot:SLOTS.SHOES, set:"explorer", world:"w1", label:"Kaşif Botları", starter:true, price:0, color:"#8A5733" }),
  item({ id:"headwear-v49-explorer", slot:SLOTS.HEADWEAR, set:"explorer", world:"w1", label:"Pilot Gözlüğü", starter:true, price:0, color:"#C88A38" }),
  item({ id:"face-v49-explorer", slot:SLOTS.FACE, set:"explorer", world:"w1", label:"Pusula Kolyesi", starter:true, price:0, color:"#D8A441" }),
  item({ id:"back-v49-explorer", slot:SLOTS.BACK, set:"explorer", world:"w1", label:"Keşif Sırt Çantası", starter:true, price:0, color:"#805332" }),
  item({ id:"outfit-v49-cloud", slot:SLOTS.OUTFIT, set:"cloud", world:"w4", label:"Gökyüzü Elbisesi", price:360, color:"#BFEAFF" }),
  item({ id:"shoes-v49-cloud", slot:SLOTS.SHOES, set:"cloud", world:"w4", label:"Bulut Botları", price:360, color:"#CDEEFF" }),
  item({ id:"headwear-v49-cloud", slot:SLOTS.HEADWEAR, set:"cloud", world:"w4", label:"Kristal Gökyüzü Tacı", price:360, color:"#87DCFF" }),
  item({ id:"face-v49-cloud", slot:SLOTS.FACE, set:"cloud", world:"w4", label:"Yıldız Madalyonu", price:360, color:"#61CFFF" }),
  item({ id:"back-v49-cloud", slot:SLOTS.BACK, set:"cloud", world:"w4", label:"Işık Kanatları", price:360, color:"#A8EEFF" }),
  item({ id:"outfit-v49-forest", slot:SLOTS.OUTFIT, set:"forest", world:"w3", label:"Zümrüt İzci Ceketi", price:340, color:"#1E7955" }),
  item({ id:"shoes-v49-forest", slot:SLOTS.SHOES, set:"forest", world:"w3", label:"Orman İzci Botları", price:340, color:"#45683C" }),
  item({ id:"headwear-v49-forest", slot:SLOTS.HEADWEAR, set:"forest", world:"w3", label:"İzci Şapkası", price:340, color:"#75613F" }),
  item({ id:"face-v49-forest", slot:SLOTS.FACE, set:"forest", world:"w3", label:"Zümrüt Pusula Tılsımı", price:340, color:"#28A96E" }),
  item({ id:"back-v49-forest", slot:SLOTS.BACK, set:"forest", world:"w3", label:"Harita Tüpü", price:340, color:"#93613D" }),
]);

export const SET_LOADOUTS = Object.freeze(Object.fromEntries(
  Object.keys(SETS).map((setId) => [setId, Object.fromEntries(ITEMS.filter((x) => x.set === setId).map((x) => [x.slot, x.id]))])
));
export const ITEM_BY_ID = Object.freeze(Object.fromEntries(ITEMS.map((entry) => [entry.id, entry])));
export const CORE_ITEM_IDS = Object.freeze(ITEMS.map((entry) => entry.id));
export const CORE_ITEM_ID_SET = new Set(CORE_ITEM_IDS);
export const CORE_ITEMS_BY_SLOT = Object.freeze(Object.fromEntries(
  [SLOTS.OUTFIT,SLOTS.SHOES,SLOTS.HEADWEAR,SLOTS.FACE,SLOTS.BACK].map((slot) => [slot, ITEMS.filter((entry) => entry.slot === slot)])
));
export function getSetForItem(itemOrId) { const itemData = typeof itemOrId === "string" ? ITEM_BY_ID[itemOrId] : itemOrId; return itemData?.set ? SETS[itemData.set] || null : null; }
export function getSetItemIds(setId) { return Object.values(SET_LOADOUTS[setId] || {}); }
export function makeAvatarForSet(setId = "explorer", previous = {}) {
  const safeSet = SET_LOADOUTS[setId] ? setId : "explorer";
  return { characterStyle:"master", skin:"skin-master", hairStyle:"hair-master-curly", hairColor:"#6B351F", ...previous, set:safeSet, ...SET_LOADOUTS[safeSet] };
}
export const DEFAULT_AVATAR = Object.freeze(makeAvatarForSet("explorer"));
export const STARTER_UNLOCKED = Object.freeze(getSetItemIds("explorer"));
