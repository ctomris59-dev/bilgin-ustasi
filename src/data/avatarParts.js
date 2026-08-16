// Katman sırası: skin(1) < outfit(2) < shoes(2.5) < hair(4) < headwear(5) < face(5.5)

export const SETS = {
  gunluk: { id: "gunluk", label: "Pamuk Şeker / Günlük 🌸", color: "#FF70A6" },
  buyulu: { id: "buyulu", label: "Peri & Sihir Seti ✨", color: "#B5838D" },
  deniz: { id: "deniz", label: "Denizkızı & Deniz Altı 🧜‍♀️", color: "#52E3C2" },
  prens: { id: "prens", label: "Prenses & Balo 👑", color: "#FFD166" },
  uzay: { id: "uzay", label: "Uzay & Galaksi 🌌", color: "#70D6FF" },
  bilim: { id: "bilim", label: "Tatlı Dedektif 🔍", color: "#8C6FFF" },
  pijama: { id: "pijama", label: "Pijama Partisi 🌙", color: "#FF8FC7" },
  kozmik: { id: "kozmik", label: "Kozmik Koleksiyon 🌠", color: "#E0A3FF" },
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
  { id: "hair-wavy-long", label: "Dalgalı Prenses Saçı" },
  { id: "hair-curly-afro", label: "Pofuduk Kıvırcık" },
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
  { id: "outfit-tshirt", slot: SLOTS.OUTFIT, set: "gunluk", world: "w1", label: "Kalpli Pembe Elbise", price: 90, color: "#FF70A6", starter: true },
  { id: "outfit-tshirt-red", slot: SLOTS.OUTFIT, set: "gunluk", world: "w1", label: "Çilekli Kot Salopet", price: 90, color: "#70D6FF" },
  { id: "outfit-tshirt-yellow", slot: SLOTS.OUTFIT, set: "gunluk", world: "w1", label: "Sarı Papatyalı Elbise", price: 90, color: "#FFD166" },
  { id: "outfit-tshirt-green", slot: SLOTS.OUTFIT, set: "gunluk", world: "w1", label: "Lila Pliseli Etek Takım", price: 90, color: "#B5838D" },
  { id: "outfit-overalls", slot: SLOTS.OUTFIT, set: "gunluk", world: "w1", label: "Pastel Tulum", price: 110, color: "#52E3C2" },

  { id: "shoes-sneaker", slot: SLOTS.SHOES, set: "gunluk", world: "w1", label: "Işıklı Spor Ayakkabı", price: 55, color: "#70D6FF", starter: true },
  { id: "shoes-sneaker-red", slot: SLOTS.SHOES, set: "gunluk", world: "w1", label: "Pembe Patenler", price: 55, color: "#FF70A6" },
  { id: "shoes-sneaker-pink", slot: SLOTS.SHOES, set: "gunluk", world: "w1", label: "Simli Babet", price: 55, color: "#FF8FC7" },

  { id: "headwear-cap", slot: SLOTS.HEADWEAR, set: "gunluk", world: "w1", label: "Kedi Kulaklı Bere", price: 45, color: "#FF9EAA", shape: "cap" },
  { id: "headwear-cap-red", slot: SLOTS.HEADWEAR, set: "gunluk", world: "w1", label: "Ressam Beresi", price: 45, color: "#B5838D", shape: "cap" },
  { id: "headwear-cap-yellow", slot: SLOTS.HEADWEAR, set: "gunluk", world: "w1", label: "Güneş Şapkası", price: 45, color: "#FFD166", shape: "cap" },
  { id: "headwear-hairbow-pink", slot: SLOTS.HEADWEAR, set: "gunluk", world: "w1", label: "Büyük Pembe Fiyonk 🎀", price: 40, color: "#FF70A6", shape: "hairbow" },
  { id: "headwear-hairbow-blue", slot: SLOTS.HEADWEAR, set: "gunluk", world: "w1", label: "Mavi Saç Tokası", price: 40, color: "#70D6FF", shape: "hairbow" },

  { id: "face-backpack-badge", slot: SLOTS.FACE, set: "gunluk", world: "w1", label: "Gökkuşağı Çanta 🌈", price: 40, color: "#FFD166", shape: "backpack-badge" },

  // ============ DÜNYA 2: BÜYÜLÜ ORMAN (Peri & Sihir Seti) ============
  { id: "outfit-robe", slot: SLOTS.OUTFIT, set: "buyulu", world: "w2", label: "Işıltılı Peri Elbisesi", price: 100, color: "#B5838D" },
  { id: "outfit-robe-purple", slot: SLOTS.OUTFIT, set: "buyulu", world: "w2", label: "Sihirli Mor Elbise", price: 100, color: "#E0A3FF" },
  { id: "outfit-robe-emerald", slot: SLOTS.OUTFIT, set: "buyulu", world: "w2", label: "Orman Perisi Kostümü", price: 100, color: "#52E3C2" },

  { id: "shoes-cape-boots", slot: SLOTS.SHOES, set: "buyulu", world: "w2", label: "Simli Bale Babetleri", price: 60, color: "#FF9EAA" },

  { id: "headwear-wizardhat", slot: SLOTS.HEADWEAR, set: "buyulu", world: "w2", label: "Çiçekli Sihirli Şapka", price: 50, color: "#52E3C2", shape: "wizardhat" },
  { id: "headwear-wizardhat-teal", slot: SLOTS.HEADWEAR, set: "buyulu", world: "w2", label: "Lila Peri Şapkası", price: 50, color: "#B5838D", shape: "wizardhat" },
  { id: "headwear-wizardhat-red", slot: SLOTS.HEADWEAR, set: "buyulu", world: "w2", label: "Kırmızı Cadı Şapkası", price: 50, color: "#FF70A6", shape: "wizardhat" },
  { id: "headwear-flowercrown", slot: SLOTS.HEADWEAR, set: "buyulu", world: "w2", label: "Rengarenk Çiçek Tacı 🌸", price: 55, color: "#FF8FC7", shape: "flowercrown" },

  { id: "face-wand", slot: SLOTS.FACE, set: "buyulu", world: "w2", label: "Yıldızlı Sihir Değneği 🪄", price: 45, color: "#FFD166", shape: "wand" },

  // Efsanevi
  { id: "headwear-crown", slot: SLOTS.HEADWEAR, set: "prens", world: "w5", label: "Prenses Kristal Tacı 👑", price: 0, color: "#FFF275", shape: "crown", legendary: true, unlock: { type: "fullScore", subject: "any" } },

  // ============ DÜNYA 3: BİLİM LABORATUVARI (Tatlı Dedektif Seti) ============
  { id: "outfit-labcoat", slot: SLOTS.OUTFIT, set: "bilim", world: "w3", label: "Çilek Desenli Önlük", price: 100, color: "#52E3C2" },
  { id: "outfit-labcoat-blue", slot: SLOTS.OUTFIT, set: "bilim", world: "w3", label: "Açık Mavi Araştırmacı Elbisesi", price: 100, color: "#70D6FF" },

  { id: "face-glasses", slot: SLOTS.FACE, set: "bilim", world: "w3", label: "Pembe Çerçeveli Gözlük 👓", price: 45, color: "#FF70A6", shape: "glasses" },
  { id: "face-glasses-red", slot: SLOTS.FACE, set: "bilim", world: "w3", label: "Kalpli Kırmızı Gözlük", price: 45, color: "#FF477E", shape: "glasses" },
  { id: "face-magnifier", slot: SLOTS.FACE, set: "bilim", world: "w3", label: "Sihirli Büyüteç", price: 45, color: "#FFD166", shape: "magnifier" },

  { id: "headwear-detective-hat", slot: SLOTS.HEADWEAR, set: "bilim", world: "w3", label: "Fiyonklu Dedektif Şapkası", price: 50, color: "#B5838D", shape: "detective-hat" },

  // Efsanevi Kanatlar
  { id: "headwear-wings", slot: SLOTS.HEADWEAR, set: "buyulu", world: "w6", label: "Rengarenk Kelebek Kanatları 🦋", price: 0, color: "#70D6FF", shape: "wings", legendary: true, unlock: { type: "fullScore", subject: "Fen Bilimleri" } },

  // ============ DÜNYA 4: GÖKKUŞAĞI SAHİLİ (Denizkızı & Parti Seti) ============
  { id: "outfit-halloween", slot: SLOTS.OUTFIT, set: "deniz", world: "w4", label: "Denizkızı Kostümü 🧜‍♀️", price: 100, color: "#52E3C2" },
  { id: "outfit-christmas", slot: SLOTS.OUTFIT, set: "pijama", world: "w4", label: "Tavşanlı Pijama Takımı 🐰", price: 100, color: "#FF8FC7" },
  { id: "outfit-summer-dress", slot: SLOTS.OUTFIT, set: "gunluk", world: "w4", label: "Rengarenk Yaz Elbisesi", price: 100, color: "#FFD166" },

  { id: "shoes-sandals", slot: SLOTS.SHOES, set: "deniz", world: "w4", label: "Deniz Kabuklu Sandalet", price: 55, color: "#FFD166" },

  { id: "headwear-beanie", slot: SLOTS.HEADWEAR, set: "pijama", world: "w4", label: "Tavşanlı Uyku Bandı", price: 45, color: "#FF8FC7", shape: "beanie" },
  { id: "headwear-beanie-blue", slot: SLOTS.HEADWEAR, set: "pijama", world: "w4", label: "Pompomlu Bere", price: 45, color: "#70D6FF", shape: "beanie" },
  { id: "headwear-partyhat", slot: SLOTS.HEADWEAR, set: "prens", world: "w4", label: "Simli Parti Şapkası 🎉", price: 45, color: "#B5838D", shape: "partyhat" },

  { id: "face-sunglasses", slot: SLOTS.FACE, set: "deniz", world: "w4", label: "Pembe Güneş Gözlüğü 🕶️", price: 45, color: "#FF70A6", shape: "sunglasses" },

  // ============ DÜNYA 7: BULUTLARIN ÖTESİ (Gökyüzü & Melek) ============
  { id: "outfit-cloud-dress", slot: SLOTS.OUTFIT, set: "uzay", world: "w7", label: "Pofuduk Bulut Elbisesi ☁️", price: 140, color: "#70D6FF" },
  { id: "shoes-cloud", slot: SLOTS.SHOES, set: "uzay", world: "w7", label: "Tüy Gibi Bulut Terliği", price: 75, color: "#FFFFFF" },
  { id: "headwear-halo", slot: SLOTS.HEADWEAR, set: "uzay", world: "w7", label: "Işıltılı Yıldız Halesi ⭐", price: 80, color: "#FFF275", shape: "halo" },

  // ============ DÜNYA 9-12: KOZMİK KOLEKSİYON ============
  { id: "outfit-crystal-robe", slot: SLOTS.OUTFIT, set: "kozmik", world: "w9", label: "Kristal Balo Elbisesi 💎", price: 150, color: "#E0A3FF" },
  { id: "headwear-wizardhat-crystal", slot: SLOTS.HEADWEAR, set: "kozmik", world: "w9", label: "Kristal Prenses Şapkası", price: 90, color: "#E0A3FF", shape: "wizardhat" },

  { id: "outfit-galaxy-dress", slot: SLOTS.OUTFIT, set: "kozmik", world: "w10", label: "Galaksi Astronot Tulumu 🌌", price: 170, color: "#B5838D" },
  { id: "face-sunglasses-galaxy", slot: SLOTS.FACE, set: "kozmik", world: "w10", label: "Galaksi Gözlüğü", price: 90, color: "#B5838D", shape: "sunglasses" },

  { id: "outfit-gold-robe", slot: SLOTS.OUTFIT, set: "prens", world: "w11", label: "Altın Balo Cübbesi ✨", price: 220, color: "#FFD166" },
  { id: "headwear-crown-gold", slot: SLOTS.HEADWEAR, set: "prens", world: "w11", label: "Sonsuzluk Altın Tacı 👑", price: 320, color: "#FFD166", shape: "crown" },

  { id: "outfit-infinity-cape", slot: SLOTS.OUTFIT, set: "kozmik", world: "w12", label: "Sonsuzluk Kuşu Elbisesi 🦄", price: 260, color: "#FF70A6" },
  { id: "headwear-wings-infinity", slot: SLOTS.HEADWEAR, set: "kozmik", world: "w12", label: "Galaksi Peri Kanatları 🪽", price: 380, color: "#FF8FC7", shape: "wings" },
];

export const DEFAULT_AVATAR = {
  skin: "skin-1",
  hairStyle: "hair-space-buns",
  hairColor: "#FF9EAA",
  outfit: "outfit-tshirt",
  shoes: "shoes-sneaker",
  headwear: null,
  face: null,
};

export const STARTER_UNLOCKED = ITEMS.filter((i) => i.starter).map((i) => i.id);
