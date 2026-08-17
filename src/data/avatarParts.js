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
  BACK: "back",
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

const CORE_ITEMS = [
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


// ===== V4.3 PREMIUM CATALOG EXPANSION =====
const V43_OUTFITS = [
  { id: "outfit-v4-navy-pilot", slot: SLOTS.OUTFIT, set: "gunluk", world: "w1", label: "Lacivert Pilot Montu", price: 120, color: "#53D9FF" },
  { id: "outfit-v4-mountain-orange", slot: SLOTS.OUTFIT, set: "buyulu", world: "w2", label: "Turuncu Dağcı Ceketi", price: 140, color: "#FF914D" },
  { id: "outfit-v4-field-green", slot: SLOTS.OUTFIT, set: "bilim", world: "w3", label: "Orman Ranger Ceketi", price: 160, color: "#47D69B" },
  { id: "outfit-v4-rainstorm", slot: SLOTS.OUTFIT, set: "deniz", world: "w4", label: "Fırtına Yağmurluğu", price: 180, color: "#8290FF" },
  { id: "outfit-v4-arctic", slot: SLOTS.OUTFIT, set: "uzay", world: "w5", label: "Buz Kaşifi Montu", price: 200, color: "#D8ECFF" },
  { id: "outfit-v4-desert", slot: SLOTS.OUTFIT, set: "kozmik", world: "w6", label: "Çöl Gözlem Ceketi", price: 220, color: "#FFCD61" },
  { id: "outfit-v4-archive", slot: SLOTS.OUTFIT, set: "prens", world: "w7", label: "Arşiv Araştırmacı Ceketi", price: 130, color: "#7CE0C2" },
  { id: "outfit-v4-city-neon", slot: SLOTS.OUTFIT, set: "gunluk", world: "w8", label: "Neon Şehir Hoodie", price: 150, color: "#B56CFF" },
  { id: "outfit-v4-crystal-guard", slot: SLOTS.OUTFIT, set: "buyulu", world: "w9", label: "Kristal Koruyucu Zırh", price: 170, color: "#7DEBFF" },
  { id: "outfit-v4-star-captain", slot: SLOTS.OUTFIT, set: "bilim", world: "w10", label: "Yıldız Kaptanı Montu", price: 190, color: "#FFC83D" },
  { id: "outfit-v4-meteor", slot: SLOTS.OUTFIT, set: "deniz", world: "w11", label: "Meteor Keşif Ceketi", price: 210, color: "#FF6E91" },
  { id: "outfit-v4-galaxy-guard", slot: SLOTS.OUTFIT, set: "uzay", world: "w12", label: "Galaksi Muhafız Zırhı", price: 230, color: "#8D78FF" },
  { id: "outfit-v4-compass-master", slot: SLOTS.OUTFIT, set: "kozmik", world: "w1", label: "Pusula Ustası Ceketi", price: 140, color: "#53D9FF" },
  { id: "outfit-v4-tundra", slot: SLOTS.OUTFIT, set: "prens", world: "w2", label: "Tundra Görev Montu", price: 160, color: "#FF914D" },
  { id: "outfit-v4-volcano", slot: SLOTS.OUTFIT, set: "gunluk", world: "w3", label: "Volkan İz Sürücü Ceketi", price: 180, color: "#47D69B" },
  { id: "outfit-v4-ocean-tech", slot: SLOTS.OUTFIT, set: "buyulu", world: "w4", label: "Okyanus Teknoloji Takımı", price: 200, color: "#8290FF" },
  { id: "outfit-v4-forest-scholar", slot: SLOTS.OUTFIT, set: "bilim", world: "w5", label: "Orman Bilgini Ceketi", price: 220, color: "#D8ECFF" },
  { id: "outfit-v4-solar", slot: SLOTS.OUTFIT, set: "deniz", world: "w6", label: "Güneş Enerji Montu", price: 240, color: "#FFCD61" },
  { id: "outfit-v4-night-lab", slot: SLOTS.OUTFIT, set: "uzay", world: "w7", label: "Gece Laboratuvar Ceketi", price: 150, color: "#7CE0C2" },
  { id: "outfit-v4-sky-ranger", slot: SLOTS.OUTFIT, set: "kozmik", world: "w8", label: "Gökyüzü Ranger Montu", price: 170, color: "#B56CFF" },
  { id: "outfit-v4-aurora", slot: SLOTS.OUTFIT, set: "prens", world: "w9", label: "Aurora Keşif Ceketi", price: 190, color: "#7DEBFF" },
  { id: "outfit-v4-thunder", slot: SLOTS.OUTFIT, set: "gunluk", world: "w10", label: "Şimşek Pilot Montu", price: 210, color: "#FFC83D" },
  { id: "outfit-v4-coral", slot: SLOTS.OUTFIT, set: "buyulu", world: "w11", label: "Mercan Saha Takımı", price: 230, color: "#FF6E91" },
  { id: "outfit-v4-ancient", slot: SLOTS.OUTFIT, set: "bilim", world: "w12", label: "Antik Kaşif Ceketi", price: 250, color: "#8D78FF" },
  { id: "outfit-v4-orbit", slot: SLOTS.OUTFIT, set: "deniz", world: "w1", label: "Yörünge Görev Montu", price: 160, color: "#53D9FF" },
  { id: "outfit-v4-circuit", slot: SLOTS.OUTFIT, set: "uzay", world: "w2", label: "Devre Ustası Hoodie", price: 180, color: "#FF914D" },
  { id: "outfit-v4-emerald", slot: SLOTS.OUTFIT, set: "kozmik", world: "w3", label: "Zümrüt Muhafız Ceketi", price: 200, color: "#47D69B" },
  { id: "outfit-v4-comet", slot: SLOTS.OUTFIT, set: "prens", world: "w4", label: "Kuyruklu Yıldız Montu", price: 220, color: "#8290FF" },
  { id: "outfit-v4-legend", slot: SLOTS.OUTFIT, set: "gunluk", world: "w5", label: "Efsane Kaşif Pelerini", price: 240, color: "#D8ECFF" },
  { id: "outfit-v4-infinity", slot: SLOTS.OUTFIT, set: "buyulu", world: "w6", label: "Sonsuz Keşif Zırhı", price: 0, color: "#FFCD61", legendary: true, unlock: { type: "fullScore", subject: "any" } },
];
const V43_SHOES = [
  { id: "shoes-v4-trail", slot: SLOTS.SHOES, set: "gunluk", world: "w1", label: "Patika Koşu Ayakkabısı", price: 70, color: "#53D9FF" },
  { id: "shoes-v4-mountain", slot: SLOTS.SHOES, set: "buyulu", world: "w2", label: "Dağ Yürüyüş Botu", price: 90, color: "#FF914D" },
  { id: "shoes-v4-city", slot: SLOTS.SHOES, set: "bilim", world: "w3", label: "Şehir Sneaker", price: 110, color: "#47D69B" },
  { id: "shoes-v4-rain", slot: SLOTS.SHOES, set: "deniz", world: "w4", label: "Yağmur Görev Botu", price: 130, color: "#8290FF" },
  { id: "shoes-v4-arctic", slot: SLOTS.SHOES, set: "uzay", world: "w5", label: "Kutup Botu", price: 150, color: "#D8ECFF" },
  { id: "shoes-v4-desert", slot: SLOTS.SHOES, set: "kozmik", world: "w6", label: "Çöl Botu", price: 170, color: "#FFCD61" },
  { id: "shoes-v4-lab", slot: SLOTS.SHOES, set: "prens", world: "w7", label: "Laboratuvar Sneaker", price: 80, color: "#7CE0C2" },
  { id: "shoes-v4-neon", slot: SLOTS.SHOES, set: "gunluk", world: "w8", label: "Neon Hız Ayakkabısı", price: 100, color: "#B56CFF" },
  { id: "shoes-v4-crystal", slot: SLOTS.SHOES, set: "buyulu", world: "w9", label: "Kristal Bot", price: 120, color: "#7DEBFF" },
  { id: "shoes-v4-star", slot: SLOTS.SHOES, set: "bilim", world: "w10", label: "Yıldız Pilot Botu", price: 140, color: "#FFC83D" },
  { id: "shoes-v4-meteor", slot: SLOTS.SHOES, set: "deniz", world: "w11", label: "Meteor Koşu Botu", price: 160, color: "#FF6E91" },
  { id: "shoes-v4-galaxy", slot: SLOTS.SHOES, set: "uzay", world: "w12", label: "Galaksi Botu", price: 180, color: "#8D78FF" },
  { id: "shoes-v4-compass", slot: SLOTS.SHOES, set: "kozmik", world: "w1", label: "Pusula Yürüyüş Botu", price: 90, color: "#53D9FF" },
  { id: "shoes-v4-volcano", slot: SLOTS.SHOES, set: "prens", world: "w2", label: "Volkan Botu", price: 110, color: "#FF914D" },
  { id: "shoes-v4-ocean", slot: SLOTS.SHOES, set: "gunluk", world: "w3", label: "Okyanus Dalış Botu", price: 130, color: "#47D69B" },
  { id: "shoes-v4-solar", slot: SLOTS.SHOES, set: "buyulu", world: "w4", label: "Güneş Jet Ayakkabısı", price: 150, color: "#8290FF" },
  { id: "shoes-v4-aurora", slot: SLOTS.SHOES, set: "bilim", world: "w5", label: "Aurora Sneaker", price: 170, color: "#D8ECFF" },
  { id: "shoes-v4-thunder", slot: SLOTS.SHOES, set: "deniz", world: "w6", label: "Şimşek Botu", price: 190, color: "#FFCD61" },
  { id: "shoes-v4-comet", slot: SLOTS.SHOES, set: "uzay", world: "w7", label: "Kuyruklu Yıldız Botu", price: 100, color: "#7CE0C2" },
  { id: "shoes-v4-infinity", slot: SLOTS.SHOES, set: "kozmik", world: "w8", label: "Sonsuzluk Botu", price: 0, color: "#B56CFF", legendary: true, unlock: { type: "fullScore", subject: "any" } },
];
const V43_HEADWEAR = [
  { id: "headwear-v4-explorer-cap", slot: SLOTS.HEADWEAR, set: "gunluk", world: "w1", label: "Klasik Kaşif Şapkası", price: 60, color: "#53D9FF" },
  { id: "headwear-v4-pilot-cap", slot: SLOTS.HEADWEAR, set: "buyulu", world: "w2", label: "Pilot Başlığı", price: 80, color: "#FF914D" },
  { id: "headwear-v4-ranger-cap", slot: SLOTS.HEADWEAR, set: "bilim", world: "w3", label: "Ranger Şapkası", price: 100, color: "#47D69B" },
  { id: "headwear-v4-arctic-cap", slot: SLOTS.HEADWEAR, set: "deniz", world: "w4", label: "Kutup Başlığı", price: 120, color: "#8290FF" },
  { id: "headwear-v4-desert-cap", slot: SLOTS.HEADWEAR, set: "uzay", world: "w5", label: "Çöl Güneşliği", price: 140, color: "#D8ECFF" },
  { id: "headwear-v4-science", slot: SLOTS.HEADWEAR, set: "kozmik", world: "w6", label: "Bilim Vizörü", price: 160, color: "#FFCD61" },
  { id: "headwear-v4-neon", slot: SLOTS.HEADWEAR, set: "prens", world: "w7", label: "Neon Kask", price: 70, color: "#7CE0C2" },
  { id: "headwear-v4-crystal", slot: SLOTS.HEADWEAR, set: "gunluk", world: "w8", label: "Kristal Taç", price: 90, color: "#B56CFF" },
  { id: "headwear-v4-star", slot: SLOTS.HEADWEAR, set: "buyulu", world: "w9", label: "Yıldız Kaptanı Başlığı", price: 110, color: "#7DEBFF" },
  { id: "headwear-v4-meteor", slot: SLOTS.HEADWEAR, set: "bilim", world: "w10", label: "Meteor Kaskı", price: 130, color: "#FFC83D" },
  { id: "headwear-v4-galaxy", slot: SLOTS.HEADWEAR, set: "deniz", world: "w11", label: "Galaksi Tacı", price: 150, color: "#FF6E91" },
  { id: "headwear-v4-archive", slot: SLOTS.HEADWEAR, set: "uzay", world: "w12", label: "Altın Arşiv Başlığı", price: 170, color: "#8D78FF" },
  { id: "headwear-v4-aurora", slot: SLOTS.HEADWEAR, set: "kozmik", world: "w1", label: "Aurora Tacı", price: 80, color: "#53D9FF" },
  { id: "headwear-v4-comet", slot: SLOTS.HEADWEAR, set: "prens", world: "w2", label: "Kuyruklu Yıldız Tacı", price: 100, color: "#FF914D" },
  { id: "headwear-v4-infinity", slot: SLOTS.HEADWEAR, set: "gunluk", world: "w3", label: "Sonsuzluk Tacı", price: 0, color: "#47D69B", legendary: true, unlock: { type: "fullScore", subject: "any" } },
];
const V43_FACE = [
  { id: "face-v4-pilot-goggles", slot: SLOTS.FACE, set: "gunluk", world: "w1", label: "Pilot Gözlüğü", price: 60, color: "#53D9FF" },
  { id: "face-v4-science-goggles", slot: SLOTS.FACE, set: "buyulu", world: "w2", label: "Bilim Gözlüğü", price: 80, color: "#FF914D" },
  { id: "face-v4-neon-glasses", slot: SLOTS.FACE, set: "bilim", world: "w3", label: "Neon Gözlük", price: 100, color: "#47D69B" },
  { id: "face-v4-crystal-visor", slot: SLOTS.FACE, set: "deniz", world: "w4", label: "Kristal Vizör", price: 120, color: "#8290FF" },
  { id: "face-v4-star-visor", slot: SLOTS.FACE, set: "uzay", world: "w5", label: "Yıldız Vizörü Pro", price: 140, color: "#D8ECFF" },
  { id: "face-v4-magnifier-pro", slot: SLOTS.FACE, set: "kozmik", world: "w6", label: "Akıllı Büyüteç", price: 160, color: "#FFCD61" },
  { id: "face-v4-compass-eye", slot: SLOTS.FACE, set: "prens", world: "w7", label: "Pusula Monoklü", price: 70, color: "#7CE0C2" },
  { id: "face-v4-ocean-mask", slot: SLOTS.FACE, set: "gunluk", world: "w8", label: "Okyanus Maskesi", price: 90, color: "#B56CFF" },
  { id: "face-v4-night-visor", slot: SLOTS.FACE, set: "buyulu", world: "w9", label: "Gece Görüş Vizörü", price: 110, color: "#7DEBFF" },
  { id: "face-v4-solar-lens", slot: SLOTS.FACE, set: "bilim", world: "w10", label: "Güneş Lensi", price: 130, color: "#FFC83D" },
  { id: "face-v4-aurora-glasses", slot: SLOTS.FACE, set: "deniz", world: "w11", label: "Aurora Gözlüğü", price: 150, color: "#FF6E91" },
  { id: "face-v4-thunder-visor", slot: SLOTS.FACE, set: "uzay", world: "w12", label: "Şimşek Vizörü", price: 170, color: "#8D78FF" },
  { id: "face-v4-comet-lens", slot: SLOTS.FACE, set: "kozmik", world: "w1", label: "Kuyruklu Yıldız Lensi", price: 80, color: "#53D9FF" },
  { id: "face-v4-archive-monocle", slot: SLOTS.FACE, set: "prens", world: "w2", label: "Arşiv Monoklü", price: 100, color: "#FF914D" },
  { id: "face-v4-infinity-visor", slot: SLOTS.FACE, set: "gunluk", world: "w3", label: "Sonsuzluk Vizörü", price: 0, color: "#47D69B", legendary: true, unlock: { type: "fullScore", subject: "any" } },
];
const V43_BACK = [
  { id: "back-v4-daypack", slot: SLOTS.BACK, set: "gunluk", world: "w1", label: "Günlük Kaşif Çantası", price: 90, color: "#53D9FF" },
  { id: "back-v4-mountain", slot: SLOTS.BACK, set: "buyulu", world: "w2", label: "Dağcı Sırt Çantası", price: 110, color: "#FF914D" },
  { id: "back-v4-science", slot: SLOTS.BACK, set: "bilim", world: "w3", label: "Araştırma Çantası", price: 130, color: "#47D69B" },
  { id: "back-v4-neon", slot: SLOTS.BACK, set: "deniz", world: "w4", label: "Neon Teknoloji Çantası", price: 150, color: "#8290FF" },
  { id: "back-v4-crystal", slot: SLOTS.BACK, set: "uzay", world: "w5", label: "Kristal Çanta", price: 170, color: "#D8ECFF" },
  { id: "back-v4-star", slot: SLOTS.BACK, set: "kozmik", world: "w6", label: "Yıldız Görev Çantası", price: 190, color: "#FFCD61" },
  { id: "back-v4-archive", slot: SLOTS.BACK, set: "prens", world: "w7", label: "Arşiv Çantası", price: 100, color: "#7CE0C2" },
  { id: "back-v4-aurora", slot: SLOTS.BACK, set: "gunluk", world: "w8", label: "Aurora Çantası", price: 120, color: "#B56CFF" },
  { id: "back-v4-comet", slot: SLOTS.BACK, set: "buyulu", world: "w9", label: "Kuyruklu Yıldız Çantası", price: 140, color: "#7DEBFF" },
  { id: "back-v4-infinity", slot: SLOTS.BACK, set: "bilim", world: "w10", label: "Sonsuzluk Çantası", price: 0, color: "#FFC83D", legendary: true, unlock: { type: "fullScore", subject: "any" } },
];

export const ITEMS = [...CORE_ITEMS, ...V43_OUTFITS, ...V43_SHOES, ...V43_HEADWEAR, ...V43_FACE, ...V43_BACK];

export const DEFAULT_AVATAR = {
  characterStyle: "auto",
  skin: "skin-1",
  hairStyle: "hair-space-buns",
  hairColor: "#FF9EAA",
  outfit: "outfit-tshirt",
  shoes: "shoes-sneaker",
  headwear: null,
  face: null,
  back: null,
};

export const STARTER_UNLOCKED = ITEMS.filter((i) => i.starter).map((i) => i.id);
