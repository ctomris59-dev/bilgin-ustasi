// Katman sırası: skin(1) < outfit(2) < shoes(2.5) < hair(4) < headwear(5) < face(5.5)

export const SETS = {
  gunluk: { id: "gunluk", label: "Günlük Kaşif", color: "#FF70A6" },
  buyulu: { id: "buyulu", label: "Orman Keşfi", color: "#B5838D" },
  deniz: { id: "deniz", label: "Sahil Görevi", color: "#52E3C2" },
  prens: { id: "prens", label: "Ustalık Koleksiyonu", color: "#FFD166" },
  uzay: { id: "uzay", label: "Gökyüzü Keşfi", color: "#70D6FF" },
  bilim: { id: "bilim", label: "Araştırmacı Seti", color: "#8C6FFF" },
  pijama: { id: "pijama", label: "Gece Üssü", color: "#FF8FC7" },
  kozmik: { id: "kozmik", label: "Kozmik Koleksiyon", color: "#E0A3FF" },
};

export const SLOTS = {
  SKIN: "skin",
  HAIR: "hair",
  OUTFIT: "outfit",
  SHOES: "shoes",
  HEADWEAR: "headwear",
  FACE: "face",
};

export const SKIN_TONES = [
  { id: "skin-1", hex: "#FFE0C2" },
  { id: "skin-2", hex: "#F2C399" },
  { id: "skin-3", hex: "#C98A5C" },
  { id: "skin-4", hex: "#8A5636" },
];

export const HAIR_STYLES = [
  { id: "hair-space-buns", label: "Uzay Topuzları" },
  { id: "hair-long-braid", label: "Uzun Yan Örgü" },
  { id: "hair-twin-pigtails", label: "Çift Atkuyruğu" },
  { id: "hair-bob-bangs", label: "Kahküllü Kısa Bob" },
  { id: "hair-wavy-long", label: "Uzun Dalgalı" },
  { id: "hair-curly-afro", label: "Kıvırcık" },
];

export const HAIR_COLORS = [
  "#FF9EAA", // Pamuk Şeker Pembesi
  "#70D6FF", // Gökyüzü Mavisi
  "#B5838D", // Tatlı Lila
  "#FFD166", // Güneş Sarısı
  "#52E3C2", // Nane Yeşili
  "#6B4226", // Çikolata Kahve
  "#3A2A1E", // Siyah
  "#E0A3FF", // Şeker Mor
];

export const ITEMS = [
  // ============ DÜNYA 1: BAŞLANGIÇ KÖYÜ (Pamuk Şeker / Günlük) ============
  { id: "outfit-tshirt", slot: SLOTS.OUTFIT, set: "gunluk", world: "w1", label: "Keşif Ceketi", price: 90, color: "#FF70A6", starter: true },
  { id: "outfit-tshirt-red", slot: SLOTS.OUTFIT, set: "gunluk", world: "w1", label: "Mavi Keşif Tulumu", price: 90, color: "#70D6FF" },
  { id: "outfit-tshirt-yellow", slot: SLOTS.OUTFIT, set: "gunluk", world: "w1", label: "Güneş Rüzgârlığı", price: 90, color: "#FFD166" },
  { id: "outfit-tshirt-green", slot: SLOTS.OUTFIT, set: "gunluk", world: "w1", label: "Mor Şehir Takımı", price: 90, color: "#B5838D" },
  { id: "outfit-overalls", slot: SLOTS.OUTFIT, set: "gunluk", world: "w1", label: "Saha Tulumu", price: 110, color: "#52E3C2" },

  { id: "shoes-sneaker", slot: SLOTS.SHOES, set: "gunluk", world: "w1", label: "Işıklı Koşu Ayakkabısı", price: 55, color: "#70D6FF", starter: true },
  { id: "shoes-sneaker-red", slot: SLOTS.SHOES, set: "gunluk", world: "w1", label: "Hız Ayakkabısı", price: 55, color: "#FF70A6" },
  { id: "shoes-sneaker-pink", slot: SLOTS.SHOES, set: "gunluk", world: "w1", label: "Gece Spor Ayakkabısı", price: 55, color: "#FF8FC7" },

  { id: "headwear-cap", slot: SLOTS.HEADWEAR, set: "gunluk", world: "w1", label: "Kışlık Kaşif Beresi", price: 45, color: "#FF9EAA", shape: "cap" },
  { id: "headwear-cap-red", slot: SLOTS.HEADWEAR, set: "gunluk", world: "w1", label: "Atölye Beresi", price: 45, color: "#B5838D", shape: "cap" },
  { id: "headwear-cap-yellow", slot: SLOTS.HEADWEAR, set: "gunluk", world: "w1", label: "Güneşlik Şapka", price: 45, color: "#FFD166", shape: "cap" },
  { id: "headwear-hairbow-pink", slot: SLOTS.HEADWEAR, set: "gunluk", world: "w1", label: "Mercan Saç Tokası", price: 40, color: "#FF70A6", shape: "hairbow" },
  { id: "headwear-hairbow-blue", slot: SLOTS.HEADWEAR, set: "gunluk", world: "w1", label: "Mavi Klips", price: 40, color: "#70D6FF", shape: "hairbow" },

  { id: "face-backpack-badge", slot: SLOTS.FACE, set: "gunluk", world: "w1", label: "Keşif Sırt Çantası", price: 40, color: "#FFD166", shape: "backpack-badge" },

  // ============ DÜNYA 2: BÜYÜLÜ ORMAN (Peri & Sihir Seti) ============
  { id: "outfit-robe", slot: SLOTS.OUTFIT, set: "buyulu", world: "w2", label: "Orman Pelerini", price: 100, color: "#B5838D" },
  { id: "outfit-robe-purple", slot: SLOTS.OUTFIT, set: "buyulu", world: "w2", label: "Gece Orman Takımı", price: 100, color: "#E0A3FF" },
  { id: "outfit-robe-emerald", slot: SLOTS.OUTFIT, set: "buyulu", world: "w2", label: "Yeşil İz Sürücü Takımı", price: 100, color: "#52E3C2" },

  { id: "shoes-cape-boots", slot: SLOTS.SHOES, set: "buyulu", world: "w2", label: "Orman Botları", price: 60, color: "#FF9EAA" },

  { id: "headwear-wizardhat", slot: SLOTS.HEADWEAR, set: "buyulu", world: "w2", label: "Orman Şapkası", price: 50, color: "#52E3C2", shape: "wizardhat" },
  { id: "headwear-wizardhat-teal", slot: SLOTS.HEADWEAR, set: "buyulu", world: "w2", label: "Mor Keşif Şapkası", price: 50, color: "#B5838D", shape: "wizardhat" },
  { id: "headwear-wizardhat-red", slot: SLOTS.HEADWEAR, set: "buyulu", world: "w2", label: "Kızıl Macera Şapkası", price: 50, color: "#FF70A6", shape: "wizardhat" },
  { id: "headwear-flowercrown", slot: SLOTS.HEADWEAR, set: "buyulu", world: "w2", label: "Yaprak Tacı", price: 55, color: "#FF8FC7", shape: "flowercrown" },

  { id: "face-wand", slot: SLOTS.FACE, set: "buyulu", world: "w2", label: "Enerji Çubuğu", price: 45, color: "#FFD166", shape: "wand" },

  // Efsanevi
  { id: "headwear-crown", slot: SLOTS.HEADWEAR, set: "prens", world: "w5", label: "Kristal Ustalık Tacı", price: 0, color: "#FFF275", shape: "crown", legendary: true, unlock: { type: "fullScore", subject: "any" } },

  // ============ DÜNYA 3: BİLİM LABORATUVARI (Tatlı Dedektif Seti) ============
  { id: "outfit-labcoat", slot: SLOTS.OUTFIT, set: "bilim", world: "w3", label: "Araştırma Önlüğü", price: 100, color: "#52E3C2" },
  { id: "outfit-labcoat-blue", slot: SLOTS.OUTFIT, set: "bilim", world: "w3", label: "Mavi Laboratuvar Ceketi", price: 100, color: "#70D6FF" },

  { id: "face-glasses", slot: SLOTS.FACE, set: "bilim", world: "w3", label: "Araştırmacı Gözlüğü", price: 45, color: "#FF70A6", shape: "glasses" },
  { id: "face-glasses-red", slot: SLOTS.FACE, set: "bilim", world: "w3", label: "Kızıl Çerçeve", price: 45, color: "#FF477E", shape: "glasses" },
  { id: "face-magnifier", slot: SLOTS.FACE, set: "bilim", world: "w3", label: "Araştırma Büyüteci", price: 45, color: "#FFD166", shape: "magnifier" },

  { id: "headwear-detective-hat", slot: SLOTS.HEADWEAR, set: "bilim", world: "w3", label: "Dedektif Şapkası", price: 50, color: "#B5838D", shape: "detective-hat" },

  // Efsanevi Kanatlar
  { id: "headwear-wings", slot: SLOTS.HEADWEAR, set: "buyulu", world: "w6", label: "Enerji Kanatları", price: 0, color: "#70D6FF", shape: "wings", legendary: true, unlock: { type: "fullScore", subject: "Fen Bilimleri" } },

  // ============ DÜNYA 4: GÖKKUŞAĞI SAHİLİ (Denizkızı & Parti Seti) ============
  { id: "outfit-halloween", slot: SLOTS.OUTFIT, set: "deniz", world: "w4", label: "Sahil Dalış Takımı", price: 100, color: "#52E3C2" },
  { id: "outfit-christmas", slot: SLOTS.OUTFIT, set: "pijama", world: "w4", label: "Gece Üs Takımı", price: 100, color: "#FF8FC7" },
  { id: "outfit-summer-dress", slot: SLOTS.OUTFIT, set: "gunluk", world: "w4", label: "Yaz Keşif Takımı", price: 100, color: "#FFD166" },

  { id: "shoes-sandals", slot: SLOTS.SHOES, set: "deniz", world: "w4", label: "Sahil Sandaleti", price: 55, color: "#FFD166" },

  { id: "headwear-beanie", slot: SLOTS.HEADWEAR, set: "pijama", world: "w4", label: "Gece Bandı", price: 45, color: "#FF8FC7", shape: "beanie" },
  { id: "headwear-beanie-blue", slot: SLOTS.HEADWEAR, set: "pijama", world: "w4", label: "Kutup Beresi", price: 45, color: "#70D6FF", shape: "beanie" },
  { id: "headwear-partyhat", slot: SLOTS.HEADWEAR, set: "prens", world: "w4", label: "Kutlama Şapkası", price: 45, color: "#B5838D", shape: "partyhat" },

  { id: "face-sunglasses", slot: SLOTS.FACE, set: "deniz", world: "w4", label: "Sahil Gözlüğü", price: 45, color: "#FF70A6", shape: "sunglasses" },

  // ============ DÜNYA 7: BULUTLARIN ÖTESİ (Gökyüzü & Melek) ============
  { id: "outfit-cloud-dress", slot: SLOTS.OUTFIT, set: "uzay", world: "w7", label: "Gökyüzü Ceketi", price: 140, color: "#70D6FF" },
  { id: "shoes-cloud", slot: SLOTS.SHOES, set: "uzay", world: "w7", label: "Bulut Botları", price: 75, color: "#FFFFFF" },
  { id: "headwear-halo", slot: SLOTS.HEADWEAR, set: "uzay", world: "w7", label: "Yıldız Halkası", price: 80, color: "#FFF275", shape: "halo" },

  // ============ DÜNYA 9-12: KOZMİK KOLEKSİYON ============
  { id: "outfit-crystal-robe", slot: SLOTS.OUTFIT, set: "kozmik", world: "w9", label: "Kristal Zırh", price: 150, color: "#E0A3FF" },
  { id: "headwear-wizardhat-crystal", slot: SLOTS.HEADWEAR, set: "kozmik", world: "w9", label: "Kristal Başlık", price: 90, color: "#E0A3FF", shape: "wizardhat" },

  { id: "outfit-galaxy-dress", slot: SLOTS.OUTFIT, set: "kozmik", world: "w10", label: "Yıldız İstasyonu Tulumu", price: 170, color: "#B5838D" },
  { id: "face-sunglasses-galaxy", slot: SLOTS.FACE, set: "kozmik", world: "w10", label: "Yıldız Vizörü", price: 90, color: "#B5838D", shape: "sunglasses" },

  { id: "outfit-gold-robe", slot: SLOTS.OUTFIT, set: "prens", world: "w11", label: "Altın Ustalık Ceketi", price: 220, color: "#FFD166" },
  { id: "headwear-crown-gold", slot: SLOTS.HEADWEAR, set: "prens", world: "w11", label: "Altın Arşiv Tacı", price: 320, color: "#FFD166", shape: "crown" },

  { id: "outfit-infinity-cape", slot: SLOTS.OUTFIT, set: "kozmik", world: "w12", label: "Sonsuzluk Pelerini", price: 260, color: "#FF70A6" },
  { id: "headwear-wings-infinity", slot: SLOTS.HEADWEAR, set: "kozmik", world: "w12", label: "Kozmik Enerji Kanatları", price: 380, color: "#FF8FC7", shape: "wings" },
];

export const DEFAULT_AVATAR = {
  characterStyle: "auto",
  skin: "skin-1",
  hairStyle: "hair-space-buns",
  hairColor: "#FF9EAA",
  outfit: "outfit-tshirt",
  shoes: "shoes-sneaker",
  headwear: null,
  face: null,
};

export const STARTER_UNLOCKED = ITEMS.filter((i) => i.starter).map((i) => i.id);
