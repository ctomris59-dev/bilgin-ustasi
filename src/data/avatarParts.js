// Bilgin Ustası V4.8 — Master karaktere özel sıfırdan giydirme koleksiyonu.
// Eski wearable kataloğu tamamen devre dışıdır. 4 set × 5 slot = 20 yeni item.

export const SLOTS = {
  SKIN: "skin",
  HAIR: "hair",
  OUTFIT: "outfit",
  SHOES: "shoes",
  HEADWEAR: "headwear",
  FACE: "face",
  BACK: "back",
};

export const SETS = Object.freeze({
  explorer: { id: "explorer", label: "Kaşif Seti", color: "#1AA8FF", rarity: "common", bonus: "+5 Keşif" },
  galaxy: { id: "galaxy", label: "Galaksi Seti", color: "#8B5CFF", rarity: "legendary", bonus: "+8 Bilgi" },
  cloud: { id: "cloud", label: "Bulut Seti", color: "#9EE8FF", rarity: "rare", bonus: "+6 Odak" },
  forest: { id: "forest", label: "Orman Seti", color: "#35C984", rarity: "epic", bonus: "+7 Dayanıklılık" },
});

export const SKIN_TONES = [{ id: "skin-master", hex: "#E9AE82" }];
export const HAIR_STYLES = [{ id: "hair-master-curly", label: "Kıvırcık Kahverengi" }];
export const HAIR_COLORS = ["#6B351F"];

function iconSvg(slot, theme, title) {
  const palettes = {
    explorer: ["#0A66C2", "#28C9FF", "#E6B04B"],
    galaxy: ["#24165E", "#7B48FF", "#55E8FF"],
    cloud: ["#9BDFFF", "#F7FCFF", "#7AABFF"],
    forest: ["#0D5B46", "#1AA66F", "#E4B95C"],
  };
  const [base, glow, trim] = palettes[theme] || palettes.explorer;
  const glyph = { outfit: "✦", shoes: "◆", headwear: "▲", face: "◉", back: "▰" }[slot] || "✦";
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 180'>
    <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop stop-color='${base}'/><stop offset='1' stop-color='${glow}'/></linearGradient></defs>
    <rect width='220' height='180' rx='22' fill='#061F4B'/><circle cx='110' cy='78' r='58' fill='url(#g)' opacity='.28'/>
    <path d='M51 133 Q110 155 169 133' fill='none' stroke='${glow}' stroke-width='4' opacity='.55'/>
    <text x='110' y='92' text-anchor='middle' font-size='68' font-family='Arial' fill='${trim}' filter='drop-shadow(0 0 10px ${glow})'>${glyph}</text>
    <text x='110' y='158' text-anchor='middle' font-size='13' font-weight='700' font-family='Arial' fill='#EAF7FF'>${title.replace(/&/g, "ve")}</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const item = (config) => ({ wearableVersion: 3, masterOnly: true, ...config, cardAsset: iconSvg(config.slot, config.set, config.label) });

export const ITEMS = [
  // KAŞİF SETİ — mevcut master karakterin doğal başlangıç görünümü
  item({ id: "outfit-v48-explorer", slot: SLOTS.OUTFIT, set: "explorer", world: "w1", label: "Mavi Kaşif Ceketi", price: 0, starter: true, color: "#197ED8", appearance: { style: "explorerJacket" } }),
  item({ id: "shoes-v48-explorer", slot: SLOTS.SHOES, set: "explorer", world: "w1", label: "Kaşif Botları", price: 0, starter: true, color: "#7C4B2B", appearance: { style: "explorerBoots" } }),
  item({ id: "headwear-v48-explorer", slot: SLOTS.HEADWEAR, set: "explorer", world: "w1", label: "Pilot Gözlüğü", price: 0, starter: true, color: "#C68A35", appearance: { style: "pilotGoggles" } }),
  item({ id: "face-v48-explorer", slot: SLOTS.FACE, set: "explorer", world: "w1", label: "Pusula Kolyesi", price: 0, starter: true, color: "#D5A34A", appearance: { style: "compassPendant" } }),
  item({ id: "back-v48-explorer", slot: SLOTS.BACK, set: "explorer", world: "w1", label: "Kaşif Sırt Çantası", price: 0, starter: true, color: "#80502D", appearance: { style: "explorerPack" } }),

  // GALAKSİ SETİ — master silüetini koruyan teknoloji/uzay varyantı
  item({ id: "outfit-v48-galaxy", slot: SLOTS.OUTFIT, set: "galaxy", world: "w6", label: "Galaksi Kaşif Zırhı", price: 260, legendary: true, color: "#654DFF", appearance: { style: "galaxyArmor" } }),
  item({ id: "shoes-v48-galaxy", slot: SLOTS.SHOES, set: "galaxy", world: "w6", label: "Yıldız Botları", price: 180, color: "#536DFF", appearance: { style: "galaxyBoots" } }),
  item({ id: "headwear-v48-galaxy", slot: SLOTS.HEADWEAR, set: "galaxy", world: "w6", label: "Yıldız Vizörü", price: 170, color: "#67E9FF", appearance: { style: "starVisor" } }),
  item({ id: "face-v48-galaxy", slot: SLOTS.FACE, set: "galaxy", world: "w6", label: "Nebula Çekirdeği", price: 160, color: "#A36DFF", appearance: { style: "nebulaCore" } }),
  item({ id: "back-v48-galaxy", slot: SLOTS.BACK, set: "galaxy", world: "w6", label: "Yörünge Güç Paketi", price: 220, color: "#455CFF", appearance: { style: "orbitPack" } }),

  // BULUT SETİ — yumuşak açık mavi / beyaz fantastik varyant
  item({ id: "outfit-v48-cloud", slot: SLOTS.OUTFIT, set: "cloud", world: "w4", label: "Bulut Elbisesi", price: 150, color: "#BDEBFF", appearance: { style: "cloudDress" } }),
  item({ id: "shoes-v48-cloud", slot: SLOTS.SHOES, set: "cloud", world: "w4", label: "Bulut Pabuçları", price: 125, color: "#DDF8FF", appearance: { style: "cloudBoots" } }),
  item({ id: "headwear-v48-cloud", slot: SLOTS.HEADWEAR, set: "cloud", world: "w4", label: "Gökyüzü Tacı", price: 145, color: "#B7EAFF", appearance: { style: "skyCrown" } }),
  item({ id: "face-v48-cloud", slot: SLOTS.FACE, set: "cloud", world: "w4", label: "Yıldız Madalyonu", price: 110, color: "#74D9FF", appearance: { style: "skyMedal" } }),
  item({ id: "back-v48-cloud", slot: SLOTS.BACK, set: "cloud", world: "w4", label: "Işık Kanatları", price: 190, color: "#8DEBFF", appearance: { style: "lightWings" } }),

  // ORMAN SETİ — yeşil/altın saha kaşifi varyantı
  item({ id: "outfit-v48-forest", slot: SLOTS.OUTFIT, set: "forest", world: "w3", label: "Zümrüt Kaşif Ceketi", price: 140, color: "#178A63", appearance: { style: "forestCoat" } }),
  item({ id: "shoes-v48-forest", slot: SLOTS.SHOES, set: "forest", world: "w3", label: "Orman İzci Botları", price: 115, color: "#276E4B", appearance: { style: "forestBoots" } }),
  item({ id: "headwear-v48-forest", slot: SLOTS.HEADWEAR, set: "forest", world: "w3", label: "İzci Şapkası", price: 120, color: "#6D5736", appearance: { style: "rangerHat" } }),
  item({ id: "face-v48-forest", slot: SLOTS.FACE, set: "forest", world: "w3", label: "Yaprak Rozeti", price: 95, color: "#38BD7A", appearance: { style: "leafBadge" } }),
  item({ id: "back-v48-forest", slot: SLOTS.BACK, set: "forest", world: "w3", label: "Harita Tüpü", price: 135, color: "#8A5B35", appearance: { style: "mapTube" } }),
];

export const SET_LOADOUTS = Object.freeze(Object.fromEntries(Object.keys(SETS).map((setId) => [setId, Object.fromEntries(ITEMS.filter((x) => x.set === setId).map((x) => [x.slot, x.id]))])));
export const CORE_ITEM_IDS = Object.freeze(ITEMS.map((entry) => entry.id));
export const CORE_ITEM_ID_SET = new Set(CORE_ITEM_IDS);
export const CORE_ITEMS_BY_SLOT = Object.freeze(Object.fromEntries([SLOTS.OUTFIT, SLOTS.SHOES, SLOTS.HEADWEAR, SLOTS.FACE, SLOTS.BACK].map((slot) => [slot, ITEMS.filter((entry) => entry.slot === slot)])));

export const DEFAULT_AVATAR = {
  characterStyle: "master",
  skin: "skin-master",
  hairStyle: "hair-master-curly",
  hairColor: "#6B351F",
  ...SET_LOADOUTS.explorer,
};

export const STARTER_UNLOCKED = ITEMS.filter((entry) => entry.starter).map((entry) => entry.id);
