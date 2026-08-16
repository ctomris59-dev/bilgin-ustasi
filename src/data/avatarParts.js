// Katman sırası: skin(1) < outfit(2) < shoes(2.5) < hair(4) < headwear(5) < face(5.5)
// Her parça deterministik olarak kazanılır: coin ile satın alınır YA DA
// belirli bir dersten %100 alınca otomatik ve garanti olarak açılır (rastgele değildir).
//
// "shape" alanı: headwear/face parçaları render edilirken kullanılan çizim şekli.
// Aynı şekli farklı renklerde birden fazla ürün paylaşabilir (örn. 3 farklı renk kep) -
// bu sayede yeni renk varyantı eklemek sadece veri eklemek demektir, çizim kodu gerekmez.
// outfit/shoes zaten jenerik şekillerle çizildiği için "shape" alanına ihtiyaç duymaz.

export const SETS = {
  gunluk: { id: "gunluk", label: "Okul / Günlük Set", color: "#7d6bd6" },
  buyulu: { id: "buyulu", label: "Fantastik / Büyülü Set", color: "#e8b84b" },
  bilim: { id: "bilim", label: "Bilim / Dedektif Set", color: "#2fa88c" },
  mevsim: { id: "mevsim", label: "Mevsimlik / Özel Gün Seti", color: "#f2765a" },
  gokyuzu: { id: "gokyuzu", label: "Gökyüzü Seti", color: "#a9c8ff" },
  kozmik: { id: "kozmik", label: "Kozmik Koleksiyon", color: "#6b5fc9" },
};

export const SLOTS = {
  SKIN: "skin",
  HAIR: "hair",
  OUTFIT: "outfit",
  SHOES: "shoes",
  HEADWEAR: "headwear",
  FACE: "face", // gözlük vb.
};

// Ten tonları - bunlar ücretsiz, sadece görünüm tercihi
export const SKIN_TONES = [
  { id: "skin-1", hex: "#ffe0c2" },
  { id: "skin-2", hex: "#f2c399" },
  { id: "skin-3", hex: "#c98a5c" },
  { id: "skin-4", hex: "#8a5636" },
];

export const HAIR_STYLES = [
  { id: "hair-bob", label: "Kısa Kesim" },
  { id: "hair-long", label: "Uzun Saç" },
  { id: "hair-pony", label: "Atkuyruğu" },
  { id: "hair-curly", label: "Bukleli" },
];

export const HAIR_COLORS = ["#3a2a1e", "#6b4226", "#000000", "#a83232", "#d6a944", "#7d6bd6", "#ff8fc7", "#4fc3f7"];

export const ITEMS = [
  // ============ DÜNYA 1: BAŞLANGIÇ KÖYÜ (Okul / Günlük Set) ============
  { id: "outfit-tshirt", slot: SLOTS.OUTFIT, set: "gunluk", world: "w1", label: "Mor Tişört", price: 90, color: "#7d6bd6", starter: true },
  { id: "outfit-tshirt-red", slot: SLOTS.OUTFIT, set: "gunluk", world: "w1", label: "Kırmızı Tişört", price: 90, color: "#ff6f61" },
  { id: "outfit-tshirt-yellow", slot: SLOTS.OUTFIT, set: "gunluk", world: "w1", label: "Sarı Tişört", price: 90, color: "#ffc93c" },
  { id: "outfit-tshirt-green", slot: SLOTS.OUTFIT, set: "gunluk", world: "w1", label: "Yeşil Tişört", price: 90, color: "#45d6b5" },
  { id: "outfit-overalls", slot: SLOTS.OUTFIT, set: "gunluk", world: "w1", label: "Salopet", price: 110, color: "#4fc3f7" },

  { id: "shoes-sneaker", slot: SLOTS.SHOES, set: "gunluk", world: "w1", label: "Mor Spor Ayakkabı", price: 55, color: "#4a3f6b", starter: true },
  { id: "shoes-sneaker-red", slot: SLOTS.SHOES, set: "gunluk", world: "w1", label: "Kırmızı Spor Ayakkabı", price: 55, color: "#ff6f61" },
  { id: "shoes-sneaker-pink", slot: SLOTS.SHOES, set: "gunluk", world: "w1", label: "Pembe Spor Ayakkabı", price: 55, color: "#ff8fc7" },

  { id: "headwear-cap", slot: SLOTS.HEADWEAR, set: "gunluk", world: "w1", label: "Mor Kep", price: 45, color: "#5b4a99", shape: "cap" },
  { id: "headwear-cap-red", slot: SLOTS.HEADWEAR, set: "gunluk", world: "w1", label: "Kırmızı Kep", price: 45, color: "#ff6f61", shape: "cap" },
  { id: "headwear-cap-yellow", slot: SLOTS.HEADWEAR, set: "gunluk", world: "w1", label: "Sarı Kep", price: 45, color: "#ffc93c", shape: "cap" },
  { id: "headwear-hairbow-pink", slot: SLOTS.HEADWEAR, set: "gunluk", world: "w1", label: "Pembe Saç Fiyonku", price: 40, color: "#ff8fc7", shape: "hairbow" },
  { id: "headwear-hairbow-blue", slot: SLOTS.HEADWEAR, set: "gunluk", world: "w1", label: "Mavi Saç Fiyonku", price: 40, color: "#4fc3f7", shape: "hairbow" },

  { id: "face-backpack-badge", slot: SLOTS.FACE, set: "gunluk", world: "w1", label: "Sırt Çantası Rozeti", price: 40, color: "#5b4a99", shape: "backpack-badge" },

  // ============ DÜNYA 2: BÜYÜLÜ ORMAN (Fantastik / Büyülü Set) ============
  { id: "outfit-robe", slot: SLOTS.OUTFIT, set: "buyulu", world: "w2", label: "Lacivert Büyücü Cübbesi", price: 100, color: "#3b2f6b" },
  { id: "outfit-robe-purple", slot: SLOTS.OUTFIT, set: "buyulu", world: "w2", label: "Mor Büyücü Cübbesi", price: 100, color: "#8c6fff" },
  { id: "outfit-robe-emerald", slot: SLOTS.OUTFIT, set: "buyulu", world: "w2", label: "Zümrüt Büyücü Cübbesi", price: 100, color: "#2f9e73" },

  { id: "shoes-cape-boots", slot: SLOTS.SHOES, set: "buyulu", world: "w2", label: "Pelerin Botları", price: 60, color: "#2c2450" },

  { id: "headwear-wizardhat", slot: SLOTS.HEADWEAR, set: "buyulu", world: "w2", label: "Lacivert Büyücü Şapkası", price: 50, color: "#3b2f6b", shape: "wizardhat" },
  { id: "headwear-wizardhat-teal", slot: SLOTS.HEADWEAR, set: "buyulu", world: "w2", label: "Nane Yeşili Büyücü Şapkası", price: 50, color: "#2f9e73", shape: "wizardhat" },
  { id: "headwear-wizardhat-red", slot: SLOTS.HEADWEAR, set: "buyulu", world: "w2", label: "Kırmızı Büyücü Şapkası", price: 50, color: "#c94f4f", shape: "wizardhat" },
  { id: "headwear-flowercrown", slot: SLOTS.HEADWEAR, set: "buyulu", world: "w2", label: "Çiçek Taç", price: 55, color: "#ff8fc7", shape: "flowercrown" },

  { id: "face-wand", slot: SLOTS.FACE, set: "buyulu", world: "w2", label: "Sihirli Değnek", price: 45, color: "#e8b84b", shape: "wand" },

  // Efsanevi (nadir) - sadece %100 tam puanla kazanılır, coin ile ALINAMAZ. Dünya 5'in ödülü.
  { id: "headwear-crown", slot: SLOTS.HEADWEAR, set: "buyulu", world: "w5", label: "Işıltılı Taç", price: 0, color: "#f6d778", shape: "crown", legendary: true, unlock: { type: "fullScore", subject: "any" } },

  // ============ DÜNYA 3: BİLİM LABORATUVARI (Bilim / Dedektif Set) ============
  { id: "outfit-labcoat", slot: SLOTS.OUTFIT, set: "bilim", world: "w3", label: "Beyaz Laboratuvar Önlüğü", price: 100, color: "#eef3f0" },
  { id: "outfit-labcoat-blue", slot: SLOTS.OUTFIT, set: "bilim", world: "w3", label: "Mavi Laboratuvar Önlüğü", price: 100, color: "#bfe3f7" },

  { id: "face-glasses", slot: SLOTS.FACE, set: "bilim", world: "w3", label: "Koyu Profesör Gözlüğü", price: 45, color: "#2c2440", shape: "glasses" },
  { id: "face-glasses-red", slot: SLOTS.FACE, set: "bilim", world: "w3", label: "Kırmızı Çerçeveli Gözlük", price: 45, color: "#c94f4f", shape: "glasses" },
  { id: "face-magnifier", slot: SLOTS.FACE, set: "bilim", world: "w3", label: "Büyüteç", price: 45, color: "#c9a227", shape: "magnifier" },

  { id: "headwear-detective-hat", slot: SLOTS.HEADWEAR, set: "bilim", world: "w3", label: "Dedektif Şapkası", price: 50, color: "#8a6b3f", shape: "detective-hat" },

  // Fen Bilimleri'nden %100 alınca garanti açılır. Dünya 6'nın ödülü.
  { id: "headwear-wings", slot: SLOTS.HEADWEAR, set: "bilim", world: "w6", label: "Işıltılı Kanatlar", price: 0, color: "#bfe9dc", shape: "wings", legendary: true, unlock: { type: "fullScore", subject: "Fen Bilimleri" } },

  // ============ DÜNYA 4: GÖKKUŞAĞI SAHİLİ (Mevsimlik / Özel Gün) ============
  { id: "outfit-halloween", slot: SLOTS.OUTFIT, set: "mevsim", world: "w4", label: "Cadılar Bayramı Kostümü", price: 100, color: "#f2765a" },
  { id: "outfit-christmas", slot: SLOTS.OUTFIT, set: "mevsim", world: "w4", label: "Yılbaşı Kazağı", price: 100, color: "#c94f4f" },
  { id: "outfit-summer-dress", slot: SLOTS.OUTFIT, set: "mevsim", world: "w4", label: "Yaz Elbisesi", price: 100, color: "#ffc93c" },

  { id: "shoes-sandals", slot: SLOTS.SHOES, set: "mevsim", world: "w4", label: "Yaz Sandaleti", price: 55, color: "#ffc93c" },

  { id: "headwear-beanie", slot: SLOTS.HEADWEAR, set: "mevsim", world: "w4", label: "Pembe Kışlık Bere", price: 45, color: "#ff8fc7", shape: "beanie" },
  { id: "headwear-beanie-blue", slot: SLOTS.HEADWEAR, set: "mevsim", world: "w4", label: "Mavi Kışlık Bere", price: 45, color: "#4fc3f7", shape: "beanie" },
  { id: "headwear-partyhat", slot: SLOTS.HEADWEAR, set: "mevsim", world: "w4", label: "Doğum Günü Şapkası", price: 45, color: "#8c6fff", shape: "partyhat" },

  { id: "face-sunglasses", slot: SLOTS.FACE, set: "mevsim", world: "w4", label: "Güneş Gözlüğü", price: 45, color: "#3a3153", shape: "sunglasses" },

  // ============ DÜNYA 7: BULUTLARIN ÖTESİ (Gökyüzü Seti) ============
  { id: "outfit-cloud-dress", slot: SLOTS.OUTFIT, set: "gokyuzu", world: "w7", label: "Bulut Elbisesi", price: 140, color: "#eaf6ff" },
  { id: "shoes-cloud", slot: SLOTS.SHOES, set: "gokyuzu", world: "w7", label: "Bulut Terlik", price: 75, color: "#eaf6ff" },
  { id: "headwear-halo", slot: SLOTS.HEADWEAR, set: "gokyuzu", world: "w7", label: "Işık Halesi", price: 80, color: "#fff6cf", shape: "halo" },

  // ============ DÜNYA 9-12: KOZMİK KOLEKSİYON ============
  { id: "outfit-crystal-robe", slot: SLOTS.OUTFIT, set: "kozmik", world: "w9", label: "Kristal Cübbe", price: 150, color: "#c9a8ff" },
  { id: "headwear-wizardhat-crystal", slot: SLOTS.HEADWEAR, set: "kozmik", world: "w9", label: "Kristal Büyücü Şapkası", price: 90, color: "#c9a8ff", shape: "wizardhat" },

  { id: "outfit-galaxy-dress", slot: SLOTS.OUTFIT, set: "kozmik", world: "w10", label: "Gökada Elbisesi", price: 170, color: "#6b5fc9" },
  { id: "face-sunglasses-galaxy", slot: SLOTS.FACE, set: "kozmik", world: "w10", label: "Gökada Gözlüğü", price: 90, color: "#6b5fc9", shape: "sunglasses" },

  { id: "outfit-gold-robe", slot: SLOTS.OUTFIT, set: "kozmik", world: "w11", label: "Altın Cübbe", price: 220, color: "#e8b84b" },
  { id: "headwear-crown-gold", slot: SLOTS.HEADWEAR, set: "kozmik", world: "w11", label: "Altın Taç", price: 320, color: "#e8b84b", shape: "crown" },

  { id: "outfit-infinity-cape", slot: SLOTS.OUTFIT, set: "kozmik", world: "w12", label: "Sonsuzluk Pelerini", price: 260, color: "#3a3153" },
  { id: "headwear-wings-infinity", slot: SLOTS.HEADWEAR, set: "kozmik", world: "w12", label: "Sonsuzluk Kanatları", price: 380, color: "#ff8fc7", shape: "wings" },
];

export const DEFAULT_AVATAR = {
  skin: "skin-2",
  hairStyle: "hair-bob",
  hairColor: "#3a2a1e",
  outfit: "outfit-tshirt",
  shoes: "shoes-sneaker",
  headwear: null,
  face: null,
};

export const STARTER_UNLOCKED = ITEMS.filter((i) => i.starter).map((i) => i.id);
