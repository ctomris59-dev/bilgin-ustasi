export const PET_SLOTS = { SPECIES: "petSpecies", ACCESSORY: "petAccessory" };
export const ROOM_SLOTS = { WALLPAPER: "wallpaper", RUG: "rug", DESK: "desk", LAMP: "lamp", PLANT: "plant", POSTER: "poster" };

export const PETS = [
  { id: "pet-cat-orange", slot: PET_SLOTS.SPECIES, world: "w1", label: "Pamuk Kedi 🐱", price: 160, color: "#FF9EAA", type: "cat" },
  { id: "pet-cat-gray", slot: PET_SLOTS.SPECIES, world: "w1", label: "Gri Kedi 🐱", price: 160, color: "#B5838D", type: "cat" },
  { id: "pet-dog-brown", slot: PET_SLOTS.SPECIES, world: "w2", label: "Şeker Köpek 🐶", price: 160, color: "#FFD166", type: "dog" },
  { id: "pet-dog-white", slot: PET_SLOTS.SPECIES, world: "w2", label: "Pofuduk Tavşan 🐰", price: 160, color: "#FFFFFF", type: "dog" },
  { id: "pet-owl-purple", slot: PET_SLOTS.SPECIES, world: "w3", label: "Sevimli Baykuş 🦉", price: 160, color: "#52E3C2", type: "owl" },
  { id: "pet-owl-teal", slot: PET_SLOTS.SPECIES, world: "w3", label: "Uykucu Panda 🐼", price: 160, color: "#70D6FF", type: "owl" },
  { id: "pet-phoenix", slot: PET_SLOTS.SPECIES, world: "w10", label: "Sihirli Unikorn 🦄", price: 260, color: "#E0A3FF", type: "dragon" },
  // Efsanevi
  { id: "pet-dragon", slot: PET_SLOTS.SPECIES, world: "w6", label: "Bebek Ejderha 🐉", price: 0, color: "#52E3C2", type: "dragon", legendary: true, unlock: { type: "fullScore", subject: "Fen Bilimleri" } },
];

export const PET_ACCESSORIES = [
  { id: "pet-collar", slot: PET_SLOTS.ACCESSORY, world: "w1", label: "Pembe Kalpli Tasma", price: 35, color: "#FF70A6" },
  { id: "pet-collar-blue", slot: PET_SLOTS.ACCESSORY, world: "w1", label: "Mavi Tasma", price: 35, color: "#70D6FF" },
  { id: "pet-bow", slot: PET_SLOTS.ACCESSORY, world: "w1", label: "Simli Altın Fiyonk 🎀", price: 35, color: "#FFD166" },
  { id: "pet-scarf", slot: PET_SLOTS.ACCESSORY, world: "w2", label: "Çiçekli Mini Atkı", price: 35, color: "#52E3C2" },
];

export const ROOM_ITEMS = [
  { id: "wallpaper-stars", slot: ROOM_SLOTS.WALLPAPER, world: "w2", label: "Pembe Yıldızlı Duvar Kağıdı", price: 80, color: "#FF9EAA" },
  { id: "wallpaper-forest", slot: ROOM_SLOTS.WALLPAPER, world: "w2", label: "Sihirli Orman Duvar Kağıdı", price: 80, color: "#52E3C2" },
  { id: "wallpaper-candy", slot: ROOM_SLOTS.WALLPAPER, world: "w1", label: "Pamuk Şeker Bulutları ☁️", price: 80, color: "#70D6FF" },
  { id: "wallpaper-sunny", slot: ROOM_SLOTS.WALLPAPER, world: "w4", label: "Güneşli Sarı Duvar Kağıdı", price: 80, color: "#FFD166" },

  { id: "rug-round", slot: ROOM_SLOTS.RUG, world: "w1", label: "Papatya Halı 🌼", price: 60, color: "#FFD166" },
  { id: "rug-striped", slot: ROOM_SLOTS.RUG, world: "w4", label: "Büyük Kalp Halı 💖", price: 60, color: "#FF70A6" },
  { id: "rug-mint", slot: ROOM_SLOTS.RUG, world: "w3", label: "Pofuduk Bulut Halı ☁️", price: 60, color: "#70D6FF" },

  { id: "desk-wood", slot: ROOM_SLOTS.DESK, world: "w1", label: "Aynalı Pembe Masa", price: 100, color: "#FF9EAA" },
  { id: "desk-white", slot: ROOM_SLOTS.DESK, world: "w3", label: "Lavanta Çalışma Masası", price: 100, color: "#B5838D" },
  { id: "desk-pink", slot: ROOM_SLOTS.DESK, world: "w4", label: "Nane Yeşili Masa", price: 100, color: "#52E3C2" },

  { id: "lamp-star", slot: ROOM_SLOTS.LAMP, world: "w2", label: "Yıldızlı Gece Lambası ⭐", price: 50, color: "#FFF275" },
  { id: "lamp-moon", slot: ROOM_SLOTS.LAMP, world: "w5", label: "Pembe Ay Lambader 🌙", price: 50, color: "#FF9EAA" },

  { id: "plant-cactus", slot: ROOM_SLOTS.PLANT, world: "w4", label: "Saksı Kaktüs", price: 45, color: "#52E3C2" },
  { id: "plant-flower", slot: ROOM_SLOTS.PLANT, world: "w2", label: "Renkli Çiçekli Saksı 🌸", price: 45, color: "#FF8FC7" },

  { id: "poster-stars", slot: ROOM_SLOTS.POSTER, world: "w7", label: "Sihirli Yıldız Posteri", price: 55, color: "#B5838D" },
  { id: "poster-rainbow", slot: ROOM_SLOTS.POSTER, world: "w4", label: "Gökkuşağı Posteri 🌈", price: 55, color: "#FF70A6" },
  { id: "wallpaper-galaxy", slot: ROOM_SLOTS.WALLPAPER, world: "w10", label: "Gökada Duvar Kağıdı 🌌", price: 110, color: "#B5838D" },
  { id: "rug-gold", slot: ROOM_SLOTS.RUG, world: "w11", label: "Altın Simli Halı ✨", price: 130, color: "#FFD166" },
];

export const DEFAULT_PET_STATE = { activeSpecies: null, accessory: null };
export const DEFAULT_ROOM_STATE = { wallpaper: null, rug: null, desk: null, lamp: null, plant: null, poster: null };

export const ALL_PET_ROOM_ITEMS = [...PETS, ...PET_ACCESSORIES, ...ROOM_ITEMS];
